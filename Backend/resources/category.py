from flask_restful import Resource
from flask import jsonify, request
from models.category import CategoryModel
from schemas.category import CategorySchema
from flask_jwt_extended import jwt_required

class Category(Resource):
    """category endpoint."""

    def get(self, id):
        category = CategoryModel.query.get(id)
        category_schema = CategorySchema()
        
        return jsonify(category_schema.dump(category))


#    @jwt_required()
    def put(self, id):
        category = CategoryModel.query.get(id)

        data = request.get_json()

        category.name = data['name']

        category.save()
       
        category_schema = CategorySchema()

        return jsonify({
            'msg': 'Category Updated Successfully.',
            'category': category_schema.dump(category)
        })

    
    def delete(self, id):
        category = CategoryModel.query.get(id)
        if category:
            category.remove()
            return jsonify({'msg': 'Category deleted Successfully.'})
        return {'err' : 'The category does not exist.'}

        
class CategoryList(Resource):
    """categories list endpoint."""

    def get(cls):
        
        all_categories = CategoryModel.query.all()
        categories_schema = CategorySchema(many=True)
        results = categories_schema.dump(all_categories)

        return jsonify(results)


#    @jwt_required()
    def post(self):
        
        data = request.get_json()    

        new_category = CategoryModel(name = data['name'])
        
        if CategoryModel.query.filter_by(name=data['name']).first(): # otra forma es Book.query.filter(Book.title == data['title']).first():
            return jsonify({'err': 'The book is already added.'})

        new_category.save() # o también se puede hacer db.session.add(new_book)

        category_schema = CategorySchema()

        return jsonify({
            'msg': 'Category Created Successfully.',
            'newCategory': category_schema.dump(new_category)
        })
