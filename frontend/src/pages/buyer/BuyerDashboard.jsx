import { useNavigate } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Clock, Star, ArrowRight } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ListingCard } from '@/components/listings/ListingCard'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useBidStore } from '@/store/useBidStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useListingStore } from '@/store/useListingStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { ORDER_STATUS_COLORS } from '@/mock/orders'

export default function BuyerDashboard() {
  const currentUser = useRoleGuard(['buyer'])
  const navigate = useNavigate()
  const { getByBidder } = useBidStore()
  const { orders } = useOrderStore()
  const { listings } = useListingStore()

  if (!currentUser) return null

  const myBids = getByBidder(currentUser.id)
  const myOrders = orders.filter((o) => o.buyerId === currentUser.id)
  const leadingBids = myBids.filter((b) => b.status === 'leading')
  const recentListings = listings.filter((l) => l.status === 'active').slice(0, 3)

  return (
    <PageLayout>
      <PageHeader
        title={`Welcome, ${currentUser.name}`}
        subtitle={currentUser.company}
        action={
          <Button onClick={() => navigate('/marketplace')}>
            Browse Marketplace <ArrowRight size={16} />
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Active Bids" value={leadingBids.length} icon={TrendingUp} color="blue" />
        <StatsCard title="Total Bids" value={myBids.length} icon={Clock} color="orange" />
        <StatsCard title="Orders" value={myOrders.length} icon={ShoppingBag} color="green" />
        <StatsCard title="Rating" value={currentUser.rating ?? 'N/A'} icon={Star} color="purple" subtitle={currentUser.totalDeals ? `${currentUser.totalDeals} deals` : ''} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">My Active Bids</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/buyer/bids')}>View all</Button>
          </CardHeader>
          {leadingBids.length === 0 ? (
            <CardBody><p className="text-sm text-gray-400 text-center py-4">No active bids</p></CardBody>
          ) : (
            <div className="divide-y divide-gray-50">
              {leadingBids.slice(0, 4).map((bid) => {
                const listing = listings.find((l) => l.id === bid.listingId)
                return (
                  <div key={bid.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/marketplace/${bid.listingId}`)}>
                    <div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{listing?.title || 'Unknown listing'}</p>
                      <p className="text-xs text-gray-400">{formatDate(bid.placedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{formatCurrency(bid.amount, listing?.currency || 'USD')}</p>
                      <Badge className="bg-green-100 text-green-700">Leading</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">Recent Orders</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/buyer/orders')}>View all</Button>
          </CardHeader>
          {myOrders.length === 0 ? (
            <CardBody><p className="text-sm text-gray-400 text-center py-4">No orders yet</p></CardBody>
          ) : (
            <div className="divide-y divide-gray-50">
              {myOrders.slice(0, 4).map((o) => (
                <div key={o.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{o.listingTitle}</p>
                    <p className="text-xs text-gray-400">{o.supplierName} · {formatDate(o.createdAt)}</p>
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recommended Listings</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/marketplace')}>Browse all <ArrowRight size={14} /></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentListings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>
    </PageLayout>
  )
}
