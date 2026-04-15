import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getBranchFromEmail } from "@/lib/utils";
export async function POST(req: Request) {
    try {
        const { eventId, userId } = await req.json();
        const db = await readDB();
        const user = db.users.find((u: any) => u.id === userId);
        const event = db.events.find((e: any) => e.id === eventId);
        if (!user || !event) {
            return NextResponse.json({ error: "User or Event not found" }, { status: 404 });
        }
        if (!db.enrollments) {
            db.enrollments = [];
        }
        const existing = db.enrollments.find((en: any) => en.eventId === eventId && en.userId === userId);
        if (existing) {
            return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
        }
        const branch = getBranchFromEmail(user.email);
        if (event.allowedBranches && !event.allowedBranches.includes("All")) {
            if (!event.allowedBranches.includes(branch)) {
                return NextResponse.json({
                    error: `This event is only open to students from: ${event.allowedBranches.join(", ")}. Your branch is identified as ${branch}.`
                }, { status: 403 });
            }
        }
        const newEnrollment = {
            id: Date.now().toString(),
            eventId,
            userId,
            studentName: user.fullName,
            studentId: user.studentId,
            email: user.email,
            branch,
            enrolledAt: new Date().toISOString()
        };
        db.enrollments.push(newEnrollment);
        const eventIndex = db.events.findIndex((e: any) => e.id === eventId);
        db.events[eventIndex].enrolled = (db.events[eventIndex].enrolled || 0) + 1;
        await writeDB(db);
        return NextResponse.json({ message: "Successfully enrolled", branch });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
