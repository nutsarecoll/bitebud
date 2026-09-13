import { createRoot } from "react-dom/client";
import HomePage from "./app/page";
import HowItWorksPage from "./app/how-it-works/page";
import AppPreviewPage from "./app/app-preview/page";
import SafetyPage from "./app/safety/page";
import FaqPage from "./app/faq/page";
import ContactPage from "./app/contact/page";
import { Header } from "./components/site/header";
import { Footer } from "./components/site/footer";
import { siteMeta } from "./lib/content";
import "./app/globals.css";

const pages: Record<string, typeof HomePage> = {
  "/": HomePage,
  "/how-it-works": HowItWorksPage,
  "/app-preview": AppPreviewPage,
  "/safety": SafetyPage,
  "/faq": FaqPage,
  "/contact": ContactPage,
};
const path = window.location.pathname.replace(/\/$/, "") || "/";
const Page = pages[path];
document.title = siteMeta.title;
document
  .querySelector('meta[name="description"]')
  ?.setAttribute("content", siteMeta.description);
createRoot(document.getElementById("root")!).render(
  <>
    <a
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      href="#main-content"
    >
      Skip to content
    </a>
    <Header />
    <main id="main-content">
      {Page ? (
        <Page />
      ) : (
        <section className="mx-auto max-w-6xl px-5 py-24">
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <a className="mt-6 inline-block text-primary underline" href="/">
            Back to home
          </a>
        </section>
      )}
    </main>
    <Footer />
  </>,
);
