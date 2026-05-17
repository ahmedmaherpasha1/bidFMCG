import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, FileText } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { MOCK_RFQS } from '@/mock/rfqs'
import { CATEGORIES } from '@/mock/listings'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

const schema = z.object({
  title: z.string().min(5),
  category: z.string().min(1),
  description: z.string().min(20),
  quantity: z.coerce.number().min(1),
  unit: z.string().min(1),
  targetBudget: z.coerce.number().min(0.01),
  currency: z.string().default('USD'),
  deadlineDays: z.coerce.number().min(1).max(60),
})

export default function BuyerRFQ() {
  const currentUser = useRoleGuard(['buyer'])
  const [isOpen, setIsOpen] = useState(false)
  const [rfqs, setRfqs] = useState(MOCK_RFQS.filter((r) => r.buyerId === 'u2'))

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  if (!currentUser) return null

  const onSubmit = (data) => {
    setRfqs((prev) => [
      {
        id: `r${Date.now()}`,
        ...data,
        buyerId: currentUser.id,
        buyerName: currentUser.company,
        deadline: new Date(Date.now() + data.deadlineDays * 86400000).toISOString(),
        status: 'open',
        quotesCount: 0,
        createdAt: new Date().toISOString(),
        visibility: 'public',
      },
      ...prev,
    ])
    reset()
    setIsOpen(false)
  }

  const statusColors = { open: 'bg-green-100 text-green-700', awarded: 'bg-blue-100 text-blue-700', closed: 'bg-gray-100 text-gray-500' }

  return (
    <PageLayout>
      <PageHeader
        title="My RFQs"
        subtitle="Request quotes from multiple suppliers"
        action={<Button onClick={() => setIsOpen(true)}><Plus size={16} /> Post RFQ</Button>}
      />

      <div className="flex flex-col gap-4">
        {rfqs.map((rfq) => (
          <Card key={rfq.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-gray-100 text-gray-600">{rfq.category}</Badge>
                    <Badge className={statusColors[rfq.status]}>{rfq.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{rfq.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rfq.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <span>Qty: <strong>{rfq.quantity.toLocaleString()} {rfq.unit}s</strong></span>
                    <span>Target: <strong>{formatCurrency(rfq.targetBudget, rfq.currency)}/{rfq.unit}</strong></span>
                    <span>Deadline: <strong>{formatDate(rfq.deadline)}</strong></span>
                    <span className="text-blue-600 font-medium">{rfq.quotesCount} quotes received</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {rfqs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FileText size={36} className="mx-auto mb-3 opacity-30" />
            <p>No RFQs posted yet</p>
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Post a New RFQ" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="RFQ title" error={errors.title?.message} placeholder="e.g. PET Bottles 500ml — 100,000 units" {...register('title')} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" error={errors.category?.message} {...register('category')}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input label="Unit of measure" error={errors.unit?.message} placeholder="Piece, Drum, Box..." {...register('unit')} />
          </div>
          <Textarea label="Description & requirements" error={errors.description?.message} placeholder="Describe what you need in detail..." {...register('description')} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Quantity needed" type="number" error={errors.quantity?.message} {...register('quantity')} />
            <Input label="Target budget (per unit)" type="number" step="0.01" error={errors.targetBudget?.message} {...register('targetBudget')} />
            <Select label="Currency" {...register('currency')}>
              <option value="USD">USD</option>
              <option value="EGP">EGP</option>
              <option value="SAR">SAR</option>
            </Select>
          </div>
          <Input label="Deadline (days from now)" type="number" min={1} max={60} error={errors.deadlineDays?.message} {...register('deadlineDays')} />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Post RFQ</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}
