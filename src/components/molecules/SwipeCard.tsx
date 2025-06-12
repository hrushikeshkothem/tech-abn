import useCustomSound from "@/hooks/useCustomSound";
import type { NewsItem } from "@/storage/types";
import { motion, type PanInfo } from "framer-motion";
import { useState } from "react";

const SwipeCard = ({
  item,
  currentIndex,
  index,
  zIndex,
  handleSwipeRight,
  handleSwipeLeft,
  handleSwipeUp
}:{
  item: NewsItem,
  currentIndex: number,
  index: number,
  zIndex: number,
  handleSwipeRight: () => void,
  handleSwipeLeft: () => void,
  handleSwipeUp: () => void
}) => {
  const [lastTapTime, setLastTapTime] = useState(0);
  const [play] = useCustomSound();
  const isTop = index === 0;
  const scale = 1 - index * 0.05;
  const yOffset = index * 10;

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = 500;
    if (
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.velocity.x) > velocity
    ) {
      play({ id: "swipe" });
      if (info.offset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    } else if (
      Math.abs(info.offset.y) > threshold ||
      Math.abs(info.velocity.y) > velocity
    ) {
      if (info.offset.y < 0) {
        handleSwipeUp();
      }
    }
  };
  return (
    <motion.div
      key={`${item.id}-${currentIndex + index}`}
      style={{ zIndex }}
      initial={{
        scale: scale - 0.1,
        y: yOffset + 50,
        opacity: 0,
        rotateY: 15,
      }}
      animate={{
        scale,
        y: yOffset,
        opacity: Math.max(0, 1 - index * 0.3),
        rotateY: index * 2,
      }}
      exit={{
        x: 0,
        y: -1000,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileDrag={
        isTop
          ? {
              scale: 1.05,
              rotateZ: 0,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }
          : {}
      }
      onTap={(event) => {
        if (!isTop) return;
        const now = Date.now();
        const timeSinceLastTap = now - (lastTapTime || 0);
        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          event.preventDefault();
          const url = item.link;
          if (url) {
            window.open(url);
          }
        }
        setLastTapTime(now);
      }}
      className={`absolute w-full h-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing ${
        isTop ? "shadow-2xl" : "shadow-lg"
      } ${index > 0 ? "pointer-events-none" : ""}`}
    >
      <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-600 border border-gray-200 dark:border-gray-800">
        <div className="h-1/3 relative overflow-hidden">
          <img
            src={
              item.thumbnail || item?.enclosure?.url || item.banner_image_url
            }
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/400/300";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="h-2/3 p-6 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-6 lg:line-clamp-10 mb-2">
              {item.description.replace(/<[^>]*>/g, "")}
            </p>
            <a href={item.link} className={"text-primary"} > Read More ... </a>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500">
              {new Date(item.pubDate).toDateString()}
            </span>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-green-400 dark:bg-green-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-400 dark:bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
        {isTop && (
          <>
            <motion.div
              className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-lg font-bold opacity-0"
              animate={{ opacity: 0 }}
            >
              PASS
            </motion.div>
            <motion.div
              className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-lg font-bold opacity-0"
              animate={{ opacity: 0 }}
            >
              LIKE
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;
