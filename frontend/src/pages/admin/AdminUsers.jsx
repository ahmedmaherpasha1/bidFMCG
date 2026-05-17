import { PageLayout, PageHeader } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useRoleGuard } from '@/hooks/useRoleGuard'
import { useUserStore } from '@/store/useUserStore'
import { formatDate } from '@/utils/formatDate'
import { ShieldCheck, ShieldX, Star } from 'lucide-react'

const roleColors = {
  trader: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
}

export default function AdminUsers() {
  const currentUser = useRoleGuard(['admin'])
  const { allUsers, updateUserVerification } = useUserStore()

  if (!currentUser) return null

  return (
    <PageLayout>
      <PageHeader title="User Management" subtitle={`${allUsers.length} registered users`} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.company}</td>
                  <td className="px-6 py-4">
                    <Badge className={roleColors[user.role]}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    {user.rating ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        {user.rating}
                      </div>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.joinedAt)}</td>
                  <td className="px-6 py-4">
                    {user.verified
                      ? <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      : <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!user.verified ? (
                        <Button size="sm" variant="success" onClick={() => updateUserVerification(user.id, true)}>
                          <ShieldCheck size={14} /> Verify
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => updateUserVerification(user.id, false)}>
                          <ShieldX size={14} /> Revoke
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageLayout>
  )
}
