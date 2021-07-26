from flask_restful import Resource
from models.book import BookModel
from schemas.book import BookSchema
from flask import jsonify, request
from flask_jwt_extended import jwt_required

class Book(Resource):
    """Books' endpoint."""

    def get(self, id):

        book = BookModel.query.get(id) # este trae por ObjectId
        book_schema = BookSchema()

        return jsonify(book_schema.dump(book))

    @jwt_required()
    def put(self, id):

        book = BookModel.query.get(id)

        data = request.get_json()

        book.title = data['title']
        book.description = data['description']
        book.price = data['price'] 
        book.inStock = data['inStock']
        book.category = data['category']

        book.save()

        book_schema = BookSchema()

        return jsonify({
            'msg': 'Book Updated Successfully.',
            'book': book_schema.dump(book)
        })


    def delete(self, id):

        book = BookModel.query.get(id)
        if book:
            book.remove()
            return jsonify({'msg': 'Book deleted Successfully.'})
        return {'err' : 'The book does not exist.'}


class BookList(Resource):
    """Books' list endpoint."""

    def get(cls):
        all_books = BookModel.query.all()
        books_schema = BookSchema(many=True)
        results = books_schema.dump(all_books)

        return jsonify(results)

    @jwt_required()
    def post(self):

        data = request.get_json()    

        new_book = BookModel(title = data['title'], description = data['description'],
        price = int(data['price']), inStock = int(data['inStock']),
        category = data['category'])
        
        if BookModel.query.filter_by(title=data['title']).first(): # otra forma es Book.query.filter(Book.title == data['title']).first():
            return jsonify({'err': 'The book is already added.'})

        new_book.save() # o también se puede hacer db.session.add(new_book)

        book_schema = BookSchema()

        return jsonify({
            'msg': 'Book Created Successfully.',
            'newBook': book_schema.dump(new_book)
        })
