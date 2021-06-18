import Web3 from 'web3'
import contractAbi from '@/utils/contractAbi'

const ethUrl = 'https://kovan.infura.io/v3/4790cd7bb24349738a3b05ee0c20746e'
const contractAddress = '0x43b429d43218Aac1559B48e91C2D1f2947767121'

// create or get instance
function _contractInstance () {
  if (window.contractInstance) return window.contractInstance
  const web3 = new Web3(new Web3.providers.HttpProvider(ethUrl))
  const contract = new web3.eth.Contract(contractAbi, contractAddress)
  window.web3 = web3
  window.contractInstance = contract
  return contract
}

export function getAccount (address) {
  const call = _contractInstance().methods.getAccount(address).call()
  return call
}

export function deposit (address, amount) {
  const call = _contractInstance().methods.deposit(amount).send({
    from: address,
    value: amount
  })
  // need to solve : The method eth_sendTransaction does not exist/is not available
  return call
}

export function enable () {
  if (!window.ethereum) {
    return new Promise((resolve, reject) => {
      reject(new Error('please install Metamask'))
    })
  }
  return window.ethereum && window.ethereum.enable()
}
