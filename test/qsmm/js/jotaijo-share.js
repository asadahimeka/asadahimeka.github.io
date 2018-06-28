;(function (http, html2canvas) {
  window.addEventListener('load', function() {
    http.get('js/data.json').then(function(res) {
      document.getElementById('name1').innerText = res.data.user
      document.getElementById('name2').innerText = res.data.user
      document.getElementById('qrcode').src = res.data.img
    }).then(function() {
      document.getElementById('save').addEventListener('click', function() {
        html2canvas(document.body).then(function(canvas) {
          var dataurl = canvas.toDataURL('image/png')
          var a = document.createElement('a')
          a.download = 'share.jpg'
          a.href = dataurl
          a.click()
        })

        // var a = document.createElement('a')
        // a.download = 'share.jpg'
        // a.href = document.getElementById('qrcode').src
        // a.click()
      })
    }).catch(function(err) {
      console.error(err)
    })
  })
})(window.axios, window.html2canvas)
