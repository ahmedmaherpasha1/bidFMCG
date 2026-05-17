import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_LISTINGS } from '@/mock/listings'

export const useListingStore = create(
  persist(
    (set, get) => ({
      listings: MOCK_LISTINGS,

      getById: (id) => get().listings.find((l) => l.id === id),

      getBySupplier: (supplierId) =>
        get().listings.filter((l) => l.supplierId === supplierId),

      addListing: (listing) =>
        set((state) => ({
          listings: [
            {
              ...listing,
              id: `l${Date.now()}`,
              bidCount: 0,
              currentPrice: listing.startingPrice || listing.buyNowPrice,
              createdAt: new Date().toISOString(),
              status: 'active',
            },
            ...state.listings,
          ],
        })),

      updateListing: (id, updates) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),

      deleteListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== id),
        })),

      updatePrice: (id, newPrice) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id
              ? { ...l, currentPrice: newPrice, bidCount: l.bidCount + 1 }
              : l
          ),
        })),

      moderateListing: (id, status) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, status } : l
          ),
        })),
    }),
    { name: 'bidding-listings' }
  )
)
