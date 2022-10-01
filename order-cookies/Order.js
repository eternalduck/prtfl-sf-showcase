// app_storefront_core_ext/cartridge/controllers/Order.js

// This is just a code abstract!

// [...]

/**
 * Renders the order confirmation page after successful order
 * creation
 */
function showConfirmation(order) {
	// [...]

	/*
	 * Get SF Assistant value from cookies
	*/
	var cookieName = "referral";
	// Clear cookie contents for security
	function escapeHtml(text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
	function getReferralCookie(){
		var requestCookies = request.getHttpCookies();
		var cookieVal;
		var clearedCookieVal;
		if(requestCookies){
				for(var key in requestCookies){
					var cookie = requestCookies[key];
					if(cookie && cookie.name == cookieName){
							cookieVal = cookie.value;
							clearedCookieVal = escapeHtml(cookieVal);
							return clearedCookieVal;
					}
				}
		}
		return null;
	}
	var referralCookie = getReferralCookie();
	Transaction.wrap(function(){
			order.custom.cookiesList = referralCookie;
	})

	// Del cookie after saving to order
	if(referralCookie) {
			var cookie = request.getHttpCookies()[cookieName];
			cookie.setPath("/");
			cookie.setValue("");
			cookie.setMaxAge(0);
			request.addHttpCookie(cookie);
	}

	// [...]

	app.getView({
		ContinueURL: URLUtils.https('Account-RegistrationForm')
	}).render('checkout/confirmation/confirmation')

}

// [...]
