export type SessionUser = {
    id: string;
    email: string;
    fullName: string;
    role: string;
    status?: string;
    clubName?: string;
};
const STORAGE_KEY = "user";
const COOKIE_KEY = "user_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
function isBrowser() {
    return typeof window !== "undefined";
}
function encode(user: SessionUser): string {
    return encodeURIComponent(JSON.stringify(user));
}
function decode(value: string): SessionUser | null {
    try {
        return JSON.parse(decodeURIComponent(value));
    }
    catch {
        return null;
    }
}
function readCookie(name: string): string | null {
    if (!isBrowser())
        return null;
    const prefix = `${name}=`;
    const parts = document.cookie.split(";");
    for (const raw of parts) {
        const item = raw.trim();
        if (item.startsWith(prefix)) {
            return item.slice(prefix.length);
        }
    }
    return null;
}
export function getStoredUser(): SessionUser | null {
    if (!isBrowser())
        return null;
    const fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) {
        try {
            return JSON.parse(fromLocal) as SessionUser;
        }
        catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
    const fromCookie = readCookie(COOKIE_KEY);
    if (!fromCookie)
        return null;
    const parsed = decode(fromCookie);
    if (!parsed)
        return null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
}
export function saveUserSession(user: SessionUser) {
    if (!isBrowser())
        return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    document.cookie = `${COOKIE_KEY}=${encode(user)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}
export function clearUserSession() {
    if (!isBrowser())
        return;
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}
