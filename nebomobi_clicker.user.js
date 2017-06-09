// ==UserScript==
// @name         Небоскребы: онлайн. Кликер
// @namespace    https://odkl.vnebo.mobi/
// @version      2.2.1
// @description  Поднимает посетителей на лифте, делает операции с этажами
// @author       GoodVin
// @match        *://*.vnebo.mobi/*
// @match        *://vnebo.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require      https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @icon         https://vnebo.mobi/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

$(function(){
	// сначала добавляем кнопку
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;

	// развернуть этажи
	var explvl = $(".tdn:text(показать этажи)");
	if(explvl.length) return cl(explvl);

	// действия с этажами из холла
	if(("/" == self.location.pathname && !/:floorPanel:/.test(self.location.href)) || "/home" == self.location.pathname || /login\/?$/i.test(self.location.pathname)) {
		console.log("Действия на главном экране");
		// есть выполненные задания
		var quests = $("a[href*='quest']").has("img[src*='quests']");
		if(quests.length) cl(quests);
		// есть какие-то действия с этажами
		var flrs = $(".tlbr a[href*='floor']:text(\()");
		if(flrs.length) return cl(flrs);
		// есть пассажиры
		var elev = $(".tlbr a[href*='lift']:text(\()");
		if(elev.length) return cl(elev);
	}

	// действия с квестами
	if(/\/quests/i.test(self.location.pathname)) {
		console.log("Есть награда за квесты?");
		var q = $("a.btng:text(Получить награду)");
		if(q.length) return cl(q[0]);
		else return cl($(".hdr"));
	}

	// действия с этажами
	if((/\/floors\//i.test(self.location.pathname) || /:floorPanel:/.test(self.location.href)) && $(".tower a.tdu:notext(биржа)").length) {
		console.log("Действия с этажами");
		return cl($(".tower a.tdu:notext(биржа)")[0]);
	}

	// действия с этажом
	if(/\/floor\//i.test(self.location.pathname)) {
        	console.log("Действия на этажаме");
		// закупки
		if($(".prd a.tdu:text(купить)").length) {
			console.log("Закупка товара");
			return cl($(".prd a.tdu:text(купить):last"));
		}
	}

	// у лифта есть ожидающие
	if(/^\/lift/i.test(self.location.pathname)) {
        	console.log("Действия внутри лифта");
		// в лифте
		if($(".lift").length) {
			if($(".lift a.tdu:text(поднять)").length) {
                console.log("Пиднимаю");
                return cl($(".lift a.tdu:text(поднять)"));
            }
            if($(".lift a.tdu:text(чаевые)").length) {
                console.log("Чаевые");
                return cl($(".lift a.tdu:text(чаевые)"));
            }
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
