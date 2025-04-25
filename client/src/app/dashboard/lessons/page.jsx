'use client'

import DashboardCard from '@/components/DashboardCard'

// Mock data for lessons
const lessons = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    icon: '📚',
    progress: 0
  },
  {
    id: '2',
    title: 'Responsive Design',
    description: 'Master the art of creating responsive layouts',
    icon: '🎨',
    progress: 0
  },
  {
    id: '3',
    title: 'JavaScript Fundamentals',
    description: 'Deep dive into JavaScript programming',
    icon: '⚡',
    progress: 0
  },
  {
    id: '4',
    title: 'Advanced CSS Techniques',
    description: 'Learn advanced CSS features and best practices',
    icon: '🎯',
    progress: 0
  },
  {
    id: '5',
    title: 'React Basics',
    description: 'Introduction to React and component-based development',
    icon: '⚛️',
    progress: 0
  }
]

export default function LessonsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Lessons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map(lesson => (
          <DashboardCard
            key={lesson.id}
            title={lesson.title}
            description={lesson.description}
            href={`/dashboard/lessons/${lesson.id}`}
            icon={lesson.icon}
          />
        ))}
      </div>
    </div>
  )
} 