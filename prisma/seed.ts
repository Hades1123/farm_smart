import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding 5 users...");

  const usersData = [
    {
      username: "admin",
      email: "admin@example.com",
      hashedPassword: "hashed_password_1", // Note: use bcrypt in real app
      phone: "0123456789",
    },
    {
      username: "user1",
      email: "user1@example.com",
      hashedPassword: "hashed_password_2",
      phone: "0123456781",
    },
    {
      username: "user2",
      email: "user2@example.com",
      hashedPassword: "hashed_password_3",
      phone: "0123456782",
    },
    {
      username: "manager1",
      email: "manager1@example.com",
      hashedPassword: "hashed_password_4",
      phone: "0123456783",
    },
    {
      username: "guest1",
      email: "guest1@example.com",
      hashedPassword: "hashed_password_5",
      phone: "0123456784",
    },
  ];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    console.log(`Created/Updated user with id: ${user.id} - ${user.username}`);
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
