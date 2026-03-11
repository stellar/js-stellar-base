import xdr from "./xdr.js";
export interface WasmCreateDetails {
    hash: string;
    address: string;
    salt: string;
    constructorArgs?: any[];
}
/**
 * Details about a contract creation invocation.
 *
 * @prop type - a type indicating if this creation was a custom
 *    contract (`'wasm'`) or a wrapping of an existing Stellar asset (`'sac'`)
 * @prop asset - when `type=='sac'`, the canonical {@link Asset} that
 *    is being wrapped by this Stellar Asset Contract
 * @prop wasm - when `type=='wasm'`, additional creation parameters
 */
export interface CreateInvocation {
    type: "sac" | "wasm";
    asset?: string;
    wasm?: WasmCreateDetails;
}
/**
 * Details about a contract function execution invocation.
 *
 * @prop source - the strkey of the contract (C...) being invoked
 * @prop function - the name of the function being invoked
 * @prop args - the natively-represented parameters to the function
 *    invocation (see {@link scValToNative} for rules on how they're
 *    represented as JS types)
 */
export interface ExecuteInvocation {
    source: string;
    function: string;
    args: any[];
}
/**
 * A node in the invocation tree.
 *
 * @prop type - the type of invocation occurring, either
 *    contract creation or host function execution
 * @prop args - the parameters to the invocation, depending on the type
 * @prop invocations - any sub-invocations that (may) occur
 *    as a result of this invocation (i.e. a tree of call stacks)
 */
export interface InvocationTree {
    type: "create" | "execute";
    args: CreateInvocation | ExecuteInvocation;
    invocations: InvocationTree[];
}
/**
 * A callback used when walking an invocation tree.
 *
 * @param node - the currently explored node
 * @param depth - the depth of the tree this node is occurring at (the
 *    root starts at a depth of 1)
 * @param parent - this node's parent node, if any (i.e. this doesn't
 *    exist at the root)
 * @returns returning exactly `false` is a hint to stop exploring,
 *    other values are ignored
 */
export type InvocationWalker = (node: xdr.SorobanAuthorizedInvocation, depth: number, parent?: xdr.SorobanAuthorizedInvocation) => boolean | null | void;
/**
 * Turns a raw invocation tree into a human-readable format.
 *
 * This is designed to make the invocation tree easier to understand in order to
 * inform users about the side-effects of their contract calls. This will help
 * make informed decisions about whether or not a particular invocation will
 * result in what you expect it to.
 *
 * @param root - the raw XDR of the invocation,
 *    likely acquired from transaction simulation. this is either from the
 *    {@link Operation.invokeHostFunction} itself (the `func` field), or from
 *    the authorization entries ({@link xdr.SorobanAuthorizationEntry}, the
 *    `rootInvocation` field)
 *
 * @returns a human-readable version of the invocation tree
 *
 * @example
 * Here, we show a browser modal after simulating an arbitrary transaction,
 * `tx`, which we assume has an `Operation.invokeHostFunction` inside of it:
 *
 * ```typescript
 * import { Server, buildInvocationTree } from '@stellar/stellar-sdk';
 *
 * const s = new Server("fill in accordingly");
 *
 * s.simulateTransaction(tx).then(
 *  (resp: SorobanRpc.SimulateTransactionResponse) => {
 *    if (SorobanRpc.isSuccessfulSim(resp) && ) {
 *      // bold assumption: there's a valid result with an auth entry
 *      alert(
 *        "You are authorizing the following invocation:\n" +
 *        JSON.stringify(
 *          buildInvocationTree(resp.result!.auth[0].rootInvocation()),
 *          null,
 *          2
 *        )
 *      );
 *    }
 *  }
 * );
 * ```
 */
export declare function buildInvocationTree(root: xdr.SorobanAuthorizedInvocation): InvocationTree;
/**
 * Executes a callback function on each node in the tree until stopped.
 *
 * Nodes are walked in a depth-first order. Returning `false` from the callback
 * stops further depth exploration at that node, but it does not stop the walk
 * in a "global" view.
 *
 * @param root - the tree to explore
 * @param callback - the callback to execute for each node
 */
export declare function walkInvocationTree(root: xdr.SorobanAuthorizedInvocation, callback: InvocationWalker): void;
