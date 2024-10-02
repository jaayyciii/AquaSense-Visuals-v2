import { useCallback, useEffect } from "react";
import { HistoryType } from "../home/SensorDetailPanel";

const ExtrapolationDataPoints: number = 4;

// component props
type NumericsProps = {
  current: number;
  unit: string;
  history: HistoryType[];
  predict: number;
  setPredict: React.Dispatch<React.SetStateAction<number>>;
};

export default function Numerics({
  current,
  unit,
  history,
  predict,
  setPredict,
}: NumericsProps) {
  // calculates the extrapolated value in the next 30 minutes using Lagrange
  const lagrangeInterpolation = useCallback(
    (x: number, xValues: number[], yValues: number[]): number => {
      const n = xValues.length;
      let result = 0;

      for (let i = 0; i < n; i++) {
        let term = yValues[i];
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            term *= (x - xValues[j]) / (xValues[i] - xValues[j]);
          }
        }
        result += term;
      }
      return result;
    },
    []
  );

  // gets the latest <ExtrapolationDataPoints> (as xy) values as data for extrapolation
  useEffect(() => {
    const dataset = history.slice(0, ExtrapolationDataPoints);
    if (dataset.length < ExtrapolationDataPoints) return () => setPredict(0);

    const xValues = dataset.map(({ timestamp }) => timestamp!.getTime());
    const yValues = dataset.map(({ data }) => data!);
    const nextThirtyMinutes = dataset[0].timestamp!.getTime() + 1800000;
    setPredict(lagrangeInterpolation(nextThirtyMinutes, xValues, yValues));
  }, [history, lagrangeInterpolation]);

  return (
    <div className="d-flex flex-column gap-3 gap-md-4 h-100 w-100">
      {/* Current Real-time Value */}
      <div className="bg-primary shadow rounded p-4 h-100">
        <h5 className="text-white" style={{ fontSize: "18px" }}>
          Real-time Value
        </h5>
        <h2 className="my-2 text-white">
          {current.toFixed(2)} {unit}
        </h2>
      </div>
      {/* Predicted Value in the next 30 minutes */}
      <div className="bg-primary shadow rounded p-4 h-100">
        <h5 className="text-white" style={{ fontSize: "18px" }}>
          Predicted Value (+30 minutes)
        </h5>
        <h2 className="my-2 text-white">
          {predict.toFixed(2)} {unit}
        </h2>
      </div>
    </div>
  );
}
