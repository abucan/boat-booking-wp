import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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
