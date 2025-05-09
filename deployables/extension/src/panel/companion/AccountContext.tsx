import { invariant } from '@epic-web/invariant'
import type { Account } from '@zodiac/db/schema'
import type { UUID } from 'crypto'
import { createContext, useContext, type PropsWithChildren } from 'react'

export type PartialAccount = Pick<Account, 'label' | 'address' | 'chainId'> & {
  id: UUID | string
}

const Context = createContext<PartialAccount | null>(null)

export const ProvideAccount = ({
  children,
  account,
}: PropsWithChildren<{ account: PartialAccount }>) => (
  <Context value={account}>{children}</Context>
)

export const useAccount = () => {
  const account = useContext(Context)

  invariant(account != null, 'No active account')

  return account
}
