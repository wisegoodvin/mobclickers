// jQuery plugins
jQuery.expr[':'].text = function(a, i, m) {
	return jQuery(a).text().replace(/\s/g,'').toLowerCase()
		.indexOf(m[3].replace(/\s/g,'').toLowerCase()) >= 0;
};
jQuery.expr[':'].notext = function(a, i, m) {
	return jQuery(a).text().replace(/\s/g,'').toLowerCase()
		.indexOf(m[3].replace(/\s/g,'').toLowerCase()) < 0;
};
jQuery.expr[':'].ortext = function(a, i, m) {
	var texts = m[3].split('|');
	for(var i = 0; i < texts.length; i++)
		if(jQuery(a).text().replace(/\s/g,'').toLowerCase().indexOf(texts[i].replace(/\s/g,'').toLowerCase()) >= 0)
			return jQuery(a);
};
jQuery.expr[':'].ornottext = function(a, i, m) {
	var texts = m[3].split('|');
	var ret = true;
	for(var i = 0; i < texts.length; i++)
		if(jQuery(a).text().replace(/\s/g,'').toLowerCase().indexOf(texts[i].replace(/\s/g,'').toLowerCase()) >= 0)
			ret = false;
	if(ret) return jQuery(a);
};
jQuery.fn.cl = function( options ) {
	var cfg = $.extend({
		log: null,
		timer1 : 500,
		timer2 : 750
	}, options );
	if(this.length) {
		var ths = this[0];
		if(clicktimer) return false;
		var clickEvent = document.createEvent ('MouseEvents');
		clickEvent.initEvent ('click', true, true);
		if(null !== cfg.log) console.log(cfg.log);
		if(navigator.onLine) {
			setTimeout(function(){
			try {
				ths.dispatchEvent (clickEvent);
			} catch(e) {
				self.location.reload();
			}
			}, rand(cfg.timer1, cfg.timer2));
			clicktimer = true;
		} else console.error("Offline!");
		return false;
	} else return false;
};
jQuery.fn.log = function( text ) {
	console.log(text);
	return this;
};

var clicktimer = false;
// разные мелкие функции
function rand(num1, num2) { return Math.round(Math.random() * (num2 - num1) + num1); }
function hastxt(sel, txt) { return $(sel).text().toLowerCase().replace(/\s/g,'').indexOf(txt.toLowerCase().replace(/\s/g,'')) > -1; }
function isUndef(elem) { return typeof elem == "undefined"; }
function empty(txt) { return (isUndef(txt) || txt === '' || txt === null); }
function str2secs(str) {
	str = str.toLowerCase();
	var res = 0;
	var a = str.split(' ');
	if(!a.length) return res;
	for(i=0;i<a.length;i+=2) {
		try {
			var l = a[i+1].substring(0,1);
				 if('ч' == l) res += parseInt(a[i],10) * 3600;
			else if('м' == l) res += parseInt(a[i],10) * 60;
			else if('с' == l) res += parseInt(a[i],10);
		} catch(e) { res += 0; }
	}
	return res;
}

// обновление страницы
function reload(timer1, timer2) {
	if(clicktimer) return false;
	if(empty(timer1)) timer1 = 10;
	if(empty(timer2)) timer2 = timer1;
	var time = rand(timer1, timer2);
	if(navigator.onLine) {
		setTimeout(function(){ self.location.reload(); }, time);
	} else console.error("Offline2!");
	return false;
}

// переход по адресу
function go(url, timer1, timer2) {
	if(clicktimer) return false;
	if(empty(timer1)) timer1 = 500;
	if(empty(timer2)) timer2 = timer1;
	var time = rand(timer1, timer2);
	if(navigator.onLine) {
		setTimeout(function(){ self.location.href = url; }, time);
	} else console.error("Offline3!");
	return false;
}

// клик
function cl(sel, timer1, timer2) {
	if(clicktimer) return false;
	var clickEvent = document.createEvent ('MouseEvents');
	clickEvent.initEvent ('click', true, true);
	if(timer1 === undefined) timer1 = 500;
	if(timer2 === undefined) timer2 = 750;
	if(navigator.onLine) {
		setTimeout(function(){
			try {
				(sel instanceof jQuery ? sel[0] : sel).dispatchEvent (clickEvent);
			} catch(e) {
				self.location.reload();
			}
		}, rand(timer1, timer2));
		clicktimer = true;
	} else console.error("Offline4!");
	return false;
}

// основной объект с настройками
var options = {scriptenabled: true};

// функция сохраняет переменную
function setvar(name, val) {
	options[name] = val;
	GM_setValue("options", options);
}

// функция для отключения кликера - прописывается в родное окно
unsafeWindow.tglbool = function(varname) {
	if(empty(varname)) return console.error("Необходимо указать переменную!");
	setvar(varname, !options[varname]);
	self.location.reload();
}

// удаление элемента из массива
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
}

// инициализация массива с настройками
$(function(){ options = GM_getValue("options", options); });
