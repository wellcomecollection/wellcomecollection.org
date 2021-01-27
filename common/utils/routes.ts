import { LinkProps } from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { PropsWithChildren } from 'react';
import { isInTuple } from './type-guards';

export type QueryParam = ParsedUrlQuery[string];
export type QueryTo<Props> = (query: ParsedUrlQuery) => Props;
export type LinkFrom<Props> = PropsWithChildren<Props> &
  Omit<LinkProps, 'as' | 'href'>;

function paramParser<T>(
  param: QueryParam,
  fs: {
    empty: (p: '') => T;
    string: (p: string) => T;
    array: (p: string[]) => T;
    nodef: () => T;
  }
): T {
  return param === ''
    ? fs.empty(param)
    : typeof param === 'string'
    ? fs.string(param)
    : Array.isArray(param)
    ? fs.array(param)
    : fs.nodef();
}

export function toCsv(param: QueryParam): string[] {
  // We use this because of some form submission hijacking that we do.
  // We have the convention that a string `key=a,b,c` is synonymous with `key=['a', 'b', 'c']`
  // in the API. Where we can, we will use links to make sure we use the CSV in the URL.
  // When submitting a form the convention for checkboxes/radios is `key=a&key=b`.
  // We don't see this with JS enabled, as we convert to a link, and use the Next Router,
  // but for non-js users, this works.
  return paramParser(param, {
    empty: () => [],
    string: p => p.split(','),
    array: p => p,
    nodef: () => [],
  });
}

export function toNumber(param: QueryParam, fallback: number): number {
  return paramParser(param, {
    empty: () => fallback,
    string: p => parseInt(p, 10) || fallback,
    array: p => parseInt(p[0], 10) || fallback,
    nodef: () => fallback,
  });
}

export function toMaybeNumber(param: QueryParam): undefined | number {
  return paramParser(param, {
    empty: () => undefined,
    string: p => parseInt(p, 10) || undefined,
    array: p => parseInt(p[0], 10) || undefined,
    nodef: () => undefined,
  });
}

export function toString(param: QueryParam, fallback: string): string {
  return paramParser(param, {
    empty: () => '',
    string: p => p,
    array: p => p.join(','),
    nodef: () => fallback,
  });
}

export function toMaybeString(param: QueryParam): undefined | string {
  return paramParser(param, {
    empty: () => undefined,
    string: p => p,
    array: p => p.join(','),
    nodef: () => undefined,
  });
}

export function toSource<T extends string>(
  param: QueryParam,
  sources: readonly T[]
): T | undefined {
  const val = toMaybeString(param);

  if (val && isInTuple(val, sources)) {
    return val;
  }
}
