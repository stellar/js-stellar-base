import type { xdr } from "./index.js";
interface SorobanEvent {
    type: "contract" | "diagnostic" | "system";
    contractId?: string;
    topics: any[];
    data: any;
}
/**
 * Converts raw diagnostic or contract events into something with a flatter,
 * human-readable, and understandable structure.
 *
 * Each element in the returned list has the following properties:
 *  - `type`: one of `'system'`, `'contract'`, `'diagnostic'`
 *  - `contractId`: optionally, a `C...` encoded strkey
 *  - `topics`: a list of {@link scValToNative} invocations on the topics
 *  - `data`: a {@link scValToNative} invocation on the raw event data
 *
 * @param events - either contract events or diagnostic events to parse into a
 *    friendly format
 */
export declare function humanizeEvents(events: xdr.ContractEvent[] | xdr.DiagnosticEvent[]): SorobanEvent[];
export {};
