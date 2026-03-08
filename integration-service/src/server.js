const express = require("express");
const config = require("./config");
const { authenticate } = require("./services/odooClient");
const { createOrUpdateContact } = require("./services/contactService");

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "shopify-odoo-integration",
  });
});

app.post("/webhooks/shopify/orders-create", async (req, res) => {
  try {
    const payload = req.body;

    const customer = payload.customer || {};
    const billingAddress = payload.billing_address || {};

    const email = customer.email || payload.email;
    const firstName = customer.first_name || billingAddress.first_name || "";
    const lastName = customer.last_name || billingAddress.last_name || "";
    const phone = customer.phone || billingAddress.phone || "";

    if (!email) {
      return res.status(400).json({
        error: "Missing customer email in payload",
      });
    }

    const uid = await authenticate(config.odoo);

    const partnerData = {
      name: `${firstName} ${lastName}`.trim() || "Shopify Customer",
      email,
      phone,
      comment: `Synced from Shopify order ${payload.name || payload.id || "unknown"}`,
    };

    const result = await createOrUpdateContact({
      odooConfig: config.odoo,
      uid,
      partnerData,
    });

    res.status(200).json({
      message: "Webhook processed successfully",
      result,
    });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

app.listen(config.port, () => {
  console.log(`Integration service listening on port ${config.port}`);
});