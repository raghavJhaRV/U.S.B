import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Step 1: Create Teams
  const teams = [
    ...['U11', 'U13', 'U14', 'U15', 'U16', 'U17'].map(age => ({
      gender: 'boys',
      ageGroup: age,
    })),
    ...['U14', 'U15', 'U16', 'U17'].map(age => ({
      gender: 'girls',
      ageGroup: age,
    })),
  ];

  const createdTeams = [];
  for (const team of teams) {
    const created = await prisma.team.upsert({
      where: {
        gender_ageGroup: {
          gender: team.gender,
          ageGroup: team.ageGroup,
        },
      } as any, // workaround because composite unique constraints aren't inferred yet
      update: {},
      create: team,
    });
    createdTeams.push(created);
  }

  // Step 2: Create Programs
  const programs = [
    {
      name: 'Spring Training Program',
      description: '8-week development program for athletes',
      season: 'Spring',
      price: 125.0,
    },
    {
      name: 'Fall Elite Program',
      description: 'Elite team training for fall season',
      season: 'Fall',
      price: 140.0,
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { name: program.name },
      update: {},
      create: program,
    });
  }

  // Step 3: Add Events using real team IDs
  const boysU13 = createdTeams.find(t => t.gender === 'boys' && t.ageGroup === 'U13');
  const girlsU15 = createdTeams.find(t => t.gender === 'girls' && t.ageGroup === 'U15');

  if (boysU13 && girlsU15) {
    await prisma.event.createMany({
      data: [
        {
          title: 'U13 Boys Tournament',
          description: 'Annual tournament for U13 boys teams',
          date: new Date('2025-07-15'),
          startTime: new Date('2025-07-15T09:00:00'),
          endTime: new Date('2025-07-15T17:00:00'),
          location: 'Community Sports Center',
          type: 'tournament',
          teamId: boysU13.id,
        },
        {
          title: 'U15 Girls Showcase',
          description: 'Showcase event for U15 girls teams',
          date: new Date('2025-08-10'),
          startTime: new Date('2025-08-10T10:00:00'),
          endTime: new Date('2025-08-10T16:00:00'),
          location: 'High School Gymnasium',
          type: 'showcase',
          teamId: girlsU15.id,
        },
      ],
    });
  }

  // step 4: Run the main function and handle errors
  await prisma.event.upsert({
    where: { id: 'dummy-u13-july' },
    update: {},
    create: {
      id: 'dummy-u13-july',
      title: 'U13 Boys Summer Tournament',
      description: 'Summer tournament for U13 boys',
      date: new Date('2025-07-20'),
      startTime: new Date('2025-07-20T08:00:00'),
      endTime: new Date('2025-07-20T18:00:00'),
      location: 'Summer Sports Complex',
      type: 'tournament',
      teamId: boysU13!.id, // ✅ use existing ID
    },
  });


  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
