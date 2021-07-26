from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class userModel(db.Document):
    name = db.StringField()
    email = db.StringField()
    password = db.StringField()
    isAdmin = db.BoolField()
  
    def hash_password(self, password):
        self.password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password, password)
