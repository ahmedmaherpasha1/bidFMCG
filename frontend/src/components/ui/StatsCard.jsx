import { Card, CardBody } from './Card'
import { cn } from '@/utils/cn'

export function StatsCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <Card>
      <CardBody className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          {trend !== undefined && (
            <p className={cn('text-xs font-medium', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
              {trend >= 0 ? '+' : ''}{trend}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl', colors[color])}>
            <Icon size={20} />
          </div>
        )}
      </CardBody>
    </Card>
  )
}
