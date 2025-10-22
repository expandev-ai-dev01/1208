/**
 * @module core/hooks/useRouting/types
 * @summary Type definitions for useRouting hook
 */

import { Location, Params } from 'react-router-dom';

export interface UseRoutingReturn {
  navigate: (path: string, options?: { replace?: boolean; state?: any }) => void;
  navigateBack: () => void;
  location: Location;
  params: Readonly<Params<string>>;
  query: URLSearchParams;
  getQueryParam: (key: string) => string | null;
  setQueryParam: (key: string, value: string) => void;
}
