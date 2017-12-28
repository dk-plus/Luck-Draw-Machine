
require("./app.less");
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