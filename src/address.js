import { StrKey } from './strkey';
import xdr from './xdr';

/**
 * Create a new Address object.
 *
 * `Address` represents a single address in the Stellar network that can be
 * inputted to or outputted by a smart contract. An address can represent an
 * account, muxed account, contract, muxed contract, claimable balance, or a
 * liquidity pool (the latter two can only be present as the *output* of Core
 * in the form of an event, never an input to a smart contract).
 *
 * Muxed-contract addresses (CAP-0084) have no canonical StrKey yet, so they
 * cannot be constructed from a string; build them with
 * {@link Address.muxedContract} or {@link Address.fromScAddress}.
 *
 * @constructor
 *
 * @param {string} address - a {@link StrKey} of the address value
 */
export class Address {
  constructor(address) {
    if (StrKey.isValidEd25519PublicKey(address)) {
      this._type = 'account';
      this._key = StrKey.decodeEd25519PublicKey(address);
    } else if (StrKey.isValidContract(address)) {
      this._type = 'contract';
      this._key = StrKey.decodeContract(address);
    } else if (StrKey.isValidMed25519PublicKey(address)) {
      this._type = 'muxedAccount';
      this._key = StrKey.decodeMed25519PublicKey(address);
    } else if (StrKey.isValidClaimableBalance(address)) {
      this._type = 'claimableBalance';
      this._key = StrKey.decodeClaimableBalance(address);
    } else if (StrKey.isValidLiquidityPool(address)) {
      this._type = 'liquidityPool';
      this._key = StrKey.decodeLiquidityPool(address);
    } else {
      throw new Error(`Unsupported address type: ${address}`);
    }
  }

  /**
   * Parses a string and returns an Address object.
   *
   * @param {string} address - The address to parse. ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`
   * @returns {Address}
   */
  static fromString(address) {
    return new Address(address);
  }

  /**
   * Creates a new account Address object from a buffer of raw bytes.
   *
   * @param {Buffer} buffer - The bytes of an address to parse.
   * @returns {Address}
   */
  static account(buffer) {
    return new Address(StrKey.encodeEd25519PublicKey(buffer));
  }

  /**
   * Creates a new contract Address object from a buffer of raw bytes.
   *
   * @param {Buffer} buffer - The bytes of an address to parse.
   * @returns {Address}
   */
  static contract(buffer) {
    return new Address(StrKey.encodeContract(buffer));
  }

  /**
   * Creates a new claimable balance Address object from a buffer of raw bytes.
   *
   * @param {Buffer} buffer - The bytes of a claimable balance ID to parse.
   * @returns {Address}
   */
  static claimableBalance(buffer) {
    return new Address(StrKey.encodeClaimableBalance(buffer));
  }

  /**
   * Creates a new liquidity pool Address object from a buffer of raw bytes.
   *
   * @param {Buffer} buffer - The bytes of an LP ID to parse.
   * @returns {Address}
   */
  static liquidityPool(buffer) {
    return new Address(StrKey.encodeLiquidityPool(buffer));
  }

  /**
   * Creates a new muxed account Address object from a buffer of raw bytes.
   *
   * @param {Buffer} buffer - The bytes of an address to parse.
   * @returns {Address}
   */
  static muxedAccount(buffer) {
    return new Address(StrKey.encodeMed25519PublicKey(buffer));
  }

  /**
   * Creates a new muxed-contract Address object (CAP-0084).
   *
   * A muxed-contract address (`SC_ADDRESS_TYPE_MUXED_CONTRACT`) pairs a
   * 32-byte contract ID with a `uint64` multiplexing ID. There is no canonical
   * StrKey form for it yet, so unlike the other factories it does not route
   * through the {@link Address} constructor and the resulting address cannot be
   * parsed back out of a string. Round-trip it through {@link Address.fromScAddress}
   * / {@link Address#toScAddress} instead; {@link Address#toString} renders the
   * display-only form `<C-strkey>:<id>`.
   *
   * @param {Buffer} contractId - the raw 32 bytes of the contract ID
   * @param {number|bigint|string|xdr.Uint64} id - the uint64 multiplexing ID;
   *     pass a string or {@link xdr.Uint64} for values above
   *     `Number.MAX_SAFE_INTEGER` to avoid precision loss
   * @returns {Address}
   */
  static muxedContract(contractId, id) {
    const address = Object.create(Address.prototype);
    address._type = 'muxedContract';
    address._key = Buffer.from(contractId);
    address._muxId = id instanceof xdr.Uint64 ? id : new xdr.Uint64(id);
    return address;
  }

  /**
   * Convert this from an xdr.ScVal type.
   *
   * @param {xdr.ScVal} scVal - The xdr.ScVal type to parse
   * @returns {Address}
   */
  static fromScVal(scVal) {
    return Address.fromScAddress(scVal.address());
  }

  /**
   * Convert this from an xdr.ScAddress type
   *
   * @param {xdr.ScAddress} scAddress - The xdr.ScAddress type to parse
   * @returns {Address}
   */
  static fromScAddress(scAddress) {
    switch (scAddress.switch().value) {
      case xdr.ScAddressType.scAddressTypeAccount().value:
        return Address.account(scAddress.accountId().ed25519());
      case xdr.ScAddressType.scAddressTypeContract().value:
        return Address.contract(scAddress.contractId());
      case xdr.ScAddressType.scAddressTypeMuxedAccount().value: {
        const raw = Buffer.concat([
          scAddress.muxedAccount().ed25519(),
          scAddress.muxedAccount().id().toXDR('raw')
        ]);
        return Address.muxedAccount(raw);
      }
      case xdr.ScAddressType.scAddressTypeClaimableBalance().value: {
        const cbi = scAddress.claimableBalanceId();
        return Address.claimableBalance(
          Buffer.concat([Buffer.from([cbi.switch().value]), cbi.v0()])
        );
      }
      case xdr.ScAddressType.scAddressTypeLiquidityPool().value:
        return Address.liquidityPool(scAddress.liquidityPoolId());
      // CAP-0084 muxed contract addresses are gated to the `next` channel:
      // `scAddressTypeMuxedContract` is absent from the `curr` codec, so guard
      // the case label with optional chaining (it resolves to `undefined` and
      // never matches a real switch value when the arm is not defined).
      case xdr.ScAddressType.scAddressTypeMuxedContract?.()?.value: {
        const muxed = scAddress.muxedContract();
        return Address.muxedContract(muxed.contractId(), muxed.id());
      }
      default:
        throw new Error(`Unsupported address type: ${scAddress.switch().name}`);
    }
  }

  /**
   * Serialize an address to string.
   *
   * @returns {string}
   */
  toString() {
    switch (this._type) {
      case 'account':
        return StrKey.encodeEd25519PublicKey(this._key);
      case 'contract':
        return StrKey.encodeContract(this._key);
      case 'claimableBalance':
        return StrKey.encodeClaimableBalance(this._key);
      case 'liquidityPool':
        return StrKey.encodeLiquidityPool(this._key);
      case 'muxedAccount':
        return StrKey.encodeMed25519PublicKey(this._key);
      case 'muxedContract':
        // Display-only form `<C-strkey>:<id>`. This is NOT a canonical StrKey:
        // the Address constructor cannot parse it back, so muxed-contract
        // addresses round-trip via ScAddress/ScVal, not via this string.
        return `${StrKey.encodeContract(this._key)}:${this._muxId.toString()}`;
      default:
        throw new Error('Unsupported address type');
    }
  }

  /**
   * Convert this Address to an xdr.ScVal type.
   *
   * @returns {xdr.ScVal}
   */
  toScVal() {
    return xdr.ScVal.scvAddress(this.toScAddress());
  }

  /**
   * Convert this Address to an xdr.ScAddress type.
   *
   * @returns {xdr.ScAddress}
   */
  toScAddress() {
    switch (this._type) {
      case 'account':
        return xdr.ScAddress.scAddressTypeAccount(
          xdr.PublicKey.publicKeyTypeEd25519(this._key)
        );
      case 'contract':
        return xdr.ScAddress.scAddressTypeContract(this._key);
      case 'liquidityPool':
        return xdr.ScAddress.scAddressTypeLiquidityPool(this._key);

      case 'claimableBalance':
        return xdr.ScAddress.scAddressTypeClaimableBalance(
          new xdr.ClaimableBalanceId(
            `claimableBalanceIdTypeV${this._key.at(0)}`, // future-proof for cb v1
            this._key.subarray(1)
          )
        );

      case 'muxedAccount':
        return xdr.ScAddress.scAddressTypeMuxedAccount(
          new xdr.MuxedEd25519Account({
            ed25519: this._key.subarray(0, 32),
            id: xdr.Uint64.fromXDR(this._key.subarray(32, 40), 'raw')
          })
        );

      case 'muxedContract':
        return xdr.ScAddress.scAddressTypeMuxedContract(
          new xdr.MuxedContract({
            id: this._muxId,
            contractId: this._key
          })
        );

      default:
        throw new Error(`Unsupported address type: ${this._type}`);
    }
  }

  /**
   * Return the raw public key bytes for this address.
   *
   * @returns {Buffer}
   * @throws {Error} for muxed-contract addresses, which have no single-buffer
   *     encoding (use {@link Address#contractId} / {@link Address#muxedId})
   */
  toBuffer() {
    if (this._type === 'muxedContract') {
      throw new Error('toBuffer is not supported for muxed-contract addresses');
    }
    return this._key;
  }

  /**
   * For a muxed-contract address, returns the raw 32-byte contract ID.
   *
   * @returns {Buffer}
   * @throws {Error} if this is not a muxed-contract address
   */
  contractId() {
    if (this._type !== 'muxedContract') {
      throw new Error(
        'contractId() is only valid for muxed-contract addresses'
      );
    }
    return this._key;
  }

  /**
   * For a muxed-contract address, returns the `uint64` multiplexing ID.
   *
   * @returns {xdr.Uint64}
   * @throws {Error} if this is not a muxed-contract address
   */
  muxedId() {
    if (this._type !== 'muxedContract') {
      throw new Error('muxedId() is only valid for muxed-contract addresses');
    }
    return this._muxId;
  }
}
