import { useState, useEffect } from 'react'
import { TrendingUp, Clock, Zap, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useBidCountdown } from '@/hooks/useBidCountdown'
import { useBidStore } from '@/store/useBidStore'
import { useListingStore } from '@/store/useListingStore'
import { useUserStore } from '@/store/useUserStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'

export function BidPanel({ listing }) {
  const { currentUser } = useUserStore()
  const { getByListing, placeBid, addSimulatedBid } = useBidStore()
  const { updatePrice } = useListingStore()
  const { timeLeft, isEnded } = useBidCountdown(listing.endsAt)
  const [bidAmount, setBidAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const bids = getByListing(listing.id)
  const leadingBid = bids[0]
  const minBid = listing.currentPrice + 0.5
  const isOwnListing = currentUser?.id === listing.supplierId

  useEffect(() => {
    if (listing.type !== 'open_bid' || isEnded) return
    const interval = setInterval(() => {
      const shouldBid = Math.random() < 0.3
      if (shouldBid) {
        const newPrice = listing.currentPrice + Math.round(Math.random() * 10 + 1) * 0.5
        addSimulatedBid(listing.id, newPrice)
        updatePrice(listing.id, newPrice)
      }
    }, 12000)
    return () => clearInterval(interval)
  }, [listing.id, listing.type, listing.currentPrice, isEnded])

  const handleBid = () => {
    const amount = parseFloat(bidAmount)
    setError('')
    if (!bidAmount || isNaN(amount)) {
      setError('Please enter a valid amount')
      return
    }
    if (amount < minBid) {
      setError(`Minimum bid is ${formatCurrency(minBid, listing.currency)}`)
      return
    }
    if (!currentUser) {
      setError('Please log in to place a bid')
      return
    }
    placeBid(listing.id, currentUser.id, currentUser.company, amount)
    updatePrice(listing.id, amount)
    setBidAmount('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleBuyNow = () => {
    alert(`Purchase initiated for ${formatCurrency(listing.buyNowPrice, listing.currency)} per ${listing.unit}. This would proceed to checkout.`)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">
              {listing.type === 'buy_now' ? 'Purchase' : listing.type === 'sealed_bid' ? 'Submit Quote' : 'Place Bid'}
            </span>
            {!isEnded && listing.type !== 'buy_now' && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                <Clock size={14} />
                {timeLeft}
              </div>
            )}
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">
              {listing.type === 'buy_now' ? 'Unit price' : 'Current bid'}
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(listing.currentPrice, listing.currency)}
              <span className="text-sm font-normal text-gray-400 ml-1">/ {listing.unit}</span>
            </p>
            {listing.type === 'open_bid' && (
              <p className="text-xs text-gray-400 mt-0.5">{listing.bidCount} bids placed</p>
            )}
          </div>

          {isEnded && <Badge className="bg-gray-100 text-gray-600 w-fit">Auction ended</Badge>}

          {isOwnListing && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              This is your listing — you cannot bid on your own listings.
            </p>
          )}

          {!isEnded && listing.type === 'open_bid' && currentUser && !isOwnListing && (
            <div className="flex flex-col gap-3">
              <Input
                label={`Your bid (min. ${formatCurrency(minBid, listing.currency)})`}
                type="number"
                step="0.5"
                min={minBid}
                placeholder={minBid.toFixed(2)}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                error={error}
              />
              {submitted && <p className="text-sm text-green-600 font-medium">Bid placed successfully!</p>}
              <Button onClick={handleBid} className="w-full">
                <TrendingUp size={16} />
                Place Bid
              </Button>
            </div>
          )}

          {!isEnded && listing.type === 'sealed_bid' && currentUser && !isOwnListing && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-500 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg">
                Sealed bid — your quote is hidden from competitors.
              </p>
              <Input
                label="Your quote per unit"
                type="number"
                step="0.5"
                placeholder="Enter your price"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                error={error}
              />
              {submitted && <p className="text-sm text-green-600 font-medium">Quote submitted!</p>}
              <Button variant="secondary" onClick={handleBid} className="w-full">
                Submit Sealed Quote
              </Button>
            </div>
          )}

          {listing.type === 'buy_now' && currentUser && !isOwnListing && (
            <Button onClick={handleBuyNow} className="w-full">
              <Zap size={16} />
              Buy Now
            </Button>
          )}

          {listing.buyNowPrice && listing.type === 'open_bid' && !isEnded && currentUser && !isOwnListing && (
            <Button variant="secondary" onClick={handleBuyNow} className="w-full">
              Buy Now for {formatCurrency(listing.buyNowPrice, listing.currency)}
            </Button>
          )}

          {!currentUser && (
            <p className="text-sm text-center text-gray-500">
              <a href="/login" className="text-blue-600 font-medium hover:underline">Log in</a> to bid or purchase
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-3">
            <ShieldCheck size={14} className="text-green-500" />
            <span>Escrow-protected. Funds released on delivery confirmation.</span>
          </div>
        </CardBody>
      </Card>

      {bids.length > 0 && listing.type === 'open_bid' && (
        <Card>
          <CardHeader>
            <span className="text-sm font-semibold text-gray-800">Bid History</span>
          </CardHeader>
          <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
            {bids.slice(0, 8).map((bid) => (
              <div key={bid.id} className="px-4 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{bid.bidderName}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(bid.placedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(bid.amount, listing.currency)}</p>
                  {bid.status === 'leading' && (
                    <Badge className="bg-green-100 text-green-700 text-xs">Leading</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
