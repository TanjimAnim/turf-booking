import { prisma } from '../lib/prisma';

export async function releaseExpiredHolds() {
    const now = new Date();

    const expiredSlots = await prisma.slot.findMany({
        where: { status: 'HOLD', holdExpiresAt: { lt: now } },
        select: { id: true, bookingId: true },
    });

    if (expiredSlots.length === 0) return;

    const slotIds = expiredSlots.map((s) => s.id);
    const bookingIds = [
        ...new Set(
            expiredSlots.map((s) => s.bookingId).filter((id): id is string => id !== null)
        ),
    ];

    await prisma.$transaction([
        prisma.slot.updateMany({
            where: { id: { in: slotIds } },
            data: { status: 'AVAILABLE', holdExpiresAt: null, bookingId: null },
        }),
        prisma.booking.updateMany({
            where: { id: { in: bookingIds }, status: 'PENDING_PAYMENT' },
            data: { status: 'EXPIRED' },
        }),
    ]);

    console.log(`Released ${slotIds.length} expired slot(s), expired ${bookingIds.length} booking(s)`);
}