export default class I18N {
    
    /**
     * A very simple method compiling the specified text into a template
     * function. This function replaces variables in strings.
     */
    static compileTextTemplate(text){
        let array = text.split(/\$\{\s*|\s*\}/gim);
        return function(obj){
            let str = '';
            for (let i = 0; i < array.length; i++) {
                str +=  ((i % 2 === 0) ? array[i] : obj[array[i]]) || '';
            }
            return str;
        };
    }
    
    constructor(){
        this._locales = {};
    }
    
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
    registerTranslations(locale, batchKey, translations){
        let localeIndex = this._locales[locale] = this._locales[locale] || {};
        localeIndex[batchKey] = translations;
    }
    
    
    /**
     * Unregisters translations for the specified locale and batch.
     * 
     * @param locale
     *            the name of the locale
     * @param batchKey
     *            the key of the message batch
     */
    unregisterTranslations(locale, batchKey){
        let localeIndex = this._locales[locale];
        if (localeIndex){
            delete localeIndex[batchKey];
        }
    }

    /**
     * Returns a translated batch corresponding to the specified batch key. This
     * method caches the resulting objects.
     * 
     * @param locale
     *            the locale of the required translations
     * @param batchKey
     *            key of the batch
     * @param batch
     *            an optional batch of default messages and utility methods
     */
    getMessages(locale, batchKey, batch) {
        let cacheKey = locale + ':' + batchKey;
        let cache = this._cache = this._cache || {};
        let result = cache[cacheKey];
        if (!result){
            result = this.newMessages(locale, batchKey, batch);
            cache[cacheKey] = result;
        }
        return result;
    }
    
    /** 
     * Clears cache of translations used by the getMessages method.
     */
    clearCache(){
        delete this._cache;
    }
    
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
    newMessages(locale, batchKey, batch) {
        batch = batch || {};
        let localeIndex = this._locales[locale] || {};
        let translations = localeIndex[batchKey] || {};
        let result = {};
        let excluded = {};
        for (let key in batch){
            let val = batch[key];
            let newVal = translations[key];
            if (typeof val === 'function' && !!newVal && 
                typeof newVal !== 'function') {
                newVal = this._getTemplateFunction(newVal);
            }
            result[key] = newVal || val;
            excluded[key] = true;
        }
        for (let key in translations) {
            if (key in excluded)
                continue;
            result[key] = translations[key];
        }
        return result;
    }

    /**
     * This method could be overloaded in subclasses to define another
     * templating.
     */
    _getTemplateFunction(val) {
        return I18N.compileTextTemplate(val ? val + '' : '');
    }
    
}
