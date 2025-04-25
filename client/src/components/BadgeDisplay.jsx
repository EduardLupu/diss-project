export default function BadgeDisplay({ badges }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 text-center"
        >
          <div className="text-4xl mb-4">{badge.emoji}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {badge.title}
          </h3>
          <p className="text-gray-600">{badge.description}</p>
          {badge.earned && (
            <div className="mt-4 text-teal-400 font-medium">
              🎉 Earned!
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 