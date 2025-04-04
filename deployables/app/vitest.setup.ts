import {
  getAvailableChains,
  getChain,
  getTokenBalances,
  getTokenByAddress,
  isValidToken,
} from '@/balances-server'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { sleepTillIdle } from '@zodiac/test-utils'
import {
  configMocks,
  mockAnimationsApi,
  mockResizeObserver,
} from 'jsdom-testing-mocks'
import { afterAll, afterEach, beforeEach, vi } from 'vitest'
import { dbClient, deleteAllTenants } from './db'
import { createMockChain } from './test-utils/createMockChain'
import { createMockToken } from './test-utils/createMockToken'

configMocks({ afterEach, afterAll })

mockAnimationsApi()
mockResizeObserver()

Element.prototype.scrollIntoView = vi.fn()

beforeEach(() => deleteAllTenants(dbClient()))

afterEach(async () => {
  await sleepTillIdle()

  cleanup()
})

vi.mock('@/simulation-server', async () => {
  const actual = await vi.importActual<typeof import('@/simulation-server')>(
    '@/simulation-server',
  )
  return {
    ...actual,
    simulateBundleTransaction: vi.fn(async () => {
      return {
        simulation_results: [
          {
            transaction: {
              network_id: '1',
              transaction_info: {
                asset_changes: [],
              },
            },
          },
        ],
      }
    }),
  }
})

vi.mock('@/balances-server', async (importOriginal) => {
  const module = await importOriginal<typeof import('@/balances-server')>()

  return {
    ...module,

    isValidToken: vi.fn(),
    getTokenBalances: vi.fn(),
    getTokenDetails: vi.fn(),
    getAvailableChains: vi.fn(),
    getTokenByAddress: vi.fn(),
    getChain: vi.fn(),
  }
})

const mockGetAvailableChains = vi.mocked(getAvailableChains)
const mockGetChain = vi.mocked(getChain)
const mockGetTokenBalances = vi.mocked(getTokenBalances)
const mockGetTokenByAddress = vi.mocked(getTokenByAddress)
const mockIsValidToken = vi.mocked(isValidToken)

beforeEach(() => {
  vi.spyOn(window, 'postMessage')

  mockGetAvailableChains.mockResolvedValue([])
  mockGetTokenBalances.mockResolvedValue([])
  mockGetTokenByAddress.mockResolvedValue(createMockToken())
  mockGetChain.mockResolvedValue(createMockChain())
  mockIsValidToken.mockResolvedValue(true)
})
