'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteTrip } from '@/app/_actions/actions'

export function DeleteTripButton({ tripId, tripName }: { tripId: string, tripName: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${tripName}"? This action cannot be undone.`)) {
      return
    }

    startTransition(async () => {
      const result = await deleteTrip(tripId)
      if (result.success) {
        router.push('/')
      } else {
        alert(result.error || 'Failed to delete trip')
      }
    })
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : '🗑️ Delete Trip'}
    </Button>
  )
}
