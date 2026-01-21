import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutONT from '../components/AboutONT';
import ActivitySection from '../components/ActivitySection';
import UnescoHeritage from '../components/UnescoHeritage';
import VisitAlgeria from '../components/VisitAlgeria';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Hero />
      <AboutONT />
      <ActivitySection />
      <UnescoHeritage />
      <VisitAlgeria />
    </>
  );
}

export default Home;
