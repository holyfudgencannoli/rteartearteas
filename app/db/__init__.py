from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
import sys
import os

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

db_path = resource_path('budgeter.db')

engine = create_engine(f"sqlite:///{db_path}")

SessionLocal = sessionmaker(bind=engine)
db_session = SessionLocal()

Base = declarative_base()
