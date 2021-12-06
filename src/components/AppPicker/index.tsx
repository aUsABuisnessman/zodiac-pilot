import React from 'react'

import aaveLogo from './images/aave.png'
import alchemixLogo from './images/alchemix.png'
import balancerLogo from './images/balancer.png'
import barnbridgeLogo from './images/barnbridge.png'
import convexLogo from './images/convex.png'
import cowswapLogo from './images/cowswap.png'
import creamLogo from './images/cream.png'
import curveLogo from './images/curve.png'
import instadappLogo from './images/instadapp.png'
import lidoLogo from './images/lido.png'
import paraswapLogo from './images/paraswap.png'
import reflexerLogo from './images/reflexer.png'
import saddleLogo from './images/saddle.png'
import uniswapLogo from './images/uniswap.png'
import unitLogo from './images/unit.png'
import yearnLogo from './images/yearn.png'
import classes from './style.module.css'

const APPS = [
  { name: 'Uniswap', url: 'https://app.uniswap.org', logoUrl: uniswapLogo },
  { name: 'Curve', url: 'https://curve.fi/', logoUrl: curveLogo },
  { name: 'Aave', url: 'https://app.aave.com/#/markets', logoUrl: aaveLogo },
  {
    name: 'Balancer',
    url: 'https://app.balancer.fi/#/',
    logoUrl: balancerLogo,
  },
  {
    name: 'Convex',
    url: 'https://www.convexfinance.com/stake',
    logoUrl: convexLogo,
  },
  { name: 'Alchemix', url: 'https://app.alchemix.fi/', logoUrl: alchemixLogo },
  {
    name: 'Instadapp',
    url: 'https://defi.instadapp.io/',
    logoUrl: instadappLogo,
  },
  {
    name: 'Reflexer',
    url: 'https://app.reflexer.finance/#/',
    logoUrl: reflexerLogo,
  },
  {
    name: 'Cowswap',
    url: 'https://cowswap.exchange/#/swap',
    logoUrl: cowswapLogo,
  },
  { name: 'Saddle', url: 'https://saddle.exchange/#/', logoUrl: saddleLogo },
  {
    name: 'Barnbridge',
    url: 'https://app.barnbridge.com/smart-alpha/pools',
    logoUrl: barnbridgeLogo,
  },
  { name: 'Paraswap', url: 'https://paraswap.io/#/', logoUrl: paraswapLogo },
  { name: 'Unit', url: 'https://unit.xyz/', logoUrl: unitLogo },
  { name: 'Cream', url: 'https://app.cream.finance/', logoUrl: creamLogo },
  { name: 'Yearn', url: 'https://yearn.finance/#/home', logoUrl: yearnLogo },
  { name: 'Lido', url: 'https://stake.lido.fi/', logoUrl: lidoLogo },
]

export const filterApps = (query: string) =>
  APPS.filter((app) =>
    app.name.toLowerCase().includes(query.trim().toLowerCase())
  )

interface Props {
  query: string
  onPick: (a: string) => void
}

const AppPicker: React.FC<Props> = ({ onPick, query }) => (
  <ul className={classes.appListContainer}>
    {filterApps(query).map((app) => (
      <li key={app.name} style={{ display: 'block' }}>
        <button
          onClick={() => {
            onPick(app.url)
          }}
          className={classes.appButton}
        >
          <img
            className={classes.logo}
            src={app.logoUrl}
            alt={app.name + ' logo'}
          />
          <div className={classes.name}>{app.name}</div>
        </button>
      </li>
    ))}
  </ul>
)

export default AppPicker
