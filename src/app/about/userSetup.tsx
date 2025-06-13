import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Zap } from "lucide-react";
import { SAMPLE_RSS_SOURCES, setupSteps } from "./aboutUtils";
import StepOne from "./steps/sources";
import StepTwo from "./steps/theme";
import StepThree from "./steps/sonic";
import StepFour from "./steps/advanced";
import FileUplaodComp from "./steps/components/fileUpload";
import NavigationFooter from "./steps/components/footer";
import StepsHeader from "./steps/components/stepHeader";
import { useTheme } from "../../utils/themeProvider";
import useCustomSound from "@/hooks/useCustomSound";
import { storage } from "@/storage/main";
import { serverConfigSchema } from "@/utils/formSchemes";
import { useToast } from "@/hooks/useToast";

const NewUserSetupDialog = ({
  isOpen,
  onClose,
  onSetupComplete,
  onFileUploaded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSetupComplete: () => void;
  onFileUploaded: (contents: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState("setup");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<
    "dark" | "light" | "system"
  >("system");
  const [feedbackAudio, setFeedbackAudio] = useState(true);
  const [advancedOptions, setAdvancedOptions] = useState({
    proxyServer: "https://rss.tabn.hrushispace.com/?url=",
    retentionPeriod: "30",
    relaxationTime: "1",
  });
  const [dragActive, setDragActive] = useState(false);
  const [importedFile, setImportedFile] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useTheme();
  const { toast } = useToast();
  const [play] = useCustomSound();

  const handleSourceToggle = (sourceId: string) => {
    play({ id: "hover" });
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleNextStep = async () => {
    if (currentStep < setupSteps.length - 1) {
      play({ id: "click" });
      setCurrentStep((prev) => prev + 1);
    } else {
      const result = serverConfigSchema.safeParse({
        proxyServer: advancedOptions.proxyServer,
        retentionPeriod: parseFloat(advancedOptions.retentionPeriod),
        relaxationTime: parseFloat(advancedOptions.relaxationTime),
      });

      if (!result.success) {
        result.error.errors.forEach((err) => {
          toast({
            title: "Invalid Input",
            description: err.message,
            variant: "destructive",
          });
        });
        return;
      }
      const setupData = {
        sources: SAMPLE_RSS_SOURCES.filter((source) =>
          selectedSources.includes(source.id)
        ),
        theme: selectedTheme,
        feedbackAudio,
        advancedOptions,
      };
      for (const source of setupData.sources) {
        await storage.addSource({
          id: source.id,
          name: source.title,
          url: source.url,
          gradient: `bg-gradient-to-br ${source.color}`,
          createdAt: new Date().toISOString(),
          bannerUrl: source.bannerUrl,
          refreshInterval: 24,
        });
      }
      await storage.setAdvancedOptions(
        advancedOptions.proxyServer,
        advancedOptions.retentionPeriod,
        advancedOptions.relaxationTime
      );
      onClose();
      onSetupComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      play({ id: "click" });
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleFiles = (files: Blob[]) => {
    const file = files[0];
    if (file?.type === "application/json") {
      setImportedFile(file);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleConfiguration = () => {
    const fileData = new FileReader();
    fileData.readAsText(importedFile as Blob);
    fileData.onload = (event) => {
      try {
        const contents = event.target?.result as string;
        onFileUploaded(contents);
        onClose();
      } catch (err) {
        console.error("Invalid JSON file:", err);
      }
    };
  };

  const renderSetupStep = () => {
    const CurrentIcon = setupSteps[currentStep].icon;

    switch (currentStep) {
      case 0:
        return (
          <StepOne
            CurrentIcon={CurrentIcon}
            handleSourceToggle={handleSourceToggle}
            selectedSources={selectedSources}
          />
        );
      case 1:
        return (
          <StepTwo
            CurrentIcon={CurrentIcon}
            selectedTheme={selectedTheme}
            setSelectedTheme={(e: "dark" | "light" | "system") => {
              play({ id: "hover" });
              setTheme(e);
              setSelectedTheme(e);
            }}
          />
        );
      case 2:
        return (
          <StepThree
            CurrentIcon={CurrentIcon}
            feedbackAudio={feedbackAudio}
            setFeedbackAudio={(e: boolean) => {
              if (e === false) {
                localStorage.setItem("ui-sound", "false");
              } else {
                localStorage.setItem("ui-sound", "true");
                play({ id: "hover" });
              }
              setFeedbackAudio(e);
            }}
          />
        );
      case 3:
        return (
          <StepFour
            CurrentIcon={CurrentIcon}
            advancedOptions={advancedOptions}
            setAdvancedOptions={setAdvancedOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto border border-border dark:border-gray-800 shadow-2xl bg-white/90 dark:bg-black/90 backdrop-blur-xl">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 to-slate-100/20 dark:from-black/60 dark:to-slate-900/20" />

        <DialogHeader className="relative z-10 pb-6 border-b border-border dark:border-gray-800">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-3">
              <DialogTitle className="text-3xl font-bold text-black dark:text-white">
                Welcome to TABN
              </DialogTitle>
            </div>
            <DialogDescription className="text-lg text-muted-foreground font-medium">
              Let's create your personalized experience ✨
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <div className="relative z-10">
          <Tabs
            value={activeTab}
            onValueChange={(e) => {
              setActiveTab(e);
              play({ id: "hover" });
            }}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-border dark:border-gray-700 rounded-2xl p-1 h-14">
                <TabsTrigger
                  value="setup"
                  className="rounded-xl font-medium text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-600 data-[state=active]:shadow-lg transition"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Setup
                </TabsTrigger>
                <TabsTrigger
                  value="import"
                  className="rounded-xl font-medium text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-600 data-[state=active]:shadow-lg transition"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Config
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="setup" className="space-y-6">
              <StepsHeader currentStep={currentStep} />
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] flex flex-col justify-center"
              >
                {renderSetupStep()}
              </motion.div>
              <NavigationFooter
                currentStep={currentStep}
                handleNextStep={handleNextStep}
                handlePrevStep={handlePrevStep}
              />
            </TabsContent>

            <TabsContent value="import" className="space-y-6">
              <FileUplaodComp
                dragActive={dragActive}
                fileInputRef={fileInputRef}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                handleFileChange={handleFileChange}
                handleFileSelect={handleFileSelect}
                importedFile={importedFile}
                setImportedFile={setImportedFile}
                handleConfiguration={handleConfiguration}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserSetupDialog;
