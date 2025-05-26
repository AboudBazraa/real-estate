"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const ctaRef = useRef(null);
  const { locale, changeLanguage, isRTL } = useLanguage();

  return (
    <motion.section
      ref={ctaRef}
      className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-black text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="mx-auto">
        {/* Top Section with Brand and Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-8 sm:mb-10 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-zinc-700 dark:border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
          {/* Brand Column */}
          <div className="md:col-span-2 md:border-r border-zinc-900 footer-column pb-6 md:pb-0">
            <h2 className="text-4xl sm:text-5xl font-light mb-4 sm:mb-6">
              {locale === "ar" ? "عقار" : "Estate"}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mb-6 sm:mb-8 max-w-xs">
              {locale === "ar"
                ? "يمثل تصميم عقار قمة التصميم، حيث يجمع بين التميز في الجودة الإيطالية، وابتكار الأداء، واختيار المواد بعناية."
                : "Estate design represents the pinnacle of design, combining excellence in Italian quality, performance innovation, and careful selection of materials."}
            </p>
            <div className="flex gap-4 sm:gap-6">
              <motion.a
                href="#"
                aria-label="Facebook"
                className="text-zinc-500 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                aria-label="Instagram"
                className="text-zinc-500 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                aria-label="Twitter"
                className="text-zinc-500 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-1 footer-column mt-4 md:mt-0">
            <h3 className="text-white text-base sm:text-lg font-medium mb-4 sm:mb-6">
              {locale === "ar" ? "اتصل بنا" : "Contact"}
            </h3>
            <div className="flex flex-col gap-3 sm:gap-4">
              <motion.div whileHover={{ x: 5 }}>
                <p className="text-zinc-400 text-xs sm:text-sm">
                  {locale === "ar"
                    ? "للاستفسارات العامة:"
                    : "For general inquiries:"}
                </p>
                <a
                  href="mailto:contact@estate.com"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  contact@estate.com
                </a>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <p className="text-zinc-400 text-xs sm:text-sm">
                  {locale === "ar" ? "بخصوص الطلبات:" : "Regarding orders:"}
                </p>
                <a
                  href="mailto:orders@estate.com"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  orders@estate.com
                </a>
              </motion.div>
            </div>
          </div>

          {/* About Column */}
          <div className="md:col-span-1 footer-column mt-4 md:mt-0">
            <h3 className="text-white text-base sm:text-lg font-medium mb-4 sm:mb-6">
              {locale === "ar" ? "عن الشركة" : "About"}
            </h3>
            <ul className="flex flex-col gap-2 sm:gap-3">
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar" ? "المصنع" : "Factory"}
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar" ? "المصمم" : "Designer"}
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar" ? "الشركاء" : "Partner"}
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar" ? "المشاريع" : "Project"}
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Other Column */}
          <div className="md:col-span-1 footer-column mt-4 md:mt-0">
            <h3 className="text-white text-base sm:text-lg font-medium mb-4 sm:mb-6">
              {locale === "ar" ? "أخرى" : "Other"}
            </h3>
            <ul className="flex flex-col gap-2 sm:gap-3">
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar"
                    ? "الأسعار وطرق الدفع"
                    : "Prices and Payments"}
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar" ? "سياسة الإرجاع" : "Return Policy"}
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar" ? "شروط الخدمة" : "Terms of Service"}
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
                </a>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse bg-zinc-900/40 p-2 rounded-lg">
            <span className="text-zinc-400 text-sm">
              {locale === "ar" ? "اللغة:" : "Language:"}
            </span>
            <button
              onClick={() => changeLanguage("en")}
              className={`px-3 py-1 rounded text-sm ${
                locale === "en"
                  ? "bg-white text-black font-medium"
                  : "text-zinc-400 hover:text-white"
              }`}
              suppressHydrationWarning
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("ar")}
              className={`px-3 py-1 rounded text-sm ${
                locale === "ar"
                  ? "bg-white text-black font-medium"
                  : "text-zinc-400 hover:text-white"
              }`}
              suppressHydrationWarning
            >
              العربية
            </button>
          </div>
        </div>

        {/* Let's Collaborate */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: [50, 0] }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden"
        >
          <h2 className="lets-collaborate text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-light tracking-widest">
            {locale === "ar" ? "لنتعاون معًا" : "Let's Collaborate"}
          </h2>
          <div className="text-xs sm:text-sm text-zinc-500 mt-2 sm:mt-4 pb-4 text-center">
            {locale === "ar"
              ? `© ${currentYear} عقار، جميع الحقوق محفوظة.`
              : `© ${currentYear} Estate, Inc. All rights reserved.`}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
