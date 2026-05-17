import { useNavigate } from 'react-router-dom'
import { Package, TrendingUp, ShoppingBag, Star, Plus } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useListingStore } from '@/store/useListingStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useBidStore } from '@/store/useBidStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { LISTING_TYPE_COLORS, LISTING_TYPE_LABELS, LISTING_STATUS_COLORS } from '@/mock/listings'
import { ORDER_STATUS_COLORS } from '@/mock/orders'

export default function SupplierDashboard() {
  const currentUser = useRoleGuard(['supplier'])
  const navigate = useNavigate()
  const { listings } = useListingStore()
  const { orders } = useOrderStore()

  if (!currentUser) return null

  const myListings = listings.filter((l) => l.supplierId === currentUser.id)
  const myOrders = orders.filter((o) => o.supplierId === currentUser.id)
  const activeListings = myListings.filter((l) => l.status === 'active')
  const totalRevenue = myOrders.reduce((acc, o) => acc + o.total, 0)
  const totalBids = myListings.reduce((acc, l) => acc + l.bidCount, 0)

  return (
    <PageLayout>
      <PageHeader
        title={`Welcome, ${currentUser.name}`}
        subtitle={currentUser.company}
        action={
          <Button onClick={() => navigate('/supplier/listings/new')}>
            <Plus size={16} /> New Listing
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Active Listings" value={activeListings.length} icon={Package} color="blue" trend={12} />
        <StatsCard title="Total Bids" value={totalBids} icon={TrendingUp} color="green" trend={8} />
        <StatsCard title="Orders" value={myOrders.length} icon={ShoppingBag} color="orange" trend={5} />
        <StatsCard title="Rating" value={currentUser.rating} icon={Star} color="purple" subtitle={`${currentUser.totalDeals} completed deals`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">Recent Listings</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/supplier/listings')}>View all</Button>
          </CardHeader>
          <div className="divide-y divide-gray-50">
            {myListings.slice(0, 4).map((l) => (
              <div key={l.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/marketplace/${l.id}`)}>
                <div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{l.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={LISTING_TYPE_COLORS[l.type]}>{LISTING_TYPE_LABELS[l.type]}</Badge>
                    <span className="text-xs text-gray-400">{l.bidCount} bids</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(l.currentPrice, l.currency)}</p>
                  <Badge className={LISTING_STATUS_COLORS[l.status]}>{l.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">Recent Orders</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/supplier/orders')}>View all</Button>
          </CardHeader>
          {myOrders.length === 0 ? (
            <CardBody><p className="text-sm text-gray-400 text-center py-4">No orders yet</p></CardBody>
          ) : (
            <div className="divide-y divide-gray-50">
              {myOrders.slice(0, 4).map((o) => (
                <div key={o.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{o.listingTitle}</p>
                    <p className="text-xs text-gray-400">{o.buyerName} · {formatDate(o.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(o.total, o.currency)}</p>
                    <Badge className={ORDER_STATUS_COLORS[o.status]}>{o.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  )
}
