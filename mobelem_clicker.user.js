// ==UserScript==
// @name        Повелители стихий. Кликер
// @namespace   https://ok.elem.mobi/
// @version     2.1
// @description Проводит дуэли и арены
// @author      GoodVin
// @match       *://*.elem.mobi/*
// @match       *://elem.mobi/*
// @require     http://code.jquery.com/jquery-3.2.1.slim.min.js
// @require     https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js?version=01.06.2017.1
// @downloadURL https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @updateURL   https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @icon        https://elem.mobi/img/favicon.ico
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==
unsafeWindow.$ = jQuery;
var othertimeractivated = false;

// функция вычисления дамага у пары карт
this.getdmg = function(idx) {
	if(empty(idx)) idx = 0;
	// пара не найдена?
	if(!$(".w3card").length || !$(".w3card:eq("+idx+")").length) return false;
	var pair = $(".w3card:eq("+idx+")");
	// на паре таймер - выходим
	if(pair.text().replace(/\s{2,}/g,' ').indexOf("с") > -1) return false;
	// вычисляем пару переменных для быстрого обращения
	var res = {mdmg: 0, multi: 0, hdmg: 0, mcard: 0, hcard: 0, pair: pair, link: pair.find("a:has(.sw):eq(1)"), dmg: 0};
	var nums = pair.text().replace("x","").replace(/\s{2,}/g,' ').trim().split(" ");
	// распределяем дамаги и множитель
	res.mcard = parseInt(nums[2], 10);
	res.hcard = parseInt(nums[0], 10);
	res.multi = parseFloat(nums[1]);
	res.mdmg = Math.round(res.mcard * res.multi);
	res.hdmg = Math.round(res.hcard * (2 - res.multi));
	res.dmg = res.mdmg - res.hdmg;
	// возврат
	return res;
};

// проведение дуэли
function attack() {
	console.log("Идёт дуэль");
	// определяем переменные
	var card = null;
	var maxcard = null;

	// цикл по картам
	for(i = 0; i < 3; i++) {
		card = getdmg(i);
		if(empty(maxcard) || maxcard.dmg < card.dmg) maxcard = card;
	}

	// кликаем
	return maxcard.link.cl();
}

// проведение арены
function attack2() {
	console.log('Идёт бой');
	// определяем переменные
	var cards = [];
	var maxcard = null;
	var maxdmg = null;
	var was15 = false;

	// цикл по картам
	for(i = 0; i < 3; i++) {
		cards[i] = getdmg(i);
		if(!cards[i]) continue;
		if(maxdmg === null || maxdmg < cards[i].dmg) {
			maxcard = cards[i];
			maxdmg = cards[i].dmg;
			if(cards[i].multi > 1) was15 = true;
		}
	}

	// вычисляем максимальное количество смен игроков
	var enemys = /\d+/.exec($(".cntr.small:text(враги:)").text());
	//var maxhops = parseInt(enemys[0], 10);
	var maxhops = 2;	// для теста ставим максимум 2 прыжка

	// все карты на столе потрачены - ждём
	if(maxcard === null) {
		setvar("hops", 0);
		return $("a.btn:text(обновить)").cl({log: "Нет карт - обновляемся через 2 секунды", timer1: 2000});
	}

	// найдена карта с рейтингом 1.5
	if((maxdmg > 0 && was15) || (options.hops <= maxhops && was15)) {
		setvar("hops", 0);
		return maxcard.link.cl({log: "Была карта с рейтингом 1.5 - кликаем по ней", timer1 :100, timer2: 250});
	}
	// карты с 1.5 не найдены - меняем противника
	else {
		if(empty(options.hops)) options.hops = 0;
		// проверяем хопы - ещё моно переключиться
		if(options.hops <= maxhops) {
			console.log("Хопы ещё есть");
			// кнопка смены противника активна
			if($("a:text(сменить):notext(карты)").length) {
				setvar("hops", ++options.hops);
				return $("a:text(сменить):notext(карты)").cl({log: "Меняем противника (пока есть на кого)", timer1: 100, timer2: 250});
			}
			// противники кончились
			else {
				setvar("hops", 0);
				return maxcard.link.log("Нельзя менять противника - кнопка не активна. Кликаем по карте с максимальным дамагом").cl();
			}
		// всё, кликаем на той где есть
		} else {
			setvar("hops", 0);
			return maxcard.link.log("Хопы кончились (перебрали всех противников) - кликаем прям тут").cl();
		}
	}
}

// основные действия
$(function(){
	// сначала добавляем кнопки
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;
	$('<a href="#" style="position:absolute;z-index:10000;top:30px;right:20px;font-size:10pt;color:'+(!options.noarena ? 'lime' : 'red')+';" onclick="tglbool(\'noarena\');return false;" title="Включить / выключить автоарену">[ арена: в'+(!options.noarena ? '' : 'ы')+'кл ]</a>').appendTo("body");

	// действия для дуэлей
	if(/^\/duel\//.test(self.location.pathname)) {
		// идёт бой
		if($(".w3card").length) return attack();

		// бой окончен - предложение вступить в дуэль ещё раз
		if($(".cntr a:not(.orange):text(еще дуэль)").length) return $(".cntr a:not(.orange):text(еще дуэль)").log("Выбираем ещё дуэль").cl();
		// перерыв в дуэлях
		if($(".fttl:text(перерыв в дуэлях)").length) return $(".small[onclick]").log("Дуэли закончились - возвращаемся на главную страницу").cl();
		// Новая дуэль
		if($(".cntr .be .lbl:text(Новая дуэль)").length) return $(".cntr .btn").log("Новая дуэль").cl();
		// напасть
		if($(".cntr a:not(.grey):text(напасть)").length) {
			// ищем более слабого противника
			if($(".cntr.small").has("a[href*='tobattle']").length) {
				var hp1 = parseInt($("div.small[onclick] .c_da").text().trim().replace(/\s/g,''), 10);
				var hp2 = parseInt($(".cntr.small").has("a[href*='tobattle']").find(".c_da").text().trim().replace(/\s/g, ''), 10);
				if(hp1 > 0 && hp2 > 0 && hp1 - hp2 < 5000) {
					console.log('Ищем слабого противника');
					return reload(500);
				}
			}
			return $(".cntr a:not(.grey):text(напасть)").log("Нападаем на слабого противника").cl();
		}
		// смена противника - перезагрузка страницы
		else return $(".cntr a:text(искать еще)").log("Противник слишком сильный - ищем другого. Или просто обновляем страницу").cl();
	}

	// действия в корне
	if("/" == self.location.pathname) {
		console.log("Действия на главной странице");
		// дуэли активны
		if($(".bttn.duels:text(дуэли:)").length) return $(".bttn.duels").log("Дуэли активы").cl();
		// арена активна
		else if(!options.noarena && $("a[href*='surv']:text(арена)").length) return $("a[href*='surv']:text(арена)").log("Заходим на арену").cl();
		// таймер на дуэли/прочие действия
		else {
			// таймер на дуэли
			if($("#duels_restore_time").length) {
				var ar = $("#duels_restore_time").text().split(" ");
				var secs = 5;
				for(i = 0; i < ar.length; i += 2) {
					if(ar[i+1] == 'ч') secs += parseInt(ar[i], 10) * 3600;
					if(ar[i+1] == 'м') secs += parseInt(ar[i], 10) * 60;
					if(ar[i+1] == 'с') secs += parseInt(ar[i], 10);
					if(ar[i+1] == 'c') secs += parseInt(ar[i], 10);
				}
				console.log('Установлен таймер на '+secs+' секунд до начала дуэлей!');
				othertimeractivated = true;
				setTimeout(function(){ return $("#duels_restore_time").closest("a").cl(); }, secs * 1000);
			} else {
				console.log("Прочие действия");
				// прочие действия на главном экране
				if($(".fttl:eq(0):text(ежедневная)").length) return $("a[href*='dailyreward']").log("Получаем ежедневную награду").cl();
			}
		}
	}

	// действия на арене
	if(/^\/survival\//.test(self.location.pathname) && !options.noarena) {
		console.log("Действия на арене");
		// идёт бой
		if($(".w3card").length) return attack2();
		// запись
		if($("a[href*='survival/join']:text(запис)").length) {
			// перекидываемся на главный экран
			if(options.arenas >= 20) {
				setvar('arenas',0);
				return $(".small[onclick]").log('Прошло 20 боёв - надо проверить не активировались ли дуэли').cl();
			}
			// записываемся, предварительно увеличив счётчик арен
			if(empty(options.arenas)) options.arenas = 0;
			setvar('arenas', ++options.arenas);
			return $("a[href*='survival/join']:text(запис)").log("Записываемся в очередь на бой").cl();
		}
		// ожидание боя
		if($(".c_fe:text(бой начнется через)").length) {
			console.log("Стоим в очереди на начало боя");
			reload(3000);
			return false;
		}
		// сдох
		if($(".end .txt:text(вы пали)").length) return $("a.btn:text(обновить)").cl({log: "Сдох! Ждём конца боя", timer1: 5000});
		// ошибка
		if($(".msg.red:text(бой не существует)").length) return $("a[href*='surv']:text(арен)").log('Какая-то ошибка - возвращаемся на арену').cl();
	}

	// прочие действия
	if(!othertimeractivated) {
		console.log('Хз чё делать - переход на главный экран через 5 секунд');
		return go('/', 5000);
	}
});
