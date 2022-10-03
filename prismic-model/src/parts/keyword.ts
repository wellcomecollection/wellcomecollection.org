type Props = { placeholder: string };

/** This is a Key Text field in Prismic.
 *
 * Use this field for simple pieces of metadata, e.g. email addresses.
 * You can't free text search on it, only do an exact match.
 *
 * See https://prismic.io/docs/technologies/rich-text-title#what-are-the-rich-text-key-text-and-title-fields
 */
export default function (label: string, props?: Props) {
  return {
    type: 'Text',
    config: {
      label,
      placeholder: props?.placeholder,
    },
  };
}
