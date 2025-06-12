import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Volume2,
  VolumeX,
  Save,
  Zap,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useTheme } from "../../utils/themeProvider";
import useCustomSound from "@/hooks/useCustomSound";
import { storage } from "@/storage/main";
import Box from "./layout";
import ThemeConfigure from "./themeConfigure";
import SoundConfigure from "./soundConfigure";
import ServerConfigure from "./serverConfigure";
import ResetConfigure from "./resetConfigure";
import { serverConfigSchema } from "@/utils/formSchemes";

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    theme: "system",
    feedbackAudio: true,
    proxyServer: "",
    retentionPeriod: "30",
    relaxationTime: "5",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [play] = useCustomSound();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const audio =
        (await storage.getGenericItem("tabn-ui-sound")) === "false"
          ? false
          : true;
      const advanced = await storage.getAdvancedOptions();

      setPreferences({
        theme,
        feedbackAudio: audio,
        proxyServer: advanced.server || "",
        retentionPeriod: advanced.retention || "30",
        relaxationTime: advanced.relaxation || "1",
      });
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast({
        title: "Error Loading Preferences",
        description: "Using default settings.",
        variant: "destructive",
      });
    }
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    setIsLoading(true);
    const result = serverConfigSchema.safeParse({
      proxyServer: preferences.proxyServer,
      retentionPeriod: parseFloat(preferences.retentionPeriod),
      relaxationTime: parseFloat(preferences.relaxationTime),
    });

    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast({
          title: "Invalid Preferences",
          description: err.message,
          variant: "destructive",
        });
      });
      setIsLoading(false)
      return;
    }
    try {
      setTheme(preferences.theme as "dark" | "light" | "system");
      await storage.setGenericItem(
        "tabn-ui-sound",
        preferences.feedbackAudio.toString()
      );
      await storage.setAdvancedOptions(
        preferences.proxyServer,
        preferences.retentionPeriod,
        preferences.relaxationTime
      );
      setHasChanges(false);
      toast({
        title: "Preferences Saved",
        description: "Your settings have been updated successfully.",
      });
      play({ id: "hover" });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error Saving Preferences",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col flex-1 grow max-w-[100vw]">
      <Separator />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Box
            title="Appearance"
            subTitle="Choose your preferred theme"
            icon={<Palette className={`h-6 w-6 text-blue-500`} />}
            color={
              "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
            }
          >
            <ThemeConfigure
              preferences={preferences}
              updatePreference={updatePreference}
            />
          </Box>
          <Box
            title="Audio Feedback"
            subTitle="Control sound effects and notifications"
            icon={
              preferences.feedbackAudio ? (
                <Volume2 className="h-6 w-6 text-green-500" />
              ) : (
                <VolumeX className="h-6 w-6 text-gray-500" />
              )
            }
            className="!pt-0"
            color="from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
          >
            <SoundConfigure
              preferences={preferences}
              updatePreference={updatePreference}
            />
          </Box>
          <Box
            title="Advanced Options"
            subTitle="Configure network and performance settings"
            color="from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
            icon={<Zap className="h-6 w-6 text-orange-500" />}
            className="p-6 space-y-6 !pt-0"
          >
            <ServerConfigure
              preferences={preferences}
              updatePreference={updatePreference}
            />
          </Box>
          <Box
            title="Danger Zone"
            subTitle="Irreversible actions - proceed with caution"
            color="from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20"
            icon={<Shield className="h-6 w-6 text-red-500" />}
            className="p-6 !pt-0"
            cardClassName="!border-red-200 dark:!border-red-800"
          >
            <ResetConfigure
              setHasChanges={setHasChanges}
              setPreferences={setPreferences}
            />
          </Box>
        </div>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={savePreferences}
              disabled={isLoading}
              className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </motion.div>
        )}
        <Separator className="my-8" />
      </div>
    </div>
  );
};

export default PreferencesPage;
