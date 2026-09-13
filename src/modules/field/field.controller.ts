import { Request, Response, NextFunction } from 'express';

export async function getFields(_req: Request, res: Response, next: NextFunction) {
    try {
        res.json({ fields: [] }); // wire up field.service later
    } catch (err) {
        next(err);
    }
}