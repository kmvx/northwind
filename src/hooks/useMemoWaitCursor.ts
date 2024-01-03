import * as React from 'react';

export default function useMemoWaitCursor<T>(
  factory: () => T,
  deps: React.DependencyList,
): T | undefined {
  //return React.useMemo(factory, deps);

  // Waiting state
  const [isWaiting, setIsWaiting] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.classList.toggle('u-wait', isWaiting);
  }, [isWaiting]);

  // Value state
  const [value, setValue] = React.useState<T>();
  React.useEffect(() => {
    setIsWaiting(true);
    // Timeout to render a new cursor
    setTimeout(() => {
      try {
        setValue(factory());
      } finally {
        setIsWaiting(false);
      }
    }, 50);
  }, deps);
  return value;
}
