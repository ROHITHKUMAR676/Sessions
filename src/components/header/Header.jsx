import "./Header.scss";

import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  Search as CarbonSearch,
} from "@carbon/react";

import {
  Help,
  Terminal,
  UserFeedback,
  User,
  Calculator,
  Notification,
  ChevronDown,
} from "@carbon/icons-react";

function AppHeader() {
  return (
    <Header aria-label="Self Talk Psychologist" className="app-header">
      <HeaderMenuButton
        aria-label="Open menu"
        className="menu-section"
        onClick={() => {}}
      />

      <HeaderName href="#" prefix="" className="logo-section">
        Self Talk Psychologist
      </HeaderName>

      <CarbonSearch
        id="global-search"
        labelText="Search"
        size="lg"
        placeholder="Search resources and products"
        className="search-section"
      />

      <HeaderNavigation aria-label="Session navigation" className="app-header-nav">
        <HeaderMenuItem href="#">Catalog</HeaderMenuItem>
        <HeaderMenuItem href="#" className="campus-item">
          <span>Select Campus</span>
          <ChevronDown size={16} />
        </HeaderMenuItem>
        <HeaderMenuItem href="#">Dr. B Ramesh</HeaderMenuItem>
      </HeaderNavigation>

      <HeaderGlobalBar className="icons-section">
        <HeaderGlobalAction aria-label="Help">
          <Help size={18} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Terminal">
          <Terminal size={18} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Users">
          <UserFeedback size={18} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Calculator">
          <Calculator size={18} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Notifications">
          <Notification size={18} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="User profile">
          <User size={18} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  );
}

export default AppHeader;
