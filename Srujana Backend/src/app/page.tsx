import HeroCarousel from "@/components/home/HeroCarousel";
import Statement from "@/components/home/Statement";
import ExpertiseList from "@/components/home/ExpertiseList";
import IndustriesGrid from "@/components/home/IndustriesGrid";
import ImpactStats from "@/components/home/ImpactStats";
import FeaturedStory from "@/components/home/FeaturedStory";
import CareersBand from "@/components/home/CareersBand";
import CtaBand from "@/components/home/CtaBand";

// Homepage — Direction C "Marsal" (approved mockup, 2026-07-22), top to
// bottom: hero carousel → statement band → expertise tiles → industries →
// stats band → insights → careers band → contact CTA. The TransparencyBand +
// Footer come from the root layout.
export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Statement />
      <ExpertiseList />
      <IndustriesGrid />
      <ImpactStats />
      <FeaturedStory />
      <CareersBand />
      <CtaBand />
    </>
  );
}
