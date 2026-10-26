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
import { NahoLoginPage } from './components/admin/NahoLoginPage';
import { NahoGestionDashboard } from './components/admin/NahoGestionDashboard';
import { NotFoundPage } from './components/common/NotFoundPage';

function AppRouter() {
  const { currentPath } = useSiteData();
  const [selectedMuralCategory, setSelectedMuralCategory] = useState<string>('Negocios & Comercial');
  const [referenceArtTitle, setReferenceArtTitle] = useState<string | undefined>(undefined);

  // Route 1: /naho (Admin Login with 3-attempt IP lockout)
  if (currentPath === '/naho') {
    return <NahoLoginPage />;
  }

  // Route 2: /naho/gestion (Full Admin Management Panel)
  if (currentPath === '/naho/gestion') {
    return <NahoGestionDashboard />;
  }

  // Route 3: 404 Not Found (any unrecognized route)
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
