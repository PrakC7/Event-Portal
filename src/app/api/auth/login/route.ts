import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import bcrypt from "bcryptjs";
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const db = await readDB();
        const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }
        let isPasswordValid = false;
        if (user.password.startsWith("$2")) {
            isPasswordValid = await bcrypt.compare(password, user.password);
        }
        else {
            isPasswordValid = password === user.password;
        }
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }
        if (user.role === "student" && user.status === "pending") {
            return NextResponse.json({ error: "Account pending verification. Please wait for admin approval." }, { status: 403 });
        }
        if (user.role === "student" && user.status === "rejected") {
            return NextResponse.json({ error: "Registration rejected. Contact admin." }, { status: 403 });
        }
        const userData = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
            clubName: user.clubName
        };
        return NextResponse.json({
            message: "Login successful.",
            user: userData
        });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
