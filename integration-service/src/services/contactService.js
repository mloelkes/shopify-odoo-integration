const { executeKw } = require("./odooClient");

async function findContactByShopifyId({ odooConfig, uid, shopifyCustomerId }) {
  if (!shopifyCustomerId) return null;

  const contacts = await executeKw({
    url: odooConfig.url,
    db: odooConfig.db,
    uid,
    password: odooConfig.password,
    model: "res.partner",
    method: "search_read",
    args: [[["x_shopify_customer_id", "=", String(shopifyCustomerId)]]],
    kwargs: {
      fields: ["id", "name", "email", "phone", "x_shopify_customer_id"],
      limit: 1,
    },
  });

  return contacts.length > 0 ? contacts[0] : null;
}

async function findContactByEmail({ odooConfig, uid, email }) {
  if (!email) return null;

  const contacts = await executeKw({
    url: odooConfig.url,
    db: odooConfig.db,
    uid,
    password: odooConfig.password,
    model: "res.partner",
    method: "search_read",
    args: [[["email", "=", email]]],
    kwargs: {
      fields: ["id", "name", "email", "phone", "x_shopify_customer_id"],
      limit: 1,
    },
  });

  return contacts.length > 0 ? contacts[0] : null;
}

async function createContact({ odooConfig, uid, partnerData }) {
  return executeKw({
    url: odooConfig.url,
    db: odooConfig.db,
    uid,
    password: odooConfig.password,
    model: "res.partner",
    method: "create",
    args: [partnerData],
  });
}

async function updateContact({ odooConfig, uid, contactId, partnerData }) {
  await executeKw({
    url: odooConfig.url,
    db: odooConfig.db,
    uid,
    password: odooConfig.password,
    model: "res.partner",
    method: "write",
    args: [[contactId], partnerData],
  });

  return contactId;
}

async function createOrUpdateContact({ odooConfig, uid, partnerData, shopifyCustomerId }) {
  if (!shopifyCustomerId && !partnerData.email) {
    throw new Error("Either Shopify customer ID or email is required for deduplication");
  }

  let existingContact = null;
  let matchedBy = null;

  if (shopifyCustomerId) {
    existingContact = await findContactByShopifyId({
      odooConfig,
      uid,
      shopifyCustomerId,
    });
    if (existingContact) matchedBy = "shopify_customer_id";
  }

  if (!existingContact && partnerData.email) {
    existingContact = await findContactByEmail({
      odooConfig,
      uid,
      email: partnerData.email,
    });
    if (existingContact) matchedBy = "email";
  }

  const finalPartnerData = {
    ...partnerData,
    x_shopify_customer_id: shopifyCustomerId ? String(shopifyCustomerId) : partnerData.x_shopify_customer_id,
  };

  if (existingContact) {
    const updatedId = await updateContact({
      odooConfig,
      uid,
      contactId: existingContact.id,
      partnerData: finalPartnerData,
    });

    return {
      action: "updated",
      matchedBy,
      contactId: updatedId,
      existingContact,
    };
  }

  const newId = await createContact({
    odooConfig,
    uid,
    partnerData: finalPartnerData,
  });

  return {
    action: "created",
    matchedBy: null,
    contactId: newId,
    existingContact: null,
  };
}

module.exports = {
  findContactByShopifyId,
  findContactByEmail,
  createContact,
  updateContact,
  createOrUpdateContact,
};