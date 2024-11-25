import { PropsWithChildren } from 'react'
import { BaseAlert } from './BaseAlert'

type ErrorProps = PropsWithChildren<{
  title?: string
}>

export const Error = ({ children, title }: ErrorProps) => (
  <BaseAlert className="border-red-600/80 bg-red-800">
    {title && <BaseAlert.Title className="text-white">{title}</BaseAlert.Title>}

    {children && (
      <BaseAlert.Description className="text-red-200">
        {children}
      </BaseAlert.Description>
    )}
  </BaseAlert>
)
