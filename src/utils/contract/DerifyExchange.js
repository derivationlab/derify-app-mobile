export default [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenUSD",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_marginMaintenanceRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_marginLiquidationRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_thetaRatio",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "enum IDerifyExchange.FeeType",
        "name": "feeType",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "TraderBalanceUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "gasFeePool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "insuranceFundPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "liquidityPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "marginLiquidationRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "marginMaintenanceRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "thetaRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "tokenUSD",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyExchange.AccountType",
        "name": "from",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyExchange.AccountType",
        "name": "to",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyExchange.FeeType",
        "name": "feeType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      }
    ],
    "name": "operateTraderBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      }
    ],
    "name": "getTraderBalance",
    "outputs": [
      {
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "exchangeBondByInsuranceFund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "operateLiquidityBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferGasFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyExchange.OpenType",
        "name": "openType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "openPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      }
    ],
    "name": "closePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "closeAllPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "sysLoss",
        "type": "uint256"
      }
    ],
    "name": "getTraderMarginCompensation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "traderMarginCompensation",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllTraders",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getSysTotalPositionAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "sysTotalPositionAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getSysTotalProfitAndLoss",
    "outputs": [
      {
        "internalType": "int256",
        "name": "sysNetPnl",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "sysTotalUnrealizedProfit",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "sysTotalUnrealizedLoss",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getSysTotalNetProfitDerivative",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "sysTotalNetProfit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyExchange.OpenType",
        "name": "openType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "getTraderOpenUpperBound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "getSysOpenUpperBound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "getCloseUpperBound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      }
    ],
    "name": "getTraderAccount",
    "outputs": [
      {
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "marginBalance",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "totalMargin",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      }
    ],
    "name": "getTraderVariables",
    "outputs": [
      {
        "internalType": "int256",
        "name": "marginBalance",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "totalPositionAmount",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "marginRate",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "spotPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averagePrice",
        "type": "uint256"
      }
    ],
    "name": "getTraderPositionVariables",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "margin",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "unrealizedPnl",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "returnRate",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "spotPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "marginBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalPositionAmount",
        "type": "uint256"
      }
    ],
    "name": "getTraderPositionLiquidatePrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "liquidatePrice",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "openTrader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "openToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "closeTrader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "closeToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "estimateGasFee",
        "type": "uint256"
      }
    ],
    "name": "operateOrderedPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "partLiquidateTraders",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "liquidateTraders",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "estimateGasFee",
        "type": "uint256"
      }
    ],
    "name": "operateLiquidatePositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
