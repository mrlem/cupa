/**
 * file: cupa.js
 *
 * desc: Cupa is a Customizable web-page framework that allows you to create
 *       web pages that can be modified by authenticated users. The goal is
 *       is that as a creator don't need to know about writing 'code' (other
 *       than HTML and CSS) or know anything about complex deployments.
 *
 * auth: Sebastien Guillemin <seb@mrlem.org>
 */

var cupa = new Cupa();

//---------------------------------------------------------------------
// Cupa object constructor

function Cupa() {

  // private attributes
  var that = this;
  var isAdmin = false;

  // .. translatable strings
  var strings = {
    user:     "User:",
    password: "Password:",
    ok:       "OK"
  };

  //-------------------------------------------------------------------
  // public methods

  this.askConnect = function() {
    $("#cupa-login").fadeIn();
    $("#cupa-user").focus();
  };

  this.connect = function() {
    $.ajax({
      type: "POST",
      url: "api/login.php",
      cache: false,
      headers: {
        "Authorization": "Basic " + btoa($("#cupa-user").val() + ":" + $("#cupa-password").val())
      }
    })
    .done(function(data) {
      console.log("cupa: connected as " + data);
      _onConnected();
    })
    .fail(function() {
      if ($("#cupa-user").val() == "") return;

      $("#cupa-user").focus();
      console.warn("cupa: connection failed");
      alert("Warning: bad username or password");
    });

    $("#cupa-login").fadeOut();
  }

  this.disconnect = function() {
    var xhr = $.ajax({
      type: "POST",
      url: "api/logout.php",
      cache: false,
      headers: {
        "Authorization": "Basic logout"
      }
    })
    .done(function() {
      console.log("cupa: disconnected");
      _onDisconnected();
    });
  }

  this.isAdmin = function() {
    return isAdmin;
  }

  //-------------------------------------------------------------------
  // private methods

  // init

  function _createElements() {
    var pictureForm = $("<form/>", {
      id: "cupa-picture",
      style: "display:none"
    })
    .append($("<input/>", {
      id: "cupa-picture-id",
      name: "id",
      type: "hidden"
    }))
    .append($("<input/>", {
      id: "cupa-picture-width",
      name: "width",
      type: "hidden"
    }))
    .append($("<input/>", {
      id: "cupa-picture-height",
      name: "height",
      type: "hidden"
    }))
    .append($("<input/>", {
      id: "cupa-picture-file",
      name: "file",
      type: "file",
      accept: "Image/*"
    }))
    .appendTo($("body"));
    
    var loginForm = $("<form/>", {
      id: "cupa-login",
      style: "display: none"
    })
    .append($("<label/>", {
      for: "cupa-user"
    }).text(strings.user))
    .append($("<input/>", {
      id: "cupa-user",
      type: "text"
    }))
    .append($("<label/>", {
      for: "cupa-password"
    }).text(strings.password))
    .append($("<input/>", {
      id: "cupa-password",
      type: "password"
    }))
    .append($("<button/>", {
      onclick: "cupa.connect(); return false;"
    }).text(strings.ok))
    .appendTo($("body"));
  }

  function _init() {
    $(".cupa-editable").not(":header img").each(function() {
      this.onkeydown = function(event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          _insertLineBreakAtCursor();
        }
      };
    });

    $(":header.cupa-editable").not("img").each(function() {
      var target = $(this);
      this.onkeydown = function(event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          target.blur();
        }
      };
    });

    // load values
    $(".cupa-editable").not("img").each(function() {
      console.debug("cupa: loading text " + this.id + "...");
      var target = $(this);
      _loadText(target);
    });

    $("img.cupa-editable").each(function() {
      this.src = "data/img-" + this.id + ".jpg";
    });

    $(".cupa-editable").not("img").click(function(event) {
      if (!isAdmin) return;
      var target = $(event.target);
      var isEditable = !(target.attr('contenteditable') == 'true');
      if (isEditable) {
        target.attr('contenteditable', true);
        target.focus();
      }
    });

    $(".cupa-editable").not("img").blur(function(event) {
      if (!isAdmin) return;
      var target = $(event.target);
      target.attr('contenteditable', false);
      _saveText(target);
    });

    $("img.cupa-editable").click(function(event) {
      if (!isAdmin) return;
      var target = $(event.target);
      _editPicture(target);
      event.preventDefault();
    });

    $("#cupa-picture-file").change(function() {
      if (!isAdmin) return;
      _savePicture();
    });

    that.connect();
  }

  function _insertLineBreakAtCursor() {
    var sel, range, html;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);

        // insert line-break instead of selection
        range.deleteContents();
        var newNode = document.createElement("br");
        range.insertNode(newNode);

        // set cursor after line-break
        range.setStartAfter(newNode);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  // connection

  function _onConnected() {
    isAdmin = true;
    $("body").addClass("cupa-admin");
    $(".cupa-notconnected").fadeOut(400, function() {
      $(".cupa-connected").fadeIn();
    });
  }

  function _onDisconnected() {
    isAdmin = false;
    $("body").removeClass("cupa-admin");
    $(".cupa-connected").fadeOut(400, function() {
      $(".cupa-notconnected").fadeIn();
    });
  }

  // persistence

  // .. text

  function _loadText(element) {
    var textId = element.attr("id");
    $.post("api/text.php", { id: textId })
    .done(function(data) {
      if (data == null || data == "") {
        data = "...";
      }
      element.html(data);
    })
    .fail(function() {
      element.html("...");
    });
  }

  function _saveText(element) {
    var textId = element.attr("id");
    var textContent = element.html();

    if (textId == null || textId == "") {
      console.warn("cupa: unidentified editable text");
      return;
    }

    $.post("api/text.php", { id: textId, text: textContent })
    .done(function() {
      _onSaved();
    })
    .fail(function() {
      _onNotSaved();
    });
  }

  // .. pictures

  function _editPicture(element) {
    var specifiedWidth = element.attr("width");
    if (specifiedWidth == null && element[0].style["width"]) {
      specifiedWidth = parseInt(element[0].style["width"]);
    }
    if (specifiedWidth != null) {
      $("#cupa-picture-width").val(specifiedWidth);
    }

    var specifiedHeight = element.attr("height");
    if (specifiedHeight == null && element[0].style["height"]) {
      specifiedHeight = parseInt(element[0].style["height"]);
    }
    if (specifiedHeight != null) {
      $("#cupa-picture-height").val(specifiedHeight);
    }

    $("#cupa-picture-id").val(element.attr("id"));
    $("#cupa-picture-file").focus().trigger("click");
  }

  function _savePicture() {
    $.ajax({
      url: "api/picture.php",
      type: "POST",
      data: new FormData($("#cupa-picture")[0]),
      processData: false,
      contentType: false,
      cache: false
    })
    .done(function() {
      var pictureId = $("#cupa-picture-id").val();
      var picture = $("#" + pictureId);
      picture.removeAttr("src").attr("src", "data/img-" + pictureId + ".jpg?" + new Date().getTime());
      $("#cupa-picture-id").val(null);
      $("#cupa-picture-width").val(null);
      $("#cupa-picture-height").val(null);
      $("#cupa-picture-file").val(null);
      _onSaved();
    })
    .fail(function() {
      _onNotSaved();
    });
  }

  function _onSaved() {
    $(".cupa-saved").fadeIn(800, function() {
      $(".cupa-saved").fadeOut();
    });
  }

  function _onNotSaved() {
    $(".cupa-notsaved").fadeIn(800, function() {
      $(".cupa-notsaved").fadeOut();
    });
  }

  //-------------------------------------------------------------------
  // initialization

  _createElements();
  _init();

}
