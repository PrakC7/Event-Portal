import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get("eventId");
        const userId = searchParams.get("userId");
        const db = await readDB();
        if (!db.enrollments) {
            return NextResponse.json({ enrollments: [] });
        }
        let enrollments = db.enrollments;
        if (eventId) {
            enrollments = enrollments.filter((en: any) => en.eventId === eventId);
        }
        if (userId) {
            enrollments = enrollments.filter((en: any) => en.userId === userId);
        }
        return NextResponse.json({ enrollments });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export async function DELETE(req: Request) {
    try {
        const { eventId, enrollmentId } = await req.json();
        const db = await readDB();
        if (!db.enrollments) {
            return NextResponse.json({ message: "No enrollments found" }, { status: 404 });
        }
        if (enrollmentId) {
            const initialCount = db.enrollments.length;
            db.enrollments = db.enrollments.filter((en: any) => en.id !== enrollmentId);
            if (db.enrollments.length !== initialCount) {
                const eventIndex = db.events.findIndex((e: any) => e.id === eventId);
                if (eventIndex !== -1) {
                    db.events[eventIndex].enrolled = Math.max(0, (db.events[eventIndex].enrolled || 1) - 1);
                }
                await writeDB(db);
                return NextResponse.json({ message: "Student enrollment cancelled" });
            }
            return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
        }
        const initialCount = db.enrollments.length;
        db.enrollments = db.enrollments.filter((en: any) => en.eventId !== eventId);
        if (db.enrollments.length !== initialCount) {
            const eventIndex = db.events.findIndex((e: any) => e.id === eventId);
            if (eventIndex !== -1) {
                db.events[eventIndex].enrolled = 0;
            }
            await writeDB(db);
        }
        return NextResponse.json({ message: "Enrollment database cleared for this event" });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
