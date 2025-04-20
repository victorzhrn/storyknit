import { TextReveal } from "@/components/magicui/text-reveal";
import { Vortex } from "@/components/ui/vortex";

export default function Home() {
  // redirect('/arc/casino-royale') // Removed redirect

  const mockQuote =
    "Story isn't a flight from the reality but a vehicle that caries us on our search for reality, our best effort to make sense out of the anarchy of existence.";

  return (
    <main>
      <Vortex
        backgroundColor="#000000"
        containerClassName="fixed inset-0 w-full h-screen z-0"
        rangeY={800}
        particleCount={40}
        baseHue={80}
        rangeSpeed={0.2}
      />
      <div className="relative z-10 flex justify-center">
        <TextReveal className="w-full max-w-6xl">
          {mockQuote}
        </TextReveal>
      </div>
    </main>
  );
}
