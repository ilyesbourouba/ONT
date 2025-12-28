import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import './App.css';

function App() {
  const { isRTL } = useLanguage();

  return (
    <div className={`app ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      <Hero />
    </div>
  );
}

export default App;
