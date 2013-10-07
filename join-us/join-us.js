$(function() {
  if ($('.work-item').length > 0) {
    var hashName = document.location.hash.substring(1);
    if (hashName == '') {
      return;
    }
    var $workItem = $(document.getElementById(hashName));
    if ($workItem.length > 0) {
      $workItem.find('.title-read-more').click();
    }
  }
});
