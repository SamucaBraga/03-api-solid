import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  // first create an account
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'jubileu@gmail.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  // then so login
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'jubileu@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
