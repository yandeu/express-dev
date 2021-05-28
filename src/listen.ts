// imports
import { error, step } from 'node-cli'
import { AddressInfo } from 'net'
import openDefaultBrowser from 'open'
import http from 'http'
import type { Express } from 'express'

/** A nice wrapper for express.listen() */
export class ExpressListen {
  private port!: number
  private httpServer!: http.Server
  private sockets: Set<any> = new Set()

  constructor(private app: Express) {
    this.httpServer = http.createServer(app)
  }

  /** Immediately kill the server. */
  public async kill(): Promise<void> {
    for (const socket of this.sockets) {
      socket.destroy()
      this.sockets.delete(socket)
    }

    return new Promise(resolve => {
      this.httpServer.close(() => {
        step('Bye!')
        return resolve()
      })
    })
  }

  public async listen(port: number, open = false): Promise<number> {
    try {
      await this.tryToListen(port)
      step(`Listening at http://localhost:${this.port}`)
      if (open) {
        step(`Opening Browser`)
        openDefaultBrowser(`http://localhost:${this.port}`).catch(() => {
          error(`Could not open browser at http://localhost:${this.port}`, false)
        })
      }
      return port
    } catch (err) {
      error(err.message, true)
      return -1
    }
  }

  /** Tries to listen on a free port. */
  private tryToListen(port: number | string): Promise<void> {
    let _port: number = typeof port === 'string' ? parseInt(port) : parseInt(port.toFixed(2))

    return new Promise((resolve, reject) => {
      // Handle server startup errors
      this.httpServer.once('error', (e: any) => {
        console.log('error')
        if (e.code && e.code === 'EADDRINUSE') {
          setTimeout(() => {
            this.tryToListen((_port += 1))
          }, 500)
        } else {
          this.kill()
          reject(e)
        }
      })

      this.httpServer.on('connection', socket => {
        this.sockets.add(socket)
      })

      // Handle successful httpServer
      this.httpServer.once('listening', (/*e*/) => {
        this.port = (this.httpServer.address() as AddressInfo).port
        resolve()
      })

      this.httpServer.listen(_port)
    })
  }
}
