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
 * `usePublicNet` and `useTestNet` helper methods
 *
 */
export class Network {

	static useDefault() {
		this.usePublicNet();
	}

	static usePublicNet() {
		this.use(new Network(Networks.PUBLIC));
	}

	static useTestNet() {
		this.use(new Network(Networks.TESTNET));
	}

	static usePublicnet() {
		this.usePublicNet();
	}

	static useTestnet() {
		this.useTestNet();
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
