import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Details from "@/components/sections/Details";
import Countdown from "@/components/sections/Countdown";
import Blessings from "@/components/sections/Blessings";
import Closing from "@/components/sections/Closing";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <SectionDivider />
      <Story />
      <SectionDivider />
      <Details />
      <SectionDivider />
      <Countdown />
      <SectionDivider />
      <Blessings />
      <SectionDivider />
      <Closing />
    </main>
  );
}
