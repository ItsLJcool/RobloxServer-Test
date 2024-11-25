/*
  Warnings:

  - You are about to drop the `RobloxUserData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `robloxUserDataId` on the `SolRngData` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "RobloxUserData_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RobloxUserData";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SolRngData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "chance" INTEGER NOT NULL,
    "robloxUserId" TEXT,
    CONSTRAINT "SolRngData_robloxUserId_fkey" FOREIGN KEY ("robloxUserId") REFERENCES "RobloxUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SolRngData" ("chance", "id", "name") SELECT "chance", "id", "name" FROM "SolRngData";
DROP TABLE "SolRngData";
ALTER TABLE "new_SolRngData" RENAME TO "SolRngData";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
