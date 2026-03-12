from odoo import fields, models


class ResPartner(models.Model):
    _inherit = "res.partner"

    x_shopify_customer_id = fields.Char(
        string="Shopify Customer ID",
        index=True,
        help="Unique customer identifier from Shopify"
    )