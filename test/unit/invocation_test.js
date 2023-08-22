const {
  Keypair,
  StrKey,
  xdr,
  hash,
  Address,
  Contract,
  nativeToScVal,
  buildInvocationTree
} = StellarBase;

// Here's a complicated invocation tree whose pseudo-structure is supposed to
// represent a high-level contract interaction involving two transfers of native
// SAC tokens underneath it.
//
// Though this may feel contrived (because it is), it highlights the importance
// of presenting complex invocation trees in a friendly manner to users.
//
// purchase("SomeNft:G...", 7 xlm)
//     |
//     +--- swap(xlm, usdc, from, to)
//     |      |
//     |      |- xlm.transfer(from, to, 7)
//     |      |
//     |      |- usdc.transfer(to, from, 1)
//     |
//     +--- someNft.transfer(invoker, contract, 1)
function rk() {
  return Keypair.random().publicKey();
}

function makeInvocation(contract, name, ...args) {
  return xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
    new xdr.SorobanAuthorizedContractFunction({
      contractAddress: contract,
      functionName: name,
      args: args.map(nativeToScVal)
    })
  );
}

describe('parsing invocation trees', function () {
  const invoker = rk();
  const [nftContract, swapContract, xlmContract, usdcContract] = [
    1, 2, 3, 4
  ].map(() => {
    // ezpz method to generate random contract IDs
    const buf = hash(Keypair.random().publicKey());
    return new Contract(StrKey.encodeContract(buf)).address().toScAddress();
  });

  const rootInvocation = new xdr.SorobanAuthorizedInvocation({
    function: makeInvocation(nftContract, 'purchase', `SomeNft:${rk()}`, 7),
    subInvocations: [
      new xdr.SorobanAuthorizedInvocation({
        function: makeInvocation(
          swapContract,
          'swap',
          'native',
          `USDC:${rk()}`,
          new Address(invoker).toScVal(),
          new Address(rk()).toScVal()
        ),
        subInvocations: [
          new xdr.SorobanAuthorizedInvocation({
            function: makeInvocation(
              xlmContract,
              'transfer',
              new Address(invoker).toScVal(),
              '7'
            ),
            subInvocations: []
          }),
          new xdr.SorobanAuthorizedInvocation({
            function: makeInvocation(
              usdcContract,
              'transfer',
              new Address(invoker).toScVal(),
              '7'
            ),
            subInvocations: []
          })
        ]
      }),
      new xdr.SorobanAuthorizedInvocation({
        function: makeInvocation(
          nftContract,
          invoker,
          new Address(invoker).toScVal(), // should be nftContract but w/e
          1
        ),
        subInvocations: []
      })
    ]
  });

  it('builds an invocation tree', function () {
    expect(() => rootInvocation.toXDR()).not.to.throw(
      undefined,
      'the rootInvocation is not a valid SorobanAuthorizedInvocation instance'
    );
  });

  it('outputs a human-readable version of it', function () {
    console.log(JSON.stringify(rootInvocation, null, 2));
    console.log(JSON.stringify(buildInvocationTree(rootInvocation), (key, value) => {
      return (typeof value === 'bigint') ? value.toString() : value;
    }, 2));
  });
});
