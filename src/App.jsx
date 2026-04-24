import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/Garmin-dashboard/garmin_daily_latest.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  const chartData = [
    { name: 'Steps', value: data.steps },
    { name: 'Stress', value: data.stress },
    { name: 'Battery', value: data.bodyBattery }
  ]

  return (
    <div style={{ padding: 20 }}>
      <h1>Garmin AI Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        <Card title="Steps" value={data.steps} />
        <Card title="Sleep" value={data.sleepHours} />
        <Card title="HR" value={data.restingHeartRate} />
      </div>

      <h2>Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2>AI Insight</h2>
      <p>{generateAdvice(data)}</p>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 10 }}>
      <h3>{title}</h3>
      <strong>{value}</strong>
    </div>
  )
}

function generateAdvice(d) {
  if (d.sleepHours < 6) return 'Kevés alvás → ma könnyű nap'
  if (d.stress > 70) return 'Magas stressz → pihenj'
  if (d.bodyBattery < 40) return 'Alacsony energia → ne squasholj maxon'
  return 'Jó forma → mehet a squash'
}
