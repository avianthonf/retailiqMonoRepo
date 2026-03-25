"use client";

import { useRef } from "react";
import { useCountUp } from "react-countup";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 2,
  decimals = 0,
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const countUpRef = useRef<HTMLSpanElement>(null);

  useCountUp({
    ref: countUpRef,
    end,
    duration,
    decimals,
    prefix,
    separator: ",",
  });

  return <span ref={countUpRef} className={className} />;
}
