import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryChekinInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-founf-error'

let checkinRepository: InMemoryChekinInsRepository
let sut: ValidateCheckInUseCase // SUT (System Under Test)

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkinRepository = new InMemoryChekinInsRepository()
    sut = new ValidateCheckInUseCase(checkinRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkinRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkinRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkinRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twenyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twenyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
