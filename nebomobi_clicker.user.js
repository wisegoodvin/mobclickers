// ==UserScript==
// @name		Небоскребы: онлайн. Кликер
// @namespace	https://odkl.vnebo.mobi/
// @version		2.3
// @description	Поднимает посетителей на лифте, делает операции с этажами
// @todo		asd
// @author		GoodVin
// @match		*://*.vnebo.mobi/*
// @match		*://vnebo.mobi/*
// @require		https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require		https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js
// @downloadURL	https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @updateURL	https://github.com/wisegoodvin/mobclickers/raw/master/nebomobi_clicker.user.js
// @icon		https://vnebo.mobi/favicon.ico
// @grant		unsafeWindow
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==

$(function(){
	// сначала добавляем кнопку
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;

	// развернуть этажи
	var explvl = $(".tdn:text(показать этажи)");
	if(explvl.length) return explvl.log("Разворачиваю этажи").cl();

	// действия с этажами из холла
	if(("/" == self.location.pathname && !/:floorPanel:/.test(self.location.href)) || "/home" == self.location.pathname || /login\/?$/i.test(self.location.pathname)) {
		console.log("Действия на главном экране");
		// есть выполненные задания
		var quests = $("a[href*='quest']").has("img[src*='quests']");
		if(quests.length) quests.log("О! Квестики!").cl();
		// есть какие-то действия с этажами
		var flrs = $(".tlbr a[href*='floor']:text(\()");
		if(flrs.length) return flrs.log("Есть действия с этажами (иконка рядом с лифтом под заголовком)").cl();
		// есть пассажиры
		var elev = $(".tlbr a[href*='lift']:text(\()");
		if(elev.length) return elev.log("Есть пассажиры").cl();
	}

	// действия с квестами
	if(/\/quests/i.test(self.location.pathname)) {
		console.log("Есть награда за квесты?");
		var q = $("a.btng:text(Получить награду)");
		if(q.length) return q.log("Забираю награду за квесты").cl();
		else return $(".hdr").log("Наград нет - возвращаюсь в холл").cl();
	}

	// действия с этажами
    var levels = $(".tower a.tdu:ortext(собрать|закупить|выложить)");
	if((/\/floors\//i.test(self.location.pathname) || /:floorPanel:/.test(self.location.href)) && levels.length) return levels.log("Действия с этажами (новые)").cl();

	// закупка товара
	if(/\/floor\//i.test(self.location.pathname) && $(".prd a.tdu:text(купить)").length) return $(".prd a.tdu:text(купить):last").log("Закупка товара").cl();

	// действия в лифте (холле)
	if(/^\/lift/i.test(self.location.pathname)) {
        console.log("Действия внутри лифта");
		// в лифте
		if($(".lift").length) {
			if($(".lift a.tdu:text(поднять)").length) return $(".lift a.tdu:text(поднять)").log("Поднимаю").cl();
            if($(".lift a.tdu:text(чаевые)").length) return $(".lift a.tdu:text(чаевые)").log("Чаевые").cl();
		}
	}

	// поднимаем людей
	if($("a.tdu:text(поднять на лифте)")) $("a.tdu:text(поднять на лифте)").log("Есть пассажиры - ВСЕ В ЛИФТ!").cl();

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
