import { PrismaClient } from "@prisma/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env
if (!TURSO_DATABASE_URL) {
  throw new Error(`Missing TURSO_DATABASE_URL env variable!`)
}
if (!TURSO_AUTH_TOKEN) {
  throw new Error(`Missing TURSO_AUTH_TOKEN env variable`)
}

const libsql = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
})

const adapter = new PrismaLibSQL(libsql)
export const db = new PrismaClient({ adapter })
