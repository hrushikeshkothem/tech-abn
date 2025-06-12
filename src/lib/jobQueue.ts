import type { WorkerProvider } from "@/workers/provider";

export interface Job {
  workerKey: string;
  onCompleteKey?: string;
  extraParams?: any;
  titlePending: string;
  titleFinished: string;
}

const workerRegistry: Record<string, WorkerProvider> = {};

const QUEUE_KEY = "tabn-Job-Queue";

export const registerWorker = (key: string, worker: WorkerProvider) => {
  workerRegistry[key] = worker;
};

const loadQueue = (): Job[] => {
  const raw = sessionStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveQueue = (queue: Job[]) => {
  sessionStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

let onQueueUpdate: (() => void) | null = null;

export const enqueueJob = (job: Job) => {
  const queue = loadQueue();
  const isDuplicate = queue.some((q) => q.workerKey === job.workerKey);
  if (isDuplicate) return;
  queue.push(job);
  saveQueue(queue);
  if (onQueueUpdate) onQueueUpdate();
};

export const dequeueJob = ():
  | { job: Job; worker: WorkerProvider }
  | undefined => {
  const queue = loadQueue();
  if (queue.length === 0) return undefined;

  const job = queue.shift()!;
  saveQueue(queue);

  const worker = workerRegistry[job.workerKey];
  if (!worker)
    throw new Error(`Worker with key "${job.workerKey}" not registered`);
  return { job, worker };
};

export const peekJob = (): { job: Job; worker: WorkerProvider } | undefined => {
  const queue = loadQueue();
  if (queue.length === 0) return undefined;
  const job = queue[0];
  const worker = workerRegistry[job.workerKey];
  if (!worker)
    throw new Error(`Worker with key "${job.workerKey}" not registered`);
  return { job, worker };
};

export const isQueueEmpty = () => loadQueue().length === 0;

export const setQueueUpdateCallback = (cb: () => void) => {
  onQueueUpdate = cb;
};

export const clearQueue = () => {
  saveQueue([]);
};
