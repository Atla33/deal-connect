-- Adicionar a coluna `productId` permitindo valores nulos
ALTER TABLE "Favorite" ADD COLUMN "productId" INTEGER;

-- Atualizar a coluna `productId` com valores apropriados ou nulos
-- Aqui você precisará definir como vai atualizar os valores existentes.
-- Por exemplo, se todos os favoritos existentes devem apontar para um produto específico,
-- você pode usar um produto padrão com ID 1 (ajuste conforme necessário):
UPDATE "Favorite" SET "productId" = 1 WHERE "productId" IS NULL;

-- Alterar a coluna `productId` para não permitir valores nulos
ALTER TABLE "Favorite" ALTER COLUMN "productId" SET NOT NULL;

-- Remover a coluna `favoritedUserId`
ALTER TABLE "Favorite" DROP COLUMN "favoritedUserId";

-- Adicionar a chave estrangeira
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Adicionar os índices necessários
CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON "Favorite"("userId", "productId");
