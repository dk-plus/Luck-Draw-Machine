/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


__webpack_require__(1);
(function (main) {
    var args = {};
    window.onload = function () {
        main(args);
    };
})(function (args) {
    'use strict';
    //容器、文本、按钮
    var con = document.querySelector("#con");
    var para = document.querySelector("#para");
    var btn = document.querySelector("#ajax-btn");
    //三个表情
    var cry = document.querySelector("#cry");
    var hongbao = document.querySelector("#hongbao");
    var happy = document.querySelector("#happy");

    var countDownSec = -1;//从服务器获取的倒计时
    var timer;//倒计时定时器
    var time = -1;//显示在页面的倒计时
    var txt = "";//显示倒计时的信息文本

    Element.prototype.display = display;
    Element.prototype.modifyText = modifyText;

    //发送ajax请求，获取倒计时并交给getCountDownSec处理
    sendAjax("time.json", getCountDownSec);
    //检查getCountDownSec是否成功修改了倒计时countDownSec，默认为-1
    if (countDownSec >= 0) {
        timer = setInterval(function(){
            updateCountDown();
            time = formatSec(countDownSec);
            txt = complexStr("距离抽奖开始还剩", time);
            para.modifyText(txt);
            if (countDownSec == 0) {
                clearInterval(timer);
                // console.log("clear");
                para.display(0);
                btn.display(1);                
            }
        },1000);
        para.display(1);
    }
    //发送ajax的get请求，url为请求地址，callback为请求后对数据的操作
    function sendAjax(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                // console.log(this.responseText);
                if (this.responseText == "") {
                    callback(this.responseText);
                }
                var obj = JSON.parse(this.responseText);
                callback(obj);
            } else {
                console.log(url + " failure! the code is: " + this.status);
            }
        });
        xhr.open("get", url, false);
        xhr.send();
    }
    //获取倒计时
    function getCountDownSec(xhr) {
        if (xhr == "") {            
            para.modifyText("很遗憾，你已经参与了抽奖，不能再进行抽奖了");
            para.display(1);
            return;
        }
        if (xhr.code == -1) {
            para.modifyText("没有连上服务器");
            para.display(1);
            return;
        }
        // console.log(xhr.message);
        var mss = xhr.message;
        countDownSec = parseInt(mss / 1000) * 1000;
        return countDownSec;
    }
    //格式化时间，把毫秒格式化为“n分钟n秒”
    function formatSec(mss) {
        // var mss = parseInt(mss/1000)*1000;
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        if (mss >= 60000) {
            return minutes + " 分钟 " + seconds + " 秒 ";
        } else {
            return seconds + " 秒 ";
        }
    }
    //更新倒计时
    function updateCountDown() {
        if (countDownSec <= 0) {
            return;
        }
        countDownSec -= 1000;
        // console.log(countDownSec);
    }
    //控制元素的出现与否
    function display(bool) {
        // console.log(this);
        if (bool == 0) {
            this.style.display = "none";
        } else if (bool == 1) {
            this.style.display = "block";
        }
    }
    //修改显示的字符串
    function modifyText(str) {
        // console.log(this);
        this.innerHTML = str;
    }
    //混合字符串
    function complexStr(str1, str2) {
        return str1 + str2
    }
    //获取中奖码后的操作
    function checkDrawCode(xhr) {
        // console.log(xhr.message.prizeLevel);
        var code = xhr.message.prizeLevel;
        switch (code) {
            case 0:
                happy.display(1);
                para.modifyText("亲，你可以再抽一次奖哦~");
                break;
            case 1:
                hongbao.display(1);
                para.modifyText("恭喜你，一等奖！");
                break;
            case 2:
                happy.display(1);
                para.modifyText("哇偶！二等奖！");
                break;
            case 3:
                happy.display(1);
                para.modifyText("不赖嘛！三等奖！");
                break;
            case 4:
                cry.display(1);
                para.modifyText("很遗憾，没有抽到奖哦~");
                break;
            default:
                break;
        }
    }

    var Box = function (x, y, w, h, s) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.s = s;
        this.a = Math.random() * Math.PI * 2;
        this.hue = Math.random() * 360;
    };

    Box.prototype = {
        constructor: Box,
        update: function () {
            this.a += Math.random() * 0.5 - 0.25;
            this.x += Math.cos(this.a) * this.s;
            this.y += Math.sin(this.a) * this.s;
            this.hue += 5;
            if (this.x > WIDTH) this.x = 0;
            else if (this.x < 0) this.x = WIDTH;
            if (this.y > HEIGHT) this.y = 0;
            else if (this.y < 0) this.y = HEIGHT;
        },
        render: function (ctx) {
            ctx.save();
            ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 50%, 1)';
            ctx.translate(this.x, this.y);
            ctx.rotate(this.a);
            ctx.fillRect(-this.w, -this.h / 2, this.w, this.h);
            ctx.restore();
        }
    };

    var Circle = function (x, y, tx, ty, r) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.tx = tx;
        this.ty = ty;
        this.lx = x;
        this.ly = y;
        this.r = r;
        this.br = r;
        this.a = Math.random() * Math.PI * 2;
        this.sx = Math.random() * 0.5;
        this.sy = Math.random() * 0.5;
        this.o = Math.random() * 1;
        this.delay = Math.random() * 0;
        this.delayCtr = 0;
        this.hue = Math.random() * 360;
    };

    Circle.prototype = {
        constructor: Circle,
        update: function () {

            if (this.delayCtr < this.delay) {
                this.delayCtr++;
                return;
            }

            this.hue += 1;
            this.a += 0.1;

            this.lx = this.x;
            this.ly = this.y;

            if (!clickToggle) {
                this.x += (this.tx - this.x) * this.sx;
                this.y += (this.ty - this.y) * this.sy;
            } else {
                this.x += (this.ox - this.x) * this.sx;
                this.y += (this.oy - this.y) * this.sy;
            }


            this.r = this.br + Math.cos(this.a) * (this.br * 0.5);
        },
        render: function (ctx) {

            ctx.save();
            ctx.globalAlpha = this.o;
            ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 50%, 1)';
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.arc(0, 0, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (clickToggle) {
                ctx.save();
                ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, 50%, 1)';
                ctx.beginPath();
                ctx.moveTo(this.lx, this.ly);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
                ctx.restore();
            }
        }
    };

    var txtCanvas = document.createElement('canvas');
    var txtCtx = txtCanvas.getContext('2d');

    var c = document.getElementById('c');
    var ctx = c.getContext('2d');

    var WIDTH = c.width = window.innerWidth;
    var HEIGHT = c.height = window.innerHeight;
    var imgData = null;
    var idx = null;
    var skip = 4;
    var circles = [];
    var circle = null;
    var a = null;
    var clickToggle = false;
    var boxList = [];
    var box = null;

    txtCanvas.width = WIDTH;
    txtCanvas.height = HEIGHT;

    txtCtx.font = 'bold 230px Sans-serif';
    txtCtx.textAlign = 'center';
    txtCtx.baseline = 'middle';
    txtCtx.fillText('d k p l u s', WIDTH / 2, HEIGHT / 2);

    ctx.font = 'bold 12px Monospace';
    ctx.textAlign = 'center';
    ctx.baseline = 'middle';

    imgData = txtCtx.getImageData(0, 0, WIDTH, HEIGHT).data;

    for (var y = 0; y < HEIGHT; y += 9) {
        for (var x = 0; x < WIDTH; x += 9) {
            idx = (x + y * WIDTH) * 4 - 1;
            if (imgData[idx] > 0) {
                a = Math.PI * 2 * Math.random();
                circle = new Circle(
                    WIDTH / 2 + Math.cos(a) * WIDTH,
                    HEIGHT / 2 + Math.sin(a) * WIDTH,
                    x,
                    y,
                    Math.random() * 6
                );
                circles.push(circle);
            }
        }
    }

    for (var b = 0; b < 10; b++) {
        box = new Box(
            WIDTH * Math.random(),
            HEIGHT * Math.random(),
            5,
            2,
            5 + Math.random() * 5
        );
        boxList.push(box);
    }
    btn.addEventListener('click', function (e) {
        if (!clickToggle) {
            btn.display(0);
            para.modifyText("");
            para.display(1);
            sendAjax("message.json", checkDrawCode);
        }
        clickToggle = true;
    });


    requestAnimationFrame(function loop() {
        requestAnimationFrame(loop);

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = 'white';

        ctx.globalCompositeOperation = 'lighter';

        for (var i = 0, len = circles.length; i < len; i++) {
            circle = circles[i];
            circle.update();
            circle.render(ctx);
        }

        for (var j = 0; j < boxList.length; j++) {
            box = boxList[j];
            box.update();
            box.render(ctx);
        }

    });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/less-loader/dist/cjs.js!./app.less", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/less-loader/dist/cjs.js!./app.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n* {\n  margin: 0;\n  padding: 0;\n}\nhtml,\nbody {\n  height: 100%;\n  position: relative;\n  width: 100%;\n}\nbody {\n  background: #eee;\n}\ncanvas {\n  background: white;\n  display: block;\n}\n#c {\n  left: 50%;\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n#con {\n  z-index: 10;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, 100px);\n}\n#ajax-btn {\n  width: 350px;\n  height: 100px;\n  margin: 0px auto;\n  background: #FBD971;\n  color: #E64C3C;\n  line-height: 100px;\n  text-align: center;\n  font-size: 60px;\n  border-radius: 50px;\n  box-shadow: inset 0 4px 5px #E64C3C, inset 0 -4px 5px #FB7B76, 0 5px 16px #F0C419;\n  text-shadow: 0 4px 5px #E64C3C;\n  transition: 0.1s;\n  animation: pulse 0.5s linear infinite;\n  border: 5px solid #fff;\n}\n#ajax-btn:link {\n  filter: saturate(100%);\n}\n#ajax-btn:visted {\n  filter: saturate(150%);\n}\n#ajax-btn:hover {\n  filter: saturate(150%);\n  box-shadow: inset 0 4px 5px #E64C3C, inset 0 -4px 5px #FB7B76, 0 2px 2px #F0C419;\n  transform: translate(0, 3px);\n}\n#ajax-btn:active {\n  filter: saturate(150%);\n  box-shadow: inset 0 4px 5px #E64C3C, inset 0 -4px 5px #FB7B76, 0 2px 2px #F0C419;\n  transform: translate(0, 3px);\n}\n#para {\n  color: #fff;\n  display: none;\n  animation: pulse 0.5s linear infinite;\n  font-size: 45px;\n  text-shadow: 0 3px 5px white;\n}\nh1 {\n  font-size: 50px;\n  text-shadow: 0px 4px 12px #fff;\n  color: #fff;\n  animation: pulse 0.5s linear infinite;\n  text-shadow: 0 3px 5px white;\n}\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n@keyframes tada {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n  10%,\n  20% {\n    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);\n  }\n  30%,\n  50%,\n  70%,\n  90% {\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);\n  }\n  40%,\n  60%,\n  80% {\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);\n  }\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n.imgs {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  animation: tada 1s linear infinite 4s;\n}\n.icon {\n  height: 300px;\n  width: 300px;\n  z-index: 1;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -70%);\n  display: none;\n}\n#hongbao {\n  transform: translate(-46%, -70%);\n}\n", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);