/**
 * @component App
 * @summary Root application component with routing configuration
 * @domain core
 * @type root-component
 */

import { BrowserRouter } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './core/contexts/auth';
import { ThemeProvider } from './core/contexts/theme';
import { ErrorBoundary } from './core/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>{router}</AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
