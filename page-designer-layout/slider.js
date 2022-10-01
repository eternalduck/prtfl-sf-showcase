// app_project/cartridge/experience/components/commerce_layouts/slider.js

'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');

/**
 * Render logic for storefront Slider layout.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @returns {string} The markup to be displayed
 */


module.exports.render = function(context) {
	var model = new HashMap();
	var component = context.component;
	var content = context.content;

	model.id = 'slider-' + PageRenderHelper.safeCSSClass(context.component.getID());
	model.textHeadline = content.textHeadline ? content.textHeadline : null;
	model.extraClass = content.extraClass ? content.extraClass : null;
	model.xsDots = content.xsDots ? content.xsDots : true;
	model.xsArrows = content.xsArrows ? content.xsArrows : false;
	model.xsSlidesToShow = content.xsSlidesToShow ? content.xsSlidesToShow : 1;
	model.xsSlidesToScroll = content.xsSlidesToScroll ? content.xsSlidesToScroll : 1;
	model.mdDots = content.mdDots ? content.mdDots : true;
	model.mdArrows = content.mdArrows ? content.mdArrows : false;
	model.mdSlidesToShow = content.mdSlidesToShow ? content.mdSlidesToShow : 2;
	model.mdSlidesToScroll = content.mdSlidesToScroll ? content.mdSlidesToScroll : 2;
	model.xlDots = content.xlDots ? content.xlDots : false;
	model.xlArrows = content.xlArrows ? content.xlArrows : true;
	model.xlSlidesToShow = content.xlSlidesToShow ? content.xlSlidesToShow : 4;
	model.xlSlidesToScroll = content.xlSlidesToScroll ? content.xlSlidesToScroll : 4;

	var expSliderConfig = {
		mobileFirst: true,
		draggable: true,
		nextArrow: '<button type="button" class="slick-arrow slick-next"><i class="fa fa-solid fa-chevron-right"></i></button>',
		prevArrow: '<button type="button" class="slick-arrow slick-prev"><i class="fa fa-solid fa-chevron-left"></i></button>',
		lazyLoad: 'progressive',
		slidesToShow: content.xsSlidesToShow,
		slidesToScroll: content.xsSlidesToScroll,
		arrows: content.xsArrows,
		dots: content.xsDots,
		responsive: [
			{
				breakpoint: 540,
				settings: {
					dots: content.mdDots,
					arrows: content.mdArrows,
					slidesToShow: content.mdSlidesToShow,
					slidesToScroll: content.mdSlidesToScroll
				}
			},
			{
				breakpoint: 960,
				settings: {
					dots: content.xlDots,
					arrows: content.xlArrows,
					slidesToShow: content.xlSlidesToShow,
					slidesToScroll: content.xlSlidesToScroll
				}
			}
		]
	};

	// Automatically register configured regions
	model.regions = PageRenderHelper.getRegionModelRegistry(component);
	model.regions.slides.setClassName("experience-slider slick-before-init");
	model.regions.slides.setAttribute("id", model.id);
	model.regions.slides.setAttribute("data-slick", JSON.stringify(expSliderConfig));
	model.regions.slides.setComponentClassName("slider-item");

	return new Template('experience/components/commerce_layouts/slider').render(model).text;
};
