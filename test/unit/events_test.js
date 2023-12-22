const [nativeToScVal, scValToNative, ScInt, humanizeEvents, xdr] = [
  StellarBase.nativeToScVal,
  StellarBase.scValToNative,
  StellarBase.ScInt,
  StellarBase.humanizeEvents,
  StellarBase.xdr
]; // shorthand

describe('humanizing raw events', function () {
  const contractId = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
  const topics1 = nativeToScVal([1, 2, 3]).value();
  const data1 = nativeToScVal({ hello: 'world' });

  // workaround for xdr.ContractEventBody.0(...) being invalid lol
  const cloneAndSet = (newBody) => {
    const clone = new xdr.ContractEventBody(
      0, new xdr.ContractEventV0({
        topics: [],
        data: xdr.ScVal.scvVoid(),
      })
    );
    clone.v0().topics(newBody.topics);
    clone.v0().data(newBody.data);
    return clone;
  };

  const events = [
    new xdr.DiagnosticEvent({
      inSuccessfulContractCall: true,
      event: new xdr.ContractEvent({
        ext: new xdr.ExtensionPoint(0),
        contractId: StellarBase.StrKey.decodeContract(contractId),
        type: xdr.ContractEventType.contract(),
        body: cloneAndSet({
          topics: topics1,
          data: data1
        })
      })
    })
  ];

  it('built valid events for testing', function () {
    // sanity check: valid xdr
    events.map((e) => e.toXDR());
  });

  it('makes diagnostic events human-readable', function () {
    const readable = StellarBase.humanizeEvents(events);

    expect(readable.length).to.equal(events.length, `${events} != ${readable}`);
    expect(readable[0]).to.eql({
      type: 'contract',
      contractId: contractId,
      topics: topics1.map(scValToNative),
      data: scValToNative(data1)
    });
  });
});
