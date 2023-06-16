if (typeof cwos == 'undefined') {
  window.cwos = {}; // Catali Web OS
}
if ( typeof cwos.config !== 'object' ) cwos.config = {};
cwos.ui = null; // UI theme
cwos.nav = null; // UI Navigation
function shrink_ph () {
  var ph;
  $(document).find('input, textarea').each(function(){
    if ( $(this).attr('id') && $(this).val().length > 0 ) {
      ph = $(document).find('label[for="'+$(this).attr('id')+'"]');
      $(this).addClass('has-val');
      if(ph.length > 0 ){ ph.addClass('shrink'); }
    }
  });
}
const opnActnBtn = () => {
  let wrpr = $(document).find("#actn-btns");
  if (wrpr.length > 0 && !wrpr.hasClass("open")) {
    let wt = 250 + 24;
    let ht = 65;
    ht += wrpr.find("#actn-btn-wrp").outerHeight();
    wrpr.animate({ width : wt }, 200, function() {
      wrpr.animate({height : ht}, 250, function() {
        wrpr.addClass("open");
        wrpr.find("#actvt").addClass("open").html(` <i class="fas fa-times fa-lg"></i> Close`);
      });
    });
  }
};
const clsActnBtn = () => {
  let wrpr = $(document).find("#actn-btns");
  if (wrpr.length > 0 && wrpr.hasClass("open") ) {
    let wt = 190 + 0;
    let ht = 65;
    wrpr.animate({ height : ht }, 200, function() {
      wrpr.animate({ width : wt}, 250, function() {
        wrpr.removeClass("open");
        wrpr.find("#actvt").removeClass("open").html(` <i class="fas fa-angle-right fa-lg"></i> Start`);
      });
    });

  }
};
const tgglActnBtn = () => {
 let wrpr = $(document).find("#actn-btns");
 if (wrpr.length > 0) {
   if (wrpr.hasClass("open")) { clsActnBtn(); } else { opnActnBtn(); }
 }
};


function shrinkPlaceholder () { return shrink_ph(); }
var btnRipple = function (e) {
    var target = e.target;
    if (target.tagName.toLowerCase() !== 'button' && target.tagName.toLowerCase() !== 'a' ) return false;
    if ( (!target.classList.contains('theme-btn') && !target.classList.contains('theme-button') && !target.classList.contains('cwos-btn') && !target.classList.contains('cwos-button')) && !target.classList.contains('ripple') ) return false;
    if ( target.classList.contains('disabled') ) return false;
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}
document.addEventListener('click', btnRipple, false);
cwos.setup = function () {
  $("[data-setup]").each(function(){
    let name = $(this).data('setup');
    if(typeof cwos.config[name] !== 'object') cwos.config[name] = {}
    $.each($(this).data(),function(key,val){
      if (key !== "setup") cwos.config[name][key] = val;
    });
  });
};
(function(){
  cwos.setup();
  // diabled buttons
  $(document).on('click', 'button.disabled', function(e) {
    e.preventDefault(); return false;
  });
  $(document).find('a[href="#"]').click(function(e){
    e.preventDefault();
  })
  // placeholders
  $(document).on('focusin','.mat-ui input, .mat-ui textarea',function(){
    let label = $(document).find('label[for="'+$(this).attr('id')+'"]');
    if(label.length > 0 ){ label.addClass('shrink'); }
  });
  $(document).on('blur','.mat-ui input, .mat-ui textarea',function(){
    let label = $(document).find('label[for="'+$(this).attr('id')+'"]');
    if ($(this).val().length > 0 || $(this).is(':checked')) {
      if(label.length > 0){ label.addClass('shrink');}
    }else{
      if(label.length > 0 && !inArray($(this).attr('type'),["date","datetime"])){ label.removeClass('shrink');}
    }
  });
  $(document).on('blur change','input, textarea, select',function(){
    if( $(this).val().length > 0 ){
      $(this).addClass('has-val');
    }else{
      $(this).removeClass('has-val');
    }
  });
  shrink_ph();
  if (typeof cwos.config.ui == "object" && cwos.config.ui.handler == "DashUI") {
    // alert("<h3>Please wait</h3> <p>We're getting things ready</p>", {type: "progress"});
  }
  $(document).on("click", "#actvt", tgglActnBtn);
  $(document).on("click", "#page-foot, #main-content, #page-head, #sos-dnav, .close-action-buttons", clsActnBtn);
})();

$(document).ready(function(){
  // Dashboard UI
  if (typeof cwos.config.ui == "object") {
    let conf = cwos.config.ui;
    let confSetn = typeof cwos.config.uiOption == "object" ? cwos.config.uiOption : {}
    let notification = typeof cwos.config.uiNotification == "object" ? cwos.config.uiNotification : {}
    let cart = typeof cwos.config.uiCart == "object" ? cwos.config.uiCart : {}
    if (conf.handler == "DashUI" && conf.header.length && conf.autoinit) {
      cwos.ui = new DashUI(conf.header, conf.sidebar, notification, cart, confSetn);
      cwos.ui.init();
    }
  } if (typeof cwos.config.dnav == "object") {
    let cartBot = typeof cwos.config.dnavCartbot == "object" ? cwos.config.dnavCartbot : {};
    if (cwos.config.dnav.get.length) {
      cwos.nav = new DragNav(cwos.config.dnav.get, cwos.config.dnav, cartBot);
      cwos.nav.init();
    }
  }
});
