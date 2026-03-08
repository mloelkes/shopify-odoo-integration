const config = require("../config");
const { authenticate, executeKw } = require("../services/odooClient");

async function main() {
  try {
    const uid = await authenticate(config.odoo);

    console.log("Authenticated to Odoo. UID:", uid);

    const partnerData = {
      name: "Test Shopify Customer",
      email: "testshopify@example.com",
      phone: "+49 123 456789",
      comment: "Created via Node XML-RPC integration test",
    };

    const partnerId = await executeKw({
      url: config.odoo.url,
      db: config.odoo.db,
      uid,
      password: config.odoo.password,
      model: "res.partner",
      method: "create",
      args: [partnerData],
    });

    console.log("Created contact with ID:", partnerId);
  } catch (error) {
    console.error("Error creating contact:", error.message);
    console.error(error);
  }
}

main();