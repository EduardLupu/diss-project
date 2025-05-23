import Link from 'next/link'
import { useState } from 'react'

export default function LibraryCard({ title, description, href, icon, isOpened, onOpen }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full border ${isOpened ? 'border-green-200' : 'border-gray-100 hover:border-teal-100'}`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${isOpened ? 'bg-green-100 text-green-700' : 'bg-teal-50'}`}>
          {icon || "📚"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 pr-2">{title}</h3>
            {isOpened && (
              <span className="text-green-500 text-xl" title="Opened">✅</span>
            )}
          </div>

          {/* Description Accordion */}
          {description && (
            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsExpanded(!isExpanded)
                }}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center group"
              >
                {isExpanded ? 'Hide Description' : 'Show Description'}
                <svg
                  className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} group-hover:translate-y-0.5`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isExpanded && (
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {description}
                </div>
              )}
            </div>
          )}

          {/* View PDF Link */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link 
              href={href}
              onClick={(e) => {
                if (!isOpened && onOpen) {
                  onOpen()
                }
              }}
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm group"
            >
              View PDF
              <svg 
                className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 