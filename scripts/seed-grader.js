const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const graderEmail = "grader.qe190108@example.com";
  let user = await prisma.user.findUnique({ where: { email: graderEmail } });

  if (!user) {
    const passwordHash = await bcrypt.hash("Test1234!", 10);
    user = await prisma.user.create({
      data: {
        email: graderEmail,
        passwordHash,
      },
    });
    console.log(`Created grader account: ${user.email} (ID: ${user.id})`);
  } else {
    console.log(`Grader account exists: ${user.email} (ID: ${user.id})`);
  }

  // Ensure default reading logs exist for grader
  const existingLogs = await prisma.readingLog.findMany({
    where: { userId: user.id },
  });

  if (existingLogs.length === 0) {
    const seedLogs = [
      {
        bookTitle: "Atomic Habits",
        minutesRead: 40,
        genre: "Non_Fiction",
        note: "Chapter 3: Habit loop",
        favorite: false,
        readOn: new Date("2026-10-20"),
      },
      {
        bookTitle: "Clean Code",
        minutesRead: 45,
        genre: "Non_Fiction",
        note: "Chapter 2: Meaningful names",
        favorite: true,
        readOn: new Date("2026-10-21"),
      },
      {
        bookTitle: "Dune",
        minutesRead: 60,
        genre: "Sci_Fi",
        note: "Part 1: Dune arrival",
        favorite: true,
        readOn: new Date("2026-10-22"),
      },
      {
        bookTitle: "The Hobbit",
        minutesRead: 50,
        genre: "Fiction",
        note: "An Unexpected Journey",
        favorite: false,
        readOn: new Date("2026-10-23"),
      },
      {
        bookTitle: "1984",
        minutesRead: 35,
        genre: "Fiction",
        note: "Winston notebook entry",
        favorite: false,
        readOn: new Date("2026-10-24"),
      },
    ];

    for (const log of seedLogs) {
      await prisma.readingLog.create({
        data: {
          ...log,
          userId: user.id,
        },
      });
    }
    console.log(`Seeded ${seedLogs.length} initial reading logs for ${user.email}`);
  } else {
    console.log(`Already has ${existingLogs.length} reading logs.`);
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
