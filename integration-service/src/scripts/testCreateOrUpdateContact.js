const config = require("../config");
const { authenticate } = require("../services/odooClient");
const { createOrUpdateContact } = require("../services/contactService");

async function main() {
  try {
    const uid = await authenticate(config.odoo);

    console.log("Authenticated to Odoo. UID:", uid);

    const partnerData = {
      name: "Test Shopify Customer Updated",
      email: "testshopify@example.com",
      phone: "+49 987 654321",
      comment: "Updated via createOrUpdateContact test",
    };

    const result = await createOrUpdateContact({
      odooConfig: config.odoo,
      uid,
      partnerData,
    });

    console.log("Result:", result);
  } catch (error) {
    console.error("Error in createOrUpdateContact test:", error.message);
    console.error(error);
  }
}

main();