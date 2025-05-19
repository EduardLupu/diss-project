'use client'

import { useEffect } from 'react'
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

export default function AuthWrapper({ children }) {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            if (isTokenValid(token)) {
                router.push('/dashboard')
            } else {
                localStorage.removeItem('authToken')
            }
        }
    }, [router])

    return <>{children}</>
}