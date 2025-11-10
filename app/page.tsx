'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Experience from "./components/experience";
import Footer from "./components/footer";
import AppleGlassMenu from "./components/footer/AppleGlassMenu";
import Hero from "./components/hero";

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
