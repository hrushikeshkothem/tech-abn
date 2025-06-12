import { motion } from "framer-motion";
import { itemVariants } from "../../aboutUtils";

type PropTypes = {
    stepData: { title:string, color: string },
    CurrentIcon: any,
    title: string,
    subtitle: string
}

const StepInfo = ({ stepData, CurrentIcon, title, subtitle }: PropTypes) => {
  return (
    <motion.div variants={itemVariants} className="text-center space-y-4">
      <div className="relative">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${stepData.color} rounded-full blur-xl opacity-20 animate-pulse`}
        />
        <div
          className={`relative w-20 h-20 mx-auto bg-gradient-to-r ${stepData.color} rounded-2xl flex items-center justify-center shadow-xl`}
        >
          <CurrentIcon className="h-10 w-10 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <motion.h3
          variants={itemVariants}
          className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
        >
          {title}
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400 text-lg"
        >
          {subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default StepInfo;
