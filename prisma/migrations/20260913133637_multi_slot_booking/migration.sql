/*
  Warnings:

  - You are about to drop the column `slotId` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_slotId_fkey";

-- DropIndex
DROP INDEX "Booking_slotId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "slotId";

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "bookingId" TEXT;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
