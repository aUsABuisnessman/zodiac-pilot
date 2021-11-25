import { EventEmitter } from 'events'

type Listener = (...args: any[]) => void

export default class BridgeIframe extends EventEmitter {
  private messageId = 0

  private bridgedEvents: Set<string | symbol>

  constructor() {
    super()

    if (!window.top) throw new Error('Must run inside iframe')
    this.bridgedEvents = new Set()

    // If the host provider emits one of the bridged events, this will be posted as a message to the iframe window.
    // We pick up on these messages here and emit the event to our listeners.
    window.addEventListener('message', (ev) => {
      const { transactionSimulatorBridgeEventEmit, type, args } = ev.data
      if (transactionSimulatorBridgeEventEmit) {
        this.emit(type, ...args)
      }
    })

    window.top.postMessage(
      {
        transactionSimulatorBridgeInit: true,
      },
      '*'
    )
  }

  request(request: { method: string; params?: Array<any> }): Promise<any> {
    return this.send(request.method, request.params || [])
  }

  async send(method: string, params?: Array<any>): Promise<any> {
    const currentMessageId = this.messageId
    this.messageId++
    // Note: for method: 'eth_accounts', this method is being called incorrectly
    const { uMethod, uParams } = maybeUnpackIncorrectSend(method, params)

    const request = { method: uMethod, params: uParams }

    console.log('bridging...', request)

    return new Promise((resolve, reject) => {
      if (!window.top) throw new Error('Must run inside iframe')

      window.top.postMessage(
        {
          transactionSimulatorBridgeRequest: true,
          request,
          messageId: currentMessageId,
        },
        '*'
      )

      const handleMessage = (ev: MessageEvent) => {
        const { transactionSimulatorBridgeResponse, messageId, error, result } =
          ev.data
        if (
          transactionSimulatorBridgeResponse &&
          messageId === currentMessageId
        ) {
          window.removeEventListener('message', handleMessage)

          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      }

      window.addEventListener('message', handleMessage)
    })
  }

  // Wrap base implementation to subscribe to this event also from the host provider.
  on(type: string | symbol, listener: Listener): this {
    if (!window.top) throw new Error('Must run inside iframe')
    if (!this.bridgedEvents.has(type)) {
      window.top.postMessage(
        {
          transactionSimulatorBridgeEventListen: true,
          type,
        },
        '*'
      )
      this.bridgedEvents.add(type)
    }
    EventEmitter.prototype.on.call(this, type, listener)
    return this
  }

  async enable() {
    console.log('enable was called')
  }
  isMetaMask = true

  _metamask = {
    isUnlocked: async () => true,
    requestBatch: () => {
      throw new Error()
    },
  }
}

// we have to take a close look at this
function maybeUnpackIncorrectSend(method: string, params?: Array<any>) {
  const uMethod =
    (typeof method !== 'string' &&
      (method as { method: string; params?: Array<any> })?.method) ||
    method

  const uParams =
    (typeof method !== 'string' &&
      (method as { params?: Array<any> }).params) ||
    params

  return {
    uMethod,
    uParams,
  }
}
