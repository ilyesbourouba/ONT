import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import NewsManager from '../components/NewsManager';
import ActivitiesManager from '../components/ActivitiesManager';
import UnescoManager from '../components/UnescoManager';
import DestinationsManager from '../components/DestinationsManager';
import VirtualToursManager from '../components/VirtualToursManager';
import ContactManager from '../components/ContactManager';
import HeroManager from '../components/HeroManager';
import AboutSectionManager from '../components/AboutSectionManager';
import AboutPageManager from '../components/AboutPageManager';
import VisitAlgeriaManager from '../components/VisitAlgeriaManager';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('hero');

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroManager />;
      case 'about-section':
        return <AboutSectionManager />;
      case 'about-page':
        return <AboutPageManager />;
      case 'news':
        return <NewsManager />;
      case 'activities':
        return <ActivitiesManager />;
      case 'unesco':
        return <UnescoManager />;
      case 'visit-algeria':
        return <VisitAlgeriaManager />;
      case 'destinations':
        return <DestinationsManager />;
      case 'virtual-tours':
        return <VirtualToursManager />;
      case 'contacts':
        return <ContactManager />;
      default:
        return <HeroManager />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h1>
          <div className="header-actions">
            <span className="user-info">👤 {user?.username}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </header>
        
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
