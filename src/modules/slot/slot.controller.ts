import { Request, Response, NextFunction } from 'express';
import { generateSlotsForNextNDays } from './slot.service';

export async function generateSlots(req: Request, res: Response, next: NextFunction) {
    try {
        const { fieldId, days } = req.body;
        await generateSlotsForNextNDays(fieldId, days ?? 14);
        res.json({ message: 'Slots generated' });
    } catch (err) {
        next(err);
    }
}