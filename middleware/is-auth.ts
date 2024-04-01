import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
}

export interface IGetUserAuthInfoRequest extends Request {
  userId: string
  isAuth: boolean
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization')
  const userAuthReq = req as IGetUserAuthInfoRequest
  if (!authHeader) {
    userAuthReq.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1]
  if (!token || token === '') {
    userAuthReq.isAuth = false
    return next()
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(token, 'somesupersecretkey') as JwtPayload
  } catch (error) {
    userAuthReq.isAuth = false
    return next()
  }

  if (!decodedToken) {
    userAuthReq.isAuth = false
    return next()
  }
  userAuthReq.isAuth = true
  userAuthReq.userId = decodedToken.userId
  next()
}
