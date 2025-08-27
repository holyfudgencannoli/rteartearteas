from flask import Flask, request, jsonify,session
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from bcrypt import hashpw, checkpw, gensalt
import os
from .models import Receipt, ReceiptDataObject, ACCESS_KEY_ID, BUCKET_NAME, ACCOUNT_ID, SECRET_ACCESS_KEY
import boto3
from .db import engine, db_session, Base


s3_client = boto3.client(
    "s3",
    endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name="auto",
)


# Flask setup
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Replace with a secure key
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 1 day in seconds
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Required for cross-origin cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Requires HTTPS in production
app.config['WTF_CSRF_TIME_LIMIT']=None,

# CORS setup
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'https://frontend.com'])

# SQLAlchemy setup
Base = declarative_base()

from .models import User

# Create database tables
Base.metadata.create_all(engine)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# CSRF protection
csrf = CSRFProtect(app)

# Create uploads folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# User loader
@login_manager.user_loader
def load_user(user_id):
    try:
        user = db_session.query(User).get(int(user_id))
        return user
    finally:
        db_session.close()

# CSRF token endpoint
@app.route('/api/csrf-token', methods=['GET'])
def get_csrf_token():
    print("SESSION CONTENT:", dict(session))
    print("Current user:", current_user.id)
    return jsonify({'csrf_token': generate_csrf()})

# Login API
@app.route('/api/login', methods=['POST'])
def login():
    print("SESSION CONTENT:", dict(session))
    print("Current user:", current_user.id)

    data = request.form

    username = str(data.get('username'))
    password = str(data.get('password'))
    
    try:
        user = db_session.query(User).filter_by(username=username).first()
        if user and checkpw(password.encode('utf-8'), user.password_hash):
            login_user(user, remember=True)
            session['username']=username
            db_session.close()
            return jsonify({'message': 'Logged in successfully', 'username': user.username}), 200
        db_session.close()
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        db_session.close()
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Logout API
@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    print("SESSION CONTENT:", dict(session))
    print("Current user:", current_user.id)
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Image upload API
@app.route('/api/upload-receipt-route', methods=['POST'])
@login_required
def upload_image():
    print("SESSION CONTENT:", dict(session))
    print("Current user:", current_user.id)
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

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
    return jsonify({'message': 'Invalid file type'}), 400

# Protected API (for testing)
@app.route('/api/protected')
@login_required
def protected():
    print("SESSION CONTENT:", dict(session))
    print("Current user:", current_user.id)
    return jsonify({'message': 'This is a protected route'})

# Initialize database with a test user
if __name__ == '__main__':
    try:
        if not db_session.query(User).filter_by(username='testuser').first():
            hashed_password = hashpw('testpassword'.encode('utf-8'), gensalt()).decode('utf-8')
            user = User(username='testuser', password=hashed_password)
            db_session.add(user)
            db_session.commit()
    finally:
        db_session.close()
    
    app.run(debug=True, port=5000)
