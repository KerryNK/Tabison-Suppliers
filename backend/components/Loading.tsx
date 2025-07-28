import type React from "react"

interface LoadingProps {
  message?: string
  size?: "small" | "medium" | "large"
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
      ></div>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  )
}

export default Loading
