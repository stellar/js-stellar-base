export const AuthRequiredFlag = 1;
export const AuthRevocableFlag = 2;
export const AuthImmutableFlag = 4;

export namespace AuthFlag {
  export type immutable = typeof AuthImmutableFlag;
  export type required = typeof AuthRequiredFlag;
  export type revocable = typeof AuthRevocableFlag;
}
export type AuthFlag =
  | AuthFlag.immutable
  | AuthFlag.required
  | AuthFlag.revocable;
