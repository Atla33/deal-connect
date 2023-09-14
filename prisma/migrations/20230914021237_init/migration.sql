-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "favoritedUserId" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuRU" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "meals" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "menuUserId" INTEGER NOT NULL,

    CONSTRAINT "MenuRU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "userIdDishes" INTEGER NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DishToMenuRU" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DishToMenuRU_AB_unique" ON "_DishToMenuRU"("A", "B");

-- CreateIndex
CREATE INDEX "_DishToMenuRU_B_index" ON "_DishToMenuRU"("B");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_favoritedUserId_fkey" FOREIGN KEY ("favoritedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuRU" ADD CONSTRAINT "MenuRU_menuUserId_fkey" FOREIGN KEY ("menuUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_userIdDishes_fkey" FOREIGN KEY ("userIdDishes") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishToMenuRU" ADD CONSTRAINT "_DishToMenuRU_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishToMenuRU" ADD CONSTRAINT "_DishToMenuRU_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuRU"("id") ON DELETE CASCADE ON UPDATE CASCADE;
