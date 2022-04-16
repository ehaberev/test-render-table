import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { A } from '@ember/array';
import { schedule, later, cancel } from '@ember/runloop';
import randomInt from '../utils/random-int';
import getRow from '../utils/get-row';
import moment from 'moment';

export default class BaseLogicController extends Controller {
  @tracked rows;
  @tracked startedLoading;
  @service store;

  IDS_TO_LOAD = [11808323, 11808321, 11808317, 11808313, 11808311, 11808309];

  initRows() {
    const plainArray = this.model
      .toArray()
      .map((order) =>
        getRow(
          order.receivedDate,
          order.pickUpAt,
          order.deliverTo,
          order.suggestedTruck,
          order.miles,
          order.matchCount,
          order.contactName,
          order.pinned,
          order.bids
        )
      );
    this.rows = A(plainArray);
    this.startedLoading = true;
  }

  @action
  toggleStartLoading() {
    if (this.startedLoading) {
      this._cancelTasks();
    } else {
      this._refreshData();
      this._refreshPinned();
      this._refreshUnPinned();
      this._refreshOrdersWithBids();
    }

    this.startedLoading = !this.startedLoading;
  }

  @action
  onClick() {
    alert('Clicked');
  }

  _refreshData() {
    let laterRefreshId = later(() => {
      const index = randomInt(0, 5);
      this.store
        .findRecord('order', this.IDS_TO_LOAD[index], { reload: true })
        .then((row) => {
          const newRow = getRow(
            new Date().toISOString(),
            row.pickUpAt,
            row.deliverTo,
            row.suggestedTruck,
            row.miles,
            row.matchCount,
            row.contactName,
            row.pinned,
            row.bids
          );

          if (newRow.pinned) {
            this._pinOrder(newRow, -1);
          } else {
            const indexToInsert = this._getPinnedCount();
            this.rows.insertAt(indexToInsert, newRow);
            this.rows.removeAt(this.rows.length - 1);
          }

          schedule('afterRender', () => {
            this._refreshData();
          });
        });
    }, randomInt(500, 2000));

    this.laterRefreshId = laterRefreshId;
  }

  _refreshPinned() {
    const laterPinId = later(() => {
      const orderToPinIndex = randomInt(
        this._getPinnedCount(),
        this.rows.length - 1
      );

      const order = this.rows.objectAt(orderToPinIndex);
      this._pinOrder(order, orderToPinIndex);
      schedule('afterRender', () => {
        this._refreshPinned();
      });
    }, randomInt(3000, 5000));

    this.laterPinId = laterPinId;
  }

  _refreshUnPinned() {
    const laterUnPinId = later(() => {
      const orderToUnPinIndex = randomInt(0, this._getPinnedCount() - 1);
      const order = this.rows.objectAt(orderToUnPinIndex);
      this._unPinOrder(order, orderToUnPinIndex);
      schedule('afterRender', () => {
        this._refreshUnPinned();
      });
    }, randomInt(3000, 6000));

    this.laterUnPinId = laterUnPinId;
  }

  _refreshOrdersWithBids() {
    const laterOrderWithBidsId = later(() => {
      const pinnedCount = this._getPinnedCount();
      const orderIndexToAddBid = randomInt(pinnedCount, this.rows.length - 1);
      this._addBidToOrder(orderIndexToAddBid);
      schedule('afterRender', () => {
        this._refreshOrdersWithBids();
      });
    }, 5000);

    this.laterOrderWithBidsId = laterOrderWithBidsId;
  }

  _getPinnedCount() {
    return this.rows.findIndex((currentRow) => !currentRow.pinned);
  }

  _unPinOrder(order, orderIndex) {
    const pinnedCount = this._getPinnedCount();
    const indexToMove = this.rows.findIndex((currentRow, index) => {
      if (index >= pinnedCount) {
        if (moment(currentRow.receivedDate).isBefore(order.receivedDate)) {
          return true;
        } else {
          if (index === this.rows.length - 1) {
            return true;
          }
        }
      }
    });

    this.rows.insertAt(indexToMove, order);
    this.rows.removeAt(orderIndex);
    order.set('pinned', false);
  }

  _pinOrder(order, orderIndex) {
    const pinnedCount = this._getPinnedCount();
    let indexToMove = 0;
    if (pinnedCount > 0) {
      indexToMove = this.rows.findIndex((currentRow, index) => {
        if (index < pinnedCount) {
          if (moment(currentRow.receivedDate).isBefore(order.receivedDate)) {
            return true;
          }
        }
      });

      if (indexToMove === -1) {
        indexToMove = pinnedCount;
      }
    }

    if (orderIndex > -1) {
      this.rows.removeAt(orderIndex);
    }

    this.rows.insertAt(indexToMove, order);
    order.set('pinned', true);
  }

  _addBidToOrder(orderIndexToAddBid) {
    const bidObject = {
      id: 76751,
      status: 1,
      dispatcher: {
        id: 55,
      },
      read: false,
      statusName: 'SUGGESTED',
      transitions: ['accept', 'reject', 'share'],
    };

    this.rows.objectAt(orderIndexToAddBid).set('bids', [bidObject]);
  }

  _cancelTasks() {
    cancel(this.laterRefreshId);
    cancel(this.laterUnPinId);
    cancel(this.laterPinId);
    cancel(this.laterOrderWithBidsId);
  }
}
