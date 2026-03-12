const config = require("../config");
const { authenticate } = require("../services/odooClient");
const { createOrUpdateContact } = require("../services/contactService");

async function main() {
  try {
    const uid = await authenticate(config.odoo);

    console.log("Authenticated to Odoo. UID:", uid);

    const shopifyCustomerId = "shopify-10001";

    const partnerData = {
      name: "Test Shopify Customer with ID",
      email: "shopify-id-customer@example.com",
      phone: "+49 555 000111",
      comment: "Created/updated via Shopify customer ID integration test",
    };

    const result = await createOrUpdateContact({
      odooConfig: config.odoo,
      uid,
      partnerData,
      shopifyCustomerId,
    });

    console.log("Result:", result);
  } catch (error) {
    console.error("Error in createOrUpdateContact test:", error.message);
    console.error(error);
  }
}

main();