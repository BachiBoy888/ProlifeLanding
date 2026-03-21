import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAnalytics, setUserProperties } from './lib/analytics'

initAnalytics();

const userProps: Record<string, unknown> = {
  device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
};
const utmSource = new URLSearchParams(window.location.search).get('utm_source');
if (utmSource) userProps.utm_source = utmSource;
setUserProperties(userProps);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
