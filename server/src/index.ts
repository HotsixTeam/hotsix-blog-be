import express from 'express';
import { sequelize } from './config/database';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.DB_PORT || 3000;

app.use(express.json());
app.use('/api', userRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync();  // 데이터베이스와 모델 동기화
    })
    .then(() => {
        app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });