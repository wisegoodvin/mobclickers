// ==UserScript==
// @name         Небоскребы: онлайн. Кликер
// @namespace    https://odkl.vnebo.mobi/
// @version      0.1
// @description  Поднимает посетителей на лифте (пока что)
// @author       GoodVin
// @include      https://odkl.vnebo.mobi/*
// @match        https://odkl.vnebo.mobi/*
// @require      http://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @grant        none
// ==/UserScript==

var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!==null&&d.addEventListener("load",b),c!==null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("//code.jquery.com/jquery-3.2.1.slim.min.js", function() {
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

	// установка переменных
	var othermatch = false;
	// поднимаем людей на лифте (клик на кнопке в холле)
	if($('a.tdn').has('.amount').length) {
		cl($('a.tdn').has('.amount'));
	}
	// клик на ссылке "поднять на этаж"
	if($('a.tdu').length) {
		$('a.tdu').each(function(){
			var txt = $(this).text();
			if(txt.indexOf("Поднять лифт") > -1) cl($(this));
		});
	}
	// клик на ссылке "получить чаевые"
	if($('a.tdu').length) {
		$('a.tdu').each(function(){
			var txt = $(this).text();
			if(txt.indexOf("Получить чаевые") > -1) cl($(this));
		});
	}
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
	// и в самом конце - рефреш через рандомное время
	if (/\/home/.test(self.location.href)) {
		var t = $(".vs .flbdy .flst .amount").text().split(" ");
		if(t.length) {
			var secs = 3;
			if(t.length == 4) secs = secs + parseInt(t[0], 10) * 60 + parseInt(t[2], 10);
			else if('м' == t[1].substring(0,1)) secs = secs + parseInt(t[0], 10) * 60;
			else secs = secs + parseInt(t[0], 10);
			console.log('Wait timer started to '+secs+' secs!');
			setTimeout(function(){ self.location.reload(); }, secs * 1000/*Math.random() * (35000 - 25000) + 25000*/);
		}
	}
});
