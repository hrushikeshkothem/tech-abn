import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, setupSteps, SoundOptions } from "../aboutUtils";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StepInfo from "./components/stepInfo";

const StepThree = ({
  CurrentIcon,
  feedbackAudio,
  setFeedbackAudio,
}: {
  CurrentIcon: any;
  feedbackAudio: any;
  setFeedbackAudio: any;
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
        stepData={setupSteps[2]}
        subtitle="Sonic Experience"
        title="Add sounds to your interactions"
      />

      <div className="flex flex-col md:flex-row gap-4 justify-center md:space-x-8">
        {SoundOptions.map((option) => (
          <motion.div
            key={option.enabled + ""}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 group relative overflow-hidden max-w-[250px] ml-auto mr-auto  md:max-w-auto  min-w-48 ${
                feedbackAudio === option.enabled
                  ? "ring-2 ring-offset-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950  border-green-200 dark:border-green-800 shadow-xl"
                  : "hover:border-gray-300 dark:hover:border-gray-700  hover:shadow-lg border-gray-200 dark:border-gray-800"
              }`}
              onClick={() => setFeedbackAudio(option.enabled)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <CardContent className="p-8 text-center relative">
                <motion.div
                  animate={{
                    scale: feedbackAudio === option.enabled ? [1, 1.2, 1] : 1,
                    rotate:
                      feedbackAudio === option.enabled ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <option.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2">
                  {option.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {option.subtitle}
                </p>
                <AnimatePresence>
                  {feedbackAudio === option.enabled && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className={`absolute top-0 right-4 w-8 h-8 bg-gradient-to-r ${setupSteps[2].color} rounded-full flex items-center justify-center shadow-lg mx-auto`}
                    >
                      <Check className="h-6 w-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StepThree;
