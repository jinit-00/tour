const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with 11 exact wildlife safari templates...');

  // Clean existing tables
  await prisma.booking.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.tourPackage.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.galleryItem.deleteMany();

  // Create Users
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const userPasswordHash = await bcrypt.hash('UserPass123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Elena Rostova (Admin)',
      email: 'admin@junglee.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'marcus@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      isVerified: true,
    },
  });

  const safarisData = [
    {
      title: 'Gir Asiatic Lion Sanctuary Masterclass',
      slug: 'gir-lion-safari',
      description: 'Track and photograph the world’s last remaining wild Asiatic Lions in the dry deciduous forests of Gir.',
      location: 'Gir, India',
      basePrice: 3100,
      duration: '6 Days / 5 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Sanjay Dubri Tiger Reserve Expedition',
      slug: 'sanjay-dubri-tiger-safari',
      description: 'Explore the pristine, untamed tiger corridors of Sanjay Dubri National Park in Central India.',
      location: 'Sanjay Dubri, India',
      basePrice: 2900,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Jawai Granite Hills Leopard Tracking',
      slug: 'jawai-leopard-safari',
      description: 'Photograph the legendary leopards of Jawai living in harmony among ancient granite rock formations.',
      location: 'Jawai, India',
      basePrice: 3400,
      duration: '5 Days / 4 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Royal Ranthambore Bengal Tiger Portrait',
      slug: 'ranthambore-tiger-safari',
      description: 'Capture intimate, low-angle facial portraits of royal Bengal Tigers among ancient fort ruins.',
      location: 'Ranthambore, India',
      basePrice: 2950,
      duration: '6 Days / 5 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Velavadar Blackbuck & Deer Grasslands',
      slug: 'velavadar-deer-safari',
      description: 'Immerse in golden savannas to photograph leaping blackbuck antelopes, deer, and wolves.',
      location: 'Velavadar, India',
      basePrice: 2700,
      duration: '5 Days / 4 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Masai Mara Lion Pride & Predator Masterclass',
      slug: 'masai-mara-safari',
      description: 'Witness intense predator action and lion prides feeding in Kenya’s Mara ecosystem.',
      location: 'Masai Mara, Kenya',
      basePrice: 4800,
      duration: '8 Days / 7 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Uganda Savanna Elephant & Primate Expedition',
      slug: 'uganda-elephant-safari',
      description: 'Photograph massive savanna elephant herds along the Kazinga Channel and Murchison Falls.',
      location: 'Uganda',
      basePrice: 4300,
      duration: '7 Days / 6 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Greater Kruger Rhino Conservation Expedition',
      slug: 'kruger-rhino-safari',
      description: 'Photograph wild White and Black Rhinos alongside anti-poaching units in private reserves.',
      location: 'Kruger, South Africa',
      basePrice: 3750,
      duration: '7 Days / 6 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Kaziranga Wild Buffalo & Wetland Safari',
      slug: 'kaziranga-buffalo-safari',
      description: 'Track massive wild water buffalo herds roaming the lush tall elephant grasslands of Kaziranga.',
      location: 'Kaziranga, India',
      basePrice: 3000,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Camargue Wild Horse & Wetland Expedition',
      slug: 'camargue-horse-safari',
      description: 'Capture iconic galloping white horses charging through shallow coastal salt marshes.',
      location: 'Camargue, France',
      basePrice: 3600,
      duration: '5 Days / 4 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Amboseli Kilimanjaro Elephant Gathering',
      slug: 'amboseli-safari',
      description: 'Photograph giant tusker elephants wading through swamps with snow-capped Mt. Kilimanjaro in the backdrop.',
      location: 'Amboseli, Kenya',
      basePrice: 3900,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&w=1600&q=80'
      ])
    }
  ];

  for (const safari of safarisData) {
    await prisma.tour.create({ data: safari });
  }

  console.log('✅ 11 Exact Wildlife Safari templates seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
