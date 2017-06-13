// ==UserScript==
// @name         Колхоз. Кликер
// @namespace    https://odkl.kolhoz.mobi/
// @version      1.5
// @description  Высаживает, поливает, удобряет и продаёт растения
// @author       GoodVin
// @match        *://*.kolhoz.mobi/*
// @match        *://kolhoz.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require      https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js?v=06.06.2017.1
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         http://kolhoz.mobi/favicon.ico
// ==/UserScript==
unsafeWindow.$ = jQuery;
//console.log(navigator);

$(function(){
	// сначала добавляем кнопки
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ скрипт: в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;
	$('<a href="#" style="position:absolute;z-index:10000;top:30px;right:20px;font-size:10pt;color:'+(options.ambarsell ? 'lime' : 'red')+';" onclick="tglbool(\'ambarsell\');return false;" title="Включить / выключить продажи из амбара (шанс - 10%)">[ автопродажи: в'+(options.ambarsell ? '' : 'ы')+'кл ]</a>').appendTo("body");

	// кончилось бабло
	if($("a:text(продать товар из амбара)").length) {
		console.log("Не хватает денег на покупку семян/удобрений!");
		if(options.ambarsell) return cl($("a:text(продать товар из амбара)"));
		else return false;
	}

	if($("a:text(всё)").length) $("a:text(всё)").log("Действия по ссылке ВСЁ").cl();

	// действия на главном экране
	$(".block .ptm > ul > li a").each(function(){
		// покупку грядки пропускаем
		if(hastxt(this, "купить")) return false;
		// сбор урожая
		if(hastxt(this, "собрать")) return cl(this, 250, 300);
		// вскапывание
		if(hastxt(this, "вскопать")) return cl(this, 250, 300);
		// посадка растения (надо выбрать заранее)
		if(hastxt(this, "посадить")) return cl(this, 250, 300);
		// поливка
		if(hastxt(this, "полить")) return cl(this, 250, 300);
		// удобрение (надо выбрать заранее)
		if(hastxt(this, "применить")) return cl(this, 250, 300);
	});
    if(clicktimer) return false;

    if(options.ambarsell) {
        // вход в амбар (шанс зайти туда - 10%)
        if(1 == rand(1, 10)) return go('/warehouse');
        // действия в амбаре
        if('/warehouse' == self.location.pathname) {
            console.log('Продажа из амбара');
            $(".block a").each(function(){ if(hastxt(this, "продать")) return cl(this); });
            if(hastxt(".block", "амбар пуст")) return go('/');
        }
        if(clicktimer) return false;
    }

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
        mintime += 5;
        console.log('Никаких действие не сделано - запущен таймер на '+mintime+' сек. до ближайшего действия.');
        return go("/", mintime * 1000);
    }

	if(/Error/i.test(self.location.href) || /actionsBlock/i.test(self.location.href)) {
		console.log("Мы на странице с ошибкой - запущен таймер на переход к основному окну");
		return go('/', rand(3000,5000));
	}
});
