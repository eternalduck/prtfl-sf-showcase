// SDK include in html; placeholders for messages are included there too
// <script src="https://www.paypal.com/sdk/js?client-id=Af6wpTJgXlDS&components=messages" rel="preload" id="pp-sdk"></script>

document.addEventListener("DOMContentLoaded", () => {
	let currentCountry;
	let msgEligibleCountries = ["AU", "DE", "ES", "FR", "GB", "IT", "US"];

	if(window.pageContext){
		currentCountry = window.pageContext.countryCode;
		let pageType = window.pageContext.ns
		if (msgEligibleCountries.includes(currentCountry)) {

			// Check for SDK and run main function
			if(window.paypal){
				renderPaypalMsg();
			} else {
				console.info(`PayPal SDK not loaded for ${currentCountry}`);
			}

			// Init observer on color/size change on product page (due to details block reload)
			if(pageType === "product"){
				let pdpMain = document.getElementById("pdpMain");
				let config = {childList: false, characterData: true, attributes: true};
				let observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						if (mutation.type = "childList" && !mutation.target.classList.contains("js-loading")){
							renderPaypalMsg();
						}
					});
				});
				observer.observe(pdpMain, config);
			}
			// end observer

			// Set paypal as default method
			if(pageType === "checkout"){
				let ppMethod = document.getElementById("is-paypal");
				if (ppMethod){
					ppMethod.checked = true;
				}
			}

		}// if msgEligibleCountries
	}// if pageContext

	function renderPaypalMsg(){
		let currentCountry = window.pageContext.countryCode;
		let pageType = window.pageContext.ns;
		let currency = window.pageContext.currencyCode;
		let paymentList = document.getElementById("payment-method-list");

		// Product page - under price
		if(pageType === "product" && window.paypal){
			renderMsgPDP(pageType, currency, currentCountry)
		}
		// Cart page - at bottom
		if(pageType === "cart" && window.paypal){
			renderMsgCart(pageType, currency, currentCountry);
		}
		// Checkout - near payment selection
		if(pageType === "checkout" && paymentList){
			renderMsgCheckout(pageType, currency, currentCountry)
		}
	}

	// Check if limits apply by country
	function checkLimit(amount){
		let isAllowed = true;
		if (currentCountry === "AU" && (amount > 30 && amount < 1500)){
			isAllowed = true
		} else if (currentCountry === "US" && (amount > 199 && amount < 10000)){
			isAllowed = true
		} else if (currentCountry === "DE" && (amount > 99 && amount < 5000)){
			isAllowed = true
		} else if ((currentCountry === "ES" || currentCountry === "FR" || currentCountry === "IT" || currentCountry === "GB") 
			&& (amount > 30 && amount < 2000)){
			isAllowed = true
		} else {
			isAllowed = false
		}
		return isAllowed;
	}

	// Render messages on product page
	function renderMsgPDP(pageType, currency, country){
		let placeholderPDP = document.getElementById("pp-msg-pdp");
		let productPrice = getAmount(pageType).productPrice;

		let noLimits = checkLimit(productPrice);

		if(placeholderPDP && noLimits){
			document.querySelector(".pdp-general_info").classList.add("with-pp");
			placeholderPDP.setAttribute("data-pp-buyerCountry", country)
			paypal.Messages({
				currency: currency,
				amount: productPrice,
				placement: pageType,
				style: {
					logo: {
						type: "alternative"
					}
				}
			}).render(placeholderPDP);
		}

	}

	// Render messages in cart
	function renderMsgCart(pageType, currency, country){
		let placeholderCart = document.getElementById("pp-msg-cart");
		if(placeholderCart){
			let cartTotal = getAmount(pageType).cartTotal;
			placeholderCart.setAttribute("data-pp-buyerCountry", country)
			let noLimits = checkLimit(cartTotal);

			if(noLimits){
				paypal.Messages({
					currency: currency,
					amount: cartTotal,
					placement: pageType,
					style: {
						text: {
							align: "center"
						},
						logo: {
							type: "alternative"
						}
					}
				}).render(placeholderCart);
			}
		}
	}

	// Render messages on checkout
	function renderMsgCheckout(pageType, currency, country){
		let placeholderCheckout = document.getElementById("pp-msg-checkout");
		let paymentList = document.querySelector(".payment-method-options");

		if(placeholderCheckout && paymentList){
			let cartTotal = getAmount(pageType).cartTotal;
			placeholderCheckout.setAttribute("data-pp-buyerCountry", country)

			// Paste near paypal selector
			let allMethods = document.querySelectorAll(".payment-method-options .f-label");
			let ppMethod = document.getElementById("is-paypal");
			paymentList.style.position = "relative";
			paymentList.insertAdjacentElement("beforeend", placeholderCheckout)
			placeholderCheckout.style.opacity = "1";
			// Paypal was set as default method in the beginning

			// watch pp selection
			allMethods.forEach(method => {
				method.addEventListener("click", function(e){
					togglePPmsg(method);
				})
			})

			function togglePPmsg(method){
				method.attributes.for.value === "is-paypal" ? 
					placeholderCheckout.style.opacity = "1" : 
					placeholderCheckout.style.opacity = "0"
			}


			// in the end - render it, mind DOM delay
			let noLimits = checkLimit(cartTotal);
			if(noLimits){
				setTimeout(function(){
					paypal.Messages({
						currency: currency,
						amount: cartTotal,
						placement: pageType,
						style: {
							text: {
								align: "center"
							},
							logo: {
								type: "alternative"
							}
						}
					}).render(placeholderCheckout);
				}, 500)
			}

		}// if placeholderCheckout

	}// renderMsgCheckout


	// Get order amount
	function getAmount(page){
		let total1 = window.pageContext.transactionTotal;// for all
		let total2 =  window.pageContext.totalvalue || null;// for AU
		return {
			productPrice: window.pageContext.productPrice || null,
			cartTotal: total1 || total2,
		}
	}

});// DOMContentLoaded
