import {
  useAccount,
  useNetwork,
  useConnect,
  useDisconnect,
} from 'wagmi'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3NetworkSwitch } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig} from 'wagmi'
import { mainnet, zora, optimism, arbitrum, polygon } from 'wagmi/chains'
import { Web3Button } from '@web3modal/react'
import { BridgeMint } from './BridgeMint'

import './App.css'


function  App() {
  const chains = [mainnet, zora, optimism, arbitrum, polygon]

  const projectId = '24e38ae614a2699cb2ca969bcc39def5'
      
  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
  })
  const { address, connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  const ethereumClient = new EthereumClient(wagmiConfig, chains)
  
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <div className="navbar">
          <Web3Button />
        </div>
        
        <div className="nft_container">
          <div className="nft_container_row">
            <img src="nft.png" alt="avatar" className="nft"/>
          </div>
          <div className="nft_container_row">

          <small>
              this is an example for minting an nft on zora with mainnet eth
              as <a href="https://twitter.com/maurelian_/status/1675003198073982976" target="_blank">explained by @maurelian_ </a><br></br>
              free NFT, just pay the <b>0.000777 eth zora mint fee </b>(+ gas)<br></br>
              pay with eth on mainnet and it will be bridged to zora automatically to mint the nft.<br></br>
              <a href="https://zora.co/collect/zora:0x6e2298914943ebe485fe780aa9117d9dc2f79e3e">
              view nft on zora.co
              </a>
            </small>
          </div>
          
          {(isConnected && chain.name === "Ethereum") && (
          <div className="nft_container_row">
            <BridgeMint />
          </div>
          )}
          {(isConnected &&chain.name != "Ethereum") && (
            <>
              <div className="nft_container_row">
                For the purpose of this demo you should connect your wallet to mainnet :)
              </div>
              <div className="nft_container_row">
                <Web3NetworkSwitch />
              </div>
            </>
          )}

        </div>

      </WagmiConfig>

      <Web3Modal themeMode="dark" 
        projectId={projectId} ethereumClient={ethereumClient} 
        themeVariables={{
          '--w3m-accent-color': '#646cffaa',
          '--w3m-background-color': '#646cffaa',
        }}  
      />
    </>
  )
}

export default App