from flask import Flask,request,jsonify,url_for,g
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt import JWT, jwt_required, current_identity, JWT
from werkzeug.security import safe_str_cmp
from datetime import timedelta


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['JWT_AUTH_USERNAME_KEY'] = 'email'
app.config['JWT_AUTH_URL_RULE'] = '/api/v1/users/auth'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(seconds=3600)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/api-python'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
auth = HTTPBasicAuth()

#BOOKS
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(100))
    price = db.Column(db.Float)
    fechaSolicitud = db.Column(db.String(20))
    fechaEntrega = db.Column(db.String(20))
    inStock = db.Column(db.Integer)

    def __init__(self, id, title, description, price, fechaSolicitud, fechaEntrega, inStock):
        self.id = id
        self.title = title
        self.description = description
        self.price = price
        self.fechaSolicitud = fechaSolicitud
        self.fechaEntrega = fechaEntrega
        self.inStock

    def __init__(self, title, description, price, fechaSolicitud, fechaEntrega, inStock):
        self.title = title
        self.description = description
        self.price = price
        self.fechaSolicitud = fechaSolicitud
        self.fechaEntrega = fechaEntrega
        self.inStock

    def __str__(self):
        return str(self.id) + " " + self.title + ", " + self.description + " " + str(self.price) + " " + fechaSolicitud + " " + fechaEntrega + " " + inStock


db.create_all()


class BookSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'description', 'price', 'fechaSolicitud', 'fechaEntrega', 'inStock')


book_schema = BookSchema()
books_schema = BookSchema(many=True)

# Create a book

@app.route("/api/v1/books", methods=['POST'])
@cross_origin()
def create_book():
    data = request.get_json()

    title = data['title']
    description = data['description']
    price = data['price']
    fechaSolicitud = data['fechaSolicitud']
    fechaEntrega = data['fechaEntrega']
    inStock = data['inStock']
    
    new_book = Book(title, description, price, fechaSolicitud, fechaEntrega, inStock)

    db.session.add(new_book)
    db.session.commit()

    return book_schema.jsonify(new_book)


# Get all books
@app.route("/api/v1/books", methods=['GET'])
def get_books():
    all_books = Book.query.all()
    results = books_schema.dump(all_books)

    return jsonify(results)


# Get a single book
@app.route("/api/v1/books/<id>", methods=['GET'])
def get_book(id):
    book = Book.query.get(id)

    return book_schema.jsonify(book)


# Get single book by title
@app.route("/api/v1/books/ByTitle/<title>", methods=['GET'])
def get_bookByTitle(title):
    book = Book.query.filter_by(title=title).first()

    return book_schema.jsonify(book)


# Update a book
@app.route("/api/v1/books/<id>", methods=['PUT'])
@cross_origin()
def update_book(id):
    book = Book.query.get(id)

    data = request.get_json()

    book.title = data['title']
    book.description = data['description']
    book.price = data['price']
    book.fechaSolicitud = data['fechaSolicitud']
    book.fechaEntrega = data['fechaEntrega']
    book.inStock = data['inStock']

    db.session.commit()

    return book_schema.jsonify(book)


# Delete a book
@app.route("/api/v1/books/<id>", methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    db.session.delete(book)
    db.session.commit()

    return book_schema.jsonify(book)

#USER
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(50))
    password = db.Column(db.String(128))
    isAdmin = db.Column(db.Boolean)

    def __init__(self, id, email, name, password):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.isAdmin = False


    def hash_password(self, password):
        self.password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password, password)

    def __str__(self):
        return str(self.id) + " " + self.name + ", " + self.password

def authenticate(email, password):
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return user

def identity(payload):
    user_id = payload['identity']
    return User.query.get(user_id)

db.create_all()


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password')


user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Register a user

@app.route("/api/v1/users/register", methods=['POST'])
@cross_origin()
def register():

    name = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    user = User.query.filter_by(email=email).first()

    if user:
        return {'err' : 'This email already exists.'}

    new_user = User(name, email, password)
    new_user.hash_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'Registered Successfully'})


# Create a user
@app.route("/api/v1/users", methods=['POST'])
@cross_origin()
def create_user():
    data = request.get_json()

    name = data['name']
    email = data['email']
    password = data['password']

    new_user = User(name, password)

    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)

# Get a single user
@app.route("/api/v1/users/<id>", methods=['GET'])
def get_user(id):
    user = User.query.get(id)

    return user_schema.jsonify(user)


# Update a user
@app.route("/api/v1/users/<id>", methods=['PUT'])
@cross_origin()
def update_user(id):
    user = User.query.get(id)

    data = request.get_json()

    user.name = data['name']
    user.email = data['email']
    user.password = data['password']

    db.session.commit()

    return user_schema.jsonify(user)


# Delete a user
@app.route("/api/v1/users/<id>", methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)

#check a user name and password
@app.route("/api/v1/users/check/<name_input>/<password_input>", methods=['GET'])
def getUserByNameAndPassword(name_input, password_input):
    user = User.query.filter_by(name=name_input, password=password_input).first()
    return book_schema.jsonify(user)

#check a user name
@app.route("/api/v1/users/check/<name_input>", methods=['GET'])
def getUserByName(name_input):
    user = User.query.filter_by(name=name_input).first()
    return book_schema.jsonify(user)

jwt = JWT(app, authenticate, identity)

@app.route('/api/v1/users/')
@jwt_required()
def protected():
    return {
        "user": {   
            "name": current_identity.name,
            "email": current_identity.email 
        }
    }

@jwt.auth_response_handler
def customized_response_handler(access_token, identity):
    return jsonify({
                        'access_token': access_token.decode('utf-8'), 
                            'user': {
                                'name': identity.name,
                                'email': identity.email,
                            }
                        

                   })
    

# Run server
if __name__ == "__main__":
    app.run(debug=True, port="4000")
