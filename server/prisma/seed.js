const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const toursData = require('./data/tours.json');
const destinationsData = require('./data/destinations.json');

const prisma = new PrismaClient();

function calculateMealPricing(rawPrice) {
  const price = Number(rawPrice) || 0;
  const offset = price > 100 ? price : price * 80;
  const apai = 6000 + offset;
  const mapai = Math.max(2000, apai - 1000);
  const cpai = Math.max(1500, apai - 2000);
  return { apai, mapai, cpai };
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding from extracted master datasets...');

  // 1. Clean existing records in correct relation order
  console.log('🧹 Cleaning existing records...');
  await prisma.roomCategory.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tourPackage.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.safariPricing.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.galleryItem.deleteMany();

  // 2. Create Users
  console.log('👤 Seeding users...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'JungleE Admin',
      email: 'admin@junglee.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'marcus@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      isVerified: true,
    },
  });

  // 3. Seed Tours
  console.log('🦁 Seeding 12 Master Safaris...');
  const createdToursMap = {};

  for (const tour of toursData) {
    const packagesToCreate = Array.isArray(tour.packages)
      ? tour.packages.map((pkg) => ({
          name: pkg.name || 'Standard Package',
          price: parseFloat(pkg.price || tour.basePrice || 3000),
          description: pkg.description || '',
        }))
      : [];

    const createdTour = await prisma.tour.create({
      data: {
        id: tour.id,
        title: tour.title,
        slug: tour.slug,
        description: tour.description,
        location: tour.location,
        region: tour.region || '',
        basePrice: parseFloat(tour.basePrice || 3000),
        duration: tour.duration || '6 Days / 5 Nights',
        imagesJson: JSON.stringify(tour.images || []),
        isFeatured: Boolean(tour.isFeatured),
        isHidden: false,
        packages: {
          create: packagesToCreate,
        },
      },
    });

    createdToursMap[createdTour.slug] = createdTour;
  }

  // 4. Seed Destinations, Hotels, and Room Categories
  console.log('🏨 Seeding 39 Hotels and 104 Room Categories across 12 Destinations...');
  let totalHotelsCount = 0;
  let totalRoomsCount = 0;

  for (const destination of destinationsData) {
    const destSlug = destination.id; // e.g. 'gir', 'jawai', etc.
    const tourSlug = destination.slug; // e.g. 'gir-lion-safari'
    const tour = createdToursMap[tourSlug];

    for (const hotel of destination.hotels) {
      const amenitiesList = Array.isArray(hotel.amenities) ? hotel.amenities : [];
      const imagesList = Array.isArray(hotel.images) ? hotel.images : [];

      const createdHotel = await prisma.hotel.create({
        data: {
          id: hotel.id,
          destinationSlug: destSlug,
          tourSlug: tourSlug,
          tourId: tour ? tour.id : null,
          name: hotel.name,
          tagline: hotel.tagline || '',
          price: parseFloat(hotel.price || 0),
          address: hotel.address || '',
          description: hotel.description || '',
          amenitiesJson: JSON.stringify(amenitiesList),
          imagesJson: JSON.stringify(imagesList),
          isHidden: false,
        },
      });
      totalHotelsCount++;

      // Seed Room Categories for this hotel
      if (Array.isArray(hotel.roomCategories)) {
        for (const room of hotel.roomCategories) {
          const roomImages = Array.isArray(room.images) ? room.images : [];
          const mealPricing = calculateMealPricing(room.price || hotel.price || 0);

          await prisma.roomCategory.create({
            data: {
              id: room.id,
              hotelId: createdHotel.id,
              name: room.name,
              price: parseFloat(room.price || 0),
              bedType: room.bedType || '',
              view: room.view || '',
              roomSize: room.roomSize || '',
              description: room.description || '',
              imagesJson: JSON.stringify(roomImages),
              apaiPrice: mealPricing.apai,
              mapaiPrice: mealPricing.mapai,
              cpaiPrice: mealPricing.cpai,
            },
          });
          totalRoomsCount++;
        }
      }
    }
  }

  // 5. Seed Safari Pricing
  console.log('🚙 Seeding Safari Pricing config...');
  await prisma.safariPricing.create({
    data: {
      slug: 'default',
      weekdayPrice: 6000,
      weekendPrice: 8000,
    },
  });

  for (const destination of destinationsData) {
    await prisma.safariPricing.create({
      data: {
        slug: destination.slug,
        weekdayPrice: 6000,
        weekendPrice: 8000,
      },
    });
  }

  // 6. Seed Gallery & Blog
  console.log('📸 Seeding initial gallery & blog content...');
  await prisma.galleryItem.createMany({
    data: [
      {
        title: 'Asiatic Lion in Sasan Gir',
        category: 'Mammals',
        imageUrl: '/gir-safari.png',
        aspect: 'horizontal',
      },
      {
        title: 'Bengal Tiger on Prowl',
        category: 'Big Cats',
        imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
        aspect: 'vertical',
      },
      {
        title: 'Jawai Granite Leopard',
        category: 'Big Cats',
        imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1600&q=80',
        aspect: 'horizontal',
      },
    ],
  });

  await prisma.blogPost.create({
    data: {
      title: 'Guide to Wildlife Photography in Gir Forest',
      slug: 'guide-wildlife-photography-gir-forest',
      summary: 'Master lighting, focal lengths, and animal behavior for tracking Asiatic lions.',
      content: 'Gir National Park offers golden morning light and open teak groves ideal for 400mm-600mm telephoto lenses...',
      coverImage: '/gir-safari.png',
      category: 'Photography Guide',
    },
  });

  console.log(`✅ Database successfully seeded!
  - 12 Safaris
  - ${totalHotelsCount} Hotels
  - ${totalRoomsCount} Room Categories
  - Safari Pricing Configurations
  - Admin & Demo Users
  - Sample Gallery & Blog items
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
