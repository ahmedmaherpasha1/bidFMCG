import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Bell, ChevronDown, Package } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { currentUser, logout } = useUserStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLinks = {
    trader: [
      { to: '/trader/dashboard', label: 'Dashboard' },
      { to: '/marketplace', label: 'Marketplace' },
      { to: '/trader/listings', label: 'My Listings' },
      { to: '/trader/bids', label: 'My Bids' },
      { to: '/trader/orders', label: 'Orders' },
      { to: '/trader/rfq', label: 'RFQs' },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Overview' },
      { to: '/marketplace', label: 'Marketplace' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/listings', label: 'Listings' },
      { to: '/admin/orders', label: 'Orders' },
      { to: '/admin/disputes', label: 'Disputes' },
    ],
  }

  const links = currentUser ? roleLinks[currentUser.role] || [] : []

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-lg">
              <Package size={22} />
              <span>BidFMCG</span>
            </Link>

            {currentUser && (
              <div className="hidden md:flex items-center gap-1">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {currentUser.avatar}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{currentUser.name}</span>
                    <span className="text-xs text-gray-400 capitalize">{currentUser.role}</span>
                  </div>
                  <button onClick={handleLogout} className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log In</Button>
                <Button size="sm" onClick={() => navigate('/register')}>Register</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
