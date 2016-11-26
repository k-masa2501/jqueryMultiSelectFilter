/*! MultiSelectFilter v0.1 | (c) masanori kitajima | https://github.com/k-masa2501/MultiSelectFilter */
(function( $ ) {

  var methods = {
    init: function(arg, o_this){

      var obj = null;
      var selection = null;
      var button = null;
      var div_multi_ctl = null;
      var div_ulList = null;
      var div_select_ctl = null;
      var div_input = null;
      var ul_list = null;
      var inTxt_filter = null;
      var chkbox_id = null;
      var li_chk_all = null;
      var li_unchk_all = null;
      var li_close = null;
      var span_text = null;
      var i=0,len=0;

      var option = methods._get_options(arg);

      for(i=0,len=o_this.length; i < len; i++){

        obj = $(o_this[i]);

        selection = new Array();
        ul_list = $("<ul></ul>");
        div_select_ctl = $("<div class='div_select_ctl'></div>");
        div_input = $("<div></div>");
        div_ulList = $("<div class='div_ulList'></div>");
        inTxt_filter = $("<input type='text' placeholder='filter'>");
        span_text = $("<span>"+ option.defalult +"</span>");
        button = $("<button data-onmouse='0' data-onclick='0' class='select_button'><span class='ui-icon ui-icon-triangle-1-s'></span></button>");
        div_multi_ctl = $("<div class='div_multi_ctl' tabIndex='0' style='display: none;'></div>");
        li_chk_all = $("<li><span class='ui-icon ui-icon-check ui-icon-color-white'></span>" + option.check_all + "</li>");
        li_unchk_all = $("<li><span class='ui-icon ui-icon-cancel ui-icon-color-white'></span>" + option.uncheck_all + "</li>");
        li_close = $("<li><span class='ui-icon ui-icon-circle-close ui-icon-color-white'></span>");
        chkbox_id = obj.attr('id') + '-chkbox-id';

        button.css('width',String(option.width)+'px');
        button.css('height',String(option.height)+'px');
        div_multi_ctl.css('width',String(option.width)+'px');

        $('body').append(div_multi_ctl);
        obj.after(button);
        button.prepend(span_text);
        div_multi_ctl.html(div_select_ctl);
        div_select_ctl.html(li_close);
        div_select_ctl.append(li_chk_all);
        div_select_ctl.append(li_unchk_all);
        div_input.html(inTxt_filter);
        if (option.filter) div_select_ctl.append(div_input);
        div_multi_ctl.append(div_ulList);
        div_ulList.html(ul_list);

        for (var cnt=0,children=obj.children(),length=children.length; cnt < length; cnt++){
          selection.push([$(children[cnt]).val(),$(children[cnt]).text(),0]);
        }

        obj.data('selection', selection);
        obj.data('button', button);
        obj.data('div_multi_ctl', div_multi_ctl);
        obj.data('ul_list', ul_list);
        obj.data('inTxt_filter', inTxt_filter);
        obj.data('chkbox_id', chkbox_id);
        obj.data('option', option);
        obj.data('li_chk_all',li_chk_all);
        obj.data('li_unchk_all',li_unchk_all);
        obj.data('span_text',span_text);
        obj.data('li_close',li_close);

        obj.attr('data-count', 0);

        obj.hide();

        methods._add_event_lisner(obj);

        methods._add_valule(obj.val(), obj);

      }
    },
    destroy: function(arg, o_this){

      var div_multi_ctl = null;
      var inTxt_filter = null;
      var chkbox_id = null;
      var button = null;
      var li_chk_all = null;
      var li_unchk_all = null;
      var li_close = null;
      var obj = null;

      for(var i=0,len=o_this.length; i < len; i++){

        obj = $(o_this[i]);

        div_multi_ctl = obj.data('div_multi_ctl');
        inTxt_filter = obj.data('inTxt_filter');
        chkbox_id = obj.data('chkbox_id');
        button = obj.data('button');
        li_chk_all = obj.data('li_chk_all');
        li_unchk_all = obj.data('li_unchk_all');
        li_close = obj.data('li_close');

        inTxt_filter.off();
        button.off();
        div_multi_ctl.off();
        $(document).off("click", '.'+chkbox_id);
        li_chk_all.off();
        li_unchk_all.off();
        li_close.off();

        div_multi_ctl.remove();
        button.remove();

        obj.removeData('selection');
        obj.removeData('button');
        obj.removeData('div_multi_ctl');
        obj.removeData('ul_list');
        obj.removeData('inTxt_filter');
        obj.removeData('chkbox_id');
        obj.removeData('option');
        obj.removeData('li_chk_all');
        obj.removeData('li_unchk_all');
        obj.removeData('span_text');
        obj.removeData('li_close');

        obj.val([]);

        obj.show();
      }
    },
    check_all: function(arg, o_this){

      var selection = null;
      var obj = null;
      var data = null;

      for(var i=0,objlen=o_this.length; i < objlen; i++) {

        obj = $(o_this[i]);
        data = new Array();

        selection = obj.data('selection');

        for(var cnt=0,len=selection.length; cnt < len; cnt++){
          selection[cnt][2] = 1;
          data.push(selection[cnt][0]);
        }

        methods._set_button_label(cnt, selection, obj);

        obj.attr('data-count', cnt);
        obj.val(data);

      }

    },
    uncheck_all: function(arg, o_this){

      var selection = null;
      var obj = null;

      for(var i=0,objlen=o_this.length; i < objlen; i++) {

        obj = $(o_this[i]);

        selection = obj.data('selection');

        for(var cnt=0,len=selection.length; cnt < len; cnt++){
          selection[cnt][2] = 0;
        }

        methods._set_button_label(0, selection, obj);

        obj.attr('data-count', 0);
        obj.val([]);

      }
    },
    _add_valule: function (arg, obj){

      var ids = arg;
      var index = null;
      var tmp = new Array();
      var selection = obj.data('selection');
      var span_text = obj.data('span_text');
      var option = obj.data('option');

      if (ids == null || typeof ids != "object"){
        ids = new Array();
      }

      for (var i=0,len=selection.length; i < len; i++){
        index = ids.indexOf(selection[i][0]);
        if (-1 < index) {
          tmp.push(selection[i][1]);
          selection[i][2] = 1;
        }
      }

      if (tmp.length <= option.textlen){
        span_text.text(tmp.join(','));
      }else{
        span_text.text(tmp.length + option.selected);
      }

      obj.attr('data-count',tmp.length);

    },
    _add_event_lisner: function(obj){

      var div_multi_ctl = obj.data('div_multi_ctl');
      var inTxt_filter = obj.data('inTxt_filter');
      var chkbox_id = obj.data('chkbox_id');
      var button = obj.data('button');
      var li_chk_all = obj.data('li_chk_all');
      var li_unchk_all = obj.data('li_unchk_all');
      var li_close = obj.data('li_close');

      button.click($.proxy(function(){
        methods._click(this);
      },obj));

      button.mouseenter(function(){
        methods._mouseenter(this);
      });

      button.mouseleave(function(){
        methods._mouseleave(this);
      });

      inTxt_filter.focusout(function(){
        div_multi_ctl.focus();
      });

      inTxt_filter.on('input propertychange',$.proxy(function(){
        methods._keyup(this);
      }, obj));

      div_multi_ctl.focusout($.proxy(function(){
        methods._focusout(this);
      },obj));

      div_multi_ctl.mouseenter(function(){
        methods._mouseenter(this);
      });

      div_multi_ctl.mouseleave(function(){
        methods._mouseleave(this);
      });

      li_chk_all.click($.proxy(function(){
        methods._check_all(this);
      },obj));

      li_unchk_all.click($.proxy(function(){
        methods._uncheck_all(this);
      }, obj));

      li_close.click($.proxy(function(){
        methods._close(this);
      },obj));

      $(document).on('click', '.'+chkbox_id, $.proxy(function(e){
        methods._click_checkbox(e.currentTarget, this);
      }, obj));

    },
    _check_all: function(obj){
      
      var tmp = obj.val();
      var checkboxes = $('.'+obj.data('chkbox_id'));
      var selection = obj.data('selection');
      var arry_index = 0;

      if (null == tmp) tmp = new Array();

      for(var cnt=0,len=checkboxes.length; cnt < len; cnt++){
        arry_index = $(checkboxes[cnt]).attr('data-index');
        tmp.push(selection[arry_index][0]);
        selection[arry_index][2] = 1;
        $(checkboxes[cnt]).prop('checked',true);
      }

      tmp = tmp.filter(function (x, i, self) {return self.indexOf(x) === i;});
      methods._set_button_label(tmp.length, selection, obj);

      obj.attr('data-count', tmp.length);
      obj.val(tmp);

    },
    _uncheck_all: function(obj){

      var tmp = obj.val();
      var checkboxes = $('.'+obj.data('chkbox_id'));
      var selection = obj.data('selection');
      var count = Number(obj.attr('data-count'));
      var arry_index = 0;

      if (null == tmp) tmp = new Array();

      for(var cnt=0,unchkcnt=0,len=checkboxes.length; cnt < len; cnt++){
        if ($(checkboxes[cnt]).prop('checked')){
          arry_index = $(checkboxes[cnt]).attr('data-index');
          selection[arry_index][2] = 0;
          tmp.splice(tmp.indexOf($(checkboxes[cnt]).val()),1);
          $(checkboxes[cnt]).prop('checked',false);
          unchkcnt++;
        }
      }

      methods._set_button_label(count-unchkcnt, selection, obj);

      obj.attr('data-count', count-unchkcnt);
      obj.val(tmp);

    },
    _close: function(obj){

      var div_multi_ctl = obj.data('div_multi_ctl');
      var button = obj.data('button');

      button.attr('data-onclick','0');
      div_multi_ctl.hide();

    },
    _click: function(obj){

      var button = obj.data('button');

      if ('0' == button.attr('data-onclick')){
        methods._search(obj);
        methods._show(obj);
      }else{
        methods._close(obj);
      }
    },
    _focusout: function (obj){
      var div_multi_ctl = obj.data('div_multi_ctl');
      var button = obj.data('button');

      if ('1' != div_multi_ctl.attr('data-onmouse') && '1' != button.attr('data-onmouse')){
        methods._close(obj);
      }
    },
    _click_checkbox: function(_checkbox, obj){

      var checkbox = $(_checkbox);
      var selection = obj.data('selection');
      var tmp = obj.val();
      var arry_index = $(checkbox).attr('data-index');
      var count = Number(obj.attr('data-count'));

      if (null == tmp) tmp = new Array();

      if ($(checkbox).prop('checked')){
        count++;
        tmp.push($(checkbox).val());
        selection[arry_index][2] = 1;
      }else{
        count--;
        tmp.splice(tmp.indexOf($(checkbox).val()),1);
        selection[arry_index][2] = 0;
      }

      methods._set_button_label(count, selection, obj);

      obj.attr('data-count', count);
      obj.val(tmp);
    },
    _set_button_label: function(count, selection, obj){

      if (null == selection) return;

      var option = obj.data('option');
      var checked_arry = new Array();
      var span_text = obj.data('span_text');

      if (count <= option.textlen){
        for (var i=0,cnt=0,len=selection.length; i < len && cnt < option.textlen;i++){
          if (1 == selection[i][2]) {
            checked_arry.push(selection[i][1]);
            cnt++;
          }
        }
        if (0 >= checked_arry.length) checked_arry.push(option.defalult);
        span_text.text(checked_arry.join(','));
      }else{
        span_text.text(String(count) + option.selected);
      }
    },
    _mouseenter: function(o){
      $(o).attr('data-onmouse','1');      
    },
    _mouseleave: function(o){
      $(o).attr('data-onmouse','0');      
    },
    _keyup: function(obj){
      var delay = obj.data('option').delay;
      var div_multi_ctl = obj.data('div_multi_ctl');
      methods._delay_proc((function(obj){
        methods._search(obj);
      })(obj),delay);
    },
    _search: function(obj){
      var ul_list = obj.data('ul_list');
      var inTxt_filter = obj.data('inTxt_filter');
      var selection = obj.data('selection');
      var chkbox_id = obj.data('chkbox_id');
      var checked = '';

      var regexp = methods._set_regexp(inTxt_filter.val());
      var tmp = '';

      for (var i=0,len=selection.length; i < len; i++){
        if (regexp.test(selection[i][1])){
          checked =  1 == selection[i][2] ? "checked='checked'":"";
          tmp = tmp + "<li><label><input type='checkbox' class='"+ chkbox_id +"' name='"+ chkbox_id + "' "+ checked +
              " data-text='"+ selection[i][1] +"' data-index='"+ String(i) +"' value='"+ selection[i][0] +"'>"+
              selection[i][1] +"</label></li>";
        }
      }

      if ('' == tmp) tmp = '<li>not exist.</li>';
      ul_list[0].innerHTML = tmp;
    },
    _set_regexp: function (val){
      var regexp = '';
      if ("" == val){
        regexp = new RegExp('.+');
      }else{
        val = val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        val = val.replace(/\s|[[:blank:]]/g, ".*");
        regexp = new RegExp('.*' + val + '.*', 'i');
      }
      return regexp;      
    },
    _delay_proc: function(callback, ms){
      return (function(callback, ms){
        clearTimeout (methods.timer);
        methods.timer = setTimeout(callback, ms);
      })(callback, ms);
    },
    _show: function(obj){
      var div_multi_ctl = obj.data('div_multi_ctl');
      var button = obj.data('button');
      var left = button.position().left + Number(button.css('margin-left').replace(/px/g, ''));
      var top = button.outerHeight()+button.position().top;
      div_multi_ctl.css('left', String(left)+'px');
      div_multi_ctl.css('top', String(top)+'px');
      div_multi_ctl.show();
      div_multi_ctl.focus();
      button.attr('data-onclick','1');
    },
    _get_options: function(arg){

      var delay = 300;
      var width = 150;
      var height = 20;
      var textlen = 2;
      var selected = "selection";
      var defalult = "unselected";
      var check_all = "check all";
      var uncheck_all = "uncheck all";
      var filter = true;

      if (arg != null && typeof arg == 'object'){
        if ('delay' in arg && isFinite(arg.delay)) delay = arg.delay;
        if ('width' in arg && isFinite(arg.width)) width = arg.width;
        if ('height' in arg && isFinite(arg.height)) height = arg.height;
        if ('textlen' in arg && isFinite(arg.textlen)) textlen = arg.textlen;
        if ('selected' in arg && typeof arg.selected == 'string') selected = arg.selected;
        if ('defalult' in arg && typeof arg.defalult == 'string') defalult = arg.defalult;
        if ('check_all' in arg && typeof arg.check_all == 'string') check_all = arg.check_all;
        if ('uncheck_all' in arg && typeof arg.uncheck_all == 'string') uncheck_all = arg.uncheck_all;
        if ('filter' in arg && typeof arg.filter == 'boolean') filter = arg.filter;
      }
      return {
        delay: delay,
        width: width,
        height: height,
        textlen: textlen,
        selected: selected,
        defalult: defalult,
        check_all: check_all,
        uncheck_all: uncheck_all,
        filter: filter
      };
    },
    timer: 0
  };

  $.fn.MultiSelectFilter = function(method) {

    methods[method](arguments[1], this);

  };

})( jQuery );