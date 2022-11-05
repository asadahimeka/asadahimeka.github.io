getMD(fname());

function fname() {
  return window.location.search.slice(1);
}

function getConverter() {
  if (!window.converter) {
    window.converter = new showdown.Converter();
  }
  return window.converter;
}

function getMD(/** @type {string} */ fname) {
  if (!fname) {
    $('#md').html('<p class="nfd-p">404 NOT FOUND</p>');
    $('#md').prepend(`<a class="back" href="/brg">BACK</a>`);
    document.title = '404 NOT FOUND';
    return;
  }
  $.get(`../mds/${fname}.txt`).then(function (res) {
    $('#md').html(getConverter().makeHtml(res));
    $('pre code').each(function (i, block) {
      hljs.highlightBlock(block);
    });
    $('#md').prepend(`<a class="back">BACK</a>`);
    $('.back').on('click', function ( /** @type {Event} */ e) {
      window.history.back();
    });
    document.title = fname.replace(/-/g,' ').toUpperCase();
  }).catch(function (err) {
    $('#md').html('<p class="nfd-p">404 NOT FOUND</p>');
    $('#md').prepend(`<a class="back" href="/brg">BACK</a>`);
    document.title = '404 NOT FOUND';
  });
}