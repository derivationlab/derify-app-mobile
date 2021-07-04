export default [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_maintenanceMarginRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_positionFeeRatio',
        type: 'uint256'
      }
    ],
    name: 'addMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'cancelClosePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'cancelOpenPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'clearing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'liquidatePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
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
        name: 'market',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'enum ClearingHouse.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Close',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '_size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      }
    ],
    name: 'closePosition',
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
        name: 'market',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'enum ClearingHouse.Side',
        name: 'side',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'size',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'leverage',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Open',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '_size',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_leverage',
        type: 'uint256'
      }
    ],
    name: 'openPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_price',
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
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
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
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Withdraw',
    type: 'event'
  },
  {
    inputs: [],
    name: 'checkClearing',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'checkLiquidate',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'fundBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getAccount',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'accountBalance',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'isUsed',
            type: 'bool'
          }
        ],
        internalType: 'struct ClearingHouse.UserAccount',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getDebtInterest',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getFreeDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getFreeLPReward',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getFreeStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLatestPrice',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getLPReward',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getMarketAccount',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'size',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openPrice',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openNotional',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'leverage',
                type: 'uint256'
              }
            ],
            internalType: 'struct ClearingHouse.Position',
            name: 'long',
            type: 'tuple'
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'size',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openPrice',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openNotional',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'leverage',
                type: 'uint256'
              }
            ],
            internalType: 'struct ClearingHouse.Position',
            name: 'short',
            type: 'tuple'
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'size',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openPrice',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openNotional',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'leverage',
                type: 'uint256'
              }
            ],
            internalType: 'struct ClearingHouse.Position[]',
            name: 'longOpenPending',
            type: 'tuple[]'
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'size',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openPrice',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openNotional',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'leverage',
                type: 'uint256'
              }
            ],
            internalType: 'struct ClearingHouse.Position[]',
            name: 'shortOpenPending',
            type: 'tuple[]'
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'size',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openPrice',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openNotional',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'leverage',
                type: 'uint256'
              }
            ],
            internalType: 'struct ClearingHouse.Position[]',
            name: 'longClosePending',
            type: 'tuple[]'
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'size',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openPrice',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'openNotional',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'leverage',
                type: 'uint256'
              }
            ],
            internalType: 'struct ClearingHouse.Position[]',
            name: 'shortClosePending',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct ClearingHouse.MarketAccount',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      }
    ],
    name: 'getMarketSize',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      }
    ],
    name: 'getMarketUnrealizedPnl',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_leverage',
        type: 'uint256'
      }
    ],
    name: 'getMaxOpenSize',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // --------------

  // -----------------------
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'getPendingClosePosition',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openNotional',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'leverage',
            type: 'uint256'
          }
        ],
        internalType: 'struct ClearingHouse.Position',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getPendingMargin',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'getPendingOpenPosition',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openNotional',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'leverage',
            type: 'uint256'
          }
        ],
        internalType: 'struct ClearingHouse.Position',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      },
      {
        internalType: 'enum ClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      }
    ],
    name: 'getPosition',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openNotional',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'leverage',
            type: 'uint256'
          }
        ],
        internalType: 'struct ClearingHouse.Position',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getPositionMargin',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getPositionNotional',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      }
    ],
    name: 'getSpotPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getStakeInterest',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getTotalMargin',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIdx',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getUnrealizedPnl',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'markets',
    outputs: [
      {
        internalType: 'uint256',
        name: 'maintenanceMarginRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'positionFeeRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'marketBalance',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'spotPrice',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
