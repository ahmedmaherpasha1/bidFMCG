import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useOrderStore } from '@/store/useOrderStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '@/mock/orders'
import { Truck } from 'lucide-react'

const STEPS = ['confirmed', 'in_production', 'dispatched', 'delivered', 'closed']

function OrderProgress({ status }) {
  const idx = STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1 mt-2">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className={`h-2 w-8 rounded-full ${i <= idx ? 'bg-blue-500' : 'bg-gray-200'}`} />
        </div>
      ))}
      <span className="text-xs text-gray-400 ml-1 capitalize">{status.replace('_', ' ')}</span>
    </div>
  )
}

export default function BuyerOrders() {
  const currentUser = useRoleGuard(['buyer'])
  const { orders } = useOrderStore()

  if (!currentUser) return null

  const myOrders = orders.filter((o) => o.buyerId === currentUser.id)

  return (
    <PageLayout>
      <PageHeader title="My Orders" subtitle={`${myOrders.length} orders`} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 max-w-xs line-clamp-1">{o.listingTitle}</p>
                    {o.trackingNumber && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Truck size={12} className="text-gray-400" />
                        <p className="text-xs text-blue-600">{o.trackingNumber}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{o.supplierName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{o.quantity.toLocaleString()} {o.unit}s</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(o.total, o.currency)}</td>
                  <td className="px-6 py-4">
                    <Badge className={PAYMENT_STATUS_COLORS[o.paymentStatus]}>{o.paymentStatus.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4"><OrderProgress status={o.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(o.estimatedDelivery)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {myOrders.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>No orders yet. Win a bid or buy now to create your first order.</p>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  )
}
