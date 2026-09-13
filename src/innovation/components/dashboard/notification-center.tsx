import { Bell, BellOff, CheckCircle2 } from "lucide-react";
import type { MockNotification, NotificationSensitivity } from "@/lib/notification-rules";
import { notificationCenterCopy } from "@/lib/dashboard-data";
import { Card } from "@/components/ui/card";

type NotificationCenterProps = {
  dailyDigestEnabled: boolean;
  eventCount: number;
  notifications: MockNotification[];
  sensitivity: NotificationSensitivity;
};

export function NotificationCenter({
  dailyDigestEnabled,
  eventCount,
  notifications,
  sensitivity,
}: NotificationCenterProps) {
  const patternNotificationCount = notifications.filter(
    (notification) => notification.id !== "daily-digest",
  ).length;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
            <Bell aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              {notificationCenterCopy.label}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">{notificationCenterCopy.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {notificationCenterCopy.summary(
                eventCount,
                sensitivity,
                patternNotificationCount,
                dailyDigestEnabled,
              )}
            </p>
          </div>
        </div>
        <span className="w-fit rounded-full bg-surface-soft px-4 py-2 text-sm font-bold text-primary">
          {notificationCenterCopy.noPerCryAlerts}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className="rounded-2xl border border-border bg-surface-elevated/82 p-4" key={notification.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{notification.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {notification.body}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-bold text-primary">
                  {notification.time}
                </span>
              </div>
              <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
                {notificationCenterCopy.ruleLabel}: {notification.rule}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-border bg-surface-elevated/82 p-4">
            <div className="flex gap-3">
              <BellOff aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                {notificationCenterCopy.empty}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
