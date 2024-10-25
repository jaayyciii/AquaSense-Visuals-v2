import SensorGauge from "../overview/SensorGauge";

// component props
type GaugeProps = {
  current: number;
  range: [number, number];
  threshold: [number, number];
  unit: string;
};

export default function Gauge({ current, range, threshold, unit }: GaugeProps) {
  return (
    <div className="d-flex flex-column justify-content-between bg-white shadow rounded p-4 h-100 w-100">
      <h5 style={{ fontSize: "18px" }}>Sensor Reading</h5>
      <small className="text-muted lh-sm mt-3" style={{ fontSize: "12px" }}>
        <strong>Sensor Range:</strong> {range[0]} {unit} - {range[1]} {unit}
        {threshold[1] !== 340282346638528859811704183484516925440.0 && (
          <>
            <br />
            <strong>Safe Range:</strong> {threshold[0]} {unit} - {threshold[1]}{" "}
            {unit}
          </>
        )}
      </small>
      <div className="align-self-center my-5" style={{ maxWidth: "220px" }}>
        <SensorGauge current={current} range={range} threshold={threshold} />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <h5 className="me-2 mb-0">
          {current.toFixed(2)} {unit}
        </h5>
        <span
          className={`badge ${
            threshold[0] > current
              ? "bg-warning"
              : threshold[1] < current
              ? "bg-danger"
              : "bg-success"
          }`}
          style={{ fontSize: "12px" }}
        >
          {threshold[0] > current
            ? "Too Low"
            : threshold[1] < current
            ? "Too High"
            : "Normal"}
        </span>
      </div>
    </div>
  );
}
