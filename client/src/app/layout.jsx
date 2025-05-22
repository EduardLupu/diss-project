import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
    title: 'EduWave - Educational Platform',
    description: 'An interactive educational platform focused on reflection and learning',
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