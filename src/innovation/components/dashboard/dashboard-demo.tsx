"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  CalendarDays,
  Check,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  aiInsights,
  dashboardSections,
  dashboardCopy,
  demoBabyData,
  meaningfulChanges,
} from "@/lib/dashboard-data";
import { productName } from "@/lib/content";
import type { DashboardMetricId } from "@/lib/dashboard-data";
import {
  evaluateMockNotifications,
  type NotificationSensitivity,
} from "@/lib/notification-rules";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { TimelineView } from "@/components/dashboard/timeline-view";
import { InsightCard } from "@/components/ui/insight-card";
import { NotificationSettings } from "@/components/dashboard/notification-settings";
import { NotificationCenter } from "@/components/dashboard/notification-center";
import { cn } from "@/lib/utils";

type DemoViewState = "ready" | "loading" | "empty";

const onboardingSteps = [
  {
    title: "Connect gentle signals",
    body: "The soft cap and smart teether collect everyday comfort-pattern signals.",
  },
  {
    title: "Learn Ari's baseline",
    body: "The demo compares today with Ari's own 7-day baseline, not a generic average.",
  },
  {
    title: "Show calm context",
    body: "Parents see notable changes in plain language, with clear non-diagnostic boundaries.",
  },
];

export function DashboardDemo() {
  const [activeMetric, setActiveMetric] = useState<DashboardMetricId>(demoBabyData.metrics[0].id);
  const [demoViewState, setDemoViewState] = useState<DemoViewState>("ready");
  const [liveDemoMode, setLiveDemoMode] = useState(true);
  const [notificationSensitivity, setNotificationSensitivity] =
    useState<NotificationSensitivity>("Medium");
  const [dailyDigestEnabled, setDailyDigestEnabled] = useState(true);
  const visibleSections = liveDemoMode
    ? dashboardSections.filter((section) =>
        ["summary", "events", "insights"].includes(section.id),
      )
    : dashboardSections;
  const activeMetricData = useMemo(
    () =>
      demoBabyData.metrics.find((metric) => metric.id === activeMetric) ??
      demoBabyData.metrics[0],
    [activeMetric],
  );
  // Later, live cap and teether readings would replace this generated seed.
  const notifications = useMemo(
    () =>
      evaluateMockNotifications(
        demoBabyData.notificationSignals,
        notificationSensitivity,
        dailyDigestEnabled,
      ),
    [dailyDigestEnabled, notificationSensitivity],
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CalendarDays aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {demoBabyData.profile.name}, {demoBabyData.profile.ageLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  {demoBabyData.profile.demoDate}
                </p>
              </div>
            </div>
            <nav className="mt-5 flex gap-2 overflow-x-auto lg:block lg:space-y-2" aria-label="Dashboard sections">
              {visibleSections.map((section) => (
                <a
                  className="block rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground lg:rounded-xl"
                  href={`#${section.id}`}
                  key={section.id}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </Card>
        </aside>

        <div className="space-y-5">
          <DemoControls
            demoViewState={demoViewState}
            liveDemoMode={liveDemoMode}
            onDemoViewStateChange={setDemoViewState}
            onLiveDemoModeChange={setLiveDemoMode}
          />

          {demoViewState === "loading" ? (
            <DashboardLoadingState />
          ) : demoViewState === "empty" ? (
            <DashboardEmptyState onGenerate={() => setDemoViewState("ready")} />
          ) : (
            <>
          <OnboardingSteps />

          <NonDiagnosticCallout />

          <section id="summary">
            <Card className="overflow-hidden bg-surface p-5 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge>
                    {liveDemoMode ? "Live Demo Mode" : dashboardCopy.summary.badge}
                  </Badge>
                  <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
                    {dashboardCopy.summary.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                    {dashboardCopy.summary.body}
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/12 bg-surface-elevated/86 p-4">
                  <p className="text-sm font-bold text-primary">
                    {dashboardCopy.summary.baselineTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Based on 7 seeded days: {demoBabyData.baseline.cryingEvents.toFixed(1)} crying events,{" "}
                    {Math.round(demoBabyData.baseline.soothingMinutes)} soothing minutes, and{" "}
                    {Math.round(demoBabyData.baseline.restlessnessIndex)} motion index average.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {liveDemoMode && <LiveDemoGuide />}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {demoBabyData.metrics.map((metric) => (
              <MetricCard
                active={metric.id === activeMetricData.id}
                key={metric.id}
                metric={metric}
                onSelect={() => setActiveMetric(metric.id)}
              />
            ))}
          </section>

          <Card className="flex flex-col gap-3 bg-surface-elevated/76 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                {dashboardCopy.selectedPattern}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{activeMetricData.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {activeMetricData.detail}
              </p>
            </div>
            <span className="w-fit rounded-full bg-muted px-4 py-2 text-sm font-bold text-primary">
              {activeMetricData.comparison}
            </span>
          </Card>

          <section id="events">
            <TimelineView events={demoBabyData.timelineEvents} />
          </section>

          {!liveDemoMode && (
            <>
          <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div id="crying">
              <Card className="h-full p-5">
                <p className="text-sm font-semibold text-muted-foreground">
                  {dashboardCopy.chartSections.crying.label}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {dashboardCopy.chartSections.crying.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {dashboardCopy.chartSections.crying.body}
                </p>
                <TrendChart data={demoBabyData.cryingTrend} variant="bar" />
              </Card>
            </div>

            <div id="teether">
              <Card className="h-full p-5">
                <p className="text-sm font-semibold text-muted-foreground">
                  {dashboardCopy.chartSections.teether.label}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {dashboardCopy.chartSections.teether.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {dashboardCopy.chartSections.teether.body}
                </p>
                <TrendChart data={demoBabyData.teetherTrend} variant="bar" suffix=" min" />
              </Card>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <div id="temperature">
              <Card className="h-full p-5">
                <p className="text-sm font-semibold text-muted-foreground">
                  {dashboardCopy.chartSections.temperature.label}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {dashboardCopy.chartSections.temperature.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {dashboardCopy.chartSections.temperature.body}
                </p>
                <TrendChart data={demoBabyData.temperatureTrend} suffix=" F" />
              </Card>
            </div>

            <div id="motion">
              <Card className="h-full p-5">
                <p className="text-sm font-semibold text-muted-foreground">
                  {dashboardCopy.chartSections.motion.label}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {dashboardCopy.chartSections.motion.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {dashboardCopy.chartSections.motion.body}
                </p>
                <TrendChart data={demoBabyData.motionTrend} />
              </Card>
            </div>
          </section>
            </>
          )}

          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div id="insights">
              <InsightCard
                description={dashboardCopy.insightCards.aiDescription}
                insights={aiInsights}
                title={dashboardCopy.insightCards.aiTitle}
              />
            </div>
            <InsightCard
              description={dashboardCopy.insightCards.meaningfulDescription}
              featured
              insights={meaningfulChanges}
              title={dashboardCopy.insightCards.meaningfulTitle}
            />
          </section>

          {!liveDemoMode && (
            <section id="settings">
            <div className="grid gap-5 xl:grid-cols-[1fr_1.05fr]">
              <NotificationSettings
                dailyDigestEnabled={dailyDigestEnabled}
                onDailyDigestChange={setDailyDigestEnabled}
                onSensitivityChange={setNotificationSensitivity}
                sensitivity={notificationSensitivity}
              />
              <NotificationCenter
                dailyDigestEnabled={dailyDigestEnabled}
                eventCount={demoBabyData.timelineEvents.length}
                notifications={notifications}
                sensitivity={notificationSensitivity}
              />
            </div>
          </section>
          )}

          <Card className="flex flex-col gap-4 bg-surface-soft p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                {dashboardCopy.footerNote.label}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {dashboardCopy.footerNote.body}
              </p>
            </div>
            <Button
              className={cn("w-full sm:w-auto")}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              type="button"
              variant="secondary"
            >
              {dashboardCopy.footerNote.cta}
              <ArrowDown aria-hidden="true" className="ml-2 size-4 rotate-180" />
            </Button>
          </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveDemoGuide() {
  return (
    <Card className="bg-surface-elevated/76 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-primary">2-minute path</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Live Demo mode keeps the story focused: baseline summary, metric cards, timeline, and
            insights. Turn it off to inspect detailed charts and notification settings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1.5">Baseline</span>
          <span className="rounded-full bg-muted px-3 py-1.5">Timeline</span>
          <span className="rounded-full bg-muted px-3 py-1.5">Insights</span>
        </div>
      </div>
    </Card>
  );
}

type DemoControlsProps = {
  demoViewState: DemoViewState;
  liveDemoMode: boolean;
  onDemoViewStateChange: (state: DemoViewState) => void;
  onLiveDemoModeChange: (enabled: boolean) => void;
};

function DemoControls({
  demoViewState,
  liveDemoMode,
  onDemoViewStateChange,
  onLiveDemoModeChange,
}: DemoControlsProps) {
  return (
    <Card className="flex flex-col gap-4 bg-surface-elevated/82 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Demo day</Badge>
          {liveDemoMode && (
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              <Play aria-hidden="true" className="mr-1.5 size-3.5" />
              Simplified flow
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use the state buttons to show readiness, loading polish, or the empty state.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          aria-pressed={liveDemoMode}
          onClick={() => onLiveDemoModeChange(!liveDemoMode)}
          type="button"
          variant={liveDemoMode ? "primary" : "secondary"}
        >
          Live Demo
        </Button>
        {(["ready", "loading", "empty"] as const).map((state) => (
          <Button
            aria-pressed={demoViewState === state}
            key={state}
            onClick={() => onDemoViewStateChange(state)}
            type="button"
            variant={demoViewState === state ? "primary" : "secondary"}
          >
            {state === "ready" ? "Data" : state[0].toUpperCase() + state.slice(1)}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function OnboardingSteps() {
  return (
    <section aria-label="Three-step onboarding" className="grid gap-3 md:grid-cols-3">
      {onboardingSteps.map((step, index) => (
        <Card className="bg-surface-elevated/76 p-4" key={step.title}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h2 className="text-base font-semibold">{step.title}</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
        </Card>
      ))}
    </section>
  );
}

function NonDiagnosticCallout() {
  return (
    <Card className="border-primary/20 bg-surface-soft p-5">
      <div className="flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">Non-diagnostic trend tracking</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {productName} supports caregiver awareness by organizing recent patterns. It does not
            diagnose, predict illness, or replace caregiver judgment or professional medical
            advice.
          </p>
        </div>
      </div>
    </Card>
  );
}

function DashboardLoadingState() {
  return (
    <Card className="p-5 sm:p-7" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-surface-soft text-primary">
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        </div>
        <div>
          <p className="font-semibold">Preparing Ari&apos;s demo day</p>
          <p className="text-sm text-muted-foreground">
            Building the full-day view and comparing it with the 7-day baseline.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="rounded-2xl border border-border bg-muted/45 p-4" key={item}>
            <div className="h-4 w-24 animate-pulse rounded-full bg-border" />
            <div className="mt-5 h-8 w-16 animate-pulse rounded-full bg-border" />
            <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-border" />
            <div className="mt-2 h-3 w-3/4 animate-pulse rounded-full bg-border" />
          </div>
        ))}
      </div>
    </Card>
  );
}

type DashboardEmptyStateProps = {
  onGenerate: () => void;
};

function DashboardEmptyState({ onGenerate }: DashboardEmptyStateProps) {
  return (
    <Card className="p-6 text-center sm:p-10">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-soft text-primary">
        <Sparkles aria-hidden="true" className="size-6" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold">No baby profile selected</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        The dashboard stays calm when there is no profile data yet. For demo day, generate Ari&apos;s
        seeded full-day view with a 7-day baseline.
      </p>
      <Button className="mt-6" onClick={onGenerate} type="button">
        <Check aria-hidden="true" className="mr-2 size-4" />
        Generate demo data
      </Button>
    </Card>
  );
}
