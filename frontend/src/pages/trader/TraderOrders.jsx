import { useState } from 'react'
import { ChevronRight, Truck } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useOrderStore } from '@/store/useOrderStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '@/mock/orders'

const STEPS = ['confirmed', 'in_production', 'dispatched', 'delivered', 'closed']

function OrderProgress({ status }) {
  const idx = STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((_, i) => (
        <div key={i} className={`h-1.5 w-6 rounded-full ${i <= idx ? 'bg-blue-500' : 'bg-gray-200'}`} />
      ))}
    </div>
  )
}

export default function TraderOrders() {
  const currentUser = useRoleGuard(['trader'])
  const { orders, advanceStatus } = useOrderStore()
  const [tab, setTab] = useState('received')

  if (!currentUser) return null

  const received = orders.filter((o) => o.supplierId === currentUser.id)
  const placed = orders.filter((o) => o.buyerId === currentUser.id)
  const active = tab === 'received' ? received : placed

  return (
    <PageLayout>
      <PageHeader
        title="Orders"
        subtitle={`${received.length} received · ${placed.length} placed`}
      />

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {[['received', `Received (${received.length})`], ['placed', `Placed (${placed.length})`]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tab === 'received' ? 'Buyer' : 'Supplier'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                {tab === 'received' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {active.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 max-w-[200px] line-clamp-1">{o.listingTitle}</p>
                    {o.trackingNumber && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Truck size={11} className="text-gray-400" />
                        <span className="text-xs text-blue-600">{o.trackingNumber}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tab === 'received' ? o.buyerName : o.supplierName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {o.quantity.toLocaleString()} {o.unit}s
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                    {formatCurrency(o.total, o.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={PAYMENT_STATUS_COLORS[o.paymentStatus]}>
                      {o.paymentStatus.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <OrderProgress status={o.status} />
                      <span className="text-xs text-gray-400 capitalize">{o.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(o.createdAt)}
                  </td>
                  {tab === 'received' && (
                    <td className="px-6 py-4 text-right">
                      {o.status !== 'closed' && (
                        <Button size="sm" variant="secondary" onClick={() => advanceStatus(o.id)}>
                          Advance <ChevronRight size={14} />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {active.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="font-medium">No {tab === 'received' ? 'orders received' : 'orders placed'} yet</p>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  )
}
