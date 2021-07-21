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



app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['JWT_AUTH_USERNAME_KEY'] = 'email'
app.config['JWT_AUTH_URL_RULE'] = '/api/v1/users/auth'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['MONGOALCHEMY_DATABASE'] = 'api-python'

db = MongoAlchemy(app)

ma = Marshmallow(app)
auth = HTTPBasicAuth()

#BOOKS
class Book(db.Document):
    title = db.StringField()
    description = db.StringField()
    price = db.IntField()
    inStock = db.IntField()

class BookSchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    title = fields.Str()
    description = fields.Str()
    price = fields.Int()
    inStock = fields.Int()

book_schema = BookSchema()
books_schema = BookSchema(many=True)

# Create a book
@app.route("/api/v1/books", methods=['POST'])
@cross_origin()
def create_book():
    data = request.get_json()

    new_book = Book(title = data['title'], description = data['description'], price = int(data['price']), inStock = int(data['inStock']))
    
    if Book.query.filter_by(title=data['title']).first(): # otra forma es Book.query.filter(Book.title == data['title']).first():
        return jsonify({'err': 'The book is already added.'})

    new_book.save() # o también se puede hacer db.session.add(new_book)

    return jsonify({'msg': 'Book Created Successfully.'})


# Get all books
@app.route("/api/v1/books", methods=['GET'])
def get_books():
    all_books = Book.query.all()
    results = books_schema.dump(all_books)

    return jsonify(results)


# Get a single book
@app.route("/api/v1/books/<string:id>", methods=['GET'])
def get_book(id):
    book = Book.query.get(id) # este trae por ObjectId
    #book = Book.query.filter_by(id = int(id)).first()
    return jsonify(book_schema.dump(book))


# Get single book by title
@app.route("/api/v1/books/ByTitle/<title>", methods=['GET'])
def get_bookByTitle(title):
    book = Book.query.filter_by(title=title).first()

    return jsonify(book_schema.dump(book))


# Update a book
@app.route("/api/v1/books/<id>", methods=['PUT'])
@cross_origin()
def update_book(id):
    #book = Book.query.get(id) # este trae por ObjectId
    book = Book.query.get(id)

    data = request.get_json()

    book.title = data['title']
    book.description = data['description']
    book.price = data['price'] 
    book.inStock = data['inStock']

    book.save()

    return jsonify({'msg': 'Book Updated Successfully.'})


# Delete a book
@app.route("/api/v1/books/<id>", methods=['DELETE'])
def delete_book(id):
    #book = Book.query.get(id) # este trae por ObjectId
    book = Book.query.get(id)
    if book:
        book.remove()
        return jsonify({'msg': 'Book deleted Successfully.'})
    return {'err' : 'The book does not exist.'}

#USER
class User(db.Document):
    name = db.StringField()
    email = db.StringField()
    password = db.StringField()
    isAdmin = db.BoolField()
  
    def hash_password(self, password):
        self.password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password, password)

    def __str__(self):
        return str(self.id) + " " + self.name + ", " + self.password

class UserSchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    name = fields.Str()
    email = fields.Str()
    password = fields.Str()
    isAdmin = fields.Bool()


user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Register a user
@app.route("/api/v1/users/register", methods=['POST'])
@cross_origin()
def register():

    userByEmail = User.query.filter_by(email=request.json.get('email')).first()

    if userByEmail:
        return {'err' : 'This email already exists.'}

    new_user = User(name = request.json.get('username'), email = request.json.get('email'), password = request.json.get('password'), isAdmin = False)
    new_user.hash_password(request.json.get('password'))
    
    new_user.save()  

    return jsonify({'msg': 'Registered Successfully'})

# Get a single user
@app.route("/api/v1/users/<id>", methods=['GET'])
def get_user(id):
#    user = User.query.get(id) # este trae por ObjectId
    user = User.query.get(id)

    return user_schema.jsonify(user)

# Update a user
@app.route("/api/v1/users/<id>", methods=['PUT'])
@cross_origin()
def update_user(id):
#    user = User.query.get(id) # este trae por ObjectId
    user = User.query.get(id)

    if not user:
        return jsonify({'err': 'The user does not exist.'})
    
    data = request.get_json()

    user.name = data['username']
    user.email = data['email']
    user.password = data['password']
    user.hash_password(request.json.get('password'))

    user.save()

    return jsonify({'msg': 'Updated Successfully'})


# Delete a user
@app.route("/api/v1/users/<id>", methods=['DELETE'])
def delete_user(id):
#    user = User.query.get(id) # este trae por ObjectId
    user = User.query.filter_by(id = int(id)).first()
    if user:
        user.remove()
        return jsonify({'msg': 'User deleted Successfully.'})
    return jsonify({'err': 'The user does not exist..'})


#check a user name and password
@app.route("/api/v1/users/check/<name_input>/<password_input>", methods=['GET'])
def getUserByNameAndPassword(name_input, password_input):

    user = User.query.filter_by(name=name_input).first()
    if user and check_password_hash(user.password, password_input):
        return user_schema.jsonify(user)
    
    return user_schema.jsonify({}) #simula que no encontró


#check a user name
@app.route("/api/v1/users/check/<name_input>", methods=['GET'])
def getUserByName(name_input):
    user = User.query.filter_by(name=name_input).first()
    return book_schema.jsonify(user)

jwt = JWTManager(app)

#ORDER

class Order(db.Document):
    cart = db.ListField(db.DocumentField(Book), db_field='cart')
    user = db.DocumentField(User)
    created_at = db.DateTimeField(required=True, default=datetime.datetime.now())
    total = db.IntField()
    delivered = db.BoolField()
    paid = db.BoolField()

class OrderSchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    cart = fields.List(fields.Nested(BookSchema))
    user = fields.Nested(UserSchema)
    created_at = fields.Date()
    total = fields.Int()
    delivered = fields.Bool()
    paid = fields.Bool()

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

# Create a order
@app.route("/api/v1/orders", methods=['POST'])
@cross_origin()
def create_order():
    data = request.get_json()

    comment_a = Book(title = 'sdfgdfgfdg', description = 'sfdgdfgfdgdfgfdgdfg', price = 100, inStock = 30)
    comment_b = Book(title = 'sdfgdfgfdg2', description = 'sfdgdfgfdgdfgfdgdfg2', price = 100, inStock = 30)
    user = User(name = 'Franco', email = 'francoaguirre644@gmail.com', password='', isAdmin=False)
    
    cart = [comment_a, comment_b]

    new_order = Order(cart = cart, user=user, total = data['total'], delivered = data['delivered'], paid = data['paid'])

    new_order.save() # o también se puede hacer db.session.add(new_book)

    return jsonify({'msg': 'Order Created Successfully.'})


# Get a single order
@app.route("/api/v1/orders/<id>", methods=['GET'])
def get_order(id):
    order = Order.query.get(id)

    return order_schema.jsonify(order)

# Get all orders
@app.route("/api/v1/orders", methods=['GET'])
def get_orders():
    all_orders = Order.query.all()
    results = orders_schema.dump(all_orders)

    return jsonify(results)
    

@app.route("/api/v1/users/login", methods=["POST"])
def login():
    params = request.get_json() 
    
    email = params.get('email')
    password = params.get('password')

    if not email:
        return jsonify({"err": "Missing email parameter"}), 400
    if not password:
        return jsonify({"err": "Missing password parameter"}), 400

    user = User.query.filter_by(email=email).first()

    if user is None or not check_password_hash(user.password, password):
        return jsonify({"err": "Bad username or password"}), 401

    access_token = create_access_token(identity=user.email)
    
    return jsonify(
        { 
            'access_token' :access_token,
            'user' : {
             'email': user.email,
             'name': user.name,
             'isAdmin': user.isAdmin
            }
        })  

@app.route("/api/v1/users/auth", methods=["POST"])
@jwt_required()
def auth():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    return jsonify({'user' : {
             'email': user.email,
             'name': user.name,
             'isAdmin': user.isAdmin
            }}), 200


# Run server
if __name__ == "__main__":
    app.run(debug=True, port=4000)
