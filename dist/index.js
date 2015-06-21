(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _libI18N = __webpack_require__(1);

	var _libI18N2 = _interopRequireDefault(_libI18N);

	var _libTextTemplate = __webpack_require__(2);

	var _libTextTemplate2 = _interopRequireDefault(_libTextTemplate);

	exports['default'] = {
	    I18N: _libI18N2['default'],
	    TextTemplate: _libTextTemplate2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var I18N = (function () {
	    function I18N() {
	        _classCallCheck(this, I18N);

	        this._locales = {};
	    }

	    _createClass(I18N, [{
	        key: 'registerTranslations',

	        /**
	         * Registers translations for the specified locale and batch.
	         * 
	         * @param locale
	         *            the name of the locale
	         * @param batchKey
	         *            the key of the message batch
	         * @param translation
	         *            an object containing message keys and the corresponding
	         *            translations
	         */
	        value: function registerTranslations(locale, batchKey, translations) {
	            var localeIndex = this._locales[locale] = this._locales[locale] || {};
	            localeIndex[batchKey] = translations;
	        }
	    }, {
	        key: 'unregisterTranslations',

	        /**
	         * Unregisters translations for the specified locale and batch.
	         * 
	         * @param locale
	         *            the name of the locale
	         * @param batchKey
	         *            the key of the message batch
	         */
	        value: function unregisterTranslations(locale, batchKey) {
	            var localeIndex = this._locales[locale];
	            if (localeIndex) {
	                delete localeIndex[batchKey];
	            }
	        }
	    }, {
	        key: 'newMessages',

	        /**
	         * Returns a translated batch corresponding to the specified batch key.
	         * 
	         * @param locale
	         *            the locale of the required translations
	         * @param batchKey
	         *            key of the batch
	         * @param batch
	         *            an optional batch of default messages and utility methods
	         */
	        value: function newMessages(locale, batchKey, batch) {
	            batch = batch || {};
	            var localeIndex = this._locales[locale] || {};
	            var translations = localeIndex[batchKey] || {};
	            var result = {};
	            var excluded = {};
	            for (var key in batch) {
	                var val = batch[key];
	                var newVal = translations[key];
	                if (typeof val === 'function' && !!newVal && typeof newVal !== 'function') {
	                    newVal = this._getTemplateFunction(newVal);
	                }
	                result[key] = newVal || val;
	                excluded[key] = true;
	            }
	            for (var key in translations) {
	                if (key in excluded) continue;
	                result[key] = translations[key];
	            }
	            return result;
	        }
	    }, {
	        key: '_getTemplateFunction',
	        value: function _getTemplateFunction(val) {
	            var templ = TextTemplate.compile('' + message);
	            return function () {
	                return templ.apply(templ, arguments);
	            };
	        }
	    }]);

	    return I18N;
	})();

	exports['default'] = I18N;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * A very simple (simplistic) library replacing variables in strings.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var TextTemplate = (function () {
	    function TextTemplate() {
	        _classCallCheck(this, TextTemplate);
	    }

	    _createClass(TextTemplate, null, [{
	        key: 'compile',
	        value: function compile(text) {
	            text = text || '';
	            var array = text.split(/\$\{|\}/);
	            for (var i = 0; i < array.length; i++) {
	                if (i % 2 === 1) {
	                    array[i] = array[i].replace(/^\s+|\s+$/, '');
	                }
	            }
	            return function (obj) {
	                var str = '';
	                for (var i = 0; i < array.length; i++) {
	                    if (i % 2 === 0) {
	                        str += array[i];
	                    } else {
	                        var key = array[i];
	                        var val = obj[key] || '';
	                        str += val;
	                    }
	                }
	                return str;
	            };
	        }
	    }]);

	    return TextTemplate;
	})();

	exports['default'] = TextTemplate;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;