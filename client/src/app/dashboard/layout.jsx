'use client'

import {useEffect, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'
import Link from 'next/link'
import UserMenu from '@/components/UserMenu'
import {ToastContainer} from "react-toastify";

export default function DashboardLayout({children}) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (!userData) {
            router.push('/')
        } else {
            setUser(JSON.parse(userData))
        }
    }, [router])

    if (!user) {
        return null
    }

    const isActive = (path) => {
        if (path === '/dashboard') {
            return pathname === path
        }
        return pathname.startsWith(path)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false}/>
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard" className="flex items-center space-x-2">
                                    <img src="/favicon/favicon-32x32.png" alt="EduWave Logo" className="h-8 w-8" />
                                    <span className="text-xl font-bold text-teal-600">
                                        EduWave
                                    </span>
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/dashboard')
                                            ? 'border-teal-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/library"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/dashboard/library')
                                            ? 'border-teal-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Library
                                </Link>
                                <Link
                                    href="/dashboard/lessons"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/dashboard/lessons')
                                            ? 'border-teal-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Lessons
                                </Link>

                                <Link
                                    href="/dashboard/badges"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/dashboard/badges')
                                            ? 'border-teal-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Badges
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <UserMenu
                                userName={user.name}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="min-h-[calc(100vh-4rem)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {children}
                </div>
            </main>
        </div>
    )
} 