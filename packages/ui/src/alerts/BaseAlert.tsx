import { invariant } from '@epic-web/invariant'
import classNames from 'classnames'
import type { LucideIcon } from 'lucide-react'
import { createContext, type PropsWithChildren, useContext, useId } from 'react'

type BaseAlertProps = PropsWithChildren<{
  className?: string
}>

export const BaseAlert = ({ children, className }: BaseAlertProps) => {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <AlertContext.Provider value={{ titleId, descriptionId }}>
      <div
        role="alert"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={classNames(
          'border-l-6 flex max-w-full flex-col gap-4 text-balance px-4 py-2 text-sm',
          className,
        )}
      >
        {children}
      </div>
    </AlertContext.Provider>
  )
}

const Title = ({
  children,
  className,
  icon: Icon,
}: PropsWithChildren<{ className?: string; icon: LucideIcon }>) => (
  <h4
    id={useTitleId()}
    className={classNames('flex items-center gap-2 font-bold', className)}
  >
    <Icon size={16} className="shrink-0" />
    {children}
  </h4>
)

BaseAlert.Title = Title

const Description = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <div id={useDescriptionId()} className={className}>
    {children}
  </div>
)

BaseAlert.Description = Description

const Actions = ({ children }: PropsWithChildren) => (
  <div className="mt-4 flex gap-2">{children}</div>
)

BaseAlert.Actions = Actions

const AlertContext = createContext<{
  titleId: string | null
  descriptionId: string | null
}>({
  titleId: null,
  descriptionId: null,
})

const useTitleId = () => {
  const { titleId } = useContext(AlertContext)

  invariant(titleId != null, 'No "titleId" alert context found')

  return titleId
}

const useDescriptionId = () => {
  const { descriptionId } = useContext(AlertContext)

  invariant(descriptionId != null, 'No "descriptionId" alert context found')

  return descriptionId
}
