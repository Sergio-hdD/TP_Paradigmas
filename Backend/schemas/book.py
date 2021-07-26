from ma import ma
from marshmallow import Schema, fields

class BookSchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    title = fields.Str()
    description = fields.Str()
    price = fields.Int()
    inStock = fields.Int()
    category = fields.Str()

