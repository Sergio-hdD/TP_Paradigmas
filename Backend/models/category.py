from db import db

class CategoryModel(db.Document):
    id = db.ObjectIdField().gen()
    name = db.StringField()