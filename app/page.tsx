'use client';

import dynamic from 'next/dynamic';
import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import AppleGlassMenu from "./components/footer/AppleGlassMenu";

// Dynamic imports for heavy components to improve initial load performance
const Hero = dynamic(() => import("./components/hero"), { ssr: false });
const Experience = dynamic(() => import("./components/experience"), { ssr: false });
const Footer = dynamic(() => import("./components/footer"), { ssr: false });

const Home = () => {
  return (
    <>
      <CanvasLoader>
        <ScrollWrapper>
          <Hero/>
          <Experience/>
          <Footer/>
        </ScrollWrapper>
      </CanvasLoader>
      <AppleGlassMenu />
    </>
  );
};
export default Home;
