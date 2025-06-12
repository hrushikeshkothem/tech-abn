import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SoundConfigure = ({
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
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label className="text-base font-medium">Enable Audio Feedback</Label>
        <p className="text-sm text-muted-foreground">
          Play sounds for interactions and notifications
        </p>
      </div>
      <Switch
        checked={preferences.feedbackAudio}
        onCheckedChange={(checked) =>
          updatePreference("feedbackAudio", checked)
        }
        className="data-[state=checked]:bg-green-500"
      />
    </div>
  );
};

export default SoundConfigure;
