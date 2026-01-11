import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import VirtualTourPage from './pages/VirtualTourPage';
import './App.css';

function App() {
  const { isRTL } = useLanguage();

  return (
    <Router>
      <div className={`app ${isRTL ? 'rtl' : 'ltr'}`}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<ArticleDetailPage />} />
            <Route path="/virtual-tour" element={<VirtualTourPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


export default App;


