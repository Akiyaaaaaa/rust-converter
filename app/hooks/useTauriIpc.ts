import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface IpcOptions<T> {
  command: string;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useTauriIpc<
  TData = unknown,
  TArgs extends Record<string, unknown> = Record<string, unknown>,
>() {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (
      { command, onSuccess, onError }: IpcOptions<TData>,
      args?: TArgs,
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await invoke<TData>(command, args);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (e: any) {
        const errorMsg =
          typeof e === 'string'
            ? e
            : (e as Error).message || 'Unknown IPC Error';
        setError(errorMsg);
        onError?.(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { execute, data, error, isLoading };
}
