import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import DemoDashboard from './components/DemoDashboard';
import { initializeFeatureFlags, setUserContext } from './services/featureFlags';

function App() {
  const [showDemo, setShowDemo] = useState(false);
  const [currentRole, setCurrentRole] = useState(() => {
    // Load role from localStorage on initial mount
    return localStorage.getItem('userRole') || 'user';
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [contextVersion, setContextVersion] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeFeatureFlags();
        await setUserContext(currentRole);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize feature flags:', error);
        setIsInitialized(true); // Still allow app to load
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleRoleChange = async (role: string) => {
    setCurrentRole(role);
    // Persist role to localStorage
    localStorage.setItem('userRole', role);
    await setUserContext(role);
    // Trigger dashboard to re-check flags immediately
    setContextVersion(v => v + 1);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Initializing feature flags...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-800 dark:to-slate-700 text-white p-4 flex justify-between items-center shadow-lg">
          <h1 className="text-2xl font-bold">FitFlag</h1>
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
            aria-label="Toggle Demo Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </button>
        </header> 
        <main className="flex-grow p-4">
          <Dashboard key={contextVersion} />
        </main>
        {showDemo && (
          <DemoDashboard 
            onClose={() => setShowDemo(false)} 
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;