export default function isEmptyDocLink(fragment: Object) {
  return fragment.link_type === 'Document' && !fragment.data;
}
