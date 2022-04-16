import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class EmberTableRoute extends Route {
  @service store;

  model() {
    return this.store.query('order', {
      _page: 1,
      _limit: 100,
    });
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.initRows();
    controller._refreshData();
    controller._refreshPinned();
    controller._refreshUnPinned();
    controller._refreshOrdersWithBids();
  }

  resetController(controller, isExiting) {
    if (isExiting && controller.startedLoading) {
      controller._cancelTasks();
    }
  }
}
