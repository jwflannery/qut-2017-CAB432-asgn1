// Each parameter has a separate function, but each follows the same process.
// When a keyUp event is detected in the relevant textBox, perform basic string matching to dynamically hide checkboxes that do not match query.
jQuery(function ($) {
  $('#manBox').keyup(function () {
    var valThis = $(this).val()
    $('.manInput').each(function () {
      var text = this.value.toLowerCase().trim();
      (text.includes(valThis.toLowerCase())) ? $(this).parent().show() : $(this).parent().hide()
    })
  })
})

jQuery(function ($) {
  $('#couBox').keyup(function () {
    var valThis = $(this).val()
    $('.couInput').each(function () {
      var text = this.value.toLowerCase().trim();
      (text.includes(valThis.toLowerCase())) ? $(this).parent().show() : $(this).parent().hide()
    })
  })
})

jQuery(function ($) {
  $('#opBox').keyup(function () {
    var valThis = $(this).val()
    $('.opInput').each(function () {
      var text = this.value.toLowerCase().trim();
      (text.includes(valThis.toLowerCase())) ? $(this).parent().show() : $(this).parent().hide()
    })
  })
})
