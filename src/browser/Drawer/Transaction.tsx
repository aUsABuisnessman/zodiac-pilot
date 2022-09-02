import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { RiArrowDropRightLine, RiDeleteBinLine } from 'react-icons/ri'
import {
  encodeSingle,
  TransactionInput,
  TransactionType,
} from 'react-multisend'

import { Box, Flex, IconButton } from '../../components'
import ToggleButton from '../../components/Drawer/ToggleButton'
import { ForkProvider } from '../../providers'
import { useConnection } from '../../settings'
import { useProvider } from '../ProvideProvider'
import { TransactionState, useDispatch, useNewTransactions } from '../state'

import CallContract from './CallContract'
import ContractAddress from './ContractAddress'
import RawTransaction from './RawTransaction'
import RolePermissionCheck from './RolePermissionCheck'
import SimulatedExecutionCheck from './SimulatedExecutionCheck'
import classes from './style.module.css'

interface HeaderProps {
  index: number
  input: TransactionInput
  transactionHash: TransactionState['transactionHash']
  onRemove(): void
  onExpandToggle(): void
  expanded: boolean
}

const TransactionHeader: React.FC<HeaderProps> = ({
  index,
  input,
  transactionHash,
  onRemove,
  onExpandToggle,
  expanded,
}) => {
  return (
    <div className={classes.transactionHeader}>
      <label className={classes.start}>
        <div className={classes.index}>{index + 1}</div>
        <div className={classes.toggle}>
          <ToggleButton expanded={expanded} onToggle={onExpandToggle} />
        </div>
        <h5 className={classes.transactionTitle}>
          {input.type === TransactionType.callContract
            ? input.functionSignature.split('(')[0]
            : 'Raw transaction'}
        </h5>
      </label>
      <div className={classes.end}>
        {transactionHash && (
          <SimulatedExecutionCheck transactionHash={transactionHash} mini />
        )}

        <RolePermissionCheck transaction={input} mini />
        <IconButton
          onClick={onRemove}
          className={classes.removeTransaction}
          title="remove"
        >
          <RiDeleteBinLine />
        </IconButton>
      </div>
    </div>
  )
}

interface BodyProps {
  input: TransactionInput
}

const TransactionBody: React.FC<BodyProps> = ({ input }) => {
  // const { network, blockExplorerApiKey } = useMultiSendContext()
  let txInfo: ReactNode = <></>
  switch (input.type) {
    case TransactionType.callContract:
      txInfo = <CallContract value={input} />
      break
    // case TransactionType.transferFunds:
    //   return <TransferFunds value={value} onChange={onChange} />
    // case TransactionType.transferCollectible:
    //   return <TransferCollectible value={value} onChange={onChange} />
    case TransactionType.raw:
      txInfo = <RawTransaction value={input} />
      break
  }
  return (
    <>
      <Flex gap={2} alignItems="center" className={classes.transactionSubtitle}>
        <EtherValue input={input} />
        <ContractAddress address={input.to} explorerLink />
      </Flex>
      {txInfo}
    </>
  )
}

type Props = TransactionState & {
  index: number
}

export const Transaction: React.FC<Props> = ({
  index,
  transactionHash,
  input,
}) => {
  const [expanded, setExpanded] = useState(true)
  const provider = useProvider()
  const dispatch = useDispatch()
  const transactions = useNewTransactions()
  const elementRef = useRef<HTMLDivElement | null>(null)
  const {
    connection: { avatarAddress },
  } = useConnection()

  const isLast = index === transactions.length - 1

  useEffect(() => {
    if (isLast && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [isLast])

  const handleRemove = async () => {
    if (!(provider instanceof ForkProvider)) {
      throw new Error('This is only supported when using ForkProvider')
    }

    const laterTransactions = transactions.slice(index + 1)

    // remove the transaction and all later ones from the store
    dispatch({ type: 'REMOVE_TRANSACTION', payload: { id: input.id } })

    if (transactions.length === 1) {
      // no more recorded transaction remains: we can delete the fork and will create a fresh one once we receive the next transaction
      await provider.deleteFork()
      return
    }

    // revert to checkpoint before the transaction to remove
    const checkpoint = input.id // the ForkProvider uses checkpoints as IDs for the recorded transactions
    await provider.request({ method: 'evm_revert', params: [checkpoint] })

    // re-simulate all transactions after the removed one
    for (let i = 0; i < laterTransactions.length; i++) {
      const transaction = laterTransactions[i]
      const encoded = encodeSingle(transaction.input)
      await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            to: encoded.to,
            data: encoded.data,
            value: formatValue(encoded.value),
            from: avatarAddress,
          },
        ],
      })
    }
  }

  return (
    <Box ref={elementRef} p={2} className={classes.container} double>
      <TransactionHeader
        index={index}
        input={input}
        transactionHash={transactionHash}
        onRemove={handleRemove}
        expanded={expanded}
        onExpandToggle={() => setExpanded(!expanded)}
      />
      {expanded && (
        <>
          <TransactionBody input={input} />
          <TransactionStatus input={input} transactionHash={transactionHash} />
        </>
      )}
    </Box>
  )
}

export const TransactionBadge: React.FC<Props> = ({
  index,
  transactionHash,
  input,
}) => {
  const transactions = useNewTransactions()
  const elementRef = useRef<HTMLDivElement | null>(null)

  const isLast = index === transactions.length - 1

  useEffect(() => {
    if (isLast && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [isLast])

  return (
    <Box
      ref={elementRef}
      p={2}
      className={classes.badgeContainer}
      double
      rounded
    >
      <div className={classes.txNumber}>{index + 1}</div>
      {transactionHash && (
        <SimulatedExecutionCheck transactionHash={transactionHash} mini />
      )}

      <RolePermissionCheck transaction={input} mini />
    </Box>
  )
}

const TransactionStatus: React.FC<TransactionState> = ({
  input,
  transactionHash,
}) => (
  <dl className={classes.transactionStatus}>
    {transactionHash && (
      <SimulatedExecutionCheck transactionHash={transactionHash} />
    )}

    <RolePermissionCheck transaction={input} />
  </dl>
)

const EtherValue: React.FC<{ input: TransactionInput }> = ({ input }) => {
  let value = ''
  if (
    input.type === TransactionType.callContract ||
    input.type === TransactionType.raw
  ) {
    value = input.value
  }

  if (!value) {
    return null
  }

  const valueBN = BigNumber.from(value)

  if (valueBN.isZero()) {
    return null
  }

  return (
    <>
      <span>{formatEther(valueBN)} ETH</span> <RiArrowDropRightLine />
    </>
  )
}

// Tenderly has particular repquirements for the encoding of value: it must not have any leading zeros
const formatValue = (value: string): string => {
  const valueBN = BigNumber.from(value)
  if (valueBN.isZero()) return '0x0'
  else return valueBN.toHexString().replace(/^0x(0+)/, '0x')
}
