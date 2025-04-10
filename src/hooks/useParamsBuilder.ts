import { useSearchParams } from 'react-router-dom';

// Return getter and setter functions for URL search parameters
export default function useParamsBuilder() {
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    // Values: string
    str: function (name: string) {
      return [
        searchParams.get(name) || '',
        function (value: string) {
          setSearchParams((prev) => {
            if (value) prev.set(name, value);
            else prev.delete(name);
            return prev;
          });
        },
      ] as const;
    },
    // Values: number | undefined
    num: function (name: string) {
      return [
        (function () {
          const valueGet = searchParams.get(name);
          if (!valueGet) return undefined;
          const valueNumber = +valueGet;
          if (isNaN(valueNumber)) return undefined;
          return valueNumber;
        })(),
        function (value: number | undefined) {
          setSearchParams((prev) => {
            if (value !== undefined) prev.set(name, String(value));
            else prev.delete(name);
            return prev;
          });
        },
      ] as const;
    },
    // Values: true | false | undefined
    tristate: function (name: string) {
      return [
        (function () {
          const valueGet = searchParams.get(name);
          if (!valueGet) return undefined;
          try {
            const result = JSON.parse(valueGet || '');
            return typeof result === 'boolean' ? result : undefined;
          } catch {
            return undefined;
          }
        })(),
        function (value: boolean | undefined) {
          setSearchParams((prev) => {
            if (value !== undefined) prev.set(name, String(value));
            else prev.delete(name);
            return prev;
          });
        },
      ] as const;
    },
  };
}
