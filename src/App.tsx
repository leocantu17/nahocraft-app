import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { InteractiveGallery } from './components/gallery/InteractiveGallery';
import { QuoteStepperForm } from './components/quote/QuoteStepperForm';
import { StudioLocation } from './components/studio/StudioLocation';
import { Footer } from './components/layout/Footer';
import { ProjectType } from './types';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [selectedQuoteType, setSelectedQuoteType] = useState<ProjectType>('mural');
  const [referenceArtTitle, setReferenceArtTitle] = useState<string | undefined>(undefined);

  const handleSelectForQuote = (projectType: ProjectType, artTitle: string) => {
    setSelectedQuoteType(projectType);
    setReferenceArtTitle(artTitle);
  };

  return (
    <div className="min-h-screen bg-naho-bg text-slate-800 flex flex-col selection:bg-naho-pink selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Gallery connected to real local assets */}
        <InteractiveGallery onSelectForQuote={handleSelectForQuote} />

        {/* Multi-step Quote Wizard with WhatsApp dispatch */}
        <QuoteStepperForm
          key={`${selectedQuoteType}-${referenceArtTitle || 'default'}`}
          initialProjectType={selectedQuoteType}
          referenceArtTitle={referenceArtTitle}
        />

        {/* Studio Location, Live Schedule & Social Links */}
        <StudioLocation />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Contacto rápido" className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/528333655622?text=Hola%20Nahomy%2C%20quisiera%20pedir%20informaci%C3%B3n%20sobre%20tus%20obras%20de%20Nahocraft"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Abrir chat de WhatsApp con Nahomy"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <MessageCircle className="w-5 h-5" />
          <span className="font-extrabold text-xs uppercase tracking-wider hidden sm:inline">
            WhatsApp Taller
          </span>
        </a>
      </aside>
    </div>
  );
}
