import { useState, useEffect } from 'react';
import { 
  Download, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail,
  MapPin,
  Code,
  Sparkles
} from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = [
    'Full Stack Developer',
    'MERN Stack Developer',
    'React Developer',
    'UI/UX Enthusiast',
  ];

  // Typing animation effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRoleIndex]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const stats = [
    { value: '50+', label: 'Projects Completed' },
    { value: '30+', label: 'Happy Clients' },
    { value: '3+', label: 'Years Experience' },
    { value: '15+', label: 'Technologies' },
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Mail, href: 'mailto:your.email@example.com', label: 'Email', color: 'hover:text-red-400' },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-red-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Greeting Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-red-500/30 rounded-full">
              <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm text-gray-300">Welcome to my Portfolio</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="text-white">Hi, I'm </span>
                <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  Your Name
                </span>
              </h1>
              
              {/* Animated Role */}
              <div className="flex items-center justify-center lg:justify-start space-x-2 h-12">
                <Code className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300">
                  {displayText}
                  <span className="inline-block w-0.5 h-8 bg-red-500 ml-1 animate-blink"></span>
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Passionate about creating beautiful, functional, and user-friendly web applications. 
              Specialized in MERN stack development with a keen eye for design and performance.
            </p>

            {/* Location */}
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-400">
              <MapPin className="w-5 h-5 text-red-500" />
              <span>Based in Dhaka, Bangladesh</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('contact')}
                className="group px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <span>Hire Me</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button
                onClick={() => window.open('/resume.pdf', '_blank')}
                className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 justify-center lg:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 ${social.color} hover:border-red-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Content - Image/Avatar */}
          <div className="relative flex items-center justify-center">
            {/* Decorative Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 bg-gradient-to-br from-red-500/30 to-red-700/30 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Profile Image Container */}
            <div className="relative">
              {/* Rotating Border */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full opacity-75 blur-lg animate-spin-slow"></div>
              
              {/* Image */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-4">
                      <span className="text-6xl font-bold text-white">YN</span>
                    </div>
                    <p className="text-gray-400 text-sm">Your Profile Image</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 px-6 py-3 bg-gray-800 border-2 border-red-500 rounded-full shadow-lg shadow-red-500/30 animate-bounce-slow">
                <span className="text-white font-semibold flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Available for Work</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-red-500 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-red-500 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
        
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;