import { motion } from "framer-motion";
import {
  AdvancedOptions,
  containerVariants,
  itemVariants,
  setupSteps,
} from "../aboutUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StepInfo from "./components/stepInfo";

const StepFour = ({
  CurrentIcon,
  advancedOptions,
  setAdvancedOptions,
}: {
  CurrentIcon: any;
  advancedOptions: any;
  setAdvancedOptions: any;
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <StepInfo
        CurrentIcon={CurrentIcon}
        stepData={setupSteps[3]}
        subtitle="Fine-tune Everything"
        title="Configure advanced settings for optimal performance"
      />

      <motion.div
        variants={itemVariants}
        className="space-y-6 max-w-md mx-auto"
      >
        {AdvancedOptions.map((field) => (
          <motion.div
            key={field.key}
            variants={itemVariants}
            className="space-y-3"
          >
            <Label
              htmlFor={field.key}
              className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 font-medium"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-sm">
                <field.icon className="h-4 w-4 text-white" />
              </div>
              <span>{field.label}</span>
            </Label>
            <Input
              id={field.key}
              type={field.type}
              min={field.min}
              max={field.max}
              placeholder={field.placeholder}
              value={advancedOptions[field.key]}
              onChange={(e) =>
                setAdvancedOptions((prev: any) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
              className="border-2 border-gray-200 dark:border-gray-800  focus:border-orange-400 focus:ring-orange-400 focus:ring-2 focus:ring-opacity-20 transition-all duration-200 rounded-xl h-12"
            />
            {field.key === "relaxationTime" && (
              <p className="text-xs text-gray-500 ml-11 leading-relaxed">
                Prevents overwhelming Proxy servers with too frequent requests
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StepFour;
