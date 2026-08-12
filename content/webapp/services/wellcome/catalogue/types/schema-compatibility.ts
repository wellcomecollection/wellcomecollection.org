// Illustrates how the hand-written catalogue types relate to the generated
// OpenAPI schema types in ./generated/catalogue-api.d.ts. Compile-time only;
// nothing here exists at runtime.
import type { Image, Work } from '.';
import type { components } from './generated/catalogue-api';

// Fails to compile if T stops being assignable to U.
type AssertAssignable<T extends U, U> = [T, U];

// Work

type GeneratedWork = components['schemas']['Work'];

// Scalar fields where the hand-written type already agrees with the schema.
type WorkScalarFieldsSharedWithSchema =
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

export type HandwrittenWorkMatchesSchemaScalars = AssertAssignable<
  Pick<Work, WorkScalarFieldsSharedWithSchema>,
  Pick<GeneratedWork, WorkScalarFieldsSharedWithSchema>
>;

// Known Work drift, deliberately not asserted here yet:
//
// - `availableOnline` exists on the hand-written Work but is absent from the
//   schema; the API does not return it.
// - `totalParts` sits on the hand-written Work, but in the schema it is a
//   property of RelatedWork.
// - Structured fields (contributors, items, subjects, ...) use models from
//   @weco/common that have not been reconciled with the schema shapes.

// Image

type GeneratedImage = components['schemas']['Image'];

type ImageScalarFieldsSharedWithSchema = 'id' | 'aspectRatio' | 'averageColor';

export type HandwrittenImageMatchesSchemaScalars = AssertAssignable<
  Pick<Image, ImageScalarFieldsSharedWithSchema>,
  Pick<GeneratedImage, ImageScalarFieldsSharedWithSchema>
>;

// Known Image drift, deliberately not asserted here yet:
//
// - `requestUrl` exists on the hand-written Image but is absent from the
//   schema; the API does not return it. It is populated client-side from the
//   `_requestUrl` that the fetch layer attaches to responses.
// - The hand-written inline `source` omits `genres`, `subjects` and
//   `languages`, which the schema's ImageSource documents.
// - `locations` and `thumbnail` use DigitalLocation from @weco/common, which
//   has not been reconciled with the schema shape.

// Reconciling the drift above, and then widening the assertions (ultimately
// to `AssertAssignable<Work, GeneratedWork>` and the Image equivalent), is
// the follow-up.
