"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { Calendar, Users, ShieldCheck, ArrowRight, Star, Play, Sparkles, Trophy, Music, Code, Lightbulb, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeChapter, setActiveChapter] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };
    const chapters = [
        {
            id: 1,
            title: "The Grand Finale",
            subtitle: "Cultural Night 2026",
            theme: "from-purple-600 to-pink-600",
            accent: "text-pink-400",
            date: "Recent",
            pages: [
                { type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-large-crowd-of-people-at-a-music-festival-42243-large.mp4" },
                { type: "image", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" },
                { type: "image", url: "https://images.unsplash.com/photo-1514525253344-99a42999628a?auto=format&fit=crop&q=80" }
            ]
        },
        {
            id: 2,
            title: "Tech Surge",
            subtitle: "Hackathon Highlights",
            theme: "from-blue-600 to-cyan-500",
            accent: "text-cyan-400",
            date: "2 Days Ago",
            pages: [
                { type: "image", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80" },
                { type: "image", url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80" },
                { type: "image", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80" }
            ]
        },
        {
            id: 3,
            title: "Victory Lap",
            subtitle: "Annual Sports Meet",
            theme: "from-orange-600 to-yellow-500",
            accent: "text-yellow-400",
            date: "1 Week Ago",
            pages: [
                { type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-a-track-at-sunset-42223-large.mp4" },
                { type: "image", url: "https://images.unsplash.com/photo-1533443195121-067991244cb9?auto=format&fit=crop&q=80" },
                { type: "image", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80" }
            ]
        },
        {
            id: 4,
            title: "Creative Spark",
            subtitle: "Art & Design Expo",
            theme: "from-green-600 to-emerald-500",
            accent: "text-emerald-400",
            date: "2 Weeks Ago",
            pages: [
                { type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-creative-painting-42407-large.mp4" },
                { type: "image", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80" },
                { type: "image", url: "https://images.unsplash.com/photo-1460666819451-7410f5ef139a?auto=format&fit=crop&q=80" }
            ]
        }
    ];
    const handleNext = useCallback(() => {
        if (activeChapter && currentPage < activeChapter.pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        }
    }, [activeChapter, currentPage]);
    const handlePrev = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeChapter)
                return;
            if (e.key === "ArrowRight")
                handleNext();
            if (e.key === "ArrowLeft")
                handlePrev();
            if (e.key === "Escape")
                setActiveChapter(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeChapter, handleNext, handlePrev]);
    const pastEvents = [
        {
            title: "NIET Hackathon 2025",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
            stats: "200+ Participants",
            winner: "Team Innovators"
        },
        {
            title: "Cultural Fest 'Goonj'",
            category: "Cultural",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
            stats: "1000+ Attendees",
            winner: "CSAI Branch"
        },
        {
            title: "Sports Meet 2024",
            category: "Sports",
            image: "https://images.unsplash.com/photo-1533443195121-067991244cb9?auto=format&fit=crop&q=80&w=800",
            stats: "15+ Games",
            winner: "ME Branch"
        },
        {
            title: "AI Workshop",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            stats: "Expert Speakers",
            winner: "Workshop Series"
        }
    ];
    return (<main className="min-h-screen bg-black">
      
      <section className="relative min-h-screen flex items-center overflow-hidden">
        
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"/>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"/>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"/>

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"/>
          <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" alt="NIET Events" fill className="object-cover scale-105 animate-slow-zoom" priority/>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary font-bold text-sm mb-6 md:mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4"/> The Official NIET Event Hub
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-8 leading-[1.1] md:leading-none tracking-tighter animate-fade-in">
              BEYOND THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-300">CLASSROOM</span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-2xl animate-fade-in animation-delay-500">
              Unleash your potential in the most vibrant campus community.
              Join thousands of students in shaping the future of NIET.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-fade-in animation-delay-1000">
              <Link href="/login" className="group px-8 md:px-10 py-4 md:py-5 bg-secondary text-primary font-black rounded-2xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center justify-center gap-3 text-lg">
                Join Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform"/>
              </Link>
              <Link href="/signup" className="px-8 md:px-10 py-4 md:py-5 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 backdrop-blur-xl transition-all border border-white/20 flex items-center justify-center gap-2 text-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 md:py-32 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:min-h-[120px] md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-secondary font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4">
              <div className="w-8 md:w-10 h-[2px] bg-secondary"/> Featured Highlights
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">CHAPTERS</h2>
          </div>
          <div className="flex gap-3 md:gap-4">
            <button onClick={() => scroll('left')} className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all group">
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform"/>
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all group">
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-[10%]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {chapters.map((chapter) => (<div key={chapter.id} className="min-w-[90vw] md:min-w-[60vw] lg:min-w-[45vw] snap-center">
              <div className="group relative aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gray-900 border border-white/5">
                <Image src={chapter.pages[0].type === 'image' ? chapter.pages[0].url : chapter.pages[1]?.url || chapter.pages[0].url} alt={chapter.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"/>

                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"/>

                
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      {chapter.date}
                    </div>
                    {chapter.pages.some((p: any) => p.type === 'video') && (<div className="w-10 h-12 md:w-14 md:h-14 rounded-full bg-secondary flex items-center justify-center text-primary shadow-lg animate-pulse">
                        <Play className="w-4 h-4 md:w-6 md:h-6 fill-primary"/>
                      </div>)}
                  </div>

                  <div>
                    <p className="text-secondary font-bold text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-widest">{chapter.subtitle}</p>
                    <h3 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6">{chapter.title}</h3>
                    <button onClick={() => {
                setActiveChapter(chapter);
                setCurrentPage(0);
            }} className="px-6 py-3 md:px-8 md:py-4 bg-white text-primary font-black rounded-xl md:rounded-2xl hover:bg-secondary transition-all transform hover:-translate-y-1 text-xs md:text-sm">
                      VIEW CHAPTER
                    </button>
                  </div>
                </div>
              </div>
            </div>))}
        </div>
      </section>

      
      {activeChapter && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl">
          <button onClick={() => setActiveChapter(null)} className="absolute top-6 right-6 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110]">
            <X className="w-8 h-8"/>
          </button>

          <div className="relative w-full max-w-6xl aspect-[4/3] md:aspect-[16/9] flex items-center justify-center perspective-2000">
            
            <div className={`absolute inset-0 bg-gradient-to-br ${activeChapter.theme} opacity-20 blur-[120px] rounded-full animate-pulse`}/>

            
            <div className="absolute inset-y-0 -left-4 md:-left-20 flex items-center z-[110]">
              <button onClick={handlePrev} disabled={currentPage === 0} className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all disabled:opacity-0">
                <ChevronLeft className="w-8 h-8 md:w-12 md:h-12"/>
              </button>
            </div>
            <div className="absolute inset-y-0 -right-4 md:-right-20 flex items-center z-[110]">
              <button onClick={handleNext} disabled={currentPage === activeChapter.pages.length - 1} className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all disabled:opacity-0">
                <ChevronRight className="w-8 h-8 md:w-12 md:h-12"/>
              </button>
            </div>

            
            <div className="relative w-full h-full preserve-3d">
              {activeChapter.pages.map((page: any, index: number) => {
                const isCurrent = index === currentPage;
                const isPast = index < currentPage;
                const isFuture = index > currentPage;
                return (<div key={index} className={cn("absolute inset-0 transition-all duration-700 ease-in-out origin-left preserve-3d", isCurrent ? "z-20 opacity-100 rotate-y-0" :
                        isPast ? "z-10 opacity-0 -rotate-y-180" :
                            "z-0 opacity-0 rotate-y-0")}>
                    <div className="w-full h-full rounded-3xl md:rounded-[3rem] overflow-hidden bg-gray-900 border border-white/10 shadow-2xl relative">
                      {page.type === 'video' ? (<video src={page.url} autoPlay loop playsInline className="w-full h-full object-cover"/>) : (<Image src={page.url} alt={`Page ${index + 1}`} fill className="object-cover"/>)}

                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-6 md:p-12 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div className={`px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em]`}>
                            PAGE {index + 1} / {activeChapter.pages.length}
                          </div>
                          <div className={`text-2xl md:text-4xl font-black ${activeChapter.accent} italic`}>
                            {activeChapter.title.split(' ')[0]}
                          </div>
                        </div>

                        <div className="max-w-2xl">
                          <h4 className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">{activeChapter.title}</h4>
                          <p className="text-gray-300 text-sm md:text-lg font-medium leading-relaxed">
                            {activeChapter.subtitle} - Capturing the essence of excellence at NIET.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>);
            })}
            </div>

            
            <div className="absolute -bottom-12 md:-bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white/30 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> PREV</span>
              <span className="w-1 h-1 bg-white/30 rounded-full"/>
              <span>USE ARROW KEYS TO FLIP</span>
              <span className="w-1 h-1 bg-white/30 rounded-full"/>
              <span className="flex items-center gap-2">NEXT <ChevronRight className="w-4 h-4"/></span>
            </div>
          </div>
        </div>)}

      
      <section className="py-16 md:py-24 relative overflow-hidden bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
            { icon: <Trophy />, label: "Winning Moments", val: "500+", color: "text-secondary" },
            { icon: <Music />, label: "Cultural Events", val: "100+", color: "text-blue-400" },
            { icon: <Code />, label: "Tech Innovations", val: "250+", color: "text-green-400" }
        ].map((stat, i) => (<div key={i} className="group relative p-8 md:p-10 bg-white/5 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.val}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">{stat.label}</p>
              </div>))}
          </div>
        </div>
      </section>

      
      <section className="py-20 md:py-32 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6">RECAP <span className="text-white/20 font-outline text-5xl md:text-8xl">RECAP</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium">Glances from our legendary past events</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Play className="w-6 h-6 rotate-180"/>
            </button>
            <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Play className="w-6 h-6"/>
            </button>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastEvents.map((event, i) => (<div key={i} className="group relative aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-900 border border-white/10">
                <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"/>

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end transform group-hover:-translate-y-4 transition-transform duration-500">
                  <div className="mb-3 md:mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest w-fit">
                    {event.category}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{event.title}</h3>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-secondary font-bold text-xs md:text-sm">{event.stats}</span>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      
      <section className="py-24 md:py-40 relative bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-secondary mx-auto mb-8 md:mb-12 opacity-50"/>
          <h2 className="text-3xl md:text-6xl font-black text-white leading-tight italic tracking-tighter">
            "We don't just host events, <br className="hidden md:block"/>
            we create <span className="text-secondary">MEMORIES</span> that last a lifetime."
          </h2>
        </div>
      </section>

      
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-90"/>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-8xl font-black text-white mb-8 md:mb-12 tracking-tighter">READY FOR THE NEXT BIG THING?</h2>
          <Link href="/signup" className="inline-flex items-center gap-3 md:gap-4 px-8 py-4 md:px-12 md:py-6 bg-white text-primary font-black rounded-full hover:scale-105 transition-transform shadow-2xl text-base sm:text-lg md:text-2xl">
            BECOME A MEMBER <ArrowRight className="w-6 h-6 md:w-8 md:h-8"/>
          </Link>
        </div>
      </section>

      
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 font-medium">
        <p>© 2026 NIET Event Portal. Created for the students, by the students.</p>
      </footer>
    </main>);
}
