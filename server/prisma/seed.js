const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with flagship safaris...');

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

  console.log('✅ Users seeded');

  // 1. SAFARI 1: LION / SERENGETI
  const safari1 = await prisma.tour.create({
    data: {
      title: 'Serengeti Lion & Great Migration Masterclass',
      slug: 'serengeti-lion-safari',
      description: 'Experience Africa’s iconic lion prides during the dramatic Mara River crossings. Custom open 4x4 vehicles with swivel lens mounts, private tented bush camps, and daily post-processing critiques under the stars.',
      location: 'Serengeti National Park, Tanzania',
      basePrice: 4850,
      duration: '8 Days / 7 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80', // Lion portrait
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=1600&q=80'
      ]),
      packages: {
        create: [
          {
            name: 'Standard Expedition',
            price: 0,
            description: 'Shared 4x4 vehicle (max 3 photographers per vehicle), luxury safari tented camp, all park permits & meals included.'
          },
          {
            name: 'Pro Telephoto Lens Kit Rental',
            price: 450,
            description: 'Includes 600mm f/4 prime lens + carbon fiber tripod with Gimbal head for the entire duration.'
          },
          {
            name: 'Private SUV & Dedicated Photo Guide',
            price: 1200,
            description: 'Exclusive vehicle for ultimate framing flexibility, custom tracking of lion packs, and 1-on-1 Lightroom coaching.'
          }
        ]
      }
    }
  });

  // 2. SAFARI 2: TIGER / RANTHAMBORE
  const safari2 = await prisma.tour.create({
    data: {
      title: 'Royal Ranthambore Bengal Tiger Safari',
      slug: 'ranthambore-tiger-safari',
      description: 'Journey into ancient banyan ruins and bamboo forests of Rajasthan to photograph wild Bengal Tigers. Low-seat open Gypsies, lake-side tracking, and expert naturalist guidance.',
      location: 'Ranthambore National Park, India',
      basePrice: 2950,
      duration: '6 Days / 5 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80', // Tiger portrait
        'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80'
      ]),
      packages: {
        create: [
          {
            name: 'Jungle Explorer Pack',
            price: 0,
            description: 'Heritage jungle lodge stay, all park safari permits, expert local spotter escort.'
          },
          {
            name: 'Private Low-Seat Gypsy Access',
            price: 500,
            description: 'Exclusive 4-seater open Gypsy for unobstructed water-level tiger photography.'
          }
        ]
      }
    }
  });

  // 3. SAFARI 3: RHINO / KRUGER
  const safari3 = await prisma.tour.create({
    data: {
      title: 'Greater Kruger Rhino Conservation & Big 5 Safari',
      slug: 'kruger-rhino-safari',
      description: 'An exclusive tracking expedition into Greater Kruger. Photograph wild White & Black Rhinos alongside anti-poaching rangers, Sabie river luxury lodges, and bush walking encounters.',
      location: 'Kruger National Park, South Africa',
      basePrice: 3750,
      duration: '7 Days / 6 Nights',
      isFeatured: true,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1600&q=80', // Rhino portrait
        'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&w=1600&q=80'
      ]),
      packages: {
        create: [
          {
            name: 'Conservation Explorer',
            price: 0,
            description: 'Luxury Sabie river eco-lodge stay, open 4x4 game drives, ranger bush walks.'
          },
          {
            name: 'Thermal Night Patrol & Anti-Poaching Ride-Along',
            price: 400,
            description: 'Special night tracking access using thermal scopes alongside K9 anti-poaching units.'
          }
        ]
      }
    }
  });

  console.log('✅ 3 Flagship Safaris seeded');

  // Seed sample booking
  const pkg1 = await prisma.tourPackage.findFirst({ where: { tourId: safari1.id, price: { gt: 0 } } });

  await prisma.booking.create({
    data: {
      userId: user.id,
      tourId: safari1.id,
      packageId: pkg1 ? pkg1.id : null,
      bookingDate: new Date('2026-11-15'),
      numPeople: 2,
      totalAmount: 4850 * 2 + (pkg1 ? pkg1.price : 0),
      status: 'CONFIRMED',
    }
  });

  // Seed Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Mastering Low-Light Telephoto Techniques for Big Cats at Dusk',
        slug: 'mastering-low-light-telephoto-techniques',
        summary: 'When golden hour turns to twilight, wild lions and tigers come alive. Here is how to push your camera sensor without losing detail.',
        content: `Photographing lions and tigers in low light requires balancing auto-ISO thresholds, shutter speed limits, and panning stability. 

1. **Auto-ISO & Noise Reduction**: Modern sensors handle ISO 6400 with ease if exposed correctly.
2. **Gimbal & Beanbag Stabilization**: Secure your rig to the safari vehicle door frame.
3. **Focus Tracking in Dense Brush**: Use Animal Eye-AF tuned for big cats.`,
        coverImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
        category: 'Field Technique',
      },
      {
        title: 'Rhino Conservation: Supporting Anti-Poaching Units in Greater Kruger',
        slug: 'rhino-conservation-kruger-patrol',
        summary: 'Behind the scenes with K9 tracking units protecting wild white rhinos across South Africa’s private reserves.',
        content: `Our partnership with Kruger anti-poaching units directly funds satellite tracking collars and ranger field gear.`,
        coverImage: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
        category: 'Conservation',
      }
    ]
  });

  // Seed Gallery Items
  await prisma.galleryItem.createMany({
    data: [
      {
        title: 'Monarch of Serengeti Twilight',
        category: 'Big Cats',
        imageUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
        aspect: 'vertical'
      },
      {
        title: 'Bengal Tiger at Lake Ranthambore',
        category: 'Big Cats',
        imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
        aspect: 'horizontal'
      },
      {
        title: 'White Rhino Patrol at Kruger Sunrise',
        category: 'Wildlife',
        imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
        aspect: 'vertical'
      }
    ]
  });

  // Seed Contact Message
  await prisma.contactMessage.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@photography.org',
      message: 'Hello, I would like to inquire about private group bookings for a team of 6 photographers for the Serengeti Lion tour.',
      isRead: false,
    }
  });

  console.log('🌱 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
