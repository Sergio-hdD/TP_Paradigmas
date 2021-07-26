from db import db

class BookModel(db.Document):
    id = db.ObjectIdField().gen()
    title = db.StringField()
    description = db.StringField()
    price = db.IntField()
    inStock = db.IntField()
    category = db.StringField()


