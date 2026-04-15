import { NextResponse } from "next/server";
import { readDB, writeDB, cleanupDB } from "@/lib/db";
export async function GET() {
    try {
        const db = await cleanupDB();
        const students = db.users.filter((u: any) => u.role === "student");
        return NextResponse.json({ students });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
