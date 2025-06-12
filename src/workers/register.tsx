
import { registerWorker } from "@/lib/jobQueue";
import {
  getCleanUpSyncWorker,
  getDataExporterWorker,
  getDataImporterWorker,
  getSyncOnOpenWorker,
} from "./provider";

const WorkerRegister = ({ children }: { children: any }) => {
  registerWorker("syncOnOpen", getSyncOnOpenWorker);
  registerWorker("dataExporter", getDataExporterWorker);
  registerWorker("cleanUpSync", getCleanUpSyncWorker);
  registerWorker("dataImporter", getDataImporterWorker);
  return <>{children}</>;
};

export default WorkerRegister;
