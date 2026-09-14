import { Request, Response, NextFunction } from 'express';
import { createHold } from './booking.service';

export async function createBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, slotIds } = req.body;

        if (!userId || !Array.isArray(slotIds)) {
            return res.status(400).json({ error: 'userId and slotIds[] are required' });
        }

        const booking = await createHold(slotIds, userId);
        res.status(201).json({ booking });
    } catch (err) {
        next(err);
    }
}