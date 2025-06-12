import { Rss, Clock } from "lucide-react";
import { INTERVALOPTIONS } from "@/utils/constants";

const EmptyState = ({
  selectedSources,
  selectedInterval,
}: {
  selectedSources: string[];
  selectedInterval: string;
}) => {
  const intervalLabel =
    INTERVALOPTIONS.find((opt) => opt.value === selectedInterval)?.label ||
    selectedInterval;

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800/30">
            <Rss className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
            <Clock className="w-3 h-3 text-orange-500 dark:text-orange-400" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            No new updates
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              No fresh content found for the past{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {intervalLabel.toLowerCase()}
              </span>
              {selectedSources.length > 0 && (
                <>
                  {" "}
                  from{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {selectedSources.length} selected source
                    {selectedSources.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Try refreshing or adjusting your time range and source filters
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            💡 Try expanding your time range or selecting more sources above
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
