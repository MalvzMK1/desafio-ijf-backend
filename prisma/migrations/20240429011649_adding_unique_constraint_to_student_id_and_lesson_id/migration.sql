/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `StudentLesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId]` on the table `StudentLesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `StudentLesson_studentId_key` ON `StudentLesson`(`studentId`);

-- CreateIndex
CREATE UNIQUE INDEX `StudentLesson_lessonId_key` ON `StudentLesson`(`lessonId`);
