'use client'

import { useState } from 'react'
import { Trip, Category } from '@/generated/prisma'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { markTripDone } from '@/app/_actions/actions'

interface TripWithCategory extends Trip {
  category: Category
}

export function TripPicker({ trips, categories }: {
  trips: TripWithCategory[],
  categories: Category[]
}) {
  const [selectedTrip, setSelectedTrip] = useState<TripWithCategory | null>(null)
  const [lastPickedId, setLastPickedId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    indoor: undefined as boolean | undefined,
    categoryIds: [] as string[],
    maxCost: 1000,
    excludeRecent: true
  })

  // Calculate filtered trips count
  const getFilteredTrips = () => {
    const cutoffDate = filters.excludeRecent
      ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : null

    let filtered = trips.filter(trip => {
      if (filters.indoor !== undefined && trip.indoor !== filters.indoor) return false
      if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(trip.categoryId)) return false
      if (trip.costPerPerson && trip.costPerPerson > filters.maxCost) return false
      if (cutoffDate && trip.lastDone && trip.lastDone > cutoffDate) return false
      return true
    })

    // Prevent immediate repetition if we have more than 1 option
    if (lastPickedId && filtered.length > 1) {
      filtered = filtered.filter(trip => trip.id !== lastPickedId)
    }

    return filtered
  }

  const pickRandomTrip = () => {
    const filtered = getFilteredTrips()

    if (filtered.length === 0) {
      alert('No trips match your filters!')
      return
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)]
    setSelectedTrip(random)
    setLastPickedId(random.id)
  }

  const filteredCount = getFilteredTrips().length

  const handleMarkDone = async () => {
    if (!selectedTrip) return
    await markTripDone(selectedTrip.id)
    setSelectedTrip(null)
  }

  return (
    <div className="space-y-4">
      <Button
        size="lg"
        className="w-full text-xl py-8"
        onClick={pickRandomTrip}
      >
        🎲 Pick an Activity
      </Button>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </Button>
        <p className="text-sm text-muted-foreground">
          {filteredCount} {filteredCount === 1 ? 'activity' : 'activities'} available
        </p>
      </div>

      {showFilters && (
        <div className="space-y-4 p-4 border rounded-lg">
          {/* Indoor/Outdoor filter */}
          <div className="space-y-2">
            <Label>Indoor/Outdoor</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={filters.indoor === true}
                  onCheckedChange={(checked) =>
                    setFilters(f => ({ ...f, indoor: checked ? true : undefined }))
                  }
                />
                Indoor
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={filters.indoor === false}
                  onCheckedChange={(checked) =>
                    setFilters(f => ({ ...f, indoor: checked ? false : undefined }))
                  }
                />
                Outdoor
              </label>
            </div>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <Label>Categories</Label>
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2">
                <Checkbox
                  checked={filters.categoryIds.includes(cat.id)}
                  onCheckedChange={(checked) => {
                    setFilters(f => ({
                      ...f,
                      categoryIds: checked
                        ? [...f.categoryIds, cat.id]
                        : f.categoryIds.filter(id => id !== cat.id)
                    }))
                  }}
                />
                {cat.name}
              </label>
            ))}
          </div>

          {/* Max cost slider */}
          <div className="space-y-2">
            <Label>Max Cost: ${filters.maxCost}</Label>
            <Slider
              value={[filters.maxCost]}
              onValueChange={([value]) => setFilters(f => ({ ...f, maxCost: value }))}
              min={0}
              max={1000}
              step={10}
            />
          </div>

          {/* Exclude recent */}
          <label className="flex items-center gap-2">
            <Checkbox
              checked={filters.excludeRecent}
              onCheckedChange={(checked) =>
                setFilters(f => ({ ...f, excludeRecent: !!checked }))
              }
            />
            Exclude trips done in last 30 days
          </label>
        </div>
      )}

      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTrip?.name}</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{selectedTrip.category.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{selectedTrip.address}, {selectedTrip.country}</p>
              </div>
              {selectedTrip.costPerPerson && (
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p>${selectedTrip.costPerPerson} per person</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p>{selectedTrip.indoor ? '🏠 Indoor' : '🌳 Outdoor'}</p>
              </div>
              {selectedTrip.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedTrip.description}</p>
                </div>
              )}
              {selectedTrip.lastDone && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Done</p>
                  <p>{new Date(selectedTrip.lastDone).toLocaleDateString()}</p>
                  <p className="text-xs">Completed {selectedTrip.timesCompleted} times</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={pickRandomTrip} variant="outline">
                  🎲 Pick Again
                </Button>
                <Button onClick={handleMarkDone}>
                  ✅ Mark as Done
                </Button>
                {selectedTrip.link && (
                  <Button asChild variant="secondary">
                    <a href={selectedTrip.link} target="_blank" rel="noopener noreferrer">
                      🔗 Link
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
