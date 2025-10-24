import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import SearchBar from './SearchBar';
import CartSidebar from './CartSidebar';
import MobileMenu from './MobileMenu';
import { selectTheme } from '../../store/slices/uiSlice';

const Layout = ({ children }) => {
  const theme = useSelector(selectTheme);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Header 
        onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {children}
      </main>
      
      <Footer />

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 md:hidden">
          <div className="p-4">
            <SearchBar 
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};

export default Layout;
