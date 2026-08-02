-- CreateTable
CREATE TABLE "AiBudgetPeriod" (
    "periodStart" DATE NOT NULL,
    "limitUsd" DECIMAL(12,8) NOT NULL,
    "remainingUsd" DECIMAL(12,8) NOT NULL,
    "spentUsd" DECIMAL(12,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiBudgetPeriod_pkey" PRIMARY KEY ("periodStart")
);
