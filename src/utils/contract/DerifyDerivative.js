export default [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_exchange",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_bond",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_broker",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_staking",
        "type": "address"
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
        "name": "trader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradingFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "positionChangeFee",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "pnlUsdt",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pnlBond",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Close",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradingFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "positionChangeFee",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Open",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "bond",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "broker",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchange",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "kRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "miningRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "roRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "staking",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tradingFeeRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tradingFeeRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_uRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_miningRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_kRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_gRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_roRatio",
        "type": "uint256"
      }
    ],
    "name": "updateRatios",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
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
      }
    ],
    "name": "openMarketPricePosition",
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
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limitPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "orderLimitPricePosition",
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
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyDerivative.StopType",
        "name": "stopType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "stopPrice",
        "type": "uint256"
      }
    ],
    "name": "orderStopPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
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
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      }
    ],
    "name": "closePositionByTrader",
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
        "internalType": "enum IDerifyDerivative.OrderType",
        "name": "orderType",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "cancleOrderedStopPosition",
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
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "cancleOrderedLimitPosition",
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
    "name": "cancleAllOrderedPositions",
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
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "closePositionByLiquidation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSpotPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "setSpotPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSideTotalAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "longTotalAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "shortTotalAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPositionChangeFeeRatio",
    "outputs": [
      {
        "internalType": "int256",
        "name": "ratio",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenTotalUnrealizedPnl",
    "outputs": [
      {
        "internalType": "int256",
        "name": "tokenTotalUnrealizedProfit",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "tokenTotalUnrealizedLoss",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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
    "name": "getTraderDerivativePositions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "isUsed",
            "type": "bool"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
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
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position",
            "name": "long",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
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
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position",
            "name": "short",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
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
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position[]",
            "name": "longOrderOpenPosition",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
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
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position[]",
            "name": "shortOrderOpenPosition",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "longOrderStopProfitPosition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "longOrderStopLossPosition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "shortOrderStopProfitPosition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "shortOrderStopLossPosition",
            "type": "tuple"
          }
        ],
        "internalType": "struct IDerifyDerivative.DerivativePositions",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "getTradingFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tradingFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyDerivative.ActionType",
        "name": "actionType",
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
      }
    ],
    "name": "getPositionChangeFee",
    "outputs": [
      {
        "internalType": "int256",
        "name": "positionChangeFee",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
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
        "name": "spotPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sysMaxOpenLongSize",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sysMaxOpenShortSize",
        "type": "uint256"
      }
    ],
    "name": "operateOrderedLimitPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
