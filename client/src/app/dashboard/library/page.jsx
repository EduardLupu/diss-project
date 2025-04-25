'use client'

import Link from 'next/link'

// Mock data for library items
const libraryItems = [
  {
    id: '1',
    title: 'Web Development Best Practices',
    description: 'A comprehensive guide to modern web development practices and patterns',
    category: 'Web Development',
    date: '2024-03-15'
  },
  {
    id: '2',
    title: 'CSS Grid Layout',
    description: 'Master the grid system for modern responsive layouts',
    category: 'CSS',
    date: '2024-03-10'
  },
  {
    id: '3',
    title: 'JavaScript Fundamentals',
    description: 'Essential concepts and patterns in JavaScript programming',
    category: 'JavaScript',
    date: '2024-03-05'
  },
  {
    id: '4',
    title: 'React Hooks Guide',
    description: 'Deep dive into React Hooks and their practical applications',
    category: 'React',
    date: '2024-02-28'
  }
]

export default function LibraryPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Study Materials</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryItems.map((item) => (
            <Link 
              key={item.id} 
              href={`/dashboard/library/${item.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                  <span className="text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="text-sm text-gray-500">
                  Added on {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 