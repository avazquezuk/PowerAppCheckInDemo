import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider } from '@fluentui/react-components'
import PowerProvider from './PowerProvider'
import { ThemeProvider, useTheme } from './context'
import './index.css'
import App from './App.tsx'

function ThemedApp() {
  const { theme } = useTheme();
  return (
    <FluentProvider theme={theme}>
      <App />
    </FluentProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PowerProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </PowerProvider>
  </StrictMode>,
)
