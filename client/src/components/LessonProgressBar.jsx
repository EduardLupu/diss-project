export default function LessonProgressBar({ progress, totalSteps }) {
  const percentage = Math.min(progress, 100) // Ensure we don't exceed 100%

  return (
    <div className="relative">
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-400 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-teal-500/20 animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Progress</span>
        <span className="font-medium text-teal-600">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
} 