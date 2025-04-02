const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function clearAllData() {
    await prisma.car.deleteMany();
    await prisma.user.deleteMany();
    await prisma.comparison.deleteMany();
    await prisma.review.deleteMany();
    
    // reset id increment
    await prisma.$executeRaw`ALTER SEQUENCE "Car_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Comparison_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Review_id_seq" RESTART WITH 1;`;
}
module.exports = clearAllData;