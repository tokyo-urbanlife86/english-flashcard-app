import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

function hasPrismaErrorCode(error: unknown, code: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
  );
}

/** ユニーク制約違反（同じ値がすでにある） */
export function isUniqueError(error: unknown) {
  return hasPrismaErrorCode(error, "P2002");
}

/** 更新・削除の対象が見つからない */
export function isNotFoundError(error: unknown) {
  return hasPrismaErrorCode(error, "P2025");
}
