import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card, CardBody } from '@/components/ui/Card'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useListingStore } from '@/store/useListingStore'
import { CATEGORIES } from '@/mock/listings'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Category required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  unit: z.string().min(1, 'Unit required'),
  quantityAvailable: z.coerce.number().min(1, 'Quantity required'),
  moq: z.coerce.number().min(1, 'MOQ required'),
  type: z.enum(['open_bid', 'sealed_bid', 'buy_now']),
  startingPrice: z.coerce.number().optional(),
  buyNowPrice: z.coerce.number().optional(),
  currency: z.string().default('USD'),
  deliveryTerms: z.string().min(1, 'Delivery terms required'),
  paymentTerms: z.string().min(1, 'Payment terms required'),
  endsInDays: z.coerce.number().min(1).max(90),
})

export default function TraderListingForm() {
  const currentUser = useRoleGuard(['trader'])
  const navigate = useNavigate()
  const { id } = useParams()
  const { addListing, updateListing, getById } = useListingStore()

  const existing = id ? getById(id) : null
  const isEdit = !!existing

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing ? { ...existing, endsInDays: 7 } : { type: 'open_bid', currency: 'USD', endsInDays: 7 },
  })

  const listingType = watch('type')

  const onSubmit = (data) => {
    const endsAt = new Date(Date.now() + data.endsInDays * 86400000).toISOString()
    if (isEdit) {
      updateListing(id, { ...data, endsAt })
    } else {
      addListing({
        ...data,
        supplierId: currentUser.id,
        supplierName: currentUser.company,
        supplierRating: currentUser.rating,
        endsAt,
        tags: data.title.toLowerCase().split(' ').slice(0, 3),
        images: [],
      })
    }
    navigate('/trader/listings')
  }

  if (!currentUser) return null

  return (
    <PageLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft size={16} /> Back
      </button>
      <PageHeader title={isEdit ? 'Edit Listing' : 'New Listing'} subtitle="Fill in the details below to publish your consumable listing." />

      <Card className="max-w-3xl">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <section className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2">Basic Info</h3>
              <Input label="Listing title" error={errors.title?.message} placeholder="e.g. HDPE Shrink Wrap Film 23 Micron" {...register('title')} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" error={errors.category?.message} {...register('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Input label="Unit of measure" error={errors.unit?.message} placeholder="e.g. Roll, Drum, Box" {...register('unit')} />
              </div>
              <Textarea label="Description" error={errors.description?.message} placeholder="Describe the product, certifications, and usage..." {...register('description')} />
            </section>

            <section className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2">Quantity</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity available" type="number" error={errors.quantityAvailable?.message} {...register('quantityAvailable')} />
                <Input label="Minimum order quantity (MOQ)" type="number" error={errors.moq?.message} {...register('moq')} />
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2">Pricing & Auction</h3>
              <Select label="Listing type" error={errors.type?.message} {...register('type')}>
                <option value="open_bid">Open Bid — buyers outbid each other publicly</option>
                <option value="sealed_bid">Sealed Bid — buyers submit one hidden quote</option>
                <option value="buy_now">Buy Now — fixed price, no auction</option>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                {listingType !== 'buy_now' && (
                  <Input label="Starting price (per unit)" type="number" step="0.01" error={errors.startingPrice?.message} {...register('startingPrice')} />
                )}
                {(listingType === 'buy_now' || listingType === 'open_bid') && (
                  <Input label={listingType === 'buy_now' ? 'Price per unit' : 'Buy Now price (optional)'} type="number" step="0.01" error={errors.buyNowPrice?.message} {...register('buyNowPrice')} />
                )}
                <Select label="Currency" {...register('currency')}>
                  <option value="USD">USD</option>
                  <option value="EGP">EGP</option>
                  <option value="SAR">SAR</option>
                </Select>
                {listingType !== 'buy_now' && (
                  <Input label="Duration (days)" type="number" min={1} max={90} error={errors.endsInDays?.message} {...register('endsInDays')} />
                )}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2">Terms</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Delivery terms" error={errors.deliveryTerms?.message} {...register('deliveryTerms')}>
                  <option value="">Select</option>
                  <option value="EXW">EXW — Ex Works</option>
                  <option value="FOB">FOB — Free On Board</option>
                  <option value="CIF">CIF — Cost, Insurance & Freight</option>
                  <option value="DDP">DDP — Delivered Duty Paid</option>
                </Select>
                <Select label="Payment terms" error={errors.paymentTerms?.message} {...register('paymentTerms')}>
                  <option value="">Select</option>
                  <option value="Advance">Advance payment</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Net 90">Net 90</option>
                  <option value="LC">Letter of Credit</option>
                </Select>
              </div>
            </section>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit"><Save size={16} /> {isEdit ? 'Save Changes' : 'Publish Listing'}</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </PageLayout>
  )
}
