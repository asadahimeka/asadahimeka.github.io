$.get("mds.list").then(function (res) {
  res.split('\n').forEach(e => {
    $('.list').append(`<a class="listitem" href="dtl/?${e}">${e}</a>`);
  });
}).catch(function (err) {
  $('.list').append(`<a href="" style="font-size:40px">404 NOT FOUND</a>`);
});