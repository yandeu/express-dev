import type { Request, Response } from 'express'

import express from 'express'
import { ExpressListen } from '../listen.js'
const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

const listen = new ExpressListen(app)

listen.listen(port).then(port => {
  console.log(`Running on port ${port}`)
})

// setTimeout(async () => {
//   await listen.kill()
// }, 5000)
