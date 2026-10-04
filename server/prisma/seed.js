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
      description: "Jawai, located in Rajasthan, is a unique wildlife destination known for its leopards living among dramatic granite hills and rocky landscapes. Unlike dense forests, Jawai’s open terrain makes it possible to observe wildlife against a striking natural backdrop.\n\nThe region is home to leopards, crocodiles, hyenas, jackals, flamingos, migratory birds, and other wildlife. Its rocky caves and hills provide natural shelter for leopards, while the surrounding grasslands and Jawai Dam support a diverse ecosystem.\n\nJawai is especially famous for its leopard sightings and distinctive landscape, offering photographers an experience very different from traditional forest safaris. The combination of wildlife, open terrain, local villages, and massive granite formations makes Jawai a remarkable destination for wildlife photography.",
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
      title: 'Panna Tiger Reserve & Ken River Expedition',
      slug: 'panna-tiger-safari',
      description: 'Track thriving Bengal Tiger populations, leopards, and vultures among the pristine river canyons of Panna.',
      location: 'Panna, India',
      basePrice: 3200,
      duration: '6 Days / 5 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?auto=format&fit=crop&w=1600&q=80'
      ])
    },
    {
      title: 'Pench Tiger Reserve & Mowgli Jungle Safari',
      slug: 'pench-tiger-safari',
      description: 'Track royal Bengal tigers, leopards, and dholes across the undulating teak forests that inspired The Jungle Book.',
      location: 'Pench, India',
      basePrice: 3100,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        '/pench-safari.jpg'
      ])
    },
    {
      title: 'Kanha National Park Sal Forest Tiger Expedition',
      slug: 'kanha-tiger-safari',
      description: 'Photograph majestic tigers, barasingha swamp deer, and Indian gaurs amidst the sprawling sal meadows of Kanha.',
      location: 'Kanha, India',
      basePrice: 3300,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        '/kanha-safari.png'
      ])
    },
    {
      title: 'Bandhavgarh National Park High-Density Tiger Safari',
      slug: 'bandhavgarh-tiger-safari',
      description: 'Experience India’s highest tiger density among ancient cliffs, bamboo thickets, and Tala forest zones.',
      location: 'Bandhavgarh, India',
      basePrice: 3400,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        '/bandhavgarh-safari.png'
      ])
    },
    {
      title: 'Tadoba National Park Bamboo Forest Tiger Safari',
      slug: 'tadoba-tiger-safari',
      description: 'Track the famed tigers, sloth bears, and wild dogs of Tadoba Andhari Reserve across dense teak and bamboo jungles.',
      location: 'Tadoba, India',
      basePrice: 3200,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        '/tadoba-safari.jpg'
      ])
    },
    {
      title: 'Jim Corbett National Park Himalayan Foothills Safari',
      slug: 'jim-corbett-safari',
      description: 'Photograph tigers, wild Asiatic elephants, and gharials along the Ramganga river in the foothills of the Himalayas.',
      location: 'Jim Corbett, India',
      basePrice: 2950,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        '/corbett-safari.png'
      ])
    },
    {
      title: 'Chitwan National Park One-Horned Rhino Safari',
      slug: 'chitwan-rhino-safari',
      description: 'Track and photograph greater one-horned rhinoceroses, wild elephants, and gharials across the sal forests and wetlands of Chitwan.',
      location: 'Chitwan, Nepal',
      basePrice: 2850,
      duration: '6 Days / 5 Nights',
      isFeatured: false,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1600&q=80'
      ])
    }
  ];

  for (const safari of safarisData) {
    await prisma.tour.create({ data: safari });
  }

  console.log('✅ 12 Exact Wildlife Safari templates seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
