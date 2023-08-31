const {
  Keypair,
  Asset,
  StrKey,
  xdr,
  hash,
  Address,
  Contract,
  nativeToScVal,
  buildInvocationTree,
  walkInvocationTree
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
//     +--- create(wrap: "SomeNft:G...")
//     |
//     +--- swap(xlm, usdc, from, to)
//     |      |
//     |      |- xlm.transfer(from, to, 7)
//     |      |
//     |      |- usdc.transfer(to, from, 1)
//     |
//     +--- someNft.transfer(invoker, someNft, 2)
//     |
//     +--- create(custom wasm contract)
function rk() {
  return Keypair.random().publicKey();
}

function makeInvocation(contract, name, ...args) {
  return xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
    new xdr.SorobanAuthorizedContractFunction({
      contractAddress: contract.address().toScAddress(),
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
    return new Contract(StrKey.encodeContract(buf));
  });

  const nftId = rk();
  const usdcId = rk();
  const dest = rk();
  const rootInvocation = new xdr.SorobanAuthorizedInvocation({
    function: makeInvocation(nftContract, 'purchase', `SomeNft:${nftId}`, 7),
    subInvocations: [
      new xdr.SorobanAuthorizedInvocation({
        function:
          xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeCreateContractHostFn(
            new xdr.CreateContractArgs({
              contractIdPreimage:
                xdr.ContractIdPreimage.contractIdPreimageFromAsset(
                  new Asset('TEST', nftId).toXDRObject()
                ),
              executable: xdr.ContractExecutable.contractExecutableToken()
            })
          ),
        subInvocations: []
      }),
      new xdr.SorobanAuthorizedInvocation({
        function: makeInvocation(
          swapContract,
          'swap',
          'native',
          `USDC:${usdcId}`,
          new Address(invoker).toScVal(),
          new Address(dest).toScVal()
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
              '1'
            ),
            subInvocations: []
          })
        ]
      }),
      new xdr.SorobanAuthorizedInvocation({
        function: makeInvocation(
          nftContract,
          'transfer',
          nftContract.address().toScVal(),
          '2'
        ),
        subInvocations: []
      }),
      new xdr.SorobanAuthorizedInvocation({
        function:
          xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeCreateContractHostFn(
            new xdr.CreateContractArgs({
              contractIdPreimage:
                xdr.ContractIdPreimage.contractIdPreimageFromAddress(
                  new xdr.ContractIdPreimageFromAddress({
                    address: nftContract.address().toScAddress(),
                    salt: Buffer.alloc(32, 0)
                  })
                ),
              executable: xdr.ContractExecutable.contractExecutableWasm(
                Buffer.alloc(32, '\x20')
              )
            })
          ),
        subInvocations: []
      })
    ]
  });

  const expectedParsed = {
    type: 'execute',
    args: {
      source: nftContract.contractId(),
      function: 'purchase',
      args: [`SomeNft:${nftId}`, '7']
    },
    invocations: [
      {
        type: 'create',
        args: {
          type: 'sac',
          asset: `TEST:${nftId}`
        },
        invocations: []
      },
      {
        type: 'execute',
        args: {
          source: swapContract.contractId(),
          function: 'swap',
          args: ['native', `USDC:${usdcId}`, invoker, dest]
        },
        invocations: [
          {
            type: 'execute',
            args: {
              source: xlmContract.contractId(),
              function: 'transfer',
              args: [invoker, '7']
            },
            invocations: []
          },
          {
            type: 'execute',
            args: {
              source: usdcContract.contractId(),
              function: 'transfer',
              args: [invoker, '1']
            },
            invocations: []
          }
        ]
      },
      {
        type: 'execute',
        args: {
          source: nftContract.contractId(),
          function: 'transfer',
          args: [nftContract.contractId(), '2']
        },
        invocations: []
      },

      {
        type: 'create',
        args: {
          type: 'wasm',
          wasm: {
            salt: '00'.repeat(32),
            hash: '20'.repeat(32),
            address: nftContract.contractId()
          }
        },
        invocations: []
      }
    ]
  };

  it('builds an invocation tree', function () {
    expect(() => rootInvocation.toXDR()).not.to.throw(
      undefined,
      'the rootInvocation is not a valid SorobanAuthorizedInvocation instance'
    );
  });

  it('outputs a human-readable version of it', function () {
    const parsed = buildInvocationTree(rootInvocation);
    expect(
      JSON.stringify(
        parsed,
        (_, val) => (typeof val === 'bigint' ? val.toString() : val),
        2
      )
    ).to.deep.equal(JSON.stringify(expectedParsed, null, 2));
  });

  it('walks correctly', function () {
    let walkCount = 0;
    let walkSet = {};
    let maxDepth = 0;

    walkInvocationTree(rootInvocation, (node, depth, parent) => {
      walkCount++;
      const s = node.toXDR('base64');
      walkSet[s] = s in walkSet ? walkSet[s] + 1 : 1;
      maxDepth = Math.max(maxDepth, depth);
      return true;
    });

    // 7 nodes walked, exactly once each
    expect(walkCount).to.equal(7, `${walkSet}`);
    expect(
      Object.values(walkSet).reduce((accum, curr) => accum + curr, 0)
    ).to.equal(7, `${walkSet}`);
    expect(Object.values(walkSet).every((val) => val !== 0)).to.be.true;
    expect(maxDepth).to.equal(3);
  });
});
