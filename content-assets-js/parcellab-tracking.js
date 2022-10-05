// SF Content Asset example: ParcelLab Order Tracking


// HTML
// <div class="parcellab">
// 	<div class="parcellab__img"></div>
// 	<div class="parcellab__content">
// 		<form class="parcellab__form" id="parcellab__form">
// 			<div class="parcellab__form-item">
// 				<label>$include('Page-Include','cid', 'tr-track-shipment')$</label>
// 				<div class="parcellab__input-wrap">
// 					<input class="f-textinput input-text" id="input-number" type="text" placeholder="$include('Page-Include','cid', 'tr-tracking-number')$" />
// 					<div class="parcellab__form__error" id="form-error">
// 						<p>$include('Page-Include','cid', 'tr-tracking-error')$</p>
// 					</div>
// 				</div>
// 				<button class="parcellab__form-submit b-button" id="start-tracking" type="submit"><span></span>$include('Page-Include','cid', 'tr-search')$</button>
// 			</div>
// 		</form>
// 	</div>
// <div id="tracing-result"></div>
// </div>



<script>
document.addEventListener("DOMContentLoaded", function(){

	// Default function from the docs, a bit changed
	function callParcelLabApi(formVals){
		(function (prcl){
			if (window.ParcelLab){return prcl();}function a(){
				let styles = document.createElement('link');
				styles.rel = 'stylesheet';
				styles.href = 'https://cdn.parcellab.com/css/v3/parcelLab.min.css';
				document.getElementsByTagName('head')[0].appendChild(styles)
			}
			function b(cb){
				let script = document.createElement('script');
				script.async = true;
				script.src = 'https://cdn.parcellab.com/js/v3/parcelLab.min.js';
				(document.getElementsByTagName('head')[0]
					|| document.getElementsByTagName('body')[0]).appendChild(script);
				script.onload = cb
			}
			a();
			b(prcl);
		})(function (){// plugin is ready to use
			let tracingResultItem = document.getElementById("pl-plugin-wrapper");// appended when callParcelLabApi() runs
			let options = {};
			if(formVals){
				options = formVals
			}
			if(tracingResultItem){// clear to prevent from multiple results generation
				tracingResultItem.remove();
			}
			let pl = new ParcelLab('#tracing-result', options);
			pl.initialize();
			window._prcl = pl;
		});
	}// callParcelLabApi

	// First check if url already contains tracking params, the form remains hidden
	let queryString = window.location.search;
	let isQueryContainsTracking = false;
		console.info(queryString)
	if (queryString){
		isQueryContainsTracking = queryString.includes("courier=") && queryString.includes("trackingNo=");
		console.info(isQueryContainsTracking)
	}

	if (isQueryContainsTracking){
		callParcelLabApi()
	} else {
		// If url doesn't contain tracking params - show the form and proceed with it
		let courier;
		let form = document.getElementById("parcellab__form");
		let idField = document.getElementById("input-user-id");
		let numField = document.getElementById("input-number");
		let btn = document.getElementById("start-tracking");
		let error = document.getElementById("form-error");
		let userEmail = window.pageContext ? window.pageContext.userEmail : null;

		if(userEmail){
			idField.value = userEmail
		}
		form.style.display = "block";
		function getCourier(){
			let tracknum = numField.value;
			if(tracknum && tracknum.length === 20){
				return courier = "dhl"
			} else if (tracknum && tracknum.length === 18){
				return courier = "ups"
			} else if (tracknum && tracknum.length === 12){
				return courier = "fedex"
			} else {
				return courier = null
			}
		}

		btn.addEventListener("click", (e) => {
			e.preventDefault();
			// Appended when callParcelLabApi() runs
			let tracingResultItem = document.getElementById("pl-plugin-wrapper");
			// Clear to prevent from multiple results generation
			if(tracingResultItem){
				tracingResultItem.remove()
			}
			courier = getCourier();
			let number = numField ? numField.value : null;
			console.info(`courier: ${courier}, number: ${number}`)

			if(number && number.length >= 12){
				error.style.display = "none";
				let formVals = {
					"courier": courier,
					"trackingNo": number
				}
				callParcelLabApi(formVals)
			} else {
				error.style.display = "block";
			}
		})
	}

})
