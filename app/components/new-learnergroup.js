import Component from '@ember/component';

export default Component.extend({
  multiModeSupported: false,
  fillModeSupported: false,
  singleMode: true,
  classNames: ['new-learnergroup'],
  tagName: 'form',

  actions: {
    generateNewLearnerGroups(num){
      this.sendAction('generateNewLearnerGroups', num);
    }
  }
});
