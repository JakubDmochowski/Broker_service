-- CreateEnum
CREATE TYPE "SystemType" AS ENUM ('SYSTEMA', 'SYSTEMB');

-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "system" "SystemType" NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);
