from flask_restful import Resource
from models.user import userModel
from schemas.user import UserSchema
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

class ResetPassword(Resource):
    """ResetPassword' endpoint."""

    @jwt_required()
    def patch(self):
        current_user = get_jwt_identity()
        user = userModel.query.filter_by(email=current_user).first()

        if not user:
            return jsonify({'err': 'The user does not exist.'})
        
        data = request.get_json()

        user.password = data['password']
        user.hash_password(request.json.get('password'))
        
        user.save()

        return jsonify({'msg': 'Password updated Succesfully.'})


class updateName(Resource):
    """ResetPassword' endpoint."""

    @jwt_required()
    def patch(self):
        current_user = get_jwt_identity()
        user = userModel.query.filter_by(email=current_user).first()

        if not user:
            return jsonify({'err': 'The user does not exist.'})
        
        data = request.get_json()

        user.name = data['name']
        
        user.save()

        user_schema = UserSchema() 

        return user_schema.jsonify(user)