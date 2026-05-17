import { useNavigate } from 'react-router-dom'
import { Package, TrendingUp, ShieldCheck, Clock, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ListingCard } from '@/components/listings/ListingCard'
import { useListingStore } from '@/store/useListingStore'
import { useUserStore } from '@/store/useUserStore'
import { Navbar } from '@/components/layout/Navbar'
import { CATEGORIES } from '@/mock/listings'

const features = [
  { icon: TrendingUp, title: 'Competitive Bidding', desc: 'Open and sealed auctions drive fair market prices for industrial consumables.' },
  { icon: ShieldCheck, title: 'Escrow Protection', desc: 'Funds held securely until delivery is confirmed by the buyer.' },
  { icon: Clock, title: 'Real-Time Auctions', desc: 'Live countdowns and bid updates keep you ahead of the competition.' },
  { icon: Package, title: 'Verified Suppliers', desc: 'All suppliers undergo KYB verification before listing products.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { listings } = useListingStore()
  const { currentUser } = useUserStore()
  const featured = listings.filter((l) => l.status === 'active').slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm mb-6">
            <Star size={14} className="text-yellow-300" />
            <span>Trusted by 200+ FMCG factories across Egypt & GCC</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            The B2B Marketplace for<br />
            <span className="text-blue-200">FMCG Consumables</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Suppliers list consumables. Factories bid and buy. All in one transparent, escrow-protected platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {currentUser ? (
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/marketplace')}
              >
                Browse Marketplace <ArrowRight size={18} />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/register')}
                >
                  Get Started <ArrowRight size={18} />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10"
                  onClick={() => navigate('/marketplace')}
                >
                  Browse Listings
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-900 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Active Listings', value: '1,240+' },
            { label: 'Verified Suppliers', value: '180+' },
            { label: 'Factories Buying', value: '340+' },
            { label: 'GMV This Month', value: '$2.4M' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-blue-400">{value}</div>
              <div className="text-sm text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat)}`)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/marketplace')}>
              View all <ArrowRight size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Why BidFMCG?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to start bidding?</h2>
          <p className="text-blue-100 mb-8">Join 500+ companies already saving on FMCG consumables.</p>
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50"
            onClick={() => navigate('/login')}
          >
            Enter Platform
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        BidFMCG — FMCG Consumables Bidding Platform · Demo Build
      </footer>
    </div>
  )
}
