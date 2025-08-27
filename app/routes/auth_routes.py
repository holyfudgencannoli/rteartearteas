from flask import request, jsonify, session, Blueprint, current_app, abort
from datetime import timedelta
from ..db import db_session, Base, engine
from ..models import ReceiptDataObject, Receipt, User, Store, ACCOUNT_ID, BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY
import bcrypt
from functools import wraps
from flask_login import login_user, login_required, current_user, logout_user
import boto3

s3_client = boto3.client(
    "s3",
    endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name="auto",
)



auth_bp = Blueprint('auth', __name__)
admin_bp = Blueprint('admin', __name__)

def hash_password(plain_password: str) -> bytes:
    # bcrypt requires bytes
    plain_bytes = plain_password.encode('utf-8')
    # generate salt and hash
    salt = bcrypt.gensalt(rounds=12)  # cost factor, 12 is a good balance
    hashed = bcrypt.hashpw(plain_bytes, salt)
    return hashed

def verify_password(plain_password: str, hashed: bytes) -> bool:
    plain_bytes = plain_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed)



@auth_bp.route("/register", methods=["POST"])
def register():
    print("SESSION CONTENT:", dict(session))
    data = request.form
    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    isAdmin = data.get('is_admin')

    if isAdmin == 'admin123':
        is_admin = True
    else:
        is_admin = False

    hashed_pw = hash_password(str(password))

    already_there = db_session.query(User).filter(User.username==username).first()

    if not already_there:
        user = User(
            username=username,
            email=email,
            is_admin=is_admin,
            phone=phone,
            password_hash=hashed_pw,
            provider="local"
        )

        db_session.add(user)
        db_session.commit()

        return jsonify({"message": "User registered"}), 201
    else:
        pass
        return jsonify({'message': 'User already registered'}), 409

@auth_bp.route('/login', methods=['POST'])
def login():
    print("SESSION CONTENT:", dict(session))


    data = request.form

    username = str(data.get('username'))
    password = str(data.get('password'))

    user = db_session.query(User).filter(User.username==username).first()
    user_id = user.id
    pw_hash = bytes(user.password_hash)

     

    if verify_password(password, pw_hash):
        login_user(user, remember=True)
        session["is_admin"] = user.is_admin
        session.permanent = True
        current_app.permanent_session_lifetime = timedelta(days=5)

        print(f"User ID: {user.id:03d}")
        print("SESSION CONTENT:", dict(session))
        return jsonify({
            'success': True,
            'user_id': current_user.get_id(),
            'is_admin': current_user.is_admin
        })
    else:
        return jsonify({'success': False}), 401

    

@auth_bp.route("/logout", methods=["POST"])
def logout():
    print("SESSION CONTENT BEFORE LOGOUT:", dict(session))

    logout_user()

    session.pop("is_admin", None)


    print("SESSION CONTENT AFTER LOGOUT:", dict(session))
    return jsonify({"success": True})


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("is_admin"):
            return abort(403)
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route("delete-db", methods=["POST"])
@admin_required
def delete_db():
    print("SESSION CONTENT:", dict(session))

    Base.metadata.drop_all(bind=engine) 
    Base.metadata.create_all(bind=engine)
    return jsonify({"message": "Database reset"})

@admin_bp.route("delete-users", methods=["POST"])
@admin_required
def delete_users():
    print("SESSION CONTENT:", dict(session))

    User.__table__.drop(bind=engine)
    Base.metadata.create_all(bind=engine)
    return jsonify({"message": "Users Deleted"})

@admin_bp.route("delete-receipts", methods=["POST"])
@admin_required
def delete_receipts():
    print("SESSION CONTENT:", dict(session))

    try:
        user_receipts = db_session.query(ReceiptDataObject).filter_by(user_id=current_user.id).all()

        if not user_receipts:
            return jsonify({"message": "No receipts found for this user"}), 200

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

        Receipt.__table__.drop(bind=engine)
        ReceiptDataObject.__table__.drop(bind=engine)
        Base.metadata.create_all(bind=engine)
        
        
        return jsonify({
            "message": "User receipts deleted",
            "deleted_files": deleted_files,
            "failed_files": failed_files
        })
    except Exception as e:
        print("Failed to delete:", e)
        return jsonify({'message': 'Error deleting receipts'})
    
@admin_bp.route("delete-stores", methods=["POST"])
@admin_required
def delete_stores():
    print("SESSION CONTENT:", dict(session))

    Store.__table__.drop(bind=engine)
    Base.metadata.create_all(bind=engine)
    return jsonify({"message": "Stores Deleted"})
