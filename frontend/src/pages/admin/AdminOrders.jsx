import { useState, useMemo } from 'react'
import { ShoppingBag, Search } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useOrderStore } from '@/store/useOrderStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '@/mock/orders'

const ALL_STATUSES = ['confirmed', 'in_production', 'dispatched', 'delivered', 'closed']

export default function AdminOrders() {
  const currentUser = useRoleGuard(['admin'])
  const { orders, advanceStatus } = useOrderStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')

  const filtered = useMemo(() => {
    let result = [...orders]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.listingTitle.toLowerCase().includes(q) ||
          o.buyerName.toLowerCase().includes(q) ||
          o.supplierName.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      )
    }
    if (statusFilter) result = result.filter((o) => o.status === statusFilter)
    if (paymentFilter) result = result.filter((o) => o.paymentStatus === paymentFilter)
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, search, statusFilter, paymentFilter])

  const totalValue = filtered.reduce((acc, o) => acc + o.total, 0)

  if (!currentUser) return null

  return (
    <PageLayout>
      <PageHeader
        title="All Orders"
        subtitle={`${filtered.length} orders · Total value: ${formatCurrency(totalValue)}`}
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order, buyer, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All payments</option>
          <option value="pending">Pending</option>
          <option value="in_escrow">In Escrow</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-blue-600' },
          { label: 'In Escrow', value: orders.filter((o) => o.paymentStatus === 'in_escrow').length, color: 'text-yellow-600' },
          { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered' || o.status === 'closed').length, color: 'text-green-600' },
          { label: 'Platform GMV', value: formatCurrency(orders.reduce((a, o) => a + o.total, 0)), color: 'text-purple-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">{o.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-900 max-w-[180px] line-clamp-1">{o.listingTitle}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{o.buyerName}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{o.supplierName}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {o.quantity.toLocaleString()} {o.unit}s
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                    {formatCurrency(o.total, o.currency)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={PAYMENT_STATUS_COLORS[o.paymentStatus]}>
                      {o.paymentStatus.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={ORDER_STATUS_COLORS[o.status]}>
                      {o.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {o.status !== 'closed' && (
                      <Button size="sm" variant="secondary" onClick={() => advanceStatus(o.id)}>
                        Advance
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders match your filters</p>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  )
}
