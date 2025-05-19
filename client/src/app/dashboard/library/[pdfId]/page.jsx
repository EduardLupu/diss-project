'use client'

import {useState, useEffect} from 'react'
import {useParams} from 'next/navigation'
import {Viewer, Worker} from '@react-pdf-viewer/core'
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PDFPage() {
    const params = useParams()
    const [pdfUrl, setPdfUrl] = useState('')
    const [pdfName, setPdfName] = useState('')
    const defaultLayoutPluginInstance = defaultLayoutPlugin()

    useEffect(() => {
        // Fetch PDF details
        fetch('/api/pdfs')
            .then(res => res.json())
            .then(pdfs => {
                const pdf = pdfs.find(p => p.id === parseInt(params.pdfId))
                if (pdf) {
                    setPdfUrl(`/pdfs/${pdf.filename}`)
                    setPdfName(pdf.filename.replace('.pdf', '').replace(/__/g, ' ').replace(/--/g, ':'))
                }
            })
            .catch(err => console.error('Error fetching PDF:', err))
    }, [params.pdfId])

    if (!pdfUrl) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading PDF...</p>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="h-screen flex flex-col">
                <div className="bg-white p-4 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">{pdfName}</h1>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <div className="h-full">
                            <Viewer
                                fileUrl={pdfUrl}
                                plugins={[defaultLayoutPluginInstance]}
                            />
                        </div>
                    </Worker>
                </div>
            </div>
        </ProtectedRoute>
    )
} 