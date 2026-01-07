import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaCode, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { icon: <FaGithub />, url: "https://github.com/yourusername", label: "GitHub" },
    { icon: <FaLinkedin />, url: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
    { icon: <FaTwitter />, url: "https://twitter.com/yourusername", label: "Twitter" },
    { icon: <FaEnvelope />, url: "mailto:your.email@example.com", label: "Email" },
  ];

  const services = ["Web Development", "MERN Stack", "UI/UX Design", "API Integration"];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-gray-800 bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main */}
        <div className="pb-12 pt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

            {/* Brand */}
            <div className="lg:col-span-5">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                  <FaCode className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Your Name</h3>
                  <p className="text-sm text-gray-500">MERN Stack Developer</p>
                </div>
              </div>

              <p className="mb-8 max-w-md text-gray-500">
                I craft fast, scalable and clean web apps using modern tech with
                strong focus on performance & UX.
              </p>

              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                Services
              </h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service} className="transition hover:text-red-500">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="inline-block transition hover:translate-x-1 hover:text-red-500"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                Stay Connected
              </h4>
              <p className="mb-4 text-sm text-gray-500">
                Drop your email for updates & builds 🚀
              </p>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
                <button className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700">
                  Subscribe
                </button>
              </div>

              <div className="mt-6 border-t border-gray-800 pt-6">
                <p className="mb-1 text-sm text-gray-500">Contact</p>
                <a
                  href="mailto:your.email@example.com"
                  className="text-sm text-red-500 hover:underline"
                >
                  your.email@example.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-white">Your Name</span>. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="transition hover:text-red-500">Privacy</a>
              <a href="#terms" className="transition hover:text-red-500">Terms</a>
              <a href="#sitemap" className="transition hover:text-red-500">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition hover:scale-110 hover:bg-red-700"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
