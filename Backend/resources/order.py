from flask_restful import Resource
from models.order import OrderModel
from models.book import BookModel
from models.user import userModel
from schemas.order import OrderSchema
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

class Order(Resource):
    """Books' endpoint."""

    def get(self, id):
        data = request.get_json()    
    
        order = OrderModel.query.get(id) # este trae por ObjectId
        order_schema = OrderSchema()

        return jsonify(order_schema.dump(order)) 


class OrderList(Resource):
    """Order' list endpoint."""

    @jwt_required()
    def get(cls):
        current_user = get_jwt_identity()
        user = userModel.query.filter_by(email=current_user).first()
        orders_schema = OrderSchema(many=True)

        if user.isAdmin:
            all_orders = OrderModel.query.all()
        else:
            all_orders = OrderModel.query.filter(OrderModel.user.email == user.email).all()

        return jsonify(orders_schema.dump(all_orders))

    @jwt_required()
    def post(self):

        cart = []
        data = request.get_json()

        for book in data['cart']:
            new_book = BookModel(title = book['title'], description = book['description'], 
                price = int(book['price']), inStock = int(book['inStock']), category = book['category'])
            
            cart.append(new_book)

        new_user = userModel(name = data['user']['name'], email = data['user']['email'], password = '', isAdmin = False)

        new_order = OrderModel(cart = cart, user=new_user, address = data['address'], 
            delivered= False, paid= True,mobile = data['mobile'], 
            total = data['total'], paymentId= data['paymentId'])

        new_order.save() # o también se puede hacer db.session.add(new_order)

        order_schema = OrderSchema()

        return order_schema.jsonify(new_order)
