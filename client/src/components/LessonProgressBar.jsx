export default function LessonProgressBar({ progress, totalSteps }) {
  const percentage = Math.min(progress, 100) // Ensure we don't exceed 100%

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-teal-400 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="text-sm text-gray-600 mt-1 text-right">
        {Math.round(percentage)}% Complete
      </div>
    </div>
  )
} 