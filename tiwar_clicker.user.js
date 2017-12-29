// ==UserScript==
// @name        Битва титанов. Кликер
// @namespace   https://ods.tiwar.mobi/
// @version     1.0
// @description Собирает золото, записывается на сражения + собирает доход, ходит в поход, спускается в пещеру, собирает награды в хижине мудреца
// @author      GoodVin
// @match       *://*.tiwar.mobi/*
// @match       *://tiwar.mobi/*
// @require     http://code.jquery.com/jquery-3.2.1.slim.min.js
// @require     https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js?version=2017.12.31.1
// @downloadURL https://github.com/wisegoodvin/mobclickers/raw/master/tiwar_clicker.user.js
// @updateURL   https://github.com/wisegoodvin/mobclickers/raw/master/tiwar_clicker.user.js
// @icon        https://ods.tiwar.mobi/favicon.ico?2
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==
unsafeWindow.$ = jQuery;
var today = ("00" + (new Date()).getYear()).slice(-2) + ("00" + ((new Date()).getMonth() + 1)).slice(-2) + ("00" + (new Date()).getDate()).slice(-2);
var time = parseInt(today + ("00" + (new Date()).getHours()).slice(-2) + ("00" + (new Date()).getMinutes()).slice(-2), 10);
var secs = Math.ceil(Date.now() / 1000);

(function() {
	// сначала добавляем кнопки
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;
	$('<a href="#" style="position:absolute;z-index:10000;top:30px;right:20px;font-size:10pt;color:'+(options.gold ? 'lime' : 'red')+';" onclick="tglbool(\'gold\');return false;" title="Включить / выключить сбор золота">[ сбор золота: в'+(options.gold ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:50px;right:20px;font-size:10pt;color:'+(options.campaign ? 'lime' : 'red')+';" onclick="tglbool(\'campaign\');return false;" title="Включить / выключить поход">[ поход: в'+(options.campaign ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:70px;right:20px;font-size:10pt;color:'+(options.fights ? 'lime' : 'red')+';" onclick="tglbool(\'fights\');return false;" title="Включить / выключить сражения (активные поля можно выбрать в разделе &quot;Сражения&quot;)">[ сражения: в'+(options.fights ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:90px;right:20px;font-size:10pt;color:'+(options.cave ? 'lime' : 'red')+';" onclick="tglbool(\'cave\');return false;" title="Включить / выключить пещеру">[ пещера: в'+(options.cave ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:110px;right:20px;font-size:10pt;color:'+(options.sage ? 'lime' : 'red')+';" onclick="tglbool(\'sage\');return false;" title="Включить / выключить хижину мудреца">[ хижина: в'+(options.sage ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(options.fights && '/fights/' == self.location.pathname) {
		$('<a href="#" style="position:absolute;z-index:10000;bottom:10px;right:20px;font-size:10pt;color:'+(options.fightundying ? 'lime' : 'red')+';" onclick="tglbool(\'fightundying\');return false;" title="Включить / выключить долину бессмертных">[ долина бессмертных: в'+(options.fightundying ? '' : 'ы')+'кл ]</a>').appendTo("body");
		$('<a href="#" style="position:absolute;z-index:10000;bottom:30px;right:20px;font-size:10pt;color:'+(options.fightking ? 'lime' : 'red')+';" onclick="tglbool(\'fightking\');return false;" title="Включить / выключить короля бессмертных">[ король бессмертных: в'+(options.fightking ? '' : 'ы')+'кл ]</a>').appendTo("body");
		$('<a href="#" style="position:absolute;z-index:10000;bottom:50px;right:20px;font-size:10pt;color:'+(options.fightaltars ? 'lime' : 'red')+';" onclick="tglbool(\'fightaltars\');return false;" title="Включить / выключить древние алтари">[ древние алтари: в'+(options.fightaltars ? '' : 'ы')+'кл ]</a>').appendTo("body");
		$('<a href="#" style="position:absolute;z-index:10000;bottom:70px;right:20px;font-size:10pt;color:'+(options.fighttournament ? 'lime' : 'red')+';" onclick="tglbool(\'fighttournament\');return false;" title="Включить / выключить дуэльный турнир">[ дуэльный турнир: в'+(options.fighttournament ? '' : 'ы')+'кл ]</a>').appendTo("body");
		$('<a href="#" style="position:absolute;z-index:10000;bottom:90px;right:20px;font-size:10pt;color:'+(options.fightclan ? 'lime' : 'red')+';" onclick="tglbool(\'fightclan\');return false;" title="Включить / выключить клановый турнир">[ клановый турнир: в'+(options.fightclan ? '' : 'ы')+'кл ]</a>').appendTo("body");
		$('<a href="#" style="position:absolute;z-index:10000;bottom:110px;right:20px;font-size:10pt;color:'+(options.fightleague ? 'lime' : 'red')+';" onclick="tglbool(\'fightleague\');return false;" title="Включить / выключить лигу мастеров">[ лига мастеров: в'+(options.fightleague ? '' : 'ы')+'кл ]</a>').appendTo("body");
		$('<span style="position:absolute;z-index:10000;bottom:130px;right:20px;font-size:10pt;color:white;">Выберите активные сражения:</span>').appendTo("body");
	}

    // главный экран
	if('/' == self.location.pathname) {
		// хижина мудреца
		if(options.sage && $("a:text(хижина мудреца (+))").length) return $("a:text(хижина мудреца (+))").cl();
		// обменник золота
		if(options.gold && $("a:text(получить золото (+))").length) return go('/trade/exchange');
		// поход
		if(options.campaign && $("a:text(поход (+))").length) return $("a:text(поход (+))").cl();
		// сражения
		if(options.fights && secs - options.fightslastcheck >= 7140 && $("a:text(сражения (+))").length) return go('/fights/');
		// пещера
		if(options.cave && $("a:text(пещера (+))").length) return $("a:text(пещера (+))").cl();

		// таймер на пещеру
		var timer = $('a:text(пещера ()').text().match(/\((\d+(:\d+(:\d+)?)?)\)/)[1].split(':').reverse(),
			t = (parseInt(timer[2] || 0) * 60 * 60) + (parseInt(timer[1] || 0) * 60) + parseInt(timer[0]);
		console.log('Действий нет - запускаем таймер пещеры на ' + t + ' секунд');
		return go('/', (t + 2) * 1000);
	}

	// обменник золота
	if(options.gold && /^\/trade\/exchange/.test(self.location.pathname)) {
		console.log('Обменник золота');
		if($('a[href*="exchange/silver"]').length) return $('a[href*="exchange/silver"]:first').cl({log: 'Меняем серебро на золото'});
		return go('/');
	}

	// поход
	if(options.campaign && /^\/campaign/.test(self.location.pathname)) {
		console.log('В походе');
		if($('a:text(в поход)').length) return $('a:text(в поход)').cl();
		if($('a:text(начать бой)').length) return $('a:text(начать бой)').cl();
		if($('a:text(атаковать монстра)').length) return $('a:text(атаковать монстра)').cl();
		if($('a:text(закончить бой)').length) return $('a:text(закончить бой)').cl();
		if($('a:text(получить награду)').length) return $('a:text(получить награду)').cl();
		if($(".center:text(новый поход через)").length) return go('/');
		// ДОПИСАТЬ!
	}

	// пещера
	if(options.cave && /^\/cave/.test(self.location.pathname)) {
		console.log('Пещера');
		if($('a:text(начать добычу),a:text(новый поиск)').length) return $('a:text(начать добычу),a:text(новый поиск)').cl();
		if($('a:text(напасть)').length) return $('a:text(напасть)').cl();
		if($('a:text(обратно в пещеру)').length) return $('a:text(обратно в пещеру)').cl();
		return go('/');
	}

	// хижина мудреца
	if(options.sage && /^\/sage/.test(self.location.pathname)) {
		console.log('Хижина мудреца - главная страница');
		if($('a:text(реликвии (+))').length) return $('a:text(реликвии (+))').cl();
		if($('a:text(задания (+))').length) return $('a:text(задания (+))').cl();
		return go('/');
	}
	// хижина мудреца - задания
	if(options.sage && /^\/quest/.test(self.location.pathname)) {
		console.log('Хижина мудреца - задания');
		if($(".block_outer.center:text(коллекции (+))").length) return go('/relic/');
		if($('a:text(получить награду)').length) return $('a:text(получить награду):first').cl();
		return go('/');
	}
	// хижина мудреца - реликвии
	if(options.sage && /^\/relic/.test(self.location.pathname)) {
		console.log('Хижина мудреца - реликвии');
		if($('a:text(забрать)').length) return $('a:text(забрать):first').cl();
		return go('/');
	}

	// сражения
	if(options.fights) {
		// список сражений
		if('/fights/' == self.location.pathname) {
			console.log('Проверяем доступные сражения');
			if(options.fightundying && $('a:text(долина бессмертных) .green').length) return $('a:text(долина бессмертных)').cl({log:'Идём в долину бессмертных'});
			if(options.fightking && $('a:text(король бессмертных) .green').length) return $('a:text(король бессмертных)').cl({log:'Идём на короля бессмертных'});
			// всё проверили - выходим
			console.log('Нет доступных сражений - выходим на главную страницу');
			setvar('fightslastcheck', secs);
			return go('/', 10000);
		}
		// долина бессмертных
		if(/^\/undying/.test(self.location.pathname)) {
			console.log('Долина бессмертных');
			if($('a:text(подать заявку)').length) return $('a:text(подать заявку)').cl({log:'Подаём заявку'});
			if($(':text(битва начнется через)').length) return go('/fights/');
		}
		// король бессмертных
		if(/^\/king/.test(self.location.pathname)) {
			console.log('Король бессмертных');
			if($('a:text(подать заявку)').length) return $('a:text(подать заявку)').cl({log:'Подаём заявку'});
			if($(':text(битва начнется через)').length) return go('/fights/');
		}
	}

	// таймер на 30 секунд
	console.log('Не известное место - вернуться на главный экран через 30 секунд');
	return go('/', 30000);
})();
