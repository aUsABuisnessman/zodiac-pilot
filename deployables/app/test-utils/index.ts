import type {
  CompanionAppMessage,
  CompanionResponseMessage,
} from '@zodiac/messages'
import { createExpectMessage } from '@zodiac/test-utils'

export { activateRoute } from './activateRoute'
export { createMockApprovalLog } from './createMockApprovalLog'
export { createMockChain } from './createMockChain'
export { createMockSimulatedTransaction } from './createMockSimulatedTransaction'
export { createMockTokenBalance } from './createMockTokenBalance'
export { loadAndActivateRoute } from './loadAndActivateRoute'
export { loadRoutes } from './loadRoutes'
export { postMessage } from './postMessage'
export { regexEscape } from './regexEscape'
export { render } from './render'
export * from './wallet'

export const expectMessage = await createExpectMessage<
  CompanionAppMessage | CompanionResponseMessage
>()
