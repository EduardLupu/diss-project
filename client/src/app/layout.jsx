import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
    title: 'EduWave - Educational Platform',
    description: 'An interactive educational platform focused on reflection and learning',
    icons: {
        icon: [
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/favicon/favicon.ico',
        apple: '/favicon/apple-touch-icon.png',
        other: [
            {
                rel: 'android-chrome-192x192',
                url: '/favicon/android-chrome-192x192.png',
            },
            {
                rel: 'android-chrome-512x512',
                url: '/favicon/android-chrome-512x512.png',
            },
        ],
    },
    manifest: '/favicon/site.webmanifest',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-gray-100">
        <AuthWrapper>
            <main className="mx-auto">
                {children}
            </main>
            {/* ✅ Add ToastContainer once here */}
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />
        </AuthWrapper>
        </body>
        </html>
    )
}