import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AnimatedBeam, type BeamSequenceConfig } from "@/components/ui/beam";
import { howItWorks } from "./aboutUtils";
import { Separator } from "@/components/ui/separator";
import { cx } from "class-variance-authority";
import useCustomSound from "@/hooks/useCustomSound";

export function HowItWorksSmooth() {
  const myBeamSequence:BeamSequenceConfig = {
    delays: [
      0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.2, 4.5,
      4.8, 5.1, 5.4, 5.7, 6.0, 6.3, 6.6, 6.9,
    ],
    duration: 7,
    colorPatterns: [["#4D96FF", "#6BCB77"]],
    beamsPerColorGroup: 1,
    beamLength: 0.01,
    width: 2,
    opacity: 0.8,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);

  const div1Hz = useRef<HTMLDivElement>(null);
  const div2Hz = useRef<HTMLDivElement>(null);
  const div3Hz = useRef<HTMLDivElement>(null);
  const div4Hz = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative max-w-6xl mx-auto py-10 px-6 flex flex-col w-full"
    >
      {howItWorks.map((step, index) => {
        const isLeft = index % 2 === 0;
        const refProp =
          index === 0
            ? div1Ref
            : index === 1
            ? div2Ref
            : index === 2
            ? div3Ref
            : div4Ref;

        const refHzProp =
          index === 0
            ? div1Hz
            : index === 1
            ? div2Hz
            : index === 2
            ? div3Hz
            : div4Hz;

        return (
          <div className="flex flex-row w-full">
            {!isLeft && (
              <div
                ref={refHzProp}
                className=" md:w-[50%] mb-8  hidden lg:flex"
              ></div>
            )}
            <div
              key={index}
              ref={refProp}
              className={`mb-8 w-[100%] lg:w-[50%] z-10 p-0 md:p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]' ${
                !isLeft ? "ml-auto" : ""
              }`}
            >
              <Card className={`flex flex-col p-4`}>
                <div className="flex flex-row items-center gap-3">
                  {step.Icon}
                  <h3 className="text-3xl font-bold">{step.title}</h3>
                </div>
                <Separator />
                {step.description}
              </Card>
            </div>
            {isLeft && (
              <div ref={refHzProp} className="w-[50%]  mb-8 hidden lg:flex">
                {" "}
              </div>
            )}
          </div>
        );
      })}

      <AnimatedBeam
        className="hidden lg:flex"
        containerRef={containerRef as React.RefObject<HTMLElement>}
        fromRefs={[
          div1Ref as React.RefObject<HTMLElement>,
          div1Hz as React.RefObject<HTMLElement>,
          div2Ref as React.RefObject<HTMLElement>,
          div2Hz as React.RefObject<HTMLElement>,
          div3Ref as React.RefObject<HTMLElement>,
          div3Hz as React.RefObject<HTMLElement>,
          div4Ref as React.RefObject<HTMLElement>,
        ]}
        beamSequence={myBeamSequence}
        basePathVisible={true}
        basePathColor={"#00aaff"}
      />
    </section>
  );
}

export function FeatureGridInteractive({
  items,
}: {
  items: { Icon: React.ReactNode; title: string; description: string }[];
}) {
  const [play] = useCustomSound();
  return (
    <div className="w-[95%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 my-8">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className="rounded-2xl shadow-lg cursor-pointer select-none"
          whileHover={{ scale: 1.07, rotateX: 5, rotateY: 10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          style={{ perspective: 1000 }}
          onHoverStart={() => {
            play({ id: "swipe" });
          }}
        >
          <Card className="flex flex-col items-center text-center px-4 h-full">
            <div className="text-primary">{item.Icon}</div>
            <h3 className="text-md lg:text-xl font-semibold">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export const DescriptiveItem = ({
  src,
  alt,
  title,
  description,
}: {
  src: string;
  alt: string;
  title: string;
  description: string;
}) => {
  const [play] = useCustomSound();
  const variants = {
    initial: {
      titleY: 0,
      descY: 10,
      descOpacity: 0,
      backdropFilter: "blur(0px)",
    },
    hover: {
      titleY: -20,
      descY: 0,
      descOpacity: 1,
      backdropFilter: "blur(6px)",
    },
  };

  return (
    <motion.div
      className="relative w-full h-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={variants}
      onHoverStart={() => {
        play({ id: "hover" });
      }}
    >
      <motion.img
        alt={alt}
        src={src}
        className="w-full h-full object-cover overflow-hidden rounded-lg  brightness-[0.5]  dark:brightness-[0.3]"
        variants={variants}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
        <motion.p
          className="text-xl lg:text-3xl font-extrabold drop-shadow-lg mb-[20px] md:mb-0"
          variants={{
            initial: { y: 20 },
            hover: { y: -20 },
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {title}
        </motion.p>

        <motion.p
          className="mt-1 text-lg hidden  md:flex font-medium max-w-[400px] text-white"
          variants={{
            initial: { opacity: 0, y: 10 },
            hover: { opacity: 0.7, y: 0 },
          }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export const SectionHeader = ({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <>
      <h2 className={cx("text-4xl font-bold text-center mt-16", className)}>
        {title}
      </h2>
      <p className="text-center text-muted-foreground mb-6 max-w-xl mx-auto px-4">
        {description}
      </p>
    </>
  );
};
