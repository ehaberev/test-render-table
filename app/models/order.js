import Model, { attr } from '@ember-data/model';

export default class OrderModel extends Model {
  @attr('date') receivedDate;
  @attr('string') pickUpAt;
  @attr('string') deliverTo;
  @attr('string') suggestedTruck;
  @attr('number') miles;
  @attr('number') matchCount;
  @attr('string') contactName;
  @attr('boolean') pinned;
  @attr() bids;
}
