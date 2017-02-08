// Automatically generated on 2017-02-08T14:45:22+01:00
// DO NOT EDIT or your changes may be overwritten

/* jshint maxstatements:2147483647  */
/* jshint esnext:true  */

import * as XDR from 'js-xdr';


var types = XDR.config(xdr => {

// === xdr source ============================================================
//
//   typedef opaque Value<>;
//
// ===========================================================================
xdr.typedef("Value", xdr.varOpaque());

// === xdr source ============================================================
//
//   struct SCPBallot
//   {
//       uint32 counter; // n
//       Value value;    // x
//   };
//
// ===========================================================================
xdr.struct("ScpBallot", [
  ["counter", xdr.lookup("Uint32")],
  ["value", xdr.lookup("Value")],
]);

// === xdr source ============================================================
//
//   enum SCPStatementType
//   {
//       SCP_ST_PREPARE = 0,
//       SCP_ST_CONFIRM = 1,
//       SCP_ST_EXTERNALIZE = 2,
//       SCP_ST_NOMINATE = 3
//   };
//
// ===========================================================================
xdr.enum("ScpStatementType", {
  scpStPrepare: 0,
  scpStConfirm: 1,
  scpStExternalize: 2,
  scpStNominate: 3,
});

// === xdr source ============================================================
//
//   struct SCPNomination
//   {
//       Hash quorumSetHash; // D
//       Value votes<>;      // X
//       Value accepted<>;   // Y
//   };
//
// ===========================================================================
xdr.struct("ScpNomination", [
  ["quorumSetHash", xdr.lookup("Hash")],
  ["votes", xdr.varArray(xdr.lookup("Value"), 2147483647)],
  ["accepted", xdr.varArray(xdr.lookup("Value"), 2147483647)],
]);

// === xdr source ============================================================
//
//   struct
//           {
//               Hash quorumSetHash;       // D
//               SCPBallot ballot;         // b
//               SCPBallot* prepared;      // p
//               SCPBallot* preparedPrime; // p'
//               uint32 nC;                // c.n
//               uint32 nH;                // h.n
//           }
//
// ===========================================================================
xdr.struct("ScpStatementPrepare", [
  ["quorumSetHash", xdr.lookup("Hash")],
  ["ballot", xdr.lookup("ScpBallot")],
  ["prepared", xdr.option(xdr.lookup("ScpBallot"))],
  ["preparedPrime", xdr.option(xdr.lookup("ScpBallot"))],
  ["nC", xdr.lookup("Uint32")],
  ["nH", xdr.lookup("Uint32")],
]);

// === xdr source ============================================================
//
//   struct
//           {
//               SCPBallot ballot;   // b
//               uint32 nPrepared;   // p.n
//               uint32 nCommit;     // c.n
//               uint32 nH;          // h.n
//               Hash quorumSetHash; // D
//           }
//
// ===========================================================================
xdr.struct("ScpStatementConfirm", [
  ["ballot", xdr.lookup("ScpBallot")],
  ["nPrepared", xdr.lookup("Uint32")],
  ["nCommit", xdr.lookup("Uint32")],
  ["nH", xdr.lookup("Uint32")],
  ["quorumSetHash", xdr.lookup("Hash")],
]);

// === xdr source ============================================================
//
//   struct
//           {
//               SCPBallot commit;         // c
//               uint32 nH;                // h.n
//               Hash commitQuorumSetHash; // D used before EXTERNALIZE
//           }
//
// ===========================================================================
xdr.struct("ScpStatementExternalize", [
  ["commit", xdr.lookup("ScpBallot")],
  ["nH", xdr.lookup("Uint32")],
  ["commitQuorumSetHash", xdr.lookup("Hash")],
]);

// === xdr source ============================================================
//
//   union switch (SCPStatementType type)
//       {
//       case SCP_ST_PREPARE:
//           struct
//           {
//               Hash quorumSetHash;       // D
//               SCPBallot ballot;         // b
//               SCPBallot* prepared;      // p
//               SCPBallot* preparedPrime; // p'
//               uint32 nC;                // c.n
//               uint32 nH;                // h.n
//           } prepare;
//       case SCP_ST_CONFIRM:
//           struct
//           {
//               SCPBallot ballot;   // b
//               uint32 nPrepared;   // p.n
//               uint32 nCommit;     // c.n
//               uint32 nH;          // h.n
//               Hash quorumSetHash; // D
//           } confirm;
//       case SCP_ST_EXTERNALIZE:
//           struct
//           {
//               SCPBallot commit;         // c
//               uint32 nH;                // h.n
//               Hash commitQuorumSetHash; // D used before EXTERNALIZE
//           } externalize;
//       case SCP_ST_NOMINATE:
//           SCPNomination nominate;
//       }
//
// ===========================================================================
xdr.union("ScpStatementPledges", {
  switchOn: xdr.lookup("ScpStatementType"),
  switchName: "type",
  switches: [
    ["scpStPrepare", "prepare"],
    ["scpStConfirm", "confirm"],
    ["scpStExternalize", "externalize"],
    ["scpStNominate", "nominate"],
  ],
  arms: {
    prepare: xdr.lookup("ScpStatementPrepare"),
    confirm: xdr.lookup("ScpStatementConfirm"),
    externalize: xdr.lookup("ScpStatementExternalize"),
    nominate: xdr.lookup("ScpNomination"),
  },
});

// === xdr source ============================================================
//
//   struct SCPStatement
//   {
//       NodeID nodeID;    // v
//       uint64 slotIndex; // i
//   
//       union switch (SCPStatementType type)
//       {
//       case SCP_ST_PREPARE:
//           struct
//           {
//               Hash quorumSetHash;       // D
//               SCPBallot ballot;         // b
//               SCPBallot* prepared;      // p
//               SCPBallot* preparedPrime; // p'
//               uint32 nC;                // c.n
//               uint32 nH;                // h.n
//           } prepare;
//       case SCP_ST_CONFIRM:
//           struct
//           {
//               SCPBallot ballot;   // b
//               uint32 nPrepared;   // p.n
//               uint32 nCommit;     // c.n
//               uint32 nH;          // h.n
//               Hash quorumSetHash; // D
//           } confirm;
//       case SCP_ST_EXTERNALIZE:
//           struct
//           {
//               SCPBallot commit;         // c
//               uint32 nH;                // h.n
//               Hash commitQuorumSetHash; // D used before EXTERNALIZE
//           } externalize;
//       case SCP_ST_NOMINATE:
//           SCPNomination nominate;
//       }
//       pledges;
//   };
//
// ===========================================================================
xdr.struct("ScpStatement", [
  ["nodeId", xdr.lookup("NodeId")],
  ["slotIndex", xdr.lookup("Uint64")],
  ["pledges", xdr.lookup("ScpStatementPledges")],
]);

// === xdr source ============================================================
//
//   struct SCPEnvelope
//   {
//       SCPStatement statement;
//       Signature signature;
//   };
//
// ===========================================================================
xdr.struct("ScpEnvelope", [
  ["statement", xdr.lookup("ScpStatement")],
  ["signature", xdr.lookup("Signature")],
]);

// === xdr source ============================================================
//
//   struct SCPQuorumSet
//   {
//       uint32 threshold;
//       PublicKey validators<>;
//       SCPQuorumSet innerSets<>;
//   };
//
// ===========================================================================
xdr.struct("ScpQuorumSet", [
  ["threshold", xdr.lookup("Uint32")],
  ["validators", xdr.varArray(xdr.lookup("PublicKey"), 2147483647)],
  ["innerSets", xdr.varArray(xdr.lookup("ScpQuorumSet"), 2147483647)],
]);

// === xdr source ============================================================
//
//   typedef PublicKey AccountID;
//
// ===========================================================================
xdr.typedef("AccountId", xdr.lookup("PublicKey"));

// === xdr source ============================================================
//
//   typedef opaque Thresholds[4];
//
// ===========================================================================
xdr.typedef("Thresholds", xdr.opaque(4));

// === xdr source ============================================================
//
//   typedef string string32<32>;
//
// ===========================================================================
xdr.typedef("String32", xdr.string(32));

// === xdr source ============================================================
//
//   typedef string string64<64>;
//
// ===========================================================================
xdr.typedef("String64", xdr.string(64));

// === xdr source ============================================================
//
//   typedef uint64 SequenceNumber;
//
// ===========================================================================
xdr.typedef("SequenceNumber", xdr.lookup("Uint64"));

// === xdr source ============================================================
//
//   typedef opaque DataValue<64>;
//
// ===========================================================================
xdr.typedef("DataValue", xdr.varOpaque(64));

// === xdr source ============================================================
//
//   enum AssetType
//   {
//       ASSET_TYPE_NATIVE = 0,
//       ASSET_TYPE_CREDIT_ALPHANUM4 = 1,
//       ASSET_TYPE_CREDIT_ALPHANUM12 = 2
//   };
//
// ===========================================================================
xdr.enum("AssetType", {
  assetTypeNative: 0,
  assetTypeCreditAlphanum4: 1,
  assetTypeCreditAlphanum12: 2,
});

// === xdr source ============================================================
//
//   struct
//       {
//           opaque assetCode[4]; // 1 to 4 characters
//           AccountID issuer;
//       }
//
// ===========================================================================
xdr.struct("AssetAlphaNum4", [
  ["assetCode", xdr.opaque(4)],
  ["issuer", xdr.lookup("AccountId")],
]);

// === xdr source ============================================================
//
//   struct
//       {
//           opaque assetCode[12]; // 5 to 12 characters
//           AccountID issuer;
//       }
//
// ===========================================================================
xdr.struct("AssetAlphaNum12", [
  ["assetCode", xdr.opaque(12)],
  ["issuer", xdr.lookup("AccountId")],
]);

// === xdr source ============================================================
//
//   union Asset switch (AssetType type)
//   {
//   case ASSET_TYPE_NATIVE: // Not credit
//       void;
//   
//   case ASSET_TYPE_CREDIT_ALPHANUM4:
//       struct
//       {
//           opaque assetCode[4]; // 1 to 4 characters
//           AccountID issuer;
//       } alphaNum4;
//   
//   case ASSET_TYPE_CREDIT_ALPHANUM12:
//       struct
//       {
//           opaque assetCode[12]; // 5 to 12 characters
//           AccountID issuer;
//       } alphaNum12;
//   
//       // add other asset types here in the future
//   };
//
// ===========================================================================
xdr.union("Asset", {
  switchOn: xdr.lookup("AssetType"),
  switchName: "type",
  switches: [
    ["assetTypeNative", xdr.void()],
    ["assetTypeCreditAlphanum4", "alphaNum4"],
    ["assetTypeCreditAlphanum12", "alphaNum12"],
  ],
  arms: {
    alphaNum4: xdr.lookup("AssetAlphaNum4"),
    alphaNum12: xdr.lookup("AssetAlphaNum12"),
  },
});

// === xdr source ============================================================
//
//   struct Price
//   {
//       int32 n; // numerator
//       int32 d; // denominator
//   };
//
// ===========================================================================
xdr.struct("Price", [
  ["n", xdr.lookup("Int32")],
  ["d", xdr.lookup("Int32")],
]);

// === xdr source ============================================================
//
//   enum ThresholdIndexes
//   {
//       THRESHOLD_MASTER_WEIGHT = 0,
//       THRESHOLD_LOW = 1,
//       THRESHOLD_MED = 2,
//       THRESHOLD_HIGH = 3
//   };
//
// ===========================================================================
xdr.enum("ThresholdIndices", {
  thresholdMasterWeight: 0,
  thresholdLow: 1,
  thresholdMed: 2,
  thresholdHigh: 3,
});

// === xdr source ============================================================
//
//   enum LedgerEntryType
//   {
//       ACCOUNT = 0,
//       TRUSTLINE = 1,
//       OFFER = 2,
//       DATA = 3
//   };
//
// ===========================================================================
xdr.enum("LedgerEntryType", {
  account: 0,
  trustline: 1,
  offer: 2,
  datum: 3,
});

// === xdr source ============================================================
//
//   struct Signer
//   {
//       SignerKey key;
//       uint32 weight; // really only need 1byte
//   };
//
// ===========================================================================
xdr.struct("Signer", [
  ["key", xdr.lookup("SignerKey")],
  ["weight", xdr.lookup("Uint32")],
]);

// === xdr source ============================================================
//
//   enum AccountFlags
//   { // masks for each flag
//   
//       // Flags set on issuer accounts
//       // TrustLines are created with authorized set to "false" requiring
//       // the issuer to set it for each TrustLine
//       AUTH_REQUIRED_FLAG = 0x1,
//       // If set, the authorized flag in TrustLines can be cleared
//       // otherwise, authorization cannot be revoked
//       AUTH_REVOCABLE_FLAG = 0x2,
//       // Once set, causes all AUTH_* flags to be read-only
//       AUTH_IMMUTABLE_FLAG = 0x4
//   };
//
// ===========================================================================
xdr.enum("AccountFlags", {
  authRequiredFlag: 1,
  authRevocableFlag: 2,
  authImmutableFlag: 4,
});

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("AccountEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct AccountEntry
//   {
//       AccountID accountID;      // master public key for this account
//       int64 balance;            // in stroops
//       SequenceNumber seqNum;    // last sequence number used for this account
//       uint32 numSubEntries;     // number of sub-entries this account has
//                                 // drives the reserve
//       AccountID* inflationDest; // Account to vote for during inflation
//       uint32 flags;             // see AccountFlags
//   
//       string32 homeDomain; // can be used for reverse federation and memo lookup
//   
//       // fields used for signatures
//       // thresholds stores unsigned bytes: [weight of master|low|medium|high]
//       Thresholds thresholds;
//   
//       Signer signers<20>; // possible signers for this account
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("AccountEntry", [
  ["accountId", xdr.lookup("AccountId")],
  ["balance", xdr.lookup("Int64")],
  ["seqNum", xdr.lookup("SequenceNumber")],
  ["numSubEntries", xdr.lookup("Uint32")],
  ["inflationDest", xdr.option(xdr.lookup("AccountId"))],
  ["flags", xdr.lookup("Uint32")],
  ["homeDomain", xdr.lookup("String32")],
  ["thresholds", xdr.lookup("Thresholds")],
  ["signers", xdr.varArray(xdr.lookup("Signer"), 20)],
  ["ext", xdr.lookup("AccountEntryExt")],
]);

// === xdr source ============================================================
//
//   enum TrustLineFlags
//   {
//       // issuer has authorized account to perform transactions with its credit
//       AUTHORIZED_FLAG = 1
//   };
//
// ===========================================================================
xdr.enum("TrustLineFlags", {
  authorizedFlag: 1,
});

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("TrustLineEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct TrustLineEntry
//   {
//       AccountID accountID; // account this trustline belongs to
//       Asset asset;         // type of asset (with issuer)
//       int64 balance;       // how much of this asset the user has.
//                            // Asset defines the unit for this;
//   
//       int64 limit;  // balance cannot be above this
//       uint32 flags; // see TrustLineFlags
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("TrustLineEntry", [
  ["accountId", xdr.lookup("AccountId")],
  ["asset", xdr.lookup("Asset")],
  ["balance", xdr.lookup("Int64")],
  ["limit", xdr.lookup("Int64")],
  ["flags", xdr.lookup("Uint32")],
  ["ext", xdr.lookup("TrustLineEntryExt")],
]);

// === xdr source ============================================================
//
//   enum OfferEntryFlags
//   {
//       // issuer has authorized account to perform transactions with its credit
//       PASSIVE_FLAG = 1
//   };
//
// ===========================================================================
xdr.enum("OfferEntryFlags", {
  passiveFlag: 1,
});

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("OfferEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct OfferEntry
//   {
//       AccountID sellerID;
//       uint64 offerID;
//       Asset selling; // A
//       Asset buying;  // B
//       int64 amount;  // amount of A
//   
//       /* price for this offer:
//           price of A in terms of B
//           price=AmountB/AmountA=priceNumerator/priceDenominator
//           price is after fees
//       */
//       Price price;
//       uint32 flags; // see OfferEntryFlags
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("OfferEntry", [
  ["sellerId", xdr.lookup("AccountId")],
  ["offerId", xdr.lookup("Uint64")],
  ["selling", xdr.lookup("Asset")],
  ["buying", xdr.lookup("Asset")],
  ["amount", xdr.lookup("Int64")],
  ["price", xdr.lookup("Price")],
  ["flags", xdr.lookup("Uint32")],
  ["ext", xdr.lookup("OfferEntryExt")],
]);

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("DataEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct DataEntry
//   {
//       AccountID accountID; // account this data belongs to
//       string64 dataName;
//       DataValue dataValue;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("DataEntry", [
  ["accountId", xdr.lookup("AccountId")],
  ["dataName", xdr.lookup("String64")],
  ["dataValue", xdr.lookup("DataValue")],
  ["ext", xdr.lookup("DataEntryExt")],
]);

// === xdr source ============================================================
//
//   union switch (LedgerEntryType type)
//       {
//       case ACCOUNT:
//           AccountEntry account;
//       case TRUSTLINE:
//           TrustLineEntry trustLine;
//       case OFFER:
//           OfferEntry offer;
//       case DATA:
//           DataEntry data;
//       }
//
// ===========================================================================
xdr.union("LedgerEntryData", {
  switchOn: xdr.lookup("LedgerEntryType"),
  switchName: "type",
  switches: [
    ["account", "account"],
    ["trustline", "trustLine"],
    ["offer", "offer"],
    ["datum", "data"],
  ],
  arms: {
    account: xdr.lookup("AccountEntry"),
    trustLine: xdr.lookup("TrustLineEntry"),
    offer: xdr.lookup("OfferEntry"),
    data: xdr.lookup("DataEntry"),
  },
});

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("LedgerEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct LedgerEntry
//   {
//       uint32 lastModifiedLedgerSeq; // ledger the LedgerEntry was last changed
//   
//       union switch (LedgerEntryType type)
//       {
//       case ACCOUNT:
//           AccountEntry account;
//       case TRUSTLINE:
//           TrustLineEntry trustLine;
//       case OFFER:
//           OfferEntry offer;
//       case DATA:
//           DataEntry data;
//       }
//       data;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("LedgerEntry", [
  ["lastModifiedLedgerSeq", xdr.lookup("Uint32")],
  ["data", xdr.lookup("LedgerEntryData")],
  ["ext", xdr.lookup("LedgerEntryExt")],
]);

// === xdr source ============================================================
//
//   enum EnvelopeType
//   {
//       ENVELOPE_TYPE_SCP = 1,
//       ENVELOPE_TYPE_TX = 2,
//       ENVELOPE_TYPE_AUTH = 3
//   };
//
// ===========================================================================
xdr.enum("EnvelopeType", {
  envelopeTypeScp: 1,
  envelopeTypeTx: 2,
  envelopeTypeAuth: 3,
});

// === xdr source ============================================================
//
//   typedef opaque UpgradeType<128>;
//
// ===========================================================================
xdr.typedef("UpgradeType", xdr.varOpaque(128));

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("StellarValueExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct StellarValue
//   {
//       Hash txSetHash;   // transaction set to apply to previous ledger
//       uint64 closeTime; // network close time
//   
//       // upgrades to apply to the previous ledger (usually empty)
//       // this is a vector of encoded 'LedgerUpgrade' so that nodes can drop
//       // unknown steps during consensus if needed.
//       // see notes below on 'LedgerUpgrade' for more detail
//       // max size is dictated by number of upgrade types (+ room for future)
//       UpgradeType upgrades<6>;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("StellarValue", [
  ["txSetHash", xdr.lookup("Hash")],
  ["closeTime", xdr.lookup("Uint64")],
  ["upgrades", xdr.varArray(xdr.lookup("UpgradeType"), 6)],
  ["ext", xdr.lookup("StellarValueExt")],
]);

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("LedgerHeaderExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct LedgerHeader
//   {
//       uint32 ledgerVersion;    // the protocol version of the ledger
//       Hash previousLedgerHash; // hash of the previous ledger header
//       StellarValue scpValue;   // what consensus agreed to
//       Hash txSetResultHash;    // the TransactionResultSet that led to this ledger
//       Hash bucketListHash;     // hash of the ledger state
//   
//       uint32 ledgerSeq; // sequence number of this ledger
//   
//       int64 totalCoins; // total number of stroops in existence.
//                         // 10,000,000 stroops in 1 XLM
//   
//       int64 feePool;       // fees burned since last inflation run
//       uint32 inflationSeq; // inflation sequence number
//   
//       uint64 idPool; // last used global ID, used for generating objects
//   
//       uint32 baseFee;     // base fee per operation in stroops
//       uint32 baseReserve; // account base reserve in stroops
//   
//       uint32 maxTxSetSize; // maximum size a transaction set can be
//   
//       Hash skipList[4]; // hashes of ledgers in the past. allows you to jump back
//                         // in time without walking the chain back ledger by ledger
//                         // each slot contains the oldest ledger that is mod of
//                         // either 50  5000  50000 or 500000 depending on index
//                         // skipList[0] mod(50), skipList[1] mod(5000), etc
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("LedgerHeader", [
  ["ledgerVersion", xdr.lookup("Uint32")],
  ["previousLedgerHash", xdr.lookup("Hash")],
  ["scpValue", xdr.lookup("StellarValue")],
  ["txSetResultHash", xdr.lookup("Hash")],
  ["bucketListHash", xdr.lookup("Hash")],
  ["ledgerSeq", xdr.lookup("Uint32")],
  ["totalCoins", xdr.lookup("Int64")],
  ["feePool", xdr.lookup("Int64")],
  ["inflationSeq", xdr.lookup("Uint32")],
  ["idPool", xdr.lookup("Uint64")],
  ["baseFee", xdr.lookup("Uint32")],
  ["baseReserve", xdr.lookup("Uint32")],
  ["maxTxSetSize", xdr.lookup("Uint32")],
  ["skipList", xdr.array(xdr.lookup("Hash"), 4)],
  ["ext", xdr.lookup("LedgerHeaderExt")],
]);

// === xdr source ============================================================
//
//   enum LedgerUpgradeType
//   {
//       LEDGER_UPGRADE_VERSION = 1,
//       LEDGER_UPGRADE_BASE_FEE = 2,
//       LEDGER_UPGRADE_MAX_TX_SET_SIZE = 3
//   };
//
// ===========================================================================
xdr.enum("LedgerUpgradeType", {
  ledgerUpgradeVersion: 1,
  ledgerUpgradeBaseFee: 2,
  ledgerUpgradeMaxTxSetSize: 3,
});

// === xdr source ============================================================
//
//   union LedgerUpgrade switch (LedgerUpgradeType type)
//   {
//   case LEDGER_UPGRADE_VERSION:
//       uint32 newLedgerVersion; // update ledgerVersion
//   case LEDGER_UPGRADE_BASE_FEE:
//       uint32 newBaseFee; // update baseFee
//   case LEDGER_UPGRADE_MAX_TX_SET_SIZE:
//       uint32 newMaxTxSetSize; // update maxTxSetSize
//   };
//
// ===========================================================================
xdr.union("LedgerUpgrade", {
  switchOn: xdr.lookup("LedgerUpgradeType"),
  switchName: "type",
  switches: [
    ["ledgerUpgradeVersion", "newLedgerVersion"],
    ["ledgerUpgradeBaseFee", "newBaseFee"],
    ["ledgerUpgradeMaxTxSetSize", "newMaxTxSetSize"],
  ],
  arms: {
    newLedgerVersion: xdr.lookup("Uint32"),
    newBaseFee: xdr.lookup("Uint32"),
    newMaxTxSetSize: xdr.lookup("Uint32"),
  },
});

// === xdr source ============================================================
//
//   struct
//       {
//           AccountID accountID;
//       }
//
// ===========================================================================
xdr.struct("LedgerKeyAccount", [
  ["accountId", xdr.lookup("AccountId")],
]);

// === xdr source ============================================================
//
//   struct
//       {
//           AccountID accountID;
//           Asset asset;
//       }
//
// ===========================================================================
xdr.struct("LedgerKeyTrustLine", [
  ["accountId", xdr.lookup("AccountId")],
  ["asset", xdr.lookup("Asset")],
]);

// === xdr source ============================================================
//
//   struct
//       {
//           AccountID sellerID;
//           uint64 offerID;
//       }
//
// ===========================================================================
xdr.struct("LedgerKeyOffer", [
  ["sellerId", xdr.lookup("AccountId")],
  ["offerId", xdr.lookup("Uint64")],
]);

// === xdr source ============================================================
//
//   struct
//       {
//           AccountID accountID;
//           string64 dataName;
//       }
//
// ===========================================================================
xdr.struct("LedgerKeyData", [
  ["accountId", xdr.lookup("AccountId")],
  ["dataName", xdr.lookup("String64")],
]);

// === xdr source ============================================================
//
//   union LedgerKey switch (LedgerEntryType type)
//   {
//   case ACCOUNT:
//       struct
//       {
//           AccountID accountID;
//       } account;
//   
//   case TRUSTLINE:
//       struct
//       {
//           AccountID accountID;
//           Asset asset;
//       } trustLine;
//   
//   case OFFER:
//       struct
//       {
//           AccountID sellerID;
//           uint64 offerID;
//       } offer;
//   
//   case DATA:
//       struct
//       {
//           AccountID accountID;
//           string64 dataName;
//       } data;
//   };
//
// ===========================================================================
xdr.union("LedgerKey", {
  switchOn: xdr.lookup("LedgerEntryType"),
  switchName: "type",
  switches: [
    ["account", "account"],
    ["trustline", "trustLine"],
    ["offer", "offer"],
    ["datum", "data"],
  ],
  arms: {
    account: xdr.lookup("LedgerKeyAccount"),
    trustLine: xdr.lookup("LedgerKeyTrustLine"),
    offer: xdr.lookup("LedgerKeyOffer"),
    data: xdr.lookup("LedgerKeyData"),
  },
});

// === xdr source ============================================================
//
//   enum BucketEntryType
//   {
//       LIVEENTRY = 0,
//       DEADENTRY = 1
//   };
//
// ===========================================================================
xdr.enum("BucketEntryType", {
  liveentry: 0,
  deadentry: 1,
});

// === xdr source ============================================================
//
//   union BucketEntry switch (BucketEntryType type)
//   {
//   case LIVEENTRY:
//       LedgerEntry liveEntry;
//   
//   case DEADENTRY:
//       LedgerKey deadEntry;
//   };
//
// ===========================================================================
xdr.union("BucketEntry", {
  switchOn: xdr.lookup("BucketEntryType"),
  switchName: "type",
  switches: [
    ["liveentry", "liveEntry"],
    ["deadentry", "deadEntry"],
  ],
  arms: {
    liveEntry: xdr.lookup("LedgerEntry"),
    deadEntry: xdr.lookup("LedgerKey"),
  },
});

// === xdr source ============================================================
//
//   struct TransactionSet
//   {
//       Hash previousLedgerHash;
//       TransactionEnvelope txs<>;
//   };
//
// ===========================================================================
xdr.struct("TransactionSet", [
  ["previousLedgerHash", xdr.lookup("Hash")],
  ["txes", xdr.varArray(xdr.lookup("TransactionEnvelope"), 2147483647)],
]);

// === xdr source ============================================================
//
//   struct TransactionResultPair
//   {
//       Hash transactionHash;
//       TransactionResult result; // result for the transaction
//   };
//
// ===========================================================================
xdr.struct("TransactionResultPair", [
  ["transactionHash", xdr.lookup("Hash")],
  ["result", xdr.lookup("TransactionResult")],
]);

// === xdr source ============================================================
//
//   struct TransactionResultSet
//   {
//       TransactionResultPair results<>;
//   };
//
// ===========================================================================
xdr.struct("TransactionResultSet", [
  ["results", xdr.varArray(xdr.lookup("TransactionResultPair"), 2147483647)],
]);

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("TransactionHistoryEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct TransactionHistoryEntry
//   {
//       uint32 ledgerSeq;
//       TransactionSet txSet;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("TransactionHistoryEntry", [
  ["ledgerSeq", xdr.lookup("Uint32")],
  ["txSet", xdr.lookup("TransactionSet")],
  ["ext", xdr.lookup("TransactionHistoryEntryExt")],
]);

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("TransactionHistoryResultEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct TransactionHistoryResultEntry
//   {
//       uint32 ledgerSeq;
//       TransactionResultSet txResultSet;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("TransactionHistoryResultEntry", [
  ["ledgerSeq", xdr.lookup("Uint32")],
  ["txResultSet", xdr.lookup("TransactionResultSet")],
  ["ext", xdr.lookup("TransactionHistoryResultEntryExt")],
]);

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("LedgerHeaderHistoryEntryExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct LedgerHeaderHistoryEntry
//   {
//       Hash hash;
//       LedgerHeader header;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("LedgerHeaderHistoryEntry", [
  ["hash", xdr.lookup("Hash")],
  ["header", xdr.lookup("LedgerHeader")],
  ["ext", xdr.lookup("LedgerHeaderHistoryEntryExt")],
]);

// === xdr source ============================================================
//
//   struct LedgerSCPMessages
//   {
//       uint32 ledgerSeq;
//       SCPEnvelope messages<>;
//   };
//
// ===========================================================================
xdr.struct("LedgerScpMessages", [
  ["ledgerSeq", xdr.lookup("Uint32")],
  ["messages", xdr.varArray(xdr.lookup("ScpEnvelope"), 2147483647)],
]);

// === xdr source ============================================================
//
//   struct SCPHistoryEntryV0
//   {
//       SCPQuorumSet quorumSets<>; // additional quorum sets used by ledgerMessages
//       LedgerSCPMessages ledgerMessages;
//   };
//
// ===========================================================================
xdr.struct("ScpHistoryEntryV0", [
  ["quorumSets", xdr.varArray(xdr.lookup("ScpQuorumSet"), 2147483647)],
  ["ledgerMessages", xdr.lookup("LedgerScpMessages")],
]);

// === xdr source ============================================================
//
//   union SCPHistoryEntry switch (int v)
//   {
//   case 0:
//       SCPHistoryEntryV0 v0;
//   };
//
// ===========================================================================
xdr.union("ScpHistoryEntry", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, "v0"],
  ],
  arms: {
    v0: xdr.lookup("ScpHistoryEntryV0"),
  },
});

// === xdr source ============================================================
//
//   enum LedgerEntryChangeType
//   {
//       LEDGER_ENTRY_CREATED = 0, // entry was added to the ledger
//       LEDGER_ENTRY_UPDATED = 1, // entry was modified in the ledger
//       LEDGER_ENTRY_REMOVED = 2, // entry was removed from the ledger
//       LEDGER_ENTRY_STATE = 3    // value of the entry
//   };
//
// ===========================================================================
xdr.enum("LedgerEntryChangeType", {
  ledgerEntryCreated: 0,
  ledgerEntryUpdated: 1,
  ledgerEntryRemoved: 2,
  ledgerEntryState: 3,
});

// === xdr source ============================================================
//
//   union LedgerEntryChange switch (LedgerEntryChangeType type)
//   {
//   case LEDGER_ENTRY_CREATED:
//       LedgerEntry created;
//   case LEDGER_ENTRY_UPDATED:
//       LedgerEntry updated;
//   case LEDGER_ENTRY_REMOVED:
//       LedgerKey removed;
//   case LEDGER_ENTRY_STATE:
//       LedgerEntry state;
//   };
//
// ===========================================================================
xdr.union("LedgerEntryChange", {
  switchOn: xdr.lookup("LedgerEntryChangeType"),
  switchName: "type",
  switches: [
    ["ledgerEntryCreated", "created"],
    ["ledgerEntryUpdated", "updated"],
    ["ledgerEntryRemoved", "removed"],
    ["ledgerEntryState", "state"],
  ],
  arms: {
    created: xdr.lookup("LedgerEntry"),
    updated: xdr.lookup("LedgerEntry"),
    removed: xdr.lookup("LedgerKey"),
    state: xdr.lookup("LedgerEntry"),
  },
});

// === xdr source ============================================================
//
//   typedef LedgerEntryChange LedgerEntryChanges<>;
//
// ===========================================================================
xdr.typedef("LedgerEntryChanges", xdr.varArray(xdr.lookup("LedgerEntryChange"), 2147483647));

// === xdr source ============================================================
//
//   struct OperationMeta
//   {
//       LedgerEntryChanges changes;
//   };
//
// ===========================================================================
xdr.struct("OperationMeta", [
  ["changes", xdr.lookup("LedgerEntryChanges")],
]);

// === xdr source ============================================================
//
//   union TransactionMeta switch (int v)
//   {
//   case 0:
//       OperationMeta operations<>;
//   };
//
// ===========================================================================
xdr.union("TransactionMeta", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, "operations"],
  ],
  arms: {
    operations: xdr.varArray(xdr.lookup("OperationMeta"), 2147483647),
  },
});

// === xdr source ============================================================
//
//   enum ErrorCode
//   {
//       ERR_MISC = 0, // Unspecific error
//       ERR_DATA = 1, // Malformed data
//       ERR_CONF = 2, // Misconfiguration error
//       ERR_AUTH = 3, // Authentication failure
//       ERR_LOAD = 4  // System overloaded
//   };
//
// ===========================================================================
xdr.enum("ErrorCode", {
  errMisc: 0,
  errDatum: 1,
  errConf: 2,
  errAuth: 3,
  errLoad: 4,
});

// === xdr source ============================================================
//
//   struct Error
//   {
//       ErrorCode code;
//       string msg<100>;
//   };
//
// ===========================================================================
xdr.struct("Error", [
  ["code", xdr.lookup("ErrorCode")],
  ["msg", xdr.string(100)],
]);

// === xdr source ============================================================
//
//   struct AuthCert
//   {
//       Curve25519Public pubkey;
//       uint64 expiration;
//       Signature sig;
//   };
//
// ===========================================================================
xdr.struct("AuthCert", [
  ["pubkey", xdr.lookup("Curve25519Public")],
  ["expiration", xdr.lookup("Uint64")],
  ["sig", xdr.lookup("Signature")],
]);

// === xdr source ============================================================
//
//   struct Hello
//   {
//       uint32 ledgerVersion;
//       uint32 overlayVersion;
//       uint32 overlayMinVersion;
//       Hash networkID;
//       string versionStr<100>;
//       int listeningPort;
//       NodeID peerID;
//       AuthCert cert;
//       uint256 nonce;
//   };
//
// ===========================================================================
xdr.struct("Hello", [
  ["ledgerVersion", xdr.lookup("Uint32")],
  ["overlayVersion", xdr.lookup("Uint32")],
  ["overlayMinVersion", xdr.lookup("Uint32")],
  ["networkId", xdr.lookup("Hash")],
  ["versionStr", xdr.string(100)],
  ["listeningPort", xdr.int()],
  ["peerId", xdr.lookup("NodeId")],
  ["cert", xdr.lookup("AuthCert")],
  ["nonce", xdr.lookup("Uint256")],
]);

// === xdr source ============================================================
//
//   struct Auth
//   {
//       // Empty message, just to confirm
//       // establishment of MAC keys.
//       int unused;
//   };
//
// ===========================================================================
xdr.struct("Auth", [
  ["unused", xdr.int()],
]);

// === xdr source ============================================================
//
//   enum IPAddrType
//   {
//       IPv4 = 0,
//       IPv6 = 1
//   };
//
// ===========================================================================
xdr.enum("IpAddrType", {
  iPv4: 0,
  iPv6: 1,
});

// === xdr source ============================================================
//
//   union switch (IPAddrType type)
//       {
//       case IPv4:
//           opaque ipv4[4];
//       case IPv6:
//           opaque ipv6[16];
//       }
//
// ===========================================================================
xdr.union("PeerAddressIp", {
  switchOn: xdr.lookup("IpAddrType"),
  switchName: "type",
  switches: [
    ["iPv4", "ipv4"],
    ["iPv6", "ipv6"],
  ],
  arms: {
    ipv4: xdr.opaque(4),
    ipv6: xdr.opaque(16),
  },
});

// === xdr source ============================================================
//
//   struct PeerAddress
//   {
//       union switch (IPAddrType type)
//       {
//       case IPv4:
//           opaque ipv4[4];
//       case IPv6:
//           opaque ipv6[16];
//       }
//       ip;
//       uint32 port;
//       uint32 numFailures;
//   };
//
// ===========================================================================
xdr.struct("PeerAddress", [
  ["ip", xdr.lookup("PeerAddressIp")],
  ["port", xdr.lookup("Uint32")],
  ["numFailures", xdr.lookup("Uint32")],
]);

// === xdr source ============================================================
//
//   enum MessageType
//   {
//       ERROR_MSG = 0,
//       AUTH = 2,
//       DONT_HAVE = 3,
//   
//       GET_PEERS = 4, // gets a list of peers this guy knows about
//       PEERS = 5,
//   
//       GET_TX_SET = 6, // gets a particular txset by hash
//       TX_SET = 7,
//   
//       TRANSACTION = 8, // pass on a tx you have heard about
//   
//       // SCP
//       GET_SCP_QUORUMSET = 9,
//       SCP_QUORUMSET = 10,
//       SCP_MESSAGE = 11,
//       GET_SCP_STATE = 12,
//   
//       // new messages
//       HELLO = 13
//   };
//
// ===========================================================================
xdr.enum("MessageType", {
  errorMsg: 0,
  auth: 2,
  dontHave: 3,
  getPeer: 4,
  peer: 5,
  getTxSet: 6,
  txSet: 7,
  transaction: 8,
  getScpQuorumset: 9,
  scpQuorumset: 10,
  scpMessage: 11,
  getScpState: 12,
  hello: 13,
});

// === xdr source ============================================================
//
//   struct DontHave
//   {
//       MessageType type;
//       uint256 reqHash;
//   };
//
// ===========================================================================
xdr.struct("DontHave", [
  ["type", xdr.lookup("MessageType")],
  ["reqHash", xdr.lookup("Uint256")],
]);

// === xdr source ============================================================
//
//   union StellarMessage switch (MessageType type)
//   {
//   case ERROR_MSG:
//       Error error;
//   case HELLO:
//       Hello hello;
//   case AUTH:
//       Auth auth;
//   case DONT_HAVE:
//       DontHave dontHave;
//   case GET_PEERS:
//       void;
//   case PEERS:
//       PeerAddress peers<>;
//   
//   case GET_TX_SET:
//       uint256 txSetHash;
//   case TX_SET:
//       TransactionSet txSet;
//   
//   case TRANSACTION:
//       TransactionEnvelope transaction;
//   
//   // SCP
//   case GET_SCP_QUORUMSET:
//       uint256 qSetHash;
//   case SCP_QUORUMSET:
//       SCPQuorumSet qSet;
//   case SCP_MESSAGE:
//       SCPEnvelope envelope;
//   case GET_SCP_STATE:
//       uint32 getSCPLedgerSeq; // ledger seq requested ; if 0, requests the latest
//   };
//
// ===========================================================================
xdr.union("StellarMessage", {
  switchOn: xdr.lookup("MessageType"),
  switchName: "type",
  switches: [
    ["errorMsg", "error"],
    ["hello", "hello"],
    ["auth", "auth"],
    ["dontHave", "dontHave"],
    ["getPeer", xdr.void()],
    ["peer", "peers"],
    ["getTxSet", "txSetHash"],
    ["txSet", "txSet"],
    ["transaction", "transaction"],
    ["getScpQuorumset", "qSetHash"],
    ["scpQuorumset", "qSet"],
    ["scpMessage", "envelope"],
    ["getScpState", "getScpLedgerSeq"],
  ],
  arms: {
    error: xdr.lookup("Error"),
    hello: xdr.lookup("Hello"),
    auth: xdr.lookup("Auth"),
    dontHave: xdr.lookup("DontHave"),
    peers: xdr.varArray(xdr.lookup("PeerAddress"), 2147483647),
    txSetHash: xdr.lookup("Uint256"),
    txSet: xdr.lookup("TransactionSet"),
    transaction: xdr.lookup("TransactionEnvelope"),
    qSetHash: xdr.lookup("Uint256"),
    qSet: xdr.lookup("ScpQuorumSet"),
    envelope: xdr.lookup("ScpEnvelope"),
    getScpLedgerSeq: xdr.lookup("Uint32"),
  },
});

// === xdr source ============================================================
//
//   struct
//   {
//      uint64 sequence;
//      StellarMessage message;
//      HmacSha256Mac mac;
//       }
//
// ===========================================================================
xdr.struct("AuthenticatedMessageV0", [
  ["sequence", xdr.lookup("Uint64")],
  ["message", xdr.lookup("StellarMessage")],
  ["mac", xdr.lookup("HmacSha256Mac")],
]);

// === xdr source ============================================================
//
//   union AuthenticatedMessage switch (uint32 v)
//   {
//   case 0:
//       struct
//   {
//      uint64 sequence;
//      StellarMessage message;
//      HmacSha256Mac mac;
//       } v0;
//   };
//
// ===========================================================================
xdr.union("AuthenticatedMessage", {
  switchOn: xdr.lookup("Uint32"),
  switchName: "v",
  switches: [
    [0, "v0"],
  ],
  arms: {
    v0: xdr.lookup("AuthenticatedMessageV0"),
  },
});

// === xdr source ============================================================
//
//   struct DecoratedSignature
//   {
//       SignatureHint hint;  // last 4 bytes of the public key, used as a hint
//       Signature signature; // actual signature
//   };
//
// ===========================================================================
xdr.struct("DecoratedSignature", [
  ["hint", xdr.lookup("SignatureHint")],
  ["signature", xdr.lookup("Signature")],
]);

// === xdr source ============================================================
//
//   enum OperationType
//   {
//       CREATE_ACCOUNT = 0,
//       PAYMENT = 1,
//       PATH_PAYMENT = 2,
//       MANAGE_OFFER = 3,
//       CREATE_PASSIVE_OFFER = 4,
//       SET_OPTIONS = 5,
//       CHANGE_TRUST = 6,
//       ALLOW_TRUST = 7,
//       ACCOUNT_MERGE = 8,
//       INFLATION = 9,
//       MANAGE_DATA = 10
//   };
//
// ===========================================================================
xdr.enum("OperationType", {
  createAccount: 0,
  payment: 1,
  pathPayment: 2,
  manageOffer: 3,
  createPassiveOffer: 4,
  setOption: 5,
  changeTrust: 6,
  allowTrust: 7,
  accountMerge: 8,
  inflation: 9,
  manageDatum: 10,
});

// === xdr source ============================================================
//
//   struct CreateAccountOp
//   {
//       AccountID destination; // account to create
//       int64 startingBalance; // amount they end up with
//   };
//
// ===========================================================================
xdr.struct("CreateAccountOp", [
  ["destination", xdr.lookup("AccountId")],
  ["startingBalance", xdr.lookup("Int64")],
]);

// === xdr source ============================================================
//
//   struct PaymentOp
//   {
//       AccountID destination; // recipient of the payment
//       Asset asset;           // what they end up with
//       int64 amount;          // amount they end up with
//   };
//
// ===========================================================================
xdr.struct("PaymentOp", [
  ["destination", xdr.lookup("AccountId")],
  ["asset", xdr.lookup("Asset")],
  ["amount", xdr.lookup("Int64")],
]);

// === xdr source ============================================================
//
//   struct PathPaymentOp
//   {
//       Asset sendAsset; // asset we pay with
//       int64 sendMax;   // the maximum amount of sendAsset to
//                        // send (excluding fees).
//                        // The operation will fail if can't be met
//   
//       AccountID destination; // recipient of the payment
//       Asset destAsset;       // what they end up with
//       int64 destAmount;      // amount they end up with
//   
//       Asset path<5>; // additional hops it must go through to get there
//   };
//
// ===========================================================================
xdr.struct("PathPaymentOp", [
  ["sendAsset", xdr.lookup("Asset")],
  ["sendMax", xdr.lookup("Int64")],
  ["destination", xdr.lookup("AccountId")],
  ["destAsset", xdr.lookup("Asset")],
  ["destAmount", xdr.lookup("Int64")],
  ["path", xdr.varArray(xdr.lookup("Asset"), 5)],
]);

// === xdr source ============================================================
//
//   struct ManageOfferOp
//   {
//       Asset selling;
//       Asset buying;
//       int64 amount; // amount being sold. if set to 0, delete the offer
//       Price price;  // price of thing being sold in terms of what you are buying
//   
//       // 0=create a new offer, otherwise edit an existing offer
//       uint64 offerID;
//   };
//
// ===========================================================================
xdr.struct("ManageOfferOp", [
  ["selling", xdr.lookup("Asset")],
  ["buying", xdr.lookup("Asset")],
  ["amount", xdr.lookup("Int64")],
  ["price", xdr.lookup("Price")],
  ["offerId", xdr.lookup("Uint64")],
]);

// === xdr source ============================================================
//
//   struct CreatePassiveOfferOp
//   {
//       Asset selling; // A
//       Asset buying;  // B
//       int64 amount;  // amount taker gets. if set to 0, delete the offer
//       Price price;   // cost of A in terms of B
//   };
//
// ===========================================================================
xdr.struct("CreatePassiveOfferOp", [
  ["selling", xdr.lookup("Asset")],
  ["buying", xdr.lookup("Asset")],
  ["amount", xdr.lookup("Int64")],
  ["price", xdr.lookup("Price")],
]);

// === xdr source ============================================================
//
//   struct SetOptionsOp
//   {
//       AccountID* inflationDest; // sets the inflation destination
//   
//       uint32* clearFlags; // which flags to clear
//       uint32* setFlags;   // which flags to set
//   
//       // account threshold manipulation
//       uint32* masterWeight; // weight of the master account
//       uint32* lowThreshold;
//       uint32* medThreshold;
//       uint32* highThreshold;
//   
//       string32* homeDomain; // sets the home domain
//   
//       // Add, update or remove a signer for the account
//       // signer is deleted if the weight is 0
//       Signer* signer;
//   };
//
// ===========================================================================
xdr.struct("SetOptionsOp", [
  ["inflationDest", xdr.option(xdr.lookup("AccountId"))],
  ["clearFlags", xdr.option(xdr.lookup("Uint32"))],
  ["setFlags", xdr.option(xdr.lookup("Uint32"))],
  ["masterWeight", xdr.option(xdr.lookup("Uint32"))],
  ["lowThreshold", xdr.option(xdr.lookup("Uint32"))],
  ["medThreshold", xdr.option(xdr.lookup("Uint32"))],
  ["highThreshold", xdr.option(xdr.lookup("Uint32"))],
  ["homeDomain", xdr.option(xdr.lookup("String32"))],
  ["signer", xdr.option(xdr.lookup("Signer"))],
]);

// === xdr source ============================================================
//
//   struct ChangeTrustOp
//   {
//       Asset line;
//   
//       // if limit is set to 0, deletes the trust line
//       int64 limit;
//   };
//
// ===========================================================================
xdr.struct("ChangeTrustOp", [
  ["line", xdr.lookup("Asset")],
  ["limit", xdr.lookup("Int64")],
]);

// === xdr source ============================================================
//
//   union switch (AssetType type)
//       {
//       // ASSET_TYPE_NATIVE is not allowed
//       case ASSET_TYPE_CREDIT_ALPHANUM4:
//           opaque assetCode4[4];
//   
//       case ASSET_TYPE_CREDIT_ALPHANUM12:
//           opaque assetCode12[12];
//   
//           // add other asset types here in the future
//       }
//
// ===========================================================================
xdr.union("AllowTrustOpAsset", {
  switchOn: xdr.lookup("AssetType"),
  switchName: "type",
  switches: [
    ["assetTypeCreditAlphanum4", "assetCode4"],
    ["assetTypeCreditAlphanum12", "assetCode12"],
  ],
  arms: {
    assetCode4: xdr.opaque(4),
    assetCode12: xdr.opaque(12),
  },
});

// === xdr source ============================================================
//
//   struct AllowTrustOp
//   {
//       AccountID trustor;
//       union switch (AssetType type)
//       {
//       // ASSET_TYPE_NATIVE is not allowed
//       case ASSET_TYPE_CREDIT_ALPHANUM4:
//           opaque assetCode4[4];
//   
//       case ASSET_TYPE_CREDIT_ALPHANUM12:
//           opaque assetCode12[12];
//   
//           // add other asset types here in the future
//       }
//       asset;
//   
//       bool authorize;
//   };
//
// ===========================================================================
xdr.struct("AllowTrustOp", [
  ["trustor", xdr.lookup("AccountId")],
  ["asset", xdr.lookup("AllowTrustOpAsset")],
  ["authorize", xdr.bool()],
]);

// === xdr source ============================================================
//
//   struct ManageDataOp
//   {
//       string64 dataName; 
//       DataValue* dataValue;   // set to null to clear
//   };
//
// ===========================================================================
xdr.struct("ManageDataOp", [
  ["dataName", xdr.lookup("String64")],
  ["dataValue", xdr.option(xdr.lookup("DataValue"))],
]);

// === xdr source ============================================================
//
//   union switch (OperationType type)
//       {
//       case CREATE_ACCOUNT:
//           CreateAccountOp createAccountOp;
//       case PAYMENT:
//           PaymentOp paymentOp;
//       case PATH_PAYMENT:
//           PathPaymentOp pathPaymentOp;
//       case MANAGE_OFFER:
//           ManageOfferOp manageOfferOp;
//       case CREATE_PASSIVE_OFFER:
//           CreatePassiveOfferOp createPassiveOfferOp;
//       case SET_OPTIONS:
//           SetOptionsOp setOptionsOp;
//       case CHANGE_TRUST:
//           ChangeTrustOp changeTrustOp;
//       case ALLOW_TRUST:
//           AllowTrustOp allowTrustOp;
//       case ACCOUNT_MERGE:
//           AccountID destination;
//       case INFLATION:
//           void;
//       case MANAGE_DATA:
//           ManageDataOp manageDataOp;
//       }
//
// ===========================================================================
xdr.union("OperationBody", {
  switchOn: xdr.lookup("OperationType"),
  switchName: "type",
  switches: [
    ["createAccount", "createAccountOp"],
    ["payment", "paymentOp"],
    ["pathPayment", "pathPaymentOp"],
    ["manageOffer", "manageOfferOp"],
    ["createPassiveOffer", "createPassiveOfferOp"],
    ["setOption", "setOptionsOp"],
    ["changeTrust", "changeTrustOp"],
    ["allowTrust", "allowTrustOp"],
    ["accountMerge", "destination"],
    ["inflation", xdr.void()],
    ["manageDatum", "manageDataOp"],
  ],
  arms: {
    createAccountOp: xdr.lookup("CreateAccountOp"),
    paymentOp: xdr.lookup("PaymentOp"),
    pathPaymentOp: xdr.lookup("PathPaymentOp"),
    manageOfferOp: xdr.lookup("ManageOfferOp"),
    createPassiveOfferOp: xdr.lookup("CreatePassiveOfferOp"),
    setOptionsOp: xdr.lookup("SetOptionsOp"),
    changeTrustOp: xdr.lookup("ChangeTrustOp"),
    allowTrustOp: xdr.lookup("AllowTrustOp"),
    destination: xdr.lookup("AccountId"),
    manageDataOp: xdr.lookup("ManageDataOp"),
  },
});

// === xdr source ============================================================
//
//   struct Operation
//   {
//       // sourceAccount is the account used to run the operation
//       // if not set, the runtime defaults to "sourceAccount" specified at
//       // the transaction level
//       AccountID* sourceAccount;
//   
//       union switch (OperationType type)
//       {
//       case CREATE_ACCOUNT:
//           CreateAccountOp createAccountOp;
//       case PAYMENT:
//           PaymentOp paymentOp;
//       case PATH_PAYMENT:
//           PathPaymentOp pathPaymentOp;
//       case MANAGE_OFFER:
//           ManageOfferOp manageOfferOp;
//       case CREATE_PASSIVE_OFFER:
//           CreatePassiveOfferOp createPassiveOfferOp;
//       case SET_OPTIONS:
//           SetOptionsOp setOptionsOp;
//       case CHANGE_TRUST:
//           ChangeTrustOp changeTrustOp;
//       case ALLOW_TRUST:
//           AllowTrustOp allowTrustOp;
//       case ACCOUNT_MERGE:
//           AccountID destination;
//       case INFLATION:
//           void;
//       case MANAGE_DATA:
//           ManageDataOp manageDataOp;
//       }
//       body;
//   };
//
// ===========================================================================
xdr.struct("Operation", [
  ["sourceAccount", xdr.option(xdr.lookup("AccountId"))],
  ["body", xdr.lookup("OperationBody")],
]);

// === xdr source ============================================================
//
//   enum MemoType
//   {
//       MEMO_NONE = 0,
//       MEMO_TEXT = 1,
//       MEMO_ID = 2,
//       MEMO_HASH = 3,
//       MEMO_RETURN = 4
//   };
//
// ===========================================================================
xdr.enum("MemoType", {
  memoNone: 0,
  memoText: 1,
  memoId: 2,
  memoHash: 3,
  memoReturn: 4,
});

// === xdr source ============================================================
//
//   union Memo switch (MemoType type)
//   {
//   case MEMO_NONE:
//       void;
//   case MEMO_TEXT:
//       string text<28>;
//   case MEMO_ID:
//       uint64 id;
//   case MEMO_HASH:
//       Hash hash; // the hash of what to pull from the content server
//   case MEMO_RETURN:
//       Hash retHash; // the hash of the tx you are rejecting
//   };
//
// ===========================================================================
xdr.union("Memo", {
  switchOn: xdr.lookup("MemoType"),
  switchName: "type",
  switches: [
    ["memoNone", xdr.void()],
    ["memoText", "text"],
    ["memoId", "id"],
    ["memoHash", "hash"],
    ["memoReturn", "retHash"],
  ],
  arms: {
    text: xdr.string(28),
    id: xdr.lookup("Uint64"),
    hash: xdr.lookup("Hash"),
    retHash: xdr.lookup("Hash"),
  },
});

// === xdr source ============================================================
//
//   struct TimeBounds
//   {
//       uint64 minTime;
//       uint64 maxTime; // 0 here means no maxTime
//   };
//
// ===========================================================================
xdr.struct("TimeBounds", [
  ["minTime", xdr.lookup("Uint64")],
  ["maxTime", xdr.lookup("Uint64")],
]);

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("TransactionExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct Transaction
//   {
//       // account used to run the transaction
//       AccountID sourceAccount;
//   
//       // the fee the sourceAccount will pay
//       uint32 fee;
//   
//       // sequence number to consume in the account
//       SequenceNumber seqNum;
//   
//       // validity range (inclusive) for the last ledger close time
//       TimeBounds* timeBounds;
//   
//       Memo memo;
//   
//       Operation operations<100>;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("Transaction", [
  ["sourceAccount", xdr.lookup("AccountId")],
  ["fee", xdr.lookup("Uint32")],
  ["seqNum", xdr.lookup("SequenceNumber")],
  ["timeBounds", xdr.option(xdr.lookup("TimeBounds"))],
  ["memo", xdr.lookup("Memo")],
  ["operations", xdr.varArray(xdr.lookup("Operation"), 100)],
  ["ext", xdr.lookup("TransactionExt")],
]);

// === xdr source ============================================================
//
//   union switch (EnvelopeType type)
//       {
//       case ENVELOPE_TYPE_TX:
//             Transaction tx;
//       /* All other values of type are invalid */
//       }
//
// ===========================================================================
xdr.union("TransactionSignaturePayloadTaggedTransaction", {
  switchOn: xdr.lookup("EnvelopeType"),
  switchName: "type",
  switches: [
    ["envelopeTypeTx", "tx"],
  ],
  arms: {
    tx: xdr.lookup("Transaction"),
  },
});

// === xdr source ============================================================
//
//   struct TransactionSignaturePayload {
//       Hash networkId;
//       union switch (EnvelopeType type)
//       {
//       case ENVELOPE_TYPE_TX:
//             Transaction tx;
//       /* All other values of type are invalid */
//       } taggedTransaction;
//   };
//
// ===========================================================================
xdr.struct("TransactionSignaturePayload", [
  ["networkId", xdr.lookup("Hash")],
  ["taggedTransaction", xdr.lookup("TransactionSignaturePayloadTaggedTransaction")],
]);

// === xdr source ============================================================
//
//   struct TransactionEnvelope
//   {
//       Transaction tx;
//       /* Each decorated signature is a signature over the SHA256 hash of
//        * a TransactionSignaturePayload */
//       DecoratedSignature
//       signatures<20>;
//   };
//
// ===========================================================================
xdr.struct("TransactionEnvelope", [
  ["tx", xdr.lookup("Transaction")],
  ["signatures", xdr.varArray(xdr.lookup("DecoratedSignature"), 20)],
]);

// === xdr source ============================================================
//
//   struct ClaimOfferAtom
//   {
//       // emitted to identify the offer
//       AccountID sellerID; // Account that owns the offer
//       uint64 offerID;
//   
//       // amount and asset taken from the owner
//       Asset assetSold;
//       int64 amountSold;
//   
//       // amount and asset sent to the owner
//       Asset assetBought;
//       int64 amountBought;
//   };
//
// ===========================================================================
xdr.struct("ClaimOfferAtom", [
  ["sellerId", xdr.lookup("AccountId")],
  ["offerId", xdr.lookup("Uint64")],
  ["assetSold", xdr.lookup("Asset")],
  ["amountSold", xdr.lookup("Int64")],
  ["assetBought", xdr.lookup("Asset")],
  ["amountBought", xdr.lookup("Int64")],
]);

// === xdr source ============================================================
//
//   enum CreateAccountResultCode
//   {
//       // codes considered as "success" for the operation
//       CREATE_ACCOUNT_SUCCESS = 0, // account was created
//   
//       // codes considered as "failure" for the operation
//       CREATE_ACCOUNT_MALFORMED = -1,   // invalid destination
//       CREATE_ACCOUNT_UNDERFUNDED = -2, // not enough funds in source account
//       CREATE_ACCOUNT_LOW_RESERVE =
//           -3, // would create an account below the min reserve
//       CREATE_ACCOUNT_ALREADY_EXIST = -4 // account already exists
//   };
//
// ===========================================================================
xdr.enum("CreateAccountResultCode", {
  createAccountSuccess: 0,
  createAccountMalformed: -1,
  createAccountUnderfunded: -2,
  createAccountLowReserve: -3,
  createAccountAlreadyExist: -4,
});

// === xdr source ============================================================
//
//   union CreateAccountResult switch (CreateAccountResultCode code)
//   {
//   case CREATE_ACCOUNT_SUCCESS:
//       void;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("CreateAccountResult", {
  switchOn: xdr.lookup("CreateAccountResultCode"),
  switchName: "code",
  switches: [
    ["createAccountSuccess", xdr.void()],
  ],
  arms: {
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum PaymentResultCode
//   {
//       // codes considered as "success" for the operation
//       PAYMENT_SUCCESS = 0, // payment successfuly completed
//   
//       // codes considered as "failure" for the operation
//       PAYMENT_MALFORMED = -1,          // bad input
//       PAYMENT_UNDERFUNDED = -2,        // not enough funds in source account
//       PAYMENT_SRC_NO_TRUST = -3,       // no trust line on source account
//       PAYMENT_SRC_NOT_AUTHORIZED = -4, // source not authorized to transfer
//       PAYMENT_NO_DESTINATION = -5,     // destination account does not exist
//       PAYMENT_NO_TRUST = -6,       // destination missing a trust line for asset
//       PAYMENT_NOT_AUTHORIZED = -7, // destination not authorized to hold asset
//       PAYMENT_LINE_FULL = -8,      // destination would go above their limit
//       PAYMENT_NO_ISSUER = -9       // missing issuer on asset
//   };
//
// ===========================================================================
xdr.enum("PaymentResultCode", {
  paymentSuccess: 0,
  paymentMalformed: -1,
  paymentUnderfunded: -2,
  paymentSrcNoTrust: -3,
  paymentSrcNotAuthorized: -4,
  paymentNoDestination: -5,
  paymentNoTrust: -6,
  paymentNotAuthorized: -7,
  paymentLineFull: -8,
  paymentNoIssuer: -9,
});

// === xdr source ============================================================
//
//   union PaymentResult switch (PaymentResultCode code)
//   {
//   case PAYMENT_SUCCESS:
//       void;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("PaymentResult", {
  switchOn: xdr.lookup("PaymentResultCode"),
  switchName: "code",
  switches: [
    ["paymentSuccess", xdr.void()],
  ],
  arms: {
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum PathPaymentResultCode
//   {
//       // codes considered as "success" for the operation
//       PATH_PAYMENT_SUCCESS = 0, // success
//   
//       // codes considered as "failure" for the operation
//       PATH_PAYMENT_MALFORMED = -1,          // bad input
//       PATH_PAYMENT_UNDERFUNDED = -2,        // not enough funds in source account
//       PATH_PAYMENT_SRC_NO_TRUST = -3,       // no trust line on source account
//       PATH_PAYMENT_SRC_NOT_AUTHORIZED = -4, // source not authorized to transfer
//       PATH_PAYMENT_NO_DESTINATION = -5,     // destination account does not exist
//       PATH_PAYMENT_NO_TRUST = -6,           // dest missing a trust line for asset
//       PATH_PAYMENT_NOT_AUTHORIZED = -7,     // dest not authorized to hold asset
//       PATH_PAYMENT_LINE_FULL = -8,          // dest would go above their limit
//       PATH_PAYMENT_NO_ISSUER = -9,          // missing issuer on one asset
//       PATH_PAYMENT_TOO_FEW_OFFERS = -10,    // not enough offers to satisfy path
//       PATH_PAYMENT_OFFER_CROSS_SELF = -11,  // would cross one of its own offers
//       PATH_PAYMENT_OVER_SENDMAX = -12       // could not satisfy sendmax
//   };
//
// ===========================================================================
xdr.enum("PathPaymentResultCode", {
  pathPaymentSuccess: 0,
  pathPaymentMalformed: -1,
  pathPaymentUnderfunded: -2,
  pathPaymentSrcNoTrust: -3,
  pathPaymentSrcNotAuthorized: -4,
  pathPaymentNoDestination: -5,
  pathPaymentNoTrust: -6,
  pathPaymentNotAuthorized: -7,
  pathPaymentLineFull: -8,
  pathPaymentNoIssuer: -9,
  pathPaymentTooFewOffer: -10,
  pathPaymentOfferCrossSelf: -11,
  pathPaymentOverSendmax: -12,
});

// === xdr source ============================================================
//
//   struct SimplePaymentResult
//   {
//       AccountID destination;
//       Asset asset;
//       int64 amount;
//   };
//
// ===========================================================================
xdr.struct("SimplePaymentResult", [
  ["destination", xdr.lookup("AccountId")],
  ["asset", xdr.lookup("Asset")],
  ["amount", xdr.lookup("Int64")],
]);

// === xdr source ============================================================
//
//   struct
//       {
//           ClaimOfferAtom offers<>;
//           SimplePaymentResult last;
//       }
//
// ===========================================================================
xdr.struct("PathPaymentResultSuccess", [
  ["offers", xdr.varArray(xdr.lookup("ClaimOfferAtom"), 2147483647)],
  ["last", xdr.lookup("SimplePaymentResult")],
]);

// === xdr source ============================================================
//
//   union PathPaymentResult switch (PathPaymentResultCode code)
//   {
//   case PATH_PAYMENT_SUCCESS:
//       struct
//       {
//           ClaimOfferAtom offers<>;
//           SimplePaymentResult last;
//       } success;
//   case PATH_PAYMENT_NO_ISSUER:
//       Asset noIssuer; // the asset that caused the error
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("PathPaymentResult", {
  switchOn: xdr.lookup("PathPaymentResultCode"),
  switchName: "code",
  switches: [
    ["pathPaymentSuccess", "success"],
    ["pathPaymentNoIssuer", "noIssuer"],
  ],
  arms: {
    success: xdr.lookup("PathPaymentResultSuccess"),
    noIssuer: xdr.lookup("Asset"),
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum ManageOfferResultCode
//   {
//       // codes considered as "success" for the operation
//       MANAGE_OFFER_SUCCESS = 0,
//   
//       // codes considered as "failure" for the operation
//       MANAGE_OFFER_MALFORMED = -1,     // generated offer would be invalid
//       MANAGE_OFFER_SELL_NO_TRUST = -2, // no trust line for what we're selling
//       MANAGE_OFFER_BUY_NO_TRUST = -3,  // no trust line for what we're buying
//       MANAGE_OFFER_SELL_NOT_AUTHORIZED = -4, // not authorized to sell
//       MANAGE_OFFER_BUY_NOT_AUTHORIZED = -5,  // not authorized to buy
//       MANAGE_OFFER_LINE_FULL = -6,      // can't receive more of what it's buying
//       MANAGE_OFFER_UNDERFUNDED = -7,    // doesn't hold what it's trying to sell
//       MANAGE_OFFER_CROSS_SELF = -8,     // would cross an offer from the same user
//       MANAGE_OFFER_SELL_NO_ISSUER = -9, // no issuer for what we're selling
//       MANAGE_OFFER_BUY_NO_ISSUER = -10, // no issuer for what we're buying
//   
//       // update errors
//       MANAGE_OFFER_NOT_FOUND = -11, // offerID does not match an existing offer
//   
//       MANAGE_OFFER_LOW_RESERVE = -12 // not enough funds to create a new Offer
//   };
//
// ===========================================================================
xdr.enum("ManageOfferResultCode", {
  manageOfferSuccess: 0,
  manageOfferMalformed: -1,
  manageOfferSellNoTrust: -2,
  manageOfferBuyNoTrust: -3,
  manageOfferSellNotAuthorized: -4,
  manageOfferBuyNotAuthorized: -5,
  manageOfferLineFull: -6,
  manageOfferUnderfunded: -7,
  manageOfferCrossSelf: -8,
  manageOfferSellNoIssuer: -9,
  manageOfferBuyNoIssuer: -10,
  manageOfferNotFound: -11,
  manageOfferLowReserve: -12,
});

// === xdr source ============================================================
//
//   enum ManageOfferEffect
//   {
//       MANAGE_OFFER_CREATED = 0,
//       MANAGE_OFFER_UPDATED = 1,
//       MANAGE_OFFER_DELETED = 2
//   };
//
// ===========================================================================
xdr.enum("ManageOfferEffect", {
  manageOfferCreated: 0,
  manageOfferUpdated: 1,
  manageOfferDeleted: 2,
});

// === xdr source ============================================================
//
//   union switch (ManageOfferEffect effect)
//       {
//       case MANAGE_OFFER_CREATED:
//       case MANAGE_OFFER_UPDATED:
//           OfferEntry offer;
//       default:
//           void;
//       }
//
// ===========================================================================
xdr.union("ManageOfferSuccessResultOffer", {
  switchOn: xdr.lookup("ManageOfferEffect"),
  switchName: "effect",
  switches: [
    ["manageOfferCreated", "offer"],
    ["manageOfferUpdated", "offer"],
  ],
  arms: {
    offer: xdr.lookup("OfferEntry"),
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   struct ManageOfferSuccessResult
//   {
//       // offers that got claimed while creating this offer
//       ClaimOfferAtom offersClaimed<>;
//   
//       union switch (ManageOfferEffect effect)
//       {
//       case MANAGE_OFFER_CREATED:
//       case MANAGE_OFFER_UPDATED:
//           OfferEntry offer;
//       default:
//           void;
//       }
//       offer;
//   };
//
// ===========================================================================
xdr.struct("ManageOfferSuccessResult", [
  ["offersClaimed", xdr.varArray(xdr.lookup("ClaimOfferAtom"), 2147483647)],
  ["offer", xdr.lookup("ManageOfferSuccessResultOffer")],
]);

// === xdr source ============================================================
//
//   union ManageOfferResult switch (ManageOfferResultCode code)
//   {
//   case MANAGE_OFFER_SUCCESS:
//       ManageOfferSuccessResult success;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("ManageOfferResult", {
  switchOn: xdr.lookup("ManageOfferResultCode"),
  switchName: "code",
  switches: [
    ["manageOfferSuccess", "success"],
  ],
  arms: {
    success: xdr.lookup("ManageOfferSuccessResult"),
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum SetOptionsResultCode
//   {
//       // codes considered as "success" for the operation
//       SET_OPTIONS_SUCCESS = 0,
//       // codes considered as "failure" for the operation
//       SET_OPTIONS_LOW_RESERVE = -1,      // not enough funds to add a signer
//       SET_OPTIONS_TOO_MANY_SIGNERS = -2, // max number of signers already reached
//       SET_OPTIONS_BAD_FLAGS = -3,        // invalid combination of clear/set flags
//       SET_OPTIONS_INVALID_INFLATION = -4,      // inflation account does not exist
//       SET_OPTIONS_CANT_CHANGE = -5,            // can no longer change this option
//       SET_OPTIONS_UNKNOWN_FLAG = -6,           // can't set an unknown flag
//       SET_OPTIONS_THRESHOLD_OUT_OF_RANGE = -7, // bad value for weight/threshold
//       SET_OPTIONS_BAD_SIGNER = -8,             // signer cannot be masterkey
//       SET_OPTIONS_INVALID_HOME_DOMAIN = -9     // malformed home domain
//   };
//
// ===========================================================================
xdr.enum("SetOptionsResultCode", {
  setOptionsSuccess: 0,
  setOptionsLowReserve: -1,
  setOptionsTooManySigner: -2,
  setOptionsBadFlag: -3,
  setOptionsInvalidInflation: -4,
  setOptionsCantChange: -5,
  setOptionsUnknownFlag: -6,
  setOptionsThresholdOutOfRange: -7,
  setOptionsBadSigner: -8,
  setOptionsInvalidHomeDomain: -9,
});

// === xdr source ============================================================
//
//   union SetOptionsResult switch (SetOptionsResultCode code)
//   {
//   case SET_OPTIONS_SUCCESS:
//       void;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("SetOptionsResult", {
  switchOn: xdr.lookup("SetOptionsResultCode"),
  switchName: "code",
  switches: [
    ["setOptionsSuccess", xdr.void()],
  ],
  arms: {
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum ChangeTrustResultCode
//   {
//       // codes considered as "success" for the operation
//       CHANGE_TRUST_SUCCESS = 0,
//       // codes considered as "failure" for the operation
//       CHANGE_TRUST_MALFORMED = -1,     // bad input
//       CHANGE_TRUST_NO_ISSUER = -2,     // could not find issuer
//       CHANGE_TRUST_INVALID_LIMIT = -3, // cannot drop limit below balance
//                                        // cannot create with a limit of 0
//       CHANGE_TRUST_LOW_RESERVE = -4, // not enough funds to create a new trust line,
//       CHANGE_TRUST_SELF_NOT_ALLOWED = -5 // trusting self is not allowed
//   };
//
// ===========================================================================
xdr.enum("ChangeTrustResultCode", {
  changeTrustSuccess: 0,
  changeTrustMalformed: -1,
  changeTrustNoIssuer: -2,
  changeTrustInvalidLimit: -3,
  changeTrustLowReserve: -4,
  changeTrustSelfNotAllowed: -5,
});

// === xdr source ============================================================
//
//   union ChangeTrustResult switch (ChangeTrustResultCode code)
//   {
//   case CHANGE_TRUST_SUCCESS:
//       void;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("ChangeTrustResult", {
  switchOn: xdr.lookup("ChangeTrustResultCode"),
  switchName: "code",
  switches: [
    ["changeTrustSuccess", xdr.void()],
  ],
  arms: {
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum AllowTrustResultCode
//   {
//       // codes considered as "success" for the operation
//       ALLOW_TRUST_SUCCESS = 0,
//       // codes considered as "failure" for the operation
//       ALLOW_TRUST_MALFORMED = -1,     // asset is not ASSET_TYPE_ALPHANUM
//       ALLOW_TRUST_NO_TRUST_LINE = -2, // trustor does not have a trustline
//                                       // source account does not require trust
//       ALLOW_TRUST_TRUST_NOT_REQUIRED = -3,
//       ALLOW_TRUST_CANT_REVOKE = -4, // source account can't revoke trust,
//       ALLOW_TRUST_SELF_NOT_ALLOWED = -5 // trusting self is not allowed
//   };
//
// ===========================================================================
xdr.enum("AllowTrustResultCode", {
  allowTrustSuccess: 0,
  allowTrustMalformed: -1,
  allowTrustNoTrustLine: -2,
  allowTrustTrustNotRequired: -3,
  allowTrustCantRevoke: -4,
  allowTrustSelfNotAllowed: -5,
});

// === xdr source ============================================================
//
//   union AllowTrustResult switch (AllowTrustResultCode code)
//   {
//   case ALLOW_TRUST_SUCCESS:
//       void;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("AllowTrustResult", {
  switchOn: xdr.lookup("AllowTrustResultCode"),
  switchName: "code",
  switches: [
    ["allowTrustSuccess", xdr.void()],
  ],
  arms: {
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum AccountMergeResultCode
//   {
//       // codes considered as "success" for the operation
//       ACCOUNT_MERGE_SUCCESS = 0,
//       // codes considered as "failure" for the operation
//       ACCOUNT_MERGE_MALFORMED = -1,      // can't merge onto itself
//       ACCOUNT_MERGE_NO_ACCOUNT = -2,     // destination does not exist
//       ACCOUNT_MERGE_IMMUTABLE_SET = -3,  // source account has AUTH_IMMUTABLE set
//       ACCOUNT_MERGE_HAS_SUB_ENTRIES = -4 // account has trust lines/offers
//   };
//
// ===========================================================================
xdr.enum("AccountMergeResultCode", {
  accountMergeSuccess: 0,
  accountMergeMalformed: -1,
  accountMergeNoAccount: -2,
  accountMergeImmutableSet: -3,
  accountMergeHasSubEntry: -4,
});

// === xdr source ============================================================
//
//   union AccountMergeResult switch (AccountMergeResultCode code)
//   {
//   case ACCOUNT_MERGE_SUCCESS:
//       int64 sourceAccountBalance; // how much got transfered from source account
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("AccountMergeResult", {
  switchOn: xdr.lookup("AccountMergeResultCode"),
  switchName: "code",
  switches: [
    ["accountMergeSuccess", "sourceAccountBalance"],
  ],
  arms: {
    sourceAccountBalance: xdr.lookup("Int64"),
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum InflationResultCode
//   {
//       // codes considered as "success" for the operation
//       INFLATION_SUCCESS = 0,
//       // codes considered as "failure" for the operation
//       INFLATION_NOT_TIME = -1
//   };
//
// ===========================================================================
xdr.enum("InflationResultCode", {
  inflationSuccess: 0,
  inflationNotTime: -1,
});

// === xdr source ============================================================
//
//   struct InflationPayout // or use PaymentResultAtom to limit types?
//   {
//       AccountID destination;
//       int64 amount;
//   };
//
// ===========================================================================
xdr.struct("InflationPayout", [
  ["destination", xdr.lookup("AccountId")],
  ["amount", xdr.lookup("Int64")],
]);

// === xdr source ============================================================
//
//   union InflationResult switch (InflationResultCode code)
//   {
//   case INFLATION_SUCCESS:
//       InflationPayout payouts<>;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("InflationResult", {
  switchOn: xdr.lookup("InflationResultCode"),
  switchName: "code",
  switches: [
    ["inflationSuccess", "payouts"],
  ],
  arms: {
    payouts: xdr.varArray(xdr.lookup("InflationPayout"), 2147483647),
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum ManageDataResultCode
//   {
//       // codes considered as "success" for the operation
//       MANAGE_DATA_SUCCESS = 0,
//       // codes considered as "failure" for the operation
//       MANAGE_DATA_NOT_SUPPORTED_YET = -1, // The network hasn't moved to this protocol change yet
//       MANAGE_DATA_NAME_NOT_FOUND = -2,    // Trying to remove a Data Entry that isn't there
//       MANAGE_DATA_LOW_RESERVE = -3,       // not enough funds to create a new Data Entry
//       MANAGE_DATA_INVALID_NAME = -4       // Name not a valid string
//   };
//
// ===========================================================================
xdr.enum("ManageDataResultCode", {
  manageDataSuccess: 0,
  manageDataNotSupportedYet: -1,
  manageDataNameNotFound: -2,
  manageDataLowReserve: -3,
  manageDataInvalidName: -4,
});

// === xdr source ============================================================
//
//   union ManageDataResult switch (ManageDataResultCode code)
//   {
//   case MANAGE_DATA_SUCCESS:
//       void;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("ManageDataResult", {
  switchOn: xdr.lookup("ManageDataResultCode"),
  switchName: "code",
  switches: [
    ["manageDataSuccess", xdr.void()],
  ],
  arms: {
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum OperationResultCode
//   {
//       opINNER = 0, // inner object result is valid
//   
//       opBAD_AUTH = -1,  // too few valid signatures / wrong network
//       opNO_ACCOUNT = -2 // source account was not found
//   };
//
// ===========================================================================
xdr.enum("OperationResultCode", {
  opInner: 0,
  opBadAuth: -1,
  opNoAccount: -2,
});

// === xdr source ============================================================
//
//   union switch (OperationType type)
//       {
//       case CREATE_ACCOUNT:
//           CreateAccountResult createAccountResult;
//       case PAYMENT:
//           PaymentResult paymentResult;
//       case PATH_PAYMENT:
//           PathPaymentResult pathPaymentResult;
//       case MANAGE_OFFER:
//           ManageOfferResult manageOfferResult;
//       case CREATE_PASSIVE_OFFER:
//           ManageOfferResult createPassiveOfferResult;
//       case SET_OPTIONS:
//           SetOptionsResult setOptionsResult;
//       case CHANGE_TRUST:
//           ChangeTrustResult changeTrustResult;
//       case ALLOW_TRUST:
//           AllowTrustResult allowTrustResult;
//       case ACCOUNT_MERGE:
//           AccountMergeResult accountMergeResult;
//       case INFLATION:
//           InflationResult inflationResult;
//       case MANAGE_DATA:
//           ManageDataResult manageDataResult;
//       }
//
// ===========================================================================
xdr.union("OperationResultTr", {
  switchOn: xdr.lookup("OperationType"),
  switchName: "type",
  switches: [
    ["createAccount", "createAccountResult"],
    ["payment", "paymentResult"],
    ["pathPayment", "pathPaymentResult"],
    ["manageOffer", "manageOfferResult"],
    ["createPassiveOffer", "createPassiveOfferResult"],
    ["setOption", "setOptionsResult"],
    ["changeTrust", "changeTrustResult"],
    ["allowTrust", "allowTrustResult"],
    ["accountMerge", "accountMergeResult"],
    ["inflation", "inflationResult"],
    ["manageDatum", "manageDataResult"],
  ],
  arms: {
    createAccountResult: xdr.lookup("CreateAccountResult"),
    paymentResult: xdr.lookup("PaymentResult"),
    pathPaymentResult: xdr.lookup("PathPaymentResult"),
    manageOfferResult: xdr.lookup("ManageOfferResult"),
    createPassiveOfferResult: xdr.lookup("ManageOfferResult"),
    setOptionsResult: xdr.lookup("SetOptionsResult"),
    changeTrustResult: xdr.lookup("ChangeTrustResult"),
    allowTrustResult: xdr.lookup("AllowTrustResult"),
    accountMergeResult: xdr.lookup("AccountMergeResult"),
    inflationResult: xdr.lookup("InflationResult"),
    manageDataResult: xdr.lookup("ManageDataResult"),
  },
});

// === xdr source ============================================================
//
//   union OperationResult switch (OperationResultCode code)
//   {
//   case opINNER:
//       union switch (OperationType type)
//       {
//       case CREATE_ACCOUNT:
//           CreateAccountResult createAccountResult;
//       case PAYMENT:
//           PaymentResult paymentResult;
//       case PATH_PAYMENT:
//           PathPaymentResult pathPaymentResult;
//       case MANAGE_OFFER:
//           ManageOfferResult manageOfferResult;
//       case CREATE_PASSIVE_OFFER:
//           ManageOfferResult createPassiveOfferResult;
//       case SET_OPTIONS:
//           SetOptionsResult setOptionsResult;
//       case CHANGE_TRUST:
//           ChangeTrustResult changeTrustResult;
//       case ALLOW_TRUST:
//           AllowTrustResult allowTrustResult;
//       case ACCOUNT_MERGE:
//           AccountMergeResult accountMergeResult;
//       case INFLATION:
//           InflationResult inflationResult;
//       case MANAGE_DATA:
//           ManageDataResult manageDataResult;
//       }
//       tr;
//   default:
//       void;
//   };
//
// ===========================================================================
xdr.union("OperationResult", {
  switchOn: xdr.lookup("OperationResultCode"),
  switchName: "code",
  switches: [
    ["opInner", "tr"],
  ],
  arms: {
    tr: xdr.lookup("OperationResultTr"),
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   enum TransactionResultCode
//   {
//       txSUCCESS = 0, // all operations succeeded
//   
//       txFAILED = -1, // one of the operations failed (none were applied)
//   
//       txTOO_EARLY = -2,         // ledger closeTime before minTime
//       txTOO_LATE = -3,          // ledger closeTime after maxTime
//       txMISSING_OPERATION = -4, // no operation was specified
//       txBAD_SEQ = -5,           // sequence number does not match source account
//   
//       txBAD_AUTH = -6,             // too few valid signatures / wrong network
//       txINSUFFICIENT_BALANCE = -7, // fee would bring account below reserve
//       txNO_ACCOUNT = -8,           // source account not found
//       txINSUFFICIENT_FEE = -9,     // fee is too small
//       txBAD_AUTH_EXTRA = -10,      // unused signatures attached to transaction
//       txINTERNAL_ERROR = -11       // an unknown error occured
//   };
//
// ===========================================================================
xdr.enum("TransactionResultCode", {
  txSuccess: 0,
  txFailed: -1,
  txTooEarly: -2,
  txTooLate: -3,
  txMissingOperation: -4,
  txBadSeq: -5,
  txBadAuth: -6,
  txInsufficientBalance: -7,
  txNoAccount: -8,
  txInsufficientFee: -9,
  txBadAuthExtra: -10,
  txInternalError: -11,
});

// === xdr source ============================================================
//
//   union switch (TransactionResultCode code)
//       {
//       case txSUCCESS:
//       case txFAILED:
//           OperationResult results<>;
//       default:
//           void;
//       }
//
// ===========================================================================
xdr.union("TransactionResultResult", {
  switchOn: xdr.lookup("TransactionResultCode"),
  switchName: "code",
  switches: [
    ["txSuccess", "results"],
    ["txFailed", "results"],
  ],
  arms: {
    results: xdr.varArray(xdr.lookup("OperationResult"), 2147483647),
  },
  defaultArm: xdr.void(),
});

// === xdr source ============================================================
//
//   union switch (int v)
//       {
//       case 0:
//           void;
//       }
//
// ===========================================================================
xdr.union("TransactionResultExt", {
  switchOn: xdr.int(),
  switchName: "v",
  switches: [
    [0, xdr.void()],
  ],
  arms: {
  },
});

// === xdr source ============================================================
//
//   struct TransactionResult
//   {
//       int64 feeCharged; // actual fee charged for the transaction
//   
//       union switch (TransactionResultCode code)
//       {
//       case txSUCCESS:
//       case txFAILED:
//           OperationResult results<>;
//       default:
//           void;
//       }
//       result;
//   
//       // reserved for future use
//       union switch (int v)
//       {
//       case 0:
//           void;
//       }
//       ext;
//   };
//
// ===========================================================================
xdr.struct("TransactionResult", [
  ["feeCharged", xdr.lookup("Int64")],
  ["result", xdr.lookup("TransactionResultResult")],
  ["ext", xdr.lookup("TransactionResultExt")],
]);

// === xdr source ============================================================
//
//   typedef opaque Hash[32];
//
// ===========================================================================
xdr.typedef("Hash", xdr.opaque(32));

// === xdr source ============================================================
//
//   typedef opaque uint256[32];
//
// ===========================================================================
xdr.typedef("Uint256", xdr.opaque(32));

// === xdr source ============================================================
//
//   typedef unsigned int uint32;
//
// ===========================================================================
xdr.typedef("Uint32", xdr.uint());

// === xdr source ============================================================
//
//   typedef int int32;
//
// ===========================================================================
xdr.typedef("Int32", xdr.int());

// === xdr source ============================================================
//
//   typedef unsigned hyper uint64;
//
// ===========================================================================
xdr.typedef("Uint64", xdr.uhyper());

// === xdr source ============================================================
//
//   typedef hyper int64;
//
// ===========================================================================
xdr.typedef("Int64", xdr.hyper());

// === xdr source ============================================================
//
//   enum CryptoKeyType
//   {
//       KEY_TYPE_ED25519 = 0,
//       KEY_TYPE_PRE_AUTH_TX = 1,
//       KEY_TYPE_HASH_X = 2
//   };
//
// ===========================================================================
xdr.enum("CryptoKeyType", {
  keyTypeEd25519: 0,
  keyTypePreAuthTx: 1,
  keyTypeHashX: 2,
});

// === xdr source ============================================================
//
//   enum PublicKeyType
//   {
//       PUBLIC_KEY_TYPE_ED25519 = KEY_TYPE_ED25519
//   };
//
// ===========================================================================
xdr.enum("PublicKeyType", {
  publicKeyTypeEd25519: 0,
});

// === xdr source ============================================================
//
//   enum SignerKeyType
//   {
//       SIGNER_KEY_TYPE_ED25519 = KEY_TYPE_ED25519,
//       SIGNER_KEY_TYPE_PRE_AUTH_TX = KEY_TYPE_PRE_AUTH_TX,
//       SIGNER_KEY_TYPE_HASH_X = KEY_TYPE_HASH_X
//   };
//
// ===========================================================================
xdr.enum("SignerKeyType", {
  signerKeyTypeEd25519: 0,
  signerKeyTypePreAuthTx: 1,
  signerKeyTypeHashX: 2,
});

// === xdr source ============================================================
//
//   union PublicKey switch (PublicKeyType type)
//   {
//   case PUBLIC_KEY_TYPE_ED25519:
//       uint256 ed25519;
//   };
//
// ===========================================================================
xdr.union("PublicKey", {
  switchOn: xdr.lookup("PublicKeyType"),
  switchName: "type",
  switches: [
    ["publicKeyTypeEd25519", "ed25519"],
  ],
  arms: {
    ed25519: xdr.lookup("Uint256"),
  },
});

// === xdr source ============================================================
//
//   union SignerKey switch (SignerKeyType type)
//   {
//   case SIGNER_KEY_TYPE_ED25519:
//       uint256 ed25519;
//   case SIGNER_KEY_TYPE_PRE_AUTH_TX:
//       /* Hash of Transaction structure */
//       uint256 preAuthTx;
//   case SIGNER_KEY_TYPE_HASH_X:
//       /* Hash of random 256 bit preimage X */
//       uint256 hashX;
//   };
//
// ===========================================================================
xdr.union("SignerKey", {
  switchOn: xdr.lookup("SignerKeyType"),
  switchName: "type",
  switches: [
    ["signerKeyTypeEd25519", "ed25519"],
    ["signerKeyTypePreAuthTx", "preAuthTx"],
    ["signerKeyTypeHashX", "hashX"],
  ],
  arms: {
    ed25519: xdr.lookup("Uint256"),
    preAuthTx: xdr.lookup("Uint256"),
    hashX: xdr.lookup("Uint256"),
  },
});

// === xdr source ============================================================
//
//   typedef opaque Signature<64>;
//
// ===========================================================================
xdr.typedef("Signature", xdr.varOpaque(64));

// === xdr source ============================================================
//
//   typedef opaque SignatureHint[4];
//
// ===========================================================================
xdr.typedef("SignatureHint", xdr.opaque(4));

// === xdr source ============================================================
//
//   typedef PublicKey NodeID;
//
// ===========================================================================
xdr.typedef("NodeId", xdr.lookup("PublicKey"));

// === xdr source ============================================================
//
//   struct Curve25519Secret
//   {
//           opaque key[32];
//   };
//
// ===========================================================================
xdr.struct("Curve25519Secret", [
  ["key", xdr.opaque(32)],
]);

// === xdr source ============================================================
//
//   struct Curve25519Public
//   {
//           opaque key[32];
//   };
//
// ===========================================================================
xdr.struct("Curve25519Public", [
  ["key", xdr.opaque(32)],
]);

// === xdr source ============================================================
//
//   struct HmacSha256Key
//   {
//           opaque key[32];
//   };
//
// ===========================================================================
xdr.struct("HmacSha256Key", [
  ["key", xdr.opaque(32)],
]);

// === xdr source ============================================================
//
//   struct HmacSha256Mac
//   {
//           opaque mac[32];
//   };
//
// ===========================================================================
xdr.struct("HmacSha256Mac", [
  ["mac", xdr.opaque(32)],
]);

});
export default types;
