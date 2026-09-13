import { notificationRuleCopy } from "@/lib/content";

export const notificationSensitivityLevels = ["Low", "Medium", "High"] as const;

export type NotificationSensitivity = (typeof notificationSensitivityLevels)[number];

export type NotificationRuleThresholds = {
  prolongedCryingMinutes: number;
  cryingClusterCount: number;
  cryingClusterWindowMinutes: number;
  temperatureDeltaF: number;
  combinedCryingIncrease: number;
  combinedChewingIncreasePercent: number;
  combinedRestlessnessIncreasePercent: number;
};

export type CryingEpisode = {
  id: string;
  startMinute: number;
  durationMinutes: number;
};

export type MockDailySignals = {
  cryingEpisodes: CryingEpisode[];
  cryingCountBaseline: number;
  maxSkinTemperatureDeltaF: number;
  chewingIncreasePercent: number;
  restlessnessIncreasePercent: number;
};

export type MockNotification = {
  id: string;
  title: string;
  body: string;
  rule: string;
  time: string;
};

export const notificationThresholds = {
  Low: {
    prolongedCryingMinutes: 18,
    cryingClusterCount: 3,
    cryingClusterWindowMinutes: 45,
    temperatureDeltaF: 0.7,
    combinedCryingIncrease: 2,
    combinedChewingIncreasePercent: 20,
    combinedRestlessnessIncreasePercent: 20,
  },
  Medium: {
    prolongedCryingMinutes: 12,
    cryingClusterCount: 3,
    cryingClusterWindowMinutes: 60,
    temperatureDeltaF: 0.5,
    combinedCryingIncrease: 1,
    combinedChewingIncreasePercent: 16,
    combinedRestlessnessIncreasePercent: 16,
  },
  High: {
    prolongedCryingMinutes: 8,
    cryingClusterCount: 2,
    cryingClusterWindowMinutes: 45,
    temperatureDeltaF: 0.4,
    combinedCryingIncrease: 1,
    combinedChewingIncreasePercent: 10,
    combinedRestlessnessIncreasePercent: 12,
  },
} satisfies Record<NotificationSensitivity, NotificationRuleThresholds>;

// Real sensor data would be normalized into this shape before running the rules engine.
export const mockDailySignals: MockDailySignals = {
  cryingEpisodes: [
    { id: "cry-1", startMinute: 498, durationMinutes: 6 },
    { id: "cry-2", startMinute: 754, durationMinutes: 14 },
    { id: "cry-3", startMinute: 1066, durationMinutes: 9 },
    { id: "cry-4", startMinute: 1089, durationMinutes: 7 },
  ],
  cryingCountBaseline: 2.8,
  maxSkinTemperatureDeltaF: 0.3,
  chewingIncreasePercent: 22,
  restlessnessIncreasePercent: 18,
};

export function evaluateMockNotifications(
  signals: MockDailySignals,
  sensitivity: NotificationSensitivity,
  dailyDigestEnabled: boolean,
): MockNotification[] {
  const thresholds = notificationThresholds[sensitivity];
  const notifications: MockNotification[] = [];
  const cryingIncrease = signals.cryingEpisodes.length - signals.cryingCountBaseline;
  const longestCry = signals.cryingEpisodes.reduce<CryingEpisode | null>(
    (longest, episode) =>
      !longest || episode.durationMinutes > longest.durationMinutes ? episode : longest,
    null,
  );
  const cluster = findCryingCluster(
    signals.cryingEpisodes,
    thresholds.cryingClusterCount,
    thresholds.cryingClusterWindowMinutes,
  );

  // Intentionally do not create one notification per crying episode.
  // Brief individual events stay silent in the timeline unless a meaningful rule is met.
  if (dailyDigestEnabled) {
    notifications.push({
      id: "daily-digest",
      title: notificationRuleCopy.dailyDigest.title,
      body: notificationRuleCopy.dailyDigest.body,
      rule: notificationRuleCopy.dailyDigest.rule,
      time: "7:30 PM",
    });
  }

  if (longestCry && longestCry.durationMinutes >= thresholds.prolongedCryingMinutes) {
    const copy = notificationRuleCopy.prolongedCrying(longestCry.durationMinutes);

    notifications.push({
      id: "prolonged-crying",
      title: copy.title,
      body: copy.body,
      rule: `Prolonged crying over ${thresholds.prolongedCryingMinutes} min`,
      time: minutesToTime(longestCry.startMinute + longestCry.durationMinutes),
    });
  }

  if (cluster) {
    const copy = notificationRuleCopy.cryingCluster(cluster.length);

    notifications.push({
      id: "crying-cluster",
      title: copy.title,
      body: copy.body,
      rule: `${thresholds.cryingClusterCount}+ episodes within ${thresholds.cryingClusterWindowMinutes} min`,
      time: minutesToTime(cluster[cluster.length - 1].startMinute),
    });
  }

  if (signals.maxSkinTemperatureDeltaF >= thresholds.temperatureDeltaF) {
    const copy = notificationRuleCopy.temperatureTrend(signals.maxSkinTemperatureDeltaF);

    notifications.push({
      id: "temperature-trend",
      title: copy.title,
      body: copy.body,
      rule: `Trend over +${thresholds.temperatureDeltaF.toFixed(1)} F`,
      time: "6:00 PM",
    });
  }

  if (
    cryingIncrease >= thresholds.combinedCryingIncrease &&
    signals.chewingIncreasePercent >= thresholds.combinedChewingIncreasePercent &&
    signals.restlessnessIncreasePercent >= thresholds.combinedRestlessnessIncreasePercent
  ) {
    notifications.push({
      id: "combined-pattern",
      title: notificationRuleCopy.combinedPattern.title,
      body: notificationRuleCopy.combinedPattern.body,
      rule: notificationRuleCopy.combinedPattern.rule,
      time: "7:10 PM",
    });
  }

  return notifications;
}

function findCryingCluster(
  episodes: CryingEpisode[],
  minimumCount: number,
  windowMinutes: number,
) {
  for (let startIndex = 0; startIndex < episodes.length; startIndex += 1) {
    const cluster = episodes.filter(
      (episode) =>
        episode.startMinute >= episodes[startIndex].startMinute &&
        episode.startMinute - episodes[startIndex].startMinute <= windowMinutes,
    );

    if (cluster.length >= minimumCount) {
      return cluster;
    }
  }

  return null;
}

function minutesToTime(minutes: number) {
  const hours24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${minute.toString().padStart(2, "0")} ${suffix}`;
}
