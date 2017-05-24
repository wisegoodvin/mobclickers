// ==UserScript==
// @name         Колхоз. Кликер
// @namespace    https://odkl.kolhoz.mobi/
// @version      1.1
// @description  Высаживает, поливает, удобряет и продаёт растения
// @author       GoodVin
// @match        *://*.kolhoz.mobi/*
// @match        *://kolhoz.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require      https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js?v=1
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         http://kolhoz.mobi/favicon.ico
// ==/UserScript==

$(function(){
	scriptenabled = GM_getValue("scriptenabled", true);
	// сначала добавляем кнопку
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(scriptenabled ? 'lime' : 'red')+';" onclick="endis();return false;" title="Включить / выключить кликер">[ в'+(scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!scriptenabled) return false;
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
