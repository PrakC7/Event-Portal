import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
export async function POST(req: Request) {
    try {
        const { userId, status } = await req.json();
        const db = await readDB();
        const userIndex = db.users.findIndex((u: any) => u.id === userId);
        if (userIndex === -1) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        if (status === 'rejected') {
            db.users.splice(userIndex, 1);
            await writeDB(db);
            return NextResponse.json({ message: "Student registration rejected and deleted." });
        }
        db.users[userIndex].status = status;
        delete db.users[userIndex].rejectedAt;
        await writeDB(db);
        return NextResponse.json({ message: "User verification status updated." });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
