import { cn } from "@/lib/utils"; 
import { type RefObject, useEffect, useId, useState, useMemo } from "react";
import { motion } from "framer-motion";
export interface BeamSequenceConfig {
  delays: number[]; 
  duration: number;
  colorPatterns: [string, string][]; 
  beamLength?: number;  
  width?: number; 
  opacity?: number;   
  beamsPerColorGroup?: number;
}

interface ProcessedBeam {
  gradientId: string;
  colors: [string, string];
  duration: number;
  delay: number;
  beamLength: number;
  width: number;
  opacity: number;
}

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement>; 
  fromRefs: RefObject<HTMLElement>[];
  curvature?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  spacing?: number;
  keepLast?: boolean;
  beamSequence: BeamSequenceConfig;
  basePathVisible?: boolean;
  basePathColor?: string;
  basePathWidth?: number;
  basePathOpacity?: number;
  basePathDotted?: boolean;
  basePathDotSpacing?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRefs,
  curvature = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  spacing = 0,
  keepLast = false,
  beamSequence,
  basePathVisible = false,
  basePathColor = "gray",
  basePathWidth = 2,
  basePathOpacity = 0.1,
  basePathDotted = false,
  basePathDotSpacing = 6,
}) => {
  const [paths, setPaths] = useState<string>("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const uniqueIdPrefix = useId();
  const processedBeams: ProcessedBeam[] = useMemo(() => {
    if (!beamSequence || !beamSequence.delays || !beamSequence.colorPatterns || beamSequence.colorPatterns.length === 0) {
      return [];
    }

    const {
      delays,
      colorPatterns,
      duration,
      beamLength = 0.01,
      width = 2,
      opacity = 0.8,
      beamsPerColorGroup,
    } = beamSequence;

    return delays.map((delay, index) => {
      let colorPatternIndex: number;
      if (beamsPerColorGroup && beamsPerColorGroup > 0) {
        colorPatternIndex = Math.floor(index / beamsPerColorGroup) % colorPatterns.length;
      } else {
        colorPatternIndex = index % colorPatterns.length;
      }
      const colors = colorPatterns[colorPatternIndex];

      return {
        colors: colors,
        duration: duration,
        delay: delay,
        beamLength: beamLength,
        width: width,
        opacity: opacity,
        gradientId: `${uniqueIdPrefix}-gradient-${index}`,
      };
    });
  }, [beamSequence, uniqueIdPrefix]);

  useEffect(() => {
    const updatePaths = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const svgWidth = containerRect.width;
      const svgHeight = containerRect.height;
      setSvgDimensions({ width: svgWidth, height: svgHeight });

      const endIndex = keepLast ? fromRefs.length : fromRefs.length - 1;
      if (endIndex <= 0 || (fromRefs.length < 2 && !keepLast)) {
        setPaths("");
        return;
      }

      let pathD = "";
      for (let i = 0; i < endIndex; i++) {
        const refA = fromRefs[i]?.current;
        const refB = fromRefs[i + 1]?.current;

        if (!refA) continue;
        if (i + 1 >= fromRefs.length && !keepLast) continue;

        const rectA = refA.getBoundingClientRect();
        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;

        if (i === 0) {
          pathD += `M ${startX},${startY} `;
        }

        if (refB) {
          const rectB = refB.getBoundingClientRect();
          const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
          const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;
          const controlX = (startX + endX) / 2;
          const controlY = (startY + endY) / 2 - curvature;
          pathD += `Q ${controlX},${controlY} ${endX},${endY} `;
        } else if (keepLast && i === fromRefs.length - 1) {
          pathD += `l ${spacing},0 `;
        }
      }
      setPaths(pathD.trim());
    };

    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updatePaths));
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      updatePaths();
    }
    return () => {
      if (containerRef.current) resizeObserver.unobserve(containerRef.current);
      resizeObserver.disconnect();
    };
  }, [containerRef, fromRefs, curvature, startXOffset, startYOffset, endXOffset, endYOffset, spacing, keepLast]);

  const baseStrokeDasharray = basePathDotted ? `${basePathDotSpacing} ${basePathDotSpacing}` : "none";

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute left-0 top-0 transform-gpu", className)}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      style={svgDimensions.width === 0 || svgDimensions.height === 0 ? { display: 'none' } : {}}
    >
      <defs>
        {processedBeams.map((beam) => (
          <linearGradient
            key={beam.gradientId}
            id={beam.gradientId}
            x1="0%"
            y1="0%"
            x2="100%" 
            y2="0%"
          >
            <stop offset="0%" stopColor={beam.colors[0]} />
            <stop offset="100%" stopColor={beam.colors[1]} />
          </linearGradient>
        ))}
      </defs>

      {basePathVisible && paths && (
        <path
          d={paths}
          stroke={basePathColor}
          strokeWidth={basePathWidth}
          strokeOpacity={basePathOpacity}
          strokeLinecap="round"
          strokeDasharray={baseStrokeDasharray}
        />
      )}

      {paths && processedBeams.map((beam) => {
        const gapLength = 1 - beam.beamLength;
        return (
          <motion.path
            key={beam.gradientId}
            d={paths}
            fill="none"
            stroke={`url(#${beam.gradientId})`}
            strokeWidth={beam.width}
            strokeOpacity={beam.opacity}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${beam.beamLength} ${gapLength}`}
            initial={{ strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: -beam.beamLength }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        );
      })}
    </svg>
  );
};