import { Asset } from './asset';
import { Account } from './account';
import { Network } from './network';
import { Keypair } from './keypair';
import { Memo } from './memo';
import { Operation } from './operation';
import { TransactionBuilder } from './transaction_builder';
/* jshint ignore:start */
export class Common {
  static sendTransaction({
    secret,
    destination,
    asset = Asset.native(),
    amount = 0,
    memo = '',
    testnet = false
  }) {
    if (testnet === true) {
      Network.useTestNetwork()
    } else {
      Network.usePublicNetwork();
    }
    const keypair = Keypair.fromSecret(secret);
    const account = new Account(keypair.publicKey(), '0');
    const transaction = new TransactionBuilder(account)
      .addOperation(Operation.payment({
        asset,
        destination,
        amount,
      }))
      .addMemo(Memo.text(memo))
      .build();
    transaction.sign(keypair);
    return transaction;
  }
}
/* jshint ignore:end */