import TextPressure from "@/shared/components/animation/TextPressure";
import ShinyText from "@/shared/components/animation/ShinyText";
import Squares from "@/shared/components/animation/Squares";

const SectionAnmation = () => {
  return (
    <>
      <div className="w-full flex relative h-full">
        <div className="h-full w-3/5 z-10">
          <div className="h-full w-full absolute top-1/2 z-0 flex flex-col justify-center items-end">
            <div className="w-full h-full flex p-5 items-end">
              <TextPressure text="aAbBoOuUtT_UuSs" minFontSize={12} />
            </div>
          </div>
        </div>
        <div className="h-full w-full rounded-3xl p-2">
          <Squares
            speed={0.5}
            squareSize={40}
            direction="diagonal" // up, down, left, right, diagonal
            borderColor="#27272a"
            hoverFillColor="#222"
          />
        </div>
      </div>
    </>
  );
};

export default SectionAnmation;
