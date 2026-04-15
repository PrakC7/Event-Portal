import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function getBranchFromEmail(email: string): string {
    const e = email.toLowerCase();
    if (e.includes("csai"))
        return "Computer Science (AI)";
    if (e.includes("csml"))
        return "Computer Science (ML)";
    if (e.includes("cse"))
        return "Computer Science Engineering";
    if (e.includes("it"))
        return "Information Technology";
    if (e.includes("ds"))
        return "Data Science";
    if (e.includes("iot"))
        return "IoT";
    return "General/Other";
}
