from flask import Blueprint, jsonify, send_from_directory, current_app, session
from functools import wraps
from flask_login import current_user, login_required, LoginManager
from ..db import db_session
from flask_login import current_user
from ..models import User
from flask_wtf.csrf import generate_csrf

app_bp = Blueprint('app', __name__)


login_manager=LoginManager()

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("is_admin"):
            return abort(403)
        return f(*args, **kwargs)
    return decorated_function

@app_bp.route('/')
@login_required
def homePage():
    print("SESSION CONTENT:", dict(session))
    
    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/rc')
@login_required
def rc():
    print("SESSION CONTENT:", dict(session))

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/rl')
@login_required
def rl():
    print("SESSION CONTENT:", dict(session))


    return send_from_directory(current_app.static_folder, "index.html")


@app_bp.route('/login')
def loginPage():
    print("SESSION CONTENT:", dict(session))

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/admin-panel')
@login_required
@admin_required
def AdminPanelPage():
    print("SESSION CONTENT:", dict(session))

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/dashboard')
@login_required
def refresh0():
    print("SESSION CONTENT:", dict(session))

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/transactions')
def refresh1():

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/add-an-entry')
def refresh2():

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/upload-receipt')
@login_required
def refresh3():
    print("SESSION CONTENT:", dict(session))

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/finalize-receipt')
@login_required
def refresh4():
    print(current_user.id)
    print("SESSION CONTENT:", dict(session))

    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/add-account')
def refresh5():
    return send_from_directory(current_app.static_folder, "index.html")
 
@app_bp.route('/account-ledger')
def refresh6():
    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/coa')
def refresh7():
    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/invoices')
def refresh8():
    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/transaction/:transaction_id')
def refresh9():
    return send_from_directory(current_app.static_folder, "index.html")

@app_bp.route('/signup')
def refresh10():
    return send_from_directory(current_app.static_folder, "index.html")


main_bp = Blueprint('main', __name__)


@main_bp.route('/name', methods=['GET'])
def home():
    return jsonify({'message': 'Budgeter'})


