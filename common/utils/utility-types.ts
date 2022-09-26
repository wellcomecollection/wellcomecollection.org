import { ComponentProps, FunctionComponent, ReactElement } from 'react';

/**
 * This will convert optional parameters in a type to required, but undefineable
 * e.g. { required: string, optional?: string } => { required: string, optional: string | undefined }
 * This is useful for when you want to expose the type,
 * but have the implementation express all properties if if the = undefined
 *
 * A nice read on why we need the `keyof never` to make it homomorphic
 * see: https://stackoverflow.com/questions/59790508/what-does-homomorphic-mapped-type-mean/59791889#59791889
 */
export type OptionalToUndefined<T> = {
  [P in keyof T & keyof never]: T[P];
};

/**
 * This allows us to take types such as:
 * { a: string, b : string | undefined }
 * and converts it into { a: string, b?: string | undefined }
 *
 * This is useful if you want a type where you don't have to specify
 * that a field is undefined
 *
 * type A = { a: undefined | string }
 * const a = { a: undefined } // valid
 * const aBoo = {  } // invalid
 *
 * type B = { a?: string }
 * const b = { a: undefined } // valid
 * const bYay = {  } // valid
 *
 * There might be a way to do this with conditional types,
 * I just couldn't find it.
 */
type RequiredProp<T> = {
  [P in keyof T]: undefined extends T[P] ? never : P;
}[keyof T];
// By undefinable we mean { prop: string | undefined }
// as opposed to optional { prop?: string }
type UndefinableProps<T> = {
  [P in keyof T]: undefined extends T[P] ? P : never;
}[keyof T];
export type UndefinableToOptional<T> = Flatten<
  {
    [P in RequiredProp<T>]: T[P];
  } & {
    [P in UndefinableProps<T>]?: T[P];
  }
>;

/**
 * Flattens / nornmalises types for easier readability in IDEs.
 * e.g. Flatten<{ a: string } & { b: string }>
 * { a: string, b: string }
 */
export type Flatten<T> = {
  [P in keyof T]: T[P];
};

/**
 * This allows you to specify a ReactElement of a certain type, and have access to it's props.
 * This replicates something similar to the flow example:
 * https://flow.org/en/docs/react/types/#toc-react-element
 *
 * Normally implemented as ElementFromComponent<typeof ImportedComponent>
 */

export type ElementFromComponent<C extends FunctionComponent> = ReactElement<
  ComponentProps<C>
>;

/** Allows you to set a string type that requires a certain prefix
 * e.g.
 * ```
 * type TMP = Prefix<'tmp/'>
 * const inTmp: TMP = 'tmp/bingo' // <= valid
 * const outTmp: TMP = 'tmpo/bongo' // <= error
 * ```
 */
export type Prefix<S extends string> = `${S}${string}`;
