import * as bcrypt from 'bcrypt'

export async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(10)
  console.log(salt)
  const hash = await bcrypt.hash(password, salt)
  console.log('hash: ' + hash)
  return hash
}