import { AreaCards } from "@/components/home/AreaCards";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { TourShell } from "@/components/tour/TourShell";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <AreaCards />
        <TourShell />
      </main>
      <Footer />
    </>
  );
}
