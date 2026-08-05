import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Launch categories are the five high-frequency task types HSTLE focuses on
// in Ahmedabad at launch (see docs/14-roadmap.md). The rest ship as fast-follow
// expansion categories once trust & ops are proven on the launch set.
const CATEGORIES = [
  { slug: 'grocery-pickup', name: 'Grocery pickup', icon: 'shopping-cart', description: 'Pick up groceries from a store or market and deliver them to your door.', basePriceHint: 150, sortOrder: 1 },
  { slug: 'document-pickup', name: 'Document pickup & drop', icon: 'file-text', description: 'Collect or deliver documents between offices, homes, and government counters.', basePriceHint: 120, sortOrder: 2 },
  { slug: 'queue-standing', name: 'Queue standing', icon: 'users', description: 'A verified helper stands in line for you — passport office, RTO, banks, government offices.', basePriceHint: 200, sortOrder: 3 },
  { slug: 'shopping', name: 'Shopping assistance', icon: 'shopping-bag', description: 'Buy specific items from a list at a shop or mall on your behalf.', basePriceHint: 150, sortOrder: 4 },
  { slug: 'handyman', name: 'Small handyman jobs', icon: 'wrench', description: 'Minor fixes, mounting, and small repairs around the house.', basePriceHint: 250, sortOrder: 5 },
  { slug: 'medicine-delivery', name: 'Medicine delivery', icon: 'pill', description: 'Pick up prescriptions from a pharmacy and deliver them.', basePriceHint: 100, sortOrder: 6 },
  { slug: 'parcel-delivery', name: 'Parcel delivery', icon: 'package', description: 'Send or receive a parcel across the city.', basePriceHint: 130, sortOrder: 7 },
  { slug: 'furniture-assembly', name: 'Furniture assembly', icon: 'hammer', description: 'Assemble flat-pack furniture, including IKEA pieces.', basePriceHint: 350, sortOrder: 8 },
  { slug: 'electrician', name: 'Electrician', icon: 'zap', description: 'Verified electricians for wiring, fixtures, and small repairs.', basePriceHint: 300, sortOrder: 9 },
  { slug: 'plumber', name: 'Plumber', icon: 'droplet', description: 'Verified plumbers for leaks, fittings, and installations.', basePriceHint: 300, sortOrder: 10 },
  { slug: 'printing', name: 'Printing & photocopying', icon: 'printer', description: 'Print, scan, or photocopy documents and deliver them.', basePriceHint: 80, sortOrder: 11 },
  { slug: 'laptop-setup', name: 'Laptop / PC setup', icon: 'laptop', description: 'Setup, troubleshooting, and basic tech support at home.', basePriceHint: 300, sortOrder: 12 },
  { slug: 'airport-pickup', name: 'Airport pickup & drop', icon: 'plane', description: 'Reliable pickup or drop-off to the airport.', basePriceHint: 400, sortOrder: 13 },
  { slug: 'package-waiting', name: 'Waiting at home for deliveries', icon: 'clock', description: 'A trusted helper waits at your home to receive a delivery.', basePriceHint: 150, sortOrder: 14 },
  { slug: 'dog-walking', name: 'Dog walking', icon: 'paw-print', description: 'A verified helper walks your dog on a schedule you choose.', basePriceHint: 120, sortOrder: 15 },
  { slug: 'plant-watering', name: 'Plant watering', icon: 'sprout', description: 'Keep your plants watered while you are away.', basePriceHint: 80, sortOrder: 16 },
  { slug: 'digital-tasks', name: 'Digital tasks', icon: 'monitor', description: 'Online form filling, bookings, and other digital errands.', basePriceHint: 100, sortOrder: 17 },
  { slug: 'photography', name: 'Photography', icon: 'camera', description: 'Book a helper for event or product photography.', basePriceHint: 500, sortOrder: 18 },
  { slug: 'car-wash', name: 'Car wash', icon: 'car', description: 'Doorstep car washing and detailing.', basePriceHint: 200, sortOrder: 19 },
  { slug: 'laundry-pickup', name: 'Laundry pickup & drop', icon: 'shirt', description: 'Pick up laundry, drop it at a laundromat, and return it.', basePriceHint: 150, sortOrder: 20 },
  { slug: 'custom-errand', name: 'Custom errand', icon: 'sparkles', description: "Anything else legal — describe the task and a helper will pick it up.", basePriceHint: 150, sortOrder: 21 },
];

async function main() {
  console.log('Seeding TaskCategory rows...');
  for (const category of CATEGORIES) {
    await prisma.taskCategory.upsert({
      where: { slug: category.slug },
      create: category,
      update: category,
    });
  }

  console.log('Seeding default platform commission...');
  const existingCommission = await prisma.commissionSetting.findFirst({ where: { categoryId: null } });
  if (!existingCommission) {
    await prisma.commissionSetting.create({ data: { categoryId: null, commissionPercent: 15 } });
  }

  console.log('Seeding a starter promo code...');
  await prisma.promoCode.upsert({
    where: { code: 'HSTLE50' },
    create: {
      code: 'HSTLE50',
      description: 'Flat ₹50 off your first task',
      discountType: 'FLAT',
      discountValue: 50,
      minTaskValue: 150,
      usageLimit: 1000,
      perUserLimit: 1,
    },
    update: {},
  });

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
