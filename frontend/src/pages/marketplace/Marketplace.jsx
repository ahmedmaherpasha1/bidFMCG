import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { ListingCard } from '@/components/listings/ListingCard'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useListingStore } from '@/store/useListingStore'
import { CATEGORIES, LISTING_TYPE_LABELS } from '@/mock/listings'

export default function Marketplace() {
  const { listings } = useListingStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = useMemo(() => {
    let result = listings.filter((l) => l.status === 'active')

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.tags.some((t) => t.includes(q))
      )
    }
    if (category) result = result.filter((l) => l.category === category)
    if (type) result = result.filter((l) => l.type === type)

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'price_asc') return a.currentPrice - b.currentPrice
      if (sortBy === 'price_desc') return b.currentPrice - a.currentPrice
      if (sortBy === 'bids') return b.bidCount - a.bidCount
      return 0
    })

    return result
  }, [listings, search, category, type, sortBy])

  const hasFilters = search || category || type

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setType('')
  }

  return (
    <PageLayout>
      <PageHeader
        title="Marketplace"
        subtitle={`${filtered.length} active listing${filtered.length !== 1 ? 's' : ''}`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings, categories, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full sm:w-48">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>

        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-full sm:w-40">
          <option value="">All types</option>
          {Object.entries(LISTING_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>

        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full sm:w-40">
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="bids">Most bids</option>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="md" onClick={clearFilters}>
            <X size={16} /> Clear
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <SlidersHorizontal size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No listings match your filters</p>
          <button onClick={clearFilters} className="text-sm text-blue-600 mt-2 hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </PageLayout>
  )
}
