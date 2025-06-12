import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

 const InteractiveLayout = ({
    handleUndo,
    handleSwipeLeft,
    handleSwipeRight,
    handleSwipeUp,
    rssItemslength,
    children
 }:{
    handleUndo: () => void,
    handleSwipeLeft: () => void,
    handleSwipeRight: () => void,
    handleSwipeUp: () => void,
    rssItemslength: number,
    children: ReactNode
 }) => {

    const OnScreenControls = () => {
      return (
        <>
          <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200"
            >
              <ChevronUp className="w-5 h-5 text-gray-700" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwipeLeft}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </Button>
          </div>

          <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwipeUp}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200"
            >
              <ChevronUp className="w-5 h-5 text-gray-700" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwipeRight}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </>
      );
    };

    const OnScreenControlsMobile = () => {
      return (
        <div className="flex lg:hidden gap-6 mt-8 z-20">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSwipeLeft}
            className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
          >
            Pass
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleUndo}
            className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600"
          >
            Undo
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleSwipeRight}
            className="bg-green-50 hover:bg-green-100 border-green-200 text-green-600"
          >
            Save
          </Button>
        </div>
      );
    };

    const Steper = () => {
      return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 hidden lg:flex">
          {Array.from({ length: Math.min(5, rssItemslength) }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === 0 ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      );
    };

    return (
      <div className="max-w-[90vw] ml-[5vw] mr-[5vw] lg:max-w-[100vw] flex-grow flex flex-1">
        <div className="w-full flex flex-col items-center justify-center mb-8 min-h-[75vh] relative">
          <OnScreenControls />
          <div className="relative w-full max-w-md  h-[500px] mt-5 lg:mt-0  lg:h-[600px] flex items-center justify-center">
            <AnimatePresence>
            {children}
            </AnimatePresence>
          </div>
          <OnScreenControlsMobile />
          <Steper />
          <div className="hidden lg:block absolute bottom-4 right-4 text-xs text-gray-500">
            <div>Swipe • ← Pass • → Save • Enter Open</div>
          </div>
        </div>
      </div>
    );
  };

export default InteractiveLayout;