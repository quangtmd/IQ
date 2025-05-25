
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
    SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS,
    CUSTOM_MENU_STORAGE_KEY, INITIAL_CUSTOM_MENU_LINKS,
    FALLBACK_NAV_LOGGED_IN, FALLBACK_NAV_LOGGED_OUT,
    PC_BUILDER_PATH
} from '../../constants';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import GlobalSearch from '../shared/GlobalSearch';
import { CustomMenuLink, SiteSettings, NavLinkItem } from '../../types';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated, currentUser, logout, isLoading, adminNotifications } = useAuth();
  const navigate = useNavigate();
  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [currentNavLinks, setCurrentNavLinks] = useState<(CustomMenuLink | NavLinkItem)[]>([]);
  const [pcBuilderLink, setPcBuilderLink] = useState<CustomMenuLink | NavLinkItem | null>(null);

  const unreadAdminNotificationCount = adminNotifications.filter(n => !n.isRead && (currentUser?.role === 'admin' || currentUser?.role === 'staff')).length;

  const loadData = useCallback(() => {
    const storedSettings = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    const currentSiteSettings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SITE_SETTINGS;
    setSiteSettings(currentSiteSettings);

    const storedMenu = localStorage.getItem(CUSTOM_MENU_STORAGE_KEY);
    
    let linksSourceForPcBuilder: (CustomMenuLink | NavLinkItem)[] = [];
    let linksSourceForMainNav: (CustomMenuLink | NavLinkItem)[] = [];

    if (storedMenu) {
      const parsedMenu: CustomMenuLink[] = JSON.parse(storedMenu);
      const visibleStoredLinks = parsedMenu.filter(link => link.isVisible).sort((a, b) => a.order - b.order);
      linksSourceForPcBuilder = visibleStoredLinks;
      // For main nav, filter out PC Builder if it exists in the stored menu
      linksSourceForMainNav = visibleStoredLinks.filter(link => link.path !== PC_BUILDER_PATH);
    } else {
      // For PC Builder link, check the initial full list of potentially visible links
      linksSourceForPcBuilder = INITIAL_CUSTOM_MENU_LINKS.filter(link => link.isVisible).sort((a,b) => a.order - b.order);
      
      // For Main Nav, use the specific fallbacks (which already exclude PC Builder and handle admin link correctly)
      linksSourceForMainNav = isAuthenticated ? FALLBACK_NAV_LOGGED_IN : FALLBACK_NAV_LOGGED_OUT;
    }
    
    // Find the PC Builder link from its determined source
    const builder = linksSourceForPcBuilder.find(link => link.path === PC_BUILDER_PATH);
    setPcBuilderLink(builder || null);
    
    // Set the main navigation links
    setCurrentNavLinks(linksSourceForMainNav);

  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
    window.addEventListener('siteSettingsUpdated', loadData);
    window.addEventListener('menuUpdated', loadData);
    
    return () => {
      window.removeEventListener('siteSettingsUpdated', loadData);
      window.removeEventListener('menuUpdated', loadData);
    };
  }, [loadData, isAuthenticated]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };
  
  const handleGlobalSearch = (searchTerm: string) => {
    navigate(`/shop?q=${encodeURIComponent(searchTerm)}`);
    if(isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const displayLogo = siteSettings.siteLogoUrl || siteSettings.siteFaviconUrl;

  const renderNavLink = (link: CustomMenuLink | NavLinkItem, isMobile: boolean = false) => {
    const isAdminLink = link.path === '/admin';
    const showNotificationBadge = isAdminLink && isAuthenticated && (currentUser?.role === 'admin' || currentUser?.role === 'staff') && unreadAdminNotificationCount > 0;

    return (
      <NavLink
        key={link.path}
        to={link.path}
        onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        className={({ isActive }) =>
          isMobile 
          ? `flex items-center py-2.5 px-3.5 rounded-md text-base font-medium hover:bg-neutral-700 hover:text-primary transition-colors 
             ${isActive ? 'text-primary bg-neutral-700 font-semibold' : 'text-neutral-200'}`
          : `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
             hover:bg-neutral-700 hover:text-primary 
             ${isActive ? 'text-primary font-semibold border-b-2 border-primary bg-neutral-700/50' : 'text-neutral-300'}`
        }
      >
        {link.icon && typeof link.icon === 'string' && <i className={`${link.icon} ${isMobile ? 'mr-2' : 'mr-1.5'}`}></i>}
        {link.icon && typeof link.icon !== 'string' && React.cloneElement(link.icon as React.ReactElement, { className: isMobile ? 'mr-2' : 'mr-1.5' } as any)}
        {link.label}
        {showNotificationBadge && (
          <span className="ml-1.5 bg-primary text-white text-[10px] font-bold rounded-full h-4 min-w-[1rem] px-1 flex items-center justify-center">
            {unreadAdminNotificationCount > 9 ? '9+' : unreadAdminNotificationCount}
          </span>
        )}
      </NavLink>
    );
  };


  return (
    <header className="bg-neutral-900 bg-opacity-90 text-neutral-100 shadow-lg sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-light transition-colors duration-300 flex items-center">
            {displayLogo ? (
              <img src={displayLogo} alt={`${siteSettings.companyName} Logo`} className="h-8 md:h-10 max-w-[150px] object-contain mr-2" />
            ) : (
              siteSettings.companyName
            )}
          </Link>
          
          <div className="hidden lg:flex flex-1 justify-center px-8">
             <GlobalSearch onSearch={handleGlobalSearch} />
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            {pcBuilderLink && (
              <Link 
                to={pcBuilderLink.path} 
                className="text-neutral-300 hover:text-primary transition-transform duration-200 ease-in-out hover:scale-110 flex items-center px-2 py-1 rounded-md hover:bg-neutral-700/80"
                title={pcBuilderLink.label}
              >
                <i className={`${typeof pcBuilderLink.icon === 'string' ? pcBuilderLink.icon : 'fas fa-tools'} text-xl md:text-lg`}></i>
                <span className="hidden md:inline ml-1.5 text-sm">{pcBuilderLink.label}</span>
              </Link>
            )}
            <Link to="/cart" className="relative text-neutral-300 hover:text-primary transition-transform duration-200 ease-in-out hover:scale-110">
              <i className="fas fa-shopping-cart text-xl"></i>
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>

            {!isLoading && (
              <div className="hidden md:flex items-center space-x-2">
                  {isAuthenticated && currentUser ? (
                      <>
                          <span className="text-sm text-neutral-300">Chào, {currentUser.username}!</span>
                          <Button 
                            onClick={handleLogout} 
                            variant="outline" 
                            size="sm" 
                            className="border-neutral-500 text-neutral-200 hover:bg-neutral-700 hover:text-white hover:scale-105 transform transition-all"
                          >
                            Đăng xuất
                          </Button>
                      </>
                  ) : (
                      <>
                          <Link to="/login">
                              <Button variant="ghost" size="sm" className="text-neutral-200 hover:bg-neutral-700 hover:text-white hover:scale-105 transform transition-all">Đăng nhập</Button>
                          </Link>
                          <Link to="/register">
                              <Button variant="primary" size="sm" className="hover:scale-105 transform transition-all">Đăng ký</Button>
                          </Link>
                      </>
                  )}
              </div>
            )}

            <button
              className="md:hidden text-2xl text-neutral-300 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
        
        <nav className="hidden md:flex justify-center items-center space-x-1 py-2 border-t border-neutral-700/50">
            {currentNavLinks.map((link) => renderNavLink(link))}
          </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-800 bg-opacity-95 border-t border-neutral-700">
          <div className="px-4 pt-2 pb-3">
             <GlobalSearch onSearch={handleGlobalSearch} />
          </div>
          <nav className="flex flex-col space-y-1 px-2 pt-2 pb-4">
            {currentNavLinks.map((link) => renderNavLink(link, true))}
            {pcBuilderLink && renderNavLink(pcBuilderLink, true)}
            {!isLoading && (
                <div className="pt-4 mt-2 border-t border-neutral-700 px-2">
                    {isAuthenticated && currentUser ? (
                        <>
                            <span className="block py-2 px-3 text-sm text-neutral-300">Chào, {currentUser.username}!</span>
                            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full border-neutral-500 text-neutral-200 hover:bg-neutral-700">Đăng xuất</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                                <Button variant="ghost" size="sm" className="w-full mb-2 text-neutral-200 hover:bg-neutral-700">Đăng nhập</Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                                <Button variant="primary" size="sm" className="w-full">Đăng ký</Button>
                            </Link>
                        </>
                    )}
                </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
