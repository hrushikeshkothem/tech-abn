import { FileText, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { setupSteps } from "../../aboutUtils";
import useCustomSound from "@/hooks/useCustomSound";

const FileUplaodComp = ({
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileChange,
  importedFile,
  setImportedFile,
  handleConfiguration,
  handleFileSelect,
}: {
  dragActive: any;
  handleDrag: any;
  handleDrop: any;
  fileInputRef: any;
  handleFileChange: any;
  importedFile: any;
  setImportedFile: any;
  handleConfiguration: any;
  handleFileSelect: any;
}) => {
  const [play] = useCustomSound();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <Upload className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Import Configuration
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your existing TABN configuration file
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {importedFile ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {importedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(importedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => {
                  play({ id: "swipe" });
                  setImportedFile(null);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <button
              onClick={handleConfiguration}
              className={`px-6 py-3 cursor-pointer bg-gradient-to-r  ${setupSteps[0].color}  text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
            >
              Import Configuration
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <FileText className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Drop your configuration file here
              </p>
              <p className="text-gray-500 dark:text-gray-400">or</p>
              <button
                onClick={handleFileSelect}
                className={`px-6 py-3 bg-gradient-to-r ${setupSteps[0].color}  text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
              >
                Browse Files
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supports JSON configuration files only
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileUplaodComp;
