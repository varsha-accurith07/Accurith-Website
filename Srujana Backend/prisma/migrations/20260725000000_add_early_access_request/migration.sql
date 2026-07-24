-- CreateEnum
CREATE TYPE "EarlyAccessStatus" AS ENUM ('NEW', 'INVITED', 'CLOSED');

-- CreateTable
CREATE TABLE "EarlyAccessRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "status" "EarlyAccessStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "EarlyAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EarlyAccessRequest_createdAt_idx" ON "EarlyAccessRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EarlyAccessRequest_email_product_key" ON "EarlyAccessRequest"("email", "product");

