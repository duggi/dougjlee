(function($){

  /*
   * requires hover intent and homegrown C(onsole)
   */

  $.fn.tip = function(opts) {
    return this.each(function() {
      var el = $(this);

      // Return early if this element already has a plugin instance
      if (el.data('tip')) return;

      // leave early if no tip text
      if(!opts.tipText) return;

      // tip behaviour for nodes with tipText
      el.hoverIntent(
        function() {
          if(!el.data('tip')) {
            el.data('tip', makeTip(el, opts));
          }
          showTip(el.data('tip'));
          C.out('display balloon: ' + opts.id);
        },
        function() {
          setTimeout(function() { hideTip(el.data('tip')); },300);
        }
      );
    });
  }


  function showTip(tip) {
    tip.show('slide', {direction:'down'},300);
  }
  function hideTip(tip) {
    if($.fn.tip.dontHide) return;
    //tip.fadeOut(100);
    tip.hide('slide', {direction:'down'},400);
  }


  function bindTipHover(tip, el) {
    tip.hover(
      function() {
       $.fn.tip.dontHide = true;
      },
      function() {
        setTimeout(function() {
          $.fn.tip.dontHide = false;
          hideTip(tip);
        }, 200);
        //hideTip(tip);
      }
    );
  }


  function makeTip(el, opts) {
    el = $(el);
    var o = $.extend({
      id: '',
      tipText: '',
      xPos: el.position().left
    }, opts || {});

    var tooltip = $('<div>')
      .attr({'class': 'tooltip HIDE', 'id': 'tip-' + o.id})
      .css('left',o.xPos + 25)
      .appendTo($('body'));

    var balloon = $('<div>')
      .attr('class','balloon')
      .html(o.tipText)
      .appendTo(tooltip);

    $('<div>').attr('class','tail').appendTo(balloon);

    // has link?
    if(opts.url) {
      balloon.addClass('link');
      $('<a>')
        .attr({
          'class': 'tiplink',
          'href': opts.url,
          'target': '_blank'
        })
        .mouseover(function() {
          C.out('link to: ' + opts.url);
        })
        .appendTo(balloon);
    }

    bindTipHover(tooltip, el);
    return tooltip;
  };
})(jQuery);
