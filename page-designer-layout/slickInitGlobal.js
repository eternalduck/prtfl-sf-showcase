// app_project/cartridge/client/default/js/thirdParty/slickInitGlobal.js

var debounce = require('lodash/debounce');

/**
 * @description Initializes the Slick Slider carousels
 * with default class .slick-slider
 * and any other classes being passed to initSlider()
 */

// Default config
var defaultSettings = {
	mobileFirst: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	dots: true,
	draggable: true,
	nextArrow: '<button type="button" class="slick-arrow slick-next"><i class="fa fa-solid fa-chevron-right"></i></button>',
	prevArrow: '<button type="button" class="slick-arrow slick-prev"><i class="fa fa-solid fa-chevron-left"></i></button>',
	lazyLoad: 'progressive',
	responsive: [
	{
		breakpoint: 540,
		settings: {
			dots: false,
			arrows: true,
			slidesToShow: 2,
			slidesToScroll: 2
		}
	},
	{
		breakpoint: 960,
		settings: {
			dots: false,
			arrows: true,
			slidesToShow: 4,
			slidesToScroll: 4
		}
	}
	]
};

/**
 * @function
 * @description - caches DOM elements used as vars and returns an object
 * @param {String} sliderClass - jquery class of a slider's div (i.e. ".slick-slider")
 */
 function initCache(sliderClass) {
	var $cache = {
		slickElement: $(document).find(sliderClass)
	};
	return $cache;
 }

/**
 * @function
 * @description Initializes all common sliders with a given class
 * @param {Object} element - cached DOM element for a slider (i.e. $cache.slickElement)
 * @param {Object} config - slick config obj
 */
 function initSlickSlider(element, config = defaultSettings) {
	var $element = $(element);
	function initEach(){
		$element.each(function () {
			var $this = $(this);
			var ownConfig = $this.data("slick");
			var finalConfig = ownConfig ? ownConfig : config;
			if ($this.hasClass('slick-initialized')) {
				return;
			} else {
				$this.removeClass("slick-before-init");
				$this.slick(finalConfig);
			}
		});
	}
	initEach();

	$(window).on('resize', debounce(function() {
		initEach();
	}, 300));
 }

/**
 * @function
 * @description
 * @param {String} sliderClass - jquery class of a slider's div (i.e. ".slick-slider")
 * @param {Object} config - slick config obj
 */
 function initSlider(sliderClass, config) {
	var $cache = initCache(sliderClass);
	if (!$cache.slickElement) {
		$cache.slickElement = $(sliderClass);
	}
	initSlickSlider($cache.slickElement, config);
 }

// Always init all sliders with .slick-slider class
initSlider(".slick-slider", defaultSettings);

module.exports = {
	initSlider,
	defaultSettings
};
