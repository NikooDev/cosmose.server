import express from 'express';
import routes from '@Server/routes';
import cors from 'cors';

const app = express();
const port = 8121;

app.use(express.json());

app.use(cors({
	origin: ['http://localhost:4000', 'https://cosmoseapp.vercel.app'],
	methods: ['DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(routes);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});