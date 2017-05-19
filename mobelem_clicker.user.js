// ==UserScript==
// @name         Повелители стихий. Кликер
// @namespace    https://ok.elem.mobi/
// @version      0.2.2
// @description  Проводит дуэли (пока что)
// @author       GoodVin
// @match        https://ok.elem.mobi/*
// @include      https://ok.elem.mobi/*
// @require      http://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/mobelem_clicker.user.js
// @grant        none
// ==/UserScript==

// клик
function cl(sel, timer1, timer2) {
	var clickEvent = document.createEvent ('MouseEvents');
	clickEvent.initEvent ('click', true, true);
	if(timer1 === undefined) timer1 = 500;
	if(timer2 === undefined) timer2 = 750;
	setTimeout(function(){
		sel.each(function(){
			this.dispatchEvent (clickEvent);
		});
	}, Math.random() * (timer2 - timer1) + timer1);
}

$(function(){

	// действия для дуэлей
	if(/^\/duel\//.test(self.location.pathname)) {
		// сейчас идёт бой
		if($(".w3card").length) {
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
				cl($(cards[idx15][3]).find("a:eq(1)"));
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
					cl($(cards[idx1][3]).find("a:eq(1)"));
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
					cl($(cards[idx05][3]).find("a:eq(1)"));
				}
			}
		}
		// бой окончен - предложение вступить в дуэль ещё раз
		if($(".cntr a:not(.orange)").has(".lbl").length && $(".cntr a:not(.orange)").has(".lbl").text().trim().toLowerCase().indexOf("еще") > -1) cl($(".cntr a:not(.orange)").has(".lbl"));
		// напасть
		if($(".cntr a:not(.grey)").has(".lbl").length && $(".cntr a:not(.grey)").has(".lbl").text().trim().toLowerCase().indexOf("напасть") > -1) cl($(".cntr a:not(.grey)").has(".lbl"));
		// смена противника - перезагрузка страницы
		else if("/duel/" == self.location.pathname) setTimeout(function(){ self.location.reload(); }, Math.random() * (2000 - 1000) + 1000);
		// перерыв в дуэлях
		if("/duel/" == self.location.pathname && $(".fttl").length && $(".fttl").text().toLowerCase().indexOf("перерыв") > -1) cl($(".small[onclick]"));
	}

	// действия в корне
	if("/" == self.location.pathname) {
		// таймер на дуэли
		if($("#duels_restore_time").length) {
			var ar = $("#duels_restore_time").text().split(" ");
			var secs = 5;
			for(i=0;i<ar.length;i+=2) {
				if(ar[i+1] == 'ч') secs += parseInt(ar[i], 10) * 3600;
				if(ar[i+1] == 'м') secs += parseInt(ar[i], 10) * 60;
				if(ar[i+1] == 'с') secs += parseInt(ar[i], 10);
				if(ar[i+1] == 'c') secs += parseInt(ar[i], 10);
			}
			console.log('Установлен таймер на '+secs+' секунд до начала дуэлей!');
			setTimeout(function(){ cl($("#duels_restore_time").closest("a")); }, secs * 1000);
		}
		// дуэли активны
		if($(".bttn.duels").length && $(".bttn.duels").text().toLowerCase().indexOf("дуэли:") > -1) cl($(".bttn.duels"));
	}

	// действия на арене
	if(/^\/survival\//.test(self.location.pathname)) {
		// заглушка
	}
	
});
