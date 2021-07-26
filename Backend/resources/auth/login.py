from flask_restful import Resource
from models.user import userModel
from schemas.user import UserSchema
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

class Login(Resource):
    """Login' endpoint."""

    def post(self):
        params = request.get_json() 
        
        email = params.get('email')
        password = params.get('password')

        if not email:
            return jsonify({"err": "Missing email parameter"})
        if not password:
            return jsonify({"err": "Missing password parameter"})

        user = userModel.query.filter_by(email=email).first()

        if user is None or not check_password_hash(user.password, password):
            return jsonify({"err": "Bad username or password"})

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
