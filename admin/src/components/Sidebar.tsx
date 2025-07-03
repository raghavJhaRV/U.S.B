// src/components/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

// ⚠️ Make sure these all point to /protected/*
const navItems = [
  { label: 'Dashboard',     href: '/protected/dashboard'     },
  { label: 'Teams',         href: '/protected/teams'         },
  { label: 'Programs',      href: '/protected/programs'      },
  { label: 'Registrations', href: '/protected/registration' },
  { label: 'Events',        href: '/protected/event'        },
  { label: 'Payments',      href: '/protected/payments'      },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'px-4 py-2 rounded hover:bg-gray-700',
              pathname === item.href && 'bg-gray-700'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
