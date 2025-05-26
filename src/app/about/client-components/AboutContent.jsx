"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurText from "@/shared/components/animation/BlurText";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutContent() {
  const contentRef = useRef(null);

  useEffect(() => {
    // Content sections animation
    if (contentRef.current) {
      gsap.fromTo(
        ".content-section",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reset",
          },
        }
      );
    }

    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={contentRef}
      className="py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-white dark:bg-black"
      dir={
        typeof window !== "undefined" &&
        (document?.documentElement?.lang === "ar" ||
          (typeof navigator !== "undefined" &&
            navigator.language?.startsWith("ar")))
          ? "rtl"
          : "ltr"
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Our Story */}
        <div className="content-section mb-16">
          <BlurText
            text={
              typeof window !== "undefined" &&
              (document?.documentElement?.lang === "ar" ||
                (typeof navigator !== "undefined" &&
                  navigator.language?.startsWith("ar")))
                ? "قصتنا"
                : "Our Story"
            }
            className="text-zinc-900 dark:text-zinc-100 text-3xl md:text-4xl font-bold mb-6"
          />
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
              typeof window !== "undefined" &&
              (document?.documentElement?.lang === "ar" ||
                (typeof navigator !== "undefined" &&
                  navigator.language?.startsWith("ar")))
                ? "text-right font-aribac"
                : ""
            }`}
          >
            <div>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "تأسست شركتنا العقارية في عام 2023 من رؤية تهدف إلى تغيير الطريقة التي يجد بها الناس منازل أحلامهم ويشترونها. نؤمن بأن العقارات الفاخرة يجب أن تكون متاحة وشفافة ومصممة خصيصًا لتلبية احتياجات كل عميل."
                  : "Founded in 2023, our real estate company was born from a vision to transform the way people find and purchase their dream homes. We believe that luxury real estate should be accessible, transparent, and tailored to each client's unique needs."}
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "ما بدأ كفريق صغير من عشاق العقارات المتحمسين نما ليصبح شبكة من المحترفين المكرسين، الملتزمين بالتميز في كل عقار نمثله."
                  : "What started as a small team of passionate real estate enthusiasts has grown into a network of dedicated professionals, committed to excellence in every property we represent."}
              </p>
            </div>
            <div>
              <motion.img
                src="/images/ddd.jpeg"
                alt={
                  typeof window !== "undefined" &&
                  (document?.documentElement?.lang === "ar" ||
                    (typeof navigator !== "undefined" &&
                      navigator.language?.startsWith("ar")))
                    ? "قصتنا"
                    : "Our Story"
                }
                className="w-full h-64 object-cover rounded-2xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="content-section mb-16">
          <BlurText
            text={
              typeof window !== "undefined" &&
              (document?.documentElement?.lang === "ar" ||
                (typeof navigator !== "undefined" &&
                  navigator.language?.startsWith("ar")))
                ? "قيمنا"
                : "Our Values"
            }
            className="text-zinc-900 dark:text-zinc-100 text-3xl md:text-4xl font-bold mb-6"
          />
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${
              typeof window !== "undefined" &&
              (document?.documentElement?.lang === "ar" ||
                (typeof navigator !== "undefined" &&
                  navigator.language?.startsWith("ar")))
                ? "text-right font-aribac"
                : ""
            }`}
          >
            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl">
              <h3 className="text-xl font-medium mb-3">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "التميز"
                  : "Excellence"}
              </h3>
              <p className="text-zinc-700 dark:text-zinc-400">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "نلتزم بالتميز في جميع جوانب خدماتنا، من اختيار العقارات إلى علاقات العملاء."
                  : "We are committed to excellence in every aspect of our service, from property curation to client relationships."}
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl">
              <h3 className="text-xl font-medium mb-3">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "النزاهة"
                  : "Integrity"}
              </h3>
              <p className="text-zinc-700 dark:text-zinc-400">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "نعمل بنزاهة لا تتزعزع، ونضمن الشفافية والصدق في جميع تعاملاتنا."
                  : "We operate with unwavering integrity, ensuring transparency and honesty in all our interactions."}
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl">
              <h3 className="text-xl font-medium mb-3">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "الابتكار"
                  : "Innovation"}
              </h3>
              <p className="text-zinc-700 dark:text-zinc-400">
                {typeof window !== "undefined" &&
                (document?.documentElement?.lang === "ar" ||
                  (typeof navigator !== "undefined" &&
                    navigator.language?.startsWith("ar")))
                  ? "نحتضن الابتكار، ونسعى باستمرار لإيجاد طرق جديدة لتحسين تجربة العقارات لعملائنا."
                  : "We embrace innovation, constantly seeking new ways to enhance the real estate experience for our clients."}
              </p>
            </div>
          </div>
        </div>

        {/* We can uncomment the Team section if needed later */}
        {/* <div className="content-section">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            {typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar"))
              ? "فريقنا"
              : "Our Team"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "أليكس جونسون" : "Alex Johnson",
                role: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "المؤسس والرئيس التنفيذي" : "Founder & CEO",
                image:
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2049&auto=format",
              },
              {
                name: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "سارة ويليامز" : "Sarah Williams",
                role: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "رئيسة قسم التصميم" : "Head of Design",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2087&auto=format",
              },
              {
                name: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "مايكل تشين" : "Michael Chen",
                role: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "كبير المهندسين المعماريين" : "Lead Architect",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2087&auto=format",
              },
              {
                name: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "إميلي رودريغيز" : "Emily Rodriguez",
                role: typeof window !== "undefined" && (document?.documentElement?.lang === "ar" || typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) ? "مصممة داخلية" : "Interior Designer",
                image:
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-3 overflow-hidden rounded-2xl">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
