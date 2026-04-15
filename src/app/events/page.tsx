"use client";
import { useState } from "react";
import { Calendar, Clock, MapPin, Search, ArrowRight, Filter, Star } from "lucide-react";
import Link from "next/link";
interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    image: string;
    description: string;
}
export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const categories = ["All", "Technical", "Cultural", "Sports", "Workshop"];
    const events: Event[] = [
        {
            id: "1",
            title: "NIET Tech Fest 2026",
            date: "May 15, 2027",
            time: "10:00 AM",
            location: "Main Auditorium",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80&w=800",
            description: "Experience innovation and technology at its best."
        },
        {
            id: "2",
            title: "Cultural Night 2026",
            date: "May 20, 2027",
            time: "05:00 PM",
            location: "Open Air Theatre",
            category: "Cultural",
            image: "https://images.unsplash.com/photo-1514525253361-bee8718a74a7?auto=format&fit=crop&q=80&w=800",
            description: "A celebration of music, dance, and arts."
        },
        {
            id: "3",
            title: "AI & ML Workshop",
            date: "June 05, 2027",
            time: "09:00 AM",
            location: "Lab 5, Block C",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            description: "Master AI/ML with hands-on training."
        },
        {
            id: "4",
            title: "Annual Sports Meet",
            date: "June 10, 2027",
            time: "08:00 AM",
            location: "College Ground",
            category: "Sports",
            image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800",
            description: "Show your athletic spirit and sportsmanship."
        }
    ];
    const filteredEvents = events.filter(e => {
        const eventDate = new Date(`${e.date} ${e.time}`);
        const isUpcoming = !isNaN(eventDate.getTime()) && eventDate > new Date();
        return isUpcoming &&
            (activeCategory === "All" || e.category === activeCategory) &&
            (e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return (<div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary font-bold mb-4">
            <Star className="w-5 h-5 fill-primary"/>
            <span className="uppercase tracking-widest text-sm">Discover</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">Upcoming Events</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Stay updated with all the latest happenings at NIET. From tech hackathons to cultural nights, there's something for everyone.
          </p>
        </header>

        
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"/>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"/>
            {categories.map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${activeCategory === cat
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"}`}>
                {cat}
              </button>))}
          </div>
        </div>

        
        <div className="space-y-8">
          {filteredEvents.map(event => (<div key={event.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row h-auto md:h-72">
              <div className="relative w-full md:w-80 h-64 md:h-full overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-secondary text-secondary"/> Featured Event
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-4 py-1.5 bg-blue-50 text-primary text-xs font-bold rounded-full uppercase tracking-widest border border-blue-100">
                      {event.category}
                    </span>
                    <span className="text-gray-400 font-bold text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4"/> {event.date}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-lg line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <Clock className="w-5 h-5 text-primary"/> {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <MapPin className="w-5 h-5 text-primary"/> {event.location}
                    </div>
                  </div>
                  <Link href="/login" className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    Enroll Now <ArrowRight className="w-5 h-5"/>
                  </Link>
                </div>
              </div>
            </div>))}
        </div>

        {filteredEvents.length === 0 && (<div className="text-center py-20">
            <p className="text-gray-500 text-xl font-medium">No events found matching your criteria.</p>
          </div>)}
      </div>
    </div>);
}
