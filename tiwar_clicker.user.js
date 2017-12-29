// ==UserScript==
// @name        Битва титанов. Кликер
// @namespace   https://ods.tiwar.mobi/
// @version     1.0
// @description Собирает золото, записывается на сражения + собирает доход, ходит в поход, спускается в пещеру, собирает награды в хижине мудреца
// @author      GoodVin
// @match       *://*.tiwar.mobi/*
// @match       *://tiwar.mobi/*
// @require     http://code.jquery.com/jquery-3.2.1.slim.min.js
// @require     https://github.com/wisegoodvin/mobclickers/raw/master/shared_functions.js?version=03.07.2017.1
// @downloadURL https://github.com/wisegoodvin/mobclickers/raw/master/tiwar_clicker.user.js
// @updateURL   https://github.com/wisegoodvin/mobclickers/raw/master/tiwar_clicker.user.js
// @icon        https://ods.tiwar.mobi/favicon.ico?2
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==
unsafeWindow.$ = jQuery;
var today = "" + (new Date()).getFullYear() + "-" + (new Date()).getMonth() + "-" + (new Date()).getDate();

(function() {
	// сначала добавляем кнопки
	$('<a href="#" style="position:absolute;z-index:10000;top:10px;right:20px;font-size:10pt;color:'+(options.scriptenabled ? 'lime' : 'red')+';" onclick="tglbool(\'scriptenabled\');return false;" title="Включить / выключить кликер">[ в'+(options.scriptenabled ? '' : 'ы')+'кл ]</a>').appendTo("body");
	if(!options.scriptenabled) return false;
	$('<a href="#" style="position:absolute;z-index:10000;top:30px;right:20px;font-size:10pt;color:'+(options.gold ? 'lime' : 'red')+';" onclick="tglbool(\'gold\');return false;" title="Включить / выключить сбор золота">[ сбор золота: в'+(options.gold ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:50px;right:20px;font-size:10pt;color:'+(options.campaign ? 'lime' : 'red')+';" onclick="tglbool(\'campaign\');return false;" title="Включить / выключить поход">[ поход: в'+(options.campaign ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:70px;right:20px;font-size:10pt;color:'+(options.fights ? 'lime' : 'red')+';" onclick="tglbool(\'fights\');return false;" title="Включить / выключить сражения">[ сражения: в'+(options.fights ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:90px;right:20px;font-size:10pt;color:'+(options.cave ? 'lime' : 'red')+';" onclick="tglbool(\'cave\');return false;" title="Включить / выключить пещеру">[ пещера: в'+(options.cave ? '' : 'ы')+'кл ]</a>').appendTo("body");
	$('<a href="#" style="position:absolute;z-index:10000;top:110px;right:20px;font-size:10pt;color:'+(options.sage ? 'lime' : 'red')+';" onclick="tglbool(\'sage\');return false;" title="Включить / выключить хижину мудреца">[ хижина: в'+(options.sage ? '' : 'ы')+'кл ]</a>').appendTo("body");

    // главный экран
console.log(options);
})();
