// A small concurrency limiter for the slow, expensive part of checking a proof (running Lean): at most `maxRunning`
// at once, up to `maxQueued` more waiting in line, and anything beyond that is refused straight away so a flood of
// requests cannot pile up work.

export class BusyError extends Error {
  constructor() {
    super("The proof checker is busy right now. Try again in a moment.");
  }
}

export function createLimiter(maxRunning: number, maxQueued: number) {
  let running = 0;
  const waiting: (() => void)[] = [];

  // a finished task hands its slot straight to the next in line (so `running` stays counted), or frees it
  const release = () => {
    const next = waiting.shift();
    if (next) next();
    else running--;
  };

  return {
    /** Runs `task` when a slot is free. Rejects with BusyError when the queue is full. */
    async run<T>(task: () => Promise<T>): Promise<T> {
      if (running >= maxRunning) {
        if (waiting.length >= maxQueued) throw new BusyError();
        await new Promise<void>((resolve) => waiting.push(resolve)); // the slot is handed over by release()
      } else {
        running++;
      }
      try {
        return await task();
      } finally {
        release();
      }
    },
    stats: () => ({ running, queued: waiting.length }),
  };
}
