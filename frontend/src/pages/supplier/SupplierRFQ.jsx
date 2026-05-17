import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { MOCK_RFQS } from '@/mock/rfqs'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { FileText, Send } from 'lucide-react'

export default function SupplierRFQ() {
  const currentUser = useRoleGuard(['supplier'])
  if (!currentUser) return null

  const openRFQs = MOCK_RFQS.filter((r) => r.status === 'open')

  return (
    <PageLayout>
      <PageHeader title="Open RFQs" subtitle="Buyers looking for quotes on consumables" />

      <div className="flex flex-col gap-4">
        {openRFQs.map((rfq) => (
          <Card key={rfq.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-100 text-blue-700">{rfq.category}</Badge>
                    <Badge className="bg-green-100 text-green-700">{rfq.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{rfq.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rfq.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <span>Qty: <strong>{rfq.quantity.toLocaleString()} {rfq.unit}s</strong></span>
                    <span>Target: <strong>{formatCurrency(rfq.targetBudget, rfq.currency)}/{rfq.unit}</strong></span>
                    <span>Deadline: <strong>{formatDate(rfq.deadline)}</strong></span>
                    <span>Buyer: <strong>{rfq.buyerName}</strong></span>
                    <span>{rfq.quotesCount} quotes received</span>
                  </div>
                </div>
                <Button size="sm">
                  <Send size={14} /> Submit Quote
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}

        {openRFQs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FileText size={36} className="mx-auto mb-3 opacity-30" />
            <p>No open RFQs available</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
