import { motion } from "framer-motion";
import { setupSteps } from "../../aboutUtils";
import { Check } from "lucide-react";

const StepsHeader = ({ currentStep }: { currentStep: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center justify-between mb-8 px-4"
    >
      {setupSteps.map((step, index) => (
        <div key={index} className="flex items-center space-x-4">
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                index <= currentStep
                  ? `bg-gradient-to-r ${step.color} text-white shadow-xl`
                  : "bg-gray-200 text-gray-500 shadow-md"
              }`}
            >
              {index < currentStep ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  <Check className="h-6 w-6" />
                </motion.div>
              ) : (
                <step.icon className="h-6 w-6" />
              )}
            </div>
            {index <= currentStep && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-lg opacity-20 animate-pulse`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
          <div className="hidden md:block">
            <motion.p
              className={`text-sm font-medium transition-colors duration-300 ${
                index <= currentStep
                  ? "text-gray-800 dark:text-gray-200"
                  : "text-gray-400 dark:text-gray-400"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.4 + index * 0.1,
              }}
            >
              {step.title}
            </motion.p>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default StepsHeader;
