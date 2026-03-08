const { executeKw } = require("./odooClient");

async function findContactByEmail({ odooConfig, uid, email }) {
  const contacts = await executeKw({
    url: odooConfig.url,
    db: odooConfig.db,
    uid,
    password: odooConfig.password,
    model: "res.partner",
    method: "search_read",
    args: [[["email", "=", email]]],
    kwargs: {
      fields: ["id", "name", "email", "phone"],
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

async function createOrUpdateContact({ odooConfig, uid, partnerData }) {
  if (!partnerData.email) {
    throw new Error("Email is required for contact deduplication");
  }

  const existingContact = await findContactByEmail({
    odooConfig,
    uid,
    email: partnerData.email,
  });

  if (existingContact) {
    const updatedId = await updateContact({
      odooConfig,
      uid,
      contactId: existingContact.id,
      partnerData,
    });

    return {
      action: "updated",
      contactId: updatedId,
      existingContact,
    };
  }

  const newId = await createContact({
    odooConfig,
    uid,
    partnerData,
  });

  return {
    action: "created",
    contactId: newId,
    existingContact: null,
  };
}

module.exports = {
  findContactByEmail,
  createContact,
  updateContact,
  createOrUpdateContact,
};