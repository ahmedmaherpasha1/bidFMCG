import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Package, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'

const schema = z.object({
  companyName: z.string().min(2, 'Company name required'),
  country: z.string().min(1, 'Country required'),
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Invalid email'),
  tradeLicense: z.string().min(4, 'Trade license required'),
})

export default function Register() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = () => {
    alert('Registration submitted! In a live system, your company would be verified within 24 hours.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2 bg-blue-600 rounded-xl"><Package size={22} className="text-white" /></div>
            <span className="text-xl font-bold text-gray-900">BidFMCG</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Register your company</h2>
          <p className="text-gray-500 text-sm mt-1">Buy and sell consumables — one account does both</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company name" error={errors.companyName?.message} placeholder="Acme Factory Ltd." {...register('companyName')} />
                <Select label="Country" error={errors.country?.message} {...register('country')}>
                  <option value="">Select country</option>
                  <option value="EG">Egypt</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="AE">UAE</option>
                  <option value="KW">Kuwait</option>
                  <option value="QA">Qatar</option>
                </Select>
              </div>

              <Input label="Trade license number" error={errors.tradeLicense?.message} placeholder="EG-MFG-2024-00001" {...register('tradeLicense')} />

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Contact person</p>
                <div className="flex flex-col gap-3">
                  <Input label="Full name" error={errors.name?.message} placeholder="Ahmed Hassan" {...register('name')} />
                  <Input label="Work email" type="email" error={errors.email?.message} placeholder="ahmed@company.com" {...register('email')} />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2">Submit for Verification</Button>
            </form>
          </CardBody>
        </Card>

        <button onClick={() => navigate('/login')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mx-auto mt-4">
          <ArrowLeft size={14} /> Back to login
        </button>
      </div>
    </div>
  )
}
