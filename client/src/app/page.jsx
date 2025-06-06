'use client'

import Link from 'next/link'
import WaveAnimation from '../components/WaveAnimation'

export default function HomePage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">

            <img src={"/biglogo.webp"} alt="EduWave Logo" className="mx-auto mb-3 w-48 h-48" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to EduWave</h1>
            <p className="text-xl text-gray-600 mb-8">Your personal learning platform</p>

            <div className="flex justify-center gap-4">
              <Link
                  href="/login"
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                  href="/register"
                  className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-teal-600"
              >
                Create Account
              </Link>
            </div>
            <WaveAnimation />
          </div>
        </div>
      </div>
  )
}
