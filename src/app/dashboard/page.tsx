"use client";
import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, MapPin, Search, Star, Bookmark, CheckCircle, ArrowRight } from "lucide-react";
import { cn, getBranchFromEmail } from "@/lib/utils";
import { clearUserSession, getStoredUser } from "@/lib/auth";
interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    description: string;
    image: string;
    enrolled: boolean;
    organizer?: string;
    allowedBranches?: string[];
}
export default function StudentDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'enrolled'>('all');
    const [studentUser, setStudentUser] = useState<any>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const user = getStoredUser();
        if (!user) {
            setLoading(false);
            window.location.href = "/login";
            return;
        }
        setStudentUser(user);
        fetchEvents(user.id);
    }, []);
    const fetchEvents = async (userId: string) => {
        try {
            const [eventsRes, enrollmentsRes] = await Promise.all([
                fetch("/api/admin/events"),
                fetch(`/api/admin/enrollments?userId=${userId}`)
            ]);
            const eventsData = await eventsRes.json();
            const enrollmentsData = await enrollmentsRes.json();
            const userEnrollments = enrollmentsData.enrollments || [];
            const enrolledEventIds = new Set(userEnrollments.map((en: any) => en.eventId));
            const mappedEvents = (eventsData.events || []).map((e: any) => ({
                ...e,
                enrolled: enrolledEventIds.has(e.id)
            }));
            setEvents(mappedEvents);
        }
        catch (error) {
            console.error("Failed to fetch events:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleEnroll = async (id: string) => {
        if (!studentUser)
            return;
        try {
            const response = await fetch("/api/events/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: id, userId: studentUser.id }),
            });
            const result = await response.json();
            if (response.ok) {
                setEvents(events.map(e => e.id === id ? { ...e, enrolled: true } : e));
                alert(`Successfully enrolled in ${result.branch} branch!`);
            }
            else {
                alert(result.error);
            }
        }
        catch (error) {
            console.error("Enrollment failed:", error);
        }
    };
    const parseEventDateTime = (date: string, time: string) => {
        const isoDateTime = new Date(`${date}T${time}`);
        if (!isNaN(isoDateTime.getTime()))
            return isoDateTime;
        const humanDateTime = new Date(`${date} ${time}`);
        if (!isNaN(humanDateTime.getTime()))
            return humanDateTime;
        return null;
    };
    const eligibleEvents = useMemo(() => {
        if (!studentUser)
            return [];
        const studentBranch = getBranchFromEmail(studentUser.email);
        const now = new Date();
        return events.filter(e => {
            const eventDateTime = parseEventDateTime(e.date, e.time);
            if (!eventDateTime)
                return false;
            if (eventDateTime <= now)
                return false;
            if (e.allowedBranches && e.allowedBranches.length > 0) {
                const isAllBranches = e.allowedBranches.includes("All");
                const isStudentBranchAllowed = e.allowedBranches.includes(studentBranch);
                if (!isAllBranches && !isStudentBranchAllowed)
                    return false;
            }
            return true;
        });
    }, [events, studentUser]);
    const filteredEvents = eligibleEvents.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.category.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch)
            return false;
        if (activeTab === 'enrolled')
            return e.enrolled;
        if (activeTab === 'upcoming') {
            const eventDate = parseEventDateTime(e.date, e.time);
            if (!eventDate)
                return false;
            return eventDate > new Date();
        }
        return true;
    });
    return (<div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Welcome Back, <br className="md:hidden"/>
                            <span className="text-primary">{studentUser?.fullName}</span>!
                        </h1>
                        <p className="text-gray-600 text-base md:text-lg mt-2 font-medium">Explore and enroll in upcoming campus events.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="relative flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm md:text-base"/>
                        </div>
                        <button onClick={() => {
            clearUserSession();
            window.location.href = "/login";
        }} className="px-6 py-3 md:py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors text-sm md:text-base whitespace-nowrap flex items-center justify-center gap-2">
                            <ArrowRight className="w-5 h-5 md:hidden"/> Logout
                        </button>
                    </div>
                </header>

                
                <div className="flex overflow-x-auto no-scrollbar md:grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                    <button onClick={() => setActiveTab('upcoming')} className={cn("flex-shrink-0 w-[280px] md:w-auto p-5 md:p-6 rounded-3xl text-left transition-all flex items-center gap-4 border-2", activeTab === 'upcoming'
            ? "bg-primary text-white border-primary shadow-xl scale-[1.02] md:scale-105"
            : "bg-white text-gray-900 border-gray-100 shadow-md hover:border-primary/50")}>
                        <div className={cn("p-3 md:p-4 rounded-2xl", activeTab === 'upcoming' ? "bg-white/20" : "bg-primary/10 text-primary")}>
                            <Calendar className="w-6 h-6 md:w-8 md:h-8"/>
                        </div>
                        <div>
                            <p className={cn("text-xs md:text-sm font-medium", activeTab === 'upcoming' ? "text-white/70" : "text-gray-500")}>Upcoming</p>
                            <h3 className="text-xl md:text-3xl font-bold">{eligibleEvents.filter(e => {
            const date = parseEventDateTime(e.date, e.time);
            return !!date && date > new Date();
        }).length}</h3>
                        </div>
                    </button>

                    <button onClick={() => setActiveTab('enrolled')} className={cn("flex-shrink-0 w-[280px] md:w-auto p-5 md:p-6 rounded-3xl text-left transition-all flex items-center gap-4 border-2", activeTab === 'enrolled'
            ? "bg-green-600 text-white border-green-600 shadow-xl scale-[1.02] md:scale-105"
            : "bg-white text-gray-900 border-gray-100 shadow-md hover:border-green-600/50")}>
                        <div className={cn("p-3 md:p-4 rounded-2xl", activeTab === 'enrolled' ? "bg-white/20" : "bg-green-100 text-green-600")}>
                            <CheckCircle className="w-6 h-6 md:w-8 md:h-8"/>
                        </div>
                        <div>
                            <p className={cn("text-xs md:text-sm font-medium", activeTab === 'enrolled' ? "text-white/70" : "text-gray-500")}>My Enrollments</p>
                            <h3 className="text-xl md:text-3xl font-bold">{eligibleEvents.filter(e => e.enrolled).length}</h3>
                        </div>
                    </button>

                    <button onClick={() => setActiveTab('all')} className={cn("flex-shrink-0 w-[280px] md:w-auto p-5 md:p-6 rounded-3xl text-left transition-all flex items-center gap-4 border-2", activeTab === 'all'
            ? "bg-yellow-500 text-white border-yellow-500 shadow-xl scale-[1.02] md:scale-105"
            : "bg-white text-gray-900 border-gray-100 shadow-md hover:border-yellow-500/50")}>
                        <div className={cn("p-3 md:p-4 rounded-2xl", activeTab === 'all' ? "bg-white/20" : "bg-yellow-100 text-yellow-600")}>
                            <Star className="w-6 h-6 md:w-8 md:h-8"/>
                        </div>
                        <div>
                            <p className={cn("text-xs md:text-sm font-medium", activeTab === 'all' ? "text-white/70" : "text-gray-500")}>All Events</p>
                            <h3 className="text-xl md:text-3xl font-bold">{eligibleEvents.length}</h3>
                        </div>
                    </button>
                </div>

                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {filteredEvents.map(event => (<div key={event.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
                            <div className="relative w-full sm:w-48 lg:w-56 h-48 sm:h-auto overflow-hidden">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-primary text-[10px] font-black shadow-sm uppercase tracking-wider">
                                    {event.category}
                                </div>
                            </div>
                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">{event.title}</h3>
                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                        <Bookmark className="w-5 h-5"/>
                                    </button>
                                </div>
                                <p className="text-primary/80 font-bold text-xs md:text-sm mb-3 flex items-center gap-1">
                                    Organizer: {event.organizer || "NIET Club"}
                                </p>
                                <p className="text-gray-500 text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">{event.description}</p>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 font-semibold">
                                        <Calendar className="w-4 h-4 text-primary"/> {event.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 font-semibold">
                                        <Clock className="w-4 h-4 text-primary"/> {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 font-semibold col-span-2">
                                        <MapPin className="w-4 h-4 text-primary"/> {event.location}
                                    </div>
                                </div>
                                <div className="mt-auto flex gap-3 md:gap-4">
                                    <button onClick={() => handleEnroll(event.id)} className={cn("flex-1 py-3 md:py-4 font-black rounded-2xl transition-all flex items-center justify-center gap-2 text-sm md:text-base", event.enrolled
                ? "bg-green-50 text-green-600 border border-green-100 cursor-default"
                : "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg")}>
                                        {event.enrolled ? (<><CheckCircle className="w-5 h-5"/> Enrolled</>) : ("Enroll Now")}
                                    </button>
                                    <button className="px-5 md:px-6 py-3 md:py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>))}
                </div>

                {filteredEvents.length === 0 && (<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-400"/>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500">Try searching for a different keyword or category.</p>
                    </div>)}
            </div>
        </div>);
}
