// ==UserScript==
// @name		Разрушители. Кликер
// @namespace	https://odkl.mrush.mobi/
// @version		1.2.3
// @description	Сражается на арене, мочит квестовых боссов, собирает задания, продаёт шмотки, ходит в набег
// @todo		Колизей и вторжение
// @author		GoodVin
// @match		*://*.mrush.mobi/*
// @match		*://mrush.mobi/*
// @require		https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require		https://raw.githubusercontent.com/wisegoodvin/mobclickers/master/shared_functions.js
// @downloadURL	https://raw.githubusercontent.com/wisegoodvin/mobclickers/master/mrushmobi_clicker.user.js
// @updateURL	https://raw.githubusercontent.com/wisegoodvin/mobclickers/master/mrushmobi_clicker.user.js
// @icon		https://static.mrush.mobi/view/image/icons/favicon.png?1
// @grant		unsafeWindow
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==
//unsafeWindow.$ = jQuery;
var today = ("00" + (new Date()).getYear()).slice(-2) + ("00" + ((new Date()).getMonth() + 1)).slice(-2) + ("00" + (new Date()).getDate()).slice(-2);
var time = parseInt(today + ("00" + (new Date()).getHours()).slice(-2) + ("00" + (new Date()).getMinutes()).slice(-2), 10);

$(function(){
	// сначала добавляем кнопку
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;

	// Ошибка?
	if($("div:text(кликаете слишком быстро)").length) return go('/', 1000,1500);

	// На главной странице
	if('/' == self.location.pathname) {
		console.log('На главной странице');
		if($("a:text(набег):text(+):visible").length) return $("a:text(набег):text(+):visible").cl({log:'Пошли в набег',timer1:1000,timer2:1500});
		if($("a[href*='lair']:visible").length) return $("a[href*='lair']:visible").cl({log:'Пошли в пещеру',timer1:1000,timer2:1500});
		if($("a:text(на арену):visible").length) return $("a:text(на арену):visible").cl({log:'Пошли на арену',timer1:1000,timer2:1500});
		if($("a:text(мой герой):text(+):visible").length) return go('/chest',1000,1500);
		if($("a:text(задания):text(+):visible").length) return $("a:text(задания):text(+):visible").cl({log:'Надо собрать задания',timer1:1000,timer2:1500});
		if(options.invasiondate != today) return go('/invasion',1000,1500);
		if($('span:text(откроется через)').length) {
			var min = null;
			$('span:text(откроется через)').each(function(){
				var timer = str2secs2(this.textContent);
				if(min === null || timer < min) min = timer;
			});
			if(min > 600) min = 600;
			console.log('Перезагрузка страницы через '+min+' сек');
			return reload(min * 1000);
		} else {
			var timer = rand(540, 660);
			console.log('Таймеры не найдены. Возврат на главную страницу через '+timer+' секунд');
			return go('/', timer * 1000);
		}
	}

	// набег
	if(self.location.pathname == '/travel') {
		console.log('В набеге');
		if($("a:text(напасть):visible").length) return $("a:text(напасть):visible").cl({log:'Нападаем',timer1:1000,timer2:1500});
		if($("a:text(атаковать):visible").length) return $("a:text(атаковать):visible").cl({log:'Бьём',timer1:1000,timer2:1500});
		if($("a:text(новый набег):visible").length) return $("a:text(новый набег):visible").cl({log:'Новый набег',timer1:1000,timer2:1500});
		if($("a[href*='go_travel']:last:visible").length) return $("a[href*='go_travel']:last:visible").cl({log:'В новый набег',timer1:1000,timer2:1500});
		return go('/', 1000,1500);
	}

	// задания
	if(self.location.pathname == '/task/daily') {
		console.log('Сбор ежедневных заданий');
		if($('a:text(забрать):visible').length) return $('a:text(забрать):visible').cl({log:'Забираем награду',timer1:1000,timer2:1500});
		if($("a:text(сюжетные):text(+):visible").length) return $("a:text(сюжетные):text(+):visible").cl({timer1:1000,timer2:1500});
		return go('/', 1000,1500);
	}
	if(self.location.pathname == '/task') {
		console.log('Сбор сюжетных заданий');
		if($('a:text(забрать):visible').length) return $('a:text(забрать):visible').cl({log:'Забираем награду',timer1:1000,timer2:1500});
		if($("a:text(ежедневные):text(+):visible").length) return $("a:text(ежедневные):text(+):visible").cl({timer1:1000,timer2:1500});
		return go('/', 1000,1500);
	}

	// арена
	if(self.location.pathname == '/arena') {
		console.log('На арене');
		if($("a:text(атаковать):visible").length) return $("a:text(атаковать):visible").cl({log:'Валим чувака',timer1:1000,timer2:1500});
		return go('/chest', 1000,1500);
	}

	// квесты
	if(self.location.pathname == '/lair') {
		console.log('Квесты');
		if($('a.red:text(атак):visible').length) return $('a.red:text(атак):visible').cl({log:'Валим босса',timer1:1000,timer2:1500});
		if($('a.red:text(бой):visible').length) return $('a.red:text(бой):visible').cl({log:'Валим босса',timer1:1000,timer2:1500});
		if($("a:text(забрать награду):visible").length) return $("a:text(забрать награду)").cl({log:'Забираем награду',timer1:1000,timer2:1500});
		return go('/chest', 1000,1500);
	}

	// продажа шмоток
	if(self.location.pathname == '/chest') {
		console.log('Продажа шмоток');
		if($(".cnr.bg_blue").length) {
			if($("a[href*='join_all_item']:visible").length) return $("a[href*='join_all_item']:visible").cl({log:'Разбираем шмотки',timer1:1000,timer2:1500});
			if($("a[href*='deleteItem']:visible").length) return $("a[href*='deleteItem']:visible:first").cl({log:'Выбрасываем шмотку',timer1:1000,timer2:1500});
		}
		return go('/', 1000,1500);
	}

	// вторжение
	if(self.location.pathname == '/invasion') {
		console.log('Вторжение');
		// не написан сбор награды
		if($("a:text(вступить в отряд):visible").length) return $("a:text(вступить в отряд):visible").cl({timer1:1000,timer2:1500});
		if($("a:text(забрать награду):visible").length) return $("a:text(забрать награду):visible").cl({timer1:1000,timer2:1500});
		if($("div:text(бой начнется через):visible").length) {
			console.log("Бой сегодня был - выходим");
			setvar('invasiondate', today);
			return go('/', 1000,1500);
		}
		return go('/', 1000,1500);
	}

	// хз куда попали - редирект на начальную страницу через 30 секунд
	console.log('Мы на неизвестной странице. Уходим на начальную через 30 секунд');
	return go('/', 30000);
});
