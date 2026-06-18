import "./Header.scss";

import {
  Menu,
  Search,
  Help,
  Launch,
  UserMultiple,
  Calendar,
  Notification,
  UserAvatar,
  ChevronDown,
} from "@carbon/icons-react";

function AppHeader() {
  return (
    <div className="header-wrapper">
      <header className="app-header">

        <div className="menu-section">
          <Menu size={20} />
        </div>

        <div className="logo-section">
          Self Talk Psychologist
        </div>

        <div className="search-section">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search resources and products"
          />
        </div>

        <div className="nav-item">
          Catalog
        </div>

        <div className="nav-item campus-item">
          <span>Select Campus</span>
          <ChevronDown size={16} />
        </div>

        <div className="nav-item">
          Dr. B Ramesh
        </div>

        <div className="icons-section">
          <Help size={18} />
          <Launch size={18} />
          <UserMultiple size={18} />
          <Calendar size={18} />
          <Notification size={18} />
          <UserAvatar size={18} />
        </div>

      </header>
    </div>
  );
}

export default AppHeader;