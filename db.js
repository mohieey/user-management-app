const fs = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_CREDS);
fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});

const db = fs.firestore();

console.log("firestore initialized.....");

module.exports = db;
