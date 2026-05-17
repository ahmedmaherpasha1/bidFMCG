import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, FileText, Package, Calendar } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { BidPanel } from '@/components/listings/BidPanel'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useListingStore } from '@/store/useListingStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { LISTING_TYPE_LABELS, LISTING_TYPE_COLORS, LISTING_STATUS_COLORS } from '@/mock/listings'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById } = useListingStore()
  const listing = getById(id)

  if (!listing) {
    return (
      <PageLayout>
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">Listing not found</p>
          <Button variant="ghost" onClick={() => navigate('/marketplace')} className="mt-4">
            Back to Marketplace
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {listing.images?.[0] && (
            <div className="rounded-2xl overflow-hidden h-72 bg-gray-100">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={LISTING_TYPE_COLORS[listing.type]}>{LISTING_TYPE_LABELS[listing.type]}</Badge>
              <Badge className={LISTING_STATUS_COLORS[listing.status]}>{listing.status}</Badge>
              <Badge className="bg-gray-100 text-gray-600">{listing.category}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span>{listing.supplierRating}</span>
              </div>
              <span>·</span>
              <span>{listing.supplierName}</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Listed {formatDate(listing.createdAt)}</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader><span className="font-semibold text-gray-800">Description</span></CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {listing.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">#{tag}</span>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><span className="font-semibold text-gray-800">Specifications</span></CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(listing.specs).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><span className="font-semibold text-gray-800">Commercial Terms</span></CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Quantity Available</p>
                  <p className="text-sm font-medium text-gray-800">{listing.quantityAvailable.toLocaleString()} {listing.unit}s</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Min. Order Quantity</p>
                  <p className="text-sm font-medium text-gray-800">{listing.moq.toLocaleString()} {listing.unit}s</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Delivery Terms</p>
                  <p className="text-sm font-medium text-gray-800">{listing.deliveryTerms}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment Terms</p>
                  <p className="text-sm font-medium text-gray-800">{listing.paymentTerms}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Bid panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BidPanel listing={listing} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
