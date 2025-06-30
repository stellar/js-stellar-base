import { StrKey } from './strkey';
import xdr from './xdr';

/**
 * Create a new Address object.
 *
 * `Address` represents a single address in the Stellar network that can be
 * inputted to or outputted by a smart contract. An address can represent an
 * account, muxed account, contract, claimable balance, or a liquidity pool
 * (the latter two can only be present as the *output* of Core in the form
 * of an event, never an input to a smart contract).
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
      case xdr.ScAddressType.scAddressTypeMuxedAccount().value:
        return Address.muxedAccount(scAddress.muxedAccount());
      case xdr.ScAddressType.scAddressTypeClaimableBalance().value:
        return Address.claimableBalance(scAddress.claimableBalanceId());
      case xdr.ScAddressType.scAddressTypeLiquidityPool().value:
        return Address.liquidityPool(scAddress.liquidityPoolId());
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
        const idType = this._key.at(0);
        return xdr.ScAddress.scAddressTypeClaimableBalance(
          new xdr.ClaimableBalanceId(
            `claimableBalanceIdTypeV${idType}`, // future-proof for cb v1
            this._key.subarray(1)
          )
        );

      case 'muxedAccount':
        return xdr.ScAddress.scAddressTypeMuxedAccount(
          xdr.MuxedEd25519Account.fromXDR(this._key)
        );

      default:
        throw new Error(`Unsupported address type: ${this._type}`);
    }
  }

  /**
   * Return the raw public key bytes for this address.
   *
   * @returns {Buffer}
   */
  toBuffer() {
    return this._key;
  }
}
