import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_BIDS } from '@/mock/bids'

export const useBidStore = create(
  persist(
    (set, get) => ({
      bids: MOCK_BIDS,

      getByListing: (listingId) =>
        get()
          .bids.filter((b) => b.listingId === listingId)
          .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)),

      getByBidder: (bidderId) =>
        get()
          .bids.filter((b) => b.bidderId === bidderId)
          .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)),

      placeBid: (listingId, bidderId, bidderName, amount) => {
        set((state) => ({
          bids: [
            {
              id: `b${Date.now()}`,
              listingId,
              bidderId,
              bidderName,
              amount,
              placedAt: new Date().toISOString(),
              status: 'leading',
            },
            ...state.bids.map((b) =>
              b.listingId === listingId && b.status === 'leading'
                ? { ...b, status: 'outbid' }
                : b
            ),
          ],
        }))
      },

      addSimulatedBid: (listingId, amount) => {
        const competitors = ['NilePack Co.', 'MedFoods KSA', 'SunriseIndustries', 'GulfPack Ltd']
        const competitor = competitors[Math.floor(Math.random() * competitors.length)]
        set((state) => ({
          bids: [
            {
              id: `b${Date.now()}`,
              listingId,
              bidderId: `sim-${Date.now()}`,
              bidderName: competitor,
              amount,
              placedAt: new Date().toISOString(),
              status: 'leading',
            },
            ...state.bids.map((b) =>
              b.listingId === listingId && b.status === 'leading'
                ? { ...b, status: 'outbid' }
                : b
            ),
          ],
        }))
      },
    }),
    { name: 'bidding-bids' }
  )
)
