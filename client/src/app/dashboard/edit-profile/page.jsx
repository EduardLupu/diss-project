'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { updateProfilePicture, uploadProfilePicture, getProfilePicture } from '@/app/service/apiService'
import { useRef } from 'react'

const avatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  'upload'
]

export default function EditProfilePhotoPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const handleSelectAvatar = async (avatarUrl) => {
    const avatar = avatarUrl.split("/")[2];
    await updateProfilePicture(avatar);
    localStorage.setItem('picture', avatar);
    await getProfilePicture(avatar); // Cache image as base64
    window.location.href = '/dashboard';
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadProfilePicture(formData);

      // Use original filename or backend-supplied name
      const filename = file.name;
      await updateProfilePicture(filename);
      localStorage.setItem('picture', filename);
      await getProfilePicture(filename); // Cache image as base64

      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <div className="py-10 flex items-center justify-center bg-teal-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">Choose a Profile Photo</h2>
        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar, index) =>
            avatar === 'upload' ? (
              <label
                key="upload"
                className="flex items-center justify-center w-20 h-20 border rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                <span className="text-xl text-gray-500">+</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <button
                key={index}
                onClick={() => handleSelectAvatar(avatar)}
                className="rounded-full overflow-hidden border w-20 h-20 hover:scale-105 transition"
              >
                <Image
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  width={80}
                  height={80}
                />
              </button>
            )
          )}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
