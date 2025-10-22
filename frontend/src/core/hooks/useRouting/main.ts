/**
 * @hook useRouting
 * @summary Hook for routing operations and navigation
 * @domain core
 * @type routing-hook
 * @category navigation
 */

import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import type { UseRoutingReturn } from './types';

export const useRouting = (): UseRoutingReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const query = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options);
  };

  const navigateBack = () => {
    navigate(-1);
  };

  const getQueryParam = (key: string) => {
    return query.get(key);
  };

  const setQueryParam = (key: string, value: string) => {
    query.set(key, value);
    navigate(`${location.pathname}?${query.toString()}`, { replace: true });
  };

  return {
    navigate: navigateTo,
    navigateBack,
    location,
    params,
    query,
    getQueryParam,
    setQueryParam,
  };
};
