// app_storefront_core_UI/cartridge/js/pages/product/btcRates.js

"use strict";
// Insert approximate rate near regular price
// on Product view page: #wrapper.pt_product-details
// on the right in details .b-pdp-pricing .product-price as .price-crypto

// Get rate from api & currency & price from the page
var brand = SitePreferences.SITE_BRAND;
var currency = window.pageContext.currencyCode;
var getBtcUrl = "https://api.coinify.com/v3/rates/" + currency;
var getEthUrl = "https://api.coinify.com/v3/altrates/ETH?baseCurrency=" + currency;
var productPage = document.querySelector(".pt_product-details");
var cartPage = document.querySelector(".b-cart-order_totals");
var checkoutPage = document.querySelector(".checkout-order-totals");
var shippingPage = document.querySelector(".checkout-shipping");
var btcLabel = "Bitcoin ~";
var ethLabel = "Ethereum ~";
var btcClassOnCheckout = "price-btc";
var ethClassOnCheckout = "price-eth";

function fetchData(apiUrl, callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(xhttp.responseText);
			if (jsonResponse.success && jsonResponse.data.name !== "Ethereum"){
				callback( jsonResponse.data.name, jsonResponse.data.sell );
			}
			else if (jsonResponse.success && jsonResponse.data.name === "Ethereum"){
				callback( jsonResponse.data.name, jsonResponse.data.rate );
			}
		}
	};
	xhttp.open("GET", apiUrl, true);
	xhttp.send();
	xhttp.addEventListener("error", function(){
		console.info("Error fetching rates: ", xhttp.statusText);
	});
}

// Convert price & call insertBtcPrice or insertEthPrice to insert it
function calcPrice(coin, rate){
	var amount;
	var productPrice = window.pageContext.productPrice;
	if (productPrice) {
		if(coin !== "Ethereum") {
			amount = (1 / rate * productPrice).toFixed(8);
			insertPrice(btcLabel, ".price-crypto.btc", amount);
		}
		else if(coin === "Ethereum") {
			amount = (rate * productPrice).toFixed(8);
			insertPrice(ethLabel, ".price-crypto.eth", amount);
		}
	} else {
		console.info("no product price");
		return false;
	}
}

// Calculation is based on a cart contents object for each product & total
function calcPriceOnCheckout(coin, rate){
	var amount;
	var productPrices = window.pageContext.products;
	if (productPrices.length > 0) {
		if(checkoutPage || !shippingPage) {
			for (var i = 0; i < productPrices.length; i++) {
				var price = productPrices[i].price;
				var quantity = productPrices[i].quantity;
				if (coin !== "Ethereum") {
					amount = (1 / rate * (price * quantity)).toFixed(8);
					insertPriceOnCheckout(btcLabel, btcClassOnCheckout, amount, i);
				} else if (coin === "Ethereum") {
					amount = (rate * (price * quantity)).toFixed(8);
					insertPriceOnCheckout(ethLabel, ethClassOnCheckout, amount, i);
				}
			}
		}
	} else {
		console.info("no product price!");
		return false;
	}
}

// Calc price for totals in cart & checkout
function calcTotalPriceOnCheckout(coin, rate){
	var amount;
	var cartTotalProducts = window.pageContext.transactionTotal;
	var cartShipping = window.pageContext.transactionShipping;
	var orderTotal = cartTotalProducts + cartShipping;
	if (orderTotal) {
		if(coin !== "Ethereum") {
			amount = (1 / rate * orderTotal).toFixed(8);
			insertTotalPriceOnCheckout(btcLabel, btcClassOnCheckout, amount);

		}
		else if(coin === "Ethereum") {
			amount = (rate * orderTotal).toFixed(8);
			insertTotalPriceOnCheckout(ethLabel, ethClassOnCheckout, amount);
		}
	} else {
		console.info("no product price!");
		return false;
	}
}

function insertPrice(label, cls, amount){
	var priceContainer = document.querySelector(cls);
	if (amount && priceContainer) {
		priceContainer.innerText = label + amount;
	}
}

function insertPriceOnCheckout(label, cls, amount, i){
	var cartPriceContainers = document.querySelectorAll(".b-cart-cell_total .b-order_table-value");
	var cartPriceContainer = cartPriceContainers[i];
	if (amount && cartPriceContainer) {
		var priceToInsert = document.createElement("div");
		priceToInsert.classList.add(cls);
		priceToInsert.innerText = label + amount;
		cartPriceContainer.appendChild(priceToInsert);
	}
}

function insertTotalPriceOnCheckout(label, cls, amount) {
	var totalsContainers = document.querySelectorAll(".order-totals-table");
	if (amount && totalsContainers.length > 0) {
		for (var i = 0; i < totalsContainers.length; i++) {
			var totalsContainer = totalsContainers[i];
			var priceToInsert = document.createElement("div");
			priceToInsert.classList.add(cls);
			priceToInsert.innerText = label + amount;
			totalsContainer.appendChild(priceToInsert);
		}
	}
}

function addCryptoPrice(){
	if (brand !== "brand1" && productPage) {
		fetchData(getBtcUrl, calcPrice);
	}
	else if (brand === "brand2" && productPage) {
		fetchData(getEthUrl, calcPrice);
		fetchData(getBtcUrl, calcPrice);
	}
}

function addCryptoPriceOnCheckout(){
	if (brand === "brand2" && (cartPage || checkoutPage)) {
		fetchData(getEthUrl, calcPriceOnCheckout);
		fetchData(getBtcUrl, calcPriceOnCheckout);
		fetchData(getEthUrl, calcTotalPriceOnCheckout);
		fetchData(getBtcUrl, calcTotalPriceOnCheckout);
	}
}

module.exports = {
	addCryptoPrice: addCryptoPrice,
	addCryptoPriceOnCheckout: addCryptoPriceOnCheckout
};
