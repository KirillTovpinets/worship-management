import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface AdminUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

async function createAdminUser(userData?: Partial<AdminUserData>) {
  try {
    // Default admin user data
    const defaultData: AdminUserData = {
      name: "Admin User",
      email: "admin@worship.com",
      password: "admin123",
      role: "ADMIN",
    };

    // Merge with provided data
    const finalData = { ...defaultData, ...userData };

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: finalData.email,
      },
    });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists");
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`Role: ${existingAdmin.role}`);
      return existingAdmin;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(finalData.password, 12);

    const adminUser = await prisma.user.create({
      data: {
        name: finalData.name,
        email: finalData.email,
        password: hashedPassword,
        role: finalData.role,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`Password: ${finalData.password}`);
    console.log("\n⚠️  Please change the password after first login!");

    return adminUser;
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage with custom data
async function main() {
  try {
    // Create default admin user
    await createAdminUser();

    // Example: Create a custom admin user
    // await createAdminUser({
    //   name: "Super Admin",
    //   email: "superadmin@worship.com",
    //   password: "superadmin123",
    //   key: "G"
    // });
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

// Run the script
main();
