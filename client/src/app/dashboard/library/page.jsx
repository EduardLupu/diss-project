'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import apiService from '../../service/apiService'
import LibraryCard from '@/components/LibraryCard'

export default function LibraryPage() {
    const [pdfs, setPdfs] = useState([])
    const [openedPdfIds, setOpenedPdfIds] = useState(new Set())
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = apiService.auth.getCurrentUser()
            if (!currentUser) {
                console.error('User not authenticated')
                return
            }

            try {
                // ✅ Frontend route for PDFs
                const res = await fetch('/api/pdfs')
                const pdfList = await res.json()
                setPdfs(pdfList)

                // ✅ Backend call for opened access
                const openedIds = await apiService.get(`/api/access/${currentUser.id}`)
                setOpenedPdfIds(new Set(openedIds))
            } catch (err) {
                console.error('Error loading data:', err.message || err)
            }
        }

        fetchData()
    }, [])

    const handleOpenPdf = async (pdfId) => {
        if (openedPdfIds.has(pdfId)) return

        const currentUser = apiService.auth.getCurrentUser()
        if (!currentUser) {
            console.error('User not authenticated')
            return
        }

        try {
            await apiService.post('/api/access', {
                userId: currentUser.id,
                pdfId: pdfId,
            })

            setOpenedPdfIds(prev => new Set(prev).add(pdfId))
        } catch (err) {
            console.error('Error sending access mark:', err.message || err)
        }
    }

    const formatPdfName = (filename) => {
        let name = filename.replace('.pdf', '')
        return name.replace(/__/g, ' ').replace(/--/g, ':')
    }

    const getEmoji = (filename) => {
        const name = filename.toLowerCase()
        if (name.includes('knowledge')) return '🧠'
        if (name.includes('network')) return '🌐'
        return '📚'
    }

    const getDescription = (filename) => {
        const name = filename.toLowerCase()
        if (name.includes('social networking')) return 'Explore the role of social networking in enterprise knowledge management and collaboration.'
        if (name.includes('crowds')) return 'Learn how IBM leverages corporate social networking tools to harness collective intelligence.'
        if (name.includes('knowledge sharing')) return 'Discover practices for effective knowledge sharing in complex institutional environments.'
        if (name.includes('innovation')) return 'Understand how social media can be used to involve users in innovation processes.'
        if (name.includes('network sharing')) return 'Study the impact of network sharing on knowledge-sharing activities and job performance.'
        if (name.includes('word-of-mouth')) return 'Explore the influence of electronic word-of-mouth in online customer communities.'
        return 'A valuable resource for understanding enterprise social media and knowledge management.'
    }

    const filteredPdfs = pdfs.filter(pdf => {
        const matchesSearch = formatPdfName(pdf.filename).toLowerCase().includes(searchTerm.toLowerCase())
        const isOpened = openedPdfIds.has(pdf.id)

        if (filter === 'opened') return matchesSearch && isOpened
        if (filter === 'not-opened') return matchesSearch && !isOpened
        return matchesSearch // 'all' filter
    })

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
                            <p className="mt-1 text-gray-600">Access your learning resources and research papers</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Total Resources</div>
                                <div className="text-2xl font-semibold text-gray-900">
                                    {pdfs.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    filter === 'all'
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('opened')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    filter === 'opened'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Opened
                            </button>
                            <button
                                onClick={() => setFilter('not-opened')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    filter === 'not-opened'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Not Opened
                            </button>
                        </div>
                    </div>
                </div>

                {/* No Results Found State */}
                {filteredPdfs.length === 0 && (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-500">No resources found matching your criteria.</p>
                    </div>
                )}

                {/* PDFs Grid */}
                {filteredPdfs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPdfs.map((pdf) => (
                            <LibraryCard
                                key={pdf.id}
                                title={formatPdfName(pdf.filename)}
                                description={getDescription(pdf.filename)}
                                href={`/dashboard/library/${pdf.id}`}
                                icon={getEmoji(pdf.filename)}
                                isOpened={openedPdfIds.has(pdf.id)}
                                onOpen={() => handleOpenPdf(pdf.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}
