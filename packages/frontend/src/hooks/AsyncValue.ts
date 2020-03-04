import { useState, useEffect } from "react";

export type AsyncValueState<T> = { loaded: false } | { loaded: true; value: T };

export function useAsyncValue<T>(
  getValue: () => Promise<T>,
  watchValue?: (onValueChanged: (value: T) => void) => () => void
) {
  const [callState, setCallState] = useState<AsyncValueState<T>>({ loaded: false });

  useEffect(() => {
    const fetchValue = async () => {
      setCallState({ loaded: true, value: await getValue() });
    };

    const onValueChanged = (value: T) => {
      setCallState({ loaded: true, value });
    };

    fetchValue();

    if (watchValue) {
      return watchValue(onValueChanged);
    }
  }, [getValue, watchValue]);

  return callState;
}

export type AsyncStore = {
  [property: string]: AsyncValueState<unknown>;
};

export type Values<T> = {
  [P in keyof T]: T[P] extends AsyncValueState<infer V> ? V : never;
};

type LoadedStore = {
  [property: string]: { loaded: true; value: unknown };
};

const allLoaded = (store: AsyncStore): store is LoadedStore => {
  for (const { loaded } of Object.values(store)) {
    if (!loaded) {
      return false;
    }
  }
  return true;
};

export const useAsyncStore = <T extends AsyncStore>(store: T): AsyncValueState<Values<T>> => {
  if (!allLoaded(store)) {
    return { loaded: false };
  }

  return {
    loaded: true,
    value: Object.fromEntries(
      Object.entries(store).map(([property, asyncValueState]) => [property, asyncValueState.value])
    ) as Values<T>
  };
};