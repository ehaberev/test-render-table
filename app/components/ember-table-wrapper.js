import Component from '@glimmer/component';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export default class EmberTableWrapperComponent extends Component {
  columns = [
    {
      name: `Received`,
      valuePath: `receivedDate`,
    },
    {
      name: `Pick-up at`,
      valuePath: `pickUpAt`,
    },
    {
      name: `Deliver to`,
      valuePath: `deliverTo`,
    },
    {
      name: `Vehicle`,
      valuePath: `suggestedTruck`,
    },
    {
      name: `Miles`,
      valuePath: `miles`,
    },
    {
      name: `Match`,
      valuePath: `matchCount`,
    },
    {
      name: `Brokerage`,
      valuePath: `contactName`,
    },
  ];

  @action
  setTableClasses(element) {
    schedule('afterRender', () => {
      element.querySelector('table').classList.add('MuiTable-root');
      element.querySelector('table').classList.add('jss222');
      element.querySelector('table').classList.add('jss203');
    });
  }

  @action
  onClick() {
    this.args.click();
  }
}
