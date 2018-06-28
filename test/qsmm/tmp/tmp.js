;(function (Vue, http) {
  // register component
  Vue.component('hello', {
    template: '#bg-part',
    data: function() {
      return {
        message: 'Hello!'
      }
    }
  })

  // start app
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    data: {
      a: false
    }
  })
})(window.Vue, window.axios)
