from ma import ma
from marshmallow import Schema, fields
from .book import BookSchema
from .user import UserSchema

class OrderSchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    cart = fields.List(fields.Nested(BookSchema))
    user = fields.Nested(UserSchema)
    address = fields.Str()
    mobile = fields.Str()
    created_at = fields.Date()
    total = fields.Int()
    delivered = fields.Bool()
    paid = fields.Bool()
    paymentId= fields.Str()