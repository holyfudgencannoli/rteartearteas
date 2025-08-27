from flask import Flask, send_from_directory, current_app, redirect, url_for, session, jsonify, g
from flask_cors import CORS
from .routes.main import main_bp, app_bp
from .routes.auth_routes import auth_bp 
from .routes.auth_routes import admin_bp
from .routes.receipt_routes import receipts_bp
from .models import Base, User
from .db import engine, db_session
import os
from werkzeug.security import safe_join
from datetime import timedelta
from flask_login import LoginManager, UserMixin, login_required, logout_user, current_user, login_url
from flask_wtf.csrf import CSRFProtect, generate_csrf


login_manager = LoginManager()

def create_app():
    app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
    app.config['SECRET_KEY'] = "supersecret" 
    app.config["PERMANENT_SESSION_LIFETIME"] = 86400
    app.config['SESSION_COOKIE_SAMESITE'] = None
    app.config['SESSION_COOKIE_SECURE'] = False
    # app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=365)
    app.config['SESSION_COOKIE_HTTPONLY'] = False
    # app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    # app.config['SESSION_COOKIE_SECURE'] = False 

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    
    Base.metadata.create_all(bind=engine)

    login_manager.init_app(app)
    # login_url("auth.login", next_url='/login')
    login_manager.login_view = 'login'

    csrf = CSRFProtect(app)
    
    @app.errorhandler(400)
    def handle_bad_request(e):
        return jsonify(error="Bad request", detail=str(e)), 400


    @login_manager.user_loader
    def load_user(user_id):
        try:
            user = db_session.query(User).get(int(user_id))
            return user
        finally:
            db_session.close()

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'error': 'Unauthorized'}), 401



    @app.route("/api/current_user")
    @login_required
    def get_current_user():
        if current_user.is_authenticated:
            return {
                "id": current_user._user_id,
                "username": current_user.username,
                "is_admin": current_user.is_admin
            }
        return {"id": None}, 401

    @app.before_request
    def ensure_csrf_token():
        if "csrf_token" not in session:
            session['csrf_token'] = generate_csrf()

    @app.after_request
    def inject_csrf_token(response):
        response.set_cookie(
            "csrf_token",
            session.get('csrf_token'),
            secure=False,      # True in HTTPS production
            httponly=False,    # must be False so React can read it
            samesite="Lax"     # Lax is fine for same-origin
        )
        return response


    app.register_blueprint(receipts_bp, url_prefix='/api')
    app.register_blueprint(main_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(app_bp)

    return app