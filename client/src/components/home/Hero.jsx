import React, { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Mail, FileText, Code2, Sparkles } from 'lucide-react';

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const roles = [
    "Full Stack Developer",
    "MERN Stack Expert",
    "Problem Solver",
    "UI/UX Enthusiast",
    "Clean Code Advocate"
  ];

  useEffect(() => {
    const currentText = roles[currentRole];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentText.length) {
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentRole((currentRole + 1) % roles.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentRole]);

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, label: "GitHub", href: "#" },
    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "#" },
    { icon: <Mail className="h-5 w-5" />, label: "Email", href: "#" },
    { icon: <FileText className="h-5 w-5" />, label: "Resume", href: "#" }
  ];

  const floatingIcons = [
    { Icon: Code2, delay: "0s", position: "top-20 left-10" },
    { Icon: Sparkles, delay: "0.5s", position: "top-40 right-20" },
    { Icon: Code2, delay: "1s", position: "bottom-40 left-20" },
    { Icon: Sparkles, delay: "1.5s", position: "bottom-20 right-10" }
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="animate-blob absolute left-0 top-0 h-96 w-96 rounded-full bg-red-200 opacity-20 mix-blend-multiply blur-3xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute right-0 top-0 h-96 w-96 rounded-full bg-gray-300 opacity-20 mix-blend-multiply blur-3xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-red-300 opacity-20 mix-blend-multiply blur-3xl filter"></div>
        
        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} text-gray-200 opacity-30`}
            style={{
              animation: `float 6s ease-in-out infinite`,
              animationDelay: item.delay
            }}
          >
            <item.Icon className="h-12 w-12" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Greeting Badge */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600"></span>
            <span className="text-sm font-medium text-red-600">Available for freelance</span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-slide-up mb-6 text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl">
            Hi, I'm <span className="text-red-600">Your Name</span>
          </h1>

          {/* Animated Role Text */}
          <div className="mb-8 h-16 sm:h-20 md:h-24">
            <h2 className="animate-slide-up animation-delay-200 text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl">
              I'm a{' '}
              <span className="inline-block min-w-[300px] text-left text-red-600 sm:min-w-[400px]">
                {displayText}
                <span className="animate-blink">|</span>
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="animate-slide-up animation-delay-400 mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl md:text-2xl">
            I craft beautiful, functional web applications with modern technologies. 
            Passionate about creating seamless user experiences and writing clean, 
            efficient code that makes a difference.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up animation-delay-600 mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-900 hover:shadow-xl"
            >
              View My Work
              <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </a>
            <a
              href="#contact"
              className="rounded-lg border-2 border-gray-900 bg-white px-8 py-4 font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-900 hover:text-white hover:shadow-xl"
            >
              Get In Touch
            </a>
          </div>

          {/* Social Links */}
          <div className="animate-slide-up animation-delay-800 flex items-center justify-center gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                aria-label={link.label}
                className="group rounded-full bg-gray-100 p-3 text-gray-700 transition-all duration-300 hover:scale-110 hover:bg-red-600 hover:text-white hover:shadow-lg"
              >
                {link.icon}
              </a>
            ))}
          </div>

        </div>

        {/* Tech Stack Marquee */}
        <div className="animate-slide-up animation-delay-1000 mt-20">
          <p className="mb-6 text-center text-sm font-medium text-gray-500">TECH STACK</p>
          <div className="relative overflow-hidden">
            <div className="animate-scroll flex gap-8">
              {["React", "Node.js", "MongoDB", "Express", "Tailwind CSS", "JavaScript", "TypeScript", "Next.js", "React", "Node.js", "MongoDB", "Express"].map((tech, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:border-red-600 hover:text-red-600"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 transform animate-bounce">
        <ChevronDown className="h-8 w-8 text-gray-400" />
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
          animation-fill-mode: both;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;