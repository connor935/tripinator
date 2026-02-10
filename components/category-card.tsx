'use client'

import { useTransition } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteCategory } from '@/app/_actions/actions'

export function CategoryCard({ id, name, tripCount }: {
  id: string
  name: string
  tripCount: number
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (tripCount > 0) {
      alert(`Cannot delete "${name}" because it has ${tripCount} trip(s). Please delete or reassign the trips first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return
    }

    startTransition(async () => {
      const result = await deleteCategory(id)
      if (!result.success) {
        alert(result.error || 'Failed to delete category')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isPending ? '...' : '🗑️'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {tripCount} {tripCount === 1 ? 'trip' : 'trips'}
        </p>
      </CardContent>
    </Card>
  )
}
