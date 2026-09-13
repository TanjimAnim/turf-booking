import { prisma } from "../../lib/prisma";
import { SLOT_CONFIG } from "./slot.config";


function addMinutes(time: string, minutes: number): string {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const hh = Math.floor((total / 60) % 24)
        .toString()
        .padStart(2, '0');
    const mm = (total % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
}

export async function generateSlotsForDate(fieldId: string, date: Date) {
    const { slotDurationMinutes, slotsPerDay, startTime, pricePerSlot } = SLOT_CONFIG;

    const slotsData = Array.from({ length: slotsPerDay }, (_, i) => {
        const start = addMinutes(startTime, i * slotDurationMinutes);
        const end = addMinutes(startTime, (i + 1) * slotDurationMinutes);
        return {
            fieldId,
            date,
            startTime: start,
            endTime: end,
            price: pricePerSlot,
        };
    });

    // skipDuplicates relies on the @@unique([fieldId, date, startTime]) constraint —
    // safe to re-run for a date that already has slots
    await prisma.slot.createMany({ data: slotsData, skipDuplicates: true });
}

export async function generateSlotsForNextNDays(fieldId: string, days: number) {
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);
        await generateSlotsForDate(fieldId, date);
    }
}