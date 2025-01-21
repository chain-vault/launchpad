/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/apeon_fastlaunch.json`.
 */
export type ApeonFastlaunch = {
  "address": "Ap1nnGSwsV33xPuGkj2CmvUtTNKSnZ72xYxTKSzjpqQH",
  "metadata": {
    "name": "apeonFastlaunch",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "burnRemainingToken",
      "discriminator": [
        86,
        94,
        123,
        99,
        246,
        111,
        139,
        6
      ],
      "accounts": [
        {
          "name": "liquidityCreator",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
                  102,
                  97,
                  115,
                  116,
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
          "name": "liquidityCreatorTokenAccount",
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
      "name": "buy",
      "discriminator": [
        102,
        6,
        61,
        18,
        1,
        218,
        235,
        234
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
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "curveAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "curveIndex"
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
                  102,
                  97,
                  115,
                  116,
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
          "name": "base",
          "writable": true,
          "signer": true
        },
        {
          "name": "lockEventAuthority",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "escrowMetadata",
          "writable": true
        },
        {
          "name": "escrowToken",
          "writable": true
        },
        {
          "name": "lockProgram",
          "address": "LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn"
        }
      ],
      "args": [
        {
          "name": "curveIndex",
          "type": "string"
        },
        {
          "name": "inputAmount",
          "type": "u128"
        },
        {
          "name": "amountOutputMin",
          "type": "u128"
        }
      ]
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
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
                  102,
                  97,
                  115,
                  116,
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
      "name": "createCurveAccounts",
      "discriminator": [
        198,
        177,
        177,
        159,
        109,
        151,
        207,
        29
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "curveAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "curveIndex"
              }
            ]
          }
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "curveIndex",
          "type": "string"
        },
        {
          "name": "curveType",
          "type": "u8"
        },
        {
          "name": "coefficient1",
          "type": "u128"
        },
        {
          "name": "coefficient2",
          "type": "u128"
        },
        {
          "name": "maxRaiseAmount",
          "type": "u128"
        },
        {
          "name": "maxSoldTokens",
          "type": "u128"
        },
        {
          "name": "targetMarketcap",
          "type": "u128"
        }
      ]
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
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "liquidityCreatorWallet",
          "type": "pubkey"
        },
        {
          "name": "lpRiskMitigationWallet",
          "type": "pubkey"
        },
        {
          "name": "initialTokenForSale",
          "type": "u128"
        },
        {
          "name": "initialTokenForLp",
          "type": "u128"
        },
        {
          "name": "tradeFeeNumerator",
          "type": "u128"
        },
        {
          "name": "tradeFeeDenominator",
          "type": "u128"
        },
        {
          "name": "maxRaiseAmount",
          "type": "u128"
        },
        {
          "name": "tradeMinimumSolAmount",
          "type": "u128"
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
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "curveAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "curveIndex"
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
                  102,
                  97,
                  115,
                  116,
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
          "name": "curveIndex",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "initalBuyLockDays",
          "type": "u8"
        },
        {
          "name": "selectedDex",
          "type": "u8"
        },
        {
          "name": "selectedEnv",
          "type": "u8"
        }
      ]
    },
    {
      "name": "sell",
      "discriminator": [
        51,
        230,
        133,
        164,
        1,
        127,
        131,
        173
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
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "curveAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "curveIndex"
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
                  102,
                  97,
                  115,
                  116,
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
          "name": "base",
          "writable": true,
          "signer": true
        },
        {
          "name": "lockEventAuthority",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "escrowMetadata",
          "writable": true
        },
        {
          "name": "escrowToken",
          "writable": true
        },
        {
          "name": "lockProgram",
          "address": "LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn"
        }
      ],
      "args": [
        {
          "name": "curveIndex",
          "type": "string"
        },
        {
          "name": "inputAmount",
          "type": "u128"
        },
        {
          "name": "amountOutputMin",
          "type": "u128"
        }
      ]
    },
    {
      "name": "updateCurveAccounts",
      "discriminator": [
        28,
        170,
        47,
        18,
        229,
        136,
        117,
        236
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "curveAccounts",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "curveIndex"
              }
            ]
          }
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "curveIndex",
          "type": "string"
        },
        {
          "name": "coefficient1",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "coefficient2",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "maxRaiseAmount",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "maxSoldTokens",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "targetMarketcap",
          "type": {
            "option": "u128"
          }
        }
      ]
    },
    {
      "name": "updateLiquidityPoolAddress",
      "discriminator": [
        158,
        79,
        51,
        86,
        17,
        148,
        38,
        101
      ],
      "accounts": [
        {
          "name": "liquidityCreator",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
                  102,
                  97,
                  115,
                  116,
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
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "liquidityPoolAddress",
          "type": "pubkey"
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
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
    },
    {
      "name": "updatePlatformAuthorityWallet",
      "discriminator": [
        243,
        97,
        49,
        117,
        151,
        232,
        118,
        38
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
        }
      ]
    },
    {
      "name": "updatePlatformWallets",
      "discriminator": [
        207,
        91,
        229,
        237,
        39,
        111,
        136,
        16
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "tradeFeeWallet",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "liquidityCreatorWallet",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "lpRiskMitigationWallet",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "updatePoolEnv",
      "discriminator": [
        72,
        159,
        12,
        8,
        237,
        72,
        60,
        211
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
                  102,
                  97,
                  115,
                  116,
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
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "selectedEnv",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateSaleTokenDetails",
      "discriminator": [
        75,
        40,
        87,
        3,
        252,
        148,
        64,
        251
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "initialTokenForSale",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "initialTokenForLp",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "maxRaiseAmount",
          "type": {
            "option": "u128"
          }
        }
      ]
    },
    {
      "name": "updateTradeFee",
      "discriminator": [
        186,
        69,
        168,
        25,
        5,
        73,
        89,
        26
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "tradeFeeNumerator",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "tradeFeeDenominator",
          "type": {
            "option": "u128"
          }
        }
      ]
    },
    {
      "name": "updateTradeMinimumSolAmount",
      "discriminator": [
        200,
        251,
        116,
        7,
        76,
        111,
        98,
        72
      ],
      "accounts": [
        {
          "name": "platformAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
          "name": "tradeMinimumSolAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "withdrawLiquidity",
      "discriminator": [
        149,
        158,
        33,
        185,
        47,
        243,
        253,
        31
      ],
      "accounts": [
        {
          "name": "liquidityCreator",
          "writable": true,
          "signer": true
        },
        {
          "name": "launchSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  115,
                  116,
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
                  102,
                  97,
                  115,
                  116,
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
          "name": "liquidityCreatorTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "curveAccounts",
      "discriminator": [
        11,
        39,
        14,
        10,
        138,
        178,
        55,
        245
      ]
    },
    {
      "name": "fastLaunchSettings",
      "discriminator": [
        255,
        107,
        165,
        8,
        120,
        199,
        236,
        142
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
      "name": "curveAccountsUpdateEvent",
      "discriminator": [
        232,
        83,
        185,
        117,
        28,
        216,
        130,
        218
      ]
    },
    {
      "name": "curveThresholdReachedEvent",
      "discriminator": [
        252,
        20,
        25,
        224,
        240,
        64,
        115,
        42
      ]
    },
    {
      "name": "fastLaunchSettingUpdateEvent",
      "discriminator": [
        123,
        30,
        135,
        160,
        81,
        21,
        97,
        37
      ]
    },
    {
      "name": "liquidityPoolAddressUpdatedEvent",
      "discriminator": [
        124,
        120,
        178,
        167,
        233,
        140,
        161,
        23
      ]
    },
    {
      "name": "liquidityWithdrawnEvent",
      "discriminator": [
        76,
        239,
        52,
        31,
        16,
        147,
        153,
        227
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
    },
    {
      "name": "tokenBurnEvent",
      "discriminator": [
        51,
        27,
        242,
        215,
        185,
        35,
        71,
        20
      ]
    },
    {
      "name": "tokenLockEvent",
      "discriminator": [
        234,
        49,
        51,
        40,
        221,
        223,
        128,
        44
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "systemProcessPaused",
      "msg": "protocol is temporarily paused for maintenance"
    },
    {
      "code": 6001,
      "name": "unauthorizedSigner",
      "msg": "unauthorized signer"
    },
    {
      "code": 6002,
      "name": "unauthorizedPlatform",
      "msg": "unauthorized platform wallet"
    },
    {
      "code": 6003,
      "name": "invalidDexPlatform",
      "msg": "select dex platform is not valid"
    },
    {
      "code": 6004,
      "name": "invaildMint",
      "msg": "invaild mint"
    },
    {
      "code": 6005,
      "name": "mintSupplyMismatch",
      "msg": "mint supply mismatch"
    },
    {
      "code": 6006,
      "name": "insufficientSolInPool",
      "msg": "pool does not have sufficient balance"
    },
    {
      "code": 6007,
      "name": "invalidFee",
      "msg": "The provided fee does not match the program owner's constraints"
    },
    {
      "code": 6008,
      "name": "exceededSlippage",
      "msg": "Swap instruction exceeds desired slippage limit"
    },
    {
      "code": 6009,
      "name": "inVaildAmountIn",
      "msg": "amount_in should be greater than zero"
    },
    {
      "code": 6010,
      "name": "mismatchMint",
      "msg": "mint address mismatch"
    },
    {
      "code": 6011,
      "name": "invaildPoolCreator",
      "msg": "pool creator address mismatch"
    },
    {
      "code": 6012,
      "name": "poolMarketCapReached",
      "msg": "pool market cap reached"
    },
    {
      "code": 6013,
      "name": "invaildLockProgram",
      "msg": "invaild lock program"
    },
    {
      "code": 6014,
      "name": "curveThresholdNotReached",
      "msg": "liquidity creation failed: CurveThreshold not reached."
    },
    {
      "code": 6015,
      "name": "invaildLiquidityCreator",
      "msg": "liquidity creator wallet miss match."
    },
    {
      "code": 6016,
      "name": "duplicateliquidityWithdrawRequest",
      "msg": "liquidity already withdrawn"
    },
    {
      "code": 6017,
      "name": "liquidityWithdrawPending",
      "msg": "liquidity withdraw pending"
    },
    {
      "code": 6018,
      "name": "duplicateLiquidityAddressUpdateRequest",
      "msg": "liquidity address already updated"
    },
    {
      "code": 6019,
      "name": "liquidityAddressUpdatePending",
      "msg": "liquidity address is not updated"
    },
    {
      "code": 6020,
      "name": "inVaildTradeMinimumSolAmount",
      "msg": "trade minimum sol amount should be greater than zero"
    },
    {
      "code": 6021,
      "name": "tradeSolAmountValidation",
      "msg": "trade sol amount should be greater than trade_minimum_sol_amount"
    },
    {
      "code": 6022,
      "name": "invaildCharacterInPoolName",
      "msg": "pool name should be ascii character"
    },
    {
      "code": 6023,
      "name": "invaildPoolNameMinLength",
      "msg": "pool name length should be at least 4 characters"
    },
    {
      "code": 6024,
      "name": "invaildPoolNameMaxLength",
      "msg": "pool name length should not exceed 32 characters"
    },
    {
      "code": 6025,
      "name": "invailLockPeriod",
      "msg": "invaild lock period"
    },
    {
      "code": 6026,
      "name": "invaildCurveAccount",
      "msg": "invalid curve account"
    },
    {
      "code": 6027,
      "name": "unauthorizedTradeFeeWallet",
      "msg": "unauthorized trade fee wallet"
    }
  ],
  "types": [
    {
      "name": "boundingCurveType",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "constantProduct"
          }
        ]
      }
    },
    {
      "name": "curveAccounts",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "curveIndex",
            "type": "string"
          },
          {
            "name": "curveType",
            "type": {
              "defined": {
                "name": "boundingCurveType"
              }
            }
          },
          {
            "name": "coefficient1",
            "type": "u128"
          },
          {
            "name": "coefficient2",
            "type": "u128"
          },
          {
            "name": "productConstant",
            "type": "u128"
          },
          {
            "name": "maxRaiseAmount",
            "type": "u128"
          },
          {
            "name": "maxSoldTokens",
            "type": "u128"
          },
          {
            "name": "targetMarketcap",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "curveAccountsUpdateEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "curveIndex",
            "type": "string"
          },
          {
            "name": "curveType",
            "type": {
              "defined": {
                "name": "boundingCurveType"
              }
            }
          },
          {
            "name": "coefficient1",
            "type": "u128"
          },
          {
            "name": "coefficient2",
            "type": "u128"
          },
          {
            "name": "productConstant",
            "type": "u128"
          },
          {
            "name": "maxRaiseAmount",
            "type": "u128"
          },
          {
            "name": "maxSoldTokens",
            "type": "u128"
          },
          {
            "name": "targetMarketcap",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "curveThresholdReachedEvent",
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
            "name": "solBal",
            "type": "u128"
          },
          {
            "name": "tokenBal",
            "type": "u128"
          },
          {
            "name": "tokenPrice",
            "type": "u128"
          },
          {
            "name": "dexPlatform",
            "type": "u8"
          },
          {
            "name": "poolCreator",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "fastLaunchSettingUpdateEvent",
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
            "name": "liquidityCreatorWallet",
            "type": "pubkey"
          },
          {
            "name": "lpRiskMitigationWallet",
            "type": "pubkey"
          },
          {
            "name": "initialPoolTokenValue",
            "type": "u128"
          },
          {
            "name": "initialTokenForSale",
            "type": "u128"
          },
          {
            "name": "initialTokenForLp",
            "type": "u128"
          },
          {
            "name": "tradeFeeNumerator",
            "type": "u128"
          },
          {
            "name": "tradeFeeDenominator",
            "type": "u128"
          },
          {
            "name": "curveThreshold",
            "type": "u128"
          },
          {
            "name": "maxRaiseAmount",
            "type": "u128"
          },
          {
            "name": "tradeMinimumSolAmount",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "fastLaunchSettings",
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
            "name": "liquidityCreatorWallet",
            "type": "pubkey"
          },
          {
            "name": "lpRiskMitigationWallet",
            "type": "pubkey"
          },
          {
            "name": "isPaused",
            "type": "bool"
          },
          {
            "name": "initialPoolTokenValue",
            "type": "u128"
          },
          {
            "name": "initialTokenForSale",
            "type": "u128"
          },
          {
            "name": "initialTokenForLp",
            "type": "u128"
          },
          {
            "name": "tradeFeeNumerator",
            "type": "u128"
          },
          {
            "name": "tradeFeeDenominator",
            "type": "u128"
          },
          {
            "name": "curveThreshold",
            "type": "u128"
          },
          {
            "name": "maxRaiseAmount",
            "type": "u128"
          },
          {
            "name": "tradeMinimumSolAmount",
            "type": "u128"
          },
          {
            "name": "updatedAt",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "liquidityPoolAddressUpdatedEvent",
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
            "name": "liquidityPoolAddress",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "liquidityWithdrawnEvent",
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
            "name": "solBal",
            "type": "u128"
          },
          {
            "name": "tokenBal",
            "type": "u128"
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
            "name": "poolCreatorTokenBalance",
            "type": "u128"
          },
          {
            "name": "coefficient1",
            "type": "u128"
          },
          {
            "name": "coefficient2",
            "type": "u128"
          },
          {
            "name": "trader",
            "type": "pubkey"
          },
          {
            "name": "amountIn",
            "type": "u128"
          },
          {
            "name": "amountOut",
            "type": "u128"
          },
          {
            "name": "solBal",
            "type": "u128"
          },
          {
            "name": "tokenBal",
            "type": "u128"
          },
          {
            "name": "tokenPrice",
            "type": "u128"
          },
          {
            "name": "fee",
            "type": "u128"
          },
          {
            "name": "curveThresholdProgress",
            "type": "u128"
          },
          {
            "name": "curveThresholdReached",
            "type": "bool"
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
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "solBalance",
            "type": "u128"
          },
          {
            "name": "tokenBalance",
            "type": "u128"
          },
          {
            "name": "initialBuyLockDays",
            "type": "u64"
          },
          {
            "name": "initialTokenSupply",
            "type": "u128"
          },
          {
            "name": "tradeFeeNumerator",
            "type": "u128"
          },
          {
            "name": "tradeFeeDenominator",
            "type": "u128"
          },
          {
            "name": "selectedDex",
            "type": "u8"
          },
          {
            "name": "selectedEnv",
            "type": "u8"
          },
          {
            "name": "poolCreator",
            "type": "pubkey"
          },
          {
            "name": "poolCreatorTokenBalance",
            "type": "u128"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "liquidityPool",
            "type": "pubkey"
          },
          {
            "name": "liquidityWithdrawStatus",
            "type": "bool"
          },
          {
            "name": "coefficient1",
            "type": "u128"
          },
          {
            "name": "coefficient2",
            "type": "u128"
          },
          {
            "name": "tokenPrice",
            "type": "u128"
          },
          {
            "name": "curveThresholdProgress",
            "type": "u128"
          },
          {
            "name": "curveThresholdReached",
            "type": "bool"
          },
          {
            "name": "curve",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
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
            "type": "u128"
          },
          {
            "name": "tokenBalance",
            "type": "u128"
          },
          {
            "name": "initialBuyLockDays",
            "type": "u64"
          },
          {
            "name": "initialTokenSupply",
            "type": "u128"
          },
          {
            "name": "tradeFeeNumerator",
            "type": "u128"
          },
          {
            "name": "tradeFeeDenominator",
            "type": "u128"
          },
          {
            "name": "selectedDex",
            "type": "u8"
          },
          {
            "name": "selectedEnv",
            "type": "u8"
          },
          {
            "name": "poolCreator",
            "type": "pubkey"
          },
          {
            "name": "poolCreatorTokenBalance",
            "type": "u128"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "liquidityPool",
            "type": "pubkey"
          },
          {
            "name": "liquidityWithdrawStatus",
            "type": "bool"
          },
          {
            "name": "coefficient1",
            "type": "u128"
          },
          {
            "name": "coefficient2",
            "type": "u128"
          },
          {
            "name": "curveThresholdProgress",
            "type": "u128"
          },
          {
            "name": "curveThresholdReached",
            "type": "bool"
          },
          {
            "name": "tokenPrice",
            "type": "u128"
          },
          {
            "name": "curve",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
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
            "name": "poolCreatorTokenBalance",
            "type": "u128"
          },
          {
            "name": "coefficient1",
            "type": "u128"
          },
          {
            "name": "coefficient2",
            "type": "u128"
          },
          {
            "name": "trader",
            "type": "pubkey"
          },
          {
            "name": "amountIn",
            "type": "u128"
          },
          {
            "name": "amountOut",
            "type": "u128"
          },
          {
            "name": "solBal",
            "type": "u128"
          },
          {
            "name": "tokenBal",
            "type": "u128"
          },
          {
            "name": "tokenPrice",
            "type": "u128"
          },
          {
            "name": "fee",
            "type": "u128"
          },
          {
            "name": "curveThresholdProgress",
            "type": "u128"
          },
          {
            "name": "curveThresholdReached",
            "type": "bool"
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
    },
    {
      "name": "tokenBurnEvent",
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
            "name": "burnedToken",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokenLockEvent",
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
            "name": "lockStarttime",
            "type": "u64"
          },
          {
            "name": "lockPeriod",
            "type": "u64"
          },
          {
            "name": "lockedToken",
            "type": "u64"
          },
          {
            "name": "lockProgram",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "escrowToken",
            "type": "pubkey"
          },
          {
            "name": "escrowMetadata",
            "type": "pubkey"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "curveSeed",
      "type": "bytes",
      "value": "[102, 97, 115, 116, 95, 99, 117, 114, 118, 101]"
    },
    {
      "name": "curveThresholdProgress",
      "type": "u128",
      "value": "100000"
    },
    {
      "name": "platformSeed",
      "type": "bytes",
      "value": "[102, 97, 115, 116, 95, 108, 97, 117, 110, 99, 104]"
    },
    {
      "name": "secondsInDay",
      "type": "u64",
      "value": "86400"
    },
    {
      "name": "settingSeed",
      "type": "bytes",
      "value": "[102, 97, 115, 116, 95, 115, 101, 116, 116, 105, 110, 103, 115]"
    },
    {
      "name": "tokenDecimal",
      "type": "u128",
      "value": "1000000"
    },
    {
      "name": "tokenSupply",
      "type": "u128",
      "value": "1000000000000000"
    }
  ]
};
