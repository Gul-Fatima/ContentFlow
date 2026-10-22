import { useCallback, useEffect, useState, type DependencyList } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: unknown;
  requestKey: string | null;
  fn: () => Promise<T>;
}

interface AsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  reload: () => void;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: DependencyList
): AsyncResult<T> {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    requestKey: null,
    fn,
  });
  const reload = useCallback(() => setReloadToken((token) => token + 1), []);
  const requestKey = `${reloadToken}:${JSON.stringify(deps)}`;

  useEffect(() => {
    let active = true;
    fn()
      .then((data) => {
        if (active) setState({ data, error: null, requestKey, fn });
      })
      .catch((error: unknown) => {
        if (active) setState((current) => ({
          data: current.data,
          error,
          requestKey,
          fn,
        }));
      });

    return () => {
      active = false;
    };
  }, [fn, requestKey]);

  const isCurrentRequest = state.fn === fn && state.requestKey === requestKey;
  return {
    data: state.data,
    error: isCurrentRequest ? state.error : null,
    loading: !isCurrentRequest,
    reload,
  };
}
