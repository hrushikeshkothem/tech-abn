import { Card, CardContent } from "@/components/ui/card";
import { containerVariants, setupSteps, THEMES } from "../aboutUtils";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import StepInfo from "./components/stepInfo";

const StepTwo = ({
  CurrentIcon,
  selectedTheme,
  setSelectedTheme,
}: {
  CurrentIcon: any;
  selectedTheme: any;
  setSelectedTheme: any;
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
        stepData={setupSteps[1]}
        subtitle="Your Perfect Aesthetic"
        title="Choose a theme that resonates with your style"
      />
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {THEMES.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 ease-in-out group relative overflow-hidden rounded-2xl border ${
                selectedTheme === theme.id
                  ? "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-purple-400 shadow-xl"
                  : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:border-indigo-300 hover:shadow-lg"
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
              />

              <CardContent className="p-6 text-center relative z-10">
                <motion.div
                  className="text-4xl mb-4 filter drop-shadow"
                  animate={{
                    rotate: selectedTheme === theme.id ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {theme.icon}
                </motion.div>
                <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
                  {theme.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {theme.description}
                </p>
                <div
                  className={`w-full h-12 rounded-lg ${theme.preview} shadow-inner border border-gray-300 dark:border-gray-700 mb-6`}
                />
                <AnimatePresence>
                  {selectedTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className={`absolute top-0 right-4 w-8 h-8 bg-gradient-to-r ${setupSteps[1].color} rounded-full flex items-center justify-center shadow-lg mx-auto`}
                    >
                      <Check className="h-6 w-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StepTwo;
