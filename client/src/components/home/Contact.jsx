import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../utils/api";
import Button from "../common/Button";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import {
  User,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Loader,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Clock,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email",
      value: "your.email@example.com",
      link: "mailto:your.email@example.com",
    },
    {
      icon: FaPhone,
      title: "Phone",
      value: "+880 123 456 7890",
      link: "tel:+8801234567890",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Location",
      value: "Dhaka, Bangladesh",
      link: "#",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      link: "#",
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitStatus(null);

    try {
      await api.post("/messages", formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitStatus("success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      setSubmitStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Get In <span className="text-red-600">Touch</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Have a project in mind or just want to say hello? Let’s talk.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-5">
              {contactInfo.map((info, idx) => (
                <a
                  key={idx}
                  href={info.link}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-red-600 hover:shadow-md"
                >
                  <info.icon className="text-xl text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">{info.title}</p>
                    <p className="font-semibold text-gray-900">{info.value}</p>
                  </div>
                </a>
              ))}

              <div className="flex gap-4 pt-2">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="text-gray-500 transition hover:text-red-600"
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { name: "name", placeholder: "Your Name", Icon: User },
                  { name: "email", placeholder: "Your Email", Icon: Mail },
                  { name: "subject", placeholder: "Subject", Icon: MessageSquare },
                ].map(({ name, placeholder, Icon }) => (
                  <div key={name}>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type={name === "email" ? "email" : "text"}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full rounded-lg border px-11 py-3 text-gray-900 placeholder-gray-400 focus:outline-none ${
                          errors[name]
                            ? "border-red-500"
                            : "border-gray-300 focus:border-red-500"
                        }`}
                      />
                    </div>
                    {errors[name] && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Your Message"
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none ${
                      errors.message
                        ? "border-red-500"
                        : "border-gray-300 focus:border-red-500"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>

                {submitStatus === "success" && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-3 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Message sent successfully!
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    Failed to send message.
                  </div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
