'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import apiService from '../../service/apiService'

export default function LibraryPage() {
    const [pdfs, setPdfs] = useState([])
    const [openedPdfIds, setOpenedPdfIds] = useState(new Set())
    const router = useRouter()

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
        if (name.includes('cognitive')) return '🧠📚'
        if (name.includes('behavior')) return '🐒📚'
        if (name.includes('clinical')) return '🏥'
        return '📚'
    }

    const getDescription = (filename) => {
        const name = filename.toLowerCase()
        if (name.includes('cognitive')) return 'Cognitive stuff'
        if (name.includes('behavior')) return 'Behavioral stuff'
        return 'General psychology'
    }

    return (
        <ProtectedRoute>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Materials</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {pdfs.map((pdf) => {
                        const isOpened = openedPdfIds.has(pdf.id)
                        const cardClass = `block p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                            isOpened ? '' : 'border-2 border-red-500'
                        }`

                        return (
                            <Link
                                key={pdf.id}
                                href={`/dashboard/library/${pdf.id}`}
                                className={cardClass}
                                onClick={() => handleOpenPdf(pdf.id)}
                            >
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0 text-4xl">
                                        {getEmoji(pdf.filename)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            {formatPdfName(pdf.filename)}
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                            {getDescription(pdf.filename)}
                                        </p>
                                        <div className="text-sm mt-1">
                                            {isOpened ? (
                                                <span className="text-green-600 font-semibold">Opened ✅</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Not opened ❌</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </ProtectedRoute>
    )
}
