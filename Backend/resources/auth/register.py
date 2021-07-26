from flask_restful import Resource
from models.user import userModel
from schemas.user import UserSchema
from flask import jsonify, request
from flask_jwt_extended import jwt_required

class Register(Resource):
    """Register' endpoint."""

    def post(self):

        userByEmail = userModel.query.filter_by(email=request.json.get('email')).first()

        if userByEmail:
            return jsonify({'err' : 'This email already exists.'})

        new_user = userModel(name = request.json.get('username'), email = request.json.get('email'), password = request.json.get('password'), isAdmin = False)
        new_user.hash_password(request.json.get('password'))
        
        new_user.save()  

        return jsonify({'msg': 'Registered Successfully'})