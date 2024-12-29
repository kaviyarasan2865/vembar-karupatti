'use client'

import { useState, useEffect } from 'react'
import { Camera } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
// import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminProfile() {
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    profileImage: '/placeholder.svg'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminDetails()
  }, [])

  const fetchAdminDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/profile')
      
      if (!res.ok) {
        throw new Error('Failed to fetch admin details')
      }

      const data = await res.json()
      setAdminData(data)
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error fetching admin details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await res.json()
      setAdminData(prev => ({ ...prev, profileImage: data.imageUrl }))
    } catch (err) {
      setError('Failed to upload image')
      console.error('Error uploading image:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p>vembar karupatti</p>
      </div>


      <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white">
              <Image
                src={adminData.profileImage}
                alt="Profile picture"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <label 
              htmlFor="profile-image"
              className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 ring-2 ring-white"
            >
              <Camera className="w-5 h-5 text-gray-600" />
              <input
                type="file"
                id="profile-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Admin Details */}
        <div className="space-y-6">
          {/* Email Section */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="flex items-center gap-4">
              <input
                type="email"
                id="email"
                value={adminData.email}
                disabled
                className="flex-1 px-4 py-2 bg-gray-50 border rounded-lg text-gray-600 disabled:cursor-not-allowed"
              />
              <Link
                href="/admin/change-email"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                Change email
              </Link>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center gap-4">
              <input
                type="password"
                id="password"
                value="••••••••"
                disabled
                className="flex-1 px-4 py-2 bg-gray-50 border rounded-lg text-gray-600 disabled:cursor-not-allowed"
              />
              <Link
                href="/admin/change-password"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                Change password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}