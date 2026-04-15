"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogIn, UserPlus, Calendar, Home, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearUserSession, getStoredUser } from "@/lib/auth";
export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        setUser(getStoredUser());
    }, []);
    const handleLogout = () => {
        clearUserSession();
        setUser(null);
        window.location.href = "/";
    };
    return (<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white"/>
              </div>
              <span className="text-xl font-bold text-primary tracking-tight">NIET Event Portal</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4"/> Home
            </Link>
            <Link href="/events" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
              <Calendar className="w-4 h-4"/> Events
            </Link>
            {user && (<Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="text-primary font-bold hover:underline flex items-center gap-1">
                <User className="w-4 h-4"/> Dashboard
              </Link>)}
          </div>

          <div className="flex items-center gap-4">
            {user ? (<div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Hello, <span className="text-primary font-bold">{user.fullName}</span>
                </span>
                <button onClick={handleLogout} className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4"/> Logout
                </button>
              </div>) : (<>
                <Link href="/login" className="px-4 py-2 text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-2">
                  <LogIn className="w-4 h-4"/> Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                  <UserPlus className="w-4 h-4"/> Join Now
                </Link>
              </>)}
          </div>
        </div>
      </div>
    </nav>);
}
