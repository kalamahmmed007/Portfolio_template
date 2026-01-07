import { useState, useEffect } from 'react';
import { Code2, Menu, X, Briefcase } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.substring(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-white shadow-sm py-4'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => scrollToSection(e, '#home')}
            className="group flex cursor-pointer items-center gap-3"
          >
            <div className="relative">
              {/* Glowing effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-red-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50"></div>
              {/* Icon container */}
              <div className="relative rounded-xl bg-gradient-to-br from-red-600 to-red-700 p-2.5 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-red-500/50">
                <Code2 className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none text-gray-900">
                Your<span className="text-red-600">Name</span>
              </span>
              <span className="text-xs font-medium text-gray-500">Developer</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-5 py-2.5 font-semibold text-sm transition-all duration-300 rounded-lg group ${
                    isActive 
                      ? 'text-red-600' 
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  {link.name}
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 transform rounded-full bg-red-600"></span>
                  )}
                  {/* Hover background */}
                  <span className={`absolute inset-0 rounded-lg bg-red-50 -z-10 transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></span>
                </a>
              );
            })}
            
            {/* CTA Button */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="ml-4 flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:shadow-xl"
            >
              <Briefcase className="h-4 w-4" />
              <span>Hire Me</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-gray-700 transition-all duration-300 hover:bg-red-50 hover:text-red-600 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" strokeWidth={2.5} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="space-y-2 rounded-2xl bg-gray-50 p-4 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white hover:text-red-600 hover:shadow-md'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-white' : 'bg-gray-400'
                  }`}></span>
                  {link.name}
                </a>
              );
            })}
            
            {/* Mobile CTA */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-red-600"
            >
              <Briefcase className="h-4 w-4" />
              <span>Hire Me</span>
            </a>
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;