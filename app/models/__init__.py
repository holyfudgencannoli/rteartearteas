from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, Interval, Date, ForeignKey, Float, Boolean, LargeBinary, DateTime
from sqlalchemy.types import TypeDecorator
from datetime import timedelta, date
from ..db import SessionLocal, engine
from flask import request
import os
from flask_login import UserMixin


ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
ACCESS_KEY_ID = os.getenv("CLOUDFLARE_ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.getenv("CLOUDFLARE_SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("CLOUDFLARE_BUCKET")

Base = declarative_base()

class User(UserMixin, Base):
    __tablename__ = 'users' 
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    is_admin = Column(Boolean, default=False)
    email = Column(String)
    phone = Column(String)
    password_hash =Column (String)
    provider = Column(String)
    provider_id = Column(Integer)
    created_at = Column(DateTime)
    last_login =  Column(DateTime)
    receipts = relationship("ReceiptDataObject", back_populates="user")

    def to_dict(self):
        return{
            'id': self.id,
            'username': self.username,
            'is_admin': self.is_admin,
            'email': self.email,
            'phone': self.phone,
            'provider': self.provider,
            'provider_id': self.provider_id,
            'created_at': self.created_at,
            'last_login': self.last_login,
        }
    
    def get_id(self):
        return str(self.id)
    
class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    store_name = Column(String)
    store_number = Column(String)
    store_address = Column(String)

    def to_dict(self):
        return{
            'id':self.id,
            'store_name': self.store_name,
            'store_number':self.store_number,
            'store_address':self.store_address,
        }


class ReceiptDataObject(Base):
    __tablename__ = "receipt_data_objects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    store_name = Column(String)
    datetime = Column(String)
    total = Column(Float)
    store_location = Column(String)
    payment_type = Column(String)
    description = Column(String)
    category = Column(String)
    receipt_id_str = Column(String)
    receipt_path = Column(String)
    receipt_base64 = Column(String)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="receipts")

    receipt = relationship("Receipt", back_populates='receipt_data_object', uselist=False)

    def to_dict(self):
        return{
            'id': self.id,
            'store_name': self.store_name,
            'datetime': self.datetime,
            'total': self.total,
            'store_location': self.store_location,
            'payment_type': self.payment_type,
            'description': self.description,
            'category': self.category,
            'user_id': self.user_id,
            'receipt_id_str': self.receipt_id_str,
            'receipt_path': self.receipt_path,
            'receipt_base64': self.receipt_base64,
            # 'receipt': self.receipt.to_dict() if self.receipt else None
        }
 

class Receipt(Base):
    __tablename__ = "receipts"

    receipt_id = Column(Integer, ForeignKey('receipt_data_objects.id', ondelete="CASCADE"), primary_key=True)
    filename = Column(String, nullable=False)
    content_type = Column(String)

    receipt_data_object = relationship("ReceiptDataObject", back_populates='receipt', uselist=False)

    @property
    def receipt_url(self):
        return f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com/{BUCKET_NAME}/{self.filename}"

    def to_dict(self):
        return {
            "filename": self.filename,
            "content_type": self.content_type,
            "url": self.receipt_url
        }
