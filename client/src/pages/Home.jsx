import React from "react";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Skills from "../components/home/Skills";
import Projects from "../components/home/Projects";
import Experience from "../components/home/Experience";
import Contact from "../components/home/Contact";
import Loader from "../components/common/Loader";

const Home = () => {
  // You can use state to handle a loading spinner if fetching data
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      {loading && <Loader />}
      <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
};

export default Home;
