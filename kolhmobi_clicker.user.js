// ==UserScript==
// @name         Колхоз. Кликер
// @namespace    https://odkl.kolhoz.mobi/
// @version      2.6.5
// @description  Высаживает, поливает, удобряет, кормит животный, продаёт растения, окучивает ранчо, заготавливает запасы, разводит рыб, собирает награды за задания, открывает сундуки и собирает карты
// @author       GoodVin
// @match        *://*.kolhoz.mobi/*
// @match        *://kolhoz.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require      https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js?version=2017.12.29.1
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         http://kolhoz.mobi/favicon.ico
// ==/UserScript==
unsafeWindow.$ = jQuery;
var today = ("00" + (new Date()).getYear()).slice(-2) + ("00" + ((new Date()).getMonth() + 1)).slice(-2) + ("00" + (new Date()).getDate()).slice(-2);
var time = parseInt(today.replace(/\-/g, '') + ("00" + (new Date()).getHours()).slice(-2) + ("00" + (new Date()).getMinutes()).slice(-2), 10);

$(function(){
	// сначала добавляем кнопки
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ скрипт: в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;
	$('<a href="#" style="position:absolute;z-index:10000;top:30px;right:20px;font-size:10pt;color:'+(options.sellertype ? 'lime' : 'red')+';" onclick="tglbool(\'sellertype\');return false;" title="Тип продаж: умные (вкл, после кормёжки (если вкл), раз в сутки) / простые (выкл, шанс - 10%)">[ тип продаж: '+(options.sellertype ? 'умн' : 'прост')+' ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:50px;right:20px;font-size:10pt;color:'+(options.feeder ? 'lime' : 'red')+';" onclick="tglbool(\'feeder\');return false;" title="Включить / выключить обслуживание загонов (раз в сутки или при окончании бабла)">[ автозагоны: в'+(options.feeder ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:70px;right:20px;font-size:10pt;color:'+(options.rubys ? 'lime' : 'red')+';" onclick="tglbool(\'rubys\');return false;" title="Включить / выключить обмен денег на рубины (2 раза в сутки)">[ обмен рубинов: в'+(options.rubys ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:90px;right:20px;font-size:10pt;color:'+(options.cardcollector ? 'lime' : 'red')+';" onclick="tglbool(\'cardcollector\');return false;" title="Включить / выключить сбор карточек на овощебазе (каждые 3 часа +- пара минут)">[ сбор карт: в'+(options.cardcollector ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:110px;right:20px;font-size:10pt;color:'+(options.rancho ? 'lime' : 'red')+';" onclick="tglbool(\'rancho\');return false;" title="Включить / выключить ранчо">[ ранчо: в'+(options.rancho ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(options.rancho) $('<a href="#" style="position:absolute;z-index:10000;top:130px;right:20px;font-size:10pt;color:lime;" onclick="tglbool(\'ranchopos\');return false;" title="Какое растение для ранчо брать?">[ растение на ранчо: '+(options.ranchopos ? 'перв' : 'посл')+' ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:150px;right:20px;font-size:10pt;color:'+(options.nursery ? 'lime' : 'red')+';" onclick="tglbool(\'nursery\');return false;" title="Включить / выключить питомник">[ питомник: в'+(options.nursery ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:170px;right:20px;font-size:10pt;color:'+(options.cellar ? 'lime' : 'red')+';" onclick="tglbool(\'cellar\');return false;" title="Включить / выключить погреб">[ погреб: в'+(options.cellar ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:190px;right:20px;font-size:10pt;color:'+(options.pool ? 'lime' : 'red')+';" onclick="tglbool(\'pool\');return false;" title="Включить / выключить пруды">[ пруды: в'+(options.pool ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:210px;right:20px;font-size:10pt;color:'+(options.quests ? 'lime' : 'red')+';" onclick="tglbool(\'quests\');return false;" title="Включить / выключить сбор наград за задания">[ сбор заданий: в'+(options.quests ? '' : 'ы')+'кл ]</a>').appendTo("body");

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
            if($(".block a:text(продать)").length) return $(".block a:text(продать)").cl();
            if($(".block:text(амбар пуст)").length) return go('/');
        }
        if(clicktimer) return false;
    }
	// умные продажи
	else {
		if(empty(options.selldate) || today != options.selldate) {
			if(options.feeddate == today || !options.feeder) {
				if('/warehouse' == self.location.pathname) {
					if($(".block a:text(да, подтверждаю)").length) return $(".block a:text(да, подтверждаю)").cl();
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
			else if($("a[href*='harvest']:text(прибыль)").length) return $("a[href*='harvest']:text(прибыль)").log("Продаём звериную хрень").cl();
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

	// сбор наград за задания
	if(options.quests && (empty(options.questsdate) || 720 <= time - options.questsdate)) {
		if('/tasks' == self.location.pathname) {
			if($("a:text(забрать)").length) return $("a:text(забрать)").log("Забираем награду за задание").cl();
			setvar('questsdate', time);
			return go('/myfarm');
		} else return go('/tasks');
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
	if(options.rancho) {
		// страница выбора семян
		if(/AmericanSelectSeedPage/i.test(self.location.href)) {
			console.log('Ранчо - выбор растения');
			setvar('ranchotime', time);
			var all = $("img[src*='afarm']").toArray(), dis = $("img[style*='opacity']").toArray(), allow = [];
			for(var i=0, l=all.length; i<l; i++) if(dis.indexOf(all[i]) < 0) allow.push(all[i]);
			if(allow.length) return $(allow[options.ranchopos ? allow.length - 1 : 0]).closest("a").cl();
			else return go('/');
		}
		// страница с самим ранчо
		if('/rancho' == self.location.pathname) {
			console.log('Ранчо');
			// допилить госзаказ
			if($("a:text(собрать)").length) return $("a:text(собрать)").log("Собираем уражай").cl();
			if($("a:text(посадить)").length) return $("a:text(посадить)").log("Сажаем растение").cl();
			// не выбрано растение или давно не заходили в выбор (может что новое открылось)
			if($("a:text(выбрать)").length) return $("a:text(выбрать)").log("Выбираем растение").cl();
			if($("a:text(текущее растение)").length && options.ranchopos && (empty(options.ranchotime) || time - options.ranchotime >= 720)) return $("a:text(текущее растение)").log("Перевыбираем растение").cl();
			return go('/');
		}
		// найдено какое-либо действие в меню - надо перейти на ранчо
		if($("a[href*='rancho']").parent().find("span.title").length) return go('/rancho');
	}

	// питомник
	if(options.nursery) {
		if(self.location.pathname == '/mynursery') {
			console.log('Питомник');
			if($("a:text(сдать заказчику)").length) {
				setvar('nurseryjob', null);
				return $("a:text(сдать заказчику)").log('Сдаём заказчику').cl();
			}
			if($("a:text(забрать)").length) return $("a:text(забрать)").log('Забираем детёныша').cl();
			if($("div:text(отменить задание)").length && $("a:text(подтверждаю)").length) return $("a:text(подтверждаю)").cl();
		//	if(!options.nurseryjob) {
				console.log('Надо определиться с заданием');
				var jobs = $(".content li:text(очк)"), need = null, max=0;
				for(var i = 0; i<jobs.length;i++) {
					var txt = jobs[i].textContent.trim();
					var find = /^([^\(]+)[^\d]+(\d+)\s+очк.+(\d+)\s*\/\s*(\d+)/.exec(txt);

					if(find) {
						var ock = parseInt(find[2]);
						var don = parseInt(find[3]);
						var cnt = parseInt(find[4]);
						if(don > 0) {
							need = find[1].trim();
							break;
						}
						if(cnt > 10 || (ock/cnt < 0.5 && jobs.length > 1)) return $(jobs[i]).find("a:text([x])").cl();
						if(ock/cnt > max && don != cnt) {
							need = find[1].trim();
							max = ock/cnt;
						}
					}
				}
				if(need && $("a:text(выращивать)").length) {
					console.log('Определились - '+need);
					setvar('nurseryjob', need);
					return $("a:text(выращивать)").cl();
				}
		//	} else if($("a:text(выращивать)").length) return $("a:text(выращивать)").cl();
		//	else return go('/');
		}
		if(options.nurseryjob && self.location.pathname == '/nursery-select') {
			console.log('Выбираем животное - '+options.nurseryjob);
			if($("a:text("+options.nurseryjob+")").length) return $("a:text("+options.nurseryjob+")").log('Начинаем выращивать').cl();
		}
		// есть действия или давно не заходили
		if($(".framed a[href*='mynursery']").parent().find('span.title').length || (empty(options.nurserytime) || time - options.nurserytime >= 120)) {
			setvar('nurserytime', time);
			return go('/mynursery');
		}
	}

	// погреб
	if(options.cellar) {
		if(self.location.pathname == '/mycellar' || self.location.pathname == '/user/recipebook') {
			console.log('Погреб / книга рецептов');
			if($("h3:text(рецепт:)").length) {
				console.log("Рецепт выбран - закупаем не достающие ингридиенты и начинаем готовить");
				if($("a:text(докупить состав):last").length) return $("a:text(докупить состав):last").cl({log:'Докупаем недостающие ингридиенты'});
				else if($("a:text(поставить)").length) return $("a:text(поставить)").cl({log:'Заготавливаем'});
			} else if($("a:text(выбрать из книги)").length) return $("a:text(выбрать из книги)").cl({log:'Выбираем рецепт из книги'});
			if($("a:text(продать всё)").length) return $("a:text(продать всё)").cl({log:'Продаём всё'});
			if($("a:text(заготовить всё)").length) return $("a:text(заготовить всё)").cl({log:'Заготавливаем всё'});
			console.log('Надо выходить в корень');
			return go("/");
		}
		if(self.location.pathname == '/recipe') {
			console.log('Рецепты');
			if($("a[href*='-recipes-']:first").length) return $("a[href*='-recipes-']:first").cl({log:'Выбираем первый рецепт'});
			if($("a:text(поставить)").length) return $("a:text(поставить)").cl({log:'Заготавливаем'});
			return go("/");
		}
		if($(".framed a[href*='mycellar']").parent().find("span.title").length) return go('/mycellar');
	}

	// пруды
	if(options.pool) {
		if(self.location.pathname == '/mypool') {
			console.log('Пруды');
			if($("a:text(продать)").length) return $("a:text(продать)").log("Продаём рыбу").cl();
			if($("a:text(кормить)").length) return $("a:text(кормить)").log("Кормим рыбу").cl();
			if($("a:text(разводить)").length) return $("a:text(разводить)").log("Разводим рыбу").cl();
			return go('/myfarm');
		}
		if($(".framed a[href*='mypool']").parent().find("span.title").length) return go('/mypool');
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
		if(options.rancho && mintime > 30) mintime = 30;
        else mintime += 5;
        console.log('Никаких действие не сделано - запущен таймер на '+mintime+' сек. до проверки ближайшего действия.');
        return go("/", mintime * 1000);
    }

	// ошибка
	if(/Error/i.test(self.location.href) || /actionsBlock/i.test(self.location.href)) {
		console.log("Мы на странице с ошибкой - запущен таймер на переход к основному окну");
		return go('/', rand(3000,5000));
	}

	// хз где - надо уйти в корень
	console.log('Уйти на главную страницу');
	return go('/', rand(3000,5000));
});
