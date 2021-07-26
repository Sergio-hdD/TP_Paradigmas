from ma import ma
from marshmallow import Schema, fields


class CategorySchema(ma.Schema):
    id = fields.Str(attribute="mongo_id")
    name = fields.Str()

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)