import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { env } from "../src/env";

const prisma = new PrismaClient();

async function populate(): Promise<void> {
  const johnDoe = await prisma.student.create({
    data: {
      name: "John Doe",
      password: await bcrypt.hash("123123", Number(env.SALT_OR_ROUNDS)),
      username: "johhnydoe",
    },
  });

  const janeDoe = await prisma.student.create({
    data: {
      name: "Jane Doe",
      password: await bcrypt.hash("123123", Number(env.SALT_OR_ROUNDS)),
      username: "janedoe",
    },
  });

  const robertDoe = await prisma.teacher.create({
    data: {
      name: "Robert Doe",
      password: await bcrypt.hash("123123", Number(env.SALT_OR_ROUNDS)),
      username: "janedoe",
    },
  });

  const richardDoe = await prisma.teacher.create({
    data: {
      name: "Richard Doe",
      password: await bcrypt.hash("123123", Number(env.SALT_OR_ROUNDS)),
      username: "richarddoe",
    },
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      content: "lesson content",
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      content: "lesson content",
    },
  });

  const course1 = await prisma.course.create({
    data: {
      name: "Python Course",
      description: "Learn python in 7 days",
      banner: "banner.jpg",
      teacher: {
        connect: {
          id: robertDoe.id,
        },
      },
      lessons: {
        connect: {
          id: lesson1.id,
        },
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: "Typescript Course",
      description: "Learn typescript in 7 days",
      banner: "banner.jpg",
      teacher: {
        connect: {
          id: richardDoe.id,
        },
      },
      lessons: {
        connect: {
          id: lesson2.id,
        },
      },
    },
  });

  const johnCourse = await prisma.studentCourse.create({
    data: {
      student: {
        connect: {
          id: johnDoe.id,
        },
      },
      course: {
        connect: {
          id: course1.id,
        },
      },
    },
  });

  const johnLesson = await prisma.studentLesson.create({
    data: {
      student: {
        connect: {
          id: johnDoe.id,
        },
      },
      lesson: {
        connect: {
          id: lesson1.id,
        },
      },
    },
  });

  const janeCourse = await prisma.studentCourse.create({
    data: {
      student: {
        connect: {
          id: janeDoe.id,
        },
      },
      course: {
        connect: {
          id: course2.id,
        },
      },
    },
  });

  const janeLesson = await prisma.studentLesson.create({
    data: {
      student: {
        connect: {
          id: janeDoe.id,
        },
      },
      lesson: {
        connect: {
          id: lesson2.id,
        },
      },
    },
  });
}

populate().then(() => console.log("Database seeded successfully 🌱"));
