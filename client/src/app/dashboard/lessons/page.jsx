'use client'

import DashboardCard from '@/components/DashboardCard'
import apiService from '../../service/apiService'
import { useEffect, useState, useMemo } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute";
import LessonCardSkeleton from '@/components/LessonCardSkeleton';
import { jwtDecode } from 'jwt-decode'; // fix import here
import { useRouter } from 'next/navigation';
import {toast} from "react-toastify";

export default function LessonsPage() {
    const [lessons, setLessons] = useState([]);
    const [lessonProgress, setLessonProgress] = useState({});
    const [overallProgress, setOverallProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [isTeacher, setIsTeacher] = useState(false);
    const router = useRouter();
    const [lessonToDelete, setLessonToDelete] = useState(null);

    // Open delete modal for selected lesson ID
    const openDeleteModal = (id) => setLessonToDelete(id);
    const closeDeleteModal = () => setLessonToDelete(null);

    // Delete handler
    const handleConfirmDelete = () => {
        apiService.delete(`/api/lesson/${lessonToDelete}`)
            .then(() => {
                setLessons(prev => prev.filter(l => l.id !== lessonToDelete));
                toast.success('Lesson removed successfully');
                closeDeleteModal();
            })
            .catch(err => {
                toast.error('Failed to delete lesson: ' + err.message);
                closeDeleteModal();
            });
    };

    // Handle Delete button click: open confirmation modal
    const handleDelete = (id) => {
        openDeleteModal(id);
    };

    // Decode token and check for ROLE_TEACHER
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const roles = decoded.authorities || [];
                setIsTeacher(roles.includes('ROLE_TEACHER'));
            } catch (err) {
                console.error("Failed to decode JWT:", err);
                setIsTeacher(false);
            }
        }
    }, []);

    useEffect(() => {
        const fetchLessonsAndProgress = async () => {
            try {
                setLoading(true);
                const data = await apiService.get('api/lesson/getAll');
                setLessons(data);

                const progressPromises = data.map(lesson =>
                    apiService.get(`api/lesson-progress/${lesson.id}/status`)
                        .then(progress => ({ lessonId: lesson.id, progress }))
                        .catch(() => ({
                            lessonId: lesson.id,
                            progress: { completed: false, lastCompletedParagraphIndex: -1 }
                        }))
                );

                const progressResults = await Promise.all(progressPromises);
                const progressMap = progressResults.reduce((acc, { lessonId, progress }) => {
                    acc[lessonId] = progress;
                    return acc;
                }, {});

                setLessonProgress(progressMap);
                setError(null);

                const total = data.reduce((acc, lesson) => {
                    const progress = progressMap[lesson.id] || { completed: false, lastCompletedParagraphIndex: -1 };
                    const lessonProgress = lesson.paragraphs?.length > 0
                        ? ((progress.lastCompletedParagraphIndex + 1) / lesson.paragraphs.length) * 100
                        : 0;
                    return acc + lessonProgress;
                }, 0);

                setOverallProgress(total / (data.length || 1));
            } catch (err) {
                console.error('Error fetching lessons:', err);
                setError(err.message || 'Failed to fetch lessons');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonsAndProgress();
    }, []);

    const filteredLessons = useMemo(() => {
        return lessons.filter(lesson => {
            const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lesson.description.toLowerCase().includes(searchTerm.toLowerCase());

            const progress = lessonProgress[lesson.id] || { completed: false, lastCompletedParagraphIndex: -1 };
            const isCompleted = progress.completed || (lesson.paragraphs?.length > 0 && progress.lastCompletedParagraphIndex === lesson.paragraphs.length - 1);
            const isInProgress = !isCompleted && progress.lastCompletedParagraphIndex > -1;

            if (filter === 'completed') return matchesSearch && isCompleted;
            if (filter === 'in-progress') return matchesSearch && isInProgress;
            if (filter === 'not-started') return matchesSearch && !isCompleted && !isInProgress;
            return matchesSearch;
        });
    }, [lessons, lessonProgress, searchTerm, filter]);

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Available Lessons</h1>
                            <p className="mt-1 text-gray-600">Continue your learning journey</p>
                        </div>
                        {isTeacher && (
                            <div className="mt-6">
                                <button
                                    onClick={() => router.push('/dashboard/lessons/teacher')}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                                >
                                    Add Lesson
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Overall Progress</div>
                                <div className="text-2xl font-semibold text-teal-600">
                                    {Math.round(overallProgress)}%
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Available Lessons</div>
                                <div className="text-2xl font-semibold text-gray-900">
                                    {lessons.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                        {['all', 'in-progress', 'completed', 'not-started'].map(option => (
                            <button
                                key={option}
                                onClick={() => setFilter(option)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    filter === option
                                        ? option === 'completed' ? 'bg-green-500 text-white'
                                            : option === 'in-progress' ? 'bg-yellow-500 text-white'
                                                : option === 'not-started' ? 'bg-blue-500 text-white'
                                                    : 'bg-teal-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <LessonCardSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* No Lessons */}
                {!loading && !error && filteredLessons.length === 0 && searchTerm === '' && filter === 'all' && (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-500">No lessons available at the moment.</p>
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredLessons.length === 0 && (searchTerm !== '' || filter !== 'all') && (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-500">No lessons found matching your criteria.</p>
                    </div>
                )}

                {/* Lessons Grid */}
                {!loading && !error && filteredLessons.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLessons.map(lesson => {
                            const progress = lessonProgress[lesson.id] || { completed: false, lastCompletedParagraphIndex: -1 };
                            const isCompleted = progress.completed || (lesson.paragraphs?.length > 0 && progress.lastCompletedParagraphIndex === lesson.paragraphs.length - 1);
                            const isInProgress = !isCompleted && progress.lastCompletedParagraphIndex > -1;

                            return (
                                <div key={lesson.id} className="relative">
                                    <DashboardCard
                                        title={lesson.title}
                                        description={lesson.description}
                                        href={`/dashboard/lessons/${lesson.id}`}
                                        icon={lesson.icon}
                                        estimatedTime={lesson.estimatedTime}
                                        totalParagraphs={lesson.paragraphs?.length || 0}
                                        lastCompletedParagraphIndex={progress.lastCompletedParagraphIndex}
                                        isCompleted={isCompleted}
                                        isInProgress={isInProgress}
                                    />
                                    {isTeacher && (
                                        <button
                                            onClick={() => handleDelete(lesson.id)}
                                            className="absolute bottom-4 right-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {lessonToDelete !== null && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                            <p className="mb-6">Are you sure you want to delete this lesson? This action cannot be undone.</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}
