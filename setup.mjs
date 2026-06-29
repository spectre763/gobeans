#!/usr/bin/env node
/**
 * GoBeans Setup Script
 * Run: node setup.mjs
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = "d:\\GoBeans";
const SRC = join(ROOT, "photos");
const DEST = join(ROOT, "public", "sequence");

console.log("\n🫘 GoBeans Setup\n" + "─".repeat(40));

// 1. Create dest dir
if (!existsSync(DEST)) {
  mkdirSync(DEST, { recursive: true });
  console.log("✅ Created public/sequence/");
} else {
  console.log("📁 public/sequence/ already exists");
}

// 2. Copy frames
const files = readdirSync(SRC).filter((f) => f.endsWith(".jpg"));
console.log(`\n🖼️  Copying ${files.length} frames...`);
let copied = 0;
for (const file of files) {
  copyFileSync(join(SRC, file), join(DEST, file));
  copied++;
  if (copied % 50 === 0) process.stdout.write(`   ${copied}/${files.length}\n`);
}
console.log(`✅ Copied ${copied} frames\n`);

// 3. npm install
console.log("📦 Installing dependencies...");
try {
  execSync("npm install", { cwd: ROOT, stdio: "inherit" });
  console.log("\n✅ Dependencies installed");
} catch (e) {
  console.error("❌ npm install failed:", e.message);
}

console.log("\n" + "─".repeat(40));
console.log("🚀 Ready! Run: npm run dev");
console.log("   Open: http://localhost:3000\n");
