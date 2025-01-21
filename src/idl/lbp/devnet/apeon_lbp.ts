/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/apeon_lbp.json`.
 */
export type ApeonLbp = {
  "address": "2GzN7ifA7CJR6PFpbam9SHdaB9hSXxeAPVpSoe5iQh9e",
  "metadata": {
    "name": "apeonLbp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimFund",
      "discriminator": [
        75,
        68,
        156,
        1,
        129,
        217,
        103,
        186
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true
        },
        {
          "name": "poolCreator",
          "writable": true,
          "signer": true
        },
        {
          "name": "lbpSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mint"
              },
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "poolCreatorTokenAccount",
          "writable": true
        },
        {
          "name": "poolTokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana ecosystem accounts"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "closePool",
      "discriminator": [
        140,
        189,
        209,
        23,
        239,
        62,
        239,
        11
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "lbpSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createFeeSettings",
      "discriminator": [
        9,
        134,
        229,
        223,
        222,
        87,
        179,
        94
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "lbpLauchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "platformAuthority",
          "type": "pubkey"
        },
        {
          "name": "tradeFeeWallet",
          "type": "pubkey"
        },
        {
          "name": "platformFeeNumerator",
          "type": "u64"
        },
        {
          "name": "platformFeeDenominator",
          "type": "u64"
        },
        {
          "name": "swapFeeNumerator",
          "type": "u64"
        },
        {
          "name": "swapFeeDenominator",
          "type": "u64"
        },
        {
          "name": "tradeMinimumSolAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createPool",
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "poolCreator",
          "writable": true,
          "signer": true
        },
        {
          "name": "lbpSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mint"
              },
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "poolCreatorTokenAccount",
          "writable": true
        },
        {
          "name": "poolTokenAccount",
          "writable": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "token",
          "type": "pubkey"
        },
        {
          "name": "startSolAmount",
          "type": "u64"
        },
        {
          "name": "startSolWeight",
          "type": "u64"
        },
        {
          "name": "endSolWeight",
          "type": "u64"
        },
        {
          "name": "startTokenAmount",
          "type": "u64"
        },
        {
          "name": "startTokenWeight",
          "type": "u64"
        },
        {
          "name": "endTokenWeight",
          "type": "u64"
        },
        {
          "name": "startAt",
          "type": "u32"
        },
        {
          "name": "endAt",
          "type": "u32"
        },
        {
          "name": "selectedEnv",
          "type": "u8"
        }
      ]
    },
    {
      "name": "swap",
      "discriminator": [
        248,
        198,
        158,
        145,
        225,
        117,
        135,
        200
      ],
      "accounts": [
        {
          "name": "tradeFeeWallet",
          "writable": true
        },
        {
          "name": "trader",
          "writable": true,
          "signer": true
        },
        {
          "name": "lbpSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mint"
              },
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "poolTokenAccount",
          "writable": true
        },
        {
          "name": "traderTokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana ecosystem accounts"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "tokenIn",
          "type": "bool"
        },
        {
          "name": "inputAmount",
          "type": "u64"
        },
        {
          "name": "amountOutputMin",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateFeeSettings",
      "discriminator": [
        155,
        121,
        178,
        253,
        181,
        139,
        103,
        177
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "lbpLauchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "platformAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "tradeFeeWallet",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "platformFeeNumerator",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "platformFeeDenominator",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "swapFeeNumerator",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "swapFeeDenominator",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tradeMinimumSolAmount",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "updatePauseStatus",
      "discriminator": [
        233,
        65,
        81,
        11,
        187,
        201,
        28,
        176
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "lbpLauchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  98,
                  112,
                  95,
                  108,
                  97,
                  117,
                  110,
                  99,
                  104,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "isPaused",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lbpLaunchSettings",
      "discriminator": [
        185,
        183,
        28,
        142,
        3,
        170,
        248,
        108
      ]
    },
    {
      "name": "poolData",
      "discriminator": [
        155,
        28,
        220,
        37,
        221,
        242,
        70,
        167
      ]
    }
  ],
  "events": [
    {
      "name": "claimFundEvent",
      "discriminator": [
        51,
        223,
        65,
        162,
        58,
        52,
        30,
        231
      ]
    },
    {
      "name": "feeSettingsEvent",
      "discriminator": [
        114,
        94,
        184,
        245,
        245,
        119,
        225,
        181
      ]
    },
    {
      "name": "poolBuyEvent",
      "discriminator": [
        99,
        142,
        88,
        205,
        115,
        159,
        5,
        168
      ]
    },
    {
      "name": "poolCreatedEvent",
      "discriminator": [
        25,
        94,
        75,
        47,
        112,
        99,
        53,
        63
      ]
    },
    {
      "name": "poolSellEvent",
      "discriminator": [
        155,
        114,
        9,
        4,
        124,
        124,
        212,
        122
      ]
    },
    {
      "name": "systemPauseEvent",
      "discriminator": [
        96,
        235,
        45,
        102,
        165,
        128,
        237,
        69
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "systemProcessPaused",
      "msg": "lbp process is paused"
    },
    {
      "code": 6001,
      "name": "invalidEndTime",
      "msg": "enddate should be greater than start date"
    },
    {
      "code": 6002,
      "name": "invalidStartTime",
      "msg": "startdate should be greater than current date"
    },
    {
      "code": 6003,
      "name": "unauthorizedSigner",
      "msg": "unauthorized signer"
    },
    {
      "code": 6004,
      "name": "unauthorizedPlatform",
      "msg": "unauthorized platform wallet"
    },
    {
      "code": 6005,
      "name": "outputTooSmall",
      "msg": "output is below the minimum expected"
    },
    {
      "code": 6006,
      "name": "poolNotOpended",
      "msg": "pool is not open"
    },
    {
      "code": 6007,
      "name": "poolClosed",
      "msg": "pool has closed"
    },
    {
      "code": 6008,
      "name": "poolOpened",
      "msg": "pool is active"
    },
    {
      "code": 6009,
      "name": "highSlippage",
      "msg": "swap failed due to high slippage"
    },
    {
      "code": 6010,
      "name": "insufficientSolBalance",
      "msg": "insufficient sol balance"
    },
    {
      "code": 6011,
      "name": "mismatchMint",
      "msg": "mint address mismatch"
    },
    {
      "code": 6012,
      "name": "invaildMint",
      "msg": "invaild mint"
    },
    {
      "code": 6013,
      "name": "invaildTokenWeight",
      "msg": "token start weight should be greater than end weight"
    },
    {
      "code": 6014,
      "name": "invaildEndWeightPercentage",
      "msg": "invaild end weight percentage"
    },
    {
      "code": 6015,
      "name": "invaildSolWeight",
      "msg": "sol end weight should be greater than start weight"
    },
    {
      "code": 6016,
      "name": "invaildStartWeightPercentage",
      "msg": "invaild start weight percentage"
    },
    {
      "code": 6017,
      "name": "invaildPoolCreator",
      "msg": "invaild pool creator"
    },
    {
      "code": 6018,
      "name": "unauthorizedPoolCreator",
      "msg": "action restricted to platform wallet only"
    },
    {
      "code": 6019,
      "name": "inVaildTokenSupply",
      "msg": "invaild supply"
    },
    {
      "code": 6020,
      "name": "inVaildTokenStartAmount",
      "msg": "invaild token start amount"
    },
    {
      "code": 6021,
      "name": "inVaildSolStartAmount",
      "msg": "invaild sol start amount"
    },
    {
      "code": 6022,
      "name": "inVaildSolStartWeight",
      "msg": "invaild sol start weight"
    },
    {
      "code": 6023,
      "name": "inVaildAmountIn",
      "msg": "invaild amount_in"
    },
    {
      "code": 6024,
      "name": "duplicateClaimRequest",
      "msg": "fund already claimed"
    },
    {
      "code": 6025,
      "name": "invalidEndDuration",
      "msg": "The maximum LBP duration is limited to 3 days"
    },
    {
      "code": 6026,
      "name": "inVaildSolEndWeight",
      "msg": "invaild sol end weight"
    },
    {
      "code": 6027,
      "name": "inVaildTokenEndWeight",
      "msg": "invaild token end weight"
    },
    {
      "code": 6028,
      "name": "amoutOutZero",
      "msg": "amount out is zero"
    },
    {
      "code": 6029,
      "name": "unauthorizedTradeFeeWallet",
      "msg": "invaild trade fee wallet"
    }
  ],
  "types": [
    {
      "name": "claimFundEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "poolCreator",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "claimedFee",
            "type": "u64"
          },
          {
            "name": "claimedSol",
            "type": "u64"
          },
          {
            "name": "claimedToken",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "feeSettingsEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platformAuthority",
            "type": "pubkey"
          },
          {
            "name": "tradeFeeWallet",
            "type": "pubkey"
          },
          {
            "name": "platformFeeNumerator",
            "type": "u64"
          },
          {
            "name": "platformFeeDenominator",
            "type": "u64"
          },
          {
            "name": "swapFeeNumerator",
            "type": "u64"
          },
          {
            "name": "swapFeeDenominator",
            "type": "u64"
          },
          {
            "name": "tradeMinimumSolAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lbpLaunchSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platformAuthority",
            "type": "pubkey"
          },
          {
            "name": "tradeFeeWallet",
            "type": "pubkey"
          },
          {
            "name": "platformFeeNumerator",
            "type": "u64"
          },
          {
            "name": "platformFeeDenominator",
            "type": "u64"
          },
          {
            "name": "swapFeeNumerator",
            "type": "u64"
          },
          {
            "name": "swapFeeDenominator",
            "type": "u64"
          },
          {
            "name": "tradeMinimumSolAmount",
            "type": "u64"
          },
          {
            "name": "isPaused",
            "type": "bool"
          },
          {
            "name": "buffer",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolBuyEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "trader",
            "type": "pubkey"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "solBal",
            "type": "u64"
          },
          {
            "name": "tokenBal",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "poolCreatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "solBalance",
            "type": "u64"
          },
          {
            "name": "tokenBalance",
            "type": "u64"
          },
          {
            "name": "startSolAmount",
            "type": "u64"
          },
          {
            "name": "startSolWeight",
            "type": "u64"
          },
          {
            "name": "endSolWeight",
            "type": "u64"
          },
          {
            "name": "startTokenAmount",
            "type": "u64"
          },
          {
            "name": "startTokenWeight",
            "type": "u64"
          },
          {
            "name": "endTokenWeight",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "u32"
          },
          {
            "name": "startAt",
            "type": "u32"
          },
          {
            "name": "endAt",
            "type": "u32"
          },
          {
            "name": "platformFeeNumerator",
            "type": "u64"
          },
          {
            "name": "platformFeeDenominator",
            "type": "u64"
          },
          {
            "name": "swapFeeNumerator",
            "type": "u64"
          },
          {
            "name": "swapFeeDenominator",
            "type": "u64"
          },
          {
            "name": "tradeMinimumSolAmount",
            "type": "u64"
          },
          {
            "name": "selectedEnv",
            "type": "u8"
          },
          {
            "name": "fundClaimed",
            "type": "bool"
          },
          {
            "name": "buffer",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "solBalance",
            "type": "u64"
          },
          {
            "name": "tokenBalance",
            "type": "u64"
          },
          {
            "name": "startSolAmount",
            "type": "u64"
          },
          {
            "name": "startSolWeight",
            "type": "u64"
          },
          {
            "name": "endSolWeight",
            "type": "u64"
          },
          {
            "name": "startTokenAmount",
            "type": "u64"
          },
          {
            "name": "startTokenWeight",
            "type": "u64"
          },
          {
            "name": "endTokenWeight",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "u32"
          },
          {
            "name": "startAt",
            "type": "u32"
          },
          {
            "name": "endAt",
            "type": "u32"
          },
          {
            "name": "platformFeeNumerator",
            "type": "u64"
          },
          {
            "name": "platformFeeDenominator",
            "type": "u64"
          },
          {
            "name": "swapFeeNumerator",
            "type": "u64"
          },
          {
            "name": "swapFeeDenominator",
            "type": "u64"
          },
          {
            "name": "tradeMinimumSolAmount",
            "type": "u64"
          },
          {
            "name": "selectedEnv",
            "type": "u8"
          },
          {
            "name": "fundClaimed",
            "type": "bool"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "buffer",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolSellEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "trader",
            "type": "pubkey"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "solBal",
            "type": "u64"
          },
          {
            "name": "tokenBal",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "systemPauseEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isPaused",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "platformSeed",
      "type": "bytes",
      "value": "[108, 98, 112, 95, 108, 97, 117, 110, 99, 104]"
    },
    {
      "name": "settingSeed",
      "type": "bytes",
      "value": "[108, 98, 112, 95, 108, 97, 117, 110, 99, 104, 95, 115, 101, 116, 116, 105, 110, 103, 115]"
    }
  ]
};
