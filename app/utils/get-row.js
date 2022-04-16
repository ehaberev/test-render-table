import EmberObject from '@ember/object';

export default function getRow(
  receivedDate,
  pickUpAt,
  deliverTo,
  suggestedTruck,
  miles,
  matchCount,
  contactName,
  pinned,
  bids
) {
  return EmberObject.create({
    receivedDate,
    pickUpAt,
    deliverTo,
    suggestedTruck,
    miles,
    matchCount,
    contactName,
    pinned,
    bids,
  });
}
