import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';

const HOLD_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function createHold(slotIds: string[], userId: string) {
    if (slotIds.length === 0) {
        throw new AppError(400, 'At least one slot must be selected');
    }

    return prisma.$transaction(async (tx) => {
        const holdExpiresAt = new Date(Date.now() + HOLD_DURATION_MS);

        // Atomic claim: only succeeds for slots currently AVAILABLE.
        // If even one requested slot was already taken, count will be less
        // than slotIds.length, and we roll back the whole thing.
        const result = await tx.slot.updateMany({
            where: { id: { in: slotIds }, status: 'AVAILABLE' },
            data: { status: 'HOLD', holdExpiresAt },
        });

        if (result.count !== slotIds.length) {
            throw new AppError(409, 'One or more selected slots are no longer available');
        }

        const slots = await tx.slot.findMany({ where: { id: { in: slotIds } } });
        const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);

        const booking = await tx.booking.create({
            data: {
                userId,
                totalPrice,
                status: 'PENDING_PAYMENT',
                slots: { connect: slotIds.map((id) => ({ id })) },
            },
            include: { slots: true },
        });

        return booking;
    });
}