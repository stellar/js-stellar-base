"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// Automatically generated on 2015-04-07T07:50:08-07:00
// DO NOT EDIT or your changes may be overwritten

/* jshint maxstatements:2147483647  */
/* jshint esnext:true  */

var XDR = _interopRequireWildcard(require("js-xdr"));

var types = XDR.config(function (xdr) {

  // === xdr source ============================================================
  //
  //   typedef opaque Signature[64];
  //
  // ===========================================================================
  xdr.typedef("Signature", xdr.opaque(64));

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
  //   typedef unsigned hyper uint64;
  //
  // ===========================================================================
  xdr.typedef("Uint64", xdr.uhyper());

  // === xdr source ============================================================
  //
  //   typedef opaque Value<>;
  //
  // ===========================================================================
  xdr.typedef("Value", xdr.varOpaque());

  // === xdr source ============================================================
  //
  //   typedef opaque Evidence<>;
  //
  // ===========================================================================
  xdr.typedef("Evidence", xdr.varOpaque());

  // === xdr source ============================================================
  //
  //   struct SCPBallot
  //   {
  //       uint32 counter; // n
  //       Value value;    // x
  //   };
  //
  // ===========================================================================
  xdr.struct("ScpBallot", [["counter", xdr.lookup("Uint32")], ["value", xdr.lookup("Value")]]);

  // === xdr source ============================================================
  //
  //   enum SCPStatementType
  //   {
  //       PREPARING = 0,
  //       PREPARED = 1,
  //       COMMITTING = 2,
  //       COMMITTED = 3
  //   };
  //
  // ===========================================================================
  xdr["enum"]("ScpStatementType", {
    preparing: 0,
    prepared: 1,
    committing: 2,
    committed: 3 });

  // === xdr source ============================================================
  //
  //   struct
  //           {
  //               SCPBallot excepted<>; // B_c
  //               SCPBallot* prepared;  // p
  //           }
  //
  // ===========================================================================
  xdr.struct("ScpStatementPrepare", [["excepted", xdr.varArray(xdr.lookup("ScpBallot"), 2147483647)], ["prepared", xdr.option(xdr.lookup("ScpBallot"))]]);

  // === xdr source ============================================================
  //
  //   union switch (SCPStatementType type)
  //       {
  //       case PREPARING:
  //           struct
  //           {
  //               SCPBallot excepted<>; // B_c
  //               SCPBallot* prepared;  // p
  //           } prepare;
  //       case PREPARED:
  //       case COMMITTING:
  //       case COMMITTED:
  //           void;
  //       }
  //
  // ===========================================================================
  xdr.union("ScpStatementPledges", {
    switchOn: xdr.lookup("ScpStatementType"),
    switchName: "type",
    switches: {
      preparing: "prepare",
      prepared: xdr["void"](),
      committing: xdr["void"](),
      committed: xdr["void"]() },
    arms: {
      prepare: xdr.lookup("ScpStatementPrepare") } });

  // === xdr source ============================================================
  //
  //   struct SCPStatement
  //   {
  //       uint64 slotIndex;   // i
  //       SCPBallot ballot;   // b
  //       Hash quorumSetHash; // D
  //  
  //       union switch (SCPStatementType type)
  //       {
  //       case PREPARING:
  //           struct
  //           {
  //               SCPBallot excepted<>; // B_c
  //               SCPBallot* prepared;  // p
  //           } prepare;
  //       case PREPARED:
  //       case COMMITTING:
  //       case COMMITTED:
  //           void;
  //       }
  //       pledges;
  //   };
  //
  // ===========================================================================
  xdr.struct("ScpStatement", [["slotIndex", xdr.lookup("Uint64")], ["ballot", xdr.lookup("ScpBallot")], ["quorumSetHash", xdr.lookup("Hash")], ["pledges", xdr.lookup("ScpStatementPledges")]]);

  // === xdr source ============================================================
  //
  //   struct SCPEnvelope
  //   {
  //       uint256 nodeID; // v
  //       SCPStatement statement;
  //       Signature signature;
  //   };
  //
  // ===========================================================================
  xdr.struct("ScpEnvelope", [["nodeId", xdr.lookup("Uint256")], ["statement", xdr.lookup("ScpStatement")], ["signature", xdr.lookup("Signature")]]);

  // === xdr source ============================================================
  //
  //   struct SCPQuorumSet
  //   {
  //       uint32 threshold;
  //       Hash validators<>;
  //   };
  //
  // ===========================================================================
  xdr.struct("ScpQuorumSet", [["threshold", xdr.lookup("Uint32")], ["validators", xdr.varArray(xdr.lookup("Hash"), 2147483647)]]);

  // === xdr source ============================================================
  //
  //   enum LedgerEntryType
  //   {
  //       ACCOUNT = 0,
  //       TRUSTLINE = 1,
  //       OFFER = 2
  //   };
  //
  // ===========================================================================
  xdr["enum"]("LedgerEntryType", {
    account: 0,
    trustline: 1,
    offer: 2 });

  // === xdr source ============================================================
  //
  //   struct Signer
  //   {
  //       uint256 pubKey;
  //       uint32 weight; // really only need 1byte
  //   };
  //
  // ===========================================================================
  xdr.struct("Signer", [["pubKey", xdr.lookup("Uint256")], ["weight", xdr.lookup("Uint32")]]);

  // === xdr source ============================================================
  //
  //   enum AccountFlags
  //   { // masks for each flag
  //       AUTH_REQUIRED_FLAG = 0x1
  //   };
  //
  // ===========================================================================
  xdr["enum"]("AccountFlags", {
    authRequiredFlag: 1 });

  // === xdr source ============================================================
  //
  //   struct AccountEntry
  //   {
  //       AccountID accountID;      // master public key for this account
  //       int64 balance;            // in stroops
  //       SequenceNumber seqNum;    // last sequence number used for this account
  //       uint32 numSubEntries;     // number of sub-entries this account has
  //                                 // drives the reserve
  //       AccountID* inflationDest; // Account to vote during inflation
  //       uint32 flags;             // see AccountFlags
  //  
  //       // fields used for signatures
  //       // thresholds stores unsigned bytes: [weight of master|low|medium|high]
  //       Thresholds thresholds;
  //  
  //       Signer signers<20>; // possible signers for this account
  //   };
  //
  // ===========================================================================
  xdr.struct("AccountEntry", [["accountId", xdr.lookup("AccountId")], ["balance", xdr.lookup("Int64")], ["seqNum", xdr.lookup("SequenceNumber")], ["numSubEntries", xdr.lookup("Uint32")], ["inflationDest", xdr.option(xdr.lookup("AccountId"))], ["flags", xdr.lookup("Uint32")], ["thresholds", xdr.lookup("Thresholds")], ["signers", xdr.varArray(xdr.lookup("Signer"), 20)]]);

  // === xdr source ============================================================
  //
  //   struct TrustLineEntry
  //   {
  //       AccountID accountID; // account this trustline belongs to
  //       Currency currency;   // currency (with issuer)
  //       int64 balance;       // how much of this currency the user has.
  //                            // Currency defines the unit for this;
  //  
  //       int64 limit;     // balance cannot be above this
  //       bool authorized; // issuer has authorized account to hold its credit
  //   };
  //
  // ===========================================================================
  xdr.struct("TrustLineEntry", [["accountId", xdr.lookup("AccountId")], ["currency", xdr.lookup("Currency")], ["balance", xdr.lookup("Int64")], ["limit", xdr.lookup("Int64")], ["authorized", xdr.bool()]]);

  // === xdr source ============================================================
  //
  //   struct OfferEntry
  //   {
  //       AccountID accountID;
  //       uint64 offerID;
  //       Currency takerGets; // A
  //       Currency takerPays; // B
  //       int64 amount;       // amount of A
  //  
  //       /* price for this offer:
  //           price of A in terms of B
  //           price=AmountB/AmountA=priceNumerator/priceDenominator
  //           price is after fees
  //       */
  //       Price price;
  //   };
  //
  // ===========================================================================
  xdr.struct("OfferEntry", [["accountId", xdr.lookup("AccountId")], ["offerId", xdr.lookup("Uint64")], ["takerGets", xdr.lookup("Currency")], ["takerPays", xdr.lookup("Currency")], ["amount", xdr.lookup("Int64")], ["price", xdr.lookup("Price")]]);

  // === xdr source ============================================================
  //
  //   union LedgerEntry switch (LedgerEntryType type)
  //   {
  //   case ACCOUNT:
  //       AccountEntry account;
  //  
  //   case TRUSTLINE:
  //       TrustLineEntry trustLine;
  //  
  //   case OFFER:
  //       OfferEntry offer;
  //   };
  //
  // ===========================================================================
  xdr.union("LedgerEntry", {
    switchOn: xdr.lookup("LedgerEntryType"),
    switchName: "type",
    switches: {
      account: "account",
      trustline: "trustLine",
      offer: "offer" },
    arms: {
      account: xdr.lookup("AccountEntry"),
      trustLine: xdr.lookup("TrustLineEntry"),
      offer: xdr.lookup("OfferEntry") } });

  // === xdr source ============================================================
  //
  //   struct LedgerHeader
  //   {
  //       Hash previousLedgerHash; // hash of the previous ledger header
  //       Hash txSetHash;          // the tx set that was SCP confirmed
  //       Hash txSetResultHash;    // the TransactionResultSet that led to this ledger
  //       Hash bucketListHash;     // hash of the ledger state
  //  
  //       uint32 ledgerSeq; // sequence number of this ledger
  //       uint64 closeTime; // network close time
  //  
  //       int64 totalCoins; // total number of stroops in existence
  //  
  //       int64 feePool;       // fees burned since last inflation run
  //       uint32 inflationSeq; // inflation sequence number
  //  
  //       uint64 idPool; // last used global ID, used for generating objects
  //  
  //       int32 baseFee;     // base fee per operation in stroops
  //       int32 baseReserve; // account base reserve in stroops
  //   };
  //
  // ===========================================================================
  xdr.struct("LedgerHeader", [["previousLedgerHash", xdr.lookup("Hash")], ["txSetHash", xdr.lookup("Hash")], ["txSetResultHash", xdr.lookup("Hash")], ["bucketListHash", xdr.lookup("Hash")], ["ledgerSeq", xdr.lookup("Uint32")], ["closeTime", xdr.lookup("Uint64")], ["totalCoins", xdr.lookup("Int64")], ["feePool", xdr.lookup("Int64")], ["inflationSeq", xdr.lookup("Uint32")], ["idPool", xdr.lookup("Uint64")], ["baseFee", xdr.lookup("Int32")], ["baseReserve", xdr.lookup("Int32")]]);

  // === xdr source ============================================================
  //
  //   struct
  //       {
  //           AccountID accountID;
  //       }
  //
  // ===========================================================================
  xdr.struct("LedgerKeyAccount", [["accountId", xdr.lookup("AccountId")]]);

  // === xdr source ============================================================
  //
  //   struct
  //       {
  //           AccountID accountID;
  //           Currency currency;
  //       }
  //
  // ===========================================================================
  xdr.struct("LedgerKeyTrustLine", [["accountId", xdr.lookup("AccountId")], ["currency", xdr.lookup("Currency")]]);

  // === xdr source ============================================================
  //
  //   struct
  //       {
  //           AccountID accountID;
  //           uint64 offerID;
  //       }
  //
  // ===========================================================================
  xdr.struct("LedgerKeyOffer", [["accountId", xdr.lookup("AccountId")], ["offerId", xdr.lookup("Uint64")]]);

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
  //           Currency currency;
  //       } trustLine;
  //  
  //   case OFFER:
  //       struct
  //       {
  //           AccountID accountID;
  //           uint64 offerID;
  //       } offer;
  //   };
  //
  // ===========================================================================
  xdr.union("LedgerKey", {
    switchOn: xdr.lookup("LedgerEntryType"),
    switchName: "type",
    switches: {
      account: "account",
      trustline: "trustLine",
      offer: "offer" },
    arms: {
      account: xdr.lookup("LedgerKeyAccount"),
      trustLine: xdr.lookup("LedgerKeyTrustLine"),
      offer: xdr.lookup("LedgerKeyOffer") } });

  // === xdr source ============================================================
  //
  //   enum BucketEntryType
  //   {
  //       LIVEENTRY = 0,
  //       DEADENTRY = 1
  //   };
  //
  // ===========================================================================
  xdr["enum"]("BucketEntryType", {
    liveentry: 0,
    deadentry: 1 });

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
    switches: {
      liveentry: "liveEntry",
      deadentry: "deadEntry" },
    arms: {
      liveEntry: xdr.lookup("LedgerEntry"),
      deadEntry: xdr.lookup("LedgerKey") } });

  // === xdr source ============================================================
  //
  //   struct TransactionSet
  //   {
  //       Hash previousLedgerHash;
  //       TransactionEnvelope txs<5000>;
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionSet", [["previousLedgerHash", xdr.lookup("Hash")], ["txes", xdr.varArray(xdr.lookup("TransactionEnvelope"), 5000)]]);

  // === xdr source ============================================================
  //
  //   struct TransactionResultPair
  //   {
  //       Hash transactionHash;
  //       TransactionResult result; // result for the transaction
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionResultPair", [["transactionHash", xdr.lookup("Hash")], ["result", xdr.lookup("TransactionResult")]]);

  // === xdr source ============================================================
  //
  //   struct TransactionResultSet
  //   {
  //       TransactionResultPair results<5000>;
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionResultSet", [["results", xdr.varArray(xdr.lookup("TransactionResultPair"), 5000)]]);

  // === xdr source ============================================================
  //
  //   struct TransactionMeta
  //   {
  //       BucketEntry entries<>;
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionMeta", [["entries", xdr.varArray(xdr.lookup("BucketEntry"), 2147483647)]]);

  // === xdr source ============================================================
  //
  //   struct TransactionHistoryEntry
  //   {
  //       uint32 ledgerSeq;
  //       TransactionSet txSet;
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionHistoryEntry", [["ledgerSeq", xdr.lookup("Uint32")], ["txSet", xdr.lookup("TransactionSet")]]);

  // === xdr source ============================================================
  //
  //   struct TransactionHistoryResultEntry
  //   {
  //       uint32 ledgerSeq;
  //       TransactionResultSet txResultSet;
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionHistoryResultEntry", [["ledgerSeq", xdr.lookup("Uint32")], ["txResultSet", xdr.lookup("TransactionResultSet")]]);

  // === xdr source ============================================================
  //
  //   struct LedgerHeaderHistoryEntry
  //   {
  //       Hash hash;
  //       LedgerHeader header;
  //   };
  //
  // ===========================================================================
  xdr.struct("LedgerHeaderHistoryEntry", [["hash", xdr.lookup("Hash")], ["header", xdr.lookup("LedgerHeader")]]);

  // === xdr source ============================================================
  //
  //   struct StellarBallotValue
  //   {
  //       Hash txSetHash;
  //       uint64 closeTime;
  //       uint32 baseFee;
  //   };
  //
  // ===========================================================================
  xdr.struct("StellarBallotValue", [["txSetHash", xdr.lookup("Hash")], ["closeTime", xdr.lookup("Uint64")], ["baseFee", xdr.lookup("Uint32")]]);

  // === xdr source ============================================================
  //
  //   struct StellarBallot
  //   {
  //       uint256 nodeID;
  //       Signature signature;
  //       StellarBallotValue value;
  //   };
  //
  // ===========================================================================
  xdr.struct("StellarBallot", [["nodeId", xdr.lookup("Uint256")], ["signature", xdr.lookup("Signature")], ["value", xdr.lookup("StellarBallotValue")]]);

  // === xdr source ============================================================
  //
  //   struct Error
  //   {
  //       int code;
  //       string msg<100>;
  //   };
  //
  // ===========================================================================
  xdr.struct("Error", [["code", xdr.int()], ["msg", xdr.string(100)]]);

  // === xdr source ============================================================
  //
  //   struct Hello
  //   {
  //       int protocolVersion;
  //       string versionStr<100>;
  //       int listeningPort;
  //       opaque peerID[32];
  //   };
  //
  // ===========================================================================
  xdr.struct("Hello", [["protocolVersion", xdr.int()], ["versionStr", xdr.string(100)], ["listeningPort", xdr.int()], ["peerId", xdr.opaque(32)]]);

  // === xdr source ============================================================
  //
  //   struct PeerAddress
  //   {
  //       opaque ip[4];
  //       uint32 port;
  //       uint32 numFailures;
  //   };
  //
  // ===========================================================================
  xdr.struct("PeerAddress", [["ip", xdr.opaque(4)], ["port", xdr.lookup("Uint32")], ["numFailures", xdr.lookup("Uint32")]]);

  // === xdr source ============================================================
  //
  //   enum MessageType
  //   {
  //       ERROR_MSG = 0,
  //       HELLO = 1,
  //       DONT_HAVE = 2,
  //  
  //       GET_PEERS = 3, // gets a list of peers this guy knows about
  //       PEERS = 4,
  //  
  //       GET_TX_SET = 5, // gets a particular txset by hash
  //       TX_SET = 6,
  //  
  //       TRANSACTION = 7, // pass on a tx you have heard about
  //  
  //       // SCP
  //       GET_SCP_QUORUMSET = 8,
  //       SCP_QUORUMSET = 9,
  //       SCP_MESSAGE = 10
  //   };
  //
  // ===========================================================================
  xdr["enum"]("MessageType", {
    errorMsg: 0,
    hello: 1,
    dontHave: 2,
    getPeer: 3,
    peer: 4,
    getTxSet: 5,
    txSet: 6,
    transaction: 7,
    getScpQuorumset: 8,
    scpQuorumset: 9,
    scpMessage: 10 });

  // === xdr source ============================================================
  //
  //   struct DontHave
  //   {
  //       MessageType type;
  //       uint256 reqHash;
  //   };
  //
  // ===========================================================================
  xdr.struct("DontHave", [["type", xdr.lookup("MessageType")], ["reqHash", xdr.lookup("Uint256")]]);

  // === xdr source ============================================================
  //
  //   union StellarMessage switch (MessageType type)
  //   {
  //   case ERROR_MSG:
  //       Error error;
  //   case HELLO:
  //       Hello hello;
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
  //   };
  //
  // ===========================================================================
  xdr.union("StellarMessage", {
    switchOn: xdr.lookup("MessageType"),
    switchName: "type",
    switches: {
      errorMsg: "error",
      hello: "hello",
      dontHave: "dontHave",
      getPeer: xdr["void"](),
      peer: "peers",
      getTxSet: "txSetHash",
      txSet: "txSet",
      transaction: "transaction",
      getScpQuorumset: "qSetHash",
      scpQuorumset: "qSet",
      scpMessage: "envelope" },
    arms: {
      error: xdr.lookup("Error"),
      hello: xdr.lookup("Hello"),
      dontHave: xdr.lookup("DontHave"),
      peers: xdr.varArray(xdr.lookup("PeerAddress"), 2147483647),
      txSetHash: xdr.lookup("Uint256"),
      txSet: xdr.lookup("TransactionSet"),
      transaction: xdr.lookup("TransactionEnvelope"),
      qSetHash: xdr.lookup("Uint256"),
      qSet: xdr.lookup("ScpQuorumSet"),
      envelope: xdr.lookup("ScpEnvelope") } });

  // === xdr source ============================================================
  //
  //   struct DecoratedSignature
  //   {
  //       opaque hint[4];    // first 4 bytes of the public key, used as a hint
  //       uint512 signature; // actual signature
  //   };
  //
  // ===========================================================================
  xdr.struct("DecoratedSignature", [["hint", xdr.opaque(4)], ["signature", xdr.lookup("Uint512")]]);

  // === xdr source ============================================================
  //
  //   enum OperationType
  //   {
  //       PAYMENT = 0,
  //       CREATE_OFFER = 1,
  //       SET_OPTIONS = 2,
  //       CHANGE_TRUST = 3,
  //       ALLOW_TRUST = 4,
  //       ACCOUNT_MERGE = 5,
  //       INFLATION = 6
  //   };
  //
  // ===========================================================================
  xdr["enum"]("OperationType", {
    payment: 0,
    createOffer: 1,
    setOption: 2,
    changeTrust: 3,
    allowTrust: 4,
    accountMerge: 5,
    inflation: 6 });

  // === xdr source ============================================================
  //
  //   struct PaymentOp
  //   {
  //       AccountID destination; // recipient of the payment
  //       Currency currency;     // what they end up with
  //       int64 amount;          // amount they end up with
  //  
  //       opaque memo<32>;
  //       opaque sourceMemo<32>; // used to return a payment
  //  
  //       // payment over path
  //       Currency path<5>; // what hops it must go through to get there
  //       int64 sendMax; // the maximum amount of the source currency (==path[0]) to
  //                      // send (excluding fees).
  //                      // The operation will fail if can't be met
  //   };
  //
  // ===========================================================================
  xdr.struct("PaymentOp", [["destination", xdr.lookup("AccountId")], ["currency", xdr.lookup("Currency")], ["amount", xdr.lookup("Int64")], ["memo", xdr.varOpaque(32)], ["sourceMemo", xdr.varOpaque(32)], ["path", xdr.varArray(xdr.lookup("Currency"), 5)], ["sendMax", xdr.lookup("Int64")]]);

  // === xdr source ============================================================
  //
  //   struct CreateOfferOp
  //   {
  //       Currency takerGets;
  //       Currency takerPays;
  //       int64 amount; // amount taker gets. if set to 0, delete the offer
  //       Price price;  // =takerPaysAmount/takerGetsAmount
  //  
  //       // 0=create a new offer, otherwise edit an existing offer
  //       uint64 offerID;
  //   };
  //
  // ===========================================================================
  xdr.struct("CreateOfferOp", [["takerGets", xdr.lookup("Currency")], ["takerPays", xdr.lookup("Currency")], ["amount", xdr.lookup("Int64")], ["price", xdr.lookup("Price")], ["offerId", xdr.lookup("Uint64")]]);

  // === xdr source ============================================================
  //
  //   struct SetOptionsOp
  //   {
  //       AccountID* inflationDest; // sets the inflation destination
  //  
  //       uint32* clearFlags; // which flags to clear
  //       uint32* setFlags;   // which flags to set
  //  
  //       Thresholds* thresholds; // update the thresholds for the account
  //  
  //       // Add, update or remove a signer for the account
  //       // signer is deleted if the weight is 0
  //       Signer* signer;
  //   };
  //
  // ===========================================================================
  xdr.struct("SetOptionsOp", [["inflationDest", xdr.option(xdr.lookup("AccountId"))], ["clearFlags", xdr.option(xdr.lookup("Uint32"))], ["setFlags", xdr.option(xdr.lookup("Uint32"))], ["thresholds", xdr.option(xdr.lookup("Thresholds"))], ["signer", xdr.option(xdr.lookup("Signer"))]]);

  // === xdr source ============================================================
  //
  //   struct ChangeTrustOp
  //   {
  //       Currency line;
  //  
  //       // if limit is set to 0, deletes the trust line
  //       int64 limit;
  //   };
  //
  // ===========================================================================
  xdr.struct("ChangeTrustOp", [["line", xdr.lookup("Currency")], ["limit", xdr.lookup("Int64")]]);

  // === xdr source ============================================================
  //
  //   union switch (CurrencyType type)
  //       {
  //       // NATIVE is not allowed
  //       case ISO4217:
  //           opaque currencyCode[4];
  //  
  //           // add other currency types here in the future
  //       }
  //
  // ===========================================================================
  xdr.union("AllowTrustOpCurrency", {
    switchOn: xdr.lookup("CurrencyType"),
    switchName: "type",
    switches: {
      iso4217: "currencyCode" },
    arms: {
      currencyCode: xdr.opaque(4) } });

  // === xdr source ============================================================
  //
  //   struct AllowTrustOp
  //   {
  //       AccountID trustor;
  //       union switch (CurrencyType type)
  //       {
  //       // NATIVE is not allowed
  //       case ISO4217:
  //           opaque currencyCode[4];
  //  
  //           // add other currency types here in the future
  //       }
  //       currency;
  //  
  //       bool authorize;
  //   };
  //
  // ===========================================================================
  xdr.struct("AllowTrustOp", [["trustor", xdr.lookup("AccountId")], ["currency", xdr.lookup("AllowTrustOpCurrency")], ["authorize", xdr.bool()]]);

  // === xdr source ============================================================
  //
  //   union switch (OperationType type)
  //       {
  //       case PAYMENT:
  //           PaymentOp paymentOp;
  //       case CREATE_OFFER:
  //           CreateOfferOp createOfferOp;
  //       case SET_OPTIONS:
  //           SetOptionsOp setOptionsOp;
  //       case CHANGE_TRUST:
  //           ChangeTrustOp changeTrustOp;
  //       case ALLOW_TRUST:
  //           AllowTrustOp allowTrustOp;
  //       case ACCOUNT_MERGE:
  //           uint256 destination;
  //       case INFLATION:
  //           uint32 inflationSeq;
  //       }
  //
  // ===========================================================================
  xdr.union("OperationBody", {
    switchOn: xdr.lookup("OperationType"),
    switchName: "type",
    switches: {
      payment: "paymentOp",
      createOffer: "createOfferOp",
      setOption: "setOptionsOp",
      changeTrust: "changeTrustOp",
      allowTrust: "allowTrustOp",
      accountMerge: "destination",
      inflation: "inflationSeq" },
    arms: {
      paymentOp: xdr.lookup("PaymentOp"),
      createOfferOp: xdr.lookup("CreateOfferOp"),
      setOptionsOp: xdr.lookup("SetOptionsOp"),
      changeTrustOp: xdr.lookup("ChangeTrustOp"),
      allowTrustOp: xdr.lookup("AllowTrustOp"),
      destination: xdr.lookup("Uint256"),
      inflationSeq: xdr.lookup("Uint32") } });

  // === xdr source ============================================================
  //
  //   struct Operation
  //   {
  //       // sourceAccount is the account used to run the operation
  //       // if not set, the runtime defaults to "account" specified at
  //       // the transaction level
  //       AccountID* sourceAccount;
  //  
  //       union switch (OperationType type)
  //       {
  //       case PAYMENT:
  //           PaymentOp paymentOp;
  //       case CREATE_OFFER:
  //           CreateOfferOp createOfferOp;
  //       case SET_OPTIONS:
  //           SetOptionsOp setOptionsOp;
  //       case CHANGE_TRUST:
  //           ChangeTrustOp changeTrustOp;
  //       case ALLOW_TRUST:
  //           AllowTrustOp allowTrustOp;
  //       case ACCOUNT_MERGE:
  //           uint256 destination;
  //       case INFLATION:
  //           uint32 inflationSeq;
  //       }
  //       body;
  //   };
  //
  // ===========================================================================
  xdr.struct("Operation", [["sourceAccount", xdr.option(xdr.lookup("AccountId"))], ["body", xdr.lookup("OperationBody")]]);

  // === xdr source ============================================================
  //
  //   struct Transaction
  //   {
  //       // account used to run the transaction
  //       AccountID sourceAccount;
  //  
  //       // maximum fee this transaction can collect
  //       // the transaction is aborted if the fee is higher
  //       int32 maxFee;
  //  
  //       // sequence number to consume in the account
  //       SequenceNumber seqNum;
  //  
  //       // validity range (inclusive) for the ledger sequence number
  //       uint32 minLedger;
  //       uint32 maxLedger;
  //  
  //       Operation operations<100>;
  //   };
  //
  // ===========================================================================
  xdr.struct("Transaction", [["sourceAccount", xdr.lookup("AccountId")], ["maxFee", xdr.lookup("Int32")], ["seqNum", xdr.lookup("SequenceNumber")], ["minLedger", xdr.lookup("Uint32")], ["maxLedger", xdr.lookup("Uint32")], ["operations", xdr.varArray(xdr.lookup("Operation"), 100)]]);

  // === xdr source ============================================================
  //
  //   struct TransactionEnvelope
  //   {
  //       Transaction tx;
  //       DecoratedSignature signatures<20>;
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionEnvelope", [["tx", xdr.lookup("Transaction")], ["signatures", xdr.varArray(xdr.lookup("DecoratedSignature"), 20)]]);

  // === xdr source ============================================================
  //
  //   struct ClaimOfferAtom
  //   {
  //       // emited to identify the offer
  //       AccountID offerOwner; // Account that owns the offer
  //       uint64 offerID;
  //  
  //       // amount and currency taken from the owner
  //       Currency currencyClaimed;
  //       int64 amountClaimed;
  //  
  //       // should we also include the amount that the owner gets in return?
  //   };
  //
  // ===========================================================================
  xdr.struct("ClaimOfferAtom", [["offerOwner", xdr.lookup("AccountId")], ["offerId", xdr.lookup("Uint64")], ["currencyClaimed", xdr.lookup("Currency")], ["amountClaimed", xdr.lookup("Int64")]]);

  // === xdr source ============================================================
  //
  //   enum PaymentResultCode
  //   {
  //       // codes considered as "success" for the operation
  //       PAYMENT_SUCCESS = 0,       // simple payment success
  //       PAYMENT_SUCCESS_MULTI = 1, // multi-path payment success
  //  
  //       // codes considered as "failure" for the operation
  //       PAYMENT_UNDERFUNDED = 2,    // not enough funds in source account
  //       PAYMENT_NO_DESTINATION = 3, // destination account does not exist
  //       PAYMENT_NO_TRUST = 4,       // destination missing a trust line for currency
  //       PAYMENT_NOT_AUTHORIZED = 5, // destination not authorized to hold currency
  //       PAYMENT_LINE_FULL = 6,      // destination would go above their limit
  //       PAYMENT_TOO_FEW_OFFERS = 7, // not enough offers to satisfy path payment
  //       PAYMENT_OVER_SENDMAX = 8,   // multi-path payment could not satisfy sendmax
  //       PAYMENT_LOW_RESERVE = 9     // would create an account below the min reserve
  //   };
  //
  // ===========================================================================
  xdr["enum"]("PaymentResultCode", {
    paymentSuccess: 0,
    paymentSuccessMulti: 1,
    paymentUnderfunded: 2,
    paymentNoDestination: 3,
    paymentNoTrust: 4,
    paymentNotAuthorized: 5,
    paymentLineFull: 6,
    paymentTooFewOffer: 7,
    paymentOverSendmax: 8,
    paymentLowReserve: 9 });

  // === xdr source ============================================================
  //
  //   struct SimplePaymentResult
  //   {
  //       AccountID destination;
  //       Currency currency;
  //       int64 amount;
  //   };
  //
  // ===========================================================================
  xdr.struct("SimplePaymentResult", [["destination", xdr.lookup("AccountId")], ["currency", xdr.lookup("Currency")], ["amount", xdr.lookup("Int64")]]);

  // === xdr source ============================================================
  //
  //   struct PaymentSuccessMultiResult
  //   {
  //       ClaimOfferAtom offers<>;
  //       SimplePaymentResult last;
  //   };
  //
  // ===========================================================================
  xdr.struct("PaymentSuccessMultiResult", [["offers", xdr.varArray(xdr.lookup("ClaimOfferAtom"), 2147483647)], ["last", xdr.lookup("SimplePaymentResult")]]);

  // === xdr source ============================================================
  //
  //   union PaymentResult switch (PaymentResultCode code)
  //   {
  //   case PAYMENT_SUCCESS:
  //       void;
  //   case PAYMENT_SUCCESS_MULTI:
  //       PaymentSuccessMultiResult multi;
  //   default:
  //       void;
  //   };
  //
  // ===========================================================================
  xdr.union("PaymentResult", {
    switchOn: xdr.lookup("PaymentResultCode"),
    switchName: "code",
    switches: {
      paymentSuccess: xdr["void"](),
      paymentSuccessMulti: "multi" },
    arms: {
      multi: xdr.lookup("PaymentSuccessMultiResult") },
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum CreateOfferResultCode
  //   {
  //       // codes considered as "success" for the operation
  //       CREATE_OFFER_SUCCESS = 0,
  //  
  //       // codes considered as "failure" for the operation
  //       CREATE_OFFER_NO_TRUST = 1,       // can't hold what it's buying
  //       CREATE_OFFER_NOT_AUTHORIZED = 2, // not authorized to hold what it's buying
  //       CREATE_OFFER_LINE_FULL = 3,      // can't receive more of what it's buying
  //       CREATE_OFFER_MALFORMED = 4,      // generated offer would be invalid
  //       CREATE_OFFER_UNDERFUNDED = 5,    // doesn't hold what it's trying to sell
  //       CREATE_OFFER_CROSS_SELF = 6,     // would cross an offer from the same user
  //  
  //       // update errors
  //       CREATE_OFFER_NOT_FOUND = 7, // offerID does not match an existing offer
  //       CREATE_OFFER_MISMATCH = 8,  // currencies don't match offer
  //  
  //       CREATE_OFFER_LOW_RESERVE = 9 // not enough funds to create a new Offer
  //  
  //   };
  //
  // ===========================================================================
  xdr["enum"]("CreateOfferResultCode", {
    createOfferSuccess: 0,
    createOfferNoTrust: 1,
    createOfferNotAuthorized: 2,
    createOfferLineFull: 3,
    createOfferMalformed: 4,
    createOfferUnderfunded: 5,
    createOfferCrossSelf: 6,
    createOfferNotFound: 7,
    createOfferMismatch: 8,
    createOfferLowReserve: 9 });

  // === xdr source ============================================================
  //
  //   enum CreateOfferEffect
  //   {
  //       CREATE_OFFER_CREATED = 0,
  //       CREATE_OFFER_UPDATED = 1,
  //       CREATE_OFFER_DELETED = 2
  //   };
  //
  // ===========================================================================
  xdr["enum"]("CreateOfferEffect", {
    createOfferCreated: 0,
    createOfferUpdated: 1,
    createOfferDeleted: 2 });

  // === xdr source ============================================================
  //
  //   union switch (CreateOfferEffect effect)
  //       {
  //       case CREATE_OFFER_CREATED:
  //       case CREATE_OFFER_UPDATED:
  //           OfferEntry offer;
  //       default:
  //           void;
  //       }
  //
  // ===========================================================================
  xdr.union("CreateOfferSuccessResultOffer", {
    switchOn: xdr.lookup("CreateOfferEffect"),
    switchName: "effect",
    switches: {
      createOfferCreated: "offer",
      createOfferUpdated: "offer" },
    arms: {
      offer: xdr.lookup("OfferEntry") },
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   struct CreateOfferSuccessResult
  //   {
  //       // offers that got claimed while creating this offer
  //       ClaimOfferAtom offersClaimed<>;
  //  
  //       union switch (CreateOfferEffect effect)
  //       {
  //       case CREATE_OFFER_CREATED:
  //       case CREATE_OFFER_UPDATED:
  //           OfferEntry offer;
  //       default:
  //           void;
  //       }
  //       offer;
  //   };
  //
  // ===========================================================================
  xdr.struct("CreateOfferSuccessResult", [["offersClaimed", xdr.varArray(xdr.lookup("ClaimOfferAtom"), 2147483647)], ["offer", xdr.lookup("CreateOfferSuccessResultOffer")]]);

  // === xdr source ============================================================
  //
  //   union CreateOfferResult switch (CreateOfferResultCode code)
  //   {
  //   case CREATE_OFFER_SUCCESS:
  //       CreateOfferSuccessResult success;
  //   default:
  //       void;
  //   };
  //
  // ===========================================================================
  xdr.union("CreateOfferResult", {
    switchOn: xdr.lookup("CreateOfferResultCode"),
    switchName: "code",
    switches: {
      createOfferSuccess: "success" },
    arms: {
      success: xdr.lookup("CreateOfferSuccessResult") },
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum SetOptionsResultCode
  //   {
  //       // codes considered as "success" for the operation
  //       SET_OPTIONS_SUCCESS = 0,
  //       // codes considered as "failure" for the operation
  //       SET_OPTIONS_LOW_RESERVE = 1,      // not enough funds to add a signer
  //       SET_OPTIONS_TOO_MANY_SIGNERS = 2, // max number of signers already reached
  //       SET_OPTIONS_BAD_FLAGS = 3         // invalid combination of clear/set flags
  //   };
  //
  // ===========================================================================
  xdr["enum"]("SetOptionsResultCode", {
    setOptionsSuccess: 0,
    setOptionsLowReserve: 1,
    setOptionsTooManySigner: 2,
    setOptionsBadFlag: 3 });

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
    switches: {
      setOptionsSuccess: xdr["void"]() },
    arms: {},
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum ChangeTrustResultCode
  //   {
  //       // codes considered as "success" for the operation
  //       CHANGE_TRUST_SUCCESS = 0,
  //       // codes considered as "failure" for the operation
  //       CHANGE_TRUST_NO_ISSUER = 1,     // could not find issuer
  //       CHANGE_TRUST_INVALID_LIMIT = 2, // cannot drop limit below balance
  //       CHANGE_TRUST_LOW_RESERVE = 3 // not enough funds to create a new trust line
  //   };
  //
  // ===========================================================================
  xdr["enum"]("ChangeTrustResultCode", {
    changeTrustSuccess: 0,
    changeTrustNoIssuer: 1,
    changeTrustInvalidLimit: 2,
    changeTrustLowReserve: 3 });

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
    switches: {
      changeTrustSuccess: xdr["void"]() },
    arms: {},
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum AllowTrustResultCode
  //   {
  //       // codes considered as "success" for the operation
  //       ALLOW_TRUST_SUCCESS = 0,
  //       // codes considered as "failure" for the operation
  //       ALLOW_TRUST_MALFORMED = 1,         // currency is not ISO4217
  //       ALLOW_TRUST_NO_TRUST_LINE = 2,     // trustor does not have a trustline
  //       ALLOW_TRUST_TRUST_NOT_REQUIRED = 3 // source account does not require trust
  //   };
  //
  // ===========================================================================
  xdr["enum"]("AllowTrustResultCode", {
    allowTrustSuccess: 0,
    allowTrustMalformed: 1,
    allowTrustNoTrustLine: 2,
    allowTrustTrustNotRequired: 3 });

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
    switches: {
      allowTrustSuccess: xdr["void"]() },
    arms: {},
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum AccountMergeResultCode
  //   {
  //       // codes considered as "success" for the operation
  //       ACCOUNT_MERGE_SUCCESS = 0,
  //       // codes considered as "failure" for the operation
  //       ACCOUNT_MERGE_MALFORMED = 1,  // can't merge onto itself
  //       ACCOUNT_MERGE_NO_ACCOUNT = 2, // destination does not exist
  //       ACCOUNT_MERGE_HAS_CREDIT = 3, // account has active trust lines
  //       ACCOUNT_MERGE_CREDIT_HELD = 4 // an issuer cannot be merged if used
  //   };
  //
  // ===========================================================================
  xdr["enum"]("AccountMergeResultCode", {
    accountMergeSuccess: 0,
    accountMergeMalformed: 1,
    accountMergeNoAccount: 2,
    accountMergeHasCredit: 3,
    accountMergeCreditHeld: 4 });

  // === xdr source ============================================================
  //
  //   union AccountMergeResult switch (AccountMergeResultCode code)
  //   {
  //   case ACCOUNT_MERGE_SUCCESS:
  //       void;
  //   default:
  //       void;
  //   };
  //
  // ===========================================================================
  xdr.union("AccountMergeResult", {
    switchOn: xdr.lookup("AccountMergeResultCode"),
    switchName: "code",
    switches: {
      accountMergeSuccess: xdr["void"]() },
    arms: {},
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum InflationResultCode
  //   {
  //       // codes considered as "success" for the operation
  //       INFLATION_SUCCESS = 0,
  //       // codes considered as "failure" for the operation
  //       INFLATION_NOT_TIME = 1
  //   };
  //
  // ===========================================================================
  xdr["enum"]("InflationResultCode", {
    inflationSuccess: 0,
    inflationNotTime: 1 });

  // === xdr source ============================================================
  //
  //   struct inflationPayout // or use PaymentResultAtom to limit types?
  //   {
  //       AccountID destination;
  //       int64 amount;
  //   };
  //
  // ===========================================================================
  xdr.struct("InflationPayout", [["destination", xdr.lookup("AccountId")], ["amount", xdr.lookup("Int64")]]);

  // === xdr source ============================================================
  //
  //   union InflationResult switch (InflationResultCode code)
  //   {
  //   case INFLATION_SUCCESS:
  //       inflationPayout payouts<>;
  //   default:
  //       void;
  //   };
  //
  // ===========================================================================
  xdr.union("InflationResult", {
    switchOn: xdr.lookup("InflationResultCode"),
    switchName: "code",
    switches: {
      inflationSuccess: "payouts" },
    arms: {
      payouts: xdr.varArray(xdr.lookup("InflationPayout"), 2147483647) },
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum OperationResultCode
  //   {
  //       opINNER = 0, // inner object result is valid
  //  
  //       opBAD_AUTH = 1,  // not enough signatures to perform operation
  //       opNO_ACCOUNT = 2 // source account was not found
  //   };
  //
  // ===========================================================================
  xdr["enum"]("OperationResultCode", {
    opInner: 0,
    opBadAuth: 1,
    opNoAccount: 2 });

  // === xdr source ============================================================
  //
  //   union switch (OperationType type)
  //       {
  //       case PAYMENT:
  //           PaymentResult paymentResult;
  //       case CREATE_OFFER:
  //           CreateOfferResult createOfferResult;
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
  //       }
  //
  // ===========================================================================
  xdr.union("OperationResultTr", {
    switchOn: xdr.lookup("OperationType"),
    switchName: "type",
    switches: {
      payment: "paymentResult",
      createOffer: "createOfferResult",
      setOption: "setOptionsResult",
      changeTrust: "changeTrustResult",
      allowTrust: "allowTrustResult",
      accountMerge: "accountMergeResult",
      inflation: "inflationResult" },
    arms: {
      paymentResult: xdr.lookup("PaymentResult"),
      createOfferResult: xdr.lookup("CreateOfferResult"),
      setOptionsResult: xdr.lookup("SetOptionsResult"),
      changeTrustResult: xdr.lookup("ChangeTrustResult"),
      allowTrustResult: xdr.lookup("AllowTrustResult"),
      accountMergeResult: xdr.lookup("AccountMergeResult"),
      inflationResult: xdr.lookup("InflationResult") } });

  // === xdr source ============================================================
  //
  //   union OperationResult switch (OperationResultCode code)
  //   {
  //   case opINNER:
  //       union switch (OperationType type)
  //       {
  //       case PAYMENT:
  //           PaymentResult paymentResult;
  //       case CREATE_OFFER:
  //           CreateOfferResult createOfferResult;
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
    switches: {
      opInner: "tr" },
    arms: {
      tr: xdr.lookup("OperationResultTr") },
    defaultArm: "void" });

  // === xdr source ============================================================
  //
  //   enum TransactionResultCode
  //   {
  //       txSUCCESS = 0, // all operations succeeded
  //  
  //       txDUPLICATE = 1, // transaction was already submited
  //  
  //       txFAILED = 2, // one of the operations failed (but none were applied)
  //  
  //       txBAD_LEDGER = 3,        // ledger is not in range [minLeder; maxLedger]
  //       txMISSING_OPERATION = 4, // no operation was specified
  //       txBAD_SEQ = 5,           // sequence number does not match source account
  //  
  //       txBAD_AUTH = 6,             // not enough signatures to perform transaction
  //       txINSUFFICIENT_BALANCE = 7, // fee would bring account below reserve
  //       txNO_ACCOUNT = 8,           // source account not found
  //       txINSUFFICIENT_FEE = 9,     // max fee is too small
  //       txBAD_AUTH_EXTRA = 10,      // too many signatures on transaction
  //       txINTERNAL_ERROR = 0xFFFFFFFF // an unknown error occured
  //   };
  //
  // ===========================================================================
  xdr["enum"]("TransactionResultCode", {
    txSuccess: 0,
    txDuplicate: 1,
    txFailed: 2,
    txBadLedger: 3,
    txMissingOperation: 4,
    txBadSeq: 5,
    txBadAuth: 6,
    txInsufficientBalance: 7,
    txNoAccount: 8,
    txInsufficientFee: 9,
    txBadAuthExtra: 10,
    txInternalError: -1 });

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
    switches: {
      txSuccess: "results",
      txFailed: "results" },
    arms: {
      results: xdr.varArray(xdr.lookup("OperationResult"), 2147483647) },
    defaultArm: "void" });

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
  //   };
  //
  // ===========================================================================
  xdr.struct("TransactionResult", [["feeCharged", xdr.lookup("Int64")], ["result", xdr.lookup("TransactionResultResult")]]);

  // === xdr source ============================================================
  //
  //   typedef opaque uint512[64];
  //
  // ===========================================================================
  xdr.typedef("Uint512", xdr.opaque(64));

  // === xdr source ============================================================
  //
  //   typedef opaque uint256[32];
  //
  // ===========================================================================
  xdr.typedef("Uint256", xdr.opaque(32));

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
  //   typedef opaque AccountID[32];
  //
  // ===========================================================================
  xdr.typedef("AccountId", xdr.opaque(32));

  // === xdr source ============================================================
  //
  //   typedef opaque Signature[64];
  //
  // ===========================================================================
  xdr.typedef("Signature", xdr.opaque(64));

  // === xdr source ============================================================
  //
  //   typedef opaque Hash[32];
  //
  // ===========================================================================
  xdr.typedef("Hash", xdr.opaque(32));

  // === xdr source ============================================================
  //
  //   typedef opaque Thresholds[4];
  //
  // ===========================================================================
  xdr.typedef("Thresholds", xdr.opaque(4));

  // === xdr source ============================================================
  //
  //   typedef uint64 SequenceNumber;
  //
  // ===========================================================================
  xdr.typedef("SequenceNumber", xdr.lookup("Uint64"));

  // === xdr source ============================================================
  //
  //   enum CurrencyType
  //   {
  //       NATIVE = 0,
  //       ISO4217 = 1
  //   };
  //
  // ===========================================================================
  xdr["enum"]("CurrencyType", {
    native: 0,
    iso4217: 1 });

  // === xdr source ============================================================
  //
  //   struct ISOCurrencyIssuer
  //   {
  //       opaque currencyCode[4];
  //       AccountID issuer;
  //   };
  //
  // ===========================================================================
  xdr.struct("IsoCurrencyIssuer", [["currencyCode", xdr.opaque(4)], ["issuer", xdr.lookup("AccountId")]]);

  // === xdr source ============================================================
  //
  //   union Currency switch (CurrencyType type)
  //   {
  //   case NATIVE:
  //       void;
  //  
  //   case ISO4217:
  //       ISOCurrencyIssuer isoCI;
  //  
  //       // add other currency types here in the future
  //   };
  //
  // ===========================================================================
  xdr.union("Currency", {
    switchOn: xdr.lookup("CurrencyType"),
    switchName: "type",
    switches: {
      native: xdr["void"](),
      iso4217: "isoCi" },
    arms: {
      isoCi: xdr.lookup("IsoCurrencyIssuer") } });

  // === xdr source ============================================================
  //
  //   struct Price
  //   {
  //       int32 n; // numerator
  //       int32 d; // denominator
  //   };
  //
  // ===========================================================================
  xdr.struct("Price", [["n", xdr.lookup("Int32")], ["d", xdr.lookup("Int32")]]);
});
module.exports = types;