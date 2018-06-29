;(function (http, html2canvas, QRCode) {
  window.addEventListener('load', function() {
    var name1 = gi('name1')
    var name2 = gi('name2')
    var qrdiv = gi('qrcode')
    var savebtn = gi('save')
    var qr = new QRCode(qrdiv)
    http.get('js/data.json').then(function(res) {
      // if (res.data.ok){

      // }
      name1.innerText = res.data.user
      name2.innerText = res.data.user
      qr.makeCode(res.data.qrurl)
      savebtn.addEventListener('click', function() {
        html2canvas(document.body).then(function(canvas) {
          var dataurl = canvas.toDataURL('image/png')
          var a = document.createElement('a')
          a.download = 'share.png'
          a.href = dataurl
          a.click()
        })
        // var a = document.createElement('a')
        // a.download = 'share.jpg'
        // a.href = qrdiv.getElementsByTagName('img')[0].src
        // a.click()
      })
    }).catch(function(err) {
      console.error(err)
    })
  })

  function gi(id) {
    return document.getElementById(id)
  }
})(window.axios, window.html2canvas, window.QRCode)
