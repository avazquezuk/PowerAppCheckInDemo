import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components';
import { HistoryPage, RecentActivityPage } from './components/history';
import { EmployeeProfile } from './components/employee';
import { LoginScreen } from './components/auth';
import { ServiceProvider, UserProvider } from './context';
import { useUser } from './context/UserContext';

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <h1 style={{ color: '#c00', margin: 0 }}>Application Error</h1>
          <p style={{ margin: 0 }}>Something went wrong while loading the app.</p>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '10px', 
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.message}
            </pre>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '10px', 
              overflow: 'auto',
              fontSize: '10px'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { isAuthenticated, login, loading, error } = useUser();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} isLoading={loading} error={error} />;
  }

  return (
    <ServiceProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recent" element={<RecentActivityPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<EmployeeProfile />} />
        </Routes>
      </HashRouter>
    </ServiceProvider>
  );
}

export default App;
