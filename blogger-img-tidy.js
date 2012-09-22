var
  $textarea = document.getElementById('postingHtmlBox'),
  pattern = [
    '(<div class="separator" style="clear: both; text-align: center;">\n)?',
    '<a href="(.+)"',
    ' imageanchor="1" style=".*"><img border="0" height=".+" width=".+" ',
    'src="(.+)" /></a>(</div>)?'
  ].join(''),
  re = new RegExp(pattern, 'g');

if ($textarea) {
  $textarea.value = $textarea.value.replace(re, function (str, p1, p2, p3, p4, p5) {
    return [
      '<a href="', p2, '">',
      '<img src="', p3, '" alt="" /></a>'
    ].join('');
  });
} else {
  alert('錯誤，找不到 textarea#postingHtmlBox。');
}
