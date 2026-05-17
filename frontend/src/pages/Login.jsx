import { useNavigate } from 'react-router-dom'
import { Package, ShieldCheck, Store } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'

const accounts = [
  {
    userId: 'u1',
    label: 'Ahmed Hassan',
    subtitle: 'AlphaPack Industries · Egypt',
    description: 'List consumables, browse marketplace, place bids, manage orders',
    tag: 'Trader',
    icon: Store,
    color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    iconColor: 'text-blue-600 bg-blue-100',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    userId: 'u2',
    label: 'Sara Al-Rashid',
    subtitle: 'FreshCo Manufacturing · Saudi Arabia',
    description: 'List consumables, browse marketplace, place bids, manage orders',
    tag: 'Trader',
    icon: Store,
    color: 'border-teal-200 hover:border-teal-400 hover:bg-teal-50',
    iconColor: 'text-teal-600 bg-teal-100',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  {
    userId: 'u3',
    label: 'Platform Admin',
    subtitle: 'BidFMCG Operations',
    description: 'Manage users, moderate listings, resolve disputes, view all orders',
    tag: 'Admin',
    icon: ShieldCheck,
    color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50',
    iconColor: 'text-purple-600 bg-purple-100',
    tagColor: 'bg-purple-100 text-purple-700',
  },
]

export default function Login() {
  const { login } = useUserStore()
  const navigate = useNavigate()

  const handleLogin = (userId, role) => {
    login(userId)
    if (role === 'admin') navigate('/admin/dashboard')
    else navigate('/trader/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <Package size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BidFMCG</h1>
          <p className="text-gray-500 mt-2">FMCG Consumables Bidding Platform</p>
          <p className="text-sm text-gray-400 mt-1 bg-white/60 px-3 py-1 rounded-full inline-block">
            Demo — select an account to continue
          </p>
        </div>

        <div className="grid gap-4">
          {accounts.map(({ userId, label, subtitle, description, tag, icon: Icon, color, iconColor, tagColor }) => (
            <button
              key={userId}
              onClick={() => handleLogin(userId, tag.toLowerCase())}
              className={`flex items-center gap-4 p-5 bg-white rounded-2xl border-2 transition-all duration-200 text-left ${color}`}
            >
              <div className={`p-3 rounded-xl ${iconColor}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
              <span className="text-sm text-gray-400 shrink-0">Enter →</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          No account needed — this is a frontend demo with mock data
        </p>
      </div>
    </div>
  )
}
