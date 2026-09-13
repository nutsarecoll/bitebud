import { DashboardDemo } from "@/components/dashboard/dashboard-demo";
import { PageHero } from "@/components/marketing/page-hero";
import { AppPreviewPanel } from "@/components/marketing/app-preview-panel";
import { marketingPages } from "@/lib/content";

export default function AppPreviewPage() {
  const copy = marketingPages.appPreview;

  return (
    <>
      <PageHero
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
      >
        <AppPreviewPanel />
      </PageHero>
      <DashboardDemo />
    </>
  );
}
