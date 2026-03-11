import { StrKey } from "./strkey.js";
import { scValToNative } from "./scval.js";
import { xdr } from "./index.js";

interface SorobanEvent {
  type: "contract" | "diagnostic" | "system";
  contractId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topics: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

/**
 * Converts raw diagnostic or contract events into something with a flatter,
 * human-readable, and understandable structure.
 *
 * @param events  either contract
 *    events or diagnostic events to parse into a friendly format
 *
 * @returns a list of human-readable event structures, where
 *    each element has the following properties:
 *  - type: a string of one of 'system', 'contract', 'diagnostic
 *  - contractId?: optionally, a `C...` encoded strkey
 *  - topics: a list of {@link scValToNative} invocations on the topics
 *  - data: similarly, a {@link scValToNative} invocation on the raw event data
 */
export function humanizeEvents(
  events: xdr.ContractEvent[] | xdr.DiagnosticEvent[]
): SorobanEvent[] {
  return events.map((e) => {
    // A pseudo-instanceof check for xdr.DiagnosticEvent more reliable
    // in mixed SDK environments:
    if ("inSuccessfulContractCall" in e) {
      return extractEvent(e.event());
    }

    return extractEvent(e);
  });
}

function extractEvent(event: xdr.ContractEvent): SorobanEvent {
  const contractId =
    typeof event.contractId === "function" ? event.contractId() : null;

  return {
    ...(contractId !== null &&
      contractId !== undefined && {
        contractId: StrKey.encodeContract(contractId as unknown as Buffer)
      }),
    type: event.type().name,
    topics: event
      .body()
      .value()
      .topics()
      .map((t: xdr.ScVal) => scValToNative(t)),
    data: scValToNative(event.body().value().data())
  };
}
