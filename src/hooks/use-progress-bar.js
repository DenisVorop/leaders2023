import { useEffect, useReducer, useRef } from 'react';

let waitController;

export function useProgressBar({
  trickleMaxWidth = 94,
  trickleIncrementMin = 1,
  trickleIncrementMax = 5,
  dropMinSpeed = 50,
  dropMaxSpeed = 150,
  transitionSpeed = 600
} = {}) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const widthRef = useRef(0);

  function setWidth(value) {
    widthRef.current = value;
    forceUpdate();
  }

  async function trickle() {
    if (widthRef.current < trickleMaxWidth) {
      const inc =
        widthRef.current +
        getRandomInt(trickleIncrementMin, trickleIncrementMax); // ~3
      setWidth(inc);
      try {
        await wait(getRandomInt(dropMinSpeed, dropMaxSpeed) /* ~100 ms */, {
          signal: waitController.signal || null
        });
        await trickle();
      } catch {
      }
    }
  }

  async function start() {
    waitController?.abort();
    waitController = new AbortController();

    setWidth(1);
    await wait(0);
    await trickle();
  }

  async function complete() {
    setWidth(100);
    try {
      await wait(transitionSpeed, { signal: waitController.signal });
      setWidth(0);
    } catch {
    }
  }

  function reset() {
    waitController?.abort();
    setWidth(0);
  }

  useEffect(() => {
    return () => {
      waitController?.abort();
    };
  }, []);

  return {
    start,
    complete,
    reset,
    width: widthRef.current
  };
}

export function wait(ms, options = { signal: null}) {
    const { signal } = options;
  
    return new Promise((resolve, reject) => {
      if (signal?.aborted) reject(signal.reason);
  
      const id = setTimeout(() => {
        resolve();
        signal?.removeEventListener('abort', abort);
      }, ms);
  
      function abort() {
        clearTimeout(id);
        reject(signal?.reason);
      }
  
      signal?.addEventListener('abort', abort);
    });
  }

  export const getRandomInt = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;
