// ==UserScript==
// @name         Небоскребы: онлайн. Кликер
// @namespace    https://odkl.vnebo.mobi/
// @version      0.2
// @description  Поднимает посетителей на лифте (пока что)
// @author       GoodVin
// @include      https://odkl.vnebo.mobi/*
// @match        https://odkl.vnebo.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @grant        none
// ==/UserScript==

// клик
function cl(sel, timer1, timer2) {
	var clickEvent = document.createEvent ('MouseEvents');
	clickEvent.initEvent ('click', true, true);
	if(timer1 === undefined) timer1 = 500;
	if(timer2 === undefined) timer2 = 750;
	setTimeout(function(){
		sel.each(function(){
			this.dispatchEvent (clickEvent);
		});
	}, Math.random() * (timer2 - timer1) + timer1);
}

$(function(){

	// действия в лифте
	if (/^\/lift/.test(self.location.pathname)) {
		// клик на ссылке "поднять на этаж"
		if($('a.tdu').length) {
			$('a.tdu').each(function(){
				var txt = $(this).text();
				if(txt.toLowerCase().indexOf("поднять лифт") > -1) cl($(this));
			});
		}
		// клик на ссылке "получить чаевые"
		if($('a.tdu').length) {
			$('a.tdu').each(function(){
				var txt = $(this).text();
				if(txt.toLowerCase().indexOf("получить чаевые") > -1) cl($(this));
			});
		}
	}

	// действия в холле
	if (/^\/home/.test(self.location.pathname) || /login\/?$/.test(self.location.pathname)) {
		// развернуть этажи
		/*if($('a.nshd').length) {
			$('a.nshd').each(function(){
				var txt = $(this).text();
				if(txt.indexOf("Показать этажи") > -1) cl($(this));
			});
		}*/
		// в холле - заказ товара
		// в холле - выкладка товара
		// в холле - забрать бабки за товар
		// поднимаем людей на лифте (клик на кнопке в холле)
		if($('a.tdn').has('.amount').length) {
			cl($('a.tdn').has('.amount'));
		}
		// и в самом конце - рефреш через определённое время
		var t = $(".vs .flbdy .flst .amount").text().split(" ");
		if(t.length) {
			var secs = 3;
			if(t.length == 4) secs = secs + parseInt(t[0], 10) * 60 + parseInt(t[2], 10);
			else if('м' == t[1].substring(0,1)) secs = secs + parseInt(t[0], 10) * 60;
			else secs = secs + parseInt(t[0], 10);
			console.log('Запущен таймер ожидания посетителей на '+secs+' секунд.');
			setTimeout(function(){ self.location.reload(); }, secs * 1000);
		}
	}
});
