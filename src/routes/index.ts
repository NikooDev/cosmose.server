import express from 'express';
import UserController from '@Server/controllers/user.controller';

const router = express.Router();

router.post('/create/admin', UserController.createAdmin.bind(this));
router.post('/revoke/user', UserController.revokeUser.bind(this));
router.post('/unrevoke/user', UserController.unRevokeUser.bind(this));
router.patch('/update/user', UserController.updateUser.bind(this));
router.delete('/delete/users/:uid', UserController.deleteUser.bind(this));
router.delete('/delete/users', UserController.deleteAllUsers.bind(this));

export default router;