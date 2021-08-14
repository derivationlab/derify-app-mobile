const getters = {
  trader: () => {return window.ethereum !== undefined ? ethereum.selectedAddress :  undefined}
}
export default getters
