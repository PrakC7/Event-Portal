import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
export async function POST(req: Request) {
    try {
        const { title, date, time, location, category, organizer, allowedBranches } = await req.json();
        const db = await readDB();
        const newEvent = {
            id: Date.now().toString(),
            title,
            date,
            time,
            location,
            category,
            organizer,
            allowedBranches: allowedBranches || ["All"],
            enrolled: 0
        };
        db.events.push(newEvent);
        await writeDB(db);
        return NextResponse.json({ message: "Event created successfully.", event: newEvent });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export async function DELETE(req: Request) {
    try {
        const { eventId } = await req.json();
        const db = await readDB();
        db.events = db.events.filter((e: any) => e.id !== eventId);
        await writeDB(db);
        return NextResponse.json({ message: "Event deleted successfully." });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export async function GET() {
    try {
        const db = await readDB();
        return NextResponse.json({ events: db.events });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
