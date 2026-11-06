const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Current users:", users.map(u => u.email));

  for (const email of ["grader.test@example.com", "grader.qe190108@example.com", "grader.qe190031@example.com"]) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash("Test1234!", 10);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
        },
      });
      console.log(`Created account: ${email} (ID: ${user.id})`);
    } else {
      console.log(`Account already exists: ${email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

