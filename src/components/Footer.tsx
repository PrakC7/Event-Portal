import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
export default function Footer() {
    return (<footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              NIET Event Portal
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering students through innovation, culture, and sports. The official event hub for NIET Greater Noida.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5"/>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-secondary">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">All Events</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-secondary">Categories</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Technical Fest</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cultural Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sports Meet</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Workshops</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-secondary">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0"/>
                <span>Knowledge Park II, Greater Noida, UP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0"/>
                <span>+91 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0"/>
                <span>events@niet.co.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} NIET Event Portal. All Rights Reserved. Built for Students.</p>
        </div>
      </div>
    </footer>);
}
