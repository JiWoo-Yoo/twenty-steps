import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="container">
    Work in Progress...
      <div className="box">
        <div className="box-inner">
          
        <button onClick={()=>{
          setCount(count + 1)
        }}>{count}</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
