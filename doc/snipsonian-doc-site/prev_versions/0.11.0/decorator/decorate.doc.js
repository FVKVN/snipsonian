import decorate from './decorate';
import {snippet, name, desc, authors, signature, since, param, examples, JS_DOC_TYPE} from '../_docRef';

@name('decorate')
@desc('To decorate a target with 1 or more decorators when you can\'t/won\'t use the @decorator syntax.' +
    '\nChain the decorate function with a \'with\' function which expects 1 or more decorators that you can pass ' +
    'using rest parameters.')
@param({
    name: 'target',
    type: JS_DOC_TYPE.ANY,
    desc: 'The target entity where the decorators will run on.',
    isOptional: false
})
@authors('Ben Verbist')
@since('<$SINCE$>')
@signature('(target).with(...decorators)')
@examples(`
    const someTarget = {};
    
    decorate(someTarget).with(
        addProp('somePropName', 'some value'),
        addProp('someOtherProp', 123)
    );
    
    console.log(someTarget.somePropName);
    // => 'some value'
    console.log(someTarget.someOtherProp);
    // => 123
`)
@snippet(decorate)
class decorateDoc {
}

export default decorateDoc;
