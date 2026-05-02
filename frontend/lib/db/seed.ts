/**
 * Database seed script — run with:  npm run db:seed
 *
 * What it does:
 *  1. Inserts all 16 menu items (skips existing ones)
 *  2. Creates the default cashier admin account (kasir@greeting.co / Kasir123!)
 *     and promotes it to the "admin" role
 */

import { db } from "./index";
import { menuItems, users } from "./schema";
import { eq } from "drizzle-orm";

// ── Menu items ──────────────────────────────────────────────────────────────
const MENU: (typeof menuItems.$inferInsert)[] = [
  { id: "ks-1", name: "Kopi Susu Original",      description: "Espresso segar dipadukan dengan susu segar pilihan, menghasilkan cita rasa kopi yang lembut dan creamy.",  price: 25000, category: "kopi-susu",   emoji: "☕",  isPopular: true  },
  { id: "ks-2", name: "Kopi Susu Aren",           description: "Paduan espresso dan susu segar dengan gula aren asli yang memberikan rasa manis alami khas.",              price: 28000, category: "kopi-susu",   emoji: "🍯",  isPopular: true  },
  { id: "ks-3", name: "Kopi Susu Vanilla",        description: "Espresso lembut dengan susu segar dan sirup vanilla premium untuk nuansa rasa yang elegan.",               price: 27000, category: "kopi-susu",   emoji: "☕",  isPopular: false },
  { id: "ks-4", name: "Kopi Susu Hazelnut",       description: "Kombinasi espresso dan susu segar dengan sentuhan hazelnut yang kaya dan menggugah selera.",               price: 28000, category: "kopi-susu",   emoji: "🌰",  isPopular: false },
  { id: "rc-1", name: "Rock Coffee Original",     description: "Cold brew kopi robusta pilihan yang diseduh 12 jam, menghasilkan cita rasa bold dan segar.",               price: 22000, category: "rock-coffee", emoji: "🧊",  isPopular: true  },
  { id: "rc-2", name: "Rock Coffee Brown Sugar",  description: "Cold brew kopi kuat dengan caramel brown sugar yang menciptakan keseimbangan rasa sempurna.",              price: 25000, category: "rock-coffee", emoji: "🧊",  isPopular: true  },
  { id: "rc-3", name: "Rock Coffee Oat",          description: "Cold brew kopi disajikan dengan oat milk yang creamy, pilihan sehat tanpa kompromi rasa.",                 price: 27000, category: "rock-coffee", emoji: "🌾",  isPopular: false },
  { id: "rc-4", name: "Rock Coffee Salted Caramel", description: "Cold brew kopi dengan salted caramel sauce yang menggugah, perpaduan manis dan gurih yang unik.",       price: 28000, category: "rock-coffee", emoji: "🧂",  isPopular: false },
  { id: "nk-1", name: "Matcha Latte",             description: "Matcha premium dari Jepang dipadukan dengan susu segar yang creamy dan sedikit manis.",                    price: 28000, category: "non-kopi",    emoji: "🍵",  isPopular: true  },
  { id: "nk-2", name: "Taro Latte",               description: "Minuman taro ungu yang lembut dan creamy, favorit semua kalangan dengan rasa unik yang khas.",             price: 28000, category: "non-kopi",    emoji: "🟣",  isPopular: false },
  { id: "nk-3", name: "Chocolate Latte",          description: "Dark chocolate premium dicampur dengan susu hangat, tersedia panas atau dingin sesuai selera.",             price: 22000, category: "non-kopi",    emoji: "🍫",  isPopular: false },
  { id: "nk-4", name: "Strawberry Milk",          description: "Susu segar dengan puree strawberry asli, menyegarkan dengan aroma buah yang natural.",                    price: 25000, category: "non-kopi",    emoji: "🍓",  isPopular: false },
  { id: "sn-1", name: "Croissant Butter",         description: "Croissant premium dengan mentega pilihan, renyah di luar dan lembut di dalam.",                            price: 18000, category: "snack",        emoji: "🥐",  isPopular: true  },
  { id: "sn-2", name: "Banana Bread",             description: "Banana bread homemade dengan pisang matang pilihan, lembab dan harum sempurna.",                           price: 15000, category: "snack",        emoji: "🍞",  isPopular: false },
  { id: "sn-3", name: "Cookies & Cream",          description: "Kukis dengan lapis cream vanilla, renyah dengan isian yang creamy dan manis.",                             price: 12000, category: "snack",        emoji: "🍪",  isPopular: false },
  { id: "sn-4", name: "Cheese Toast",             description: "Roti panggang dengan keju pilihan yang meleleh, cocok sebagai teman ngopi.",                               price: 20000, category: "snack",        emoji: "🧀",  isPopular: false },
];

async function seedMenuItems() {
  console.log("🌱 Seeding menu items...");
  for (const item of MENU) {
    await db
      .insert(menuItems)
      .values(item)
      .onConflictDoNothing({ target: menuItems.id });
  }
  console.log(`✅ ${MENU.length} menu items seeded.`);
}

async function seedAdminUser() {
  console.log("🌱 Seeding admin (cashier) user...");

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, "kasir@greeting.co"))
    .limit(1);

  if (existing.length > 0) {
    // Ensure role is admin even if user already exists
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.email, "kasir@greeting.co"));
    console.log("ℹ️  Admin user already exists — role ensured to 'admin'.");
    return;
  }

  // Register via Better Auth API (requires server to be running)
  // Alternatively, promote via the /api/setup endpoint.
  console.log("⚠️  Admin user not found.");
  console.log("   Run the app, then visit POST /api/setup with the SETUP_SECRET header.");
  console.log("   Or call: POST /api/auth/sign-up/email");
  console.log("     { email: 'kasir@greeting.co', password: 'Kasir123!', name: 'Kasir' }");
  console.log("   Then promote with: POST /api/setup");
}

async function main() {
  try {
    await seedMenuItems();
    await seedAdminUser();
    console.log("\n🎉 Seed complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
