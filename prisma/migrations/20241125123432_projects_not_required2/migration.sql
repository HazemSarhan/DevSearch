-- DropForeignKey
ALTER TABLE "Skills" DROP CONSTRAINT "Skills_projectId_fkey";

-- AlterTable
ALTER TABLE "Skills" ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
