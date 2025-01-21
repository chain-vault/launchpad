/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/token_factory.json`.
 */
export type TokenFactory = {
  "address": "ATFd2pmuyd6QA3RakukX58AJhi7mNMHnmSXcMJ7vXkC9",
  "metadata": {
    "name": "tokenFactory",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createToken",
      "discriminator": [
        84,
        52,
        204,
        228,
        24,
        140,
        234,
        75
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "payerTokenAccount",
          "writable": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "metaData",
          "type": {
            "defined": {
              "name": "token2022MetadataArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createTokenLegacy",
      "discriminator": [
        231,
        10,
        225,
        85,
        65,
        210,
        182,
        128
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "payerTokenAccount",
          "writable": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "metaData",
          "type": {
            "defined": {
              "name": "createMetadataArgs"
            }
          }
        }
      ]
    }
  ],
  "events": [
    {
      "name": "tokenMintEvent",
      "discriminator": [
        92,
        60,
        98,
        180,
        75,
        255,
        171,
        35
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invaildCharacterInTokenName",
      "msg": "token name should be ascii character"
    },
    {
      "code": 6001,
      "name": "invaildCharacterInTokenSymbol",
      "msg": "token symbol should be ascii character"
    },
    {
      "code": 6002,
      "name": "invaildTokenNameMinLength",
      "msg": "token name length should be at least 4 characters"
    },
    {
      "code": 6003,
      "name": "invaildTokenNameMaxLength",
      "msg": "token name length should not exceed 32 characters"
    },
    {
      "code": 6004,
      "name": "invaildTokenSymbolMinLength",
      "msg": "token symbol length should be at least 3 characters"
    },
    {
      "code": 6005,
      "name": "invaildTokenSymbolMaxLength",
      "msg": "token symbol length should not exceed 10 characters"
    },
    {
      "code": 6006,
      "name": "invaildUrl",
      "msg": "invaild token metadata url"
    }
  ],
  "types": [
    {
      "name": "createMetadataArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "token2022MetadataArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "supply",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokenMintEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "mintTo",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "tokenSupply",
      "type": "u64",
      "value": "1000000000"
    }
  ]
};
