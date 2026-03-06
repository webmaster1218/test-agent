'use client';
import React from 'react';
import Navbar from '@/components/twoyone/Navbar';
import Hero from '@/components/twoyone/Hero';
import Services from '@/components/twoyone/Services';
import Platforms from '@/components/twoyone/Platforms';
import AITestingSection from '@/components/twoyone/AITestingSection';
import CaseStudies from '@/components/twoyone/CaseStudies';
import Testimonials from '@/components/twoyone/Testimonials';
import Contact from '@/components/twoyone/Contact';
import Footer from '@/components/twoyone/Footer';
import WhatsAppBubble from '@/components/twoyone/WhatsAppBubble';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#030305] text-white selection:bg-brand-500/30">
            <Navbar />
            <main>
                <Hero />
                <Services />
                <CaseStudies />
                <AITestingSection />
                <Platforms />
                <Testimonials />
                <Contact />
            </main>
            <Footer />
            <WhatsAppBubble />
        </div>
    );
}
