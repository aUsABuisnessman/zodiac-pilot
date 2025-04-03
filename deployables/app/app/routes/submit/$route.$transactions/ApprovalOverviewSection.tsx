import type { ApprovalTransaction } from '@/simulation-server'
import { Checkbox, Success, Warning } from '@zodiac/ui'
import { Suspense, useState } from 'react'
import { Await } from 'react-router'
import { SkeletonFlowTable } from './SkeletonFlowTable'
import { TokenApprovalTable } from './TokenApprovalTable'

type ApprovalOverviewSectionProps = {
  simulation: Promise<{
    error: unknown | null
    approvals: ApprovalTransaction[]
  }>
}

export function ApprovalOverviewSection({
  simulation,
}: ApprovalOverviewSectionProps) {
  const [revokeAll, setRevokeAll] = useState(false)

  return (
    <Suspense fallback={<SkeletonFlowTable />}>
      <Await resolve={simulation}>
        {({ error, approvals }) => {
          if (error) {
            return (
              <Warning title="Approval check is unavailable at the moment" />
            )
          }

          return approvals.length > 0 ? (
            <>
              <TokenApprovalTable approvals={approvals} revokeAll={revokeAll} />

              <Checkbox
                label="Revoke all approvals"
                name="revokeApprovals"
                checked={revokeAll}
                onChange={(e) => setRevokeAll(e.target.checked)}
              />
            </>
          ) : (
            <Success title="No recorded approvals" />
          )
        }}
      </Await>
    </Suspense>
  )
}
