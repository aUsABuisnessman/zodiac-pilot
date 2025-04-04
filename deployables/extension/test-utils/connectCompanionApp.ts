import {
  CompanionAppMessageType,
  type CompanionAppMessage,
} from '@zodiac/messages'
import { vi } from 'vitest'
import { callListeners, chromeMock, createMockTab } from './chrome'

export const connectCompanionApp = async (
  tab: Partial<chrome.tabs.Tab> = {},
) => {
  const connectedTab = createMockTab(tab)

  await callListeners(
    chromeMock.runtime.onMessage,
    {
      type: CompanionAppMessageType.REQUEST_FORK_INFO,
    } satisfies CompanionAppMessage,
    { id: chrome.runtime.id, tab: connectedTab },
    vi.fn(),
  )

  return connectedTab
}
