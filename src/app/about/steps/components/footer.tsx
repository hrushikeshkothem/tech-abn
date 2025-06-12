import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setupSteps } from "../../aboutUtils";
const NavigationFooter = ({
  currentStep,
  handlePrevStep,
  handleNextStep,
}: {
  currentStep: any;
  handlePrevStep: any;
  handleNextStep: any;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex justify-between items-center pt-6 border-t border-gray-300 dark:border-gray-700"
    >
      <Button
        variant={"outline"}
        onClick={handlePrevStep}
        disabled={currentStep === 0}
        className={`${currentStep === 0 ? "!cursor-none" : "!cursor-pointer"}`}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      <div className="flex space-x-2">
        {setupSteps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index <= currentStep ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <Button
        onClick={handleNextStep}
        className={`cursor-pointer  bg-gradient-to-r ${setupSteps[currentStep].color}  text-white hover:shadow-lg transition-all duration-200`}
      >
        <span>
          {currentStep === setupSteps.length - 1 ? "Complete" : "Next"}
        </span>
        <ChevronRight className="h-4 w-4 cursor-pointer" />
      </Button>
    </motion.div>
  );
};

export default NavigationFooter;
