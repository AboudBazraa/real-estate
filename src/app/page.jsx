import Image from "next/image";
import NavBar from "../shared/components/NavBar";
import Section from "@/app/components/SectionHero";
import SectionAnmation from "@/app/components/SectionAnmation";
import { GlowEffectButton } from "@/shared/components/animation/GlowEffectButton";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-background text-foreground transition-colors duration-300 dark:bg-black">
      <NavBar />
      <div className="flex items-center justify-between justify-items-stretch h-full w-full font-geist-sans absolute top-0">
        <div className=" h-full w-20 border-r border-zinc-300 dark:border-zinc-800 border-dashed "></div>
        <div className="pt-16 p-1 h-full w-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 h-2/5 w-full justify-between pt-1.5 items-start">
            <GlowEffectButton text={'Get in our website'} className={`mx-3 px-8 rounded-xl font-bold italic tracking-widest`} />
            <Section />
          </div>
          <div className="w-full h-3/5 bg-zinc-950 shadow dark:bg-black border-2 border-zinc-300 dark:border-zinc-800 rounded-3xl p-3">
            <SectionAnmation />
          </div>
        </div>
        {/* <div className=" w-80 h-full  border-l border-zinc-300 dark:border-zinc-800 border-dashed "></div> */}
      </div>
    </div>
  );
}


const Next = () => {
  return (
    <>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-geist-mono">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.js
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row ">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 bg-slate-900 text-white hover:bg-slate-700 dark:text-black dark:bg-slate-100 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </>
  );
};
