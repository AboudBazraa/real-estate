import Footer from "@/shared/components/Footer";
import { MainNav } from "@/shared/components/NavBar";
import SectionAnmation from "../components/SectionAnmation";

export default function aboutpage() {
  return (
    <div>
      <>
        <div className="h-screen w-screen px-2 pb-2 bg-zinc-50 text-foreground transition-colors duration-300 dark:bg-black flex flex-col gap-2">
          <div className="bg-black">
            <MainNav />
          </div>
          {/* hero section */}
          <div className="bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border border-zinc-800 h-full rounded-xl overflow-hidden shadow-2xl w-full mx-auto flex flex-col justify-center items-center">
            <SectionAnmation />
          </div>
          <div className="flex-1">
            <Footer />
          </div>
        </div>
      </>
    </div>
  );
}
