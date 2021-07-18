from flask import Flask,request,jsonify,url_for,g
from flask_mongoalchemy import MongoAlchemy
from flask_marshmallow import Marshmallow
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt import JWT, jwt_required, current_identity, JWT
from werkzeug.security import safe_str_cmp
from datetime import timedelta


app = Flask(__name__)
CORS(app)
'''
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['JWT_AUTH_USERNAME_KEY'] = 'email'
app.config['JWT_AUTH_URL_RULE'] = '/api/v1/users/auth'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(seconds=3600)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:ser.23@localhost/api-python'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
'''
app.config['MONGOALCHEMY_DATABASE'] = 'api-python'
db = MongoAlchemy(app)

ma = Marshmallow(app)
auth = HTTPBasicAuth()

#BOOKS
#BOOKS
class Book(db.Document):
    id = db.IntField()
    title = db.StringField()
    description = db.StringField()
    price = db.FloatField()
    fechaSolicitud = db.StringField()
    fechaEntrega = db.StringField()
    inStock = db.IntField()


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

    new_book = Book(id = create_new_id("Book"), title = data['title'], description = data['description'], price = data['price'], fechaSolicitud = data['fechaSolicitud'], fechaEntrega = data['fechaEntrega'], inStock = data['inStock'])
    
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
@app.route("/api/v1/books/<id>", methods=['GET'])
def get_book(id):
#    book = Book.query.get(id) # este trae por ObjectId
    book = Book.query.filter_by(id = int(id)).first()

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
#    book = Book.query.get(id) # este trae por ObjectId
    book = Book.query.filter_by(id = int(id)).first()

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
#    book = Book.query.get(id) # este trae por ObjectId
    book = Book.query.filter_by(id = int(id)).first()
    if book:
        book.remove()
        return jsonify({'msg': 'Book deleted Successfully.'})
    return {'err' : 'The book does not exist.'}

#USER
class User(db.Document):
    id = db.IntField()
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

def authenticate(email, password):
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return user

def identity(payload):
    user_id = payload['identity']
    return User.query.get(user_id)




class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password')


user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Register a user
@app.route("/api/v1/users/register", methods=['POST'])
@cross_origin()
def register():

    userByEmail = User.query.filter_by(email=request.json.get('email')).first()
    userByName = User.query.filter_by(name=request.json.get('username')).first() 

    if userByEmail:
        return {'err' : 'This email already exists.'}

    if userByName:
        return {'err' : 'This user name already exists.'}

    new_user = User(id = create_new_id("User"), name = request.json.get('username'), email = request.json.get('email'), password = request.json.get('password'), isAdmin = False)
    new_user.hash_password(request.json.get('password'))
    
    new_user.save()  

    return jsonify({'msg': 'Registered Successfully'})


# Create a user
@app.route("/api/v1/users", methods=['POST'])
@cross_origin()
def create_user():
    data = request.get_json()
    userByEmail = User.query.filter_by(email=data['email']).first()
    userByName = User.query.filter_by(name=data['username']).first() 

    if userByEmail:
        return {'err' : 'This email already exists.'}

    if userByName:
        return {'err' : 'This user name already exists.'}

    new_user = User(id = create_new_id("User"), name = data['username'], email = data['email'], password = data['password'], isAdmin = False)
    new_user.hash_password(request.json.get('password'))
    new_user.save() 

    return user_schema.jsonify(new_user)

# Get a single user
@app.route("/api/v1/users/<id>", methods=['GET'])
def get_user(id):
#    user = User.query.get(id) # este trae por ObjectId
    user = User.query.filter_by(id = int(id)).first()

    return user_schema.jsonify(user)

# Update a user
@app.route("/api/v1/users/<id>", methods=['PUT'])
@cross_origin()
def update_user(id):
#    user = User.query.get(id) # este trae por ObjectId
    user = User.query.filter_by(id = int(id)).first()
    
    data = request.get_json()

    user.name = data['username']
    user.email = data['email']
    user.password = data['password']
    user.hash_password(request.json.get('password'))

    user.save()

    return user_schema.jsonify(user)


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
    
def create_new_id(name_object):
    ultimo_id = 0
    if name_object == "User":
        list_objects = User.query.all()
    else:
        list_objects = Book.query.all()
    if list_objects:
        for obj in list_objects:
            if obj.id > ultimo_id:
                ultimo_id = obj.id
        ultimo_id = ultimo_id + 1
    else:
        ultimo_id = 1

    return ultimo_id


# Run server
if __name__ == "__main__":
    app.run(debug=True, port="4000")
