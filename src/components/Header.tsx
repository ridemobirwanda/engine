import { ShoppingCartSidebar } from "@/components/ShoppingCartSidebar";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
// Google Ads tracking removed to prevent loading issues
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  href: string;
  children?: MenuItem[];
}

// Menu items are loaded from website settings (key: nav_menu)

// Memoized components for better performance
const MobileMenuToggle = memo(({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="lg:hidden text-white hover:text-orange-400 transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black"
    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
  >
    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </button>
));

const SearchBar = memo(({ searchQuery, onSearchChange, placeholder }: { searchQuery: string; onSearchChange: (query: string) => void; placeholder: string }) => (
  <div className="relative w-28 sm:w-36 md:w-48 hidden sm:block">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
    <Input
      placeholder={placeholder}
      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-9 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      aria-label="Search products"
      role="searchbox"
    />
  </div>
));

const Logo = memo(({ siteTitle, joinText }: { siteTitle: string; joinText: string }) => (
  <div className="flex-1 text-center sm:static">
    <Link
      to="/"
      className="block sm:relative sm:left-1/2 sm:transform sm:-translate-x-1/2 group focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black rounded-md"
      aria-label={`${siteTitle} - ${joinText}`}
    >
      <span className="text-orange-400 text-xl lg:text-2xl font-bold group-hover:text-orange-300 transition-colors">
        {siteTitle}
      </span>
      <p className="text-xs text-gray-400 hidden sm:block group-hover:text-gray-300 transition-colors">
        {joinText}
      </p>
    </Link>
  </div>
));

const NavigationItem = memo(({ item, isActive }: { item: MenuItem; isActive: boolean }) => (
  <li key={item.id} className="group relative">
    <Link 
      to={item.href} 
      className={`hover:text-orange-400 transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md px-2 py-1 ${
        isActive ? 'text-orange-400' : 'text-white'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.title}
      {item.children && <ChevronDown className="h-3 w-3" />}
    </Link>

    {/* Dropdown */}
    {item.children && (
      <ul 
        className="absolute left-0 mt-2 bg-gray-800 shadow-lg rounded-md hidden group-hover:block min-w-[200px] z-50 border border-gray-700"
        role="menu"
        aria-label={`${item.title} submenu`}
      >
        {item.children.map((child) => (
          <li key={child.id} role="none">
            <Link
              to={child.href}
              className="block px-4 py-2 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset rounded-md"
              role="menuitem"
            >
              {child.title}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
));

const MobileNavigationItem = memo(({ item }: { item: MenuItem }) => (
  <li key={item.id}>
    <Link
      to={item.href}
      className="block py-2 border-b border-gray-700 hover:text-orange-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset rounded-md px-2"
    >
      {item.title}
    </Link>
    {item.children && (
      <ul className="pl-4" role="menu" aria-label={`${item.title} submenu`}>
        {item.children.map((child) => (
          <li key={child.id} role="none">
            <Link
              to={child.href}
              className="block py-1 text-sm hover:text-orange-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset rounded-md px-2"
              role="menuitem"
            >
              {child.title}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
));

export const Header = memo(({ searchQuery, onSearchChange }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getSetting, loading: settingsLoading, error: settingsError } = useWebsiteSettings();
  const { cartItems, isLoading: cartLoading } = useCart();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Memoized values to prevent unnecessary re-renders
  const siteSettings = useMemo(() => {
    const defaultNavMenu = [
      { id: "home", title: "Home", href: "/" },
      { id: "products", title: "All Products", href: "/products" },
      { id: "engines", title: "Engines", href: "/engines", children: [
        { id: "rebuilt", title: "Rebuilt Engines", href: "/rebuilt-engines" },
        { id: "used", title: "Used Engines", href: "/used-engines" }
      ]},
      { id: "parts", title: "Parts", href: "/parts", children: [
        { id: "heads", title: "Cylinder Heads", href: "/heads" },
        { id: "timing", title: "Timing Components", href: "/timing-components" }
      ]},
      { id: "support", title: "Support", href: "/support", children: [
        { id: "tech-support", title: "Technical Support", href: "/technical-support" },
        { id: "faqs", title: "FAQs", href: "/faqs" },
        { id: "live-chat", title: "Live Chat", href: "/live-chat" }
      ]},
      { id: "about", title: "About", href: "/about" },
      { id: "contact", title: "Contact", href: "/contact" }
    ];

    return {
    freeShippingText: getSetting("free_shipping_text", "FREE SHIPPING ON SELECT ITEMS!"),
    contactPhone: getSetting("contact_phone", "96115404"),
    siteTitle: getSetting("site_title", "verified engine"),
    joinText: getSetting("join_text", "JOIN THE FUN !!"),
    searchPlaceholder: getSetting("search_placeholder", "Search products..."),
      navMenu: (getSetting("nav_menu", defaultNavMenu) as any[]) as MenuItem[],
    };
  }, [getSetting]);

  const cartItemCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  // Memoized callbacks to prevent unnecessary re-renders
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Check if current route is active for navigation highlighting
  const isActiveRoute = useCallback((href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  }, [location.pathname]);

  // Handle search with debouncing
  const handleSearchChange = useCallback((value: string) => {
    onSearchChange(value);
    // Google Ads tracking removed
  }, [onSearchChange]);

  // Show error state if settings failed to load
  if (settingsError) {
    console.error('Header: Settings error:', settingsError);
  }

  // Show loading state if settings are still loading
  if (settingsLoading) {
    return (
      <header className="w-full bg-black sticky top-0 z-40 shadow-lg">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-1 px-4">
          <div className="flex items-center justify-between text-xs max-w-7xl mx-auto">
            <span className="font-medium">Loading...</span>
            <span className="font-semibold">PHONE: 96115404</span>
          </div>
        </div>
        <div className="flex items-center justify-between max-w-7xl mx-auto relative px-4 py-3 bg-black">
          <div className="flex items-center sm:space-x-3">
            <div className="lg:hidden w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-28 sm:w-36 md:w-48 h-9 bg-gray-700 rounded animate-pulse hidden sm:block"></div>
          </div>
          <div className="flex-1 text-center">
            <div className="w-32 h-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse hidden sm:block"></div>
            <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-black sticky top-0 z-40 shadow-lg">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-1 px-4">
        <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:justify-between text-xs max-w-7xl mx-auto">
          <span className="font-medium text-center truncate w-full sm:w-auto">{siteSettings.freeShippingText}</span>
          <a 
            href={`tel:${siteSettings.contactPhone}`}
            onClick={() => {/* Google Ads tracking removed */}}
            className="font-semibold hidden sm:inline hover:text-orange-400 transition-colors cursor-pointer"
          >
            PHONE: {siteSettings.contactPhone}
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between max-w-7xl mx-auto relative px-4 py-3 bg-black">
        {/* Left: Menu Toggle + Search */}
        <div className="flex items-center sm:space-x-3">
          <MobileMenuToggle isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
          <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} placeholder={siteSettings.searchPlaceholder} />
        </div>

        {/* Center Title */}
        <Logo siteTitle={siteSettings.siteTitle} joinText={siteSettings.joinText} />

        {/* Right: Wishlist + Cart */}
        <div className="flex items-center space-x-6">
          <Link
            to="/wishlist"
            className="text-white hover:text-orange-400 transition-colors duration-200 hidden sm:block font-medium"
          >
            <span className="text-sm">WISHLIST</span>
          </Link>
          <ShoppingCartSidebar />
        </div>
      </div>

      {/* Navigation Menu */
      }
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md">
        <ul className="hidden lg:flex space-x-6 justify-center py-2 max-w-7xl mx-auto px-4">
          {(siteSettings.navMenu || []).map((item) => (
            <NavigationItem 
              key={item.id} 
              item={item} 
              isActive={isActiveRoute(item.href)} 
            />
          ))}
        </ul>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden bg-gray-800 border-t border-gray-700"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-gray-700 sm:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 h-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  aria-label="Search products"
                />
              </div>
            </div>
            <ul className="flex flex-col px-4 py-2 space-y-1">
              {(siteSettings.navMenu || []).map((item) => (
                <MobileNavigationItem key={item.id} item={item} />
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
});

// Add display name for debugging
Header.displayName = 'Header';
