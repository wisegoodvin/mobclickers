// ==UserScript==
// @name		Разрушители. Кликер
// @namespace	https://odkl.mrish.mobi/
// @version		1.0
// @description	Сражается на арене, мочит квестовых боссов, собирает задания, продаёт шмотки, ходит в набег
// @todo		Колизей и вторжение
// @author		GoodVin
// @match		*://*.mrush.mobi/*
// @match		*://mrush.mobi/*
// @require		https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require		https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js
// @downloadURL	https://github.com/wisegoodvin/mobclickers/raw/master/mrushmobi_clicker.user.js
// @updateURL	https://github.com/wisegoodvin/mobclickers/raw/master/mrushmobi_clicker.user.js
// @icon		https://static.mrush.mobi/view/image/icons/favicon.png?1
// @grant		unsafeWindow
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==
unsafeWindow.$ = jQuery;

function str2secs2(str) {
	str = str.toLowerCase();
	var res = 0;
	var a = str.split(' ');
	if(!a.length) return res;
	for(var i=0;i<a.length;i++) {
		var sub = a[i].trim();
		if(!sub) continue;
		if((re = /^(\d+)([дчмс])/i.exec(sub))) {
			if('д' == re[2]) res += parseInt(re[1]) * 86400;
			else if('ч' == re[2]) res += parseInt(re[1]) * 3600;
			else if('м' == re[2]) res += parseInt(re[1]) * 60;
			else if('с' == re[2]) res += parseInt(re[1]);
		} else {
			if(isNaN(sub)) continue;
			try {
				var l = a[i+1].substring(0,1);
				if('д' == l) res += parseInt(a[i]) * 86400;
				else if('ч' == l) res += parseInt(a[i]) * 3600;
				else if('м' == l) res += parseInt(a[i]) * 60;
				else if('с' == l) res += parseInt(a[i]);
			} catch(e) { res += 0; }
		}
	}
	return res;
}

$(function(){
	// сначала добавляем кнопку
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;

	// Ошибка?
	if($("div:text(кликаете слишком быстро)").length) return go('/', 3000, 5000);

	// На главной странице
	if('/' == self.location.pathname) {
		console.log('На главной странице');
		if($("a:text(набег):text(+)").length) return $("a:text(набег):text(+)").cl({log:'Пошли в набег'});
		if($("a[href*='lair']").length) return $("a[href*='lair']").cl({log:'Пошли в пещеру'});
		if($("a:text(на арену)").length) return $("a:text(на арену)").cl({log:'Пошли на арену'});
		if($("a:text(мой герой):text(+)").length) return go('/chest');
		if($("a:text(задания):text(+)").length) return $("a:text(задания):text(+)").cl({log:'Надо собрать задания'});
		if($('span:text(откроется через)').length) {
			var min = null;
			$('span:text(откроется через)').each(function(){
				var timer = str2secs2(this.textContent);
				if(min === null || timer < min) min = timer;
			});
			console.log('Перезагрузка страницы через '+min+' сек');
			return reload(min * 1000);
		} else {
			var timer = rand(300000, 450000);
			console.log('Таймеры не найдены. Перезагрузка страницы через '+timer+' секунд');
			return reload(timer);
		}
	}

	// набег
	if(self.location.pathname == '/travel') {
		console.log('В набеге');
		if($("a:text(напасть)").length) return $("a:text(напасть)").cl({log:'Нападаем'});
		if($("a:text(атаковать)").length) return $("a:text(атаковать)").cl({log:'Бьём'});
		if($("a:text(новый набег)").length) return $("a:text(новый набег)").cl({log:'Новый набег'});
		if($("a[href*='go_travel']:last").length) return $("a[href*='go_travel']:last").cl({log:'В новый набег'});
		go('/', 3000, 5000);
	}

	// задания
	if(self.location.pathname == '/task/daily') {
		console.log('Сбор ежедневных заданий');
		if($("a[href*='Reward']").length) return $("a[href*='Reward']:first").cl({log:'Забираем награду'});
		if($("a:text(сюжетные):text(+)").length) return $("a:text(сюжетные):text(+)").cl();
		go('/', 3000, 5000);
	}
	if(self.location.pathname == '/task') {
		console.log('Сбор сюжетных заданий');
		if($("a[href*='Reward']").length) return $("a[href*='Reward']:first").cl({log:'Забираем награду'});
		if($("a:text(ежедневные):text(+)").length) return $("a:text(ежедневные):text(+)").cl();
		go('/', 3000, 5000);
	}

	// арена
	if(self.location.pathname == '/arena') {
		console.log('На арене');
		if($("a:text(атаковать)").length) return $("a:text(атаковать)").cl({log:'Валим чувака'});
		go('/', 3000, 5000);
	}

	// квесты
	if(self.location.pathname == '/lair') {
		console.log('Квесты');
		if($("a[href*='action=attack'].red").length) return $("a[href*='action=attack'].red:first").cl({log:'Валим босса'});
		if($("a:text(забрать награду)").length) return $("a:text(забрать награду)").cl({log:'Забираем награду'});
		go('/', 3000, 5000);
	}

	// продажа шмоток
	if(self.location.pathname == '/chest') {
		console.log('Продажа шмоток');
		if($(".cnr.bg_blue").length && $("a[href*='join_all_item']").length) return go('/join_all_item');
		go('/', 3000, 5000);
	}
});
