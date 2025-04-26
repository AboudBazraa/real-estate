import TextPressure from "@/shared/components/animation/TextPressure";
import ShinyText from "@/shared/components/animation/ShinyText";
import Squares from "@/shared/components/animation/Squares";

const SectionAnmation = () => {
  return (
    <>
      <div className="w-full h-full flex relative">
        <div className="h-full w-3/5 z-10">
          <div className="h-full w-full absolute top-0 z-0 flex flex-col justify-center">
            <div className="w-full h-full flex">
              <TextPressure text="Empower!" />
            </div>

            <ShinyText
              text="Your Real Estate Journey"
              disabled={false}
              speed={5}
              className=" mb-10 ml-5 text-3xl italic tracking-widest"
            />

            {/* <p className="text-xl font-bold text-white z-30 p-3">
                Whether you’re an admin behind the scenes, an agent on the front
                lines, or a home-seeker on the go, our platform simplifies every
                step. From managing listings to discovering dream homes, we’ve got
                you covered.
              </p> */}
          </div>
        </div>
        <div className="h-full w-full rounded-3xl p-2">
          <Squares
            speed={0.5}
            squareSize={40}
            direction="diagonal" // up, down, left, right, diagonal
            borderColor="#fff"
            hoverFillColor="#222"
          />
        </div>
      </div>
    </>
  );
};

export default SectionAnmation;
