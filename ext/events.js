chrome.webNavigation.onErrorOccurred.addListener(function(res){
	if(res.frameId === 0 && (undefined !== res.error || null !== res.error)) {
		console.log('Ошибка соединения! '+res.url);
		setTimeout(function(){ chrome.tabs.reload(res.tabId); }, 10000);
	}
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
	if(alarm.name == "reloadMobi") {
		chrome.tabs.query({windowType: "normal", url: "*://*.mobi/*"}, function(tabs) {
			if(tabs && tabs.length) for(var i=0; i<tabs.length; i++) {
				chrome.tabs.reload(tabs[i].id);
				console.log("Плановая перезагрузка вкладки: "+tabs[i].url);
			}
        });
	}
});

chrome.alarms.create("reloadMobi", {delayInMinutes: 10, periodInMinutes: 10});