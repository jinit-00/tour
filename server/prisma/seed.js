const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with 11 flagship safaris...');

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
      email: 'admin@silvantours.com',
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
      title: 'Serengeti Lion & Great Migration Masterclass',
      slug: 'serengeti-lion-safari',
      description: 'Experience Africa’s iconic lion prides during the dramatic Mara River crossings in Serengeti.',
      location: 'Serengeti, Tanzania',
      basePrice: 4850,
      duration: '8 Days / 7 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Ngorongoro Crater Big Game Expedition',
      slug: 'ngorongoro-safari',
      description: 'Photograph massive bull elephants and black rhinos inside the pristine caldera of Ngorongoro.',
      location: 'Ngorongoro, Tanzania',
      basePrice: 4200,
      duration: '7 Days / 6 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Tarangire Ancient Baobab & Wildlife Safari',
      slug: 'tarangire-safari',
      description: 'Track massive elephant herds roaming beneath thousand-year-old baobab trees.',
      location: 'Tarangire, Tanzania',
      basePrice: 3500,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Royal Ranthambore Bengal Tiger Safari',
      slug: 'ranthambore-tiger-safari',
      description: 'Journey into ancient banyan ruins and bamboo forests to photograph wild Bengal Tigers.',
      location: 'Ranthambore, India',
      basePrice: 2950,
      duration: '6 Days / 5 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Bandhavgarh High-Density Tiger Tracking',
      slug: 'bandhavgarh-safari',
      description: 'Explore the highest tiger density forests in Central India with legendary native spotters.',
      location: 'Bandhavgarh, India',
      basePrice: 3200,
      duration: '7 Days / 6 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Kanha Jungle & Barasingha Sanctuary',
      slug: 'kanha-safari',
      description: 'Immerse in the sal forests that inspired Kipling’s Jungle Book to capture barasingha deer and tigers.',
      location: 'Kanha, India',
      basePrice: 2800,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Masai Mara Predator Migration Expedition',
      slug: 'masai-mara-safari',
      description: 'Track cheetah sprints and large lion prides across Kenya’s endless savanna grasslands.',
      location: 'Masai Mara, Kenya',
      basePrice: 4600,
      duration: '8 Days / 7 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Greater Kruger Rhino Conservation & Big 5 Safari',
      slug: 'kruger-rhino-safari',
      description: 'Photograph wild White & Black Rhinos alongside anti-poaching rangers in private reserves.',
      location: 'Kruger, South Africa',
      basePrice: 3750,
      duration: '7 Days / 6 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Sabi Sands Private Leopard Tracking',
      slug: 'sabi-sands-safari',
      description: 'World renowned for intimate, off-road leopard encounters in private game reserves.',
      location: 'Sabi Sands, South Africa',
      basePrice: 5100,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1600&q=80'
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
    },
    {
      title: 'South Luangwa Walking & Leopard Safari',
      slug: 'south-luangwa-safari',
      description: 'Experience Africa’s premier walking safaris along the Luangwa River, famous for leopards and hippo pods.',
      location: 'South Luangwa, Zambia',
      basePrice: 4100,
      duration: '7 Days / 6 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80'
      ])
    }
  ];

  for (const safari of safarisData) {
    await prisma.tour.create({ data: safari });
  }

  console.log('✅ 11 Flagship Safaris seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
