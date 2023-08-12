export const getConfiguration = () => ({
  // nado || ?
  port: parseInt(process.env.PORT, 10) ?? 3000,
  db: {
    mongo: {
      mongodb_uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/testDb',
    }
  },
  jwt_secret_key: process.env.JWT_SECRET_KEY ?? 'SECRETKEY'
})

type ConfigurationType = ReturnType<typeof getConfiguration>
export type ConfigType = ConfigurationType & {
  PORT: number
  MONGODB_URI: string
  JWT_SECRET_KEY: string
}
