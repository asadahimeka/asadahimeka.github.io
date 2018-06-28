;(function (Vue, http) {
  // register component
  Vue.component('cong', {
    template: '#cong-tpl'
  })
  Vue.component('gift-bag', {
    template: '#gift-bag-tpl',
    props: ['item']
  })
  Vue.component('d-btn', {
    template: '#d-btn-tpl'
  })

  // start app
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    data: {
      items: []
    },
    created: function() {
      var self = this
      http.get('js/data.json').then(function (res) {
        self.items = res.data.goods
      }).catch(function (err) {
        console.error(err)
      })
    }
  })
})(window.Vue, window.axios)
