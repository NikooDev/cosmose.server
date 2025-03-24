import firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
	type: process.env.FIREBASE_TYPE,
	project_id: process.env.FIREBASE_PROJECT_ID,
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: process.env.FIREBASE_AUTH_URI,
	token_uri: process.env.FIREBASE_TOKEN_URI,
	client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
} as firebaseAdmin.ServiceAccount;

class FirebaseService {
	private static auth: firebaseAdmin.auth.Auth;
	private static firestore: firebaseAdmin.firestore.Firestore;

	static {
		if (!firebaseAdmin.apps.length) {
			firebaseAdmin.initializeApp({
				credential: firebaseAdmin.credential.cert(firebaseConfig as firebaseAdmin.ServiceAccount),
			});
		}
		FirebaseService.auth = firebaseAdmin.auth();
		FirebaseService.firestore = firebaseAdmin.firestore();
	}

	static get Auth() {
		return FirebaseService.auth;
	}

	static get Firestore() {
		return FirebaseService.firestore;
	}
}

export default FirebaseService;