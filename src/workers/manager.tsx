import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Info, CheckCircle, Loader2 } from "lucide-react";
import {
  dequeueJob,
  isQueueEmpty,
  peekJob,
  setQueueUpdateCallback,
} from "@/lib/jobQueue";
import useCustomSound from "@/hooks/useCustomSound";

const WorkerManager = ({
  onCompleteHandle,
}: {
  onCompleteHandle?: () => void;
}) => {
  const WorkerRef = useRef<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [title, setTitle] = useState("");
  const [play] = useCustomSound();

  const processingRef = useRef(false);

  const processNextJob = () => {
    if (processingRef.current) {
      console.log("Already processing a job, skipping...");
      return;
    }

    const job = peekJob();
    console.log("Processing job:", job);

    if (!job) {
      processingRef.current = false;
      setSyncing(false);
      return;
    }

    processingRef.current = true;
    setSyncing(true);

    const workerProvider = job.worker;
    WorkerRef.current = workerProvider.init();
    const handler = WorkerRef.current;

    if (!handler) {
      processingRef.current = false;
      return;
    }

    setIsComplete(false);
    setTitle(job.job.titlePending);
    setProgress(0);

    handler.onmessage = (event) => {
      const data = event.data;
      const { percent, statusText, isComplete } =
        workerProvider.progressHandler(data);
      setProgress(percent);
      setStatusText(statusText);

      if (isComplete) {
        setTitle(job.job.titleFinished);
        play({ id: "hover" });
        setIsComplete(true);
        if (onCompleteHandle !== undefined) onCompleteHandle();

        setTimeout(() => {
          const refreshCheck =
            job.job.extraParams.refresh === undefined
              ? true
              : job.job.extraParams.refresh;
          if (
            job.job.workerKey === "dataImporter" ||
            (job.job.workerKey === "syncOnOpen" && refreshCheck)
          ) { 
            window.location.reload();
          }
          dequeueJob();
          processingRef.current = false;
          if (!isQueueEmpty()) {
            processNextJob();
          } else {
            setSyncing(false);
          }
        }, 2000);
      }
    };

    workerProvider.run({ workHandler: handler, ...job.job.extraParams });
  };

  useEffect(() => {
    const queueCallback = () => {
      console.log("Queue updated, checking for jobs...");
      if (!processingRef.current && !isQueueEmpty()) {
        processNextJob();
      }
    };

    setQueueUpdateCallback(queueCallback);
    if (!processingRef.current && !isQueueEmpty()) {
      processNextJob();
    }

    return () => {
      if (WorkerRef.current) {
        WorkerRef.current.onmessage = null;
        WorkerRef.current.terminate?.();
      }
      processingRef.current = false;
    };
  }, []);

  if (!syncing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.5,
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div
          className="relative 
          bg-white dark:bg-gradient-to-br dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 
          backdrop-blur-xl 
          rounded-2xl 
          border border-gray-300 dark:border-slate-700/50 
          shadow-xl dark:shadow-2xl 
          p-6 w-80"
        >
          <div
            className="absolute inset-0 
            bg-gradient-to-r 
            from-blue-100/30 via-purple-100/30 to-cyan-100/30 
            dark:from-blue-500/10 dark:via-purple-500/10 dark:to-cyan-500/10 
            rounded-2xl 
            animate-pulse"
          />
          <motion.div
            className="flex items-center justify-between mb-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: isComplete ? 0 : 360,
                  scale: isComplete ? 1.1 : 1,
                }}
                transition={{
                  rotate: {
                    duration: 2,
                    repeat: isComplete ? 0 : Infinity,
                    ease: "linear",
                  },
                  scale: { duration: 0.3 },
                }}
                className="relative"
              >
                {!isComplete && (
                  <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </motion.div>
              {isComplete && (
                <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
              )}
              <div>
                <h3 className="text-gray-800 dark:text-white font-semibold text-sm">
                  {title}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-xs">
                  {isComplete ? "All done!" : "Processing..."}
                </p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-lg 
                    hover:bg-gray-100 dark:hover:bg-slate-700/50 
                    transition-colors"
                >
                  <Info
                    size={16}
                    className="text-gray-500 dark:text-slate-400 dark:hover:text-slate-300 hover:text-gray-700"
                  />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="text-sm w-auto 
                  bg-white border border-gray-300 text-gray-800 
                  dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                {statusText}
              </PopoverContent>
            </Popover>
          </motion.div>
          <div className="relative z-10">
            <div className="relative mb-3">
              <div className="h-3 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full 
                    bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 
                    dark:from-blue-500 dark:via-purple-500 dark:to-cyan-500 
                    rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    duration: 0.8,
                  }}
                >
                  <div
                    className="absolute inset-0 
                    bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    -skew-x-12 animate-shimmer"
                  />
                </motion.div>
              </div>
            </div>
            <motion.div
              className="flex justify-between items-center text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-gray-500 dark:text-slate-400">
                {isComplete ? "Completed" : "In Progress"}
              </span>
              <motion.span
                className={`font-mono font-semibold ${
                  isComplete
                    ? "text-green-500 dark:text-green-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
                animate={{ scale: progress % 10 === 0 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkerManager;
