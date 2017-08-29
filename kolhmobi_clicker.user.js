// ==UserScript==
// @name         Колхоз. Кликер
// @namespace    https://odkl.kolhoz.mobi/
// @version      2.3
// @description  Высаживает, поливает, удобряет, кормит животный, продаёт растения, окучивает ранчо, открывает сундуки и собирает карты
// @author       GoodVin
// @match        *://*.kolhoz.mobi/*
// @match        *://kolhoz.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require      https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         http://kolhoz.mobi/favicon.ico
// ==/UserScript==
unsafeWindow.$ = jQuery;
//console.log(navigator);
var today = ("00" + (new Date()).getYear()).slice(-2) + ("00" + ((new Date()).getMonth() + 1)).slice(-2) + ("00" + (new Date()).getDate()).slice(-2);
var time = parseInt(today + ("00" + (new Date()).getHours()).slice(-2) + ("00" + (new Date()).getMinutes()).slice(-2), 10);

$(function(){
	// сначала добавляем кнопки
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ скрипт: в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;
	$('<a href="#" style="position:absolute;z-index:10000;top:30px;right:20px;font-size:10pt;color:'+(options.sellertype ? 'lime' : 'red')+';" onclick="tglbool(\'sellertype\');return false;" title="Тип продаж: умные (вкл, после кормёжки (если вкл), раз в сутки) / простые (выкл, шанс - 10%)">[ тип продаж: '+(options.sellertype ? 'умн' : 'прост')+' ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:50px;right:20px;font-size:10pt;color:'+(options.feeder ? 'lime' : 'red')+';" onclick="tglbool(\'feeder\');return false;" title="Включить / выключить обслуживание загонов (раз в сутки или при окончании бабла)">[ автозагоны: в'+(options.feeder ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:70px;right:20px;font-size:10pt;color:'+(options.rubys ? 'lime' : 'red')+';" onclick="tglbool(\'rubys\');return false;" title="Включить / выключить обмен денег на рубины (2 раза в сутки)">[ обмен рубинов: в'+(options.rubys ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:90px;right:20px;font-size:10pt;color:'+(options.cardcollector ? 'lime' : 'red')+';" onclick="tglbool(\'cardcollector\');return false;" title="Включить / выключить сбор карточек на овощебазе (каждые 3 часа +- пара минут)">[ сбор карт: в'+(options.cardcollector ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:110px;right:20px;font-size:10pt;color:'+(options.rancho ? 'lime' : 'red')+';" onclick="tglbool(\'rancho\');return false;" title="Включить / выключить ранчо">[ ранчо: в'+(options.rancho ? '' : 'ы')+'кл ]</a>').appendTo("body");

	// кончилось бабло
	if($("a:text(продать товар из амбара)").length) {
		console.log("Не хватает денег на покупку семян/удобрений!");
		if(!options.sellertype) return $("a:text(продать товар из амбара)").cl();
		else {
			if(options.feeder) {
				setvar('feeddate', '');
				return go('/mypetfarm');
			} else {
				setvar('feeddate', '');
				setvar('selldate', '');
				return go('/warehouse');
			}
		}
	}

    if($("a:text(вскопать)").length) return $("a:text(вскопать)").log("КОПАЙ!").cl();
	if($("a:text(всё)").length) return $("a:text(всё)").log("Действия по ссылке ВСЁ").cl();

	// действия на главном экране
	$(".block .ptm > ul > li a").each(function(){
		// вскапывание
		if(hastxt(this, "вскопать")) return cl(this, 250, 300);
	});
    if(clicktimer) return false;

	// простые продажи
    if(!options.sellertype) {
        // вход в амбар (шанс зайти туда - 10%)
        if(1 == rand(1, 10)) return go('/warehouse');
        // действия в амбаре
        if('/warehouse' == self.location.pathname) {
            console.log('Продажа из амбара');
            if($(".block a:text(продать)").length) return $(".block a:text(продать)").cl(this);
            if($(".block:text(амбар пуст)").length) return go('/');
        }
        if(clicktimer) return false;
    }
	// умные продажи
	else {
		if(empty(options.selldate) || today != options.selldate) {
			if(options.feeddate == today || !options.feeder) {
				if('/warehouse' == self.location.pathname) {
					if($(".block a:text(продать)").length) return $(".block a:text(продать)").cl();
					if($(".block .title:text(ключ)").length) return $(".block a:text(открыть):first").cl();
					if($(".block:text(амбар пуст)").length) {
						setvar('selldate', today);
						return go('/');
					}
				} else return go('/warehouse');
			} else if('/mypetfarm' != self.location.pathname) return go('/mypetfarm');
		} else if('/warehouse' == self.location.pathname) return go('/myfarm');
	}

	// кормёжка
	if(options.feeder && (empty(options.feeddate) || options.feeddate != today)) {
		if('/mypetfarm' == self.location.pathname) {
			if($(".feedbackPanelERROR:text(не хватает)").length) {
				setvar('feeddate', today);
				console.log("Кончились продукты");
				return go('/myfarm');
			}
			else if($("a[href*='harvest']:text(продать)").length) return $("a[href*='harvest']:text(продать)").log("Продаём звериную хрень").cl();
			else if($("a[href*='food']:text(покормить)").length) return $("a[href*='food']:text(покормить)").log("Надо выбрать корм для скотинки").cl();
			else if($("a[href*='lastFood']:text(покормить)").length) return $("a[href*='lastFood']:text(покормить)").log("Кормим скотинку").cl();
			else if($("a[href*='fruits']:text(кормить)").length) return $("a[href*='fruits']:text(кормить)").log("Выбираем первую попавшуюся жрачку").cl();
			else {
				setvar('feeddate', today);
				return go('/myfarm');
			}
		} else return go('/mypetfarm');
	}

	// обмен рубинов
	if(options.rubys && (empty(options.rubysdate) || 720 <= time - options.rubysdate)) {
		if('/converter' == self.location.pathname) {
			if($("a[href*='convertAllRubyLink']").length) return $("a[href*='convertAllRubyLink']").log("Конвертируем все доступные рубины").cl();
			else {
				setvar('rubysdate', time);
				return go('/myfarm');
			}
		} else return go('/converter');
	}

	// сбор карт
	if(options.cardcollector && (empty(options.cardtime) || time - options.cardtime >= 181)) {
		if('/queue' == self.location.pathname) {
			if($("a.btny[href*='open']").length) $("a.btny[href*='open']").log("Открываем доступный сундук").cl();
			else {
				setvar('cardtime', time);
				return go('/myfarm');
			}
		}
		else if('/reward' == self.location.pathname && $("a:text(продолжить)").length) $("a:text(продолжить)").log("Забираем карты").cl();
		else return go('/queue');
	}

	// ранчо
	if(options.rancho && /AmericanSelectSeedPage/i.test(self.location.href)) {
		console.log('Ранчо - выбор растения');
		var all = $("img[src*='afarm']").toArray(), dis = $("img[style*='opacity']").toArray(), allow = [];
		for(var i=0, l=all.length; i<l; i++) if(dis.indexOf(all[i]) < 0) allow.push(all[i]);
		if(allow.length) return $(allow[allow.length - 1]).closest("a").cl();
		else return go('/');
	}
	if(options.rancho && $("a[href*='rancho']").parent().find("span.title").length && /farm/i.test(self.location.pathname)) return go('/rancho');
	if('/rancho' == self.location.pathname) {
		console.log('Ранчо');
		if($("a:text(собрать)").length) return $("a:text(собрать)").log("Собираем уражай").cl();
		if($("a:text(выбрать)").length) return $("a:text(выбрать)").log("Выбираем растение").cl();
		if($("a:text(посадить)").length) return $("a:text(посадить)").log("Сажаем растение").cl();
		return go('/');
	}

    // запуск таймера
    var txt = $(".ptm > ul > li").text().toLowerCase().replace(/\n/g,' ').replace(/\r/g,'').replace(/\s{1,}/g,' ').trim();
    if(!empty(txt)) {
        const timeregex = /(\d+\s+(?:д|ч|м|с)[а-яё\s]+)?\d+\s(?:ч|м|с)/g;
        var mintime = null;
        var idx = 0;
        while((res = timeregex.exec(txt)) !== null) {
            if (res.index === timeregex.lastIndex) timeregex.lastIndex++;
            if(empty(res[0])) continue;
            var t = str2secs(res[0]);
            if(empty(mintime) || t < mintime) mintime = t;
        }
		if(options.rancho && mintime > 60) mintime = 60;
        else mintime += 5;
        console.log('Никаких действие не сделано - запущен таймер на '+mintime+' сек. до ближайшего действия.');
        return go("/", mintime * 1000);
    }

	// ошибка
	if(/Error/i.test(self.location.href) || /actionsBlock/i.test(self.location.href)) {
		console.log("Мы на странице с ошибкой - запущен таймер на переход к основному окну");
		return go('/', rand(3000,5000));
	}
});
