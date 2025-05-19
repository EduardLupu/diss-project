'use client'

import DashboardCard from '@/components/DashboardCard'
import apiService from '../../service/apiService'
import {useEffect, useState} from 'react'
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LessonsPage() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch lessons when component mounts
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const data = await apiService.get('api/lesson/getAll');
                setLessons(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching lessons:', err);
                setError(err.message || 'Failed to fetch lessons');
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Lessons</h1>

                    {loading && <p className="text-gray-500">Loading lessons...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && !error && lessons.length === 0 && (
                        <p className="text-gray-500">No lessons available.</p>
                    )}

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
            </div>
        </ProtectedRoute>
    )
} 