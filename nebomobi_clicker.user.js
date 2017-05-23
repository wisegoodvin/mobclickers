// ==UserScript==
// @name         Небоскребы: онлайн. Кликер
// @namespace    https://odkl.vnebo.mobi/
// @version      1.2
// @description  Поднимает посетителей на лифте, делает операции с этажами
// @author       GoodVin
// @match        *://*.vnebo.mobi/*
// @match        *://vnebo.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @icon         https://vnebo.mobi/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// jQuery plugins
jQuery.expr[':'].text = function(a, i, m) {
	return jQuery(a).text().replace(/\s/g,'').toLowerCase()
		.indexOf(m[3].replace(/\s/g,'').toLowerCase()) >= 0;
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
function go(url, timer1, timer2) {
	if(clicktimer) return false;
	if(empty(timer1)) timer1 = 500;
	if(empty(timer2)) timer2 = timer1;
    var time = rand(timer1, timer2);
	setTimeout(function(){ self.location.href = url; }, time);
	return false;
}

// клик
function cl(sel, timer1, timer2) {
	if(clicktimer) return false;
	var clickEvent = document.createEvent ('MouseEvents');
	clickEvent.initEvent ('click', true, true);
	if(timer1 === undefined) timer1 = 500;
	if(timer2 === undefined) timer2 = 750;
	setTimeout(function(){
		try {
			(sel instanceof jQuery ? sel[0] : sel).dispatchEvent (clickEvent);
		} catch(e) {
			self.location.reload();
		}
	}, rand(timer1, timer2));
	clicktimer = true;
	return false;
}

// функция для отключения кликера - прописывается в родное окно
unsafeWindow.endis = function() {
	GM_setValue("scriptenabled", !scriptenabled);
	self.location.reload();
}

$(function(){
	scriptenabled = GM_getValue("scriptenabled", true);
	// сначала добавляем кнопку
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(scriptenabled ? 'lime' : 'red')+';" onclick="endis();return false;" title="Включить / выключить кликер">[ в'+(scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!scriptenabled) return false;
	// развернуть этажи
	var explvl = $(".tdn:text(показать этажи)");
	if(explvl.length) return cl(explvl);

	// действия с этажами из холла
	if("/" == self.location.pathname || "/home" == self.location.pathname || /login\/?$/i.test(self.location.pathname)) {
		// есть какие-то действия
		var flrs = $(".tlbr a[href*='floor']:text(\()");
		if(flrs.length) return cl(flrs);
		// есть с пассажиры
		var elev = $(".tlbr a[href*='lift']:text(\()");
		if(elev.length) return cl(elev);
	}

	// действия с этажами
	if(/\/floors\//i.test(self.location.pathname) && $(".tower a.tdu").length) return cl($(".tower a.tdu")[0]);

	// действия с этажом
	if(/\/floor\//i.test(self.location.pathname)) {
		// закупки
		if($(".prd a.tdu:text(купить)").length) return cl($(".prd a.tdu:text(купить):last"));
	}

	// у лифта есть ожидающие
	if(/^\/lift/i.test(self.location.pathname)) {
		// закупки
		if($(".lift").length) {
			if($(".lift a.tdu:text(поднять)").length) return cl($(".lift a.tdu:text(поднять)"));
			if($(".lift a.tdu:text(чаевые)").length) return cl($(".lift a.tdu:text(чаевые)"));
		}
	}

	// таймер на обновления
	var timer = null;
	var flmin = '';
	$("span[id^='time']").each(function(i){
		var t = str2secs($(this).text());
		if(t > 0 && (empty(timer) || t < timer)) {
			timer = t;
			flmin = $(this).closest(".flbdy").prev().text().trim().replace(/\n/,' ');
		}
	});
	if(!$(".tower").length || empty(timer)) timer = 10;
	timer += 3;
	console.log('Никаких действий не предусмотрено. Установлен таймер перехода на главную страницу на '+timer+' сек.'+(!empty(flmin) ? ' (у этажа '+flmin+')' : ''));
	return go('/', timer * 1000);
});
