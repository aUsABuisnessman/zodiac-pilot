export type MockTab = chrome.tabs.Tab & { id: number }

export const createMockTab = (tab: Partial<chrome.tabs.Tab> = {}): MockTab => ({
  id: Math.ceil(Math.random() * 1000),
  active: true,
  autoDiscardable: true,
  discarded: false,
  groupId: 0,
  highlighted: false,
  incognito: false,
  index: 0,
  pinned: false,
  windowId: 0,
  selected: true,
  frozen: false,

  status: 'complete',
  url: 'http://test-tab-url.com',

  ...tab,
})
