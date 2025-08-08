"use client"

import { useState } from "react"

const Counter = ({ initialValue = 0, min = 0, max = 100, onChange }) => {
  const [count, setCount] = useState(initialValue)

  const increment = () => {
    if (count < max) {
      const newCount = count + 1
      setCount(newCount)
      if (onChange) onChange(newCount)
    }
  }

  const decrement = () => {
    if (count > min) {
      const newCount = count - 1
      setCount(newCount)
      if (onChange) onChange(newCount)
    }
  }

  const handleInputChange = (e) => {
    const value = Number.parseInt(e.target.value) || 0
    if (value >= min && value <= max) {
      setCount(value)
      if (onChange) onChange(value)
    }
  }

  return (
    <div className="counter-container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        onClick={decrement}
        disabled={count <= min}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: count <= min ? "#f5f5f5" : "#fff",
          cursor: count <= min ? "not-allowed" : "pointer",
        }}
      >
        -
      </button>

      <input
        type="number"
        value={count}
        onChange={handleInputChange}
        min={min}
        max={max}
        style={{
          width: "60px",
          padding: "4px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          textAlign: "center",
        }}
      />

      <button
        onClick={increment}
        disabled={count >= max}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: count >= max ? "#f5f5f5" : "#fff",
          cursor: count >= max ? "not-allowed" : "pointer",
        }}
      >
        +
      </button>
    </div>
  )
}

export default Counter
