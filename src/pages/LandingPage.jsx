import React, { useRef } from "react";
import Explanation from "../components/LandingPage/Explanation";
import Feature from "../components/LandingPage/Feature";
import Flow from "../components/LandingPage/Flow";
import Footer from "../components/LandingPage/Footer";
import Jumbotron from "../components/LandingPage/Jumbotron";
import Navbar from "../components/LandingPage/Navbar";

const LandingPage = () => {
  const jumbotronRef = useRef(null);
  const featureRef = useRef(null);
  const flowRef = useRef(null);

  return (
    <div className="flex h-max flex-col gap-10">
      <Navbar featureRef={featureRef} flowRef={flowRef} jumbotronRef={jumbotronRef}/>
      <div ref={jumbotronRef}>
        <Jumbotron flowRef={flowRef} />
      </div>
        <Explanation />
      <div ref={flowRef}>
        <Flow />
      </div>
      <div ref={featureRef}>
        <Feature />
      </div>
        <Footer />
    </div>
  );
};

export default LandingPage;
