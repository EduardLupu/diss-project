'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LibraryPage() {
  const [pdfs, setPdfs] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Fetch PDFs from the public directory
    fetch('/api/pdfs')
      .then(res => res.json())
      .then(data => {
        setPdfs(data)
      })
      .catch(err => console.error('Error fetching PDFs:', err))
  }, [])

  const formatPdfName = (filename) => {
    // Remove .pdf extension
    let name = filename.replace('.pdf', '')
    // Replace __ with space and -- with :
    name = name.replace(/__/g, ' ').replace(/--/g, ':')
    return name
  }

  const getEmoji = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('cognitive') || name.includes('cognition')) return '🧠📚';
    if (name.includes('behavioral') || name.includes('behavior')) return '🐒📚';
    if (name.includes('clinical')) return '🏥';
    if (name.includes('developmental')) return '👶';
    if (name.includes('neuroscience') || name.includes('brain')) return '🧬';
    if (name.includes('social')) return '📚';
    if (name.includes('personality')) return '🧍‍♂️';
    if (name.includes('therapy') || name.includes('intervention')) return '🛋️';
    if (name.includes('psychopathology') || name.includes('disorder')) return '😵‍💫';
    if (name.includes('assessment') || name.includes('diagnosis')) return '📋';
    return '📚';
  }

  const getDescription = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('cognitive') || name.includes('cognition')) return 'Insights into cognitive processes and mental functions';
    if (name.includes('behavioral') || name.includes('behavior')) return 'Studies on behavioral patterns and psychological responses';
    if (name.includes('clinical')) return 'Research and practices in clinical psychology and mental health treatment';
    if (name.includes('developmental')) return 'Psychological development across the lifespan';
    if (name.includes('neuroscience') || name.includes('brain')) return 'Neuroscientific foundations of behavior and thought';
    if (name.includes('social')) return 'Social influences on individual and group behavior';
    if (name.includes('personality')) return 'Theories and research on personality traits and development';
    if (name.includes('therapy') || name.includes('intervention')) return 'Therapeutic techniques and intervention strategies';
    if (name.includes('psychopathology') || name.includes('disorder')) return 'Understanding psychological disorders and their treatments';
    if (name.includes('assessment') || name.includes('diagnosis')) return 'Psychological assessment tools and diagnostic methods';
    return 'Key research and insights in the field of psychology';
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Materials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {pdfs.map((pdf) => (
          <Link 
            key={pdf.id} 
            href={`/dashboard/library/${pdf.id}`}
            className="block p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
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
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Last updated: {new Date(pdf.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 