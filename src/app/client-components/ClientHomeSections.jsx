"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurText from "@/shared/components/animation/BlurText";
import { ArrowRight } from "lucide-react";
import SubscriptionSection from "./SubscriptionSection";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Historical Journey Carousel Component
function HistoricalJourneyCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of images with their descriptions
  const carouselItems = [
    {
      image:
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format",
      alt: "Modern Kitchen with Large Windows",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600566753851-c3f970f613dc?q=80&w=2070&auto=format",
      alt: "Elegant Living Space",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format",
      alt: "Minimalist Dining Area",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2070&auto=format",
      alt: "Contemporary Bathroom Design",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?q=80&w=2070&auto=format",
      alt: "Luxury Bedroom Suite",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2070&auto=format",
      alt: "Open Concept Living Room",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format",
      alt: "High-End Kitchen Design",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2070&auto=format",
      alt: "Luxury Property Exterior",
    },
  ];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + carouselItems.length) % carouselItems.length
    );
  };

  return (
    <div className="relative h-[300px] lg:h-[500px] overflow-hidden rounded-2xl">
      {/* Images */}
      {carouselItems.map((item, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentIndex === index ? 1 : 0,
            zIndex: currentIndex === index ? 10 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.img
            src={item.image}
            alt={item.alt}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: currentIndex === index ? 1.05 : 1 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        </motion.div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-4 lg:bottom-10 w-full flex justify-between items-center px-4 lg:px-10 ">
        <div className="text-zinc-400 text-2xl z-20">
          {currentIndex + 1}/{carouselItems.length}
        </div>
        <div className="flex gap-4 z-20">
          <button
            className="text-white hover:text-zinc-300 transition-colors bg-black/30 p-2 rounded-2xl backdrop-blur-sm"
            aria-label="Previous slide"
            onClick={goToPrevious}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="text-white hover:text-zinc-300 transition-colors bg-black/30 p-2 rounded-2xl backdrop-blur-sm"
            aria-label="Next slide"
            onClick={goToNext}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClientHomeSections() {
  // State hooks
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Ref hooks
  const timelineRef = useRef(null);
  const showcaseRef = useRef(null);
  const categoryRef = useRef(null);
  const ctaRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Data for sections
  const timelineEvents = [
    {
      year: 2019,
      title: "Founded",
      description: "Established with a vision to transform real estate",
    },
    {
      year: 2021,
      title: "Expanded to 50+ Cities",
      description: "Nationwide presence with curated properties",
    },
    {
      year: 2023,
      title: "Luxury Collection",
      description: "Handpicked premium estates and properties",
    },
    {
      year: 2024,
      title: "AI-Powered Search",
      description: "Intelligent matching for your perfect home",
    },
  ];

  useEffect(() => {
    // Add scroll listener for back to top button
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Timeline section animation
    if (timelineRef.current) {
      gsap.fromTo(
        ".timeline-year",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none reset",
          },
        }
      );

      gsap.fromTo(
        ".timeline-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            toggleActions: "play none none reset",
          },
        }
      );
    }

    // Category cards animation
    if (categoryRef.current) {
      gsap.fromTo(
        ".category-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoryRef.current,
            start: "top 75%",
            toggleActions: "play none none reset",
          },
        }
      );
    }

    // CTA section animation
    if (ctaRef.current) {
      gsap.fromTo(
        ".cta-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none reset",
          },
        }
      );

      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 75%",
            toggleActions: "play none none reset",
          },
        }
      );
    }

    // Subscription section animation
    if (subscriptionRef.current) {
      gsap.fromTo(
        ".subscription-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subscriptionRef.current,
            start: "top 80%",
            toggleActions: "play none none reset",
          },
        }
      );
    }

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Smooth scroll function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Essence Section - Inspired by Boffi's Journey */}
      <section className="relative py-20 w-full overflow-hidden bg-black text-white">
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex lg:flex-row flex-col flex-auto justify-between gap-10 mb-16">
            {/* Left side - Heading */}
            <div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
                <BlurText
                  text="Property Journey:"
                  delay={100}
                  animateBy="words"
                  direction="left"
                  className="font-light block"
                />
                <span className="text-2xl md:text-5xl lg:text-6xl mt-2 block">
                  <BlurText
                    text="Searching for the Essence"
                    delay={200}
                    animateBy="words"
                    direction="left"
                    className="font-light"
                  />
                </span>
              </h2>
            </div>

            {/* Right side - Description */}
            <div className="flex items-center lg:w-3xl">
              <p className="text-zinc-500 text-sm md:text-lg leading-relaxed">
                Starting with De Padova in 2015, a venture that would lead the
                two Made in Italy brands to closely collaborate on developing a
                path to strong internationalization, already underway in both
                companies, with the aim of promoting "Italian know-how"
                globally, by establishing a group capable of penetrating the
                domestic and turnkey contract markets in a far-reaching way.
              </p>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 relative">
            {/* Left image - 5 columns */}
            <div className="lg:col-span-4 overflow-hidden rounded-sm">
              <motion.img
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2069&auto=format"
                alt="Elegant Bedroom"
                className="w-full aspect-[4/3] object-cover rounded-2xl"
                initial={{ scale: 1 }}
                whileInView={{ scale: 1.03 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            {/* Right image - 7 columns */}
            <div className="lg:col-span-8 overflow-hidden rounded-sm">
              <motion.img
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2069&auto=format"
                alt="Modern Living Room"
                className="w-full aspect-[16/9] object-cover rounded-2xl"
                initial={{ scale: 1 }}
                whileInView={{ scale: 1.03 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            {/* Star decoration element */}
            <div className="absolute -bottom-21 left-1/3 transform -translate-x-1/2">
              <svg
                width="150"
                height="150"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 0L23.5 16.5L40 20L23.5 23.5L20 40L16.5 23.5L0 20L16.5 16.5L20 0Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline/Journey Section */}
      <section
        ref={timelineRef}
        className="py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-white dark:bg-gradient-to-b dark:from-zinc-950 dark:via-black dark:to-zinc-950"
      >
        <div className="mx-auto">
          <h2 className="text-zinc-900 dark:text-white text-3xl md:text-4xl lg:text-5xl font-light mb-16">
            <BlurText
              text="Our Journey"
              delay={150}
              animateBy="words"
              direction="left"
              className="font-light"
            />
          </h2>

          <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-0 right-0 top-8 h-0.5 bg-zinc-200 dark:bg-zinc-800"></div>

            {timelineEvents.map((event, index) => (
              <div key={index} className="relative">
                <div className="timeline-year text-5xl md:text-6xl text-zinc-900 dark:text-white font-light mb-6">
                  {event.year}
                </div>
                <div className="timeline-content">
                  <h3 className="text-xl md:text-2xl text-zinc-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Journey Section */}
      <section className="relative py-20 w-full overflow-hidden bg-black text-white px-4 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-screen ">
          {/* Left Side - Image Carousel */}
          <HistoricalJourneyCarousel />

          {/* Right Side - Content */}
          <div className="flex flex-col justify-between p-4 lg:p-16">
            <div className="flex flex-col gap-9">
              {/* Title */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light">
                <BlurText
                  text="Historical Journey"
                  delay={100}
                  animateBy="words"
                  direction="right"
                  className="font-light"
                />
              </h2>

              {/* Description */}
              <p className="text-zinc-400 text-base md:text-lg max-w-xl">
                The visionary imprint of the Real Estate brothers merges with
                that of modern architecture: our signature properties turn into
                an avant-garde symbol of luxury living design; a fluid cubic
                arrangement incorporating all elements of comfort, elegance, and
                functionality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section
        ref={showcaseRef}
        className="py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-black text-white"
      >
        <div className="mx-auto">
          {/* Header with title and year */}
          <div className="flex  justify-between mb-6 relative">
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-light mb-8 max-w-4xl">
              <BlurText
                text="Our Newest"
                delay={100}
                animateBy="words"
                direction="bottom"
                className="font-light block"
              />
              <BlurText
                text="Collection"
                delay={200}
                animateBy="words"
                direction="bottom"
                className="font-light block ml-20 lg:ml-52"
              />
            </h2>
            <span className="text-2xl lg:text-4xl text-zinc-300 mt-1 lg:mt-7 ">
              (2025)
            </span>
          </div>

          {/* Description paragraphs */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 mb-5">
            <div>
              <p className="text-zinc-400 text-base">
                Handcraft and advanced machinery transform raw materials into
                remarkable works of contemporary design.
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-base">
                Sustainability is part of culture, creativity, technology and
                entrepreneurship by design and cuts across all planning
                decisions, production and testing.
              </p>
            </div>
            {/* View More button */}
            <div className="flex justify-end mb-16 mr-10">
              <div className="rounded-full border border-zinc-700 p-4 w-40 h-40 flex flex-col items-center justify-center hover:bg-zinc-900 transition-colors cursor-pointer group">
                <span className="text-sm uppercase tracking-wide mb-1">
                  View
                </span>
                <span className="text-lg">More</span>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bathroom */}
            <div className="relative overflow-hidden group category-card">
              <div className="relative pb-[75%] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format"
                  alt="Luxury Bathroom"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-5 flex justify-between items-center w-full">
                <span className="text-white text-xl">Bathroom</span>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <ArrowRight className="text-white w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Wardrobe */}
            <div className="relative overflow-hidden group category-card">
              <div className="relative pb-[75%] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=2070&auto=format"
                  alt="Modern Wardrobe"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-5 flex justify-between items-center w-full">
                <span className="text-white text-xl">Wardrobe</span>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <ArrowRight className="text-white w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="relative overflow-hidden group category-card">
              <div className="relative pb-[75%] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format"
                  alt="Home Accessories"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rounded-lg rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-5 flex justify-between items-center w-full">
                <span className="text-white text-xl">Accessories</span>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <ArrowRight className="text-white w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <div ref={subscriptionRef} className="subscription-content">
        <SubscriptionSection />
      </div>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-black text-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="cta-title text-4xl md:text-5xl font-light mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="cta-content text-zinc-400 max-w-2xl mx-auto mb-8">
            Contact our team today and let us help you discover the perfect
            property that matches your lifestyle and aspirations.
          </p>
          <motion.button
            className="bg-white text-black px-8 py-3 rounded-2xl font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Contact Us
          </motion.button>
        </div>
      </section>

      {/* Back to top button */}
      {showBackToTop && (
        <motion.button
          className="fixed right-6 bottom-6 z-50 p-3 bg-zinc-800/70 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-zinc-700"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19V5M12 5L5 12M12 5L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </>
  );
}
