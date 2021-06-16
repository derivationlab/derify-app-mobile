import Web3 from 'web3'
import contractAbi from '@/utils/contractAbi'

const ethUrl = 'https://kovan.infura.io/v3/4790cd7bb24349738a3b05ee0c20746e'
const contractAddress = '0x4D98D41436da0892b3Dd51c6f41eceF04f56898d'

// create or get instance
function _web3Instance () {
  if (window.contractInstance) return window.contractInstance
  const provider = new Web3.providers.HttpProvider(ethUrl)
  const nWeb3 = new Web3(provider)
  const contract = new nWeb3.eth.Contract(contractAbi, contractAddress)
  window.contractInstance = contract
  return contract
}

export function getAccount (address) {
  const call = _web3Instance().methods.getAccount(address).call()
  return call
}

export function deposit (address, amount) {
  const call = _web3Instance().methods.deposit(amount).call()
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
