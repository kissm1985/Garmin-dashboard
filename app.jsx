const { useEffect, useState } = React;

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("garmin_daily_latest.json")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Garmin Dashboard</h1>
      <div className="grid">
        <Card title="Steps" value={data.steps} />
        <Card title="Calories" value={data.calories} />
        <Card title="Sleep" value={data.sleepHours} />
        <Card title="HR" value={data.restingHeartRate} />
        <Card title="Stress" value={data.stress} />
        <Card title="Body Battery" value={data.bodyBattery} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
