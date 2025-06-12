import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Globe, Timer } from "lucide-react";

const ServerConfigure = ({
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="proxy" className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <span>Proxy Server Address</span>
          </Label>
          <Input
            id="proxy"
            type="url"
            placeholder="http://proxy.example.com:8080"
            value={preferences.proxyServer}
            onChange={(e) => updatePreference("proxyServer", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Optional proxy server for RSS feed requests
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="retention" className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-purple-500" />
            <span>Data Retention (days)</span>
          </Label>
          <Input
            id="retention"
            type="number"
            min={1}
            max={365}
            value={preferences.retentionPeriod}
            onChange={(e) =>
              updatePreference("retentionPeriod", e.target.value)
            }
            className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-muted-foreground">
            How long to keep RSS feed data
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="relaxation" className="flex items-center space-x-2">
          <Timer className="h-4 w-4 text-green-500" />
          <span>Request Relaxation Time (seconds)</span>
        </Label>
        <Input
          id="relaxation"
          type="number"
          min={1}
          max={60}
          value={preferences.relaxationTime}
          onChange={(e) => updatePreference("relaxationTime", e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
        />
        <p className="text-xs text-muted-foreground">
          Delay between API calls to prevent server overload
        </p>
      </div>
    </>
  );
};

export default ServerConfigure;
