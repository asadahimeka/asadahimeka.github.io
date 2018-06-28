;(function (http) {
  window.addEventListener('load', function() {
    http.get('js/data.json').then(function(res) {
      document.getElementById('name1').innerText = res.data.user
      document.getElementById('name2').innerText = res.data.user
      document.getElementById('qrcode').src = res.data.img
    }).catch(function(err) {
      console.error(err)
    })
  })
})(window.axios)
