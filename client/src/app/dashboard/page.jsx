'use client'

import Link from 'next/link'
import ProtectedRoute from "@/components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import apiService from '@/app/service/apiService';

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [activities, setActivities] = useState([])  // new state for real activities
    const [stats, setStats] = useState([
        { name: 'Total Lessons', value: '-', emoji: '📚' },
        { name: 'Completed', value: '-', emoji: '✅' },
        { name: 'In Progress', value: '-', emoji: '🚀' },
        { name: 'Badges', value: '-', emoji: '🏆' }
    ])

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (!userData) {
            router.push('/')
        } else {
            setUser(JSON.parse(userData))
        }
    }, [router])

    useEffect(() => {
        if (!user) return;

        async function fetchActivities() {
            try {
                const token = localStorage.getItem('authToken')
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.userId
                const data = await apiService.activity.getActivitiesByUserId(userId)
                setActivities(data)
            } catch (error) {
                console.error('API call failed:', error)
            }
        }

        fetchActivities()
    }, [user])

    // ✅ Moved this hook above the `if (!user)` check
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('authToken')
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.userId

                const [lessonStats, badges] = await Promise.all([
                    apiService.get('api/lesson-progress/stats'),
                    apiService.get(`api/badge/user/${userId}/earned`)
                ])

                const total = lessonStats.totalLessons
                const completed = lessonStats.completedLessons
                const inProgress = lessonStats.inProgressLessons
                const badgeCount = badges.length

                setStats([
                    { name: 'Total Lessons', value: total, emoji: '📚' },
                    { name: 'Completed', value: completed, emoji: '✅' },
                    { name: 'In Progress', value: inProgress, emoji: '🚀' },
                    { name: 'Badges', value: badgeCount, emoji: '🏆' }
                ])
            } catch (err) {
                console.error('Failed to fetch stats:', err)
            }
        }

        fetchStats()
    }, [])

    if (!user) return null

    function getIcon(type) {
        if (type === 'register') {
            return (
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            )
        }
        if (type === 'lesson_start') {
            return (
                <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        }
        if (type === 'lesson_finished') {
            return (
                <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        }
        if (type === 'lesson_finished') {
            return (
                <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 21h8m-4-4v4m0-4a5 5 0 005-5V5H7v7a5 5 0 005 5zm5-10h2a2 2 0 012 2v1a4 4 0 01-4-4zM4 7h2a4 4 0 01-4 4V9a2 2 0 012-2z" />
                </svg>
            )
        }
        return null
    }

    return (
        <ProtectedRoute>
            <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 👋</h1>
                    <p className="mt-2 text-gray-600">Here's what's happening with your learning journey. 🌟</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                            <dt className="text-sm font-medium text-gray-500 truncate flex items-center gap-2">
                                <span className="text-xl">{stat.emoji}</span>
                                {stat.name}
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-teal-600">{stat.value}</dd>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Link href="/dashboard/library"
                          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                <span className="text-xl">📖</span>
                                Study Materials
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">Access your learning resources</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/lessons"
                          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                <span className="text-xl">🎯</span>
                                Continue Learning
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">Pick up where you left off</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/badges"
                          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                <span className="text-xl">🏅</span>
                                Your Badges
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">View your achievements</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="px-6 py-5">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <span className="text-xl">📝</span>
                            Recent Activity
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {activities.slice(0, 3).map((activity) => (
                                <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {getIcon(activity.type)}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {activity.type === 'lesson_start'
                                                        ? `Started the course ${activity.name} 📚`
                                                        : activity.type === 'lesson_finished'
                                                            ? `Finished the course ${activity.name} 🎉`
                                                            : activity.type === 'register'
                                                                ? 'Successfully registered an account! 🎊'
                                                                : activity.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
