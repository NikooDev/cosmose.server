"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = express_1.default.Router();
router.post('/create/admin', user_controller_1.default.createAdmin.bind(this));
router.post('/revoke/user', user_controller_1.default.revokeUser.bind(this));
router.post('/unrevoke/user', user_controller_1.default.unRevokeUser.bind(this));
router.patch('/update/user', user_controller_1.default.updateUser.bind(this));
router.delete('/delete/users/:uid', user_controller_1.default.deleteUser.bind(this));
router.delete('/delete/users', user_controller_1.default.deleteAllUsers.bind(this));
exports.default = router;
