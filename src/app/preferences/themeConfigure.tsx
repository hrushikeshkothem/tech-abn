import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";

const THEMES = [
  {
    id: "light",
    name: "Light",
    icon: Sun,
    description: "Clean and bright interface",
    preview: "bg-white border-gray-200",
  },
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
    description: "Easy on the eyes",
    preview: "bg-gray-900 border-gray-700",
  },
  {
    id: "system",
    name: "System",
    icon: Monitor,
    description: "Follow system preference",
    preview: "bg-gradient-to-br from-white to-gray-900",
  },
];

const ThemeConfigure = ({
  preferences,
  updatePreference,
}: {
  preferences: {
    theme: string;
    feedbackAudio: boolean;
    proxyServer: string;
    retentionPeriod: string;
    relaxationTime: string;
  };
  updatePreference: (key: string, value: any) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {THEMES.map((theme) => {
        const IconComponent = theme.icon;
        return (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                preferences.theme === theme.id
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 -translate-y-3.5"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => updatePreference("theme", theme.id)}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-16 h-10 mx-auto mb-3 rounded border-2 ${theme.preview}`}
                />
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="h-4 w-4 mr-2" />
                  <span className="font-medium">{theme.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {theme.description}
                </p>
                {preferences.theme === theme.id && (
                  <Badge className="mt-2" variant="outline">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ThemeConfigure;
