;(function (Vue, http) {
  Vue.component('bg-part', {
    template: '#bg-part-tpl',
    props: {
      item: [String, Number],
      cls: {
        type: String,
        default: ''
      }
    },
    computed: {
      style: function() {
        return 'background-image: url(img/invitereg/10_0' + this.item + '.jpg);'
      }
    }
  })
  Vue.component('btm-goods', {
    template: '#btm-goods-tpl',
    props: ['items']
  })
  Vue.component('btm-btn', {
    template: '#btm-btn-tpl',
    props: ['text', 'click']
  })
  Vue.component('btm-a', {
    template: '#btm-a-tpl',
    props: ['text', 'href']
  })
  Vue.component('modal', {
    template: '#modal-template'
  })

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    data: {
      bn: 5,
      items: [],
      inviter: '',
      showModal: false
    },
    created: function() {
      var self = this
      http.get('js/data.json').then(function (res) {
        console.log(res.data)
        self.items = res.data.list
        self.inviter = res.data.user
      }).catch(function (err) {
        console.error(err)
      })
    },
    methods: {
      btnclk: function(e) {
        console.log(111)
      },
      open: function() {
        this.showModal = true
      }
    }
  })
})(window.Vue, window.axios)
