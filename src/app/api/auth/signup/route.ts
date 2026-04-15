import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import bcrypt from "bcryptjs";
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const fullName = body.fullName;
        const studentId = body.studentId || "";
        const email = body.email;
        const password = body.password;
        const idPhoto = body.idPhoto || "";
        if (!fullName || !email || !password) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }
        if (!email.toLowerCase().endsWith("@niet.co.in")) {
            return NextResponse.json({ error: "Registration is only allowed for @niet.co.in email addresses." }, { status: 400 });
        }
        const db = await readDB();
        if (!db.users)
            db.users = [];
        if (db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
            return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
        }
        if (studentId && db.users.find((u: any) => u.studentId === studentId)) {
            return NextResponse.json({ error: "This Student ID is already registered." }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            fullName,
            studentId,
            email,
            password: hashedPassword,
            role: "student",
            status: "pending",
            idPhoto,
            createdAt: new Date().toISOString()
        };
        db.users.push(newUser);
        await writeDB(db);
        return NextResponse.json({
            message: "Registration successful. Pending verification."
        });
    }
    catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
