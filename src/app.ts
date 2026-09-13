import express from 'express';
import cors from 'cors';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import fieldRoutes from './modules/field/field.routes';
import slotRoutes from "./modules/slot/slot.routes"
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/fields', fieldRoutes);
app.use('/api/slots', slotRoutes);
// app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;