
import { useCallback, useRef } from 'react';

export const useBackgroundTasks = () => {
  const schedulerRef = useRef<typeof requestIdleCallback | null>(null);

  const scheduleTask = useCallback((task: () => void, options?: { timeout?: number }) => {
    if ('requestIdleCallback' in window) {
      return requestIdleCallback(task, options);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      return setTimeout(task, 0);
    }
  }, []);

  const cancelTask = useCallback((taskId: number) => {
    if ('cancelIdleCallback' in window) {
      cancelIdleCallback(taskId);
    } else {
      clearTimeout(taskId);
    }
  }, []);

  return { scheduleTask, cancelTask };
};
