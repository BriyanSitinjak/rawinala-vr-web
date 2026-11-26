import { AreaCards } from "@/components/home/AreaCards";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { TourPlaceholder } from "@/components/tour/TourPlaceholder";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <AreaCards />
        <TourPlaceholder />
      </main>
      <Footer />
    </>
  );
}
