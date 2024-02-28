import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }) // verify if exists a valid refresh token on cookies and not on header

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: { sub: request.user.sub },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // encrypted via HTTPS (frontend without access)
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
