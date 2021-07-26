from flask import Flask
from flask_restful import Api

from flask import Flask,request,jsonify,url_for,g
from flask_mongoalchemy import MongoAlchemy
from flask_marshmallow import Marshmallow
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt import JWT, jwt_required, current_identity, JWT
from werkzeug.security import safe_str_cmp
from datetime import timedelta
from bson.objectid import ObjectId
from marshmallow import Schema, fields
import datetime

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from resources.book import Book, BookList
from resources.order import Order, OrderList
from resources.auth.register import Register
from resources.auth.login import Login
from resources.auth.check_token import CheckToken
from resources.auth.update_user import ResetPassword, updateName
from resources.category import Category, CategoryList

'''This is section 4 app.py file.'''
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'dspelrtjmlsadptytpeirkmvxzoerpitmk'
app.config['JWT_AUTH_USERNAME_KEY'] = 'email'
app.config['JWT_AUTH_URL_RULE'] = '/api/v1/users/auth'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['MONGOALCHEMY_DATABASE'] = 'api-python'
api = Api(app)


# Adding /auth end point:
auth = HTTPBasicAuth()
jwt = JWTManager(app)

api.add_resource(Book, '/api/v1/books/<string:id>')
api.add_resource(BookList, '/api/v1/books')
api.add_resource(Category, '/api/v1/categories/<id>')
api.add_resource(CategoryList, '/api/v1/categories')
api.add_resource(Register, '/api/v1/users/register')
api.add_resource(Login, '/api/v1/users/login')
api.add_resource(CheckToken, '/api/v1/users/auth')
api.add_resource(ResetPassword, '/api/v1/users/resetPassword')
api.add_resource(updateName, '/api/v1/users/updateName')
api.add_resource(Order, '/api/v1/orders/<id>')
api.add_resource(OrderList, '/api/v1/orders')

if __name__ == '__main__':
    from db import db
    db.init_app(app)
    app.run(port=4000, debug=True)
