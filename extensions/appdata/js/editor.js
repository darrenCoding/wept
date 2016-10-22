! function(e, t) {
  "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.JSONEditor = t() : e.JSONEditor = t()
}(this, function() {
  return function(e) {
    function t(i) {
      if (n[i]) return n[i].exports;
      var o = n[i] = {
        exports: {},
        id: i,
        loaded: !1
      };
      return e[i].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
    }
    var n = {};
    return t.m = e, t.c = n, t.p = "", t(0)
  }([function(e, t, n) {
    "use strict";

    function i(e, t, n) {
      if (!(this instanceof i)) throw new Error('JSONEditor constructor called without "new".');
      var o = l.getInternetExplorerVersion();
      if (-1 != o && 9 > o) throw new Error("Unsupported browser, IE9 or newer required. Please install the newest version of your browser.");
      if (t && (t.error && (console.warn('Option "error" has been renamed to "onError"'), t.onError = t.error, delete t.error), t.change && (console.warn('Option "change" has been renamed to "onChange"'), t.onChange = t.change, delete t.change), t.editable && (console.warn('Option "editable" has been renamed to "onEditable"'), t.onEditable = t.editable, delete t.editable), t)) {
        var r = ["ace", "theme", "ajv", "schema", "onChange", "onEditable", "onError", "onModeChange", "escapeUnicode", "history", "search", "mode", "modes", "name", "indentation", "sortObjectKeys"];
        Object.keys(t).forEach(function(e) {
          -1 === r.indexOf(e) && console.warn('Unknown option "' + e + '". This option will be ignored')
        })
      }
      arguments.length && this._create(e, t, n)
    }
    var o;
    try {
      o = n(! function() {
        var e = new Error('Cannot find module "ajv"');
        throw e.code = "MODULE_NOT_FOUND", e
      }())
    } catch (r) {}
    var s = n(1),
      a = n(12),
      l = n(4);
    i.modes = {}, i.prototype.DEBOUNCE_INTERVAL = 150, i.prototype._create = function(e, t, n) {
      this.container = e, this.options = t || {}, this.json = n || {};
      var i = this.options.mode || "tree";
      this.setMode(i)
    }, i.prototype.destroy = function() {}, i.prototype.set = function(e) {
      this.json = e
    }, i.prototype.get = function() {
      return this.json
    }, i.prototype.setText = function(e) {
      this.json = l.parse(e)
    }, i.prototype.getText = function() {
      return JSON.stringify(this.json)
    }, i.prototype.setName = function(e) {
      this.options || (this.options = {}), this.options.name = e
    }, i.prototype.getName = function() {
      return this.options && this.options.name
    }, i.prototype.setMode = function(e) {
      var t, n, o = this.container,
        r = l.extend({}, this.options),
        s = r.mode;
      r.mode = e;
      var a = i.modes[e];
      if (!a) throw new Error('Unknown mode "' + r.mode + '"');
      try {
        var c = "text" == a.data;
        if (n = this.getName(), t = this[c ? "getText" : "get"](), this.destroy(), l.clear(this), l.extend(this, a.mixin), this.create(o, r), this.setName(n), this[c ? "setText" : "set"](t), "function" == typeof a.load) try {
          a.load.call(this)
        } catch (d) {
          console.error(d)
        }
        if ("function" == typeof r.onModeChange && e !== s) try {
          r.onModeChange(e, s)
        } catch (d) {
          console.error(d)
        }
      } catch (d) {
        this._onError(d)
      }
    }, i.prototype.getMode = function() {
      return this.options.mode
    }, i.prototype._onError = function(e) {
      if (!this.options || "function" != typeof this.options.onError) throw e;
      this.options.onError(e)
    }, i.prototype.setSchema = function(e) {
      if (e) {
        var t;
        try {
          t = this.options.ajv || o({
            allErrors: !0,
            verbose: !0
          })
        } catch (n) {
          console.warn("Failed to create an instance of Ajv, JSON Schema validation is not available. Please use a JSONEditor bundle including Ajv, or pass an instance of Ajv as via the configuration option `ajv`.")
        }
        t && (this.validateSchema = t.compile(e), this.options.schema = e, this.validate()), this.refresh()
      } else this.validateSchema = null, this.options.schema = null, this.validate(), this.refresh()
    }, i.prototype.validate = function() {}, i.prototype.refresh = function() {}, i.registerMode = function(e) {
      var t, n;
      if (l.isArray(e))
        for (t = 0; t < e.length; t++) i.registerMode(e[t]);
      else {
        if (!("mode" in e)) throw new Error('Property "mode" missing');
        if (!("mixin" in e)) throw new Error('Property "mixin" missing');
        if (!("data" in e)) throw new Error('Property "data" missing');
        var o = e.mode;
        if (o in i.modes) throw new Error('Mode "' + o + '" already registered');
        if ("function" != typeof e.mixin.create) throw new Error('Required function "create" missing on mixin');
        var r = ["setMode", "registerMode", "modes"];
        for (t = 0; t < r.length; t++)
          if (n = r[t], n in e.mixin) throw new Error('Reserved property "' + n + '" not allowed in mixin');
        i.modes[o] = e
      }
    }, i.registerMode(s), i.registerMode(a), e.exports = i
  }, function(e, t, n) {
    "use strict";
    var i = n(2),
      o = n(3),
      r = n(6),
      s = n(7),
      a = n(8),
      l = n(11),
      c = n(4),
      d = {};
    d.create = function(e, t) {
      if (!e) throw new Error("No container element provided.");
      this.container = e, this.dom = {}, this.highlighter = new i, this.selection = void 0, this.multiselection = {
        nodes: []
      }, this.validateSchema = null, this.errorNodes = [], this.node = null, this.focusTarget = null, this._setOptions(t), this.options.history && "view" !== this.options.mode && (this.history = new o(this)), this._createFrame(), this._createTable()
    }, d.destroy = function() {
      this.frame && this.container && this.frame.parentNode == this.container && (this.container.removeChild(this.frame), this.frame = null), this.container = null, this.dom = null, this.clear(), this.node = null, this.focusTarget = null, this.selection = null, this.multiselection = null, this.errorNodes = null, this.validateSchema = null, this._debouncedValidate = null, this.history && (this.history.destroy(), this.history = null), this.searchBox && (this.searchBox.destroy(), this.searchBox = null), this.modeSwitcher && (this.modeSwitcher.destroy(), this.modeSwitcher = null)
    }, d._setOptions = function(e) {
      if (this.options = {
          search: !0,
          history: !0,
          mode: "tree",
          name: void 0,
          schema: null
        }, e)
        for (var t in e) e.hasOwnProperty(t) && (this.options[t] = e[t]);
      this.setSchema(this.options.schema), this._debouncedValidate = c.debounce(this.validate.bind(this), this.DEBOUNCE_INTERVAL)
    }, d.set = function(e, t) {
      if (t && (console.warn('Second parameter "name" is deprecated. Use setName(name) instead.'), this.options.name = t), e instanceof Function || void 0 === e) this.clear();
      else {
        this.content.removeChild(this.table);
        var n = {
            field: this.options.name,
            value: e
          },
          i = new a(this, n);
        this._setRoot(i), this.validate();
        var o = !1;
        this.node.expand(o), this.content.appendChild(this.table)
      }
      this.history && this.history.clear(), this.searchBox && this.searchBox.clear()
    }, d.get = function() {
      if (this.focusTarget) {
        var e = a.getNodeFromTarget(this.focusTarget);
        e && e.blur()
      }
      return this.node ? this.node.getValue() : void 0
    }, d.getText = function() {
      return JSON.stringify(this.get())
    }, d.setText = function(e) {
      this.set(c.parse(e))
    }, d.setName = function(e) {
      this.options.name = e, this.node && this.node.updateField(this.options.name)
    }, d.getName = function() {
      return this.options.name
    }, d.focus = function() {
      var e = this.content.querySelector("[contenteditable=true]");
      e ? e.focus() : this.node.dom.expand ? this.node.dom.expand.focus() : this.node.dom.menu ? this.node.dom.menu.focus() : (e = this.frame.querySelector("button"), e && e.focus())
    }, d.clear = function() {
      this.node && (this.node.collapse(), this.tbody.removeChild(this.node.getDom()), delete this.node)
    }, d._setRoot = function(e) {
      this.clear(), this.node = e, this.tbody.appendChild(e.getDom())
    }, d.search = function(e) {
      var t;
      return this.node ? (this.content.removeChild(this.table), t = this.node.search(e), this.content.appendChild(this.table)) : t = [], t
    }, d.expandAll = function() {
      this.node && (this.content.removeChild(this.table), this.node.expand(), this.content.appendChild(this.table))
    }, d.collapseAll = function() {
      this.node && (this.content.removeChild(this.table), this.node.collapse(), this.content.appendChild(this.table))
    }, d._onAction = function(e, t) {
      this.history && this.history.add(e, t), this._onChange()
    }, d._onChange = function() {
      if (this._debouncedValidate(), this.options.onChange) try {
        this.options.onChange()
      } catch (e) {
        console.error("Error in onChange callback: ", e)
      }
    }, d.validate = function() {
      this.errorNodes && this.errorNodes.forEach(function(e) {
        e.setError(null)
      });
      var e = this.node;
      if (e) {
        var t = e.validate(),
          n = [];
        if (this.validateSchema) {
          var i = this.validateSchema(e.getValue());
          i || (n = this.validateSchema.errors.map(function(e) {
            return c.improveSchemaError(e)
          }).map(function(t) {
            return {
              node: e.findNode(t.dataPath),
              error: t
            }
          }).filter(function(e) {
            return null != e.node
          }))
        }
        this.errorNodes = t.concat(n).reduce(function(e, t) {
          return t.node.findParents().map(function(e) {
            return {
              node: e,
              child: t.node,
              error: {
                message: "object" === e.type ? "Contains invalid properties" : "Contains invalid items"
              }
            }
          }).concat(e, [t])
        }, []).map(function(e) {
          return e.node.setError(e.error, e.child), e.node
        })
      }
    }, d.refresh = function() {
      this.node && this.node.updateDom({
        recurse: !0
      })
    }, d.startAutoScroll = function(e) {
      var t = this,
        n = this.content,
        i = c.getAbsoluteTop(n),
        o = n.clientHeight,
        r = i + o,
        s = 24,
        a = 50;
      i + s > e && n.scrollTop > 0 ? this.autoScrollStep = (i + s - e) / 3 : e > r - s && o + n.scrollTop < n.scrollHeight ? this.autoScrollStep = (r - s - e) / 3 : this.autoScrollStep = void 0, this.autoScrollStep ? this.autoScrollTimer || (this.autoScrollTimer = setInterval(function() {
        t.autoScrollStep ? n.scrollTop -= t.autoScrollStep : t.stopAutoScroll()
      }, a)) : this.stopAutoScroll()
    }, d.stopAutoScroll = function() {
      this.autoScrollTimer && (clearTimeout(this.autoScrollTimer), delete this.autoScrollTimer), this.autoScrollStep && delete this.autoScrollStep
    }, d.setSelection = function(e) {
      e && ("scrollTop" in e && this.content && (this.content.scrollTop = e.scrollTop), e.nodes && this.select(e.nodes), e.range && c.setSelectionOffset(e.range), e.dom && e.dom.focus())
    }, d.getSelection = function() {
      var e = c.getSelectionOffset();
      return e && "DIV" !== e.container.nodeName && (e = null), {
        dom: this.focusTarget,
        range: e,
        nodes: this.multiselection.nodes.slice(0),
        scrollTop: this.content ? this.content.scrollTop : 0
      }
    }, d.scrollTo = function(e, t) {
      var n = this.content;
      if (n) {
        var i = this;
        i.animateTimeout && (clearTimeout(i.animateTimeout), delete i.animateTimeout), i.animateCallback && (i.animateCallback(!1), delete i.animateCallback);
        var o = n.clientHeight,
          r = n.scrollHeight - o,
          s = Math.min(Math.max(e - o / 4, 0), r),
          a = function() {
            var e = n.scrollTop,
              o = s - e;
            Math.abs(o) > 3 ? (n.scrollTop += o / 3, i.animateCallback = t, i.animateTimeout = setTimeout(a, 50)) : (t && t(!0), n.scrollTop = s, delete i.animateTimeout, delete i.animateCallback)
          };
        a()
      } else t && t(!1)
    }, d._createFrame = function() {
      function e(e) {
        t._onEvent && t._onEvent(e)
      }
      this.frame = document.createElement("div"), this.frame.className = "jsoneditor jsoneditor-mode-" + this.options.mode, this.container.appendChild(this.frame);
      var t = this;
      this.frame.onclick = function(t) {
        var n = t.target;
        e(t), "BUTTON" == n.nodeName && t.preventDefault()
      }, this.frame.oninput = e, this.frame.onchange = e, this.frame.onkeydown = e, this.frame.onkeyup = e, this.frame.oncut = e, this.frame.onpaste = e, this.frame.onmousedown = e, this.frame.onmouseup = e, this.frame.onmouseover = e, this.frame.onmouseout = e, c.addEventListener(this.frame, "focus", e, !0), c.addEventListener(this.frame, "blur", e, !0), this.frame.onfocusin = e, this.frame.onfocusout = e, this.menu = document.createElement("div"), this.menu.className = "jsoneditor-menu", this.frame.appendChild(this.menu);
      var n = document.createElement("button");
      n.className = "jsoneditor-expand-all", n.title = "Expand all fields", n.onclick = function() {
        t.expandAll()
      }, this.menu.appendChild(n);
      var i = document.createElement("button");
      if (i.title = "Collapse all fields", i.className = "jsoneditor-collapse-all", i.onclick = function() {
          t.collapseAll()
        }, this.menu.appendChild(i), this.history) {
        var o = document.createElement("button");
        o.className = "jsoneditor-undo jsoneditor-separator", o.title = "Undo last action (Ctrl+Z)", o.onclick = function() {
          t._onUndo()
        }, this.menu.appendChild(o), this.dom.undo = o;
        var s = document.createElement("button");
        s.className = "jsoneditor-redo", s.title = "Redo (Ctrl+Shift+Z)", s.onclick = function() {
          t._onRedo()
        }, this.menu.appendChild(s), this.dom.redo = s, this.history.onChange = function() {
          o.disabled = !t.history.canUndo(), s.disabled = !t.history.canRedo()
        }, this.history.onChange()
      }
      if (this.options && this.options.modes && this.options.modes.length) {
        var a = this;
        this.modeSwitcher = new l(this.menu, this.options.modes, this.options.mode, function(e) {
          a.modeSwitcher.destroy(), a.setMode(e), a.modeSwitcher.focus()
        })
      }
      this.options.search && (this.searchBox = new r(this, this.menu))
    }, d._onUndo = function() {
      this.history && (this.history.undo(), this._onChange())
    }, d._onRedo = function() {
      this.history && (this.history.redo(), this._onChange())
    }, d._onEvent = function(e) {
      "keydown" == e.type && this._onKeyDown(e), "focus" == e.type && (this.focusTarget = e.target), "mousedown" == e.type && this._startDragDistance(e), "mousemove" != e.type && "mouseup" != e.type && "click" != e.type || this._updateDragDistance(e);
      var t = a.getNodeFromTarget(e.target);
      if (t && t.selected) {
        if ("click" == e.type) {
          if (e.target == t.dom.menu) return void this.showContextMenu(e.target);
          e.hasMoved || this.deselect()
        }
        "mousedown" == e.type && a.onDragStart(this.multiselection.nodes, e)
      } else "mousedown" == e.type && (this.deselect(), t && e.target == t.dom.drag ? a.onDragStart(t, e) : (!t || e.target != t.dom.field && e.target != t.dom.value && e.target != t.dom.select) && this._onMultiSelectStart(e));
      t && t.onEvent(e)
    }, d._startDragDistance = function(e) {
      this.dragDistanceEvent = {
        initialTarget: e.target,
        initialPageX: e.pageX,
        initialPageY: e.pageY,
        dragDistance: 0,
        hasMoved: !1
      }
    }, d._updateDragDistance = function(e) {
      this.dragDistanceEvent || this._startDragDistance(e);
      var t = e.pageX - this.dragDistanceEvent.initialPageX,
        n = e.pageY - this.dragDistanceEvent.initialPageY;
      return this.dragDistanceEvent.dragDistance = Math.sqrt(t * t + n * n), this.dragDistanceEvent.hasMoved = this.dragDistanceEvent.hasMoved || this.dragDistanceEvent.dragDistance > 10, e.dragDistance = this.dragDistanceEvent.dragDistance, e.hasMoved = this.dragDistanceEvent.hasMoved, e.dragDistance
    }, d._onMultiSelectStart = function(e) {
      var t = a.getNodeFromTarget(e.target);
      if ("tree" === this.options.mode && void 0 === this.options.onEditable) {
        this.multiselection = {
          start: t || null,
          end: null,
          nodes: []
        }, this._startDragDistance(e);
        var n = this;
        this.mousemove || (this.mousemove = c.addEventListener(window, "mousemove", function(e) {
          n._onMultiSelect(e)
        })), this.mouseup || (this.mouseup = c.addEventListener(window, "mouseup", function(e) {
          n._onMultiSelectEnd(e)
        }))
      }
    }, d._onMultiSelect = function(e) {
      if (e.preventDefault(), this._updateDragDistance(e), e.hasMoved) {
        var t = a.getNodeFromTarget(e.target);
        t && (null == this.multiselection.start && (this.multiselection.start = t), this.multiselection.end = t), this.deselect();
        var n = this.multiselection.start,
          i = this.multiselection.end || this.multiselection.start;
        n && i && (this.multiselection.nodes = this._findTopLevelNodes(n, i), this.select(this.multiselection.nodes))
      }
    }, d._onMultiSelectEnd = function(e) {
      this.multiselection.nodes[0] && this.multiselection.nodes[0].dom.menu.focus(), this.multiselection.start = null, this.multiselection.end = null, this.mousemove && (c.removeEventListener(window, "mousemove", this.mousemove), delete this.mousemove), this.mouseup && (c.removeEventListener(window, "mouseup", this.mouseup), delete this.mouseup)
    }, d.deselect = function(e) {
      this.multiselection.nodes.forEach(function(e) {
        e.setSelected(!1)
      }), this.multiselection.nodes = [], e && (this.multiselection.start = null, this.multiselection.end = null)
    }, d.select = function(e) {
      if (!Array.isArray(e)) return this.select([e]);
      if (e) {
        this.deselect(), this.multiselection.nodes = e.slice(0);
        var t = e[0];
        e.forEach(function(e) {
          e.setSelected(!0, e === t)
        })
      }
    }, d._findTopLevelNodes = function(e, t) {
      for (var n = e.getNodePath(), i = t.getNodePath(), o = 0; o < n.length && n[o] === i[o];) o++;
      var r = n[o - 1],
        s = n[o],
        a = i[o];
      if (s && a || (r.parent ? (s = r, a = r, r = r.parent) : (s = r.childs[0], a = r.childs[r.childs.length - 1])), r && s && a) {
        var l = r.childs.indexOf(s),
          c = r.childs.indexOf(a),
          d = Math.min(l, c),
          h = Math.max(l, c);
        return r.childs.slice(d, h + 1)
      }
      return []
    }, d._onKeyDown = function(e) {
      var t = e.which || e.keyCode,
        n = e.ctrlKey,
        i = e.shiftKey,
        o = !1;
      if (9 == t) {
        var r = this;
        setTimeout(function() {
          c.selectContentEditable(r.focusTarget)
        }, 0)
      }
      if (this.searchBox)
        if (n && 70 == t) this.searchBox.dom.search.focus(), this.searchBox.dom.search.select(), o = !0;
        else if (114 == t || n && 71 == t) {
        var s = !0;
        i ? this.searchBox.previous(s) : this.searchBox.next(s), o = !0
      }
      this.history && (n && !i && 90 == t ? (this._onUndo(), o = !0) : n && i && 90 == t && (this._onRedo(), o = !0)), o && (e.preventDefault(), e.stopPropagation())
    }, d._createTable = function() {
      var e = document.createElement("div");
      e.className = "jsoneditor-outer", this.contentOuter = e, this.content = document.createElement("div"), this.content.className = "jsoneditor-tree", e.appendChild(this.content), this.table = document.createElement("table"), this.table.className = "jsoneditor-tree", this.content.appendChild(this.table);
      var t;
      this.colgroupContent = document.createElement("colgroup"), "tree" === this.options.mode && (t = document.createElement("col"), t.width = "24px", this.colgroupContent.appendChild(t)), t = document.createElement("col"), t.width = "24px", this.colgroupContent.appendChild(t), t = document.createElement("col"), this.colgroupContent.appendChild(t), this.table.appendChild(this.colgroupContent), this.tbody = document.createElement("tbody"), this.table.appendChild(this.tbody), this.frame.appendChild(e)
    }, d.showContextMenu = function(e, t) {
      var n = [],
        i = this;
      n.push({
        text: "Duplicate",
        title: "Duplicate selected fields (Ctrl+D)",
        className: "jsoneditor-duplicate",
        click: function() {
          a.onDuplicate(i.multiselection.nodes)
        }
      }), n.push({
        text: "Remove",
        title: "Remove selected fields (Ctrl+Del)",
        className: "jsoneditor-remove",
        click: function() {
          a.onRemove(i.multiselection.nodes)
        }
      });
      var o = new s(n, {
        close: t
      });
      o.show(e, this.content)
    }, e.exports = [{
      mode: "tree",
      mixin: d,
      data: "json"
    }, {
      mode: "view",
      mixin: d,
      data: "json"
    }, {
      mode: "form",
      mixin: d,
      data: "json"
    }]
  }, function(e, t) {
    "use strict";

    function n() {
      this.locked = !1
    }
    n.prototype.highlight = function(e) {
      this.locked || (this.node != e && (this.node && this.node.setHighlight(!1), this.node = e, this.node.setHighlight(!0)), this._cancelUnhighlight())
    }, n.prototype.unhighlight = function() {
      if (!this.locked) {
        var e = this;
        this.node && (this._cancelUnhighlight(), this.unhighlightTimer = setTimeout(function() {
          e.node.setHighlight(!1), e.node = void 0, e.unhighlightTimer = void 0
        }, 0))
      }
    }, n.prototype._cancelUnhighlight = function() {
      this.unhighlightTimer && (clearTimeout(this.unhighlightTimer), this.unhighlightTimer = void 0)
    }, n.prototype.lock = function() {
      this.locked = !0
    }, n.prototype.unlock = function() {
      this.locked = !1
    }, e.exports = n
  }, function(e, t, n) {
    "use strict";

    function i(e) {
      this.editor = e, this.history = [], this.index = -1, this.clear(), this.actions = {
        editField: {
          undo: function(e) {
            e.node.updateField(e.oldValue)
          },
          redo: function(e) {
            e.node.updateField(e.newValue)
          }
        },
        editValue: {
          undo: function(e) {
            e.node.updateValue(e.oldValue)
          },
          redo: function(e) {
            e.node.updateValue(e.newValue)
          }
        },
        changeType: {
          undo: function(e) {
            e.node.changeType(e.oldType)
          },
          redo: function(e) {
            e.node.changeType(e.newType)
          }
        },
        appendNodes: {
          undo: function(e) {
            e.nodes.forEach(function(t) {
              e.parent.removeChild(t)
            })
          },
          redo: function(e) {
            e.nodes.forEach(function(t) {
              e.parent.appendChild(t)
            })
          }
        },
        insertBeforeNodes: {
          undo: function(e) {
            e.nodes.forEach(function(t) {
              e.parent.removeChild(t)
            })
          },
          redo: function(e) {
            e.nodes.forEach(function(t) {
              e.parent.insertBefore(t, e.beforeNode)
            })
          }
        },
        insertAfterNodes: {
          undo: function(e) {
            e.nodes.forEach(function(t) {
              e.parent.removeChild(t)
            })
          },
          redo: function(e) {
            var t = e.afterNode;
            e.nodes.forEach(function(n) {
              e.parent.insertAfter(e.node, t), t = n
            })
          }
        },
        removeNodes: {
          undo: function(e) {
            var t = e.parent,
              n = t.childs[e.index] || t.append;
            e.nodes.forEach(function(e) {
              t.insertBefore(e, n)
            })
          },
          redo: function(e) {
            e.nodes.forEach(function(t) {
              e.parent.removeChild(t)
            })
          }
        },
        duplicateNodes: {
          undo: function(e) {
            e.nodes.forEach(function(t) {
              e.parent.removeChild(t)
            })
          },
          redo: function(e) {
            var t = e.afterNode;
            e.nodes.forEach(function(n) {
              e.parent.insertAfter(n, t), t = n
            })
          }
        },
        moveNodes: {
          undo: function(e) {
            e.nodes.forEach(function(t) {
              e.oldBeforeNode.parent.moveBefore(t, e.oldBeforeNode)
            })
          },
          redo: function(e) {
            e.nodes.forEach(function(t) {
              e.newBeforeNode.parent.moveBefore(t, e.newBeforeNode)
            })
          }
        },
        sort: {
          undo: function(e) {
            var t = e.node;
            t.hideChilds(), t.sort = e.oldSort, t.childs = e.oldChilds, t.showChilds()
          },
          redo: function(e) {
            var t = e.node;
            t.hideChilds(), t.sort = e.newSort, t.childs = e.newChilds, t.showChilds()
          }
        }
      }
    }
    n(4);
    i.prototype.onChange = function() {}, i.prototype.add = function(e, t) {
      this.index++, this.history[this.index] = {
        action: e,
        params: t,
        timestamp: new Date
      }, this.index < this.history.length - 1 && this.history.splice(this.index + 1, this.history.length - this.index - 1), this.onChange()
    }, i.prototype.clear = function() {
      this.history = [], this.index = -1, this.onChange()
    }, i.prototype.canUndo = function() {
      return this.index >= 0
    }, i.prototype.canRedo = function() {
      return this.index < this.history.length - 1
    }, i.prototype.undo = function() {
      if (this.canUndo()) {
        var e = this.history[this.index];
        if (e) {
          var t = this.actions[e.action];
          t && t.undo ? (t.undo(e.params), e.params.oldSelection && this.editor.setSelection(e.params.oldSelection)) : console.error(new Error('unknown action "' + e.action + '"'))
        }
        this.index--, this.onChange()
      }
    }, i.prototype.redo = function() {
      if (this.canRedo()) {
        this.index++;
        var e = this.history[this.index];
        if (e) {
          var t = this.actions[e.action];
          t && t.redo ? (t.redo(e.params), e.params.newSelection && this.editor.setSelection(e.params.newSelection)) : console.error(new Error('unknown action "' + e.action + '"'))
        }
        this.onChange()
      }
    }, i.prototype.destroy = function() {
      this.editor = null, this.history = [], this.index = -1
    }, e.exports = i
  }, function(e, t, n) {
    "use strict";
    var i = n(5);
    t.parse = function(e) {
      try {
        return JSON.parse(e)
      } catch (n) {
        throw t.validate(e), n
      }
    }, t.sanitize = function(e) {
      function t() {
        return e.charAt(d)
      }

      function n() {
        return e.charAt(d + 1)
      }

      function i() {
        return e.charAt(d - 1)
      }

      function o() {
        for (var e = c.length - 1; e >= 0;) {
          var t = c[e];
          if (" " !== t && "\n" !== t && "\r" !== t && "  " !== t) return t;
          e--
        }
        return ""
      }

      function r() {
        for (d += 2; d < e.length && ("*" !== t() || "/" !== n());) d++;
        d += 2
      }

      function s() {
        for (d += 2; d < e.length && "\n" !== t();) d++
      }

      function a(n) {
        c.push('"'), d++;
        for (var o = t(); d < e.length && o !== n;) '"' === o && "\\" !== i() && c.push("\\"), "\\" === o && (d++, o = t(), "'" !== o && c.push("\\")), c.push(o), d++, o = t();
        o === n && (c.push('"'), d++)
      }

      function l() {
        for (var e = ["null", "true", "false"], n = "", i = t(), o = /[a-zA-Z_$\d]/; o.test(i);) n += i, d++, i = t(); - 1 === e.indexOf(n) ? c.push('"' + n + '"') : c.push(n)
      }
      var c = [],
        d = 0,
        h = e.match(/^\s*(\/\*(.|[\r\n])*?\*\/)?\s*[\da-zA-Z_$]+\s*\(([\s\S]*)\)\s*;?\s*$/);
      for (h && (e = h[3]); d < e.length;) {
        var u = t();
        "/" === u && "*" === n() ? r() : "/" === u && "/" === n() ? s() : "'" === u || '"' === u ? a(u) : /[a-zA-Z_$]/.test(u) && -1 !== ["{", ","].indexOf(o()) ? l() : (c.push(u), d++)
      }
      return c.join("")
    }, t.escapeUnicodeChars = function(e) {
      return e.replace(/[\u007F-\uFFFF]/g, function(e) {
        return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
      })
    }, t.validate = function(e) {
      "undefined" != typeof i ? i.parse(e) : JSON.parse(e)
    }, t.extend = function(e, t) {
      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
      return e
    }, t.clear = function(e) {
      for (var t in e) e.hasOwnProperty(t) && delete e[t];
      return e
    }, t.type = function(e) {
      return null === e ? "null" : void 0 === e ? "undefined" : e instanceof Number || "number" == typeof e ? "number" : e instanceof String || "string" == typeof e ? "string" : e instanceof Boolean || "boolean" == typeof e ? "boolean" : e instanceof RegExp || "regexp" == typeof e ? "regexp" : t.isArray(e) ? "array" : "object"
    };
    var o = /^https?:\/\/\S+$/;
    t.isUrl = function(e) {
      return ("string" == typeof e || e instanceof String) && o.test(e)
    }, t.isArray = function(e) {
      return "[object Array]" === Object.prototype.toString.call(e)
    }, t.getAbsoluteLeft = function(e) {
      var t = e.getBoundingClientRect();
      return t.left + window.pageXOffset || document.scrollLeft || 0
    }, t.getAbsoluteTop = function(e) {
      var t = e.getBoundingClientRect();
      return t.top + window.pageYOffset || document.scrollTop || 0
    }, t.addClassName = function(e, t) {
      var n = e.className.split(" "); - 1 == n.indexOf(t) && (n.push(t), e.className = n.join(" "))
    }, t.removeClassName = function(e, t) {
      var n = e.className.split(" "),
        i = n.indexOf(t); - 1 != i && (n.splice(i, 1), e.className = n.join(" "))
    }, t.stripFormatting = function(e) {
      for (var n = e.childNodes, i = 0, o = n.length; o > i; i++) {
        var r = n[i];
        r.style && r.removeAttribute("style");
        var s = r.attributes;
        if (s)
          for (var a = s.length - 1; a >= 0; a--) {
            var l = s[a];
            l.specified === !0 && r.removeAttribute(l.name)
          }
        t.stripFormatting(r)
      }
    }, t.setEndOfContentEditable = function(e) {
      var t, n;
      document.createRange && (t = document.createRange(), t.selectNodeContents(e), t.collapse(!1), n = window.getSelection(), n.removeAllRanges(), n.addRange(t))
    }, t.selectContentEditable = function(e) {
      if (e && "DIV" == e.nodeName) {
        var t, n;
        window.getSelection && document.createRange && (n = document.createRange(), n.selectNodeContents(e), t = window.getSelection(), t.removeAllRanges(), t.addRange(n))
      }
    }, t.getSelection = function() {
      if (window.getSelection) {
        var e = window.getSelection();
        if (e.getRangeAt && e.rangeCount) return e.getRangeAt(0)
      }
      return null
    }, t.setSelection = function(e) {
      if (e && window.getSelection) {
        var t = window.getSelection();
        t.removeAllRanges(), t.addRange(e)
      }
    }, t.getSelectionOffset = function() {
      var e = t.getSelection();
      return e && "startOffset" in e && "endOffset" in e && e.startContainer && e.startContainer == e.endContainer ? {
        startOffset: e.startOffset,
        endOffset: e.endOffset,
        container: e.startContainer.parentNode
      } : null
    }, t.setSelectionOffset = function(e) {
      if (document.createRange && window.getSelection) {
        var n = window.getSelection();
        if (n) {
          var i = document.createRange();
          e.container.firstChild || e.container.appendChild(document.createTextNode("")), i.setStart(e.container.firstChild, e.startOffset), i.setEnd(e.container.firstChild, e.endOffset), t.setSelection(i)
        }
      }
    }, t.getInnerText = function(e, n) {
      var i = void 0 == n;
      if (i && (n = {
          text: "",
          flush: function() {
            var e = this.text;
            return this.text = "", e
          },
          set: function(e) {
            this.text = e
          }
        }), e.nodeValue) return n.flush() + e.nodeValue;
      if (e.hasChildNodes()) {
        for (var o = e.childNodes, r = "", s = 0, a = o.length; a > s; s++) {
          var l = o[s];
          if ("DIV" == l.nodeName || "P" == l.nodeName) {
            var c = o[s - 1],
              d = c ? c.nodeName : void 0;
            d && "DIV" != d && "P" != d && "BR" != d && (r += "\n", n.flush()), r += t.getInnerText(l, n), n.set("\n")
          } else "BR" == l.nodeName ? (r += n.flush(), n.set("\n")) : r += t.getInnerText(l, n)
        }
        return r
      }
      return "P" == e.nodeName && -1 != t.getInternetExplorerVersion() ? n.flush() : ""
    }, t.getInternetExplorerVersion = function() {
      if (-1 == r) {
        var e = -1;
        if ("Microsoft Internet Explorer" == navigator.appName) {
          var t = navigator.userAgent,
            n = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
          null != n.exec(t) && (e = parseFloat(RegExp.$1))
        }
        r = e
      }
      return r
    }, t.isFirefox = function() {
      return -1 != navigator.userAgent.indexOf("Firefox")
    };
    var r = -1;
    t.addEventListener = function(e, n, i, o) {
      if (e.addEventListener) return void 0 === o && (o = !1), "mousewheel" === n && t.isFirefox() && (n = "DOMMouseScroll"), e.addEventListener(n, i, o), i;
      if (e.attachEvent) {
        var r = function() {
          return i.call(e, window.event)
        };
        return e.attachEvent("on" + n, r), r
      }
    }, t.removeEventListener = function(e, n, i, o) {
      e.removeEventListener ? (void 0 === o && (o = !1), "mousewheel" === n && t.isFirefox() && (n = "DOMMouseScroll"), e.removeEventListener(n, i, o)) : e.detachEvent && e.detachEvent("on" + n, i)
    }, t.parsePath = function s(e) {
      var t, n;
      if (0 === e.length) return [];
      var i = e.match(/^\.(\w+)/);
      if (i) t = i[1], n = e.substr(t.length + 1);
      else {
        if ("[" !== e[0]) throw new SyntaxError("Failed to parse path");
        var o = e.indexOf("]");
        if (-1 === o) throw new SyntaxError("Character ] expected in path");
        if (1 === o) throw new SyntaxError("Index expected after [");
        var r = e.substring(1, o);
        t = "*" === r ? r : JSON.parse(r), n = e.substr(o + 1)
      }
      return [t].concat(s(n))
    }, t.improveSchemaError = function(e) {
      if ("enum" === e.keyword && Array.isArray(e.schema)) {
        var t = e.schema;
        if (t) {
          if (t = t.map(function(e) {
              return JSON.stringify(e)
            }), t.length > 5) {
            var n = ["(" + (t.length - 5) + " more...)"];
            t = t.slice(0, 5), t.push(n)
          }
          e.message = "should be equal to one of: " + t.join(", ")
        }
      }
      return "additionalProperties" === e.keyword && (e.message = "should NOT have additional property: " + e.params.additionalProperty), e
    }, t.insideRect = function(e, t, n) {
      var i = void 0 !== n ? n : 0;
      return t.left - i >= e.left && t.right + i <= e.right && t.top - i >= e.top && t.bottom + i <= e.bottom
    }, t.debounce = function(e, t, n) {
      var i;
      return function() {
        var o = this,
          r = arguments,
          s = function() {
            i = null, n || e.apply(o, r)
          },
          a = n && !i;
        clearTimeout(i), i = setTimeout(s, t), a && e.apply(o, r)
      }
    }, t.textDiff = function(e, t) {
      for (var n = t.length, i = 0, o = e.length, r = t.length; t.charAt(i) === e.charAt(i) && n > i;) i++;
      for (; t.charAt(r - 1) === e.charAt(o - 1) && r > i && o > 0;) r--, o--;
      return {
        start: i,
        end: r
      }
    }
  }, function(e, t, n) {
    var i = function() {
      var e = {
          trace: function() {},
          yy: {},
          symbols_: {
            error: 2,
            JSONString: 3,
            STRING: 4,
            JSONNumber: 5,
            NUMBER: 6,
            JSONNullLiteral: 7,
            NULL: 8,
            JSONBooleanLiteral: 9,
            TRUE: 10,
            FALSE: 11,
            JSONText: 12,
            JSONValue: 13,
            EOF: 14,
            JSONObject: 15,
            JSONArray: 16,
            "{": 17,
            "}": 18,
            JSONMemberList: 19,
            JSONMember: 20,
            ":": 21,
            ",": 22,
            "[": 23,
            "]": 24,
            JSONElementList: 25,
            $accept: 0,
            $end: 1
          },
          terminals_: {
            2: "error",
            4: "STRING",
            6: "NUMBER",
            8: "NULL",
            10: "TRUE",
            11: "FALSE",
            14: "EOF",
            17: "{",
            18: "}",
            21: ":",
            22: ",",
            23: "[",
            24: "]"
          },
          productions_: [0, [3, 1],
            [5, 1],
            [7, 1],
            [9, 1],
            [9, 1],
            [12, 2],
            [13, 1],
            [13, 1],
            [13, 1],
            [13, 1],
            [13, 1],
            [13, 1],
            [15, 2],
            [15, 3],
            [20, 3],
            [19, 1],
            [19, 3],
            [16, 2],
            [16, 3],
            [25, 1],
            [25, 3]
          ],
          performAction: function(e, t, n, i, o, r, s) {
            var a = r.length - 1;
            switch (o) {
              case 1:
                this.$ = e.replace(/\\(\\|")/g, "$1").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "  ").replace(/\\v/g, "\x0B").replace(/\\f/g, "\f").replace(/\\b/g, "\b");
                break;
              case 2:
                this.$ = Number(e);
                break;
              case 3:
                this.$ = null;
                break;
              case 4:
                this.$ = !0;
                break;
              case 5:
                this.$ = !1;
                break;
              case 6:
                return this.$ = r[a - 1];
              case 13:
                this.$ = {};
                break;
              case 14:
                this.$ = r[a - 1];
                break;
              case 15:
                this.$ = [r[a - 2], r[a]];
                break;
              case 16:
                this.$ = {}, this.$[r[a][0]] = r[a][1];
                break;
              case 17:
                this.$ = r[a - 2], r[a - 2][r[a][0]] = r[a][1];
                break;
              case 18:
                this.$ = [];
                break;
              case 19:
                this.$ = r[a - 1];
                break;
              case 20:
                this.$ = [r[a]];
                break;
              case 21:
                this.$ = r[a - 2], r[a - 2].push(r[a])
            }
          },
          table: [{
            3: 5,
            4: [1, 12],
            5: 6,
            6: [1, 13],
            7: 3,
            8: [1, 9],
            9: 4,
            10: [1, 10],
            11: [1, 11],
            12: 1,
            13: 2,
            15: 7,
            16: 8,
            17: [1, 14],
            23: [1, 15]
          }, {
            1: [3]
          }, {
            14: [1, 16]
          }, {
            14: [2, 7],
            18: [2, 7],
            22: [2, 7],
            24: [2, 7]
          }, {
            14: [2, 8],
            18: [2, 8],
            22: [2, 8],
            24: [2, 8]
          }, {
            14: [2, 9],
            18: [2, 9],
            22: [2, 9],
            24: [2, 9]
          }, {
            14: [2, 10],
            18: [2, 10],
            22: [2, 10],
            24: [2, 10]
          }, {
            14: [2, 11],
            18: [2, 11],
            22: [2, 11],
            24: [2, 11]
          }, {
            14: [2, 12],
            18: [2, 12],
            22: [2, 12],
            24: [2, 12]
          }, {
            14: [2, 3],
            18: [2, 3],
            22: [2, 3],
            24: [2, 3]
          }, {
            14: [2, 4],
            18: [2, 4],
            22: [2, 4],
            24: [2, 4]
          }, {
            14: [2, 5],
            18: [2, 5],
            22: [2, 5],
            24: [2, 5]
          }, {
            14: [2, 1],
            18: [2, 1],
            21: [2, 1],
            22: [2, 1],
            24: [2, 1]
          }, {
            14: [2, 2],
            18: [2, 2],
            22: [2, 2],
            24: [2, 2]
          }, {
            3: 20,
            4: [1, 12],
            18: [1, 17],
            19: 18,
            20: 19
          }, {
            3: 5,
            4: [1, 12],
            5: 6,
            6: [1, 13],
            7: 3,
            8: [1, 9],
            9: 4,
            10: [1, 10],
            11: [1, 11],
            13: 23,
            15: 7,
            16: 8,
            17: [1, 14],
            23: [1, 15],
            24: [1, 21],
            25: 22
          }, {
            1: [2, 6]
          }, {
            14: [2, 13],
            18: [2, 13],
            22: [2, 13],
            24: [2, 13]
          }, {
            18: [1, 24],
            22: [1, 25]
          }, {
            18: [2, 16],
            22: [2, 16]
          }, {
            21: [1, 26]
          }, {
            14: [2, 18],
            18: [2, 18],
            22: [2, 18],
            24: [2, 18]
          }, {
            22: [1, 28],
            24: [1, 27]
          }, {
            22: [2, 20],
            24: [2, 20]
          }, {
            14: [2, 14],
            18: [2, 14],
            22: [2, 14],
            24: [2, 14]
          }, {
            3: 20,
            4: [1, 12],
            20: 29
          }, {
            3: 5,
            4: [1, 12],
            5: 6,
            6: [1, 13],
            7: 3,
            8: [1, 9],
            9: 4,
            10: [1, 10],
            11: [1, 11],
            13: 30,
            15: 7,
            16: 8,
            17: [1, 14],
            23: [1, 15]
          }, {
            14: [2, 19],
            18: [2, 19],
            22: [2, 19],
            24: [2, 19]
          }, {
            3: 5,
            4: [1, 12],
            5: 6,
            6: [1, 13],
            7: 3,
            8: [1, 9],
            9: 4,
            10: [1, 10],
            11: [1, 11],
            13: 31,
            15: 7,
            16: 8,
            17: [1, 14],
            23: [1, 15]
          }, {
            18: [2, 17],
            22: [2, 17]
          }, {
            18: [2, 15],
            22: [2, 15]
          }, {
            22: [2, 21],
            24: [2, 21]
          }],
          defaultActions: {
            16: [2, 6]
          },
          parseError: function(e, t) {
            throw new Error(e)
          },
          parse: function(e) {
            function t(e) {
              o.length = o.length - 2 * e, r.length = r.length - e, s.length = s.length - e
            }

            function n() {
              var e;
              return e = i.lexer.lex() || 1, "number" != typeof e && (e = i.symbols_[e] || e), e
            }
            var i = this,
              o = [0],
              r = [null],
              s = [],
              a = this.table,
              l = "",
              c = 0,
              d = 0,
              h = 0,
              u = 2,
              p = 1;
            this.lexer.setInput(e), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});
            var f = this.lexer.yylloc;
            s.push(f), "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
            for (var m, g, v, y, b, w, x, _, E, C = {};;) {
              if (v = o[o.length - 1], this.defaultActions[v] ? y = this.defaultActions[v] : (null == m && (m = n()), y = a[v] && a[v][m]), "undefined" == typeof y || !y.length || !y[0]) {
                if (!h) {
                  E = [];
                  for (w in a[v]) this.terminals_[w] && w > 2 && E.push("'" + this.terminals_[w] + "'");
                  var S = "";
                  S = this.lexer.showPosition ? "Parse error on line " + (c + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + E.join(", ") + ", got '" + this.terminals_[m] + "'" : "Parse error on line " + (c + 1) + ": Unexpected " + (1 == m ? "end of input" : "'" + (this.terminals_[m] || m) + "'"), this.parseError(S, {
                    text: this.lexer.match,
                    token: this.terminals_[m] || m,
                    line: this.lexer.yylineno,
                    loc: f,
                    expected: E
                  })
                }
                if (3 == h) {
                  if (m == p) throw new Error(S || "Parsing halted.");
                  d = this.lexer.yyleng, l = this.lexer.yytext, c = this.lexer.yylineno, f = this.lexer.yylloc, m = n()
                }
                for (;;) {
                  if (u.toString() in a[v]) break;
                  if (0 == v) throw new Error(S || "Parsing halted.");
                  t(1), v = o[o.length - 1]
                }
                g = m, m = u, v = o[o.length - 1], y = a[v] && a[v][u], h = 3
              }
              if (y[0] instanceof Array && y.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + v + ", token: " + m);
              switch (y[0]) {
                case 1:
                  o.push(m), r.push(this.lexer.yytext), s.push(this.lexer.yylloc), o.push(y[1]), m = null, g ? (m = g, g = null) : (d = this.lexer.yyleng, l = this.lexer.yytext, c = this.lexer.yylineno, f = this.lexer.yylloc, h > 0 && h--);
                  break;
                case 2:
                  if (x = this.productions_[y[1]][1], C.$ = r[r.length - x], C._$ = {
                      first_line: s[s.length - (x || 1)].first_line,
                      last_line: s[s.length - 1].last_line,
                      first_column: s[s.length - (x || 1)].first_column,
                      last_column: s[s.length - 1].last_column
                    }, b = this.performAction.call(C, l, d, c, this.yy, y[1], r, s), "undefined" != typeof b) return b;
                  x && (o = o.slice(0, -1 * x * 2), r = r.slice(0, -1 * x), s = s.slice(0, -1 * x)), o.push(this.productions_[y[1]][0]), r.push(C.$), s.push(C._$), _ = a[o[o.length - 2]][o[o.length - 1]], o.push(_);
                  break;
                case 3:
                  return !0
              }
            }
            return !0
          }
        },
        t = function() {
          var e = {
            EOF: 1,
            parseError: function(e, t) {
              if (!this.yy.parseError) throw new Error(e);
              this.yy.parseError(e, t)
            },
            setInput: function(e) {
              return this._input = e, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
                first_line: 1,
                first_column: 0,
                last_line: 1,
                last_column: 0
              }, this
            },
            input: function() {
              var e = this._input[0];
              this.yytext += e, this.yyleng++, this.match += e, this.matched += e;
              var t = e.match(/\n/);
              return t && this.yylineno++, this._input = this._input.slice(1), e
            },
            unput: function(e) {
              return this._input = e + this._input, this
            },
            more: function() {
              return this._more = !0, this
            },
            less: function(e) {
              this._input = this.match.slice(e) + this._input
            },
            pastInput: function() {
              var e = this.matched.substr(0, this.matched.length - this.match.length);
              return (e.length > 20 ? "..." : "") + e.substr(-20).replace(/\n/g, "")
            },
            upcomingInput: function() {
              var e = this.match;
              return e.length < 20 && (e += this._input.substr(0, 20 - e.length)), (e.substr(0, 20) + (e.length > 20 ? "..." : "")).replace(/\n/g, "")
            },
            showPosition: function() {
              var e = this.pastInput(),
                t = new Array(e.length + 1).join("-");
              return e + this.upcomingInput() + "\n" + t + "^"
            },
            next: function() {
              if (this.done) return this.EOF;
              this._input || (this.done = !0);
              var e, t, n, i, o;
              this._more || (this.yytext = "", this.match = "");
              for (var r = this._currentRules(), s = 0; s < r.length && (n = this._input.match(this.rules[r[s]]), !n || t && !(n[0].length > t[0].length) || (t = n, i = s, this.options.flex)); s++);
              return t ? (o = t[0].match(/\n.*/g), o && (this.yylineno += o.length), this.yylloc = {
                first_line: this.yylloc.last_line,
                last_line: this.yylineno + 1,
                first_column: this.yylloc.last_column,
                last_column: o ? o[o.length - 1].length - 1 : this.yylloc.last_column + t[0].length
              }, this.yytext += t[0], this.match += t[0], this.yyleng = this.yytext.length, this._more = !1, this._input = this._input.slice(t[0].length), this.matched += t[0], e = this.performAction.call(this, this.yy, this, r[i], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), e ? e : void 0) : "" === this._input ? this.EOF : void this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
              })
            },
            lex: function() {
              var e = this.next();
              return "undefined" != typeof e ? e : this.lex()
            },
            begin: function(e) {
              this.conditionStack.push(e)
            },
            popState: function() {
              return this.conditionStack.pop()
            },
            _currentRules: function() {
              return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            },
            topState: function() {
              return this.conditionStack[this.conditionStack.length - 2]
            },
            pushState: function(e) {
              this.begin(e)
            }
          };
          return e.options = {}, e.performAction = function(e, t, n, i) {
            switch (n) {
              case 0:
                break;
              case 1:
                return 6;
              case 2:
                return t.yytext = t.yytext.substr(1, t.yyleng - 2), 4;
              case 3:
                return 17;
              case 4:
                return 18;
              case 5:
                return 23;
              case 6:
                return 24;
              case 7:
                return 22;
              case 8:
                return 21;
              case 9:
                return 10;
              case 10:
                return 11;
              case 11:
                return 8;
              case 12:
                return 14;
              case 13:
                return "INVALID"
            }
          }, e.rules = [/^(?:\s+)/, /^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/, /^(?:"(?:\\[\\"bfnrt\/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/, /^(?:\{)/, /^(?:\})/, /^(?:\[)/, /^(?:\])/, /^(?:,)/, /^(?::)/, /^(?:true\b)/, /^(?:false\b)/, /^(?:null\b)/, /^(?:$)/, /^(?:.)/], e.conditions = {
            INITIAL: {
              rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
              inclusive: !0
            }
          }, e
        }();
      return e.lexer = t, e
    }();
    t.parser = i, t.parse = i.parse.bind(i)
  }, function(e, t) {
    "use strict";

    function n(e, t) {
      var n = this;
      this.editor = e, this.timeout = void 0, this.delay = 200, this.lastText = void 0, this.dom = {}, this.dom.container = t;
      var i = document.createElement("table");
      this.dom.table = i, i.className = "jsoneditor-search", t.appendChild(i);
      var o = document.createElement("tbody");
      this.dom.tbody = o, i.appendChild(o);
      var r = document.createElement("tr");
      o.appendChild(r);
      var s = document.createElement("td");
      r.appendChild(s);
      var a = document.createElement("div");
      this.dom.results = a, a.className = "jsoneditor-results", s.appendChild(a), s = document.createElement("td"), r.appendChild(s);
      var l = document.createElement("div");
      this.dom.input = l, l.className = "jsoneditor-frame", l.title = "Search fields and values", s.appendChild(l);
      var c = document.createElement("table");
      l.appendChild(c);
      var d = document.createElement("tbody");
      c.appendChild(d), r = document.createElement("tr"), d.appendChild(r);
      var h = document.createElement("button");
      h.className = "jsoneditor-refresh", s = document.createElement("td"), s.appendChild(h), r.appendChild(s);
      var u = document.createElement("input");
      this.dom.search = u, u.oninput = function(e) {
        n._onDelayedSearch(e)
      }, u.onchange = function(e) {
        n._onSearch()
      }, u.onkeydown = function(e) {
        n._onKeyDown(e)
      }, u.onkeyup = function(e) {
        n._onKeyUp(e)
      }, h.onclick = function(e) {
        u.select()
      }, s = document.createElement("td"), s.appendChild(u), r.appendChild(s);
      var p = document.createElement("button");
      p.title = "Next result (Enter)", p.className = "jsoneditor-next", p.onclick = function() {
        n.next()
      }, s = document.createElement("td"), s.appendChild(p), r.appendChild(s);
      var f = document.createElement("button");
      f.title = "Previous result (Shift+Enter)", f.className = "jsoneditor-previous", f.onclick = function() {
        n.previous()
      }, s = document.createElement("td"), s.appendChild(f), r.appendChild(s)
    }
    n.prototype.next = function(e) {
      if (void 0 != this.results) {
        var t = void 0 != this.resultIndex ? this.resultIndex + 1 : 0;
        t > this.results.length - 1 && (t = 0), this._setActiveResult(t, e)
      }
    }, n.prototype.previous = function(e) {
      if (void 0 != this.results) {
        var t = this.results.length - 1,
          n = void 0 != this.resultIndex ? this.resultIndex - 1 : t;
        0 > n && (n = t), this._setActiveResult(n, e)
      }
    }, n.prototype._setActiveResult = function(e, t) {
      if (this.activeResult) {
        var n = this.activeResult.node,
          i = this.activeResult.elem;
        "field" == i ? delete n.searchFieldActive : delete n.searchValueActive, n.updateDom()
      }
      if (!this.results || !this.results[e]) return this.resultIndex = void 0, void(this.activeResult = void 0);
      this.resultIndex = e;
      var o = this.results[this.resultIndex].node,
        r = this.results[this.resultIndex].elem;
      "field" == r ? o.searchFieldActive = !0 : o.searchValueActive = !0, this.activeResult = this.results[this.resultIndex], o.updateDom(), o.scrollTo(function() {
        t && o.focus(r)
      })
    }, n.prototype._clearDelay = function() {
      void 0 != this.timeout && (clearTimeout(this.timeout), delete this.timeout)
    }, n.prototype._onDelayedSearch = function(e) {
      this._clearDelay();
      var t = this;
      this.timeout = setTimeout(function(e) {
        t._onSearch()
      }, this.delay)
    }, n.prototype._onSearch = function(e) {
      this._clearDelay();
      var t = this.dom.search.value,
        n = t.length > 0 ? t : void 0;
      if (n != this.lastText || e)
        if (this.lastText = n, this.results = this.editor.search(n), this._setActiveResult(void 0), void 0 != n) {
          var i = this.results.length;
          switch (i) {
            case 0:
              this.dom.results.innerHTML = "no&nbsp;results";
              break;
            case 1:
              this.dom.results.innerHTML = "1&nbsp;result";
              break;
            default:
              this.dom.results.innerHTML = i + "&nbsp;results"
          }
        } else this.dom.results.innerHTML = ""
    }, n.prototype._onKeyDown = function(e) {
      var t = e.which;
      27 == t ? (this.dom.search.value = "", this._onSearch(), e.preventDefault(), e.stopPropagation()) : 13 == t && (e.ctrlKey ? this._onSearch(!0) : e.shiftKey ? this.previous() : this.next(), e.preventDefault(), e.stopPropagation())
    }, n.prototype._onKeyUp = function(e) {
      var t = e.keyCode;
      27 != t && 13 != t && this._onDelayedSearch(e)
    }, n.prototype.clear = function() {
      this.dom.search.value = "", this._onSearch()
    }, n.prototype.destroy = function() {
      this.editor = null, this.dom.container.removeChild(this.dom.table), this.dom = null, this.results = null, this.activeResult = null, this._clearDelay()
    }, e.exports = n
  }, function(e, t, n) {
    "use strict";

    function i(e, t) {
      function n(e, t, o) {
        o.forEach(function(o) {
          if ("separator" == o.type) {
            var r = document.createElement("div");
            r.className = "jsoneditor-separator", a = document.createElement("li"), a.appendChild(r), e.appendChild(a)
          } else {
            var s = {},
              a = document.createElement("li");
            e.appendChild(a);
            var l = document.createElement("button");
            if (l.className = o.className, s.button = l, o.title && (l.title = o.title), o.click && (l.onclick = function(e) {
                e.preventDefault(), i.hide(), o.click()
              }), a.appendChild(l), o.submenu) {
              var c = document.createElement("div");
              c.className = "jsoneditor-icon", l.appendChild(c), l.appendChild(document.createTextNode(o.text));
              var d;
              if (o.click) {
                l.className += " jsoneditor-default";
                var h = document.createElement("button");
                s.buttonExpand = h, h.className = "jsoneditor-expand", h.innerHTML = '<div class="jsoneditor-expand"></div>', a.appendChild(h), o.submenuTitle && (h.title = o.submenuTitle), d = h
              } else {
                var u = document.createElement("div");
                u.className = "jsoneditor-expand", l.appendChild(u), d = l
              }
              d.onclick = function(e) {
                e.preventDefault(), i._onExpandItem(s), d.focus()
              };
              var p = [];
              s.subItems = p;
              var f = document.createElement("ul");
              s.ul = f, f.className = "jsoneditor-menu", f.style.height = "0", a.appendChild(f), n(f, p, o.submenu)
            } else l.innerHTML = '<div class="jsoneditor-icon"></div>' + o.text;
            t.push(s)
          }
        })
      }
      this.dom = {};
      var i = this,
        o = this.dom;
      this.anchor = void 0, this.items = e, this.eventListeners = {}, this.selection = void 0, this.onClose = t ? t.close : void 0;
      var r = document.createElement("div");
      r.className = "jsoneditor-contextmenu-root", o.root = r;
      var s = document.createElement("div");
      s.className = "jsoneditor-contextmenu", o.menu = s, r.appendChild(s);
      var a = document.createElement("ul");
      a.className = "jsoneditor-menu", s.appendChild(a), o.list = a, o.items = [];
      var l = document.createElement("button");
      o.focusButton = l;
      var c = document.createElement("li");
      c.style.overflow = "hidden", c.style.height = "0", c.appendChild(l), a.appendChild(c), n(a, this.dom.items, e), this.maxHeight = 0, e.forEach(function(t) {
        var n = 24 * (e.length + (t.submenu ? t.submenu.length : 0));
        i.maxHeight = Math.max(i.maxHeight, n)
      })
    }
    var o = n(4);
    i.prototype._getVisibleButtons = function() {
      var e = [],
        t = this;
      return this.dom.items.forEach(function(n) {
        e.push(n.button), n.buttonExpand && e.push(n.buttonExpand), n.subItems && n == t.expandedItem && n.subItems.forEach(function(t) {
          e.push(t.button), t.buttonExpand && e.push(t.buttonExpand)
        })
      }), e
    }, i.visibleMenu = void 0, i.prototype.show = function(e, t) {
      this.hide();
      var n = !0;
      if (t) {
        var r = e.getBoundingClientRect(),
          s = t.getBoundingClientRect();
        r.bottom + this.maxHeight < s.bottom || r.top - this.maxHeight > s.top && (n = !1)
      }
      if (n) {
        var a = e.offsetHeight;
        this.dom.menu.style.left = "0px", this.dom.menu.style.top = a + "px", this.dom.menu.style.bottom = ""
      } else this.dom.menu.style.left = "0px", this.dom.menu.style.top = "", this.dom.menu.style.bottom = "0px";
      var l = e.parentNode;
      l.insertBefore(this.dom.root, l.firstChild);
      var c = this,
        d = this.dom.list;
      this.eventListeners.mousedown = o.addEventListener(window, "mousedown", function(e) {
        var t = e.target;
        t == d || c._isChildOf(t, d) || (c.hide(), e.stopPropagation(), e.preventDefault())
      }), this.eventListeners.keydown = o.addEventListener(window, "keydown", function(e) {
        c._onKeyDown(e)
      }), this.selection = o.getSelection(), this.anchor = e, setTimeout(function() {
        c.dom.focusButton.focus()
      }, 0), i.visibleMenu && i.visibleMenu.hide(), i.visibleMenu = this
    }, i.prototype.hide = function() {
      this.dom.root.parentNode && (this.dom.root.parentNode.removeChild(this.dom.root), this.onClose && this.onClose());
      for (var e in this.eventListeners)
        if (this.eventListeners.hasOwnProperty(e)) {
          var t = this.eventListeners[e];
          t && o.removeEventListener(window, e, t), delete this.eventListeners[e]
        }
      i.visibleMenu == this && (i.visibleMenu = void 0)
    }, i.prototype._onExpandItem = function(e) {
      var t = this,
        n = e == this.expandedItem,
        i = this.expandedItem;
      if (i && (i.ul.style.height = "0", i.ul.style.padding = "", setTimeout(function() {
          t.expandedItem != i && (i.ul.style.display = "", o.removeClassName(i.ul.parentNode, "jsoneditor-selected"))
        }, 300), this.expandedItem = void 0), !n) {
        var r = e.ul;
        r.style.display = "block";
        r.clientHeight;
        setTimeout(function() {
          t.expandedItem == e && (r.style.height = 24 * r.childNodes.length + "px", r.style.padding = "5px 10px")
        }, 0), o.addClassName(r.parentNode, "jsoneditor-selected"), this.expandedItem = e
      }
    }, i.prototype._onKeyDown = function(e) {
      var t, n, i, r, s = e.target,
        a = e.which,
        l = !1;
      27 == a ? (this.selection && o.setSelection(this.selection), this.anchor && this.anchor.focus(), this.hide(), l = !0) : 9 == a ? e.shiftKey ? (t = this._getVisibleButtons(), n = t.indexOf(s), 0 == n && (t[t.length - 1].focus(), l = !0)) : (t = this._getVisibleButtons(), n = t.indexOf(s), n == t.length - 1 && (t[0].focus(), l = !0)) : 37 == a ? ("jsoneditor-expand" == s.className && (t = this._getVisibleButtons(), n = t.indexOf(s), i = t[n - 1], i && i.focus()), l = !0) : 38 == a ? (t = this._getVisibleButtons(), n = t.indexOf(s), i = t[n - 1], i && "jsoneditor-expand" == i.className && (i = t[n - 2]), i || (i = t[t.length - 1]), i && i.focus(), l = !0) : 39 == a ? (t = this._getVisibleButtons(), n = t.indexOf(s), r = t[n + 1], r && "jsoneditor-expand" == r.className && r.focus(), l = !0) : 40 == a && (t = this._getVisibleButtons(), n = t.indexOf(s), r = t[n + 1], r && "jsoneditor-expand" == r.className && (r = t[n + 2]), r || (r = t[0]), r && (r.focus(), l = !0), l = !0), l && (e.stopPropagation(), e.preventDefault())
    }, i.prototype._isChildOf = function(e, t) {
      for (var n = e.parentNode; n;) {
        if (n == t) return !0;
        n = n.parentNode
      }
      return !1
    }, e.exports = i
  }, function(e, t, n) {
    "use strict";

    function i(e, t) {
      this.editor = e, this.dom = {}, this.expanded = !1, t && t instanceof Object ? (this.setField(t.field, t.fieldEditable), this.setValue(t.value, t.type)) : (this.setField(""), this.setValue(null)), this._debouncedOnChangeValue = a.debounce(this._onChangeValue.bind(this), i.prototype.DEBOUNCE_INTERVAL), this._debouncedOnChangeField = a.debounce(this._onChangeField.bind(this), i.prototype.DEBOUNCE_INTERVAL)
    }
    var o = n(9),
      r = n(7),
      s = n(10),
      a = n(4);
    i.prototype.DEBOUNCE_INTERVAL = 150, i.prototype._updateEditability = function() {
      if (this.editable = {
          field: !0,
          value: !0
        }, this.editor && (this.editable.field = "tree" === this.editor.options.mode, this.editable.value = "view" !== this.editor.options.mode, ("tree" === this.editor.options.mode || "form" === this.editor.options.mode) && "function" == typeof this.editor.options.onEditable)) {
        var e = this.editor.options.onEditable({
          field: this.field,
          value: this.value,
          path: this.getPath()
        });
        "boolean" == typeof e ? (this.editable.field = e, this.editable.value = e) : ("boolean" == typeof e.field && (this.editable.field = e.field), "boolean" == typeof e.value && (this.editable.value = e.value))
      }
    }, i.prototype.getPath = function() {
      for (var e = this, t = []; e;) {
        var n = e.parent ? "array" != e.parent.type ? e.field : e.index : void 0;
        void 0 !== n && t.unshift(n), e = e.parent
      }
      return t
    }, i.prototype.findNode = function(e) {
      for (var t = a.parsePath(e), n = this; n && t.length > 0;) {
        var i = t.shift();
        if ("number" == typeof i) {
          if ("array" !== n.type) throw new Error("Cannot get child node at index " + i + ": node is no array");
          n = n.childs[i]
        } else {
          if ("object" !== n.type) throw new Error("Cannot get child node " + i + ": node is no object");
          n = n.childs.filter(function(e) {
            return e.field === i
          })[0]
        }
      }
      return n
    }, i.prototype.findParents = function() {
      for (var e = [], t = this.parent; t;) e.unshift(t), t = t.parent;
      return e
    }, i.prototype.setError = function(e, t) {
      this.getDom(), this.error = e;
      var n = this.dom.tdError;
      if (e) {
        n || (n = document.createElement("td"), this.dom.tdError = n, this.dom.tdValue.parentNode.appendChild(n));
        var i = document.createElement("div");
        i.className = "jsoneditor-popover jsoneditor-right", i.appendChild(document.createTextNode(e.message));
        var o = document.createElement("button");
        for (o.className = "jsoneditor-schema-error", o.appendChild(i), o.onmouseover = o.onfocus = function() {
            for (var e = ["right", "above", "below", "left"], t = 0; t < e.length; t++) {
              var n = e[t];
              i.className = "jsoneditor-popover jsoneditor-" + n;
              var o = this.editor.content.getBoundingClientRect(),
                r = i.getBoundingClientRect(),
                s = 20,
                l = a.insideRect(o, r, s);
              if (l) break
            }
          }.bind(this), t && (o.onclick = function() {
            t.findParents().forEach(function(e) {
              e.expand(!1)
            }), t.scrollTo(function() {
              t.focus()
            })
          }); n.firstChild;) n.removeChild(n.firstChild);
        n.appendChild(o)
      } else n && (this.dom.tdError.parentNode.removeChild(this.dom.tdError), delete this.dom.tdError)
    }, i.prototype.getIndex = function() {
      return this.parent ? this.parent.childs.indexOf(this) : -1
    }, i.prototype.setParent = function(e) {
      this.parent = e
    }, i.prototype.setField = function(e, t) {
      this.field = e, this.previousField = e, this.fieldEditable = t === !0
    }, i.prototype.getField = function() {
      return void 0 === this.field && this._getDomField(), this.field
    }, i.prototype.setValue = function(e, t) {
      var n, o, r = this.childs;
      if (r)
        for (; r.length;) this.removeChild(r[0]);
      if (this.type = this._getType(e), t && t != this.type) {
        if ("string" != t || "auto" != this.type) throw new Error('Type mismatch: cannot cast value of type "' + this.type + ' to the specified type "' + t + '"');
        this.type = t
      }
      if ("array" == this.type) {
        this.childs = [];
        for (var s = 0, a = e.length; a > s; s++) n = e[s], void 0 === n || n instanceof Function || (o = new i(this.editor, {
          value: n
        }), this.appendChild(o));
        this.value = ""
      } else if ("object" == this.type) {
        this.childs = [];
        for (var l in e) e.hasOwnProperty(l) && (n = e[l], void 0 === n || n instanceof Function || (o = new i(this.editor, {
          field: l,
          value: n
        }), this.appendChild(o)));
        this.value = "", this.editor.options.sortObjectKeys === !0 && this.sort("asc")
      } else this.childs = void 0, this.value = e;
      this.previousValue = this.value
    }, i.prototype.getValue = function() {
      if ("array" == this.type) {
        var e = [];
        return this.childs.forEach(function(t) {
          e.push(t.getValue())
        }), e
      }
      if ("object" == this.type) {
        var t = {};
        return this.childs.forEach(function(e) {
          t[e.getField()] = e.getValue()
        }), t
      }
      return void 0 === this.value && this._getDomValue(), this.value
    }, i.prototype.getLevel = function() {
      return this.parent ? this.parent.getLevel() + 1 : 0
    }, i.prototype.getNodePath = function() {
      var e = this.parent ? this.parent.getNodePath() : [];
      return e.push(this), e
    }, i.prototype.clone = function() {
      var e = new i(this.editor);
      if (e.type = this.type, e.field = this.field, e.fieldInnerText = this.fieldInnerText, e.fieldEditable = this.fieldEditable, e.value = this.value, e.valueInnerText = this.valueInnerText, e.expanded = this.expanded, this.childs) {
        var t = [];
        this.childs.forEach(function(n) {
          var i = n.clone();
          i.setParent(e), t.push(i)
        }), e.childs = t
      } else e.childs = void 0;
      return e
    }, i.prototype.expand = function(e) {
      this.childs && (this.expanded = !0, this.dom.expand && (this.dom.expand.className = "jsoneditor-expanded"), this.showChilds(), e !== !1 && this.childs.forEach(function(t) {
        t.expand(e)
      }))
    }, i.prototype.collapse = function(e) {
      this.childs && (this.hideChilds(), e !== !1 && this.childs.forEach(function(t) {
        t.collapse(e)
      }), this.dom.expand && (this.dom.expand.className = "jsoneditor-collapsed"), this.expanded = !1)
    }, i.prototype.showChilds = function() {
      var e = this.childs;
      if (e && this.expanded) {
        var t = this.dom.tr,
          n = t ? t.parentNode : void 0;
        if (n) {
          var i = this.getAppend(),
            o = t.nextSibling;
          o ? n.insertBefore(i, o) : n.appendChild(i), this.childs.forEach(function(e) {
            n.insertBefore(e.getDom(), i), e.showChilds()
          })
        }
      }
    }, i.prototype.hide = function() {
      var e = this.dom.tr,
        t = e ? e.parentNode : void 0;
      t && t.removeChild(e), this.hideChilds()
    }, i.prototype.hideChilds = function() {
      var e = this.childs;
      if (e && this.expanded) {
        var t = this.getAppend();
        t.parentNode && t.parentNode.removeChild(t), this.childs.forEach(function(e) {
          e.hide()
        })
      }
    }, i.prototype.appendChild = function(e) {
      if (this._hasChilds()) {
        if (e.setParent(this), e.fieldEditable = "object" == this.type, "array" == this.type && (e.index = this.childs.length), this.childs.push(e), this.expanded) {
          var t = e.getDom(),
            n = this.getAppend(),
            i = n ? n.parentNode : void 0;
          n && i && i.insertBefore(t, n), e.showChilds()
        }
        this.updateDom({
          updateIndexes: !0
        }), e.updateDom({
          recurse: !0
        })
      }
    }, i.prototype.moveBefore = function(e, t) {
      if (this._hasChilds()) {
        var n = this.dom.tr ? this.dom.tr.parentNode : void 0;
        if (n) {
          var i = document.createElement("tr");
          i.style.height = n.clientHeight + "px", n.appendChild(i)
        }
        e.parent && e.parent.removeChild(e), t instanceof l ? this.appendChild(e) : this.insertBefore(e, t), n && n.removeChild(i)
      }
    }, i.prototype.moveTo = function(e, t) {
      if (e.parent == this) {
        var n = this.childs.indexOf(e);
        t > n && t++
      }
      var i = this.childs[t] || this.append;
      this.moveBefore(e, i)
    }, i.prototype.insertBefore = function(e, t) {
      if (this._hasChilds()) {
        if (t == this.append) e.setParent(this), e.fieldEditable = "object" == this.type, this.childs.push(e);
        else {
          var n = this.childs.indexOf(t);
          if (-1 == n) throw new Error("Node not found");
          e.setParent(this), e.fieldEditable = "object" == this.type, this.childs.splice(n, 0, e)
        }
        if (this.expanded) {
          var i = e.getDom(),
            o = t.getDom(),
            r = o ? o.parentNode : void 0;
          o && r && r.insertBefore(i, o), e.showChilds()
        }
        this.updateDom({
          updateIndexes: !0
        }), e.updateDom({
          recurse: !0
        })
      }
    }, i.prototype.insertAfter = function(e, t) {
      if (this._hasChilds()) {
        var n = this.childs.indexOf(t),
          i = this.childs[n + 1];
        i ? this.insertBefore(e, i) : this.appendChild(e)
      }
    }, i.prototype.search = function(e) {
      var t, n = [],
        i = e ? e.toLowerCase() : void 0;
      if (delete this.searchField, delete this.searchValue, void 0 != this.field) {
        var o = String(this.field).toLowerCase();
        t = o.indexOf(i), -1 != t && (this.searchField = !0, n.push({
          node: this,
          elem: "field"
        })), this._updateDomField()
      }
      if (this._hasChilds()) {
        if (this.childs) {
          var r = [];
          this.childs.forEach(function(t) {
            r = r.concat(t.search(e))
          }), n = n.concat(r)
        }
        if (void 0 != i) {
          var s = !1;
          0 == r.length ? this.collapse(s) : this.expand(s)
        }
      } else {
        if (void 0 != this.value) {
          var a = String(this.value).toLowerCase();
          t = a.indexOf(i), -1 != t && (this.searchValue = !0, n.push({
            node: this,
            elem: "value"
          }))
        }
        this._updateDomValue()
      }
      return n
    }, i.prototype.scrollTo = function(e) {
      if (!this.dom.tr || !this.dom.tr.parentNode)
        for (var t = this.parent, n = !1; t;) t.expand(n), t = t.parent;
      this.dom.tr && this.dom.tr.parentNode && this.editor.scrollTo(this.dom.tr.offsetTop, e)
    }, i.focusElement = void 0, i.prototype.focus = function(e) {
      if (i.focusElement = e, this.dom.tr && this.dom.tr.parentNode) {
        var t = this.dom;
        switch (e) {
          case "drag":
            t.drag ? t.drag.focus() : t.menu.focus();
            break;
          case "menu":
            t.menu.focus();
            break;
          case "expand":
            this._hasChilds() ? t.expand.focus() : t.field && this.fieldEditable ? (t.field.focus(), a.selectContentEditable(t.field)) : t.value && !this._hasChilds() ? (t.value.focus(), a.selectContentEditable(t.value)) : t.menu.focus();
            break;
          case "field":
            t.field && this.fieldEditable ? (t.field.focus(), a.selectContentEditable(t.field)) : t.value && !this._hasChilds() ? (t.value.focus(), a.selectContentEditable(t.value)) : this._hasChilds() ? t.expand.focus() : t.menu.focus();
            break;
          case "value":
          default:
            t.value && !this._hasChilds() ? (t.value.focus(), a.selectContentEditable(t.value)) : t.field && this.fieldEditable ? (t.field.focus(), a.selectContentEditable(t.field)) : this._hasChilds() ? t.expand.focus() : t.menu.focus()
        }
      }
    }, i.select = function(e) {
      setTimeout(function() {
        a.selectContentEditable(e)
      }, 0)
    }, i.prototype.blur = function() {
      this._getDomValue(!1), this._getDomField(!1)
    }, i.prototype.containsNode = function(e) {
      if (this == e) return !0;
      var t = this.childs;
      if (t)
        for (var n = 0, i = t.length; i > n; n++)
          if (t[n].containsNode(e)) return !0;
      return !1
    }, i.prototype._move = function(e, t) {
      if (e != t) {
        if (e.containsNode(this)) throw new Error("Cannot move a field into a child of itself");
        e.parent && e.parent.removeChild(e);
        var n = e.clone();
        e.clearDom(), t ? this.insertBefore(n, t) : this.appendChild(n)
      }
    }, i.prototype.removeChild = function(e) {
      if (this.childs) {
        var t = this.childs.indexOf(e);
        if (-1 != t) {
          e.hide(), delete e.searchField, delete e.searchValue;
          var n = this.childs.splice(t, 1)[0];
          return n.parent = null, this.updateDom({
            updateIndexes: !0
          }), n
        }
      }
    }, i.prototype._remove = function(e) {
      this.removeChild(e)
    }, i.prototype.changeType = function(e) {
      var t = this.type;
      if (t != e) {
        if ("string" != e && "auto" != e || "string" != t && "auto" != t) {
          var n, i = this.dom.tr ? this.dom.tr.parentNode : void 0;
          n = this.expanded ? this.getAppend() : this.getDom();
          var o = n && n.parentNode ? n.nextSibling : void 0;
          this.hide(), this.clearDom(), this.type = e, "object" == e ? (this.childs || (this.childs = []), this.childs.forEach(function(e, t) {
            e.clearDom(), delete e.index, e.fieldEditable = !0, void 0 == e.field && (e.field = "")
          }), "string" != t && "auto" != t || (this.expanded = !0)) : "array" == e ? (this.childs || (this.childs = []), this.childs.forEach(function(e, t) {
            e.clearDom(), e.fieldEditable = !1, e.index = t
          }), "string" != t && "auto" != t || (this.expanded = !0)) : this.expanded = !1, i && (o ? i.insertBefore(this.getDom(), o) : i.appendChild(this.getDom())), this.showChilds()
        } else this.type = e;
        "auto" != e && "string" != e || ("string" == e ? this.value = String(this.value) : this.value = this._stringCast(String(this.value)), this.focus()), this.updateDom({
          updateIndexes: !0
        })
      }
    }, i.prototype._getDomValue = function(e) {
      if (this.dom.value && "array" != this.type && "object" != this.type && (this.valueInnerText = a.getInnerText(this.dom.value)), void 0 != this.valueInnerText) try {
        var t;
        if ("string" == this.type) t = this._unescapeHTML(this.valueInnerText);
        else {
          var n = this._unescapeHTML(this.valueInnerText);
          t = this._stringCast(n)
        }
        t !== this.value && (this.value = t, this._debouncedOnChangeValue())
      } catch (i) {
        if (this.value = void 0, e !== !0) throw i
      }
    }, i.prototype._onChangeValue = function() {
      var e = this.editor.getSelection();
      if (e.range) {
        var t = a.textDiff(String(this.value), String(this.previousValue));
        e.range.startOffset = t.start, e.range.endOffset = t.end
      }
      var n = this.editor.getSelection();
      if (n.range) {
        var i = a.textDiff(String(this.previousValue), String(this.value));
        n.range.startOffset = i.start, n.range.endOffset = i.end
      }
      this.editor._onAction("editValue", {
        node: this,
        oldValue: this.previousValue,
        newValue: this.value,
        oldSelection: e,
        newSelection: n
      }), this.previousValue = this.value
    }, i.prototype._onChangeField = function() {
      var e = this.editor.getSelection();
      if (e.range) {
        var t = a.textDiff(this.field, this.previousField);
        e.range.startOffset = t.start, e.range.endOffset = t.end
      }
      var n = this.editor.getSelection();
      if (n.range) {
        var i = a.textDiff(this.previousField, this.field);
        n.range.startOffset = i.start, n.range.endOffset = i.end
      }
      this.editor._onAction("editField", {
        node: this,
        oldValue: this.previousField,
        newValue: this.field,
        oldSelection: e,
        newSelection: n
      }), this.previousField = this.field
    }, i.prototype._updateDomValue = function() {
      var e = this.dom.value;
      if (e) {
        var t = ["jsoneditor-value"],
          n = this.value,
          i = "auto" == this.type ? a.type(n) : this.type,
          o = "string" == i && a.isUrl(n);
        t.push("jsoneditor-" + i), o && t.push("jsoneditor-url");
        var r = "" == String(this.value) && "array" != this.type && "object" != this.type;
        if (r && t.push("jsoneditor-empty"), this.searchValueActive && t.push("jsoneditor-highlight-active"), this.searchValue && t.push("jsoneditor-highlight"), e.className = t.join(" "), "array" == i || "object" == i) {
          var s = this.childs ? this.childs.length : 0;
          e.title = this.type + " containing " + s + " items"
        } else o && this.editable.value ? e.title = "Ctrl+Click or Ctrl+Enter to open url in new window" : e.title = "";
        if ("boolean" === i && this.editable.value ? (this.dom.checkbox || (this.dom.checkbox = document.createElement("input"), this.dom.checkbox.type = "checkbox", this.dom.tdCheckbox = document.createElement("td"), this.dom.tdCheckbox.className = "jsoneditor-tree", this.dom.tdCheckbox.appendChild(this.dom.checkbox), this.dom.tdValue.parentNode.insertBefore(this.dom.tdCheckbox, this.dom.tdValue)), this.dom.checkbox.checked = this.value) : this.dom.tdCheckbox && (this.dom.tdCheckbox.parentNode.removeChild(this.dom.tdCheckbox), delete this.dom.tdCheckbox, delete this.dom.checkbox), this["enum"] && this.editable.value) {
          if (!this.dom.select) {
            this.dom.select = document.createElement("select"), this.id = this.field + "_" + (new Date).getUTCMilliseconds(), this.dom.select.id = this.id, this.dom.select.name = this.dom.select.id, this.dom.select.option = document.createElement("option"), this.dom.select.option.value = "", this.dom.select.option.innerHTML = "--", this.dom.select.appendChild(this.dom.select.option);
            for (var l = 0; l < this["enum"].length; l++) this.dom.select.option = document.createElement("option"), this.dom.select.option.value = this["enum"][l], this.dom.select.option.innerHTML = this["enum"][l], this.dom.select.option.value == this.value && (this.dom.select.option.selected = !0), this.dom.select.appendChild(this.dom.select.option);
            this.dom.tdSelect = document.createElement("td"), this.dom.tdSelect.className = "jsoneditor-tree", this.dom.tdSelect.appendChild(this.dom.select), this.dom.tdValue.parentNode.insertBefore(this.dom.tdSelect, this.dom.tdValue)
          }!this.schema || this.schema.hasOwnProperty("oneOf") || this.schema.hasOwnProperty("anyOf") || this.schema.hasOwnProperty("allOf") ? delete this.valueFieldHTML : (this.valueFieldHTML = this.dom.tdValue.innerHTML, this.dom.tdValue.style.visibility = "hidden", this.dom.tdValue.innerHTML = "")
        } else this.dom.tdSelect && (this.dom.tdSelect.parentNode.removeChild(this.dom.tdSelect), delete this.dom.tdSelect, delete this.dom.select, this.dom.tdValue.innerHTML = this.valueFieldHTML, this.dom.tdValue.style.visibility = "", delete this.valueFieldHTML);
        a.stripFormatting(e)
      }
    }, i.prototype._updateDomField = function() {
      var e = this.dom.field;
      if (e) {
        var t = "" == String(this.field) && "array" != this.parent.type;
        t ? a.addClassName(e, "jsoneditor-empty") : a.removeClassName(e, "jsoneditor-empty"), this.searchFieldActive ? a.addClassName(e, "jsoneditor-highlight-active") : a.removeClassName(e, "jsoneditor-highlight-active"), this.searchField ? a.addClassName(e, "jsoneditor-highlight") : a.removeClassName(e, "jsoneditor-highlight"), a.stripFormatting(e)
      }
    }, i.prototype._getDomField = function(e) {
      if (this.dom.field && this.fieldEditable && (this.fieldInnerText = a.getInnerText(this.dom.field)), void 0 != this.fieldInnerText) try {
        var t = this._unescapeHTML(this.fieldInnerText);
        t !== this.field && (this.field = t, this._debouncedOnChangeField())
      } catch (n) {
        if (this.field = void 0, e !== !0) throw n
      }
    }, i.prototype.validate = function() {
      var e = [];
      if ("object" === this.type) {
        for (var t = {}, n = [], i = 0; i < this.childs.length; i++) {
          var o = this.childs[i];
          t[o.field] && n.push(o.field), t[o.field] = !0
        }
        n.length > 0 && (e = this.childs.filter(function(e) {
          return -1 !== n.indexOf(e.field)
        }).map(function(e) {
          return {
            node: e,
            error: {
              message: 'duplicate key "' + e.field + '"'
            }
          }
        }))
      }
      if (this.childs)
        for (var i = 0; i < this.childs.length; i++) {
          var r = this.childs[i].validate();
          r.length > 0 && (e = e.concat(r))
        }
      return e
    }, i.prototype.clearDom = function() {
      this.dom = {}
    }, i.prototype.getDom = function() {
      var e = this.dom;
      if (e.tr) return e.tr;
      if (this._updateEditability(), e.tr = document.createElement("tr"), e.tr.node = this, "tree" === this.editor.options.mode) {
        var t = document.createElement("td");
        if (this.editable.field && this.parent) {
          var n = document.createElement("button");
          e.drag = n, n.className = "jsoneditor-dragarea", n.title = "Drag to move this field (Alt+Shift+Arrows)", t.appendChild(n)
        }
        e.tr.appendChild(t);
        var i = document.createElement("td"),
          o = document.createElement("button");
        e.menu = o, o.className = "jsoneditor-contextmenu", o.title = "Click to open the actions menu (Ctrl+M)", i.appendChild(e.menu), e.tr.appendChild(i)
      }
      var r = document.createElement("td");
      return e.tr.appendChild(r), e.tree = this._createDomTree(), r.appendChild(e.tree), this.updateDom({
        updateIndexes: !0
      }), e.tr
    }, i.onDragStart = function(e, t) {
      if (!Array.isArray(e)) return i.onDragStart([e], t);
      if (0 !== e.length) {
        var n = e[0],
          o = e[e.length - 1],
          r = i.getNodeFromTarget(t.target),
          s = o._nextSibling(),
          l = n.editor,
          c = a.getAbsoluteTop(r.dom.tr) - a.getAbsoluteTop(n.dom.tr);
        l.mousemove || (l.mousemove = a.addEventListener(window, "mousemove", function(t) {
          i.onDrag(e, t)
        })), l.mouseup || (l.mouseup = a.addEventListener(window, "mouseup", function(t) {
          i.onDragEnd(e, t)
        })), l.highlighter.lock(), l.drag = {
          oldCursor: document.body.style.cursor,
          oldSelection: l.getSelection(),
          oldBeforeNode: s,
          mouseX: t.pageX,
          offsetY: c,
          level: n.getLevel()
        }, document.body.style.cursor = "move", t.preventDefault()
      }
    }, i.onDrag = function(e, t) {
      if (!Array.isArray(e)) return i.onDrag([e], t);
      if (0 !== e.length) {
        var n, o, r, s, c, d, h, u, p, f, m, g, v, y, b = e[0].editor,
          w = t.pageY - b.drag.offsetY,
          x = t.pageX,
          _ = !1,
          E = e[0];
        if (n = E.dom.tr, p = a.getAbsoluteTop(n), g = n.offsetHeight, p > w) {
          o = n;
          do o = o.previousSibling, h = i.getNodeFromTarget(o), f = o ? a.getAbsoluteTop(o) : 0; while (o && f > w);
          h && !h.parent && (h = void 0), h || (d = n.parentNode.firstChild, o = d ? d.nextSibling : void 0, h = i.getNodeFromTarget(o), h == E && (h = void 0)), h && (o = h.dom.tr, f = o ? a.getAbsoluteTop(o) : 0, w > f + g && (h = void 0)), h && (e.forEach(function(e) {
            h.parent.moveBefore(e, h)
          }), _ = !0)
        } else {
          var C = e[e.length - 1];
          if (c = C.expanded && C.append ? C.append.getDom() : C.dom.tr, s = c ? c.nextSibling : void 0) {
            m = a.getAbsoluteTop(s), r = s;
            do u = i.getNodeFromTarget(r), r && (v = r.nextSibling ? a.getAbsoluteTop(r.nextSibling) : 0, y = r ? v - m : 0, u.parent.childs.length == e.length && u.parent.childs[e.length - 1] == C && (p += 27)), r = r.nextSibling; while (r && w > p + y);
            if (u && u.parent) {
              var S = x - b.drag.mouseX,
                j = Math.round(S / 24 / 2),
                N = b.drag.level + j,
                k = u.getLevel();
              for (o = u.dom.tr.previousSibling; N > k && o;) {
                h = i.getNodeFromTarget(o);
                var A = e.some(function(e) {
                  return e === h || h._isChildOf(e)
                });
                if (A);
                else {
                  if (!(h instanceof l)) break;
                  var O = h.parent.childs;
                  if (O.length == e.length && O[e.length - 1] == C) break;
                  u = i.getNodeFromTarget(o), k = u.getLevel()
                }
                o = o.previousSibling
              }
              c.nextSibling != u.dom.tr && (e.forEach(function(e) {
                u.parent.moveBefore(e, u)
              }), _ = !0)
            }
          }
        }
        _ && (b.drag.mouseX = x, b.drag.level = E.getLevel()), b.startAutoScroll(w), t.preventDefault()
      }
    }, i.onDragEnd = function(e, t) {
      if (!Array.isArray(e)) return i.onDrag([e], t);
      if (0 !== e.length) {
        var n = e[0],
          o = n.editor,
          r = n.parent,
          s = r.childs.indexOf(n),
          l = r.childs[s + e.length] || r.append;
        e[0] && e[0].dom.menu.focus();
        var c = {
          nodes: e,
          oldSelection: o.drag.oldSelection,
          newSelection: o.getSelection(),
          oldBeforeNode: o.drag.oldBeforeNode,
          newBeforeNode: l
        };
        c.oldBeforeNode != c.newBeforeNode && o._onAction("moveNodes", c), document.body.style.cursor = o.drag.oldCursor, o.highlighter.unlock(), e.forEach(function(e) {
            t.target !== e.dom.drag && t.target !== e.dom.menu && o.highlighter.unhighlight()
          }), delete o.drag, o.mousemove && (a.removeEventListener(window, "mousemove", o.mousemove), delete o.mousemove), o.mouseup && (a.removeEventListener(window, "mouseup", o.mouseup), delete o.mouseup),
          o.stopAutoScroll(), t.preventDefault()
      }
    }, i.prototype._isChildOf = function(e) {
      for (var t = this.parent; t;) {
        if (t == e) return !0;
        t = t.parent
      }
      return !1
    }, i.prototype._createDomField = function() {
      return document.createElement("div")
    }, i.prototype.setHighlight = function(e) {
      this.dom.tr && (e ? a.addClassName(this.dom.tr, "jsoneditor-highlight") : a.removeClassName(this.dom.tr, "jsoneditor-highlight"), this.append && this.append.setHighlight(e), this.childs && this.childs.forEach(function(t) {
        t.setHighlight(e)
      }))
    }, i.prototype.setSelected = function(e, t) {
      this.selected = e, this.dom.tr && (e ? a.addClassName(this.dom.tr, "jsoneditor-selected") : a.removeClassName(this.dom.tr, "jsoneditor-selected"), t ? a.addClassName(this.dom.tr, "jsoneditor-first") : a.removeClassName(this.dom.tr, "jsoneditor-first"), this.append && this.append.setSelected(e), this.childs && this.childs.forEach(function(t) {
        t.setSelected(e)
      }))
    }, i.prototype.updateValue = function(e) {
      this.value = e, this.updateDom()
    }, i.prototype.updateField = function(e) {
      this.field = e, this.updateDom()
    }, i.prototype.updateDom = function(e) {
      var t = this.dom.tree;
      t && (t.style.marginLeft = 24 * this.getLevel() + "px");
      var n = this.dom.field;
      if (n) {
        this.fieldEditable ? (n.contentEditable = this.editable.field, n.spellcheck = !1, n.className = "jsoneditor-field") : n.className = "jsoneditor-readonly";
        var i;
        i = void 0 != this.index ? this.index : void 0 != this.field ? this.field : this._hasChilds() ? this.type : "", n.innerHTML = this._escapeHTML(i), this._updateSchema()
      }
      var o = this.dom.value;
      if (o) {
        var r = this.childs ? this.childs.length : 0;
        "array" == this.type ? (o.innerHTML = "[" + r + "]", a.addClassName(this.dom.tr, "jsoneditor-expandable")) : "object" == this.type ? (o.innerHTML = "{" + r + "}", a.addClassName(this.dom.tr, "jsoneditor-expandable")) : (o.innerHTML = this._escapeHTML(this.value), a.removeClassName(this.dom.tr, "jsoneditor-expandable"))
      }
      this._updateDomField(), this._updateDomValue(), e && e.updateIndexes === !0 && this._updateDomIndexes(), e && e.recurse === !0 && this.childs && this.childs.forEach(function(t) {
        t.updateDom(e)
      }), this.append && this.append.updateDom()
    }, i.prototype._updateSchema = function() {
      this.editor && this.editor.options && (this.schema = i._findSchema(this.editor.options.schema, this.getPath()), this.schema ? this["enum"] = i._findEnum(this.schema) : delete this["enum"])
    }, i._findEnum = function(e) {
      if (e["enum"]) return e["enum"];
      var t = e.oneOf || e.anyOf || e.allOf;
      if (t) {
        var n = t.filter(function(e) {
          return e["enum"]
        });
        if (n.length > 0) return n[0]["enum"]
      }
      return null
    }, i._findSchema = function(e, t) {
      for (var n = e, i = 0; i < t.length && n; i++) {
        var o = t[i];
        "string" == typeof o && n.properties ? n = n.properties[o] || null : "number" == typeof o && n.items && (n = n.items)
      }
      return n
    }, i.prototype._updateDomIndexes = function() {
      var e = this.dom.value,
        t = this.childs;
      e && t && ("array" == this.type ? t.forEach(function(e, t) {
        e.index = t;
        var n = e.dom.field;
        n && (n.innerHTML = t)
      }) : "object" == this.type && t.forEach(function(e) {
        void 0 != e.index && (delete e.index, void 0 == e.field && (e.field = ""))
      }))
    }, i.prototype._createDomValue = function() {
      var e;
      return "array" == this.type ? (e = document.createElement("div"), e.innerHTML = "[...]") : "object" == this.type ? (e = document.createElement("div"), e.innerHTML = "{...}") : !this.editable.value && a.isUrl(this.value) ? (e = document.createElement("a"), e.href = this.value, e.target = "_blank", e.innerHTML = this._escapeHTML(this.value)) : (e = document.createElement("div"), e.contentEditable = this.editable.value, e.spellcheck = !1, e.innerHTML = this._escapeHTML(this.value)), e
    }, i.prototype._createDomExpandButton = function() {
      var e = document.createElement("button");
      return this._hasChilds() ? (e.className = this.expanded ? "jsoneditor-expanded" : "jsoneditor-collapsed", e.title = "Click to expand/collapse this field (Ctrl+E). \nCtrl+Click to expand/collapse including all childs.") : (e.className = "jsoneditor-invisible", e.title = ""), e
    }, i.prototype._createDomTree = function() {
      var e = this.dom,
        t = document.createElement("table"),
        n = document.createElement("tbody");
      t.style.borderCollapse = "collapse", t.className = "jsoneditor-values", t.appendChild(n);
      var i = document.createElement("tr");
      n.appendChild(i);
      var o = document.createElement("td");
      o.className = "jsoneditor-tree", i.appendChild(o), e.expand = this._createDomExpandButton(), o.appendChild(e.expand), e.tdExpand = o;
      var r = document.createElement("td");
      r.className = "jsoneditor-tree", i.appendChild(r), e.field = this._createDomField(), r.appendChild(e.field), e.tdField = r;
      var s = document.createElement("td");
      s.className = "jsoneditor-tree", i.appendChild(s), "object" != this.type && "array" != this.type && (s.appendChild(document.createTextNode(":")), s.className = "jsoneditor-separator"), e.tdSeparator = s;
      var a = document.createElement("td");
      return a.className = "jsoneditor-tree", i.appendChild(a), e.value = this._createDomValue(), a.appendChild(e.value), e.tdValue = a, t
    }, i.prototype.onEvent = function(e) {
      var t = e.type,
        n = e.target || e.srcElement,
        i = this.dom,
        o = this,
        r = this._hasChilds();
      if (n != i.drag && n != i.menu || ("mouseover" == t ? this.editor.highlighter.highlight(this) : "mouseout" == t && this.editor.highlighter.unhighlight()), "click" == t && n == i.menu) {
        var s = o.editor.highlighter;
        s.highlight(o), s.lock(), a.addClassName(i.menu, "jsoneditor-selected"), this.showContextMenu(i.menu, function() {
          a.removeClassName(i.menu, "jsoneditor-selected"), s.unlock(), s.unhighlight()
        })
      }
      if ("click" == t && (n == i.expand || ("view" === o.editor.options.mode || "form" === o.editor.options.mode) && "DIV" === n.nodeName) && r) {
        var l = e.ctrlKey;
        this._onExpand(l)
      }
      "change" == t && n == i.checkbox && (this.dom.value.innerHTML = !this.value, this._getDomValue()), "change" == t && n == i.select && (this.dom.value.innerHTML = i.select.value, this._getDomValue(), this._updateDomValue());
      var c = i.value;
      if (n == c) switch (t) {
        case "blur":
        case "change":
          this._getDomValue(!0), this._updateDomValue(), this.value && (c.innerHTML = this._escapeHTML(this.value));
          break;
        case "input":
          this._getDomValue(!0), this._updateDomValue();
          break;
        case "keydown":
        case "mousedown":
          this.editor.selection = this.editor.getSelection();
          break;
        case "click":
          !e.ctrlKey && this.editable.value || a.isUrl(this.value) && window.open(this.value, "_blank");
          break;
        case "keyup":
          this._getDomValue(!0), this._updateDomValue();
          break;
        case "cut":
        case "paste":
          setTimeout(function() {
            o._getDomValue(!0), o._updateDomValue()
          }, 1)
      }
      var d = i.field;
      if (n == d) switch (t) {
        case "blur":
        case "change":
          this._getDomField(!0), this._updateDomField(), this.field && (d.innerHTML = this._escapeHTML(this.field));
          break;
        case "input":
          this._getDomField(!0), this._updateSchema(), this._updateDomField(), this._updateDomValue();
          break;
        case "keydown":
        case "mousedown":
          this.editor.selection = this.editor.getSelection();
          break;
        case "keyup":
          this._getDomField(!0), this._updateDomField();
          break;
        case "cut":
        case "paste":
          setTimeout(function() {
            o._getDomField(!0), o._updateDomField()
          }, 1)
      }
      var h = i.tree;
      if (n == h.parentNode && "click" == t && !e.hasMoved) {
        var u = void 0 != e.offsetX ? e.offsetX < 24 * (this.getLevel() + 1) : e.pageX < a.getAbsoluteLeft(i.tdSeparator);
        u || r ? d && (a.setEndOfContentEditable(d), d.focus()) : c && !this["enum"] && (a.setEndOfContentEditable(c), c.focus())
      }(n != i.tdExpand || r) && n != i.tdField && n != i.tdSeparator || "click" != t || e.hasMoved || d && (a.setEndOfContentEditable(d), d.focus()), "keydown" == t && this.onKeyDown(e)
    }, i.prototype.onKeyDown = function(e) {
      var t, n, o, r, s, c, d, h, u = e.which || e.keyCode,
        p = e.target || e.srcElement,
        f = e.ctrlKey,
        m = e.shiftKey,
        g = e.altKey,
        v = !1,
        y = "tree" === this.editor.options.mode,
        b = this.editor.multiselection.nodes.length > 0 ? this.editor.multiselection.nodes : [this],
        w = b[0],
        x = b[b.length - 1];
      if (13 == u) {
        if (p == this.dom.value) this.editable.value && !e.ctrlKey || a.isUrl(this.value) && (window.open(this.value, "_blank"), v = !0);
        else if (p == this.dom.expand) {
          var _ = this._hasChilds();
          if (_) {
            var E = e.ctrlKey;
            this._onExpand(E), p.focus(), v = !0
          }
        }
      } else if (68 == u) f && y && (i.onDuplicate(b), v = !0);
      else if (69 == u) f && (this._onExpand(m), p.focus(), v = !0);
      else if (77 == u && y) f && (this.showContextMenu(p), v = !0);
      else if (46 == u && y) f && (i.onRemove(b), v = !0);
      else if (45 == u && y) f && !m ? (this._onInsertBefore(), v = !0) : f && m && (this._onInsertAfter(), v = !0);
      else if (35 == u) {
        if (g) {
          var C = this._lastNode();
          C && C.focus(i.focusElement || this._getElementName(p)), v = !0
        }
      } else if (36 == u) {
        if (g) {
          var S = this._firstNode();
          S && S.focus(i.focusElement || this._getElementName(p)), v = !0
        }
      } else if (37 == u) {
        if (g && !m) {
          var j = this._previousElement(p);
          j && this.focus(this._getElementName(j)), v = !0
        } else if (g && m && y) {
          if (x.expanded) {
            var N = x.getAppend();
            o = N ? N.nextSibling : void 0
          } else {
            var k = x.getDom();
            o = k.nextSibling
          }
          o && (n = i.getNodeFromTarget(o), r = o.nextSibling, T = i.getNodeFromTarget(r), n && n instanceof l && 1 != x.parent.childs.length && T && T.parent && (s = this.editor.getSelection(), c = x._nextSibling(), b.forEach(function(e) {
            T.parent.moveBefore(e, T)
          }), this.focus(i.focusElement || this._getElementName(p)), this.editor._onAction("moveNodes", {
            nodes: b,
            oldBeforeNode: c,
            newBeforeNode: T,
            oldSelection: s,
            newSelection: this.editor.getSelection()
          })))
        }
      } else if (38 == u) g && !m ? (t = this._previousNode(), t && (this.editor.deselect(!0), t.focus(i.focusElement || this._getElementName(p))), v = !0) : !g && f && m && y ? (t = this._previousNode(), t && (h = this.editor.multiselection, h.start = h.start || this, h.end = t, d = this.editor._findTopLevelNodes(h.start, h.end), this.editor.select(d), t.focus("field")), v = !0) : g && m && y && (t = w._previousNode(), t && t.parent && (s = this.editor.getSelection(), c = x._nextSibling(), b.forEach(function(e) {
        t.parent.moveBefore(e, t)
      }), this.focus(i.focusElement || this._getElementName(p)), this.editor._onAction("moveNodes", {
        nodes: b,
        oldBeforeNode: c,
        newBeforeNode: t,
        oldSelection: s,
        newSelection: this.editor.getSelection()
      })), v = !0);
      else if (39 == u) {
        if (g && !m) {
          var A = this._nextElement(p);
          A && this.focus(this._getElementName(A)), v = !0
        } else if (g && m && y) {
          k = w.getDom();
          var O = k.previousSibling;
          O && (t = i.getNodeFromTarget(O), t && t.parent && t instanceof l && !t.isVisible() && (s = this.editor.getSelection(), c = x._nextSibling(), b.forEach(function(e) {
            t.parent.moveBefore(e, t)
          }), this.focus(i.focusElement || this._getElementName(p)), this.editor._onAction("moveNodes", {
            nodes: b,
            oldBeforeNode: c,
            newBeforeNode: t,
            oldSelection: s,
            newSelection: this.editor.getSelection()
          })))
        }
      } else if (40 == u)
        if (g && !m) n = this._nextNode(), n && (this.editor.deselect(!0), n.focus(i.focusElement || this._getElementName(p))), v = !0;
        else if (!g && f && m && y) n = this._nextNode(), n && (h = this.editor.multiselection, h.start = h.start || this, h.end = n, d = this.editor._findTopLevelNodes(h.start, h.end), this.editor.select(d), n.focus("field")), v = !0;
      else if (g && m && y) {
        n = x.expanded ? x.append ? x.append._nextNode() : void 0 : x._nextNode();
        var T = n && (n._nextNode() || n.parent.append);
        T && T.parent && (s = this.editor.getSelection(), c = x._nextSibling(), b.forEach(function(e) {
          T.parent.moveBefore(e, T)
        }), this.focus(i.focusElement || this._getElementName(p)), this.editor._onAction("moveNodes", {
          nodes: b,
          oldBeforeNode: c,
          newBeforeNode: T,
          oldSelection: s,
          newSelection: this.editor.getSelection()
        })), v = !0
      }
      v && (e.preventDefault(), e.stopPropagation())
    }, i.prototype._onExpand = function(e) {
      if (e) {
        var t = this.dom.tr.parentNode,
          n = t.parentNode,
          i = n.scrollTop;
        n.removeChild(t)
      }
      this.expanded ? this.collapse(e) : this.expand(e), e && (n.appendChild(t), n.scrollTop = i)
    }, i.onRemove = function(e) {
      if (!Array.isArray(e)) return i.onRemove([e]);
      if (e && e.length > 0) {
        var t = e[0],
          n = t.parent,
          o = t.editor,
          r = t.getIndex();
        o.highlighter.unhighlight();
        var s = o.getSelection();
        i.blurNodes(e);
        var a = o.getSelection();
        e.forEach(function(e) {
          e.parent._remove(e)
        }), o._onAction("removeNodes", {
          nodes: e.slice(0),
          parent: n,
          index: r,
          oldSelection: s,
          newSelection: a
        })
      }
    }, i.onDuplicate = function(e) {
      if (!Array.isArray(e)) return i.onDuplicate([e]);
      if (e && e.length > 0) {
        var t = e[e.length - 1],
          n = t.parent,
          o = t.editor;
        o.deselect(o.multiselection.nodes);
        var r = o.getSelection(),
          s = t,
          a = e.map(function(e) {
            var t = e.clone();
            return n.insertAfter(t, s), s = t, t
          });
        1 === e.length ? a[0].focus() : o.select(a);
        var l = o.getSelection();
        o._onAction("duplicateNodes", {
          afterNode: t,
          nodes: a,
          parent: n,
          oldSelection: r,
          newSelection: l
        })
      }
    }, i.prototype._onInsertBefore = function(e, t, n) {
      var o = this.editor.getSelection(),
        r = new i(this.editor, {
          field: void 0 != e ? e : "",
          value: void 0 != t ? t : "",
          type: n
        });
      r.expand(!0), this.parent.insertBefore(r, this), this.editor.highlighter.unhighlight(), r.focus("field");
      var s = this.editor.getSelection();
      this.editor._onAction("insertBeforeNodes", {
        nodes: [r],
        beforeNode: this,
        parent: this.parent,
        oldSelection: o,
        newSelection: s
      })
    }, i.prototype._onInsertAfter = function(e, t, n) {
      var o = this.editor.getSelection(),
        r = new i(this.editor, {
          field: void 0 != e ? e : "",
          value: void 0 != t ? t : "",
          type: n
        });
      r.expand(!0), this.parent.insertAfter(r, this), this.editor.highlighter.unhighlight(), r.focus("field");
      var s = this.editor.getSelection();
      this.editor._onAction("insertAfterNodes", {
        nodes: [r],
        afterNode: this,
        parent: this.parent,
        oldSelection: o,
        newSelection: s
      })
    }, i.prototype._onAppend = function(e, t, n) {
      var o = this.editor.getSelection(),
        r = new i(this.editor, {
          field: void 0 != e ? e : "",
          value: void 0 != t ? t : "",
          type: n
        });
      r.expand(!0), this.parent.appendChild(r), this.editor.highlighter.unhighlight(), r.focus("field");
      var s = this.editor.getSelection();
      this.editor._onAction("appendNodes", {
        nodes: [r],
        parent: this.parent,
        oldSelection: o,
        newSelection: s
      })
    }, i.prototype._onChangeType = function(e) {
      var t = this.type;
      if (e != t) {
        var n = this.editor.getSelection();
        this.changeType(e);
        var i = this.editor.getSelection();
        this.editor._onAction("changeType", {
          node: this,
          oldType: t,
          newType: e,
          oldSelection: n,
          newSelection: i
        })
      }
    }, i.prototype.sort = function(e) {
      if (this._hasChilds()) {
        var t = "desc" == e ? -1 : 1,
          n = "array" == this.type ? "value" : "field";
        this.hideChilds();
        var i = this.childs,
          r = this.sortOrder;
        this.childs = this.childs.concat(), this.childs.sort(function(e, i) {
          return t * o(e[n], i[n])
        }), this.sortOrder = 1 == t ? "asc" : "desc", this.editor._onAction("sort", {
          node: this,
          oldChilds: i,
          oldSort: r,
          newChilds: this.childs,
          newSort: this.sortOrder
        }), this.showChilds()
      }
    }, i.prototype.getAppend = function() {
      return this.append || (this.append = new l(this.editor), this.append.setParent(this)), this.append.getDom()
    }, i.getNodeFromTarget = function(e) {
      for (; e;) {
        if (e.node) return e.node;
        e = e.parentNode
      }
    }, i.blurNodes = function(e) {
      if (!Array.isArray(e)) return void i.blurNodes([e]);
      var t = e[0],
        n = t.parent,
        o = t.getIndex();
      n.childs[o + e.length] ? n.childs[o + e.length].focus() : n.childs[o - 1] ? n.childs[o - 1].focus() : n.focus()
    }, i.prototype._nextSibling = function() {
      var e = this.parent.childs.indexOf(this);
      return this.parent.childs[e + 1] || this.parent.append
    }, i.prototype._previousNode = function() {
      var e = null,
        t = this.getDom();
      if (t && t.parentNode) {
        var n = t;
        do n = n.previousSibling, e = i.getNodeFromTarget(n); while (n && e instanceof l && !e.isVisible())
      }
      return e
    }, i.prototype._nextNode = function() {
      var e = null,
        t = this.getDom();
      if (t && t.parentNode) {
        var n = t;
        do n = n.nextSibling, e = i.getNodeFromTarget(n); while (n && e instanceof l && !e.isVisible())
      }
      return e
    }, i.prototype._firstNode = function() {
      var e = null,
        t = this.getDom();
      if (t && t.parentNode) {
        var n = t.parentNode.firstChild;
        e = i.getNodeFromTarget(n)
      }
      return e
    }, i.prototype._lastNode = function() {
      var e = null,
        t = this.getDom();
      if (t && t.parentNode) {
        var n = t.parentNode.lastChild;
        for (e = i.getNodeFromTarget(n); n && e instanceof l && !e.isVisible();) n = n.previousSibling, e = i.getNodeFromTarget(n)
      }
      return e
    }, i.prototype._previousElement = function(e) {
      var t = this.dom;
      switch (e) {
        case t.value:
          if (this.fieldEditable) return t.field;
        case t.field:
          if (this._hasChilds()) return t.expand;
        case t.expand:
          return t.menu;
        case t.menu:
          if (t.drag) return t.drag;
        default:
          return null
      }
    }, i.prototype._nextElement = function(e) {
      var t = this.dom;
      switch (e) {
        case t.drag:
          return t.menu;
        case t.menu:
          if (this._hasChilds()) return t.expand;
        case t.expand:
          if (this.fieldEditable) return t.field;
        case t.field:
          if (!this._hasChilds()) return t.value;
        default:
          return null
      }
    }, i.prototype._getElementName = function(e) {
      var t = this.dom;
      for (var n in t)
        if (t.hasOwnProperty(n) && t[n] == e) return n;
      return null
    }, i.prototype._hasChilds = function() {
      return "array" == this.type || "object" == this.type
    }, i.TYPE_TITLES = {
      auto: 'Field type "auto". The field type is automatically determined from the value and can be a string, number, boolean, or null.',
      object: 'Field type "object". An object contains an unordered set of key/value pairs.',
      array: 'Field type "array". An array contains an ordered collection of values.',
      string: 'Field type "string". Field type is not determined from the value, but always returned as string.'
    }, i.prototype.showContextMenu = function(e, t) {
      var n = this,
        o = i.TYPE_TITLES,
        s = [];
      if (this.editable.value && s.push({
          text: "Type",
          title: "Change the type of this field",
          className: "jsoneditor-type-" + this.type,
          submenu: [{
            text: "Auto",
            className: "jsoneditor-type-auto" + ("auto" == this.type ? " jsoneditor-selected" : ""),
            title: o.auto,
            click: function() {
              n._onChangeType("auto")
            }
          }, {
            text: "Array",
            className: "jsoneditor-type-array" + ("array" == this.type ? " jsoneditor-selected" : ""),
            title: o.array,
            click: function() {
              n._onChangeType("array")
            }
          }, {
            text: "Object",
            className: "jsoneditor-type-object" + ("object" == this.type ? " jsoneditor-selected" : ""),
            title: o.object,
            click: function() {
              n._onChangeType("object")
            }
          }, {
            text: "String",
            className: "jsoneditor-type-string" + ("string" == this.type ? " jsoneditor-selected" : ""),
            title: o.string,
            click: function() {
              n._onChangeType("string")
            }
          }]
        }), this._hasChilds()) {
        var a = "asc" == this.sortOrder ? "desc" : "asc";
        s.push({
          text: "Sort",
          title: "Sort the childs of this " + this.type,
          className: "jsoneditor-sort-" + a,
          click: function() {
            n.sort(a)
          },
          submenu: [{
            text: "Ascending",
            className: "jsoneditor-sort-asc",
            title: "Sort the childs of this " + this.type + " in ascending order",
            click: function() {
              n.sort("asc")
            }
          }, {
            text: "Descending",
            className: "jsoneditor-sort-desc",
            title: "Sort the childs of this " + this.type + " in descending order",
            click: function() {
              n.sort("desc")
            }
          }]
        })
      }
      if (this.parent && this.parent._hasChilds()) {
        s.length && s.push({
          type: "separator"
        });
        var l = n.parent.childs;
        n == l[l.length - 1] && s.push({
          text: "Append",
          title: "Append a new field with type 'auto' after this field (Ctrl+Shift+Ins)",
          submenuTitle: "Select the type of the field to be appended",
          className: "jsoneditor-append",
          click: function() {
            n._onAppend("", "", "auto")
          },
          submenu: [{
            text: "Auto",
            className: "jsoneditor-type-auto",
            title: o.auto,
            click: function() {
              n._onAppend("", "", "auto")
            }
          }, {
            text: "Array",
            className: "jsoneditor-type-array",
            title: o.array,
            click: function() {
              n._onAppend("", [])
            }
          }, {
            text: "Object",
            className: "jsoneditor-type-object",
            title: o.object,
            click: function() {
              n._onAppend("", {})
            }
          }, {
            text: "String",
            className: "jsoneditor-type-string",
            title: o.string,
            click: function() {
              n._onAppend("", "", "string")
            }
          }]
        }), s.push({
          text: "Insert",
          title: "Insert a new field with type 'auto' before this field (Ctrl+Ins)",
          submenuTitle: "Select the type of the field to be inserted",
          className: "jsoneditor-insert",
          click: function() {
            n._onInsertBefore("", "", "auto")
          },
          submenu: [{
            text: "Auto",
            className: "jsoneditor-type-auto",
            title: o.auto,
            click: function() {
              n._onInsertBefore("", "", "auto")
            }
          }, {
            text: "Array",
            className: "jsoneditor-type-array",
            title: o.array,
            click: function() {
              n._onInsertBefore("", [])
            }
          }, {
            text: "Object",
            className: "jsoneditor-type-object",
            title: o.object,
            click: function() {
              n._onInsertBefore("", {})
            }
          }, {
            text: "String",
            className: "jsoneditor-type-string",
            title: o.string,
            click: function() {
              n._onInsertBefore("", "", "string")
            }
          }]
        }), this.editable.field && (s.push({
          text: "Duplicate",
          title: "Duplicate this field (Ctrl+D)",
          className: "jsoneditor-duplicate",
          click: function() {
            i.onDuplicate(n)
          }
        }), s.push({
          text: "Remove",
          title: "Remove this field (Ctrl+Del)",
          className: "jsoneditor-remove",
          click: function() {
            i.onRemove(n)
          }
        }))
      }
      var c = new r(s, {
        close: t
      });
      c.show(e, this.editor.content)
    }, i.prototype._getType = function(e) {
      return e instanceof Array ? "array" : e instanceof Object ? "object" : "string" == typeof e && "string" != typeof this._stringCast(e) ? "string" : "auto"
    }, i.prototype._stringCast = function(e) {
      var t = e.toLowerCase(),
        n = Number(e),
        i = parseFloat(e);
      return "" == e ? "" : "null" == t ? null : "true" == t ? !0 : "false" == t ? !1 : isNaN(n) || isNaN(i) ? e : n
    }, i.prototype._escapeHTML = function(e) {
      if ("string" != typeof e) return String(e);
      var t = String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/  /g, " &nbsp;").replace(/^ /, "&nbsp;").replace(/ $/, "&nbsp;"),
        n = JSON.stringify(t),
        i = n.substring(1, n.length - 1);
      return this.editor.options.escapeUnicode === !0 && (i = a.escapeUnicodeChars(i)), i
    }, i.prototype._unescapeHTML = function(e) {
      var t = '"' + this._escapeJSON(e) + '"',
        n = a.parse(t);
      return n.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;|\u00A0/g, " ").replace(/&amp;/g, "&")
    }, i.prototype._escapeJSON = function(e) {
      for (var t = "", n = 0; n < e.length;) {
        var i = e.charAt(n);
        "\n" == i ? t += "\\n" : "\\" == i ? (t += i, n++, i = e.charAt(n), "" !== i && -1 != '"\\/bfnrtu'.indexOf(i) || (t += "\\"), t += i) : t += '"' == i ? '\\"' : i, n++
      }
      return t
    };
    var l = s(i);
    e.exports = i
  }, function(e, t) {
    e.exports = function n(e, t) {
      "use strict";
      var i, o, r = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
        s = /(^[ ]*|[ ]*$)/g,
        a = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        l = /^0x[0-9a-f]+$/i,
        c = /^0/,
        d = function(e) {
          return n.insensitive && ("" + e).toLowerCase() || "" + e
        },
        h = d(e).replace(s, "") || "",
        u = d(t).replace(s, "") || "",
        p = h.replace(r, "\x00$1\x00").replace(/\0$/, "").replace(/^\0/, "").split("\x00"),
        f = u.replace(r, "\x00$1\x00").replace(/\0$/, "").replace(/^\0/, "").split("\x00"),
        m = parseInt(h.match(l), 16) || 1 !== p.length && h.match(a) && Date.parse(h),
        g = parseInt(u.match(l), 16) || m && u.match(a) && Date.parse(u) || null;
      if (g) {
        if (g > m) return -1;
        if (m > g) return 1
      }
      for (var v = 0, y = Math.max(p.length, f.length); y > v; v++) {
        if (i = !(p[v] || "").match(c) && parseFloat(p[v]) || p[v] || 0, o = !(f[v] || "").match(c) && parseFloat(f[v]) || f[v] || 0, isNaN(i) !== isNaN(o)) return isNaN(i) ? 1 : -1;
        if (typeof i != typeof o && (i += "", o += ""), o > i) return -1;
        if (i > o) return 1
      }
      return 0
    }
  }, function(e, t, n) {
    "use strict";

    function i(e) {
      function t(e) {
        this.editor = e, this.dom = {}
      }
      return t.prototype = new e, t.prototype.getDom = function() {
        var e = this.dom;
        if (e.tr) return e.tr;
        this._updateEditability();
        var t = document.createElement("tr");
        if (t.node = this, e.tr = t, this.editable.field) {
          e.tdDrag = document.createElement("td");
          var n = document.createElement("td");
          e.tdMenu = n;
          var i = document.createElement("button");
          i.className = "jsoneditor-contextmenu", i.title = "Click to open the actions menu (Ctrl+M)", e.menu = i, n.appendChild(e.menu)
        }
        var o = document.createElement("td"),
          r = document.createElement("div");
        return r.innerHTML = "(empty)", r.className = "jsoneditor-readonly", o.appendChild(r), e.td = o, e.text = r, this.updateDom(), t
      }, t.prototype.updateDom = function() {
        var e = this.dom,
          t = e.td;
        t && (t.style.paddingLeft = 24 * this.getLevel() + 26 + "px");
        var n = e.text;
        n && (n.innerHTML = "(empty " + this.parent.type + ")");
        var i = e.tr;
        this.isVisible() ? e.tr.firstChild || (e.tdDrag && i.appendChild(e.tdDrag), e.tdMenu && i.appendChild(e.tdMenu), i.appendChild(t)) : e.tr.firstChild && (e.tdDrag && i.removeChild(e.tdDrag), e.tdMenu && i.removeChild(e.tdMenu), i.removeChild(t))
      }, t.prototype.isVisible = function() {
        return 0 == this.parent.childs.length
      }, t.prototype.showContextMenu = function(t, n) {
        var i = this,
          o = e.TYPE_TITLES,
          s = [{
            text: "Append",
            title: "Append a new field with type 'auto' (Ctrl+Shift+Ins)",
            submenuTitle: "Select the type of the field to be appended",
            className: "jsoneditor-insert",
            click: function() {
              i._onAppend("", "", "auto")
            },
            submenu: [{
              text: "Auto",
              className: "jsoneditor-type-auto",
              title: o.auto,
              click: function() {
                i._onAppend("", "", "auto")
              }
            }, {
              text: "Array",
              className: "jsoneditor-type-array",
              title: o.array,
              click: function() {
                i._onAppend("", [])
              }
            }, {
              text: "Object",
              className: "jsoneditor-type-object",
              title: o.object,
              click: function() {
                i._onAppend("", {})
              }
            }, {
              text: "String",
              className: "jsoneditor-type-string",
              title: o.string,
              click: function() {
                i._onAppend("", "", "string")
              }
            }]
          }],
          a = new r(s, {
            close: n
          });
        a.show(t, this.editor.content)
      }, t.prototype.onEvent = function(e) {
        var t = e.type,
          n = e.target || e.srcElement,
          i = this.dom,
          r = i.menu;
        if (n == r && ("mouseover" == t ? this.editor.highlighter.highlight(this.parent) : "mouseout" == t && this.editor.highlighter.unhighlight()), "click" == t && n == i.menu) {
          var s = this.editor.highlighter;
          s.highlight(this.parent), s.lock(), o.addClassName(i.menu, "jsoneditor-selected"), this.showContextMenu(i.menu, function() {
            o.removeClassName(i.menu, "jsoneditor-selected"), s.unlock(), s.unhighlight()
          })
        }
        "keydown" == t && this.onKeyDown(e)
      }, t
    }
    var o = n(4),
      r = n(7);
    e.exports = i
  }, function(e, t, n) {
    "use strict";

    function i(e, t, n, i) {
      for (var r = {
          code: {
            text: "Code",
            title: "Switch to code highlighter",
            click: function() {
              i("code")
            }
          },
          form: {
            text: "Form",
            title: "Switch to form editor",
            click: function() {
              i("form")
            }
          },
          text: {
            text: "Text",
            title: "Switch to plain text editor",
            click: function() {
              i("text")
            }
          },
          tree: {
            text: "Tree",
            title: "Switch to tree editor",
            click: function() {
              i("tree")
            }
          },
          view: {
            text: "View",
            title: "Switch to tree view",
            click: function() {
              i("view")
            }
          }
        }, s = [], a = 0; a < t.length; a++) {
        var l = t[a],
          c = r[l];
        if (!c) throw new Error('Unknown mode "' + l + '"');
        c.className = "jsoneditor-type-modes" + (n == l ? " jsoneditor-selected" : ""), s.push(c)
      }
      var d = r[n];
      if (!d) throw new Error('Unknown mode "' + n + '"');
      var h = d.text,
        u = document.createElement("button");
      u.className = "jsoneditor-modes jsoneditor-separator", u.innerHTML = h + " &#x25BE;", u.title = "Switch editor mode", u.onclick = function() {
        var e = new o(s);
        e.show(u)
      };
      var p = document.createElement("div");
      p.className = "jsoneditor-modes", p.style.position = "relative", p.appendChild(u), e.appendChild(p), this.dom = {
        container: e,
        box: u,
        frame: p
      }
    }
    var o = n(7);
    i.prototype.focus = function() {
      this.dom.box.focus()
    }, i.prototype.destroy = function() {
      this.dom && this.dom.frame && this.dom.frame.parentNode && this.dom.frame.parentNode.removeChild(this.dom.frame), this.dom = null
    }, e.exports = i
  }, function(e, t, n) {
    "use strict";
    var i;
    try {
      i = n(13)
    } catch (o) {}
    var r = n(11),
      s = n(4),
      a = {},
      l = 3;
    a.create = function(e, t) {
      t = t || {}, this.options = t, t.indentation ? this.indentation = Number(t.indentation) : this.indentation = 2;
      var n = t.ace ? t.ace : i;
      this.mode = "code" == t.mode ? "code" : "text", "code" == this.mode && "undefined" == typeof n && (this.mode = "text", console.warn("Failed to load Ace editor, falling back to plain text mode. Please use a JSONEditor bundle including Ace, or pass Ace as via the configuration option `ace`.")), this.theme = t.theme || "ace/theme/jsoneditor";
      var o = this;
      this.container = e, this.dom = {}, this.aceEditor = void 0, this.textarea = void 0, this.validateSchema = null, this._debouncedValidate = s.debounce(this.validate.bind(this), this.DEBOUNCE_INTERVAL), this.width = e.clientWidth, this.height = e.clientHeight, this.frame = document.createElement("div"), this.frame.className = "jsoneditor jsoneditor-mode-" + this.options.mode, this.frame.onclick = function(e) {
        e.preventDefault()
      }, this.frame.onkeydown = function(e) {
        o._onKeyDown(e)
      }, this.menu = document.createElement("div"), this.menu.className = "jsoneditor-menu", this.frame.appendChild(this.menu);
      var a = document.createElement("button");
      a.className = "jsoneditor-format", a.title = "Format JSON data, with proper indentation and line feeds (Ctrl+\\)", this.menu.appendChild(a), a.onclick = function() {
        try {
          o.format(), o._onChange()
        } catch (e) {
          o._onError(e)
        }
      };
      var l = document.createElement("button");
      if (l.className = "jsoneditor-compact", l.title = "Compact JSON data, remove all whitespaces (Ctrl+Shift+\\)", this.menu.appendChild(l), l.onclick = function() {
          try {
            o.compact(), o._onChange()
          } catch (e) {
            o._onError(e)
          }
        }, this.options && this.options.modes && this.options.modes.length && (this.modeSwitcher = new r(this.menu, this.options.modes, this.options.mode, function(e) {
          o.setMode(e), o.modeSwitcher.focus()
        })), this.content = document.createElement("div"), this.content.className = "jsoneditor-outer", this.frame.appendChild(this.content), this.container.appendChild(this.frame), "code" == this.mode) {
        this.editorDom = document.createElement("div"), this.editorDom.style.height = "100%", this.editorDom.style.width = "100%", this.content.appendChild(this.editorDom);
        var c = n.edit(this.editorDom);
        c.$blockScrolling = 1 / 0, c.setTheme(this.theme), c.setShowPrintMargin(!1), c.setFontSize(13), c.getSession().setMode("ace/mode/json"), c.getSession().setTabSize(this.indentation), c.getSession().setUseSoftTabs(!0), c.getSession().setUseWrapMode(!0), c.commands.bindKey("Ctrl-L", null), c.commands.bindKey("Command-L", null), this.aceEditor = c, this.hasOwnProperty("editor") || Object.defineProperty(this, "editor", {
          get: function() {
            return console.warn('Property "editor" has been renamed to "aceEditor".'), o.aceEditor
          },
          set: function(e) {
            console.warn('Property "editor" has been renamed to "aceEditor".'), o.aceEditor = e
          }
        });
        var d = document.createElement("a");
        d.appendChild(document.createTextNode("powered by ace")), d.href = "http://ace.ajax.org", d.target = "_blank", d.className = "jsoneditor-poweredBy", d.onclick = function() {
          window.open(d.href, d.target)
        }, this.menu.appendChild(d), c.on("change", this._onChange.bind(this))
      } else {
        var h = document.createElement("textarea");
        h.className = "jsoneditor-text", h.spellcheck = !1, this.content.appendChild(h), this.textarea = h, null === this.textarea.oninput ? this.textarea.oninput = this._onChange.bind(this) : this.textarea.onchange = this._onChange.bind(this)
      }
      this.setSchema(this.options.schema)
    }, a._onChange = function() {
      if (this._debouncedValidate(), this.options.onChange) try {
        this.options.onChange()
      } catch (e) {
        console.error("Error in onChange callback: ", e)
      }
    }, a._onKeyDown = function(e) {
      var t = e.which || e.keyCode,
        n = !1;
      220 == t && e.ctrlKey && (e.shiftKey ? (this.compact(), this._onChange()) : (this.format(), this._onChange()), n = !0), n && (e.preventDefault(), e.stopPropagation())
    }, a.destroy = function() {
      this.aceEditor && (this.aceEditor.destroy(), this.aceEditor = null), this.frame && this.container && this.frame.parentNode == this.container && this.container.removeChild(this.frame), this.modeSwitcher && (this.modeSwitcher.destroy(), this.modeSwitcher = null), this.textarea = null, this._debouncedValidate = null
    }, a.compact = function() {
      var e = this.get(),
        t = JSON.stringify(e);
      this.setText(t)
    }, a.format = function() {
      var e = this.get(),
        t = JSON.stringify(e, null, this.indentation);
      this.setText(t)
    }, a.focus = function() {
      this.textarea && this.textarea.focus(), this.aceEditor && this.aceEditor.focus()
    }, a.resize = function() {
      if (this.aceEditor) {
        var e = !1;
        this.aceEditor.resize(e)
      }
    }, a.set = function(e) {
      this.setText(JSON.stringify(e, null, this.indentation))
    }, a.get = function() {
      var e, t = this.getText();
      try {
        e = s.parse(t)
      } catch (n) {
        t = s.sanitize(t), e = s.parse(t)
      }
      return e
    }, a.getText = function() {
      return this.textarea ? this.textarea.value : this.aceEditor ? this.aceEditor.getValue() : ""
    }, a.setText = function(e) {
      var t;
      if (t = this.options.escapeUnicode === !0 ? s.escapeUnicodeChars(e) : e, this.textarea && (this.textarea.value = t), this.aceEditor) {
        var n = this.options.onChange;
        this.options.onChange = null, this.aceEditor.setValue(t, -1), this.options.onChange = n
      }
      this.validate()
    }, a.validate = function() {
      this.dom.validationErrors && (this.dom.validationErrors.parentNode.removeChild(this.dom.validationErrors), this.dom.validationErrors = null, this.content.style.marginBottom = "", this.content.style.paddingBottom = "");
      var e, t = !1,
        n = [];
      try {
        e = this.get(), t = !0
      } catch (i) {}
      if (t && this.validateSchema) {
        var o = this.validateSchema(e);
        o || (n = this.validateSchema.errors.map(function(e) {
          return s.improveSchemaError(e)
        }))
      }
      if (n.length > 0) {
        var r = n.length > l;
        if (r) {
          n = n.slice(0, l);
          var a = this.validateSchema.errors.length - l;
          n.push("(" + a + " more errors...)")
        }
        var c = document.createElement("div");
        c.innerHTML = '<table class="jsoneditor-text-errors"><tbody>' + n.map(function(e) {
          var t;
          return t = "string" == typeof e ? '<td colspan="2"><pre>' + e + "</pre></td>" : "<td>" + e.dataPath + "</td><td>" + e.message + "</td>", '<tr><td><button class="jsoneditor-schema-error"></button></td>' + t + "</tr>"
        }).join("") + "</tbody></table>", this.dom.validationErrors = c, this.frame.appendChild(c);
        var d = c.clientHeight;
        this.content.style.marginBottom = -d + "px", this.content.style.paddingBottom = d + "px"
      }
      if (this.aceEditor) {
        var h = !1;
        this.aceEditor.resize(h)
      }
    }, e.exports = [{
      mode: "text",
      mixin: a,
      data: "text",
      load: a.format
    }, {
      mode: "code",
      mixin: a,
      data: "text",
      load: a.format
    }]
  }, function(e, t, n) {
    var i = n(! function() {
      var e = new Error('Cannot find module "brace"');
      throw e.code = "MODULE_NOT_FOUND", e
    }());
    n(14), n(16), n(17), e.exports = i
  }, function(e, t, n) {
    ace.define("ace/mode/json_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        o = e("./text_highlight_rules").TextHighlightRules,
        r = function() {
          this.$rules = {
            start: [{
              token: "variable",
              regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)'
            }, {
              token: "string",
              regex: '"',
              next: "string"
            }, {
              token: "constant.numeric",
              regex: "0[xX][0-9a-fA-F]+\\b"
            }, {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
              token: "constant.language.boolean",
              regex: "(?:true|false)\\b"
            }, {
              token: "invalid.illegal",
              regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
              token: "invalid.illegal",
              regex: "\\/\\/.*$"
            }, {
              token: "paren.lparen",
              regex: "[[({]"
            }, {
              token: "paren.rparen",
              regex: "[\\])}]"
            }, {
              token: "text",
              regex: "\\s+"
            }],
            string: [{
              token: "constant.language.escape",
              regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/
            }, {
              token: "string",
              regex: '[^"\\\\]+'
            }, {
              token: "string",
              regex: '"',
              next: "start"
            }, {
              token: "string",
              regex: "",
              next: "start"
            }]
          }
        };
      i.inherits(r, o), t.JsonHighlightRules = r
    }), ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(e, t, n) {
      "use strict";
      var i = e("../range").Range,
        o = function() {};
      (function() {
        this.checkOutdent = function(e, t) {
          return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1
        }, this.autoOutdent = function(e, t) {
          var n = e.getLine(t),
            o = n.match(/^(\s*\})/);
          if (!o) return 0;
          var r = o[1].length,
            s = e.findMatchingBracket({
              row: t,
              column: r
            });
          if (!s || s.row == t) return 0;
          var a = this.$getIndent(e.getLine(s.row));
          e.replace(new i(t, 0, t, r - 1), a)
        }, this.$getIndent = function(e) {
          return e.match(/^\s*/)[0]
        }
      }).call(o.prototype), t.MatchingBraceOutdent = o
    }), ace.define("ace/mode/behaviour/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour", "ace/token_iterator", "ace/lib/lang"], function(e, t, n) {
      "use strict";
      var i, o = e("../../lib/oop"),
        r = e("../behaviour").Behaviour,
        s = e("../../token_iterator").TokenIterator,
        a = e("../../lib/lang"),
        l = ["text", "paren.rparen", "punctuation.operator"],
        c = ["text", "paren.rparen", "punctuation.operator", "comment"],
        d = {},
        h = function(e) {
          var t = -1;
          return e.multiSelect && (t = e.selection.index, d.rangeCount != e.multiSelect.rangeCount && (d = {
            rangeCount: e.multiSelect.rangeCount
          })), d[t] ? i = d[t] : void(i = d[t] = {
            autoInsertedBrackets: 0,
            autoInsertedRow: -1,
            autoInsertedLineEnd: "",
            maybeInsertedBrackets: 0,
            maybeInsertedRow: -1,
            maybeInsertedLineStart: "",
            maybeInsertedLineEnd: ""
          })
        },
        u = function(e, t, n, i) {
          var o = e.end.row - e.start.row;
          return {
            text: n + t + i,
            selection: [0, e.start.column + 1, o, e.end.column + (o ? 0 : 1)]
          }
        },
        p = function() {
          this.add("braces", "insertion", function(e, t, n, o, r) {
            var s = n.getCursorPosition(),
              l = o.doc.getLine(s.row);
            if ("{" == r) {
              h(n);
              var c = n.getSelectionRange(),
                d = o.doc.getTextRange(c);
              if ("" !== d && "{" !== d && n.getWrapBehavioursEnabled()) return u(c, d, "{", "}");
              if (p.isSaneInsertion(n, o)) return /[\]\}\)]/.test(l[s.column]) || n.inMultiSelectMode ? (p.recordAutoInsert(n, o, "}"), {
                text: "{}",
                selection: [1, 1]
              }) : (p.recordMaybeInsert(n, o, "{"), {
                text: "{",
                selection: [1, 1]
              })
            } else if ("}" == r) {
              h(n);
              var f = l.substring(s.column, s.column + 1);
              if ("}" == f) {
                var m = o.$findOpeningBracket("}", {
                  column: s.column + 1,
                  row: s.row
                });
                if (null !== m && p.isAutoInsertedClosing(s, l, r)) return p.popAutoInsertedClosing(), {
                  text: "",
                  selection: [1, 1]
                }
              }
            } else {
              if ("\n" == r || "\r\n" == r) {
                h(n);
                var g = "";
                p.isMaybeInsertedClosing(s, l) && (g = a.stringRepeat("}", i.maybeInsertedBrackets), p.clearMaybeInsertedClosing());
                var f = l.substring(s.column, s.column + 1);
                if ("}" === f) {
                  var v = o.findMatchingBracket({
                    row: s.row,
                    column: s.column + 1
                  }, "}");
                  if (!v) return null;
                  var y = this.$getIndent(o.getLine(v.row))
                } else {
                  if (!g) return void p.clearMaybeInsertedClosing();
                  var y = this.$getIndent(l)
                }
                var b = y + o.getTabString();
                return {
                  text: "\n" + b + "\n" + y + g,
                  selection: [1, b.length, 1, b.length]
                }
              }
              p.clearMaybeInsertedClosing()
            }
          }), this.add("braces", "deletion", function(e, t, n, o, r) {
            var s = o.doc.getTextRange(r);
            if (!r.isMultiLine() && "{" == s) {
              h(n);
              var a = o.doc.getLine(r.start.row),
                l = a.substring(r.end.column, r.end.column + 1);
              if ("}" == l) return r.end.column++, r;
              i.maybeInsertedBrackets--
            }
          }), this.add("parens", "insertion", function(e, t, n, i, o) {
            if ("(" == o) {
              h(n);
              var r = n.getSelectionRange(),
                s = i.doc.getTextRange(r);
              if ("" !== s && n.getWrapBehavioursEnabled()) return u(r, s, "(", ")");
              if (p.isSaneInsertion(n, i)) return p.recordAutoInsert(n, i, ")"), {
                text: "()",
                selection: [1, 1]
              }
            } else if (")" == o) {
              h(n);
              var a = n.getCursorPosition(),
                l = i.doc.getLine(a.row),
                c = l.substring(a.column, a.column + 1);
              if (")" == c) {
                var d = i.$findOpeningBracket(")", {
                  column: a.column + 1,
                  row: a.row
                });
                if (null !== d && p.isAutoInsertedClosing(a, l, o)) return p.popAutoInsertedClosing(), {
                  text: "",
                  selection: [1, 1]
                }
              }
            }
          }), this.add("parens", "deletion", function(e, t, n, i, o) {
            var r = i.doc.getTextRange(o);
            if (!o.isMultiLine() && "(" == r) {
              h(n);
              var s = i.doc.getLine(o.start.row),
                a = s.substring(o.start.column + 1, o.start.column + 2);
              if (")" == a) return o.end.column++, o
            }
          }), this.add("brackets", "insertion", function(e, t, n, i, o) {
            if ("[" == o) {
              h(n);
              var r = n.getSelectionRange(),
                s = i.doc.getTextRange(r);
              if ("" !== s && n.getWrapBehavioursEnabled()) return u(r, s, "[", "]");
              if (p.isSaneInsertion(n, i)) return p.recordAutoInsert(n, i, "]"), {
                text: "[]",
                selection: [1, 1]
              }
            } else if ("]" == o) {
              h(n);
              var a = n.getCursorPosition(),
                l = i.doc.getLine(a.row),
                c = l.substring(a.column, a.column + 1);
              if ("]" == c) {
                var d = i.$findOpeningBracket("]", {
                  column: a.column + 1,
                  row: a.row
                });
                if (null !== d && p.isAutoInsertedClosing(a, l, o)) return p.popAutoInsertedClosing(), {
                  text: "",
                  selection: [1, 1]
                }
              }
            }
          }), this.add("brackets", "deletion", function(e, t, n, i, o) {
            var r = i.doc.getTextRange(o);
            if (!o.isMultiLine() && "[" == r) {
              h(n);
              var s = i.doc.getLine(o.start.row),
                a = s.substring(o.start.column + 1, o.start.column + 2);
              if ("]" == a) return o.end.column++, o
            }
          }), this.add("string_dquotes", "insertion", function(e, t, n, i, o) {
            if ('"' == o || "'" == o) {
              h(n);
              var r = o,
                s = n.getSelectionRange(),
                a = i.doc.getTextRange(s);
              if ("" !== a && "'" !== a && '"' != a && n.getWrapBehavioursEnabled()) return u(s, a, r, r);
              if (!a) {
                var l = n.getCursorPosition(),
                  c = i.doc.getLine(l.row),
                  d = c.substring(l.column - 1, l.column),
                  p = c.substring(l.column, l.column + 1),
                  f = i.getTokenAt(l.row, l.column),
                  m = i.getTokenAt(l.row, l.column + 1);
                if ("\\" == d && f && /escape/.test(f.type)) return null;
                var g, v = f && /string|escape/.test(f.type),
                  y = !m || /string|escape/.test(m.type);
                if (p == r) g = v !== y;
                else {
                  if (v && !y) return null;
                  if (v && y) return null;
                  var b = i.$mode.tokenRe;
                  b.lastIndex = 0;
                  var w = b.test(d);
                  b.lastIndex = 0;
                  var x = b.test(d);
                  if (w || x) return null;
                  if (p && !/[\s;,.})\]\\]/.test(p)) return null;
                  g = !0
                }
                return {
                  text: g ? r + r : "",
                  selection: [1, 1]
                }
              }
            }
          }), this.add("string_dquotes", "deletion", function(e, t, n, i, o) {
            var r = i.doc.getTextRange(o);
            if (!o.isMultiLine() && ('"' == r || "'" == r)) {
              h(n);
              var s = i.doc.getLine(o.start.row),
                a = s.substring(o.start.column + 1, o.start.column + 2);
              if (a == r) return o.end.column++, o
            }
          })
        };
      p.isSaneInsertion = function(e, t) {
        var n = e.getCursorPosition(),
          i = new s(t, n.row, n.column);
        if (!this.$matchTokenType(i.getCurrentToken() || "text", l)) {
          var o = new s(t, n.row, n.column + 1);
          if (!this.$matchTokenType(o.getCurrentToken() || "text", l)) return !1
        }
        return i.stepForward(), i.getCurrentTokenRow() !== n.row || this.$matchTokenType(i.getCurrentToken() || "text", c)
      }, p.$matchTokenType = function(e, t) {
        return t.indexOf(e.type || e) > -1
      }, p.recordAutoInsert = function(e, t, n) {
        var o = e.getCursorPosition(),
          r = t.doc.getLine(o.row);
        this.isAutoInsertedClosing(o, r, i.autoInsertedLineEnd[0]) || (i.autoInsertedBrackets = 0), i.autoInsertedRow = o.row, i.autoInsertedLineEnd = n + r.substr(o.column), i.autoInsertedBrackets++
      }, p.recordMaybeInsert = function(e, t, n) {
        var o = e.getCursorPosition(),
          r = t.doc.getLine(o.row);
        this.isMaybeInsertedClosing(o, r) || (i.maybeInsertedBrackets = 0), i.maybeInsertedRow = o.row, i.maybeInsertedLineStart = r.substr(0, o.column) + n, i.maybeInsertedLineEnd = r.substr(o.column), i.maybeInsertedBrackets++
      }, p.isAutoInsertedClosing = function(e, t, n) {
        return i.autoInsertedBrackets > 0 && e.row === i.autoInsertedRow && n === i.autoInsertedLineEnd[0] && t.substr(e.column) === i.autoInsertedLineEnd
      }, p.isMaybeInsertedClosing = function(e, t) {
        return i.maybeInsertedBrackets > 0 && e.row === i.maybeInsertedRow && t.substr(e.column) === i.maybeInsertedLineEnd && t.substr(0, e.column) == i.maybeInsertedLineStart
      }, p.popAutoInsertedClosing = function() {
        i.autoInsertedLineEnd = i.autoInsertedLineEnd.substr(1), i.autoInsertedBrackets--
      }, p.clearMaybeInsertedClosing = function() {
        i && (i.maybeInsertedBrackets = 0, i.maybeInsertedRow = -1)
      }, o.inherits(p, r), t.CstyleBehaviour = p
    }), ace.define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function(e, t, n) {
      "use strict";
      var i = e("../../lib/oop"),
        o = e("../../range").Range,
        r = e("./fold_mode").FoldMode,
        s = t.FoldMode = function(e) {
          e && (this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)), this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)))
        };
      i.inherits(s, r),
        function() {
          this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/, this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/, this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/, this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/, this._getFoldWidgetBase = this.getFoldWidget, this.getFoldWidget = function(e, t, n) {
            var i = e.getLine(n);
            if (this.singleLineBlockCommentRe.test(i) && !this.startRegionRe.test(i) && !this.tripleStarBlockCommentRe.test(i)) return "";
            var o = this._getFoldWidgetBase(e, t, n);
            return !o && this.startRegionRe.test(i) ? "start" : o
          }, this.getFoldWidgetRange = function(e, t, n, i) {
            var o = e.getLine(n);
            if (this.startRegionRe.test(o)) return this.getCommentRegionBlock(e, o, n);
            var r = o.match(this.foldingStartMarker);
            if (r) {
              var s = r.index;
              if (r[1]) return this.openingBracketBlock(e, r[1], n, s);
              var a = e.getCommentFoldRange(n, s + r[0].length, 1);
              return a && !a.isMultiLine() && (i ? a = this.getSectionRange(e, n) : "all" != t && (a = null)), a
            }
            if ("markbegin" !== t) {
              var r = o.match(this.foldingStopMarker);
              if (r) {
                var s = r.index + r[0].length;
                return r[1] ? this.closingBracketBlock(e, r[1], n, s) : e.getCommentFoldRange(n, s, -1)
              }
            }
          }, this.getSectionRange = function(e, t) {
            var n = e.getLine(t),
              i = n.search(/\S/),
              r = t,
              s = n.length;
            t += 1;
            for (var a = t, l = e.getLength(); ++t < l;) {
              n = e.getLine(t);
              var c = n.search(/\S/);
              if (-1 !== c) {
                if (i > c) break;
                var d = this.getFoldWidgetRange(e, "all", t);
                if (d) {
                  if (d.start.row <= r) break;
                  if (d.isMultiLine()) t = d.end.row;
                  else if (i == c) break
                }
                a = t
              }
            }
            return new o(r, s, a, e.getLine(a).length)
          }, this.getCommentRegionBlock = function(e, t, n) {
            for (var i = t.search(/\s*$/), r = e.getLength(), s = n, a = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/, l = 1; ++n < r;) {
              t = e.getLine(n);
              var c = a.exec(t);
              if (c && (c[1] ? l-- : l++, !l)) break
            }
            var d = n;
            return d > s ? new o(s, i, d, t.length) : void 0
          }
        }.call(s.prototype)
    }), ace.define("ace/mode/json", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/json_highlight_rules", "ace/mode/matching_brace_outdent", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle", "ace/worker/worker_client"], function(e, t, i) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./text").Mode,
        s = e("./json_highlight_rules").JsonHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        l = e("./behaviour/cstyle").CstyleBehaviour,
        c = e("./folding/cstyle").FoldMode,
        d = e("../worker/worker_client").WorkerClient,
        h = function() {
          this.HighlightRules = s, this.$outdent = new a, this.$behaviour = new l, this.foldingRules = new c
        };
      o.inherits(h, r),
        function() {
          this.getNextLineIndent = function(e, t, n) {
            var i = this.$getIndent(t);
            if ("start" == e) {
              var o = t.match(/^.*[\{\(\[]\s*$/);
              o && (i += n)
            }
            return i
          }, this.checkOutdent = function(e, t, n) {
            return this.$outdent.checkOutdent(t, n)
          }, this.autoOutdent = function(e, t, n) {
            this.$outdent.autoOutdent(t, n)
          }, this.createWorker = function(e) {
            var t = new d(["ace"], n(15), "JsonWorker");
            return t.attachToDocument(e.getDocument()), t.on("annotate", function(t) {
              e.setAnnotations(t.data)
            }), t.on("terminate", function() {
              e.clearAnnotations()
            }), t
          }, this.$id = "ace/mode/json"
        }.call(h.prototype), t.Mode = h
    })
  }, function(e, t) {
    e.exports.id = "ace/mode/json_worker", e.exports.src = '"no use strict";(function(window){function resolveModuleId(id,paths){for(var testPath=id,tail="";testPath;){var alias=paths[testPath];if("string"==typeof alias)return alias+tail;if(alias)return alias.location.replace(/\\/*$/,"/")+(tail||alias.main||alias.name);if(alias===!1)return"";var i=testPath.lastIndexOf("/");if(-1===i)break;tail=testPath.substr(i)+tail,testPath=testPath.slice(0,i)}return id}if(!(void 0!==window.window&&window.document||window.acequire&&window.define)){window.console||(window.console=function(){var msgs=Array.prototype.slice.call(arguments,0);postMessage({type:"log",data:msgs})},window.console.error=window.console.warn=window.console.log=window.console.trace=window.console),window.window=window,window.ace=window,window.onerror=function(message,file,line,col,err){postMessage({type:"error",data:{message:message,data:err.data,file:file,line:line,col:col,stack:err.stack}})},window.normalizeModule=function(parentId,moduleName){if(-1!==moduleName.indexOf("!")){var chunks=moduleName.split("!");return window.normalizeModule(parentId,chunks[0])+"!"+window.normalizeModule(parentId,chunks[1])}if("."==moduleName.charAt(0)){var base=parentId.split("/").slice(0,-1).join("/");for(moduleName=(base?base+"/":"")+moduleName;-1!==moduleName.indexOf(".")&&previous!=moduleName;){var previous=moduleName;moduleName=moduleName.replace(/^\\.\\//,"").replace(/\\/\\.\\//,"/").replace(/[^\\/]+\\/\\.\\.\\//,"")}}return moduleName},window.acequire=function acequire(parentId,id){if(id||(id=parentId,parentId=null),!id.charAt)throw Error("worker.js acequire() accepts only (parentId, id) as arguments");id=window.normalizeModule(parentId,id);var module=window.acequire.modules[id];if(module)return module.initialized||(module.initialized=!0,module.exports=module.factory().exports),module.exports;if(!window.acequire.tlns)return console.log("unable to load "+id);var path=resolveModuleId(id,window.acequire.tlns);return".js"!=path.slice(-3)&&(path+=".js"),window.acequire.id=id,window.acequire.modules[id]={},importScripts(path),window.acequire(parentId,id)},window.acequire.modules={},window.acequire.tlns={},window.define=function(id,deps,factory){if(2==arguments.length?(factory=deps,"string"!=typeof id&&(deps=id,id=window.acequire.id)):1==arguments.length&&(factory=id,deps=[],id=window.acequire.id),"function"!=typeof factory)return window.acequire.modules[id]={exports:factory,initialized:!0},void 0;deps.length||(deps=["require","exports","module"]);var req=function(childId){return window.acequire(id,childId)};window.acequire.modules[id]={exports:{},factory:function(){var module=this,returnExports=factory.apply(this,deps.map(function(dep){switch(dep){case"require":return req;case"exports":return module.exports;case"module":return module;default:return req(dep)}}));return returnExports&&(module.exports=returnExports),module}}},window.define.amd={},acequire.tlns={},window.initBaseUrls=function(topLevelNamespaces){for(var i in topLevelNamespaces)acequire.tlns[i]=topLevelNamespaces[i]},window.initSender=function(){var EventEmitter=window.acequire("ace/lib/event_emitter").EventEmitter,oop=window.acequire("ace/lib/oop"),Sender=function(){};return function(){oop.implement(this,EventEmitter),this.callback=function(data,callbackId){postMessage({type:"call",id:callbackId,data:data})},this.emit=function(name,data){postMessage({type:"event",name:name,data:data})}}.call(Sender.prototype),new Sender};var main=window.main=null,sender=window.sender=null;window.onmessage=function(e){var msg=e.data;if(msg.event&&sender)sender._signal(msg.event,msg.data);else if(msg.command)if(main[msg.command])main[msg.command].apply(main,msg.args);else{if(!window[msg.command])throw Error("Unknown command:"+msg.command);window[msg.command].apply(window,msg.args)}else if(msg.init){window.initBaseUrls(msg.tlns),acequire("ace/lib/es5-shim"),sender=window.sender=window.initSender();var clazz=acequire(msg.module)[msg.classname];main=window.main=new clazz(sender)}}}})(this),ace.define("ace/lib/oop",["require","exports","module"],function(acequire,exports){"use strict";exports.inherits=function(ctor,superCtor){ctor.super_=superCtor,ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:!1,writable:!0,configurable:!0}})},exports.mixin=function(obj,mixin){for(var key in mixin)obj[key]=mixin[key];return obj},exports.implement=function(proto,mixin){exports.mixin(proto,mixin)}}),ace.define("ace/range",["require","exports","module"],function(acequire,exports){"use strict";var comparePoints=function(p1,p2){return p1.row-p2.row||p1.column-p2.column},Range=function(startRow,startColumn,endRow,endColumn){this.start={row:startRow,column:startColumn},this.end={row:endRow,column:endColumn}};(function(){this.isEqual=function(range){return this.start.row===range.start.row&&this.end.row===range.end.row&&this.start.column===range.start.column&&this.end.column===range.end.column},this.toString=function(){return"Range: ["+this.start.row+"/"+this.start.column+"] -> ["+this.end.row+"/"+this.end.column+"]"},this.contains=function(row,column){return 0==this.compare(row,column)},this.compareRange=function(range){var cmp,end=range.end,start=range.start;return cmp=this.compare(end.row,end.column),1==cmp?(cmp=this.compare(start.row,start.column),1==cmp?2:0==cmp?1:0):-1==cmp?-2:(cmp=this.compare(start.row,start.column),-1==cmp?-1:1==cmp?42:0)},this.comparePoint=function(p){return this.compare(p.row,p.column)},this.containsRange=function(range){return 0==this.comparePoint(range.start)&&0==this.comparePoint(range.end)},this.intersects=function(range){var cmp=this.compareRange(range);return-1==cmp||0==cmp||1==cmp},this.isEnd=function(row,column){return this.end.row==row&&this.end.column==column},this.isStart=function(row,column){return this.start.row==row&&this.start.column==column},this.setStart=function(row,column){"object"==typeof row?(this.start.column=row.column,this.start.row=row.row):(this.start.row=row,this.start.column=column)},this.setEnd=function(row,column){"object"==typeof row?(this.end.column=row.column,this.end.row=row.row):(this.end.row=row,this.end.column=column)},this.inside=function(row,column){return 0==this.compare(row,column)?this.isEnd(row,column)||this.isStart(row,column)?!1:!0:!1},this.insideStart=function(row,column){return 0==this.compare(row,column)?this.isEnd(row,column)?!1:!0:!1},this.insideEnd=function(row,column){return 0==this.compare(row,column)?this.isStart(row,column)?!1:!0:!1},this.compare=function(row,column){return this.isMultiLine()||row!==this.start.row?this.start.row>row?-1:row>this.end.row?1:this.start.row===row?column>=this.start.column?0:-1:this.end.row===row?this.end.column>=column?0:1:0:this.start.column>column?-1:column>this.end.column?1:0},this.compareStart=function(row,column){return this.start.row==row&&this.start.column==column?-1:this.compare(row,column)},this.compareEnd=function(row,column){return this.end.row==row&&this.end.column==column?1:this.compare(row,column)},this.compareInside=function(row,column){return this.end.row==row&&this.end.column==column?1:this.start.row==row&&this.start.column==column?-1:this.compare(row,column)},this.clipRows=function(firstRow,lastRow){if(this.end.row>lastRow)var end={row:lastRow+1,column:0};else if(firstRow>this.end.row)var end={row:firstRow,column:0};if(this.start.row>lastRow)var start={row:lastRow+1,column:0};else if(firstRow>this.start.row)var start={row:firstRow,column:0};return Range.fromPoints(start||this.start,end||this.end)},this.extend=function(row,column){var cmp=this.compare(row,column);if(0==cmp)return this;if(-1==cmp)var start={row:row,column:column};else var end={row:row,column:column};return Range.fromPoints(start||this.start,end||this.end)},this.isEmpty=function(){return this.start.row===this.end.row&&this.start.column===this.end.column},this.isMultiLine=function(){return this.start.row!==this.end.row},this.clone=function(){return Range.fromPoints(this.start,this.end)},this.collapseRows=function(){return 0==this.end.column?new Range(this.start.row,0,Math.max(this.start.row,this.end.row-1),0):new Range(this.start.row,0,this.end.row,0)},this.toScreenRange=function(session){var screenPosStart=session.documentToScreenPosition(this.start),screenPosEnd=session.documentToScreenPosition(this.end);return new Range(screenPosStart.row,screenPosStart.column,screenPosEnd.row,screenPosEnd.column)},this.moveBy=function(row,column){this.start.row+=row,this.start.column+=column,this.end.row+=row,this.end.column+=column}}).call(Range.prototype),Range.fromPoints=function(start,end){return new Range(start.row,start.column,end.row,end.column)},Range.comparePoints=comparePoints,Range.comparePoints=function(p1,p2){return p1.row-p2.row||p1.column-p2.column},exports.Range=Range}),ace.define("ace/apply_delta",["require","exports","module"],function(acequire,exports){"use strict";exports.applyDelta=function(docLines,delta){var row=delta.start.row,startColumn=delta.start.column,line=docLines[row]||"";switch(delta.action){case"insert":var lines=delta.lines;if(1===lines.length)docLines[row]=line.substring(0,startColumn)+delta.lines[0]+line.substring(startColumn);else{var args=[row,1].concat(delta.lines);docLines.splice.apply(docLines,args),docLines[row]=line.substring(0,startColumn)+docLines[row],docLines[row+delta.lines.length-1]+=line.substring(startColumn)}break;case"remove":var endColumn=delta.end.column,endRow=delta.end.row;row===endRow?docLines[row]=line.substring(0,startColumn)+line.substring(endColumn):docLines.splice(row,endRow-row+1,line.substring(0,startColumn)+docLines[endRow].substring(endColumn))}}}),ace.define("ace/lib/event_emitter",["require","exports","module"],function(acequire,exports){"use strict";var EventEmitter={},stopPropagation=function(){this.propagationStopped=!0},preventDefault=function(){this.defaultPrevented=!0};EventEmitter._emit=EventEmitter._dispatchEvent=function(eventName,e){this._eventRegistry||(this._eventRegistry={}),this._defaultHandlers||(this._defaultHandlers={});var listeners=this._eventRegistry[eventName]||[],defaultHandler=this._defaultHandlers[eventName];if(listeners.length||defaultHandler){"object"==typeof e&&e||(e={}),e.type||(e.type=eventName),e.stopPropagation||(e.stopPropagation=stopPropagation),e.preventDefault||(e.preventDefault=preventDefault),listeners=listeners.slice();for(var i=0;listeners.length>i&&(listeners[i](e,this),!e.propagationStopped);i++);return defaultHandler&&!e.defaultPrevented?defaultHandler(e,this):void 0}},EventEmitter._signal=function(eventName,e){var listeners=(this._eventRegistry||{})[eventName];if(listeners){listeners=listeners.slice();for(var i=0;listeners.length>i;i++)listeners[i](e,this)}},EventEmitter.once=function(eventName,callback){var _self=this;callback&&this.addEventListener(eventName,function newCallback(){_self.removeEventListener(eventName,newCallback),callback.apply(null,arguments)})},EventEmitter.setDefaultHandler=function(eventName,callback){var handlers=this._defaultHandlers;if(handlers||(handlers=this._defaultHandlers={_disabled_:{}}),handlers[eventName]){var old=handlers[eventName],disabled=handlers._disabled_[eventName];disabled||(handlers._disabled_[eventName]=disabled=[]),disabled.push(old);var i=disabled.indexOf(callback);-1!=i&&disabled.splice(i,1)}handlers[eventName]=callback},EventEmitter.removeDefaultHandler=function(eventName,callback){var handlers=this._defaultHandlers;if(handlers){var disabled=handlers._disabled_[eventName];if(handlers[eventName]==callback)handlers[eventName],disabled&&this.setDefaultHandler(eventName,disabled.pop());else if(disabled){var i=disabled.indexOf(callback);-1!=i&&disabled.splice(i,1)}}},EventEmitter.on=EventEmitter.addEventListener=function(eventName,callback,capturing){this._eventRegistry=this._eventRegistry||{};var listeners=this._eventRegistry[eventName];return listeners||(listeners=this._eventRegistry[eventName]=[]),-1==listeners.indexOf(callback)&&listeners[capturing?"unshift":"push"](callback),callback},EventEmitter.off=EventEmitter.removeListener=EventEmitter.removeEventListener=function(eventName,callback){this._eventRegistry=this._eventRegistry||{};var listeners=this._eventRegistry[eventName];if(listeners){var index=listeners.indexOf(callback);-1!==index&&listeners.splice(index,1)}},EventEmitter.removeAllListeners=function(eventName){this._eventRegistry&&(this._eventRegistry[eventName]=[])},exports.EventEmitter=EventEmitter}),ace.define("ace/anchor",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"],function(acequire,exports){"use strict";var oop=acequire("./lib/oop"),EventEmitter=acequire("./lib/event_emitter").EventEmitter,Anchor=exports.Anchor=function(doc,row,column){this.$onChange=this.onChange.bind(this),this.attach(doc),column===void 0?this.setPosition(row.row,row.column):this.setPosition(row,column)};(function(){function $pointsInOrder(point1,point2,equalPointsInOrder){var bColIsAfter=equalPointsInOrder?point1.column<=point2.column:point1.column<point2.column;return point1.row<point2.row||point1.row==point2.row&&bColIsAfter}function $getTransformedPoint(delta,point,moveIfEqual){var deltaIsInsert="insert"==delta.action,deltaRowShift=(deltaIsInsert?1:-1)*(delta.end.row-delta.start.row),deltaColShift=(deltaIsInsert?1:-1)*(delta.end.column-delta.start.column),deltaStart=delta.start,deltaEnd=deltaIsInsert?deltaStart:delta.end;return $pointsInOrder(point,deltaStart,moveIfEqual)?{row:point.row,column:point.column}:$pointsInOrder(deltaEnd,point,!moveIfEqual)?{row:point.row+deltaRowShift,column:point.column+(point.row==deltaEnd.row?deltaColShift:0)}:{row:deltaStart.row,column:deltaStart.column}}oop.implement(this,EventEmitter),this.getPosition=function(){return this.$clipPositionToDocument(this.row,this.column)},this.getDocument=function(){return this.document},this.$insertRight=!1,this.onChange=function(delta){if(!(delta.start.row==delta.end.row&&delta.start.row!=this.row||delta.start.row>this.row)){var point=$getTransformedPoint(delta,{row:this.row,column:this.column},this.$insertRight);this.setPosition(point.row,point.column,!0)}},this.setPosition=function(row,column,noClip){var pos;if(pos=noClip?{row:row,column:column}:this.$clipPositionToDocument(row,column),this.row!=pos.row||this.column!=pos.column){var old={row:this.row,column:this.column};this.row=pos.row,this.column=pos.column,this._signal("change",{old:old,value:pos})}},this.detach=function(){this.document.removeEventListener("change",this.$onChange)},this.attach=function(doc){this.document=doc||this.document,this.document.on("change",this.$onChange)},this.$clipPositionToDocument=function(row,column){var pos={};return row>=this.document.getLength()?(pos.row=Math.max(0,this.document.getLength()-1),pos.column=this.document.getLine(pos.row).length):0>row?(pos.row=0,pos.column=0):(pos.row=row,pos.column=Math.min(this.document.getLine(pos.row).length,Math.max(0,column))),0>column&&(pos.column=0),pos}}).call(Anchor.prototype)}),ace.define("ace/document",["require","exports","module","ace/lib/oop","ace/apply_delta","ace/lib/event_emitter","ace/range","ace/anchor"],function(acequire,exports){"use strict";var oop=acequire("./lib/oop"),applyDelta=acequire("./apply_delta").applyDelta,EventEmitter=acequire("./lib/event_emitter").EventEmitter,Range=acequire("./range").Range,Anchor=acequire("./anchor").Anchor,Document=function(textOrLines){this.$lines=[""],0===textOrLines.length?this.$lines=[""]:Array.isArray(textOrLines)?this.insertMergedLines({row:0,column:0},textOrLines):this.insert({row:0,column:0},textOrLines)};(function(){oop.implement(this,EventEmitter),this.setValue=function(text){var len=this.getLength()-1;this.remove(new Range(0,0,len,this.getLine(len).length)),this.insert({row:0,column:0},text)},this.getValue=function(){return this.getAllLines().join(this.getNewLineCharacter())},this.createAnchor=function(row,column){return new Anchor(this,row,column)},this.$split=0==="aaa".split(/a/).length?function(text){return text.replace(/\\r\\n|\\r/g,"\\n").split("\\n")}:function(text){return text.split(/\\r\\n|\\r|\\n/)},this.$detectNewLine=function(text){var match=text.match(/^.*?(\\r\\n|\\r|\\n)/m);this.$autoNewLine=match?match[1]:"\\n",this._signal("changeNewLineMode")},this.getNewLineCharacter=function(){switch(this.$newLineMode){case"windows":return"\\r\\n";case"unix":return"\\n";default:return this.$autoNewLine||"\\n"}},this.$autoNewLine="",this.$newLineMode="auto",this.setNewLineMode=function(newLineMode){this.$newLineMode!==newLineMode&&(this.$newLineMode=newLineMode,this._signal("changeNewLineMode"))},this.getNewLineMode=function(){return this.$newLineMode},this.isNewLine=function(text){return"\\r\\n"==text||"\\r"==text||"\\n"==text},this.getLine=function(row){return this.$lines[row]||""},this.getLines=function(firstRow,lastRow){return this.$lines.slice(firstRow,lastRow+1)},this.getAllLines=function(){return this.getLines(0,this.getLength())},this.getLength=function(){return this.$lines.length},this.getTextRange=function(range){return this.getLinesForRange(range).join(this.getNewLineCharacter())},this.getLinesForRange=function(range){var lines;if(range.start.row===range.end.row)lines=[this.getLine(range.start.row).substring(range.start.column,range.end.column)];else{lines=this.getLines(range.start.row,range.end.row),lines[0]=(lines[0]||"").substring(range.start.column);var l=lines.length-1;range.end.row-range.start.row==l&&(lines[l]=lines[l].substring(0,range.end.column))}return lines},this.insertLines=function(row,lines){return console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead."),this.insertFullLines(row,lines)},this.removeLines=function(firstRow,lastRow){return console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead."),this.removeFullLines(firstRow,lastRow)},this.insertNewLine=function(position){return console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, [\'\', \'\']) instead."),this.insertMergedLines(position,["",""])},this.insert=function(position,text){return 1>=this.getLength()&&this.$detectNewLine(text),this.insertMergedLines(position,this.$split(text))},this.insertInLine=function(position,text){var start=this.clippedPos(position.row,position.column),end=this.pos(position.row,position.column+text.length);return this.applyDelta({start:start,end:end,action:"insert",lines:[text]},!0),this.clonePos(end)},this.clippedPos=function(row,column){var length=this.getLength();void 0===row?row=length:0>row?row=0:row>=length&&(row=length-1,column=void 0);var line=this.getLine(row);return void 0==column&&(column=line.length),column=Math.min(Math.max(column,0),line.length),{row:row,column:column}},this.clonePos=function(pos){return{row:pos.row,column:pos.column}},this.pos=function(row,column){return{row:row,column:column}},this.$clipPosition=function(position){var length=this.getLength();return position.row>=length?(position.row=Math.max(0,length-1),position.column=this.getLine(length-1).length):(position.row=Math.max(0,position.row),position.column=Math.min(Math.max(position.column,0),this.getLine(position.row).length)),position},this.insertFullLines=function(row,lines){row=Math.min(Math.max(row,0),this.getLength());var column=0;this.getLength()>row?(lines=lines.concat([""]),column=0):(lines=[""].concat(lines),row--,column=this.$lines[row].length),this.insertMergedLines({row:row,column:column},lines)},this.insertMergedLines=function(position,lines){var start=this.clippedPos(position.row,position.column),end={row:start.row+lines.length-1,column:(1==lines.length?start.column:0)+lines[lines.length-1].length};return this.applyDelta({start:start,end:end,action:"insert",lines:lines}),this.clonePos(end)},this.remove=function(range){var start=this.clippedPos(range.start.row,range.start.column),end=this.clippedPos(range.end.row,range.end.column);return this.applyDelta({start:start,end:end,action:"remove",lines:this.getLinesForRange({start:start,end:end})}),this.clonePos(start)},this.removeInLine=function(row,startColumn,endColumn){var start=this.clippedPos(row,startColumn),end=this.clippedPos(row,endColumn);return this.applyDelta({start:start,end:end,action:"remove",lines:this.getLinesForRange({start:start,end:end})},!0),this.clonePos(start)},this.removeFullLines=function(firstRow,lastRow){firstRow=Math.min(Math.max(0,firstRow),this.getLength()-1),lastRow=Math.min(Math.max(0,lastRow),this.getLength()-1);var deleteFirstNewLine=lastRow==this.getLength()-1&&firstRow>0,deleteLastNewLine=this.getLength()-1>lastRow,startRow=deleteFirstNewLine?firstRow-1:firstRow,startCol=deleteFirstNewLine?this.getLine(startRow).length:0,endRow=deleteLastNewLine?lastRow+1:lastRow,endCol=deleteLastNewLine?0:this.getLine(endRow).length,range=new Range(startRow,startCol,endRow,endCol),deletedLines=this.$lines.slice(firstRow,lastRow+1);return this.applyDelta({start:range.start,end:range.end,action:"remove",lines:this.getLinesForRange(range)}),deletedLines},this.removeNewLine=function(row){this.getLength()-1>row&&row>=0&&this.applyDelta({start:this.pos(row,this.getLine(row).length),end:this.pos(row+1,0),action:"remove",lines:["",""]})},this.replace=function(range,text){if(range instanceof Range||(range=Range.fromPoints(range.start,range.end)),0===text.length&&range.isEmpty())return range.start;if(text==this.getTextRange(range))return range.end;this.remove(range);var end;return end=text?this.insert(range.start,text):range.start},this.applyDeltas=function(deltas){for(var i=0;deltas.length>i;i++)this.applyDelta(deltas[i])},this.revertDeltas=function(deltas){for(var i=deltas.length-1;i>=0;i--)this.revertDelta(deltas[i])},this.applyDelta=function(delta,doNotValidate){var isInsert="insert"==delta.action;(isInsert?1>=delta.lines.length&&!delta.lines[0]:!Range.comparePoints(delta.start,delta.end))||(isInsert&&delta.lines.length>2e4&&this.$splitAndapplyLargeDelta(delta,2e4),applyDelta(this.$lines,delta,doNotValidate),this._signal("change",delta))},this.$splitAndapplyLargeDelta=function(delta,MAX){for(var lines=delta.lines,l=lines.length,row=delta.start.row,column=delta.start.column,from=0,to=0;;){from=to,to+=MAX-1;var chunk=lines.slice(from,to);if(to>l){delta.lines=chunk,delta.start.row=row+from,delta.start.column=column;break}chunk.push(""),this.applyDelta({start:this.pos(row+from,column),end:this.pos(row+to,column=0),action:delta.action,lines:chunk},!0)}},this.revertDelta=function(delta){this.applyDelta({start:this.clonePos(delta.start),end:this.clonePos(delta.end),action:"insert"==delta.action?"remove":"insert",lines:delta.lines.slice()})},this.indexToPosition=function(index,startRow){for(var lines=this.$lines||this.getAllLines(),newlineLength=this.getNewLineCharacter().length,i=startRow||0,l=lines.length;l>i;i++)if(index-=lines[i].length+newlineLength,0>index)return{row:i,column:index+lines[i].length+newlineLength};return{row:l-1,column:lines[l-1].length}},this.positionToIndex=function(pos,startRow){for(var lines=this.$lines||this.getAllLines(),newlineLength=this.getNewLineCharacter().length,index=0,row=Math.min(pos.row,lines.length),i=startRow||0;row>i;++i)index+=lines[i].length+newlineLength;return index+pos.column}}).call(Document.prototype),exports.Document=Document}),ace.define("ace/lib/lang",["require","exports","module"],function(acequire,exports){"use strict";exports.last=function(a){return a[a.length-1]},exports.stringReverse=function(string){return string.split("").reverse().join("")},exports.stringRepeat=function(string,count){for(var result="";count>0;)1&count&&(result+=string),(count>>=1)&&(string+=string);return result};var trimBeginRegexp=/^\\s\\s*/,trimEndRegexp=/\\s\\s*$/;exports.stringTrimLeft=function(string){return string.replace(trimBeginRegexp,"")},exports.stringTrimRight=function(string){return string.replace(trimEndRegexp,"")},exports.copyObject=function(obj){var copy={};for(var key in obj)copy[key]=obj[key];return copy},exports.copyArray=function(array){for(var copy=[],i=0,l=array.length;l>i;i++)copy[i]=array[i]&&"object"==typeof array[i]?this.copyObject(array[i]):array[i];return copy},exports.deepCopy=function deepCopy(obj){if("object"!=typeof obj||!obj)return obj;var copy;if(Array.isArray(obj)){copy=[];for(var key=0;obj.length>key;key++)copy[key]=deepCopy(obj[key]);return copy}var cons=obj.constructor;if(cons===RegExp)return obj;copy=cons();for(var key in obj)copy[key]=deepCopy(obj[key]);return copy},exports.arrayToMap=function(arr){for(var map={},i=0;arr.length>i;i++)map[arr[i]]=1;return map},exports.createMap=function(props){var map=Object.create(null);for(var i in props)map[i]=props[i];return map},exports.arrayRemove=function(array,value){for(var i=0;array.length>=i;i++)value===array[i]&&array.splice(i,1)},exports.escapeRegExp=function(str){return str.replace(/([.*+?^${}()|[\\]\\/\\\\])/g,"\\\\$1")},exports.escapeHTML=function(str){return str.replace(/&/g,"&#38;").replace(/"/g,"&#34;").replace(/\'/g,"&#39;").replace(/</g,"&#60;")},exports.getMatchOffsets=function(string,regExp){var matches=[];return string.replace(regExp,function(str){matches.push({offset:arguments[arguments.length-2],length:str.length})}),matches},exports.deferredCall=function(fcn){var timer=null,callback=function(){timer=null,fcn()},deferred=function(timeout){return deferred.cancel(),timer=setTimeout(callback,timeout||0),deferred};return deferred.schedule=deferred,deferred.call=function(){return this.cancel(),fcn(),deferred},deferred.cancel=function(){return clearTimeout(timer),timer=null,deferred},deferred.isPending=function(){return timer},deferred},exports.delayedCall=function(fcn,defaultTimeout){var timer=null,callback=function(){timer=null,fcn()},_self=function(timeout){null==timer&&(timer=setTimeout(callback,timeout||defaultTimeout))};return _self.delay=function(timeout){timer&&clearTimeout(timer),timer=setTimeout(callback,timeout||defaultTimeout)},_self.schedule=_self,_self.call=function(){this.cancel(),fcn()},_self.cancel=function(){timer&&clearTimeout(timer),timer=null},_self.isPending=function(){return timer},_self}}),ace.define("ace/worker/mirror",["require","exports","module","ace/range","ace/document","ace/lib/lang"],function(acequire,exports){"use strict";acequire("../range").Range;var Document=acequire("../document").Document,lang=acequire("../lib/lang"),Mirror=exports.Mirror=function(sender){this.sender=sender;var doc=this.doc=new Document(""),deferredUpdate=this.deferredUpdate=lang.delayedCall(this.onUpdate.bind(this)),_self=this;sender.on("change",function(e){var data=e.data;if(data[0].start)doc.applyDeltas(data);else for(var i=0;data.length>i;i+=2){if(Array.isArray(data[i+1]))var d={action:"insert",start:data[i],lines:data[i+1]};else var d={action:"remove",start:data[i],end:data[i+1]};doc.applyDelta(d,!0)}return _self.$timeout?deferredUpdate.schedule(_self.$timeout):(_self.onUpdate(),void 0)})};(function(){this.$timeout=500,this.setTimeout=function(timeout){this.$timeout=timeout},this.setValue=function(value){this.doc.setValue(value),this.deferredUpdate.schedule(this.$timeout)},this.getValue=function(callbackId){this.sender.callback(this.doc.getValue(),callbackId)},this.onUpdate=function(){},this.isPending=function(){return this.deferredUpdate.isPending()}}).call(Mirror.prototype)}),ace.define("ace/mode/json/json_parse",["require","exports","module"],function(){"use strict";var at,ch,text,value,escapee={\'"\':\'"\',"\\\\":"\\\\","/":"/",b:"\\b",f:"\\f",n:"\\n",r:"\\r",t:"  "},error=function(m){throw{name:"SyntaxError",message:m,at:at,text:text}},next=function(c){return c&&c!==ch&&error("Expected \'"+c+"\' instead of \'"+ch+"\'"),ch=text.charAt(at),at+=1,ch},number=function(){var number,string="";for("-"===ch&&(string="-",next("-"));ch>="0"&&"9">=ch;)string+=ch,next();if("."===ch)for(string+=".";next()&&ch>="0"&&"9">=ch;)string+=ch;if("e"===ch||"E"===ch)for(string+=ch,next(),("-"===ch||"+"===ch)&&(string+=ch,next());ch>="0"&&"9">=ch;)string+=ch,next();return number=+string,isNaN(number)?(error("Bad number"),void 0):number},string=function(){var hex,i,uffff,string="";if(\'"\'===ch)for(;next();){if(\'"\'===ch)return next(),string;if("\\\\"===ch)if(next(),"u"===ch){for(uffff=0,i=0;4>i&&(hex=parseInt(next(),16),isFinite(hex));i+=1)uffff=16*uffff+hex;string+=String.fromCharCode(uffff)}else{if("string"!=typeof escapee[ch])break;string+=escapee[ch]}else string+=ch}error("Bad string")},white=function(){for(;ch&&" ">=ch;)next()},word=function(){switch(ch){case"t":return next("t"),next("r"),next("u"),next("e"),!0;case"f":return next("f"),next("a"),next("l"),next("s"),next("e"),!1;case"n":return next("n"),next("u"),next("l"),next("l"),null}error("Unexpected \'"+ch+"\'")},array=function(){var array=[];if("["===ch){if(next("["),white(),"]"===ch)return next("]"),array;for(;ch;){if(array.push(value()),white(),"]"===ch)return next("]"),array;next(","),white()}}error("Bad array")},object=function(){var key,object={};if("{"===ch){if(next("{"),white(),"}"===ch)return next("}"),object;for(;ch;){if(key=string(),white(),next(":"),Object.hasOwnProperty.call(object,key)&&error(\'Duplicate key "\'+key+\'"\'),object[key]=value(),white(),"}"===ch)return next("}"),object;next(","),white()}}error("Bad object")};return value=function(){switch(white(),ch){case"{":return object();case"[":return array();case\'"\':return string();case"-":return number();default:return ch>="0"&&"9">=ch?number():word()}},function(source,reviver){var result;return text=source,at=0,ch=" ",result=value(),white(),ch&&error("Syntax error"),"function"==typeof reviver?function walk(holder,key){var k,v,value=holder[key];if(value&&"object"==typeof value)for(k in value)Object.hasOwnProperty.call(value,k)&&(v=walk(value,k),void 0!==v?value[k]=v:delete value[k]);return reviver.call(holder,key,value)}({"":result},""):result}}),ace.define("ace/mode/json_worker",["require","exports","module","ace/lib/oop","ace/worker/mirror","ace/mode/json/json_parse"],function(acequire,exports){"use strict";var oop=acequire("../lib/oop"),Mirror=acequire("../worker/mirror").Mirror,parse=acequire("./json/json_parse"),JsonWorker=exports.JsonWorker=function(sender){Mirror.call(this,sender),this.setTimeout(200)};oop.inherits(JsonWorker,Mirror),function(){this.onUpdate=function(){var value=this.doc.getValue(),errors=[];try{value&&parse(value)}catch(e){var pos=this.doc.indexToPosition(e.at-1);errors.push({row:pos.row,column:pos.column,text:e.message,type:"error"})}this.sender.emit("annotate",errors)}}.call(JsonWorker.prototype)}),ace.define("ace/lib/es5-shim",["require","exports","module"],function(){function Empty(){}function doesDefinePropertyWork(object){try{return Object.defineProperty(object,"sentinel",{}),"sentinel"in object}catch(exception){}}function toInteger(n){return n=+n,n!==n?n=0:0!==n&&n!==1/0&&n!==-(1/0)&&(n=(n>0||-1)*Math.floor(Math.abs(n))),n}Function.prototype.bind||(Function.prototype.bind=function(that){var target=this;if("function"!=typeof target)throw new TypeError("Function.prototype.bind called on incompatible "+target);var args=slice.call(arguments,1),bound=function(){if(this instanceof bound){var result=target.apply(this,args.concat(slice.call(arguments)));return Object(result)===result?result:this}return target.apply(that,args.concat(slice.call(arguments)))};return target.prototype&&(Empty.prototype=target.prototype,bound.prototype=new Empty,Empty.prototype=null),bound});var defineGetter,defineSetter,lookupGetter,lookupSetter,supportsAccessors,call=Function.prototype.call,prototypeOfArray=Array.prototype,prototypeOfObject=Object.prototype,slice=prototypeOfArray.slice,_toString=call.bind(prototypeOfObject.toString),owns=call.bind(prototypeOfObject.hasOwnProperty);if((supportsAccessors=owns(prototypeOfObject,"__defineGetter__"))&&(defineGetter=call.bind(prototypeOfObject.__defineGetter__),defineSetter=call.bind(prototypeOfObject.__defineSetter__),lookupGetter=call.bind(prototypeOfObject.__lookupGetter__),lookupSetter=call.bind(prototypeOfObject.__lookupSetter__)),2!=[1,2].splice(0).length)if(function(){function makeArray(l){var a=Array(l+2);return a[0]=a[1]=0,a}var lengthBefore,array=[];return array.splice.apply(array,makeArray(20)),array.splice.apply(array,makeArray(26)),lengthBefore=array.length,array.splice(5,0,"XXX"),lengthBefore+1==array.length,lengthBefore+1==array.length?!0:void 0\n}()){var array_splice=Array.prototype.splice;Array.prototype.splice=function(start,deleteCount){return arguments.length?array_splice.apply(this,[void 0===start?0:start,void 0===deleteCount?this.length-start:deleteCount].concat(slice.call(arguments,2))):[]}}else Array.prototype.splice=function(pos,removeCount){var length=this.length;pos>0?pos>length&&(pos=length):void 0==pos?pos=0:0>pos&&(pos=Math.max(length+pos,0)),length>pos+removeCount||(removeCount=length-pos);var removed=this.slice(pos,pos+removeCount),insert=slice.call(arguments,2),add=insert.length;if(pos===length)add&&this.push.apply(this,insert);else{var remove=Math.min(removeCount,length-pos),tailOldPos=pos+remove,tailNewPos=tailOldPos+add-remove,tailCount=length-tailOldPos,lengthAfterRemove=length-remove;if(tailOldPos>tailNewPos)for(var i=0;tailCount>i;++i)this[tailNewPos+i]=this[tailOldPos+i];else if(tailNewPos>tailOldPos)for(i=tailCount;i--;)this[tailNewPos+i]=this[tailOldPos+i];if(add&&pos===lengthAfterRemove)this.length=lengthAfterRemove,this.push.apply(this,insert);else for(this.length=lengthAfterRemove+add,i=0;add>i;++i)this[pos+i]=insert[i]}return removed};Array.isArray||(Array.isArray=function(obj){return"[object Array]"==_toString(obj)});var boxedString=Object("a"),splitString="a"!=boxedString[0]||!(0 in boxedString);if(Array.prototype.forEach||(Array.prototype.forEach=function(fun){var object=toObject(this),self=splitString&&"[object String]"==_toString(this)?this.split(""):object,thisp=arguments[1],i=-1,length=self.length>>>0;if("[object Function]"!=_toString(fun))throw new TypeError;for(;length>++i;)i in self&&fun.call(thisp,self[i],i,object)}),Array.prototype.map||(Array.prototype.map=function(fun){var object=toObject(this),self=splitString&&"[object String]"==_toString(this)?this.split(""):object,length=self.length>>>0,result=Array(length),thisp=arguments[1];if("[object Function]"!=_toString(fun))throw new TypeError(fun+" is not a function");for(var i=0;length>i;i++)i in self&&(result[i]=fun.call(thisp,self[i],i,object));return result}),Array.prototype.filter||(Array.prototype.filter=function(fun){var value,object=toObject(this),self=splitString&&"[object String]"==_toString(this)?this.split(""):object,length=self.length>>>0,result=[],thisp=arguments[1];if("[object Function]"!=_toString(fun))throw new TypeError(fun+" is not a function");for(var i=0;length>i;i++)i in self&&(value=self[i],fun.call(thisp,value,i,object)&&result.push(value));return result}),Array.prototype.every||(Array.prototype.every=function(fun){var object=toObject(this),self=splitString&&"[object String]"==_toString(this)?this.split(""):object,length=self.length>>>0,thisp=arguments[1];if("[object Function]"!=_toString(fun))throw new TypeError(fun+" is not a function");for(var i=0;length>i;i++)if(i in self&&!fun.call(thisp,self[i],i,object))return!1;return!0}),Array.prototype.some||(Array.prototype.some=function(fun){var object=toObject(this),self=splitString&&"[object String]"==_toString(this)?this.split(""):object,length=self.length>>>0,thisp=arguments[1];if("[object Function]"!=_toString(fun))throw new TypeError(fun+" is not a function");for(var i=0;length>i;i++)if(i in self&&fun.call(thisp,self[i],i,object))return!0;return!1}),Array.prototype.reduce||(Array.prototype.reduce=function(fun){var object=toObject(this),self=splitString&&"[object String]"==_toString(this)?this.split(""):object,length=self.length>>>0;if("[object Function]"!=_toString(fun))throw new TypeError(fun+" is not a function");if(!length&&1==arguments.length)throw new TypeError("reduce of empty array with no initial value");var result,i=0;if(arguments.length>=2)result=arguments[1];else for(;;){if(i in self){result=self[i++];break}if(++i>=length)throw new TypeError("reduce of empty array with no initial value")}for(;length>i;i++)i in self&&(result=fun.call(void 0,result,self[i],i,object));return result}),Array.prototype.reduceRight||(Array.prototype.reduceRight=function(fun){var object=toObject(this),self=splitString&&"[object String]"==_toString(this)?this.split(""):object,length=self.length>>>0;if("[object Function]"!=_toString(fun))throw new TypeError(fun+" is not a function");if(!length&&1==arguments.length)throw new TypeError("reduceRight of empty array with no initial value");var result,i=length-1;if(arguments.length>=2)result=arguments[1];else for(;;){if(i in self){result=self[i--];break}if(0>--i)throw new TypeError("reduceRight of empty array with no initial value")}do i in this&&(result=fun.call(void 0,result,self[i],i,object));while(i--);return result}),Array.prototype.indexOf&&-1==[0,1].indexOf(1,2)||(Array.prototype.indexOf=function(sought){var self=splitString&&"[object String]"==_toString(this)?this.split(""):toObject(this),length=self.length>>>0;if(!length)return-1;var i=0;for(arguments.length>1&&(i=toInteger(arguments[1])),i=i>=0?i:Math.max(0,length+i);length>i;i++)if(i in self&&self[i]===sought)return i;return-1}),Array.prototype.lastIndexOf&&-1==[0,1].lastIndexOf(0,-3)||(Array.prototype.lastIndexOf=function(sought){var self=splitString&&"[object String]"==_toString(this)?this.split(""):toObject(this),length=self.length>>>0;if(!length)return-1;var i=length-1;for(arguments.length>1&&(i=Math.min(i,toInteger(arguments[1]))),i=i>=0?i:length-Math.abs(i);i>=0;i--)if(i in self&&sought===self[i])return i;return-1}),Object.getPrototypeOf||(Object.getPrototypeOf=function(object){return object.__proto__||(object.constructor?object.constructor.prototype:prototypeOfObject)}),!Object.getOwnPropertyDescriptor){var ERR_NON_OBJECT="Object.getOwnPropertyDescriptor called on a non-object: ";Object.getOwnPropertyDescriptor=function(object,property){if("object"!=typeof object&&"function"!=typeof object||null===object)throw new TypeError(ERR_NON_OBJECT+object);if(owns(object,property)){var descriptor,getter,setter;if(descriptor={enumerable:!0,configurable:!0},supportsAccessors){var prototype=object.__proto__;object.__proto__=prototypeOfObject;var getter=lookupGetter(object,property),setter=lookupSetter(object,property);if(object.__proto__=prototype,getter||setter)return getter&&(descriptor.get=getter),setter&&(descriptor.set=setter),descriptor}return descriptor.value=object[property],descriptor}}}if(Object.getOwnPropertyNames||(Object.getOwnPropertyNames=function(object){return Object.keys(object)}),!Object.create){var createEmpty;createEmpty=null===Object.prototype.__proto__?function(){return{__proto__:null}}:function(){var empty={};for(var i in empty)empty[i]=null;return empty.constructor=empty.hasOwnProperty=empty.propertyIsEnumerable=empty.isPrototypeOf=empty.toLocaleString=empty.toString=empty.valueOf=empty.__proto__=null,empty},Object.create=function(prototype,properties){var object;if(null===prototype)object=createEmpty();else{if("object"!=typeof prototype)throw new TypeError("typeof prototype["+typeof prototype+"] != \'object\'");var Type=function(){};Type.prototype=prototype,object=new Type,object.__proto__=prototype}return void 0!==properties&&Object.defineProperties(object,properties),object}}if(Object.defineProperty){var definePropertyWorksOnObject=doesDefinePropertyWork({}),definePropertyWorksOnDom="undefined"==typeof document||doesDefinePropertyWork(document.createElement("div"));if(!definePropertyWorksOnObject||!definePropertyWorksOnDom)var definePropertyFallback=Object.defineProperty}if(!Object.defineProperty||definePropertyFallback){var ERR_NON_OBJECT_DESCRIPTOR="Property description must be an object: ",ERR_NON_OBJECT_TARGET="Object.defineProperty called on non-object: ",ERR_ACCESSORS_NOT_SUPPORTED="getters & setters can not be defined on this javascript engine";Object.defineProperty=function(object,property,descriptor){if("object"!=typeof object&&"function"!=typeof object||null===object)throw new TypeError(ERR_NON_OBJECT_TARGET+object);if("object"!=typeof descriptor&&"function"!=typeof descriptor||null===descriptor)throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR+descriptor);if(definePropertyFallback)try{return definePropertyFallback.call(Object,object,property,descriptor)}catch(exception){}if(owns(descriptor,"value"))if(supportsAccessors&&(lookupGetter(object,property)||lookupSetter(object,property))){var prototype=object.__proto__;object.__proto__=prototypeOfObject,delete object[property],object[property]=descriptor.value,object.__proto__=prototype}else object[property]=descriptor.value;else{if(!supportsAccessors)throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);owns(descriptor,"get")&&defineGetter(object,property,descriptor.get),owns(descriptor,"set")&&defineSetter(object,property,descriptor.set)}return object}}Object.defineProperties||(Object.defineProperties=function(object,properties){for(var property in properties)owns(properties,property)&&Object.defineProperty(object,property,properties[property]);return object}),Object.seal||(Object.seal=function(object){return object}),Object.freeze||(Object.freeze=function(object){return object});try{Object.freeze(function(){})}catch(exception){Object.freeze=function(freezeObject){return function(object){return"function"==typeof object?object:freezeObject(object)}}(Object.freeze)}if(Object.preventExtensions||(Object.preventExtensions=function(object){return object}),Object.isSealed||(Object.isSealed=function(){return!1}),Object.isFrozen||(Object.isFrozen=function(){return!1}),Object.isExtensible||(Object.isExtensible=function(object){if(Object(object)===object)throw new TypeError;for(var name="";owns(object,name);)name+="?";object[name]=!0;var returnValue=owns(object,name);return delete object[name],returnValue}),!Object.keys){var hasDontEnumBug=!0,dontEnums=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],dontEnumsLength=dontEnums.length;for(var key in{toString:null})hasDontEnumBug=!1;Object.keys=function(object){if("object"!=typeof object&&"function"!=typeof object||null===object)throw new TypeError("Object.keys called on a non-object");var keys=[];for(var name in object)owns(object,name)&&keys.push(name);if(hasDontEnumBug)for(var i=0,ii=dontEnumsLength;ii>i;i++){var dontEnum=dontEnums[i];owns(object,dontEnum)&&keys.push(dontEnum)}return keys}}Date.now||(Date.now=function(){return(new Date).getTime()});var ws=" \\n\x0B\\f\\r   ᠎             　\\u2028\\u2029\ufeff";if(!String.prototype.trim||ws.trim()){ws="["+ws+"]";var trimBeginRegexp=RegExp("^"+ws+ws+"*"),trimEndRegexp=RegExp(ws+ws+"*$");String.prototype.trim=function(){return(this+"").replace(trimBeginRegexp,"").replace(trimEndRegexp,"")}}var toObject=function(o){if(null==o)throw new TypeError("can\'t convert "+o+" to object");return Object(o)}});';
  }, function(e, t) {
    ace.define("ace/ext/searchbox", ["require", "exports", "module", "ace/lib/dom", "ace/lib/lang", "ace/lib/event", "ace/keyboard/hash_handler", "ace/lib/keys"], function(e, t, n) {
        "use strict";
        var i = e("../lib/dom"),
          o = e("../lib/lang"),
          r = e("../lib/event"),
          s = " .ace_search { background-color: #ddd; border: 1px solid #cbcbcb;  border-top: 0 none; max-width: 325px; overflow: hidden; margin: 0;  padding: 4px; padding-right: 6px; padding-bottom: 0;  position: absolute; top: 0px; z-index: 99;  white-space: normal;  } .ace_search.left {  border-left: 0 none;  border-radius: 0px 0px 5px 0px; left: 0;  } .ace_search.right { border-radius: 0px 0px 0px 5px; border-right: 0 none; right: 0; } .ace_search_form, .ace_replace_form { border-radius: 3px; border: 1px solid #cbcbcb;  float: left;  margin-bottom: 4px; overflow: hidden; } .ace_search_form.ace_nomatch {  outline: 1px solid red; } .ace_search_field { background-color: white;  border-right: 1px solid #cbcbcb;  border: 0 none; -webkit-box-sizing: border-box; -moz-box-sizing: border-box;  box-sizing: border-box; float: left;  height: 22px; outline: 0; padding: 0 7px; width: 214px; margin: 0;  } .ace_searchbtn, .ace_replacebtn { background: #fff; border: 0 none; border-left: 1px solid #dcdcdc; cursor: pointer;  float: left;  height: 22px; margin: 0;  position: relative; } .ace_searchbtn:last-child,  .ace_replacebtn:last-child {  border-top-right-radius: 3px; border-bottom-right-radius: 3px;  } .ace_searchbtn:disabled { background: none; cursor: default;  } .ace_searchbtn {  background-position: 50% 50%; background-repeat: no-repeat; width: 27px;  } .ace_searchbtn.prev { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADFJREFUeNpiSU1NZUAC/6E0I0yACYskCpsJiySKIiY0SUZk40FyTEgCjGgKwTRAgAEAQJUIPCE+qfkAAAAASUVORK5CYII=);      } .ace_searchbtn.next { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADRJREFUeNpiTE1NZQCC/0DMyIAKwGJMUAYDEo3M/s+EpvM/mkKwCQxYjIeLMaELoLMBAgwAU7UJObTKsvAAAAAASUVORK5CYII=);      } .ace_searchbtn_close {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAZ0lEQVR42u2SUQrAMAhDvazn8OjZBilCkYVVxiis8H4CT0VrAJb4WHT3C5xU2a2IQZXJjiQIRMdkEoJ5Q2yMqpfDIo+XY4k6h+YXOyKqTIj5REaxloNAd0xiKmAtsTHqW8sR2W5f7gCu5nWFUpVjZwAAAABJRU5ErkJggg==) no-repeat 50% 0;  border-radius: 50%; border: 0 none; color: #656565; cursor: pointer;  float: right; font: 16px/16px Arial;  height: 14px; margin: 5px 1px 9px 5px;  padding: 0; text-align: center; width: 14px;  } .ace_searchbtn_close:hover {  background-color: #656565;  background-position: 50% 100%;  color: white; } .ace_replacebtn.prev {  width: 54px } .ace_replacebtn.next {  width: 27px } .ace_button { margin-left: 2px; cursor: pointer;  -webkit-user-select: none;  -moz-user-select: none; -o-user-select: none; -ms-user-select: none;  user-select: none;  overflow: hidden; opacity: 0.7; border: 1px solid rgba(100,100,100,0.23); padding: 1px; -moz-box-sizing: border-box;  box-sizing:    border-box;  color: black; } .ace_button:hover { background-color: #eee; opacity:1;  } .ace_button:active {  background-color: #ddd; } .ace_button.checked { border-color: #3399ff;  opacity:1;  } .ace_search_options{  margin-bottom: 3px; text-align: right;  -webkit-user-select: none;  -moz-user-select: none; -o-user-select: none; -ms-user-select: none;  user-select: none;  }",
          a = e("../keyboard/hash_handler").HashHandler,
          l = e("../lib/keys");
        i.importCssString(s, "ace_searchbox");
        var c = '<div class="ace_search right">      <button type="button" action="hide" class="ace_searchbtn_close"></button>     <div class="ace_search_form">         <input class="ace_search_field" placeholder="Search for" spellcheck="false"></input>          <button type="button" action="findNext" class="ace_searchbtn next"></button>          <button type="button" action="findPrev" class="ace_searchbtn prev"></button>          <button type="button" action="findAll" class="ace_searchbtn" title="Alt-Enter">All</button>     </div>      <div class="ace_replace_form">          <input class="ace_search_field" placeholder="Replace with" spellcheck="false"></input>          <button type="button" action="replaceAndFindNext" class="ace_replacebtn">Replace</button>         <button type="button" action="replaceAll" class="ace_replacebtn">All</button>     </div>      <div class="ace_search_options">          <span action="toggleRegexpMode" class="ace_button" title="RegExp Search">.*</span>          <span action="toggleCaseSensitive" class="ace_button" title="CaseSensitive Search">Aa</span>          <span action="toggleWholeWords" class="ace_button" title="Whole Word Search">\\b</span>     </div>  </div>'.replace(/>\s+/g, ">"),
          d = function(e, t, n) {
            var o = i.createElement("div");
            o.innerHTML = c, this.element = o.firstChild, this.$init(), this.setEditor(e)
          };
        (function() {
          this.setEditor = function(e) {
            e.searchBox = this, e.container.appendChild(this.element), this.editor = e
          }, this.$initElements = function(e) {
            this.searchBox = e.querySelector(".ace_search_form"), this.replaceBox = e.querySelector(".ace_replace_form"), this.searchOptions = e.querySelector(".ace_search_options"), this.regExpOption = e.querySelector("[action=toggleRegexpMode]"), this.caseSensitiveOption = e.querySelector("[action=toggleCaseSensitive]"), this.wholeWordOption = e.querySelector("[action=toggleWholeWords]"), this.searchInput = this.searchBox.querySelector(".ace_search_field"), this.replaceInput = this.replaceBox.querySelector(".ace_search_field")
          }, this.$init = function() {
            var e = this.element;
            this.$initElements(e);
            var t = this;
            r.addListener(e, "mousedown", function(e) {
              setTimeout(function() {
                t.activeInput.focus()
              }, 0), r.stopPropagation(e)
            }), r.addListener(e, "click", function(e) {
              var n = e.target || e.srcElement,
                i = n.getAttribute("action");
              i && t[i] ? t[i]() : t.$searchBarKb.commands[i] && t.$searchBarKb.commands[i].exec(t), r.stopPropagation(e)
            }), r.addCommandKeyListener(e, function(e, n, i) {
              var o = l.keyCodeToString(i),
                s = t.$searchBarKb.findKeyCommand(n, o);
              s && s.exec && (s.exec(t), r.stopEvent(e))
            }), this.$onChange = o.delayedCall(function() {
              t.find(!1, !1)
            }), r.addListener(this.searchInput, "input", function() {
              t.$onChange.schedule(20)
            }), r.addListener(this.searchInput, "focus", function() {
              t.activeInput = t.searchInput, t.searchInput.value && t.highlight()
            }), r.addListener(this.replaceInput, "focus", function() {
              t.activeInput = t.replaceInput, t.searchInput.value && t.highlight()
            })
          }, this.$closeSearchBarKb = new a([{
            bindKey: "Esc",
            name: "closeSearchBar",
            exec: function(e) {
              e.searchBox.hide()
            }
          }]), this.$searchBarKb = new a, this.$searchBarKb.bindKeys({
            "Ctrl-f|Command-f": function(e) {
              var t = e.isReplace = !e.isReplace;
              e.replaceBox.style.display = t ? "" : "none", e.searchInput.focus()
            },
            "Ctrl-H|Command-Option-F": function(e) {
              e.replaceBox.style.display = "", e.replaceInput.focus()
            },
            "Ctrl-G|Command-G": function(e) {
              e.findNext()
            },
            "Ctrl-Shift-G|Command-Shift-G": function(e) {
              e.findPrev()
            },
            esc: function(e) {
              setTimeout(function() {
                e.hide()
              })
            },
            Return: function(e) {
              e.activeInput == e.replaceInput && e.replace(), e.findNext()
            },
            "Shift-Return": function(e) {
              e.activeInput == e.replaceInput && e.replace(), e.findPrev()
            },
            "Alt-Return": function(e) {
              e.activeInput == e.replaceInput && e.replaceAll(), e.findAll()
            },
            Tab: function(e) {
              (e.activeInput == e.replaceInput ? e.searchInput : e.replaceInput).focus()
            }
          }), this.$searchBarKb.addCommands([{
            name: "toggleRegexpMode",
            bindKey: {
              win: "Alt-R|Alt-/",
              mac: "Ctrl-Alt-R|Ctrl-Alt-/"
            },
            exec: function(e) {
              e.regExpOption.checked = !e.regExpOption.checked, e.$syncOptions()
            }
          }, {
            name: "toggleCaseSensitive",
            bindKey: {
              win: "Alt-C|Alt-I",
              mac: "Ctrl-Alt-R|Ctrl-Alt-I"
            },
            exec: function(e) {
              e.caseSensitiveOption.checked = !e.caseSensitiveOption.checked, e.$syncOptions()
            }
          }, {
            name: "toggleWholeWords",
            bindKey: {
              win: "Alt-B|Alt-W",
              mac: "Ctrl-Alt-B|Ctrl-Alt-W"
            },
            exec: function(e) {
              e.wholeWordOption.checked = !e.wholeWordOption.checked, e.$syncOptions()
            }
          }]), this.$syncOptions = function() {
            i.setCssClass(this.regExpOption, "checked", this.regExpOption.checked), i.setCssClass(this.wholeWordOption, "checked", this.wholeWordOption.checked), i.setCssClass(this.caseSensitiveOption, "checked", this.caseSensitiveOption.checked), this.find(!1, !1)
          }, this.highlight = function(e) {
            this.editor.session.highlight(e || this.editor.$search.$options.re), this.editor.renderer.updateBackMarkers()
          }, this.find = function(e, t, n) {
            var o = this.editor.find(this.searchInput.value, {
                skipCurrent: e,
                backwards: t,
                wrap: !0,
                regExp: this.regExpOption.checked,
                caseSensitive: this.caseSensitiveOption.checked,
                wholeWord: this.wholeWordOption.checked,
                preventScroll: n
              }),
              r = !o && this.searchInput.value;
            i.setCssClass(this.searchBox, "ace_nomatch", r), this.editor._emit("findSearchBox", {
              match: !r
            }), this.highlight()
          }, this.findNext = function() {
            this.find(!0, !1)
          }, this.findPrev = function() {
            this.find(!0, !0)
          }, this.findAll = function() {
            var e = this.editor.findAll(this.searchInput.value, {
                regExp: this.regExpOption.checked,
                caseSensitive: this.caseSensitiveOption.checked,
                wholeWord: this.wholeWordOption.checked
              }),
              t = !e && this.searchInput.value;
            i.setCssClass(this.searchBox, "ace_nomatch", t), this.editor._emit("findSearchBox", {
              match: !t
            }), this.highlight(), this.hide()
          }, this.replace = function() {
            this.editor.getReadOnly() || this.editor.replace(this.replaceInput.value)
          }, this.replaceAndFindNext = function() {
            this.editor.getReadOnly() || (this.editor.replace(this.replaceInput.value), this.findNext())
          }, this.replaceAll = function() {
            this.editor.getReadOnly() || this.editor.replaceAll(this.replaceInput.value)
          }, this.hide = function() {
            this.element.style.display = "none", this.editor.keyBinding.removeKeyboardHandler(this.$closeSearchBarKb), this.editor.focus()
          }, this.show = function(e, t) {
            this.element.style.display = "", this.replaceBox.style.display = t ? "" : "none", this.isReplace = t, e && (this.searchInput.value = e), this.find(!1, !1, !0), this.searchInput.focus(), this.searchInput.select(), this.editor.keyBinding.addKeyboardHandler(this.$closeSearchBarKb)
          }, this.isFocused = function() {
            var e = document.activeElement;
            return e == this.searchInput || e == this.replaceInput
          }
        }).call(d.prototype), t.SearchBox = d, t.Search = function(e, t) {
          var n = e.searchBox || new d(e);
          n.show(e.session.getTextRange(), t)
        }
      }),
      function() {
        ace.acequire(["ace/ext/searchbox"], function() {})
      }()
  }, function(e, t) {
    ace.define("ace/theme/jsoneditor", ["require", "exports", "module", "ace/lib/dom"], function(e, t, n) {
      t.isDark = !1, t.cssClass = "ace-jsoneditor", t.cssText = '.ace-jsoneditor .ace_gutter { background: #ebebeb;  color: #333 }   .ace-jsoneditor.ace_editor {  font-family: droid sans mono, consolas, monospace, courier new, courier, sans-serif;  line-height: 1.3; } .ace-jsoneditor .ace_print-margin { width: 1px; background: #e8e8e8 } .ace-jsoneditor .ace_scroller { background-color: #FFFFFF } .ace-jsoneditor .ace_text-layer { color: gray } .ace-jsoneditor .ace_variable { color: #1a1a1a  } .ace-jsoneditor .ace_cursor { border-left: 2px solid #000000  } .ace-jsoneditor .ace_overwrite-cursors .ace_cursor {  border-left: 0px; border-bottom: 1px solid #000000  } .ace-jsoneditor .ace_marker-layer .ace_selection {  background: lightgray } .ace-jsoneditor.ace_multiselect .ace_selection.ace_start {  box-shadow: 0 0 3px 0px #FFFFFF;  border-radius: 2px  } .ace-jsoneditor .ace_marker-layer .ace_step { background: rgb(255, 255, 0)  } .ace-jsoneditor .ace_marker-layer .ace_bracket {  margin: -1px 0 0 -1px;  border: 1px solid #BFBFBF } .ace-jsoneditor .ace_marker-layer .ace_active-line {  background: #FFFBD1 } .ace-jsoneditor .ace_gutter-active-line { background-color : #dcdcdc  } .ace-jsoneditor .ace_marker-layer .ace_selected-word {  border: 1px solid lightgray } .ace-jsoneditor .ace_invisible {  color: #BFBFBF  } .ace-jsoneditor .ace_keyword, .ace-jsoneditor .ace_meta,  .ace-jsoneditor .ace_support.ace_constant.ace_property-value {  color: #AF956F  } .ace-jsoneditor .ace_keyword.ace_operator { color: #484848  } .ace-jsoneditor .ace_keyword.ace_other.ace_unit { color: #96DC5F  } .ace-jsoneditor .ace_constant.ace_language {  color: darkorange } .ace-jsoneditor .ace_constant.ace_numeric { color: red  } .ace-jsoneditor .ace_constant.ace_character.ace_entity {  color: #BF78CC  } .ace-jsoneditor .ace_invalid {  color: #FFFFFF; background-color: #FF002A;  } .ace-jsoneditor .ace_fold { background-color: #AF956F;  border-color: #000000 } .ace-jsoneditor .ace_storage, .ace-jsoneditor .ace_support.ace_class, .ace-jsoneditor .ace_support.ace_function,  .ace-jsoneditor .ace_support.ace_other, .ace-jsoneditor .ace_support.ace_type { color: #C52727  } .ace-jsoneditor .ace_string { color: green  } .ace-jsoneditor .ace_comment {  color: #BCC8BA  } .ace-jsoneditor .ace_entity.ace_name.ace_tag, .ace-jsoneditor .ace_entity.ace_other.ace_attribute-name {  color: #606060  } .ace-jsoneditor .ace_markup.ace_underline { text-decoration: underline  } .ace-jsoneditor .ace_indent-guide { background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y  }';
      var i = e("../lib/dom");
      i.importCssString(t.cssText, t.cssClass)
    })
  }])
});
