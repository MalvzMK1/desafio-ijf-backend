/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `StudentCourse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId]` on the table `StudentCourse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `StudentCourse_studentId_key` ON `StudentCourse`(`studentId`);

-- CreateIndex
CREATE UNIQUE INDEX `StudentCourse_courseId_key` ON `StudentCourse`(`courseId`);
