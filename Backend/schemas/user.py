from ma import ma
from marshmallow import Schema, fields

class UserSchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    name = fields.Str()
    email = fields.Str()
    password = fields.Str()
    isAdmin = fields.Bool()