import { Suspense } from "react";
import { MainNav } from "@/shared/components/NavBar";
import Footer from "@/shared/components/Footer";
import { PageTransition } from "@/shared/components/animation/PageTransition";
import Spinner from "@/shared/components/ui/spinner";
import ContactForm from "./client-components/ContactForm";
import { MapPin, Phone, Mail, ArrowRight, ArrowDownRight } from "lucide-react";
import BlurText from "@/shared/components/animation/BlurText";

export default function ContactPage() {
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
                      text="Let's get"
                      className="text-zinc-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                    />
                    <BlurText
                      text="in touch"
                      className="text-zinc-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                    />
                    <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
                      Great! We're excited to hear from you and let's start
                      something special together. Call us for any inquiry.
                    </p>
                  </div>

                  <div className="mt-8 space-y-6">
                    <BlurText
                      text="Don't be afraid to say hello with us!"
                      className="text-zinc-900 dark:text-white text-2xl font-semibold"
                    />

                    <div className="space-y-5 mt-6">
                      <div className="flex items-start space-x-4">
                        <Phone className="w-5 h-5 text-zinc-900 dark:text-white mt-1" />
                        <div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Phone
                          </p>
                          <a
                            href="tel:+12578385379"
                            className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            +1 (257) 838-5379
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <Mail className="w-5 h-5 text-zinc-900 dark:text-white mt-1" />
                        <div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Email
                          </p>
                          <a
                            href="mailto:hello@mirageestate.com"
                            className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            hello@mirageestate.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <MapPin className="w-5 h-5 text-zinc-900 dark:text-white mt-1" />
                        <div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Office
                          </p>
                          <p className="text-zinc-900 dark:text-white">
                            230 Norman Street New York, QC (USA) H8R 1A1
                          </p>
                          <a
                            href="https://maps.google.com?q=230+Norman+Street+New+York"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-zinc-900 dark:text-white mt-1 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            See on Google Map
                            <ArrowRight className="ml-1 w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="grid lg:grid-row-4 h-full lg:border-x-2 border-y-2 lg:border-y-0 border-zinc-300 dark:border-zinc-700 border-dashed">
                  <div className="row-span-4 flex items-end justify-start p-4">
                    <ArrowDownRight className="w-14 h-14 text-zinc-900 dark:text-white" />
                  </div>
                  <div className="row-span-1 bg-black p-2 sm:p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                      Contact
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
