// app_storefront_core_UI/cartridge/js/pages/product/sizeGuide.js

'use strict';

// Extract images to Size Guide popup & create Owl gallery
var allProductImages = "";
var productImages = [];
var imagesDump = [];
function processSizeGuidePopup(){
	// using dialogopen in app_storefront_core_UI/cartridge/js/dialog/index.js
	detectTableOverflow();
	createGallery();
}
function prepareImages(){
	getProductImages();
	findProductImages();
}

// Get product images from product page
function getProductImages(){
	allProductImages = document.querySelectorAll(".b-pdp-image");
	for(var i = 0; i < allProductImages.length; i++) {
		var c = allProductImages[i];
		var imgSrc = c.src;
		if(imgSrc){
			imagesDump.push(imgSrc);
		}
	}
}

// Filter relevant img (by name postfixes)
function findProductImages() {
	var imagesFilterPrimary = ["_mf", "_mb"];
	var imagesFilterSecondary = ["_sf", "_s34f", "_m", "_r", "_o"];
	function findImg(arr) {
		arr.map(function (f) {
			var found = imagesDump.find(function(img) {
				return img.indexOf(f) !== -1;
			});
			if (found) {
				productImages.push(found);
			}
		});
		return productImages;
	}
	findImg(imagesFilterPrimary);
	if (productImages.length < 1) {
		findImg(imagesFilterSecondary);
	}
	return productImages;
}

// Create img elements & populate gallery placeholder
function createGallery(){
	var modalContainer = document.querySelector(".dialog-size_guide");
	var gallery = document.querySelector(".sg-gallery");
	if(!document.querySelector(".sg-gallery.owl-carousel")) {
		var imgNum = productImages.length;
		if (imgNum > 0) {
			for(var i = 0; i < imgNum; i++) {
				var src = productImages[i];
				var generatedImg = document.createElement("img");
				gallery.appendChild(generatedImg);
				generatedImg.src = src;
			}
			initOwl(imgNum);
		} else {
			modalContainer.classList.add("sg-no-image");
		}
	}
}

// Init Owl on newly created gallery
function initOwl(imgNumber){
	$(".sg-gallery").owlCarousel({
		items: 1,
		loop: true,
		nav: true,
		center: true,
		dots: false,
		singleItem: true,
		navText: ["", ""],
		onInitialize: function (event) {
			if (imgNumber <= 1) {
				this.settings.loop = false;
				this.settings.nav = false;
			}
		}
	});
}

// Detect sizes table overflow if it's too long horizontally & add shadow class
function detectTableOverflow(){
	var container = document.querySelector(".sg-table-container");
	var contWidth = container.offsetWidth;
	var tableWidth = document.querySelector(".sg-row").offsetWidth;
	if (tableWidth > contWidth) {
		container.classList.add("sg-overflow-shadow");
	}
}

module.exports = {
	prepareImages: prepareImages,
	processSizeGuidePopup: processSizeGuidePopup,
}
