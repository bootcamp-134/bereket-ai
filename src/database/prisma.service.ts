import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

function createAdapter() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL tanımlı değil.");
  }

  return new PrismaNeon({ connectionString });
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: createAdapter() });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
