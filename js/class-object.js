if (typeof cwos == 'undefined') window.cwos = {}; // Catali Web OS
if ( typeof cwos.config !== 'object' ) cwos.config = {};
cwos.alert = function(msg,opts){
  var options = {
    type : 'info',
    tymout : 0,
    exit : 'Okay'
  }
  msg = msg.replace(/\\r\\n/g,'<br>').replace(/\\n/g,'<br>');
  var optionVals = {
    type : ['info','message','error','progress','success'],
    exit : ['Okay','Close','Continue']
  }
  if( opts && typeof opts =='object' ){
    if (inArray(opts.type,optionVals.type)) options.type = opts.type;
    if (opts.exit !== undefined) options.exit = opts.exit;
  }

  var typeMsgs = {
    info : 'Okay',
    message : 'Okay',
    error : 'Close',
    progress : '',
    success : 'Continue'
  }
  var typeIcons = {
    info : ' <i class="fas fa-info fa-2x"></i> ',
    error : ' <i class="fas fa-times fa-2x"></i> ',
    success : ' <i class="fas fa-check fa-2x"></i> ',
    message : ' <i class="fas fa-info-circle fa-2x"></i> ',
    progress : ' <i class="fas fa-spinner fa-2x fa-spin"></i> '
  }
  var btnIcons = {
    info : ' <i class="fas fa-info-circle"></i> ',
    error : ' <i class="fas fa-times"></i> ',
    success : ' <i class="fas fa-check"></i> ',
    message : ' <i class="fas fa-arrow-right"></i> ',
    progress : ''
  }
  var btnColors = {
    info : 'yellow',
    error : 'red',
    success : 'green',
    message : 'white',
    progress : 'blue'
  }
  if( $(document).find('#cwos-alert-cover').length > 0 ){ removeAlert(); }
  var div = '<div id="cwos-alert-cover"> <div id="cwos-alert" class="alert '+options.type+' drop-shadow"> <div id="cwos-alert-content">';
      if( options.type == 'progress' ){
        div += ' <p class="align-c"> '+typeIcons[options.type]+'</p>';
      }
      div += msg;
      div += "</div> <footer>";
      if( options.type !== 'progress' && options.exit !== false ){
        if (options.exit === true) options.exit = "Close";
        if (typeof options.exit !== "boolean" || parseBool(options.exit) != false ) {
          if (inArray(options.exit,typeMsgs)) {
            div += '  <button type="button" class="btn '+btnColors[options.type]+'" onclick="removeAlert();">' + btnIcons[options.type] +typeMsgs[options.type] +'</button>'
          } else {
            div += '  <button type="button" class="cwos-btn '+btnColors[options.type]+'" onclick="removeAlert();">' + btnIcons[options.type] + options.exit +'</button>'
          }
        }
      }
      div += '</footer> </div> </div>';
  $('body').prepend(div);
  $(document).find('#cwos-alert-cover').animate({opacity:1},300);
  if( parseInt(options.tymout) > 0 ){  setTimeout(function(){ removeAlert(); },options.tymout); }
};
window.alert = cwos.alert; // window.alert/alert is deprecated, you should say: cwos.alert(message, options)
function removeAlert(){
  var div = $(document).find('#cwos-alert-cover');
  if( div.length >0){
    div.animate({opacity:0},300,function(){ div.remove(); });
  }
};
cwos.randCode = function (len = 8) {
  let result = '',
      chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';
   let charLen = chars.length;
   for ( var i = 0; i < len; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charLen));
   }
   return result;
};
cwos.form = {
  getInput : function(form, exclude = ["file"]) {
    exclude = typeof exclude === "object" ? exclude : [];
    if (typeof form !== "object") return null;
    let $return = {},
        formId = $(form).attr("id");
    formId = ( typeof formId !== null && formId !== false ) ? formId : false;
    if (!inArray('file',exclude)) {
      let formFiles = $(form).find('input[type=file]');
      if( formFiles.length > 0 ){
        var fileInputs = form.querySelectorAll("input[type=file]");
        for(i = 0; i < fileInputs.length; ++ i){
          var fname='file-'+i+'-';
          for(ii = 0; ii < fileInputs[i].files.length; ++ii){
            $return[fname+ii] = fileInputs[i].files[ii];
          }
        }
      }
      if (formId !== false) {
        let otherFormFiles = form.querySelectorAll(`input[type=file][form='${formId}']`);
        if ( otherFormFiles.length > 0 ) {
          for (i=0; i < otherFormFiles.length; ++i) {
            let fname = 'filex-'+i+'-';
            for (ii = 0; ii < otherFormFiles[i].files.length; ++ii) {
              $return[fname+ii] = otherFormFiles[i].files[ii];
            }
          }
        }
      }
    }
    // form inputs
    if (!inArray("input", exclude)) {
      let inputs = $(form).find('input');
      if( inputs.length >0 ){
        inputs.each(function() {
          if( !inArray($(this).attr('type'),['file','checkbox','radio']) ){
            $return[$(this).attr('name')] = $(this).val();
          }
        });
      }
      if (formId !== false) {
        let otherInputs  = $(document).find(`input[form='${formId}']`);
        if ( otherInputs.length >0 ) {
          otherInputs.each(function () {
            if( !inArray($(this).attr('type'),['file','checkbox','radio']) ){
              $return[$(this).attr('name')] = $(this).val();
            }
          });
        }
      }
    }
    if (!inArray("checkbox", exclude)) {
      let checkboxes = $(form).find('input[type=checkbox]');
      if ( checkboxes.length > 0 ) {
        checkboxes.each(function(){
          let name = $(this).attr('name'),
              cchecked = [];
          $(form).find(`input[name='${name}']`).each(function(){
            if ( $(this).is(':checked') ) {
              cchecked.push( $(this).val() );
            }
          });
          if ( cchecked.length > 0 ) {
            $return[name] = cchecked.join(',');
          }
        });
      }
      if (formId !== false) {
        let otherCheckboxes = $(document).find(`input[type=checkbox][form='${formId}']`);
        if ( otherCheckboxes.length > 0 ) {
          otherCheckboxes.each(function() {
            if ( $(this).is(':checked') ) {
              $return[$(this).attr('name')] = $(this).val();
            }
          });
        }
      }
    }
    if (!inArray("radio", exclude)) {
      let radios = $(form).find('input[type=radio]');
      if ( radios.length > 0 ) {
        radios.each(function(){
          if ( $(this).is(':checked') ) {
            $return[$(this).attr('name')] = $(this).val();
          }
        });
      }
      if (formId !== false) {
        let otherRadios  = $(document).find(`input[type=radio][form='${formId}']`);
        if( otherRadios.length > 0 ){
          otherRadios.each(function(){
            if( $(this).is(':checked') ){
              $return[$(this).attr('name')] = $(this).val();
            }
          });
        }
      }
    }
    if (!inArray("select", exclude)) {
      let selects = $(form).find('select');
      if ( selects.length > 0 ) {
        selects.each(function() {
          $return[$(this).attr('name')] = $(this).val();
        });
      }
      if (formId !== false) {
        let otherSelects     = $(document).find(`select[form='${formId}']`);
        if( otherSelects.length > 0 ){
          otherSelects.each(function(){
            $return[$(this).attr('name')] = $(this).val();
          });
        }
      }
    }
    if (!inArray("textarea", exclude)) {
      let textareas = $(form).find('textarea');
      if ( textareas.length > 0 ) {
        textareas.each(function(){
          $return[$(this).attr('name')] = $(this).val();
        });
      }
      if (formId !== false) {
        let otherTextareas   = $(document).find(`textarea[form='${formId}']`);
        if ( otherTextareas.length > 0 ) {
          otherTextareas.each(function(){
            $return[$(this).attr('name')] = $(this).val();
          });
        }
      }
    }
    return $return;
  },
  validate : function(form) {
    console.error("cwos.form.validate: NOT READY FOR USE")
    return false;
  },
  endpoint : function (form) {
    let endpoint = $(form).attr('action');
    if (endpoint === 'undefined' || endpoint === null || !endpoint.is_valid_url()) {
      let actionDomain = $(form).data('domain') // [form]data.action
            ? $(form).data('domain')
            : document.location.origin,
          actionPath = $(form).data('path')
            ? $(form).data('path') : '';
      endpoint = actionDomain + actionPath + $(form).attr('action');
    }
    if (!endpoint.is_valid_url()) {
      console.error(`Invalid form[submit] endpoint: ${endpoint}`);
    }
    return endpoint;
  },
  files : {},
  fileHash : {},
  remFile : function (fid) {
    if (fid && cwos.form.files[fid] !== "undefined") {
      if (delete cwos.form.files[fid]) {
        $(document).find(`li#${fid}`).remove();
        delete cwos.form.fileHash[fid];
      }
    }
  },
  submit : function (form, callback, validate, resetForm, header) {
    if (validate && !cwos.form.validate.all(form)) {
      console.error("Form was not submitted due to validation error(s)");
      return false;
    }
    let requestMethod = $(form).attr("method").toLowerCase();
    if (requestMethod == 'get' && $(form).find("input[type=file]").length > 0) {
      cwos.alert('<h2>Wrong form request [method] </h2> <p>Kindly use \'POST\' [method] for forms with file upload.</p>',{type:"error"});
      return false;
    }
    let fData,
        formInputs = cwos.form.getInput(form);
    if (typeof formInputs !== "object" || formInputs.length <= 0) {
      alert("<h2>[3.1] Input error </h2> <p>No form input processed.</p>", {type:"error",exit:true});
      console.error("cwos form not properly configured or has no valid input/value");
      return false;
    }
    if (requestMethod == 'get') {
      fData = $.param(formInputs);
    } else {
      fData = new FormData();
      $.each(formInputs, function(name, value) {
        fData.append(name, value);
      });
    }

    let endpoint = cwos.form.endpoint(form);
    if (!endpoint.is_valid_url()) return false;
    cwos.alert("Please wait..",{type:'progress',exit:false});
    header = typeof header == 'object' ? header : {}
    var ajaxOpt = {
      url : cwos.form.endpoint(form),
      type : requestMethod,
      headers : header,
      data : fData,
      contentType: false,
      processData: requestMethod == "post" ? false : true,
      xhr: function() {
         var xhr = $.ajaxSettings.xhr();
         if(xhr.upload){
           xhr.upload.addEventListener('progress', cwos.loader.progress, false);
         }
         return xhr;
       },
      success  : function(data){
        if (data.status == undefined || data.message == undefined || data.errors == undefined) {
          var outprint = " <h4>Response detail</h4>";
          if (typeof data == "object") {
            outprint += JSON.stringify(data);
          } else {
            outprint += data;
          }
          cwos.alert("<h3>[4.0]: Unknown response error.</h3> <div>" + outprint +"</div>",{type:'error',exit:true});
        } else {
          if (data.status == "0.0" || data.status == "00") {
            if(resetForm)  $(form).trigger('reset');
            cwos.alert("<h3>[0.0]: Success!</h3> <div>" + data.message + "</div>",{type:'success',tymout:18000, exit:true});
            if(typeof callback == "function") { callback(data); };
          } else if (data.status == "0.1") { // No change(s) made
            cwos.alert("<h3>[0.1]: No change(s) made.</h3> <div>" + data.message + "</div>",{type:'message',tymout:15000, exit:true});
          } else if (data.status == "0.2") { // No result(s) found
            cwos.alert("<h3>[0.2]: No result(s) found.</h3> <div>" + data.message + "</div>",{type:'message',tymout:15000, exit:true});
          } else if (data.status == "0.3") { // Action required
            cwos.alert("<h3>[0.3]: Action required.</h3> <div>" + data.message + "</div>",{type:'info',tymout:15000, exit:true});
          } else {
            var html = '<h3> ['+data.status+']: '+data.message+'</h3>';
            html += '<strong>Errors:</strong> <ol>';
            for(i=0;i<data.errors.length;i++){  html += '<li>'+data.errors[i]+'</li>'; }
            html += '</ol>';

            if( data.uploaded_files ){
              if( data.uploaded_files.length >0){
                html += '<strong>Uploaded Files:</strong><br><ol>';
                for(i=0;i<data.uploaded_files.length;i++){
                  html += '<li> <a href="'+data.uploaded_files[i].url+'" target="_blank" title="Click to view"> File '+i+'</a></li>';
                }
                html += '</ol>';
              }
            }
            if(data.failed_files ){
              if(data.failed_files.length >0){
                html += '<strong>Failed Files:</strong><br><ol>';
                for(i=0;i<data.failed_files.length;i++){
                  html += '<li> '+data.failed_files[i].name+' | Type: '+data.failed_files[i].type+' | Size in bytes: '+fromByte(data.failed_files[i].size)+'</li>';
                }
                html += '</ol>';
              }
            }
            cwos.alert(html,{type: 'error', exit:true});
          }
        }
      },
      error		:	function(xhr, textStatus, errorThrown){
        var errorMessage = xhr.responseText;
        var html = '<h3>[Unknown]: Error(s)</h3> <div>' + errorMessage +'</div>';
        cwos.alert(html,{type:'error', exit:true});
      }
    }

    // if( url.hostname() !== url.hostname(actionUrl) ){
    //   ajaxOpt['dataType'] = 'jsonp';
    //   ajaxOpt['jsonp'] = 'json';
    //   // ajaxOpt.async = true;
    // }else{
    //   ajaxOpt['dataType'] = 'json';
    // }
    ajaxOpt['dataType'] = 'json';
    $.ajax(ajaxOpt);
  }
};
cwos.form.initFile = function (fileInput, statBar) {
  if ($(statBar).length <= 0) {
    console.error("DOM: stats bar not provided");
  }
  let fileProps = [];
  if( fileInput.files.length > 0 ){
    let fileInputs = fileInput.files;
    for(let i = 0; i < fileInputs.length; i++){
      // get file id and make sure it is not already existing
      let hash,
          hashString = i;
      hashString += fileInputs[i].name;
      hashString += fileInputs[i].size;
      hashString += fileInputs[i].type;
      hash = hashString.hashCode();
      if (!inArray(hash, Object.values(cwos.form.fileHash))) {
        let fname = cwos.randCode(12);
        cwos.form.fileHash[fname] = hash;
        cwos.form.files[fname] = fileInputs[i];
        fileProps.push({
          id : fname,
          hash : hash,
          name : fileInputs[i].name,
          size : fileInputs[i].size,
          type : fileInputs[i].type
        });
      };
    }
  }
  // create upload stats
  if ($(statBar).length > 0 && fileProps.length > 0) {
    // check if DOM wrapper exists
    let prgWrap;
    if ($(document).find("#cwos-frm-upldr-stat").length <= 0) {
      $(statBar).html($(`<div id="cwos-frm-upldr-stat"><ul class=\"fl-lst\"></ul></div>`));
      prgWrap = $(document).find("#cwos-frm-upldr-stat ul.fl-lst");
    } else {
      prgWrap = $(document).find("#cwos-frm-upldr-stat ul.fl-lst");
    }
    let prgLi,
        fileIcon,
        fileSize,
        fileExt;
    $.each(fileProps, function(i, file) {
      fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
      // fileIcon = file_group(file.type);
      fileIcon = file_group(fileExt.toLowerCase());
      fileSize = byte_size(file.size);
      fileSize = typeof fileSize[0] == "number"
        ? number_format(fileSize[0],2,".",",") + fileSize[1]
        : "0.0";
      prgLi = $(`<li id="${file.id}"> <span class="ficon ${fileIcon}"></span>  <span class="fname">${file.name}</span> <span class="fsize">${fileSize}</span></li>`);
      prgLi.append($(`<div class=\"prgs\" id="cwos-upl-prog-${file.id}"></div>`))
           .append($('<span class="stat-uploadn"><i class="fas fa-spinner fa-pulse"></i></span>'))
           .append($('<span class="stat-waitn"><i class="fas fa-hourglass-half"></i></span>'))
           .append($('<span class="stat-failed"><i class="fas fa-exclamation-triangle"></i></span>'))
           .append($('<span class="stat-done"><i class="fas fa-check-circle"></i></span>'))
           .append($(`<button id="fl-rm-${file.id}" onclick="cwos.form.remFile('${file.id}');" class="cwos-btn red frmv"><i class="fas fa-times fa-sm"></i></button>`));
      prgWrap.append(prgLi);
    });
  }
  if (cwos.form.files.length < 1) {
    console.error(`No file input found for given [form] with id: ${form}`);
    // return false;
  }
  // console.log(cwos.form.files);
  // console.log(fileProps);
  return cwos.form.files;
};
cwos.form.resetFiles = () => {
  if (Object.keys(cwos.form.files).length > 0) {
    cwos.form.files = {};
    cwos.form.fileHash = {};
  }
}
cwos.form.uploadProgress = function (id, upl) {
  if (typeof upl !== "object") {
    console.error("Invalid upload response data [upl]");
    return false;
  }
  let dom_el = $(document).find(`#cwos-upl-prog-${id}`);
  $(document).find(`li#${id}`).removeClass("waitn").addClass('uploadn');
  let pcent = Math.round( ((upl.loaded * 100) / upl.total) );
  if (pcent <= 100) dom_el.css("width", `${pcent}%`);
  if (pcent >= 100) $(document).find(`li#${id}`).removeClass('uploadn').addClass("done");
};
cwos.form.upload = function(form, header, afterUpload) {
  // initialize
  if ($(cwos.form.files).length < 1) {
    console.error("No file was initialized");
    return false;
  }
  let formInputs = cwos.form.getInput(form,["file"]),
      endpoint = cwos.form.endpoint(form),
      report = [],
      fData,
      queryCount = 0,
      ajaxOpt;
  function checkDone (resp, callback) {
    if (queryCount === Object.keys(cwos.form.files).length) {
      // ready
      if (report.length > 0) {
        cwos.alert(report.join("<hr>"),{type:"error"});
      } else {
        // cwos.alert(`<h2>[0.0]: Success!</h2> <p>File(s) were uploaded successfully.</p>`,{type:"success"});
        if (resp.status === "0.0" && typeof window[callback] === "function") {
          window[callback](resp);
        }
      }
    }
  }
  $(document).find(".hide-on-submit, .cwos-file-trigger").hide();
  $(form).find("input[type=submit], button[type=submit]").prop("disabled", true).hide();
  $.each(cwos.form.files, function(fid, file) {
    fData = new FormData(), ajaxOpt;
    fData.append(fid, file);
    $.each(formInputs, function(name, value) {
      fData.append(name, value);
    });
    header = typeof header == 'object' ? header : {};
    $(`#${fid}`).removeClass("waitn").addClass("uploadn");
    ajaxOpt = {
      url : endpoint,
      type : "post",
      headers : header,
      data : fData,
      contentType: false,
      processData: false,
      xhr: function() {
         var xhr = $.ajaxSettings.xhr();
         if(xhr.upload){
           xhr.upload.addEventListener('progress', function(uplStat) {
             cwos.form.uploadProgress(fid, uplStat);
           }, false);
         }
         return xhr;
       },
      success  : function(data){
        ++queryCount;
        if (data.status == undefined || data.message == undefined || data.errors == undefined) {
          $(`#${fid}`).removeClass("uploadn done").addClass("failed");
          var outprint;
          if (typeof data == "object") {
            outprint += JSON.stringify(data);
          } else {
            outprint += data;
          }
          report.push(`<h2>[x.x]: Error uploading #${fid} - ${file.name}</h2> <p> ${outprint}</p> `);
        } else {
          if (data.status == "0.0" || data.status == "00") {
            $(`#${fid}`).removeClass("uploadn").addClass("done");
            // report.push("<h2>[0.0]: Success!</h2> <div>" + data.message + "</div>");
          } else {
            let outprint = `<h2>[${data.status}]: Error uploading #${fid} - ${file.name}</h2>`;
            if ( object_length(data.errors) > 0) {
              outprint += `<p>${data.message}</p>`;
              outprint += "<ol>";
              $.each(data.errors, function (_i,errMsg) {
                outprint += `<li>${errMsg}</li>`;
              });
              outprint += "</ol>";
            }
            $(`#${fid}`).removeClass("uploadn done").addClass("failed");
            report.push(outprint);
          }
        }
        checkDone(data, afterUpload);
      },
      error		:	function(xhr, _textStatus, _errorThrown){
        ++queryCount;
        $(`#${fid}`).removeClass("uploadn done").addClass("failed");
        report.push(`<h2>[x.x]: Error(s) occured while uploading #${fid} - ${file.name}</h2> <div>${xhr.responseText}</div>`);
        checkDone({
          status : "x.x",
          message : "Failed to load...",
          errors : report
        },afterUpload);
      }
    }
    $.ajax(ajaxOpt);
  });
};
// form processor
cwos.loader = {
  init : function(pauseActivity, wrapper) {
    if ($(document).find("#cwos-loader").length <= 0 ) {
      pauseActivity = typeof pauseActivity == "boolean" ? pauseActivity : false;
      var outprint = '<div id="cwos-loader"';
      if (pauseActivity) outprint += ' class="cwos-loader-cover"';
          outprint += '> <div id="cwos-spinner"> <i class="fas fa-spinner fa-spin"></i></div> <div id="cwos-loader-loaded"></div>';
          outprint += '</div>';
      $('body').prepend(outprint);
    }
  },
  progress : function (info) {
    cwos.loader.init();
    var bar = $(document).find('#cwos-loader-loaded');
    var loaded = Math.round( ((info.loaded * 100) / info.total) );
    bar.css({
      width : loaded + "%"
    });
    if (loaded >= 100 ){
      setTimeout(cwos.loader.exit,1200);
    }

  },
  exit : function () {
    $(document).find("#cwos-loader").fadeOut('slow').remove();
  }
};
cwos.form.validate = {
  all : function (form) {
    return true;
  }
};
cwos.faderBox = {
  overlay : function (theme = "light", loader = true, exitBtn = true, callback) {
    theme = theme in ["dark", "light"] ? theme : "light";
    let vi = $(document).find(".cwos-fbx-overlay").length;
    let wrapper = $(`<div id="cwos-fbx-wrp-${vi}" data-index="${vi}" class="cwos-fbx-overlay ${theme}"> <div class="cwos-fbx-content"></div></div>`);
    // exit button
    if (exitBtn === true) wrapper.append($(`<button class="cwos-btn cwos-fbx-exit" data-vi="${vi}"><i class="fas fa-times"></i></button></button>`));
    // loader
    if (loader) wrapper.append($(`<div class="cwos-fbx-loader"><i class="fas fa-spinner fa-pulse"></i></div>`));
    $('body').append(wrapper).addClass('no-scroll');
    let view = $(document).find(`#cwos-fbx-wrp-${vi}`);
    view.css("z-index",500001 + vi);
    view.animate({opacity:1},300,function(){
      if (typeof callback === 'function') {
        callback(vi);
      }
    });
  },
  url : function(url, pdata, option = {method : 'get', overlay : true, showLoader: true, coc:false, dataType:'text', theme: 'light', exitBtn: true}, callBack){
    let options = {
      method    : 'get',
      overlay   : true,
      showLoader: true,
      coc       : false,
      dataType  : 'text',
      theme     : 'light',
      exitBtn   : false
    }
    let optionVals = {
      method : ['post','get'],
      overlay : [true,false],
      showLoader : [true,false],
      coc : [true,false],
      exitBtn : [true,false],
      dataType : ['text','html','json','xml','script'],
      theme : ['light','dark']
    }
    if( option !== 'undefined' && typeof option =='object' ){
      $.each(option, function(key, val) {
        if( key in options && inArray(val, optionVals[key]) ){
          options[key] = val;
        }
      });
    }
    let doFetch = function(vi = 0){
      $.ajax({
        url       : url,
        // async     : false,
        type      : options.method,
        data      : pdata,
        dataType  : options.dataType,
        success : function(data){
          cwos.faderBox.removeLoader();
          if( typeof callBack === 'undefined' ){
            let output = $(document).find(`.cwos-fbx-content:eq(${vi})`);
            output.html(data);
            cwos.faderBox.removeLoader(vi);
          }else{
            callBack(data);
            if( options.overlay || options.showLoader ) faderBox.close(vi);
          }
        },
        error: function(xhr, text){
          faderBox.close(vi);
          alert(`<h2>[5.1]: Error: (${xhr.status}) ${xhr.statusText} </h2> <p>Failed to load requested recources.</p>`,{type:'error'});
        }
      });
    };
    if ( options.overlay ) {
      cwos.faderBox.overlay(options.theme, options.showLoader, options.exitBtn, doFetch);
    } else {
      doFetch();
    }
  },
  close : function(index){
    index = index ? index : ($(document).find('.cwos-fbx-overlay').length ? $('.cwos-fbx-overlay').last().data().index : false);
    if (index !== false) {
      let fader = $(document).find(`#cwos-fbx-wrp-${index}`);
      if( fader.length > 0 ){
        fader.animate({opacity:0},250,function(){
          fader.remove();
          if ($(".cwos-fbx-overlay").length <= 0) $('body').removeClass('no-scroll');
        });
      }
    }
  },
  removeLoader : function(index) {
    index = index ? index : ($(document).find('.cwos-fbx-overlay').length ? $('.cwos-fbx-overlay').last().data().index : false);
    if (index !== false) {
      let loader = $(document).find(`.cwos-fbx-overlay:eq(${index})`).children(`.cwos-fbx-loader`);
      if( loader.length > 0 ){
        loader.animate({opacity:0},250,function(){ loader.remove(); });
      }
    }
  },
  disableExit : function ( index = $('.cwos-fbx-overlay').last().data().index) {
  },
  visIndex : function () {
    return ($('.cwos-fbx-overlay').length > 0 ? $('.cwos-fbx-overlay').last().data().index : null);
  } // visible overlay
};
cwos.fbx = cwos.faderBox;

(function (){
  $(document).on("change", "input[type='file'][data-action='cwos-file-init']", function(){
    if (this.files.length > 0) {
      cwos.form.initFile(this,$(this).data("stats"));
      if (
        $(this).prop('multiple') == false
        && parseBool(param.upl_multiple) == false
      ) {
        // remove file input and trigger
        $(".frmv").remove();
        $('.cwos-file-trigger').hide().remove();
        $(this).remove();
      }
    }
  });
  $(document).on("click", ".cwos-fbx-exit", function(){
    cwos.fbx.close($(this).data("vi"));
  });
})();
