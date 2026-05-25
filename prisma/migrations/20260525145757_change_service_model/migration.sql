/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `ServiceTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `recurrence` on the `ServiceTemplate` table. All the data in the column will be lost.
  - Added the required column `date` to the `ServiceTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceTemplate" DROP COLUMN "dayOfWeek",
DROP COLUMN "recurrence",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
