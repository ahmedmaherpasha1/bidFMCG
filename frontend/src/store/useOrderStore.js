import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_ORDERS, ORDER_STATUSES } from '@/mock/orders'

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,

      getByBuyer: (buyerId) => get().orders.filter((o) => o.buyerId === buyerId),

      getBySupplier: (supplierId) =>
        get().orders.filter((o) => o.supplierId === supplierId),

      createOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id: `o${Date.now()}`,
              status: 'confirmed',
              paymentStatus: 'in_escrow',
              createdAt: new Date().toISOString(),
              trackingNumber: null,
            },
            ...state.orders,
          ],
        })),

      advanceStatus: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== orderId) return o
            const idx = ORDER_STATUSES.indexOf(o.status)
            const nextStatus = ORDER_STATUSES[Math.min(idx + 1, ORDER_STATUSES.length - 1)]
            return {
              ...o,
              status: nextStatus,
              paymentStatus: nextStatus === 'delivered' ? 'paid' : o.paymentStatus,
              trackingNumber: nextStatus === 'dispatched' ? `TRK-${Date.now()}` : o.trackingNumber,
            }
          }),
        })),
    }),
    { name: 'bidding-orders' }
  )
)
