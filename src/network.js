import {hash} from "./hashing";

export const Networks = {
	PUBLIC: "Public Global Stellar Network ; September 2015",
	TESTNET: "Test SDF Network ; September 2015",
};

var current;

/**
 * The Network class provides helper methods to get the passphrase or id for different
 * stellar networks.  It also provides the current() class method that returns the network
 * that will be used by this process for the purposes of generating signatures
 *
 * The public network is the default, but you can also override the default by using the `use`,
 * `usePublicNetwork` and `useTestNetwork` helper methods
 *
 */
export class Network {

	static useDefault() {
		this.useTestNetwork();
	}

	static usePublicNetwork() {
		this.use(new Network(Networks.PUBLIC));
	}

	/**
	 * Alias for `usePublicNetwork`.
	 * @deprecated Use `usePublicNetwork` method
	 */
	static usePublicNet() {
		this.usePublicNetwork();
	}

	static useTestNetwork() {
		this.use(new Network(Networks.TESTNET));
	}

	/**
	 * Alias for `useTestNetwork`.
	 * @deprecated Use `useTestNetwork` method
	 */
	static useTestNet() {
		this.useTestNetwork();
	}

	static use(network) {
		current = network;
	}

	static current() {
		return current;
	}

	constructor(networkPassphrase) {
		this._networkPassphrase = networkPassphrase;
	}

	networkPassphrase() {
		return this._networkPassphrase;
	}

	networkId() {
		return hash(this.networkPassphrase());
	}
}

Network.useDefault();
