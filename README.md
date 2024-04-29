# School API

This API was built for a challenge.

## Getting started

After cloning into your PC, run the following script to install the dependencies.

```bash
pnpm i
```

To init the database, run the docker compose file:

```bash
docker-compose up -d
```

To start the application, run the following script:

```bash
npx prisma migrate
pnpm seed
pnpm start
```

Now you can test the API.

## GraphQL Playground

Every e2e test can be made in the GraphQL Playground: `http://localhost:3000/graphql`

## Auth

1. Login according to the role

```graphql
mutation login {
  login(input: { username: "janedoe", password: "123123", role: student }) {
    token
  }
}

mutation loginTeacher {
  login(input: { username: "richarddoe", password: "123123", role: teacher }) {
    token
  }
}
```

2. After getting the token, pass it through the `Authorization header`

```json
{
  "Authorization": "bearer JWT_TOKEN"
}
```

Each route has its accepted roles, if a student tries to create a course, it will receive an `Unauthorized Error`, likewise if a teacher tries to watch a lesson.

## Student

1. First, you need to register yourself with the mutation `registerUser`.

```graphql
mutation register {
  registerUser(
    input: {
      name: "Jonas Rodriguez"
      password: "123123"
      username: "jonas.rod"
      role: student
    }
  ) {
    id
    created_at
  }
}
```

2. As a student, you can see your courses and lessons.

```graphql
query fetchCourses {
  fetchCourses {
    id
    name
    studentCourses {
      student {
        studentLessons {
          lessonId
          watched
        }
      }
      status
    }
    lessons {
      id
      content
    }
  }
}
```

3. You can watch your lessons.

```graphql
mutation watchLesson {
  watchLesson(input: { lessonId: "e6449abf-f7fe-4c47-bb49-3e8fbb90b49c" }) {
    watched
    lesson {
      id
      content
    }
  }
}
```

## Teacher

1. Register.

```graphql
mutation register {
  registerUser(
    input: {
      name: "John Doe"
      password: "123123"
      username: "jonnhy"
      role: teacher
    }
  ) {
    id
    created_at
  }
}
```

2. As a teacher, you can see all courses / students / lessons

```graphql
query fetchCourses {
  fetchCourses {
    id
    name
    studentCourses {
      student {
        id
        name
        studentLessons {
          lessonId
          watched
        }
      }
      status
    }
    lessons {
      id
      content
    }
  }
}
```

3. As a teacher, you can create, edit and delete courses.

```graphql
mutation createCourse {
  createCourse(
    input: {
      name: "Python course"
      banner: "banner.jpg"
      teacherId: "afe0a464-e0cc-4ded-bac9-647c4b922edb"
      lessons: [{ content: "content1" }, { content: "content2" }]
      description: "Lorem ipsum"
    }
  ) {
    name
    id
  }
}

mutation editCourse {
  editCourse(
    input: {
      id: "e7769efd-b92b-4db4-a4c9-c2e546c8ac3e"
      description: "Another description"
    }
  ) {
    id
    description
    name
  }
}

mutation deleteCourse {
  deleteCourse(input: { id: "d5892bd5-2f7c-4db3-88b7-c2fe22725c46" }) {
    id
    name
  }
}
```

4. As a teacher, you can see every student

```graphql
query getStudents {
  fetchStudents {
    students {
      id
      name
      username
    }
  }
}
```

5. As a teacher, you can add and remove students from a course

```graphql
mutation addStudent {
  addStudentToCourse(
    input: {
      studentId: "e6449abf-f7fe-4c47-bb49-3e8fbb90b49c"
      courseId: "0584959f-ec6c-43cd-931a-514f07112b39"
    }
  ) {
    id
    name
    studentCourses {
      student {
        name
      }
      status
    }
  }
}

mutation removeStudent {
  removeStudentFromCourse(
    input: {
      studentId: "ed18b780-b3db-46ea-a303-79d41699b9fc"
      courseId: "72d709b4-c77c-4816-b046-cf16098756d5"
    }
  ) {
    message
  }
}
```

6. As a teacher, you can approve students if they finished the course

The ID refers to the studentLesson entity ID

```graphql
mutation approve {
  approveStudent(input: { id: "d13f5bf5-3fd9-4fef-9b14-e1db1553b503" }) {
    id
    status
  }
}
```
