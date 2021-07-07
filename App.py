from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:ser.23@localhost/api-python'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

#BOOKS
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(100))
    price = db.Column(db.Float)

    def __init__(self, id, title, description, price):
        self.id = id
        self.title = title
        self.description = description
        self.price = price

    def __init__(self, title, description, price):
        self.title = title
        self.description = description
        self.price = price

    def __str__(self):
        return str(self.id) + " " + self.title + ", " + self.description + " " + str(self.price)


db.create_all()


class BookSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'description', 'price')


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

    new_book = Book(title, description, price)

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
    password = db.Column(db.String(100))

    def __init__(self, id, name, password):
        self.id = id
        self.name = name
        self.password = password

    def __init__(self, name, password):
        self.name = name
        self.password = password

    def __str__(self):
        return str(self.id) + " " + self.name + ", " + self.password


db.create_all()


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'password')


user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Create a user
@app.route("/api/v1/users", methods=['POST'])
@cross_origin()
def create_user():
    data = request.get_json()

    name = data['name']
    password = data['password']

    new_user = User(name, password)

    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)

# Get all users
@app.route("/api/v1/users", methods=['GET'])
def get_users():
    all_users = User.query.all()
    results = users_schema.dump(all_users)

    return jsonify(results)


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


# Run server
if __name__ == "__main__":
    app.run(debug=True, port="4000")
