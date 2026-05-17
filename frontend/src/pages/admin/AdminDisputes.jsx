import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { formatDate } from '@/utils/formatDate'

const MOCK_DISPUTES = [
  { id: 'd1', orderId: 'o1', type: 'delivery', raisedBy: 'FreshCo Manufacturing', against: 'AlphaPack Industries', description: 'Delivery was 5 days late and 3 carton boxes were damaged on arrival.', raisedAt: '2026-05-10', status: 'open', priority: 'high' },
  { id: 'd2', orderId: 'o3', type: 'quality', raisedBy: 'SnackCorp Egypt', against: 'Delta Chemical Supply', description: 'The lubricant cans received do not match the NSF H1 specification claimed in the listing.', raisedAt: '2026-05-14', status: 'open', priority: 'medium' },
  { id: 'd3', orderId: 'o2', type: 'payment', raisedBy: 'AlphaPack Industries', against: 'FreshCo Manufacturing', description: 'Buyer has not confirmed delivery after 10 days. Escrow funds still held.', raisedAt: '2026-05-15', status: 'in_review', priority: 'low' },
]

const priorityColors = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-600' }
const statusColors = { open: 'bg-orange-100 text-orange-700', in_review: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700', rejected: 'bg-gray-100 text-gray-500' }

export default function AdminDisputes() {
  const currentUser = useRoleGuard(['admin'])
  const [disputes, setDisputes] = useState(MOCK_DISPUTES)
  const [selected, setSelected] = useState(null)

  if (!currentUser) return null

  const resolve = (id, status) => {
    setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, status } : d))
    setSelected(null)
  }

  const open = disputes.filter((d) => d.status === 'open' || d.status === 'in_review')
  const closed = disputes.filter((d) => d.status === 'resolved' || d.status === 'rejected')

  return (
    <PageLayout>
      <PageHeader title="Dispute Resolution" subtitle={`${open.length} open disputes`} />

      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Open</h2>
        {open.map((d) => (
          <Card key={d.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={priorityColors[d.priority]}>{d.priority} priority</Badge>
                      <Badge className={statusColors[d.status]}>{d.status.replace('_', ' ')}</Badge>
                      <Badge className="bg-gray-100 text-gray-600">{d.type}</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{d.raisedBy} vs {d.against}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Order: {d.orderId} · Filed {formatDate(d.raisedAt)}</p>
                    <p className="text-sm text-gray-600 mt-2">{d.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setSelected(d)}>Review</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {closed.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resolved</h2>
          {closed.map((d) => (
            <Card key={d.id} className="opacity-60">
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{d.raisedBy} vs {d.against}</p>
                  <p className="text-xs text-gray-400">{d.description}</p>
                </div>
                <Badge className={statusColors[d.status]}>{d.status}</Badge>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Dispute Review">
        {selected && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Parties</p>
              <p className="text-sm font-medium text-gray-900">{selected.raisedBy} raised against {selected.against}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Complaint</p>
              <p className="text-sm text-gray-700">{selected.description}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              In a live system, you would see order details, delivery docs, and both parties' evidence here.
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => resolve(selected.id, 'rejected')}>
                <XCircle size={16} /> Reject Dispute
              </Button>
              <Button variant="success" onClick={() => resolve(selected.id, 'resolved')}>
                <CheckCircle size={16} /> Resolve in Buyer's Favor
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  )
}
