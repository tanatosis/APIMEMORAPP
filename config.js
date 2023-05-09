import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 4000
export const DB_USER = process.env.DB_USER || 'postgres'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'OUxYwsJKnNhELTnUqg7P'
export const DB_HOST = process.env.DB_HOST || 'containers-us-west-187.railway.app'
export const DB_DATABASE = process.env.DB_DATABASE || 'railway'
export const DB_PORT = process.env.DB_PORT || 4001