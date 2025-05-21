'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { refreshProfilePicture } from '@/app/service/apiService'

export default function UserMenu({ userName }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pictureUrl, setPictureUrl] = useState('/avatars/avatar1.png')
  const menuRef = useRef(null)
  const router = useRouter()
  const API_BASE_URL = 'https://api.eduwave.eduardlupu.com';

  useEffect(() => {
    async function fetchPicture() {
      await refreshProfilePicture()
      const newPicture = localStorage.getItem('picture')
      if (newPicture) {
        setPictureUrl(`${API_BASE_URL}/api/user/getProfilePicture/${newPicture}`);
      }
    }

    fetchPicture()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleEditProfilePhoto = () => {
    router.push('/dashboard/edit-profile')
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center">
          <Image
            src={pictureUrl}
            alt="User avatar"
            width={34}
            height={34}
            className="object-cover"
          />
        </div>
        <span className="font-medium">{userName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <button
            onClick={handleEditProfilePhoto}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Link
              href="/dashboard/edit-profile-photo"
              className="mx-auto block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Edit Profile Photo
            </Link>
          </button>
          <button
            onClick={handleLogout}
            className=" mx-auto block text-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
