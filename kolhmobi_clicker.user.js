// ==UserScript==
// @name         Колхоз. Кликер
// @namespace    https://odkl.kolhoz.mobi/
// @version      1.0
// @description  Высаживает, поливает, удобряет и продаёт растения
// @author       GoodVin
// @match        *://*.kolhoz.mobi/*
// @match        *://kolhoz.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @grant        none
// @icon         http://kolhoz.mobi/favicon.ico
// ==/UserScript==

var clicktimer = false;
// прочие мелкие функции
function rand(num1, num2) { return Math.round(Math.random() * (num2 - num1) + num1); }
function hastxt(sel, txt) { return $(sel).text().toLowerCase().replace(/\s/g,'').indexOf(txt.toLowerCase().replace(/\s/g,'')) > -1; }
function isUndef(elem) { return typeof elem == "undefined"; }
function empty(txt) { return (isUndef(txt) || txt === '' || txt === null); }
function str2secs(str) {
	str = str.toLowerCase();
	var res = 0;
	var a = str.split(' ');
	for(i=0;i<a.length;i+=2) {
		var l = a[i+1].substring(0,1);
			 if('ч' == l) res += parseInt(a[i],10) * 3600;
		else if('м' == l) res += parseInt(a[i],10) * 60;
		else if('с' == l) res += parseInt(a[i],10);
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
	if(empty(timer1)) timer1 = 500;
	if(empty(timer2)) timer2 = timer1;
	setTimeout(function(){ (sel instanceof jQuery ? sel[0] : sel).dispatchEvent (clickEvent); }, rand(timer1, timer2));
	clicktimer = true;
	return false;
}

$(function(){
	// сначала добавляем кнопку
	
	// действия на главном экране
	$(".block .ptm > ul > li a").each(function(){
		// покупку грядки пропускаем
		if(hastxt(this, "купить")) return false;
		// сбор урожая
		if(hastxt(this, "собрать")) return cl(this);
		// вскапывание
		if(hastxt(this, "вскопать")) return cl(this);
		// посадка растения (надо выбрать заранее)
		if(hastxt(this, "посадить")) return cl(this);
		// поливка
		if(hastxt(this, "полить")) return cl(this);
		// удобрение (надо выбрать заранее)
		if(hastxt(this, "применить")) return cl(this);
	});
    if(clicktimer) return false;

    // вход в амбар (шанс зайти туда - 10%)
    if(1 == rand(1, 10)) return go('/warehouse');
    // действия в амбаре
    if('/warehouse' == self.location.pathname) {
        console.log('Продажа из амбара');
        $(".block a").each(function(){ if(hastxt(this, "продать")) return cl(this); });
        if(hastxt(".block", "амбар пуст")) return go('/');
    }
    if(clicktimer) return false;

    // запуск таймера
    var txt = $(".ptm > ul > li").text().toLowerCase().replace(/\n/g,' ').replace(/\r/g,'').replace(/\s{1,}/g,' ').trim();
    if(!empty(txt)) {
        const timeregex = /(\d+\s+(?:ч|м|с)[а-яё\s]+)?\d+\s(?:ч|м|с)/g;
        var mintime = null;
        var idx = 0;
        while((res = timeregex.exec(txt)) !== null) {
            if (res.index === timeregex.lastIndex) timeregex.lastIndex++;
            if(empty(res[0])) continue;
            var t = str2secs(res[0]);
            if(empty(mintime) || t < mintime) mintime = t;
        }
        mintime += 3;
        console.log('Никаких действие не сделано - запущен таймер на '+mintime+' сек. до ближайшего действия.');
        return go("/", mintime * 1000);
    }
});
