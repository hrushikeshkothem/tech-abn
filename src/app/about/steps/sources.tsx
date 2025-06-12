import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  SAMPLE_RSS_SOURCES,
  setupSteps,
} from "../aboutUtils";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StepInfo from "./components/stepInfo";

const StepOne = ({
  CurrentIcon,
  selectedSources,
  handleSourceToggle,
}: {
  CurrentIcon: any;
  selectedSources: any;
  handleSourceToggle: any;
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
        stepData={setupSteps[0]}
        subtitle="Choose from our handpicked collection of sources, to get started!"
        title=" Curate Your Perfect Feed"
      />
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2"
      >
        {SAMPLE_RSS_SOURCES.map((source) => (
          <motion.div key={source.id}>
            <Card
              onClick={() => handleSourceToggle(source.id)}
              className={cn(
                `relative cursor-pointer transition-all duration-200 border group overflow-hidden 
       h-24 md:h-36 p-4 md:p-5 flex flex-col justify-between`,
                selectedSources.includes(source.id)
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-600 shadow-lg"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-gray-800 bg-white dark:bg-card"
              )}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${source.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              <div className="flex items-start space-x-4">
                <div className="text-3xl drop-shadow-sm">
                  <img
                    src={source.bannerUrl}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold truncate text-lg text-gray-900 dark:text-gray-100">
                      {source.title}
                    </h4>
                    {selectedSources.includes(source.id) && (
                      <div
                        className={`w-6 h-6 bg-gradient-to-r ${setupSteps[0].color} rounded-full flex items-center justify-center shadow-md`}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {source.subtitle}
                  </p>
                </div>
              </div>
              <div className="mt-1">
                <Badge
                  variant="secondary"
                  className={cn(
                    `text-xs font-medium border-none shadow-sm text-white bg-gradient-to-r`,
                    source.color
                  )}
                >
                  {source.category}
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StepOne;
