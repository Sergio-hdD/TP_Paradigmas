from db import db
from .book import BookModel
from .user import userModel
import datetime

class OrderModel(db.Document):
    id = db.ObjectIdField().gen()
    cart = db.ListField(db.DocumentField(BookModel), db_field='cart')
    user = db.DocumentField(userModel, db_field="user")
    address = db.StringField()
    mobile = db.StringField()
    created_at = db.DateTimeField(required=True, default=datetime.datetime.now())
    total = db.IntField()
    delivered = db.BoolField()
    paid = db.BoolField()
    paymentId= db.StringField()