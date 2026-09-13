import {
  BellOff,
  Brain,
  HeartHandshake,
  LineChart,
  Mail,
  MessageSquare,
  Moon,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const productName = "BiteBud";

export const siteMeta = {
  title: `${productName} | Infant Pattern Tracking`,
  description:
    `${productName} pairs a smart teether and soft sensing cap to help parents understand recent comfort and soothing patterns.`,
};

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "3D Prototype", href: "/#prototype" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "App Preview", href: "/app-preview" },
  { label: "Safety", href: "/safety" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerCopy = {
  body: `${productName} helps parents understand recent comfort, crying, motion, soothing, and skin-temperature trends. It is intended for caregiver awareness and is not a substitute for professional medical guidance.`,
};

export const commonCtas = {
  appPreview: "See App Preview",
  joinWaitlist: "Join Waitlist",
};

export type FeatureContentItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Benefit = FeatureContentItem;

export const benefits: Benefit[] = [
  {
    title: "A composed daily view",
    description:
      "See crying, soothing, chewing, movement, and comfort patterns together instead of piecing the day together from memory.",
    icon: LineChart,
  },
  {
    title: "Baseline learning",
    description:
      "The experience compares recent patterns with each baby's own 7-day baseline, so insights feel personal and appropriately measured.",
    icon: Brain,
  },
  {
    title: "Fewer, better notifications",
    description:
      "The app stays quiet for routine moments and reserves notifications for notable changes across the pattern.",
    icon: BellOff,
  },
  {
    title: "Parent awareness",
    description:
      "Caregivers get calm context about what changed, when it changed, and which signals moved together.",
    icon: HeartHandshake,
  },
];

export type FlowStep = {
  step: string;
  title: string;
  description: string;
};

export const dataFlow: FlowStep[] = [
  {
    step: "01",
    title: "The cap follows gentle trend signals",
    description:
      "The soft cap tracks skin-temperature trends, head movement, and crying events as part of the baby's recent pattern.",
  },
  {
    step: "02",
    title: "The teether adds soothing context",
    description:
      "The teether contributes chewing frequency, chewing intensity, and soothing duration to the same daily timeline.",
  },
  {
    step: "03",
    title: "The app learns the recent baseline",
    description:
      "Mock AI compares today's signals with the baby's 7-day baseline to highlight notable changes over time.",
  },
  {
    step: "04",
    title: "Parents see clear, calm context",
    description:
      "Summaries use plain language, avoid overclaiming, and focus on caregiver awareness rather than medical conclusions.",
  },
];

export const safetyPrinciples = [
  {
    title: "Pattern tracking, not medical guidance",
    description:
      `${productName} is designed for caregiver awareness. It helps organize recent patterns and does not replace professional advice.`,
    icon: ShieldCheck,
  },
  {
    title: "Notable changes only",
    description:
      "The alert model favors fewer, more meaningful updates when several signals move outside the recent baseline together.",
    icon: Sparkles,
  },
  {
    title: "Designed for quiet nights",
    description:
      "The product experience favors calm summaries, soft language, and thoughtful timing over high-pressure alerts.",
    icon: Moon,
  },
  {
    title: "Connected signal context",
    description:
      "Cap and teether data are presented as one pattern view, helping parents understand how comfort signals relate across the day.",
    icon: Radio,
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: `What is ${productName}?`,
    answer:
      `${productName} is a baby-tech concept that pairs a smart teether with a soft sensing cap to help parents understand recent comfort, soothing, crying, motion, and skin-temperature patterns.`,
  },
  {
    question: "Is this medical guidance?",
    answer:
      "No. The experience is designed for caregiver awareness. It organizes recent patterns and notable changes, while health questions should stay with qualified professionals.",
  },
  {
    question: "What does the cap track?",
    answer:
      "The soft cap follows skin-temperature trends, head movement, and crying events as mock signals in this demo.",
  },
  {
    question: "What does the teether track?",
    answer:
      "The smart teether tracks chewing frequency, chewing intensity, and soothing duration so parents can see how comfort behavior changes over time.",
  },
  {
    question: "How does the AI layer decide what to show?",
    answer:
      "The AI layer compares today's signals with the baby's recent baseline and highlights notable changes or pattern shifts in plain language.",
  },
  {
    question: "Will parents get constant alerts?",
    answer:
      "No. The notification philosophy is low-noise by design, with updates reserved for meaningful pattern changes rather than every individual event.",
  },
];

export const marketingPages = {
  home: {
    hero: {
      eyebrow: "Premium infant pattern tracking",
      title: "BiteBud connects teether and cap patterns for calmer parent awareness.",
      description:
        `${productName} pairs a smart teether with a soft sensing cap to help parents understand comfort patterns, learn a recent baseline, and notice meaningful changes without noisy alerts.`,
    },
    connectedSystem: {
      eyebrow: "Connected system",
      title: "Two gentle touchpoints, one composed view.",
      description:
        "The cap and teether work together to turn everyday signals into a clearer view of soothing, movement, crying, and comfort patterns.",
    },
    dataFlow: {
      eyebrow: "How data flows",
      title: "From everyday signals to calm context.",
      description:
        "Data is presented as trends over time. The AI layer looks for notable changes relative to the recent baseline, then explains them without overclaiming.",
    },
    appPreview: {
      eyebrow: "App preview",
      title: "Insightful without feeling urgent.",
      description:
        "The parent app helps caregivers understand the day at a glance while staying quiet unless a meaningful pattern shift appears.",
      bullets: [
        "Daily summaries combine teether and cap signals.",
        "Notifications focus on meaningful changes, not constant pings.",
        "Every insight is framed as parent awareness, not a medical conclusion.",
      ],
      cta: "Explore App Preview",
    },
    trust: {
      eyebrow: "Trust and safety",
      title: "Built around responsible language and parent peace of mind.",
      description:
        "The experience is intentionally restrained: fewer interruptions, plain-language context, and transparent limits around what the product is meant to do.",
    },
    peaceOfMind: {
      eyebrow: "Peace of mind",
      title: "Designed for the quiet moments between questions.",
      description:
        "Parents do not need more noise. They need a softer way to see what changed and decide what deserves attention.",
      moments: [
        ["Morning", "Review overnight movement, crying clusters, and soothing windows."],
        ["Afternoon", "See whether teether use is changing as routines shift."],
        ["Evening", "Receive a calm summary when signals move outside recent baseline."],
      ] as const,
    },
  },
  howItWorks: {
    hero: {
      eyebrow: "How it works",
      title: "A connected flow from gentle sensing to useful pattern summaries.",
      description:
        "The system combines a soft sensing cap and a smart teether, then organizes recent signals into parent-friendly context over time.",
    },
    systemView: {
      eyebrow: "System view",
      title: "Cap and teether signals share one timeline.",
      description:
        "Each signal is more useful when viewed in context. Together, the cap and teether create a clearer picture of comfort patterns across the day.",
      cards: [
        {
          icon: Radio,
          title: "Connected touchpoints",
          description:
            "The cap follows skin-temperature trends, movement, and crying events while the teether adds chewing and soothing behavior.",
        },
        {
          icon: Brain,
          title: "Baseline-aware AI",
          description:
            "Mock AI summaries compare recent signals with the baby's 7-day baseline to identify notable changes over time.",
        },
        {
          icon: ShieldCheck,
          title: "Responsible boundaries",
          description:
            "Insights are framed as pattern tracking and parent awareness, not as health conclusions.",
        },
      ],
    },
    dataFlow: {
      eyebrow: "Data flow",
      title: "A simple path from signal to summary.",
      description:
        "The demo uses typed mock data to model the product experience without requiring a backend.",
    },
  },
  appPreview: {
    hero: {
      eyebrow: "App preview",
      title: "A parent dashboard built around patterns, not noise.",
      description:
        "A clickable demo using realistic mock data to compare today's patterns with a 7-day baseline, surface meaningful changes, and keep notifications calm.",
    },
  },
  safety: {
    hero: {
      eyebrow: "Safety / our approach",
      title: "Responsible baby-tech starts with clear boundaries.",
      description:
        "The product is positioned around awareness, comfort, and calm communication. It tracks recent infant patterns and keeps medical decisions outside the app.",
    },
    boundaryCard: {
      eyebrow: "Product boundary",
      title: "Pattern tracking for parent awareness.",
      body:
        `${productName} helps caregivers see recent trends across soothing, movement, crying, and skin-temperature signals. It is not a substitute for professional medical guidance.`,
    },
    trust: {
      eyebrow: "Trust principles",
      title: "Calm, clear, and careful by design.",
      description:
        "Every product and UI decision should lower noise, clarify limits, and keep parents focused on meaningful context.",
    },
    alertLanguage: {
      eyebrow: "Alert philosophy",
      title: "Noisy alerts are not a feature.",
      description:
        "The app avoids high-pressure language and prefers phrases that describe pattern context.",
      cards: [
        ["Notable change", "Used when one or more signals move away from recent baseline."],
        ["Pattern shift", "Used when behavior changes over a meaningful window of time."],
        [
          "Outside recent baseline",
          "Used when the app compares today with the baby's own recent trend.",
        ],
      ] as const,
    },
  },
  faq: {
    hero: {
      eyebrow: "FAQ",
      title: "Common questions, answered plainly.",
      description:
        "Answers for the investor-demo concept, mock data experience, and caregiver-awareness positioning.",
    },
    shortVersion: {
      eyebrow: "Short version",
      body:
        `${productName} tracks infant patterns over time and highlights notable changes. It is designed for awareness, comfort, and peace of mind.`,
    },
    details: {
      eyebrow: "Details",
      title: "What parents and partners may ask first.",
    },
  },
  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Help shape a calmer future for baby-tech.",
      description:
        "Join the waitlist, request an investor walkthrough, or share partnership interest as the concept moves toward pilot.",
    },
    card: {
      eyebrow: "Waitlist access",
      title: "Early conversations are open.",
      body:
        "We are collecting parent, family wellness, retail, and investor feedback around the product direction and app preview.",
    },
    section: {
      eyebrow: "Get in touch",
      title: "Three useful next steps.",
      description: "Choose the conversation that best matches your interest.",
      cards: [
        {
          icon: Users,
          title: "Parent waitlist",
          description: "Follow progress and early pilot opportunities for the product concept.",
        },
        {
          icon: MessageSquare,
          title: "Investor demo",
          description:
            "Walk through the connected-system story, mock app preview, and notification philosophy.",
        },
        {
          icon: Mail,
          title: "Partner inquiry",
          description:
            "Discuss family wellness, baby retail, research, or product feedback opportunities.",
        },
      ],
    },
  },
};

export const productVisualCopy = {
  capTitle: "Soft sensing cap",
  capSignals: ["Temp trend", "Movement", "Crying"],
  teetherTitle: "Smart teether",
  teetherSignals: ["Frequency", "Intensity", "Soothing"],
  connectedLabel: "Connected baseline-aware pattern view",
  aiNote:
    "AI compares recent cap and teether signals to identify notable changes over time, without turning them into medical conclusions.",
};

export const ctaBandCopy = {
  eyebrow: "Investor-demo ready",
  title: "A calmer way to understand infant patterns.",
  body:
    "Explore the mock app experience or join the waitlist for updates as the product moves from concept to pilot.",
};

export const appPreviewPanelCopy = {
  eyebrow: "Today",
  title: "Ari's patterns",
  status: "Calm",
  summaryLabel: "Pattern summary",
  summary:
    "Evening chewing and soothing duration moved outside recent baseline together.",
  notificationMode: "Quiet notification mode",
  notificationDetail: "No new alerts. Next summary arrives after the evening window.",
  temperatureNote: "Skin-temperature trend stays in recent range.",
  motionNote: "Rest movement settled after soothing session.",
};

export const appMetrics = [
  { label: "Soothing duration", value: "42 min", detail: "Up 14% from recent baseline" },
  { label: "Chewing rhythm", value: "Steady", detail: "Longer evening sessions" },
  { label: "Rest movement", value: "Mild", detail: "Settled after teether use" },
  { label: "Crying events", value: "3", detail: "Clustered before nap window" },
];

export type TrendPoint = {
  label: string;
  value: number;
  baseline: number;
};

export type DashboardMetricId = "summary" | "crying" | "teether" | "temperature" | "motion";

export type DashboardMetricTone = "teal" | "coral" | "sage";

export type DashboardMetric = {
  id: DashboardMetricId;
  title: string;
  value: string;
  comparison: string;
  detail: string;
  icon: LucideIcon;
  tone: DashboardMetricTone;
};

export type DashboardPeriod = "Morning" | "Afternoon" | "Evening";

export type DashboardEventKind = "crying" | "teether" | "motion" | "temperature" | "insight";

export type DashboardEvent = {
  id: string;
  time: string;
  period: DashboardPeriod;
  title: string;
  description: string;
  kind: DashboardEventKind;
};

export type Insight = {
  title: string;
  body: string;
};

export const dashboardCopy = {
  summary: {
    badge: "Parent dashboard",
    title: "Today's Summary",
    body:
      "Daily patterns are compared with Ari's 7-day baseline. Today shows higher than usual crying events, increased soothing behavior, and motion that was more restless than recent average before settling.",
    baselineTitle: "7-day baseline active",
    baselineBody:
      "Insights and notifications use recent patterns only and avoid medical conclusions.",
  },
  selectedPattern: "Selected pattern",
  chartSections: {
    crying: {
      label: "Crying Events",
      title: "Higher than usual today",
      body:
        "Four events compared with a 7-day baseline of about three, clustered around transitions.",
    },
    teether: {
      label: "Teether Usage",
      title: "Increased soothing behavior",
      body:
        "Today's teether sessions lasted longer than the 7-day baseline, with a stronger evening pattern.",
    },
    temperature: {
      label: "Skin-Temperature Trend",
      title: "Near recent average",
      body:
        "Skin-temperature trend stayed close to baseline while soothing and motion patterns shifted.",
    },
    motion: {
      label: "Restlessness / Motion Trend",
      title: "More restless than recent average",
      body:
        "Movement rose before the afternoon nap and then moved closer to baseline later in the day.",
    },
  },
  insightCards: {
    aiDescription: "AI Insights",
    aiTitle: "Pattern context for parents",
    meaningfulDescription: "Baseline-aware summary",
    meaningfulTitle: "Meaningful Changes Detected",
  },
  footerNote: {
    label: "Clickable demo",
    body: "Tap metric cards, filter the timeline, and tune notification sensitivity.",
    cta: "Back to top",
  },
};

export const meaningfulChanges: Insight[] = [
  {
    title: "Evening soothing rose with chewing activity",
    body:
      "Teether use was 22% above the 7-day baseline after 5 PM, matching a longer settling period.",
  },
  {
    title: "Afternoon motion was more restless than recent average",
    body:
      "Movement rose before the nap window and returned closer to baseline after a soothing session.",
  },
];

export const aiInsights: Insight[] = [
  {
    title: "Increased soothing behavior",
    body:
      "Today shows more chewing and longer teether sessions than the 7-day baseline, especially in the evening.",
  },
  {
    title: "Crying clustered around transitions",
    body:
      "Crying events were higher than usual and appeared before nap and feeding windows rather than spread evenly.",
  },
  {
    title: "Temperature stayed near baseline",
    body:
      "Skin-temperature trend remained close to recent average while motion and soothing patterns shifted.",
  },
];

export const timelineCopy = {
  label: "Timeline view",
  title: "Events across the day",
  body:
    "Every event is logged here quietly. Notifications are handled separately and only appear when the mock rules find a meaningful pattern.",
};

export const timelineFilters = ["All", "Morning", "Afternoon", "Evening"] as const;

export type TimelineFilter = (typeof timelineFilters)[number];

export const chartLegendCopy = {
  today: "Today",
  baseline: "7-day baseline",
};

export const notificationSettingsCopy = {
  label: "Notifications Settings",
  title: "Low-noise by default",
  body:
    "Crying, chewing, motion, and skin-temperature events are logged silently in the timeline. Notifications are sent only when a meaningful pattern crosses the selected threshold.",
  sensitivityLabel: "Sensitivity",
  sensitivityDescriptions: {
    Low: "Only the clearest pattern shifts.",
    Medium: "Balanced updates for meaningful changes.",
    High: "More responsive, still not every event.",
  },
  dailyDigestTitle: "Daily digest",
  dailyDigestOption: "Send one calm daily recap",
  dailyDigestDescription:
    "A summary appears even when no extra pattern notification is needed.",
  thresholdsTitle: "Current mock thresholds",
  thresholdLabels: {
    cryingEpisode: "Crying episode",
    cryingCluster: "Crying cluster",
    skinTemperatureTrend: "Skin-temperature trend",
    minutes: "minutes",
    episodesWithin: "episodes within",
  },
  combinedThreshold: "Combined shift: crying + chewing + restlessness above recent baseline",
  alwaysOn: "Always on",
  logicNotes: [
    {
      title: "Every event is still saved",
      description:
        "The timeline keeps each cry, teether session, motion shift, and skin-temperature trend for review.",
    },
    {
      title: "Single brief cries stay quiet",
      description:
        "A short crying event is logged, but it does not create a notification by itself.",
    },
  ],
};

export const notificationCenterCopy = {
  label: "Mock notification logic",
  title: "What would notify today",
  noPerCryAlerts: "No per-cry alerts",
  ruleLabel: "Rule",
  empty:
    "No notifications today. Events still appear in the timeline for calm review.",
  summary: (
    eventCount: number,
    sensitivity: string,
    patternNotificationCount: number,
    dailyDigestEnabled: boolean,
  ) =>
    `${eventCount} timeline events were logged silently. With ${sensitivity} sensitivity, the demo sends ${patternNotificationCount} pattern notification${
      patternNotificationCount === 1 ? "" : "s"
    }${dailyDigestEnabled ? " plus the daily digest." : "."}`,
};

export const notificationRuleCopy = {
  dailyDigest: {
    title: "Daily digest ready",
    body:
      "Today's summary is ready, with crying, soothing, motion, and skin-temperature patterns compared with the 7-day baseline.",
    rule: "Daily digest",
  },
  prolongedCrying: (durationMinutes: number) => ({
    title: "Longer crying episode",
    body:
      `One crying episode lasted ${durationMinutes} minutes, which is higher than usual for today's sensitivity setting.`,
  }),
  cryingCluster: (count: number) => ({
    title: "Crying episodes clustered",
    body:
      `${count} crying episodes happened close together. The app logs each event silently, then only notifies when a cluster forms.`,
  }),
  temperatureTrend: (deltaF: number) => ({
    title: "Skin-temperature trend increased",
    body: `Skin-temperature trend moved ${deltaF.toFixed(1)} F above the recent baseline.`,
  }),
  combinedPattern: {
    title: "Meaningful pattern shift",
    body:
      "Crying, chewing, and restlessness increased together compared with the 7-day baseline.",
    rule: "Combined pattern change",
  },
};

export type DashboardSectionId =
  | DashboardMetricId
  | "events"
  | "insights"
  | "settings";

export type DashboardSection = {
  id: DashboardSectionId;
  label: string;
};

export const dashboardSections = [
  { id: "summary", label: "Summary" },
  { id: "events", label: "Timeline" },
  { id: "crying", label: "Crying" },
  { id: "teether", label: "Teether" },
  { id: "temperature", label: "Temperature" },
  { id: "motion", label: "Motion" },
  { id: "insights", label: "AI Insights" },
  { id: "settings", label: "Settings" },
] satisfies DashboardSection[];
