import { ImageService, Service } from '@iiif/presentation-3';

/**
 * Whether a service is a version 2 image service. The library's
 * `ImageService` type covers both v2 and v3, so the value of `@type` is what
 * separates them: the spec's service table gives `ImageService2` as Image API
 * version 2, and tells clients to expect the `@id`/`@type` spellings from
 * older specifications alongside `id`/`type`. This is the check the viewer
 * has used in production all along.
 *
 * `@id` alone is not enough to identify one — the legacy auth services use
 * `@id` and `@type` too.
 * @see https://iiif.io/api/presentation/3.0/#table-service-types
 * @see https://iiif.io/api/image/2.1/
 */
export const isImageService2 = (service: Service): service is ImageService =>
  '@type' in service && service['@type'] === 'ImageService2';
