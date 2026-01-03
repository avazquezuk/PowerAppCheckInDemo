import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components';
import { HistoryPage, RecentActivityPage } from './components/history';
import { EmployeeProfile } from './components/employee';
import { ServiceProvider } from './context';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ServiceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recent" element={<RecentActivityPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<EmployeeProfile />} />
          </Routes>
        </BrowserRouter>
      </ServiceProvider>
    </ErrorBoundary>
  );
}

export default App;
