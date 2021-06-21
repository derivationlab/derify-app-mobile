import Web3 from 'web3'
import contractAbi from '@/utils/contractAbi'

const ethUrl = 'https://kovan.infura.io/v3/4790cd7bb24349738a3b05ee0c20746e'
const contractAddress = '0x43b429d43218Aac1559B48e91C2D1f2947767121'

// create or get instance
function _contractInstance () {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    const web3 = new Web3(new Web3.providers.HttpProvider(ethUrl))
    window.web3 = web3
  }
  const contract = new window.web3.eth.Contract(contractAbi, contractAddress)
  return contract
}

export function getAccount (address) {
  const call = _contractInstance().methods.getAccount(address).call()
  return call
}

export function deposit (address, amount) {
  const transaction = _contractInstance().methods.deposit(amount).send({
    from: address
  })
  return transaction
}

export function withdraw (address, amount) {
  const transaction = _contractInstance().methods.withdraw(address, amount).send({
    from: address
  })
  return transaction
}

export function enable () {
  if (!window.ethereum) {
    return new Promise((resolve, reject) => {
      reject(new Error('please install Metamask'))
    })
  }
  return new Promise((resolve, reject) => {
    window.ethereum.request({
      method: 'eth_requestAccounts'
    }).then(r => resolve(r)).catch(e => reject(e))
  })
}
