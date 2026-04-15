import fs from "fs/promises";
import path from "path";
const SEED_DB_PATH = path.join(process.cwd(), "src/lib/db.json");
const DB_PATH = process.env.VERCEL
    ? path.join("/tmp", "db.json")
    : SEED_DB_PATH;
async function ensureDBFile() {
    try {
        await fs.access(DB_PATH);
    }
    catch {
        const seed = await fs.readFile(SEED_DB_PATH, "utf-8");
        await fs.writeFile(DB_PATH, seed, "utf-8");
    }
}
export async function readDB() {
    await ensureDBFile();
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
}
export async function writeDB(data: any) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
export async function cleanupDB() {
    const db = await readDB();
    const now = new Date();
    let modified = false;
    const initialUsersCount = db.users.length;
    db.users = db.users.filter((u: any) => u.status !== "rejected");
    if (db.users.length !== initialUsersCount)
        modified = true;
    const twelveHoursInMs = 12 * 60 * 60 * 1000;
    const expiredEventIds: string[] = [];
    const initialEventsCount = db.events.length;
    db.events = db.events.filter((event: any) => {
        try {
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            if (isNaN(eventDateTime.getTime()))
                return true;
            const isExpired = now.getTime() > (eventDateTime.getTime() + twelveHoursInMs);
            if (isExpired) {
                expiredEventIds.push(event.id);
                return false;
            }
            return true;
        }
        catch (e) {
            return true;
        }
    });
    if (db.events.length !== initialEventsCount)
        modified = true;
    if (expiredEventIds.length > 0 && db.enrollments) {
        const initialEnrollmentsCount = db.enrollments.length;
        db.enrollments = db.enrollments.filter((en: any) => !expiredEventIds.includes(en.eventId));
        if (db.enrollments.length !== initialEnrollmentsCount)
            modified = true;
    }
    if (modified) {
        await writeDB(db);
    }
    return db;
}
