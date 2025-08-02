"use client";

import React, { useState } from "react";
import { FaPlay, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import FlyingBanner from "../components/FlyingBanner";
import Lanyard from "../components/Lanyard";
import Stack from "../components/Stack";
import CircularGallery from "../components/CircularGallery.jsx";
import AnimatedList from "../components/AnimatedList.jsx";
import TrustedBy from "../components/TrustedBy";
import FloatingLogos from "../components/FloatingLogos.jsx";
import Link from "next/link";

const animatedItems = [
  "Graphic Designer",
  "Video Editor",
  "Web Developer",
  "SEO Content Creator",
  "AI Intern",
  "UI/UX Assistant",
  "Virtual Assistant",
  "Data Analysis Intern",
  "Presentation Designer",
  "3D Visualiser",
];

const images = [
  { id: 1, img: "/stack/1.jpg" },
  { id: 2, img: "/stack/2.avif" },
  { id: 3, img: "/stack/3.avif" },
  { id: 4, img: "/stack/png2.avif" },
  { id: 5, img: "/stack/png1.png" },
];

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"talent" | "companies">("talent");
  const stackRef = React.useRef<any>(null);
  const handleStackLeft = () => {
    if (stackRef.current && stackRef.current.prevCard)
      stackRef.current.prevCard();
  };
  const handleStackRight = () => {
    if (stackRef.current && stackRef.current.prevCard)
      stackRef.current.prevCard();
  };

  return (
    <>
      <div className="relative h-screen w-screen bg-black overflow-x-hidden">
        {/* Top nav with tabs */}
        <div className="absolute top-[8vh] sm:top-[15vh] left-0 w-full flex flex-row items-center justify-center gap-2 z-10 px-2 sm:left-[10vw] sm:w-auto sm:justify-start">
          <button
            className={`rounded-3xl px-3 sm:px-6 py-1 text-xs h-8 sm:text-base sm:h-auto font-poppins border border-[#ADFF00] bg-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADFF00] ${
              tab === "talent"
                ? "bg-[#ADFF0038] text-[#ADFF00]"
                : "text-[#ADFF00] hover:bg-[#ADFF0038]"
            }`}
            onClick={() => setTab("talent")}
          >
            For Talent
          </button>
          <button
            className={`rounded-3xl px-3 sm:px-6 py-1 text-xs h-8 sm:text-base sm:h-auto font-poppins border border-[#ADFF00] bg-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADFF00] flex items-center gap-1 sm:gap-2 ${
              tab === "companies"
                ? "bg-[#ADFF0038] text-[#ADFF00]"
                : "text-[#ADFF00] hover:bg-[#ADFF0038]"
            }`}
            onClick={() => setTab("companies")}
          >
            For Companies
            <img
              src="/forcompaniessvg.svg"
              alt="icon"
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
          </button>
        </div>

        {tab === "talent" ? (
          <>
            {/* Lanyard & Headline + Waitlist/Video (responsive) */}
            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            <div className="absolute top-[75vh] sm:top-[35vh] left-0 sm:left-[10vw] z-20 w-full sm:w-auto flex flex-col items-center sm:items-start">
              <div className="w-full max-w-[95vw] sm:max-w-[45vw] px-2 sm:px-0 flex flex-col sm:block items-center sm:items-start justify-center gap-2 sm:gap-0">
                <div className="text-white text-lg sm:text-6xl font-poppins text-center sm:text-left mb-2 sm:mb-0 font-extrabold">
                  100+ GIG-JOBS<span>{""}</span>
                  <br />
                  DROP EVERY FRIDAY,
                  <br />5 PM
                </div>
                <div className="flex flex-row items-center justify-center sm:justify-start mt-2 sm:mt-8 gap-x-4">
                  <div className="bg-[#ADFF0038] rounded-full p-1 sm:p-2">
                    <Link
                      className="bg-[#ADFF00] rounded-full px-3 py-1 sm:px-6 sm:py-2 font-poppins font-semibold text-black flex items-center gap-2 shadow text-xs sm:text-base cursor-pointer"
                      href="/login"
                    >
                      Join the waitlist
                      <FaArrowRight className="rotate-315" />
                    </Link>
                  </div>
                  <button
                    className="rounded-full bg-[#1A2B0A] w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-[#4B8000] shadow-lg"
                    onClick={() => window.alert("Coming soon")}
                  >
                    <FaPlay className="text-[#ADFF00] text-base sm:text-xl" />
                  </button>
                  <span className="text-white font-poppins text-xs sm:text-lg">
                    Watch Video
                  </span>
                </div>
              </div>
            </div>

            {/* Flying banners */}
            <div className="hidden sm:block">
              <FlyingBanner
                style={{ position: "absolute", top: "30%", left: "50%" }}
                className="float-animate-y float-delay-0"
                title="10k+ Micro Gigs"
                avatars={[
                  "/avatars/avatar1.png",
                  "/avatars/avatar2.png",
                  "/avatars/avatar3.png",
                  "/avatars/avatar4.png",
                ]}
                extra={<div className="w-5 h-5 bg-black rounded-full ml-1" />}
              />
              <FlyingBanner
                style={{ position: "absolute", bottom: "18%", left: "65%" }}
                className="float-animate-x float-delay-1"
                title="10k+ Skill Tags"
                avatars={[
                  "/avatars/avatar1.png",
                  "/avatars/avatar2.png",
                  "/avatars/avatar3.png",
                  "/avatars/avatar4.png",
                ]}
                extra={<div className="w-5 h-5 bg-black rounded-full ml-1" />}
              />
              <FlyingBanner
                style={{ position: "absolute", top: "22%", right: "15%" }}
                className="float-animate-y float-delay-2"
                title={
                  <span>
                    <span className="font-bold">₹10L</span>
                    <br />
                    Disbursed
                  </span>
                }
                avatars={[]}
                extra={null}
              />
            </div>
            <div className="w-full flex justify-center mt-0 py-0 mb-2">
              <TrustedBy />
            </div>
            {/* Trusted by + Gallery intro */}
            <div className="relative z-10 -mt-2">
              <div className="w-full bg-[#F6F9FF] rounded-none sm:rounded-t-4xl">
                <div className="mx-auto max-w-[1100px] px-2 sm:px-8 pt-2 pb-4 sm:pt-4 sm:pb-8">
                  <div className="h-4 sm:h-[8vh]"></div>
                  <h2 className="text-5xl sm:text-7xl font-poppins font-bold mb-4 text-[#1F2E47] text-center leading-tight whitespace-pre-line">
                    {`Browse all\nSkill Gigs!`}
                  </h2>
                  <div className="text-[#1F2E47] text-lg sm:text-2xl font-poppins font-light text-center mb-4 w-full">
                    A dynamic group of innovators who ignite ideas and transform
                    them into impactful work!
                  </div>
                  <div className="relative w-full flex justify-center items-center mt-8">
                    <FloatingLogos />
                    <div className="w-full max-w-2xl mx-auto z-20">
                      <AnimatedList
                        items={animatedItems}
                        onItemSelect={(item: string, index: number) =>
                          console.log(item, index)
                        }
                        showGradients={true}
                        enableArrowNavigation={true}
                        displayScrollbar={true}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-16 mt-8 sm:mt-16 w-full max-w-[1100px] mx-auto">
                    <div className="text-center sm:text-left max-w-full sm:max-w-[30vw] text-lg sm:text-5xl font-poppins font-bold text-[#1F2E47] leading-tight">
                      100+ Verified Skilled Talent!
                    </div>
                    <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-6 w-full sm:w-[28vw] min-w-[180px] sm:min-w-[320px]">
                      <div className="text-[#1F2E47] text-sm sm:text-lg font-poppins font-normal text-center sm:text-left">
                        A dynamic group of innovators who ignite ideas and
                        transform them into impactful work!
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className="rounded-full p-[2px] bg-white/30 backdrop-blur-md"
                          style={{
                            boxShadow: "0 0 0 4px rgba(173,255,0,0.15)",
                          }}
                        >
                          <button
                            className="px-4 py-1 rounded-full border-2 flex items-center gap-2"
                            style={{
                              background: "#ADFF00",
                              borderColor: "#ADFF00",
                              color: "#1F2E47",
                              fontWeight: 600,
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "1rem",
                              boxShadow: "0 2px 16px #ADFF0033",
                              zIndex: 20,
                            }}
                            onClick={() => window.alert("Coming soon")}
                          >
                            View All Jobs
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              stroke="#1F2E47"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular gallery */}
            <div className="bg-[#F6F9FF]">
              <div style={{ height: "600px", position: "relative" }}>
                <CircularGallery />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* For Companies View - same layout as For Talent */}
            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            <div className="absolute top-[75vh] sm:top-[35vh] left-0 sm:left-[10vw] z-20 w-full sm:w-auto flex flex-col items-center sm:items-start">
              <div className="w-full max-w-[95vw] sm:max-w-[45Dvw] px-2 sm:px-0 flex flex-col sm:block items-center sm:items-start justify-center gap-2 sm:gap-0">
                <div className="text-white text-4xl sm:text-6xl font-black font-poppins text-center sm:text-left mb-2 sm:mb-0 max-w-3xl mx-auto">
                  INDIA'S #1 EARLY TALENT GATEWAY
                </div>
                <div className="flex flex-row items-center justify-center sm:justify-start gap-x-4 mt-2 sm:mt-8">
                  <div className="bg-[#ADFF0038] rounded-full p-1 sm:p-2">
                    <div
                      className="bg-[#ADFF00] rounded-full px-3 py-1 sm:px-6 sm:py-2 font-poppins font-semibold text-black flex items-center gap-2 shadow text-xs sm:text-base cursor-pointer"
                      onClick={() => router.push("/companies/login")}
                    >
                      Partner With Us
                      <FaArrowRight className="rotate-315" />
                    </div>
                  </div>
                  <button
                    className="rounded-full bg-[#1A2B0A] w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-[#4B8000] shadow-lg"
                    onClick={() => window.alert("Coming soon")}
                  >
                    <FaPlay className="text-[#ADFF00] text-base sm:text-xl" />
                  </button>
                  <span className="text-white font-poppins text-xs sm:text-lg">
                    Watch Video
                  </span>
                </div>
              </div>
            </div>
            {/* Flying banners for companies */}
            <div className="hidden sm:block">
              <FlyingBanner
                style={{ position: "absolute", top: "30%", left: "50%" }}
                className="float-animate-y float-delay-0"
                title="10k+ Micro Gigs"
                avatars={[
                  "/avatars/avatar1.png",
                  "/avatars/avatar2.png",
                  "/avatars/avatar3.png",
                  "/avatars/avatar4.png",
                ]}
                extra={<div className="w-5 h-5 bg-black rounded-full ml-1" />}
              />
              <FlyingBanner
                style={{ position: "absolute", bottom: "18%", left: "65%" }}
                className="float-animate-x float-delay-1"
                title="10k+ Skill Tags"
                avatars={[
                  "/avatars/avatar1.png",
                  "/avatars/avatar2.png",
                  "/avatars/avatar3.png",
                  "/avatars/avatar4.png",
                ]}
                extra={<div className="w-5 h-5 bg-black rounded-full ml-1" />}
              />
              <FlyingBanner
                style={{ position: "absolute", top: "22%", right: "15%" }}
                className="float-animate-y float-delay-2"
                title={
                  <span>
                    <span className="font-bold">₹10L</span>
                    <br />
                    Disbursed
                  </span>
                }
                avatars={[]}
                extra={null}
              />
            </div>
            <div className="w-full flex justify-center mt-8 mb-2">
              <TrustedBy />
            </div>
            {/* AnimatedList in a white/gray section with floating logos */}
            <div className="relative z-10 -mt-2">
              <div className="w-full bg-[#F6F9FF] rounded-none sm:rounded-t-4xl">
                <div className="mx-auto max-w-[1100px] px-2 sm:px-8 pt-2 pb-4 sm:pt-4 sm:pb-8 flex flex-col items-center">
                  <div className="w-full flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 min-h-[320px] sm:min-h-[380px] pt-12 sm:pt-20 pb-2 sm:pb-4">
                    <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start justify-center pl-2 pr-2 sm:pl-24">
                      <h2
                        className="text-2xl sm:text-4xl font-poppins text-center sm:text-left font-bold mb-2 sm:mb-4"
                        style={{ color: "#1F2E47" }}
                      >
                        Browse All Skill Gigs
                      </h2>
                      <p
                        className="text-center sm:text-left text-sm sm:text-lg font-poppins font-light"
                        style={{ color: "#1F2E47" }}
                      >
                        Claim Your Free, Sharable Skill Tag.
                      </p>
                      <p
                        className="text-center sm:text-left text-sm sm:text-lg font-poppins font-light"
                        style={{ color: "#1F2E47" }}
                      >
                        Start In Seconds, Start Looking For Gigs At Your Own
                        Pace.
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-start w-1/2 justify-center pr-2 sm:pr-8">
                      <div className="text-[#1F2E47] text-lg sm:text-2xl font-poppins font-light mb-4">
                        A dynamic group of innovators who ignite ideas and
                        transform them into impactful work!
                      </div>
                      <Link
                        className="bg-[#ADFF00] text-[#1F2E47] font-bold font-poppins rounded-full px-6 py-2 shadow hover:scale-105 transition-transform flex items-center gap-2"
                        href="/"
                      >
                        View All Jobs <FaArrowRight className="rotate-315" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-2 sm:p-6 flex justify-center">
                    <div
                      className="relative flex justify-center items-center"
                      style={{ minHeight: 220 }}
                    >
                      <div
                        className="absolute w-[340px] h-[220px] sm:w-[480px] sm:h-[320px]"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 0,
                          pointerEvents: "none",
                          background:
                            "radial-gradient(ellipse at center, #ADFF0066 0%, #ADFF0011 80%)",
                          filter: "blur(16px)",
                        }}
                      />
                      <button
                        onClick={handleStackLeft}
                        className="absolute left-0 z-20 bg-[#ADFF00] text-black rounded-full w-8 h-8 flex items-center justify-center shadow hover:scale-110 transition-transform"
                      >
                        &#8592;
                      </button>
                      <div className="relative z-10">
                        <Stack
                          ref={stackRef}
                          randomRotation={false}
                          sensitivity={180}
                          sendToBackOnClick={false}
                          cardDimensions={{ width: 340, height: 220 }}
                          cardsData={images}
                          responsive={true}
                        />
                      </div>
                      <button
                        onClick={handleStackRight}
                        className="absolute right-0 z-20 bg-[#ADFF00] text-black rounded-full w-8 h-8 flex items-center justify-center shadow hover:scale-110 transition-transform"
                      >
                        &#8594;
                      </button>
                    </div>
                  </div>
                  <div className="sm:hidden flex flex-col items-center mt-4">
                    <Link
                      className="bg-[#ADFF00] text-[#1F2E47] font-bold font-poppins rounded-full px-6 py-2 shadow hover:scale-105 transition-transform flex items-center gap-2 mb-2"
                      href="/"
                    >
                      View All Jobs <FaArrowRight className="rotate-315" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ——— GOT A GIG BANNER ——— */}
        <div className="gig-banner-section relative w-full flex justify-center py-6 sm:py-12 bg-[#F6F9FF]">
          <div className="w-full max-w-[340px] sm:max-w-[900px] rounded-2xl sm:rounded-3xl bg-black shadow-xl border border-[#222] flex flex-col md:flex-row items-center justify-between px-4 py-4 sm:px-10 sm:py-8 gap-4 sm:gap-6">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#ADFF00] text-center md:text-left">
              Got a Gig to be completed?
            </h3>
            <button
              className="px-4 py-2 sm:px-7 sm:py-3 bg-[#181F13] text-[#ADFF00] rounded-full border-2 border-[#ADFF00] font-semibold flex items-center gap-2 shadow-md hover:scale-105 transition-transform duration-150 text-sm sm:text-base"
              onClick={() => window.alert("Coming soon")}
            >
              Post a Gig <FaArrowRight className="text-[#ADFF00]" />
            </button>
          </div>
        </div>

        {/* ——— FULL-WIDTH FOOTER ——— */}
        <div className="footer-section relative w-full bg-[#F6F9FF] pt-8 sm:pt-12 pb-4 sm:pb-6 px-2 md:px-8 font-poppins text-[#1F2E47] text-xs md:text-sm">
          <div className="max-w-full sm:max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 items-start">
            {/* Left: Catalog + Logo */}
            <div className="flex flex-col gap-3 sm:gap-6 items-center sm:items-start">
              <div>
                <div className="uppercase text-[10px] sm:text-xs tracking-[0.2em] text-[#1F2E47]/50 mb-1 sm:mb-2 font-medium text-center sm:text-left">
                  CATALOG
                </div>
                <div className="flex flex-col gap-1 sm:gap-2 text-base sm:text-lg font-semibold">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4">
                    <Link
                      className="hover:text-[#ADFF00] transition-colors cursor-pointer"
                      href="/"
                    >
                      Features
                    </Link>
                    <span className="text-[#E6EAF1]">/</span>
                    <Link
                      className="hover:text-[#ADFF00] transition-colors cursor-pointer"
                      href="/"
                    >
                      Product
                    </Link>
                  </div>
                </div>
              </div>
              <div className="text-lg sm:text-2xl font-extrabold tracking-tight mt-2 sm:mt-4 text-[#1F2E47] opacity-80 text-center sm:text-left">
                SkillTag
              </div>
            </div>

            {/* Center: Contact & Location */}
            <div className="flex flex-col gap-4 sm:gap-10 border-l-0 sm:border-l border-r-0 sm:border-r border-[#E6EAF1] px-0 sm:px-8 items-center sm:items-start">
              <div>
                <div className="text-xs sm:text-base font-bold mb-1 sm:mb-2 tracking-wide text-[#1F2E47] text-center sm:text-left">
                  Contact Us
                </div>
                <div className="text-xs sm:text-base font-normal text-[#1F2E47]/80 text-center sm:text-left">
                  skilltag.hub@gmail.com
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-base font-bold mb-1 sm:mb-2 tracking-wide text-[#1F2E47] text-center sm:text-left">
                  Location
                </div>
                <div className="text-xs sm:text-base font-normal text-[#1F2E47]/80 text-center sm:text-left">
                  Hyderabad, India
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
