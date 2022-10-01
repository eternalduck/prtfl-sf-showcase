// app_storefront_core_ext/cartridge/scripts/product/VariationUtils.js

// This is just a code abstract!

// [...]

/**
 * Get size table code from json stored in SitePreferences -> sizeGuideMicrocategories
 *
 * @returns String
 */
 function _getSizeTableCode(obj, productId, productmcat, productgender) {
	let found;
	let assetPrefix = "size-guide-";
	function parseJsonObj(obj) {
		let result;
		try {
			result = JSON.parse(obj);
		} catch (e) {
			return false;
		}
		return result;
	};
	let jsonObj = parseJsonObj(obj);
	let keys = jsonObj ? Object.keys(jsonObj) : null;
	let productSizeType = productId.split("_")[2];
	let fullMcat = (productgender + productmcat).toLowerCase();
	if(keys){
		for(let i = 0; i < keys.length && !found; i++){
			let key = keys[i];
			let sizeType = jsonObj[key].sizeType;
			let mcatsArray = jsonObj[key].mcat;
			let match = () => {
				return sizeType === productSizeType ? mcatsArray.join("~").toLowerCase().indexOf(fullMcat) !== -1 : false;
			};
			if(match()) {
				found = key;
			}
		}
	}
	return found === undefined ? "" : assetPrefix + found;
 }


/**
 * Check for Size Chart
 *
 * We are assuming that a custom attribute, sizeChartID, has been defined for a Catalog Category system
 * object in Business Manager > Administration > System Object Definitions > Category > Attribute Definitions
 *
 * The value assigned to this object maps to a Content Asset.
 */
 function _getSizeChart(params) {
	const attrAttributeId = params.attrAttributeId;
	const product = params.product;
	const processedAttr = params.processedAttr;
	const allMcats = require('sitepreferences').getValue('sizeGuideMicrocategories');
	const productMcat = product.getCustom().microcategory;
	const productGender = product.getCustom().gender.value;
	const productId = product.isVariant() ? params.product.ID : params.product.variants[0].ID;
	const sizeTableCode = _getSizeTableCode(allMcats, productId, productMcat, productGender);
	if (attrAttributeId != 'color' && !processedAttr.sizeChart) {
		let category = product.getPrimaryCategory();

		if (!category && (product.isVariant() || product.isVariationGroup())) {
			category = product.getMasterProduct().getPrimaryCategory();
		}

		while (category && !processedAttr.sizeChart) {
			const sizeChartId = category.custom.sizeChartID;

			if (sizeChartId) {
				return {
					id: sizeChartId,
					url: getURLUtils().url('Page-Show', 'cid', sizeChartId),
					title: getResource().msg('product.variations.sizechart', 'product', null),
					label: getResource().msg('product.variations.sizechart.label', 'product', null),
					labelFor: getResource().msg('product.variations.sizechart.for', 'product', null),
					productName: product.name,
					sizeGuideLabel: getResource().msg('product.variations.sizeguide', 'product', null),
					sizeGuideTitle: getResource().msg('product.variations.sizeguide.label', 'product', null),
					sizeGuideLabelFor: getResource().msg('product.variations.sizeguide.for', 'product', null),
					sizeGuideUrl: getURLUtils().url('Page-Show', 'cid', sizeTableCode),
					sizeTableCode: sizeTableCode
				}
			}
			category = category.parent;
		}
	}
 }

// [...]
