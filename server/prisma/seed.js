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
      description: "Sanjay-Dubri Tiger Reserve, located in Madhya Pradesh, is a lesser-explored wilderness known for its forests, hills, valleys, and rich biodiversity. The reserve forms an important part of the central Indian tiger landscape and offers a quieter safari experience away from more crowded destinations.\n\nThe reserve is home to Bengal tigers, leopards, sloth bears, chital, sambar, gaur, wild dogs, and numerous species of birds. Its diverse terrain of sal forests, grasslands, streams, and rugged hills provides an excellent habitat for wildlife.\n\nFor wildlife photographers, Sanjay-Dubri offers the chance to explore a relatively wild and peaceful landscape while searching for some of India’s most iconic species. Its remote character and natural beauty make every safari an immersive wilderness experience.",
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
      description: "Blackbuck National Park, Velavadar, located in Gujarat, is famous for its open grasslands and large populations of blackbuck and other wildlife. Unlike dense forest reserves, its wide landscapes provide excellent visibility and a completely different safari experience.\n\nThe park is home to blackbuck, nilgai, Indian wolves, striped hyenas, jackals, foxes, and a remarkable variety of birds. Its grasslands and wetlands also attract numerous migratory and resident bird species throughout the year.\n\nVelavadar is particularly special for wildlife photographers because of its open terrain, dramatic herds of blackbuck, and opportunities to observe predators in their natural environment. The combination of grassland, wildlife, and expansive skies creates a distinctive photography experience.",
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
      description: "Panna Tiger Reserve, located in Madhya Pradesh, is a beautiful wilderness shaped by forests, plateaus, rocky terrain, and the Ken River. It is widely recognized for its successful tiger conservation efforts and offers a distinctive safari experience in central India.\n\nPanna is home to Bengal tigers, leopards, sloth bears, chital, sambar, nilgai, gharial, and a wide variety of birds. The Ken River and surrounding landscapes add another dimension to the reserve, supporting a rich and diverse ecosystem.\n\nFor wildlife photographers, Panna offers a combination of wildlife, dramatic landscapes, and riverine habitats. Its conservation story and recovering tiger population make it an especially meaningful destination for experiencing India’s wilderness.",
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
      description: "Pench National Park, located in Madhya Pradesh, is a beautiful central Indian wilderness known for its forests, open meadows, and the Pench River. The landscape is closely associated with the setting that inspired Rudyard Kipling’s famous *The Jungle Book*.\n\nThe reserve is home to Bengal tigers, leopards, wild dogs, sloth bears, gaur, sambar, chital, and numerous bird species. Its mixture of teak forests, grasslands, and water bodies creates a rich habitat for both predators and prey.\n\nPench offers an immersive safari experience where wildlife can be encountered across a varied and scenic landscape. For photographers, the combination of iconic wildlife, beautiful forests, and open clearings makes Pench an exciting destination to explore.",
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
      description: "Kanha National Park, located in Madhya Pradesh, is one of India’s most celebrated wildlife reserves and a major stronghold for Bengal tigers. Its sal forests, bamboo groves, open meadows, and streams create one of the most beautiful landscapes in central India.\n\nKanha is home to Bengal tigers, leopards, wild dogs, sloth bears, gaur, sambar, chital, and many bird species. The reserve is also known for the hard-ground barasingha, whose conservation has become one of Kanha’s notable success stories.\n\nWith its scenic forests, diverse wildlife, and expansive meadows, Kanha offers an immersive safari experience for photographers and nature enthusiasts. It is a destination where the landscape itself becomes an important part of the wildlife story.",
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
      description: "Bandhavgarh National Park, located in Madhya Pradesh, is one of India’s most renowned tiger destinations. The reserve combines dense forests, open meadows, rocky hills, and the historic Bandhavgarh Fort, creating a dramatic setting for wildlife exploration.\n\nThe park is particularly famous for its Bengal tigers and is also home to leopards, sloth bears, gaur, sambar, chital, wild dogs, and many bird species. Its varied terrain supports a rich ecosystem and provides excellent opportunities for wildlife encounters.\n\nBandhavgarh is a sought-after destination for wildlife photographers because of its tiger sightings and striking landscapes. The combination of powerful wildlife, ancient history, and central Indian wilderness makes every safari memorable.",
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
      description: "Jim Corbett National Park, located in Uttarakhand, is one of India’s oldest and most renowned wildlife destinations. Established in 1936, the park is known for its forests, grasslands, rivers, and Himalayan foothills, creating a diverse habitat for wildlife.\n\nThe park is famous for Bengal tigers and is also home to leopards, elephants, sloth bears, sambar, chital, barking deer, crocodiles, and hundreds of bird species. Its varied landscapes provide opportunities to experience wildlife across forests, riverbeds, and open grasslands.\n\nCorbett offers a classic Indian jungle safari experience, combining rich biodiversity with beautiful Himalayan landscapes. For photographers and wildlife enthusiasts, the park provides opportunities to observe and capture some of the country’s most iconic wildlife in a remarkable natural setting.",
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
      description: "Chitwan National Park, located in southern Nepal, is one of the country’s most famous wildlife destinations and a UNESCO World Heritage Site. Its forests, grasslands, wetlands, and rivers create a diverse landscape in the Himalayan foothills.\n\nThe park is known for its greater one-horned rhinoceros and is also home to Bengal tigers, leopards, sloth bears, wild elephants, crocodiles, deer, and hundreds of bird species. The rivers and wetlands add important habitats for both wildlife and birdlife.\n\nChitwan offers a unique combination of wildlife, landscapes, and Nepalese wilderness. For photographers, it provides opportunities to capture rhinos, birds, crocodiles, and other wildlife while experiencing a completely different ecosystem from India's central forest reserves.",
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
