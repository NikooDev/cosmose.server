import express from 'express';
import routes from '@Server/routes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
	origin: ['http://localhost:4000', 'https://cosmoseapp.vercel.app'],
	methods: ['DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(routes);

app.get('/', (_req, res: express.Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.json({name: 'Hello world'});
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});