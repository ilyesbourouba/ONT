import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutONT from './components/AboutONT';
import UnescoHeritage from './components/UnescoHeritage';
import './App.css';

function App() {
  const { isRTL } = useLanguage();

  return (
    <div className={`app ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      <Hero />
      <AboutONT />
      <UnescoHeritage />
    </div>
  );
}

export default App;
