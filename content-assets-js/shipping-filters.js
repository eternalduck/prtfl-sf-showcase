// SF Content Asset example: Shipping Filters


// Flow: 
// * Detect page type and call the corresponding action (triggering disableBuyBtn(), disableCheckoutBtns(), disableCOD()), if a product cannot be bought based on internal logic, and is NOT on preorder. Adds a warning message on the page (on product page and in cart, via getTranslation(page))
// * Preorder is checked by a multi-language text content from DOM
// * Product page: getPidFromPdp() is triggered by an observer on size/color change OR fires on page load
// * Call api to get product info: fetchDataOnPdp(pid), triggers sendData()
// * Cart page: composeCartListAndSend() creates product list from DOM because there's no other way to map order table rows to products themselves. Cart check is done just in case if forbidden products are somehow passed by a product page filter. Also here we set localStorage flag about a certain payment method to check at checkout stage
// * Checkout page: if localStorage isCashAllowed=false - hide "pay with cash" method

document.addEventListener("DOMContentLoaded", function(){

	let pageContext = window.pageContext;
	let country = pageContext.countryCode;
	let currency = pageContext.currencyCode;
	let page = pageContext.ns;
	let cartMapping = {};// cart's DOM list

/// PREPARING & SENDING QUERY

	// Call actions for each page
	if (page === "product"){
		getPidFromPdp()
	} else if (page === "cart"){
		composeCartListAndSend()
	} else if (page === "checkout"){
		runFiltersOnCheckout()
	}

	function sendData(products, callback){
		let storefrontData = {
			"currency": currency,
			"shippingCountry": country,
			"products": products
		}
		let data = JSON.stringify(storefrontData)
		$.ajax({
			method: "GET",
			url: "https://our.endpoint.com/availability_checker.php?page=" + page + "&data=" + data,
			cache: false,
			dataType: "json",
			success: function(response){
				callback(response)
			},
			error: function(){
				console.error("Cannot check the product right now, please try later")
			}
		});
	}

	function fetchDataOnPdp(pid){
		let price = parseFloat(pageContext.productPrice);
		if(price){
			let productsArr = [{
				"productID": pid,
				"price": price
			}]
			sendData(productsArr, runFiltersOnPdp)
		}
	}

	function getPidFromPdp(){
		// General size/color change watcher to reattach listeners
		let pdpMain = document.getElementById("pdp-main");
		let config = {childList: false, characterData: false, attributes: true};
		let observer = new MutationObserver(function (mutations){
			mutations.forEach(function (mutation){
				if (mutation.type = "childList" && !mutation.target.classList.contains("js-loading")){
					checkPid();
				}
			});
		});
		if(pdpMain){
			observer.observe(pdpMain, config);
		}

		// If it was a direct link, and size is already selected on page load
		// or a product has no sizes
		checkPid();

		// Make sure size was changed or already selected, and it's not a preorder
		function checkPid(){
			let pidContainer = document.getElementById("pid");
			let sku = pageContext.productID;
			let isPreorder = !!document.querySelector(".preorder");
			if(pidContainer && !isPreorder){
				let pid = pidContainer.value;
				if(pid !== sku){
					fetchDataOnPdp(pid)
				}
			}
		}

	}//getPidFromPdp

	function composeCartListAndSend(){
		// Get info from DOM to know about preorders
		let productsArr = [];
		let products = pageContext.products;
		let cartRows = document.querySelectorAll(".cart_table-row");

		if(products && cartRows){
			Array.from(cartRows).forEach((row, i) => {
				let isPreorder = isPreorderInCart(row);
				let productsObj = {"productID": "", "price": 0};
				let link = row.querySelector(".cart_product-link").href;
				let pid = link.split(".html")[0].split("/").slice(-1).pop();
				let priceRaw = products[i].price;
				let price = parseInt(priceRaw);

				productsObj.productID = pid;
				productsObj.price = price;
				// Map cart items: pid: index
				cartMapping[pid] = i;
				if(!isPreorder){// don't send preorders for checking
					productsArr.push(productsObj)
				}
			})
		}
		sendData(productsArr, runFiltersOnCart)
	}

/// PROCESSING RESPONSE
	function runFiltersOnPdp(response){
		if(response && !response.shipping){
			disableBuyBtn()
		}
	}

	function runFiltersOnCart(response){
		let cartRows = document.querySelectorAll(".cart_table-row");
		if(response && cartRows){
			// Check each product and add warning if shipping not allowed
			let productsPids = Object.keys(response["products"]);
			let products = Object.values(response["products"]);
			products.forEach((product, i) => {
				if(!product.Shipping){
					// Get DOM index by pid
					let pid = productsPids[i];
					let productIndexInCart = cartMapping[pid];
					let row = Array.from(cartRows)[productIndexInCart];
					setCartProductDisabled(row)
				}
			})

			function setCartProductDisabled(row){
				let tr = document.createElement("tr");
				let td = document.createElement("td");
				td.colSpan = "6";
				td.classList.add("shipping-disallowed-cart");
				td.textContent = getTranslation(page);
				tr.append(td);
				row.classList.add("shipping-disallowed");
				row.insertAdjacentElement("afterend", tr);
			}

			// Check overall permission for the order 
			if(!response.shipping){
				disableCheckoutBtns()
			}
			// Set localStorage cash flag for later checks
			if(!response.cod){
				localStorage.setItem("isCashAllowed", "false");
			} else {
				localStorage.setItem("isCashAllowed", "true");
			}

		}
	}// runFiltersOnCart


	function runFiltersOnCheckout(){
		// Get shipping possibility from localStorage
		let isPlaceOrderPage = !!document.getElementById("place-order-button");
		let isCOD = localStorage.getItem("isCashAllowed");
		if(isCOD === "false" && isCOD !== null){
			disableCOD()
		}
		if(isPlaceOrderPage){
			localStorage.removeItem("isCashAllowed");
		}

	}

	// We can take this info only from this div
	function isPreorderInCart(row){
		// check content in different langs, could be just "low in stock"
		let txts = ["Pre-Order", "Vorbestellung", "Pre-pedido", "Preordine", "Pré-commande"];
		let label = row.querySelector(".on-order");
		if(label){
			let labelTxt = label.textContent;
			return txts.includes(labelTxt)
		} else {
			return false
		}
	}

	function disableBuyBtn(){
		let buyBtn = document.getElementById("add-to-cart");
		let wishlist = document.querySelector(".js-add-to-wishlist");
		let availability = document.querySelector(".availability-msg")
		if(buyBtn){
			buyBtn.remove();
		}
		if(wishlist){
			wishlist.remove();
		}
		if(availability){
			availability.classList.add("shipping-disallowed-pdp")
			availability.textContent = getTranslation(page);
		} else {
			let sizeSelector = document.querySelector(".b-pdp-attribute_list");
			let div = document.createElement("div");
			div.classList.add("shipping-disallowed-pdp")
			sizeSelector.insertAdjacentElement("beforeend", div)
		}
	}

	function disableCheckoutBtns(){
		// There are 2 types of buttons
		let btns = document.querySelectorAll(".b-cart-action-checkout .b-button");
		let links = document.querySelectorAll(".b-cart-checkout_button");

		Array.from(btns).forEach(btn => {
			btn.disabled = true;
			btn.remove();
		})
		Array.from(links).forEach(link => {
			link.addEventListener("click", function(e){
				e.preventDefault();
			})
			link.remove();
		})
	}


	function disableCOD(){
		let CODmethod = document.getElementById("is-cash");
		if (CODmethod){
			CODmethod.checked = false;
			CODmethod.disabled = true;
			CODmethod.parentElement.style.display = "none";
		}
	}

	function getTranslation(page){
		let lang = (document.cookie.match("(^|;)\\s*selectedLocale\\s*=\\s*([^;]+)")?.pop() || "").split("_")[0].toUpperCase();
		let context = page + lang;
		let translation = {
			"productEN": "Sorry, this product or size is unavailable in your country",
			"productIT": "Spiacenti, questo prodotto o questa taglia non sono disponibili nel vostro paese",
			"productFR": "Malheureusement, ce produit ou cette taille n'est pas disponible dans votre pays",
			"productES": "Lo sentimos, este producto o talla no está disponible en su país",
			"productDE": "Leider ist dieses Produkt oder diese Größe in Ihrem Land nicht verfügbar",
			"cartEN": "Sorry, this product or size is unavailable in your country. Please delete this item from the cart to proceed with checkout!",
			"cartIT": "Spiacenti, questo prodotto o questa taglia non sono disponibili nel vostro paese. Si prega di eliminare questo articolo dal carrello per procedere con il checkout!",
			"cartFR": "Malheureusement, ce produit ou cette taille n'est pas disponible dans votre pays. Veuillez supprimer cet article du panier pour passer à la validation de la commande!",
			"cartES": "Lo sentimos, este producto o talla no está disponible en su país. ¡Por favor, elimine este artículo de la cesta de compra para continuar con el pago!",
			"cartDE": "Leider ist dieses Produkt oder diese Größe in Ihrem Land nicht verfügbar. Bitte löschen Sie diesen Artikel aus dem Warenkorb, um mit dem Kauf fortzufahren!"
		}
		return translation[context]
	}

})//DOMContentLoaded
