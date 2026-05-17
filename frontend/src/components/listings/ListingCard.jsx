import { useNavigate } from 'react-router-dom'
import { Clock, Tag, TrendingUp, ShoppingCart, Star } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useBidCountdown } from '@/hooks/useBidCountdown'
import { formatCurrency } from '@/utils/formatCurrency'
import { LISTING_TYPE_LABELS, LISTING_TYPE_COLORS } from '@/mock/listings'

export function ListingCard({ listing }) {
  const navigate = useNavigate()
  const { timeLeft, isEnded } = useBidCountdown(listing.endsAt)

  const typeLabel = LISTING_TYPE_LABELS[listing.type]
  const typeColor = LISTING_TYPE_COLORS[listing.type]

  return (
    <Card
      className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200"
      onClick={() => navigate(`/marketplace/${listing.id}`)}
    >
      {listing.images?.[0] && (
        <div className="h-48 overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardBody className="flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Badge className={typeColor}>{typeLabel}</Badge>
          <Badge className="bg-gray-100 text-gray-600">{listing.category}</Badge>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{listing.title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">{listing.supplierRating} · {listing.supplierName}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">
              {listing.type === 'buy_now' ? 'Price per unit' : 'Current bid'}
            </p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(listing.currentPrice, listing.currency)}
            </p>
            <p className="text-xs text-gray-400">per {listing.unit} · MOQ {listing.moq.toLocaleString()}</p>
          </div>

          {listing.type !== 'buy_now' && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <TrendingUp size={12} />
              <span>{listing.bidCount} bids</span>
            </div>
          )}
        </div>

        {listing.type !== 'buy_now' && (
          <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${isEnded ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-600'}`}>
            <Clock size={12} />
            <span>{isEnded ? 'Auction ended' : `Ends in ${timeLeft}`}</span>
          </div>
        )}

        {listing.buyNowPrice && listing.type !== 'buy_now' && (
          <p className="text-xs text-gray-400">
            Buy now: <span className="font-medium text-gray-700">{formatCurrency(listing.buyNowPrice, listing.currency)}</span>
          </p>
        )}
      </CardBody>
    </Card>
  )
}
