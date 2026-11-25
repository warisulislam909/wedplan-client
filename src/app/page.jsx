import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChoose from "@/components/home/WhyChoose";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedServices />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}
