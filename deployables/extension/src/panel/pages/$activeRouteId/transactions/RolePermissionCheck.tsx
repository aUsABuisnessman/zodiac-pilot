import { useExecutionRoute } from '@/execution-routes'
import { useProvider } from '@/providers-ui'
import type { TransactionState } from '@/state'
import { useApplicableTranslation } from '@/transaction-translation'
import { invariant } from '@epic-web/invariant'
import { EOA_ZERO_ADDRESS } from '@zodiac/chains'
import { CopyToClipboard, Tag } from '@zodiac/ui'
import { Check, TriangleAlert, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  checkPermissions,
  PermissionViolation,
  type Route as SerRoute,
} from 'ser-kit'
import { Translate } from './Translate'

type Props = {
  transactionState: TransactionState
  mini?: boolean
}

export const RolePermissionCheck = ({
  transactionState,
  mini = false,
}: Props) => {
  const [error, setError] = useState<PermissionViolation | false | undefined>(
    undefined,
  )
  const route = useExecutionRoute()
  const provider = useProvider()

  const translationAvailable = !!useApplicableTranslation(transactionState.id)

  useEffect(() => {
    let canceled = false
    if (provider == null) {
      return
    }

    const { waypoints } = route

    invariant(waypoints != null, 'Route must have waypoints')

    const checkableRoute = {
      ...route,
      waypoints,
      initiator: route.initiator ?? EOA_ZERO_ADDRESS,
    } satisfies SerRoute

    checkPermissions([transactionState.transaction], checkableRoute).then(
      ({ success, error }) => {
        if (!canceled) setError(success ? false : error)
      },
    )

    return () => {
      canceled = true
    }
  }, [transactionState, route, provider])

  if (error === undefined) return null

  if (mini) {
    return (
      <>
        {error === false ? (
          <Tag head={<UsersRound size={16} />} color="green"></Tag>
        ) : (
          <Tag head={<UsersRound size={16} />} color="red"></Tag>
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        Role permissions
        <div className="flex gap-2">
          {error === false ? (
            <Tag head={<Check size={16} />} color="green">
              Allowed
            </Tag>
          ) : (
            <Tag head={<TriangleAlert size={16} />} color="red">
              {error}
            </Tag>
          )}

          {error && (
            <>
              {translationAvailable ? (
                <Translate transactionId={transactionState.id} />
              ) : (
                <CopyToClipboard
                  iconOnly
                  size="small"
                  data={transactionState.transaction}
                >
                  Copy transaction data to the clipboard
                </CopyToClipboard>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
