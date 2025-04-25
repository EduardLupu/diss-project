export default function ReflectionBox({ question, options, onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 my-8 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">❓</span>
        <h3 className="text-lg font-semibold text-gray-900">Reflection</h3>
      </div>
      
      <p className="text-gray-700 mb-4">{question}</p>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{String.fromCharCode(65 + index)}.</span>{' '}
            <span className="text-gray-700">{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 