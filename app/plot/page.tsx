import { ArcPlot } from "@/components/arc-plot";
import casinoRoyaleData from "@/data/story/casino-royale.json";

export default function PlotPage() {
  const storyPoints = casinoRoyaleData.timeline.map(scene => ({
    title: scene.title,
    structure: scene.structure,
    intensity: scene.intensity
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Story Arc Analysis</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ArcPlot
          title={casinoRoyaleData.metadata.title}
          storyPoints={storyPoints}
        />
      </div>
    </div>
  );
} 