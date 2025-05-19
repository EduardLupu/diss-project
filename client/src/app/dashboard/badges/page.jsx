'use client'

import BadgeDisplay from '@/components/BadgeDisplay'
import ProtectedRoute from "@/components/ProtectedRoute";

// Mock data for badges
const badges = [
    {
        id: '1',
        title: 'First Steps',
        description: 'Completed your first lesson',
        emoji: '👣',
        earned: true
    },
    {
        id: '2',
        title: 'Quick Learner',
        description: 'Completed 3 lessons in a row',
        emoji: '⚡',
        earned: false
    },
    {
        id: '3',
        title: 'Master of Basics',
        description: 'Completed all beginner lessons',
        emoji: '🎓',
        earned: false
    },
    {
        id: '4',
        title: 'Quiz Champion',
        description: 'Scored perfectly on 5 quizzes',
        emoji: '🏆',
        earned: false
    },
    {
        id: '5',
        title: 'Reflection Master',
        description: 'Answered all reflection questions',
        emoji: '💭',
        earned: false
    }
]

export default function BadgesPage() {
    return (
        <ProtectedRoute>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Badges</h1>
                <BadgeDisplay badges={badges}/>
            </div>
        </ProtectedRoute>
    )
} 