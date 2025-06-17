export const DEFAULT_PROXY_SERVER = "https://api.tabn.hrushispace.com/api/v1/";
export const DEFAULT_RETENTION_PERIOD = 30;
export const DEFAULT_RELAXATION_TIME = 1;

export const GRID_MODE = 0;
export const INTERACTIVE_MODE = 1;
export const VISIBLE_CARD_COUNT = 5;

export const INTERVALOPTIONS = [
  { label: "Today", value: "1d" },
  { label: "Past 2 Days", value: "2d" },
  { label: "This Week (7 Days)", value: "7d" },
  { label: "Past 30 Days", value: "30d" },
  { label: "Past Year", value: "365d" },
];

export const REFRESH_INTERVALS = [
  { label: "1 hour", value: "1"},
  { label: "3 hours", value: "3" },
  { label: "6 hours", value: "6" },
  { label: "12 hours", value: "12" },
  { label: "1 day", value: "24" },
  { label: "2 days", value: "48" },
  { label: "3 days", value: "72" }
];

export const TIME_SORT = [
  {
    label: "Newest First",
    value: "desc",
  },
  {
    label: "Oldest First",
    value: "asc",
  },
];