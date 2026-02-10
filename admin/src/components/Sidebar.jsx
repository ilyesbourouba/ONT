import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'hero', label: 'Hero Slides', icon: '🖼️' },
    { id: 'about-section', label: 'About Section', icon: '📝' },
    { id: 'about-page', label: 'About Page', icon: '📄' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'activities', label: 'Activities', icon: '🎭' },
    { id: 'unesco', label: 'UNESCO Sites', icon: '🏛️' },
    { id: 'visit-algeria', label: 'Visit Algeria', icon: '🇩🇿' },
    { id: 'destinations', label: 'Destinations', icon: '🗺️' },
    { id: 'virtual-tours', label: 'Virtual Tours', icon: '🎬' },
    { id: 'contacts', label: 'Contact Forms', icon: '✉️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">🏛️</span>
        <span className="sidebar-title">ONT Admin</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <p>© 2025 ONT Algeria</p>
      </div>
    </aside>
  );
};

export default Sidebar;
