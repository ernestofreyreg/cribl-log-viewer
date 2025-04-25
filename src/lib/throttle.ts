export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: number | null = null;

  return function (...args: any[]) {
    if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
      }, wait);
    }
  } as T;
}
