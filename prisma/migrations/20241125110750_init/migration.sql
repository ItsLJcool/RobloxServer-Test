-- CreateTable
CREATE TABLE "RobloxUser" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "RobloxUserData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "robloxUserId" TEXT NOT NULL,
    CONSTRAINT "RobloxUserData_robloxUserId_fkey" FOREIGN KEY ("robloxUserId") REFERENCES "RobloxUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SolRngData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "robloxUserDataId" TEXT,
    "name" TEXT NOT NULL,
    "chance" INTEGER NOT NULL,
    CONSTRAINT "SolRngData_robloxUserDataId_fkey" FOREIGN KEY ("robloxUserDataId") REFERENCES "RobloxUserData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RobloxUser_id_key" ON "RobloxUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RobloxUserData_id_key" ON "RobloxUserData"("id");
