import { genSalt, hash } from 'bcrypt'

export async function generateHash(password: string) {
  const salt = await genSalt(10)
  console.log(salt)
  const passHash = await hash(password, salt)
  console.log('hash: ' + passHash)
  return passHash
}