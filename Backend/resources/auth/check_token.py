from flask_restful import Resource
from models.user import userModel
from schemas.user import UserSchema
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

class CheckToken(Resource):
    """Register' endpoint."""

    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = userModel.query.filter_by(email=current_user).first()
        return jsonify({'user' : {
                'email': user.email,
                'name': user.name,
                'isAdmin': user.isAdmin
                }})
