export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_factory',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Withdraw',
    type: 'event'
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'enum IDerifyExchangeActions.AccountType',
        name: 'from',
        type: 'uint8'
      },
      {
        internalType: 'enum IDerifyExchangeActions.AccountType',
        name: 'to',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'enum IDerifyExchangeActions.OpenType',
        name: 'openType',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'leverage',
        type: 'uint256'
      }
    ],
    name: 'openPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.StopType',
        name: 'stopType',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'stopPrice',
        type: 'uint256'
      }
    ],
    name: 'orderStopPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      }
    ],
    name: 'closePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'closeAllPositions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.OrderType',
        name: 'orderType',
        type: 'uint8'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'cancleOrderedPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      }
    ],
    name: 'cancleAllOrderedPositions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      }
    ],
    name: 'getTraderAccount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256'
      },
      {
        internalType: 'int256',
        name: 'marginBalance',
        type: 'int256'
      },
      {
        internalType: 'uint256',
        name: 'totalMargin',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyExchangeActions.OpenType',
        name: 'openType',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'leverage',
        type: 'uint256'
      }
    ],
    name: 'getTraderOpenUpperBound',
    outputs: [
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      }
    ],
    name: 'getSysOpenUpperBound',
    outputs: [
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      }
    ],
    name: 'getCloseUpperBound',
    outputs: [
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      }
    ],
    name: 'setSpotPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      }
    ],
    name: 'getSpotPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'spotPrice',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      }
    ],
    name: 'getPositionChangeFeeRatio',
    outputs: [
      {
        internalType: 'int256',
        name: 'ratio',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      }
    ],
    name: 'getTradingFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tradingFee',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.ActionType',
        name: 'actionType',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      }
    ],
    name: 'getPositionChangeFee',
    outputs: [
      {
        internalType: 'int256',
        name: 'positionChangeFee',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      }
    ],
    name: 'getTraderPosition',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'isUsed',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'leverage',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256'
          }
        ],
        internalType: 'struct IDerifyDerivativeActions.Position',
        name: 'position',
        type: 'tuple'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.StopType',
        name: 'stopType',
        type: 'uint8'
      }
    ],
    name: 'getTraderOrderStopPosition',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'isUsed',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'stopPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256'
          }
        ],
        internalType: 'struct IDerifyDerivativeActions.StopPosition',
        name: 'sp',
        type: 'tuple'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      }
    ],
    name: 'getTraderOrderLimitPositions',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'isUsed',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'leverage',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256'
          }
        ],
        internalType: 'struct IDerifyDerivativeActions.Position[]',
        name: 'positions',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      }
    ],
    name: 'getTraderVariables',
    outputs: [
      {
        internalType: 'int256',
        name: 'marginBalance',
        type: 'int256'
      },
      {
        internalType: 'uint256',
        name: 'totalPositionAmount',
        type: 'uint256'
      },
      {
        internalType: 'int256',
        name: 'marginRate',
        type: 'int256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'spotPrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'leverage',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'averagePrice',
        type: 'uint256'
      }
    ],
    name: 'getTraderPositionVariables',
    outputs: [
      {
        internalType: 'uint256',
        name: 'margin',
        type: 'uint256'
      },
      {
        internalType: 'int256',
        name: 'unrealizedPnl',
        type: 'int256'
      },
      {
        internalType: 'int256',
        name: 'returnRate',
        type: 'int256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum IDerifyDerivativeActions.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'spotPrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'marginMaintenanceRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'marginBalance',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalPositionAmount',
        type: 'uint256'
      }
    ],
    name: 'getTraderPositionLiquidatePrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'liquidatePrice',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'checkOrderedPositions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'checkLiquidatePositions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
