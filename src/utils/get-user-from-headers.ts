import { AppContext, ContextUser } from "src/types/app-context";
import { getTokenPayload } from "./jwt";
import prisma from "src/database/prisma";

export async function getUserFromHeaders(
  headers: AppContext["request"]["headers"],
): Promise<ContextUser | undefined> {
  const { authorization } = headers;

  if (!authorization || !authorization.startsWith("Bearer ")) return undefined;

  const token = authorization.slice(7);
  const { sub, userRole } = getTokenPayload(token);

  if (userRole === "student") {
    const student = await prisma.student.findUnique({
      where: {
        id: sub,
      },
    });

    return {
      created_at: student.created_at,
      id: student.id,
      name: student.name,
      role: "student",
      username: student.username,
    } as ContextUser;
  } else if (userRole === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: sub,
      },
    });

    return {
      created_at: teacher.created_at,
      id: teacher.id,
      name: teacher.name,
      role: "teacher",
      username: teacher.username,
    } as ContextUser;
  }
}
