import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useListingStore } from '@/store/useListingStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { LISTING_TYPE_COLORS, LISTING_TYPE_LABELS, LISTING_STATUS_COLORS } from '@/mock/listings'

export default function SupplierListings() {
  const currentUser = useRoleGuard(['supplier'])
  const navigate = useNavigate()
  const { listings, deleteListing } = useListingStore()
  const [deleteTarget, setDeleteTarget] = useState(null)

  if (!currentUser) return null

  const myListings = listings.filter((l) => l.supplierId === currentUser.id)

  const handleDelete = () => {
    deleteListing(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <PageLayout>
      <PageHeader
        title="My Listings"
        subtitle={`${myListings.length} total listings`}
        action={
          <Button onClick={() => navigate('/supplier/listings/new')}>
            <Plus size={16} /> New Listing
          </Button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Bids</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Ends</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myListings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 max-w-xs line-clamp-1">{l.title}</p>
                    <p className="text-xs text-gray-400">{l.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={LISTING_TYPE_COLORS[l.type]}>{LISTING_TYPE_LABELS[l.type]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(l.currentPrice, l.currency)}/{l.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.bidCount}</td>
                  <td className="px-6 py-4">
                    <Badge className={LISTING_STATUS_COLORS[l.status]}>{l.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(l.endsAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/marketplace/${l.id}`)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => navigate(`/supplier/listings/${l.id}`)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(l)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {myListings.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No listings yet</p>
              <Button size="sm" className="mt-3" onClick={() => navigate('/supplier/listings/new')}>
                <Plus size={14} /> Create your first listing
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Listing">
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </PageLayout>
  )
}
