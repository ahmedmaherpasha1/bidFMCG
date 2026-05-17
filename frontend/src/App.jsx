import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Marketplace from '@/pages/marketplace/Marketplace'
import ListingDetail from '@/pages/marketplace/ListingDetail'

import TraderDashboard from '@/pages/trader/TraderDashboard'
import TraderListings from '@/pages/trader/TraderListings'
import TraderListingForm from '@/pages/trader/TraderListingForm'
import TraderOrders from '@/pages/trader/TraderOrders'
import TraderBids from '@/pages/trader/TraderBids'
import TraderRFQ from '@/pages/trader/TraderRFQ'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminListings from '@/pages/admin/AdminListings'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminDisputes from '@/pages/admin/AdminDisputes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ListingDetail />} />

        <Route path="/trader/dashboard" element={<TraderDashboard />} />
        <Route path="/trader/listings" element={<TraderListings />} />
        <Route path="/trader/listings/new" element={<TraderListingForm />} />
        <Route path="/trader/listings/:id" element={<TraderListingForm />} />
        <Route path="/trader/orders" element={<TraderOrders />} />
        <Route path="/trader/bids" element={<TraderBids />} />
        <Route path="/trader/rfq" element={<TraderRFQ />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/listings" element={<AdminListings />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/disputes" element={<AdminDisputes />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
