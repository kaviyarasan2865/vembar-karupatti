'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/sidebar'
import { Menu } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#ffffff]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 overflow-auto ">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center p-4 border-b border-[#2A2A2A]">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-amber-600 hover:text-amber-800"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {children}
      </main>
    </div>
  )
}