var e=Object.defineProperty,t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),n=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r=t((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var ee=Array.isArray;function S(){}var C={H:null,A:null,T:null,S:null},te=Object.prototype.hasOwnProperty;function ne(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function re(e,t){return ne(e.type,t,e.props)}function w(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ie(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var ae=/\/+/g;function oe(e,t){return typeof e==`object`&&e&&e.key!=null?ie(``+e.key):t.toString(36)}function se(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(S,S):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ce(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ce(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+oe(e,0):a,ee(o)?(i=``,c!=null&&(i=c.replace(ae,`$&/`)+`/`),ce(o,r,i,``,function(e){return e})):o!=null&&(w(o)&&(o=re(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(ae,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(ee(e))for(var u=0;u<e.length;u++)a=e[u],s=l+oe(a,u),c+=ce(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+oe(a,u++),c+=ce(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ce(se(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function le(e,t,n){if(e==null)return e;var r=[],i=0;return ce(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ue(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var T=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},E={map:le,forEach:function(e,t,n){le(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return le(e,function(){t++}),t},toArray:function(e){return le(e,function(e){return e})||[]},only:function(e){if(!w(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=E,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=C,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return C.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!te.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return ne(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)te.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return ne(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=w,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ue}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=C.T,n={};C.T=n;try{var r=e(),i=C.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(S,T)}catch(e){T(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),C.T=t}},e.unstable_useCacheRefresh=function(){return C.H.useCacheRefresh()},e.use=function(e){return C.H.use(e)},e.useActionState=function(e,t,n){return C.H.useActionState(e,t,n)},e.useCallback=function(e,t){return C.H.useCallback(e,t)},e.useContext=function(e){return C.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return C.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return C.H.useEffect(e,t)},e.useEffectEvent=function(e){return C.H.useEffectEvent(e)},e.useId=function(){return C.H.useId()},e.useImperativeHandle=function(e,t,n){return C.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return C.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return C.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return C.H.useMemo(e,t)},e.useOptimistic=function(e,t){return C.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return C.H.useReducer(e,t,n)},e.useRef=function(e){return C.H.useRef(e)},e.useState=function(e){return C.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return C.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return C.H.useTransition()},e.version=`19.2.8`})),i=t(((e,t)=>{t.exports=r()})),a=t((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,ee||(ee=!0,w());else{var t=n(l);t!==null&&oe(x,t.startTime-e)}}}var ee=!1,S=-1,C=5,te=-1;function ne(){return g?!0:!(e.unstable_now()-te<C)}function re(){if(g=!1,ee){var t=e.unstable_now();te=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(S),S=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&ne());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&oe(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?w():ee=!1}}}var w;if(typeof y==`function`)w=function(){y(re)};else if(typeof MessageChannel<`u`){var ie=new MessageChannel,ae=ie.port2;ie.port1.onmessage=re,w=function(){ae.postMessage(null)}}else w=function(){_(re,0)};function oe(t,n){S=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):C=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(S),S=-1):h=!0,oe(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,ee||(ee=!0,w()))),r},e.unstable_shouldYield=ne,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),o=t(((e,t)=>{t.exports=a()})),s=t((e=>{var t=i();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var a={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},o=Symbol.for(`react.portal`);function s(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var c=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function l(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=a,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return s(e,t,null,r)},e.flushSync=function(e){var t=c.T,n=a.p;try{if(c.T=null,a.p=2,e)return e()}finally{c.T=t,a.p=n,a.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,a.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&a.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=l(n,t.crossOrigin),i=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?a.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:i,fetchPriority:o}):n===`script`&&a.d.X(e,{crossOrigin:r,integrity:i,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=l(t.as,t.crossOrigin);a.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??a.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=l(n,t.crossOrigin);a.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=l(t.as,t.crossOrigin);a.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else a.d.m(e)}},e.requestFormReset=function(e){a.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return c.H.useFormState(e,t,n)},e.useFormStatus=function(){return c.H.useHostTransitionStatus()},e.version=`19.2.8`})),c=t(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=s()})),l=t((e=>{var t=o(),n=i(),r=c();function a(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function s(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function l(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function u(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function d(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function f(e){if(l(e)!==e)throw Error(a(188))}function p(e){var t=e.alternate;if(!t){if(t=l(e),t===null)throw Error(a(188));return t===e?e:null}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var o=i.alternate;if(o===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===o.child){for(o=i.child;o;){if(o===n)return f(i),e;if(o===r)return f(i),t;o=o.sibling}throw Error(a(188))}if(n.return!==r.return)n=i,r=o;else{for(var s=!1,c=i.child;c;){if(c===n){s=!0,n=i,r=o;break}if(c===r){s=!0,r=i,n=o;break}c=c.sibling}if(!s){for(c=o.child;c;){if(c===n){s=!0,n=o,r=i;break}if(c===r){s=!0,r=o,n=i;break}c=c.sibling}if(!s)throw Error(a(189))}}if(n.alternate!==r)throw Error(a(190))}if(n.tag!==3)throw Error(a(188));return n.stateNode.current===n?e:t}function m(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=m(e),t!==null)return t;e=e.sibling}return null}var h=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),ee=Symbol.for(`react.consumer`),S=Symbol.for(`react.context`),C=Symbol.for(`react.forward_ref`),te=Symbol.for(`react.suspense`),ne=Symbol.for(`react.suspense_list`),re=Symbol.for(`react.memo`),w=Symbol.for(`react.lazy`),ie=Symbol.for(`react.activity`),ae=Symbol.for(`react.memo_cache_sentinel`),oe=Symbol.iterator;function se(e){return typeof e!=`object`||!e?null:(e=oe&&e[oe]||e[`@@iterator`],typeof e==`function`?e:null)}var ce=Symbol.for(`react.client.reference`);function le(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ce?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case te:return`Suspense`;case ne:return`SuspenseList`;case ie:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case S:return e.displayName||`Context`;case ee:return(e._context.displayName||`Context`)+`.Consumer`;case C:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case re:return t=e.displayName||null,t===null?le(e.type)||`Memo`:t;case w:t=e._payload,e=e._init;try{return le(e(t))}catch{}}return null}var ue=Array.isArray,T=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,E=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,de={pending:!1,data:null,method:null,action:null},fe=[],pe=-1;function me(e){return{current:e}}function D(e){0>pe||(e.current=fe[pe],fe[pe]=null,pe--)}function O(e,t){pe++,fe[pe]=e.current,e.current=t}var he=me(null),ge=me(null),_e=me(null),ve=me(null);function ye(e,t){switch(O(_e,t),O(ge,e),O(he,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}D(he),O(he,e)}function be(){D(he),D(ge),D(_e)}function xe(e){e.memoizedState!==null&&O(ve,e);var t=he.current,n=Hd(t,e.type);t!==n&&(O(ge,e),O(he,n))}function Se(e){ge.current===e&&(D(he),D(ge)),ve.current===e&&(D(ve),Qf._currentValue=de)}var Ce,we;function Te(e){if(Ce===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Ce=t&&t[1]||``,we=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Ce+e+we}var Ee=!1;function De(e,t){if(!e||Ee)return``;Ee=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Ee=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Te(n):``}function Oe(e,t){switch(e.tag){case 26:case 27:case 5:return Te(e.type);case 16:return Te(`Lazy`);case 13:return e.child!==t&&t!==null?Te(`Suspense Fallback`):Te(`Suspense`);case 19:return Te(`SuspenseList`);case 0:case 15:return De(e.type,!1);case 11:return De(e.type.render,!1);case 1:return De(e.type,!0);case 31:return Te(`Activity`);default:return``}}function ke(e){try{var t=``,n=null;do t+=Oe(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Ae=Object.prototype.hasOwnProperty,je=t.unstable_scheduleCallback,Me=t.unstable_cancelCallback,Ne=t.unstable_shouldYield,Pe=t.unstable_requestPaint,Fe=t.unstable_now,Ie=t.unstable_getCurrentPriorityLevel,Le=t.unstable_ImmediatePriority,Re=t.unstable_UserBlockingPriority,ze=t.unstable_NormalPriority,Be=t.unstable_LowPriority,Ve=t.unstable_IdlePriority,He=t.log,Ue=t.unstable_setDisableYieldValue,We=null,Ge=null;function Ke(e){if(typeof He==`function`&&Ue(e),Ge&&typeof Ge.setStrictMode==`function`)try{Ge.setStrictMode(We,e)}catch{}}var qe=Math.clz32?Math.clz32:Xe,Je=Math.log,Ye=Math.LN2;function Xe(e){return e>>>=0,e===0?32:31-(Je(e)/Ye|0)|0}var Ze=256,Qe=262144,$e=4194304;function et(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function tt(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=et(n))):i=et(o):i=et(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=et(n))):i=et(o)):i=et(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function nt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function rt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function it(){var e=$e;return $e<<=1,!($e&62914560)&&($e=4194304),e}function at(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ot(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function st(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-qe(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ct(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ct(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-qe(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function lt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-qe(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function ut(e,t){var n=t&-t;return n=n&42?1:dt(n),(n&(e.suspendedLanes|t))===0?n:0}function dt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ft(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function pt(){var e=E.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function mt(e,t){var n=E.p;try{return E.p=e,t()}finally{E.p=n}}var ht=Math.random().toString(36).slice(2),gt=`__reactFiber$`+ht,_t=`__reactProps$`+ht,vt=`__reactContainer$`+ht,yt=`__reactEvents$`+ht,bt=`__reactListeners$`+ht,xt=`__reactHandles$`+ht,St=`__reactResources$`+ht,Ct=`__reactMarker$`+ht;function wt(e){delete e[gt],delete e[_t],delete e[yt],delete e[bt],delete e[xt]}function Tt(e){var t=e[gt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[vt]||n[gt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[gt])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function Et(e){if(e=e[gt]||e[vt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Dt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(a(33))}function Ot(e){var t=e[St];return t||=e[St]={hoistableStyles:new Map,hoistableScripts:new Map},t}function k(e){e[Ct]=!0}var kt=new Set,At={};function jt(e,t){Mt(e,t),Mt(e+`Capture`,t)}function Mt(e,t){for(At[e]=t,e=0;e<t.length;e++)kt.add(t[e])}var Nt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Pt={},Ft={};function It(e){return Ae.call(Ft,e)?!0:Ae.call(Pt,e)?!1:Nt.test(e)?Ft[e]=!0:(Pt[e]=!0,!1)}function Lt(e,t,n){if(It(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}}function Rt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function zt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function Bt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Vt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Ht(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ut(e){if(!e._valueTracker){var t=Vt(e)?`checked`:`value`;e._valueTracker=Ht(e,t,``+e[t])}}function Wt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Vt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}function Gt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Kt=/[\n"\\]/g;function qt(e){return e.replace(Kt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Jt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Bt(t)):e.value!==``+Bt(t)&&(e.value=``+Bt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Xt(e,o,Bt(n)):Xt(e,o,Bt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Bt(s):e.removeAttribute(`name`)}function Yt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ut(e);return}n=n==null?``:``+Bt(n),t=t==null?n:``+Bt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ut(e)}function Xt(e,t,n){t===`number`&&Gt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Zt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Bt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Qt(e,t,n){if(t!=null&&(t=``+Bt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+Bt(n)}function $t(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(a(92));if(ue(r)){if(1<r.length)throw Error(a(93));r=r[0]}n=r}n??=``,t=n}n=Bt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ut(e)}function en(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var tn=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function nn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||tn.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function rn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(a(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var i in t)r=t[i],t.hasOwnProperty(i)&&n[i]!==r&&nn(e,i,r)}else for(var o in t)t.hasOwnProperty(o)&&nn(e,o,t[o])}function an(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var on=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),sn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function cn(e){return sn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function ln(){}var un=null;function dn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var fn=null,pn=null;function mn(e){var t=Et(e);if(t&&(e=t.stateNode)){var n=e[_t]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Jt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+qt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=r[_t]||null;if(!i)throw Error(a(90));Jt(r,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Wt(r)}break a;case`textarea`:Qt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Zt(e,!!n.multiple,t,!1)}}}var hn=!1;function gn(e,t,n){if(hn)return e(t,n);hn=!0;try{return e(t)}finally{if(hn=!1,(fn!==null||pn!==null)&&(bu(),fn&&(t=fn,e=pn,pn=fn=null,mn(t),e)))for(t=0;t<e.length;t++)mn(e[t])}}function _n(e,t){var n=e.stateNode;if(n===null)return null;var r=n[_t]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(a(231,t,typeof n));return n}var vn=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),yn=!1;if(vn)try{var bn={};Object.defineProperty(bn,"passive",{get:function(){yn=!0}}),window.addEventListener(`test`,bn,bn),window.removeEventListener(`test`,bn,bn)}catch{yn=!1}var xn=null,Sn=null,Cn=null;function wn(){if(Cn)return Cn;var e,t=Sn,n=t.length,r,i=`value`in xn?xn.value:xn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Cn=i.slice(e,1<r?1-r:void 0)}function Tn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function En(){return!0}function Dn(){return!1}function On(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?En:Dn,this.isPropagationStopped=Dn,this}return h(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=En)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=En)},persist:function(){},isPersistent:En}),t}var kn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},An=On(kn),jn=h({},kn,{view:0,detail:0}),Mn=On(jn),Nn,Pn,Fn,In=h({},jn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:qn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Fn&&(Fn&&e.type===`mousemove`?(Nn=e.screenX-Fn.screenX,Pn=e.screenY-Fn.screenY):Pn=Nn=0,Fn=e),Nn)},movementY:function(e){return`movementY`in e?e.movementY:Pn}}),Ln=On(In),Rn=On(h({},In,{dataTransfer:0})),zn=On(h({},jn,{relatedTarget:0})),Bn=On(h({},kn,{animationName:0,elapsedTime:0,pseudoElement:0})),Vn=On(h({},kn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Hn=On(h({},kn,{data:0})),Un={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Wn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Gn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Kn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Gn[e])?!!t[e]:!1}function qn(){return Kn}var Jn=On(h({},jn,{key:function(e){if(e.key){var t=Un[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Tn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Wn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:qn,charCode:function(e){return e.type===`keypress`?Tn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Tn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Yn=On(h({},In,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Xn=On(h({},jn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:qn})),Zn=On(h({},kn,{propertyName:0,elapsedTime:0,pseudoElement:0})),Qn=On(h({},In,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),$n=On(h({},kn,{newState:0,oldState:0})),er=[9,13,27,32],tr=vn&&`CompositionEvent`in window,nr=null;vn&&`documentMode`in document&&(nr=document.documentMode);var rr=vn&&`TextEvent`in window&&!nr,ir=vn&&(!tr||nr&&8<nr&&11>=nr),ar=` `,or=!1;function sr(e,t){switch(e){case`keyup`:return er.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function cr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var lr=!1;function ur(e,t){switch(e){case`compositionend`:return cr(t);case`keypress`:return t.which===32?(or=!0,ar):null;case`textInput`:return e=t.data,e===ar&&or?null:e;default:return null}}function dr(e,t){if(lr)return e===`compositionend`||!tr&&sr(e,t)?(e=wn(),Cn=Sn=xn=null,lr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return ir&&t.locale!==`ko`?null:t.data;default:return null}}var fr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function pr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!fr[e.type]:t===`textarea`}function mr(e,t,n,r){fn?pn?pn.push(r):pn=[r]:fn=r,t=Ed(t,`onChange`),0<t.length&&(n=new An(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var hr=null,gr=null;function _r(e){yd(e,0)}function vr(e){if(Wt(Dt(e)))return e}function yr(e,t){if(e===`change`)return t}var br=!1;if(vn){var xr;if(vn){var Sr=`oninput`in document;if(!Sr){var Cr=document.createElement(`div`);Cr.setAttribute(`oninput`,`return;`),Sr=typeof Cr.oninput==`function`}xr=Sr}else xr=!1;br=xr&&(!document.documentMode||9<document.documentMode)}function wr(){hr&&(hr.detachEvent(`onpropertychange`,Tr),gr=hr=null)}function Tr(e){if(e.propertyName===`value`&&vr(gr)){var t=[];mr(t,gr,e,dn(e)),gn(_r,t)}}function Er(e,t,n){e===`focusin`?(wr(),hr=t,gr=n,hr.attachEvent(`onpropertychange`,Tr)):e===`focusout`&&wr()}function Dr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return vr(gr)}function Or(e,t){if(e===`click`)return vr(t)}function kr(e,t){if(e===`input`||e===`change`)return vr(t)}function Ar(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var jr=typeof Object.is==`function`?Object.is:Ar;function Mr(e,t){if(jr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Ae.call(t,i)||!jr(e[i],t[i]))return!1}return!0}function Nr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Pr(e,t){var n=Nr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Nr(n)}}function Fr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Fr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ir(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Gt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Gt(e.document)}return t}function Lr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Rr=vn&&`documentMode`in document&&11>=document.documentMode,zr=null,Br=null,Vr=null,Hr=!1;function Ur(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Hr||zr==null||zr!==Gt(r)||(r=zr,`selectionStart`in r&&Lr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Vr&&Mr(Vr,r)||(Vr=r,r=Ed(Br,`onSelect`),0<r.length&&(t=new An(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=zr)))}function Wr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Gr={animationend:Wr(`Animation`,`AnimationEnd`),animationiteration:Wr(`Animation`,`AnimationIteration`),animationstart:Wr(`Animation`,`AnimationStart`),transitionrun:Wr(`Transition`,`TransitionRun`),transitionstart:Wr(`Transition`,`TransitionStart`),transitioncancel:Wr(`Transition`,`TransitionCancel`),transitionend:Wr(`Transition`,`TransitionEnd`)},Kr={},qr={};vn&&(qr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Gr.animationend.animation,delete Gr.animationiteration.animation,delete Gr.animationstart.animation),`TransitionEvent`in window||delete Gr.transitionend.transition);function Jr(e){if(Kr[e])return Kr[e];if(!Gr[e])return e;var t=Gr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in qr)return Kr[e]=t[n];return e}var Yr=Jr(`animationend`),Xr=Jr(`animationiteration`),Zr=Jr(`animationstart`),Qr=Jr(`transitionrun`),$r=Jr(`transitionstart`),ei=Jr(`transitioncancel`),ti=Jr(`transitionend`),ni=new Map,ri=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);ri.push(`scrollEnd`);function ii(e,t){ni.set(e,t),jt(t,[e])}var ai=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},oi=[],si=0,ci=0;function li(){for(var e=si,t=ci=si=0;t<e;){var n=oi[t];oi[t++]=null;var r=oi[t];oi[t++]=null;var i=oi[t];oi[t++]=null;var a=oi[t];if(oi[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&pi(n,i,a)}}function ui(e,t,n,r){oi[si++]=e,oi[si++]=t,oi[si++]=n,oi[si++]=r,ci|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function di(e,t,n,r){return ui(e,t,n,r),mi(e)}function fi(e,t){return ui(e,null,null,t),mi(e)}function pi(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-qe(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function mi(e){if(50<du)throw du=0,fu=null,Error(a(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var hi={};function gi(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _i(e,t,n,r){return new gi(e,t,n,r)}function vi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function yi(e,t){var n=e.alternate;return n===null?(n=_i(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function bi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function xi(e,t,n,r,i,o){var s=0;if(r=e,typeof e==`function`)vi(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,he.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case ie:return e=_i(31,n,t,i),e.elementType=ie,e.lanes=o,e;case y:return Si(n.children,i,o,t);case b:s=8,i|=24;break;case x:return e=_i(12,n,t,i|2),e.elementType=x,e.lanes=o,e;case te:return e=_i(13,n,t,i),e.elementType=te,e.lanes=o,e;case ne:return e=_i(19,n,t,i),e.elementType=ne,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case S:s=10;break a;case ee:s=9;break a;case C:s=11;break a;case re:s=14;break a;case w:s=16,r=null;break a}s=29,n=Error(a(130,e===null?`null`:typeof e,``)),r=null}return t=_i(s,n,t,i),t.elementType=e,t.type=r,t.lanes=o,t}function Si(e,t,n,r){return e=_i(7,e,r,t),e.lanes=n,e}function Ci(e,t,n){return e=_i(6,e,null,t),e.lanes=n,e}function wi(e){var t=_i(18,null,null,0);return t.stateNode=e,t}function Ti(e,t,n){return t=_i(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ei=new WeakMap;function Di(e,t){if(typeof e==`object`&&e){var n=Ei.get(e);return n===void 0?(t={value:e,source:t,stack:ke(t)},Ei.set(e,t),t):n}return{value:e,source:t,stack:ke(t)}}var Oi=[],ki=0,Ai=null,ji=0,Mi=[],Ni=0,Pi=null,Fi=1,Ii=``;function Li(e,t){Oi[ki++]=ji,Oi[ki++]=Ai,Ai=e,ji=t}function Ri(e,t,n){Mi[Ni++]=Fi,Mi[Ni++]=Ii,Mi[Ni++]=Pi,Pi=e;var r=Fi;e=Ii;var i=32-qe(r)-1;r&=~(1<<i),n+=1;var a=32-qe(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Fi=1<<32-qe(t)+i|n<<i|r,Ii=a+e}else Fi=1<<a|n<<i|r,Ii=e}function zi(e){e.return!==null&&(Li(e,1),Ri(e,1,0))}function Bi(e){for(;e===Ai;)Ai=Oi[--ki],Oi[ki]=null,ji=Oi[--ki],Oi[ki]=null;for(;e===Pi;)Pi=Mi[--Ni],Mi[Ni]=null,Ii=Mi[--Ni],Mi[Ni]=null,Fi=Mi[--Ni],Mi[Ni]=null}function Vi(e,t){Mi[Ni++]=Fi,Mi[Ni++]=Ii,Mi[Ni++]=Pi,Fi=t.id,Ii=t.overflow,Pi=e}var Hi=null,A=null,j=!1,Ui=null,Wi=!1,Gi=Error(a(519));function Ki(e){throw Qi(Di(Error(a(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Gi}function qi(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[gt]=e,t[_t]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<_d.length;n++)Q(_d[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),Yt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),$t(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=ln),t=!0):t=!1,t||Ki(e,!0)}function Ji(e){for(Hi=e.return;Hi;)switch(Hi.tag){case 5:case 31:case 13:Wi=!1;return;case 27:case 3:Wi=!0;return;default:Hi=Hi.return}}function Yi(e){if(e!==Hi)return!1;if(!j)return Ji(e),j=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||Ud(e.type,e.memoizedProps)),n=!n),n&&A&&Ki(e),Ji(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(a(317));A=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(a(317));A=uf(e)}else t===27?(t=A,Zd(e.type)?(e=lf,lf=null,A=e):A=t):A=Hi?cf(e.stateNode.nextSibling):null;return!0}function Xi(){A=Hi=null,j=!1}function Zi(){var e=Ui;return e!==null&&(Ql===null?Ql=e:Ql.push.apply(Ql,e),Ui=null),e}function Qi(e){Ui===null?Ui=[e]:Ui.push(e)}var $i=me(null),ea=null,ta=null;function na(e,t,n){O($i,t._currentValue),t._currentValue=n}function ra(e){e._currentValue=$i.current,D($i)}function ia(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function aa(e,t,n,r){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var o=i.dependencies;if(o!==null){var s=i.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=i;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ia(o.return,n,e),r||(s=null);break a}o=c.next}}else if(i.tag===18){if(s=i.return,s===null)throw Error(a(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ia(s,n,e),s=null}else s=i.child;if(s!==null)s.return=i;else for(s=i;s!==null;){if(s===e){s=null;break}if(i=s.sibling,i!==null){i.return=s.return,s=i;break}s=s.return}i=s}}function oa(e,t,n,r){e=null;for(var i=t,o=!1;i!==null;){if(!o){if(i.flags&524288)o=!0;else if(i.flags&262144)break}if(i.tag===10){var s=i.alternate;if(s===null)throw Error(a(387));if(s=s.memoizedProps,s!==null){var c=i.type;jr(i.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(i===ve.current){if(s=i.alternate,s===null)throw Error(a(387));s.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}i=i.return}e!==null&&aa(t,e,n,r),t.flags|=262144}function sa(e){for(e=e.firstContext;e!==null;){if(!jr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ca(e){ea=e,ta=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function la(e){return da(ea,e)}function ua(e,t){return ea===null&&ca(e),da(e,t)}function da(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ta===null){if(e===null)throw Error(a(308));ta=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ta=ta.next=t;return n}var fa=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},pa=t.unstable_scheduleCallback,ma=t.unstable_NormalPriority,M={$$typeof:S,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function ha(){return{controller:new fa,data:new Map,refCount:0}}function ga(e){e.refCount--,e.refCount===0&&pa(ma,function(){e.controller.abort()})}var _a=null,va=0,ya=0,ba=null;function xa(e,t){if(_a===null){var n=_a=[];va=0,ya=dd(),ba={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return va++,t.then(Sa,Sa),t}function Sa(){if(--va===0&&_a!==null){ba!==null&&(ba.status=`fulfilled`);var e=_a;_a=null,ya=0,ba=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Ca(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var wa=T.S;T.S=function(e,t){tu=Fe(),typeof t==`object`&&t&&typeof t.then==`function`&&xa(e,t),wa!==null&&wa(e,t)};var Ta=me(null);function Ea(){var e=Ta.current;return e===null?G.pooledCache:e}function Da(e,t){t===null?O(Ta,Ta.current):O(Ta,t.pool)}function Oa(){var e=Ea();return e===null?null:{parent:M._currentValue,pool:e}}var ka=Error(a(460)),Aa=Error(a(474)),ja=Error(a(542)),Ma={then:function(){}};function Na(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Pa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(ln,ln),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Ra(e),e;default:if(typeof t.status==`string`)t.then(ln,ln);else{if(e=G,e!==null&&100<e.shellSuspendCounter)throw Error(a(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Ra(e),e}throw Ia=t,ka}}function Fa(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Ia=e,ka):e}}var Ia=null;function La(){if(Ia===null)throw Error(a(459));var e=Ia;return Ia=null,e}function Ra(e){if(e===ka||e===ja)throw Error(a(483))}var za=null,Ba=0;function Va(e){var t=Ba;return Ba+=1,za===null&&(za=[]),Pa(za,e,t)}function Ha(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Ua(e,t){throw t.$$typeof===g?Error(a(525)):(e=Object.prototype.toString.call(t),Error(a(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Wa(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function i(e,t){return e=yi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Ci(n,e.mode,r),t.return=e,t):(t=i(t,n),t.return=e,t)}function l(e,t,n,r){var a=n.type;return a===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===a||typeof a==`object`&&a&&a.$$typeof===w&&Fa(a)===t.type)?(t=i(t,n.props),Ha(t,n),t.return=e,t):(t=xi(n.type,n.key,n.props,null,e.mode,r),Ha(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Ti(n,e.mode,r),t.return=e,t):(t=i(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,a){return t===null||t.tag!==7?(t=Si(n,e.mode,r,a),t.return=e,t):(t=i(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Ci(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=xi(t.type,t.key,t.props,null,e.mode,n),Ha(n,t),n.return=e,n;case v:return t=Ti(t,e.mode,n),t.return=e,t;case w:return t=Fa(t),f(e,t,n)}if(ue(t)||se(t))return t=Si(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,Va(t),n);if(t.$$typeof===S)return f(e,ua(e,t),n);Ua(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case w:return n=Fa(n),p(e,t,n,r)}if(ue(n)||se(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,Va(n),r);if(n.$$typeof===S)return p(e,t,ua(e,n),r);Ua(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case w:return r=Fa(r),m(e,t,n,r,i)}if(ue(r)||se(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,Va(r),i);if(r.$$typeof===S)return m(e,t,n,ua(t,r),i);Ua(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),j&&Li(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return j&&Li(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),j&&Li(i,h),l}function g(i,s,c,l){if(c==null)throw Error(a(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(i,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(i,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(i,h),j&&Li(i,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(i,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return j&&Li(i,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,i,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(i,e)}),j&&Li(i,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=i(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===w&&Fa(l)===r.type){n(e,r.sibling),c=i(r,o.props),Ha(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===y?(c=Si(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=xi(o.type,o.key,o.props,null,e.mode,c),Ha(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=i(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=Ti(o,e.mode,c),c.return=e,e=c}return s(e);case w:return o=Fa(o),b(e,r,o,c)}if(ue(o))return h(e,r,o,c);if(se(o)){if(l=se(o),typeof l!=`function`)throw Error(a(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,Va(o),c);if(o.$$typeof===S)return b(e,r,ua(e,o),c);Ua(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=i(r,o),c.return=e,e=c):(n(e,r),c=Ci(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{Ba=0;var i=b(e,t,n,r);return za=null,i}catch(t){if(t===ka||t===ja)throw t;var a=_i(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Ga=Wa(!0),Ka=Wa(!1),qa=!1;function Ja(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ya(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Xa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Za(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,W&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=mi(e),pi(e,null,n),t}return ui(e,r,t,n),mi(e)}function Qa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}function $a(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var eo=!1;function to(){if(eo){var e=ba;if(e!==null)throw e}}function no(e,t,n,r){eo=!1;var i=e.updateQueue;qa=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(q&f)===f:(r&f)===f){f!==0&&f===ya&&(eo=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(m=g.payload,typeof m==`function`){d=m.call(_,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=g.payload,f=typeof m==`function`?m.call(_,d,f):m,f==null)break a;d=h({},d,f);break a;case 2:qa=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Kl|=o,e.lanes=o,e.memoizedState=d}}function ro(e,t){if(typeof e!=`function`)throw Error(a(191,e));e.call(t)}function io(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)ro(n[e],t)}var ao=me(null),oo=me(0);function so(e,t){e=Gl,O(oo,e),O(ao,t),Gl=e|t.baseLanes}function co(){O(oo,Gl),O(ao,ao.current)}function lo(){Gl=oo.current,D(ao),D(oo)}var uo=me(null),fo=null;function po(e){var t=e.alternate;O(N,N.current&1),O(uo,e),fo===null&&(t===null||ao.current!==null||t.memoizedState!==null)&&(fo=e)}function mo(e){O(N,N.current),O(uo,e),fo===null&&(fo=e)}function ho(e){e.tag===22?(O(N,N.current),O(uo,e),fo===null&&(fo=e)):go(e)}function go(){O(N,N.current),O(uo,uo.current)}function _o(e){D(uo),fo===e&&(fo=null),D(N)}var N=me(0);function vo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var yo=0,P=null,F=null,I=null,bo=!1,xo=!1,So=!1,Co=0,wo=0,To=null,Eo=0;function L(){throw Error(a(321))}function Do(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!jr(e[n],t[n]))return!1;return!0}function Oo(e,t,n,r,i,a){return yo=a,P=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,T.H=e===null||e.memoizedState===null?Ws:Gs,So=!1,a=n(r,i),So=!1,xo&&(a=Ao(t,n,r,i)),ko(e),a}function ko(e){T.H=Us;var t=F!==null&&F.next!==null;if(yo=0,I=F=P=null,bo=!1,wo=0,To=null,t)throw Error(a(300));e===null||z||(e=e.dependencies,e!==null&&sa(e)&&(z=!0))}function Ao(e,t,n,r){P=e;var i=0;do{if(xo&&(To=null),wo=0,xo=!1,25<=i)throw Error(a(301));if(i+=1,I=F=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}T.H=Ks,o=t(n,r)}while(xo);return o}function jo(){var e=T.H,t=e.useState()[0];return t=typeof t.then==`function`?Lo(t):t,e=e.useState()[0],(F===null?null:F.memoizedState)!==e&&(P.flags|=1024),t}function Mo(){var e=Co!==0;return Co=0,e}function No(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Po(e){if(bo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}bo=!1}yo=0,I=F=P=null,xo=!1,wo=Co=0,To=null}function Fo(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return I===null?P.memoizedState=I=e:I=I.next=e,I}function R(){if(F===null){var e=P.alternate;e=e===null?null:e.memoizedState}else e=F.next;var t=I===null?P.memoizedState:I.next;if(t!==null)I=t,F=e;else{if(e===null)throw P.alternate===null?Error(a(467)):Error(a(310));F=e,e={memoizedState:F.memoizedState,baseState:F.baseState,baseQueue:F.baseQueue,queue:F.queue,next:null},I===null?P.memoizedState=I=e:I=I.next=e}return I}function Io(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Lo(e){var t=wo;return wo+=1,To===null&&(To=[]),e=Pa(To,e,t),t=P,(I===null?t.memoizedState:I.next)===null&&(t=t.alternate,T.H=t===null||t.memoizedState===null?Ws:Gs),e}function Ro(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Lo(e);if(e.$$typeof===S)return la(e)}throw Error(a(438,String(e)))}function zo(e){var t=null,n=P.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=P.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Io(),P.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=ae;return t.index++,n}function Bo(e,t){return typeof t==`function`?t(e):t}function Vo(e){return Ho(R(),F,e)}function Ho(e,t,n){var r=e.queue;if(r===null)throw Error(a(311));r.lastRenderedReducer=n;var i=e.baseQueue,o=r.pending;if(o!==null){if(i!==null){var s=i.next;i.next=o.next,o.next=s}t.baseQueue=i=o,r.pending=null}if(o=e.baseState,i===null)e.memoizedState=o;else{t=i.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(yo&f)===f:(q&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ya&&(d=!0);else if((yo&p)===p){u=u.next,p===ya&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,P.lanes|=p,Kl|=p;f=u.action,So&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,P.lanes|=f,Kl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!jr(o,e.memoizedState)&&(z=!0,d&&(n=ba,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return i===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Uo(e){var t=R(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,o=t.memoizedState;if(i!==null){n.pending=null;var s=i=i.next;do o=e(o,s.action),s=s.next;while(s!==i);jr(o,t.memoizedState)||(z=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Wo(e,t,n){var r=P,i=R(),o=j;if(o){if(n===void 0)throw Error(a(407));n=n()}else n=t();var s=!jr((F||i).memoizedState,n);if(s&&(i.memoizedState=n,z=!0),i=i.queue,hs(qo.bind(null,r,i,e),[e]),i.getSnapshot!==t||s||I!==null&&I.memoizedState.tag&1){if(r.flags|=2048,us(9,{destroy:void 0},Ko.bind(null,r,i,n,t),null),G===null)throw Error(a(349));o||yo&127||Go(r,t,n)}return n}function Go(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=P.updateQueue,t===null?(t=Io(),P.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ko(e,t,n,r){t.value=n,t.getSnapshot=r,Jo(t)&&Yo(e)}function qo(e,t,n){return n(function(){Jo(t)&&Yo(e)})}function Jo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!jr(e,n)}catch{return!0}}function Yo(e){var t=fi(e,2);t!==null&&hu(t,e,2)}function Xo(e){var t=Fo();if(typeof e==`function`){var n=e;if(e=n(),So){Ke(!0);try{n()}finally{Ke(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:e},t}function Zo(e,t,n,r){return e.baseState=n,Ho(e,F,typeof r==`function`?r:Bo)}function Qo(e,t,n,r,i){if(Bs(e))throw Error(a(485));if(e=t.action,e!==null){var o={payload:i,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};T.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,$o(t,o)):(o.next=n.next,t.pending=n.next=o)}}function $o(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=T.T,o={};T.T=o;try{var s=n(i,r),c=T.S;c!==null&&c(o,s),es(e,t,s)}catch(n){ns(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),T.T=a}}else try{a=n(i,r),es(e,t,a)}catch(n){ns(e,t,n)}}function es(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){ts(e,t,n)},function(n){return ns(e,t,n)}):ts(e,t,n)}function ts(e,t,n){t.status=`fulfilled`,t.value=n,rs(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,$o(e,n)))}function ns(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,rs(t),t=t.next;while(t!==r)}e.action=null}function rs(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function is(e,t){return t}function as(e,t){if(j){var n=G.formState;if(n!==null){a:{var r=P;if(j){if(A){b:{for(var i=A,a=Wi;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){A=cf(i.nextSibling),r=i.data===`F!`;break a}}Ki(r)}r=!1}r&&(t=n[0])}}return n=Fo(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:is,lastRenderedState:t},n.queue=r,n=Ls.bind(null,P,r),r.dispatch=n,r=Xo(!1),a=zs.bind(null,P,!1,r.queue),r=Fo(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Qo.bind(null,P,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function os(e){return ss(R(),F,e)}function ss(e,t,n){if(t=Ho(e,t,is)[0],e=Vo(Bo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Lo(t)}catch(e){throw e===ka?ja:e}else r=t;t=R();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(P.flags|=2048,us(9,{destroy:void 0},cs.bind(null,i,n),null)),[r,a,e]}function cs(e,t){e.action=t}function ls(e){var t=R(),n=F;if(n!==null)return ss(t,n,e);R(),t=t.memoizedState,n=R();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function us(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=P.updateQueue,t===null&&(t=Io(),P.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function ds(){return R().memoizedState}function fs(e,t,n,r){var i=Fo();P.flags|=e,i.memoizedState=us(1|t,{destroy:void 0},n,r===void 0?null:r)}function ps(e,t,n,r){var i=R();r=r===void 0?null:r;var a=i.memoizedState.inst;F!==null&&r!==null&&Do(r,F.memoizedState.deps)?i.memoizedState=us(t,a,n,r):(P.flags|=e,i.memoizedState=us(1|t,a,n,r))}function ms(e,t){fs(8390656,8,e,t)}function hs(e,t){ps(2048,8,e,t)}function gs(e){P.flags|=4;var t=P.updateQueue;if(t===null)t=Io(),P.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function _s(e){var t=R().memoizedState;return gs({ref:t,nextImpl:e}),function(){if(W&2)throw Error(a(440));return t.impl.apply(void 0,arguments)}}function vs(e,t){return ps(4,2,e,t)}function ys(e,t){return ps(4,4,e,t)}function bs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function xs(e,t,n){n=n==null?null:n.concat([e]),ps(4,4,bs.bind(null,t,e),n)}function Ss(){}function Cs(e,t){var n=R();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Do(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ws(e,t){var n=R();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Do(t,r[1]))return r[0];if(r=e(),So){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r}function Ts(e,t,n){return n===void 0||yo&1073741824&&!(q&261930)?e.memoizedState=t:(e.memoizedState=n,e=mu(),P.lanes|=e,Kl|=e,n)}function Es(e,t,n,r){return jr(n,t)?n:ao.current===null?!(yo&42)||yo&1073741824&&!(q&261930)?(z=!0,e.memoizedState=n):(e=mu(),P.lanes|=e,Kl|=e,t):(e=Ts(e,n,r),jr(e,t)||(z=!0),e)}function Ds(e,t,n,r,i){var a=E.p;E.p=a!==0&&8>a?a:8;var o=T.T,s={};T.T=s,zs(e,!1,t,n);try{var c=i(),l=T.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Rs(e,t,Ca(c,r),pu(e)):Rs(e,t,r,pu(e))}catch(n){Rs(e,t,{then:function(){},status:`rejected`,reason:n},pu())}finally{E.p=a,o!==null&&s.types!==null&&(o.types=s.types),T.T=o}}function Os(){}function ks(e,t,n,r){if(e.tag!==5)throw Error(a(476));var i=As(e).queue;Ds(e,i,t,de,n===null?Os:function(){return js(e),n(r)})}function As(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:de,baseState:de,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:de},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function js(e){var t=As(e);t.next===null&&(t=e.alternate.memoizedState),Rs(e,t.next.queue,{},pu())}function Ms(){return la(Qf)}function Ns(){return R().memoizedState}function Ps(){return R().memoizedState}function Fs(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=pu();e=Xa(n);var r=Za(t,e,n);r!==null&&(hu(r,t,n),Qa(r,t,n)),t={cache:ha()},e.payload=t;return}t=t.return}}function Is(e,t,n){var r=pu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Bs(e)?Vs(t,n):(n=di(e,t,n,r),n!==null&&(hu(n,e,r),Hs(n,t,r)))}function Ls(e,t,n){Rs(e,t,n,pu())}function Rs(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Bs(e))Vs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,jr(s,o))return ui(e,t,i,0),G===null&&li(),!1}catch{}if(n=di(e,t,i,r),n!==null)return hu(n,e,r),Hs(n,t,r),!0}return!1}function zs(e,t,n,r){if(r={lane:2,revertLane:dd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Bs(e)){if(t)throw Error(a(479))}else t=di(e,n,r,2),t!==null&&hu(t,e,2)}function Bs(e){var t=e.alternate;return e===P||t!==null&&t===P}function Vs(e,t){xo=bo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Hs(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}var Us={readContext:la,use:Ro,useCallback:L,useContext:L,useEffect:L,useImperativeHandle:L,useLayoutEffect:L,useInsertionEffect:L,useMemo:L,useReducer:L,useRef:L,useState:L,useDebugValue:L,useDeferredValue:L,useTransition:L,useSyncExternalStore:L,useId:L,useHostTransitionStatus:L,useFormState:L,useActionState:L,useOptimistic:L,useMemoCache:L,useCacheRefresh:L};Us.useEffectEvent=L;var Ws={readContext:la,use:Ro,useCallback:function(e,t){return Fo().memoizedState=[e,t===void 0?null:t],e},useContext:la,useEffect:ms,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),fs(4194308,4,bs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return fs(4194308,4,e,t)},useInsertionEffect:function(e,t){fs(4,2,e,t)},useMemo:function(e,t){var n=Fo();t=t===void 0?null:t;var r=e();if(So){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Fo();if(n!==void 0){var i=n(t);if(So){Ke(!0);try{n(t)}finally{Ke(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Is.bind(null,P,e),[r.memoizedState,e]},useRef:function(e){var t=Fo();return e={current:e},t.memoizedState=e},useState:function(e){e=Xo(e);var t=e.queue,n=Ls.bind(null,P,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Ss,useDeferredValue:function(e,t){return Ts(Fo(),e,t)},useTransition:function(){var e=Xo(!1);return e=Ds.bind(null,P,e.queue,!0,!1),Fo().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=P,i=Fo();if(j){if(n===void 0)throw Error(a(407));n=n()}else{if(n=t(),G===null)throw Error(a(349));q&127||Go(r,t,n)}i.memoizedState=n;var o={value:n,getSnapshot:t};return i.queue=o,ms(qo.bind(null,r,o,e),[e]),r.flags|=2048,us(9,{destroy:void 0},Ko.bind(null,r,o,n,t),null),n},useId:function(){var e=Fo(),t=G.identifierPrefix;if(j){var n=Ii,r=Fi;n=(r&~(1<<32-qe(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=Co++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Eo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:Ms,useFormState:as,useActionState:as,useOptimistic:function(e){var t=Fo();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=zs.bind(null,P,!0,n),n.dispatch=t,[e,t]},useMemoCache:zo,useCacheRefresh:function(){return Fo().memoizedState=Fs.bind(null,P)},useEffectEvent:function(e){var t=Fo(),n={impl:e};return t.memoizedState=n,function(){if(W&2)throw Error(a(440));return n.impl.apply(void 0,arguments)}}},Gs={readContext:la,use:Ro,useCallback:Cs,useContext:la,useEffect:hs,useImperativeHandle:xs,useInsertionEffect:vs,useLayoutEffect:ys,useMemo:ws,useReducer:Vo,useRef:ds,useState:function(){return Vo(Bo)},useDebugValue:Ss,useDeferredValue:function(e,t){return Es(R(),F.memoizedState,e,t)},useTransition:function(){var e=Vo(Bo)[0],t=R().memoizedState;return[typeof e==`boolean`?e:Lo(e),t]},useSyncExternalStore:Wo,useId:Ns,useHostTransitionStatus:Ms,useFormState:os,useActionState:os,useOptimistic:function(e,t){return Zo(R(),F,e,t)},useMemoCache:zo,useCacheRefresh:Ps};Gs.useEffectEvent=_s;var Ks={readContext:la,use:Ro,useCallback:Cs,useContext:la,useEffect:hs,useImperativeHandle:xs,useInsertionEffect:vs,useLayoutEffect:ys,useMemo:ws,useReducer:Uo,useRef:ds,useState:function(){return Uo(Bo)},useDebugValue:Ss,useDeferredValue:function(e,t){var n=R();return F===null?Ts(n,e,t):Es(n,F.memoizedState,e,t)},useTransition:function(){var e=Uo(Bo)[0],t=R().memoizedState;return[typeof e==`boolean`?e:Lo(e),t]},useSyncExternalStore:Wo,useId:Ns,useHostTransitionStatus:Ms,useFormState:ls,useActionState:ls,useOptimistic:function(e,t){var n=R();return F===null?(n.baseState=e,[e,n.queue.dispatch]):Zo(n,F,e,t)},useMemoCache:zo,useCacheRefresh:Ps};Ks.useEffectEvent=_s;function qs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:h({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Js={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Xa(r);i.payload=t,n!=null&&(i.callback=n),t=Za(e,i,r),t!==null&&(hu(t,e,r),Qa(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Xa(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Za(e,i,r),t!==null&&(hu(t,e,r),Qa(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pu(),r=Xa(n);r.tag=2,t!=null&&(r.callback=t),t=Za(e,r,n),t!==null&&(hu(t,e,n),Qa(t,e,n))}};function Ys(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Mr(n,r)||!Mr(i,a):!0}function Xs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Js.enqueueReplaceState(t,t.state,null)}function Zs(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=h({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Qs(e){ai(e)}function $s(e){console.error(e)}function ec(e){ai(e)}function tc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function nc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function rc(e,t,n){return n=Xa(n),n.tag=3,n.payload={element:null},n.callback=function(){tc(e,t)},n}function ic(e){return e=Xa(e),e.tag=3,e}function ac(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){nc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){nc(t,n,r),typeof i!=`function`&&(iu===null?iu=new Set([this]):iu.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function oc(e,t,n,r,i){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&oa(t,n,i,!0),n=uo.current,n!==null){switch(n.tag){case 31:case 13:return fo===null?Du():n.alternate===null&&Y===0&&(Y=3),n.flags&=-257,n.flags|=65536,n.lanes=i,r===Ma?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Gu(e,r,i)),!1;case 22:return n.flags|=65536,r===Ma?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Gu(e,r,i)),!1}throw Error(a(435,n.tag))}return Gu(e,r,i),Du(),!1}if(j)return t=uo.current,t===null?(r!==Gi&&(t=Error(a(423),{cause:r}),Qi(Di(t,n))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,r=Di(r,n),i=rc(e.stateNode,r,i),$a(e,i),Y!==4&&(Y=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=i,r!==Gi&&(e=Error(a(422),{cause:r}),Qi(Di(e,n)))),!1;var o=Error(a(520),{cause:r});if(o=Di(o,n),Zl===null?Zl=[o]:Zl.push(o),Y!==4&&(Y=2),t===null)return!0;r=Di(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=i&-i,n.lanes|=e,e=rc(n.stateNode,r,e),$a(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(iu===null||!iu.has(o))))return n.flags|=65536,i&=-i,n.lanes|=i,i=ic(i),ac(i,e,n,r),$a(n,i),!1}n=n.return}while(n!==null);return!1}var sc=Error(a(461)),z=!1;function cc(e,t,n,r){t.child=e===null?Ka(t,null,n,r):Ga(t,e.child,n,r)}function lc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ca(t),r=Oo(e,t,n,o,a,i),s=Mo(),e!==null&&!z?(No(e,t,i),Nc(e,t,i)):(j&&s&&zi(t),t.flags|=1,cc(e,t,r,i),t.child)}function uc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!vi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,dc(e,t,a,r,i)):(e=xi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Pc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Mr:n,n(o,r)&&e.ref===t.ref)return Nc(e,t,i)}return t.flags|=1,e=yi(a,r),e.ref=t.ref,e.return=t,t.child=e}function dc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Mr(a,r)&&e.ref===t.ref){if(z=!1,t.pendingProps=r=a,Pc(e,i))e.flags&131072&&(z=!0);else return t.lanes=e.lanes,Nc(e,t,i)}}return yc(e,t,n,r,i)}function fc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return mc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Da(t,a===null?null:a.cachePool),a===null?co():so(t,a),ho(t);else return r=t.lanes=536870912,mc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Da(t,null),co(),go(t)):(Da(t,a.cachePool),so(t,a),go(t),t.memoizedState=null);return cc(e,t,i,n),t.child}function pc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function mc(e,t,n,r,i){var a=Ea();return a=a===null?null:{parent:M._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Da(t,null),co(),ho(t),e!==null&&oa(e,t,r,!0),t.childLanes=i,null}function hc(e,t){return t=Oc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function gc(e,t,n){return Ga(t,e.child,null,n),e=hc(t,t.pendingProps),e.flags|=2,_o(t),t.memoizedState=null,e}function _c(e,t,n){var r=t.pendingProps,i=!!(t.flags&128);if(t.flags&=-129,e===null){if(j){if(r.mode===`hidden`)return e=hc(t,r),t.lanes=536870912,pc(null,e);if(mo(t),(e=A)?(e=rf(e,Wi),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Pi===null?null:{id:Fi,overflow:Ii},retryLane:536870912,hydrationErrors:null},n=wi(e),n.return=t,t.child=n,Hi=t,A=null)):e=null,e===null)throw Ki(t);return t.lanes=536870912,null}return hc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(mo(t),i){if(t.flags&256)t.flags&=-257,t=gc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(a(558))}else if(z||oa(e,t,n,!1),i=(n&e.childLanes)!==0,z||i){if(r=G,r!==null&&(s=ut(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,fi(e,s),hu(r,e,s),sc;Du(),t=gc(e,t,n)}else e=o.treeContext,A=cf(s.nextSibling),Hi=t,j=!0,Ui=null,Wi=!1,e!==null&&Vi(t,e),t=hc(t,r),t.flags|=4096;return t}return e=yi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function vc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(a(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function yc(e,t,n,r,i){return ca(t),n=Oo(e,t,n,r,void 0,i),r=Mo(),e!==null&&!z?(No(e,t,i),Nc(e,t,i)):(j&&r&&zi(t),t.flags|=1,cc(e,t,n,i),t.child)}function bc(e,t,n,r,i,a){return ca(t),t.updateQueue=null,n=Ao(t,r,n,i),ko(e),r=Mo(),e!==null&&!z?(No(e,t,a),Nc(e,t,a)):(j&&r&&zi(t),t.flags|=1,cc(e,t,n,a),t.child)}function xc(e,t,n,r,i){if(ca(t),t.stateNode===null){var a=hi,o=n.contextType;typeof o==`object`&&o&&(a=la(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Js,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Ja(t),o=n.contextType,a.context=typeof o==`object`&&o?la(o):hi,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(qs(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Js.enqueueReplaceState(a,a.state,null),no(t,r,a,i),to(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Zs(n,s);a.props=c;var l=a.context,u=n.contextType;o=hi,typeof u==`object`&&u&&(o=la(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Xs(t,a,r,o),qa=!1;var f=t.memoizedState;a.state=f,no(t,r,a,i),to(),l=t.memoizedState,s||f!==l||qa?(typeof d==`function`&&(qs(t,n,d,r),l=t.memoizedState),(c=qa||Ys(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Ya(e,t),o=t.memoizedProps,u=Zs(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=hi,typeof l==`object`&&l&&(c=la(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Xs(t,a,r,c),qa=!1,f=t.memoizedState,a.state=f,no(t,r,a,i),to();var p=t.memoizedState;o!==d||f!==p||qa||e!==null&&e.dependencies!==null&&sa(e.dependencies)?(typeof s==`function`&&(qs(t,n,s,r),p=t.memoizedState),(u=qa||Ys(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&sa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,vc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Ga(t,e.child,null,i),t.child=Ga(t,null,n,i)):cc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Nc(e,t,i),e}function Sc(e,t,n,r){return Xi(),t.flags|=256,cc(e,t,n,r),t.child}var Cc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function wc(e){return{baseLanes:e,cachePool:Oa()}}function Tc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=Yl),e}function Ec(e,t,n){var r=t.pendingProps,i=!1,o=!!(t.flags&128),s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:!!(N.current&2)),s&&(i=!0,t.flags&=-129),s=!!(t.flags&32),t.flags&=-33,e===null){if(j){if(i?po(t):go(t),(e=A)?(e=rf(e,Wi),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Pi===null?null:{id:Fi,overflow:Ii},retryLane:536870912,hydrationErrors:null},n=wi(e),n.return=t,t.child=n,Hi=t,A=null)):e=null,e===null)throw Ki(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,i?(go(t),i=t.mode,c=Oc({mode:`hidden`,children:c},i),r=Si(r,i,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=wc(n),r.childLanes=Tc(e,s,n),t.memoizedState=Cc,pc(null,r)):(po(t),Dc(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(po(t),t.flags&=-257,t=kc(e,t,n)):t.memoizedState===null?(go(t),c=r.fallback,i=t.mode,r=Oc({mode:`visible`,children:r.children},i),c=Si(c,i,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Ga(t,e.child,null,n),r=t.child,r.memoizedState=wc(n),r.childLanes=Tc(e,s,n),t.memoizedState=Cc,t=pc(null,r)):(go(t),t.child=e.child,t.flags|=128,t=null);else if(po(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(a(419)),r.stack=``,r.digest=s,Qi({value:r,source:null,stack:null}),t=kc(e,t,n)}else if(z||oa(e,t,n,!1),s=(n&e.childLanes)!==0,z||s){if(s=G,s!==null&&(r=ut(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,fi(e,r),hu(s,e,r),sc;af(c)||Du(),t=kc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,A=cf(c.nextSibling),Hi=t,j=!0,Ui=null,Wi=!1,e!==null&&Vi(t,e),t=Dc(t,r.children),t.flags|=4096);return t}return i?(go(t),c=r.fallback,i=t.mode,l=e.child,u=l.sibling,r=yi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=Si(c,i,n,null),c.flags|=2):c=yi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,pc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=wc(n):(i=c.cachePool,i===null?i=Oa():(l=M._currentValue,i=i.parent===l?i:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:i}),r.memoizedState=c,r.childLanes=Tc(e,s,n),t.memoizedState=Cc,pc(e.child,r)):(po(t),n=e.child,e=n.sibling,n=yi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Dc(e,t){return t=Oc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function Oc(e,t){return e=_i(22,e,null,t),e.lanes=0,e}function kc(e,t,n){return Ga(t,e.child,null,n),e=Dc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Ac(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ia(e.return,t,n)}function jc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Mc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=N.current,s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,O(N,o),cc(e,t,r,n),r=j?ji:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ac(e,n,t);else if(e.tag===19)Ac(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&vo(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),jc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&vo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}jc(t,!0,n,null,a,r);break;case`together`:jc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Nc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Kl|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(oa(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(a(153));if(t.child!==null){for(e=t.child,n=yi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=yi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Pc(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&sa(e)))}function Fc(e,t,n){switch(t.tag){case 3:ye(t,t.stateNode.containerInfo),na(t,M,e.memoizedState.cache),Xi();break;case 27:case 5:xe(t);break;case 4:ye(t,t.stateNode.containerInfo);break;case 10:na(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,mo(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(po(t),e=Nc(e,t,n),e===null?null:e.sibling):Ec(e,t,n):(po(t),t.flags|=128,null);po(t);break;case 19:var i=!!(e.flags&128);if(r=(n&t.childLanes)!==0,r||=(oa(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Mc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),O(N,N.current),r)break;return null;case 22:return t.lanes=0,fc(e,t,n,t.pendingProps);case 24:na(t,M,e.memoizedState.cache)}return Nc(e,t,n)}function Ic(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)z=!0;else{if(!Pc(e,n)&&!(t.flags&128))return z=!1,Fc(e,t,n);z=!!(e.flags&131072)}}else z=!1,j&&t.flags&1048576&&Ri(t,ji,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=Fa(t.elementType),t.type=e,typeof e==`function`)vi(e)?(r=Zs(e,r),t.tag=1,t=xc(null,t,e,r,n)):(t.tag=0,t=yc(null,t,e,r,n));else{if(e!=null){var i=e.$$typeof;if(i===C){t.tag=11,t=lc(null,t,e,r,n);break a}if(i===re){t.tag=14,t=uc(null,t,e,r,n);break a}}throw t=le(e)||e,Error(a(306,t,``))}}return t;case 0:return yc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,i=Zs(r,t.pendingProps),xc(e,t,r,i,n);case 3:a:{if(ye(t,t.stateNode.containerInfo),e===null)throw Error(a(387));r=t.pendingProps;var o=t.memoizedState;i=o.element,Ya(e,t),no(t,r,null,n);var s=t.memoizedState;if(r=s.cache,na(t,M,r),r!==o.cache&&aa(t,[M],n,!0),to(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Sc(e,t,r,n);break a}if(r!==i){i=Di(Error(a(424)),t),Qi(i),t=Sc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(A=cf(e.firstChild),Hi=t,j=!0,Ui=null,Wi=!0,n=Ka(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Xi(),r===i){t=Nc(e,t,n);break a}cc(e,t,r,n)}t=t.child}return t;case 26:return vc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:j||(n=t.type,e=t.pendingProps,r=Bd(_e.current).createElement(n),r[gt]=t,r[_t]=e,Pd(r,n,e),k(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return xe(t),e===null&&j&&(r=t.stateNode=ff(t.type,t.pendingProps,_e.current),Hi=t,Wi=!0,i=A,Zd(t.type)?(lf=i,A=cf(r.firstChild)):A=i),cc(e,t,t.pendingProps.children,n),vc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&j&&((i=r=A)&&(r=tf(r,t.type,t.pendingProps,Wi),r===null?i=!1:(t.stateNode=r,Hi=t,A=cf(r.firstChild),Wi=!1,i=!0)),i||Ki(t)),xe(t),i=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(i,o)?r=null:s!==null&&Ud(i,s)&&(t.flags|=32),t.memoizedState!==null&&(i=Oo(e,t,jo,null,null,n),Qf._currentValue=i),vc(e,t),cc(e,t,r,n),t.child;case 6:return e===null&&j&&((e=n=A)&&(n=nf(n,t.pendingProps,Wi),n===null?e=!1:(t.stateNode=n,Hi=t,A=null,e=!0)),e||Ki(t)),null;case 13:return Ec(e,t,n);case 4:return ye(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Ga(t,null,r,n):cc(e,t,r,n),t.child;case 11:return lc(e,t,t.type,t.pendingProps,n);case 7:return cc(e,t,t.pendingProps,n),t.child;case 8:return cc(e,t,t.pendingProps.children,n),t.child;case 12:return cc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,na(t,t.type,r.value),cc(e,t,r.children,n),t.child;case 9:return i=t.type._context,r=t.pendingProps.children,ca(t),i=la(i),r=r(i),t.flags|=1,cc(e,t,r,n),t.child;case 14:return uc(e,t,t.type,t.pendingProps,n);case 15:return dc(e,t,t.type,t.pendingProps,n);case 19:return Mc(e,t,n);case 31:return _c(e,t,n);case 22:return fc(e,t,n,t.pendingProps);case 24:return ca(t),r=la(M),e===null?(i=Ea(),i===null&&(i=G,o=ha(),i.pooledCache=o,o.refCount++,o!==null&&(i.pooledCacheLanes|=n),i=o),t.memoizedState={parent:r,cache:i},Ja(t),na(t,M,i)):((e.lanes&n)!==0&&(Ya(e,t),no(t,null,null,n),to()),i=e.memoizedState,o=t.memoizedState,i.parent===r?(r=o.cache,na(t,M,r),r!==i.cache&&aa(t,[M],n,!0)):(i={parent:r,cache:r},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),na(t,M,r))),cc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(a(156,t.tag))}function Lc(e){e.flags|=4}function Rc(e,t,n,r,i){if((t=!!(e.mode&32))&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(wu())e.flags|=8192;else throw Ia=Ma,Aa}}else e.flags&=-16777217}function zc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t)){if(wu())e.flags|=8192;else throw Ia=Ma,Aa}}function Bc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:it(),e.lanes|=t,Xl|=t)}function Vc(e,t){if(!j)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function B(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Hc(e,t,n){var r=t.pendingProps;switch(Bi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return B(t),null;case 1:return B(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),ra(M),be(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Yi(t)?Lc(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Zi())),B(t),null;case 26:var i=t.type,o=t.memoizedState;return e===null?(Lc(t),o===null?(B(t),Rc(t,i,null,r,n)):(B(t),zc(t,o))):o?o===e.memoizedState?(B(t),t.flags&=-16777217):(Lc(t),B(t),zc(t,o)):(e=e.memoizedProps,e!==r&&Lc(t),B(t),Rc(t,i,e,r,n)),null;case 27:if(Se(t),n=_e.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Lc(t);else{if(!r){if(t.stateNode===null)throw Error(a(166));return B(t),null}e=he.current,Yi(t)?qi(t,e):(e=ff(i,r,n),t.stateNode=e,Lc(t))}return B(t),null;case 5:if(Se(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Lc(t);else{if(!r){if(t.stateNode===null)throw Error(a(166));return B(t),null}if(o=he.current,Yi(t))qi(t,o);else{var s=Bd(_e.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,i);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;default:switch(i){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,i);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(i,{is:r.is}):s.createElement(i)}}o[gt]=t,o[_t]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Pd(o,i,r),i){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Lc(t)}}return B(t),Rc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Lc(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(a(166));if(e=_e.current,Yi(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,i=Hi,i!==null)switch(i.tag){case 27:case 5:r=i.memoizedProps}e[gt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Ki(t,!0)}else e=Bd(e).createTextNode(r),e[gt]=t,t.stateNode=e}return B(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Yi(t),n!==null){if(e===null){if(!r)throw Error(a(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(a(557));e[gt]=t}else Xi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;B(t),e=!1}else n=Zi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(_o(t),t):(_o(t),null);if(t.flags&128)throw Error(a(558))}return B(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Yi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(a(318));if(i=t.memoizedState,i=i===null?null:i.dehydrated,!i)throw Error(a(317));i[gt]=t}else Xi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;B(t),i=!1}else i=Zi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(_o(t),t):(_o(t),null)}return _o(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,i=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(i=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==i&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Bc(t,t.updateQueue),B(t),null);case 4:return be(),e===null&&Sd(t.stateNode.containerInfo),B(t),null;case 10:return ra(t.type),B(t),null;case 19:if(D(N),r=t.memoizedState,r===null)return B(t),null;if(i=!!(t.flags&128),o=r.rendering,o===null){if(i)Vc(r,!1);else{if(Y!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=vo(e),o!==null){for(t.flags|=128,Vc(r,!1),e=o.updateQueue,t.updateQueue=e,Bc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)bi(n,e),n=n.sibling;return O(N,N.current&1|2),j&&Li(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Fe()>nu&&(t.flags|=128,i=!0,Vc(r,!1),t.lanes=4194304)}}else{if(!i){if(e=vo(o),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,Bc(t,e),Vc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!j)return B(t),null}else 2*Fe()-r.renderingStartTime>nu&&n!==536870912&&(t.flags|=128,i=!0,Vc(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(B(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Fe(),e.sibling=null,n=N.current,O(N,i?n&1|2:n&1),j&&Li(t,r.treeForkCount),e);case 22:case 23:return _o(t),lo(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(B(t),t.subtreeFlags&6&&(t.flags|=8192)):B(t),n=t.updateQueue,n!==null&&Bc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&D(Ta),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),ra(M),B(t),null;case 25:return null;case 30:return null}throw Error(a(156,t.tag))}function Uc(e,t){switch(Bi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ra(M),be(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Se(t),null;case 31:if(t.memoizedState!==null){if(_o(t),t.alternate===null)throw Error(a(340));Xi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(_o(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(a(340));Xi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return D(N),null;case 4:return be(),null;case 10:return ra(t.type),null;case 22:case 23:return _o(t),lo(),e!==null&&D(Ta),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return ra(M),null;case 25:return null;default:return null}}function Wc(e,t){switch(Bi(t),t.tag){case 3:ra(M),be();break;case 26:case 27:case 5:Se(t);break;case 4:be();break;case 31:t.memoizedState!==null&&_o(t);break;case 13:_o(t);break;case 19:D(N);break;case 10:ra(t.type);break;case 22:case 23:_o(t),lo(),e!==null&&D(Ta);break;case 24:ra(M)}}function Gc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Kc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function qc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{io(t,n)}catch(t){Z(e,e.return,t)}}}function Jc(e,t,n){n.props=Zs(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Yc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function Xc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Zc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Qc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[_t]=t}catch(t){Z(e,e.return,t)}}function $c(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function el(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||$c(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function tl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ln));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(tl(e,t,n),e=e.sibling;e!==null;)tl(e,t,n),e=e.sibling}function nl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(nl(e,t,n),e=e.sibling;e!==null;)nl(e,t,n),e=e.sibling}function rl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[gt]=e,t[_t]=n}catch(t){Z(e,e.return,t)}}var il=!1,V=!1,al=!1,ol=typeof WeakSet==`function`?WeakSet:Set,H=null;function sl(e,t){if(e=e.containerInfo,Rd=sp,e=Ir(e),Lr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||i!==0&&f.nodeType!==3||(c=s+i),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===i&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,H=t;H!==null;)if(t=H,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,H=e;else for(;H!==null;){switch(t=H,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)i=e[n],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,i=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Zs(n.type,i);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Z(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(a(163))}if(e=t.sibling,e!==null){e.return=t.return,H=e;break}H=t.return}}function cl(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Sl(e,n),r&4&&Gc(5,n);break;case 1:if(Sl(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Zs(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&qc(n),r&512&&Yc(n,n.return);break;case 3:if(Sl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{io(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&rl(n);case 26:case 5:Sl(e,n),t===null&&r&4&&Zc(n),r&512&&Yc(n,n.return);break;case 12:Sl(e,n);break;case 31:Sl(e,n),r&4&&pl(e,n);break;case 13:Sl(e,n),r&4&&ml(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Ju.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||il,!r){t=t!==null&&t.memoizedState!==null||V,i=il;var a=V;il=r,(V=t)&&!a?wl(e,n,!!(n.subtreeFlags&8772)):Sl(e,n),il=i,V=a}break;case 30:break;default:Sl(e,n)}}function ll(e){var t=e.alternate;t!==null&&(e.alternate=null,ll(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&wt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var U=null,ul=!1;function dl(e,t,n){for(n=n.child;n!==null;)fl(e,t,n),n=n.sibling}function fl(e,t,n){if(Ge&&typeof Ge.onCommitFiberUnmount==`function`)try{Ge.onCommitFiberUnmount(We,n)}catch{}switch(n.tag){case 26:V||Xc(n,t),dl(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:V||Xc(n,t);var r=U,i=ul;Zd(n.type)&&(U=n.stateNode,ul=!1),dl(e,t,n),pf(n.stateNode),U=r,ul=i;break;case 5:V||Xc(n,t);case 6:if(r=U,i=ul,U=null,dl(e,t,n),U=r,ul=i,U!==null){if(ul)try{(U.nodeType===9?U.body:U.nodeName===`HTML`?U.ownerDocument.body:U).removeChild(n.stateNode)}catch(e){Z(n,t,e)}else try{U.removeChild(n.stateNode)}catch(e){Z(n,t,e)}}break;case 18:U!==null&&(ul?(e=U,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(U,n.stateNode));break;case 4:r=U,i=ul,U=n.stateNode.containerInfo,ul=!0,dl(e,t,n),U=r,ul=i;break;case 0:case 11:case 14:case 15:Kc(2,n,t),V||Kc(4,n,t),dl(e,t,n);break;case 1:V||(Xc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Jc(n,t,r)),dl(e,t,n);break;case 21:dl(e,t,n);break;case 22:V=(r=V)||n.memoizedState!==null,dl(e,t,n),V=r;break;default:dl(e,t,n)}}function pl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Z(t,t.return,e)}}}function ml(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Z(t,t.return,e)}}function hl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ol),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ol),t;default:throw Error(a(435,e.tag))}}function gl(e,t){var n=hl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Yu.bind(null,e,t);t.then(r,r)}})}function _l(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){U=c.stateNode,ul=!1;break a}break;case 5:U=c.stateNode,ul=!1;break a;case 3:case 4:U=c.stateNode.containerInfo,ul=!0;break a}c=c.return}if(U===null)throw Error(a(160));fl(o,s,i),U=null,ul=!1,o=i.alternate,o!==null&&(o.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)yl(t,e),t=t.sibling}var vl=null;function yl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:_l(t,e),bl(e),r&4&&(Kc(3,e,e.return),Gc(3,e),Kc(5,e,e.return));break;case 1:_l(t,e),bl(e),r&512&&(V||n===null||Xc(n,n.return)),r&64&&il&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var i=vl;if(_l(t,e),bl(e),r&512&&(V||n===null||Xc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null){if(r===null){if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,i=i.ownerDocument||i;b:switch(r){case`title`:o=i.getElementsByTagName(`title`)[0],(!o||o[Ct]||o[gt]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=i.createElement(r),i.head.insertBefore(o,i.querySelector(`head > title`))),Pd(o,r,n),o[gt]=e,k(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,i).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=i.createElement(r),Pd(o,r,n),i.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,i).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=i.createElement(r),Pd(o,r,n),i.head.appendChild(o);break;default:throw Error(a(468,r))}o[gt]=e,k(o),r=o}e.stateNode=r}else Hf(i,e.type,e.stateNode)}else e.stateNode=If(i,r,e.memoizedProps)}else o===r?r===null&&e.stateNode!==null&&Qc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(i,e.type,e.stateNode):If(i,r,e.memoizedProps))}break;case 27:_l(t,e),bl(e),r&512&&(V||n===null||Xc(n,n.return)),n!==null&&r&4&&Qc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(_l(t,e),bl(e),r&512&&(V||n===null||Xc(n,n.return)),e.flags&32){i=e.stateNode;try{en(i,``)}catch(t){Z(e,e.return,t)}}r&4&&e.stateNode!=null&&(i=e.memoizedProps,Qc(e,i,n===null?i:n.memoizedProps)),r&1024&&(al=!0);break;case 6:if(_l(t,e),bl(e),r&4){if(e.stateNode===null)throw Error(a(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Z(e,e.return,t)}}break;case 3:if(Bf=null,i=vl,vl=gf(t.containerInfo),_l(t,e),vl=i,bl(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Z(e,e.return,t)}al&&(al=!1,xl(e));break;case 4:r=vl,vl=gf(e.stateNode.containerInfo),_l(t,e),bl(e),vl=r;break;case 12:_l(t,e),bl(e);break;case 31:_l(t,e),bl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,gl(e,r)));break;case 13:_l(t,e),bl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(eu=Fe()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,gl(e,r)));break;case 22:i=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=il,d=V;if(il=u||i,V=d||l,_l(t,e),V=d,il=u,bl(e),r&8192)a:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(n===null||l||il||V||Cl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,i)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Z(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=i?``:l.memoizedProps}catch(e){Z(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;i?$d(m,!0):$d(l.stateNode,!1)}catch(e){Z(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,gl(e,n))));break;case 19:_l(t,e),bl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,gl(e,r)));break;case 30:break;case 21:break;default:_l(t,e),bl(e)}}function bl(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if($c(r)){n=r;break}r=r.return}if(n==null)throw Error(a(160));switch(n.tag){case 27:var i=n.stateNode;nl(e,el(e),i);break;case 5:var o=n.stateNode;n.flags&32&&(en(o,``),n.flags&=-33),nl(e,el(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;tl(e,el(e),s);break;default:throw Error(a(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function xl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;xl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Sl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)cl(e,t.alternate,t),t=t.sibling}function Cl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Kc(4,t,t.return),Cl(t);break;case 1:Xc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&Jc(t,t.return,n),Cl(t);break;case 27:pf(t.stateNode);case 26:case 5:Xc(t,t.return),Cl(t);break;case 22:t.memoizedState===null&&Cl(t);break;case 30:Cl(t);break;default:Cl(t)}e=e.sibling}}function wl(e,t,n){for(n&&=!!(t.subtreeFlags&8772),t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:wl(i,a,n),Gc(4,a);break;case 1:if(wl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)ro(c[i],s)}catch(e){Z(r,r.return,e)}}n&&o&64&&qc(a),Yc(a,a.return);break;case 27:rl(a);case 26:case 5:wl(i,a,n),n&&r===null&&o&4&&Zc(a),Yc(a,a.return);break;case 12:wl(i,a,n);break;case 31:wl(i,a,n),n&&o&4&&pl(i,a);break;case 13:wl(i,a,n),n&&o&4&&ml(i,a);break;case 22:a.memoizedState===null&&wl(i,a,n),Yc(a,a.return);break;case 30:break;default:wl(i,a,n)}t=t.sibling}}function Tl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&ga(n))}function El(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ga(e))}function Dl(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Ol(e,t,n,r),t=t.sibling}function Ol(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:Dl(e,t,n,r),i&2048&&Gc(9,t);break;case 1:Dl(e,t,n,r);break;case 3:Dl(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ga(e)));break;case 12:if(i&2048){Dl(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Dl(e,t,n,r);break;case 31:Dl(e,t,n,r);break;case 13:Dl(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?Dl(e,t,n,r):(a._visibility|=2,kl(e,t,n,r,!!(t.subtreeFlags&10256)||!1)):a._visibility&2?Dl(e,t,n,r):Al(e,t),i&2048&&Tl(o,t);break;case 24:Dl(e,t,n,r),i&2048&&El(t.alternate,t);break;default:Dl(e,t,n,r)}}function kl(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:kl(a,o,s,c,i),Gc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,kl(a,o,s,c,i)):u._visibility&2?kl(a,o,s,c,i):Al(a,o),i&&l&2048&&Tl(o.alternate,o);break;case 24:kl(a,o,s,c,i),i&&l&2048&&El(o.alternate,o);break;default:kl(a,o,s,c,i)}t=t.sibling}}function Al(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Al(n,r),i&2048&&Tl(r.alternate,r);break;case 24:Al(n,r),i&2048&&El(r.alternate,r);break;default:Al(n,r)}t=t.sibling}}var jl=8192;function Ml(e,t,n){if(e.subtreeFlags&jl)for(e=e.child;e!==null;)Nl(e,t,n),e=e.sibling}function Nl(e,t,n){switch(e.tag){case 26:Ml(e,t,n),e.flags&jl&&e.memoizedState!==null&&Gf(n,vl,e.memoizedState,e.memoizedProps);break;case 5:Ml(e,t,n);break;case 3:case 4:var r=vl;vl=gf(e.stateNode.containerInfo),Ml(e,t,n),vl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=jl,jl=16777216,Ml(e,t,n),jl=r):Ml(e,t,n));break;default:Ml(e,t,n)}}function Pl(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Fl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];H=r,Rl(r,e)}Pl(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Il(e),e=e.sibling}function Il(e){switch(e.tag){case 0:case 11:case 15:Fl(e),e.flags&2048&&Kc(9,e,e.return);break;case 3:Fl(e);break;case 12:Fl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Ll(e)):Fl(e);break;default:Fl(e)}}function Ll(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];H=r,Rl(r,e)}Pl(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Kc(8,t,t.return),Ll(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Ll(t));break;default:Ll(t)}e=e.sibling}}function Rl(e,t){for(;H!==null;){var n=H;switch(n.tag){case 0:case 11:case 15:Kc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:ga(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,H=r;else a:for(n=e;H!==null;){r=H;var i=r.sibling,a=r.return;if(ll(r),r===n){H=null;break a}if(i!==null){i.return=a,H=i;break a}H=a}}}var zl={getCacheForType:function(e){var t=la(M),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return la(M).controller.signal}},Bl=typeof WeakMap==`function`?WeakMap:Map,W=0,G=null,K=null,q=0,J=0,Vl=null,Hl=!1,Ul=!1,Wl=!1,Gl=0,Y=0,Kl=0,ql=0,Jl=0,Yl=0,Xl=0,Zl=null,Ql=null,$l=!1,eu=0,tu=0,nu=1/0,ru=null,iu=null,X=0,au=null,ou=null,su=0,cu=0,lu=null,uu=null,du=0,fu=null;function pu(){return W&2&&q!==0?q&-q:T.T===null?pt():dd()}function mu(){if(Yl===0){if(!(q&536870912)||j){var e=Qe;Qe<<=1,!(Qe&3932160)&&(Qe=262144),Yl=e}else Yl=536870912}return e=uo.current,e!==null&&(e.flags|=32),Yl}function hu(e,t,n){(e===G&&(J===2||J===9)||e.cancelPendingCommit!==null)&&(Su(e,0),yu(e,q,Yl,!1)),ot(e,n),(!(W&2)||e!==G)&&(e===G&&(!(W&2)&&(ql|=n),Y===4&&yu(e,q,Yl,!1)),rd(e))}function gu(e,t,n){if(W&6)throw Error(a(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||nt(e,t),i=r?Au(e,t):Ou(e,t,!0),o=r;do{if(i===0){Ul&&!r&&yu(e,t,0,!1);break}if(n=e.current.alternate,o&&!vu(n)){i=Ou(e,t,!1),o=!1;continue}if(i===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;i=Zl;var l=c.current.memoizedState.isDehydrated;if(l&&(Su(c,s).flags|=256),s=Ou(c,s,!1),s!==2){if(Wl&&!l){c.errorRecoveryDisabledLanes|=o,ql|=o,i=4;break a}o=Ql,Ql=i,o!==null&&(Ql===null?Ql=o:Ql.push.apply(Ql,o))}i=s}if(o=!1,i!==2)continue}}if(i===1){Su(e,0),yu(e,t,0,!0);break}a:{switch(r=e,o=i,o){case 0:case 1:throw Error(a(345));case 4:if((t&4194048)!==t)break;case 6:yu(r,t,Yl,!Hl);break a;case 2:Ql=null;break;case 3:case 5:break;default:throw Error(a(329))}if((t&62914560)===t&&(i=eu+300-Fe(),10<i)){if(yu(r,t,Yl,!Hl),tt(r,0,!0)!==0)break a;su=t,r.timeoutHandle=Kd(_u.bind(null,r,n,Ql,ru,$l,t,Yl,ql,Xl,Hl,o,`Throttled`,-0,0),i);break a}_u(r,n,Ql,ru,$l,t,Yl,ql,Xl,Hl,o,null,-0,0)}break}while(1);rd(e)}function _u(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ln},Nl(t,a,d);var m=(a&62914560)===a?eu-Fe():(a&4194048)===a?tu-Fe():0;if(m=qf(d,m),m!==null){su=a,e.cancelPendingCommit=m(Lu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),yu(e,a,o,!l);return}}Lu(e,t,a,n,r,i,o,s,c)}function vu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!jr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function yu(e,t,n,r){t&=~Jl,t&=~ql,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-qe(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ct(e,n,t)}function bu(){return W&6?!0:(id(0,!1),!1)}function xu(){if(K!==null){if(J===0)var e=K.return;else e=K,ta=ea=null,Po(e),za=null,Ba=0,e=K;for(;e!==null;)Wc(e.alternate,e),e=e.return;K=null}}function Su(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),su=0,xu(),G=e,K=n=yi(e.current,null),q=t,J=0,Vl=null,Hl=!1,Ul=nt(e,t),Wl=!1,Xl=Yl=Jl=ql=Kl=Y=0,Ql=Zl=null,$l=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-qe(r),a=1<<i;t|=e[i],r&=~a}return Gl=t,li(),n}function Cu(e,t){P=null,T.H=Us,t===ka||t===ja?(t=La(),J=3):t===Aa?(t=La(),J=4):J=t===sc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Vl=t,K===null&&(Y=1,tc(e,Di(t,e.current)))}function wu(){var e=uo.current;return e===null?!0:(q&4194048)===q?fo===null:(q&62914560)===q||q&536870912?e===fo:!1}function Tu(){var e=T.H;return T.H=Us,e===null?Us:e}function Eu(){var e=T.A;return T.A=zl,e}function Du(){Y=4,Hl||(q&4194048)!==q&&uo.current!==null||(Ul=!0),!(Kl&134217727)&&!(ql&134217727)||G===null||yu(G,q,Yl,!1)}function Ou(e,t,n){var r=W;W|=2;var i=Tu(),a=Eu();(G!==e||q!==t)&&(ru=null,Su(e,t)),t=!1;var o=Y;a:do try{if(J!==0&&K!==null){var s=K,c=Vl;switch(J){case 8:xu(),o=6;break a;case 3:case 2:case 9:case 6:uo.current===null&&(t=!0);var l=J;if(J=0,Vl=null,Pu(e,s,c,l),n&&Ul){o=0;break a}break;default:l=J,J=0,Vl=null,Pu(e,s,c,l)}}ku(),o=Y;break}catch(t){Cu(e,t)}while(1);return t&&e.shellSuspendCounter++,ta=ea=null,W=r,T.H=i,T.A=a,K===null&&(G=null,q=0,li()),o}function ku(){for(;K!==null;)Mu(K)}function Au(e,t){var n=W;W|=2;var r=Tu(),i=Eu();G!==e||q!==t?(ru=null,nu=Fe()+500,Su(e,t)):Ul=nt(e,t);a:do try{if(J!==0&&K!==null){t=K;var o=Vl;b:switch(J){case 1:J=0,Vl=null,Pu(e,t,o,1);break;case 2:case 9:if(Na(o)){J=0,Vl=null,Nu(t);break}t=function(){J!==2&&J!==9||G!==e||(J=7),rd(e)},o.then(t,t);break a;case 3:J=7;break a;case 4:J=5;break a;case 7:Na(o)?(J=0,Vl=null,Nu(t)):(J=0,Vl=null,Pu(e,t,o,7));break;case 5:var s=null;switch(K.tag){case 26:s=K.memoizedState;case 5:case 27:var c=K;if(s?Wf(s):c.stateNode.complete){J=0,Vl=null;var l=c.sibling;if(l!==null)K=l;else{var u=c.return;u===null?K=null:(K=u,Fu(u))}break b}}J=0,Vl=null,Pu(e,t,o,5);break;case 6:J=0,Vl=null,Pu(e,t,o,6);break;case 8:xu(),Y=6;break a;default:throw Error(a(462))}}ju();break}catch(t){Cu(e,t)}while(1);return ta=ea=null,T.H=r,T.A=i,W=n,K===null?(G=null,q=0,li(),Y):0}function ju(){for(;K!==null&&!Ne();)Mu(K)}function Mu(e){var t=Ic(e.alternate,e,Gl);e.memoizedProps=e.pendingProps,t===null?Fu(e):K=t}function Nu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=bc(n,t,t.pendingProps,t.type,void 0,q);break;case 11:t=bc(n,t,t.pendingProps,t.type.render,t.ref,q);break;case 5:Po(t);default:Wc(n,t),t=K=bi(t,Gl),t=Ic(n,t,Gl)}e.memoizedProps=e.pendingProps,t===null?Fu(e):K=t}function Pu(e,t,n,r){ta=ea=null,Po(t),za=null,Ba=0;var i=t.return;try{if(oc(e,i,t,n,q)){Y=1,tc(e,Di(n,e.current)),K=null;return}}catch(t){if(i!==null)throw K=i,t;Y=1,tc(e,Di(n,e.current)),K=null;return}t.flags&32768?(j||r===1?e=!0:Ul||q&536870912?e=!1:(Hl=e=!0,(r===2||r===9||r===3||r===6)&&(r=uo.current,r!==null&&r.tag===13&&(r.flags|=16384))),Iu(t,e)):Fu(t)}function Fu(e){var t=e;do{if(t.flags&32768){Iu(t,Hl);return}e=t.return;var n=Hc(t.alternate,t,Gl);if(n!==null){K=n;return}if(t=t.sibling,t!==null){K=t;return}K=t=e}while(t!==null);Y===0&&(Y=5)}function Iu(e,t){do{var n=Uc(e.alternate,e);if(n!==null){n.flags&=32767,K=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){K=e;return}K=e=n}while(e!==null);Y=6,K=null}function Lu(e,t,n,r,i,o,s,c,l){e.cancelPendingCommit=null;do Hu();while(X!==0);if(W&6)throw Error(a(327));if(t!==null){if(t===e.current)throw Error(a(177));if(o=t.lanes|t.childLanes,o|=ci,st(e,n,o,s,c,l),e===G&&(K=G=null,q=0),ou=t,au=e,su=n,cu=o,lu=i,uu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Xu(ze,function(){return Uu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=T.T,T.T=null,i=E.p,E.p=2,s=W,W|=4;try{sl(e,t,n)}finally{W=s,E.p=i,T.T=r}}X=1,Ru(),zu(),Bu()}}function Ru(){if(X===1){X=0;var e=au,t=ou,n=!!(t.flags&13878);if(t.subtreeFlags&13878||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=W;W|=4;try{yl(t,e);var a=zd,o=Ir(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Fr(s.ownerDocument.documentElement,s)){if(c!==null&&Lr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Pr(s,h),v=Pr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{W=i,E.p=r,T.T=n}}e.current=t,X=2}}function zu(){if(X===2){X=0;var e=au,t=ou,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=W;W|=4;try{cl(e,t.alternate,t)}finally{W=i,E.p=r,T.T=n}}X=3}}function Bu(){if(X===4||X===3){X=0,Pe();var e=au,t=ou,n=su,r=uu;t.subtreeFlags&10256||t.flags&10256?X=5:(X=0,ou=au=null,Vu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(iu=null),ft(n),t=t.stateNode,Ge&&typeof Ge.onCommitFiberRoot==`function`)try{Ge.onCommitFiberRoot(We,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=T.T,i=E.p,E.p=2,T.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{T.T=t,E.p=i}}su&3&&Hu(),rd(e),i=e.pendingLanes,n&261930&&i&42?e===fu?du++:(du=0,fu=e):du=0,id(0,!1)}}function Vu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ga(t)))}function Hu(){return Ru(),zu(),Bu(),Uu()}function Uu(){if(X!==5)return!1;var e=au,t=cu;cu=0;var n=ft(su),r=T.T,i=E.p;try{E.p=32>n?32:n,T.T=null,n=lu,lu=null;var o=au,s=su;if(X=0,ou=au=null,su=0,W&6)throw Error(a(331));var c=W;if(W|=4,Il(o.current),Ol(o,o.current,s,n),W=c,id(0,!1),Ge&&typeof Ge.onPostCommitFiberRoot==`function`)try{Ge.onPostCommitFiberRoot(We,o)}catch{}return!0}finally{E.p=i,T.T=r,Vu(e,t)}}function Wu(e,t,n){t=Di(n,t),t=rc(e.stateNode,t,2),e=Za(e,t,2),e!==null&&(ot(e,2),rd(e))}function Z(e,t,n){if(e.tag===3)Wu(e,e,n);else for(;t!==null;){if(t.tag===3){Wu(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(iu===null||!iu.has(r))){e=Di(n,e),n=ic(2),r=Za(t,n,2),r!==null&&(ac(n,r,t,e),ot(r,2),rd(r));break}}t=t.return}}function Gu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Bl;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Wl=!0,i.add(n),e=Ku.bind(null,e,t,n),t.then(e,e))}function Ku(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,G===e&&(q&n)===n&&(Y===4||Y===3&&(q&62914560)===q&&300>Fe()-eu?!(W&2)&&Su(e,0):Jl|=n,Xl===q&&(Xl=0)),rd(e)}function qu(e,t){t===0&&(t=it()),e=fi(e,t),e!==null&&(ot(e,t),rd(e))}function Ju(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),qu(e,n)}function Yu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(a(314))}r!==null&&r.delete(t),qu(e,n)}function Xu(e,t){return je(e,t)}var Zu=null,Qu=null,$u=!1,ed=!1,td=!1,nd=0;function rd(e){e!==Qu&&e.next===null&&(Qu===null?Zu=Qu=e:Qu=Qu.next=e),ed=!0,$u||($u=!0,ud())}function id(e,t){if(!td&&ed){td=!0;do for(var n=!1,r=Zu;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-qe(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,ld(r,a))}else a=q,a=tt(r,r===G?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||nt(r,a)||(n=!0,ld(r,a))}r=r.next}while(n);td=!1}}function ad(){od()}function od(){ed=$u=!1;var e=0;nd!==0&&Gd()&&(e=nd);for(var t=Fe(),n=null,r=Zu;r!==null;){var i=r.next,a=sd(r,t);a===0?(r.next=null,n===null?Zu=i:n.next=i,i===null&&(Qu=n)):(n=r,(e!==0||a&3)&&(ed=!0)),r=i}X!==0&&X!==5||id(e,!1),nd!==0&&(nd=0)}function sd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-qe(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=rt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=G,n=q,n=tt(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(J===2||J===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Me(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||nt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Me(r),ft(n)){case 2:case 8:n=Re;break;case 32:n=ze;break;case 268435456:n=Ve;break;default:n=ze}return r=cd.bind(null,e),n=je(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Me(r),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(X!==0&&X!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Hu()&&e.callbackNode!==n)return null;var r=q;return r=tt(e,e===G?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(gu(e,r,t),sd(e,Fe()),e.callbackNode!=null&&e.callbackNode===n?cd.bind(null,e):null)}function ld(e,t){if(Hu())return null;gu(e,t,!0)}function ud(){Yd(function(){W&6?je(Le,ad):od()})}function dd(){if(nd===0){var e=ya;e===0&&(e=Ze,Ze<<=1,!(Ze&261888)&&(Ze=256)),nd=e}return nd}function fd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:cn(``+e)}function pd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function md(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=fd((i[_t]||null).action),o=r.submitter;o&&(t=(t=o[_t]||null)?fd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new An(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(nd!==0){var e=o?pd(i,o):new FormData(i);ks(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?pd(i,o):new FormData(i),ks(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var hd=0;hd<ri.length;hd++){var gd=ri[hd];ii(gd.toLowerCase(),`on`+(gd[0].toUpperCase()+gd.slice(1)))}ii(Yr,`onAnimationEnd`),ii(Xr,`onAnimationIteration`),ii(Zr,`onAnimationStart`),ii(`dblclick`,`onDoubleClick`),ii(`focusin`,`onFocus`),ii(`focusout`,`onBlur`),ii(Qr,`onTransitionRun`),ii($r,`onTransitionStart`),ii(ei,`onTransitionCancel`),ii(ti,`onTransitionEnd`),Mt(`onMouseEnter`,[`mouseout`,`mouseover`]),Mt(`onMouseLeave`,[`mouseout`,`mouseover`]),Mt(`onPointerEnter`,[`pointerout`,`pointerover`]),Mt(`onPointerLeave`,[`pointerout`,`pointerover`]),jt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),jt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),jt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),jt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var _d=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),vd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(_d));function yd(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ai(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ai(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[yt];n===void 0&&(n=t[yt]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,kt.forEach(function(t){t!==`selectionchange`&&(vd.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!yn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===i)break;if(o===4)for(o=r.return;o!==null;){var c=o.tag;if((c===3||c===4)&&o.stateNode.containerInfo===i)return;o=o.return}for(;s!==null;){if(o=Tt(s),o===null)return;if(c=o.tag,c===5||c===6||c===26||c===27){r=a=o;continue a}s=s.parentNode}}r=r.return}gn(function(){var r=a,i=dn(n),o=[];a:{var s=ni.get(e);if(s!==void 0){var c=An,u=e;switch(e){case`keypress`:if(Tn(n)===0)break a;case`keydown`:case`keyup`:c=Jn;break;case`focusin`:u=`focus`,c=zn;break;case`focusout`:u=`blur`,c=zn;break;case`beforeblur`:case`afterblur`:c=zn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:c=Ln;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:c=Rn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:c=Xn;break;case Yr:case Xr:case Zr:c=Bn;break;case ti:c=Zn;break;case`scroll`:case`scrollend`:c=Mn;break;case`wheel`:c=Qn;break;case`copy`:case`cut`:case`paste`:c=Vn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:c=Yn;break;case`toggle`:case`beforetoggle`:c=$n}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?s===null?null:s+`Capture`:s;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=_n(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(s=new c(s,u,null,n,i),o.push({event:s,listeners:d}))}}if(!(t&7)){a:{if(s=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,s&&n!==un&&(u=n.relatedTarget||n.fromElement)&&(Tt(u)||u[vt]))break a;if((c||s)&&(s=i.window===i?i:(s=i.ownerDocument)?s.defaultView||s.parentWindow:window,c?(u=n.relatedTarget||n.toElement,c=r,u=u?Tt(u):null,u!==null&&(f=l(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(c=null,u=r),c!==u)){if(d=Ln,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Yn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?s:Dt(c),h=u==null?s:Dt(u),s=new d(g,m+`leave`,c,n,i),s.target=f,s.relatedTarget=h,g=null,Tt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,c&&u)b:{for(d=Dd,p=c,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;c!==null&&Od(o,s,c,d,!1),u!==null&&f!==null&&Od(o,f,u,d,!0)}}a:{if(s=r?Dt(r):window,c=s.nodeName&&s.nodeName.toLowerCase(),c===`select`||c===`input`&&s.type===`file`)var v=yr;else if(pr(s)){if(br)v=kr;else{v=Dr;var y=Er}}else c=s.nodeName,!c||c.toLowerCase()!==`input`||s.type!==`checkbox`&&s.type!==`radio`?r&&an(r.elementType)&&(v=yr):v=Or;if(v&&=v(e,r)){mr(o,v,n,i);break a}y&&y(e,s,r),e===`focusout`&&r&&s.type===`number`&&r.memoizedProps.value!=null&&Xt(s,`number`,s.value)}switch(y=r?Dt(r):window,e){case`focusin`:(pr(y)||y.contentEditable===`true`)&&(zr=y,Br=r,Vr=null);break;case`focusout`:Vr=Br=zr=null;break;case`mousedown`:Hr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Hr=!1,Ur(o,n,i);break;case`selectionchange`:if(Rr)break;case`keydown`:case`keyup`:Ur(o,n,i)}var b;if(tr)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else lr?sr(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(ir&&n.locale!==`ko`&&(lr||x!==`onCompositionStart`?x===`onCompositionEnd`&&lr&&(b=wn()):(xn=i,Sn=`value`in xn?xn.value:xn.textContent,lr=!0)),y=Ed(r,x),0<y.length&&(x=new Hn(x,e,null,n,i),o.push({event:x,listeners:y}),b?x.data=b:(b=cr(n),b!==null&&(x.data=b)))),(b=rr?ur(e,n):dr(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new Hn(`onBeforeInput`,`beforeinput`,null,n,i),o.push({event:y,listeners:x}),y.data=b)),md(o,e,r,n,i)}yd(o,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=_n(e,n),i!=null&&r.unshift(Td(e,i,a)),i=_n(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=_n(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=_n(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function $(e,t,n,r,i,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||en(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&en(e,``+r);break;case`className`:Rt(e,`class`,r);break;case`tabIndex`:Rt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Rt(e,n,r);break;case`style`:rn(e,r,o);break;case`data`:if(t!==`object`){Rt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=cn(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,i.name,i,null),$(e,t,`formEncType`,i.formEncType,i,null),$(e,t,`formMethod`,i.formMethod,i,null),$(e,t,`formTarget`,i.formTarget,i,null)):($(e,t,`encType`,i.encType,i,null),$(e,t,`method`,i.method,i,null),$(e,t,`target`,i.target,i,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=cn(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=ln);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(a(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(a(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=cn(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),Lt(e,`popover`,r);break;case`xlinkActuate`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Lt(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=on.get(n)||n,Lt(e,n,r))}}function Nd(e,t,n,r,i,o){switch(n){case`style`:rn(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(a(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(a(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?en(e,r):(typeof r==`number`||typeof r==`bigint`)&&en(e,``+r);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=ln);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!At.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(i=n.endsWith(`Capture`),t=n.slice(2,i?n.length-7:void 0),o=e[_t]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,i),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,i);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):Lt(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,i=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:i=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(a(137,t));default:$(e,t,o,s,n,null)}}i&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=i=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:i=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(a(137,t));break;default:$(e,t,r,d,n,null)}}Yt(e,o,c,l,u,s,i,!1);return;case`select`:for(i in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(i)&&(c=n[i],c!=null))switch(i){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,i,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Zt(e,!!r,n,!0):Zt(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=i=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:i=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(a(91));break;default:$(e,t,s,c,n,null)}$t(e,r,i,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<_d.length;r++)Q(_d[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(a(137,t));default:$(e,t,u,r,n,null)}return;default:if(an(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var i=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:i=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(a(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}Jt(e,s,c,l,u,d,o,i);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(i in r)if(o=r[i],l=n[i],r.hasOwnProperty(i)&&(o!=null||l!=null))switch(i){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&$(e,t,i,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Zt(e,!!n,n?[]:``,!1):Zt(e,!!n,t,!0)):Zt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(i=n[c],n.hasOwnProperty(c)&&i!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,i)}for(s in r)if(i=r[s],o=n[s],r.hasOwnProperty(s)&&(i!=null||o!=null))switch(s){case`value`:p=i;break;case`defaultValue`:m=i;break;case`children`:break;case`dangerouslySetInnerHTML`:if(i!=null)throw Error(a(91));break;default:i!==o&&$(e,t,s,i,r,o)}Qt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(a(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(an(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e!==Wd&&(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Ct]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body)}n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),wt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[Ct])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(a(452));return e;case`head`:if(e=t.head,!e)throw Error(a(453));return e;case`body`:if(e=t.body,!e)throw Error(a(454));return e;default:throw Error(a(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);wt(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=E.d;E.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=bu();return e||t}function yf(e){var t=Et(e);t!==null&&t.tag===5&&t.type===`form`?js(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=qt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),k(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+qt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+qt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+qt(n.imageSizes)+`"]`)):i+=`[href="`+qt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=h({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),k(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+qt(r)+`"][href="`+qt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=h({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),k(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=Ot(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=h({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);k(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=Ot(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=h({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),k(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=Ot(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=h({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),k(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var i=(i=_e.current)?gf(i):null;if(!i)throw Error(a(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=Ot(i).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=Ot(i).hoistableStyles,s=o.get(e);if(s||(i=i.ownerDocument||i,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=i.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(i,e,n,s.state))),t&&r===null)throw Error(a(528,``));return s}if(t&&r!==null)throw Error(a(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=Ot(i).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(a(444,e))}}function Af(e){return`href="`+qt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return h({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),k(t),e.head.appendChild(t))}function Pf(e){return`[src="`+qt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+qt(n.href)+`"]`);if(r)return t.instance=r,k(r),r;var i=h({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),k(r),Pd(r,`style`,i),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:i=Af(n.href);var o=e.querySelector(jf(i));if(o)return t.state.loading|=4,t.instance=o,k(o),o;r=Mf(n),(i=mf.get(i))&&Rf(r,i),o=(e.ownerDocument||e).createElement(`link`),k(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Pd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(i=e.querySelector(Ff(o)))?(t.instance=i,k(i),i):(r=n,(i=mf.get(o))&&(r=h({},n),zf(r,i)),e=e.ownerDocument||e,i=e.createElement(`script`),k(i),Pd(i,`link`,r),e.head.appendChild(i),t.instance=i);case`void`:return null;default:throw Error(a(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Ct]||a[gt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,k(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),k(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:S,Provider:null,Consumer:null,_currentValue:de,_currentValue2:de,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=at(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=at(0),this.hiddenUpdates=at(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=_i(3,null,null,t),e.current=a,a.stateNode=e,t=ha(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Ja(a),e}function tp(e){return e?(e=hi,e):hi}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Xa(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Za(e,r,t),n!==null&&(hu(n,e,t),Qa(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=fi(e,67108864);t!==null&&hu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=pu();t=dt(t);var n=fi(e,t);n!==null&&hu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=2,up(e,t,n,r)}finally{E.p=a,T.T=i}}function lp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=8,up(e,t,n,r)}finally{E.p=a,T.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=Et(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=et(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-qe(o);s.entanglements[1]|=c,o&=~c}rd(a),!(W&6)&&(nu=Fe()+500,id(0,!1))}}break;case 31:case 13:s=fi(a,2),s!==null&&hu(s,a,2),bu(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=dn(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=Tt(e),e!==null){var t=l(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=u(t),e!==null)return e;e=null}else if(n===31){if(e=d(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ie()){case Le:return 2;case Re:return 8;case ze:case Be:return 32;case Ve:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Et(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=Tt(e.target);if(t!==null){var n=l(t);if(n!==null){if(t=n.tag,t===13){if(t=u(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===31){if(t=d(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);un=r,n.target.dispatchEvent(r),un=null}else return t=Et(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=Et(n);a!==null&&(e.splice(t,3),t-=3,ks(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[_t]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[_t]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(a(409));var n=t.current;np(n,pu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),bu(),t[vt]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=pt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.8`)throw Error(a(527,Lp,`19.2.8`));E.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(a(188)):(e=Object.keys(e).join(`,`),Error(a(268,e)));return e=p(t),e=e===null?null:m(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.8`,rendererPackageName:`react-dom`,currentDispatcherRef:T,reconcilerVersion:`19.2.8`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{We=zp.inject(Rp),Ge=zp}catch{}}e.createRoot=function(e,t){if(!s(e))throw Error(a(299));var n=!1,r=``,i=Qs,o=$s,c=ec;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(o=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,i,o,c,Pp),e[vt]=t.current,Sd(e),new Fp(t)}})),u=t(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=l()})),d=i(),f=u(),p=t((e=>{var t=Symbol.for(`react.transitional.element`);function n(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.jsx=n,e.jsxs=n})),m=t(((e,t)=>{t.exports=p()})),h=m();function g({name:e,role:t=`普通成员`,isOnline:n}){let r=e?e.trim().charAt(0).toUpperCase():`?`;return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,padding:`16px`,backgroundColor:`var(--bg-surface)`,boxShadow:`var(--shadow-xs)`,transition:`all var(--transition-fast)`,display:`flex`,alignItems:`center`,gap:`14px`},children:[(0,h.jsxs)(`div`,{style:{position:`relative`},children:[(0,h.jsx)(`div`,{style:{width:`44px`,height:`44px`,borderRadius:`50%`,backgroundColor:`var(--color-primary-light)`,color:`var(--color-primary)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:`700`,fontSize:`18px`,border:`1px solid var(--color-primary-border)`},children:r}),(0,h.jsx)(`span`,{style:{position:`absolute`,bottom:`0`,right:`0`,width:`12px`,height:`12px`,borderRadius:`50%`,backgroundColor:n?`var(--color-success)`:`var(--text-subtle)`,border:`2px solid #fff`},title:n?`在线`:`离线`})]}),(0,h.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,marginBottom:`4px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`15px`,color:`var(--text-main)`,fontWeight:`600`},children:e}),(0,h.jsx)(`span`,{style:{fontSize:`11px`,padding:`1px 6px`,borderRadius:`var(--radius-xs)`,backgroundColor:`var(--bg-surface-secondary)`,color:`var(--text-muted)`,border:`1px solid var(--border-color)`},children:t})]}),(0,h.jsx)(`div`,{style:{fontSize:`12.5px`,color:n?`var(--color-success-text)`:`var(--text-subtle)`},children:n?`🟢 当前在线`:`⚪ 离线`})]})]})}function _({title:e=`暂无标题`,price:t=0,discount:n=1,tags:r=[]}){let i=t*n,a=n<1;return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,padding:`16px`,backgroundColor:`var(--bg-surface)`,boxShadow:`var(--shadow-xs)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`,gap:`12px`,transition:`all var(--transition-fast)`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,gap:`8px`},children:[(0,h.jsx)(`strong`,{style:{fontSize:`15px`,color:`var(--text-main)`,fontWeight:`600`},children:e}),a&&(0,h.jsxs)(`span`,{className:`badge badge-amber`,style:{fontSize:`11px`},children:[(n*10).toFixed(1).replace(/\.0$/,``),` 折`]})]}),(0,h.jsxs)(`div`,{style:{marginTop:`8px`,display:`flex`,alignItems:`baseline`,gap:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`18px`,fontWeight:`700`,color:`var(--color-danger)`},children:[`¥`,i.toFixed(2)]}),a&&(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,textDecoration:`line-through`},children:[`¥`,t.toFixed(2)]})]})]}),r.length>0&&(0,h.jsx)(`div`,{style:{display:`flex`,gap:`6px`,flexWrap:`wrap`,paddingTop:`8px`,borderTop:`1px solid var(--border-subtle)`},children:r.map(e=>(0,h.jsxs)(`span`,{className:`badge badge-gray`,style:{fontSize:`11px`},children:[`#`,e]},e))})]})}function v(){let[e,t]=(0,d.useState)(`张三`),[n,r]=(0,d.useState)(`前端架构师`),[i,a]=(0,d.useState)(!0),[o,s]=(0,d.useState)(99),[c,l]=(0,d.useState)(.8),u={name:`管理员 Alex`,role:`超级管理员`,isOnline:!0},f={title:`高品质有机蓝莓`,price:36,discount:.9,tags:[`时令优选`,`冷链配送`]};return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` Props 基础传递、解构与派生计算`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`单向数据流`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Props（属性）是父组件向子组件单向传递的只读输入参数。本 Demo 演示参数解构、默认值回退机制、展开语法（Spread Props）以及如何利用纯函数衍生计算替代多余的 State。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`只读性（Read-only）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`默认值解构（Default Props）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`JSX 展开语法（...props）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`衍生状态（Derived Value）`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 实时交互试验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`调整输入项，观察子组件如何根据传入的 Props 发生响应式重新渲染：`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:`16px`,backgroundColor:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{margin:`0 0 12px 0`,fontSize:`14px`},children:`控制面板（父组件状态）`}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`用户姓名：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,value:e,onChange:e=>t(e.target.value)})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`用户角色：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,value:n,onChange:e=>r(e.target.value)})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,marginTop:`4px`},children:[(0,h.jsx)(`input`,{type:`checkbox`,id:`online-toggle`,checked:i,onChange:e=>a(e.target.checked),style:{width:`16px`,height:`16px`,cursor:`pointer`}}),(0,h.jsx)(`label`,{htmlFor:`online-toggle`,style:{fontSize:`13px`,cursor:`pointer`},children:`标记为在线状态 (isOnline)`})]})]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h4`,{style:{margin:`0 0 12px 0`,fontSize:`14px`,color:`var(--text-muted)`},children:`子组件接收 Props 渲染结果`}),(0,h.jsx)(g,{name:e||`（空名称）`,role:n,isOnline:i})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`👤`}),` 用户卡片（UserCard）解构与默认值场景`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`演示常规显式传参、未传参数自动触发形参默认值（role = "普通成员"），以及展开语法批量入参。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-3`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 A：显式完整传参`}),(0,h.jsx)(g,{name:`李雷`,role:`高级产品经理`,isOnline:!0})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 B：未传 role（默认值生效）`}),(0,h.jsx)(g,{name:`韩梅梅`,isOnline:!1})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:"场景 C：展开语法 `{...adminData}`"}),(0,h.jsx)(g,{...u})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🛍️`}),` 商品卡片（ProductCard）衍生计算与列表渲染`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`演示实际折后价 `,(0,h.jsx)(`code`,{children:`price * discount`}),` 衍生计算，严禁在子组件直接修改 `,(0,h.jsx)(`code`,{children:`props.price`}),`！`]})]}),(0,h.jsx)(`div`,{style:{marginBottom:`16px`,padding:`12px`,backgroundColor:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`24px`,alignItems:`center`,flexWrap:`wrap`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[`原价：¥`,o]}),(0,h.jsx)(`input`,{type:`range`,min:`10`,max:`300`,step:`5`,value:o,onChange:e=>s(Number(e.target.value))})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[`折扣：`,c*10,` 折`]}),(0,h.jsx)(`input`,{type:`range`,min:`0.1`,max:`1.0`,step:`0.1`,value:c,onChange:e=>l(Number(e.target.value))})]})]})}),(0,h.jsxs)(`div`,{className:`demo-grid-3`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-success)`},children:`实时滑块联动商品`}),(0,h.jsx)(_,{title:`进口阿拉斯加帝王蟹`,price:o,discount:c,tags:[`海鲜直达`,`热销`]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-success)`},children:`不传 discount（默认为 1）`}),(0,h.jsx)(_,{title:`高山特级碧螺春`,price:68,tags:[`明前茶`,`产地直发`]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-success)`},children:"对象展开 `{...item}`"}),(0,h.jsx)(_,{...f})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` Props 核心心智模型`]}),(0,h.jsxs)(`div`,{children:[`1. `,(0,h.jsx)(`strong`,{children:`单向只读性`}),`：Props 永远由父级决定，子组件严禁直接修改入参对象（如 `,(0,h.jsx)(`code`,{children:`props.price = 99`}),` 会违背 React 纯函数规范并可能引发不可预测的副作用）。`]}),(0,h.jsxs)(`div`,{children:[`2. `,(0,h.jsx)(`strong`,{children:`衍生计算优先`}),`：如果一个值可以通过已有 props/state 简单计算得到，直接在组件函数体内声明局部变量，切忌将其拷贝存入新的 state 中。`]})]})]})}function y({title:e,subtitle:t,extra:n,children:r}){return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,backgroundColor:`var(--bg-surface)`,boxShadow:`var(--shadow-xs)`,overflow:`hidden`,transition:`box-shadow var(--transition-fast)`},children:[(e||n)&&(0,h.jsxs)(`div`,{style:{padding:`14px 18px`,borderBottom:`1px solid var(--border-subtle)`,backgroundColor:`var(--bg-surface-secondary)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,h.jsxs)(`div`,{children:[e&&(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`15px`,color:`var(--text-main)`,fontWeight:`600`},children:e}),t&&(0,h.jsx)(`p`,{style:{margin:`2px 0 0 0`,fontSize:`12px`,color:`var(--text-subtle)`},children:t})]}),n&&(0,h.jsx)(`div`,{children:n})]}),(0,h.jsx)(`div`,{style:{padding:`18px`},children:r})]})}function b({isOpen:e=!1,onClose:t,title:n,children:r}){return(0,d.useEffect)(()=>{if(!e)return;let n=e=>{e.key===`Escape`&&t&&t()};return window.addEventListener(`keydown`,n),()=>{window.removeEventListener(`keydown`,n)}},[e,t]),e?(0,h.jsx)(`div`,{style:{position:`fixed`,inset:0,backgroundColor:`rgba(15, 23, 42, 0.5)`,backdropFilter:`blur(4px)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3,padding:`16px`,animation:`fadeIn 0.15s ease`},onClick:t,children:(0,h.jsxs)(`div`,{style:{width:`500px`,maxWidth:`100%`,backgroundColor:`var(--bg-surface)`,borderRadius:`var(--radius-lg)`,boxShadow:`var(--shadow-xl)`,border:`1px solid var(--border-color)`,overflow:`hidden`,position:`relative`,animation:`scaleUp 0.15s ease`},onClick:e=>e.stopPropagation(),children:[(n||t)&&(0,h.jsxs)(`div`,{style:{padding:`16px 20px`,borderBottom:`1px solid var(--border-color)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`,color:`var(--text-main)`},children:n||`提示`}),t&&(0,h.jsx)(`button`,{onClick:t,"aria-label":`关闭弹窗`,style:{background:`transparent`,border:`none`,fontSize:`18px`,lineHeight:1,color:`var(--text-subtle)`,cursor:`pointer`,padding:`4px`,borderRadius:`var(--radius-xs)`,display:`flex`,alignItems:`center`,justifyContent:`center`,transition:`color var(--transition-fast)`},children:`✕`})]}),(0,h.jsx)(`div`,{style:{padding:`20px`},children:r})]})}):null}function x(){let[e,t]=(0,d.useState)(!1),[n,r]=(0,d.useState)(`info`),[i,a]=(0,d.useState)(!1),o=e=>{r(e),t(!0),a(!1)};return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📦`}),` Children 默认插槽与组件组合模式`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`组合优于继承`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 通过内置的 `,(0,h.jsx)(`code`,{children:`props.children`}),` 实现了强大的组合模式（Composition）。容器组件专注布局、边框阴影、可访问性及弹窗行为控制，内部的 JSX 内容则完全交由调用者灵活注入。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`默认插槽 (props.children)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`通用布局外壳 (Layout Shell)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`条件渲染 (Conditional Rendering)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🗂️`}),` 1. 通用卡片容器（CardContainer）的多态复用`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`同一个卡片外壳组件，通过嵌套不同的子 JSX，既可以承载纯文本与操作按钮，也可以内嵌完整表单：`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(y,{title:`通知公告卡片`,subtitle:`纯展示型内容组合`,extra:(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`系统`}),children:[(0,h.jsx)(`p`,{style:{margin:`0 0 14px 0`,color:`var(--text-muted)`,fontSize:`13.5px`,lineHeight:`1.6`},children:`React 19 全新架构现已上线，默认支持编译器指令以及优化了并发渲染能力。子节点可包含任意 HTML 结构与操作回调。`}),(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>alert(`触发了卡片内的自定义按钮逻辑！`),children:`了解更多详情`})]}),(0,h.jsx)(y,{title:`快速反馈卡片`,subtitle:`内嵌表单控件组合`,extra:(0,h.jsx)(`span`,{className:`badge badge-green`,children:`可交互`}),children:(0,h.jsxs)(`form`,{onSubmit:e=>{e.preventDefault(),alert(`已成功提交反馈内容！`)},style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`建议或问题：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,placeholder:`请输入您的宝贵建议...`,required:!0})]}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-success btn-sm`,children:`立即提交建议`})]})})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🪟`}),` 2. 模态弹窗外壳（ModalLayout）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`弹窗外壳负责管理背景遮罩、居中定位、ESC 键快捷关闭，弹窗内部的具体内容使用 `,(0,h.jsx)(`code`,{children:`children`}),` 随心所欲定制：`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`12px`,flexWrap:`wrap`,marginBottom:`16px`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>o(`info`),children:`打开提示型弹窗（文本注入）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:()=>o(`form`),children:`打开登录型弹窗（表单注入）`})]}),(0,h.jsx)(b,{isOpen:e,onClose:()=>t(!1),title:n===`info`?`系统通知`:`快捷用户登录`,children:n===`info`?(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`p`,{style:{margin:`0 0 16px 0`,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:[`这是一个借助 `,(0,h.jsx)(`code`,{children:`children`}),` 传递给 `,(0,h.jsx)(`code`,{children:`ModalLayout`}),` 的简单文本视图。外壳负责居中与 ESC 快捷关闭，内部逻辑完全隔离。`]}),(0,h.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`},children:(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>t(!1),children:`好的，已阅读`})})]}):(0,h.jsx)(`div`,{children:i?(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`16px 0`},children:[(0,h.jsx)(`div`,{style:{fontSize:`36px`,marginBottom:`8px`},children:`🎉`}),(0,h.jsx)(`h4`,{style:{margin:`0 0 6px 0`},children:`登录成功！`}),(0,h.jsx)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,margin:`0 0 16px 0`},children:`弹窗已被成功复用为表单容器。`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>t(!1),children:`完成并关闭`})]}):(0,h.jsxs)(`form`,{onSubmit:e=>{e.preventDefault(),a(!0)},style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`登录邮箱：`}),(0,h.jsx)(`input`,{type:`email`,className:`form-input`,placeholder:`name@example.com`,required:!0})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`登录密码：`}),(0,h.jsx)(`input`,{type:`password`,className:`form-input`,placeholder:`••••••••`,required:!0})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`8px`,marginTop:`8px`},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>t(!1),children:`取消`}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-success btn-sm`,children:`确认登录`})]})]})})})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 组合模式设计原则`]}),(0,h.jsxs)(`div`,{children:[`当一个组件需要支持多种内部结构时，`,(0,h.jsx)(`strong`,{children:`优先使用组合（Passing Children）`}),`，而不是在组件内部通过定义 10 个布尔值 props（如 `,(0,h.jsx)(`code`,{children:`showImage`}),`, `,(0,h.jsx)(`code`,{children:`showForm`}),`, `,(0,h.jsx)(`code`,{children:`hasButton`}),`）来控制结构分支。组合模式可以让代码解耦，大幅降低维护成本。`]})]})]})}function ee({titleText:e=`系统提示`,onClose:t}){return(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,padding:`16px 20px`,borderBottom:`1px solid var(--border-color)`},children:[(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`,color:`var(--text-main)`},children:e}),t&&(0,h.jsx)(`button`,{onClick:t,"aria-label":`关闭`,style:{border:`none`,background:`transparent`,cursor:`pointer`,fontSize:`18px`,color:`var(--text-subtle)`,padding:`2px`,lineHeight:1},children:`✕`})]})}function S({onConfirm:e,onClose:t,confirmText:n=`确认`,cancelText:r=`取消`}){return(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`10px`,padding:`14px 20px`,borderTop:`1px solid var(--border-color)`,backgroundColor:`var(--bg-surface-secondary)`},children:[(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:t,children:r}),(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:e,children:n})]})}function C({isOpen:e,onClose:t,onConfirm:n,title:r,footer:i,children:a}){return e?(0,h.jsx)(`div`,{style:{position:`fixed`,inset:0,backgroundColor:`rgba(15, 23, 42, 0.5)`,backdropFilter:`blur(4px)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3,padding:`16px`},onClick:t,children:(0,h.jsxs)(`div`,{style:{width:`460px`,maxWidth:`100%`,backgroundColor:`var(--bg-surface)`,borderRadius:`var(--radius-lg)`,boxShadow:`var(--shadow-xl)`,border:`1px solid var(--border-color)`,overflow:`hidden`},onClick:e=>e.stopPropagation(),children:[r===!1?null:r===void 0?(0,h.jsx)(ee,{titleText:`系统通知`,onClose:t}):typeof r==`string`?(0,h.jsx)(ee,{titleText:r,onClose:t}):(0,h.jsx)(`div`,{style:{padding:`16px 20px`,borderBottom:`1px solid var(--border-color)`},children:r}),(0,h.jsx)(`div`,{style:{padding:`20px`},children:a}),i===!1?null:i===void 0?(0,h.jsx)(S,{onConfirm:n,onClose:t}):(0,h.jsx)(`div`,{style:{padding:`14px 20px`,borderTop:`1px solid var(--border-color)`},children:i})]})}):null}var te=()=>(0,h.jsxs)(`div`,{style:{fontWeight:`700`,color:`var(--text-main)`,fontSize:`14.5px`,display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,h.jsx)(`span`,{children:`📋`}),(0,h.jsx)(`span`,{children:`卡片面板`})]}),ne=()=>(0,h.jsx)(`div`,{style:{fontSize:`13px`},children:(0,h.jsx)(`a`,{href:`#more`,onClick:e=>{e.preventDefault(),alert(`触发默认 Extra: 查看详情`)},style:{color:`var(--color-primary)`,fontWeight:`500`},children:`查看更多 →`})});function re({header:e,extra:t,children:n}){function r(){return e===!1?null:e===void 0?(0,h.jsx)(te,{}):e}function i(){return t===!1?null:t===void 0?(0,h.jsx)(ne,{}):t}return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,backgroundColor:`var(--bg-surface)`,margin:`12px 0`,overflow:`hidden`,boxShadow:`var(--shadow-xs)`,transition:`box-shadow var(--transition-fast)`},children:[(e!==!1||t!==!1)&&(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,padding:`12px 18px`,borderBottom:`1px solid var(--border-subtle)`,backgroundColor:`var(--bg-surface-secondary)`},children:[(0,h.jsx)(`div`,{className:`pannel-header`,children:r()}),(0,h.jsx)(`div`,{className:`pannel-extra`,children:i()})]}),(0,h.jsx)(`div`,{style:{padding:`18px`,color:`var(--text-main)`},className:`pannel-body`,children:n||(0,h.jsx)(`span`,{style:{color:`var(--text-subtle)`,fontStyle:`italic`},children:`暂无面板内容`})})]})}function w(){let[e,t]=(0,d.useState)(null),n=()=>t(null),[r,i]=(0,d.useState)(0);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧩`}),` 具名多插槽客制化设计规范`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`组件库架构协议`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`成熟组件库（如 Ant Design、shadcn/ui、MUI）广泛采用“三态插槽协议”（默认模板 + 局部覆盖 + 显式隐藏）。通过 Props 接收自定义 JSX 节点或布尔值，实现比单一 `,(0,h.jsx)(`code`,{children:`children`}),` 更高维度的扩展能力。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`具名插槽（Named Slots via Props）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`三态渲染协议（Tri-state Protocol）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`零额外 DOM 成本`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📋`}),` 工业级三态插槽协议判定规范`]}),(0,h.jsxs)(`ul`,{style:{margin:`4px 0 0 0`,paddingLeft:`20px`,display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,h.jsxs)(`li`,{children:[(0,h.jsx)(`strong`,{children:`1. 显式隐藏：`}),(0,h.jsx)(`code`,{children:`slotProp === false`}),` → 返回 `,(0,h.jsx)(`code`,{children:`null`}),`，完全不产生 DOM 占位`]}),(0,h.jsxs)(`li`,{children:[(0,h.jsx)(`strong`,{children:`2. 局部覆盖：`}),(0,h.jsx)(`code`,{children:`slotProp !== undefined`}),` → 渲染调用方传入的内容（支持 string、JSX 或组件）`]}),(0,h.jsxs)(`li`,{children:[(0,h.jsx)(`strong`,{children:`3. 回退默认：`}),(0,h.jsx)(`code`,{children:`slotProp === undefined`}),` → 自动渲染内置预设的默认模板组件`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🪟`}),` 1. 多插槽模态框（ProductionModal）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`支持 `,(0,h.jsx)(`code`,{children:`title`}),`（头部插槽）、`,(0,h.jsx)(`code`,{children:`footer`}),`（底部插槽）与 `,(0,h.jsx)(`code`,{children:`children`}),`（主体插槽）：`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`,marginBottom:`16px`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>t(`default`),children:`1. 全默认模板（默认头部+底部）`}),(0,h.jsx)(`button`,{className:`btn btn-danger`,onClick:()=>t(`custom-title`),children:`2. 局部覆盖标题（危险红色警告）`}),(0,h.jsx)(`button`,{className:`btn btn-success`,onClick:()=>t(`custom-footer`),children:`3. 局部覆盖底部（自定义单个按钮）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:()=>t(`no-footer`),children:`4. 显式隐藏底部 (footer=false)`})]}),(0,h.jsx)(C,{isOpen:e==="default",onClose:n,onConfirm:()=>{alert(`触发了默认弹窗确认！`),n()},children:(0,h.jsx)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:`这是零额外配置的通知弹窗，头部标题和底部操作按钮均采用组件库内置默认模板。`})}),(0,h.jsx)(C,{isOpen:e===`custom-title`,title:(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,color:`var(--color-danger)`},children:[(0,h.jsx)(`span`,{children:`⚠️`}),(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`},children:`严重警告：危险操作`})]}),onClose:n,onConfirm:n,children:(0,h.jsx)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:`该操作将永久删除该项数据，且无法撤销！注意：虽然头部被完全重写，但底部依然保留了内置的确认与取消操作栏。`})}),(0,h.jsx)(C,{isOpen:e===`custom-footer`,onClose:n,footer:(0,h.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`},children:(0,h.jsx)(`button`,{className:`btn btn-success`,onClick:n,children:`🎉 我知道了，立即体验`})}),children:(0,h.jsx)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:`恭喜！您的专属权益已成功生效。底部插槽被替换为居中的单项体验按钮。`})}),(0,h.jsx)(C,{isOpen:e===`no-footer`,title:`纯展示性服务协议条款`,footer:!1,onClose:n,children:(0,h.jsxs)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:[`通过传入 `,(0,h.jsx)(`code`,{children:`footer={false}`}),`，组件直接跳过底部操作条的 DOM 生成，适合展示纯文本说明。`]})})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`📋`}),` 2. 多插槽卡片面板（Pannel）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`具有 `,(0,h.jsx)(`code`,{children:`header`}),`（左上角标题插槽）、`,(0,h.jsx)(`code`,{children:`extra`}),`（右上角扩展操作插槽）与 `,(0,h.jsx)(`code`,{children:`children`}),`（主体内容）：`]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 A：全默认模板（未传 header 与 extra）`}),(0,h.jsx)(re,{children:(0,h.jsx)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-muted)`},children:`默认标题为“📋 卡片面板”，右上角展示默认的“查看更多 →”。`})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 B：自定义 Header 标题（保留默认 extra）`}),(0,h.jsx)(re,{header:(0,h.jsx)(`strong`,{style:{color:`var(--color-primary)`},children:`📈 业务实时大盘`}),children:(0,h.jsx)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-muted)`},children:`自定义了左侧标题，右侧 Extra 仍然优雅回退到内置的链接模板。`})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 C：同时自定义 Header 与 Extra 交互`}),(0,h.jsx)(re,{header:(0,h.jsx)(`strong`,{style:{color:`var(--color-success)`},children:`⚡ 实时心跳健康检测`}),extra:(0,h.jsxs)(`button`,{className:`btn btn-success btn-sm`,onClick:()=>i(e=>e+1),children:[`🔄 刷新 (`,r,`)`]}),children:(0,h.jsxs)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-muted)`},children:[`插槽内可无缝嵌入受控交互，已点击刷新 `,r,` 次。`]})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 D：显式隐藏顶部导航条 (header=false, extra=false)`}),(0,h.jsx)(re,{header:!1,extra:!1,children:(0,h.jsx)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-subtle)`},children:`顶部栏整体被消除，呈现为一张干净的纯内容卡片。`})})]})]})]})]})}var ie=(0,d.createContext)(null);function ae({user:e}){return(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsx)(`div`,{style:{width:`32px`,height:`32px`,borderRadius:`50%`,backgroundColor:`#ef4444`,color:`#fff`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`14px`,fontWeight:`bold`},children:e.name.charAt(0)}),(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[e.name,` (`,e.role,`)`]})]})}function oe({user:e}){return(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`#f1f5f9`,borderRadius:`6px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`span`,{style:{fontSize:`12px`,color:`#64748b`},children:`Header（中间层 2）`}),(0,h.jsx)(ae,{user:e})]})}function se({user:e}){return(0,h.jsxs)(`div`,{style:{padding:`10px`,border:`1px dashed #cbd5e1`,borderRadius:`8px`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`#64748b`,marginBottom:`6px`},children:`Navbar 导航栏（中间层 1）`}),(0,h.jsx)(oe,{user:e})]})}function ce({rightSlot:e}){return(0,h.jsxs)(`div`,{style:{padding:`10px`,border:`1px dashed #86efac`,borderRadius:`8px`,background:`#f0fdf4`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`#166534`,marginBottom:`6px`},children:`Navbar 导航栏（无任何 user Props，只负责布局插槽）`}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:`600`},children:`应用 Logo`}),e]})]})}function le(){let e=(0,d.useContext)(ie);return(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsx)(`div`,{style:{width:`32px`,height:`32px`,borderRadius:`50%`,backgroundColor:`#3b82f6`,color:`#fff`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`14px`,fontWeight:`bold`},children:e.name.charAt(0)}),(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[e.name,` (`,e.role,`)`]})]})}function ue(){return(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`#eff6ff`,borderRadius:`6px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`span`,{style:{fontSize:`12px`,color:`#1e40af`},children:`Header（无需 Props，直接透传）`}),(0,h.jsx)(le,{})]})}function T(){return(0,h.jsxs)(`div`,{style:{padding:`10px`,border:`1px dashed #93c5fd`,borderRadius:`8px`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`#1e40af`,marginBottom:`6px`},children:`Navbar 导航栏（无需 Props）`}),(0,h.jsx)(ue,{})]})}function E(){let[e,t]=(0,d.useState)({name:`Alex Chen`,role:`技术总监`});return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🪜`}),` 属性逐层透传（Prop Drilling）与两大破解之道`]})}),(0,h.jsx)(`span`,{className:`badge badge-amber`,children:`架构解耦`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`“Prop Drilling” 指为了将数据传递给深层子组件，沿途所有中间组件都必须显式接收并向下透传 Props 的反模式。这导致中间组件与无关数据过度耦合，重构极易出错。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-red`,children:`反模式：逐层透传 (Drilling)`}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`官方首选推荐：组件组合 (Composition)`}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`全局解法：Context API`})]})]}),(0,h.jsx)(`div`,{className:`demo-section`,style:{padding:`16px 20px`},children:(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,flexWrap:`wrap`,gap:`12px`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:`600`},children:`修改顶层用户状态：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{width:`160px`},value:e.name,onChange:n=>t({...e,name:n.target.value}),placeholder:`用户姓名`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{width:`160px`},value:e.role,onChange:n=>t({...e,role:n.target.value}),placeholder:`用户角色`})]}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>t({name:`Sarah Lee`,role:`UI 设计总监`}),children:`切换为用户 Sarah`})]})}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚖️`}),` 三大解决路径方案对比`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`观察代码结构与组件责任边界的不同：`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 方案 1：属性逐层透传 (Prop Drilling)`]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`13px`,color:`var(--text-muted)`},children:[`链路：`,(0,h.jsx)(`code`,{children:`Page(拥有 user) ➔ Navbar(无需 user) ➔ Header(无需 user) ➔ Avatar(消费 user)`}),`。中间任何一层改名或漏传都会导致崩溃。`]}),(0,h.jsx)(se,{user:e})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 方案 2：组件组合插槽 (Component Composition - 官方优先推荐)`]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`13px`,color:`var(--text-muted)`},children:[`由顶层直接渲染 `,(0,h.jsx)(`code`,{children:`<DrillingAvatar user={user} />`}),` 并作为 slot 传给 Navbar。中间组件仅负责插槽摆放，对 `,(0,h.jsx)(`code`,{children:`user`}),` 完全解耦，随时可替换！`]}),(0,h.jsx)(ce,{rightSlot:(0,h.jsx)(ae,{user:e})})]}),(0,h.jsxs)(`div`,{style:{border:`1px solid #bfdbfe`,borderRadius:`var(--radius-md)`,padding:`16px`,backgroundColor:`#f8fafc`},children:[(0,h.jsxs)(`div`,{style:{fontSize:`13.5px`,fontWeight:`700`,color:`#1d4ed8`,display:`flex`,alignItems:`center`,gap:`6px`,marginBottom:`10px`},children:[(0,h.jsx)(`span`,{children:`🌐`}),` 方案 3：Context API 全局广播`]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`13px`,color:`var(--text-muted)`},children:[`通过 `,(0,h.jsx)(`code`,{children:`UserContext.Provider`}),` 包裹顶层，深层 `,(0,h.jsx)(`code`,{children:`Avatar`}),` 直接使用 `,(0,h.jsx)(`code`,{children:`useContext(UserContext)`}),` 获取数据，中间链路 0 属性感知。`]}),(0,h.jsx)(ie.Provider,{value:e,children:(0,h.jsx)(T,{})})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 架构决策指南：遇到 Prop Drilling 时如何抉择？`]}),(0,h.jsxs)(`div`,{children:[`1. `,(0,h.jsx)(`strong`,{children:`不要过早引入 Context`}),`：Context 会降低组件的独立复用性。如果只是 2~3 层的布局传递，`,(0,h.jsx)(`strong`,{children:`优先使用组件组合（插槽 / Children）`}),`。`]}),(0,h.jsxs)(`div`,{children:[`2. `,(0,h.jsx)(`strong`,{children:`何时使用 Context`}),`：当数据是真正的“全局共享属性”（如当前登录用户信息、UI 主题 Theme、国际化语言 Locale、购物车全局清单），且组件树中很多不同深度的组件都需要同时读取时，才选用 Context。`]})]})]})}function de(){let[e,t]=(0,d.useState)(`张`),[n,r]=(0,d.useState)(`三丰`),i=`${e} ${n}`.trim(),[a,o]=(0,d.useState)([{id:1,name:`新鲜红富士苹果 (斤)`,price:8.5,count:2},{id:2,name:`进口特级香蕉 (把)`,price:12,count:1},{id:3,name:`原味高钙纯牛奶 (箱)`,price:45,count:1}]),s=a.reduce((e,t)=>e+t.count,0),c=a.reduce((e,t)=>e+t.price*t.count,0),l=c>=60,u=(e,t)=>{o(n=>n.map(n=>{if(n.id===e){let e=Math.max(0,n.count+t);return{...n,count:e}}return n}).filter(e=>e.count>0))},[f,p]=(0,d.useState)(1),m=a.find(e=>e.id===f)||null;return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 状态干净原则 (DRY: Don't Repeat Yourself in State)`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`核心心智模型`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 官方核心准则之一：`,(0,h.jsx)(`strong`,{children:`“永远不要在 State 中存储任何可以根据现有 Props 或 State 衍生计算出的值。”`}),` 冗余 State 不仅会带来额外的 re-render 损耗，还会导致多数据源脱节（Sync Desynchronization）的高危 Bug。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`单一数据源 (Single Source of Truth)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`渲染期派生 (Derived Values during render)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`严禁冗余缓存 (No Redundant State)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔤`}),` 案例 1：拼接全称（简单衍生值）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`初学者常误用 `,(0,h.jsx)(`code`,{children:`useState(fullName)`}),` 配合 `,(0,h.jsx)(`code`,{children:`useEffect`}),` 同步，造成多余渲染。正确做法：直接在组件内计算！`]})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 反模式：声明冗余 State 并靠 Effect 同步`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#fef2f2`,borderRadius:`4px`,fontSize:`12px`,overflowX:`auto`},children:`// 🔴 错误写法：3 个状态 + 1 个副作用
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(first + ' ' + last); // 导致额外的重渲染！
}, [first, last]);`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 干净写法：纯函数渲染期计算`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#f0fdf4`,borderRadius:`4px`,fontSize:`12px`,overflowX:`auto`},children:`// 🟢 干净写法：仅 2 个基础状态
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
// 渲染期直接计算，0 额外状态，0 异步延迟
const fullName = \`\${first} \${last}\`.trim();`})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`12px`,alignItems:`center`,flexWrap:`wrap`,padding:`12px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{fontSize:`12px`,color:`var(--text-muted)`,display:`block`},children:`姓氏：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{width:`100px`},value:e,onChange:e=>t(e.target.value)})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{fontSize:`12px`,color:`var(--text-muted)`,display:`block`},children:`名字：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{width:`120px`},value:n,onChange:e=>r(e.target.value)})]}),(0,h.jsxs)(`div`,{style:{marginLeft:`12px`},children:[(0,h.jsx)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,display:`block`},children:`派生全名：`}),(0,h.jsx)(`span`,{style:{fontSize:`16px`,fontWeight:`700`,color:`var(--color-primary)`},children:i||`（尚未输入）`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🛒`}),` 案例 2：购物车结算清单与总价计算`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`唯有 `,(0,h.jsx)(`code`,{children:`cartItems`}),` 需要作为状态存储。总件数、总金额、是否包邮等全部实时派生，保证数据永远绝对一致。`]})]}),(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`,marginBottom:`16px`},children:a.map(e=>(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,padding:`10px 14px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:f===e.id?`var(--color-primary-light)`:`var(--bg-surface)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`input`,{type:`radio`,name:`selectedItem`,checked:f===e.id,onChange:()=>p(e.id),id:`item-${e.id}`,style:{cursor:`pointer`}}),(0,h.jsx)(`label`,{htmlFor:`item-${e.id}`,style:{cursor:`pointer`,fontSize:`14px`,fontWeight:`500`},children:e.name}),(0,h.jsxs)(`span`,{style:{fontSize:`13px`,color:`var(--text-muted)`},children:[`单价: ¥`,e.price.toFixed(2)]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>u(e.id,-1),children:`-`}),(0,h.jsx)(`span`,{style:{minWidth:`24px`,textAlign:`center`,fontWeight:`600`,fontSize:`14px`},children:e.count}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>u(e.id,1),children:`+`}),(0,h.jsxs)(`span`,{style:{width:`80px`,textAlign:`right`,fontWeight:`700`,color:`var(--color-danger)`},children:[`¥`,(e.price*e.count).toFixed(2)]})]})]},e.id))}),(0,h.jsxs)(`div`,{style:{padding:`14px 18px`,backgroundColor:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`12px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`span`,{style:{fontSize:`13px`,color:`var(--text-muted)`},children:[`选中共 `,(0,h.jsx)(`strong`,{children:s}),` 件商品`]}),(0,h.jsx)(`span`,{style:{margin:`0 8px`,color:`var(--border-color)`},children:`|`}),(0,h.jsx)(`span`,{className:`badge ${l?`badge-green`:`badge-amber`}`,children:l?`已享满 ¥60 免费包邮`:`满 ¥60 包邮 (还差 ¥${(60-c).toFixed(2)})`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`6px`},children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`},children:`合计应付：`}),(0,h.jsxs)(`span`,{style:{fontSize:`20px`,fontWeight:`800`,color:`var(--color-danger)`},children:[`¥`,c.toFixed(2)]})]})]}),m&&(0,h.jsxs)(`div`,{style:{marginTop:`14px`,padding:`10px 14px`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-subtle)`},children:[`当前通过 `,(0,h.jsxs)(`code`,{children:[`selectedId = `,f]}),` 动态查找的商品：`]}),(0,h.jsxs)(`span`,{style:{marginLeft:`8px`,fontWeight:`600`,color:`var(--color-primary)`},children:[m.name,`（当前小计 ¥`,(m.price*m.count).toFixed(2),`）`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 状态设计的黄金三问`]}),(0,h.jsxs)(`div`,{children:[`每次准备调用 `,(0,h.jsx)(`code`,{children:`useState`}),` 时，先问自己三个问题：`]}),(0,h.jsxs)(`div`,{style:{marginTop:`4px`},children:[`1. 该变量是否可以通过现有的 Props 或其他 State 计算出来？如果是，`,(0,h.jsx)(`strong`,{children:`坚决不建 State`}),`。`]}),(0,h.jsx)(`div`,{children:`2. 该变量是否会随时间改变？如果永远不变，可以定义在组件外部或作为纯常量。`}),(0,h.jsxs)(`div`,{children:[`3. 如果计算开销非常巨大（如几千条数据的复杂过滤），应该使用 `,(0,h.jsx)(`code`,{children:`useMemo`}),` 进行缓存，而不是退回使用 `,(0,h.jsx)(`code`,{children:`useEffect + setState`}),`！`]})]})]})}function fe({value:e,onChange:t,onClear:n}){return(0,h.jsxs)(`div`,{style:{position:`relative`,width:`100%`},children:[(0,h.jsx)(`input`,{type:`text`,className:`form-input`,value:e,onChange:e=>t(e.target.value),placeholder:`搜索技术栈（如 React, Vue, Vite...）`,style:{paddingRight:e?`32px`:`12px`}}),e&&(0,h.jsx)(`button`,{onClick:n,"aria-label":`清空搜索`,style:{position:`absolute`,right:`8px`,top:`50%`,transform:`translateY(-50%)`,background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-subtle)`,fontSize:`14px`,padding:`2px`},children:`✕`})]})}function pe({matchCount:e,totalCount:t,query:n}){return(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`10px 14px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`,fontSize:`13px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{children:`共匹配到 `}),(0,h.jsx)(`strong`,{style:{color:e>0?`var(--color-primary)`:`var(--color-danger)`},children:e}),(0,h.jsxs)(`span`,{children:[` / `,t,` 项`]})]}),n&&(0,h.jsxs)(`span`,{className:`badge badge-blue`,children:[`当前过滤条件: "`,n,`"`]})]})}function me({items:e,query:t,onSelectItem:n}){return e.length===0?(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`32px 0`,color:`var(--text-subtle)`,fontSize:`14px`},children:[`🔍 未找到与 "`,t,`" 匹配的前端技术栈`]}):(0,h.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(180px, 1fr))`,gap:`10px`},children:e.map(e=>{let r=t&&e.name.toLowerCase().includes(t.toLowerCase());return(0,h.jsxs)(`div`,{onClick:()=>n(e),style:{padding:`12px 14px`,border:r?`1px solid var(--color-primary-border)`:`1px solid var(--border-color)`,backgroundColor:r?`var(--color-primary-light)`:`var(--bg-surface)`,borderRadius:`var(--radius-sm)`,cursor:`pointer`,transition:`all var(--transition-fast)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`strong`,{style:{fontSize:`14px`,color:r?`var(--color-primary-dark)`:`var(--text-main)`},children:e.name}),(0,h.jsx)(`span`,{className:`badge badge-gray`,style:{fontSize:`10px`},children:e.type})]}),(0,h.jsx)(`div`,{style:{fontSize:`11px`,color:`var(--text-subtle)`,marginTop:`4px`},children:e.desc})]},e.id)})})}var D=[{id:1,name:`React`,type:`UI 库`,desc:`构建 Web 与原生交互界面`},{id:2,name:`Vue`,type:`渐进式框架`,desc:`易学易用、性能出色的 MVVM 框架`},{id:3,name:`Angular`,type:`综合平台`,desc:`Google 出品的企业级全功能框架`},{id:4,name:`Svelte`,type:`编译器`,desc:`将声明式代码编译为极小原生的 JS`},{id:5,name:`Next.js`,type:`全栈框架`,desc:`React 生态服务端渲染利器`},{id:6,name:`Vite`,type:`构建工具`,desc:`基于原生 ESM 的极速前端开发工具`}];function O(){let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(D),[i,a]=(0,d.useState)(``),[o,s]=(0,d.useState)(null),c=n.filter(t=>t.name.toLowerCase().includes(e.toLowerCase())||t.desc.toLowerCase().includes(e.toLowerCase()));return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🪜`}),` 状态提升（Lifting State Up）与兄弟协同`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`单向数据流核心`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`在 React 中，兄弟组件之间`,(0,h.jsx)(`strong`,{children:`无法直接横向传递状态`}),`。当两个或多个子组件需要反映相同的数据变化时，必须将该状态提升至它们的`,(0,h.jsx)(`strong`,{children:`最近公共父组件`}),`中统一管理，并通过 Props 向下分发。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`受控输入 (Controlled Input)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`最近共同祖先 (Closest Common Ancestor)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`事件向上回传 (Event Callbacks)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📐`}),` 状态提升架构数据流向`]}),(0,h.jsx)(`pre`,{style:{margin:`6px 0 0 0`,fontSize:`12px`,background:`#f8fafc`,padding:`10px`,borderRadius:`6px`,overflowX:`auto`},children:`       ┌────────────────────────────────────────────────────────┐
       │   公共父组件 LiftingStateUpDemo (持有 [query, setQuery])   │
       └──────────────────────────┬─────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ 传 value + onChange    │ 传 filteredList.length │ 传 filteredList
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 子组件 SearchBox │    │ 子组件 Summary   │    │ 子组件 List      │
└──────────────────┘    └──────────────────┘    └──────────────────┘`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 协同联动实验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`在输入框键入关键词，观察输入框、统计卡片和结果列表三者如何实时协同：`})]}),(0,h.jsx)(`div`,{style:{marginBottom:`14px`},children:(0,h.jsx)(fe,{value:e,onChange:t,onClear:()=>t(``)})}),(0,h.jsx)(`div`,{style:{marginBottom:`14px`},children:(0,h.jsx)(pe,{matchCount:c.length,totalCount:n.length,query:e})}),(0,h.jsx)(`div`,{style:{marginBottom:`20px`},children:(0,h.jsx)(me,{items:c,query:e,onSelectItem:s})}),o&&(0,h.jsxs)(`div`,{style:{padding:`12px 16px`,background:`var(--color-primary-light)`,border:`1px solid var(--color-primary-border)`,borderRadius:`var(--radius-sm)`,marginBottom:`16px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{children:`当前选中的卡片：`}),(0,h.jsx)(`strong`,{children:o.name}),` - `,o.desc]}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>s(null),children:`取消选中`})]}),(0,h.jsxs)(`form`,{onSubmit:e=>{if(e.preventDefault(),!i.trim())return;let t={id:Date.now(),name:i.trim(),type:`自定义`,desc:`用户动态添加的探索技术项`};r(e=>[t,...e]),a(``)},style:{display:`flex`,gap:`10px`,alignItems:`center`,paddingTop:`14px`,borderTop:`1px solid var(--border-subtle)`},children:[(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{maxWidth:`240px`},placeholder:`添加新技术栈...`,value:i,onChange:e=>a(e.target.value)}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-secondary btn-sm`,children:`➕ 添加到列表`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 状态提升的最佳实践法则`]}),(0,h.jsx)(`div`,{children:`1. 寻找消费该状态的所有组件树节点。`}),(0,h.jsxs)(`div`,{children:[`2. 找到它们在组件树中位置最低的`,(0,h.jsx)(`strong`,{children:`共同父组件`}),`。`]}),(0,h.jsx)(`div`,{children:`3. 将状态与变更方法定义在共同父组件，向下通过 Props 传给子组件消费。`})]})]})}var he={count:0,step:1,history:[]};function ge(e,t){switch(t.type){case`INCREMENT`:{let t=e.count+e.step;return{...e,count:t,history:[{type:`+${e.step}`,from:e.count,to:t,time:new Date().toLocaleTimeString()},...e.history.slice(0,7)]}}case`DECREMENT`:{let t=e.count-e.step;return{...e,count:t,history:[{type:`-${e.step}`,from:e.count,to:t,time:new Date().toLocaleTimeString()},...e.history.slice(0,7)]}}case`SET_STEP`:return{...e,step:t.payload};case`RESET`:return{...e,count:0,history:[{type:`RESET`,from:e.count,to:0,time:new Date().toLocaleTimeString()},...e.history.slice(0,7)]};case`UNDO`:{if(e.history.length===0)return e;let t=e.history[0];return{...e,count:t.from,history:e.history.slice(1)}}default:throw Error(`未处理的 Action 类型: ${t.type}`)}}function _e(){let[e,t]=(0,d.useReducer)(ge,he);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⚙️`}),` 使用 Reducer 替换 State（useReducer 状态机模式）`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`架构级状态管理`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`当一个组件的状态逻辑变得复杂（包含多个相互关联的子字段，或者下一个状态依赖于上一个状态的深层计算）时，将状态更新提取为`,(0,h.jsx)(`strong`,{children:`外部纯函数 Reducer`}),` 能让逻辑清晰可测，并通过统一的 `,(0,h.jsx)(`code`,{children:`dispatch(action)`}),` 驱动变更。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`纯函数 Reducer`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`统一 Action 调度 (Dispatch)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`时间旅行轨迹 (State History)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 状态机工作台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击操作按钮调度 Action，观察当前计数与历史记录流转：`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:`20px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`,display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`16px 0`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,textTransform:`uppercase`,letterSpacing:`1px`},children:`Current Value`}),(0,h.jsx)(`div`,{style:{fontSize:`48px`,fontWeight:`800`,color:e.count>=0?`var(--color-primary)`:`var(--color-danger)`},children:e.count}),(0,h.jsxs)(`div`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginTop:`4px`},children:[`步长 (Step): `,(0,h.jsx)(`strong`,{children:e.step})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`8px`},children:[(0,h.jsx)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`修改步长：`}),[1,5,10,50].map(n=>(0,h.jsxs)(`button`,{className:`btn btn-sm ${e.step===n?`btn-primary`:`btn-secondary`}`,onClick:()=>t({type:`SET_STEP`,payload:n}),children:[`±`,n]},n))]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`center`},children:[(0,h.jsxs)(`button`,{className:`btn btn-secondary`,style:{flex:1},onClick:()=>t({type:`DECREMENT`}),children:[`-`,e.step]}),(0,h.jsxs)(`button`,{className:`btn btn-primary`,style:{flex:1},onClick:()=>t({type:`INCREMENT`}),children:[`+`,e.step]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`center`},children:[(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>t({type:`UNDO`}),disabled:e.history.length===0,children:`↩️ 撤销一步 (Undo)`}),(0,h.jsx)(`button`,{className:`btn btn-danger btn-sm`,onClick:()=>t({type:`RESET`}),children:`🔄 重置归零`})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,h.jsxs)(`h4`,{style:{margin:0,fontSize:`14px`,color:`var(--text-main)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,h.jsx)(`span`,{children:`Action 流转审计日志`}),(0,h.jsxs)(`span`,{className:`badge badge-gray`,children:[e.history.length,` 条记录`]})]}),e.history.length===0?(0,h.jsx)(`div`,{style:{padding:`32px 16px`,textAlign:`center`,color:`var(--text-subtle)`,background:`var(--bg-surface)`,border:`1px dashed var(--border-color)`,borderRadius:`var(--radius-sm)`,fontSize:`13px`},children:`暂无变更记录，点击左侧按钮开始操作`}):(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`,maxHeight:`240px`,overflowY:`auto`},children:e.history.map((e,t)=>(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,fontSize:`12px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsx)(`span`,{className:`badge ${e.type.startsWith(`+`)?`badge-green`:e.type.startsWith(`-`)?`badge-amber`:`badge-purple`}`,children:e.type}),(0,h.jsxs)(`span`,{children:[e.from,` ➔ `,e.to]})]}),(0,h.jsx)(`span`,{style:{color:`var(--text-subtle)`,fontSize:`11px`},children:e.time})]},t))})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚖️`}),` useState 与 useReducer 选型指南`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`comparison-card`,style:{borderColor:`var(--border-color)`},children:[(0,h.jsxs)(`div`,{className:`comparison-header`,style:{color:`var(--color-primary)`},children:[(0,h.jsx)(`span`,{children:`🔹`}),` 何时首选 useState？`]}),(0,h.jsxs)(`ul`,{style:{margin:0,paddingLeft:`18px`,fontSize:`13px`,color:`var(--text-muted)`,display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,h.jsx)(`li`,{children:`单一基础数据类型（布尔值、字符串、数字）。`}),(0,h.jsx)(`li`,{children:`组件逻辑简短，状态更新互不干涉。`}),(0,h.jsx)(`li`,{children:`开发快速原型，没有深度的多步骤业务分支。`})]})]}),(0,h.jsxs)(`div`,{className:`comparison-card`,style:{borderColor:`var(--border-color)`},children:[(0,h.jsxs)(`div`,{className:`comparison-header`,style:{color:`var(--color-purple)`},children:[(0,h.jsx)(`span`,{children:`🔸`}),` 何时首选 useReducer？`]}),(0,h.jsxs)(`ul`,{style:{margin:0,paddingLeft:`18px`,fontSize:`13px`,color:`var(--text-muted)`,display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,h.jsx)(`li`,{children:`状态是一个包含多个关联字段的对象。`}),(0,h.jsx)(`li`,{children:`下一个状态强依赖于上一个状态的历史快照。`}),(0,h.jsx)(`li`,{children:`需要单测状态机逻辑（Reducer 可脱离 React 单独跑 Jest/Vitest 测试）。`}),(0,h.jsx)(`li`,{children:`需要结合 Context 实现跨层级分发（参考下一个案例）。`})]})]})]})]})]})}var ve=(0,d.createContext)(null),ye=(0,d.createContext)(null),be=[{id:1,title:`学习 React 19 核心 API`,done:!0},{id:2,title:`拆分 Context 双通道，规避无效重渲染`,done:!1},{id:3,title:`消除全部 Oxlint 语法规范告警`,done:!1}];function xe(e,t){switch(t.type){case`ADD`:return[{id:Date.now(),title:t.title,done:!1},...e];case`TOGGLE`:return e.map(e=>e.id===t.id?{...e,done:!e.done}:e);case`DELETE`:return e.filter(e=>e.id!==t.id);case`CLEAR_DONE`:return e.filter(e=>!e.done);default:return e}}function Se(){let e=(0,d.useContext)(ve);if(!e)throw Error(`useTaskState 必须在 TaskProvider 内使用`);return e}function Ce(){let e=(0,d.useContext)(ye);if(!e)throw Error(`useTaskDispatch 必须在 TaskProvider 内使用`);return e}function we({children:e}){let[t,n]=(0,d.useReducer)(xe,be);return(0,h.jsx)(ve.Provider,{value:t,children:(0,h.jsx)(ye.Provider,{value:n,children:e})})}function Te(){let e=Ce(),t=(0,d.useRef)(null);(0,d.useEffect)(()=>{if(t.current){let e=(Number(t.current.dataset.renders)||0)+1;t.current.dataset.renders=String(e),t.current.textContent=`⚡ 挂载/渲染次数：${e} 次（保持恒定）`}});let n=t=>{e({type:`ADD`,title:t})};return(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`10px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`14px`,color:`var(--text-main)`},children:`组件 A：任务添加栏（只订阅 Dispatch 通道）`}),(0,h.jsx)(`span`,{ref:t,className:`badge badge-green`,children:`⚡ 挂载/渲染次数：1 次（保持恒定）`})]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`12.5px`,color:`var(--text-muted)`},children:[`由于仅使用了 `,(0,h.jsx)(`code`,{children:`useTaskDispatch()`}),`，即便右侧任务列表不断增删，本组件依然 0 次多余重渲染！`]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`},children:[(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>n(`阅读 React Profiler 性能文档`),children:`➕ 添加：阅读 React Profiler 文档`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>n(`编写自定义 Hook 并做好安全断言`),children:`➕ 添加：编写安全 Hook`}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>e({type:`CLEAR_DONE`}),children:`🧹 清理已完成`})]})]})}function Ee(){let e=Se(),t=Ce(),n=(0,d.useRef)(null);return(0,d.useEffect)(()=>{if(n.current){let e=(Number(n.current.dataset.renders)||0)+1;n.current.dataset.renders=String(e),n.current.textContent=`🔄 渲染次数：${e} 次（随 State 刷新）`}}),(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`12px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`14px`,color:`var(--text-main)`},children:`组件 B：任务列表视图（订阅 State 通道）`}),(0,h.jsx)(`span`,{ref:n,className:`badge badge-amber`,children:`🔄 渲染次数：1 次（随 State 刷新）`})]}),(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:e.map(e=>(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`8px 12px`,background:e.done?`var(--bg-surface-secondary)`:`var(--bg-surface)`,border:`1px solid var(--border-subtle)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`input`,{type:`checkbox`,checked:e.done,onChange:()=>t({type:`TOGGLE`,id:e.id}),style:{cursor:`pointer`}}),(0,h.jsx)(`span`,{style:{fontSize:`13.5px`,textDecoration:e.done?`line-through`:`none`,color:e.done?`var(--text-subtle)`:`var(--text-main)`},children:e.title})]}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>t({type:`DELETE`,id:e.id}),style:{padding:`2px 8px`,fontSize:`11px`},children:`删除`})]},e.id))})]})}function De(){return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⚡`}),` Reducer + Context 双通道拆分与性能极致优化`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`高级性能模式`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`在传统 Context 架构中，一旦将 `,(0,h.jsx)(`code`,{children:`{ state, dispatch }`}),` 混在一个 Provider 中向下传递，每次 state 变更都会导致整个子树所有订阅 Context 的组件无脑重新渲染。`,(0,h.jsx)(`strong`,{children:`双通道拆分模式`}),` 将 State 与稳定的 Dispatch 彻底隔离，让写组件保持 0 无效重渲染。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`双通道架构 (Dual-Channel Context)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Dispatch 引用不变性 (Stable Identity)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`按需精确定向重渲染 (Targeted Re-render)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚖️`}),` 单通道 vs 双通道架构对比`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 单通道（常见性能杀手）`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#fef2f2`,borderRadius:`4px`,fontSize:`12px`,overflowX:`auto`},children:`// 🔴 只要 state 变了，对象引用更新
// 所有只想发送 dispatch 的按钮组件全部被迫重渲染！
<AppContext.Provider value={{ state, dispatch }}>
  <AddButton /> {/* 每次都白白重渲染！ */}
  <ListView />
</AppContext.Provider>`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 双通道拆分（工业级标准实践）`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#f0fdf4`,borderRadius:`4px`,fontSize:`12px`,overflowX:`auto`},children:`// 🟢 dispatch 引用恒定不变
// 只消费 Dispatch 的组件永远不因数据更新而重渲染！
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    <AddButton /> {/* 始终保持 1 次渲染！ */}
    <ListView />
  </DispatchContext.Provider>
</StateContext.Provider>`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔬`}),` 实时渲染计数测试工作台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击下方组件 A 中的按钮添加或切换任务，注意观察顶部绿色的【组件 A 渲染次数】与橙色的【组件 B 渲染次数】：`})]}),(0,h.jsx)(we,{children:(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,h.jsx)(Te,{}),(0,h.jsx)(Ee,{})]})})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 性能优化心智法则`]}),(0,h.jsxs)(`div`,{children:[`React 官方明确指出：`,(0,h.jsx)(`code`,{children:`dispatch`}),` 函数的引用在组件的整个生命周期中是`,(0,h.jsx)(`strong`,{children:`完全稳定且永久不变的`}),`。因此，通过单独开辟 `,(0,h.jsx)(`code`,{children:`DispatchContext`}),`，所有只负责触发行为的组件（按钮、表单提交器、定时调度器）都不需要重渲染，无需编写任何复杂的 `,(0,h.jsx)(`code`,{children:`React.memo`}),`！`]})]})]})}function Oe(){let e=(0,d.useRef)(null),t=(0,d.useRef)(null),[n,r]=(0,d.useState)([`欢迎来到 React 19 核心研讨室`,`useRef 能够保存对底层 DOM 节点的直接引用`]),[i,a]=(0,d.useState)(``),o=(0,d.useRef)(!0);(0,d.useLayoutEffect)(()=>{if(o.current){o.current=!1;return}t.current&&t.current.scrollTo({top:t.current.scrollHeight,behavior:`smooth`})},[n]);let s=t=>{t.preventDefault(),i.trim()&&(r(e=>[...e,i.trim()]),a(``),e.current?.focus())},c=()=>{e.current?.focus()},[l,u]=(0,d.useState)(0),[f,p]=(0,d.useState)(!1),m=(0,d.useRef)(null),g=()=>{m.current===null&&(p(!0),m.current=setInterval(()=>{u(e=>e+1)},1e3))},_=()=>{m.current!==null&&(clearInterval(m.current),m.current=null),p(!1)};return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🎯`}),` useRef 核心用法、DOM 控制与避坑守则`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`底层引用通道`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`useRef`}),` 返回一个可变的 ref 对象，其 `,(0,h.jsx)(`code`,{children:`.current`}),` 属性在组件的整个生命周期内持久存在。它最核心的两大职责：`,(0,h.jsx)(`strong`,{children:`直接操作底层 DOM 节点`}),`，以及`,(0,h.jsx)(`strong`,{children:`跨渲染持久化任意可变值且不触发重渲染`}),`。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`DOM 访问（Focus / Scroll / Measure）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`不引发重渲染 (Silent Mutability)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`纯函数渲染安全守则`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🖥️`}),` 1. DOM 访问：主动聚焦与聊天室自动平滑触底`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`通过 `,(0,h.jsx)(`code`,{children:`ref={inputRef}`}),` 绑定真实 DOM，可在点击或发送后立即调用 `,(0,h.jsx)(`code`,{children:`.focus()`}),`，并在新消息到来时自动调用 `,(0,h.jsx)(`code`,{children:`scrollTo`}),`：`]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:[`聊天消息窗口（总计 `,n.length,` 条）`]}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:c,children:`🎯 主动聚焦输入框`})]}),(0,h.jsx)(`div`,{ref:t,style:{height:`160px`,overflowY:`auto`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,padding:`10px`,background:`var(--bg-surface-secondary)`,display:`flex`,flexDirection:`column`,gap:`8px`},children:n.map((e,t)=>(0,h.jsx)(`div`,{style:{padding:`6px 12px`,background:`var(--bg-surface)`,borderRadius:`var(--radius-sm)`,border:`1px solid var(--border-subtle)`,fontSize:`13px`,alignSelf:t%2==0?`flex-start`:`flex-end`,maxWidth:`85%`},children:e},t))}),(0,h.jsxs)(`form`,{onSubmit:s,style:{display:`flex`,gap:`8px`,marginTop:`10px`},children:[(0,h.jsx)(`input`,{ref:e,type:`text`,className:`form-input`,placeholder:`键入消息，回车发送...`,value:i,onChange:e=>a(e.target.value)}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,children:`发送`})]})]}),(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`8px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`14px`},children:`2. 可变值存储：高精度秒表`}),(0,h.jsx)(`span`,{className:`badge ${f?`badge-green`:`badge-gray`}`,children:f?`⏱️ 计时中 (Ref 持有句柄)`:`⏸️ 处于就绪状态`})]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 16px 0`,fontSize:`12.5px`,color:`var(--text-muted)`,lineHeight:`1.5`},children:[`定时器的 `,(0,h.jsx)(`code`,{children:`timerId`}),` 是纯逻辑变量。如果保存在 `,(0,h.jsx)(`code`,{children:`useState`}),` 中，每次赋值都会造成无意义重渲染；保存在 `,(0,h.jsx)(`code`,{children:`useRef`}),` 中既能安全跨周期存活，又绝不造成多余渲染。`]}),(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`12px 0`,fontSize:`36px`,fontWeight:`800`,color:f?`var(--color-primary)`:`var(--text-muted)`},children:[l,`s`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,justifyContent:`center`},children:[f?(0,h.jsx)(`button`,{className:`btn btn-warning btn-sm`,onClick:_,children:`⏸️ 暂停秒表`}):(0,h.jsx)(`button`,{className:`btn btn-success btn-sm`,onClick:g,children:`▶️ 启动秒表`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>{_(),u(0)},children:`🔄 复位`})]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`⚠️`}),` React 官方黄金禁忌守则：切勿在渲染阶段读写 ref.current！`]}),(0,h.jsxs)(`div`,{style:{fontSize:`13px`,lineHeight:`1.6`},children:[`不要在组件函数的顶层（即 JSX 返回期间）写入或读取 `,(0,h.jsx)(`code`,{children:`ref.current`}),`，例如 `,(0,h.jsx)(`code`,{children:`ref.current = 123`}),` 或 `,(0,h.jsx)(`code`,{children:`<p>{ref.current}</p>`}),`！ 因为 React 的渲染阶段必须是一个`,(0,h.jsx)(`strong`,{children:`无副作用的纯计算过程`}),`。在并发渲染（Concurrent Mode）下，React 可能会多次尝试渲染某个组件，在渲染期修改 Ref 会导致渲染逻辑不纯、不可重入，引发严重难以排查的竞态 Bug。`,(0,h.jsx)(`strong`,{children:`仅在事件处理函数（onClick）或 useEffect / useLayoutEffect 回调中操作 Ref！`})]})]})]})}function ke({onLog:e}){let[t,n]=(0,d.useState)(window.innerWidth);return(0,d.useEffect)(()=>{let t=()=>{n(window.innerWidth),e(`info`,`📐 窗口宽度变更为: ${window.innerWidth}px`)};return window.addEventListener(`resize`,t),()=>{window.removeEventListener(`resize`,t)}},[e]),(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--color-primary-light)`,border:`1px solid var(--color-primary-border)`,borderRadius:`var(--radius-sm)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,color:`var(--text-muted)`},children:`实时视口宽度监听器：`}),(0,h.jsxs)(`strong`,{style:{marginLeft:`8px`,fontSize:`16px`,color:`var(--color-primary)`},children:[t,` px`]})]}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`监听活跃中`})]})}function Ae(){let[e,t]=(0,d.useState)(!0),[n,r]=(0,d.useState)([{type:`info`,text:`系统已就绪，准备演示 Effect 生命周期`,time:new Date().toLocaleTimeString()}]),i=(e,t)=>{r(n=>[{type:e,text:t,time:new Date().toLocaleTimeString()},...n.slice(0,19)])},a=()=>{t(e=>{let t=!e;return t?i(`info`,`🟢 [Setup 建立] 重新挂载组件并注册 window resize 监听器`):i(`warn`,`🧹 [Cleanup 清理] 卸载组件并触发 Cleanup 销毁监听器，杜绝内存泄漏！`),t})},[o,s]=(0,d.useState)(0);return(0,d.useEffect)(()=>{let e=document.title;return o>0?document.title=`(${o}条未读) React 学习实验室`:document.title=`React 学习实验室`,()=>{document.title=e}},[o]),(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🔄`}),` useEffect 正确用法、心智模型与清理函数 (Cleanup)`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`外部系统同步`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`useEffect`}),` 不是传统意义上的生命周期函数（如 componentDidMount），它的本质是：`,(0,h.jsx)(`strong`,{children:`将组件与某个非 React 外部系统保持同步`}),`（例如：浏览器原生事件、WebSocket、第三方地图控件或定时器）。并且，`,(0,h.jsx)(`strong`,{children:`每一个副作用都必须有始有终，提供完整的 Cleanup 清理函数`}),`。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`外部系统同步 (External Sync)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`清理函数 (Cleanup Return)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`严格模式双重调用 (StrictMode Verification)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔬`}),` 实验 1：外部浏览器监听与清理验证`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击按钮挂载/卸载监听器组件，或者尝试缩放浏览器窗口，观察控制台清晰捕捉到的 Setup 与 Cleanup 执行时机：`})]}),(0,h.jsxs)(`div`,{style:{marginBottom:`14px`,display:`flex`,gap:`10px`},children:[(0,h.jsx)(`button`,{className:`btn ${e?`btn-danger`:`btn-success`}`,onClick:a,children:e?`❌ 卸载监听组件（触发 Cleanup）`:`➕ 挂载监听组件（触发 Setup）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:()=>r([]),children:`清空日志`})]}),e?(0,h.jsx)(`div`,{style:{marginBottom:`16px`},children:(0,h.jsx)(ke,{onLog:i})}):(0,h.jsx)(`div`,{style:{padding:`20px`,textAlign:`center`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`,color:`var(--text-subtle)`,fontSize:`13.5px`,marginBottom:`16px`},children:`组件已卸载，清理函数已将 window resize 监听器完全移除，不会造成任何残留！`}),(0,h.jsxs)(`div`,{className:`demo-console`,children:[(0,h.jsxs)(`div`,{className:`demo-console-header`,children:[(0,h.jsx)(`span`,{children:`TERMINAL OUTPUT / EFFECT LIFECYCLE LOGS`}),(0,h.jsxs)(`span`,{children:[n.length,` 条记录`]})]}),n.map((e,t)=>(0,h.jsxs)(`div`,{className:`demo-console-log ${e.type}`,children:[`[`,e.time,`] `,e.text]},t))]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🏷️`}),` 实验 2：浏览器标头 Title 同步`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击下方按钮调整未读消息数，观察浏览器标签页标题的即时同步：`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>{s(e=>{let t=e+1;return i(`info`,`🏷️ 同步外部 document.title: (${t}条未读)`),t})},children:`模拟收到未读通知 (+1)`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>{s(0),i(`info`,`🏷️ 恢复外部 document.title: React 学习实验室`)},children:`标记全部已读 (清空)`}),(0,h.jsxs)(`span`,{style:{fontSize:`13px`,color:`var(--text-muted)`},children:[`当前未读数：`,(0,h.jsx)(`strong`,{children:o}),` 条`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 为什么 React 19 严格模式在开发环境会执行两次 Effect？`]}),(0,h.jsxs)(`div`,{children:[`在 `,(0,h.jsx)(`code`,{children:`StrictMode`}),` 下，React 会故意挂载 ➔ 立即卸载 ➔ 再次挂载组件。 这并非 Bug，而是 React 为你进行`,(0,h.jsx)(`strong`,{children:`副作用健壮性测试`}),`：如果你的 Cleanup 函数写得不严谨（例如只开了 `,(0,h.jsx)(`code`,{children:`setInterval`}),` 或 `,(0,h.jsx)(`code`,{children:`addEventListener`}),` 却没有销毁），第二次执行就会暴露出重复监听或内存泄漏。`]})]})]})}function je({userId:e}){let[t,n]=(0,d.useState)(``);return(0,h.jsxs)(`div`,{style:{padding:`14px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{fontSize:`13px`,marginBottom:`8px`},children:[`给用户 `,(0,h.jsx)(`strong`,{children:e}),` 的留言板：`]}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,placeholder:`写下留言...`,value:t,onChange:e=>n(e.target.value)}),(0,h.jsxs)(`div`,{style:{fontSize:`11px`,color:`var(--text-subtle)`,marginTop:`6px`},children:[`当前输入草稿: `,t||`（空）`]})]})}function Me(){let e=[{id:1,name:`MacBook Pro 16`,category:`电脑`,price:19999},{id:2,name:`iPhone 16 Pro Max`,category:`手机`,price:9999},{id:3,name:`iPad Pro M4`,category:`平板`,price:8999},{id:4,name:`AirPods Pro 2`,category:`配件`,price:1899},{id:5,name:`Apple Watch Ultra 2`,category:`手表`,price:6499}],[t,n]=(0,d.useState)(``),[r,i]=(0,d.useState)(`全部`),a=e.filter(e=>{let n=r===`全部`||e.category===r,i=e.name.toLowerCase().includes(t.toLowerCase());return n&&i}),[o,s]=(0,d.useState)(0),[c,l]=(0,d.useState)([]),u=e=>{s(e=>e+1);let t=`用户主动点击购买了【${e}】，完成结算操作`;l(e=>[t,...e.slice(0,4)])},[f,p]=(0,d.useState)(`User_A`);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🚫`}),` 你可能不需要 Effect（官方避坑指南）`]})}),(0,h.jsx)(`span`,{className:`badge badge-amber`,children:`架构避坑`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`很多开发者将 `,(0,h.jsx)(`code`,{children:`useEffect`}),` 当成了“数据联动触发器”。滥用 Effect 会引发严重的级联重渲染、难以追踪的时序竞态与闪烁。React 官方总结了三大最典型的“伪 Effect 场景”。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`误区 1：渲染期数据派生`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`误区 2：用户事件放入 Effect`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`误区 3：利用 key 替代重置 Effect`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔍`}),` 误区 1：用 Effect 过滤衍生数据（产生二次无谓渲染）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`错误做法是声明 `,(0,h.jsx)(`code`,{children:`filteredList`}),` 状态并在 Effect 中 `,(0,h.jsx)(`code`,{children:`setFilteredList`}),`。正确做法：直接在组件内计算！`]})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 反模式代码`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#fef2f2`,borderRadius:`4px`,fontSize:`11.5px`,overflowX:`auto`},children:`// 🔴 错误：数据流变卡顿且触发两次 Render
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(products.filter(p => ...));
}, [query, category]);`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 官方推荐写法`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#f0fdf4`,borderRadius:`4px`,fontSize:`11.5px`,overflowX:`auto`},children:`// 🟢 正确：纯计算，0 延迟，0 额外 state
const filtered = products.filter(p => {
  return matchCategory && matchQuery;
});`})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,alignItems:`center`,marginBottom:`12px`,flexWrap:`wrap`},children:[(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{maxWidth:`200px`},placeholder:`搜索商品...`,value:t,onChange:e=>n(e.target.value)}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:`6px`},children:[`全部`,`电脑`,`手机`,`平板`,`配件`,`手表`].map(e=>(0,h.jsx)(`button`,{className:`btn btn-sm ${r===e?`btn-primary`:`btn-secondary`}`,onClick:()=>i(e),children:e},e))})]}),(0,h.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(200px, 1fr))`,gap:`10px`},children:a.map(e=>(0,h.jsxs)(`div`,{style:{padding:`10px 14px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:`var(--bg-surface)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`,gap:`8px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{style:{fontSize:`13.5px`},children:e.name}),(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,marginTop:`2px`},children:e.category})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`span`,{style:{fontWeight:`700`,color:`var(--color-danger)`,fontSize:`14px`},children:[`¥`,e.price]}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>u(e.name),children:`购买`})]})]},e.id))})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🛒`}),` 误区 2：在 Effect 中处理用户特定的事件（如购买通知、提交日志）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`Effect 是为了`,(0,h.jsx)(`strong`,{children:`组件因为被展示而需要运行的代码`}),`。如果某段代码是因为`,(0,h.jsx)(`strong`,{children:`用户点击了按钮`}),`而运行，它必须直接写在 Event Handler 内部！`]})]}),(0,h.jsxs)(`div`,{style:{padding:`12px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{fontSize:`13px`,marginBottom:`8px`},children:[`已购买件数：`,(0,h.jsx)(`strong`,{children:o})]}),(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`最近操作触发记录（直接由 onClick 调度）：`}),c.length>0?(0,h.jsx)(`ul`,{style:{margin:`6px 0 0 0`,paddingLeft:`20px`,fontSize:`12.5px`},children:c.map((e,t)=>(0,h.jsx)(`li`,{children:e},t))}):(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,marginTop:`4px`},children:`点击上方商品的“购买”按钮即可触发`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔑`}),` 误区 3：使用 Effect 监听 Props 改变来重置组件状态`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`当用户 ID 切换时，需要重置输入草稿？切勿在 Effect 中调用 `,(0,h.jsx)(`code`,{children:`setComment("")`}),`，直接使用 `,(0,h.jsx)(`code`,{children:`key={userId}`}),` 即可让 React 自动完全重新初始化：`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,marginBottom:`14px`},children:[(0,h.jsx)(`button`,{className:`btn btn-sm ${f===`User_A`?`btn-primary`:`btn-secondary`}`,onClick:()=>p(`User_A`),children:`切换为用户 A (Alice)`}),(0,h.jsx)(`button`,{className:`btn btn-sm ${f===`User_B`?`btn-primary`:`btn-secondary`}`,onClick:()=>p(`User_B`),children:`切换为用户 B (Bob)`})]}),(0,h.jsx)(je,{userId:f},f)]})]})}function Ne(e,t){let n=!1,r=null;return r=setInterval(()=>{n||t({id:Date.now(),text:`[来自房间 #${e} 的实时消息] 当前在线人数: ${Math.floor(Math.random()*20+5)}`,time:new Date().toLocaleTimeString()})},2500),{close:()=>{n=!0,r&&clearInterval(r)}}}function Pe(){let[e,t]=(0,d.useState)(`101`),[n,r]=(0,d.useState)([]),[i,a]=(0,d.useState)(!1),[o,s]=(0,d.useState)([{type:`success`,text:`🟢 [Effect 建立同步] 已建立与房间 #101 的 Socket 通讯`,time:new Date().toLocaleTimeString()}]),c=(e,t)=>{s(n=>[{type:e,text:t,time:new Date().toLocaleTimeString()},...n.slice(0,19)])},l=(0,d.useRef)(i);(0,d.useEffect)(()=>{l.current=i},[i]);let u=()=>{a(e=>{let t=!e;return c(`info`,`🔔 静音状态变更为: ${t?`已开启静音（仅接收不发声）`:`已关闭静音`}`),t})},f=n=>{n!==e&&(c(`error`,`🔴 [Effect 停止同步] 触发 Cleanup，安全关闭房间 #${e} 的 Socket 连接`),c(`success`,`🟢 [Effect 重新同步] 正在建立与房间 #${n} 的新 Socket 连接...`),t(n),r([]))};return(0,d.useEffect)(()=>{let t=Ne(e,e=>{r(t=>[e,...t.slice(0,7)]),l.current?c(`warn`,`🔕 [静音屏蔽] 收到消息但不播放提示音`):c(`info`,`📩 收到新消息并播放提示音: ${e.text}`)});return()=>{t.close()}},[e]),(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🌐`}),` 响应式 Effect 的生命周期与依赖解耦`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`深度核心`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`组件中的每个 Effect 都有`,(0,h.jsx)(`strong`,{children:`独立的生命周期`}),`：它会随着依赖项的变化，经历多次`,(0,h.jsx)(`strong`,{children:`“停止同步（Cleanup）➔ 重新同步（Setup）”`}),`。通过函数式更新与 Ref 解耦非响应式逻辑，可避免因无关状态变化反复销毁重建昂贵连接。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`响应式值（Reactive Values）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`函数式更新解耦（Functional Updates）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Ref 穿透闭包陷阱`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 实时聊天室连接模拟器`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`切换房间（触发断开重连）与切换静音（不重连只更新 Ref），观察终端中精准的生命周期事件：`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`12px`,marginBottom:`16px`,padding:`12px 16px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:`600`},children:`切换当前房间：`}),[`101`,`102`,`103`].map(t=>(0,h.jsxs)(`button`,{className:`btn btn-sm ${e===t?`btn-primary`:`btn-secondary`}`,onClick:()=>f(t),children:[`房间 #`,t]},t))]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`button`,{className:`btn btn-sm ${i?`btn-warning`:`btn-outline`}`,onClick:u,children:i?`🔕 当前已静音（点击解除）`:`🔔 开启静音（点击静音）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>s([]),children:`清空日志`})]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{fontSize:`13px`,fontWeight:`600`,marginBottom:`8px`,color:`var(--text-main)`},children:[`房间 #`,e,` 实时消息通道`]}),(0,h.jsx)(`div`,{style:{height:`220px`,overflowY:`auto`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,padding:`10px`,background:`var(--bg-surface)`,display:`flex`,flexDirection:`column`,gap:`8px`},children:n.length===0?(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`40px 0`,color:`var(--text-subtle)`,fontSize:`13px`},children:[`正在等待房间 #`,e,` 的广播消息...`]}):n.map(t=>(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`,fontSize:`12.5px`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,color:`var(--text-subtle)`,fontSize:`11px`,marginBottom:`3px`},children:[(0,h.jsx)(`span`,{children:t.time}),(0,h.jsxs)(`span`,{children:[`#`,e]})]}),(0,h.jsx)(`div`,{children:t.text})]},t.id))})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:`13px`,fontWeight:`600`,marginBottom:`8px`,color:`var(--text-main)`},children:`Effect 运行时生命周期链路追踪`}),(0,h.jsxs)(`div`,{className:`demo-console`,style:{height:`220px`,maxHeight:`220px`},children:[(0,h.jsxs)(`div`,{className:`demo-console-header`,children:[(0,h.jsx)(`span`,{children:`SOCKET LIFECYCLE MONITOR`}),(0,h.jsxs)(`span`,{children:[o.length,` 条追踪`]})]}),o.map((e,t)=>(0,h.jsxs)(`div`,{className:`demo-console-log ${e.type}`,children:[`[`,e.time,`] `,e.text]},t))]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 依赖项优化两大杀手锏`]}),(0,h.jsxs)(`div`,{children:[`1. `,(0,h.jsx)(`strong`,{children:`避免在 Effect 中读取 state 来计算下一个 state`}),`：使用 `,(0,h.jsx)(`code`,{children:`setMessages(prev => [...prev, msg])`}),`，这样 Effect 就不需要将 `,(0,h.jsx)(`code`,{children:`messages`}),` 放入依赖项数组，规避死循环。`]}),(0,h.jsxs)(`div`,{children:[`2. `,(0,h.jsx)(`strong`,{children:`使用 Ref 隔离非响应式逻辑`}),`：例如这里的 `,(0,h.jsx)(`code`,{children:`isMuted`}),`。我们只想在收到消息时获取它的最新值，而不想在用户切换静音时重新建立 WebSocket 连接。用 Ref 保存最新值是完美破除“闭包陈旧”与“无效重启”的标准方案。`]})]})]})}var Fe=`import { useState } from "react";
import { UserCard } from "../components/UserCard";
import { ProductCard } from "../components/ProductCard";

export function PropsBasicsDemo() {
  // 交互式试验状态
  const [userName, setUserName] = useState("张三");
  const [userRole, setUserRole] = useState("前端架构师");
  const [isOnline, setIsOnline] = useState(true);

  const [productPrice, setProductPrice] = useState(99);
  const [productDiscount, setProductDiscount] = useState(0.8);

  const adminData = {
    name: "管理员 Alex",
    role: "超级管理员",
    isOnline: true,
  };

  const item = {
    title: "高品质有机蓝莓",
    price: 36,
    discount: 0.9,
    tags: ["时令优选", "冷链配送"],
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>📌</span> Props 基础传递、解构与派生计算
            </h2>
          </div>
          <span className="badge badge-blue">单向数据流</span>
        </div>
        <p className="demo-desc">
          Props（属性）是父组件向子组件单向传递的只读输入参数。本 Demo 演示参数解构、默认值回退机制、展开语法（Spread Props）以及如何利用纯函数衍生计算替代多余的 State。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">只读性（Read-only）</span>
          <span className="badge badge-gray">默认值解构（Default Props）</span>
          <span className="badge badge-gray">JSX 展开语法（...props）</span>
          <span className="badge badge-gray">衍生状态（Derived Value）</span>
        </div>
      </div>

      {/* 交互式实验区 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 实时交互试验台
          </h3>
          <p className="demo-section-desc">
            调整输入项，观察子组件如何根据传入的 Props 发生响应式重新渲染：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 左侧控制器 */}
          <div style={{ padding: "16px", backgroundColor: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>控制面板（父组件状态）</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  用户姓名：
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  用户角色：
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="online-toggle"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="online-toggle" style={{ fontSize: "13px", cursor: "pointer" }}>
                  标记为在线状态 (isOnline)
                </label>
              </div>
            </div>
          </div>

          {/* 右侧渲染结果 */}
          <div>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--text-muted)" }}>
              子组件接收 Props 渲染结果
            </h4>
            <UserCard name={userName || "（空名称）"} role={userRole} isOnline={isOnline} />
          </div>
        </div>
      </div>

      {/* 模块 1：UserCard 基础场景对比 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>👤</span> 用户卡片（UserCard）解构与默认值场景
          </h3>
          <p className="demo-section-desc">
            演示常规显式传参、未传参数自动触发形参默认值（role = "普通成员"），以及展开语法批量入参。
          </p>
        </div>

        <div className="demo-grid-3">
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 A：显式完整传参
            </div>
            <UserCard name="李雷" role="高级产品经理" isOnline={true} />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 B：未传 role（默认值生效）
            </div>
            <UserCard name="韩梅梅" isOnline={false} />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 C：展开语法 \`&#123;...adminData&#125;\`
            </div>
            <UserCard {...adminData} />
          </div>
        </div>
      </div>

      {/* 模块 2：ProductCard 派生计算与只读性 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🛍️</span> 商品卡片（ProductCard）衍生计算与列表渲染
          </h3>
          <p className="demo-section-desc">
            演示实际折后价 <code>price * discount</code> 衍生计算，严禁在子组件直接修改 <code>props.price</code>！
          </p>
        </div>

        <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px" }}>原价：¥{productPrice}</span>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px" }}>折扣：{productDiscount * 10} 折</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={productDiscount}
                onChange={(e) => setProductDiscount(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="demo-grid-3">
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-success)" }}>
              实时滑块联动商品
            </div>
            <ProductCard
              title="进口阿拉斯加帝王蟹"
              price={productPrice}
              discount={productDiscount}
              tags={["海鲜直达", "热销"]}
            />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-success)" }}>
              不传 discount（默认为 1）
            </div>
            <ProductCard title="高山特级碧螺春" price={68} tags={["明前茶", "产地直发"]} />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-success)" }}>
              对象展开 \`&#123;...item&#125;\`
            </div>
            <ProductCard {...item} />
          </div>
        </div>
      </div>

      {/* 核心总结提示框 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> Props 核心心智模型
        </div>
        <div>
          1. <strong>单向只读性</strong>：Props 永远由父级决定，子组件严禁直接修改入参对象（如 <code>props.price = 99</code> 会违背 React 纯函数规范并可能引发不可预测的副作用）。
        </div>
        <div>
          2. <strong>衍生计算优先</strong>：如果一个值可以通过已有 props/state 简单计算得到，直接在组件函数体内声明局部变量，切忌将其拷贝存入新的 state 中。
        </div>
      </div>
    </div>
  );
}

export default PropsBasicsDemo;
`,Ie=`/**
 * UserCard 组件
 * 演示：Props 基础读取、参数默认值解构与纯函数渲染
 */
export function UserCard({ name, role = "普通成员", isOnline }) {
  // 生成用户名首字母头像
  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-xs)",
        transition: "all var(--transition-fast)",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      {/* 头像与在线状态 */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary-light)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "18px",
            border: "1px solid var(--color-primary-border)",
          }}
        >
          {initial}
        </div>
        <span
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: isOnline ? "var(--color-success)" : "var(--text-subtle)",
            border: "2px solid #fff",
          }}
          title={isOnline ? "在线" : "离线"}
        />
      </div>

      {/* 用户信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <h4 style={{ margin: 0, fontSize: "15px", color: "var(--text-main)", fontWeight: "600" }}>
            {name}
          </h4>
          <span
            style={{
              fontSize: "11px",
              padding: "1px 6px",
              borderRadius: "var(--radius-xs)",
              backgroundColor: "var(--bg-surface-secondary)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-color)",
            }}
          >
            {role}
          </span>
        </div>
        <div style={{ fontSize: "12.5px", color: isOnline ? "var(--color-success-text)" : "var(--text-subtle)" }}>
          {isOnline ? "🟢 当前在线" : "⚪ 离线"}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
`,Le=`/**
 * ProductCard 组件
 * 演示：Props 派生计算（实际售价）、只读性、列表渲染与展开语法
 */
export function ProductCard({ title = "暂无标题", price = 0, discount = 1, tags = [] }) {
  // 💡 Props 是只读的，组件像纯函数一样，不修改自己的入参
  // 实际售价通过衍生计算得出，无需也不应该把 actualPrice 放入单独的 useState 中
  const actualPrice = price * discount;
  const hasDiscount = discount < 1;

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-xs)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "12px",
        transition: "all var(--transition-fast)",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <strong style={{ fontSize: "15px", color: "var(--text-main)", fontWeight: "600" }}>
            {title}
          </strong>
          {hasDiscount && (
            <span className="badge badge-amber" style={{ fontSize: "11px" }}>
              {(discount * 10).toFixed(1).replace(/\\.0$/, "")} 折
            </span>
          )}
        </div>

        <div style={{ marginTop: "8px", display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--color-danger)" }}>
            ¥{actualPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: "12px", color: "var(--text-subtle)", textDecoration: "line-through" }}>
              ¥{price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
          {tags.map((tag) => (
            <span key={tag} className="badge badge-gray" style={{ fontSize: "11px" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
`,Re=`import { useState } from "react";
import { CardContainer } from "../components/CardContainer";
import { ModalLayout } from "../components/ModalLayout";

export function ChildrenSlotDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState("info"); // 'info' | 'form'
  const [formSubmitted, setFormSubmitted] = useState(false);

  const openModal = (type) => {
    setModalContentType(type);
    setIsModalOpen(true);
    setFormSubmitted(false);
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>📦</span> Children 默认插槽与组件组合模式
            </h2>
          </div>
          <span className="badge badge-purple">组合优于继承</span>
        </div>
        <p className="demo-desc">
          React 通过内置的 <code>props.children</code> 实现了强大的组合模式（Composition）。容器组件专注布局、边框阴影、可访问性及弹窗行为控制，内部的 JSX 内容则完全交由调用者灵活注入。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">默认插槽 (props.children)</span>
          <span className="badge badge-gray">通用布局外壳 (Layout Shell)</span>
          <span className="badge badge-gray">条件渲染 (Conditional Rendering)</span>
        </div>
      </div>

      {/* 场景 1：通用卡片容器 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🗂️</span> 1. 通用卡片容器（CardContainer）的多态复用
          </h3>
          <p className="demo-section-desc">
            同一个卡片外壳组件，通过嵌套不同的子 JSX，既可以承载纯文本与操作按钮，也可以内嵌完整表单：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 场景 A */}
          <CardContainer
            title="通知公告卡片"
            subtitle="纯展示型内容组合"
            extra={<span className="badge badge-blue">系统</span>}
          >
            <p style={{ margin: "0 0 14px 0", color: "var(--text-muted)", fontSize: "13.5px", lineHeight: "1.6" }}>
              React 19 全新架构现已上线，默认支持编译器指令以及优化了并发渲染能力。子节点可包含任意 HTML 结构与操作回调。
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert("触发了卡片内的自定义按钮逻辑！")}
            >
              了解更多详情
            </button>
          </CardContainer>

          {/* 场景 B */}
          <CardContainer
            title="快速反馈卡片"
            subtitle="内嵌表单控件组合"
            extra={<span className="badge badge-green">可交互</span>}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("已成功提交反馈内容！");
              }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  建议或问题：
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入您的宝贵建议..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-success btn-sm">
                立即提交建议
              </button>
            </form>
          </CardContainer>
        </div>
      </div>

      {/* 场景 2：弹窗遮罩与条件渲染 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🪟</span> 2. 模态弹窗外壳（ModalLayout）
          </h3>
          <p className="demo-section-desc">
            弹窗外壳负责管理背景遮罩、居中定位、ESC 键快捷关闭，弹窗内部的具体内容使用 <code>children</code> 随心所欲定制：
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button className="btn btn-primary" onClick={() => openModal("info")}>
            打开提示型弹窗（文本注入）
          </button>
          <button className="btn btn-secondary" onClick={() => openModal("form")}>
            打开登录型弹窗（表单注入）
          </button>
        </div>

        {/* 实际渲染的 Modal */}
        <ModalLayout
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalContentType === "info" ? "系统通知" : "快捷用户登录"}
        >
          {modalContentType === "info" ? (
            <div>
              <p style={{ margin: "0 0 16px 0", color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
                这是一个借助 <code>children</code> 传递给 <code>ModalLayout</code> 的简单文本视图。外壳负责居中与 ESC 快捷关闭，内部逻辑完全隔离。
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(false)}>
                  好的，已阅读
                </button>
              </div>
            </div>
          ) : (
            <div>
              {formSubmitted ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎉</div>
                  <h4 style={{ margin: "0 0 6px 0" }}>登录成功！</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
                    弹窗已被成功复用为表单容器。
                  </p>
                  <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
                    完成并关闭
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      登录邮箱：
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      登录密码：
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      取消
                    </button>
                    <button type="submit" className="btn btn-success btn-sm">
                      确认登录
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </ModalLayout>
      </div>

      {/* 总结卡片 */}
      <div className="demo-alert demo-alert-success">
        <div className="demo-alert-title">
          <span>💡</span> 组合模式设计原则
        </div>
        <div>
          当一个组件需要支持多种内部结构时，<strong>优先使用组合（Passing Children）</strong>，而不是在组件内部通过定义 10 个布尔值 props（如 <code>showImage</code>, <code>showForm</code>, <code>hasButton</code>）来控制结构分支。组合模式可以让代码解耦，大幅降低维护成本。
        </div>
      </div>
    </div>
  );
}

export default ChildrenSlotDemo;
`,ze=`/**
 * CardContainer 容器组件
 * 演示：children 基础默认插槽与组件组合模式 (Composition)
 * 容器只负责结构包装、边框阴影与标题外壳，内部具体内容完全交由调用方定制
 */
export function CardContainer({ title, subtitle, extra, children }) {
  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-xs)",
        overflow: "hidden",
        transition: "box-shadow var(--transition-fast)",
      }}
    >
      {(title || extra) && (
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {title && (
              <h4 style={{ margin: 0, fontSize: "15px", color: "var(--text-main)", fontWeight: "600" }}>
                {title}
              </h4>
            )}
            {subtitle && (
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--text-subtle)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div style={{ padding: "18px" }}>{children}</div>
    </div>
  );
}

export default CardContainer;
`,Be=`import { useEffect } from "react";

/**
 * ModalLayout 弹窗外壳组件
 * 演示：children 弹窗遮罩、条件渲染与副作用键盘监听闭环
 */
export function ModalLayout({ isOpen = false, onClose, title, children }) {
  // 监听 ESC 键自动关闭弹窗
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "16px",
        animation: "fadeIn 0.15s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "500px",
          maxWidth: "100%",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
          position: "relative",
          animation: "scaleUp 0.15s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部标题与关闭按钮 */}
        {(title || onClose) && (
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main)" }}>
              {title || "提示"}
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="关闭弹窗"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  lineHeight: 1,
                  color: "var(--text-subtle)",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "var(--radius-xs)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color var(--transition-fast)",
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
}

export default ModalLayout;
`,Ve=`import { useState } from "react";
import { ProductionModal } from "../components/MultySlots";
import { Pannel } from "../components/Pannel";

export function MultiSlotsDemo() {
  const [modalType, setModalType] = useState(null);
  const closeModal = () => setModalType(null);

  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧩</span> 具名多插槽客制化设计规范
            </h2>
          </div>
          <span className="badge badge-purple">组件库架构协议</span>
        </div>
        <p className="demo-desc">
          成熟组件库（如 Ant Design、shadcn/ui、MUI）广泛采用“三态插槽协议”（默认模板 + 局部覆盖 + 显式隐藏）。通过 Props 接收自定义 JSX 节点或布尔值，实现比单一 <code>children</code> 更高维度的扩展能力。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">具名插槽（Named Slots via Props）</span>
          <span className="badge badge-gray">三态渲染协议（Tri-state Protocol）</span>
          <span className="badge badge-gray">零额外 DOM 成本</span>
        </div>
      </div>

      {/* 核心协议规则卡片 */}
      <div className="demo-alert demo-alert-info">
        <div className="demo-alert-title">
          <span>📋</span> 工业级三态插槽协议判定规范
        </div>
        <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <li>
            <strong>1. 显式隐藏：</strong><code>slotProp === false</code> → 返回 <code>null</code>，完全不产生 DOM 占位
          </li>
          <li>
            <strong>2. 局部覆盖：</strong><code>slotProp !== undefined</code> → 渲染调用方传入的内容（支持 string、JSX 或组件）
          </li>
          <li>
            <strong>3. 回退默认：</strong><code>slotProp === undefined</code> → 自动渲染内置预设的默认模板组件
          </li>
        </ul>
      </div>

      {/* 模块 1：ProductionModal 生产级弹窗 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🪟</span> 1. 多插槽模态框（ProductionModal）
          </h3>
          <p className="demo-section-desc">
            支持 <code>title</code>（头部插槽）、<code>footer</code>（底部插槽）与 <code>children</code>（主体插槽）：
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button className="btn btn-primary" onClick={() => setModalType("default")}>
            1. 全默认模板（默认头部+底部）
          </button>
          <button className="btn btn-danger" onClick={() => setModalType("custom-title")}>
            2. 局部覆盖标题（危险红色警告）
          </button>
          <button className="btn btn-success" onClick={() => setModalType("custom-footer")}>
            3. 局部覆盖底部（自定义单个按钮）
          </button>
          <button className="btn btn-secondary" onClick={() => setModalType("no-footer")}>
            4. 显式隐藏底部 (footer=false)
          </button>
        </div>

        {/* 场景 1：全默认 */}
        <ProductionModal
          isOpen={modalType === "default"}
          onClose={closeModal}
          onConfirm={() => {
            alert("触发了默认弹窗确认！");
            closeModal();
          }}
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            这是零额外配置的通知弹窗，头部标题和底部操作按钮均采用组件库内置默认模板。
          </p>
        </ProductionModal>

        {/* 场景 2：覆盖 Header */}
        <ProductionModal
          isOpen={modalType === "custom-title"}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-danger)" }}>
              <span>⚠️</span>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>严重警告：危险操作</h3>
            </div>
          }
          onClose={closeModal}
          onConfirm={closeModal}
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            该操作将永久删除该项数据，且无法撤销！注意：虽然头部被完全重写，但底部依然保留了内置的确认与取消操作栏。
          </p>
        </ProductionModal>

        {/* 场景 3：覆盖 Footer */}
        <ProductionModal
          isOpen={modalType === "custom-footer"}
          onClose={closeModal}
          footer={
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="btn btn-success" onClick={closeModal}>
                🎉 我知道了，立即体验
              </button>
            </div>
          }
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            恭喜！您的专属权益已成功生效。底部插槽被替换为居中的单项体验按钮。
          </p>
        </ProductionModal>

        {/* 场景 4：隐藏 Footer */}
        <ProductionModal
          isOpen={modalType === "no-footer"}
          title="纯展示性服务协议条款"
          footer={false}
          onClose={closeModal}
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            通过传入 <code>footer=&#123;false&#125;</code>，组件直接跳过底部操作条的 DOM 生成，适合展示纯文本说明。
          </p>
        </ProductionModal>
      </div>

      {/* 模块 2：Pannel 面板组件 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>📋</span> 2. 多插槽卡片面板（Pannel）
          </h3>
          <p className="demo-section-desc">
            具有 <code>header</code>（左上角标题插槽）、<code>extra</code>（右上角扩展操作插槽）与 <code>children</code>（主体内容）：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 场景 A */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 A：全默认模板（未传 header 与 extra）
            </div>
            <Pannel>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
                默认标题为“📋 卡片面板”，右上角展示默认的“查看更多 →”。
              </p>
            </Pannel>
          </div>

          {/* 场景 B */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 B：自定义 Header 标题（保留默认 extra）
            </div>
            <Pannel header={<strong style={{ color: "var(--color-primary)" }}>📈 业务实时大盘</strong>}>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
                自定义了左侧标题，右侧 Extra 仍然优雅回退到内置的链接模板。
              </p>
            </Pannel>
          </div>

          {/* 场景 C */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 C：同时自定义 Header 与 Extra 交互
            </div>
            <Pannel
              header={<strong style={{ color: "var(--color-success)" }}>⚡ 实时心跳健康检测</strong>}
              extra={
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setRefreshCount((c) => c + 1)}
                >
                  🔄 刷新 ({refreshCount})
                </button>
              }
            >
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
                插槽内可无缝嵌入受控交互，已点击刷新 {refreshCount} 次。
              </p>
            </Pannel>
          </div>

          {/* 场景 D */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 D：显式隐藏顶部导航条 (header=false, extra=false)
            </div>
            <Pannel header={false} extra={false}>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-subtle)" }}>
                顶部栏整体被消除，呈现为一张干净的纯内容卡片。
              </p>
            </Pannel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiSlotsDemo;
`,He=`/**
 * 生产级具名多插槽组件 (ProductionModal)
 * 
 * 核心三态插槽协议设计规范：
 * 1. 显式隐藏：slotProp === false => 返回 null，不渲染该区域，不占用 DOM 结构
 * 2. 局部覆盖：slotProp !== undefined => 渲染调用者传入的内容 (string | JSX | Component)
 * 3. 回退默认：slotProp === undefined => 渲染内置默认预设模板
 */

// 默认模版 1：头部
export function DefaultModalHeader({ titleText = "系统提示", onClose }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main)" }}>
        {titleText}
      </h3>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="关闭"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "18px",
            color: "var(--text-subtle)",
            padding: "2px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// 默认模版 2：底部操作栏
export function DefaultModalFooter({ onConfirm, onClose, confirmText = "确认", cancelText = "取消" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "14px 20px",
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-surface-secondary)",
      }}
    >
      <button className="btn btn-secondary btn-sm" onClick={onClose}>
        {cancelText}
      </button>
      <button className="btn btn-primary btn-sm" onClick={onConfirm}>
        {confirmText}
      </button>
    </div>
  );
}

// 核心多插槽 Modal 组件
export function ProductionModal({
  isOpen,
  onClose,
  onConfirm,
  title, // 具名插槽 1：string | JSX | false
  footer, // 具名插槽 2：JSX | false
  children, // 主插槽：弹窗主体
}) {
  if (!isOpen) return null;

  // 三态插槽判定
  const renderHeader = () => {
    if (title === false) return null;
    if (title !== undefined) {
      // 支持直接传字符串或自定义 JSX
      return typeof title === "string" ? (
        <DefaultModalHeader titleText={title} onClose={onClose} />
      ) : (
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)" }}>
          {title}
        </div>
      );
    }
    return <DefaultModalHeader titleText="系统通知" onClose={onClose} />;
  };

  const renderFooter = () => {
    if (footer === false) return null;
    if (footer !== undefined) {
      return (
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border-color)" }}>
          {footer}
        </div>
      );
    }
    return <DefaultModalFooter onConfirm={onConfirm} onClose={onClose} />;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "460px",
          maxWidth: "100%",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderHeader()}
        <div style={{ padding: "20px" }}>{children}</div>
        {renderFooter()}
      </div>
    </div>
  );
}

export default ProductionModal;
`,Ue=`/**
 * Pannel 面板组件
 * 演示：具名多插槽组件设计模式（header / extra / children）
 * 遵循三态插槽协议：false 显式隐藏、传入值覆盖、undefined 回退默认
 */

export const DefaultPannelHeader = () => {
  return (
    <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "14.5px", display: "flex", alignItems: "center", gap: "6px" }}>
      <span>📋</span>
      <span>卡片面板</span>
    </div>
  );
};

export const DefaultPannelExtra = () => {
  return (
    <div style={{ fontSize: "13px" }}>
      <a
        href="#more"
        onClick={(e) => {
          e.preventDefault();
          alert("触发默认 Extra: 查看详情");
        }}
        style={{ color: "var(--color-primary)", fontWeight: "500" }}
      >
        查看更多 →
      </a>
    </div>
  );
};

export function Pannel({ header, extra, children }) {
  function renderHeader() {
    if (header === false) return null;
    if (header !== undefined) return header;
    return <DefaultPannelHeader />;
  }

  function renderExtra() {
    if (extra === false) return null;
    if (extra !== undefined) return extra;
    return <DefaultPannelExtra />;
  }

  const hasTopBar = header !== false || extra !== false;

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--bg-surface)",
        margin: "12px 0",
        overflow: "hidden",
        boxShadow: "var(--shadow-xs)",
        transition: "box-shadow var(--transition-fast)",
      }}
    >
      {hasTopBar && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface-secondary)",
          }}
        >
          <div className="pannel-header">{renderHeader()}</div>
          <div className="pannel-extra">{renderExtra()}</div>
        </div>
      )}

      <div style={{ padding: "18px", color: "var(--text-main)" }} className="pannel-body">
        {children || <span style={{ color: "var(--text-subtle)", fontStyle: "italic" }}>暂无面板内容</span>}
      </div>
    </div>
  );
}

export default Pannel;
`,We=`import { useState, createContext, useContext } from "react";

// 创建全局用户上下文
const UserContext = createContext(null);

// ==========================================
// 方案 1：属性逐层透传 (Prop Drilling)
// 缺点：中间组件 Navbar 和 Header 完全不需要 user，却被迫传递
// ==========================================
function DrillingAvatar({ user }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#ef4444",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {user.name.charAt(0)}
      </div>
      <span style={{ fontSize: "13px" }}>{user.name} ({user.role})</span>
    </div>
  );
}

function DrillingHeader({ user }) {
  return (
    <div style={{ padding: "8px 12px", background: "#f1f5f9", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "12px", color: "#64748b" }}>Header（中间层 2）</span>
      <DrillingAvatar user={user} />
    </div>
  );
}

function DrillingNavbar({ user }) {
  return (
    <div style={{ padding: "10px", border: "1px dashed #cbd5e1", borderRadius: "8px" }}>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Navbar 导航栏（中间层 1）</div>
      <DrillingHeader user={user} />
    </div>
  );
}

// ==========================================
// 方案 2：组件组合解法 (Component Composition)
// 官方推荐首选：由顶层直接组装目标组件，中间层通过 children / slot 穿透
// 中间层无需知晓任何 user 的字段！
// ==========================================
function CompositionNavbar({ rightSlot }) {
  return (
    <div style={{ padding: "10px", border: "1px dashed #86efac", borderRadius: "8px", background: "#f0fdf4" }}>
      <div style={{ fontSize: "12px", color: "#166534", marginBottom: "6px" }}>
        Navbar 导航栏（无任何 user Props，只负责布局插槽）
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: "600" }}>应用 Logo</span>
        {rightSlot}
      </div>
    </div>
  );
}

// ==========================================
// 方案 3：Context API 全局共享解法
// 适合全局深层广播（如多处消费当前用户/主题）
// ==========================================
function ContextAvatar() {
  const user = useContext(UserContext);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {user.name.charAt(0)}
      </div>
      <span style={{ fontSize: "13px" }}>{user.name} ({user.role})</span>
    </div>
  );
}

function ContextHeader() {
  return (
    <div style={{ padding: "8px 12px", background: "#eff6ff", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "12px", color: "#1e40af" }}>Header（无需 Props，直接透传）</span>
      <ContextAvatar />
    </div>
  );
}

function ContextNavbar() {
  return (
    <div style={{ padding: "10px", border: "1px dashed #93c5fd", borderRadius: "8px" }}>
      <div style={{ fontSize: "12px", color: "#1e40af", marginBottom: "6px" }}>
        Navbar 导航栏（无需 Props）
      </div>
      <ContextHeader />
    </div>
  );
}

export function PropDrillingDemo() {
  const [user, setUser] = useState({ name: "Alex Chen", role: "技术总监" });

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🪜</span> 属性逐层透传（Prop Drilling）与两大破解之道
            </h2>
          </div>
          <span className="badge badge-amber">架构解耦</span>
        </div>
        <p className="demo-desc">
          “Prop Drilling” 指为了将数据传递给深层子组件，沿途所有中间组件都必须显式接收并向下透传 Props 的反模式。这导致中间组件与无关数据过度耦合，重构极易出错。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-red">反模式：逐层透传 (Drilling)</span>
          <span className="badge badge-green">官方首选推荐：组件组合 (Composition)</span>
          <span className="badge badge-blue">全局解法：Context API</span>
        </div>
      </div>

      {/* 实时修改用户状态 */}
      <div className="demo-section" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>修改顶层用户状态：</span>
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="用户姓名"
            />
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              placeholder="用户角色"
            />
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setUser({ name: "Sarah Lee", role: "UI 设计总监" })}
          >
            切换为用户 Sarah
          </button>
        </div>
      </div>

      {/* 三大方案直观对比 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> 三大解决路径方案对比
          </h3>
          <p className="demo-section-desc">
            观察代码结构与组件责任边界的不同：
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* 方案 1 */}
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 方案 1：属性逐层透传 (Prop Drilling)
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              链路：<code>Page(拥有 user) ➔ Navbar(无需 user) ➔ Header(无需 user) ➔ Avatar(消费 user)</code>。中间任何一层改名或漏传都会导致崩溃。
            </p>
            <DrillingNavbar user={user} />
          </div>

          {/* 方案 2 */}
          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 方案 2：组件组合插槽 (Component Composition - 官方优先推荐)
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              由顶层直接渲染 <code>&lt;DrillingAvatar user=&#123;user&#125; /&gt;</code> 并作为 slot 传给 Navbar。中间组件仅负责插槽摆放，对 <code>user</code> 完全解耦，随时可替换！
            </p>
            <CompositionNavbar rightSlot={<DrillingAvatar user={user} />} />
          </div>

          {/* 方案 3 */}
          <div style={{ border: "1px solid #bfdbfe", borderRadius: "var(--radius-md)", padding: "16px", backgroundColor: "#f8fafc" }}>
            <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#1d4ed8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <span>🌐</span> 方案 3：Context API 全局广播
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              通过 <code>UserContext.Provider</code> 包裹顶层，深层 <code>Avatar</code> 直接使用 <code>useContext(UserContext)</code> 获取数据，中间链路 0 属性感知。
            </p>
            <UserContext.Provider value={user}>
              <ContextNavbar />
            </UserContext.Provider>
          </div>
        </div>
      </div>

      {/* 核心设计决策心智 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 架构决策指南：遇到 Prop Drilling 时如何抉择？
        </div>
        <div>
          1. <strong>不要过早引入 Context</strong>：Context 会降低组件的独立复用性。如果只是 2~3 层的布局传递，<strong>优先使用组件组合（插槽 / Children）</strong>。
        </div>
        <div>
          2. <strong>何时使用 Context</strong>：当数据是真正的“全局共享属性”（如当前登录用户信息、UI 主题 Theme、国际化语言 Locale、购物车全局清单），且组件树中很多不同深度的组件都需要同时读取时，才选用 Context。
        </div>
      </div>
    </div>
  );
}

export default PropDrillingDemo;
`,Ge=`import { useState } from "react";

export function StateDryDemo() {
  // ==========================================
  // 实验 1：姓名全称衍生计算
  // ==========================================
  const [firstName, setFirstName] = useState("张");
  const [lastName, setLastName] = useState("三丰");
  // ✅ 状态干净：直接在渲染期派生计算，不声明 fullName state，不使用 useEffect
  const fullName = \`\${firstName} \${lastName}\`.trim();

  // ==========================================
  // 实验 2：购物车单一数据源 (Single Source of Truth)
  // ==========================================
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "新鲜红富士苹果 (斤)", price: 8.5, count: 2 },
    { id: 2, name: "进口特级香蕉 (把)", price: 12.0, count: 1 },
    { id: 3, name: "原味高钙纯牛奶 (箱)", price: 45.0, count: 1 },
  ]);

  // ✅ 核心收益：无需维护 totalPrice / totalCount / hasFreeShipping 等 5 个冗余 state
  const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.count, 0);
  const isFreeShipping = totalPrice >= 60;

  const updateCount = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextCount = Math.max(0, item.count + delta);
            return { ...item, count: nextCount };
          }
          return item;
        })
        .filter((item) => item.count > 0),
    );
  };

  // ==========================================
  // 实验 3：选中的商品（存 ID 还是存整条对象副本？）
  // ==========================================
  const [selectedId, setSelectedId] = useState(1);
  // ✅ 仅存 selectedId，通过 .find 动态查找最新对象，防止列表编辑后选中对象数据脱节
  const selectedItem = cartItems.find((i) => i.id === selectedId) || null;

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧪</span> 状态干净原则 (DRY: Don't Repeat Yourself in State)
            </h2>
          </div>
          <span className="badge badge-green">核心心智模型</span>
        </div>
        <p className="demo-desc">
          React 官方核心准则之一：<strong>“永远不要在 State 中存储任何可以根据现有 Props 或 State 衍生计算出的值。”</strong> 冗余 State 不仅会带来额外的 re-render 损耗，还会导致多数据源脱节（Sync Desynchronization）的高危 Bug。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">单一数据源 (Single Source of Truth)</span>
          <span className="badge badge-gray">渲染期派生 (Derived Values during render)</span>
          <span className="badge badge-gray">严禁冗余缓存 (No Redundant State)</span>
        </div>
      </div>

      {/* 案例 1：计算衍生全名 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔤</span> 案例 1：拼接全称（简单衍生值）
          </h3>
          <p className="demo-section-desc">
            初学者常误用 <code>useState(fullName)</code> 配合 <code>useEffect</code> 同步，造成多余渲染。正确做法：直接在组件内计算！
          </p>
        </div>

        <div className="comparison-container">
          {/* 错误模式 */}
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 反模式：声明冗余 State 并靠 Effect 同步
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#fef2f2", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{\`// 🔴 错误写法：3 个状态 + 1 个副作用
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(first + ' ' + last); // 导致额外的重渲染！
}, [first, last]);\`}
            </pre>
          </div>

          {/* 正确模式 */}
          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 干净写法：纯函数渲染期计算
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#f0fdf4", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{\`// 🟢 干净写法：仅 2 个基础状态
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
// 渲染期直接计算，0 额外状态，0 异步延迟
const fullName = \\\`\\\${first} \\\${last}\\\`.trim();\`}
            </pre>
          </div>
        </div>

        {/* 交互体验 */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", padding: "12px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>姓氏：</label>
            <input
              type="text"
              className="form-input"
              style={{ width: "100px" }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>名字：</label>
            <input
              type="text"
              className="form-input"
              style={{ width: "120px" }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div style={{ marginLeft: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>派生全名：</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-primary)" }}>
              {fullName || "（尚未输入）"}
            </span>
          </div>
        </div>
      </div>

      {/* 案例 2：购物车合计统计 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🛒</span> 案例 2：购物车结算清单与总价计算
          </h3>
          <p className="demo-section-desc">
            唯有 <code>cartItems</code> 需要作为状态存储。总件数、总金额、是否包邮等全部实时派生，保证数据永远绝对一致。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: selectedId === item.id ? "var(--color-primary-light)" : "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="radio"
                  name="selectedItem"
                  checked={selectedId === item.id}
                  onChange={() => setSelectedId(item.id)}
                  id={\`item-\${item.id}\`}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor={\`item-\${item.id}\`} style={{ cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                  {item.name}
                </label>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>单价: ¥{item.price.toFixed(2)}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, -1)}>
                  -
                </button>
                <span style={{ minWidth: "24px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
                  {item.count}
                </span>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, 1)}>
                  +
                </button>
                <span style={{ width: "80px", textAlign: "right", fontWeight: "700", color: "var(--color-danger)" }}>
                  ¥{(item.price * item.count).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 结算卡片 */}
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "var(--bg-surface-secondary)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              选中共 <strong>{totalCount}</strong> 件商品
            </span>
            <span style={{ margin: "0 8px", color: "var(--border-color)" }}>|</span>
            <span className={\`badge \${isFreeShipping ? "badge-green" : "badge-amber"}\`}>
              {isFreeShipping ? "已享满 ¥60 免费包邮" : \`满 ¥60 包邮 (还差 ¥\${(60 - totalPrice).toFixed(2)})\`}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "13px" }}>合计应付：</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--color-danger)" }}>
              ¥{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 案例 3：当前选中项详情展示 */}
        {selectedItem && (
          <div style={{ marginTop: "14px", padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>
              当前通过 <code>selectedId = {selectedId}</code> 动态查找的商品：
            </span>
            <span style={{ marginLeft: "8px", fontWeight: "600", color: "var(--color-primary)" }}>
              {selectedItem.name}（当前小计 ¥{(selectedItem.price * selectedItem.count).toFixed(2)}）
            </span>
          </div>
        )}
      </div>

      {/* 总结卡片 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 状态设计的黄金三问
        </div>
        <div>
          每次准备调用 <code>useState</code> 时，先问自己三个问题：
        </div>
        <div style={{ marginTop: "4px" }}>
          1. 该变量是否可以通过现有的 Props 或其他 State 计算出来？如果是，<strong>坚决不建 State</strong>。
        </div>
        <div>
          2. 该变量是否会随时间改变？如果永远不变，可以定义在组件外部或作为纯常量。
        </div>
        <div>
          3. 如果计算开销非常巨大（如几千条数据的复杂过滤），应该使用 <code>useMemo</code> 进行缓存，而不是退回使用 <code>useEffect + setState</code>！
        </div>
      </div>
    </div>
  );
}

export default StateDryDemo;
`,Ke=`import { useState } from "react";

// ==========================================
// 子组件 1：搜索输入框 (SearchBox)
// 只负责渲染输入框和派发更新事件，自身不存 query 状态
// ==========================================
function SearchBox({ value, onChange, onClear }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索技术栈（如 React, Vue, Vite...）"
        style={{ paddingRight: value ? "32px" : "12px" }}
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="清空搜索"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-subtle)",
            fontSize: "14px",
            padding: "2px",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ==========================================
// 子组件 2：统计摘要面板 (SearchSummary)
// 接收筛选后的匹配项数量和原始总数
// ==========================================
function SearchSummary({ matchCount, totalCount, query }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        background: "var(--bg-surface-secondary)",
        borderRadius: "var(--radius-sm)",
        fontSize: "13px",
      }}
    >
      <div>
        <span>共匹配到 </span>
        <strong style={{ color: matchCount > 0 ? "var(--color-primary)" : "var(--color-danger)" }}>
          {matchCount}
        </strong>
        <span> / {totalCount} 项</span>
      </div>
      {query && (
        <span className="badge badge-blue">
          当前过滤条件: &quot;{query}&quot;
        </span>
      )}
    </div>
  );
}

// ==========================================
// 子组件 3：结果列表 (FrameworkList)
// 接收过滤后的列表并高亮显示匹配文本
// ==========================================
function FrameworkList({ items, query, onSelectItem }) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-subtle)", fontSize: "14px" }}>
        🔍 未找到与 &quot;{query}&quot; 匹配的前端技术栈
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
      {items.map((item) => {
        // 简单高亮匹配字词
        const hasMatch = query && item.name.toLowerCase().includes(query.toLowerCase());

        return (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            style={{
              padding: "12px 14px",
              border: hasMatch ? "1px solid var(--color-primary-border)" : "1px solid var(--border-color)",
              backgroundColor: hasMatch ? "var(--color-primary-light)" : "var(--bg-surface)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "14px", color: hasMatch ? "var(--color-primary-dark)" : "var(--text-main)" }}>
                {item.name}
              </strong>
              <span className="badge badge-gray" style={{ fontSize: "10px" }}>
                {item.type}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-subtle)", marginTop: "4px" }}>
              {item.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 共同父组件：保存被提升的状态 (Lifted State)
// ==========================================
const INITIAL_FRAMEWORKS = [
  { id: 1, name: "React", type: "UI 库", desc: "构建 Web 与原生交互界面" },
  { id: 2, name: "Vue", type: "渐进式框架", desc: "易学易用、性能出色的 MVVM 框架" },
  { id: 3, name: "Angular", type: "综合平台", desc: "Google 出品的企业级全功能框架" },
  { id: 4, name: "Svelte", type: "编译器", desc: "将声明式代码编译为极小原生的 JS" },
  { id: 5, name: "Next.js", type: "全栈框架", desc: "React 生态服务端渲染利器" },
  { id: 6, name: "Vite", type: "构建工具", desc: "基于原生 ESM 的极速前端开发工具" },
];

export function LiftingStateUpDemo() {
  // 💡 状态被提升至此：query 状态由父级统领
  const [query, setQuery] = useState("");
  const [frameworks, setFrameworks] = useState(INITIAL_FRAMEWORKS);
  const [newFrameworkName, setNewFrameworkName] = useState("");
  const [selectedTech, setSelectedTech] = useState(null);

  // 派生计算：过滤出的列表
  const filteredList = frameworks.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()),
  );

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newFrameworkName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newFrameworkName.trim(),
      type: "自定义",
      desc: "用户动态添加的探索技术项",
    };
    setFrameworks((prev) => [newItem, ...prev]);
    setNewFrameworkName("");
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🪜</span> 状态提升（Lifting State Up）与兄弟协同
            </h2>
          </div>
          <span className="badge badge-blue">单向数据流核心</span>
        </div>
        <p className="demo-desc">
          在 React 中，兄弟组件之间<strong>无法直接横向传递状态</strong>。当两个或多个子组件需要反映相同的数据变化时，必须将该状态提升至它们的<strong>最近公共父组件</strong>中统一管理，并通过 Props 向下分发。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">受控输入 (Controlled Input)</span>
          <span className="badge badge-gray">最近共同祖先 (Closest Common Ancestor)</span>
          <span className="badge badge-gray">事件向上回传 (Event Callbacks)</span>
        </div>
      </div>

      {/* 数据流向架构图解 */}
      <div className="demo-alert demo-alert-info">
        <div className="demo-alert-title">
          <span>📐</span> 状态提升架构数据流向
        </div>
        <pre style={{ margin: "6px 0 0 0", fontSize: "12px", background: "#f8fafc", padding: "10px", borderRadius: "6px", overflowX: "auto" }}>
{\`       ┌────────────────────────────────────────────────────────┐
       │   公共父组件 LiftingStateUpDemo (持有 [query, setQuery])   │
       └──────────────────────────┬─────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ 传 value + onChange    │ 传 filteredList.length │ 传 filteredList
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 子组件 SearchBox │    │ 子组件 Summary   │    │ 子组件 List      │
└──────────────────┘    └──────────────────┘    └──────────────────┘\`}
        </pre>
      </div>

      {/* 交互实验区域 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 协同联动实验台
          </h3>
          <p className="demo-section-desc">
            在输入框键入关键词，观察输入框、统计卡片和结果列表三者如何实时协同：
          </p>
        </div>

        {/* 顶部搜索输入框 */}
        <div style={{ marginBottom: "14px" }}>
          <SearchBox value={query} onChange={setQuery} onClear={() => setQuery("")} />
        </div>

        {/* 搜索结果统计栏 */}
        <div style={{ marginBottom: "14px" }}>
          <SearchSummary matchCount={filteredList.length} totalCount={frameworks.length} query={query} />
        </div>

        {/* 列表渲染 */}
        <div style={{ marginBottom: "20px" }}>
          <FrameworkList items={filteredList} query={query} onSelectItem={setSelectedTech} />
        </div>

        {/* 选中项提示 */}
        {selectedTech && (
          <div style={{ padding: "12px 16px", background: "var(--color-primary-light)", border: "1px solid var(--color-primary-border)", borderRadius: "var(--radius-sm)", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span>当前选中的卡片：</span>
              <strong>{selectedTech.name}</strong> - {selectedTech.desc}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedTech(null)}>
              取消选中
            </button>
          </div>
        )}

        {/* 动态追加新项 */}
        <form onSubmit={handleAddNew} style={{ display: "flex", gap: "10px", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
          <input
            type="text"
            className="form-input"
            style={{ maxWidth: "240px" }}
            placeholder="添加新技术栈..."
            value={newFrameworkName}
            onChange={(e) => setNewFrameworkName(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">
            ➕ 添加到列表
          </button>
        </form>
      </div>

      {/* 总结提示 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 状态提升的最佳实践法则
        </div>
        <div>
          1. 寻找消费该状态的所有组件树节点。
        </div>
        <div>
          2. 找到它们在组件树中位置最低的<strong>共同父组件</strong>。
        </div>
        <div>
          3. 将状态与变更方法定义在共同父组件，向下通过 Props 传给子组件消费。
        </div>
      </div>
    </div>
  );
}

export default LiftingStateUpDemo;
`,qe=`import { useReducer } from "react";

// ==========================================
// 1. 初始状态定义
// ==========================================
const initialState = {
  count: 0,
  step: 1,
  history: [], // 记录状态变更轨迹，支持 Undo 撤销
};

// ==========================================
// 2. 纯函数 Reducer：集中管理所有状态转移逻辑
// 严禁在 Reducer 中触发副作用（如网络请求、计时器或直接修改全局对象）
// ==========================================
function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT": {
      const nextCount = state.count + state.step;
      return {
        ...state,
        count: nextCount,
        history: [{ type: \`+\${state.step}\`, from: state.count, to: nextCount, time: new Date().toLocaleTimeString() }, ...state.history.slice(0, 7)],
      };
    }

    case "DECREMENT": {
      const nextCount = state.count - state.step;
      return {
        ...state,
        count: nextCount,
        history: [{ type: \`-\${state.step}\`, from: state.count, to: nextCount, time: new Date().toLocaleTimeString() }, ...state.history.slice(0, 7)],
      };
    }

    case "SET_STEP": {
      return {
        ...state,
        step: action.payload,
      };
    }

    case "RESET": {
      return {
        ...state,
        count: 0,
        history: [{ type: "RESET", from: state.count, to: 0, time: new Date().toLocaleTimeString() }, ...state.history.slice(0, 7)],
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;
      const lastEntry = state.history[0];
      return {
        ...state,
        count: lastEntry.from,
        history: state.history.slice(1),
      };
    }

    default:
      // 未知 Action 抛出异常，防止静默 Bug
      throw new Error(\`未处理的 Action 类型: \${action.type}\`);
  }
}

export function StateReducerDemo() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>⚙️</span> 使用 Reducer 替换 State（useReducer 状态机模式）
            </h2>
          </div>
          <span className="badge badge-purple">架构级状态管理</span>
        </div>
        <p className="demo-desc">
          当一个组件的状态逻辑变得复杂（包含多个相互关联的子字段，或者下一个状态依赖于上一个状态的深层计算）时，将状态更新提取为<strong>外部纯函数 Reducer</strong> 能让逻辑清晰可测，并通过统一的 <code>dispatch(action)</code> 驱动变更。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">纯函数 Reducer</span>
          <span className="badge badge-gray">统一 Action 调度 (Dispatch)</span>
          <span className="badge badge-gray">时间旅行轨迹 (State History)</span>
        </div>
      </div>

      {/* 交互实验区域 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 状态机工作台
          </h3>
          <p className="demo-section-desc">
            点击操作按钮调度 Action，观察当前计数与历史记录流转：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 左侧：计数器主视图 */}
          <div style={{ padding: "20px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "12px", color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Current Value
              </div>
              <div style={{ fontSize: "48px", fontWeight: "800", color: state.count >= 0 ? "var(--color-primary)" : "var(--color-danger)" }}>
                {state.count}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                步长 (Step): <strong>{state.step}</strong>
              </div>
            </div>

            {/* 步长调节 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>修改步长：</span>
              {[1, 5, 10, 50].map((stepValue) => (
                <button
                  key={stepValue}
                  className={\`btn btn-sm \${state.step === stepValue ? "btn-primary" : "btn-secondary"}\`}
                  onClick={() => dispatch({ type: "SET_STEP", payload: stepValue })}
                >
                  ±{stepValue}
                </button>
              ))}
            </div>

            {/* 主操作按钮组 */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => dispatch({ type: "DECREMENT" })}
              >
                -{state.step}
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => dispatch({ type: "INCREMENT" })}
              >
                +{state.step}
              </button>
            </div>

            {/* 辅助按钮 */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => dispatch({ type: "UNDO" })}
                disabled={state.history.length === 0}
              >
                ↩️ 撤销一步 (Undo)
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => dispatch({ type: "RESET" })}
              >
                🔄 重置归零
              </button>
            </div>
          </div>

          {/* 右侧：Action 审计流与历史记录 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ margin: 0, fontSize: "14px", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Action 流转审计日志</span>
              <span className="badge badge-gray">{state.history.length} 条记录</span>
            </h4>

            {state.history.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-subtle)", background: "var(--bg-surface)", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                暂无变更记录，点击左侧按钮开始操作
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "240px", overflowY: "auto" }}>
                {state.history.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={\`badge \${item.type.startsWith("+") ? "badge-green" : item.type.startsWith("-") ? "badge-amber" : "badge-purple"}\`}>
                        {item.type}
                      </span>
                      <span>{item.from} ➔ {item.to}</span>
                    </div>
                    <span style={{ color: "var(--text-subtle)", fontSize: "11px" }}>{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 对比选型指南 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> useState 与 useReducer 选型指南
          </h3>
        </div>

        <div className="demo-grid-2">
          <div className="comparison-card" style={{ borderColor: "var(--border-color)" }}>
            <div className="comparison-header" style={{ color: "var(--color-primary)" }}>
              <span>🔹</span> 何时首选 useState？
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>单一基础数据类型（布尔值、字符串、数字）。</li>
              <li>组件逻辑简短，状态更新互不干涉。</li>
              <li>开发快速原型，没有深度的多步骤业务分支。</li>
            </ul>
          </div>

          <div className="comparison-card" style={{ borderColor: "var(--border-color)" }}>
            <div className="comparison-header" style={{ color: "var(--color-purple)" }}>
              <span>🔸</span> 何时首选 useReducer？
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>状态是一个包含多个关联字段的对象。</li>
              <li>下一个状态强依赖于上一个状态的历史快照。</li>
              <li>需要单测状态机逻辑（Reducer 可脱离 React 单独跑 Jest/Vitest 测试）。</li>
              <li>需要结合 Context 实现跨层级分发（参考下一个案例）。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StateReducerDemo;
`,Je=`import { createContext, useContext, useReducer, useRef, useEffect } from "react";

// ==========================================
// 1. 拆分为独立的两个 Context 通道
// ==========================================
// 通道 A：只负责传递变化频繁的状态 State
const TaskStateContext = createContext(null);
// 通道 B：只负责传递生命周期内引用恒定不变的 dispatch 函数
const TaskDispatchContext = createContext(null);

// ==========================================
// 2. Reducer 纯函数
// ==========================================
const initialTasks = [
  { id: 1, title: "学习 React 19 核心 API", done: true },
  { id: 2, title: "拆分 Context 双通道，规避无效重渲染", done: false },
  { id: 3, title: "消除全部 Oxlint 语法规范告警", done: false },
];

function taskReducer(tasks, action) {
  switch (action.type) {
    case "ADD":
      return [{ id: Date.now(), title: action.title, done: false }, ...tasks];
    case "TOGGLE":
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "DELETE":
      return tasks.filter((t) => t.id !== action.id);
    case "CLEAR_DONE":
      return tasks.filter((t) => !t.done);
    default:
      return tasks;
  }
}

// 内部安全 Hook（不导出以完全兼容 Fast Refresh）
function useTaskState() {
  const ctx = useContext(TaskStateContext);
  if (!ctx) throw new Error("useTaskState 必须在 TaskProvider 内使用");
  return ctx;
}

function useTaskDispatch() {
  const ctx = useContext(TaskDispatchContext);
  if (!ctx) throw new Error("useTaskDispatch 必须在 TaskProvider 内使用");
  return ctx;
}

// ==========================================
// 3. Provider 包装容器
// ==========================================
function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  return (
    <TaskStateContext.Provider value={tasks}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

// ==========================================
// 4. 消费组件 A：仅订阅 Dispatch 通道（写操作）
// 核心亮点：无论任务状态怎么变，由于 dispatch 引用永久稳定，本组件【绝对不会】触发重渲染！
// ==========================================
function AddTaskBar() {
  const dispatch = useTaskDispatch();
  const badgeElementRef = useRef(null);

  // 在副作用中更新 DOM 计数，严格遵守纯函数渲染阶段禁止操作 ref 规范
  useEffect(() => {
    if (badgeElementRef.current) {
      const count = (Number(badgeElementRef.current.dataset.renders) || 0) + 1;
      badgeElementRef.current.dataset.renders = String(count);
      badgeElementRef.current.textContent = \`⚡ 挂载/渲染次数：\${count} 次（保持恒定）\`;
    }
  });

  const handleQuickAdd = (text) => {
    dispatch({ type: "ADD", title: text });
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", color: "var(--text-main)" }}>
          组件 A：任务添加栏（只订阅 Dispatch 通道）
        </h4>
        <span ref={badgeElementRef} className="badge badge-green">
          ⚡ 挂载/渲染次数：1 次（保持恒定）
        </span>
      </div>

      <p style={{ margin: "0 0 10px 0", fontSize: "12.5px", color: "var(--text-muted)" }}>
        由于仅使用了 <code>useTaskDispatch()</code>，即便右侧任务列表不断增删，本组件依然 0 次多余重渲染！
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleQuickAdd("阅读 React Profiler 性能文档")}
        >
          ➕ 添加：阅读 React Profiler 文档
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleQuickAdd("编写自定义 Hook 并做好安全断言")}
        >
          ➕ 添加：编写安全 Hook
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => dispatch({ type: "CLEAR_DONE" })}
        >
          🧹 清理已完成
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. 消费组件 B：订阅 State 通道（读操作）
// 核心亮点：只有当任务数据真实变化时，才响应式重渲染
// ==========================================
function TaskList() {
  const tasks = useTaskState();
  const dispatch = useTaskDispatch();
  const badgeElementRef = useRef(null);

  // 在副作用中更新 DOM 计数
  useEffect(() => {
    if (badgeElementRef.current) {
      const count = (Number(badgeElementRef.current.dataset.renders) || 0) + 1;
      badgeElementRef.current.dataset.renders = String(count);
      badgeElementRef.current.textContent = \`🔄 渲染次数：\${count} 次（随 State 刷新）\`;
    }
  });

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", color: "var(--text-main)" }}>
          组件 B：任务列表视图（订阅 State 通道）
        </h4>
        <span ref={badgeElementRef} className="badge badge-amber">
          🔄 渲染次数：1 次（随 State 刷新）
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: task.done ? "var(--bg-surface-secondary)" : "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => dispatch({ type: "TOGGLE", id: task.id })}
                style={{ cursor: "pointer" }}
              />
              <span style={{ fontSize: "13.5px", textDecoration: task.done ? "line-through" : "none", color: task.done ? "var(--text-subtle)" : "var(--text-main)" }}>
                {task.title}
              </span>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => dispatch({ type: "DELETE", id: task.id })}
              style={{ padding: "2px 8px", fontSize: "11px" }}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UseReduceWithContextDemo() {
  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>⚡</span> Reducer + Context 双通道拆分与性能极致优化
            </h2>
          </div>
          <span className="badge badge-green">高级性能模式</span>
        </div>
        <p className="demo-desc">
          在传统 Context 架构中，一旦将 <code>&#123; state, dispatch &#125;</code> 混在一个 Provider 中向下传递，每次 state 变更都会导致整个子树所有订阅 Context 的组件无脑重新渲染。<strong>双通道拆分模式</strong> 将 State 与稳定的 Dispatch 彻底隔离，让写组件保持 0 无效重渲染。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">双通道架构 (Dual-Channel Context)</span>
          <span className="badge badge-gray">Dispatch 引用不变性 (Stable Identity)</span>
          <span className="badge badge-gray">按需精确定向重渲染 (Targeted Re-render)</span>
        </div>
      </div>

      {/* 原理对比卡片 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> 单通道 vs 双通道架构对比
          </h3>
        </div>

        <div className="demo-grid-2">
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 单通道（常见性能杀手）
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#fef2f2", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{\`// 🔴 只要 state 变了，对象引用更新
// 所有只想发送 dispatch 的按钮组件全部被迫重渲染！
<AppContext.Provider value={{ state, dispatch }}>
  <AddButton /> {/* 每次都白白重渲染！ */}
  <ListView />
</AppContext.Provider>\`}
            </pre>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 双通道拆分（工业级标准实践）
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#f0fdf4", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{\`// 🟢 dispatch 引用恒定不变
// 只消费 Dispatch 的组件永远不因数据更新而重渲染！
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    <AddButton /> {/* 始终保持 1 次渲染！ */}
    <ListView />
  </DispatchContext.Provider>
</StateContext.Provider>\`}
            </pre>
          </div>
        </div>
      </div>

      {/* 实时性能测试工作台 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔬</span> 实时渲染计数测试工作台
          </h3>
          <p className="demo-section-desc">
            点击下方组件 A 中的按钮添加或切换任务，注意观察顶部绿色的【组件 A 渲染次数】与橙色的【组件 B 渲染次数】：
          </p>
        </div>

        <TaskProvider>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AddTaskBar />
            <TaskList />
          </div>
        </TaskProvider>
      </div>

      {/* 总结提示 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 性能优化心智法则
        </div>
        <div>
          React 官方明确指出：<code>dispatch</code> 函数的引用在组件的整个生命周期中是<strong>完全稳定且永久不变的</strong>。因此，通过单独开辟 <code>DispatchContext</code>，所有只负责触发行为的组件（按钮、表单提交器、定时调度器）都不需要重渲染，无需编写任何复杂的 <code>React.memo</code>！
        </div>
      </div>
    </div>
  );
}

export default UseReduceWithContextDemo;
`,Ye=`import { useState, useRef, useLayoutEffect } from "react";

export function UseRefDemo() {
  // ==========================================
  // 场景 1：DOM 元素直接访问与控制
  // ==========================================
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [messages, setMessages] = useState([
    "欢迎来到 React 19 核心研讨室",
    "useRef 能够保存对底层 DOM 节点的直接引用",
  ]);
  const [newMessageText, setNewMessageText] = useState("");
  const isFirstRender = useRef(true);

  // 监听 messages 列表更新，并在 DOM 渲染后平滑滚至最底端
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    setMessages((prev) => [...prev, newMessageText.trim()]);
    setNewMessageText("");
    // 聚焦输入框
    inputRef.current?.focus();
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  // ==========================================
  // 场景 2：跨渲染周期持久化可变数据（不引发重渲染）
  // ==========================================
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // 💡 定时器句柄保存在 Ref 中，更新 timerId 绝对不会、也不需要引发组件重渲染！
  const timerIdRef = useRef(null);

  const startTimer = () => {
    if (timerIdRef.current !== null) return;
    setIsTimerRunning(true);
    timerIdRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimerSeconds(0);
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🎯</span> useRef 核心用法、DOM 控制与避坑守则
            </h2>
          </div>
          <span className="badge badge-purple">底层引用通道</span>
        </div>
        <p className="demo-desc">
          <code>useRef</code> 返回一个可变的 ref 对象，其 <code>.current</code> 属性在组件的整个生命周期内持久存在。它最核心的两大职责：<strong>直接操作底层 DOM 节点</strong>，以及<strong>跨渲染持久化任意可变值且不触发重渲染</strong>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">DOM 访问（Focus / Scroll / Measure）</span>
          <span className="badge badge-gray">不引发重渲染 (Silent Mutability)</span>
          <span className="badge badge-gray">纯函数渲染安全守则</span>
        </div>
      </div>

      {/* 场景 1：DOM 控制 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🖥️</span> 1. DOM 访问：主动聚焦与聊天室自动平滑触底
          </h3>
          <p className="demo-section-desc">
            通过 <code>ref=&#123;inputRef&#125;</code> 绑定真实 DOM，可在点击或发送后立即调用 <code>.focus()</code>，并在新消息到来时自动调用 <code>scrollTo</code>：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 聊天消息流 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                聊天消息窗口（总计 {messages.length} 条）
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleFocusInput}>
                🎯 主动聚焦输入框
              </button>
            </div>

            <div
              ref={chatBoxRef}
              style={{
                height: "160px",
                overflowY: "auto",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "10px",
                background: "var(--bg-surface-secondary)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 12px",
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "13px",
                    alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                    maxWidth: "85%",
                  }}
                >
                  {msg}
                </div>
              ))}
            </div>

            {/* 发送消息表单 */}
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <input
                ref={inputRef}
                type="text"
                className="form-input"
                placeholder="键入消息，回车发送..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                发送
              </button>
            </form>
          </div>

          {/* 场景 2：保存定时器 ID */}
          <div style={{ padding: "16px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "14px" }}>
                  2. 可变值存储：高精度秒表
                </h4>
                <span className={\`badge \${isTimerRunning ? "badge-green" : "badge-gray"}\`}>
                  {isTimerRunning ? "⏱️ 计时中 (Ref 持有句柄)" : "⏸️ 处于就绪状态"}
                </span>
              </div>
              <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                定时器的 <code>timerId</code> 是纯逻辑变量。如果保存在 <code>useState</code> 中，每次赋值都会造成无意义重渲染；保存在 <code>useRef</code> 中既能安全跨周期存活，又绝不造成多余渲染。
              </p>

              <div style={{ textAlign: "center", padding: "12px 0", fontSize: "36px", fontWeight: "800", color: isTimerRunning ? "var(--color-primary)" : "var(--text-muted)" }}>
                {timerSeconds}s
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {!isTimerRunning ? (
                <button className="btn btn-success btn-sm" onClick={startTimer}>
                  ▶️ 启动秒表
                </button>
              ) : (
                <button className="btn btn-warning btn-sm" onClick={stopTimer}>
                  ⏸️ 暂停秒表
                </button>
              )}
              <button className="btn btn-secondary btn-sm" onClick={resetTimer}>
                🔄 复位
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 核心禁忌守则 */}
      <div className="demo-alert demo-alert-danger">
        <div className="demo-alert-title">
          <span>⚠️</span> React 官方黄金禁忌守则：切勿在渲染阶段读写 ref.current！
        </div>
        <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
          不要在组件函数的顶层（即 JSX 返回期间）写入或读取 <code>ref.current</code>，例如 <code>ref.current = 123</code> 或 <code>&lt;p&gt;&#123;ref.current&#125;&lt;/p&gt;</code>！
          因为 React 的渲染阶段必须是一个<strong>无副作用的纯计算过程</strong>。在并发渲染（Concurrent Mode）下，React 可能会多次尝试渲染某个组件，在渲染期修改 Ref 会导致渲染逻辑不纯、不可重入，引发严重难以排查的竞态 Bug。
          <strong>仅在事件处理函数（onClick）或 useEffect / useLayoutEffect 回调中操作 Ref！</strong>
        </div>
      </div>
    </div>
  );
}

export default UseRefDemo;`,Xe=`import { useState, useEffect } from "react";

// 独立可挂载/卸载的子组件，用于直观展示 Setup 与 Cleanup 过程
function LiveWindowWatcher({ onLog }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      onLog("info", \`📐 窗口宽度变更为: \${window.innerWidth}px\`);
    };

    window.addEventListener("resize", handleResize);

    // 💡 极其关键的清理函数 (Cleanup)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onLog]);

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--color-primary-light)",
        border: "1px solid var(--color-primary-border)",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          实时视口宽度监听器：
        </span>
        <strong style={{ marginLeft: "8px", fontSize: "16px", color: "var(--color-primary)" }}>
          {windowWidth} px
        </strong>
      </div>
      <span className="badge badge-green">监听活跃中</span>
    </div>
  );
}

export function UseEffectCorrectUsageDemo() {
  const [showWatcher, setShowWatcher] = useState(true);
  const [logs, setLogs] = useState([
    { type: "info", text: "系统已就绪，准备演示 Effect 生命周期", time: new Date().toLocaleTimeString() },
  ]);

  // 控制台日志打印函数
  const addLog = (type, text) => {
    setLogs((prev) => [
      { type, text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  };

  const handleToggleWatcher = () => {
    setShowWatcher((prev) => {
      const next = !prev;
      if (next) {
        addLog("info", "🟢 [Setup 建立] 重新挂载组件并注册 window resize 监听器");
      } else {
        addLog("warn", "🧹 [Cleanup 清理] 卸载组件并触发 Cleanup 销毁监听器，杜绝内存泄漏！");
      }
      return next;
    });
  };

  // 场景 2：与 Document Title 浏览器外部系统同步
  const [pageTitleBadge, setPageTitleBadge] = useState(0);

  useEffect(() => {
    const originalTitle = document.title;
    if (pageTitleBadge > 0) {
      document.title = \`(\${pageTitleBadge}条未读) React 学习实验室\`;
    } else {
      document.title = "React 学习实验室";
    }

    // 页面卸载或变更时恢复
    return () => {
      document.title = originalTitle;
    };
  }, [pageTitleBadge]);

  const handleAddBadge = () => {
    setPageTitleBadge((c) => {
      const next = c + 1;
      addLog("info", \`🏷️ 同步外部 document.title: (\${next}条未读)\`);
      return next;
    });
  };

  const handleClearBadge = () => {
    setPageTitleBadge(0);
    addLog("info", "🏷️ 恢复外部 document.title: React 学习实验室");
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🔄</span> useEffect 正确用法、心智模型与清理函数 (Cleanup)
            </h2>
          </div>
          <span className="badge badge-green">外部系统同步</span>
        </div>
        <p className="demo-desc">
          <code>useEffect</code> 不是传统意义上的生命周期函数（如 componentDidMount），它的本质是：<strong>将组件与某个非 React 外部系统保持同步</strong>（例如：浏览器原生事件、WebSocket、第三方地图控件或定时器）。并且，<strong>每一个副作用都必须有始有终，提供完整的 Cleanup 清理函数</strong>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">外部系统同步 (External Sync)</span>
          <span className="badge badge-gray">清理函数 (Cleanup Return)</span>
          <span className="badge badge-gray">严格模式双重调用 (StrictMode Verification)</span>
        </div>
      </div>

      {/* 实验区域 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔬</span> 实验 1：外部浏览器监听与清理验证
          </h3>
          <p className="demo-section-desc">
            点击按钮挂载/卸载监听器组件，或者尝试缩放浏览器窗口，观察控制台清晰捕捉到的 Setup 与 Cleanup 执行时机：
          </p>
        </div>

        <div style={{ marginBottom: "14px", display: "flex", gap: "10px" }}>
          <button
            className={\`btn \${showWatcher ? "btn-danger" : "btn-success"}\`}
            onClick={handleToggleWatcher}
          >
            {showWatcher ? "❌ 卸载监听组件（触发 Cleanup）" : "➕ 挂载监听组件（触发 Setup）"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setLogs([])}
          >
            清空日志
          </button>
        </div>

        {/* 动态挂载的目标组件 */}
        {showWatcher ? (
          <div style={{ marginBottom: "16px" }}>
            <LiveWindowWatcher onLog={addLog} />
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              background: "var(--bg-surface-secondary)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-subtle)",
              fontSize: "13.5px",
              marginBottom: "16px",
            }}
          >
            组件已卸载，清理函数已将 window resize 监听器完全移除，不会造成任何残留！
          </div>
        )}

        {/* 实时模拟控制台 */}
        <div className="demo-console">
          <div className="demo-console-header">
            <span>TERMINAL OUTPUT / EFFECT LIFECYCLE LOGS</span>
            <span>{logs.length} 条记录</span>
          </div>
          {logs.map((log, index) => (
            <div key={index} className={\`demo-console-log \${log.type}\`}>
              [{log.time}] {log.text}
            </div>
          ))}
        </div>
      </div>

      {/* 实验 2：Document Title 同步 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🏷️</span> 实验 2：浏览器标头 Title 同步
          </h3>
          <p className="demo-section-desc">
            点击下方按钮调整未读消息数，观察浏览器标签页标题的即时同步：
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-primary btn-sm" onClick={handleAddBadge}>
            模拟收到未读通知 (+1)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleClearBadge}>
            标记全部已读 (清空)
          </button>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            当前未读数：<strong>{pageTitleBadge}</strong> 条
          </span>
        </div>
      </div>

      {/* 核心心智总结 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 为什么 React 19 严格模式在开发环境会执行两次 Effect？
        </div>
        <div>
          在 <code>StrictMode</code> 下，React 会故意挂载 ➔ 立即卸载 ➔ 再次挂载组件。
          这并非 Bug，而是 React 为你进行<strong>副作用健壮性测试</strong>：如果你的 Cleanup 函数写得不严谨（例如只开了 <code>setInterval</code> 或 <code>addEventListener</code> 却没有销毁），第二次执行就会暴露出重复监听或内存泄漏。
        </div>
      </div>
    </div>
  );
}

export default UseEffectCorrectUsageDemo;
`,Ze=`import { useState } from "react";

// ==========================================
// 场景 3 辅助子组件：通过 key 重置状态
// ==========================================
function CommentForm({ userId }) {
  // 💡 无需编写 useEffect([userId]) 去手动 setComment("")
  // 只要父级指定了 key={userId}，切换用户时 React 自动重置本组件及其初始 State！
  const [comment, setComment] = useState("");

  return (
    <div style={{ padding: "14px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
      <div style={{ fontSize: "13px", marginBottom: "8px" }}>
        给用户 <strong>{userId}</strong> 的留言板：
      </div>
      <input
        type="text"
        className="form-input"
        placeholder="写下留言..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div style={{ fontSize: "11px", color: "var(--text-subtle)", marginTop: "6px" }}>
        当前输入草稿: {comment || "（空）"}
      </div>
    </div>
  );
}

export function NotNeedEffectDemo() {
  // ==========================================
  // 场景 1：数据转换（过滤 + 排序）
  // ==========================================
  const rawProducts = [
    { id: 1, name: "MacBook Pro 16", category: "电脑", price: 19999 },
    { id: 2, name: "iPhone 16 Pro Max", category: "手机", price: 9999 },
    { id: 3, name: "iPad Pro M4", category: "平板", price: 8999 },
    { id: 4, name: "AirPods Pro 2", category: "配件", price: 1899 },
    { id: 5, name: "Apple Watch Ultra 2", category: "手表", price: 6499 },
  ];

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // ✅ 正确做法：直接在渲染期派生，无需 useEffect，无多余二次渲染
  const filteredProducts = rawProducts.filter((p) => {
    const matchCat = selectedCategory === "全部" || p.category === selectedCategory;
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  // ==========================================
  // 场景 2：用户事件处理（埋点 / 提示）
  // ==========================================
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [eventLogs, setEventLogs] = useState([]);

  const handleBuy = (productName) => {
    // ✅ 正确做法：业务交互与网络请求直接在 onClick 处理函数中触发！
    // 严禁使用 useEffect 监听 purchasedCount 去上报！
    setPurchasedCount((c) => c + 1);
    const log = \`用户主动点击购买了【\${productName}】，完成结算操作\`;
    setEventLogs((prev) => [log, ...prev.slice(0, 4)]);
  };

  // ==========================================
  // 场景 3：根据 Prop 重置状态
  // ==========================================
  const [activeUserId, setActiveUserId] = useState("User_A");

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🚫</span> 你可能不需要 Effect（官方避坑指南）
            </h2>
          </div>
          <span className="badge badge-amber">架构避坑</span>
        </div>
        <p className="demo-desc">
          很多开发者将 <code>useEffect</code> 当成了“数据联动触发器”。滥用 Effect 会引发严重的级联重渲染、难以追踪的时序竞态与闪烁。React 官方总结了三大最典型的“伪 Effect 场景”。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">误区 1：渲染期数据派生</span>
          <span className="badge badge-gray">误区 2：用户事件放入 Effect</span>
          <span className="badge badge-gray">误区 3：利用 key 替代重置 Effect</span>
        </div>
      </div>

      {/* 典型误区 1：转换渲染数据 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔍</span> 误区 1：用 Effect 过滤衍生数据（产生二次无谓渲染）
          </h3>
          <p className="demo-section-desc">
            错误做法是声明 <code>filteredList</code> 状态并在 Effect 中 <code>setFilteredList</code>。正确做法：直接在组件内计算！
          </p>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 反模式代码
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#fef2f2", borderRadius: "4px", fontSize: "11.5px", overflowX: "auto" }}>
{\`// 🔴 错误：数据流变卡顿且触发两次 Render
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(products.filter(p => ...));
}, [query, category]);\`}
            </pre>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 官方推荐写法
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#f0fdf4", borderRadius: "4px", fontSize: "11.5px", overflowX: "auto" }}>
{\`// 🟢 正确：纯计算，0 延迟，0 额外 state
const filtered = products.filter(p => {
  return matchCategory && matchQuery;
});\`}
            </pre>
          </div>
        </div>

        {/* 交互演示 */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-input"
            style={{ maxWidth: "200px" }}
            placeholder="搜索商品..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: "6px" }}>
            {["全部", "电脑", "手机", "平板", "配件", "手表"].map((cat) => (
              <button
                key={cat}
                className={\`btn btn-sm \${selectedCategory === cat ? "btn-primary" : "btn-secondary"}\`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "10px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-surface)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div>
                <strong style={{ fontSize: "13.5px" }}>{p.name}</strong>
                <div style={{ fontSize: "12px", color: "var(--text-subtle)", marginTop: "2px" }}>{p.category}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", color: "var(--color-danger)", fontSize: "14px" }}>
                  ¥{p.price}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleBuy(p.name)}
                >
                  购买
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 典型误区 2：用户事件 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🛒</span> 误区 2：在 Effect 中处理用户特定的事件（如购买通知、提交日志）
          </h3>
          <p className="demo-section-desc">
            Effect 是为了<strong>组件因为被展示而需要运行的代码</strong>。如果某段代码是因为<strong>用户点击了按钮</strong>而运行，它必须直接写在 Event Handler 内部！
          </p>
        </div>

        <div style={{ padding: "12px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontSize: "13px", marginBottom: "8px" }}>
            已购买件数：<strong>{purchasedCount}</strong>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            最近操作触发记录（直接由 onClick 调度）：
          </div>
          {eventLogs.length > 0 ? (
            <ul style={{ margin: "6px 0 0 0", paddingLeft: "20px", fontSize: "12.5px" }}>
              {eventLogs.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: "12px", color: "var(--text-subtle)", marginTop: "4px" }}>
              点击上方商品的“购买”按钮即可触发
            </div>
          )}
        </div>
      </div>

      {/* 典型误区 3：利用 key 重置状态 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔑</span> 误区 3：使用 Effect 监听 Props 改变来重置组件状态
          </h3>
          <p className="demo-section-desc">
            当用户 ID 切换时，需要重置输入草稿？切勿在 Effect 中调用 <code>setComment(&quot;&quot;)</code>，直接使用 <code>key=&#123;userId&#125;</code> 即可让 React 自动完全重新初始化：
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <button
            className={\`btn btn-sm \${activeUserId === "User_A" ? "btn-primary" : "btn-secondary"}\`}
            onClick={() => setActiveUserId("User_A")}
          >
            切换为用户 A (Alice)
          </button>
          <button
            className={\`btn btn-sm \${activeUserId === "User_B" ? "btn-primary" : "btn-secondary"}\`}
            onClick={() => setActiveUserId("User_B")}
          >
            切换为用户 B (Bob)
          </button>
        </div>

        {/* 关键：使用 key 让 React 优雅自动重置 */}
        <CommentForm key={activeUserId} userId={activeUserId} />
      </div>
    </div>
  );
}

export default NotNeedEffectDemo;
`,Qe=`import { useState, useEffect, useRef } from "react";

// ==========================================
// 1. 模拟外部 WebSocket 服务
// ==========================================
function connectChatSocket(roomId, onMessage) {
  let isClosed = false;
  let timerId = null;

  // 模拟周期性接收消息
  const startEmitting = () => {
    timerId = setInterval(() => {
      if (!isClosed) {
        onMessage({
          id: Date.now(),
          text: \`[来自房间 #\${roomId} 的实时消息] 当前在线人数: \${Math.floor(Math.random() * 20 + 5)}\`,
          time: new Date().toLocaleTimeString(),
        });
      }
    }, 2500);
  };

  startEmitting();

  return {
    close: () => {
      isClosed = true;
      if (timerId) clearInterval(timerId);
    },
  };
}

export function LifecycleOfReactiveEffectsDemo() {
  const [roomId, setRoomId] = useState("101");
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [lifecycleLogs, setLifecycleLogs] = useState([
    { type: "success", text: "🟢 [Effect 建立同步] 已建立与房间 #101 的 Socket 通讯", time: new Date().toLocaleTimeString() },
  ]);

  const addLog = (type, text) => {
    setLifecycleLogs((prev) => [
      { type, text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  };

  // 💡 技巧 1：用 Ref 追踪最新的 isMuted 状态
  // 核心收益：在消息回调中读取最新静音状态，而无需将 isMuted 列入 Effect 依赖项！
  // 切换静音绝对不会中断/重启昂贵的 WebSocket 连接！
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      addLog("info", \`🔔 静音状态变更为: \${next ? "已开启静音（仅接收不发声）" : "已关闭静音"}\`);
      return next;
    });
  };

  const handleSwitchRoom = (nextRoom) => {
    if (nextRoom === roomId) return;
    addLog("error", \`🔴 [Effect 停止同步] 触发 Cleanup，安全关闭房间 #\${roomId} 的 Socket 连接\`);
    addLog("success", \`🟢 [Effect 重新同步] 正在建立与房间 #\${nextRoom} 的新 Socket 连接...\`);
    setRoomId(nextRoom);
    setMessages([]);
  };

  // ==========================================
  // 核心响应式 Effect：同步房间 Socket
  // ==========================================
  useEffect(() => {
    const socket = connectChatSocket(roomId, (newMessage) => {
      // 💡 技巧 2：使用函数式更新 setMessages(prev => ...)，成功解除对 messages 的闭包依赖！
      setMessages((prev) => [newMessage, ...prev.slice(0, 7)]);

      // 读取 Ref 中的最新配置，破除闭包陈旧陷阱
      if (!isMutedRef.current) {
        addLog("info", \`📩 收到新消息并播放提示音: \${newMessage.text}\`);
      } else {
        addLog("warn", \`🔕 [静音屏蔽] 收到消息但不播放提示音\`);
      }
    });

    // 💡 核心：精确的清理函数
    return () => {
      socket.close();
    };
  }, [roomId]); // 仅依赖响应式值 roomId！极度干净稳定！

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🌐</span> 响应式 Effect 的生命周期与依赖解耦
            </h2>
          </div>
          <span className="badge badge-purple">深度核心</span>
        </div>
        <p className="demo-desc">
          组件中的每个 Effect 都有<strong>独立的生命周期</strong>：它会随着依赖项的变化，经历多次<strong>“停止同步（Cleanup）➔ 重新同步（Setup）”</strong>。通过函数式更新与 Ref 解耦非响应式逻辑，可避免因无关状态变化反复销毁重建昂贵连接。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">响应式值（Reactive Values）</span>
          <span className="badge badge-gray">函数式更新解耦（Functional Updates）</span>
          <span className="badge badge-gray">Ref 穿透闭包陷阱</span>
        </div>
      </div>

      {/* 控制台与模拟器 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 实时聊天室连接模拟器
          </h3>
          <p className="demo-section-desc">
            切换房间（触发断开重连）与切换静音（不重连只更新 Ref），观察终端中精准的生命周期事件：
          </p>
        </div>

        {/* 控制条 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px", padding: "12px 16px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>切换当前房间：</span>
            {["101", "102", "103"].map((id) => (
              <button
                key={id}
                className={\`btn btn-sm \${roomId === id ? "btn-primary" : "btn-secondary"}\`}
                onClick={() => handleSwitchRoom(id)}
              >
                房间 #{id}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className={\`btn btn-sm \${isMuted ? "btn-warning" : "btn-outline"}\`}
              onClick={handleToggleMute}
            >
              {isMuted ? "🔕 当前已静音（点击解除）" : "🔔 开启静音（点击静音）"}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setLifecycleLogs([])}>
              清空日志
            </button>
          </div>
        </div>

        <div className="demo-grid-2">
          {/* 左侧：收到的实时消息 */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>
              房间 #{roomId} 实时消息通道
            </div>
            <div
              style={{
                height: "220px",
                overflowY: "auto",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "10px",
                background: "var(--bg-surface)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-subtle)", fontSize: "13px" }}>
                  正在等待房间 #{roomId} 的广播消息...
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-secondary)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12.5px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-subtle)", fontSize: "11px", marginBottom: "3px" }}>
                      <span>{m.time}</span>
                      <span>#{roomId}</span>
                    </div>
                    <div>{m.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 右侧：生命周期控制台 */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>
              Effect 运行时生命周期链路追踪
            </div>
            <div className="demo-console" style={{ height: "220px", maxHeight: "220px" }}>
              <div className="demo-console-header">
                <span>SOCKET LIFECYCLE MONITOR</span>
                <span>{lifecycleLogs.length} 条追踪</span>
              </div>
              {lifecycleLogs.map((log, index) => (
                <div key={index} className={\`demo-console-log \${log.type}\`}>
                  [{log.time}] {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 核心秘籍总结 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 依赖项优化两大杀手锏
        </div>
        <div>
          1. <strong>避免在 Effect 中读取 state 来计算下一个 state</strong>：使用 <code>setMessages(prev =&gt; [...prev, msg])</code>，这样 Effect 就不需要将 <code>messages</code> 放入依赖项数组，规避死循环。
        </div>
        <div>
          2. <strong>使用 Ref 隔离非响应式逻辑</strong>：例如这里的 <code>isMuted</code>。我们只想在收到消息时获取它的最新值，而不想在用户切换静音时重新建立 WebSocket 连接。用 Ref 保存最新值是完美破除“闭包陈旧”与“无效重启”的标准方案。
        </div>
      </div>
    </div>
  );
}

export default LifecycleOfReactiveEffectsDemo;
`,$e=[{id:`components`,name:`组件通信与插槽`,icon:`🧩`},{id:`state`,name:`状态管理与演进`,icon:`⚡`},{id:`effects`,name:`Hooks 与副作用深度`,icon:`🎣`}],et=[{id:`props`,label:`Props 基础与解构`,category:`components`,badge:`基础`,description:`单向只读数据流、对象解构默认值回退、展开语法与派生计算`,Component:v,files:[{name:`PropsBasicsDemo.jsx`,code:Fe},{name:`UserCard.jsx`,code:Ie},{name:`ProductCard.jsx`,code:Le}]},{id:`children`,label:`Children 默认插槽`,category:`components`,badge:`组合`,description:`React 组合模式（Composition），容器布局与可插拔子节点解耦`,Component:x,files:[{name:`ChildrenSlotDemo.jsx`,code:Re},{name:`CardContainer.jsx`,code:ze},{name:`ModalLayout.jsx`,code:Be}]},{id:`multi-slots`,label:`具名多插槽客制化`,category:`components`,badge:`规范`,description:`生产级多插槽三态协议（默认模板 + 局部覆盖 + 显式隐藏）`,Component:w,files:[{name:`MultiSlotsDemo.jsx`,code:Ve},{name:`ProductionModal.jsx`,code:He},{name:`Pannel.jsx`,code:Ue}]},{id:`prop-drilling`,label:`属性逐层透传解法`,category:`components`,badge:`解耦`,description:`对比逐层透传 (Drilling)、组件组合 (Children) 与 Context API`,Component:E,files:[{name:`PropDrillingDemo.jsx`,code:We}]},{id:`state-dry`,label:`状态干净原则 (DRY)`,category:`state`,badge:`核心`,description:`避免在 State 中冗余存储计算值，单一数据源与衍生状态实践`,Component:de,files:[{name:`StateDryDemo.jsx`,code:Ge}]},{id:`lifting-state-up`,label:`状态提升与协同联动`,category:`state`,badge:`协同`,description:`兄弟组件状态共享、受控输入与向最近共同祖先提升`,Component:O,files:[{name:`LiftingStateUpDemo.jsx`,code:Ke}]},{id:`state-reducer`,label:`useReducer 状态机模式`,category:`state`,badge:`架构`,description:`将更新逻辑集中为纯函数 Reducer，规范复杂状态与行为审计`,Component:_e,files:[{name:`StateReducerDemo.jsx`,code:qe}]},{id:`use-reduce-with-context`,label:`Reducer + Context 双通道优化`,category:`state`,badge:`进阶`,description:`拆分 State 与 Dispatch 独立上下文，彻底规避无效重新渲染`,Component:De,files:[{name:`UseReduceWithContextDemo.jsx`,code:Je}]},{id:`use-ref`,label:`useRef 引用与 DOM 控制`,category:`effects`,badge:`引用`,description:`DOM 访问、可变值持久化与纯函数渲染期的引用安全守则`,Component:Oe,files:[{name:`UseRefDemo.jsx`,code:Ye}]},{id:`use-effect-correct-usage`,label:`useEffect 正确用法与心智`,category:`effects`,badge:`同步`,description:`与外部系统同步、定时器与事件监听的清理函数 (Cleanup) 闭环`,Component:Ae,files:[{name:`UseEffectCorrectUsageDemo.jsx`,code:Xe}]},{id:`not-need-effect`,label:`无需 Effect 的常见反模式`,category:`effects`,badge:`避坑`,description:`官方避坑指南：衍生数据计算、用户事件触发与依赖同步陷阱`,Component:Me,files:[{name:`NotNeedEffectDemo.jsx`,code:Ze}]},{id:`lifecycle-of-reactive-effects`,label:`响应式 Effect 生命周期与依赖`,category:`effects`,badge:`深度`,description:`响应式值追踪、依赖闭环、使用 Ref 与函数式更新解耦依赖`,Component:Pe,files:[{name:`LifecycleOfReactiveEffectsDemo.jsx`,code:Qe}]}],tt=`modulepreload`,nt=function(e){return`/`+e},rt={},it=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=nt(t,n),t=s(t),t in rt)return;rt[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:tt,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},at=(0,d.lazy)(()=>it(()=>import(`./CodeViewer-ClxsTJZd.js`),[]));function ot(){let[e,t]=(0,d.useState)(et[0]?.id||`props`),[n,r]=(0,d.useState)(`focused`),[i,a]=(0,d.useState)(``),[o,s]=(0,d.useState)(!1),c=(0,d.useMemo)(()=>{if(!i.trim())return et;let e=i.toLowerCase();return et.filter(t=>t.label.toLowerCase().includes(e)||t.id.toLowerCase().includes(e)||t.description?.toLowerCase().includes(e)||t.badge?.toLowerCase().includes(e))},[i]),l=(0,d.useMemo)(()=>$e.map(e=>{let t=c.filter(t=>t.category===e.id);return{...e,items:t}}).filter(e=>e.items.length>0),[c]),u=(0,d.useMemo)(()=>et.find(t=>t.id===e)||et[0],[e]),f=(0,d.useMemo)(()=>$e.find(e=>e.id===u?.category),[u]),p=e=>{t(e),r(`focused`),s(!1),window.scrollTo({top:0,behavior:`smooth`})};return(0,h.jsxs)(`div`,{className:`app-shell`,children:[o&&(0,h.jsx)(`div`,{style:{position:`fixed`,inset:0,background:`rgba(15, 23, 42, 0.4)`,zIndex:45,backdropFilter:`blur(2px)`},onClick:()=>s(!1)}),(0,h.jsxs)(`aside`,{className:`app-sidebar ${o?`open`:``}`,children:[(0,h.jsxs)(`div`,{className:`sidebar-header`,children:[(0,h.jsxs)(`div`,{className:`brand-wrapper`,children:[(0,h.jsx)(`div`,{className:`brand-icon`,children:`⚛️`}),(0,h.jsx)(`div`,{children:(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,h.jsx)(`h1`,{className:`brand-title`,children:`React 核心实验室`}),(0,h.jsx)(`span`,{className:`brand-badge`,children:`React 19`})]})})]}),(0,h.jsx)(`p`,{className:`brand-desc`,children:`系统级进阶实践：组件组合、状态模式、Context 优化与副作用闭环`}),(0,h.jsxs)(`div`,{className:`sidebar-search-box`,children:[(0,h.jsx)(`span`,{className:`sidebar-search-icon`,children:`🔍`}),(0,h.jsx)(`input`,{type:`text`,className:`sidebar-search-input`,placeholder:`搜索知识点或关键词...`,value:i,onChange:e=>a(e.target.value)})]})]}),(0,h.jsxs)(`nav`,{className:`sidebar-content`,children:[(0,h.jsxs)(`button`,{className:`all-overview-btn ${n===`all`?`active`:``}`,onClick:()=>{r(`all`),s(!1),window.scrollTo({top:0,behavior:`smooth`})},children:[(0,h.jsx)(`span`,{children:`🌟`}),(0,h.jsx)(`span`,{children:`全部功能完整总览`}),(0,h.jsxs)(`span`,{className:`nav-item-badge`,children:[et.length,` 篇`]})]}),l.map(t=>(0,h.jsxs)(`div`,{className:`category-group`,children:[(0,h.jsxs)(`div`,{className:`category-group-header`,children:[(0,h.jsxs)(`span`,{className:`category-group-title`,children:[(0,h.jsx)(`span`,{children:t.icon}),(0,h.jsx)(`span`,{children:t.name})]}),(0,h.jsx)(`span`,{className:`category-count`,children:t.items.length})]}),t.items.map(t=>{let r=n===`focused`&&e===t.id;return(0,h.jsxs)(`button`,{className:`nav-item ${r?`active`:``}`,onClick:()=>p(t.id),title:t.description,children:[(0,h.jsx)(`span`,{style:{overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:t.label}),t.badge&&(0,h.jsx)(`span`,{className:`nav-item-badge`,children:t.badge})]},t.id)})]},t.id)),l.length===0&&(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`32px 16px`,color:`var(--text-subtle)`,fontSize:`13px`},children:[`未找到匹配 “`,i,`” 的内容`]})]}),(0,h.jsxs)(`div`,{className:`sidebar-footer`,children:[(0,h.jsxs)(`span`,{children:[`共收录 `,et.length,` 个核心模式`]}),(0,h.jsx)(`span`,{children:`⚡ Vite + Oxlint`})]})]}),(0,h.jsxs)(`div`,{className:`app-main`,children:[(0,h.jsxs)(`header`,{className:`top-bar`,children:[(0,h.jsxs)(`div`,{className:`top-bar-left`,children:[(0,h.jsx)(`button`,{className:`mobile-menu-toggle`,onClick:()=>s(e=>!e),"aria-label":`打开侧边导航`,children:`☰`}),(0,h.jsxs)(`div`,{className:`breadcrumb-nav`,children:[(0,h.jsx)(`span`,{className:`breadcrumb-category`,children:n===`all`?`总览模式`:f?.name||`核心实验`}),(0,h.jsx)(`span`,{className:`breadcrumb-sep`,children:`/`}),(0,h.jsx)(`span`,{className:`breadcrumb-current`,children:n===`all`?`全部知识点看板`:u?.label})]})]}),(0,h.jsx)(`div`,{className:`top-bar-right`,children:(0,h.jsxs)(`div`,{className:`view-mode-pill`,children:[(0,h.jsx)(`button`,{className:`view-mode-btn ${n===`focused`?`active`:``}`,onClick:()=>r(`focused`),children:`单篇聚焦`}),(0,h.jsx)(`button`,{className:`view-mode-btn ${n===`all`?`active`:``}`,onClick:()=>r(`all`),children:`连续阅读`})]})})]}),(0,h.jsx)(`main`,{className:`app-content`,children:n===`focused`?u?(0,h.jsxs)(`div`,{className:`demo-page`,children:[(0,h.jsx)(u.Component,{}),(0,h.jsx)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`code-accordion-wrapper`,style:{padding:`12px 18px`,color:`var(--text-subtle)`,fontSize:`12.5px`},children:`⚡ 载入代码视图...`}),children:(0,h.jsx)(at,{files:u.files,fileName:`${u.id}.jsx`})})]},u.id):null:(0,h.jsx)(`div`,{className:`demo-all-container`,children:et.map((e,t)=>(0,h.jsxs)(`div`,{id:`demo-${e.id}`,children:[t>0&&(0,h.jsx)(`hr`,{className:`demo-divider`}),(0,h.jsxs)(`div`,{style:{marginBottom:`16px`,display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsxs)(`span`,{className:`badge badge-blue`,children:[`案例 `,t+1]}),(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`,color:`var(--text-main)`},children:e.label}),(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-subtle)`},children:[`#`,e.id]})]}),(0,h.jsx)(e.Component,{}),(0,h.jsx)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`code-accordion-wrapper`,style:{padding:`12px 18px`,color:`var(--text-subtle)`,fontSize:`12.5px`},children:`⚡ 载入代码视图...`}),children:(0,h.jsx)(at,{files:e.files,fileName:`${e.id}.jsx`})})]},e.id))})})]})]})}var st=16.67,ct=new Map;function lt(e){return Number(e.toFixed(2))}function ut(e,t,n,r,i,a){let o=lt(n),s=ct.get(e)??{renderCount:0,mountCount:0,updateCount:0,slowRenderCount:0,totalActualDuration:0,maxActualDuration:0},c={phase:t,actualDuration:o,baseDuration:lt(r),startTime:lt(i),commitTime:lt(a),commitDelay:lt(Math.max(0,a-i))},l={renderCount:s.renderCount+1,mountCount:s.mountCount+ +(t===`mount`),updateCount:s.updateCount+(t===`mount`?0:1),slowRenderCount:s.slowRenderCount+ +(n>st),totalActualDuration:lt(s.totalActualDuration+n),maxActualDuration:Math.max(s.maxActualDuration,o),lastRender:c};ct.set(e,l)}(0,f.createRoot)(document.getElementById(`root`)).render((0,h.jsx)(d.StrictMode,{children:(0,h.jsx)(d.Profiler,{id:`AppProfiler`,onRender:ut,children:(0,h.jsx)(ot,{})})}));export{i as n,n as r,m as t};