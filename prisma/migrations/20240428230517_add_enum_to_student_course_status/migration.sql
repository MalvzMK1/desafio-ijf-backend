/*
  Warnings:

  - You are about to alter the column `status` on the `StudentCourse` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `StudentCourse` MODIFY `status` ENUM('notStarted', 'inProgress', 'finished', 'approved') NOT NULL DEFAULT 'notStarted';
