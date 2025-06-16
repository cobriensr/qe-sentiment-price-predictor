// src/components/ui/NavBar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/analyze', label: 'Analyze' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/analytics', label: 'Analytics' },
  ]

  const isActive = (href: string) => {
    return pathname === href || (pathname === '/' && href === '/analyze')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              Earnings Sentiment Analyzer
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    isActive(item.href)
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/analyze"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Analyzing
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
