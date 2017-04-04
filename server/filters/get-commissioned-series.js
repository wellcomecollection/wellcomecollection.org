export default function getCommissionedSeries(arr) {
  if (!arr.length) return;

  return arr.find((item) => item.commissionedLength);
}
