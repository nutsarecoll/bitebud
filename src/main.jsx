// Only load the selected experience, including its own stylesheet.
const isProject = /^\/bitebud(?:\/|$)/.test(window.location.pathname);
if (isProject) {
  document.title = "BiteBud | Live sensor project";
  import("./dashboard.jsx");
} else {
  import("./innovation/entry.tsx");
}
