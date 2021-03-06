var _gsScope;
! function () {
    "use strict";
    if ("object" == typeof window)
        if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) "isIntersecting" in window.IntersectionObserverEntry.prototype || Object.defineProperty(window.IntersectionObserverEntry.prototype, "isIntersecting", {
            get: function () {
                return 0 < this.intersectionRatio
            }
        });
        else {
            var _ = window.document,
                e = [];
            t.prototype.THROTTLE_TIMEOUT = 100, t.prototype.POLL_INTERVAL = null, t.prototype.USE_MUTATION_OBSERVER = !0, t.prototype.observe = function (e) {
                if (!this._observationTargets.some(function (t) {
                        return t.element == e
                    })) {
                    if (!e || 1 != e.nodeType) throw new Error("target must be an Element");
                    this._registerInstance(), this._observationTargets.push({
                        element: e,
                        entry: null
                    }), this._monitorIntersections(), this._checkForIntersections()
                }
            }, t.prototype.unobserve = function (e) {
                this._observationTargets = this._observationTargets.filter(function (t) {
                    return t.element != e
                }), this._observationTargets.length || (this._unmonitorIntersections(), this._unregisterInstance())
            }, t.prototype.disconnect = function () {
                this._observationTargets = [], this._unmonitorIntersections(), this._unregisterInstance()
            }, t.prototype.takeRecords = function () {
                var t = this._queuedEntries.slice();
                return this._queuedEntries = [], t
            }, t.prototype._initThresholds = function (t) {
                var e = t || [0];
                return Array.isArray(e) || (e = [e]), e.sort().filter(function (t, e, i) {
                    if ("number" != typeof t || isNaN(t) || t < 0 || 1 < t) throw new Error("threshold must be a number between 0 and 1 inclusively");
                    return t !== i[e - 1]
                })
            }, t.prototype._parseRootMargin = function (t) {
                var e = (t || "0px").split(/\s+/).map(function (t) {
                    var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
                    if (!e) throw new Error("rootMargin must be specified in pixels or percent");
                    return {
                        value: parseFloat(e[1]),
                        unit: e[2]
                    }
                });
                return e[1] = e[1] || e[0], e[2] = e[2] || e[0], e[3] = e[3] || e[1], e
            }, t.prototype._monitorIntersections = function () {
                this._monitoringIntersections || (this._monitoringIntersections = !0, this.POLL_INTERVAL ? this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL) : (i(window, "resize", this._checkForIntersections, !0), i(_, "scroll", this._checkForIntersections, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in window && (this._domObserver = new MutationObserver(this._checkForIntersections), this._domObserver.observe(_, {
                    attributes: !0,
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                }))))
            }, t.prototype._unmonitorIntersections = function () {
                this._monitoringIntersections && (this._monitoringIntersections = !1, clearInterval(this._monitoringInterval), this._monitoringInterval = null, r(window, "resize", this._checkForIntersections, !0), r(_, "scroll", this._checkForIntersections, !0), this._domObserver && (this._domObserver.disconnect(), this._domObserver = null))
            }, t.prototype._checkForIntersections = function () {
                var a = this._rootIsInDom(),
                    u = a ? this._getRootRect() : {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: 0,
                        height: 0
                    };
                this._observationTargets.forEach(function (t) {
                    var e = t.element,
                        i = d(e),
                        r = this._rootContainsTarget(e),
                        n = t.entry,
                        s = a && r && this._computeTargetAndRootIntersection(e, u),
                        o = t.entry = new l({
                            time: window.performance && performance.now && performance.now(),
                            target: e,
                            boundingClientRect: i,
                            rootBounds: u,
                            intersectionRect: s
                        });
                    n ? a && r ? this._hasCrossedThreshold(n, o) && this._queuedEntries.push(o) : n && n.isIntersecting && this._queuedEntries.push(o) : this._queuedEntries.push(o)
                }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this)
            }, t.prototype._computeTargetAndRootIntersection = function (t, e) {
                if ("none" != window.getComputedStyle(t).display) {
                    for (var i, r, n, s, o, a, u, l, h = d(t), p = m(t), f = !1; !f;) {
                        var c = null,
                            D = 1 == p.nodeType ? window.getComputedStyle(p) : {};
                        if ("none" == D.display) return;
                        if (p == this.root || p == _ ? (f = !0, c = e) : p != _.body && p != _.documentElement && "visible" != D.overflow && (c = d(p)), c && (i = c, r = h, void 0, n = Math.max(i.top, r.top), s = Math.min(i.bottom, r.bottom), o = Math.max(i.left, r.left), a = Math.min(i.right, r.right), l = s - n, !(h = 0 <= (u = a - o) && 0 <= l && {
                                top: n,
                                bottom: s,
                                left: o,
                                right: a,
                                width: u,
                                height: l
                            }))) break;
                        p = m(p)
                    }
                    return h
                }
            }, t.prototype._getRootRect = function () {
                var t;
                if (this.root) t = d(this.root);
                else {
                    var e = _.documentElement,
                        i = _.body;
                    t = {
                        top: 0,
                        left: 0,
                        right: e.clientWidth || i.clientWidth,
                        width: e.clientWidth || i.clientWidth,
                        bottom: e.clientHeight || i.clientHeight,
                        height: e.clientHeight || i.clientHeight
                    }
                }
                return this._expandRectByRootMargin(t)
            }, t.prototype._expandRectByRootMargin = function (i) {
                var t = this._rootMarginValues.map(function (t, e) {
                        return "px" == t.unit ? t.value : t.value * (e % 2 ? i.width : i.height) / 100
                    }),
                    e = {
                        top: i.top - t[0],
                        right: i.right + t[1],
                        bottom: i.bottom + t[2],
                        left: i.left - t[3]
                    };
                return e.width = e.right - e.left, e.height = e.bottom - e.top, e
            }, t.prototype._hasCrossedThreshold = function (t, e) {
                var i = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
                    r = e.isIntersecting ? e.intersectionRatio || 0 : -1;
                if (i !== r)
                    for (var n = 0; n < this.thresholds.length; n++) {
                        var s = this.thresholds[n];
                        if (s == i || s == r || s < i != s < r) return !0
                    }
            }, t.prototype._rootIsInDom = function () {
                return !this.root || n(_, this.root)
            }, t.prototype._rootContainsTarget = function (t) {
                return n(this.root || _, t)
            }, t.prototype._registerInstance = function () {
                e.indexOf(this) < 0 && e.push(this)
            }, t.prototype._unregisterInstance = function () {
                var t = e.indexOf(this); - 1 != t && e.splice(t, 1)
            }, window.IntersectionObserver = t, window.IntersectionObserverEntry = l
        }
    function l(t) {
        this.time = t.time, this.target = t.target, this.rootBounds = t.rootBounds, this.boundingClientRect = t.boundingClientRect, this.intersectionRect = t.intersectionRect || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }, this.isIntersecting = !!t.intersectionRect;
        var e = this.boundingClientRect,
            i = e.width * e.height,
            r = this.intersectionRect,
            n = r.width * r.height;
        this.intersectionRatio = i ? Number((n / i).toFixed(4)) : this.isIntersecting ? 1 : 0
    }

    function t(t, e) {
        var i = e || {};
        if ("function" != typeof t) throw new Error("callback must be a function");
        if (i.root && 1 != i.root.nodeType) throw new Error("root must be an Element");
        this._checkForIntersections = function (t, e) {
            var i = null;
            return function () {
                i = i || setTimeout(function () {
                    t(), i = null
                }, e)
            }
        }(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(i.rootMargin), this.thresholds = this._initThresholds(i.threshold), this.root = i.root || null, this.rootMargin = this._rootMarginValues.map(function (t) {
            return t.value + t.unit
        }).join(" ")
    }

    function i(t, e, i, r) {
        "function" == typeof t.addEventListener ? t.addEventListener(e, i, r || !1) : "function" == typeof t.attachEvent && t.attachEvent("on" + e, i)
    }

    function r(t, e, i, r) {
        "function" == typeof t.removeEventListener ? t.removeEventListener(e, i, r || !1) : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, i)
    }

    function d(t) {
        var e;
        try {
            e = t.getBoundingClientRect()
        } catch (t) {}
        return e ? (e.width && e.height || (e = {
            top: e.top,
            right: e.right,
            bottom: e.bottom,
            left: e.left,
            width: e.right - e.left,
            height: e.bottom - e.top
        }), e) : {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }
    }

    function n(t, e) {
        for (var i = e; i;) {
            if (i == t) return !0;
            i = m(i)
        }
        return !1
    }

    function m(t) {
        var e = t.parentNode;
        return e && 11 == e.nodeType && e.host ? e.host : e && e.assignedSlot ? e.assignedSlot.parentNode : e
    }
}(),
function (f, c) {
    "use strict";
    var D = {},
        r = f.document,
        _ = f.GreenSockGlobals = f.GreenSockGlobals || f,
        t = _[c];
    if (t) return "undefined" != typeof module && module.exports && (module.exports = t);

    function d(t) {
        var e, i = t.split("."),
            r = _;
        for (e = 0; e < i.length; e++) r[i[e]] = r = r[i[e]] || {};
        return r
    }

    function u(t) {
        var e, i = [],
            r = t.length;
        for (e = 0; e !== r; i.push(t[e++]));
        return i
    }

    function m() {}
    var e, i, n, g, y, s, o, p = d("com.greensock"),
        v = 1e-8,
        x = (s = Object.prototype.toString, o = s.call([]), function (t) {
            return null != t && (t instanceof Array || "object" == typeof t && !!t.push && s.call(t) === o)
        }),
        C = {},
        F = function (a, u, l, h) {
            this.sc = C[a] ? C[a].sc : [], (C[a] = this).gsClass = null, this.func = l;
            var p = [];
            this.check = function (t) {
                for (var e, i, r, n, s = u.length, o = s; - 1 < --s;)(e = C[u[s]] || new F(u[s], [])).gsClass ? (p[s] = e.gsClass, o--) : t && e.sc.push(this);
                if (0 === o && l) {
                    if (r = (i = ("com.greensock." + a).split(".")).pop(), n = d(i.join("."))[r] = this.gsClass = l.apply(l, p), h)
                        if (_[r] = D[r] = n, "undefined" != typeof module && module.exports)
                            if (a === c)
                                for (s in module.exports = D[c] = n, D) n[s] = D[s];
                            else D[c] && (D[c][r] = n);
                    else "function" == typeof define && define.amd && define((f.GreenSockAMDPath ? f.GreenSockAMDPath + "/" : "") + a.split(".").pop(), [], function () {
                        return n
                    });
                    for (s = 0; s < this.sc.length; s++) this.sc[s].check()
                }
            }, this.check(!0)
        },
        a = f._gsDefine = function (t, e, i, r) {
            return new F(t, e, i, r)
        },
        T = p._class = function (t, e, i) {
            return e = e || function () {}, a(t, [], function () {
                return e
            }, i), e
        };
    a.globals = _;
    var l = [0, 0, 1, 1],
        w = T("easing.Ease", function (t, e, i, r) {
            this._func = t, this._type = i || 0, this._power = r || 0, this._params = e ? l.concat(e) : l
        }, !0),
        b = w.map = {},
        h = w.register = function (t, e, i, r) {
            for (var n, s, o, a, u = e.split(","), l = u.length, h = (i || "easeIn,easeOut,easeInOut").split(","); - 1 < --l;)
                for (s = u[l], n = r ? T("easing." + s, null, !0) : p.easing[s] || {}, o = h.length; - 1 < --o;) a = h[o], b[s + "." + a] = b[a + s] = n[a] = t.getRatio ? t : t[a] || new t
        };
    for ((n = w.prototype)._calcEnd = !1, n.getRatio = function (t) {
            if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
            var e = this._type,
                i = this._power,
                r = 1 === e ? 1 - t : 2 === e ? t : t < .5 ? 2 * t : 2 * (1 - t);
            return 1 === i ? r *= r : 2 === i ? r *= r * r : 3 === i ? r *= r * r * r : 4 === i && (r *= r * r * r * r), 1 === e ? 1 - r : 2 === e ? r : t < .5 ? r / 2 : 1 - r / 2
        }, i = (e = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"]).length; - 1 < --i;) n = e[i] + ",Power" + i, h(new w(null, null, 1, i), n, "easeOut", !0), h(new w(null, null, 2, i), n, "easeIn" + (0 === i ? ",easeNone" : "")), h(new w(null, null, 3, i), n, "easeInOut");
    b.linear = p.easing.Linear.easeIn, b.swing = p.easing.Quad.easeInOut;
    var E = T("events.EventDispatcher", function (t) {
        this._listeners = {}, this._eventTarget = t || this
    });
    (n = E.prototype).addEventListener = function (t, e, i, r, n) {
        n = n || 0;
        var s, o, a = this._listeners[t],
            u = 0;
        for (this !== g || y || g.wake(), null == a && (this._listeners[t] = a = []), o = a.length; - 1 < --o;)(s = a[o]).c === e && s.s === i ? a.splice(o, 1) : 0 === u && s.pr < n && (u = o + 1);
        a.splice(u, 0, {
            c: e,
            s: i,
            up: r,
            pr: n
        })
    }, n.removeEventListener = function (t, e) {
        var i, r = this._listeners[t];
        if (r)
            for (i = r.length; - 1 < --i;)
                if (r[i].c === e) return void r.splice(i, 1)
    }, n.dispatchEvent = function (t) {
        var e, i, r, n = this._listeners[t];
        if (n)
            for (1 < (e = n.length) && (n = n.slice(0)), i = this._eventTarget; - 1 < --e;)(r = n[e]) && (r.up ? r.c.call(r.s || i, {
                type: t,
                target: i
            }) : r.c.call(r.s || i))
    };
    var P = f.requestAnimationFrame,
        O = f.cancelAnimationFrame,
        S = Date.now || function () {
            return (new Date).getTime()
        },
        A = S();
    for (i = (e = ["ms", "moz", "webkit", "o"]).length; - 1 < --i && !P;) P = f[e[i] + "RequestAnimationFrame"], O = f[e[i] + "CancelAnimationFrame"] || f[e[i] + "CancelRequestAnimationFrame"];
    T("Ticker", function (t, e) {
        var n, s, o, a, u, l = this,
            h = S(),
            i = !(!1 === e || !P) && "auto",
            p = 500,
            f = 33,
            c = function (t) {
                var e, i, r = S() - A;
                p < r && (h += r - f), A += r, l.time = (A - h) / 1e3, e = l.time - u, (!n || 0 < e || !0 === t) && (l.frame++, u += e + (a <= e ? .004 : a - e), i = !0), !0 !== t && (o = s(c)), i && l.dispatchEvent("tick")
            };
        E.call(l), l.time = l.frame = 0, l.tick = function () {
            c(!0)
        }, l.lagSmoothing = function (t, e) {
            return arguments.length ? (p = t || 1e8, void(f = Math.min(e, p, 0))) : p < 1e8
        }, l.sleep = function () {
            null != o && (i && O ? O(o) : clearTimeout(o), s = m, o = null, l === g && (y = !1))
        }, l.wake = function (t) {
            null !== o ? l.sleep() : t ? h += -A + (A = S()) : 10 < l.frame && (A = S() - p + 5), s = 0 === n ? m : i && P ? P : function (t) {
                return setTimeout(t, 1e3 * (u - l.time) + 1 | 0)
            }, l === g && (y = !0), c(2)
        }, l.fps = function (t) {
            return arguments.length ? (a = 1 / ((n = t) || 60), u = this.time + a, void l.wake()) : n
        }, l.useRAF = function (t) {
            return arguments.length ? (l.sleep(), i = t, void l.fps(n)) : i
        }, l.fps(t), setTimeout(function () {
            "auto" === i && l.frame < 5 && "hidden" !== (r || {}).visibilityState && l.useRAF(!1)
        }, 1500)
    }), (n = p.Ticker.prototype = new p.events.EventDispatcher).constructor = p.Ticker;
    var k = T("core.Animation", function (t, e) {
        if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = !!e.immediateRender, this.data = e.data, this._reversed = !!e.reversed, K) {
            y || g.wake();
            var i = this.vars.useFrames ? $ : K;
            i.add(this, i._time), this.vars.paused && this.paused(!0)
        }
    });
    g = k.ticker = new p.Ticker, (n = k.prototype)._dirty = n._gc = n._initted = n._paused = !1, n._totalTime = n._time = 0, n._rawPrevTime = -1, n._next = n._last = n._onUpdate = n._timeline = n.timeline = null, n._paused = !1;
    var R = function () {
        y && 2e3 < S() - A && ("hidden" !== (r || {}).visibilityState || !g.lagSmoothing()) && g.wake();
        var t = setTimeout(R, 2e3);
        t.unref && t.unref()
    };
    R(), n.play = function (t, e) {
        return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
    }, n.pause = function (t, e) {
        return null != t && this.seek(t, e), this.paused(!0)
    }, n.resume = function (t, e) {
        return null != t && this.seek(t, e), this.paused(!1)
    }, n.seek = function (t, e) {
        return this.totalTime(Number(t), !1 !== e)
    }, n.restart = function (t, e) {
        return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, !1 !== e, !0)
    }, n.reverse = function (t, e) {
        return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
    }, n.render = function (t, e, i) {}, n.invalidate = function () {
        return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, !this._gc && this.timeline || this._enabled(!0), this
    }, n.isActive = function () {
        var t, e = this._timeline,
            i = this._startTime;
        return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime(!0)) >= i && t < i + this.totalDuration() / this._timeScale - v
    }, n._enabled = function (t, e) {
        return y || g.wake(), this._gc = !t, this._active = this.isActive(), !0 !== e && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
    }, n._kill = function (t, e) {
        return this._enabled(!1, !1)
    }, n.kill = function (t, e) {
        return this._kill(t, e), this
    }, n._uncache = function (t) {
        for (var e = t ? this : this.timeline; e;) e._dirty = !0, e = e.timeline;
        return this
    }, n._swapSelfInParams = function (t) {
        for (var e = t.length, i = t.concat(); - 1 < --e;) "{self}" === t[e] && (i[e] = this);
        return i
    }, n._callback = function (t) {
        var e = this.vars,
            i = e[t],
            r = e[t + "Params"],
            n = e[t + "Scope"] || e.callbackScope || this;
        switch (r ? r.length : 0) {
            case 0:
                i.call(n);
                break;
            case 1:
                i.call(n, r[0]);
                break;
            case 2:
                i.call(n, r[0], r[1]);
                break;
            default:
                i.apply(n, r)
        }
    }, n.eventCallback = function (t, e, i, r) {
        if ("on" === (t || "").substr(0, 2)) {
            var n = this.vars;
            if (1 === arguments.length) return n[t];
            null == e ? delete n[t] : (n[t] = e, n[t + "Params"] = x(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, n[t + "Scope"] = r), "onUpdate" === t && (this._onUpdate = e)
        }
        return this
    }, n.delay = function (t) {
        return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
    }, n.duration = function (t) {
        return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && 0 < this._time && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
    }, n.totalDuration = function (t) {
        return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration
    }, n.time = function (t, e) {
        return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
    }, n.totalTime = function (t, e, i) {
        if (y || g.wake(), !arguments.length) return this._totalTime;
        if (this._timeline) {
            if (t < 0 && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
                this._dirty && this.totalDuration();
                var r = this._totalDuration,
                    n = this._timeline;
                if (r < t && !i && (t = r), this._startTime = (this._paused ? this._pauseTime : n._time) - (this._reversed ? r - t : t) / this._timeScale, n._dirty || this._uncache(!1), n._timeline)
                    for (; n._timeline;) n._timeline._time !== (n._startTime + n._totalTime) / n._timeScale && n.totalTime(n._totalTime, !0), n = n._timeline
            }
            this._gc && this._enabled(!0, !1), this._totalTime === t && 0 !== this._duration || (Y.length && tt(), this.render(t, e, !1), Y.length && tt())
        }
        return this
    }, n.progress = n.totalProgress = function (t, e) {
        var i = this.duration();
        return arguments.length ? this.totalTime(i * t, e) : i ? this._time / i : this.ratio
    }, n.startTime = function (t) {
        return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
    }, n.endTime = function (t) {
        return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
    }, n.timeScale = function (t) {
        if (!arguments.length) return this._timeScale;
        var e, i;
        for (t = t || v, this._timeline && this._timeline.smoothChildTiming && (i = (e = this._pauseTime) || 0 === e ? e : this._timeline.totalTime(), this._startTime = i - (i - this._startTime) * this._timeScale / t), this._timeScale = t, i = this.timeline; i && i.timeline;) i._dirty = !0, i.totalDuration(), i = i.timeline;
        return this
    }, n.reversed = function (t) {
        return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
    }, n.paused = function (t) {
        if (!arguments.length) return this._paused;
        var e, i, r = this._timeline;
        return t != this._paused && r && (y || t || g.wake(), i = (e = r.rawTime()) - this._pauseTime, !t && r.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = t ? e : null, this._paused = t, this._active = this.isActive(), !t && 0 != i && this._initted && this.duration() && (e = r.smoothChildTiming ? this._totalTime : (e - this._startTime) / this._timeScale, this.render(e, e === this._totalTime, !0))), this._gc && !t && this._enabled(!0, !1), this
    };
    var B = T("core.SimpleTimeline", function (t) {
        k.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0
    });
    (n = B.prototype = new k).constructor = B, n.kill()._gc = !1, n._first = n._last = n._recent = null, n._sortChildren = !1, n.add = n.insert = function (t, e, i, r) {
        var n, s;
        if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = this.rawTime() - (t._timeline.rawTime() - t._pauseTime)), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), n = this._last, this._sortChildren)
            for (s = t._startTime; n && n._startTime > s;) n = n._prev;
        return n ? (t._next = n._next, n._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = n, this._recent = t, this._timeline && this._uncache(!0), this
    }, n._remove = function (t, e) {
        return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, t === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
    }, n.render = function (t, e, i) {
        var r, n = this._first;
        for (this._totalTime = this._time = this._rawPrevTime = t; n;) r = n._next, (n._active || t >= n._startTime && !n._paused && !n._gc) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)), n = r
    }, n.rawTime = function () {
        return y || g.wake(), this._totalTime
    };

    function M(t) {
        return t && t.length && t !== f && t[0] && (t[0] === f || t[0].nodeType && t[0].style && !t.nodeType)
    }
    var I = T("TweenLite", function (t, e, i) {
        if (k.call(this, e, i), this.render = I.prototype.render, null == t) throw "Cannot tween a null target.";
        this.target = t = "string" != typeof t ? t : I.selector(t) || t;
        var r, n, s, o = t.jquery || t.length && t !== f && t[0] && (t[0] === f || t[0].nodeType && t[0].style && !t.nodeType),
            a = this.vars.overwrite;
        if (this._overwrite = a = null == a ? Z[I.defaultOverwrite] : "number" == typeof a ? a >> 0 : Z[a], (o || t instanceof Array || t.push && x(t)) && "number" != typeof t[0])
            for (this._targets = s = u(t), this._propLookup = [], this._siblings = [], r = 0; r < s.length; r++)(n = s[r]) ? "string" != typeof n ? n.length && n !== f && n[0] && (n[0] === f || n[0].nodeType && n[0].style && !n.nodeType) ? (s.splice(r--, 1), this._targets = s = s.concat(u(n))) : (this._siblings[r] = it(n, this, !1), 1 === a && 1 < this._siblings[r].length && rt(n, this, null, 1, this._siblings[r])) : "string" == typeof (n = s[r--] = I.selector(n)) && s.splice(r + 1, 1) : s.splice(r--, 1);
        else this._propLookup = {}, this._siblings = it(t, this, !1), 1 === a && 1 < this._siblings.length && rt(t, this, null, 1, this._siblings);
        (this.vars.immediateRender || 0 === e && 0 === this._delay && !1 !== this.vars.immediateRender) && (this._time = -v, this.render(Math.min(0, -this._delay)))
    }, !0);
    (n = I.prototype = new k).constructor = I, n.kill()._gc = !1, n.ratio = 0, n._firstPT = n._targets = n._overwrittenProps = n._startAt = null, n._notifyPluginsOfEnabled = n._lazy = !1, I.version = "2.1.2", I.defaultEase = n._ease = new w(null, null, 1, 1), I.defaultOverwrite = "auto", I.ticker = g, I.autoSleep = 120, I.lagSmoothing = function (t, e) {
        g.lagSmoothing(t, e)
    }, I.selector = f.$ || f.jQuery || function (t) {
        var e = f.$ || f.jQuery;
        return e ? (I.selector = e)(t) : (r = r || f.document) ? r.querySelectorAll ? r.querySelectorAll(t) : r.getElementById("#" === t.charAt(0) ? t.substr(1) : t) : t
    };

    function N(t) {
        for (var e, i = this._firstPT; i;) e = i.blob ? 1 === t && null != this.end ? this.end : t ? this.join("") : this.start : i.c * t + i.s, i.m ? e = i.m.call(this._tween, e, this._target || i.t, this._tween) : e < 1e-6 && -1e-6 < e && !i.blob && (e = 0), i.f ? i.fp ? i.t[i.p](i.fp, e) : i.t[i.p](e) : i.t[i.p] = e, i = i._next
    }

    function L(t) {
        return (1e3 * t | 0) / 1e3 + ""
    }

    function X(t, e, i, r) {
        var n, s, o, a, u, l, h, p = [],
            f = 0,
            c = "",
            D = 0;
        for (p.start = t, p.end = e, t = p[0] = t + "", e = p[1] = e + "", i && (i(p), t = p[0], e = p[1]), p.length = 0, n = t.match(V) || [], s = e.match(V) || [], r && (r._next = null, r.blob = 1, p._firstPT = p._applyPT = r), u = s.length, a = 0; a < u; a++) h = s[a], c += (l = e.substr(f, e.indexOf(h, f) - f)) || !a ? l : ",", f += l.length, D ? D = (D + 1) % 5 : "rgba(" === l.substr(-5) && (D = 1), h === n[a] || n.length <= a ? c += h : (c && (p.push(c), c = ""), o = parseFloat(n[a]), p.push(o), p._firstPT = {
            _next: p._firstPT,
            t: p,
            p: p.length - 1,
            s: o,
            c: ("=" === h.charAt(1) ? parseInt(h.charAt(0) + "1", 10) * parseFloat(h.substr(2)) : parseFloat(h) - o) || 0,
            f: 0,
            m: D && D < 4 ? Math.round : L
        }), f += h.length;
        return (c += e.substr(f)) && p.push(c), p.setRatio = N, W.test(e) && (p.end = null), p
    }

    function z(t, e, i, r, n, s, o, a, u) {
        "function" == typeof r && (r = r(u || 0, t));
        var l = typeof t[e],
            h = "function" != l ? "" : e.indexOf("set") || "function" != typeof t["get" + e.substr(3)] ? e : "get" + e.substr(3),
            p = "get" !== i ? i : h ? o ? t[h](o) : t[h]() : t[e],
            f = "string" == typeof r && "=" === r.charAt(1),
            c = {
                t: t,
                p: e,
                s: p,
                f: "function" == l,
                pg: 0,
                n: n || e,
                m: s ? "function" == typeof s ? s : Math.round : 0,
                pr: 0,
                c: f ? parseInt(r.charAt(0) + "1", 10) * parseFloat(r.substr(2)) : parseFloat(r) - p || 0
            };
        return "number" == typeof p && ("number" == typeof r || f) || (o || isNaN(p) || !f && isNaN(r) || "boolean" == typeof p || "boolean" == typeof r ? (c.fp = o, c = {
            t: X(p, f ? parseFloat(c.s) + c.c + (c.s + "").replace(/[0-9\-\.]/g, "") : r, a || I.defaultStringFilter, c),
            p: "setRatio",
            s: 0,
            c: 1,
            f: 2,
            pg: 0,
            n: n || e,
            pr: 0,
            m: 0
        }) : (c.s = parseFloat(p), f || (c.c = parseFloat(r) - c.s || 0))), c.c ? ((c._next = this._firstPT) && (c._next._prev = c), this._firstPT = c) : void 0
    }
    var Y = [],
        j = {},
        V = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        W = /[\+-]=-?[\.\d]/,
        U = I._internals = {
            isArray: x,
            isSelector: M,
            lazyTweens: Y,
            blobDif: X
        },
        q = I._plugins = {},
        H = U.tweenLookup = {},
        G = 0,
        Q = U.reservedProps = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1,
            autoCSS: 1,
            lazy: 1,
            onOverwrite: 1,
            callbackScope: 1,
            stringFilter: 1,
            id: 1,
            yoyoEase: 1,
            stagger: 1
        },
        Z = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            true: 1,
            false: 0
        },
        $ = k._rootFramesTimeline = new B,
        K = k._rootTimeline = new B,
        J = 30,
        tt = U.lazyRender = function () {
            var t, e, i = Y.length;
            for (j = {}, t = 0; t < i; t++)(e = Y[t]) && !1 !== e._lazy && (e.render(e._lazy[0], e._lazy[1], !0), e._lazy = !1);
            Y.length = 0
        };
    K._startTime = g.time, $._startTime = g.frame, K._active = $._active = !0, setTimeout(tt, 1), k._updateRoot = I.render = function () {
        var t, e, i;
        if (Y.length && tt(), K.render((g.time - K._startTime) * K._timeScale, !1, !1), $.render((g.frame - $._startTime) * $._timeScale, !1, !1), Y.length && tt(), g.frame >= J) {
            for (i in J = g.frame + (parseInt(I.autoSleep, 10) || 120), H) {
                for (t = (e = H[i].tweens).length; - 1 < --t;) e[t]._gc && e.splice(t, 1);
                0 === e.length && delete H[i]
            }
            if ((!(i = K._first) || i._paused) && I.autoSleep && !$._first && 1 === g._listeners.tick.length) {
                for (; i && i._paused;) i = i._next;
                i || g.sleep()
            }
        }
    }, g.addEventListener("tick", k._updateRoot);

    function et(t, e, i, r) {
        var n, s, o = t.vars.onOverwrite;
        return o && (n = o(t, e, i, r)), (o = I.onOverwrite) && (s = o(t, e, i, r)), !1 !== n && !1 !== s
    }
    var it = function (t, e, i) {
            var r, n, s = t._gsTweenID;
            if (H[s || (t._gsTweenID = s = "t" + G++)] || (H[s] = {
                    target: t,
                    tweens: []
                }), e && ((r = H[s].tweens)[n = r.length] = e, i))
                for (; - 1 < --n;) r[n] === e && r.splice(n, 1);
            return H[s].tweens
        },
        rt = function (t, e, i, r, n) {
            var s, o, a, u;
            if (1 === r || 4 <= r) {
                for (u = n.length, s = 0; s < u; s++)
                    if ((a = n[s]) !== e) a._gc || a._kill(null, t, e) && (o = !0);
                    else if (5 === r) break;
                return o
            }
            var l, h = e._startTime + v,
                p = [],
                f = 0,
                c = 0 === e._duration;
            for (s = n.length; - 1 < --s;)(a = n[s]) === e || a._gc || a._paused || (a._timeline !== e._timeline ? (l = l || nt(e, 0, c), 0 === nt(a, l, c) && (p[f++] = a)) : a._startTime <= h && a._startTime + a.totalDuration() / a._timeScale > h && ((c || !a._initted) && h - a._startTime <= 2e-8 || (p[f++] = a)));
            for (s = f; - 1 < --s;)
                if (u = (a = p[s])._firstPT, 2 === r && a._kill(i, t, e) && (o = !0), 2 !== r || !a._firstPT && a._initted && u) {
                    if (2 !== r && !et(a, e)) continue;
                    a._enabled(!1, !1) && (o = !0)
                } return o
        },
        nt = function (t, e, i) {
            for (var r = t._timeline, n = r._timeScale, s = t._startTime; r._timeline;) {
                if (s += r._startTime, n *= r._timeScale, r._paused) return -100;
                r = r._timeline
            }
            return e < (s /= n) ? s - e : i && s === e || !t._initted && s - e < 2e-8 ? v : (s += t.totalDuration() / t._timeScale / n) > e + v ? 0 : s - e - v
        };
    n._init = function () {
        var t, e, i, r, n, s, o = this.vars,
            a = this._overwrittenProps,
            u = this._duration,
            l = !!o.immediateRender,
            h = o.ease,
            p = this._startAt;
        if (o.startAt) {
            for (r in p && (p.render(-1, !0), p.kill()), n = {}, o.startAt) n[r] = o.startAt[r];
            if (n.data = "isStart", n.overwrite = !1, n.immediateRender = !0, n.lazy = l && !1 !== o.lazy, n.startAt = n.delay = null, n.onUpdate = o.onUpdate, n.onUpdateParams = o.onUpdateParams, n.onUpdateScope = o.onUpdateScope || o.callbackScope || this, this._startAt = I.to(this.target || {}, 0, n), l)
                if (0 < this._time) this._startAt = null;
                else if (0 !== u) return
        } else if (o.runBackwards && 0 !== u)
            if (p) p.render(-1, !0), p.kill(), this._startAt = null;
            else {
                for (r in 0 !== this._time && (l = !1), i = {}, o) Q[r] && "autoCSS" !== r || (i[r] = o[r]);
                if (i.overwrite = 0, i.data = "isFromStart", i.lazy = l && !1 !== o.lazy, i.immediateRender = l, this._startAt = I.to(this.target, 0, i), l) {
                    if (0 === this._time) return
                } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
            } if (this._ease = h = h ? h instanceof w ? h : "function" == typeof h ? new w(h, o.easeParams) : b[h] || I.defaultEase : I.defaultEase, o.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, o.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
            for (s = this._targets.length, t = 0; t < s; t++) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null, t) && (e = !0);
        else e = this._initProps(this.target, this._propLookup, this._siblings, a, 0);
        if (e && I._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), o.runBackwards)
            for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
        this._onUpdate = o.onUpdate, this._initted = !0
    }, n._initProps = function (t, e, i, r, n) {
        var s, o, a, u, l, h;
        if (null == t) return !1;
        for (s in j[t._gsTweenID] && tt(), this.vars.css || t.style && t !== f && t.nodeType && q.css && !1 !== this.vars.autoCSS && function (t, e) {
                var i, r = {};
                for (i in t) Q[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!q[i] || q[i] && q[i]._autoCSS) || (r[i] = t[i], delete t[i]);
                t.css = r
            }(this.vars, t), this.vars)
            if (h = this.vars[s], Q[s]) h && (h instanceof Array || h.push && x(h)) && -1 !== h.join("").indexOf("{self}") && (this.vars[s] = h = this._swapSelfInParams(h, this));
            else if (q[s] && (u = new q[s])._onInitTween(t, this.vars[s], this, n)) {
            for (this._firstPT = l = {
                    _next: this._firstPT,
                    t: u,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: 1,
                    n: s,
                    pg: 1,
                    pr: u._priority,
                    m: 0
                }, o = u._overwriteProps.length; - 1 < --o;) e[u._overwriteProps[o]] = this._firstPT;
            (u._priority || u._onInitAllProps) && (a = !0), (u._onDisable || u._onEnable) && (this._notifyPluginsOfEnabled = !0), l._next && (l._next._prev = l)
        } else e[s] = z.call(this, t, s, "get", h, s, 0, null, this.vars.stringFilter, n);
        return r && this._kill(r, t) ? this._initProps(t, e, i, r, n) : 1 < this._overwrite && this._firstPT && 1 < i.length && rt(t, this, e, this._overwrite, i) ? (this._kill(e, t), this._initProps(t, e, i, r, n)) : (this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration) && (j[t._gsTweenID] = !0), a)
    }, n.render = function (t, e, i) {
        var r, n, s, o, a = this,
            u = a._time,
            l = a._duration,
            h = a._rawPrevTime;
        if (l - v <= t && 0 <= t) a._totalTime = a._time = l, a.ratio = a._ease._calcEnd ? a._ease.getRatio(1) : 1, a._reversed || (r = !0, n = "onComplete", i = i || a._timeline.autoRemoveChildren), 0 !== l || !a._initted && a.vars.lazy && !i || (a._startTime === a._timeline._duration && (t = 0), (h < 0 || t <= 0 && -v <= t || h === v && "isPause" !== a.data) && h !== t && (i = !0, v < h && (n = "onReverseComplete")), a._rawPrevTime = o = !e || t || h === t ? t : v);
        else if (t < v) a._totalTime = a._time = 0, a.ratio = a._ease._calcEnd ? a._ease.getRatio(0) : 0, (0 !== u || 0 === l && 0 < h) && (n = "onReverseComplete", r = a._reversed), -v < t ? t = 0 : t < 0 && (a._active = !1, 0 !== l || !a._initted && a.vars.lazy && !i || (0 <= h && (h !== v || "isPause" !== a.data) && (i = !0), a._rawPrevTime = o = !e || t || h === t ? t : v)), (!a._initted || a._startAt && a._startAt.progress()) && (i = !0);
        else if (a._totalTime = a._time = t, a._easeType) {
            var p = t / l,
                f = a._easeType,
                c = a._easePower;
            (1 === f || 3 === f && .5 <= p) && (p = 1 - p), 3 === f && (p *= 2), 1 === c ? p *= p : 2 === c ? p *= p * p : 3 === c ? p *= p * p * p : 4 === c && (p *= p * p * p * p), a.ratio = 1 === f ? 1 - p : 2 === f ? p : t / l < .5 ? p / 2 : 1 - p / 2
        } else a.ratio = a._ease.getRatio(t / l);
        if (a._time !== u || i) {
            if (!a._initted) {
                if (a._init(), !a._initted || a._gc) return;
                if (!i && a._firstPT && (!1 !== a.vars.lazy && a._duration || a.vars.lazy && !a._duration)) return a._time = a._totalTime = u, a._rawPrevTime = h, Y.push(a), void(a._lazy = [t, e]);
                a._time && !r ? a.ratio = a._ease.getRatio(a._time / l) : r && a._ease._calcEnd && (a.ratio = a._ease.getRatio(0 === a._time ? 0 : 1))
            }
            for (!1 !== a._lazy && (a._lazy = !1), a._active || !a._paused && a._time !== u && 0 <= t && (a._active = !0), 0 === u && (a._startAt && (0 <= t ? a._startAt.render(t, !0, i) : n = n || "_dummyGS"), !a.vars.onStart || 0 === a._time && 0 !== l || (e || a._callback("onStart"))), s = a._firstPT; s;) s.f ? s.t[s.p](s.c * a.ratio + s.s) : s.t[s.p] = s.c * a.ratio + s.s, s = s._next;
            a._onUpdate && (t < 0 && a._startAt && -1e-4 !== t && a._startAt.render(t, !0, i), e || (a._time !== u || r || i) && a._callback("onUpdate")), !n || a._gc && !i || (t < 0 && a._startAt && !a._onUpdate && -1e-4 !== t && a._startAt.render(t, !0, i), r && (a._timeline.autoRemoveChildren && a._enabled(!1, !1), a._active = !1), !e && a.vars[n] && a._callback(n), 0 === l && a._rawPrevTime === v && o !== v && (a._rawPrevTime = 0))
        }
    }, n._kill = function (t, e, i) {
        if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);
        e = "string" != typeof e ? e || this._targets || this.target : I.selector(e) || e;
        var r, n, s, o, a, u, l, h, p, f = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline,
            c = this._firstPT;
        if ((x(e) || M(e)) && "number" != typeof e[0])
            for (r = e.length; - 1 < --r;) this._kill(t, e[r], i) && (u = !0);
        else {
            if (this._targets) {
                for (r = this._targets.length; - 1 < --r;)
                    if (e === this._targets[r]) {
                        a = this._propLookup[r] || {}, this._overwrittenProps = this._overwrittenProps || [], n = this._overwrittenProps[r] = t ? this._overwrittenProps[r] || {} : "all";
                        break
                    }
            } else {
                if (e !== this.target) return !1;
                a = this._propLookup, n = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
            }
            if (a) {
                if (l = t || a, h = t !== n && "all" !== n && t !== a && ("object" != typeof t || !t._tempKill), i && (I.onOverwrite || this.vars.onOverwrite)) {
                    for (s in l) a[s] && (p = p || []).push(s);
                    if ((p || !t) && !et(this, i, e, p)) return !1
                }
                for (s in l)(o = a[s]) && (f && (o.f ? o.t[o.p](o.s) : o.t[o.p] = o.s, u = !0), o.pg && o.t._kill(l) && (u = !0), o.pg && 0 !== o.t._overwriteProps.length || (o._prev ? o._prev._next = o._next : o === this._firstPT && (this._firstPT = o._next), o._next && (o._next._prev = o._prev), o._next = o._prev = null), delete a[s]), h && (n[s] = 1);
                !this._firstPT && this._initted && c && this._enabled(!1, !1)
            }
        }
        return u
    }, n.invalidate = function () {
        this._notifyPluginsOfEnabled && I._onPluginEvent("_onDisable", this);
        var t = this._time;
        return this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], k.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -v, this.render(t, !1, !1 !== this.vars.lazy)), this
    }, n._enabled = function (t, e) {
        if (y || g.wake(), t && this._gc) {
            var i, r = this._targets;
            if (r)
                for (i = r.length; - 1 < --i;) this._siblings[i] = it(r[i], this, !0);
            else this._siblings = it(this.target, this, !0)
        }
        return k.prototype._enabled.call(this, t, e), !(!this._notifyPluginsOfEnabled || !this._firstPT) && I._onPluginEvent(t ? "_onEnable" : "_onDisable", this)
    }, I.to = function (t, e, i) {
        return new I(t, e, i)
    }, I.from = function (t, e, i) {
        return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new I(t, e, i)
    }, I.fromTo = function (t, e, i, r) {
        return r.startAt = i, r.immediateRender = 0 != r.immediateRender && 0 != i.immediateRender, new I(t, e, r)
    }, I.delayedCall = function (t, e, i, r, n) {
        return new I(e, 0, {
            delay: t,
            onComplete: e,
            onCompleteParams: i,
            callbackScope: r,
            onReverseComplete: e,
            onReverseCompleteParams: i,
            immediateRender: !1,
            lazy: !1,
            useFrames: n,
            overwrite: 0
        })
    }, I.set = function (t, e) {
        return new I(t, 0, e)
    }, I.getTweensOf = function (t, e) {
        if (null == t) return [];
        var i, r, n, s;
        if (t = "string" != typeof t ? t : I.selector(t) || t, (x(t) || M(t)) && "number" != typeof t[0]) {
            for (i = t.length, r = []; - 1 < --i;) r = r.concat(I.getTweensOf(t[i], e));
            for (i = r.length; - 1 < --i;)
                for (s = r[i], n = i; - 1 < --n;) s === r[n] && r.splice(i, 1)
        } else if (t._gsTweenID)
            for (i = (r = it(t).concat()).length; - 1 < --i;)(r[i]._gc || e && !r[i].isActive()) && r.splice(i, 1);
        return r || []
    }, I.killTweensOf = I.killDelayedCallsTo = function (t, e, i) {
        "object" == typeof e && (i = e, e = !1);
        for (var r = I.getTweensOf(t, e), n = r.length; - 1 < --n;) r[n]._kill(i, t)
    };
    var st = T("plugins.TweenPlugin", function (t, e) {
        this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = st.prototype
    }, !0);
    if (n = st.prototype, st.version = "1.19.0", st.API = 2, n._firstPT = null, n._addTween = z, n.setRatio = N, n._kill = function (t) {
            var e, i = this._overwriteProps,
                r = this._firstPT;
            if (null != t[this._propName]) this._overwriteProps = [];
            else
                for (e = i.length; - 1 < --e;) null != t[i[e]] && i.splice(e, 1);
            for (; r;) null != t[r.n] && (r._next && (r._next._prev = r._prev), r._prev ? (r._prev._next = r._next, r._prev = null) : this._firstPT === r && (this._firstPT = r._next)), r = r._next;
            return !1
        }, n._mod = n._roundProps = function (t) {
            for (var e, i = this._firstPT; i;)(e = t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && "function" == typeof e && (2 === i.f ? i.t._applyPT.m = e : i.m = e), i = i._next
        }, I._onPluginEvent = function (t, e) {
            var i, r, n, s, o, a = e._firstPT;
            if ("_onInitAllProps" === t) {
                for (; a;) {
                    for (o = a._next, r = n; r && r.pr > a.pr;) r = r._next;
                    (a._prev = r ? r._prev : s) ? a._prev._next = a: n = a, (a._next = r) ? r._prev = a : s = a, a = o
                }
                a = e._firstPT = n
            }
            for (; a;) a.pg && "function" == typeof a.t[t] && a.t[t]() && (i = !0), a = a._next;
            return i
        }, st.activate = function (t) {
            for (var e = t.length; - 1 < --e;) t[e].API === st.API && (q[(new t[e])._propName] = t[e]);
            return !0
        }, a.plugin = function (t) {
            if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
            var e, i = t.propName,
                r = t.priority || 0,
                n = t.overwriteProps,
                s = {
                    init: "_onInitTween",
                    set: "setRatio",
                    kill: "_kill",
                    round: "_mod",
                    mod: "_mod",
                    initAll: "_onInitAllProps"
                },
                o = T("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function () {
                    st.call(this, i, r), this._overwriteProps = n || []
                }, !0 === t.global),
                a = o.prototype = new st(i);
            for (e in (a.constructor = o).API = t.API, s) "function" == typeof t[e] && (a[s[e]] = t[e]);
            return o.version = t.version, st.activate([o]), o
        }, e = f._gsQueue) {
        for (i = 0; i < e.length; i++) e[i]();
        for (n in C) C[n].func || f.console.log("GSAP encountered missing dependency: " + n)
    }
    y = !1
}("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite"), ((_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window)._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        "use strict";
        _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (p, f, D) {
            function _(t) {
                f.call(this, t);
                var e, i, r = this,
                    n = r.vars;
                for (i in r._labels = {}, r.autoRemoveChildren = !!n.autoRemoveChildren, r.smoothChildTiming = !!n.smoothChildTiming, r._sortChildren = !0, r._onUpdate = n.onUpdate, n) e = n[i], c(e) && -1 !== e.join("").indexOf("{self}") && (n[i] = r._swapSelfInParams(e));
                c(n.tweens) && r.add(n.tweens, 0, n.align, n.stagger)
            }

            function d(t) {
                var e, i = {};
                for (e in t) i[e] = t[e];
                return i
            }

            function m(t, e, i) {
                var r, n, s = t.cycle;
                for (r in s) n = s[r], t[r] = "function" == typeof n ? n(i, e[i], e) : n[i % n.length];
                delete t.cycle
            }

            function l(t, e, i, r) {
                var n = "immediateRender";
                return n in e || (e[n] = !(i && !1 === i[n] || r)), e
            }

            function g(t) {
                if ("function" == typeof t) return t;
                var D = "object" == typeof t ? t : {
                        each: t
                    },
                    _ = D.ease,
                    d = D.from || 0,
                    m = D.base || 0,
                    g = {},
                    y = isNaN(d),
                    v = D.axis,
                    x = {
                        center: .5,
                        end: 1
                    } [d] || 0;
                return function (t, e, i) {
                    var r, n, s, o, a, u, l, h, p, f = (i || D).length,
                        c = g[f];
                    if (!c) {
                        if (!(p = "auto" === D.grid ? 0 : (D.grid || [1 / 0])[0])) {
                            for (l = -1 / 0; l < (l = i[p++].getBoundingClientRect().left) && p < f;);
                            p--
                        }
                        for (c = g[f] = [], r = y ? Math.min(p, f) * x - .5 : d % p, n = y ? f * x / p - .5 : d / p | 0, h = 1 / (l = 0), u = 0; u < f; u++) s = u % p - r, o = n - (u / p | 0), c[u] = a = v ? Math.abs("y" === v ? o : s) : Math.sqrt(s * s + o * o), l < a && (l = a), a < h && (h = a);
                        c.max = l - h, c.min = h, c.v = f = D.amount || D.each * (f < p ? f : v ? "y" === v ? f / p : p : Math.max(p, f / p)) || 0, c.b = f < 0 ? m - f : m
                    }
                    return f = (c[t] - c.min) / c.max, c.b + (_ ? _.getRatio(f) : f) * c.v
                }
            }
            var y = 1e-8,
                t = D._internals,
                e = _._internals = {},
                v = t.isSelector,
                c = t.isArray,
                x = t.lazyTweens,
                C = t.lazyRender,
                o = _gsScope._gsDefine.globals,
                s = e.pauseCallback = function () {},
                i = _.prototype = new f;
            return _.version = "2.1.2", _.distribute = g, i.constructor = _, i.kill()._gc = i._forcingPlayhead = i._hasPause = !1, i.to = function (t, e, i, r) {
                var n = i.repeat && o.TweenMax || D;
                return e ? this.add(new n(t, e, i), r) : this.set(t, i, r)
            }, i.from = function (t, e, i, r) {
                return this.add((i.repeat && o.TweenMax || D).from(t, e, l(0, i)), r)
            }, i.fromTo = function (t, e, i, r, n) {
                var s = r.repeat && o.TweenMax || D;
                return r = l(0, r, i), e ? this.add(s.fromTo(t, e, i, r), n) : this.set(t, r, n)
            }, i.staggerTo = function (t, e, i, r, n, s, o, a) {
                var u, l, h = new _({
                        onComplete: s,
                        onCompleteParams: o,
                        callbackScope: a,
                        smoothChildTiming: this.smoothChildTiming
                    }),
                    p = g(i.stagger || r),
                    f = i.startAt,
                    c = i.cycle;
                for ("string" == typeof t && (t = D.selector(t) || t), v(t = t || []) && (t = function (t) {
                        var e, i = [],
                            r = t.length;
                        for (e = 0; e !== r; i.push(t[e++]));
                        return i
                    }(t)), l = 0; l < t.length; l++) u = d(i), f && (u.startAt = d(f), f.cycle && m(u.startAt, t, l)), c && (m(u, t, l), null != u.duration && (e = u.duration, delete u.duration)), h.to(t[l], e, u, p(l, t[l], t));
                return this.add(h, n)
            }, i.staggerFrom = function (t, e, i, r, n, s, o, a) {
                return i.runBackwards = !0, this.staggerTo(t, e, l(0, i), r, n, s, o, a)
            }, i.staggerFromTo = function (t, e, i, r, n, s, o, a, u) {
                return r.startAt = i, this.staggerTo(t, e, l(0, r, i), n, s, o, a, u)
            }, i.call = function (t, e, i, r) {
                return this.add(D.delayedCall(0, t, e, i), r)
            }, i.set = function (t, e, i) {
                return this.add(new D(t, 0, l(0, e, null, !0)), i)
            }, _.exportRoot = function (t, e) {
                null == (t = t || {}).smoothChildTiming && (t.smoothChildTiming = !0);
                var i, r, n, s, o = new _(t),
                    a = o._timeline;
                for (null == e && (e = !0), a._remove(o, !0), o._startTime = 0, o._rawPrevTime = o._time = o._totalTime = a._time, n = a._first; n;) s = n._next, e && n instanceof D && n.target === n.vars.onComplete || ((r = n._startTime - n._delay) < 0 && (i = 1), o.add(n, r)), n = s;
                return a.add(o, 0), i && o.totalDuration(), o
            }, i.add = function (t, e, i, r) {
                var n, s, o, a, u, l, h = this;
                if ("number" != typeof e && (e = h._parseTimeOrLabel(e, 0, !0, t)), !(t instanceof p)) {
                    if (t instanceof Array || t && t.push && c(t)) {
                        for (i = i || "normal", r = r || 0, n = e, s = t.length, o = 0; o < s; o++) c(a = t[o]) && (a = new _({
                            tweens: a
                        })), h.add(a, n), "string" != typeof a && "function" != typeof a && ("sequence" === i ? n = a._startTime + a.totalDuration() / a._timeScale : "start" === i && (a._startTime -= a.delay())), n += r;
                        return h._uncache(!0)
                    }
                    if ("string" == typeof t) return h.addLabel(t, e);
                    if ("function" != typeof t) throw "Cannot add " + t + " into the timeline; it is not a tween, timeline, function, or string.";
                    t = D.delayedCall(0, t)
                }
                if (f.prototype.add.call(h, t, e), (t._time || !t._duration && t._initted) && (n = (h.rawTime() - t._startTime) * t._timeScale, (!t._duration || 1e-5 < Math.abs(Math.max(0, Math.min(t.totalDuration(), n))) - t._totalTime) && t.render(n, !1, !1)), (h._gc || h._time === h._duration) && !h._paused && h._duration < h.duration())
                    for (l = (u = h).rawTime() > t._startTime; u._timeline;) l && u._timeline.smoothChildTiming ? u.totalTime(u._totalTime, !0) : u._gc && u._enabled(!0, !1), u = u._timeline;
                return h
            }, i.remove = function (t) {
                if (t instanceof p) {
                    this._remove(t, !1);
                    var e = t._timeline = t.vars.useFrames ? p._rootFramesTimeline : p._rootTimeline;
                    return t._startTime = (t._paused ? t._pauseTime : e._time) - (t._reversed ? t.totalDuration() - t._totalTime : t._totalTime) / t._timeScale, this
                }
                if (t instanceof Array || t && t.push && c(t)) {
                    for (var i = t.length; - 1 < --i;) this.remove(t[i]);
                    return this
                }
                return "string" == typeof t ? this.removeLabel(t) : this.kill(null, t)
            }, i._remove = function (t, e) {
                return f.prototype._remove.call(this, t, e), this._last ? this._time > this.duration() && (this._time = this._duration, this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
            }, i.append = function (t, e) {
                return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
            }, i.insert = i.insertMultiple = function (t, e, i, r) {
                return this.add(t, e || 0, i, r)
            }, i.appendMultiple = function (t, e, i, r) {
                return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, r)
            }, i.addLabel = function (t, e) {
                return this._labels[t] = this._parseTimeOrLabel(e), this
            }, i.addPause = function (t, e, i, r) {
                var n = D.delayedCall(0, s, i, r || this);
                return n.vars.onComplete = n.vars.onReverseComplete = e, n.data = "isPause", this._hasPause = !0, this.add(n, t)
            }, i.removeLabel = function (t) {
                return delete this._labels[t], this
            }, i.getLabelTime = function (t) {
                return null != this._labels[t] ? this._labels[t] : -1
            }, i._parseTimeOrLabel = function (t, e, i, r) {
                var n, s;
                if (r instanceof p && r.timeline === this) this.remove(r);
                else if (r && (r instanceof Array || r.push && c(r)))
                    for (s = r.length; - 1 < --s;) r[s] instanceof p && r[s].timeline === this && this.remove(r[s]);
                if (n = "number" != typeof t || e ? 99999999999 < this.duration() ? this.recent().endTime(!1) : this._duration : 0, "string" == typeof e) return this._parseTimeOrLabel(e, i && "number" == typeof t && null == this._labels[e] ? t - n : 0, i);
                if (e = e || 0, "string" != typeof t || !isNaN(t) && null == this._labels[t]) null == t && (t = n);
                else {
                    if (-1 === (s = t.indexOf("="))) return null == this._labels[t] ? i ? this._labels[t] = n + e : e : this._labels[t] + e;
                    e = parseInt(t.charAt(s - 1) + "1", 10) * Number(t.substr(s + 1)), t = 1 < s ? this._parseTimeOrLabel(t.substr(0, s - 1), 0, i) : n
                }
                return Number(t) + e
            }, i.seek = function (t, e) {
                return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), !1 !== e)
            }, i.stop = function () {
                return this.paused(!0)
            }, i.gotoAndPlay = function (t, e) {
                return this.play(t, e)
            }, i.gotoAndStop = function (t, e) {
                return this.pause(t, e)
            }, i.render = function (t, e, i) {
                this._gc && this._enabled(!0, !1);
                var r, n, s, o, a, u, l, h, p = this,
                    f = p._time,
                    c = p._dirty ? p.totalDuration() : p._totalDuration,
                    D = p._startTime,
                    _ = p._timeScale,
                    d = p._paused;
                if (f !== p._time && (t += p._time - f), c - y <= t && 0 <= t) p._totalTime = p._time = c, p._reversed || p._hasPausedChild() || (n = !0, o = "onComplete", a = !!p._timeline.autoRemoveChildren, 0 === p._duration && (t <= 0 && -y <= t || p._rawPrevTime < 0 || p._rawPrevTime === y) && p._rawPrevTime !== t && p._first && (a = !0, p._rawPrevTime > y && (o = "onReverseComplete"))), p._rawPrevTime = p._duration || !e || t || p._rawPrevTime === t ? t : y, t = c + 1e-4;
                else if (t < y)
                    if (p._totalTime = p._time = 0, -y < t && (t = 0), (0 !== f || 0 === p._duration && p._rawPrevTime !== y && (0 < p._rawPrevTime || t < 0 && 0 <= p._rawPrevTime)) && (o = "onReverseComplete", n = p._reversed), t < 0) p._active = !1, p._timeline.autoRemoveChildren && p._reversed ? (a = n = !0, o = "onReverseComplete") : 0 <= p._rawPrevTime && p._first && (a = !0), p._rawPrevTime = t;
                    else {
                        if (p._rawPrevTime = p._duration || !e || t || p._rawPrevTime === t ? t : y, 0 === t && n)
                            for (r = p._first; r && 0 === r._startTime;) r._duration || (n = !1), r = r._next;
                        t = 0, p._initted || (a = !0)
                    }
                else {
                    if (p._hasPause && !p._forcingPlayhead && !e) {
                        if (f <= t)
                            for (r = p._first; r && r._startTime <= t && !u;) r._duration || "isPause" !== r.data || r.ratio || 0 === r._startTime && 0 === p._rawPrevTime || (u = r), r = r._next;
                        else
                            for (r = p._last; r && r._startTime >= t && !u;) r._duration || "isPause" === r.data && 0 < r._rawPrevTime && (u = r), r = r._prev;
                        u && (p._time = p._totalTime = t = u._startTime, h = p._startTime + t / p._timeScale)
                    }
                    p._totalTime = p._time = p._rawPrevTime = t
                }
                if (p._time !== f && p._first || i || a || u) {
                    if (p._initted || (p._initted = !0), p._active || !p._paused && p._time !== f && 0 < t && (p._active = !0), 0 === f && p.vars.onStart && (0 === p._time && p._duration || e || p._callback("onStart")), f <= (l = p._time))
                        for (r = p._first; r && (s = r._next, l === p._time && (!p._paused || d));)(r._active || r._startTime <= l && !r._paused && !r._gc) && (u === r && (p.pause(), p._pauseTime = h), r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)), r = s;
                    else
                        for (r = p._last; r && (s = r._prev, l === p._time && (!p._paused || d));) {
                            if (r._active || r._startTime <= f && !r._paused && !r._gc) {
                                if (u === r) {
                                    for (u = r._prev; u && u.endTime() > p._time;) u.render(u._reversed ? u.totalDuration() - (t - u._startTime) * u._timeScale : (t - u._startTime) * u._timeScale, e, i), u = u._prev;
                                    u = null, p.pause(), p._pauseTime = h
                                }
                                r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)
                            }
                            r = s
                        }
                    p._onUpdate && (e || (x.length && C(), p._callback("onUpdate"))), o && (p._gc || D !== p._startTime && _ === p._timeScale || !(0 === p._time || c >= p.totalDuration()) || (n && (x.length && C(), p._timeline.autoRemoveChildren && p._enabled(!1, !1), p._active = !1), !e && p.vars[o] && p._callback(o)))
                }
            }, i._hasPausedChild = function () {
                for (var t = this._first; t;) {
                    if (t._paused || t instanceof _ && t._hasPausedChild()) return !0;
                    t = t._next
                }
                return !1
            }, i.getChildren = function (t, e, i, r) {
                r = r || -9999999999;
                for (var n = [], s = this._first, o = 0; s;) s._startTime < r || (s instanceof D ? !1 !== e && (n[o++] = s) : (!1 !== i && (n[o++] = s), !1 !== t && (o = (n = n.concat(s.getChildren(!0, e, i))).length))), s = s._next;
                return n
            }, i.getTweensOf = function (t, e) {
                var i, r, n = this._gc,
                    s = [],
                    o = 0;
                for (n && this._enabled(!0, !0), r = (i = D.getTweensOf(t)).length; - 1 < --r;)(i[r].timeline === this || e && this._contains(i[r])) && (s[o++] = i[r]);
                return n && this._enabled(!1, !0), s
            }, i.recent = function () {
                return this._recent
            }, i._contains = function (t) {
                for (var e = t.timeline; e;) {
                    if (e === this) return !0;
                    e = e.timeline
                }
                return !1
            }, i.shiftChildren = function (t, e, i) {
                i = i || 0;
                for (var r, n = this._first, s = this._labels; n;) n._startTime >= i && (n._startTime += t), n = n._next;
                if (e)
                    for (r in s) s[r] >= i && (s[r] += t);
                return this._uncache(!0)
            }, i._kill = function (t, e) {
                if (!t && !e) return this._enabled(!1, !1);
                for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), r = i.length, n = !1; - 1 < --r;) i[r]._kill(t, e) && (n = !0);
                return n
            }, i.clear = function (t) {
                var e = this.getChildren(!1, !0, !0),
                    i = e.length;
                for (this._time = this._totalTime = 0; - 1 < --i;) e[i]._enabled(!1, !1);
                return !1 !== t && (this._labels = {}), this._uncache(!0)
            }, i.invalidate = function () {
                for (var t = this._first; t;) t.invalidate(), t = t._next;
                return p.prototype.invalidate.call(this)
            }, i._enabled = function (t, e) {
                if (t === this._gc)
                    for (var i = this._first; i;) i._enabled(t, !0), i = i._next;
                return f.prototype._enabled.call(this, t, e)
            }, i.totalTime = function (t, e, i) {
                this._forcingPlayhead = !0;
                var r = p.prototype.totalTime.apply(this, arguments);
                return this._forcingPlayhead = !1, r
            }, i.duration = function (t) {
                return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration)
            }, i.totalDuration = function (t) {
                if (arguments.length) return t && this.totalDuration() ? this.timeScale(this._totalDuration / t) : this;
                if (this._dirty) {
                    for (var e, i, r = 0, n = this, s = n._last, o = 999999999999; s;) e = s._prev, s._dirty && s.totalDuration(), s._startTime > o && n._sortChildren && !s._paused && !n._calculatingDuration ? (n._calculatingDuration = 1, n.add(s, s._startTime - s._delay), n._calculatingDuration = 0) : o = s._startTime, s._startTime < 0 && !s._paused && (r -= s._startTime, n._timeline.smoothChildTiming && (n._startTime += s._startTime / n._timeScale, n._time -= s._startTime, n._totalTime -= s._startTime, n._rawPrevTime -= s._startTime), n.shiftChildren(-s._startTime, !1, -9999999999), o = 0), r < (i = s._startTime + s._totalDuration / s._timeScale) && (r = i), s = e;
                    n._duration = n._totalDuration = r, n._dirty = !1
                }
                return this._totalDuration
            }, i.paused = function (t) {
                if (!1 === t && this._paused)
                    for (var e = this._first; e;) e._startTime === this._time && "isPause" === e.data && (e._rawPrevTime = 0), e = e._next;
                return p.prototype.paused.apply(this, arguments)
            }, i.usesFrames = function () {
                for (var t = this._timeline; t._timeline;) t = t._timeline;
                return t === p._rootFramesTimeline
            }, i.rawTime = function (t) {
                return t && (this._paused || this._repeat && 0 < this.time() && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(t) - this._startTime) * this._timeScale
            }, _
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function () {
        "use strict";

        function t() {
            return (_gsScope.GreenSockGlobals || _gsScope).TimelineLite
        }
        "undefined" != typeof module && module.exports ? (require("./TweenLite.min.js"), module.exports = t()) : "function" == typeof define && define.amd && define(["TweenLite"], t)
    }(), ((_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window)._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        "use strict";
        _gsScope._gsDefine("easing.Back", ["easing.Ease"], function (d) {
            function t(t, e) {
                var i = p("easing." + t, function () {}, !0),
                    r = i.prototype = new d;
                return r.constructor = i, r.getRatio = e, i
            }

            function e(t, e, i, r, n) {
                var s = p("easing." + t, {
                    easeOut: new e,
                    easeIn: new i,
                    easeInOut: new r
                }, !0);
                return f(s, t), s
            }

            function m(t, e, i) {
                this.t = t, this.v = e, i && (((this.next = i).prev = this).c = i.v - e, this.gap = i.t - t)
            }

            function i(t, e) {
                var i = p("easing." + t, function (t) {
                        this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1
                    }, !0),
                    r = i.prototype = new d;
                return r.constructor = i, r.getRatio = e, r.config = function (t) {
                    return new i(t)
                }, i
            }
            var r, n, s, o, a = _gsScope.GreenSockGlobals || _gsScope,
                u = a.com.greensock,
                l = 2 * Math.PI,
                h = Math.PI / 2,
                p = u._class,
                f = d.register || function () {},
                c = e("Back", i("BackOut", function (t) {
                    return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
                }), i("BackIn", function (t) {
                    return t * t * ((this._p1 + 1) * t - this._p1)
                }), i("BackInOut", function (t) {
                    return (t *= 2) < 1 ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
                })),
                D = p("easing.SlowMo", function (t, e, i) {
                    e = e || 0 === e ? e : .7, null == t ? t = .7 : 1 < t && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = !0 === i
                }, !0),
                _ = D.prototype = new d;
            return _.constructor = D, _.getRatio = function (t) {
                var e = t + (.5 - t) * this._p;
                return t < this._p1 ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 === t ? 0 : 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
            }, D.ease = new D(.7, .7), _.config = D.config = function (t, e, i) {
                return new D(t, e, i)
            }, (_ = (r = p("easing.SteppedEase", function (t, e) {
                t = t || 1, this._p1 = 1 / t, this._p2 = t + (e ? 0 : 1), this._p3 = e ? 1 : 0
            }, !0)).prototype = new d).constructor = r, _.getRatio = function (t) {
                return t < 0 ? t = 0 : 1 <= t && (t = .999999999), ((this._p2 * t | 0) + this._p3) * this._p1
            }, _.config = r.config = function (t, e) {
                return new r(t, e)
            }, (_ = (n = p("easing.ExpoScaleEase", function (t, e, i) {
                this._p1 = Math.log(e / t), this._p2 = e - t, this._p3 = t, this._ease = i
            }, !0)).prototype = new d).constructor = n, _.getRatio = function (t) {
                return this._ease && (t = this._ease.getRatio(t)), (this._p3 * Math.exp(this._p1 * t) - this._p3) / this._p2
            }, _.config = n.config = function (t, e, i) {
                return new n(t, e, i)
            }, (_ = (s = p("easing.RoughEase", function (t) {
                for (var e, i, r, n, s, o, a = (t = t || {}).taper || "none", u = [], l = 0, h = 0 | (t.points || 20), p = h, f = !1 !== t.randomize, c = !0 === t.clamp, D = t.template instanceof d ? t.template : null, _ = "number" == typeof t.strength ? .4 * t.strength : .4; - 1 < --p;) e = f ? Math.random() : 1 / h * p, i = D ? D.getRatio(e) : e, r = "none" === a ? _ : "out" === a ? (n = 1 - e) * n * _ : "in" === a ? e * e * _ : (n = e < .5 ? 2 * e : 2 * (1 - e)) * n * .5 * _, f ? i += Math.random() * r - .5 * r : p % 2 ? i += .5 * r : i -= .5 * r, c && (1 < i ? i = 1 : i < 0 && (i = 0)), u[l++] = {
                    x: e,
                    y: i
                };
                for (u.sort(function (t, e) {
                        return t.x - e.x
                    }), o = new m(1, 1, null), p = h; - 1 < --p;) s = u[p], o = new m(s.x, s.y, o);
                this._prev = new m(0, 0, 0 !== o.t ? o : o.next)
            }, !0)).prototype = new d).constructor = s, _.getRatio = function (t) {
                var e = this._prev;
                if (t > e.t) {
                    for (; e.next && t >= e.t;) e = e.next;
                    e = e.prev
                } else
                    for (; e.prev && t <= e.t;) e = e.prev;
                return (this._prev = e).v + (t - e.t) / e.gap * e.c
            }, _.config = function (t) {
                return new s(t)
            }, s.ease = new s, e("Bounce", t("BounceOut", function (t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
            }), t("BounceIn", function (t) {
                return (t = 1 - t) < 1 / 2.75 ? 1 - 7.5625 * t * t : t < 2 / 2.75 ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : t < 2.5 / 2.75 ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
            }), t("BounceInOut", function (t) {
                var e = t < .5;
                return t = (t = e ? 1 - 2 * t : 2 * t - 1) < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5
            })), e("Circ", t("CircOut", function (t) {
                return Math.sqrt(1 - (t -= 1) * t)
            }), t("CircIn", function (t) {
                return -(Math.sqrt(1 - t * t) - 1)
            }), t("CircInOut", function (t) {
                return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
            })), e("Elastic", (o = function (t, e, i) {
                var r = p("easing." + t, function (t, e) {
                        this._p1 = 1 <= t ? t : 1, this._p2 = (e || i) / (t < 1 ? t : 1), this._p3 = this._p2 / l * (Math.asin(1 / this._p1) || 0), this._p2 = l / this._p2
                    }, !0),
                    n = r.prototype = new d;
                return n.constructor = r, n.getRatio = e, n.config = function (t, e) {
                    return new r(t, e)
                }, r
            })("ElasticOut", function (t) {
                return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1
            }, .3), o("ElasticIn", function (t) {
                return -this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2)
            }, .3), o("ElasticInOut", function (t) {
                return (t *= 2) < 1 ? this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * -.5 : this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * .5 + 1
            }, .45)), e("Expo", t("ExpoOut", function (t) {
                return 1 - Math.pow(2, -10 * t)
            }), t("ExpoIn", function (t) {
                return Math.pow(2, 10 * (t - 1)) - .001
            }), t("ExpoInOut", function (t) {
                return (t *= 2) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
            })), e("Sine", t("SineOut", function (t) {
                return Math.sin(t * h)
            }), t("SineIn", function (t) {
                return 1 - Math.cos(t * h)
            }), t("SineInOut", function (t) {
                return -.5 * (Math.cos(Math.PI * t) - 1)
            })), p("easing.EaseLookup", {
                find: function (t) {
                    return d.map[t]
                }
            }, !0), f(a.SlowMo, "SlowMo", "ease,"), f(s, "RoughEase", "ease,"), f(r, "SteppedEase", "ease,"), c
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function () {
        "use strict";

        function t() {
            return _gsScope.GreenSockGlobals || _gsScope
        }
        "undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = t()) : "function" == typeof define && define.amd && define(["TweenLite"], t)
    }(), ((_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window)._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        "use strict";

        function o(t, e) {
            var i = "x" === e ? "Width" : "Height",
                r = "scroll" + i,
                n = "client" + i,
                s = document.body;
            return t === l || t === u || t === s ? Math.max(u[r], s[r]) - (l["inner" + i] || u[n] || s[n]) : t[r] - t["offset" + i]
        }

        function a(t, e) {
            var i = "scroll" + ("x" === e ? "Left" : "Top");
            return t === l && (null != t.pageXOffset ? i = "page" + e.toUpperCase() + "Offset" : t = null != u[i] ? u : document.body),
                function () {
                    return t[i]
                }
        }

        function s(t, e) {
            var i = function (t) {
                    return "string" == typeof t && (t = TweenLite.selector(t)), t.length && t !== l && t[0] && t[0].style && !t.nodeType && (t = t[0]), t === l || t.nodeType && t.style ? t : null
                }(t).getBoundingClientRect(),
                r = document.body,
                n = !e || e === l || e === r,
                s = n ? {
                    top: u.clientTop - (window.pageYOffset || u.scrollTop || r.scrollTop || 0),
                    left: u.clientLeft - (window.pageXOffset || u.scrollLeft || r.scrollLeft || 0)
                } : e.getBoundingClientRect(),
                o = {
                    x: i.left - s.left,
                    y: i.top - s.top
                };
            return !n && e && (o.x += a(e, "x")(), o.y += a(e, "y")()), o
        }

        function r(t, e, i, r) {
            var n = typeof t;
            return isNaN(t) ? "string" == n && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + r : "max" === t ? o(e, i) : Math.min(o(e, i), s(t, e)[i]) : parseFloat(t)
        }
        var u = (_gsScope.document || {}).documentElement,
            l = _gsScope,
            h = _gsScope._gsDefine.plugin({
                propName: "scrollTo",
                API: 2,
                global: !0,
                version: "1.9.2",
                init: function (t, e, i) {
                    return this._wdw = t === l, this._target = t, this._tween = i, "object" != typeof e ? "string" == typeof (e = {
                        y: e
                    }).y && "max" !== e.y && "=" !== e.y.charAt(1) && (e.x = e.y) : e.nodeType && (e = {
                        y: e,
                        x: e
                    }), this.vars = e, this._autoKill = !1 !== e.autoKill, this.getX = a(t, "x"), this.getY = a(t, "y"), this.x = this.xPrev = this.getX(), this.y = this.yPrev = this.getY(), null != e.x ? (this._addTween(this, "x", this.x, r(e.x, t, "x", this.x) - (e.offsetX || 0), "scrollTo_x", !0), this._overwriteProps.push("scrollTo_x")) : this.skipX = !0, null != e.y ? (this._addTween(this, "y", this.y, r(e.y, t, "y", this.y) - (e.offsetY || 0), "scrollTo_y", !0), this._overwriteProps.push("scrollTo_y")) : this.skipY = !0, !0
                },
                set: function (t) {
                    this._super.setRatio.call(this, t);
                    var e = this._wdw || !this.skipX ? this.getX() : this.xPrev,
                        i = this._wdw || !this.skipY ? this.getY() : this.yPrev,
                        r = i - this.yPrev,
                        n = e - this.xPrev,
                        s = h.autoKillThreshold;
                    this.x < 0 && (this.x = 0), this.y < 0 && (this.y = 0), this._autoKill && (!this.skipX && (s < n || n < -s) && e < o(this._target, "x") && (this.skipX = !0), !this.skipY && (s < r || r < -s) && i < o(this._target, "y") && (this.skipY = !0), this.skipX && this.skipY && (this._tween.kill(), this.vars.onAutoKill && this.vars.onAutoKill.apply(this.vars.onAutoKillScope || this._tween, this.vars.onAutoKillParams || []))), this._wdw ? l.scrollTo(this.skipX ? e : this.x, this.skipY ? i : this.y) : (this.skipY || (this._target.scrollTop = this.y), this.skipX || (this._target.scrollLeft = this.x)), this.xPrev = this.x, this.yPrev = this.y
                }
            }),
            t = h.prototype;
        h.max = o, h.getOffset = s, h.buildGetter = a, h.autoKillThreshold = 7, t._kill = function (t) {
            return t.scrollTo_x && (this.skipX = !0), t.scrollTo_y && (this.skipY = !0), this._super._kill.call(this, t)
        }
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function () {
        "use strict";

        function t() {
            return (_gsScope.GreenSockGlobals || _gsScope).ScrollToPlugin
        }
        "undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = t()) : "function" == typeof define && define.amd && define(["TweenLite"], t)
    }(),
    function (t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = t || self).window = t.window || {})
    }(this, function (t) {
        "use strict";
        var C = /([\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F)/;

        function Y(t) {
            return i.getComputedStyle(t)
        }

        function l(t, e) {
            var i;
            return n(t) ? t : "string" == (i = typeof t) && !e && t ? s.call(G.querySelectorAll(t), 0) : t && "object" == i && "length" in t ? s.call(t, 0) : t ? [t] : []
        }

        function j(t) {
            return "absolute" === t.position || !0 === t.absolute
        }

        function F(t, e) {
            for (var i, r = e.length; - 1 < --r;)
                if (i = e[r], t.substr(0, i.length) === i) return i.length
        }

        function u(t, e) {
            void 0 === t && (t = "");
            var i = ~t.indexOf("++"),
                r = 1;
            return i && (t = t.split("++").join("")),
                function () {
                    return "<" + e + " style='position:relative;display:inline-block;'" + (t ? " class='" + t + (i ? r++ : "") + "'>" : ">")
                }
        }

        function V(t, e, i) {
            var r = t.nodeType;
            if (1 === r || 9 === r || 11 === r)
                for (t = t.firstChild; t; t = t.nextSibling) V(t, e, i);
            else 3 !== r && 4 !== r || (t.nodeValue = t.nodeValue.split(e).join(i))
        }

        function W(t, e) {
            for (var i = e.length; - 1 < --i;) t.push(e[i])
        }

        function U(t, e, i) {
            for (var r; t && t !== e;) {
                if (r = t._next || t.nextSibling) return r.textContent.charAt(0) === i;
                t = t.parentNode || t._parent
            }
        }

        function q(t) {
            var e, i, r = l(t.childNodes),
                n = r.length;
            for (e = 0; e < n; e++)(i = r[e])._isSplit ? q(i) : (e && 3 === i.previousSibling.nodeType ? i.previousSibling.nodeValue += 3 === i.nodeType ? i.nodeValue : i.firstChild.nodeValue : 3 !== i.nodeType && t.insertBefore(i.firstChild, i), t.removeChild(i))
        }

        function H(t, e) {
            return parseFloat(e[t]) || 0
        }

        function h(t, e, i, r, n, s, o) {
            var a, u, l, h, p, f, c, D, _, d, m, g, y = Y(t),
                v = H("paddingLeft", y),
                x = -999,
                C = H("borderBottomWidth", y) + H("borderTopWidth", y),
                F = H("borderLeftWidth", y) + H("borderRightWidth", y),
                T = H("paddingTop", y) + H("paddingBottom", y),
                w = H("paddingLeft", y) + H("paddingRight", y),
                b = .2 * H("fontSize", y),
                E = y.textAlign,
                P = [],
                O = [],
                S = [],
                A = e.wordDelimiter || " ",
                k = e.tag ? e.tag : e.span ? "span" : "div",
                R = e.type || e.split || "chars,words,lines",
                B = n && ~R.indexOf("lines") ? [] : null,
                M = ~R.indexOf("words"),
                I = ~R.indexOf("chars"),
                N = j(e),
                L = e.linesClass,
                X = ~(L || "").indexOf("++"),
                z = [];
            for (X && (L = L.split("++").join("")), l = (u = t.getElementsByTagName("*")).length, p = [], a = 0; a < l; a++) p[a] = u[a];
            if (B || N)
                for (a = 0; a < l; a++)((f = (h = p[a]).parentNode === t) || N || I && !M) && (g = h.offsetTop, B && f && Math.abs(g - x) > b && ("BR" !== h.nodeName || 0 === a) && (c = [], B.push(c), x = g), N && (h._x = h.offsetLeft, h._y = g, h._w = h.offsetWidth, h._h = h.offsetHeight), B && ((h._isSplit && f || !I && f || M && f || !M && h.parentNode.parentNode === t && !h.parentNode._isSplit) && (c.push(h), h._x -= v, U(h, t, A) && (h._wordEnd = !0)), "BR" === h.nodeName && (h.nextSibling && "BR" === h.nextSibling.nodeName || 0 === a) && B.push([])));
            for (a = 0; a < l; a++) f = (h = p[a]).parentNode === t, "BR" !== h.nodeName ? (N && (_ = h.style, M || f || (h._x += h.parentNode._x, h._y += h.parentNode._y), _.left = h._x + "px", _.top = h._y + "px", _.position = "absolute", _.display = "block", _.width = h._w + 1 + "px", _.height = h._h + "px"), !M && I ? h._isSplit ? (h._next = h.nextSibling, h.parentNode.appendChild(h)) : h.parentNode._isSplit ? (h._parent = h.parentNode, !h.previousSibling && h.firstChild && (h.firstChild._isFirst = !0), h.nextSibling && " " === h.nextSibling.textContent && !h.nextSibling.nextSibling && z.push(h.nextSibling), h._next = h.nextSibling && h.nextSibling._isFirst ? null : h.nextSibling, h.parentNode.removeChild(h), p.splice(a--, 1), l--) : f || (g = !h.nextSibling && U(h.parentNode, t, A), h.parentNode._parent && h.parentNode._parent.appendChild(h), g && h.parentNode.appendChild(G.createTextNode(" ")), "span" === k && (h.style.display = "inline"), P.push(h)) : h.parentNode._isSplit && !h._isSplit && "" !== h.innerHTML ? O.push(h) : I && !h._isSplit && ("span" === k && (h.style.display = "inline"), P.push(h))) : B || N ? (h.parentNode && h.parentNode.removeChild(h), p.splice(a--, 1), l--) : M || t.appendChild(h);
            for (a = z.length; - 1 < --a;) z[a].parentNode.removeChild(z[a]);
            if (B) {
                for (N && (d = G.createElement(k), t.appendChild(d), m = d.offsetWidth + "px", g = d.offsetParent === t ? 0 : t.offsetLeft, t.removeChild(d)), _ = t.style.cssText, t.style.cssText = "display:none;"; t.firstChild;) t.removeChild(t.firstChild);
                for (D = " " === A && (!N || !M && !I), a = 0; a < B.length; a++) {
                    for (c = B[a], (d = G.createElement(k)).style.cssText = "display:block;text-align:" + E + ";position:" + (N ? "absolute;" : "relative;"), L && (d.className = L + (X ? a + 1 : "")), S.push(d), l = c.length, u = 0; u < l; u++) "BR" !== c[u].nodeName && (h = c[u], d.appendChild(h), D && h._wordEnd && d.appendChild(G.createTextNode(" ")), N && (0 === u && (d.style.top = h._y + "px", d.style.left = v + g + "px"), h.style.top = "0px", g && (h.style.left = h._x - g + "px")));
                    0 === l ? d.innerHTML = "&nbsp;" : M || I || (q(d), V(d, String.fromCharCode(160), " ")), N && (d.style.width = m, d.style.height = h._h + "px"), t.appendChild(d)
                }
                t.style.cssText = _
            }
            N && (o > t.clientHeight && (t.style.height = o - T + "px", t.clientHeight < o && (t.style.height = o + C + "px")), s > t.clientWidth && (t.style.width = s - w + "px", t.clientWidth < s && (t.style.width = s + F + "px"))), W(i, P), M && W(r, O), W(n, S)
        }

        function p(t, e, i, r) {
            var n, s, o = l(t.childNodes),
                a = o.length,
                u = j(e);
            if (3 !== t.nodeType || 1 < a) {
                for (e.absolute = !1, n = 0; n < a; n++) 3 === (s = o[n]).nodeType && !/\S+/.test(s.nodeValue) || (u && 3 !== s.nodeType && "inline" === Y(s).display && (s.style.display = "inline-block", s.style.position = "relative"), s._isSplit = !0, p(s, e, i, r));
                return e.absolute = u, void(t._isSplit = !0)
            }! function (t, e, i, r) {
                var n, s, o, a, u, l, h, p, f = e.tag ? e.tag : e.span ? "span" : "div",
                    c = ~(e.type || e.split || "chars,words,lines").indexOf("chars"),
                    D = j(e),
                    _ = e.wordDelimiter || " ",
                    d = " " !== _ ? "" : D ? "&#173; " : " ",
                    m = "</" + f + ">",
                    g = 1,
                    y = e.specialChars ? "function" == typeof e.specialChars ? e.specialChars : F : null,
                    v = G.createElement("div"),
                    x = t.parentNode;
                for (x.insertBefore(v, t), v.textContent = t.nodeValue, x.removeChild(t), h = -1 !== (n = function t(e) {
                        var i = e.nodeType,
                            r = "";
                        if (1 === i || 9 === i || 11 === i) {
                            if ("string" == typeof e.textContent) return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling) r += t(e)
                        } else if (3 === i || 4 === i) return e.nodeValue;
                        return r
                    }(t = v)).indexOf("<"), !1 !== e.reduceWhiteSpace && (n = n.replace(w, " ").replace(T, "")), h && (n = n.split("<").join("{{LT}}")), u = n.length, s = (" " === n.charAt(0) ? d : "") + i(), o = 0; o < u; o++)
                    if (l = n.charAt(o), y && (p = y(n.substr(o), e.specialChars))) l = n.substr(o, p || 1), s += c && " " !== l ? r() + l + "</" + f + ">" : l, o += p - 1;
                    else if (l === _ && n.charAt(o - 1) !== _ && o) {
                    for (s += g ? m : "", g = 0; n.charAt(o + 1) === _;) s += d, o++;
                    o === u - 1 ? s += d : ")" !== n.charAt(o + 1) && (s += d + i(), g = 1)
                } else "{" === l && "{{LT}}" === n.substr(o, 6) ? (s += c ? r() + "{{LT}}</" + f + ">" : "{{LT}}", o += 5) : 55296 <= l.charCodeAt(0) && l.charCodeAt(0) <= 56319 || 65024 <= n.charCodeAt(o + 1) && n.charCodeAt(o + 1) <= 65039 ? (a = ((n.substr(o, 12).split(C) || [])[1] || "").length || 2, s += c && " " !== l ? r() + n.substr(o, a) + "</" + f + ">" : n.substr(o, a), o += a - 1) : s += c && " " !== l ? r() + l + "</" + f + ">" : l;
                t.outerHTML = s + (g ? m : ""), h && V(x, "{{LT}}", "<")
            }(t, e, i, r)
        }
        var G, i, r, e, T = /(?:\r|\n|\t\t)/g,
            w = /(?:\s\s+)/g,
            n = Array.isArray,
            s = [].slice,
            o = ((e = a.prototype).split = function (t) {
                this.isSplit && this.revert(), this.vars = t = t || this.vars, this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
                for (var e, i, r, n = this.elements.length, s = t.tag ? t.tag : t.span ? "span" : "div", o = u(t.wordsClass, s), a = u(t.charsClass, s); - 1 < --n;) r = this.elements[n], this._originals[n] = r.innerHTML, e = r.clientHeight, i = r.clientWidth, p(r, t, o, a), h(r, t, this.chars, this.words, this.lines, i, e);
                return this.chars.reverse(), this.words.reverse(), this.lines.reverse(), this.isSplit = !0, this
            }, e.revert = function () {
                var i = this._originals;
                if (!i) throw "revert() call wasn't scoped properly.";
                return this.elements.forEach(function (t, e) {
                    return t.innerHTML = i[e]
                }), this.chars = [], this.words = [], this.lines = [], this.isSplit = !1, this
            }, a.create = function (t, e) {
                return new a(t, e)
            }, a);

        function a(t, e) {
            r || (G = document, i = window, r = 1), this.elements = l(t), this.chars = [], this.words = [], this.lines = [], this._originals = [], this.vars = e || {}, this.split(e)
        }
        o.version = "3.0.0", t.SplitText = o, t.default = o, Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }), ((_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window)._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        "use strict";
        _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (s, z) {
            var D, T, w, _, Y = function () {
                    s.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = Y.prototype.setRatio
                },
                l = _gsScope._gsDefine.globals,
                d = {},
                t = Y.prototype = new s("css");
            (t.constructor = Y).version = "2.1.0", Y.API = 2, Y.defaultTransformPerspective = 0, Y.defaultSkewType = "compensated", Y.defaultSmoothOrigin = !0, t = "px", Y.suffixMap = {
                top: t,
                right: t,
                bottom: t,
                left: t,
                width: t,
                height: t,
                fontSize: t,
                padding: t,
                margin: t,
                perspective: t,
                lineHeight: ""
            };

            function o(t, e) {
                return e.toUpperCase()
            }

            function a(t, e) {
                return e && et.createElementNS ? et.createElementNS(e, t) : et.createElement(t)
            }

            function u(t) {
                return X.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
            }

            function m(t) {
                _gsScope.console && console.log(t)
            }

            function b(t, e) {
                var i, r, n = (e = e || it).style;
                if (void 0 !== n[t]) return t;
                for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], r = 5; - 1 < --r && void 0 === n[i[r] + t];);
                return 0 <= r ? (at = "-" + (ut = 3 === r ? "ms" : i[r]).toLowerCase() + "-", ut + t) : null
            }

            function g(t) {
                return lt.getComputedStyle(t)
            }

            function y(t, e) {
                var i, r, n, s = {};
                if (e = e || g(t))
                    if (i = e.length)
                        for (; - 1 < --i;) - 1 !== (n = e[i]).indexOf("-transform") && Xt !== n || (s[n.replace(U, o)] = e.getPropertyValue(n));
                    else
                        for (i in e) - 1 !== i.indexOf("Transform") && Lt !== i || (s[i] = e[i]);
                else if (e = t.currentStyle || t.style)
                    for (i in e) "string" == typeof i && void 0 === s[i] && (s[i.replace(U, o)] = e[i]);
                return ot || (s.opacity = u(t)), r = Zt(t, e, !1), s.rotation = r.rotation, s.skewX = r.skewX, s.scaleX = r.scaleX, s.scaleY = r.scaleY, s.x = r.x, s.y = r.y, Yt && (s.z = r.z, s.rotationX = r.rotationX, s.rotationY = r.rotationY, s.scaleZ = r.scaleZ), s.filters && delete s.filters, s
            }

            function v(t, e, i, r, n) {
                var s, o, a, u = {},
                    l = t.style;
                for (o in i) "cssText" !== o && "length" !== o && isNaN(o) && (e[o] !== (s = i[o]) || n && n[o]) && -1 === o.indexOf("Origin") && ("number" == typeof s || "string" == typeof s) && (u[o] = "auto" !== s || "left" !== o && "top" !== o ? "" !== s && "auto" !== s && "none" !== s || "string" != typeof e[o] || "" === e[o].replace(h, "") ? s : 0 : ft(t, o), void 0 !== l[o] && (a = new Ct(l, o, l[o], a)));
                if (r)
                    for (o in r) "className" !== o && (u[o] = r[o]);
                return {
                    difs: u,
                    firstMPT: a
                }
            }

            function x(t, e, i) {
                if ("svg" === (t.nodeName + "").toLowerCase()) return (i || g(t))[e] || 0;
                if (t.getCTM && Ht(t)) return t.getBBox()[e] || 0;
                var r = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight),
                    n = ct[e],
                    s = n.length;
                for (i = i || g(t); - 1 < --s;) r -= parseFloat(ht(t, "padding" + n[s], i, !0)) || 0, r -= parseFloat(ht(t, "border" + n[s] + "Width", i, !0)) || 0;
                return r
            }

            function E(t, e) {
                return "function" == typeof t && (t = t(B, R)), "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e) || 0
            }

            function P(t, e) {
                "function" == typeof t && (t = t(B, R));
                var i = "string" == typeof t && "=" === t.charAt(1);
                return "string" == typeof t && "v" === t.charAt(t.length - 2) && (t = (i ? t.substr(0, 2) : 0) + window["inner" + ("vh" === t.substr(-2) ? "Height" : "Width")] * (parseFloat(i ? t.substr(2) : t) / 100)), null == t ? e : i ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t) || 0
            }

            function O(t, e, i, r) {
                var n, s, o, a, u;
                return "function" == typeof t && (t = t(B, R)), (a = null == t ? e : "number" == typeof t ? t : (n = 360, s = t.split("_"), o = ((u = "=" === t.charAt(1)) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(s[0].substr(2)) : parseFloat(s[0])) * (-1 === t.indexOf("rad") ? 1 : J) - (u ? 0 : e), s.length && (r && (r[i] = e + o), -1 !== t.indexOf("short") && ((o %= n) !== o % 180 && (o = o < 0 ? o + n : o - n)), -1 !== t.indexOf("_cw") && o < 0 ? o = (o + 3599999999640) % n - (o / n | 0) * n : -1 !== t.indexOf("ccw") && 0 < o && (o = (o - 3599999999640) % n - (o / n | 0) * n)), e + o)) < 1e-6 && -1e-6 < a && (a = 0), a
            }

            function c(t, e, i) {
                return 255 * (6 * (t = t < 0 ? t + 1 : 1 < t ? t - 1 : t) < 1 ? e + (i - e) * t * 6 : t < .5 ? i : 3 * t < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) + .5 | 0
            }

            function r(t, e) {
                var i, r, n, s = t.match(gt) || [],
                    o = 0,
                    a = "";
                if (!s.length) return t;
                for (i = 0; i < s.length; i++) r = s[i], o += (n = t.substr(o, t.indexOf(r, o) - o)).length + r.length, 3 === (r = mt(r, e)).length && r.push(1), a += n + (e ? "hsla(" + r[0] + "," + r[1] + "%," + r[2] + "%," + r[3] : "rgba(" + r.join(",")) + ")";
                return a + t.substr(o)
            }
            var S, C, F, j, A, k, R, B, e, i, M = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
                I = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                N = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                h = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                L = /(?:\d|\-|\+|=|#|\.)*/g,
                X = /opacity *= *([^)]*)/i,
                V = /opacity:([^;]*)/i,
                p = /alpha\(opacity *=.+?\)/i,
                W = /^(rgb|hsl)/,
                f = /([A-Z])/g,
                U = /-([a-z])/gi,
                q = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                H = /(?:Left|Right|Width)/i,
                G = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                Q = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                Z = /,(?=[^\)]*(?:\(|$))/gi,
                $ = /[\s,\(]/i,
                K = Math.PI / 180,
                J = 180 / Math.PI,
                tt = {},
                n = {
                    style: {}
                },
                et = _gsScope.document || {
                    createElement: function () {
                        return n
                    }
                },
                it = a("div"),
                rt = a("img"),
                nt = Y._internals = {
                    _specialProps: d
                },
                st = (_gsScope.navigator || {}).userAgent || "",
                ot = (e = st.indexOf("Android"), i = a("a"), F = -1 !== st.indexOf("Safari") && -1 === st.indexOf("Chrome") && (-1 === e || 3 < parseFloat(st.substr(e + 8, 2))), A = F && parseFloat(st.substr(st.indexOf("Version/") + 8, 2)) < 6, j = -1 !== st.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(st) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(st)) && (k = parseFloat(RegExp.$1)), !!i && (i.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(i.style.opacity))),
                at = "",
                ut = "",
                lt = "undefined" != typeof window ? window : et.defaultView || {
                    getComputedStyle: function () {}
                },
                ht = Y.getStyle = function (t, e, i, r, n) {
                    var s;
                    return ot || "opacity" !== e ? (!r && t.style[e] ? s = t.style[e] : (i = i || g(t)) ? s = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(f, "-$1").toLowerCase()) : t.currentStyle && (s = t.currentStyle[e]), null == n || s && "none" !== s && "auto" !== s && "auto auto" !== s ? s : n) : u(t)
                },
                pt = nt.convertToPixels = function (t, e, i, r, n) {
                    if ("px" === r || !r && "lineHeight" !== e) return i;
                    if ("auto" === r || !i) return 0;
                    var s, o, a, u = H.test(e),
                        l = t,
                        h = it.style,
                        p = i < 0,
                        f = 1 === i;
                    if (p && (i = -i), f && (i *= 100), "lineHeight" !== e || r)
                        if ("%" === r && -1 !== e.indexOf("border")) s = i / 100 * (u ? t.clientWidth : t.clientHeight);
                        else {
                            if (h.cssText = "border:0 solid red;position:" + ht(t, "position") + ";line-height:0;", "%" !== r && l.appendChild && "v" !== r.charAt(0) && "rem" !== r) h[u ? "borderLeftWidth" : "borderTopWidth"] = i + r;
                            else {
                                if (l = t.parentNode || et.body, -1 !== ht(l, "display").indexOf("flex") && (h.position = "absolute"), o = l._gsCache, a = z.ticker.frame, o && u && o.time === a) return o.width * i / 100;
                                h[u ? "width" : "height"] = i + r
                            }
                            l.appendChild(it), s = parseFloat(it[u ? "offsetWidth" : "offsetHeight"]), l.removeChild(it), u && "%" === r && !1 !== Y.cacheWidths && ((o = l._gsCache = l._gsCache || {}).time = a, o.width = s / i * 100), 0 !== s || n || (s = pt(t, e, i, r, !0))
                        }
                    else o = g(t).lineHeight, t.style.lineHeight = i, s = parseFloat(g(t).lineHeight), t.style.lineHeight = o;
                    return f && (s /= 100), p ? -s : s
                },
                ft = nt.calculateOffset = function (t, e, i) {
                    if ("absolute" !== ht(t, "position", i)) return 0;
                    var r = "left" === e ? "Left" : "Top",
                        n = ht(t, "margin" + r, i);
                    return t["offset" + r] - (pt(t, e, parseFloat(n), n.replace(L, "")) || 0)
                },
                ct = {
                    width: ["Left", "Right"],
                    height: ["Top", "Bottom"]
                },
                Dt = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                _t = function (t, e) {
                    if ("contain" === t || "auto" === t || "auto auto" === t) return t + " ";
                    null != t && "" !== t || (t = "0 0");
                    var i, r = t.split(" "),
                        n = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : r[0],
                        s = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : r[1];
                    if (3 < r.length && !e) {
                        for (r = t.split(", ").join(",").split(","), t = [], i = 0; i < r.length; i++) t.push(_t(r[i]));
                        return t.join(",")
                    }
                    return null == s ? s = "center" === n ? "50%" : "0" : "center" === s && (s = "50%"), ("center" === n || isNaN(parseFloat(n)) && -1 === (n + "").indexOf("=")) && (n = "50%"), t = n + " " + s + (2 < r.length ? " " + r[2] : ""), e && (e.oxp = -1 !== n.indexOf("%"), e.oyp = -1 !== s.indexOf("%"), e.oxr = "=" === n.charAt(1), e.oyr = "=" === s.charAt(1), e.ox = parseFloat(n.replace(h, "")), e.oy = parseFloat(s.replace(h, "")), e.v = t), e || t
                },
                dt = {
                    aqua: [0, 255, 255],
                    lime: [0, 255, 0],
                    silver: [192, 192, 192],
                    black: [0, 0, 0],
                    maroon: [128, 0, 0],
                    teal: [0, 128, 128],
                    blue: [0, 0, 255],
                    navy: [0, 0, 128],
                    white: [255, 255, 255],
                    fuchsia: [255, 0, 255],
                    olive: [128, 128, 0],
                    yellow: [255, 255, 0],
                    orange: [255, 165, 0],
                    gray: [128, 128, 128],
                    purple: [128, 0, 128],
                    green: [0, 128, 0],
                    red: [255, 0, 0],
                    pink: [255, 192, 203],
                    cyan: [0, 255, 255],
                    transparent: [255, 255, 255, 0]
                },
                mt = Y.parseColor = function (t, e) {
                    var i, r, n, s, o, a, u, l, h, p, f;
                    if (t)
                        if ("number" == typeof t) i = [t >> 16, t >> 8 & 255, 255 & t];
                        else {
                            if ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), dt[t]) i = dt[t];
                            else if ("#" === t.charAt(0)) 4 === t.length && (t = "#" + (r = t.charAt(1)) + r + (n = t.charAt(2)) + n + (s = t.charAt(3)) + s), i = [(t = parseInt(t.substr(1), 16)) >> 16, t >> 8 & 255, 255 & t];
                            else if ("hsl" === t.substr(0, 3))
                                if (i = f = t.match(M), e) {
                                    if (-1 !== t.indexOf("=")) return t.match(I)
                                } else o = Number(i[0]) % 360 / 360, a = Number(i[1]) / 100, r = 2 * (u = Number(i[2]) / 100) - (n = u <= .5 ? u * (a + 1) : u + a - u * a), 3 < i.length && (i[3] = Number(i[3])), i[0] = c(o + 1 / 3, r, n), i[1] = c(o, r, n), i[2] = c(o - 1 / 3, r, n);
                            else i = t.match(M) || dt.transparent;
                            i[0] = Number(i[0]), i[1] = Number(i[1]), i[2] = Number(i[2]), 3 < i.length && (i[3] = Number(i[3]))
                        }
                    else i = dt.black;
                    return e && !f && (r = i[0] / 255, n = i[1] / 255, s = i[2] / 255, u = ((l = Math.max(r, n, s)) + (h = Math.min(r, n, s))) / 2, l === h ? o = a = 0 : (p = l - h, a = .5 < u ? p / (2 - l - h) : p / (l + h), o = l === r ? (n - s) / p + (n < s ? 6 : 0) : l === n ? (s - r) / p + 2 : (r - n) / p + 4, o *= 60), i[0] = o + .5 | 0, i[1] = 100 * a + .5 | 0, i[2] = 100 * u + .5 | 0), i
                },
                gt = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
            for (t in dt) gt += "|" + t + "\\b";
            gt = new RegExp(gt + ")", "gi"), Y.colorStringFilter = function (t) {
                var e, i = t[0] + " " + t[1];
                gt.test(i) && (e = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla("), t[0] = r(t[0], e), t[1] = r(t[1], e)), gt.lastIndex = 0
            }, z.defaultStringFilter || (z.defaultStringFilter = Y.colorStringFilter);

            function yt(t, e, s, o) {
                if (null == t) return function (t) {
                    return t
                };
                var a, u = e ? (t.match(gt) || [""])[0] : "",
                    l = t.split(u).join("").match(N) || [],
                    h = t.substr(0, t.indexOf(l[0])),
                    p = ")" === t.charAt(t.length - 1) ? ")" : "",
                    f = -1 !== t.indexOf(" ") ? " " : ",",
                    c = l.length,
                    D = 0 < c ? l[0].replace(M, "") : "";
                return c ? a = e ? function (t) {
                    var e, i, r, n;
                    if ("number" == typeof t) t += D;
                    else if (o && Z.test(t)) {
                        for (n = t.replace(Z, "|").split("|"), r = 0; r < n.length; r++) n[r] = a(n[r]);
                        return n.join(",")
                    }
                    if (e = (t.match(gt) || [u])[0], r = (i = t.split(e).join("").match(N) || []).length, c > r--)
                        for (; ++r < c;) i[r] = s ? i[(r - 1) / 2 | 0] : l[r];
                    return h + i.join(f) + f + e + p + (-1 !== t.indexOf("inset") ? " inset" : "")
                } : function (t) {
                    var e, i, r;
                    if ("number" == typeof t) t += D;
                    else if (o && Z.test(t)) {
                        for (i = t.replace(Z, "|").split("|"), r = 0; r < i.length; r++) i[r] = a(i[r]);
                        return i.join(",")
                    }
                    if (r = (e = t.match(N) || []).length, c > r--)
                        for (; ++r < c;) e[r] = s ? e[(r - 1) / 2 | 0] : l[r];
                    return h + e.join(f) + p
                } : function (t) {
                    return t
                }
            }

            function vt(l) {
                return l = l.split(","),
                    function (t, e, i, r, n, s, o) {
                        var a, u = (e + "").split(" ");
                        for (o = {}, a = 0; a < 4; a++) o[l[a]] = u[a] = u[a] || u[(a - 1) / 2 >> 0];
                        return r.parse(t, o, n, s)
                    }
            }

            function xt(t, e, i, r, n, s) {
                var o = new Ft(t, e, i, r - i, n, -1, s);
                return o.b = i, o.e = o.xs0 = r, o
            }
            var Ct = (nt._setPluginRatio = function (t) {
                    this.plugin.setRatio(t);
                    for (var e, i, r, n, s, o = this.data, a = o.proxy, u = o.firstMPT; u;) e = a[u.v], u.r ? e = u.r(e) : e < 1e-6 && -1e-6 < e && (e = 0), u.t[u.p] = e, u = u._next;
                    if (o.autoRotate && (o.autoRotate.rotation = o.mod ? o.mod.call(this._tween, a.rotation, this.t, this._tween) : a.rotation), 1 === t || 0 === t)
                        for (u = o.firstMPT, s = 1 === t ? "e" : "b"; u;) {
                            if ((i = u.t).type) {
                                if (1 === i.type) {
                                    for (n = i.xs0 + i.s + i.xs1, r = 1; r < i.l; r++) n += i["xn" + r] + i["xs" + (r + 1)];
                                    i[s] = n
                                }
                            } else i[s] = i.s + i.xs0;
                            u = u._next
                        }
                }, function (t, e, i, r, n) {
                    this.t = t, this.p = e, this.v = i, this.r = n, r && ((r._prev = this)._next = r)
                }),
                Ft = (nt._parseToProxy = function (t, e, i, r, n, s) {
                    var o, a, u, l, h, p = r,
                        f = {},
                        c = {},
                        D = i._transform,
                        _ = tt;
                    for (i._transform = null, tt = e, r = h = i.parse(t, e, r, n), tt = _, s && (i._transform = D, p && (p._prev = null, p._prev && (p._prev._next = null))); r && r !== p;) {
                        if (r.type <= 1 && (c[a = r.p] = r.s + r.c, f[a] = r.s, s || (l = new Ct(r, "s", a, l, r.r), r.c = 0), 1 === r.type))
                            for (o = r.l; 0 < --o;) u = "xn" + o, c[a = r.p + "_" + u] = r.data[u], f[a] = r[u], s || (l = new Ct(r, u, a, l, r.rxp[u]));
                        r = r._next
                    }
                    return {
                        proxy: f,
                        end: c,
                        firstMPT: l,
                        pt: h
                    }
                }, nt.CSSPropTween = function (t, e, i, r, n, s, o, a, u, l, h) {
                    this.t = t, this.p = e, this.s = i, this.c = r, this.n = o || e, t instanceof Ft || _.push(this.n), this.r = a ? "function" == typeof a ? a : Math.round : a, this.type = s || 0, u && (this.pr = u, D = !0), this.b = void 0 === l ? i : l, this.e = void 0 === h ? i + r : h, n && ((this._next = n)._prev = this)
                }),
                Tt = Y.parseComplex = function (t, e, i, r, n, s, o, a, u, l) {
                    i = i || s || "", "function" == typeof r && (r = r(B, R)), o = new Ft(t, e, 0, 0, o, l ? 2 : 1, null, !1, a, i, r), r += "", n && gt.test(r + i) && (r = [i, r], Y.colorStringFilter(r), i = r[0], r = r[1]);
                    var h, p, f, c, D, _, d, m, g, y, v, x, C, F = i.split(", ").join(",").split(" "),
                        T = r.split(", ").join(",").split(" "),
                        w = F.length,
                        b = !1 !== S;
                    for (-1 === r.indexOf(",") && -1 === i.indexOf(",") || (T = -1 !== (r + i).indexOf("rgb") || -1 !== (r + i).indexOf("hsl") ? (F = F.join(" ").replace(Z, ", ").split(" "), T.join(" ").replace(Z, ", ").split(" ")) : (F = F.join(" ").split(",").join(", ").split(" "), T.join(" ").split(",").join(", ").split(" ")), w = F.length), w !== T.length && (w = (F = (s || "").split(" ")).length), o.plugin = u, o.setRatio = l, h = gt.lastIndex = 0; h < w; h++)
                        if (c = F[h], D = T[h] + "", (m = parseFloat(c)) || 0 === m) o.appendXtra("", m, E(D, m), D.replace(I, ""), b && -1 !== D.indexOf("px") && Math.round, !0);
                        else if (n && gt.test(c)) x = ")" + ((x = D.indexOf(")") + 1) ? D.substr(x) : ""), C = -1 !== D.indexOf("hsl") && ot, y = D, c = mt(c, C), D = mt(D, C), (g = 6 < c.length + D.length) && !ot && 0 === D[3] ? (o["xs" + o.l] += o.l ? " transparent" : "transparent", o.e = o.e.split(T[h]).join("transparent")) : (ot || (g = !1), C ? o.appendXtra(y.substr(0, y.indexOf("hsl")) + (g ? "hsla(" : "hsl("), c[0], E(D[0], c[0]), ",", !1, !0).appendXtra("", c[1], E(D[1], c[1]), "%,", !1).appendXtra("", c[2], E(D[2], c[2]), g ? "%," : "%" + x, !1) : o.appendXtra(y.substr(0, y.indexOf("rgb")) + (g ? "rgba(" : "rgb("), c[0], D[0] - c[0], ",", Math.round, !0).appendXtra("", c[1], D[1] - c[1], ",", Math.round).appendXtra("", c[2], D[2] - c[2], g ? "," : x, Math.round), g && (c = c.length < 4 ? 1 : c[3], o.appendXtra("", c, (D.length < 4 ? 1 : D[3]) - c, x, !1))), gt.lastIndex = 0;
                    else if (_ = c.match(M)) {
                        if (!(d = D.match(I)) || d.length !== _.length) return o;
                        for (p = f = 0; p < _.length; p++) v = _[p], y = c.indexOf(v, f), o.appendXtra(c.substr(f, y - f), Number(v), E(d[p], v), "", b && "px" === c.substr(y + v.length, 2) && Math.round, 0 === p), f = y + v.length;
                        o["xs" + o.l] += c.substr(f)
                    } else o["xs" + o.l] += o.l || o["xs" + o.l] ? " " + D : D;
                    if (-1 !== r.indexOf("=") && o.data) {
                        for (x = o.xs0 + o.data.s, h = 1; h < o.l; h++) x += o["xs" + h] + o.data["xn" + h];
                        o.e = x + o["xs" + h]
                    }
                    return o.l || (o.type = -1, o.xs0 = o.e), o.xfirst || o
                },
                wt = 9;
            for ((t = Ft.prototype).l = t.pr = 0; 0 < --wt;) t["xn" + wt] = 0, t["xs" + wt] = "";
            t.xs0 = "", t._next = t._prev = t.xfirst = t.data = t.plugin = t.setRatio = t.rxp = null, t.appendXtra = function (t, e, i, r, n, s) {
                var o = this,
                    a = o.l;
                return o["xs" + a] += s && (a || o["xs" + a]) ? " " + t : t || "", i || 0 === a || o.plugin ? (o.l++, o.type = o.setRatio ? 2 : 1, o["xs" + o.l] = r || "", 0 < a ? (o.data["xn" + a] = e + i, o.rxp["xn" + a] = n, o["xn" + a] = e, o.plugin || (o.xfirst = new Ft(o, "xn" + a, e, i, o.xfirst || o, 0, o.n, n, o.pr), o.xfirst.xs0 = 0)) : (o.data = {
                    s: e + i
                }, o.rxp = {}, o.s = e, o.c = i, o.r = n)) : o["xs" + a] += e + (r || ""), o
            };

            function bt(t, e) {
                e = e || {}, this.p = e.prefix && b(t) || t, d[t] = d[this.p] = this, this.format = e.formatter || yt(e.defaultValue, e.color, e.collapsible, e.multi), e.parser && (this.parse = e.parser), this.clrs = e.color, this.multi = e.multi, this.keyword = e.keyword, this.dflt = e.defaultValue, this.allowFunc = e.allowFunc, this.pr = e.priority || 0
            }
            var Et = nt._registerComplexSpecialProp = function (t, e, i) {
                    "object" != typeof e && (e = {
                        parser: i
                    });
                    var r, n = t.split(","),
                        s = e.defaultValue;
                    for (i = i || [s], r = 0; r < n.length; r++) e.prefix = 0 === r && e.prefix, e.defaultValue = i[r] || s, new bt(n[r], e)
                },
                Pt = nt._registerPluginProp = function (t) {
                    if (!d[t]) {
                        var u = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                        Et(t, {
                            parser: function (t, e, i, r, n, s, o) {
                                var a = l.com.greensock.plugins[u];
                                return a ? (a._cssRegister(), d[i].parse(t, e, i, r, n, s, o)) : (m("Error: " + u + " js file not loaded."), n)
                            }
                        })
                    }
                };
            (t = bt.prototype).parseComplex = function (t, e, i, r, n, s) {
                var o, a, u, l, h, p, f = this.keyword;
                if (this.multi && (Z.test(i) || Z.test(e) ? (a = e.replace(Z, "|").split("|"), u = i.replace(Z, "|").split("|")) : f && (a = [e], u = [i])), u) {
                    for (l = u.length > a.length ? u.length : a.length, o = 0; o < l; o++) e = a[o] = a[o] || this.dflt, i = u[o] = u[o] || this.dflt, f && ((h = e.indexOf(f)) !== (p = i.indexOf(f)) && (-1 === p ? a[o] = a[o].split(f).join("") : -1 === h && (a[o] += " " + f)));
                    e = a.join(", "), i = u.join(", ")
                }
                return Tt(t, this.p, e, i, this.clrs, this.dflt, r, this.pr, n, s)
            }, t.parse = function (t, e, i, r, n, s, o) {
                return this.parseComplex(t.style, this.format(ht(t, this.p, w, !1, this.dflt)), this.format(e), n, s)
            }, Y.registerSpecialProp = function (t, u, l) {
                Et(t, {
                    parser: function (t, e, i, r, n, s, o) {
                        var a = new Ft(t, i, 0, 0, n, 2, i, !1, l);
                        return a.plugin = s, a.setRatio = u(t, e, r._tween, i), a
                    },
                    priority: l
                })
            }, Y.useSVGTransformAttr = !0;

            function Ot(t, e, i) {
                var r, n = et.createElementNS("http://www.w3.org/2000/svg", t),
                    s = /([a-z])([A-Z])/g;
                for (r in i) n.setAttributeNS(null, r.replace(s, "$1-$2").toLowerCase(), i[r]);
                return e.appendChild(n), n
            }

            function St(t, e, i, r, n, s) {
                var o, a, u, l, h, p, f, c, D, _, d, m, g, y, v = t._gsTransform,
                    x = Qt(t, !0);
                v && (g = v.xOrigin, y = v.yOrigin), (!r || (o = r.split(" ")).length < 2) && (0 === (f = t.getBBox()).x && 0 === f.y && f.width + f.height === 0 && (f = {
                    x: parseFloat(t.hasAttribute("x") ? t.getAttribute("x") : t.hasAttribute("cx") ? t.getAttribute("cx") : 0) || 0,
                    y: parseFloat(t.hasAttribute("y") ? t.getAttribute("y") : t.hasAttribute("cy") ? t.getAttribute("cy") : 0) || 0,
                    width: 0,
                    height: 0
                }), o = [(-1 !== (e = _t(e).split(" "))[0].indexOf("%") ? parseFloat(e[0]) / 100 * f.width : parseFloat(e[0])) + f.x, (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * f.height : parseFloat(e[1])) + f.y]), i.xOrigin = l = parseFloat(o[0]), i.yOrigin = h = parseFloat(o[1]), r && x !== Gt && (p = x[0], f = x[1], c = x[2], D = x[3], _ = x[4], d = x[5], (m = p * D - f * c) && (a = l * (D / m) + h * (-c / m) + (c * d - D * _) / m, u = l * (-f / m) + h * (p / m) - (p * d - f * _) / m, l = i.xOrigin = o[0] = a, h = i.yOrigin = o[1] = u)), v && (s && (i.xOffset = v.xOffset, i.yOffset = v.yOffset, v = i), n || !1 !== n && !1 !== Y.defaultSmoothOrigin ? (a = l - g, u = h - y, v.xOffset += a * x[0] + u * x[2] - a, v.yOffset += a * x[1] + u * x[3] - u) : v.xOffset = v.yOffset = 0), s || t.setAttribute("data-svg-origin", o.join(" "))
            }

            function At(t) {
                var e, i, r = this.data,
                    n = -r.rotation * K,
                    s = n + r.skewX * K,
                    o = 1e5,
                    a = (Math.cos(n) * r.scaleX * o | 0) / o,
                    u = (Math.sin(n) * r.scaleX * o | 0) / o,
                    l = (Math.sin(s) * -r.scaleY * o | 0) / o,
                    h = (Math.cos(s) * r.scaleY * o | 0) / o,
                    p = this.t.style,
                    f = this.t.currentStyle;
                if (f) {
                    i = u, u = -l, l = -i, e = f.filter, p.filter = "";
                    var c, D, _ = this.t.offsetWidth,
                        d = this.t.offsetHeight,
                        m = "absolute" !== f.position,
                        g = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + u + ", M21=" + l + ", M22=" + h,
                        y = r.x + _ * r.xPercent / 100,
                        v = r.y + d * r.yPercent / 100;
                    if (null != r.ox && (y += (c = (r.oxp ? _ * r.ox * .01 : r.ox) - _ / 2) - (c * a + (D = (r.oyp ? d * r.oy * .01 : r.oy) - d / 2) * u), v += D - (c * l + D * h)), m ? g += ", Dx=" + ((c = _ / 2) - (c * a + (D = d / 2) * u) + y) + ", Dy=" + (D - (c * l + D * h) + v) + ")" : g += ", sizingMethod='auto expand')", -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? p.filter = e.replace(Q, g) : p.filter = g + " " + e, 0 !== t && 1 !== t || 1 != a || 0 !== u || 0 !== l || 1 != h || (m && -1 === g.indexOf("Dx=0, Dy=0") || X.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf(e.indexOf("Alpha")) && p.removeAttribute("filter")), !m) {
                        var x, C, F, T = k < 8 ? 1 : -1;
                        for (c = r.ieOffsetX || 0, D = r.ieOffsetY || 0, r.ieOffsetX = Math.round((_ - ((a < 0 ? -a : a) * _ + (u < 0 ? -u : u) * d)) / 2 + y), r.ieOffsetY = Math.round((d - ((h < 0 ? -h : h) * d + (l < 0 ? -l : l) * _)) / 2 + v), wt = 0; wt < 4; wt++) F = (i = -1 !== (x = f[C = Dt[wt]]).indexOf("px") ? parseFloat(x) : pt(this.t, C, parseFloat(x), x.replace(L, "")) || 0) !== r[C] ? wt < 2 ? -r.ieOffsetX : -r.ieOffsetY : wt < 2 ? c - r.ieOffsetX : D - r.ieOffsetY, p[C] = (r[C] = Math.round(i - F * (0 === wt || 2 === wt ? 1 : T))) + "px"
                    }
                }
            }
            var kt, Rt, Bt, Mt, It, Nt = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                Lt = b("transform"),
                Xt = at + "transform",
                zt = b("transformOrigin"),
                Yt = null !== b("perspective"),
                jt = nt.Transform = function () {
                    this.perspective = parseFloat(Y.defaultTransformPerspective) || 0, this.force3D = !(!1 === Y.defaultForce3D || !Yt) && (Y.defaultForce3D || "auto")
                },
                Vt = _gsScope.SVGElement,
                Wt = et.documentElement || {},
                Ut = (It = k || /Android/i.test(st) && !_gsScope.chrome, et.createElementNS && !It && (Rt = Ot("svg", Wt), Mt = (Bt = Ot("rect", Rt, {
                    width: 100,
                    height: 50,
                    x: 100
                })).getBoundingClientRect().width, Bt.style[zt] = "50% 50%", Bt.style[Lt] = "scaleX(0.5)", It = Mt === Bt.getBoundingClientRect().width && !(j && Yt), Wt.removeChild(Rt)), It),
                qt = function (t) {
                    var e, i = a("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                        r = this.parentNode,
                        n = this.nextSibling,
                        s = this.style.cssText;
                    if (Wt.appendChild(i), i.appendChild(this), this.style.display = "block", t) try {
                        e = this.getBBox(), this._originalGetBBox = this.getBBox, this.getBBox = qt
                    } catch (t) {} else this._originalGetBBox && (e = this._originalGetBBox());
                    return n ? r.insertBefore(this, n) : r.appendChild(this), Wt.removeChild(i), this.style.cssText = s, e
                },
                Ht = function (t) {
                    return !(!Vt || !t.getCTM || t.parentNode && !t.ownerSVGElement || ! function (e) {
                        try {
                            return e.getBBox()
                        } catch (t) {
                            return qt.call(e, !0)
                        }
                    }(t))
                },
                Gt = [1, 0, 0, 1, 0, 0],
                Qt = function (t, e) {
                    var i, r, n, s, o, a, u, l = t._gsTransform || new jt,
                        h = t.style;
                    if (Lt ? r = ht(t, Xt, null, !0) : t.currentStyle && (r = (r = t.currentStyle.filter.match(G)) && 4 === r.length ? [r[0].substr(4), Number(r[2].substr(4)), Number(r[1].substr(4)), r[3].substr(4), l.x || 0, l.y || 0].join(",") : ""), i = !r || "none" === r || "matrix(1, 0, 0, 1, 0, 0)" === r, Lt && i && !t.offsetParent && (s = h.display, h.display = "block", (u = t.parentNode) && t.offsetParent || (o = 1, a = t.nextSibling, Wt.appendChild(t)), i = !(r = ht(t, Xt, null, !0)) || "none" === r || "matrix(1, 0, 0, 1, 0, 0)" === r, s ? h.display = s : te(h, "display"), o && (a ? u.insertBefore(t, a) : u ? u.appendChild(t) : Wt.removeChild(t))), (l.svg || t.getCTM && Ht(t)) && (i && -1 !== (h[Lt] + "").indexOf("matrix") && (r = h[Lt], i = 0), n = t.getAttribute("transform"), i && n && (r = "matrix(" + (n = t.transform.baseVal.consolidate().matrix).a + "," + n.b + "," + n.c + "," + n.d + "," + n.e + "," + n.f + ")", i = 0)), i) return Gt;
                    for (n = (r || "").match(M) || [], wt = n.length; - 1 < --wt;) s = Number(n[wt]), n[wt] = (o = s - (s |= 0)) ? (1e5 * o + (o < 0 ? -.5 : .5) | 0) / 1e5 + s : s;
                    return e && 6 < n.length ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n
                },
                Zt = nt.getTransform = function (t, e, i, r) {
                    if (t._gsTransform && i && !r) return t._gsTransform;
                    var n, s, o, a, u, l, h = i && t._gsTransform || new jt,
                        p = h.scaleX < 0,
                        f = Yt && (parseFloat(ht(t, zt, e, !1, "0 0 0").split(" ")[2]) || h.zOrigin) || 0,
                        c = parseFloat(Y.defaultTransformPerspective) || 0;
                    if (h.svg = !(!t.getCTM || !Ht(t)), h.svg && (St(t, ht(t, zt, e, !1, "50% 50%") + "", h, t.getAttribute("data-svg-origin")), kt = Y.useSVGTransformAttr || Ut), (n = Qt(t)) !== Gt) {
                        if (16 === n.length) {
                            var D, _, d, m, g, y = n[0],
                                v = n[1],
                                x = n[2],
                                C = n[3],
                                F = n[4],
                                T = n[5],
                                w = n[6],
                                b = n[7],
                                E = n[8],
                                P = n[9],
                                O = n[10],
                                S = n[12],
                                A = n[13],
                                k = n[14],
                                R = n[11],
                                B = Math.atan2(w, O);
                            h.zOrigin && (S = E * (k = -h.zOrigin) - n[12], A = P * k - n[13], k = O * k + h.zOrigin - n[14]), h.rotationX = B * J, B && (D = F * (m = Math.cos(-B)) + E * (g = Math.sin(-B)), _ = T * m + P * g, d = w * m + O * g, E = F * -g + E * m, P = T * -g + P * m, O = w * -g + O * m, R = b * -g + R * m, F = D, T = _, w = d), B = Math.atan2(-x, O), h.rotationY = B * J, B && (_ = v * (m = Math.cos(-B)) - P * (g = Math.sin(-B)), d = x * m - O * g, P = v * g + P * m, O = x * g + O * m, R = C * g + R * m, y = D = y * m - E * g, v = _, x = d), B = Math.atan2(v, y), h.rotation = B * J, B && (D = y * (m = Math.cos(B)) + v * (g = Math.sin(B)), _ = F * m + T * g, d = E * m + P * g, v = v * m - y * g, T = T * m - F * g, P = P * m - E * g, y = D, F = _, E = d), h.rotationX && 359.9 < Math.abs(h.rotationX) + Math.abs(h.rotation) && (h.rotationX = h.rotation = 0, h.rotationY = 180 - h.rotationY), B = Math.atan2(F, T), h.scaleX = (1e5 * Math.sqrt(y * y + v * v + x * x) + .5 | 0) / 1e5, h.scaleY = (1e5 * Math.sqrt(T * T + w * w) + .5 | 0) / 1e5, h.scaleZ = (1e5 * Math.sqrt(E * E + P * P + O * O) + .5 | 0) / 1e5, y /= h.scaleX, F /= h.scaleY, v /= h.scaleX, T /= h.scaleY, 2e-5 < Math.abs(B) ? (h.skewX = B * J, F = 0, "simple" !== h.skewType && (h.scaleY *= 1 / Math.cos(B))) : h.skewX = 0, h.perspective = R ? 1 / (R < 0 ? -R : R) : 0, h.x = S, h.y = A, h.z = k, h.svg && (h.x -= h.xOrigin - (h.xOrigin * y - h.yOrigin * F), h.y -= h.yOrigin - (h.yOrigin * v - h.xOrigin * T))
                        } else if (!Yt || r || !n.length || h.x !== n[4] || h.y !== n[5] || !h.rotationX && !h.rotationY) {
                            var M = 6 <= n.length,
                                I = M ? n[0] : 1,
                                N = n[1] || 0,
                                L = n[2] || 0,
                                X = M ? n[3] : 1;
                            h.x = n[4] || 0, h.y = n[5] || 0, o = Math.sqrt(I * I + N * N), a = Math.sqrt(X * X + L * L), u = I || N ? Math.atan2(N, I) * J : h.rotation || 0, l = L || X ? Math.atan2(L, X) * J + u : h.skewX || 0, h.scaleX = o, h.scaleY = a, h.rotation = u, h.skewX = l, Yt && (h.rotationX = h.rotationY = h.z = 0, h.perspective = c, h.scaleZ = 1), h.svg && (h.x -= h.xOrigin - (h.xOrigin * I + h.yOrigin * L), h.y -= h.yOrigin - (h.xOrigin * N + h.yOrigin * X))
                        }
                        for (s in 90 < Math.abs(h.skewX) && Math.abs(h.skewX) < 270 && (p ? (h.scaleX *= -1, h.skewX += h.rotation <= 0 ? 180 : -180, h.rotation += h.rotation <= 0 ? 180 : -180) : (h.scaleY *= -1, h.skewX += h.skewX <= 0 ? 180 : -180)), h.zOrigin = f, h) h[s] < 2e-5 && -2e-5 < h[s] && (h[s] = 0)
                    }
                    return i && ((t._gsTransform = h).svg && (kt && t.style[Lt] ? z.delayedCall(.001, function () {
                        te(t.style, Lt)
                    }) : !kt && t.getAttribute("transform") && z.delayedCall(.001, function () {
                        t.removeAttribute("transform")
                    }))), h
                },
                $t = nt.set3DTransformRatio = nt.setTransformRatio = function (t) {
                    var e, i, r, n, s, o, a, u, l, h, p, f, c, D, _, d, m, g, y, v, x, C, F, T = this.data,
                        w = this.t.style,
                        b = T.rotation,
                        E = T.rotationX,
                        P = T.rotationY,
                        O = T.scaleX,
                        S = T.scaleY,
                        A = T.scaleZ,
                        k = T.x,
                        R = T.y,
                        B = T.z,
                        M = T.svg,
                        I = T.perspective,
                        N = T.force3D,
                        L = T.skewY,
                        X = T.skewX;
                    if (L && (X += L, b += L), !((1 !== t && 0 !== t || "auto" !== N || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && N || B || I || P || E || 1 !== A) || kt && M || !Yt) b || X || M ? (b *= K, C = X * K, F = 1e5, i = Math.cos(b) * O, s = Math.sin(b) * O, r = Math.sin(b - C) * -S, o = Math.cos(b - C) * S, C && "simple" === T.skewType && (e = Math.tan(C - L * K), r *= e = Math.sqrt(1 + e * e), o *= e, L && (e = Math.tan(L * K), i *= e = Math.sqrt(1 + e * e), s *= e)), M && (k += T.xOrigin - (T.xOrigin * i + T.yOrigin * r) + T.xOffset, R += T.yOrigin - (T.xOrigin * s + T.yOrigin * o) + T.yOffset, kt && (T.xPercent || T.yPercent) && (_ = this.t.getBBox(), k += .01 * T.xPercent * _.width, R += .01 * T.yPercent * _.height), k < (_ = 1e-6) && -_ < k && (k = 0), R < _ && -_ < R && (R = 0)), y = (i * F | 0) / F + "," + (s * F | 0) / F + "," + (r * F | 0) / F + "," + (o * F | 0) / F + "," + k + "," + R + ")", M && kt ? this.t.setAttribute("transform", "matrix(" + y) : w[Lt] = (T.xPercent || T.yPercent ? "translate(" + T.xPercent + "%," + T.yPercent + "%) matrix(" : "matrix(") + y) : w[Lt] = (T.xPercent || T.yPercent ? "translate(" + T.xPercent + "%," + T.yPercent + "%) matrix(" : "matrix(") + O + ",0,0," + S + "," + k + "," + R + ")";
                    else {
                        if (j && (O < (_ = 1e-4) && -_ < O && (O = A = 2e-5), S < _ && -_ < S && (S = A = 2e-5), !I || T.z || T.rotationX || T.rotationY || (I = 0)), b || X) b *= K, d = i = Math.cos(b), m = s = Math.sin(b), X && (b -= X * K, d = Math.cos(b), m = Math.sin(b), "simple" === T.skewType && (e = Math.tan((X - L) * K), d *= e = Math.sqrt(1 + e * e), m *= e, T.skewY && (e = Math.tan(L * K), i *= e = Math.sqrt(1 + e * e), s *= e))), r = -m, o = d;
                        else {
                            if (!(P || E || 1 !== A || I || M)) return void(w[Lt] = (T.xPercent || T.yPercent ? "translate(" + T.xPercent + "%," + T.yPercent + "%) translate3d(" : "translate3d(") + k + "px," + R + "px," + B + "px)" + (1 !== O || 1 !== S ? " scale(" + O + "," + S + ")" : ""));
                            i = o = 1, r = s = 0
                        }
                        h = 1, n = a = u = l = p = f = 0, c = I ? -1 / I : 0, D = T.zOrigin, _ = 1e-6, v = ",", x = "0", (b = P * K) && (d = Math.cos(b), p = c * (u = -(m = Math.sin(b))), n = i * m, a = s * m, c *= h = d, i *= d, s *= d), (b = E * K) && (e = r * (d = Math.cos(b)) + n * (m = Math.sin(b)), g = o * d + a * m, l = h * m, f = c * m, n = r * -m + n * d, a = o * -m + a * d, h *= d, c *= d, r = e, o = g), 1 !== A && (n *= A, a *= A, h *= A, c *= A), 1 !== S && (r *= S, o *= S, l *= S, f *= S), 1 !== O && (i *= O, s *= O, u *= O, p *= O), (D || M) && (D && (k += n * -D, R += a * -D, B += h * -D + D), M && (k += T.xOrigin - (T.xOrigin * i + T.yOrigin * r) + T.xOffset, R += T.yOrigin - (T.xOrigin * s + T.yOrigin * o) + T.yOffset), k < _ && -_ < k && (k = x), R < _ && -_ < R && (R = x), B < _ && -_ < B && (B = 0)), y = T.xPercent || T.yPercent ? "translate(" + T.xPercent + "%," + T.yPercent + "%) matrix3d(" : "matrix3d(", y += (i < _ && -_ < i ? x : i) + v + (s < _ && -_ < s ? x : s) + v + (u < _ && -_ < u ? x : u), y += v + (p < _ && -_ < p ? x : p) + v + (r < _ && -_ < r ? x : r) + v + (o < _ && -_ < o ? x : o), E || P || 1 !== A ? (y += v + (l < _ && -_ < l ? x : l) + v + (f < _ && -_ < f ? x : f) + v + (n < _ && -_ < n ? x : n), y += v + (a < _ && -_ < a ? x : a) + v + (h < _ && -_ < h ? x : h) + v + (c < _ && -_ < c ? x : c) + v) : y += ",0,0,0,0,1,0,", y += k + v + R + v + B + v + (I ? 1 + -B / I : 1) + ")", w[Lt] = y
                    }
                };
            (t = jt.prototype).x = t.y = t.z = t.skewX = t.skewY = t.rotation = t.rotationX = t.rotationY = t.zOrigin = t.xPercent = t.yPercent = t.xOffset = t.yOffset = 0, t.scaleX = t.scaleY = t.scaleZ = 1, Et("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
                parser: function (t, e, i, r, n, s, o) {
                    if (r._lastParsedTransform === o) return n;
                    var a = (r._lastParsedTransform = o).scale && "function" == typeof o.scale ? o.scale : 0;
                    a && (o.scale = a(B, t));
                    var u, l, h, p, f, c, D, _, d, m = t._gsTransform,
                        g = t.style,
                        y = Nt.length,
                        v = o,
                        x = {},
                        C = "transformOrigin",
                        F = Zt(t, w, !0, v.parseTransform),
                        T = v.transform && ("function" == typeof v.transform ? v.transform(B, R) : v.transform);
                    if (F.skewType = v.skewType || F.skewType || Y.defaultSkewType, r._transform = F, "rotationZ" in v && (v.rotation = v.rotationZ), T && "string" == typeof T && Lt)(l = it.style)[Lt] = T, l.display = "block", l.position = "absolute", -1 !== T.indexOf("%") && (l.width = ht(t, "width"), l.height = ht(t, "height")), et.body.appendChild(it), u = Zt(it, null, !1), "simple" === F.skewType && (u.scaleY *= Math.cos(u.skewX * K)), F.svg && (c = F.xOrigin, D = F.yOrigin, u.x -= F.xOffset, u.y -= F.yOffset, (v.transformOrigin || v.svgOrigin) && (T = {}, St(t, _t(v.transformOrigin), T, v.svgOrigin, v.smoothOrigin, !0), c = T.xOrigin, D = T.yOrigin, u.x -= T.xOffset - F.xOffset, u.y -= T.yOffset - F.yOffset), (c || D) && (_ = Qt(it, !0), u.x -= c - (c * _[0] + D * _[2]), u.y -= D - (c * _[1] + D * _[3]))), et.body.removeChild(it), u.perspective || (u.perspective = F.perspective), null != v.xPercent && (u.xPercent = P(v.xPercent, F.xPercent)), null != v.yPercent && (u.yPercent = P(v.yPercent, F.yPercent));
                    else if ("object" == typeof v) {
                        if (u = {
                                scaleX: P(null != v.scaleX ? v.scaleX : v.scale, F.scaleX),
                                scaleY: P(null != v.scaleY ? v.scaleY : v.scale, F.scaleY),
                                scaleZ: P(v.scaleZ, F.scaleZ),
                                x: P(v.x, F.x),
                                y: P(v.y, F.y),
                                z: P(v.z, F.z),
                                xPercent: P(v.xPercent, F.xPercent),
                                yPercent: P(v.yPercent, F.yPercent),
                                perspective: P(v.transformPerspective, F.perspective)
                            }, null != (f = v.directionalRotation))
                            if ("object" == typeof f)
                                for (l in f) v[l] = f[l];
                            else v.rotation = f;
                        "string" == typeof v.x && -1 !== v.x.indexOf("%") && (u.x = 0, u.xPercent = P(v.x, F.xPercent)), "string" == typeof v.y && -1 !== v.y.indexOf("%") && (u.y = 0, u.yPercent = P(v.y, F.yPercent)), u.rotation = O("rotation" in v ? v.rotation : "shortRotation" in v ? v.shortRotation + "_short" : F.rotation, F.rotation, "rotation", x), Yt && (u.rotationX = O("rotationX" in v ? v.rotationX : "shortRotationX" in v ? v.shortRotationX + "_short" : F.rotationX || 0, F.rotationX, "rotationX", x), u.rotationY = O("rotationY" in v ? v.rotationY : "shortRotationY" in v ? v.shortRotationY + "_short" : F.rotationY || 0, F.rotationY, "rotationY", x)), u.skewX = O(v.skewX, F.skewX), u.skewY = O(v.skewY, F.skewY)
                    }
                    for (Yt && null != v.force3D && (F.force3D = v.force3D, p = !0), (h = F.force3D || F.z || F.rotationX || F.rotationY || u.z || u.rotationX || u.rotationY || u.perspective) || null == v.scale || (u.scaleZ = 1); - 1 < --y;)(1e-6 < (T = u[d = Nt[y]] - F[d]) || T < -1e-6 || null != v[d] || null != tt[d]) && (p = !0, n = new Ft(F, d, F[d], T, n), d in x && (n.e = x[d]), n.xs0 = 0, n.plugin = s, r._overwriteProps.push(n.n));
                    return T = "function" == typeof v.transformOrigin ? v.transformOrigin(B, R) : v.transformOrigin, F.svg && (T || v.svgOrigin) && (c = F.xOffset, D = F.yOffset, St(t, _t(T), u, v.svgOrigin, v.smoothOrigin), n = xt(F, "xOrigin", (m ? F : u).xOrigin, u.xOrigin, n, C), n = xt(F, "yOrigin", (m ? F : u).yOrigin, u.yOrigin, n, C), c === F.xOffset && D === F.yOffset || (n = xt(F, "xOffset", m ? c : F.xOffset, F.xOffset, n, C), n = xt(F, "yOffset", m ? D : F.yOffset, F.yOffset, n, C)), T = "0px 0px"), (T || Yt && h && F.zOrigin) && (Lt ? (p = !0, d = zt, T || (T = (T = (ht(t, d, w, !1, "50% 50%") + "").split(" "))[0] + " " + T[1] + " " + F.zOrigin + "px"), T += "", (n = new Ft(g, d, 0, 0, n, -1, C)).b = g[d], n.plugin = s, Yt ? (l = F.zOrigin, T = T.split(" "), F.zOrigin = (2 < T.length ? parseFloat(T[2]) : l) || 0, n.xs0 = n.e = T[0] + " " + (T[1] || "50%") + " 0px", (n = new Ft(F, "zOrigin", 0, 0, n, -1, n.n)).b = l, n.xs0 = n.e = F.zOrigin) : n.xs0 = n.e = T) : _t(T + "", F)), p && (r._transformType = F.svg && kt || !h && 3 !== this._transformType ? 2 : 3), a && (o.scale = a), n
                },
                allowFunc: !0,
                prefix: !0
            }), Et("boxShadow", {
                defaultValue: "0px 0px 0px 0px #999",
                prefix: !0,
                color: !0,
                multi: !0,
                keyword: "inset"
            }), Et("clipPath", {
                defaultValue: "inset(0px)",
                prefix: !0,
                multi: !0,
                formatter: yt("inset(0px 0px 0px 0px)", !1, !0)
            }), Et("borderRadius", {
                defaultValue: "0px",
                parser: function (t, e, i, r, n, s) {
                    e = this.format(e);
                    var o, a, u, l, h, p, f, c, D, _, d, m, g, y, v, x, C = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                        F = t.style;
                    for (D = parseFloat(t.offsetWidth), _ = parseFloat(t.offsetHeight), o = e.split(" "), a = 0; a < C.length; a++) this.p.indexOf("border") && (C[a] = b(C[a])), -1 !== (h = l = ht(t, C[a], w, !1, "0px")).indexOf(" ") && (h = (l = h.split(" "))[0], l = l[1]), p = u = o[a], f = parseFloat(h), m = h.substr((f + "").length), "" === (d = (g = "=" === p.charAt(1)) ? (c = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), c *= parseFloat(p), p.substr((c + "").length - (c < 0 ? 1 : 0)) || "") : (c = parseFloat(p), p.substr((c + "").length))) && (d = T[i] || m), d !== m && (y = pt(t, "borderLeft", f, m), v = pt(t, "borderTop", f, m), l = "%" === d ? (h = y / D * 100 + "%", v / _ * 100 + "%") : "em" === d ? (h = y / (x = pt(t, "borderLeft", 1, "em")) + "em", v / x + "em") : (h = y + "px", v + "px"), g && (p = parseFloat(h) + c + d, u = parseFloat(l) + c + d)), n = Tt(F, C[a], h + " " + l, p + " " + u, !1, "0px", n);
                    return n
                },
                prefix: !0,
                formatter: yt("0px 0px 0px 0px", !1, !0)
            }), Et("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
                defaultValue: "0px",
                parser: function (t, e, i, r, n, s) {
                    return Tt(t.style, i, this.format(ht(t, i, w, !1, "0px 0px")), this.format(e), !1, "0px", n)
                },
                prefix: !0,
                formatter: yt("0px 0px", !1, !0)
            }), Et("backgroundPosition", {
                defaultValue: "0 0",
                parser: function (t, e, i, r, n, s) {
                    var o, a, u, l, h, p, f = "background-position",
                        c = w || g(t),
                        D = this.format((c ? k ? c.getPropertyValue(f + "-x") + " " + c.getPropertyValue(f + "-y") : c.getPropertyValue(f) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
                        _ = this.format(e);
                    if (-1 !== D.indexOf("%") != (-1 !== _.indexOf("%")) && _.split(",").length < 2 && ((p = ht(t, "backgroundImage").replace(q, "")) && "none" !== p)) {
                        for (o = D.split(" "), a = _.split(" "), rt.setAttribute("src", p), u = 2; - 1 < --u;)(l = -1 !== (D = o[u]).indexOf("%")) != (-1 !== a[u].indexOf("%")) && (h = 0 === u ? t.offsetWidth - rt.width : t.offsetHeight - rt.height, o[u] = l ? parseFloat(D) / 100 * h + "px" : parseFloat(D) / h * 100 + "%");
                        D = o.join(" ")
                    }
                    return this.parseComplex(t.style, D, _, n, s)
                },
                formatter: _t
            }), Et("backgroundSize", {
                defaultValue: "0 0",
                formatter: function (t) {
                    return "co" === (t += "").substr(0, 2) ? t : _t(-1 === t.indexOf(" ") ? t + " " + t : t)
                }
            }), Et("perspective", {
                defaultValue: "0px",
                prefix: !0
            }), Et("perspectiveOrigin", {
                defaultValue: "50% 50%",
                prefix: !0
            }), Et("transformStyle", {
                prefix: !0
            }), Et("backfaceVisibility", {
                prefix: !0
            }), Et("userSelect", {
                prefix: !0
            }), Et("margin", {
                parser: vt("marginTop,marginRight,marginBottom,marginLeft")
            }), Et("padding", {
                parser: vt("paddingTop,paddingRight,paddingBottom,paddingLeft")
            }), Et("clip", {
                defaultValue: "rect(0px,0px,0px,0px)",
                parser: function (t, e, i, r, n, s) {
                    var o, a, u;
                    return e = k < 9 ? (a = t.currentStyle, u = k < 8 ? " " : ",", o = "rect(" + a.clipTop + u + a.clipRight + u + a.clipBottom + u + a.clipLeft + ")", this.format(e).split(",").join(u)) : (o = this.format(ht(t, this.p, w, !1, this.dflt)), this.format(e)), this.parseComplex(t.style, o, e, n, s)
                }
            }), Et("textShadow", {
                defaultValue: "0px 0px 0px #999",
                color: !0,
                multi: !0
            }), Et("autoRound,strictUnits", {
                parser: function (t, e, i, r, n) {
                    return n
                }
            }), Et("border", {
                defaultValue: "0px solid #000",
                parser: function (t, e, i, r, n, s) {
                    var o = ht(t, "borderTopWidth", w, !1, "0px"),
                        a = this.format(e).split(" "),
                        u = a[0].replace(L, "");
                    return "px" !== u && (o = parseFloat(o) / pt(t, "borderTopWidth", 1, u) + u), this.parseComplex(t.style, this.format(o + " " + ht(t, "borderTopStyle", w, !1, "solid") + " " + ht(t, "borderTopColor", w, !1, "#000")), a.join(" "), n, s)
                },
                color: !0,
                formatter: function (t) {
                    var e = t.split(" ");
                    return e[0] + " " + (e[1] || "solid") + " " + (t.match(gt) || ["#000"])[0]
                }
            }), Et("borderWidth", {
                parser: vt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
            }), Et("float,cssFloat,styleFloat", {
                parser: function (t, e, i, r, n, s) {
                    var o = t.style,
                        a = "cssFloat" in o ? "cssFloat" : "styleFloat";
                    return new Ft(o, a, 0, 0, n, -1, i, !1, 0, o[a], e)
                }
            });

            function Kt(t) {
                var e, i = this.t,
                    r = i.filter || ht(this.data, "filter") || "",
                    n = this.s + this.c * t | 0;
                100 == n && (e = -1 === r.indexOf("atrix(") && -1 === r.indexOf("radient(") && -1 === r.indexOf("oader(") ? (i.removeAttribute("filter"), !ht(this.data, "filter")) : (i.filter = r.replace(p, ""), !0)), e || (this.xn1 && (i.filter = r = r || "alpha(opacity=" + n + ")"), -1 === r.indexOf("pacity") ? 0 == n && this.xn1 || (i.filter = r + " alpha(opacity=" + n + ")") : i.filter = r.replace(X, "opacity=" + n))
            }
            Et("opacity,alpha,autoAlpha", {
                defaultValue: "1",
                parser: function (t, e, i, r, n, s) {
                    var o = parseFloat(ht(t, "opacity", w, !1, "1")),
                        a = t.style,
                        u = "autoAlpha" === i;
                    return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + o), u && 1 === o && "hidden" === ht(t, "visibility", w) && 0 !== e && (o = 0), ot ? n = new Ft(a, "opacity", o, e - o, n) : ((n = new Ft(a, "opacity", 100 * o, 100 * (e - o), n)).xn1 = u ? 1 : 0, a.zoom = 1, n.type = 2, n.b = "alpha(opacity=" + n.s + ")", n.e = "alpha(opacity=" + (n.s + n.c) + ")", n.data = t, n.plugin = s, n.setRatio = Kt), u && ((n = new Ft(a, "visibility", 0, 0, n, -1, null, !1, 0, 0 !== o ? "inherit" : "hidden", 0 === e ? "hidden" : "inherit")).xs0 = "inherit", r._overwriteProps.push(n.n), r._overwriteProps.push(i)), n
                }
            });

            function Jt(t) {
                if (this.t._gsClassPT = this, 1 === t || 0 === t) {
                    this.t.setAttribute("class", 0 === t ? this.b : this.e);
                    for (var e = this.data, i = this.t.style; e;) e.v ? i[e.p] = e.v : te(i, e.p), e = e._next;
                    1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
            }
            var te = function (t, e) {
                e && (t.removeProperty ? ("ms" !== e.substr(0, 2) && "webkit" !== e.substr(0, 6) || (e = "-" + e), t.removeProperty(e.replace(f, "-$1").toLowerCase())) : t.removeAttribute(e))
            };
            Et("className", {
                parser: function (t, e, i, r, n, s, o) {
                    var a, u, l, h, p, f = t.getAttribute("class") || "",
                        c = t.style.cssText;
                    if ((n = r._classNamePT = new Ft(t, i, 0, 0, n, 2)).setRatio = Jt, n.pr = -11, D = !0, n.b = f, u = y(t, w), l = t._gsClassPT) {
                        for (h = {}, p = l.data; p;) h[p.p] = 1, p = p._next;
                        l.setRatio(1)
                    }
                    return (t._gsClassPT = n).e = "=" !== e.charAt(1) ? e : f.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""), t.setAttribute("class", n.e), a = v(t, u, y(t), o, h), t.setAttribute("class", f), n.data = a.firstMPT, t.style.cssText = c, n.xfirst = r.parse(t, a.difs, n, s)
                }
            });

            function ee(t) {
                if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                    var e, i, r, n, s, o = this.t.style,
                        a = d.transform.parse;
                    if ("all" === this.e) n = !(o.cssText = "");
                    else
                        for (r = (e = this.e.split(" ").join("").split(",")).length; - 1 < --r;) i = e[r], d[i] && (d[i].parse === a ? n = !0 : i = "transformOrigin" === i ? zt : d[i].p), te(o, i);
                    n && (te(o, Lt), (s = this.t._gsTransform) && (s.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
                }
            }
            for (Et("clearProps", {
                    parser: function (t, e, i, r, n) {
                        return (n = new Ft(t, i, 0, 0, n, 2)).setRatio = ee, n.e = e, n.pr = -10, n.data = r._tween, D = !0, n
                    }
                }), t = "bezier,throwProps,physicsProps,physics2D".split(","), wt = t.length; wt--;) Pt(t[wt]);
            (t = Y.prototype)._firstPT = t._lastParsedTransform = t._transform = null, t._onInitTween = function (t, e, i, r) {
                if (!t.nodeType) return !1;
                this._target = R = t, this._tween = i, this._vars = e, B = r, S = e.autoRound, D = !1, T = e.suffixMap || Y.suffixMap, w = g(t), _ = this._overwriteProps;
                var n, s, o, a, u, l, h, p, f, c = t.style;
                if (C && "" === c.zIndex && ("auto" !== (n = ht(t, "zIndex", w)) && "" !== n || this._addLazySet(c, "zIndex", 0)), "string" == typeof e && (a = c.cssText, n = y(t, w), c.cssText = a + ";" + e, n = v(t, n, y(t)).difs, !ot && V.test(e) && (n.opacity = parseFloat(RegExp.$1)), e = n, c.cssText = a), e.className ? this._firstPT = s = d.className.parse(t, e.className, "className", this, null, null, e) : this._firstPT = s = this.parse(t, e, null), this._transformType) {
                    for (f = 3 === this._transformType, Lt ? F && (C = !0, "" === c.zIndex && ("auto" !== (h = ht(t, "zIndex", w)) && "" !== h || this._addLazySet(c, "zIndex", 0)), A && this._addLazySet(c, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (f ? "visible" : "hidden"))) : c.zoom = 1, o = s; o && o._next;) o = o._next;
                    p = new Ft(t, "transform", 0, 0, null, 2), this._linkCSSP(p, null, o), p.setRatio = Lt ? $t : At, p.data = this._transform || Zt(t, w, !0), p.tween = i, p.pr = -1, _.pop()
                }
                if (D) {
                    for (; s;) {
                        for (l = s._next, o = a; o && o.pr > s.pr;) o = o._next;
                        (s._prev = o ? o._prev : u) ? s._prev._next = s: a = s, (s._next = o) ? o._prev = s : u = s, s = l
                    }
                    this._firstPT = a
                }
                return !0
            }, t.parse = function (t, e, i, r) {
                var n, s, o, a, u, l, h, p, f, c, D = t.style;
                for (n in e) {
                    if (l = e[n], s = d[n], "function" != typeof l || s && s.allowFunc || (l = l(B, R)), s) i = s.parse(t, l, n, this, i, r, e);
                    else {
                        if ("--" === n.substr(0, 2)) {
                            this._tween._propLookup[n] = this._addTween.call(this._tween, t.style, "setProperty", g(t).getPropertyValue(n) + "", l + "", n, !1, n);
                            continue
                        }
                        u = ht(t, n, w) + "", f = "string" == typeof l, "color" === n || "fill" === n || "stroke" === n || -1 !== n.indexOf("Color") || f && W.test(l) ? (f || (l = (3 < (l = mt(l)).length ? "rgba(" : "rgb(") + l.join(",") + ")"), i = Tt(D, n, u, l, !0, "transparent", i, 0, r)) : f && $.test(l) ? i = Tt(D, n, u, l, !0, null, i, 0, r) : (h = (o = parseFloat(u)) || 0 === o ? u.substr((o + "").length) : "", "" !== u && "auto" !== u || (h = "width" === n || "height" === n ? (o = x(t, n, w), "px") : "left" === n || "top" === n ? (o = ft(t, n, w), "px") : (o = "opacity" !== n ? 0 : 1, "")), "" === (p = (c = f && "=" === l.charAt(1)) ? (a = parseInt(l.charAt(0) + "1", 10), l = l.substr(2), a *= parseFloat(l), l.replace(L, "")) : (a = parseFloat(l), f ? l.replace(L, "") : "")) && (p = n in T ? T[n] : h), l = a || 0 === a ? (c ? a + o : a) + p : e[n], h === p || "" === p && "lineHeight" !== n || !a && 0 !== a || !o || (o = pt(t, n, o, h), "%" === p ? (o /= pt(t, n, 100, "%") / 100, !0 !== e.strictUnits && (u = o + "%")) : "em" === p || "rem" === p || "vw" === p || "vh" === p ? o /= pt(t, n, 1, p) : "px" !== p && (a = pt(t, n, a, p), p = "px"), c && (a || 0 === a) && (l = a + o + p)), c && (a += o), !o && 0 !== o || !a && 0 !== a ? void 0 !== D[n] && (l || l + "" != "NaN" && null != l) ? (i = new Ft(D, n, a || o || 0, 0, i, -1, n, !1, 0, u, l)).xs0 = "none" !== l || "display" !== n && -1 === n.indexOf("Style") ? l : u : m("invalid " + n + " tween value: " + e[n]) : (i = new Ft(D, n, o, a - o, i, 0, n, !1 !== S && ("px" === p || "zIndex" === n), 0, u, l)).xs0 = p)
                    }
                    r && i && !i.plugin && (i.plugin = r)
                }
                return i
            }, t.setRatio = function (t) {
                var e, i, r, n = this._firstPT;
                if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                    if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || -1e-6 === this._tween._rawPrevTime)
                        for (; n;) {
                            if (e = n.c * t + n.s, n.r ? e = n.r(e) : e < 1e-6 && -1e-6 < e && (e = 0), n.type)
                                if (1 === n.type)
                                    if (2 === (r = n.l)) n.t[n.p] = n.xs0 + e + n.xs1 + n.xn1 + n.xs2;
                                    else if (3 === r) n.t[n.p] = n.xs0 + e + n.xs1 + n.xn1 + n.xs2 + n.xn2 + n.xs3;
                            else if (4 === r) n.t[n.p] = n.xs0 + e + n.xs1 + n.xn1 + n.xs2 + n.xn2 + n.xs3 + n.xn3 + n.xs4;
                            else if (5 === r) n.t[n.p] = n.xs0 + e + n.xs1 + n.xn1 + n.xs2 + n.xn2 + n.xs3 + n.xn3 + n.xs4 + n.xn4 + n.xs5;
                            else {
                                for (i = n.xs0 + e + n.xs1, r = 1; r < n.l; r++) i += n["xn" + r] + n["xs" + (r + 1)];
                                n.t[n.p] = i
                            } else -1 === n.type ? n.t[n.p] = n.xs0 : n.setRatio && n.setRatio(t);
                            else n.t[n.p] = e + n.xs0;
                            n = n._next
                        } else
                            for (; n;) 2 !== n.type ? n.t[n.p] = n.b : n.setRatio(t), n = n._next;
                    else
                        for (; n;) {
                            if (2 !== n.type)
                                if (n.r && -1 !== n.type)
                                    if (e = n.r(n.s + n.c), n.type) {
                                        if (1 === n.type) {
                                            for (r = n.l, i = n.xs0 + e + n.xs1, r = 1; r < n.l; r++) i += n["xn" + r] + n["xs" + (r + 1)];
                                            n.t[n.p] = i
                                        }
                                    } else n.t[n.p] = e + n.xs0;
                            else n.t[n.p] = n.e;
                            else n.setRatio(t);
                            n = n._next
                        }
            }, t._enableTransforms = function (t) {
                this._transform = this._transform || Zt(this._target, w, !0), this._transformType = this._transform.svg && kt || !t && 3 !== this._transformType ? 2 : 3
            };

            function ie(t) {
                this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
            }
            t._addLazySet = function (t, e, i) {
                var r = this._firstPT = new Ft(t, e, 0, 0, this._firstPT, 2);
                r.e = i, r.setRatio = ie, r.data = this
            }, t._linkCSSP = function (t, e, i, r) {
                return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next, r = !0), i ? i._next = t : r || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i), t
            }, t._mod = function (t) {
                for (var e = this._firstPT; e;) "function" == typeof t[e.p] && (e.r = t[e.p]), e = e._next
            }, t._kill = function (t) {
                var e, i, r, n = t;
                if (t.autoAlpha || t.alpha) {
                    for (i in n = {}, t) n[i] = t[i];
                    n.opacity = 1, n.autoAlpha && (n.visibility = 1)
                }
                for (t.className && (e = this._classNamePT) && ((r = e.xfirst) && r._prev ? this._linkCSSP(r._prev, e._next, r._prev._prev) : r === this._firstPT && (this._firstPT = e._next), e._next && this._linkCSSP(e._next, e._next._next, r._prev), this._classNamePT = null), e = this._firstPT; e;) e.plugin && e.plugin !== i && e.plugin._kill && (e.plugin._kill(t), i = e.plugin), e = e._next;
                return s.prototype._kill.call(this, n)
            };
            var re = function (t, e, i) {
                var r, n, s, o;
                if (t.slice)
                    for (n = t.length; - 1 < --n;) re(t[n], e, i);
                else
                    for (n = (r = t.childNodes).length; - 1 < --n;) o = (s = r[n]).type, s.style && (e.push(y(s)), i && i.push(s)), 1 !== o && 9 !== o && 11 !== o || !s.childNodes.length || re(s, e, i)
            };
            return Y.cascadeTo = function (t, e, i) {
                var r, n, s, o, a = z.to(t, e, i),
                    u = [a],
                    l = [],
                    h = [],
                    p = [],
                    f = z._internals.reservedProps;
                for (t = a._targets || a.target, re(t, l, p), a.render(e, !0, !0), re(t, h), a.render(0, !0, !0), a._enabled(!0), r = p.length; - 1 < --r;)
                    if ((n = v(p[r], l[r], h[r])).firstMPT) {
                        for (s in n = n.difs, i) f[s] && (n[s] = i[s]);
                        for (s in o = {}, n) o[s] = l[r][s];
                        u.push(z.fromTo(p[r], e, o, n))
                    } return u
            }, s.activate([Y]), Y
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function () {
        "use strict";

        function t() {
            return (_gsScope.GreenSockGlobals || _gsScope).CSSPlugin
        }
        "undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = t()) : "function" == typeof define && define.amd && define(["TweenLite"], t)
    }();