'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiService from "@/app/service/apiService";
import { toast } from "react-toastify";

export default function EditLessonPage() {
    const router = useRouter();
    const params = useParams();
    const lessonId = params.lessonId; // assuming your route is /dashboard/lessons/edit/[id]

    // States
    const [title, setTitle] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [description, setDescription] = useState('');
    const [paragraphs, setParagraphs] = useState(['']);
    const [questions, setQuestions] = useState([
        { question: '', optionA: '', optionB: '', optionC: '', correctAnswer: '' },
        { question: '', optionA: '', optionB: '', optionC: '', correctAnswer: '' },
        { question: '', optionA: '', optionB: '', optionC: '', correctAnswer: '' }
    ]);

    // Badge states
    const [badgeImage, setBadgeImage] = useState('🏅'); // default emoji
    const [badgeTitle, setBadgeTitle] = useState('');
    const [badgeDescription, setBadgeDescription] = useState('');

    // Fetch lesson, questions, badges on mount
    useEffect(() => {
        if (!lessonId) return;

        async function fetchData() {
            try {
                // Get lesson
                const lesson = await apiService.get(`api/lesson/${lessonId}`);
                setTitle(lesson.title || '');
                setEstimatedTime(lesson.estimatedTime || '');
                setDescription(lesson.description || '');
                setParagraphs((lesson.paragraphs && lesson.paragraphs.length > 0) ? lesson.paragraphs : ['']);

                // Get questions (should always return 3)
                const fetchedQuestions = await apiService.get(`api/question/lesson/${lessonId}`);
                if (fetchedQuestions && fetchedQuestions.length === 3) {
                    setQuestions(fetchedQuestions);
                }

                // Get badges (list but usually one)
                const badges = await apiService.get(`api/badge/lesson/${lessonId}`);
                if (badges && badges.length > 0) {
                    const b = badges[0];
                    setBadgeTitle(b.title || '');
                    setBadgeDescription(b.description || '');
                    setBadgeImage(b.image || '🏅');
                }
            } catch (error) {
                console.error('Failed to fetch lesson data:', error);
                toast.error('Failed to load lesson data.');
            }
        }

        fetchData();
    }, [lessonId]);

    // Handlers - same as add page
    const handleParagraphChange = (index, value) => {
        const updated = [...paragraphs];
        updated[index] = value;
        if (value !== '' && index === paragraphs.length - 1) {
            updated.push('');
        }
        setParagraphs(updated);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const allQuestionFieldsFilled = questions.every(q =>
        q.question && q.optionA && q.optionB && q.optionC && q.correctAnswer
    );

    // Submit handler - adjust to your update endpoints or keep as POST if your backend supports it
    const handleSubmit = async (e) => {
        e.preventDefault();

        const filteredParagraphs = paragraphs.filter(p => p.trim() !== '');
        if (
            !title || !estimatedTime || !description || !filteredParagraphs.length || !allQuestionFieldsFilled ||
            !badgeTitle || !badgeDescription || !badgeImage
        ) {
            toast.error('Please fill in all fields including badge and questions.');
            return;
        }

        const lesson = {
            title,
            estimatedTime,
            description,
            paragraphs: filteredParagraphs,
        };

        const badge = {
            title: badgeTitle,
            description: badgeDescription,
            image: badgeImage,
        };

        try {
            // Update lesson (change to PUT if your API supports it)
            await apiService.put(`api/lesson/${lessonId}`, lesson);

            // Update questions: since you have 3 fixed, update all 3 one by one
            const fetchedQuestions = await apiService.get(`api/question/lesson/${lessonId}`);
            for (let i = 0; i < 3; i++) {
                const questionId = fetchedQuestions[i].id;
                const questionData = questions[i];
                await apiService.put(`api/question/${questionId}`, questionData);
            }

            // Update badge (assuming one badge)
            const fetchedBadges = await apiService.get(`api/badge/lesson/${lessonId}`);
            await apiService.put(`api/badge/${fetchedBadges[0].id}`, badge);

            router.push('/dashboard/lessons');
            toast.success('Lesson updated successfully! 🎉');
        } catch (error) {
            console.error('Error updating lesson, questions or badge:', error);
            toast.error('Failed to update lesson, questions or badge.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Edit Lesson</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Same form as AddLessonPage */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-1">📘 Lesson Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter an engaging title..."
                        className="w-full px-5 py-3 text-lg rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-1">⏱️ Estimated Time</label>
                    <input
                        type="text"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                        placeholder="e.g., 30 minutes or 5-6 minutes"
                        className="w-full px-5 py-3 text-lg rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-1">📝 Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Briefly describe the lesson..."
                        className="w-full px-5 py-3 text-lg rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-1">📄 Paragraphs</label>
                    {paragraphs.map((paragraph, index) => (
                        <textarea
                            key={index}
                            value={paragraph}
                            onChange={(e) => handleParagraphChange(index, e.target.value)}
                            rows={4}
                            placeholder={`Enter paragraph ${index + 1}...`}
                            className="w-full px-5 py-3 mb-4 text-lg font-medium rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition placeholder-gray-400"
                        />
                    ))}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mt-6 mb-2">Questions</h2>
                    {questions.map((q, index) => (
                        <div key={index} className="p-4 mb-4 border rounded-md bg-gray-50 space-y-3">
                            <label className="block text-lg font-medium">Question {index + 1}</label>

                            <input
                                type="text"
                                placeholder="Question"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />

                            <input
                                type="text"
                                placeholder="Option A"
                                value={q.optionA}
                                onChange={(e) => handleQuestionChange(index, 'optionA', e.target.value)}
                                className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />

                            <input
                                type="text"
                                placeholder="Option B"
                                value={q.optionB}
                                onChange={(e) => handleQuestionChange(index, 'optionB', e.target.value)}
                                className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />

                            <input
                                type="text"
                                placeholder="Option C"
                                value={q.optionC}
                                onChange={(e) => handleQuestionChange(index, 'optionC', e.target.value)}
                                className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />

                            <select
                                value={q.correctAnswer}
                                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                                className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="">Select Correct Answer</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Badge</h2>

                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-800 mb-1">Logo</label>
                        <select
                            value={badgeImage}
                            onChange={(e) => setBadgeImage(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            style={{ fontSize: '1.5rem', width: '120px' }}
                        >
                            {['🥇', '❤️', '🏆', '🔥', '🚀','👌','😼','🎓','🧠'].map((emoji) => (
                                <option key={emoji} value={emoji}>
                                    {emoji}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-800 mb-1">Badge Title</label>
                        <input
                            type="text"
                            value={badgeTitle}
                            onChange={(e) => setBadgeTitle(e.target.value)}
                            placeholder="Enter badge title"
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-800 mb-1">Badge Description</label>
                        <textarea
                            value={badgeDescription}
                            onChange={(e) => setBadgeDescription(e.target.value)}
                            rows={3}
                            placeholder="Describe how the badge is earned"
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            required
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        type="submit"
                        className="w-3/4 bg-teal-600 hover:bg-teal-700 text-white text-xl py-3 rounded-xl font-semibold transition"
                    >
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/lessons')}
                        className="w-1/4 bg-gray-400 hover:bg-gray-500 text-white text-xl py-3 rounded-xl font-semibold transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
