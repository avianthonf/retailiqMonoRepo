let _prisma: any = null;

export const prisma = new Proxy({} as any, {
  get: (target, prop) => {
    if (!_prisma) {
      try {
        const { PrismaClient } = require("@prisma/client");
        _prisma = new PrismaClient({
          log: ["error"],
        });
      } catch (e: any) {
        console.error("CRITICAL: Failed to initialize PrismaClient", e.message);
        // Return a proxy that throws for any operation, explaining the issue
        return new Proxy({} as any, {
          get: () => {
             throw new Error("Prisma Client not generated. Please run 'npx prisma generate'.");
          }
        });
      }
    }
    return _prisma[prop];
  }
});
