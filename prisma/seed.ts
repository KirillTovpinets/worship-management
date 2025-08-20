import { PrismaClient, SongKey, SongPace } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: "admin@worship.com",
    },
  });

  if (!existingAdmin) {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@worship.com",
        password: hashedPassword,
        role: "ADMIN",
        key: SongKey.C,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@worship.com");
    console.log("Password: admin123");
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  // Create a sample singer user
  const existingSinger = await prisma.user.findFirst({
    where: {
      email: "singer@worship.com",
    },
  });

  if (!existingSinger) {
    const hashedPassword = await bcrypt.hash("singer123", 12);

    await prisma.user.create({
      data: {
        name: "Sample Singer",
        email: "singer@worship.com",
        password: hashedPassword,
        role: "SINGER",
        key: SongKey.F_SHARP,
      },
    });

    console.log("✅ Sample singer user created successfully!");
    console.log("Email: singer@worship.com");
    console.log("Password: singer123");
  } else {
    console.log("ℹ️  Sample singer user already exists");
  }

  // Create additional singer users with different keys
  const additionalSingers = [
    {
      name: "Sarah Johnson",
      email: "sarah@worship.com",
      password: "sarah123",
      key: SongKey.G,
    },
    {
      name: "Michael Chen",
      email: "michael@worship.com",
      password: "michael123",
      key: SongKey.C,
    },
    {
      name: "Emily Davis",
      email: "emily@worship.com",
      password: "emily123",
      key: SongKey.D,
    },
    {
      name: "David Wilson",
      email: "david@worship.com",
      password: "david123",
      key: SongKey.A,
    },
    {
      name: "Lisa Brown",
      email: "lisa@worship.com",
      password: "lisa123",
      key: SongKey.E,
    },
  ];

  for (const singer of additionalSingers) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: singer.email,
      },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(singer.password, 12);

      await prisma.user.create({
        data: {
          name: singer.name,
          email: singer.email,
          password: hashedPassword,
          role: "SINGER",
          key: singer.key,
        },
      });

      console.log(`✅ Singer ${singer.name} created successfully!`);
    } else {
      console.log(`ℹ️  Singer ${singer.name} already exists`);
    }
  }

  // Create sample songs
  const sampleSongs = [
    {
      title: "Amazing Grace",
      tone: SongKey.G,
      bpm: "80",
      originalSinger: "John Newton",
      author: "John Newton",
      pace: SongPace.SLOW,
      style: "Traditional Hymn",
      tags: "hymn / traditional / grace",
      nature: "reflective, powerful",
      lyrics: `Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now I'm found;
Was blind, but now I see.

'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed.

Through many dangers, toils and snares,
I have already come;
'Tis grace hath brought me safe thus far,
And grace will lead me home.

The Lord has promised good to me,
His word my hope secures;
He will my shield and portion be,
As long as life endures.

When we've been there ten thousand years,
Bright shining as the sun,
We've no less days to sing God's praise
Than when we'd first begun.`,
    },
    {
      title: "How Great Thou Art",
      tone: SongKey.C,
      bpm: "72",
      originalSinger: "Carl Boberg",
      author: "Carl Boberg",
      pace: SongPace.SLOW,
      style: "Traditional Hymn",
      tags: "hymn / traditional / worship",
      nature: "reverent, majestic",
    },
    {
      title: "10,000 Reasons",
      tone: SongKey.D,
      bpm: "140",
      originalSinger: "Matt Redman",
      author: "Matt Redman",
      pace: SongPace.MODERATE,
      style: "Contemporary Worship",
      tags: "contemporary / worship / praise",
      nature: "upbeat, joyful",
    },
    {
      title: "Oceans (Where Feet May Fail)",
      tone: SongKey.E,
      bpm: "68",
      originalSinger: "Hillsong United",
      author: "Joel Houston",
      pace: SongPace.SLOW,
      style: "Contemporary Worship",
      tags: "contemporary / worship / faith",
      nature: "reflective, powerful",
    },
    {
      title: "Good Good Father",
      tone: SongKey.A,
      bpm: "120",
      originalSinger: "Chris Tomlin",
      author: "Pat Barrett",
      pace: SongPace.MODERATE,
      style: "Contemporary Worship",
      tags: "contemporary / worship / father",
      nature: "warm, intimate",
    },
    {
      title: "What a Beautiful Name",
      tone: SongKey.B,
      bpm: "130",
      originalSinger: "Hillsong Worship",
      author: "Ben Fielding",
      pace: SongPace.MODERATE,
      style: "Contemporary Worship",
      tags: "contemporary / worship / jesus",
      nature: "powerful, anthemic",
    },
    {
      title: "Reckless Love",
      tone: SongKey.F,
      bpm: "75",
      originalSinger: "Cory Asbury",
      author: "Cory Asbury",
      pace: SongPace.SLOW,
      style: "Contemporary Worship",
      tags: "contemporary / worship / love",
      nature: "emotional, intimate",
    },
    {
      title: "Great Are You Lord",
      tone: SongKey.G,
      bpm: "85",
      originalSinger: "All Sons & Daughters",
      author: "Leslie Jordan",
      pace: SongPace.MODERATE,
      style: "Contemporary Worship",
      tags: "contemporary, worship, praise",
      nature: "reverent, powerful",
    },
    {
      title: "Build My Life",
      tone: SongKey.C,
      bpm: "140",
      originalSinger: "Housefires",
      author: "Brett Younker",
      pace: SongPace.FAST,
      style: "Contemporary Worship",
      tags: "contemporary / worship / surrender",
      nature: "upbeat, energetic",
    },
    {
      title: "Way Maker",
      tone: SongKey.D,
      bpm: "150",
      originalSinger: "Sinach",
      author: "Sinach",
      pace: SongPace.FAST,
      style: "Contemporary Worship",
      tags: "contemporary / worship / miracle",
      nature: "powerful, energetic",
    },
    {
      title: "Holy Spirit",
      tone: SongKey.E,
      bpm: "70",
      originalSinger: "Francesca Battistelli",
      author: "Francesca Battistelli",
      pace: SongPace.SLOW,
      style: "Contemporary Worship",
      tags: "contemporary, worship, holy spirit",
      nature: "intimate, reflective",
    },
    {
      title: "King of Kings",
      tone: SongKey.A,
      bpm: "135",
      originalSinger: "Hillsong Worship",
      author: "Brooke Ligertwood",
      pace: SongPace.MODERATE,
      style: "Contemporary Worship",
      tags: "contemporary / worship / jesus",
      nature: "majestic, powerful",
    },
    {
      title: "Living Hope",
      tone: SongKey.F,
      bpm: "145",
      originalSinger: "Phil Wickham",
      author: "Phil Wickham",
      pace: SongPace.FAST,
      style: "Contemporary Worship",
      tags: "contemporary, worship, resurrection",
      nature: "powerful, triumphant",
    },
    {
      title: "Graves Into Gardens",
      tone: SongKey.G,
      bpm: "125",
      originalSinger: "Elevation Worship",
      author: "Chris Brown",
      pace: SongPace.MODERATE,
      style: "Contemporary Worship",
      tags: "contemporary, worship, transformation",
      nature: "powerful, hopeful",
    },
    {
      title: "The Blessing",
      tone: SongKey.C,
      bpm: "80",
      originalSinger: "Kari Jobe",
      author: "Kari Jobe",
      pace: SongPace.SLOW,
      style: "Contemporary Worship",
      tags: "contemporary, worship, blessing",
      nature: "peaceful, comforting",
    },
  ];

  for (const songData of sampleSongs) {
    const existingSong = await prisma.song.findFirst({
      where: {
        title: songData.title,
      },
    });

    if (!existingSong) {
      await prisma.song.create({
        data: songData,
      });
      console.log(`✅ Song "${songData.title}" created successfully!`);
    } else {
      console.log(`ℹ️  Song "${songData.title}" already exists`);
    }
  }

  // Create sample events
  const sampleEvents = [
    {
      title: "Sunday Worship Service",
      description: "Main Sunday worship service",
      date: new Date(2024, 7, 10), // August 10, 2024 (past)
      songIds: ["song1", "song2", "song3"], // Will be replaced with actual song IDs
    },
    {
      title: "Wednesday Prayer Meeting",
      description: "Midweek prayer and worship",
      date: new Date(2024, 7, 14), // August 14, 2024 (past)
      songIds: ["song4", "song5"],
    },
    {
      title: "Youth Group Worship",
      description: "Youth ministry worship night",
      date: new Date(2024, 7, 17), // August 17, 2024 (past)
      songIds: ["song6", "song7", "song8", "song9"],
    },
    {
      title: "Christmas Eve Service",
      description: "Special Christmas Eve worship service",
      date: new Date(2024, 11, 24), // December 24, 2024 (future)
      songIds: ["song1", "song3", "song5", "song7"],
    },
    {
      title: "New Year's Eve Service",
      description: "New Year's Eve celebration and worship",
      date: new Date(2024, 11, 31), // December 31, 2024 (future)
      songIds: ["song2", "song4", "song6", "song8"],
    },
    {
      title: "Easter Sunday Service",
      description: "Easter Sunday celebration",
      date: new Date(2025, 3, 20), // April 20, 2025 (future)
      songIds: ["song1", "song2", "song3", "song4", "song5"],
    },
  ];

  // Get actual song IDs
  const allSongs = await prisma.song.findMany({
    select: { id: true },
    orderBy: { title: "asc" },
  });

  for (const eventData of sampleEvents) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: eventData.title,
        date: eventData.date,
      },
    });

    if (!existingEvent) {
      // Create event
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
        },
      });

      // Add songs to event (use available songs)
      const songIds = allSongs
        .slice(0, eventData.songIds.length)
        .map((song) => song.id);
      const eventSongs = songIds.map((songId, index) => ({
        eventId: event.id,
        songId,
        order: index,
      }));

      await prisma.eventSong.createMany({
        data: eventSongs,
      });

      console.log(`✅ Event "${eventData.title}" created successfully!`);
    } else {
      console.log(`ℹ️  Event "${eventData.title}" already exists`);
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
