import { useState } from 'react';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { CoursesSection } from './components/courses/CoursesSection';
import { InteractiveGallery } from './components/gallery/InteractiveGallery';
import { QuoteStepperForm } from './components/quote/QuoteStepperForm';
import { AboutMeSection } from './components/about/AboutMeSection';
import { StudioLocation } from './components/studio/StudioLocation';
import { Footer } from './components/layout/Footer';
import { NahoLoginPage, isNahoAuthenticated } from './components/admin/NahoLoginPage';
import { NahoGestionDashboard } from './components/admin/NahoGestionDashboard';
import { NotFoundPage } from './components/common/NotFoundPage';

function AppRouter() {
  const { currentPath } = useSiteData();
  const [selectedMuralCategory, setSelectedMuralCategory] = useState<string>('Negocios & Comercial');
  const [referenceArtTitle, setReferenceArtTitle] = useState<string | undefined>(undefined);

  // Ruta 1: /naho (Login con bloqueo de IP tras 3 intentos)
  if (currentPath === '/naho') {
    if (isNahoAuthenticated()) {
      return <NahoGestionDashboard />;
    }
    return <NahoLoginPage />;
  }

  // Ruta 2: /naho/gestion (Panel con Auth Guard que bloquea URL si no hay sesión)
  if (currentPath === '/naho/gestion') {
    if (!isNahoAuthenticated()) {
      return <NahoLoginPage />;
    }
    return <NahoGestionDashboard />;
  }

  // Ruta 3: 404 Not Found (Cualquier URL no reconocida)
  if (currentPath !== '/' && currentPath !== '') {
    return <NotFoundPage />;
  }

  const handleSelectForQuote = (muralCategoryLabel: string, artTitle: string) => {
    setSelectedMuralCategory(muralCategoryLabel);
    setReferenceArtTitle(artTitle);
  };

  return (
    <div className="min-h-screen bg-naho-bg text-slate-800 flex flex-col selection:bg-naho-pink selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Monthly Courses Section */}
        <CoursesSection />

        {/* Mural Portfolio Gallery by Categories */}
        <InteractiveGallery onSelectForQuote={handleSelectForQuote} />

        {/* Exclusive Mural Quote Form (Tampico, Ciudad Madero & Altamira) */}
        <QuoteStepperForm
          key={`${selectedMuralCategory}-${referenceArtTitle || 'default'}`}
          initialMuralCategory={selectedMuralCategory}
          referenceArtTitle={referenceArtTitle}
        />

        {/* "Sobre Mí" Section */}
        <AboutMeSection />

        {/* Physical Studio: In-Person Classes, Studio Photos, Location & Schedule */}
        <StudioLocation />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppRouter />
    </SiteDataProvider>
  );
}
