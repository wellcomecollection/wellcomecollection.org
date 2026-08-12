// Illustrates how the hand-written Work type relates to the generated OpenAPI
// schema types in ./generated/catalogue-api.d.ts. Compile-time only; nothing
// here exists at runtime.
import type { Work } from '.';
import type { components } from './generated/catalogue-api';

type GeneratedWork = components['schemas']['Work'];

// Scalar fields where the hand-written type already agrees with the schema.
type ScalarFieldsSharedWithSchema =
  | 'id'
  | 'title'
  | 'alternativeTitles'
  | 'referenceNumber'
  | 'description'
  | 'physicalDescription'
  | 'lettering'
  | 'edition'
  | 'duration'
  | 'currentFrequency'
  | 'formerFrequency'
  | 'designation';

// Fails to compile if T stops being assignable to U.
type AssertAssignable<T extends U, U> = [T, U];

export type HandwrittenWorkMatchesSchemaScalars = AssertAssignable<
  Pick<Work, ScalarFieldsSharedWithSchema>,
  Pick<GeneratedWork, ScalarFieldsSharedWithSchema>
>;

// Known drift, deliberately not asserted here yet:
//
// - `availableOnline` exists on the hand-written Work but is absent from the
//   schema; the API does not return it.
// - `totalParts` sits on the hand-written Work, but in the schema it is a
//   property of RelatedWork.
// - Structured fields (contributors, items, subjects, ...) use models from
//   @weco/common that have not been reconciled with the schema shapes.
//
// Reconciling these, and then widening the assertion above (ultimately to
// `AssertAssignable<Work, GeneratedWork>`), is the follow-up.
