"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_service_1 = __importDefault(require("../services/firebase.service"));
class UserController {
    constructor() {
        /**
         * @description Update (email, password) of user / admin
         * @param req
         * @param res
         */
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userUID, role, newEmail, password, publicAddress, revoked } = req.body;
            const updateData = {};
            if (newEmail)
                updateData.email = newEmail;
            if (password)
                updateData.password = password;
            const isUser = ['user'].some(userRole => role.includes(userRole));
            try {
                if (Object.keys(updateData).length > 0) {
                    yield firebase_service_1.default.Auth.updateUser(userUID, updateData);
                }
                if (publicAddress) {
                    const collectionRef = firebase_service_1.default.Firestore.collection('allowip');
                    const docRef = collectionRef.doc(userUID);
                    const updatedData = {
                        allow: revoked,
                        ip: publicAddress,
                        userUID: userUID
                    };
                    yield docRef.update(updatedData);
                }
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(`Erreur lors de la création de l'${isUser ? 'utilisateur' : 'administrateur'} :`, error);
                res.status(500).json({ success: false });
            }
        });
        /**
         * @description Create a new admin
         * @param req
         * @param res
         */
        this.createAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, publicAddress } = req.body;
            try {
                const userRecord = yield firebase_service_1.default.Auth.createUser({ email, password });
                const collectionRef = firebase_service_1.default.Firestore.collection('allowip');
                const docRef = collectionRef.doc(userRecord.uid);
                const newAllowIp = {
                    allow: true,
                    ip: publicAddress,
                    userUID: userRecord.uid
                };
                yield docRef.create(newAllowIp);
                res.status(200).json({ success: true, uid: userRecord.uid });
            }
            catch (error) {
                console.error('Erreur lors de la création de l\'administrateur :', error);
                res.status(500).json({ success: false });
            }
        });
        /**
         * @description Delete a single user by UID
         */
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.params;
            try {
                yield firebase_service_1.default.Auth.deleteUser(uid);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error('Erreur lors de la suppression de l’utilisateur :', error);
                res.status(500).json({ success: false });
            }
        });
        /**
         * @description Delete all users of a company
         */
        this.deleteAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = req.body;
            if (!users || users.length === 0) {
                res.status(400).json({ success: false });
                return;
            }
            const uids = users.map((user) => user.uid);
            try {
                const deleteResult = yield firebase_service_1.default.Auth.deleteUsers(uids);
                if (deleteResult.failureCount > 0) {
                    console.error('Échecs de suppression:', deleteResult.errors);
                    res.status(500).json({
                        success: false
                    });
                    return;
                }
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error('Erreur lors de la suppression de tous les utilisateurs :', error);
                res.status(500).json({ success: false });
            }
        });
        this.revokeUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userUID } = req.body;
            if (!userUID) {
                res.status(400).json({ success: false });
                return;
            }
            try {
                const collectionRef = firebase_service_1.default.Firestore.collection('allowip');
                const docRef = collectionRef.doc(userUID);
                const updatedData = {
                    userUID: userUID,
                    allow: false
                };
                yield docRef.update(updatedData);
                yield firebase_service_1.default.Auth.revokeRefreshTokens(userUID);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
        this.unRevokeUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userUID } = req.body;
            if (!userUID) {
                res.status(400).json({ success: false });
                return;
            }
            try {
                const collectionRef = firebase_service_1.default.Firestore.collection('allowip');
                const docRef = collectionRef.doc(userUID);
                const updatedData = {
                    userUID: userUID,
                    allow: true
                };
                yield docRef.update(updatedData);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
}
exports.default = new UserController();
