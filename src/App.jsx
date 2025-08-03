import { useState } from 'react'
import TimeTracker from './day3/TimeTracker'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <TimeTracker/>
    </>
  )
}

export default App
