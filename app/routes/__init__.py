# from flask import Blueprint, jsonify, request, send_file, send_from_directory, current_app, redirect, url_for
# from datetime import datetime
# from app.db import db_session
# from app.models import Account, Transaction, Receipt
# from sqlalchemy.orm import declarative_base
# import pandas as pd
# from io import BytesIO
# from werkzeug.utils import secure_filename
# import os
# import mimetypes
# import base64
# from ollama_ocr import OCRProcessor
# import requests
# import re
# import json





# app_bp = Blueprint('app', __name__)

# @app_bp.route('/')
# def homePage():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/transactions')
# def refresh1():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/add-an-entry')
# def refresh2():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/upload-receipt')
# def refresh3():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/finalize-receipt')
# def refresh4():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/add-account')
# def refresh5():
#     return send_from_directory(current_app.static_folder, "index.html")
 
# @app_bp.route('/account-ledger')
# def refresh6():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/coa')
# def refresh7():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/invoices')
# def refresh8():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/transaction/:transaction_id')
# def refresh9():
#     return send_from_directory(current_app.static_folder, "index.html")

# @app_bp.route('/signup')
# def refresh10():
#     return send_from_directory(current_app.static_folder, "index.html")


# main_bp = Blueprint('main', __name__)

# OLLAMA_HOST = "http://localhost:11434"
# MODEL_NAME = "llama3.2-vision:latest"


# ocr = OCRProcessor(model_name=MODEL_NAME)

# UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# def check_ollama_running():
#     """Check if Ollama API is reachable."""
#     try:
#         res = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=3)
#         if res.status_code == 200:
#             return True, res.json()
#         return False, None
#     except requests.exceptions.RequestException:
#         return False, None

# def check_model_available(model_list, model_name):
#     """Check if the model exists in the Ollama instance."""
#     for m in model_list.get("models", []):
#         if m.get("name") == model_name:
#             return True
#     return False

# @main_bp.route("/ocr", methods=["POST"])
# def run_ocr():
#     # Check Ollama server
#     running, model_list = check_ollama_running()
#     if not running:
#         return jsonify({"error": "Ollama API not reachable. Is it running on port 11434?"}), 503

#     # Check model availability
#     if not check_model_available(model_list, MODEL_NAME):
#         return jsonify({"error": f"Model '{MODEL_NAME}' not found. Run: ollama pull {MODEL_NAME}"}), 400

#     # Validate file
#     if "receipt" not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400
    
#     file = request.files["receipt"]
#     file_path = os.path.join(UPLOAD_FOLDER, file.filename)
#     file.save(file_path)

#     try:
#         # Create OCR processor here to avoid init errors if Ollama isn't ready
#         ocr = OCRProcessor(model_name=MODEL_NAME)

#         # Run OCR
#         raw_text = ocr.process_image(
#             image_path=file_path,
#             format_type="plain_text",
#             custom_prompt='''Extract receipt data and output ONLY valid JSON. 
#             Do NOT include any extra text. Use this structure:

#             {
#             "store": "<store name>",
#             "date": "<MM/DD/YYYY>",
#             "time": "<HH:MM AM/PM>",
#             "items": [
#                 { "name": "<item name>", "price": "<$amount>" }
#             ],
#             "total": "<$amount>",
#             "payment": "<Cash/Credit/etc>"
#             }

#             Always follow this structure exactly, even if some fields are empty.

            
#             '''
#         )
#         print(raw_text)

#         match = re.search(r'(\{[\s\S]*\})', raw_text)
#         if match:
#             json_string = match.group(0)
#             data = json.loads(json_string)
#             print("Parsed JSON:", data)
#         else:
#             print("No JSON found in string")
#             data = {}

#         os.remove(file_path)
#         return jsonify({"data": data})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
        
# @main_bp.route('/name', methods=['GET'])
# def home():
#     return jsonify({'message': 'Budgeter'})

# # @main_bp.route('/entry/new-entry', methods=['POST'])
# # def newEntry():
# #     db_session = SessionLocal()
# #     data = request.form

# #     return data

# @main_bp.route('/transaction/new-transaction', methods=['POST'])
# def newTxn():
#     data = request.form

#     date = datetime.strptime(data.get('date'), '%Y-%m-%d')
#     description = data.get('description')
#     amount = data.get('amount')
#     txn_type = data.get('txn_type')
#     account_id = data.get('account_id')
#     entry_id = data.get('entry_id')

    

#     new_txn = Transaction(
#         date=date,
#         description=description,
#         amount=amount,
#         txn_type=txn_type,
#         account_id=account_id,
#         entry_id=entry_id
#     )


#     account = db_session.query(Account).filter(Account.account_id==account_id).first()

#     if (txn_type.lower() == 'debit'):
#         new_txn.debit(account)
#     else:
#         new_txn.credit(account)


#     db_session.add(new_txn)
#     db_session.commit() 

#     print(new_txn)
#     # print(account.balance)

#     db_session.close()

#     if request.method == 'POST':
#         return jsonify({"success": True})  # no redirect!
#     else:
#         return jsonify({"success": False}), 401
    
        

# @main_bp.route('/account/new-account', methods=['POST'])
# def newAccount():
#     data = request.form

#     code = data.get('code')
#     name = data.get('name')
#     account_type = data.get('account_type')
#     balance = data.get('balance')

#     new_account = Account(
#         code = code,
#         name = name,
#         account_type = account_type,
#         balance = balance
#     )

#     db_session.add(new_account)
#     db_session.commit()

#     db_session.close()






#     if request.method == 'POST':
#         return jsonify({"success": True})  # no redirect!
#     else:
#         return jsonify({"success": False}), 401
    
# @main_bp.route('/account/coa', methods=['GET'])
# def ChartOfAccounts():
#     accounts = db_session.query(Account).all()

#     for a in accounts:
#         print(a)

#     accounts_serialized = [a.to_dict() for a in accounts]

#     return jsonify({'accounts': accounts_serialized})


  
# @main_bp.route('/transaction/cot', methods=['GET'])
# def ChartOfTransactions():
#     transactions = db_session.query(Transaction).all()

#     for t in transactions:
#         print(t)

#     transactions_serialized = [t.to_dict() for t in transactions]

#     return jsonify({'transactions': transactions_serialized})

# @main_bp.route('/transaction/<int:transaction_id>', methods=['GET'])
# def txn_detail(transaction_id):
#     txn = db_session.query(Transaction).filter_by(transaction_id=transaction_id).first()
#     if not txn:
#         return jsonify({"error": "Transaction not found"}), 404
#     if txn.receipt:
#         receipt = db_session.query(Receipt).filter_by(transaction_id=transaction_id).first()

#     txn_dict = txn.to_dict()
    

#     return jsonify(txn_dict)

# @main_bp.route('/account/select', methods=['GET'])
# def SelectAccount():
#     accounts = db_session.query(Account).all()

#     for a in accounts:
#         print(a)

#     accounts_serialized = [a.to_dict() for a in accounts]

#     return jsonify({'accounts': accounts_serialized})

# # backend/routes/export_excel.py

# @main_bp.route('/transaction/select', methods=['GET'])
# def SelectTransaction():
#     transactions = db_session.query(Transaction).all()

#     for t in transactions:
#         print(t)

#     transactions_serialized = [t.to_dict() for t in transactions]

#     return jsonify({'transactions': transactions_serialized})



# @main_bp.route('/attach-receipt', methods=['POST'])
# def attach_receipt():
#     file = request.files.get('file')
#     transaction_id = request.form.get('transaction_id')

#     if not file or not transaction_id:
#         return jsonify({"success": False, "error": "Missing file or transaction_id"}), 400

#     # Define the directory where receipts are stored (configured in your app)
#     from config import RECEIPTS_DIR

#     # Ensure the receipts directory exists
#     os.makedirs(RECEIPTS_DIR, exist_ok=True)

#     # Generate a unique filename to avoid collisions (optional but recommended)
#     filename = file.filename
#     # Optionally add timestamp or UUID to filename here
#     # from uuid import uuid4
#     # filename = f"{uuid4().hex}_{filename}"

#     # Save file to filesystem
#     file_path = os.path.join(RECEIPTS_DIR, filename)
#     file.save(file_path)

#     # Create the DB entry without storing binary data
#     new_receipt = Receipt(
#         filename=filename,
#         content_type=file.content_type,
#         transaction_id=transaction_id
#     )

#     db_session.add(new_receipt)
#     db_session.commit()

#     # Do NOT close the session here if you still need it elsewhere

#     return jsonify({"success": True, "filename": filename})


    
# @main_bp.route('/export-transactions', methods=['GET'])
# def export_transactions():
#     transactions = db_session.query(Transaction).all()
#     data = [
#         {
#             'Transaction ID': t.transaction_id,
#             'Date': t.date.isoformat(),
#             'Description': t.description,
#             'Amount': t.amount,
#             'Type': t.txn_type,
#             'Account ID': t.account_id,
#             'Entry ID': t.entry_id
#         }
#         for t in transactions
#     ]

#     df = pd.DataFrame(data)
#     output = BytesIO()
#     with pd.ExcelWriter(output, engine='openpyxl') as writer:
#         df.to_excel(writer, index=False, sheet_name='Transactions')

#     output.seek(0)
#     return send_file(
#         output,
#         download_name='transactions.xlsx',
#         as_attachment=True,
#         mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#     )


# # backend/routes/import_excel.py



# REQUIRED_COLUMNS_T = ['Transaction ID', 'Date', 'Description', 'Amount', 'Type', 'Account ID']

# @main_bp.route('/import-transactions', methods=['POST'])
# def import_transactions():
#     if 'file' not in request.files:
#         return jsonify({'message': 'No file provided'}), 400

#     file = request.files['file']
#     filename = secure_filename(file.filename)

#     if not filename.endswith('.xlsx'):
#         return jsonify({'message': 'Only .xlsx files are allowed'}), 400

#     try:
#         df = pd.read_excel(BytesIO(file.read()))

#         # Check required columns
#         for col in REQUIRED_COLUMNS_T:
#             if col not in df.columns:
#                 return jsonify({'message': f'Missing column: {col}'}), 400

#         # Drop any rows with missing values
#         if df.isnull().any().any():
#             return jsonify({'message': 'All fields must be filled'}), 400

#         # Insert transactions
#         for _, row in df.iterrows():
#             new_txn = Transaction(
#                 transaction_id=int(row['Transaction ID']),
#                 date=pd.to_datetime(row['Date']).date(),
#                 description=row['Description'],
#                 amount=float(row['Amount']),
#                 txn_type=row['Type'],
#                 account_id=int(row['Account ID']),
#             )
#             account = db_session.query(Account).filter(Account.account_id==new_txn.account_id).first()

#             if (new_txn.txn_type.lower() == 'debit'):
#                 new_txn.debit(account)
#             else:
#                 new_txn.credit(account)


#             db_session.merge(new_txn)  # Upsert, or use .add() if no conflict
#         db_session.commit()

#         return jsonify({'message': 'Transactions uploaded successfully'}), 200

#     except Exception as e:
#         return jsonify({'message': f'Error processing file: {str(e)}'}), 500

# @main_bp.route('/export-accounts', methods=['GET'])
# def export_accounts():
#     accounts = db_session.query(Account).all()
#     data = [
#         {
#             'Account ID': a.account_id,
#             'Account Code': a.code,
#             'Account Name': a.name,
#             'Account Type': a.account_type,
#             'Account Balance': a.balance,
#         }
#         for a in accounts
#     ]

#     df = pd.DataFrame(data)
#     output = BytesIO()
#     with pd.ExcelWriter(output, engine='openpyxl') as writer:
#         df.to_excel(writer, index=False, sheet_name='Accounts')

#     output.seek(0)
#     return send_file(
#         output,
#         download_name='accounts.xlsx',
#         as_attachment=True,
#         mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#     )

# # Remove 'Account Transactions' from REQUIRED_COLUMNS_A if not in Excel
# REQUIRED_COLUMNS_A = ['Account Code', 'Account Name', 'Account Type']

# @main_bp.route('/import-accounts', methods=['POST'])
# def import_accounts():
#     if 'file' not in request.files:
#         return jsonify({'message': 'No file provided'}), 400

#     file = request.files['file']
#     filename = secure_filename(file.filename)

#     if not filename.endswith('.xlsx'):
#         return jsonify({'message': 'Only .xlsx files are allowed'}), 400

#     try:
#         df = pd.read_excel(BytesIO(file.read()))

#         # Check required columns
#         for col in REQUIRED_COLUMNS_A:
#             if col not in df.columns:
#                 return jsonify({'message': f'Missing column: {col}'}), 400

#         if df.isnull().any().any():
#             return jsonify({'message': 'All fields must be filled'}), 400

#         for _, row in df.iterrows():
#             # Avoid forcing int for account_code if it can be string:
#             account_code = row['Account Code']
#             try:
#                 account_code = int(account_code)
#             except Exception:
#                 pass  # keep as-is if cannot convert to int

#             a = Account(
#                 code=account_code,
#                 name=str(row['Account Name']),
#                 account_type=str(row['Account Type']),
#                 balance=float(0.00),
#             )
#             db_session.merge(a)
#         db_session.commit()

#         return jsonify({'message': 'Accounts uploaded successfully'}), 200

#     except Exception as e:
#         db_session.rollback()
#         return jsonify({'message': f'Error processing file: {str(e)}'}), 500
#     finally:
#         db_session.close()


# @main_bp.route('/upload-receipt', methods=['POST'])
# def UploadReceipt():
#     try:
#         # Get and validate form data
#         date_str = request.form.get('date')
#         description = request.form.get('description')
#         amount = request.form.get('amount')
#         txn_type = request.form.get('txn_type')
#         account_id = request.form.get('account_id')
#         entry_id = request.form.get('entry_id')

#         if not all([date_str, description, amount, txn_type, account_id]):
#             return jsonify({'error': 'Missing required form data'}), 400

#         date = datetime.strptime(date_str, '%Y-%m-%d').date()

#         try:
#             amount = float(amount)
#         except (ValueError, TypeError):
#             return jsonify({'error': 'Invalid amount'}), 400

#         try:
#             account_id = int(account_id)
#         except ValueError:
#             return jsonify({'error': 'Invalid account_id'}), 400

#         entry_id = int(entry_id) if entry_id else None

#         account = db_session.query(Account).filter(Account.account_id == account_id).first()
#         if not account:
#             return jsonify({'error': 'Account not found'}), 404

#         new_txn = Transaction(
#             date=date,
#             description=description,
#             amount=amount,
#             txn_type=txn_type,
#             account_id=account_id,
#             entry_id=entry_id
#         )

#         if txn_type.lower() == 'debit':
#             new_txn.debit(account)
#         else:
#             new_txn.credit(account)

#         db_session.add(new_txn)
#         db_session.flush()  # assign transaction_id

#         file = request.files.get('file')
#         if file:
#             if not file.filename.lower().endswith(('.png', '.jpeg', '.jpg', '.pdf')):
#                 return jsonify({'error': 'File must be a JPEG or PDF'}), 400

#             file_data = file.read()
#             receipt = Receipt(
#                 filename=file.filename,
#                 content_type=mimetypes.guess_type(file.filename)[0] or file.content_type,
#                 data=file_data,
#                 transaction_id=new_txn.transaction_id
#             )
#             db_session.add(receipt)
#         # if no file uploaded, still proceed without error

#         db_session.commit()
#         return jsonify({'message': 'Transaction and receipt uploaded successfully'}), 201

#     except Exception as e:
#         db_session.rollback()
#         return jsonify({'error': str(e)}), 500
#     finally:
#         db_session.close()


# # Define the root-level 'receipts' directory
# RECEIPTS_DIR = os.path.join(os.getcwd(), 'receipts')
# os.makedirs(RECEIPTS_DIR, exist_ok=True)  # Create once at import

# @main_bp.route('/receipt_file/<int:receipt_id>')
# def serve_receipt_file(receipt_id):
#     receipt = db_session.query(Receipt).get(receipt_id)
#     if not receipt:
#         return jsonify({'error': 'Receipt not found'}), 404

#     from config import RECEIPTS_DIR
#     print(RECEIPTS_DIR)
#     return send_from_directory(RECEIPTS_DIR, receipt.filename, mimetype=receipt.content_type)

# @main_bp.route('/delete-receipt/<int:receipt_id>', methods=['DELETE'])
# def DeleteReceipt(receipt_id):
#     receipt = db_session.query(Receipt).filter_by(id=receipt_id).first()
#     path = receipt.filename
#     transaction = receipt.transaction_id

#     if receipt:
#         db_session.delete(receipt)
#         db_session.commit()

#     from config import RECEIPTS_DIR
#     query = os.path.join(RECEIPTS_DIR, path)

#     if not db_session.query(Receipt).filter_by(transaction_id=transaction):
#         os.remove(query)
#     else:
#         pass

#     return jsonify({'message': 'Receipt deleted successfully'}), 200

# @main_bp.route('/account/account-ledger/<int:account_id>', methods=['GET'])
# def accountLedger(account_id):
#     account = db_session.query(Account).filter_by(account_id=account_id).first()
#     if not account:
#         return jsonify({"error": "Account not found"}), 404

#     transactions_serialized = []
#     total_debit = 0
#     total_credit = 0

#     if account.transactions:
#         for t in account.transactions:
#             transactions_serialized.append(t.to_dict())
#             if (t.txn_type.lower()=='debit'):
#                 total_debit += float(t.amount) or 0
#             else:
#                 total_credit += float(t.amount) or 0

#     return jsonify({
#         'transactions': transactions_serialized,
#         'total_debit': float(total_debit),
#         'total_credit': float(total_credit),
#         'type': account.account_type
#     }), 200

    
    

