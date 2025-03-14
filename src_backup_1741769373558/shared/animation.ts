import { lerp } from '@krutoo/utils';

interface AnimationConfig {
  duration: number;
  from: number;
  to: number;
  effect: (current: number) => void;
  easing?: (x: number) => number;
}

interface Animation {
  play(): Promise<void>;
  stop(): void;
  isPlaying(): boolean;
}

export const easing = {
  linear(x: number): number {
    return x;
  },

  easeInCubic(x: number): number {
    return x * x * x;
  },

  easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  },

  easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },
} as const;

export function createAnimation({
  duration,
  from,
  to,
  effect,
  easing: ease = easing.linear,
}: AnimationConfig): Animation {
  let playing = false;
  let startTime = Date.now();
  let finishTime = Date.now();
  let finishListener: VoidFunction;

  const loop = () => {
    const now = Date.now();

    if (!playing) {
      finishListener?.();
      return;
    }

    if (now < finishTime) {
      effect(lerp(from, to, ease(1 - (finishTime - now) / (finishTime - startTime))));
      requestAnimationFrame(loop);
    } else {
      playing = false;
      effect(to);
      finishListener?.();
    }
  };

  return {
    play: () => {
      return new Promise<void>(resolve => {
        playing = true;
        startTime = Date.now();
        finishTime = startTime + duration;

        finishListener = resolve;
        loop();
      });
    },
    stop: () => {
      playing = false;
    },
    isPlaying: () => {
      return playing;
    },
  };
}
