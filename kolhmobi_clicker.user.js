// ==UserScript==
// @name         Колхоз. Кликер
// @namespace    https://odkl.kolhoz.mobi/
// @version      0.1
// @description  Высаживает, поливает, удобряет и продаёт растения
// @author       GoodVin
// @match        https://*.kolhoz.mobi/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL  https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
// @updateURL    https://github.com/wisegoodvin/mobclickers/raw/master/kolhmobi_clicker.user.js
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

	// действия на главном экране
    
});
