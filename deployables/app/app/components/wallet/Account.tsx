import { validateAddress } from '@/utils'
import { AddressInput, CopyToClipboard } from '@zodiac/ui'

type AccountProps = {
  children: string
}

export const Account = ({ children }: AccountProps) => {
  const address = validateAddress(children)

  return (
    <AddressInput
      readOnly
      value={address ?? undefined}
      label="Pilot Account"
      action={
        <CopyToClipboard iconOnly size="small" data={address}>
          Copy address
        </CopyToClipboard>
      }
    />
  )
}
