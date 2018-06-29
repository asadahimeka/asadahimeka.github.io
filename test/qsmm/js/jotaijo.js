;(function (http, QRCode) {
  window.addEventListener('load', function () {
    var qr = new QRCode(document.getElementById('qrcode'))
    http.get('js/data.json').then(function (res) {
      document.getElementById('name1').innerText = res.data.user
      document.getElementById('name2').innerText = res.data.user
      qr.makeCode(res.data.qrurl)
    }).catch(function (err) {
      console.error(err)
    })
  })
})(window.axios, window.QRCode)
