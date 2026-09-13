"use client";

import { BellOff, Moon, SlidersHorizontal } from "lucide-react";
import type { NotificationSensitivity } from "@/lib/notification-rules";
import { notificationSensitivityLevels, notificationThresholds } from "@/lib/notification-rules";
import { notificationSettingsCopy } from "@/lib/dashboard-data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NotificationSettingsProps = {
  dailyDigestEnabled: boolean;
  sensitivity: NotificationSensitivity;
  onDailyDigestChange: (enabled: boolean) => void;
  onSensitivityChange: (sensitivity: NotificationSensitivity) => void;
};

export function NotificationSettings({
  dailyDigestEnabled,
  onDailyDigestChange,
  onSensitivityChange,
  sensitivity,
}: NotificationSettingsProps) {
  const thresholds = notificationThresholds[sensitivity];

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
          <BellOff aria-hidden="true" className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            {notificationSettingsCopy.label}
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{notificationSettingsCopy.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {notificationSettingsCopy.body}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <SlidersHorizontal aria-hidden="true" className="size-4 text-primary" />
          {notificationSettingsCopy.sensitivityLabel}
        </div>
        <div aria-label="Notification sensitivity" className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup">
          {notificationSensitivityLevels.map((level) => (
            <button
              aria-checked={sensitivity === level}
              className={cn(
                "rounded-2xl border border-border bg-surface-elevated/82 p-4 text-left transition hover:bg-surface-elevated",
                sensitivity === level && "border-primary bg-surface-soft",
              )}
              key={level}
              onClick={() => onSensitivityChange(level)}
              role="radio"
              type="button"
            >
              <span className="block font-semibold">{level}</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {notificationSettingsCopy.sensitivityDescriptions[level]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface-elevated/82 p-4">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Moon aria-hidden="true" className="size-4 text-primary" />
          {notificationSettingsCopy.dailyDigestTitle}
        </div>
        <button
          aria-checked={dailyDigestEnabled}
          className="mt-3 flex w-full items-center justify-between gap-4 rounded-2xl bg-muted/55 p-4 text-left"
          onClick={() => onDailyDigestChange(!dailyDigestEnabled)}
          role="switch"
          type="button"
        >
          <span>
            <span className="block font-semibold">
              {notificationSettingsCopy.dailyDigestOption}
            </span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
              {notificationSettingsCopy.dailyDigestDescription}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition",
              dailyDigestEnabled ? "bg-primary" : "bg-border",
            )}
          >
            <span
              className={cn(
                "size-5 rounded-full bg-surface-elevated shadow-sm transition",
                dailyDigestEnabled && "translate-x-5",
              )}
            />
          </span>
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-surface p-4">
        <p className="font-semibold">{notificationSettingsCopy.thresholdsTitle}</p>
        <div className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          <p>
            {notificationSettingsCopy.thresholdLabels.cryingEpisode}:{" "}
            {thresholds.prolongedCryingMinutes}+{" "}
            {notificationSettingsCopy.thresholdLabels.minutes}
          </p>
          <p>
            {notificationSettingsCopy.thresholdLabels.cryingCluster}:{" "}
            {thresholds.cryingClusterCount}+{" "}
            {notificationSettingsCopy.thresholdLabels.episodesWithin}{" "}
            {thresholds.cryingClusterWindowMinutes}{" "}
            {notificationSettingsCopy.thresholdLabels.minutes}
          </p>
          <p>
            {notificationSettingsCopy.thresholdLabels.skinTemperatureTrend}: +
            {thresholds.temperatureDeltaF.toFixed(1)} F
          </p>
          <p>{notificationSettingsCopy.combinedThreshold}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {notificationSettingsCopy.logicNotes.map((setting) => (
          <div
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-surface-elevated/82 p-4 text-left"
            key={setting.title}
          >
            <span>
              <span className="block font-semibold">{setting.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {setting.description}
              </span>
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-primary">
              {notificationSettingsCopy.alwaysOn}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
