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
jwt = JWTManager(app)


#BOOKS
class Book(db.Document):
    id = db.ObjectIdField().gen()
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
@jwt_required()
def create_book():

    data = request.get_json()    

    new_book = Book(title = data['title'], description = data['description'], price = int(data['price']), inStock = int(data['inStock']))
    
    if Book.query.filter_by(title=data['title']).first(): # otra forma es Book.query.filter(Book.title == data['title']).first():
        return jsonify({'err': 'The book is already added.'})

    new_book.save() # o también se puede hacer db.session.add(new_book)

    return jsonify({
        'msg': 'Book Created Successfully.',
        'newBook': book_schema.dump(new_book)
    })


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
    return jsonify(book_schema.dump(book))


# Get single book by title
@app.route("/api/v1/books/ByTitle/<title>", methods=['GET'])
def get_bookByTitle(title):
    book = Book.query.filter_by(title=title).first()

    return jsonify(book_schema.dump(book))


# Update a book
@app.route("/api/v1/books/<id>", methods=['PUT'])
@jwt_required()
def update_book(id):
    book = Book.query.get(id)

    data = request.get_json()

    book.title = data['title']
    book.description = data['description']
    book.price = data['price'] 
    book.inStock = data['inStock']

    book.save()

    return jsonify({
        'msg': 'Book Updated Successfully.',
        'book': book_schema.dump(book)
    })


# Delete a book
@app.route("/api/v1/books/<id>", methods=['DELETE'])
@jwt_required()
def delete_book(id):
    #book = Book.query.get(id) # este trae por ObjectId
    book = Book.query.get(id)
    if book:
        book.remove()
        return jsonify({'msg': 'Book deleted Successfully.'})
    return {'err' : 'The book does not exist.'}

#CATEGORIES
class Category(db.Document):
    id = db.ObjectIdField().gen()
    name = db.StringField()

class CategorySchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    name = fields.Str()

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

# Create a book
@app.route("/api/v1/categories", methods=['POST'])
@jwt_required()
def create_category():
    
    data = request.get_json()    

    new_category = Category(name = data['name'])
    
    if Category.query.filter_by(name=data['name']).first(): # otra forma es Book.query.filter(Book.title == data['title']).first():
        return jsonify({'err': 'The book is already added.'})

    new_category.save() # o también se puede hacer db.session.add(new_book)

    return jsonify({
        'msg': 'Category Created Successfully.',
        'newCategory': category_schema.dump(new_category)
    })



# Get all books
@app.route("/api/v1/categories", methods=['GET'])
def get_categories():
    all_categories = Category.query.all()
    results = categories_schema.dump(all_categories)

    return jsonify(results)


# Get a single book
@app.route("/api/v1/categories/<string:id>", methods=['GET'])
def get_category(id):
    category = Category.query.get(id) # este trae por ObjectId
    return jsonify(category_schema.dump(category))

# Update a book
@app.route("/api/v1/categories/<id>", methods=['PUT'])
@jwt_required()
def update_category(id):
    category = Category.query.get(id)

    data = request.get_json()

    category.name = data['name']

    category.save()

    return jsonify({
            'msg': 'Category Updated Successfully.',
            'category': category_schema.dump(category)
        })


# Delete a book
@app.route("/api/v1/categories/<id>", methods=['DELETE'])
@jwt_required()
def delete_category(id):
    #book = Book.query.get(id) # este trae por ObjectId
    category = Category.query.get(id)
    if not category:
        return {'err' : 'The category does not exist.'}

    category.remove()
    return jsonify({'msg': 'Category deleted Successfully.'})

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
@app.route("/api/v1/users/updateName", methods=['PATCH'])
@jwt_required()
def update_username():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return jsonify({'err': 'The user does not exist.'})
    
    data = request.get_json()

    user.name = data['name']
    
    user.save()

    return user_schema.jsonify(user)


# Update a user
@app.route("/api/v1/users/resetPassword", methods=['PATCH'])
@jwt_required()
def reset_password():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return jsonify({'err': 'The user does not exist.'})
    
    data = request.get_json()

    user.password = data['password']
    user.hash_password(request.json.get('password'))
    
    user.save()

    return jsonify({'msg': 'Password updated Succesfully.'})


#ORDER

class Order(db.Document):
    id = db.ObjectIdField().gen()
    cart = db.ListField(db.DocumentField(Book), db_field='cart')
    user = db.DocumentField(User)
    address = db.StringField()
    mobile = db.StringField()
    created_at = db.DateTimeField(required=True, default=datetime.datetime.now())
    total = db.IntField()
    delivered = db.BoolField()
    paid = db.BoolField()
    paymentId= db.StringField()


class OrderSchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    cart = fields.List(fields.Nested(BookSchema))
    user = fields.Nested(UserSchema)
    address = fields.Str()
    mobile = fields.Str()
    created_at = fields.Date()
    total = fields.Int()
    delivered = fields.Bool()
    paid = fields.Bool()
    paymentId= fields.Str()

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

# Create a order
@app.route("/api/v1/orders", methods=['POST'])
@jwt_required()
def create_order():
    cart = []
    data = request.get_json()

    for book in data['cart']:
        new_book = Book(title = book['title'], description = book['description'], 
            price = int(book['price']), inStock = int(book['inStock']))
        
        cart.append(new_book)

    new_user = User(name = data['user']['name'], email = data['user']['email'], password = '', isAdmin = False)

    new_order = Order(cart = cart, user=new_user, address = data['address'], 
        delivered= False, paid= True,mobile = data['mobile'], 
        total = data['total'], paymentId= data['paymentId'])

    new_order.save() # o también se puede hacer db.session.add(new_order)

    return order_schema.jsonify(new_order)


# Get a single order
@app.route("/api/v1/orders/<id>", methods=['GET'])
@jwt_required()
def get_order(id):
    order = Order.query.get(id)

    return order_schema.jsonify(order)

# Get all orders
@app.route("/api/v1/orders", methods=['GET'])
@jwt_required()
def get_orders():

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if user.isAdmin:
        all_orders = Order.query.all()
    else:
        all_orders = Order.query.filter(Order.user.email == user.email).all()

    return jsonify(orders_schema.dump(all_orders))
    

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
