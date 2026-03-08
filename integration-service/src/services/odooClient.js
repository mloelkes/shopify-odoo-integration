const xmlrpc = require("xmlrpc");

function createClient(url, path) {
  return xmlrpc.createClient({
    url: `${url}${path}`,
  });
}

async function authenticate({ url, db, username, password }) {
  const common = createClient(url, "/xmlrpc/2/common");

  return new Promise((resolve, reject) => {
    common.methodCall("authenticate", [db, username, password, {}], (error, uid) => {
      if (error) {
        reject(error);
      } else if (!uid) {
        reject(new Error("Authentication failed: no UID returned"));
      } else {
        resolve(uid);
      }
    });
  });
}

async function executeKw({ url, db, uid, password, model, method, args = [], kwargs = {} }) {
  const object = createClient(url, "/xmlrpc/2/object");

  return new Promise((resolve, reject) => {
    object.methodCall(
      "execute_kw",
      [db, uid, password, model, method, args, kwargs],
      (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      }
    );
  });
}

module.exports = {
  authenticate,
  executeKw,
};