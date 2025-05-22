'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { jwtDecode } from 'jwt-decode'
import apiService from '@/app/service/apiService'

export default function BadgesPage() {
    const [badges, setBadges] = useState([])

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const token = localStorage.getItem('authToken')
                if (!token) return

                const decoded = jwtDecode(token)
                const userId = decoded.userId

                const data = await apiService.get(`/api/badge/user/${userId}`)
                setBadges(data)
            } catch (err) {
                console.error("Failed to fetch badges", err)
            }
        }

        fetchBadges()
    }, [])

    return (
        <ProtectedRoute>
            <div className="px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Badges</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {badges.map((badge) => {
                        const isEarned = badge.earned

                        const cardBase = `rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md transition-all duration-300 border`
                        const cardStyle = isEarned
                            ? 'bg-white text-black border-green-200'
                            : 'bg-gray-200 text-gray-500 border-gray-300'

                        const emojiStyle = isEarned ? 'text-6xl mb-2' : 'text-6xl mb-2 opacity-40'

                        return (
                            <div
                                key={badge.id}
                                className={`${cardBase} ${cardStyle}`}
                            >
                                <div className={emojiStyle}>{badge.image}</div>
                                <h2 className="text-lg font-semibold mb-1">{badge.title}</h2>
                                <p className="text-sm">{badge.description}</p>
                                {isEarned && (
                                    <p className="text-green-500 mt-2 text-sm font-medium">✅ Earned</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </ProtectedRoute>
    )
}
