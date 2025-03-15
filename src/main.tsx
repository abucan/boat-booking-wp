import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    renderBookingWidget: (
      container: HTMLElement,
      props: BookingWidgetProps
    ) => void;
  }
}

// Create a root element if it doesn't exist
const rootElement =
  document.getElementById("root") ||
  (() => {
    const el = document.createElement("div");
    el.id = "root";
    document.body.appendChild(el);
    return el;
  })();

// Render the app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// For external usage (WordPress)
interface BookingWidgetProps {
  buttonText: string;
  language: string;
}

function renderBookingWidget(
  container: HTMLElement,
  props: BookingWidgetProps
) {
  createRoot(container).render(
    <StrictMode>
      <App buttonText={props.buttonText} language={props.language} />
    </StrictMode>
  );
}

// Expose the function globally
window.renderBookingWidget = renderBookingWidget;
