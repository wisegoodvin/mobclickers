// ==UserScript==
// @name         Повелители стихий. Кликер
// @namespace    https://ok.elem.mobi/
// @version      1.0b
// @description  Проводит дуэли (пока что)
// @author       GoodVin
// @match        *://*.elem.mobi/*
// @match        *://elem.mobi/*
// @require      http://code.jquery.com/jquery-3.2.1.slim.min.js
// @require      https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @icon         https://elem.mobi/img/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
jQuery.fn.cl = function( options ) {
	var cfg = $.extend({
		timer1 : 500,
		timer2 : 750
	}, options );
	if(this.length) {
		var ths = this[0];
		if(clicktimer) return false;
		var clickEvent = document.createEvent ('MouseEvents');
		clickEvent.initEvent ('click', true, true);
		setTimeout(function(){
			try {
				ths.dispatchEvent (clickEvent);
			} catch(e) {
				self.location.reload();
			}
		}, rand(cfg.timer1, cfg.timer2));
		clicktimer = true;
		return false;
	} else return false;
};


unsafeWindow.$ = jQuery;
unsafeWindow.hastxt = hastxt;

function attack() {
	// сейчас идёт бой
	var cards = [];
	$(".w3card").each(function(i){
		var txt = $(this).text().replace(/\s{2,}/g," ").trim().split(" ");
		cards[i] = [parseInt(txt[0],10), parseFloat(txt[2]), parseInt(txt[3]), this];
	});
	// ищем карты с рейтингом 1.5
	var idx15 = -1;
	var idx1  = -1;
	var idx05 = -1;
	var dmg = 0;
	for(i=0;i<3;i++) if(cards[i][1] == 1.5) {
		// ищем пару с максимальным уроном
		if(idx15 == -1) idx15 = i;
		else {
			dmg = cards[i][2] - cards[i][0];
			if(dmg > (cards[idx15][2] - cards[idx15][0])) idx15 = i;
		}
	}
	if(idx15 >= 0) {
		console.log('Максимальный урон, наносимый при рейтинге 1.5 будет у пары №'+(idx15+1)+': '+(cards[idx15][2]-cards[idx15][0]));
		return cl($(cards[idx15][3]).find("a:eq(1)"));
	}
	// ищем карты с рейтингом 1
	if(idx15 == -1) {
		for(i=0;i<3;i++) if(cards[i][1] == 1) {
			// ищем пару с максимальным уроном
			if(idx1 == -1) idx1 = i;
			else {
				dmg = cards[i][2] - cards[i][0];
				if(dmg > (cards[idx1][2] - cards[idx1][0])) idx1 = i;
			}
		}
		if(idx1 >= 0) {
			console.log('Максимальный урон, наносимый при рейтинге 1 будет у пары №'+(idx1+1)+': '+(cards[idx1][2]-cards[idx1][0]));
			return cl($(cards[idx1][3]).find("a:eq(1)"));
		}
		// ищем карты с рейтинго 0.5 с наименьшим уроном по игроку
		if(idx1 == -1) {
			for(i=0;i<3;i++) {
				// ищем пару с максимальным уроном
				if(idx05 == -1) idx05 = i;
				else {
					dmg = cards[i][2] - cards[i][0];
					if(dmg > (cards[idx05][2] - cards[idx05][0])) idx05 = i;
				}
			}
		}
		if(idx05 >= 0) {
			console.log('Максимальный урон, наносимый при рейтинге 0.5 будет у пары №'+(idx05+1)+': '+(cards[idx05][2]-cards[idx05][0]));
			return cl($(cards[idx05][3]).find("a:eq(1)"));
		}
	}
}

function setvar(name, val) {
	options[name] = val;
	GM_setValue("options", options);
}

function attack2() {
	var cards = [];
	var maxcard = null;
	var maxdmg = null;
	var was15 = false;
	for(i=0;i<3;i++) {
		cards[i] = getdmg(i);
		if(!cards[i]) continue;
		if(maxdmg === null || maxdmg < cards[i].dmg) {
			maxcard = cards[i];
			maxdmg = cards[i].dmg;
			if(cards[i].multi > 1) was15 = true;
		}
	}
	var enemys = /\d+/.exec($(".cntr.small:text(враги:)").text());
	var maxhops = parseInt(enemys[0], 10);

	if(maxcard === null) {
		setvar("hops", 0);
		console.log("Нет карт - обновляемся через 2 секунды");
		setTimeout(function(){ $("a.btn:text(обновить)").cl(); }, 2000);
		return false;
	}
	if((maxdmg > 0 && was15) || (options.hops <= maxhops && was15)) {
		console.log("Были карты с рейтингом 1.5 - кликаем по ним (ней)");
		setvar("hops", 0);
		return maxcard.link.cl();
	} else {
		if(empty(options.hops)) options.hops = 0;
        console.log(options.hops,maxhops);
		// проверяем хопы - ещё моно переключиться
		if(options.hops <= maxhops) {
			console.log("Хопы ещё есть");
			if($("a:text(сменить):notext(карты)").length) {
                setvar("hops", options.hops+1);
				console.log("Меняем противника (пока есть на кого)");
				return $("a:text(сменить):notext(карты)").cl({timer1:100,timer2:250});
			} else {
				console.log("Нельзя менять противника - кнопка не активна. Кликаем по карте с максимальным дамагом");
				setvar("hops", 0);
				return maxcard.link.cl({timer1:3000,timer2:3000});
			}
		// всё, кликаем на той где есть
		} else {
			console.log("Хопы кончились (перебрали всех противников) - кликаем прям тут");
			setvar("hops", 0);
			return maxcard.link.cl();
		}
	}
}

unsafeWindow.getdmg = this.getdmg = function(idx) {
	if(empty(idx)) idx = 0;
	if(!$(".w3card").length || !$(".w3card:eq("+idx+")").length) return false;
	var pair = $(".w3card:eq("+idx+")");
	if(pair.text().replace(/\s{2,}/g,' ').indexOf("с") > -1) return false;
	var res = {mdmg: 0, multi: 0, hdmg: 0, mcard: 0, hcard: 0, pair: pair, link: pair.find("a:has(.sw):eq(1)"), dmg: 0};
	var nums = pair.text().replace("x","").replace(/\s{2,}/g,' ').trim().split(" ");
	res.mcard = res.mdmg = parseInt(nums[2], 10);
	res.hcard = res.hdmg = parseInt(nums[0], 10);
	res.multi = parseFloat(nums[1]);
	if(res.multi > 1) {
		res.mdmg += Math.round(res.mdmg / 2);
		res.hdmg -= Math.round(res.hdmg / 2);
	} else if(res.multi < 1) {
		res.mdmg -= Math.round(res.mdmg / 2);
		res.hdmg += Math.round(res.hdmg / 2);
	}
	res.dmg = res.mdmg - res.hdmg;
	return res;
};

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
		if($(".cntr a:not(.orange):text(еще дуэль)").length) {
			console.log("Выбираем ещё дуэль");
			return cl($(".cntr a:not(.orange):text(еще дуэль)"));
		}
		// перерыв в дуэлях
		if(hastxt(".fttl", "перерыв в дуэлях")) {
			console.log("Дуэли закончились - возвращаемся на главную страницу");
			return cl($(".small[onclick]"));
		}
		// Новая дуэль
		if(hastxt(".cntr .be .lbl", "Новая дуэль")) {
			console.log("Новая дуэль");
			return cl($(".cntr .btn"));
		}
		// напасть
		if($(".cntr a:not(.grey):text(напасть)").length) {
			console.log("Нападаем на слабого противника");
			return cl($(".cntr a:not(.grey):text(напасть)"));
		}
		// смена противника - перезагрузка страницы
		else {
			console.log("Противник слишком сильный - ищем другого. Или просто обновляем страницу");
			return cl($(".cntr a:text(искать еще)"));
		}
	}

	// действия в корне
	if("/" == self.location.pathname) {
		// дуэли активны
		if($(".bttn.duels:text(дуэли:)").length) return cl($(".bttn.duels"));
		else if(!options.noarena) return $("a[href*='surv']:text(арена)").cl();
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
				setTimeout(function(){ return cl($("#duels_restore_time").closest("a")); }, secs * 1000);
			} else {
				// прочие действия на главном экране
				if($(".fttl:eq(0):text(ежедневная)").length) return $("a[href*='dailyreward']").cl();
			}
		}
	}

	// действия на арене
	if(/^\/survival\//.test(self.location.pathname) && !options.noarena) {
		if(options.arenas >= 20) return $(".small[onclick]").cl();
		// запись
		if($("a[href*='survival/join']:text(запис)").length) {
            console.log("Записываемся в очередь на бой");
			if(empty(options.arenas)) options.arenas = 0;
			options.arenas += 1;
			GM_setValue("options", options);
			$("a[href*='survival/join']:text(запис)").cl();
		}
		if($(".c_fe:text(бой начнется через)").length) {
            console.log("Стоим в очереди на начало боя");
            setTimeout(function(){ self.location.reload(); }, 3000);
        }
		if($(".w3card").length) return attack2();
		if($(".end .txt:text(вы пали)").length) {
            console.log("Сдох! Ждём конца боя");
			setTimeout(function(){ $("a.btn:text(обновить)").cl(); }, 5000);
			return false;
		}
		if($(".msg.red:text(бой не существует)").length) $("a[href*='surv']:text(арен)").cl();
	}
});
