"use client";
import { Suspense } from "react";
import { MainNav } from "@/shared/components/NavBar";
import Footer from "@/shared/components/Footer";
import { PageTransition } from "@/shared/components/animation/PageTransition";
import Spinner from "@/shared/components/ui/spinner";
import ContactForm from "./client-components/ContactForm";
import { MapPin, Phone, Mail, ArrowRight, ArrowDownRight } from "lucide-react";
import BlurText from "@/shared/components/animation/BlurText";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function ContactPage() {
  const { locale, t } = useLanguage();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col dark:bg-zinc-950 ">
        {/* Navigation */}
        <MainNav />

        {/* Content with padding for fixed navbar */}
        <div className="pt-20 lg:pt-7 w-full lg:max-w-7xl h-full mx-auto mb-80 lg:mb-0">
          <section className="h-screen">
            <div className="w-full h-full px-4 sm:px-6 lg:px-8 mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full h-full">
                {/* Left Column - Contact Information */}
                <div className="flex flex-col justify-center h-full p-5">
                  <div>
                    <BlurText
                      text={locale === "ar" ? "لنتواصل" : "Let's get"}
                      className="text-zinc-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                    />
                    <BlurText
                      text={locale === "ar" ? "معاً" : "in touch"}
                      className="text-zinc-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                    />
                    <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
                      {locale === "ar"
                        ? "رائع! نحن متحمسون لسماعك ودعنا نبدأ شيئًا مميزًا معًا. اتصل بنا لأي استفسار."
                        : "Great! We're excited to hear from you and let's start something special together. Call us for any inquiry."}
                    </p>
                  </div>

                  <div className="mt-8 space-y-6">
                    <BlurText
                      text={
                        locale === "ar"
                          ? "لا تتردد في التواصل معنا!"
                          : "Don't be afraid to say hello with us!"
                      }
                      className="text-zinc-900 dark:text-white text-2xl font-semibold"
                    />

                    <div className="space-y-5 mt-6">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <Phone className="w-5 h-5 text-zinc-900 dark:text-white mt-1" />
                        <div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {locale === "ar" ? "الهاتف" : "Phone"}
                          </p>
                          <a
                            href="tel:+12578385379"
                            className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            +1 (257) 838-5379
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <Mail className="w-5 h-5 text-zinc-900 dark:text-white mt-1" />
                        <div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                          </p>
                          <a
                            href="mailto:hello@mirageestate.com"
                            className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            hello@mirageestate.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <MapPin className="w-5 h-5 text-zinc-900 dark:text-white mt-1" />
                        <div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {locale === "ar" ? "المكتب" : "Office"}
                          </p>
                          <p className="text-zinc-900 dark:text-white">
                            {locale === "ar"
                              ? "230 شارع نورمان نيويورك، كيبيك (الولايات المتحدة) H8R 1A1"
                              : "230 Norman Street New York, QC (USA) H8R 1A1"}
                          </p>
                          <a
                            href="https://maps.google.com?q=230+Norman+Street+New+York"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-zinc-900 dark:text-white mt-1 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            {locale === "ar"
                              ? "اعرض على خرائط جوجل"
                              : "See on Google Map"}
                            <ArrowRight className="ml-1 rtl:mr-1 rtl:ml-0 w-3 h-3 rtl:rotate-180" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="grid lg:grid-row-4 h-full lg:border-x-2 border-y-2 lg:border-y-0 border-zinc-300 dark:border-zinc-700 border-dashed">
                  <div className="row-span-4 flex items-end justify-start p-4">
                    <ArrowDownRight
                      className={`w-14 h-14 text-zinc-900 dark:text-white ${
                        locale === "ar" ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  <div className="row-span-1 bg-black p-2 sm:p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                      {locale === "ar" ? "اتصل بنا" : "Contact"}
                    </h2>
                    <Suspense
                      fallback={
                        <div className="w-full min-h-[400px] flex items-center justify-center">
                          <Spinner
                            size="lg"
                            className="border-zinc-700 border-t-zinc-300"
                          />
                        </div>
                      }
                    >
                      <ContactForm />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
