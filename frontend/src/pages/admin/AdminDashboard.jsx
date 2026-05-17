import { Users, Package, TrendingUp, AlertTriangle, DollarSign, ShieldCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useListingStore } from '@/store/useListingStore'
import { useUserStore } from '@/store/useUserStore'
import { useOrderStore } from '@/store/useOrderStore'
import { formatCurrency } from '@/utils/formatCurrency'

const volumeData = [
  { month: 'Dec', gmv: 1200000, deals: 42 },
  { month: 'Jan', gmv: 1450000, deals: 55 },
  { month: 'Feb', gmv: 1800000, deals: 63 },
  { month: 'Mar', gmv: 2100000, deals: 78 },
  { month: 'Apr', gmv: 1950000, deals: 71 },
  { month: 'May', gmv: 2400000, deals: 89 },
]

const categoryData = [
  { name: 'Packaging', value: 45 },
  { name: 'Cleaning', value: 18 },
  { name: 'PPE', value: 14 },
  { name: 'Lubricants', value: 11 },
  { name: 'Additives', value: 8 },
  { name: 'Other', value: 4 },
]

const recentActivity = [
  { type: 'new_listing', actor: 'AlphaPack Industries', detail: 'HDPE Shrink Wrap Film 23 Micron', time: '5m ago', color: 'bg-blue-100 text-blue-700' },
  { type: 'bid_placed', actor: 'FreshCo Manufacturing', detail: 'Bid $22.00 on HDPE Shrink Wrap', time: '12m ago', color: 'bg-green-100 text-green-700' },
  { type: 'order_created', actor: 'SnackCorp Egypt', detail: 'Order placed — Nitrile Gloves', time: '28m ago', color: 'bg-orange-100 text-orange-700' },
  { type: 'user_registered', actor: 'NilePack Ltd.', detail: 'New supplier registration pending KYB', time: '1h ago', color: 'bg-purple-100 text-purple-700' },
  { type: 'dispute', actor: 'MedFoods KSA', detail: 'Dispute raised on order o-0291', time: '2h ago', color: 'bg-red-100 text-red-700' },
]

export default function AdminDashboard() {
  const currentUser = useRoleGuard(['admin'])
  const { listings } = useListingStore()
  const { allUsers } = useUserStore()
  const { orders } = useOrderStore()

  if (!currentUser) return null

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  const pendingVerification = allUsers.filter((u) => !u.verified).length

  return (
    <PageLayout>
      <PageHeader title="Platform Overview" subtitle="BidFMCG Admin Dashboard" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Monthly GMV" value={formatCurrency(2400000)} icon={DollarSign} color="blue" trend={23} />
        <StatsCard title="Active Listings" value={listings.filter((l) => l.status === 'active').length} icon={Package} color="green" trend={12} />
        <StatsCard title="Registered Users" value={allUsers.length} icon={Users} color="orange" trend={8} />
        <StatsCard title="Pending KYB" value={pendingVerification} icon={ShieldCheck} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><span className="font-semibold text-gray-800">Monthly GMV ($)</span></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="gmv" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><span className="font-semibold text-gray-800">Listings by Category (%)</span></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><span className="font-semibold text-gray-800">Recent Activity</span></CardHeader>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="px-6 py-3 flex items-center gap-3">
                <Badge className={item.color}>{item.type.replace('_', ' ')}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{item.actor}</p>
                  <p className="text-xs text-gray-400 truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><span className="font-semibold text-gray-800">Monthly Deals</span></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="deals" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </PageLayout>
  )
}
