// app_storefront_core_UI/cartridge/js/header.js

// This is just a code abstract!

// [...]

function initializeEvents() {
	// [...]
	setAssistantCookie()
}

//  Get "param" from url & set it to "referral" cookie
function setAssistantCookie(){
	var url = window.location.href;
	var qs = "param";
	var cookieName = "referral";
	var cookieExpDate = new Date(Date.now() + 24*3600*1000).toLocaleString();
	var isQs = url.toString().indexOf(qs) > -1;
	function getQsValue(){
		var arr = url.toString().split("?")[1].split(/#|&/);
		var paramVal;
		for(var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if(item.indexOf(qs) > -1) {
				var value = item.split("=")[1];
				paramVal = value;
			}
		}
		return paramVal;
	}
	function isCookieAlreadySet(){
		var existingCookie = (document.cookie.match(/^(?:.*;)?\s*referral\s*=\s*([^;]+)(?:.*)?$/)||[,false])[1];
		return existingCookie;
	}

	function isThisUserAlreadyLoggedIn(){
		var userLogin = window.pageContext.userEmail;
		var paramVal = getQsValue();
		if(userLogin){
				return userLogin.split("@")[0] === paramVal;
		} else {
				return false;
		}
	}
	if(isQs){
		if (!isCookieAlreadySet() && !isThisUserAlreadyLoggedIn()){
			document.cookie = cookieName + "=" + getQsValue() + ";path=/;expires=" + cookieExpDate;
		}
	}
}
	// [...]
