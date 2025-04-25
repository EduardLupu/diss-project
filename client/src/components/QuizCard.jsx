export default function QuizCard({ question, options, selected, onSelect, isLocked }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      </div>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isLocked && onSelect(index)}
            disabled={isLocked}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selected === index
                ? 'border-teal-400 bg-teal-50'
                : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50'
            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-medium text-gray-900">
              {String.fromCharCode(65 + index)}.
            </span>{' '}
            <span className="text-gray-700">{option}</span>
          </button>
        ))}
      </div>
      
      {isLocked && (
        <div className="mt-4 text-center text-gray-500">
          Complete the lesson to unlock the quiz
        </div>
      )}
    </div>
  )
} 