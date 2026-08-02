-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "IncomeLevel" AS ENUM ('UNSPECIFIED', 'LOW', 'MIDDLE', 'HIGH');

-- CreateEnum
CREATE TYPE "DatasetImportStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "AiPurpose" AS ENUM ('RECOMMENDATION', 'RECIPE_CHAT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "age" INTEGER,
    "householdSize" INTEGER,
    "mealsPerDay" INTEGER,
    "incomeLevel" "IncomeLevel",
    "weeklyFoodBudget" DECIMAL(12,2),
    "dietPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedByTokenHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetImport" (
    "id" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "sourceFile" TEXT NOT NULL,
    "status" "DatasetImportStatus" NOT NULL DEFAULT 'PENDING',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "recipeCount" INTEGER NOT NULL DEFAULT 0,
    "ingredientCount" INTEGER NOT NULL DEFAULT 0,
    "pricedCount" INTEGER NOT NULL DEFAULT 0,
    "summary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "DatasetImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientAlias" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "normalizedAlias" TEXT NOT NULL,

    CONSTRAINT "IngredientAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "datasetImportId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "servings" DECIMAL(10,2),
    "servingType" TEXT,
    "preparationMinutes" INTEGER,
    "cookingMinutes" INTEGER,
    "difficulty" TEXT,
    "cookingMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultEstimatedCostTry" DECIMAL(12,2),
    "estimatedCostIsPartial" BOOLEAN NOT NULL DEFAULT true,
    "costableIngredientCount" INTEGER NOT NULL DEFAULT 0,
    "totalIngredientCount" INTEGER NOT NULL DEFAULT 0,
    "costCoverageRatio" DECIMAL(8,6),
    "costType" TEXT,
    "priceReferenceDate" DATE,
    "costReliability" TEXT,
    "allergenCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allergenDataStatus" TEXT NOT NULL DEFAULT 'inferred',
    "missingCoreIngredient" BOOLEAN NOT NULL DEFAULT false,
    "sourceMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT,
    "position" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "displayAmount" DECIMAL(16,4),
    "displayUnit" TEXT,
    "quantity" DECIMAL(16,4),
    "unit" TEXT,
    "costQuantity" DECIMAL(16,4),
    "costUnit" TEXT,
    "pricePerCostUnitTry" DECIMAL(16,6),
    "defaultEstimatedCostTry" DECIMAL(12,2),
    "costStatus" TEXT NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeChatSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "provider" TEXT,
    "model" TEXT,
    "fallback" BOOLEAN NOT NULL DEFAULT false,
    "fallbackReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "purpose" "AiPurpose" NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "providerRequestId" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "cachedInputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedUsd" DECIMAL(12,8) NOT NULL DEFAULT 0,
    "fallback" BOOLEAN NOT NULL DEFAULT false,
    "fallbackReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key","windowStart")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshSession_tokenHash_key" ON "RefreshSession"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshSession_userId_familyId_idx" ON "RefreshSession"("userId", "familyId");

-- CreateIndex
CREATE INDEX "RefreshSession_expiresAt_idx" ON "RefreshSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "DatasetImport_checksum_key" ON "DatasetImport"("checksum");

-- CreateIndex
CREATE INDEX "DatasetImport_active_status_idx" ON "DatasetImport"("active", "status");

-- CreateIndex
CREATE INDEX "Ingredient_normalizedName_idx" ON "Ingredient"("normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientAlias_normalizedAlias_key" ON "IngredientAlias"("normalizedAlias");

-- CreateIndex
CREATE INDEX "IngredientAlias_ingredientId_idx" ON "IngredientAlias"("ingredientId");

-- CreateIndex
CREATE INDEX "Recipe_datasetImportId_idx" ON "Recipe"("datasetImportId");

-- CreateIndex
CREATE INDEX "Recipe_normalizedTitle_idx" ON "Recipe"("normalizedTitle");

-- CreateIndex
CREATE INDEX "Recipe_category_idx" ON "Recipe"("category");

-- CreateIndex
CREATE INDEX "Recipe_difficulty_idx" ON "Recipe"("difficulty");

-- CreateIndex
CREATE INDEX "RecipeIngredient_ingredientId_idx" ON "RecipeIngredient"("ingredientId");

-- CreateIndex
CREATE INDEX "RecipeIngredient_normalizedName_idx" ON "RecipeIngredient"("normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_position_key" ON "RecipeIngredient"("recipeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStep_recipeId_order_key" ON "RecipeStep"("recipeId", "order");

-- CreateIndex
CREATE INDEX "RecipeChatSession_userId_createdAt_idx" ON "RecipeChatSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RecipeChatMessage_sessionId_createdAt_idx" ON "RecipeChatMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "AiUsage_createdAt_idx" ON "AiUsage"("createdAt");

-- CreateIndex
CREATE INDEX "AiUsage_userId_createdAt_idx" ON "AiUsage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAlias" ADD CONSTRAINT "IngredientAlias_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_datasetImportId_fkey" FOREIGN KEY ("datasetImportId") REFERENCES "DatasetImport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeChatSession" ADD CONSTRAINT "RecipeChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeChatSession" ADD CONSTRAINT "RecipeChatSession_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeChatMessage" ADD CONSTRAINT "RecipeChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RecipeChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
