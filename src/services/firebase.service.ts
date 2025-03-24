import firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';
import serviceAccount from '@Server/private/cosmoseapp.json';

dotenv.config();

class FirebaseService {
	private static auth: firebaseAdmin.auth.Auth;
	private static firestore: firebaseAdmin.firestore.Firestore;

	static {
		if (!firebaseAdmin.apps.length) {
			firebaseAdmin.initializeApp({
				credential: firebaseAdmin.credential.cert(serviceAccount as firebaseAdmin.ServiceAccount),
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