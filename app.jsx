const { useEffect, useState } = React;

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('garmin_daily_latest.json?v=' + Date.now())
      .then(res => res.json())
      .then(setData)
      .catch(() => setData({
        steps: 8420,
        calories: 2350,
        sleepHours: 7.2,
        restingHeartRate: 54,
        stress: 38,
        bodyBattery: 72
      }));
  }, []);

  if (!data) return <div className="container">Adatok betöltése...</div>;

  return (
    <div className="container">
      <header className="hero">
        <div>
          <span className="eyebrow">Garmin + AI Coach</span>
          <h1>Napi állapot dashboard</h1>
          <p>{new Date().toLocaleDateString('hu-HU')} · alvás, stressz, energia és squash ajánlás</p>
        </div>
      </header>

      <section className="grid">
        <Metric title="Lépések" value={data.steps} unit="lépés" />
        <Metric title="Kalória" value={data.calories} unit="kcal" />
        <Metric title="Alvás" value={data.sleepHours} unit="óra" />
        <Metric title="Nyugalmi pulzus" value={data.restingHeartRate} unit="bpm" />
        <Metric title="Stressz" value={data.stress} unit="/100" />
        <Metric title="Body Battery" value={data.bodyBattery} unit="/100" />
      </section>

      <section className="panel">
        <h2>AI napi ajánlás</h2>
        <p className="advice">{getAdvice(data)}</p>
      </section>

      <section className="panel">
        <h2>Regenerációs jelzőlámpa</h2>
        <div className="scoreRow">
          <Score label="Alvás" value={Math.min(100, Math.round((data.sleepHours || 0) / 8 * 100))} />
          <Score label="Stressz" value={Math.max(0, 100 - (data.stress || 0))} />
          <Score label="Energia" value={data.bodyBattery || 0} />
        </div>
      </section>
    </div>
  );
}

function Metric({ title, value, unit }) {
  return (
    <div className="card">
      <span>{title}</span>
      <strong>{value ?? '-'}</strong>
      <small>{unit}</small>
    </div>
  );
}

function Score({ label, value }) {
  return (
    <div className="score">
      <div className="scoreTop"><span>{label}</span><b>{value}</b></div>
      <div className="bar"><div style={{ width: value + '%' }}></div></div>
    </div>
  );
}

function getAdvice(d) {
  if ((d.sleepHours || 0) < 6) return 'Kevés alvás látszik. Ma inkább regeneráló napot vagy könnyű technikai squash-t javaslok.';
  if ((d.stress || 0) > 70) return 'Magas stresszszint látszik. Ma kerüld a maximális intenzitást, legyen több pihenő.';
  if ((d.bodyBattery || 0) < 40) return 'Alacsony Body Battery. Ma ne menj maxon squashban, inkább mobilitás és könnyű mozgás.';
  return 'Jó állapot látszik. Mehet a normál aktivitás, akár squash is, de figyelj a hidratálásra.';
}

ReactDOM.createRoot(document.getElementById('root')).render(<Dashboard />);
