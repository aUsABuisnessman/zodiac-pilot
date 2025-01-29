import { captureLastError } from '@/sentry'
import { isValidTab } from '@/utils'
import {
  type ConnectedWalletMessage,
  ConnectedWalletMessageType,
} from '@zodiac/messages'

export const createPort = async (tabId: number, url: string | undefined) => {
  if (!isValidTab(url)) {
    console.debug(
      `Tab (id: "${tabId}", url: "${url}") does not meet connect criteria.`,
    )

    return null
  }

  console.debug(`Connecting to Tab (id: "${tabId}")`)

  return connectToDApp(tabId)
}

const connectToDApp = (tabId: number): Promise<chrome.runtime.Port> => {
  const { promise, resolve } = Promise.withResolvers<chrome.runtime.Port>()

  const port = chrome.tabs.connect(tabId)

  captureLastError()

  const timeout = setTimeout(() => {
    port.disconnect()

    resolve(connectToDApp(tabId))
  }, 500)

  const handleConnect = (message: ConnectedWalletMessage) => {
    if (
      message.type !== ConnectedWalletMessageType.CONNECTED_WALLET_CONNECTED
    ) {
      return
    }

    clearTimeout(timeout)

    console.debug(`Connected to content script in tab (id: ${tabId}")`)

    port.onMessage.removeListener(handleConnect)

    resolve(port)
  }

  if (process.env.NODE_ENV === 'test' && port == null) {
    // This can happen in tests because of the timeout above
    // If you have a better solution, go ahead :)
    return promise
  }

  port.onMessage.addListener(handleConnect)

  return promise
}
