import expect from 'expect.js';
import { I18N } from '../';

describe('I18N', function(){
    
    describe('compileTextTemplate', function(){
        it('should return simple strings without modifications', function() {
            let templ = I18N.compileTextTemplate('abc');
            expect(templ({})).to.be('abc');
        });
        it('should replace simple variables', function() {
            let templ = I18N.compileTextTemplate('Hello, ${name}!');
            let str = templ({ name : 'World' });
            expect(str).to.be('Hello, World!');
        });
        it('should replace multiple variables (1)', function() {
            let templ = I18N.compileTextTemplate('abc ${x} cde ${y} efg ${z} ghi');
            let str = templ({ 
                x : 'X',
                y : 'Y',
                z : 'Z'
            });
            expect(str).to.be('abc X cde Y efg Z ghi');
        });
        it('should replace multiple variables (2)', function() {
            let templ = I18N.compileTextTemplate('abc \n ${  x  } cde \n${ y } efg \n${ \n  z \n} \nghi');
            let str = templ({ 
                x : 'X',
                y : 'Y',
                z : 'Z'
            });
            expect(str).to.be('abc \n X cde \nY efg \nZ \nghi');
        });
    });
    
    describe('newMessage should provide tranlations', function(){
        let i18n = new I18N();
        let batchKey = 'my.messages';
        let batch = {
            first : 'Hello',
            second : 'World',
            message : function(prefix){
                return prefix + ': ' + this.first + ', ' + this.second + '!';
            }
        };
        
        i18n.registerTranslations('fr', batchKey, {
            first: 'Bonjour',
            second : 'Le Monde',
            third : 'Blah-blah'
        });
        it('should return default values for non-registred locales', function() {
            let messages = i18n.newMessages('non-existing-locale', batchKey, batch);
            expect(!!messages).to.be(true);
            expect(!!messages.first).to.be(true);
            expect(!!messages.second).to.be(true);
            expect(!!messages.message).to.be(true);
            expect(messages.first).to.eql('Hello');
            expect(messages.second).to.eql('World');
            expect(messages.third).to.be(undefined);
            expect(messages.message('xxx')).to.eql('xxx: Hello, World!');
        });
        it('should return translated values for registred locales', function() {
            let messages = i18n.newMessages('fr', batchKey, batch);
            expect(!!messages).to.be(true);
            expect(!!messages.first).to.be(true);
            expect(!!messages.second).to.be(true);
            expect(!!messages.message).to.be(true);
            expect(messages.first).to.eql('Bonjour');
            expect(messages.second).to.eql('Le Monde');
            expect(messages.third).to.eql('Blah-blah');
            expect(messages.message('xxx')).to.eql('xxx: Bonjour, Le Monde!');
        });
        
    });
    
    describe('newMessage should generate template functions', function(){
        let i18n = new I18N();
        let batchKey = 'my.messages';
        let batch = { message : function(params){
            return 'default value';
        } };
        
        i18n.registerTranslations('fr', batchKey, {
            message: 'Bonjour ${prefix} ${firstName} ${lastName} !'
        });
        i18n.registerTranslations('en', batchKey, {
            message: 'Hello ${prefix} ${firstName} ${lastName}!'
        });

        it('should return empty string for non-existing translation keys', function() {
            let messages = i18n.newMessages('non-existing-locale', batchKey, batch);
            expect(!!messages).to.be(true);
            expect(!!messages.message).to.be(true);
            let str = messages.message({
                prefix: 'Mr',
                firstName : 'John',
                lastName : 'Doe'
            });
            expect(str).to.eql('default value');
        });

        it('en: should transform string templates to functions', function() {
            let messages = i18n.newMessages('en', batchKey, batch);
            expect(!!messages).to.be(true);
            expect(!!messages.message).to.be(true);
            let str = messages.message({
                prefix: 'Mr',
                firstName : 'John',
                lastName : 'Doe'
            });
            expect(str).to.eql('Hello Mr John Doe!');
        });
        it('fr: should transform string templates to functions', function() {
            let messages = i18n.newMessages('fr', batchKey, batch);
            expect(!!messages).to.be(true);
            expect(!!messages.message).to.be(true);
            let str = messages.message({
                prefix: 'Mr',
                firstName : 'John',
                lastName : 'Doe'
            });
            expect(str).to.eql('Bonjour Mr John Doe !');
        });
    });
    
    describe('getMessage should return alwasy the same batch', function(){
        let i18n = new I18N();
        let batchKey = 'my.messages';
        let batch = {
            first : 'Hello',
            second : 'World',
        };
        i18n.registerTranslations('fr', batchKey, {
            first : 'Bonjour',
            second : 'Le Monde',
        });

        it('should multiple times the same object', function() {
            let messages = i18n.getMessages('fr', batchKey, batch);
            expect(!!messages).to.be(true);
            expect(messages.first).to.eql('Bonjour');
            expect(messages.second).to.eql('Le Monde');
            expect(!!messages.id).to.be(false);
            messages.id = '123';
            let test = i18n.getMessages('fr', batchKey, batch);
            expect(test).to.be(messages);
            expect(test.id).to.eql('123');
            
            i18n.clearCache();
            test = i18n.getMessages('fr', batchKey, batch);
            expect(test).to.not.be(messages);
            expect(!!test).to.be(true);
            expect(test.id).to.be(undefined);
            expect(test.first).to.eql('Bonjour');
            expect(test.second).to.eql('Le Monde');
        });        
    });
    
});
