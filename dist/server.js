"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./src/routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8121;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:4000', 'https://cosmoseapp.vercel.app'],
    methods: ['DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(routes_1.default);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
