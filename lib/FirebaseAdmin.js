const admin = require("firebase-admin");
const dotenv = require("dotenv");
const { FirebaseController } = require('../controllers/FirebaseController');

dotenv.config(); // ENV

if (!admin.apps.length) {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDE,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT,
    universe_domain: process.env.FIREBASE_UNI_DOMAIN,
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://chapter-9-binar-cdadd.appspot.com'
  });
}
const storage = admin.storage().bucket();

module.exports = admin;
