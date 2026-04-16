import { type BenchmarkRun } from './benchmarks';

export interface ComparisonCell {
  value: number;
  diff: number;
  better: boolean;
  unit: string;
}

export function compare(
  run1: number,
  run2: number,
  lowerIsBetter: boolean,
  unit: string,
): ComparisonCell {
  const diff = run1 === 0 ? 0 : ((run2 - run1) / run1) * 100;
  return {
    value: run2,
    diff: Math.round(diff * 10) / 10,
    better: lowerIsBetter ? diff < 0 : diff > 0,
    unit,
  };
}

export function compareRun(r1: BenchmarkRun, r2: BenchmarkRun) {
  return {
    add1kJs: compare(r1.add1kJs, r2.add1kJs, true, 'ms'),
    update1kJs: compare(r1.update1kJs, r2.update1kJs, true, 'ms'),
    add1kInp: compare(r1.add1kInp, r2.add1kInp, true, 'ms'),
    update1kInp: compare(r1.update1kInp, r2.update1kInp, true, 'ms'),
    memoryStart: compare(r1.memoryStart, r2.memoryStart, true, 'mb'),
    memoryPeak: compare(r1.memoryPeak, r2.memoryPeak, true, 'mb'),
    memoryEnd: compare(r1.memoryEnd, r2.memoryEnd, true, 'mb'),
  };
}
