import Ember from 'ember';

export function isIn([values, item]) {
  if(!values){
    return false;
  }
  if(!item){
    return false;
  }
  
  return values.contains(item);
}

export default Ember.Helper.extend({
  values: [],
  compute: function([values, item]) {
    this.set('values', values);

    return isIn([values, item]);
  },

  recomputeOnArrayChange: Ember.observer('values.[]', function() {
    this.recompute();
  })
});
