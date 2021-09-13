import { createClient } from 'redis'

export default class CacheService {
  constructor() {
    this._client = createClient({
      host: process.env.REDIS_SERVER,
      port: process.env.REDIS_PORT,
    })

    this._client.on('error', (error) => {
      console.error(error)
    })
  }

  set(key, value, expirationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) return reject(error)

        return resolve(ok)
      })
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) return reject(error)
        if (reply === null) return reject(new Error('Cache tidak ditemukan'))

        return resolve(reply)
      })
    })
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) return reject(error)
        return resolve(count)
      })
    })
  }
}
