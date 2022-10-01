// app_project/cartridge/experience/components/commerce_assets/imageBannerWithButton.js

'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var URLUtils = require('dw/web/URLUtils');
var ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');

/**
 * Render logic for the Image Banner component
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
		var model = new HashMap();
		var content = context.content;
		model.imageDesk = content.imageDesk ? ImageTransformation.getScaledImage(content.imageDesk) : null;
		model.imageMob = content.imageMob ? ImageTransformation.getScaledImage(content.imageMob) : null;
		model.imageAlt = content.imageAlt ? content.imageAlt : null;
		model.title = content.title ? content.title : null;
		model.heading = content.heading ? content.heading : null;
		model.titleColor = content.titleColor ? content.titleColor : null;
		model.headingColor = content.headingColor ? content.headingColor : null;
		model.buttonsClass = content.buttonsClass ? content.buttonsClass : null;
		model.buttonText1 = content.buttonText1 ? content.buttonText1 : null;
		model.buttonLink1 = content.buttonLink1 ? content.buttonLink1 : null;
		model.buttonText2 = content.buttonText2 ? content.buttonText2 : null;
		model.buttonLink2 = content.buttonLink2 ? content.buttonLink2 : null;
		model.alignmentH = content.alignmentH ? content.alignmentH : null;
		model.alignmentV = content.alignmentV ? content.alignmentV : null;
		model.heightFull = content.heightFull ? content.heightFull : null;
		model.height = content.height ? content.height : null;

		return new Template('experience/components/commerce_assets/imageBannerWithButton').render(model).text;
};
