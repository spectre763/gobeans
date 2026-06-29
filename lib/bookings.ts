import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { Redis as UpstashRedis } from "@upstash/redis";
import { createClient, type RedisClientType } from "redis";

export interface Booking {
  id: string;
  locationId: string;
  locationName: string;
  date: string;
  time: string;
  partySize: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  confirmationSent: boolean;
  createdAt: string;
}

const REDIS_KEY = "gobeans:bookings";

type StorageKind = "upstash" | "redis-url" | "file";

function sortBookings(bookings: Booking[]): Booking[] {
  return bookings.sort(
    (a, b) =>
      new Date(`${b.date}T${b.time}`).getTime() -
      new Date(`${a.date}T${a.time}`).getTime()
  );
}

function getStorageKind(): StorageKind {
  const upstashUrl =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const upstashToken =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (upstashUrl && upstashToken) return "upstash";
  if (process.env.REDIS_URL) return "redis-url";
  return "file";
}

function getUpstashRedis(): UpstashRedis {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL!;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN!;

  return new UpstashRedis({ url, token });
}

let nodeRedisClient: RedisClientType | null = null;

async function getNodeRedisClient(): Promise<RedisClientType> {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured.");
  }

  if (!nodeRedisClient) {
    nodeRedisClient = createClient({ url: process.env.REDIS_URL });
    nodeRedisClient.on("error", (err) => console.error("Redis error:", err));
    await nodeRedisClient.connect();
  }

  return nodeRedisClient;
}

function getBookingsFilePath(): string {
  return path.join(process.cwd(), "data", "bookings.json");
}

async function ensureBookingsFile(): Promise<void> {
  const filePath = getBookingsFilePath();
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "[]", "utf-8");
  }
}

async function getBookingsFromFile(): Promise<Booking[]> {
  await ensureBookingsFile();
  const raw = await fs.readFile(getBookingsFilePath(), "utf-8");
  return sortBookings(JSON.parse(raw) as Booking[]);
}

async function saveBookingsToFile(bookings: Booking[]): Promise<void> {
  await ensureBookingsFile();
  await fs.writeFile(
    getBookingsFilePath(),
    JSON.stringify(bookings, null, 2),
    "utf-8"
  );
}

async function getBookingsFromUpstash(redis: UpstashRedis): Promise<Booking[]> {
  const bookings = await redis.get<Booking[]>(REDIS_KEY);
  return sortBookings(bookings ?? []);
}

async function saveBookingsToUpstash(
  redis: UpstashRedis,
  bookings: Booking[]
): Promise<void> {
  await redis.set(REDIS_KEY, bookings);
}

async function getBookingsFromNodeRedis(): Promise<Booking[]> {
  const client = await getNodeRedisClient();
  const raw = await client.get(REDIS_KEY);
  if (!raw) return [];
  return sortBookings(JSON.parse(raw) as Booking[]);
}

async function saveBookingsToNodeRedis(bookings: Booking[]): Promise<void> {
  const client = await getNodeRedisClient();
  await client.set(REDIS_KEY, JSON.stringify(bookings));
}

async function readBookings(): Promise<Booking[]> {
  const kind = getStorageKind();

  if (kind === "upstash") {
    return getBookingsFromUpstash(getUpstashRedis());
  }

  if (kind === "redis-url") {
    return getBookingsFromNodeRedis();
  }

  return getBookingsFromFile();
}

async function writeBookings(bookings: Booking[]): Promise<void> {
  const kind = getStorageKind();

  if (kind === "upstash") {
    await saveBookingsToUpstash(getUpstashRedis(), bookings);
    return;
  }

  if (kind === "redis-url") {
    await saveBookingsToNodeRedis(bookings);
    return;
  }

  await saveBookingsToFile(bookings);
}

export async function getBookings(): Promise<Booking[]> {
  return readBookings();
}

export async function addBooking(
  data: Omit<Booking, "id" | "confirmationSent" | "createdAt">
): Promise<Booking> {
  const booking: Booking = {
    ...data,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    confirmationSent: false,
    createdAt: new Date().toISOString(),
  };

  const bookings = await readBookings();
  bookings.unshift(booking);
  await writeBookings(bookings);
  return booking;
}

export async function markConfirmationSent(id: string): Promise<void> {
  const bookings = await readBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return;

  bookings[index].confirmationSent = true;
  await writeBookings(bookings);
}
