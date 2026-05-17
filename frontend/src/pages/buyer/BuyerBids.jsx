import { useNavigate } from 'react-router-dom'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useBidStore } from '@/store/useBidStore'
import { useListingStore } from '@/store/useListingStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'

export default function BuyerBids() {
  const currentUser = useRoleGuard(['buyer'])
  const navigate = useNavigate()
  const { getByBidder } = useBidStore()
  const { listings } = useListingStore()

  if (!currentUser) return null

  const myBids = getByBidder(currentUser.id)

  return (
    <PageLayout>
      <PageHeader title="My Bids" subtitle={`${myBids.length} bids placed`} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placed At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myBids.map((bid) => {
                const listing = listings.find((l) => l.id === bid.listingId)
                return (
                  <tr key={bid.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate(`/marketplace/${bid.listingId}`)}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{listing?.title || 'Unknown listing'}</p>
                      <p className="text-xs text-gray-400">{listing?.supplierName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {formatCurrency(bid.amount, listing?.currency || 'USD')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={bid.status === 'leading' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                        {bid.status === 'leading' ? 'Leading' : 'Outbid'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(bid.placedAt)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                      {listing ? formatCurrency(listing.currentPrice, listing.currency) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {myBids.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>No bids placed yet. <a href="/marketplace" className="text-blue-600 hover:underline">Browse listings</a></p>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  )
}
