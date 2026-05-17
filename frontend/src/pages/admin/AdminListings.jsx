import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useListingStore } from '@/store/useListingStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { LISTING_TYPE_COLORS, LISTING_TYPE_LABELS, LISTING_STATUS_COLORS } from '@/mock/listings'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminListings() {
  const currentUser = useRoleGuard(['admin'])
  const { listings, moderateListing } = useListingStore()

  if (!currentUser) return null

  return (
    <PageLayout>
      <PageHeader title="Listing Moderation" subtitle={`${listings.length} total listings`} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bids</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 max-w-xs line-clamp-1">{l.title}</p>
                    <p className="text-xs text-gray-400">{l.category}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.supplierName}</td>
                  <td className="px-6 py-4">
                    <Badge className={LISTING_TYPE_COLORS[l.type]}>{LISTING_TYPE_LABELS[l.type]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(l.currentPrice, l.currency)}/{l.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.bidCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(l.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Badge className={LISTING_STATUS_COLORS[l.status]}>{l.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {l.status === 'active' ? (
                        <Button size="sm" variant="danger" onClick={() => moderateListing(l.id, 'cancelled')}>
                          <EyeOff size={14} /> Takedown
                        </Button>
                      ) : (
                        <Button size="sm" variant="success" onClick={() => moderateListing(l.id, 'active')}>
                          <Eye size={14} /> Restore
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageLayout>
  )
}
