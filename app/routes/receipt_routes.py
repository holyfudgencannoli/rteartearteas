from flask import Blueprint, jsonify, request, session
from datetime import datetime
from ..db import db_session
# from ..models import Account, Transaction, Receipt, ReceiptDataObject
from ..models import ReceiptDataObject, Receipt, User, ACCOUNT_ID, BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY
import os
import mimetypes
import boto3
from werkzeug.utils import secure_filename
from flask_login import current_user, login_required


receipts_bp = Blueprint('receipts', __name__)


s3_client = boto3.client(
    "s3",
    endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name="auto",
)



@receipts_bp.route('/upload-receipt-route', methods=['POST'])
@login_required
def UploadReceipt():
    print("SESSION CONTENT:", dict(session))
    print("Current user:", current_user.id)
    

    data = request.form

    # user_id = int(session['user_id'])
    # datetime_str = data.get('datetime')
    # try:
    #     dt_obj = datetime.fromisoformat(datetime_str)
    # except (TypeError, ValueError):
    #     return jsonify({'error': 'Invalid datetime format'}), 400

    new_receipt_data = ReceiptDataObject(
        user_id = current_user.id,
        store_name=data.get('store_name'),
        datetime=data.get('datetime'),
        total=data.get('total'),
        store_location=data.get('store_location'),
        payment_type=data.get('payment_type'),
        description=data.get('description'),
        category=data.get('category'),
        receipt_path=None
    )
    db_session.add(new_receipt_data)
    db_session.flush()


    file = request.files.get('file')
    if file:
        if not file.filename.lower().endswith(('.png', '.jpeg', '.jpg', '.pdf')):
            return jsonify({'error': 'File must be PNG, JPEG, or PDF'}), 400
        ext = os.path.splitext(file.filename)[1].lower()
        filename = secure_filename(f"{new_receipt_data.store_name}_{new_receipt_data.id:012d}{ext}")
        s3_client.upload_fileobj(file, BUCKET_NAME, filename, ExtraArgs={"ContentType": file.content_type})
        new_receipt_data.receipt_path = f"https://pub-5e2654328dae426aabf34b43ee64ac99.r2.dev/{filename}"
        print(ext)

        new_receipt = Receipt(
            receipt_id = new_receipt_data.id,
            filename = filename,
            content_type=ext,

        )
        db_session.add(new_receipt)

    db_session.commit()
    return jsonify({'message': 'Receipt uploaded successfully', 'url': new_receipt_data.receipt_path}), 201

@receipts_bp.route('/receipts-archive', methods=['GET'])
def ReceiptsArchiveAccess():
    print("SESSION CONTENT:", dict(session))
    if session['_id']:
        user_id = session['_user_id']
        print(user_id)

        receipt_data_objects = db_session.query(ReceiptDataObject).filter(ReceiptDataObject.user_id == current_user.id).all()

        receipt_data_objects_serialized = [r.to_dict() for r in receipt_data_objects]

        return jsonify({'receipt_data_objects': receipt_data_objects_serialized})
    else:
        return jsonify({'receipt_data_objects': None})
    

@receipts_bp.route("delete-receipts", methods=["POST"])
def delete_receipts():
    print("SESSION CONTENT:", dict(session))

    load_user(session['_user_id'])

    try:
        user_receipts = db_session.query(ReceiptDataObject).filter_by(user_id=current_user.id).all()

        if not user_receipts:
            return jsonify({"message": "No receipts found for this user"}), 404

        deleted_files = []
        failed_files = []

        for rdo in user_receipts:
            # Delete file from R2 bucket
            try:
                if rdo.receipt:
                    s3_client.delete_object(Bucket=BUCKET_NAME, Key=rdo.receipt.filename)
                    deleted_files.append(rdo.receipt.filename)
            except Exception as e:
                print(f"Failed to delete {rdo.receipt.filename}: {e}")
                failed_files.append(rdo.receipt.filename)

            # Delete DB records
            if rdo.receipt:
                db_session.delete(rdo.receipt)
            db_session.delete(rdo)

        db_session.commit()

        return jsonify({
            "message": "User receipts deleted",
            "deleted_files": deleted_files,
            "failed_files": failed_files
        })
    except Exception as e:
        print("Failed to delete:", e)
        return jsonify({'message': 'Error deleting users'})
