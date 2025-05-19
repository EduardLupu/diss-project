'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

function isTokenValid(token) {
    try {
        const decoded = jwtDecode(token)
        return decoded.exp * 1000 > Date.now()
    } catch {
        return false
    }
}

export default function ProtectedRoute({ children }) {
    const router = useRouter()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('authToken')

        if (!token || !isTokenValid(token)) {
            localStorage.removeItem('authToken')
            router.replace('/login') // 🔒 redirect if not valid
        } else {
            setChecked(true)
        }
    }, [router])

    if (!checked) return null // or a loading spinner

    return <>{children}</>
}
