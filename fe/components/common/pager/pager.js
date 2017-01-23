/**
 * 翻页组件
 * @nuer @zh.l.y
 */

var $       = require('myapp:components/common/base/base.js'),
    uiClass = require('myapp:components/common/class/class.js'),
    PopTip  = require('myapp:components/common/pop-tip/pop-tip.js');


var Pager = uiClass(function (options) {

    $.extend(this, $.extend({
        target     : null,
        type       : 'ajax',
        totalCount : 0,
        totalPage  : 0,
        pageSize   : 10,
        callback   : null,
        pn         : 1
    }, options));

}).extend({

    init      : function () {
        this.currPage = this.pn || 1;
        //this.totalPage = 0;

        this.render();
        this.bindEvent();
    },
    render    : function () {
        this.check();
        if (isNaN(this.totalPage) || this.totalPage <= 1) {
            return;
        }
        var showNum   = 9,
            halfNum   = parseInt(showNum / 2),
            centerNum = this.currPage - halfNum,
            endNum    = centerNum + halfNum * 2;
        var data      = {
            currPage   : this.currPage,
            totalCount : this.totalCount,
            prevPage   : this.currPage - 1,
            nextPage   : this.currPage + 1,
            totalPage  : this.totalPage,
            showNum    : showNum,
            halfNum    : halfNum,
            centerNum  : centerNum,
            endNum     : endNum
        };
        if (data.currPage <= data.halfNum) {
            data.centerNum = 0;
            data.endNum    = data.endNum < data.totalCount ? data.showNum : data.totalCount;
        } else if (data.currPage + data.halfNum >= data.totalCount) {
            data.centerNum = data.totalCount - data.showNum + 1;
            data.endNum    = data.totalCount;
        }

        var tmpl = [];
        tmpl.push('<div class="pager">');
        if (data.prevPage < 1) {
            tmpl.push('<span class="prev"><i class="ico-prev">&lt;</i></span>');
        } else {
            tmpl.push('<a class="prev"><i class="ico-prev">&lt;</i></a>');
        }
        if (data.currPage >= data.showNum - 1) {
            tmpl.push('<a data-pn="1">1</a><span class="omission">...</span>');
        }
        for (var i = data.centerNum; i <= data.endNum; i++) {
            if (i <= 0 || i > data.totalPage) {
                continue;
            } else if (i === data.currPage) {
                tmpl.push('<span class="cur">' + i + '</span>');
            } else {
                tmpl.push('<a data-pn="' + i + '">' + i + '</a>');
            }
        }

        if (data.endNum < data.totalPage) {
            tmpl.push('<span class="omission">...</span>');
            tmpl.push('<a data-pn="' + data.totalPage + '">' + data.totalPage + '</a>');
        }

        if (data.nextPage > data.totalPage) {
            tmpl.push('<span class="next"><i class="ico-next">&gt;</i></span>');
        } else {
            tmpl.push('<a class="next"><i class="ico-next">&gt;</i></a>');
        }
        tmpl.push('<span>共' + data.totalPage + '页&nbsp;&nbsp;&nbsp;到</span><input type="text" class="jump" />');
        tmpl.push('<a class="btn btn-gray-line goto">确定</a>');
        tmpl.push('</div>');
        $(this.target).empty().append(tmpl.join(''));
    },
    bindEvent : function () {
        var thas = this;
        $(this.target).unbind('click').unbind('keyup').on('click', '.pager a[data-pn]', function (e) {
            e.preventDefault();
            e.stopPropagation();

            thas.to($(this).data('pn'));
        }).on('click', 'a.prev, a.next, a.goto', function (e) {
            e.stopPropagation();

            if ($(this).hasClass('goto')) {

                thas.to($.trim($(this).prevAll('.jump').val()));

            } else if ($(this).hasClass('prev')) {

                thas.prev();

            } else if ($(this).hasClass('next')) {

                thas.next();

            }
        }).on("keyup", ".jump", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var code = e.keyCode || e.which || e.charCode;
            if (code == 13) {
                //回车执行查询
                thas.to($.trim($(this).val()));
            }

        });
    },
    check     : function () {

        this.currPage   = parseInt(this.currPage);
        this.totalPage  = this.totalPage || parseInt((this.totalCount - 1) / this.pageSize) + 1;
        this.totalCount = this.totalCount || (this.totalPage * this.pageSize);
        if (this.currPage < 1) {
            this.currPage = 1;
        }
        if (this.totalPage < 1) {
            this.totalPage = 1;
        }
        if (this.currPage > this.totalPage) {
            this.currPage = this.totalPage;
        }

    },
    to        : function (pn) {
        if (!isNaN(parseInt(pn, 10))) {

            this.currPage = parseInt(pn, 10);
            if (this.type == "ajax") {
                this.render();
                this.callback && this.callback.call(this, this.currPage);
            } else {
                self.location.href = $.url.setParam(self.location.href, "pn", pn);
            }
        } else {
            PopTip("\u60a8\u4f20\u8f93\u7684\u9875\u7801\u6709\u8bef");
        }
    },
    prev      : function () {
        this.to(this.currPage - 1);
    },
    next      : function () {
        this.to(this.currPage + 1);
    }

});


module.exports = Pager;