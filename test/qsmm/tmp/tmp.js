;(function (Vue, http) {
  // register component
  Vue.component('hello', {
    template: '#tpl',
    data: function() {
      return {

      }
    }
  })

  // start app
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    data: {

    }
  })
})(window.Vue, window.axios)
