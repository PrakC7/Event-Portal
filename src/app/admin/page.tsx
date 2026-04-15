"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, XCircle, Users, Calendar, Clock, MapPin, Eye, Download, FileSpreadsheet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearUserSession, getStoredUser } from "@/lib/auth";
interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    enrolled: number;
    organizer?: string;
    allowedBranches?: string[];
}
interface StudentVerification {
    id: string;
    fullName: string;
    studentId: string;
    idPhoto: string;
    status: 'pending' | 'approved' | 'rejected';
}
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'events' | 'verifications' | 'all_events'>('events');
    const [verificationTab, setVerificationTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [adminUser, setAdminUser] = useState<any>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [verifications, setVerifications] = useState<StudentVerification[]>([]);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [showEnrollments, setShowEnrollments] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const user = getStoredUser();
        if (!user) {
            setLoading(false);
            window.location.href = "/login";
            return;
        }
        setAdminUser(user);
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const [eventsRes, usersRes] = await Promise.all([
                fetch("/api/admin/events"),
                fetch("/api/admin/users")
            ]);
            const eventsData = await eventsRes.json();
            const usersData = await usersRes.json();
            setEvents(eventsData.events || []);
            setVerifications(usersData.students || []);
        }
        catch (error) {
            console.error("Failed to fetch data:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        category: "Technical",
        allowedBranches: ["All"] as string[]
    });
    const branches = [
        "All",
        "Computer Science (AI)",
        "Computer Science (ML)",
        "Computer Science Engineering",
        "Information Technology",
        "Data Science",
        "IoT"
    ];
    const toggleBranch = (branch: string) => {
        setNewEvent(prev => {
            let newAllowed;
            if (branch === "All") {
                newAllowed = ["All"];
            }
            else {
                newAllowed = prev.allowedBranches.filter(b => b !== "All");
                if (newAllowed.includes(branch)) {
                    newAllowed = newAllowed.filter(b => b !== branch);
                    if (newAllowed.length === 0)
                        newAllowed = ["All"];
                }
                else {
                    newAllowed = [...newAllowed, branch];
                }
            }
            return { ...prev, allowedBranches: newAllowed };
        });
    };
    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newEvent,
                    organizer: adminUser?.clubName || "NIET Club"
                }),
            });
            if (response.ok) {
                fetchData();
                setNewEvent({
                    title: "",
                    date: "",
                    time: "",
                    location: "",
                    category: "Technical",
                    allowedBranches: ["All"]
                });
            }
        }
        catch (error) {
            console.error("Failed to add event:", error);
        }
    };
    const handleDeleteEvent = async (id: string) => {
        try {
            const response = await fetch("/api/admin/events", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: id }),
            });
            if (response.ok) {
                fetchData();
            }
        }
        catch (error) {
            console.error("Failed to delete event:", error);
        }
    };
    const handleVerify = async (userId: string, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch("/api/admin/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, status }),
            });
            if (response.ok) {
                fetchData();
            }
        }
        catch (error) {
            console.error("Failed to verify user:", error);
        }
    };
    const fetchEnrollments = async (eventId: string) => {
        try {
            const response = await fetch(`/api/admin/enrollments?eventId=${eventId}`);
            const data = await response.json();
            setEnrollments(data.enrollments || []);
            setShowEnrollments(eventId);
        }
        catch (error) {
            console.error("Failed to fetch enrollments:", error);
        }
    };
    const handleCancelEnrollment = async (eventId: string, enrollmentId: string) => {
        if (!confirm("Are you sure you want to cancel this student's enrollment?"))
            return;
        try {
            const response = await fetch("/api/admin/enrollments", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, enrollmentId }),
            });
            if (response.ok) {
                setEnrollments(prev => prev.filter(en => en.id !== enrollmentId));
                fetchData();
            }
        }
        catch (error) {
            console.error("Failed to cancel enrollment:", error);
        }
    };
    const downloadCSV = async (eventId: string) => {
        const event = events.find(e => e.id === eventId);
        const eventEnrollments = enrollments.filter(en => en.eventId === eventId);
        if (eventEnrollments.length === 0)
            return;
        const headers = ["Student Name", "Student ID", "Email", "Branch", "Enrolled At"];
        const csvRows = [
            [`Attendance List - ${event?.title}`],
            [],
            headers,
            ...eventEnrollments.map(en => [
                en.studentName,
                en.studentId,
                en.email,
                en.branch,
                new Date(en.enrolledAt).toLocaleString()
            ])
        ];
        const csvContent = csvRows.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_${event?.title.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (confirm("Attendance downloaded successfully. Do you want to clear the enrollment records for this event? This action cannot be undone.")) {
            try {
                const response = await fetch("/api/admin/enrollments", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventId }),
                });
                if (response.ok) {
                    alert("Enrollment database cleared successfully.");
                    fetchData();
                    setShowEnrollments(null);
                }
            }
            catch (error) {
                console.error("Failed to clear enrollments:", error);
            }
        }
    };
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
    }
    return (<div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Control Panel</h1>
                        <p className="text-gray-600 text-sm md:text-base">Logged in as: <span className="font-bold text-primary">{adminUser?.fullName}</span> ({adminUser?.clubName})</p>
                    </div>
                    <button onClick={() => {
            clearUserSession();
            window.location.href = "/login";
        }} className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
                        Logout
                    </button>
                </header>

                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button onClick={() => setActiveTab('events')} className={cn("w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center sm:justify-start gap-2", activeTab === 'events' ? "bg-primary text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100")}>
                        <Calendar className="w-5 h-5"/> My Club Events
                    </button>
                    <button onClick={() => setActiveTab('all_events')} className={cn("w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center sm:justify-start gap-2", activeTab === 'all_events' ? "bg-primary text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100")}>
                        <Users className="w-5 h-5"/> All Campus Events
                    </button>
                    <button onClick={() => setActiveTab('verifications')} className={cn("w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center sm:justify-start gap-2 relative", activeTab === 'verifications' ? "bg-primary text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100")}>
                        <Users className="w-5 h-5"/> Student Verifications
                        {verifications.filter(v => v.status === 'pending').length > 0 && (<span className="absolute -top-2 -right-2 sm:right-0 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                                {verifications.filter(v => v.status === 'pending').length}
                            </span>)}
                    </button>
                </div>

                {activeTab === 'events' ? (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-primary"/> Create New Event
                            </h2>
                            <form onSubmit={handleAddEvent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                    <input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary outline-none" placeholder="Enter event name"/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input required type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary outline-none"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <input required type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary outline-none"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary outline-none" placeholder="e.g. Auditorium"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary outline-none">
                                        <option>Technical</option>
                                        <option>Cultural</option>
                                        <option>Sports</option>
                                        <option>Workshop</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Branches</label>
                                    <div className="flex flex-wrap gap-2">
                                        {branches.map(branch => (<button key={branch} type="button" onClick={() => toggleBranch(branch)} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-all", newEvent.allowedBranches.includes(branch)
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-white border-gray-200 text-gray-500 hover:border-primary/50")}>
                                                {branch}
                                            </button>))}
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md">
                                    Publish Event
                                </button>
                            </form>
                        </div>

                        
                        <div className="lg:col-span-2 space-y-6">
                            {events
                .filter(event => event.organizer === adminUser?.clubName)
                .map(event => (<div key={event.id} className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="space-y-2">
                                            <span className="px-3 py-1 bg-blue-100 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                                {event.category}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                            <p className="text-primary font-bold text-sm">Organizer: {event.organizer}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {event.allowedBranches?.map(b => (<span key={b} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md border border-gray-200 uppercase">
                                                        {b}
                                                    </span>))}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {event.date}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {event.time}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {event.location}</span>
                                                <span className="flex items-center gap-1 font-bold text-primary"><Users className="w-4 h-4"/> {event.enrolled} Enrolled</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => fetchEnrollments(event.id)} className="p-3 text-primary hover:bg-primary/5 rounded-xl transition-colors border border-primary/10 flex items-center gap-2">
                                                <Eye className="w-5 h-5"/> Enrollments
                                            </button>
                                            <button onClick={() => handleDeleteEvent(event.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100">
                                                <Trash2 className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>))}
                            {events.filter(event => event.organizer === adminUser?.clubName).length === 0 && (<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 text-lg">You haven't created any events yet.</p>
                                </div>)}
                        </div>
                    </div>) : activeTab === 'all_events' ? (<div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="text-primary"/> All Upcoming Campus Events
                            </h2>
                            <p className="text-gray-500 text-sm">Viewing all events from all clubs. You can only manage events created by your club.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map(event => (<div key={event.id} className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <span className="px-3 py-1 bg-blue-100 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                                {event.category}
                                            </span>
                                            {event.organizer === adminUser?.clubName && (<span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md border border-green-200 uppercase">
                                                    My Event
                                                </span>)}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                        <p className="text-primary font-bold text-sm">Organizer: {event.organizer}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {event.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {event.time}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {event.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        <button onClick={() => fetchEnrollments(event.id)} className="flex-1 p-3 text-primary hover:bg-primary/5 rounded-xl transition-colors border border-primary/10 flex items-center justify-center gap-2 font-bold">
                                            <Eye className="w-4 h-4"/> View Details
                                        </button>
                                        {event.organizer === adminUser?.clubName && (<button onClick={() => handleDeleteEvent(event.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100" title="Delete Event">
                                                <Trash2 className="w-4 h-4"/>
                                            </button>)}
                                    </div>
                                </div>))}
                        </div>
                    </div>) : (<div className="space-y-8">
                        
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                            {(['pending', 'approved'] as const).map((status) => (<button key={status} onClick={() => setVerificationTab(status)} className={cn("px-6 py-2 rounded-xl font-bold transition-all capitalize", verificationTab === status
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700")}>
                                    {status} ({verifications.filter(v => v.status === status).length})
                                </button>))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {verifications
                .filter(student => student.status === verificationTab)
                .map(student => (<div key={student.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                                        <div className="relative h-48 bg-gray-200">
                                            <img src={student.idPhoto} alt="ID Card" className="w-full h-full object-cover"/>
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                ID CARD PHOTO
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{student.fullName}</h3>
                                            <p className="text-primary font-medium text-sm mb-4">ID: {student.studentId}</p>

                                            {student.status === 'pending' ? (<div className="grid grid-cols-2 gap-4">
                                                    <button onClick={() => handleVerify(student.id, 'approved')} className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                                                        <CheckCircle className="w-4 h-4"/> Approve
                                                    </button>
                                                    <button onClick={() => handleVerify(student.id, 'rejected')} className="flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all">
                                                        <XCircle className="w-4 h-4"/> Reject
                                                    </button>
                                                </div>) : (<div className="space-y-4">
                                                    <div className={cn("text-center py-3 rounded-xl font-bold border", student.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100")}>
                                                        {student.status.toUpperCase()}
                                                    </div>
                                                    {student.status === 'approved' && (<button onClick={() => handleVerify(student.id, 'rejected')} className="w-full flex items-center justify-center gap-2 py-2 text-red-600 font-bold border border-red-100 rounded-xl hover:bg-red-50 transition-all text-sm">
                                                            <XCircle className="w-4 h-4"/> Revoke & Reject
                                                        </button>)}
                                                </div>)}
                                        </div>
                                    </div>))}
                        </div>

                        {verifications.filter(student => student.status === verificationTab).length === 0 && (<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No {verificationTab} verifications found.</p>
                            </div>)}
                    </div>)}
            </div>

            
            {showEnrollments && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Event Enrollments</h2>
                                <p className="text-gray-500 font-medium text-sm md:text-base">
                                    {events.find(e => e.id === showEnrollments)?.title}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button onClick={() => downloadCSV(showEnrollments)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md text-sm">
                                    <FileSpreadsheet className="w-5 h-5"/> Export CSV
                                </button>
                                <button onClick={() => setShowEnrollments(null)} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                                    <X className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-8">
                            <div className="grid grid-cols-1 gap-4">
                                {enrollments.length > 0 ? (<div className="border border-gray-100 rounded-2xl overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Student Name</th>
                                                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Branch</th>
                                                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Enrolled At</th>
                                                    <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {enrollments.map((en: any) => (<tr key={en.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <p className="font-bold text-gray-900">{en.studentName}</p>
                                                            <p className="text-xs text-gray-500">{en.studentId}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={cn("px-3 py-1 rounded-full text-xs font-bold", en.branch.includes("AI") ? "bg-purple-100 text-purple-700" :
                        en.branch.includes("ML") ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700")}>
                                                                {en.branch}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                            {new Date(en.enrolledAt).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => handleCancelEnrollment(showEnrollments, en.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel Enrollment">
                                                                <XCircle className="w-5 h-5"/>
                                                            </button>
                                                        </td>
                                                    </tr>))}
                                            </tbody>
                                        </table>
                                    </div>) : (<div className="text-center py-12">
                                        <p className="text-gray-500 font-medium">No enrollments found for this event yet.</p>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>);
}
