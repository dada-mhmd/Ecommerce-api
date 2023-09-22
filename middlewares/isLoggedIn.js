import { getTokenFromHeader } from '../utils/getTokenFromHeader.js'
import { verifyToken } from '../utils/verifyToken.js'

export const isLoggedIn = (req, res, next) => {
  // get token from header
  const token = getTokenFromHeader(req)
  // verify token
  const decodedUser = verifyToken(token)
  // save the user to request
  if (!decodedUser) {
    throw new Error('Not authorized, token expired please login again')
  } else {
    req.userAuthId = decodedUser?.id
    next()
  }
}
