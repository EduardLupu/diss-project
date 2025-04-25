import Link from 'next/link'

export default function DashboardCard({ title, description, href, icon }) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full">
        <div className="flex items-center space-x-4">
          {icon && (
            <div className="text-3xl">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="mt-2 text-gray-600">{description}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
} 