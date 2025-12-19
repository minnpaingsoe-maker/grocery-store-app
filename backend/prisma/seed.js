const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: 'Apple', description: 'Fresh red apple', price: 0.5, imageUrl: "/images/apple.jpg", stock: 10 },
    { name: 'Banana', description: 'Yellow banana', price: 0.3, imageUrl: "/images/banana.jpg", stock: 10 },
    { name: 'Orange', description: 'Juicy orange', price: 0.6, imageUrl: "/images/orange.jpg", stock: 10 },
    { name: 'Milk', description: '1L fresh milk', price: 1.2, imageUrl: "/images/milk.jpg", stock: 10 },
    { name: 'Bread', description: 'Whole wheat bread', price: 1.0, imageUrl: "/images/bread.jpg", stock: 10 },
    { name: 'Eggs', description: 'Pack of 12 eggs', price: 2.0, imageUrl: "/images/egg.jpg", stock: 10 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  console.log('Sample products inserted.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
