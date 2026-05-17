import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, TrendingUp, ShoppingBag, Star, Plus, ArrowRight } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ListingCard } from '@/components/listings/ListingCard'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useListingStore } from '@/store/useListingStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useBidStore } from '@/store/useBidStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { LISTING_TYPE_COLORS, LISTING_TYPE_LABELS, LISTING_STATUS_COLORS } from '@/mock/listings'
import { ORDER_STATUS_COLORS } from '@/mock/orders'

const TABS = ['Selling', 'Buying']

export default function TraderDashboard() {
  const currentUser = useRoleGuard(['trader'])
  const navigate = useNavigate()
  const [tab, setTab] = useState('Selling')
  const { listings } = useListingStore()
  const { orders } = useOrderStore()
  const { getByBidder } = useBidStore()

  if (!currentUser) return null

  const myListings = listings.filter((l) => l.supplierId === currentUser.id)
  const ordersReceived = orders.filter((o) => o.supplierId === currentUser.id)
  const ordersPlaced = orders.filter((o) => o.buyerId === currentUser.id)
  const myBids = getByBidder(currentUser.id)
  const leadingBids = myBids.filter((b) => b.status === 'leading')
  const activeListings = myListings.filter((l) => l.status === 'active')
  const totalBids = myListings.reduce((acc, l) => acc + l.bidCount, 0)
  const recommended = listings.filter((l) => l.status === 'active' && l.supplierId !== currentUser.id).slice(0, 3)

  return (
    <PageLayout>
      <PageHeader
        title={`Welcome, ${currentUser.name}`}
        subtitle={currentUser.company}
        action={
          <Button onClick={() => navigate('/trader/listings/new')}>
            <Plus size={16} /> New Listing
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Active Listings" value={activeListings.length} icon={Package} color="blue" trend={12} />
        <StatsCard title="Bids Received" value={totalBids} icon={TrendingUp} color="green" trend={8} />
        <StatsCard title="Leading Bids" value={leadingBids.length} icon={TrendingUp} color="orange" />
        <StatsCard title="Rating" value={currentUser.rating ?? 'N/A'} icon={Star} color="purple" subtitle={currentUser.totalDeals ? `${currentUser.totalDeals} deals` : ''} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Selling' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">My Listings</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/trader/listings')}>View all</Button>
            </CardHeader>
            {myListings.length === 0 ? (
              <CardBody>
                <p className="text-sm text-gray-400 text-center py-4">No listings yet</p>
                <Button size="sm" className="mx-auto block" onClick={() => navigate('/trader/listings/new')}>
                  <Plus size={14} /> Create listing
                </Button>
              </CardBody>
            ) : (
              <div className="divide-y divide-gray-50">
                {myListings.slice(0, 5).map((l) => (
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
            )}
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">Orders Received</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/trader/orders')}>View all</Button>
            </CardHeader>
            {ordersReceived.length === 0 ? (
              <CardBody><p className="text-sm text-gray-400 text-center py-4">No orders received yet</p></CardBody>
            ) : (
              <div className="divide-y divide-gray-50">
                {ordersReceived.slice(0, 5).map((o) => (
                  <div key={o.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{o.listingTitle}</p>
                      <p className="text-xs text-gray-400">From {o.buyerName} · {formatDate(o.createdAt)}</p>
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
      )}

      {tab === 'Buying' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">My Active Bids</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/trader/bids')}>View all</Button>
              </CardHeader>
              {leadingBids.length === 0 ? (
                <CardBody><p className="text-sm text-gray-400 text-center py-4">No active bids</p></CardBody>
              ) : (
                <div className="divide-y divide-gray-50">
                  {leadingBids.slice(0, 5).map((bid) => {
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
                <span className="font-semibold text-gray-800">Orders Placed</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/trader/orders')}>View all</Button>
              </CardHeader>
              {ordersPlaced.length === 0 ? (
                <CardBody><p className="text-sm text-gray-400 text-center py-4">No orders placed yet</p></CardBody>
              ) : (
                <div className="divide-y divide-gray-50">
                  {ordersPlaced.slice(0, 5).map((o) => (
                    <div key={o.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{o.listingTitle}</p>
                        <p className="text-xs text-gray-400">From {o.supplierName} · {formatDate(o.createdAt)}</p>
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
              {recommended.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
