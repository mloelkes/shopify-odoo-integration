require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  odoo: {
    url: process.env.ODOO_URL,
    db: process.env.ODOO_DB,
    username: process.env.ODOO_USERNAME,
    password: process.env.ODOO_PASSWORD,
  },
};