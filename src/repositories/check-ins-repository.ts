import { Checkin, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findById(id: string): Promise<Checkin | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>
  countByUserId(userId: string): Promise<number>
  create(checkIn: Checkin): Promise<Checkin>
  save(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>
}
