import {
  Baby,
  Moon,
  SmilePlus,
  ThermometerSun,
  Waves,
} from "lucide-react";
import type {
  DashboardEvent,
  DashboardMetric,
  TrendPoint,
} from "@/lib/content";
import type { MockDailySignals } from "@/lib/notification-rules";

type DemoBabyProfile = {
  id: string;
  name: string;
  ageLabel: string;
  demoDate: string;
};

type DailySeed = {
  dateLabel: string;
  cryingEvents: number;
  cryingMinutes: number;
  soothingMinutes: number;
  chewingIntensity: number;
  skinTemperatureAverageF: number;
  skinTemperatureDeltaF: number;
  restlessnessIndex: number;
};

type DemoDayEvent = DashboardEvent & {
  minute: number;
  durationMinutes?: number;
};

export type DemoBabyData = {
  profile: DemoBabyProfile;
  fullDay: DailySeed;
  baselineDays: DailySeed[];
  baseline: {
    cryingEvents: number;
    soothingMinutes: number;
    chewingIntensity: number;
    skinTemperatureAverageF: number;
    restlessnessIndex: number;
  };
  metrics: DashboardMetric[];
  cryingTrend: TrendPoint[];
  teetherTrend: TrendPoint[];
  temperatureTrend: TrendPoint[];
  motionTrend: TrendPoint[];
  timelineEvents: DemoDayEvent[];
  notificationSignals: MockDailySignals;
};

const profile: DemoBabyProfile = {
  id: "ari-demo",
  name: "Ari",
  ageLabel: "8 months",
  demoDate: "Monday, April 27",
};

const baselineDays: DailySeed[] = [
  createDailySeed("Mon", 2, 16, 34, 54, 98.0, -0.1, 32),
  createDailySeed("Tue", 3, 21, 39, 58, 98.1, 0.1, 36),
  createDailySeed("Wed", 2, 17, 42, 60, 98.1, 0.0, 35),
  createDailySeed("Thu", 4, 27, 36, 56, 98.0, 0.2, 38),
  createDailySeed("Fri", 3, 22, 44, 61, 98.1, 0.1, 35),
  createDailySeed("Sat", 2, 18, 40, 59, 98.0, -0.1, 33),
  createDailySeed("Sun", 3, 20, 41, 58, 98.1, 0.0, 34),
];

const fullDay = createDailySeed("Today", 4, 36, 51, 67, 98.3, 0.3, 42);

const timelineEvents: DemoDayEvent[] = [
  {
    id: "event-1",
    time: "6:42 AM",
    minute: 402,
    period: "Morning",
    title: "Skin-temperature trend near baseline",
    description: "Morning trend stayed close to Ari's recent average.",
    kind: "temperature",
  },
  {
    id: "event-2",
    time: "8:18 AM",
    minute: 498,
    durationMinutes: 6,
    period: "Morning",
    title: "Short crying event",
    description: "One brief event before feeding; settled within 6 minutes.",
    kind: "crying",
  },
  {
    id: "event-3",
    time: "12:34 PM",
    minute: 754,
    durationMinutes: 14,
    period: "Afternoon",
    title: "Longer crying event",
    description: "A transition before nap took longer than Ari's recent pattern.",
    kind: "crying",
  },
  {
    id: "event-4",
    time: "1:08 PM",
    minute: 788,
    durationMinutes: 14,
    period: "Afternoon",
    title: "Soothing session",
    description: "Teether use lasted 14 minutes with moderate chewing intensity.",
    kind: "teether",
  },
  {
    id: "event-5",
    time: "3:16 PM",
    minute: 916,
    period: "Afternoon",
    title: "More restless than recent average",
    description: "Motion increased before nap compared with the 7-day baseline.",
    kind: "motion",
  },
  {
    id: "event-6",
    time: "5:46 PM",
    minute: 1066,
    durationMinutes: 9,
    period: "Evening",
    title: "Crying events clustered",
    description: "Two events appeared close together before the evening routine.",
    kind: "crying",
  },
  {
    id: "event-7",
    time: "6:09 PM",
    minute: 1089,
    durationMinutes: 7,
    period: "Evening",
    title: "Short crying event",
    description: "A second brief event appeared inside the same evening window.",
    kind: "crying",
  },
  {
    id: "event-8",
    time: "6:21 PM",
    minute: 1101,
    durationMinutes: 22,
    period: "Evening",
    title: "Increased soothing behavior",
    description: "Longest teether session of the day and longer settling window.",
    kind: "teether",
  },
  {
    id: "event-9",
    time: "7:10 PM",
    minute: 1150,
    period: "Evening",
    title: "Meaningful change noted",
    description: "Evening soothing and chewing rose together outside recent baseline.",
    kind: "insight",
  },
];

export const demoBabyData = generateDemoBabyData();

export function generateDemoBabyData(): DemoBabyData {
  const baseline = {
    cryingEvents: average(baselineDays.map((day) => day.cryingEvents)),
    soothingMinutes: average(baselineDays.map((day) => day.soothingMinutes)),
    chewingIntensity: average(baselineDays.map((day) => day.chewingIntensity)),
    skinTemperatureAverageF: average(
      baselineDays.map((day) => day.skinTemperatureAverageF),
    ),
    restlessnessIndex: average(baselineDays.map((day) => day.restlessnessIndex)),
  };
  const chewingIncreasePercent = percentChange(
    fullDay.soothingMinutes,
    baseline.soothingMinutes,
  );
  const restlessnessIncreasePercent = percentChange(
    fullDay.restlessnessIndex,
    baseline.restlessnessIndex,
  );

  return {
    profile,
    fullDay,
    baselineDays,
    baseline,
    metrics: [
      {
        id: "summary",
        title: "Today's Summary",
        value: "Steady",
        comparison: "2 notable shifts from 7-day baseline",
        detail: "More evening chewing and a longer soothing window appeared together.",
        icon: Baby,
        tone: "teal",
      },
      {
        id: "crying",
        title: "Crying Events",
        value: fullDay.cryingEvents.toString(),
        comparison: "higher than usual",
        detail: `7-day baseline is ${baseline.cryingEvents.toFixed(1)} events, with today's events clustered before nap windows.`,
        icon: SmilePlus,
        tone: "coral",
      },
      {
        id: "teether",
        title: "Teether Usage",
        value: `${fullDay.soothingMinutes} min`,
        comparison: "increased soothing behavior",
        detail: "Chewing intensity was moderate, with the longest session after 6 PM.",
        icon: Waves,
        tone: "sage",
      },
      {
        id: "temperature",
        title: "Skin-Temperature Trend",
        value: `+${fullDay.skinTemperatureDeltaF.toFixed(1)} F`,
        comparison: "near recent average",
        detail: "Trend stayed close to the 7-day baseline during the daytime window.",
        icon: ThermometerSun,
        tone: "coral",
      },
      {
        id: "motion",
        title: "Restlessness / Motion Trend",
        value: `+${Math.round(restlessnessIncreasePercent)}%`,
        comparison: "more restless than recent average",
        detail: "Motion was elevated before the afternoon nap, then settled after soothing.",
        icon: Moon,
        tone: "teal",
      },
    ],
    cryingTrend: [
      ...baselineDays.map((day) => trendPoint(day.dateLabel, day.cryingEvents, baseline.cryingEvents)),
      trendPoint("Today", fullDay.cryingEvents, baseline.cryingEvents),
    ],
    teetherTrend: [
      ...baselineDays.map((day) =>
        trendPoint(day.dateLabel, day.soothingMinutes, baseline.soothingMinutes),
      ),
      trendPoint("Today", fullDay.soothingMinutes, baseline.soothingMinutes),
    ],
    temperatureTrend: [
      trendPoint("6a", 97.9, baseline.skinTemperatureAverageF),
      trendPoint("9a", 98.1, baseline.skinTemperatureAverageF),
      trendPoint("12p", 98.2, baseline.skinTemperatureAverageF),
      trendPoint("3p", 98.3, baseline.skinTemperatureAverageF),
      trendPoint("6p", 98.4, baseline.skinTemperatureAverageF),
      trendPoint("9p", 98.2, baseline.skinTemperatureAverageF),
    ],
    motionTrend: [
      trendPoint("6a", 32, baseline.restlessnessIndex),
      trendPoint("9a", 38, baseline.restlessnessIndex),
      trendPoint("12p", 47, baseline.restlessnessIndex),
      trendPoint("3p", 52, baseline.restlessnessIndex),
      trendPoint("6p", 39, baseline.restlessnessIndex),
      trendPoint("9p", 31, baseline.restlessnessIndex),
    ],
    timelineEvents,
    notificationSignals: {
      cryingEpisodes: timelineEvents
        .filter((event) => event.kind === "crying" && event.durationMinutes)
        .map((event) => ({
          id: event.id,
          startMinute: event.minute,
          durationMinutes: event.durationMinutes ?? 0,
        })),
      cryingCountBaseline: baseline.cryingEvents,
      maxSkinTemperatureDeltaF: fullDay.skinTemperatureDeltaF,
      chewingIncreasePercent,
      restlessnessIncreasePercent,
    },
  };
}

function createDailySeed(
  dateLabel: string,
  cryingEvents: number,
  cryingMinutes: number,
  soothingMinutes: number,
  chewingIntensity: number,
  skinTemperatureAverageF: number,
  skinTemperatureDeltaF: number,
  restlessnessIndex: number,
): DailySeed {
  return {
    dateLabel,
    cryingEvents,
    cryingMinutes,
    soothingMinutes,
    chewingIntensity,
    skinTemperatureAverageF,
    skinTemperatureDeltaF,
    restlessnessIndex,
  };
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function percentChange(value: number, baseline: number) {
  return ((value - baseline) / baseline) * 100;
}

function trendPoint(label: string, value: number, baseline: number): TrendPoint {
  return {
    label,
    value: Number(value.toFixed(1)),
    baseline: Number(baseline.toFixed(1)),
  };
}
