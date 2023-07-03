import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useNetwork,
  useConnect,
  useDisconnect,
} from 'wagmi'

export function BridgeMint() {
    const nft_contract_address_zora = "0x6e2298914943ebe485fe780aa9117d9dc2f79e3e"
    const zora_portal_address = "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
    const mint_hex = "0xefef39a10000000000000000000000000000000000000000000000000000000000000001"

  const { address, connector, isConnected } = useAccount()
  const { chain } = useNetwork()

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    address: zora_portal_address,
    abi: [
        {
            inputs:[
                {internalType:"address",
                name:"_to",
                type:"address"},
                {internalType:"uint256",
                name:"_value",
                type:"uint256"},
                {internalType:"uint64",
                name:"_gasLimit",
                type:"uint64"},
                {internalType:"bool",
                name:"_isCreation",
                type:"bool"},
                {internalType:"bytes",
                name:"_data",
                type:"bytes"}
            ],
            name:"depositTransaction",
            outputs:[],
            stateMutability:"payable",
            type:"function"
        }
    ],
    functionName: 'depositTransaction',
    args: [nft_contract_address_zora, 777000000000000, 400000, 0, mint_hex],
    value: 777000000000000
  })
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  if (isConnected){
  return (

    <div>
      <button className="bridge_mint_button" disabled={!write || isLoading} onClick={() => write()}>
        {isLoading ? 'Bridging and Minting...' : 'Mint from mainnet onto Zora'}
      </button>

      {isSuccess && (
        <div>
          Successfully bridged and minted your NFT on Zora!<br></br>
          View the transaction here <a href={"https://etherscan.io/tx/" + data?.hash} target="_blank">etherscan.io</a>
        </div>
      )}
      {( isPrepareError || isError) && (
        <div>Error {([prepareError || error]?.message)}</div>
      )}
    </div>
    
  )}
}
