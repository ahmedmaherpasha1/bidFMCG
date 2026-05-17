import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useOrderStore } from '@/store/useOrderStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '@/mock/orders'
import { ChevronRight } from 'lucide-react'

export default function SupplierOrders() {
  const currentUser = useRoleGuard(['supplier'])
  const { orders, advanceStatus } = useOrderStore()

  if (!currentUser) return null

  const myOrders = orders.filter((o) => o.supplierId === currentUser.id)

  return (
    <PageLayout>
      <PageHeader title="Orders Received" subtitle={`${myOrders.length} orders`} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 max-w-xs line-clamp-1">{o.listingTitle}</p>
                    <p className="text-xs text-gray-400">{o.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{o.buyerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{o.quantity.toLocaleString()} {o.unit}s</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(o.total, o.currency)}</td>
                  <td className="px-6 py-4">
                    <Badge className={PAYMENT_STATUS_COLORS[o.paymentStatus]}>{o.paymentStatus.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={ORDER_STATUS_COLORS[o.status]}>{o.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(o.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    {o.status !== 'closed' && (
                      <Button size="sm" variant="secondary" onClick={() => advanceStatus(o.id)}>
                        Advance <ChevronRight size={14} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myOrders.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>No orders received yet</p>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  )
}
