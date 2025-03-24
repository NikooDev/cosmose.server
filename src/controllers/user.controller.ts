import FirebaseService from '@Server/services/firebase.service';
import { Request, Response } from 'express';

class UserController {
	/**
	 * @description Update (email, password) of user / admin
	 * @param req
	 * @param res
	 */
	public updateUser = async (req: Request, res: Response) => {
		const { userUID, role, newEmail, password, publicAddress, revoked } = req.body;
		const updateData: Record<string, string> = {};

		if (newEmail) updateData.email = newEmail;
		if (password) updateData.password = password;

		const isUser = ['user'].some(userRole => role.includes(userRole));

		try {
			if (Object.keys(updateData).length > 0) {
				await FirebaseService.Auth.updateUser(userUID, updateData);
			}

			if (publicAddress) {
				const collectionRef = FirebaseService.Firestore.collection('allowip');
				const docRef = collectionRef.doc(userUID);

				const updatedData = {
					allow: revoked,
					ip: publicAddress,
					userUID: userUID
				}

				await docRef.update(updatedData);
			}

			res.status(200).json({ success: true });
		} catch (error) {
			console.error(`Erreur lors de la création de l'${isUser ? 'utilisateur' : 'administrateur'} :`, error);
			res.status(500).json({ success: false });
		}
	}

	/**
	 * @description Create a new admin
	 * @param req
	 * @param res
	 */
	public createAdmin = async (req: Request, res: Response) => {
		const { email, password, publicAddress } = req.body;

		try {
			const userRecord = await FirebaseService.Auth.createUser({ email, password });

			const collectionRef = FirebaseService.Firestore.collection('allowip');
			const docRef = collectionRef.doc(userRecord.uid);

			const newAllowIp = {
				allow: true,
				ip: publicAddress,
				userUID: userRecord.uid
			}

			await docRef.create(newAllowIp);

			res.status(200).json({ success: true, uid: userRecord.uid });
		} catch (error) {
			console.error('Erreur lors de la création de l\'administrateur :', error);

			res.status(500).json({ success: false });
		}
	}

	/**
	 * @description Delete a single user by UID
	 */
	public deleteUser = async (req: Request, res: Response) => {
		const { uid } = req.params;

		try {
			await FirebaseService.Auth.deleteUser(uid);

			res.status(200).json({ success: true });
		} catch (error) {
			console.error('Erreur lors de la suppression de l’utilisateur :', error);

			res.status(500).json({ success: false });
		}
	}

	/**
	 * @description Delete all users of a company
	 */
	public deleteAllUsers = async (req: Request, res: Response) => {
		const users = req.body;

		if (!users || users.length === 0) {
			res.status(400).json({ success: false });
			return;
		}

		const uids = users.map((user: { uid: string }) => user.uid);

		try {
			const deleteResult = await FirebaseService.Auth.deleteUsers(uids);

			if (deleteResult.failureCount > 0) {
				console.error('Échecs de suppression:', deleteResult.errors);

				res.status(500).json({
					success: false
				});
				return;
			}

			res.status(200).json({ success: true });
		} catch (error) {
			console.error('Erreur lors de la suppression de tous les utilisateurs :', error);

			res.status(500).json({ success: false });
		}
	}

	public revokeUser = async (req: Request, res: Response) => {
		const { userUID } = req.body;

		if (!userUID) {
			res.status(400).json({ success: false });
			return
		}

		try {
			const collectionRef = FirebaseService.Firestore.collection('allowip');
			const docRef = collectionRef.doc(userUID);

			const updatedData = {
				userUID: userUID,
				allow: false
			}

			await docRef.update(updatedData);
			await FirebaseService.Auth.revokeRefreshTokens(userUID);

			res.status(200).json({ success: true });
		} catch (error) {
			console.error(error);

			res.status(500).json({ success: false });
		}
	}

	public unRevokeUser = async (req: Request, res: Response) => {
		const { userUID } = req.body;

		if (!userUID) {
			res.status(400).json({ success: false });
			return
		}

		try {
			const collectionRef = FirebaseService.Firestore.collection('allowip');
			const docRef = collectionRef.doc(userUID);

			const updatedData = {
				userUID: userUID,
				allow: true
			}

			await docRef.update(updatedData);

			res.status(200).json({ success: true });
		} catch (error) {
			console.error(error);

			res.status(500).json({ success: false });
		}
	}
}

export default new UserController();