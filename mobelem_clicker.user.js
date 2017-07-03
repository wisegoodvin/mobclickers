// ==UserScript==
// @name        Повелители стихий. Кликер
// @namespace   https://ok.elem.mobi/
// @version     3.0.1
// @description Проводит дуэли, арены, кампании, мочет урфина и собирает награды за задания
// @author      GoodVin
// @match       *://*.elem.mobi/*
// @match       *://elem.mobi/*
// @require     http://code.jquery.com/jquery-3.2.1.slim.min.js
// @require     https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js?version=03.07.2017.1
// @downloadURL https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @updateURL   https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @icon        https://elem.mobi/img/favicon.ico
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==
unsafeWindow.$ = jQuery;
var othertimeractivated = false;
var today = "" + (new Date()).getFullYear() + "-" + (new Date()).getMonth() + "-" + (new Date()).getDate();

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
	if(empty(nums[2])) {
		// кампания - дамаг врага не известен
		res.mcard = parseInt(nums[1], 10);
		res.hcard = 0;
		res.multi = 1;
		res.link = pair.find("a.card");
	} else {
		// арена/дуэль/урфин и тд
		res.mcard = parseInt(nums[2], 10);
		res.hcard = parseInt(nums[0], 10);
		res.multi = parseFloat(nums[1]);
	}
	res.mdmg = Math.round(res.mcard * res.multi);
	res.hdmg = Math.round(res.hcard * (2 - res.multi));
	res.dmg = res.mdmg - res.hdmg;
	// возврат
	return res;
};

// дуэли и кампании
function attack() {
	console.log("Идёт бой");
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
				return maxcard.link.log("Нельзя менять противника - кнопка не активна. Кликаем по карте с максимальным дамагом").cl({timer1: 100, timer2: 250});
			}
		// всё, кликаем на той где есть
		} else {
			setvar("hops", 0);
			return maxcard.link.log("Хопы кончились (перебрали всех противников) - кликаем прям тут").cl({timer1: 100, timer2: 250});
		}
	}
}

// урфин
function attack3() {
	console.log("Мочим урфиньего козла");
	// определяем переменные
	var card = null;
	var maxcard = null;
	var timer = false;

	// цикл по картам
	for(i = 0; i < 3; i++) {
		card = getdmg(i);
		if(!card) timer = true;
		if(empty(maxcard) || maxcard.dmg < card.dmg) maxcard = card;
	}

	// был таймер
	if(timer && maxcard.multi != 1.5) return $("a.btn.blue:text(обновить)").cl({timer1: 3000, log: 'Есть карты с таймером и нет с множителем 1.5 - ждём 3 секунды и обновляемся'});

	// кликаем по максимальной карте
	return maxcard.link.cl();
}

// основные действия
$(function(){
	// сначала добавляем кнопки
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;
	$('<a href="#" style="position:absolute;z-index:10000;top:30px;right:20px;font-size:10pt;color:'+(!options.noarena ? 'lime' : 'red')+';" onclick="tglbool(\'noarena\');return false;" title="Включить / выключить автоарену">[ арена: в'+(!options.noarena ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.noarena) $('<a href="#" style="position:absolute;z-index:10000;top:50px;right:20px;font-size:10pt;color:'+(options.arenatype ? 'lime' : 'red')+';" onclick="tglbool(\'arenatype\');return false;" title="Смена типа боёв на арене">[ тип арены: '+(options.arenatype ? 'квестовая' : 'постоянная')+' ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:70px;right:20px;font-size:10pt;color:'+(!options.nourfin ? 'lime' : 'red')+';" onclick="tglbool(\'nourfin\');return false;" title="Включить / выключить урфина">[ урфин: в'+(!options.nourfin ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:90px;right:20px;font-size:10pt;color:'+(!options.nocompany ? 'lime' : 'red')+';" onclick="tglbool(\'nocompany\');return false;" title="Включить / выключить прохождение компаний">[ компании: в'+(!options.nocompany ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:110px;right:20px;font-size:10pt;color:'+(!options.noquests ? 'lime' : 'red')+';" onclick="tglbool(\'noquests\');return false;" title="Включить / выключить сбор наград за квесты">[ сбор квестов: в'+(!options.noquests ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:130px;right:20px;font-size:10pt;color:'+(!options.noduels ? 'lime' : 'red')+';" onclick="tglbool(\'noduels\');return false;" title="Включить / выключить дуэли">[ дуэли: в'+(!options.noduels ? '' : 'ы')+'кл ]</a>').appendTo("body");

	// вылезла ежедневная награда
	if($("a[href*='dailyreward']").length) return $("a[href*='dailyreward']").log("Получаем ежедневную награду").cl();
	// инициализируем флаг арены
	if(empty(options.arenadone)) setvar("arenadone", {});
	if(!options.noarena && !options.arenatype) {
		options.arenadone[today] = false;
		setvar('arenadone', options.arenadone);
	}
	// новый день - сбрасываем переменные
	if(empty(options.lastactive) || options.lastactive != today) {
		setvar('arenas', 0);
		setvar('arenawins', 0);
		setvar('hops', 0);
		setvar('lastactive', today);
		options.arenadone[today] = false;
		setvar('arenadone', options.arenadone);
	}

	// действия в корне
	if("/" == self.location.pathname) {
		console.log("Действия на главной странице");
		// есть не взятые квесты
		if(!options.noquests && $(".bbtn a[href='/daily/'] img").length) $(".bbtn a[href='/daily/']").log("Есть не взятые квесты").cl();
		// урфин активен
		else if(!options.nourfin && $(".bttn.urfin:text(босс)").length) return $(".bttn.urfin").log("Урфин активен").cl();
		// кампания активна
		else if(!options.nocompany && $(".bttn.campaign:text(кампания:)").length) return $(".bttn.campaign").log("Кампания активна").cl();
		// дуэли активны
		else if(!options.noduels && $(".bttn.duels:text(дуэли:)").length) return $(".bttn.duels").log("Дуэли активы").cl();
		// арена активна
		else if(!options.noarena && !options.arenadone[today] && $("a[href*='surv']:text(арена)").length) return $("a[href*='surv']:text(арена)").log("Заходим на арену").cl();
		// таймеры
		else {
			// устанавливаем таймер на любое доступное действие
			var mintime = 0; // дефолтовый таймер на 7.5 минут (на всякий случай) - при инициализации 0
			var tm = 0;
			// дуэли
			if(!options.noduels && $("#duels_restore_time").length) {
				tm = str2secs($("#duels_restore_time").text());
				if(tm > 0 && (mintime === 0 || tm < mintime)) {
					mintime = tm;
					othertimeractivated = true;
				}
			}
			// урфин
			if(!options.nourfin && $("a.bttn.urfin:text(готовьтесь)").length) {
				tm = str2secs($("a.bttn.urfin").text());
				if(tm > 0 && (mintime === 0 || tm < mintime)) {
					mintime = tm;
					othertimeractivated = true;
				}
			}
			// кампания
			if(!options.nocompany && $("#dungeon_cooldown").length) {
				tm = str2secs($("#dungeon_cooldown").text());
				if(tm > 0 && (mintime === 0 || tm < mintime)) {
					mintime = tm;
					othertimeractivated = true;
				}
			}
			// дефолтовый таймер
			if(mintime === 0 || mintime > 300) mintime = 300;
			// запускаем таймер
			mintime += 5;
			console.log("Устанавливаем таймер на "+mintime+" секунд");
			return reload(mintime * 1000);
		}
	}

	// действия с квестами
	if(!options.noquests && /^\/daily\//.test(self.location.pathname)) {
		console.log("Ежедневные задания");
		if($("a.btn.orange:text(забрать)").length) return $("a.btn.orange:text(забрать)").log("Забираем награду").cl();
		else return go('/', 3000);
	}

	// действия в кампании
	if(!options.nocompany && /^\/dungeon\//.test(self.location.pathname)) {
		// экран с выбором кого бить
		if($("div.cpath a:text(бить)").length) return $("div.cpath a:text(бить):last").log("Валим босса").cl();
		// экран с картами
		if($(".w3card").length) return attack();
		// завалили босса
		else if($(".c_win:text(победа)").length && $("a.btn.green:text(кампания)").length) return $("a.btn.green:text(кампания)").cl();
		// нет действий в кампании - на главный экран
		else return go('/', 3000);
	}

	// действия для дуэлей
	if(!options.noduels && /^\/duel\//.test(self.location.pathname)) {
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
				if(hp1 > 0 && hp2 > 0 && hp1 - hp2 < 8000) {
					console.log('Ищем слабого противника');
					return reload(500);
				}
			}
			return $(".cntr a:not(.grey):text(напасть)").log("Нападаем на слабого противника").cl();
		}
		// смена противника - перезагрузка страницы
		else return $(".cntr a:text(искать еще)").log("Противник слишком сильный - ищем другого. Или просто обновляем страницу").cl();
	}

	// действия на арене
	if(!options.noarena && !options.arenadone[today] && /^\/survival\//.test(self.location.pathname)) {
		console.log("Действия на арене");
		// идёт бой
		if($(".w3card").length) return attack2();
		// запись
		if($("a[href*='survival/join']").length && !options.arenadone[today]) {
			// увеличиваем нужные счётчики
			if(options.arenatype) {
				if(empty(options.arenawins)) setvar('arenawins', 0);
				if($(".c_win:text(победи)").length) setvar('arenawins', options.arenawins + 1);
			}
			// перекидываемся на главный экран
			if(!options.arenatype && options.arenas >= 5) {
				setvar('arenas', 0);
				return $(".small[onclick]").log('Прошло 5 боёв - надо сходить на главный экран').cl();
			}
			// записываемся, предварительно увеличив счётчик арен
			if(empty(options.arenas)) options.arenas = 0;
			// ###############################
			if($(".c_ld_red:text(претенденты)").length) setvar('arenas', options.arenas + 1);
			// ###############################
			if(options.arenatype && options.arenas >= 10 && options.arenawins >= 5) {
				options.arenadone[today] = true;
				setvar('arenadone', options.arenadone);
				console.log("Квестовые арены закончены! Переходим на главный экран");
				return go('/', 5000);
			} else return $("a[href*='survival/join']").log("Записываемся в очередь на бой").cl();
		}
		// ожидание боя
		if($(".c_fe:text(бой начнется через)").length) {
			console.log("Стоим в очереди на начало боя");
			return reload(3000);
		}
		// сдох
		if($(".end .txt:text(вы пали)").length) return $("a.btn:text(обновить)").cl({log: "Сдох! Ждём конца боя", timer1: 5000});
		// ошибка
		if($(".msg.red:text(бой не существует)").length) return $("a[href*='surv']:text(арен)").log('Какая-то ошибка - возвращаемся на арену').cl();
	}

	// урфин
	if(!options.nourfin && /^\/urfin\//.test(self.location.pathname)) {
		console.log("Нашествие урфина");
		// босс убит - идём дальше
		if($("a[href*='urfin/next']").length) return $("a[href*='urfin/next']").log("Переходим к следующему боссу").cl();
		// конец игры
		if(hastxt(".gwar-win1", "армии урфина разбиты")) return go('/');
		// нападаем
		if($("a[href*='urfin/start']:notext(напасть сразу)").length) return $("a[href*='urfin/start']:notext(напасть сразу)").log("Нападаем на преспешника урфина").cl();
		// бой
		if($(".w3card").length) return attack3();
		// меня убили
		if($(".c_silver:text(босс жив, а вы нет)").length && $("a.btn:text(далее)").length) return $("a.btn:text(далее)").log("Убит!").cl();
		// дошли до сюда - значит начался таймер - возвращаемся на главную страницу
	}

	// прочие действия
	if(!othertimeractivated) {
		console.log('Хз чё делать - переход на главный экран через 5 секунд');
		return go('/', 5000);
	}
});
