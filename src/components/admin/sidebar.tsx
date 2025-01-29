'use client'

import * as React from 'react'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import logo from '../../../public/assets/logo.png'
import { LogOut, Settings,FolderKanban, X ,ListOrdered,ShoppingCart,ChartBarStacked,MessageSquareText} from 'lucide-react'
// import { signOut } from "next-auth/react"

export default function Sidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();

  // const handleSignOut = async () => {
  //   try {
  //     await signOut({ 
  //       redirect: true,
  //       callbackUrl: '/' 
  //     });
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      href: '/admin/dashboard',
      icon: FolderKanban,
      label: 'Dashboard'
    },
    {
          href: '/admin/dashboard/categories',
          icon: ChartBarStacked,
          label: 'Categories'
    },
    {
      href: '/admin/dashboard/products',
      icon: ShoppingCart,
      label: 'Products'
    },
    {
      href: '/admin/dashboard/orders',
      icon: ListOrdered,
      label: 'Orders'
    },
    // {
    //   href: '/admin/dashboard/users',
    //   icon: User,
    //   label: 'Users'
    // },
    // {
    //   href: '/admin/dashboard/cms',
    //   icon: TableOfContents,
    //   label: 'CMS'
    // },
    {
      href:'/admin/dashboard/messages',
      icon:MessageSquareText,
      label:'Messages'
    },
    {
        href: '/admin/dashboard/settings',
        icon: Settings,
        label: 'Settings'
        }
  ];
 
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[99]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-[100]
        flex h-screen w-64 flex-col bg-[#fff4c7] transform transition-transform duration-200 ease-in-out
        pointer-events-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-[60px] items-center justify-between border-b border-[#999762] px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image
              src={logo} 
              alt="CatMod AI Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-amber-800">
              Vembar <span className="text-green-700">Karupatti</span>
            </span>
          </Link>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-amber-600 hover:text-amber-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 
                      ${isActive 
                        ? 'bg-amber-800 text-white' 
                        : 'text-amber-800 hover:bg-amber-800 hover:text-white'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-[#2A2A2A] p-3">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-amber-800 hover:bg-orange-300"
          >
            <LogOut className="h-5 w-5 text-amber-800 hover:text-white"/>
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}