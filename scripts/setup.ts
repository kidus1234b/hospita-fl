import { execSync } from "child_process"
import fs from "fs"
import path from "path"

async function setup() {
  console.log("🚀 Setting up MedSync HMS...")

  try {
    // Check if .env exists, if not create from example
    const envPath = path.join(process.cwd(), ".env")
    const envExamplePath = path.join(process.cwd(), ".env.example")

    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
      console.log("📝 Creating .env file from .env.example...")
      fs.copyFileSync(envExamplePath, envPath)
    }

    // Generate Prisma client
    console.log("🔧 Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    // Push database schema
    console.log("🗄️ Setting up database...")
    execSync("npx prisma db push", { stdio: "inherit" })

    // Seed database
    console.log("🌱 Seeding database...")
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" })

    console.log("✅ Setup completed successfully!")
    console.log("\n🎉 You can now run:")
    console.log("   npm run dev     - Start development server")
    console.log("   npm run build   - Build for production")
    console.log("\n🔑 Demo login credentials:")
    console.log("   Email: admin@medsync.com")
    console.log("   Password: password123")
  } catch (error) {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  }
}

setup()
