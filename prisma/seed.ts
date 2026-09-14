import { prisma } from '../src/lib/prisma';

async function main() {
    const venue = await prisma.venue.create({
        data: {
            name: 'Main Venue',
            address: 'Dhaka, Bangladesh',
        },
    });

    const field = await prisma.field.create({
        data: {
            venueId: venue.id,
            name: 'Main Field',
            sportType: 'football',
            openTime: '10:00',
            closeTime: '01:00',
            pricePerHour: 2000,
        },
    });

    console.log('Seeded venue:', venue.id);
    console.log('Seeded field:', field.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });