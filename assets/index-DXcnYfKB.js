var e=Object.defineProperty,t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),n=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r=t((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var ee=Array.isArray;function S(){}var C={H:null,A:null,T:null,S:null},te=Object.prototype.hasOwnProperty;function ne(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function re(e,t){return ne(e.type,t,e.props)}function w(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ie(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var ae=/\/+/g;function oe(e,t){return typeof e==`object`&&e&&e.key!=null?ie(``+e.key):t.toString(36)}function se(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(S,S):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ce(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ce(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+oe(e,0):a,ee(o)?(i=``,c!=null&&(i=c.replace(ae,`$&/`)+`/`),ce(o,r,i,``,function(e){return e})):o!=null&&(w(o)&&(o=re(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(ae,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(ee(e))for(var u=0;u<e.length;u++)a=e[u],s=l+oe(a,u),c+=ce(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+oe(a,u++),c+=ce(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ce(se(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function le(e,t,n){if(e==null)return e;var r=[],i=0;return ce(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ue(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var T=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},E={map:le,forEach:function(e,t,n){le(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return le(e,function(){t++}),t},toArray:function(e){return le(e,function(e){return e})||[]},only:function(e){if(!w(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=E,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=C,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return C.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!te.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return ne(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)te.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return ne(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=w,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ue}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=C.T,n={};C.T=n;try{var r=e(),i=C.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(S,T)}catch(e){T(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),C.T=t}},e.unstable_useCacheRefresh=function(){return C.H.useCacheRefresh()},e.use=function(e){return C.H.use(e)},e.useActionState=function(e,t,n){return C.H.useActionState(e,t,n)},e.useCallback=function(e,t){return C.H.useCallback(e,t)},e.useContext=function(e){return C.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return C.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return C.H.useEffect(e,t)},e.useEffectEvent=function(e){return C.H.useEffectEvent(e)},e.useId=function(){return C.H.useId()},e.useImperativeHandle=function(e,t,n){return C.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return C.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return C.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return C.H.useMemo(e,t)},e.useOptimistic=function(e,t){return C.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return C.H.useReducer(e,t,n)},e.useRef=function(e){return C.H.useRef(e)},e.useState=function(e){return C.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return C.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return C.H.useTransition()},e.version=`19.2.8`})),i=t(((e,t)=>{t.exports=r()})),a=t((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,ee||(ee=!0,w());else{var t=n(l);t!==null&&oe(x,t.startTime-e)}}}var ee=!1,S=-1,C=5,te=-1;function ne(){return g?!0:!(e.unstable_now()-te<C)}function re(){if(g=!1,ee){var t=e.unstable_now();te=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(S),S=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&ne());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&oe(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?w():ee=!1}}}var w;if(typeof y==`function`)w=function(){y(re)};else if(typeof MessageChannel<`u`){var ie=new MessageChannel,ae=ie.port2;ie.port1.onmessage=re,w=function(){ae.postMessage(null)}}else w=function(){_(re,0)};function oe(t,n){S=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):C=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(S),S=-1):h=!0,oe(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,ee||(ee=!0,w()))),r},e.unstable_shouldYield=ne,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),o=t(((e,t)=>{t.exports=a()})),s=t((e=>{var t=i();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var a={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},o=Symbol.for(`react.portal`);function s(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var c=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function l(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=a,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return s(e,t,null,r)},e.flushSync=function(e){var t=c.T,n=a.p;try{if(c.T=null,a.p=2,e)return e()}finally{c.T=t,a.p=n,a.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,a.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&a.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=l(n,t.crossOrigin),i=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?a.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:i,fetchPriority:o}):n===`script`&&a.d.X(e,{crossOrigin:r,integrity:i,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=l(t.as,t.crossOrigin);a.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??a.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=l(n,t.crossOrigin);a.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=l(t.as,t.crossOrigin);a.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else a.d.m(e)}},e.requestFormReset=function(e){a.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return c.H.useFormState(e,t,n)},e.useFormStatus=function(){return c.H.useHostTransitionStatus()},e.version=`19.2.8`})),c=t(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=s()})),l=t((e=>{var t=o(),n=i(),r=c();function a(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function s(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function l(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function u(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function d(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function f(e){if(l(e)!==e)throw Error(a(188))}function p(e){var t=e.alternate;if(!t){if(t=l(e),t===null)throw Error(a(188));return t===e?e:null}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var o=i.alternate;if(o===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===o.child){for(o=i.child;o;){if(o===n)return f(i),e;if(o===r)return f(i),t;o=o.sibling}throw Error(a(188))}if(n.return!==r.return)n=i,r=o;else{for(var s=!1,c=i.child;c;){if(c===n){s=!0,n=i,r=o;break}if(c===r){s=!0,r=i,n=o;break}c=c.sibling}if(!s){for(c=o.child;c;){if(c===n){s=!0,n=o,r=i;break}if(c===r){s=!0,r=o,n=i;break}c=c.sibling}if(!s)throw Error(a(189))}}if(n.alternate!==r)throw Error(a(190))}if(n.tag!==3)throw Error(a(188));return n.stateNode.current===n?e:t}function m(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=m(e),t!==null)return t;e=e.sibling}return null}var h=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),ee=Symbol.for(`react.consumer`),S=Symbol.for(`react.context`),C=Symbol.for(`react.forward_ref`),te=Symbol.for(`react.suspense`),ne=Symbol.for(`react.suspense_list`),re=Symbol.for(`react.memo`),w=Symbol.for(`react.lazy`),ie=Symbol.for(`react.activity`),ae=Symbol.for(`react.memo_cache_sentinel`),oe=Symbol.iterator;function se(e){return typeof e!=`object`||!e?null:(e=oe&&e[oe]||e[`@@iterator`],typeof e==`function`?e:null)}var ce=Symbol.for(`react.client.reference`);function le(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ce?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case te:return`Suspense`;case ne:return`SuspenseList`;case ie:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case S:return e.displayName||`Context`;case ee:return(e._context.displayName||`Context`)+`.Consumer`;case C:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case re:return t=e.displayName||null,t===null?le(e.type)||`Memo`:t;case w:t=e._payload,e=e._init;try{return le(e(t))}catch{}}return null}var ue=Array.isArray,T=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,E=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,de={pending:!1,data:null,method:null,action:null},fe=[],pe=-1;function me(e){return{current:e}}function D(e){0>pe||(e.current=fe[pe],fe[pe]=null,pe--)}function O(e,t){pe++,fe[pe]=e.current,e.current=t}var he=me(null),ge=me(null),_e=me(null),ve=me(null);function ye(e,t){switch(O(_e,t),O(ge,e),O(he,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}D(he),O(he,e)}function be(){D(he),D(ge),D(_e)}function xe(e){e.memoizedState!==null&&O(ve,e);var t=he.current,n=Hd(t,e.type);t!==n&&(O(ge,e),O(he,n))}function Se(e){ge.current===e&&(D(he),D(ge)),ve.current===e&&(D(ve),Qf._currentValue=de)}var Ce,we;function Te(e){if(Ce===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Ce=t&&t[1]||``,we=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Ce+e+we}var Ee=!1;function De(e,t){if(!e||Ee)return``;Ee=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Ee=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Te(n):``}function Oe(e,t){switch(e.tag){case 26:case 27:case 5:return Te(e.type);case 16:return Te(`Lazy`);case 13:return e.child!==t&&t!==null?Te(`Suspense Fallback`):Te(`Suspense`);case 19:return Te(`SuspenseList`);case 0:case 15:return De(e.type,!1);case 11:return De(e.type.render,!1);case 1:return De(e.type,!0);case 31:return Te(`Activity`);default:return``}}function ke(e){try{var t=``,n=null;do t+=Oe(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Ae=Object.prototype.hasOwnProperty,je=t.unstable_scheduleCallback,Me=t.unstable_cancelCallback,Ne=t.unstable_shouldYield,Pe=t.unstable_requestPaint,Fe=t.unstable_now,Ie=t.unstable_getCurrentPriorityLevel,Le=t.unstable_ImmediatePriority,Re=t.unstable_UserBlockingPriority,ze=t.unstable_NormalPriority,Be=t.unstable_LowPriority,Ve=t.unstable_IdlePriority,He=t.log,Ue=t.unstable_setDisableYieldValue,We=null,Ge=null;function Ke(e){if(typeof He==`function`&&Ue(e),Ge&&typeof Ge.setStrictMode==`function`)try{Ge.setStrictMode(We,e)}catch{}}var qe=Math.clz32?Math.clz32:Xe,Je=Math.log,Ye=Math.LN2;function Xe(e){return e>>>=0,e===0?32:31-(Je(e)/Ye|0)|0}var Ze=256,Qe=262144,$e=4194304;function et(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function tt(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=et(n))):i=et(o):i=et(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=et(n))):i=et(o)):i=et(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function nt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function rt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function it(){var e=$e;return $e<<=1,!($e&62914560)&&($e=4194304),e}function at(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ot(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function st(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-qe(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ct(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ct(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-qe(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function lt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-qe(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function ut(e,t){var n=t&-t;return n=n&42?1:dt(n),(n&(e.suspendedLanes|t))===0?n:0}function dt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ft(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function pt(){var e=E.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function mt(e,t){var n=E.p;try{return E.p=e,t()}finally{E.p=n}}var ht=Math.random().toString(36).slice(2),gt=`__reactFiber$`+ht,_t=`__reactProps$`+ht,vt=`__reactContainer$`+ht,yt=`__reactEvents$`+ht,bt=`__reactListeners$`+ht,xt=`__reactHandles$`+ht,St=`__reactResources$`+ht,Ct=`__reactMarker$`+ht;function wt(e){delete e[gt],delete e[_t],delete e[yt],delete e[bt],delete e[xt]}function Tt(e){var t=e[gt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[vt]||n[gt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[gt])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function Et(e){if(e=e[gt]||e[vt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Dt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(a(33))}function Ot(e){var t=e[St];return t||=e[St]={hoistableStyles:new Map,hoistableScripts:new Map},t}function k(e){e[Ct]=!0}var kt=new Set,At={};function jt(e,t){Mt(e,t),Mt(e+`Capture`,t)}function Mt(e,t){for(At[e]=t,e=0;e<t.length;e++)kt.add(t[e])}var Nt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Pt={},Ft={};function It(e){return Ae.call(Ft,e)?!0:Ae.call(Pt,e)?!1:Nt.test(e)?Ft[e]=!0:(Pt[e]=!0,!1)}function Lt(e,t,n){if(It(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}}function Rt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function zt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function Bt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Vt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Ht(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ut(e){if(!e._valueTracker){var t=Vt(e)?`checked`:`value`;e._valueTracker=Ht(e,t,``+e[t])}}function Wt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Vt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}function Gt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Kt=/[\n"\\]/g;function qt(e){return e.replace(Kt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Jt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Bt(t)):e.value!==``+Bt(t)&&(e.value=``+Bt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Xt(e,o,Bt(n)):Xt(e,o,Bt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Bt(s):e.removeAttribute(`name`)}function Yt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ut(e);return}n=n==null?``:``+Bt(n),t=t==null?n:``+Bt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ut(e)}function Xt(e,t,n){t===`number`&&Gt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Zt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Bt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Qt(e,t,n){if(t!=null&&(t=``+Bt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+Bt(n)}function $t(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(a(92));if(ue(r)){if(1<r.length)throw Error(a(93));r=r[0]}n=r}n??=``,t=n}n=Bt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ut(e)}function en(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var tn=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function nn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||tn.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function rn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(a(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var i in t)r=t[i],t.hasOwnProperty(i)&&n[i]!==r&&nn(e,i,r)}else for(var o in t)t.hasOwnProperty(o)&&nn(e,o,t[o])}function an(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var on=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),sn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function cn(e){return sn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function ln(){}var un=null;function dn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var fn=null,pn=null;function mn(e){var t=Et(e);if(t&&(e=t.stateNode)){var n=e[_t]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Jt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+qt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=r[_t]||null;if(!i)throw Error(a(90));Jt(r,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Wt(r)}break a;case`textarea`:Qt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Zt(e,!!n.multiple,t,!1)}}}var hn=!1;function gn(e,t,n){if(hn)return e(t,n);hn=!0;try{return e(t)}finally{if(hn=!1,(fn!==null||pn!==null)&&(bu(),fn&&(t=fn,e=pn,pn=fn=null,mn(t),e)))for(t=0;t<e.length;t++)mn(e[t])}}function _n(e,t){var n=e.stateNode;if(n===null)return null;var r=n[_t]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(a(231,t,typeof n));return n}var vn=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),yn=!1;if(vn)try{var bn={};Object.defineProperty(bn,"passive",{get:function(){yn=!0}}),window.addEventListener(`test`,bn,bn),window.removeEventListener(`test`,bn,bn)}catch{yn=!1}var xn=null,Sn=null,Cn=null;function wn(){if(Cn)return Cn;var e,t=Sn,n=t.length,r,i=`value`in xn?xn.value:xn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Cn=i.slice(e,1<r?1-r:void 0)}function Tn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function En(){return!0}function Dn(){return!1}function On(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?En:Dn,this.isPropagationStopped=Dn,this}return h(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=En)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=En)},persist:function(){},isPersistent:En}),t}var kn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},An=On(kn),jn=h({},kn,{view:0,detail:0}),Mn=On(jn),Nn,Pn,Fn,In=h({},jn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:qn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Fn&&(Fn&&e.type===`mousemove`?(Nn=e.screenX-Fn.screenX,Pn=e.screenY-Fn.screenY):Pn=Nn=0,Fn=e),Nn)},movementY:function(e){return`movementY`in e?e.movementY:Pn}}),Ln=On(In),Rn=On(h({},In,{dataTransfer:0})),zn=On(h({},jn,{relatedTarget:0})),Bn=On(h({},kn,{animationName:0,elapsedTime:0,pseudoElement:0})),Vn=On(h({},kn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Hn=On(h({},kn,{data:0})),Un={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Wn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Gn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Kn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Gn[e])?!!t[e]:!1}function qn(){return Kn}var Jn=On(h({},jn,{key:function(e){if(e.key){var t=Un[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Tn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Wn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:qn,charCode:function(e){return e.type===`keypress`?Tn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Tn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Yn=On(h({},In,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Xn=On(h({},jn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:qn})),Zn=On(h({},kn,{propertyName:0,elapsedTime:0,pseudoElement:0})),Qn=On(h({},In,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),$n=On(h({},kn,{newState:0,oldState:0})),er=[9,13,27,32],tr=vn&&`CompositionEvent`in window,nr=null;vn&&`documentMode`in document&&(nr=document.documentMode);var rr=vn&&`TextEvent`in window&&!nr,ir=vn&&(!tr||nr&&8<nr&&11>=nr),ar=` `,or=!1;function sr(e,t){switch(e){case`keyup`:return er.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function cr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var lr=!1;function ur(e,t){switch(e){case`compositionend`:return cr(t);case`keypress`:return t.which===32?(or=!0,ar):null;case`textInput`:return e=t.data,e===ar&&or?null:e;default:return null}}function dr(e,t){if(lr)return e===`compositionend`||!tr&&sr(e,t)?(e=wn(),Cn=Sn=xn=null,lr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return ir&&t.locale!==`ko`?null:t.data;default:return null}}var fr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function pr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!fr[e.type]:t===`textarea`}function mr(e,t,n,r){fn?pn?pn.push(r):pn=[r]:fn=r,t=Ed(t,`onChange`),0<t.length&&(n=new An(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var hr=null,gr=null;function _r(e){yd(e,0)}function vr(e){if(Wt(Dt(e)))return e}function yr(e,t){if(e===`change`)return t}var br=!1;if(vn){var xr;if(vn){var Sr=`oninput`in document;if(!Sr){var Cr=document.createElement(`div`);Cr.setAttribute(`oninput`,`return;`),Sr=typeof Cr.oninput==`function`}xr=Sr}else xr=!1;br=xr&&(!document.documentMode||9<document.documentMode)}function wr(){hr&&(hr.detachEvent(`onpropertychange`,Tr),gr=hr=null)}function Tr(e){if(e.propertyName===`value`&&vr(gr)){var t=[];mr(t,gr,e,dn(e)),gn(_r,t)}}function Er(e,t,n){e===`focusin`?(wr(),hr=t,gr=n,hr.attachEvent(`onpropertychange`,Tr)):e===`focusout`&&wr()}function Dr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return vr(gr)}function Or(e,t){if(e===`click`)return vr(t)}function kr(e,t){if(e===`input`||e===`change`)return vr(t)}function Ar(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var jr=typeof Object.is==`function`?Object.is:Ar;function Mr(e,t){if(jr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Ae.call(t,i)||!jr(e[i],t[i]))return!1}return!0}function Nr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Pr(e,t){var n=Nr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Nr(n)}}function Fr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Fr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ir(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Gt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Gt(e.document)}return t}function Lr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Rr=vn&&`documentMode`in document&&11>=document.documentMode,zr=null,Br=null,Vr=null,Hr=!1;function Ur(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Hr||zr==null||zr!==Gt(r)||(r=zr,`selectionStart`in r&&Lr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Vr&&Mr(Vr,r)||(Vr=r,r=Ed(Br,`onSelect`),0<r.length&&(t=new An(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=zr)))}function Wr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Gr={animationend:Wr(`Animation`,`AnimationEnd`),animationiteration:Wr(`Animation`,`AnimationIteration`),animationstart:Wr(`Animation`,`AnimationStart`),transitionrun:Wr(`Transition`,`TransitionRun`),transitionstart:Wr(`Transition`,`TransitionStart`),transitioncancel:Wr(`Transition`,`TransitionCancel`),transitionend:Wr(`Transition`,`TransitionEnd`)},Kr={},qr={};vn&&(qr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Gr.animationend.animation,delete Gr.animationiteration.animation,delete Gr.animationstart.animation),`TransitionEvent`in window||delete Gr.transitionend.transition);function Jr(e){if(Kr[e])return Kr[e];if(!Gr[e])return e;var t=Gr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in qr)return Kr[e]=t[n];return e}var Yr=Jr(`animationend`),Xr=Jr(`animationiteration`),Zr=Jr(`animationstart`),Qr=Jr(`transitionrun`),$r=Jr(`transitionstart`),ei=Jr(`transitioncancel`),ti=Jr(`transitionend`),ni=new Map,ri=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);ri.push(`scrollEnd`);function ii(e,t){ni.set(e,t),jt(t,[e])}var ai=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},oi=[],si=0,ci=0;function li(){for(var e=si,t=ci=si=0;t<e;){var n=oi[t];oi[t++]=null;var r=oi[t];oi[t++]=null;var i=oi[t];oi[t++]=null;var a=oi[t];if(oi[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&pi(n,i,a)}}function ui(e,t,n,r){oi[si++]=e,oi[si++]=t,oi[si++]=n,oi[si++]=r,ci|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function di(e,t,n,r){return ui(e,t,n,r),mi(e)}function fi(e,t){return ui(e,null,null,t),mi(e)}function pi(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-qe(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function mi(e){if(50<du)throw du=0,fu=null,Error(a(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var hi={};function gi(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _i(e,t,n,r){return new gi(e,t,n,r)}function vi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function yi(e,t){var n=e.alternate;return n===null?(n=_i(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function bi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function xi(e,t,n,r,i,o){var s=0;if(r=e,typeof e==`function`)vi(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,he.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case ie:return e=_i(31,n,t,i),e.elementType=ie,e.lanes=o,e;case y:return Si(n.children,i,o,t);case b:s=8,i|=24;break;case x:return e=_i(12,n,t,i|2),e.elementType=x,e.lanes=o,e;case te:return e=_i(13,n,t,i),e.elementType=te,e.lanes=o,e;case ne:return e=_i(19,n,t,i),e.elementType=ne,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case S:s=10;break a;case ee:s=9;break a;case C:s=11;break a;case re:s=14;break a;case w:s=16,r=null;break a}s=29,n=Error(a(130,e===null?`null`:typeof e,``)),r=null}return t=_i(s,n,t,i),t.elementType=e,t.type=r,t.lanes=o,t}function Si(e,t,n,r){return e=_i(7,e,r,t),e.lanes=n,e}function Ci(e,t,n){return e=_i(6,e,null,t),e.lanes=n,e}function wi(e){var t=_i(18,null,null,0);return t.stateNode=e,t}function Ti(e,t,n){return t=_i(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ei=new WeakMap;function Di(e,t){if(typeof e==`object`&&e){var n=Ei.get(e);return n===void 0?(t={value:e,source:t,stack:ke(t)},Ei.set(e,t),t):n}return{value:e,source:t,stack:ke(t)}}var Oi=[],ki=0,Ai=null,ji=0,Mi=[],Ni=0,Pi=null,Fi=1,Ii=``;function Li(e,t){Oi[ki++]=ji,Oi[ki++]=Ai,Ai=e,ji=t}function Ri(e,t,n){Mi[Ni++]=Fi,Mi[Ni++]=Ii,Mi[Ni++]=Pi,Pi=e;var r=Fi;e=Ii;var i=32-qe(r)-1;r&=~(1<<i),n+=1;var a=32-qe(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Fi=1<<32-qe(t)+i|n<<i|r,Ii=a+e}else Fi=1<<a|n<<i|r,Ii=e}function zi(e){e.return!==null&&(Li(e,1),Ri(e,1,0))}function Bi(e){for(;e===Ai;)Ai=Oi[--ki],Oi[ki]=null,ji=Oi[--ki],Oi[ki]=null;for(;e===Pi;)Pi=Mi[--Ni],Mi[Ni]=null,Ii=Mi[--Ni],Mi[Ni]=null,Fi=Mi[--Ni],Mi[Ni]=null}function Vi(e,t){Mi[Ni++]=Fi,Mi[Ni++]=Ii,Mi[Ni++]=Pi,Fi=t.id,Ii=t.overflow,Pi=e}var A=null,j=null,M=!1,Hi=null,Ui=!1,Wi=Error(a(519));function Gi(e){throw Zi(Di(Error(a(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Wi}function Ki(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[gt]=e,t[_t]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<_d.length;n++)Q(_d[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),Yt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),$t(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=ln),t=!0):t=!1,t||Gi(e,!0)}function qi(e){for(A=e.return;A;)switch(A.tag){case 5:case 31:case 13:Ui=!1;return;case 27:case 3:Ui=!0;return;default:A=A.return}}function Ji(e){if(e!==A)return!1;if(!M)return qi(e),M=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||Ud(e.type,e.memoizedProps)),n=!n),n&&j&&Gi(e),qi(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(a(317));j=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(a(317));j=uf(e)}else t===27?(t=j,Zd(e.type)?(e=lf,lf=null,j=e):j=t):j=A?cf(e.stateNode.nextSibling):null;return!0}function Yi(){j=A=null,M=!1}function Xi(){var e=Hi;return e!==null&&(Ql===null?Ql=e:Ql.push.apply(Ql,e),Hi=null),e}function Zi(e){Hi===null?Hi=[e]:Hi.push(e)}var Qi=me(null),$i=null,ea=null;function ta(e,t,n){O(Qi,t._currentValue),t._currentValue=n}function na(e){e._currentValue=Qi.current,D(Qi)}function ra(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ia(e,t,n,r){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var o=i.dependencies;if(o!==null){var s=i.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=i;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ra(o.return,n,e),r||(s=null);break a}o=c.next}}else if(i.tag===18){if(s=i.return,s===null)throw Error(a(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ra(s,n,e),s=null}else s=i.child;if(s!==null)s.return=i;else for(s=i;s!==null;){if(s===e){s=null;break}if(i=s.sibling,i!==null){i.return=s.return,s=i;break}s=s.return}i=s}}function aa(e,t,n,r){e=null;for(var i=t,o=!1;i!==null;){if(!o){if(i.flags&524288)o=!0;else if(i.flags&262144)break}if(i.tag===10){var s=i.alternate;if(s===null)throw Error(a(387));if(s=s.memoizedProps,s!==null){var c=i.type;jr(i.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(i===ve.current){if(s=i.alternate,s===null)throw Error(a(387));s.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}i=i.return}e!==null&&ia(t,e,n,r),t.flags|=262144}function oa(e){for(e=e.firstContext;e!==null;){if(!jr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function sa(e){$i=e,ea=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ca(e){return ua($i,e)}function la(e,t){return $i===null&&sa(e),ua(e,t)}function ua(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ea===null){if(e===null)throw Error(a(308));ea=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ea=ea.next=t;return n}var da=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},fa=t.unstable_scheduleCallback,pa=t.unstable_NormalPriority,N={$$typeof:S,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function ma(){return{controller:new da,data:new Map,refCount:0}}function ha(e){e.refCount--,e.refCount===0&&fa(pa,function(){e.controller.abort()})}var ga=null,_a=0,va=0,ya=null;function ba(e,t){if(ga===null){var n=ga=[];_a=0,va=dd(),ya={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return _a++,t.then(xa,xa),t}function xa(){if(--_a===0&&ga!==null){ya!==null&&(ya.status=`fulfilled`);var e=ga;ga=null,va=0,ya=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Sa(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Ca=T.S;T.S=function(e,t){tu=Fe(),typeof t==`object`&&t&&typeof t.then==`function`&&ba(e,t),Ca!==null&&Ca(e,t)};var wa=me(null);function Ta(){var e=wa.current;return e===null?G.pooledCache:e}function Ea(e,t){t===null?O(wa,wa.current):O(wa,t.pool)}function Da(){var e=Ta();return e===null?null:{parent:N._currentValue,pool:e}}var Oa=Error(a(460)),ka=Error(a(474)),Aa=Error(a(542)),ja={then:function(){}};function Ma(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Na(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(ln,ln),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,La(e),e;default:if(typeof t.status==`string`)t.then(ln,ln);else{if(e=G,e!==null&&100<e.shellSuspendCounter)throw Error(a(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,La(e),e}throw Fa=t,Oa}}function Pa(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Fa=e,Oa):e}}var Fa=null;function Ia(){if(Fa===null)throw Error(a(459));var e=Fa;return Fa=null,e}function La(e){if(e===Oa||e===Aa)throw Error(a(483))}var Ra=null,za=0;function Ba(e){var t=za;return za+=1,Ra===null&&(Ra=[]),Na(Ra,e,t)}function Va(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Ha(e,t){throw t.$$typeof===g?Error(a(525)):(e=Object.prototype.toString.call(t),Error(a(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Ua(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function i(e,t){return e=yi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Ci(n,e.mode,r),t.return=e,t):(t=i(t,n),t.return=e,t)}function l(e,t,n,r){var a=n.type;return a===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===a||typeof a==`object`&&a&&a.$$typeof===w&&Pa(a)===t.type)?(t=i(t,n.props),Va(t,n),t.return=e,t):(t=xi(n.type,n.key,n.props,null,e.mode,r),Va(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Ti(n,e.mode,r),t.return=e,t):(t=i(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,a){return t===null||t.tag!==7?(t=Si(n,e.mode,r,a),t.return=e,t):(t=i(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Ci(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=xi(t.type,t.key,t.props,null,e.mode,n),Va(n,t),n.return=e,n;case v:return t=Ti(t,e.mode,n),t.return=e,t;case w:return t=Pa(t),f(e,t,n)}if(ue(t)||se(t))return t=Si(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,Ba(t),n);if(t.$$typeof===S)return f(e,la(e,t),n);Ha(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case w:return n=Pa(n),p(e,t,n,r)}if(ue(n)||se(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,Ba(n),r);if(n.$$typeof===S)return p(e,t,la(e,n),r);Ha(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case w:return r=Pa(r),m(e,t,n,r,i)}if(ue(r)||se(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,Ba(r),i);if(r.$$typeof===S)return m(e,t,n,la(t,r),i);Ha(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),M&&Li(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return M&&Li(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),M&&Li(i,h),l}function g(i,s,c,l){if(c==null)throw Error(a(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(i,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(i,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(i,h),M&&Li(i,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(i,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return M&&Li(i,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,i,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(i,e)}),M&&Li(i,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=i(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===w&&Pa(l)===r.type){n(e,r.sibling),c=i(r,o.props),Va(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===y?(c=Si(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=xi(o.type,o.key,o.props,null,e.mode,c),Va(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=i(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=Ti(o,e.mode,c),c.return=e,e=c}return s(e);case w:return o=Pa(o),b(e,r,o,c)}if(ue(o))return h(e,r,o,c);if(se(o)){if(l=se(o),typeof l!=`function`)throw Error(a(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,Ba(o),c);if(o.$$typeof===S)return b(e,r,la(e,o),c);Ha(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=i(r,o),c.return=e,e=c):(n(e,r),c=Ci(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{za=0;var i=b(e,t,n,r);return Ra=null,i}catch(t){if(t===Oa||t===Aa)throw t;var a=_i(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Wa=Ua(!0),Ga=Ua(!1),Ka=!1;function qa(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ja(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ya(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Xa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,W&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=mi(e),pi(e,null,n),t}return ui(e,r,t,n),mi(e)}function Za(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}function Qa(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var $a=!1;function eo(){if($a){var e=ya;if(e!==null)throw e}}function to(e,t,n,r){$a=!1;var i=e.updateQueue;Ka=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(q&f)===f:(r&f)===f){f!==0&&f===va&&($a=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(m=g.payload,typeof m==`function`){d=m.call(_,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=g.payload,f=typeof m==`function`?m.call(_,d,f):m,f==null)break a;d=h({},d,f);break a;case 2:Ka=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Kl|=o,e.lanes=o,e.memoizedState=d}}function no(e,t){if(typeof e!=`function`)throw Error(a(191,e));e.call(t)}function ro(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)no(n[e],t)}var io=me(null),ao=me(0);function oo(e,t){e=Gl,O(ao,e),O(io,t),Gl=e|t.baseLanes}function so(){O(ao,Gl),O(io,io.current)}function co(){Gl=ao.current,D(io),D(ao)}var lo=me(null),uo=null;function fo(e){var t=e.alternate;O(P,P.current&1),O(lo,e),uo===null&&(t===null||io.current!==null||t.memoizedState!==null)&&(uo=e)}function po(e){O(P,P.current),O(lo,e),uo===null&&(uo=e)}function mo(e){e.tag===22?(O(P,P.current),O(lo,e),uo===null&&(uo=e)):ho(e)}function ho(){O(P,P.current),O(lo,lo.current)}function go(e){D(lo),uo===e&&(uo=null),D(P)}var P=me(0);function _o(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var vo=0,F=null,I=null,L=null,yo=!1,bo=!1,xo=!1,So=0,Co=0,wo=null,To=0;function R(){throw Error(a(321))}function Eo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!jr(e[n],t[n]))return!1;return!0}function Do(e,t,n,r,i,a){return vo=a,F=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,T.H=e===null||e.memoizedState===null?Us:Ws,xo=!1,a=n(r,i),xo=!1,bo&&(a=ko(t,n,r,i)),Oo(e),a}function Oo(e){T.H=Hs;var t=I!==null&&I.next!==null;if(vo=0,L=I=F=null,yo=!1,Co=0,wo=null,t)throw Error(a(300));e===null||B||(e=e.dependencies,e!==null&&oa(e)&&(B=!0))}function ko(e,t,n,r){F=e;var i=0;do{if(bo&&(wo=null),Co=0,bo=!1,25<=i)throw Error(a(301));if(i+=1,L=I=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}T.H=Gs,o=t(n,r)}while(bo);return o}function Ao(){var e=T.H,t=e.useState()[0];return t=typeof t.then==`function`?Io(t):t,e=e.useState()[0],(I===null?null:I.memoizedState)!==e&&(F.flags|=1024),t}function jo(){var e=So!==0;return So=0,e}function Mo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function No(e){if(yo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}yo=!1}vo=0,L=I=F=null,bo=!1,Co=So=0,wo=null}function Po(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return L===null?F.memoizedState=L=e:L=L.next=e,L}function z(){if(I===null){var e=F.alternate;e=e===null?null:e.memoizedState}else e=I.next;var t=L===null?F.memoizedState:L.next;if(t!==null)L=t,I=e;else{if(e===null)throw F.alternate===null?Error(a(467)):Error(a(310));I=e,e={memoizedState:I.memoizedState,baseState:I.baseState,baseQueue:I.baseQueue,queue:I.queue,next:null},L===null?F.memoizedState=L=e:L=L.next=e}return L}function Fo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Io(e){var t=Co;return Co+=1,wo===null&&(wo=[]),e=Na(wo,e,t),t=F,(L===null?t.memoizedState:L.next)===null&&(t=t.alternate,T.H=t===null||t.memoizedState===null?Us:Ws),e}function Lo(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Io(e);if(e.$$typeof===S)return ca(e)}throw Error(a(438,String(e)))}function Ro(e){var t=null,n=F.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=F.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Fo(),F.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=ae;return t.index++,n}function zo(e,t){return typeof t==`function`?t(e):t}function Bo(e){return Vo(z(),I,e)}function Vo(e,t,n){var r=e.queue;if(r===null)throw Error(a(311));r.lastRenderedReducer=n;var i=e.baseQueue,o=r.pending;if(o!==null){if(i!==null){var s=i.next;i.next=o.next,o.next=s}t.baseQueue=i=o,r.pending=null}if(o=e.baseState,i===null)e.memoizedState=o;else{t=i.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(vo&f)===f:(q&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===va&&(d=!0);else if((vo&p)===p){u=u.next,p===va&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,F.lanes|=p,Kl|=p;f=u.action,xo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,F.lanes|=f,Kl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!jr(o,e.memoizedState)&&(B=!0,d&&(n=ya,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return i===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Ho(e){var t=z(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,o=t.memoizedState;if(i!==null){n.pending=null;var s=i=i.next;do o=e(o,s.action),s=s.next;while(s!==i);jr(o,t.memoizedState)||(B=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Uo(e,t,n){var r=F,i=z(),o=M;if(o){if(n===void 0)throw Error(a(407));n=n()}else n=t();var s=!jr((I||i).memoizedState,n);if(s&&(i.memoizedState=n,B=!0),i=i.queue,ms(Ko.bind(null,r,i,e),[e]),i.getSnapshot!==t||s||L!==null&&L.memoizedState.tag&1){if(r.flags|=2048,ls(9,{destroy:void 0},Go.bind(null,r,i,n,t),null),G===null)throw Error(a(349));o||vo&127||Wo(r,t,n)}return n}function Wo(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=F.updateQueue,t===null?(t=Fo(),F.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Go(e,t,n,r){t.value=n,t.getSnapshot=r,qo(t)&&Jo(e)}function Ko(e,t,n){return n(function(){qo(t)&&Jo(e)})}function qo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!jr(e,n)}catch{return!0}}function Jo(e){var t=fi(e,2);t!==null&&hu(t,e,2)}function Yo(e){var t=Po();if(typeof e==`function`){var n=e;if(e=n(),xo){Ke(!0);try{n()}finally{Ke(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:zo,lastRenderedState:e},t}function Xo(e,t,n,r){return e.baseState=n,Vo(e,I,typeof r==`function`?r:zo)}function Zo(e,t,n,r,i){if(zs(e))throw Error(a(485));if(e=t.action,e!==null){var o={payload:i,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};T.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,Qo(t,o)):(o.next=n.next,t.pending=n.next=o)}}function Qo(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=T.T,o={};T.T=o;try{var s=n(i,r),c=T.S;c!==null&&c(o,s),$o(e,t,s)}catch(n){ts(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),T.T=a}}else try{a=n(i,r),$o(e,t,a)}catch(n){ts(e,t,n)}}function $o(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){es(e,t,n)},function(n){return ts(e,t,n)}):es(e,t,n)}function es(e,t,n){t.status=`fulfilled`,t.value=n,ns(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Qo(e,n)))}function ts(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,ns(t),t=t.next;while(t!==r)}e.action=null}function ns(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function rs(e,t){return t}function is(e,t){if(M){var n=G.formState;if(n!==null){a:{var r=F;if(M){if(j){b:{for(var i=j,a=Ui;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){j=cf(i.nextSibling),r=i.data===`F!`;break a}}Gi(r)}r=!1}r&&(t=n[0])}}return n=Po(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:rs,lastRenderedState:t},n.queue=r,n=Is.bind(null,F,r),r.dispatch=n,r=Yo(!1),a=Rs.bind(null,F,!1,r.queue),r=Po(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Zo.bind(null,F,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function as(e){return os(z(),I,e)}function os(e,t,n){if(t=Vo(e,t,rs)[0],e=Bo(zo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Io(t)}catch(e){throw e===Oa?Aa:e}else r=t;t=z();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(F.flags|=2048,ls(9,{destroy:void 0},ss.bind(null,i,n),null)),[r,a,e]}function ss(e,t){e.action=t}function cs(e){var t=z(),n=I;if(n!==null)return os(t,n,e);z(),t=t.memoizedState,n=z();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function ls(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=F.updateQueue,t===null&&(t=Fo(),F.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function us(){return z().memoizedState}function ds(e,t,n,r){var i=Po();F.flags|=e,i.memoizedState=ls(1|t,{destroy:void 0},n,r===void 0?null:r)}function fs(e,t,n,r){var i=z();r=r===void 0?null:r;var a=i.memoizedState.inst;I!==null&&r!==null&&Eo(r,I.memoizedState.deps)?i.memoizedState=ls(t,a,n,r):(F.flags|=e,i.memoizedState=ls(1|t,a,n,r))}function ps(e,t){ds(8390656,8,e,t)}function ms(e,t){fs(2048,8,e,t)}function hs(e){F.flags|=4;var t=F.updateQueue;if(t===null)t=Fo(),F.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function gs(e){var t=z().memoizedState;return hs({ref:t,nextImpl:e}),function(){if(W&2)throw Error(a(440));return t.impl.apply(void 0,arguments)}}function _s(e,t){return fs(4,2,e,t)}function vs(e,t){return fs(4,4,e,t)}function ys(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function bs(e,t,n){n=n==null?null:n.concat([e]),fs(4,4,ys.bind(null,t,e),n)}function xs(){}function Ss(e,t){var n=z();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Eo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Cs(e,t){var n=z();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Eo(t,r[1]))return r[0];if(r=e(),xo){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r}function ws(e,t,n){return n===void 0||vo&1073741824&&!(q&261930)?e.memoizedState=t:(e.memoizedState=n,e=mu(),F.lanes|=e,Kl|=e,n)}function Ts(e,t,n,r){return jr(n,t)?n:io.current===null?!(vo&42)||vo&1073741824&&!(q&261930)?(B=!0,e.memoizedState=n):(e=mu(),F.lanes|=e,Kl|=e,t):(e=ws(e,n,r),jr(e,t)||(B=!0),e)}function Es(e,t,n,r,i){var a=E.p;E.p=a!==0&&8>a?a:8;var o=T.T,s={};T.T=s,Rs(e,!1,t,n);try{var c=i(),l=T.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Ls(e,t,Sa(c,r),pu(e)):Ls(e,t,r,pu(e))}catch(n){Ls(e,t,{then:function(){},status:`rejected`,reason:n},pu())}finally{E.p=a,o!==null&&s.types!==null&&(o.types=s.types),T.T=o}}function Ds(){}function Os(e,t,n,r){if(e.tag!==5)throw Error(a(476));var i=ks(e).queue;Es(e,i,t,de,n===null?Ds:function(){return As(e),n(r)})}function ks(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:de,baseState:de,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:zo,lastRenderedState:de},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:zo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function As(e){var t=ks(e);t.next===null&&(t=e.alternate.memoizedState),Ls(e,t.next.queue,{},pu())}function js(){return ca(Qf)}function Ms(){return z().memoizedState}function Ns(){return z().memoizedState}function Ps(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=pu();e=Ya(n);var r=Xa(t,e,n);r!==null&&(hu(r,t,n),Za(r,t,n)),t={cache:ma()},e.payload=t;return}t=t.return}}function Fs(e,t,n){var r=pu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},zs(e)?Bs(t,n):(n=di(e,t,n,r),n!==null&&(hu(n,e,r),Vs(n,t,r)))}function Is(e,t,n){Ls(e,t,n,pu())}function Ls(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(zs(e))Bs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,jr(s,o))return ui(e,t,i,0),G===null&&li(),!1}catch{}if(n=di(e,t,i,r),n!==null)return hu(n,e,r),Vs(n,t,r),!0}return!1}function Rs(e,t,n,r){if(r={lane:2,revertLane:dd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},zs(e)){if(t)throw Error(a(479))}else t=di(e,n,r,2),t!==null&&hu(t,e,2)}function zs(e){var t=e.alternate;return e===F||t!==null&&t===F}function Bs(e,t){bo=yo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Vs(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}var Hs={readContext:ca,use:Lo,useCallback:R,useContext:R,useEffect:R,useImperativeHandle:R,useLayoutEffect:R,useInsertionEffect:R,useMemo:R,useReducer:R,useRef:R,useState:R,useDebugValue:R,useDeferredValue:R,useTransition:R,useSyncExternalStore:R,useId:R,useHostTransitionStatus:R,useFormState:R,useActionState:R,useOptimistic:R,useMemoCache:R,useCacheRefresh:R};Hs.useEffectEvent=R;var Us={readContext:ca,use:Lo,useCallback:function(e,t){return Po().memoizedState=[e,t===void 0?null:t],e},useContext:ca,useEffect:ps,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),ds(4194308,4,ys.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ds(4194308,4,e,t)},useInsertionEffect:function(e,t){ds(4,2,e,t)},useMemo:function(e,t){var n=Po();t=t===void 0?null:t;var r=e();if(xo){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Po();if(n!==void 0){var i=n(t);if(xo){Ke(!0);try{n(t)}finally{Ke(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Fs.bind(null,F,e),[r.memoizedState,e]},useRef:function(e){var t=Po();return e={current:e},t.memoizedState=e},useState:function(e){e=Yo(e);var t=e.queue,n=Is.bind(null,F,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:xs,useDeferredValue:function(e,t){return ws(Po(),e,t)},useTransition:function(){var e=Yo(!1);return e=Es.bind(null,F,e.queue,!0,!1),Po().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=F,i=Po();if(M){if(n===void 0)throw Error(a(407));n=n()}else{if(n=t(),G===null)throw Error(a(349));q&127||Wo(r,t,n)}i.memoizedState=n;var o={value:n,getSnapshot:t};return i.queue=o,ps(Ko.bind(null,r,o,e),[e]),r.flags|=2048,ls(9,{destroy:void 0},Go.bind(null,r,o,n,t),null),n},useId:function(){var e=Po(),t=G.identifierPrefix;if(M){var n=Ii,r=Fi;n=(r&~(1<<32-qe(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=So++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=To++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:js,useFormState:is,useActionState:is,useOptimistic:function(e){var t=Po();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Rs.bind(null,F,!0,n),n.dispatch=t,[e,t]},useMemoCache:Ro,useCacheRefresh:function(){return Po().memoizedState=Ps.bind(null,F)},useEffectEvent:function(e){var t=Po(),n={impl:e};return t.memoizedState=n,function(){if(W&2)throw Error(a(440));return n.impl.apply(void 0,arguments)}}},Ws={readContext:ca,use:Lo,useCallback:Ss,useContext:ca,useEffect:ms,useImperativeHandle:bs,useInsertionEffect:_s,useLayoutEffect:vs,useMemo:Cs,useReducer:Bo,useRef:us,useState:function(){return Bo(zo)},useDebugValue:xs,useDeferredValue:function(e,t){return Ts(z(),I.memoizedState,e,t)},useTransition:function(){var e=Bo(zo)[0],t=z().memoizedState;return[typeof e==`boolean`?e:Io(e),t]},useSyncExternalStore:Uo,useId:Ms,useHostTransitionStatus:js,useFormState:as,useActionState:as,useOptimistic:function(e,t){return Xo(z(),I,e,t)},useMemoCache:Ro,useCacheRefresh:Ns};Ws.useEffectEvent=gs;var Gs={readContext:ca,use:Lo,useCallback:Ss,useContext:ca,useEffect:ms,useImperativeHandle:bs,useInsertionEffect:_s,useLayoutEffect:vs,useMemo:Cs,useReducer:Ho,useRef:us,useState:function(){return Ho(zo)},useDebugValue:xs,useDeferredValue:function(e,t){var n=z();return I===null?ws(n,e,t):Ts(n,I.memoizedState,e,t)},useTransition:function(){var e=Ho(zo)[0],t=z().memoizedState;return[typeof e==`boolean`?e:Io(e),t]},useSyncExternalStore:Uo,useId:Ms,useHostTransitionStatus:js,useFormState:cs,useActionState:cs,useOptimistic:function(e,t){var n=z();return I===null?(n.baseState=e,[e,n.queue.dispatch]):Xo(n,I,e,t)},useMemoCache:Ro,useCacheRefresh:Ns};Gs.useEffectEvent=gs;function Ks(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:h({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var qs={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Ya(r);i.payload=t,n!=null&&(i.callback=n),t=Xa(e,i,r),t!==null&&(hu(t,e,r),Za(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Ya(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Xa(e,i,r),t!==null&&(hu(t,e,r),Za(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pu(),r=Ya(n);r.tag=2,t!=null&&(r.callback=t),t=Xa(e,r,n),t!==null&&(hu(t,e,n),Za(t,e,n))}};function Js(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Mr(n,r)||!Mr(i,a):!0}function Ys(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&qs.enqueueReplaceState(t,t.state,null)}function Xs(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=h({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Zs(e){ai(e)}function Qs(e){console.error(e)}function $s(e){ai(e)}function ec(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function tc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function nc(e,t,n){return n=Ya(n),n.tag=3,n.payload={element:null},n.callback=function(){ec(e,t)},n}function rc(e){return e=Ya(e),e.tag=3,e}function ic(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){tc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){tc(t,n,r),typeof i!=`function`&&(iu===null?iu=new Set([this]):iu.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function ac(e,t,n,r,i){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&aa(t,n,i,!0),n=lo.current,n!==null){switch(n.tag){case 31:case 13:return uo===null?Du():n.alternate===null&&Y===0&&(Y=3),n.flags&=-257,n.flags|=65536,n.lanes=i,r===ja?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Gu(e,r,i)),!1;case 22:return n.flags|=65536,r===ja?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Gu(e,r,i)),!1}throw Error(a(435,n.tag))}return Gu(e,r,i),Du(),!1}if(M)return t=lo.current,t===null?(r!==Wi&&(t=Error(a(423),{cause:r}),Zi(Di(t,n))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,r=Di(r,n),i=nc(e.stateNode,r,i),Qa(e,i),Y!==4&&(Y=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=i,r!==Wi&&(e=Error(a(422),{cause:r}),Zi(Di(e,n)))),!1;var o=Error(a(520),{cause:r});if(o=Di(o,n),Zl===null?Zl=[o]:Zl.push(o),Y!==4&&(Y=2),t===null)return!0;r=Di(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=i&-i,n.lanes|=e,e=nc(n.stateNode,r,e),Qa(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(iu===null||!iu.has(o))))return n.flags|=65536,i&=-i,n.lanes|=i,i=rc(i),ic(i,e,n,r),Qa(n,i),!1}n=n.return}while(n!==null);return!1}var oc=Error(a(461)),B=!1;function sc(e,t,n,r){t.child=e===null?Ga(t,null,n,r):Wa(t,e.child,n,r)}function cc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return sa(t),r=Do(e,t,n,o,a,i),s=jo(),e!==null&&!B?(Mo(e,t,i),Mc(e,t,i)):(M&&s&&zi(t),t.flags|=1,sc(e,t,r,i),t.child)}function lc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!vi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,uc(e,t,a,r,i)):(e=xi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Nc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Mr:n,n(o,r)&&e.ref===t.ref)return Mc(e,t,i)}return t.flags|=1,e=yi(a,r),e.ref=t.ref,e.return=t,t.child=e}function uc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Mr(a,r)&&e.ref===t.ref){if(B=!1,t.pendingProps=r=a,Nc(e,i))e.flags&131072&&(B=!0);else return t.lanes=e.lanes,Mc(e,t,i)}}return vc(e,t,n,r,i)}function dc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return pc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ea(t,a===null?null:a.cachePool),a===null?so():oo(t,a),mo(t);else return r=t.lanes=536870912,pc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Ea(t,null),so(),ho(t)):(Ea(t,a.cachePool),oo(t,a),ho(t),t.memoizedState=null);return sc(e,t,i,n),t.child}function fc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function pc(e,t,n,r,i){var a=Ta();return a=a===null?null:{parent:N._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Ea(t,null),so(),mo(t),e!==null&&aa(e,t,r,!0),t.childLanes=i,null}function mc(e,t){return t=Dc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function hc(e,t,n){return Wa(t,e.child,null,n),e=mc(t,t.pendingProps),e.flags|=2,go(t),t.memoizedState=null,e}function gc(e,t,n){var r=t.pendingProps,i=!!(t.flags&128);if(t.flags&=-129,e===null){if(M){if(r.mode===`hidden`)return e=mc(t,r),t.lanes=536870912,fc(null,e);if(po(t),(e=j)?(e=rf(e,Ui),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Pi===null?null:{id:Fi,overflow:Ii},retryLane:536870912,hydrationErrors:null},n=wi(e),n.return=t,t.child=n,A=t,j=null)):e=null,e===null)throw Gi(t);return t.lanes=536870912,null}return mc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(po(t),i){if(t.flags&256)t.flags&=-257,t=hc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(a(558))}else if(B||aa(e,t,n,!1),i=(n&e.childLanes)!==0,B||i){if(r=G,r!==null&&(s=ut(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,fi(e,s),hu(r,e,s),oc;Du(),t=hc(e,t,n)}else e=o.treeContext,j=cf(s.nextSibling),A=t,M=!0,Hi=null,Ui=!1,e!==null&&Vi(t,e),t=mc(t,r),t.flags|=4096;return t}return e=yi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function _c(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(a(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function vc(e,t,n,r,i){return sa(t),n=Do(e,t,n,r,void 0,i),r=jo(),e!==null&&!B?(Mo(e,t,i),Mc(e,t,i)):(M&&r&&zi(t),t.flags|=1,sc(e,t,n,i),t.child)}function yc(e,t,n,r,i,a){return sa(t),t.updateQueue=null,n=ko(t,r,n,i),Oo(e),r=jo(),e!==null&&!B?(Mo(e,t,a),Mc(e,t,a)):(M&&r&&zi(t),t.flags|=1,sc(e,t,n,a),t.child)}function bc(e,t,n,r,i){if(sa(t),t.stateNode===null){var a=hi,o=n.contextType;typeof o==`object`&&o&&(a=ca(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=qs,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},qa(t),o=n.contextType,a.context=typeof o==`object`&&o?ca(o):hi,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Ks(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&qs.enqueueReplaceState(a,a.state,null),to(t,r,a,i),eo(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Xs(n,s);a.props=c;var l=a.context,u=n.contextType;o=hi,typeof u==`object`&&u&&(o=ca(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Ys(t,a,r,o),Ka=!1;var f=t.memoizedState;a.state=f,to(t,r,a,i),eo(),l=t.memoizedState,s||f!==l||Ka?(typeof d==`function`&&(Ks(t,n,d,r),l=t.memoizedState),(c=Ka||Js(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Ja(e,t),o=t.memoizedProps,u=Xs(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=hi,typeof l==`object`&&l&&(c=ca(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Ys(t,a,r,c),Ka=!1,f=t.memoizedState,a.state=f,to(t,r,a,i),eo();var p=t.memoizedState;o!==d||f!==p||Ka||e!==null&&e.dependencies!==null&&oa(e.dependencies)?(typeof s==`function`&&(Ks(t,n,s,r),p=t.memoizedState),(u=Ka||Js(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&oa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,_c(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Wa(t,e.child,null,i),t.child=Wa(t,null,n,i)):sc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Mc(e,t,i),e}function xc(e,t,n,r){return Yi(),t.flags|=256,sc(e,t,n,r),t.child}var Sc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Cc(e){return{baseLanes:e,cachePool:Da()}}function wc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=Yl),e}function Tc(e,t,n){var r=t.pendingProps,i=!1,o=!!(t.flags&128),s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:!!(P.current&2)),s&&(i=!0,t.flags&=-129),s=!!(t.flags&32),t.flags&=-33,e===null){if(M){if(i?fo(t):ho(t),(e=j)?(e=rf(e,Ui),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Pi===null?null:{id:Fi,overflow:Ii},retryLane:536870912,hydrationErrors:null},n=wi(e),n.return=t,t.child=n,A=t,j=null)):e=null,e===null)throw Gi(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,i?(ho(t),i=t.mode,c=Dc({mode:`hidden`,children:c},i),r=Si(r,i,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=Cc(n),r.childLanes=wc(e,s,n),t.memoizedState=Sc,fc(null,r)):(fo(t),Ec(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(fo(t),t.flags&=-257,t=Oc(e,t,n)):t.memoizedState===null?(ho(t),c=r.fallback,i=t.mode,r=Dc({mode:`visible`,children:r.children},i),c=Si(c,i,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Wa(t,e.child,null,n),r=t.child,r.memoizedState=Cc(n),r.childLanes=wc(e,s,n),t.memoizedState=Sc,t=fc(null,r)):(ho(t),t.child=e.child,t.flags|=128,t=null);else if(fo(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(a(419)),r.stack=``,r.digest=s,Zi({value:r,source:null,stack:null}),t=Oc(e,t,n)}else if(B||aa(e,t,n,!1),s=(n&e.childLanes)!==0,B||s){if(s=G,s!==null&&(r=ut(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,fi(e,r),hu(s,e,r),oc;af(c)||Du(),t=Oc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,j=cf(c.nextSibling),A=t,M=!0,Hi=null,Ui=!1,e!==null&&Vi(t,e),t=Ec(t,r.children),t.flags|=4096);return t}return i?(ho(t),c=r.fallback,i=t.mode,l=e.child,u=l.sibling,r=yi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=Si(c,i,n,null),c.flags|=2):c=yi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,fc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=Cc(n):(i=c.cachePool,i===null?i=Da():(l=N._currentValue,i=i.parent===l?i:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:i}),r.memoizedState=c,r.childLanes=wc(e,s,n),t.memoizedState=Sc,fc(e.child,r)):(fo(t),n=e.child,e=n.sibling,n=yi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Ec(e,t){return t=Dc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function Dc(e,t){return e=_i(22,e,null,t),e.lanes=0,e}function Oc(e,t,n){return Wa(t,e.child,null,n),e=Ec(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function kc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ra(e.return,t,n)}function Ac(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function jc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=P.current,s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,O(P,o),sc(e,t,r,n),r=M?ji:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&kc(e,n,t);else if(e.tag===19)kc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&_o(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Ac(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&_o(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Ac(t,!0,n,null,a,r);break;case`together`:Ac(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Mc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Kl|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(aa(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(a(153));if(t.child!==null){for(e=t.child,n=yi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=yi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Nc(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&oa(e)))}function Pc(e,t,n){switch(t.tag){case 3:ye(t,t.stateNode.containerInfo),ta(t,N,e.memoizedState.cache),Yi();break;case 27:case 5:xe(t);break;case 4:ye(t,t.stateNode.containerInfo);break;case 10:ta(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,po(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(fo(t),e=Mc(e,t,n),e===null?null:e.sibling):Tc(e,t,n):(fo(t),t.flags|=128,null);fo(t);break;case 19:var i=!!(e.flags&128);if(r=(n&t.childLanes)!==0,r||=(aa(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return jc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),O(P,P.current),r)break;return null;case 22:return t.lanes=0,dc(e,t,n,t.pendingProps);case 24:ta(t,N,e.memoizedState.cache)}return Mc(e,t,n)}function Fc(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)B=!0;else{if(!Nc(e,n)&&!(t.flags&128))return B=!1,Pc(e,t,n);B=!!(e.flags&131072)}}else B=!1,M&&t.flags&1048576&&Ri(t,ji,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=Pa(t.elementType),t.type=e,typeof e==`function`)vi(e)?(r=Xs(e,r),t.tag=1,t=bc(null,t,e,r,n)):(t.tag=0,t=vc(null,t,e,r,n));else{if(e!=null){var i=e.$$typeof;if(i===C){t.tag=11,t=cc(null,t,e,r,n);break a}if(i===re){t.tag=14,t=lc(null,t,e,r,n);break a}}throw t=le(e)||e,Error(a(306,t,``))}}return t;case 0:return vc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,i=Xs(r,t.pendingProps),bc(e,t,r,i,n);case 3:a:{if(ye(t,t.stateNode.containerInfo),e===null)throw Error(a(387));r=t.pendingProps;var o=t.memoizedState;i=o.element,Ja(e,t),to(t,r,null,n);var s=t.memoizedState;if(r=s.cache,ta(t,N,r),r!==o.cache&&ia(t,[N],n,!0),eo(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=xc(e,t,r,n);break a}if(r!==i){i=Di(Error(a(424)),t),Zi(i),t=xc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(j=cf(e.firstChild),A=t,M=!0,Hi=null,Ui=!0,n=Ga(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Yi(),r===i){t=Mc(e,t,n);break a}sc(e,t,r,n)}t=t.child}return t;case 26:return _c(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:M||(n=t.type,e=t.pendingProps,r=Bd(_e.current).createElement(n),r[gt]=t,r[_t]=e,Pd(r,n,e),k(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return xe(t),e===null&&M&&(r=t.stateNode=ff(t.type,t.pendingProps,_e.current),A=t,Ui=!0,i=j,Zd(t.type)?(lf=i,j=cf(r.firstChild)):j=i),sc(e,t,t.pendingProps.children,n),_c(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&M&&((i=r=j)&&(r=tf(r,t.type,t.pendingProps,Ui),r===null?i=!1:(t.stateNode=r,A=t,j=cf(r.firstChild),Ui=!1,i=!0)),i||Gi(t)),xe(t),i=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(i,o)?r=null:s!==null&&Ud(i,s)&&(t.flags|=32),t.memoizedState!==null&&(i=Do(e,t,Ao,null,null,n),Qf._currentValue=i),_c(e,t),sc(e,t,r,n),t.child;case 6:return e===null&&M&&((e=n=j)&&(n=nf(n,t.pendingProps,Ui),n===null?e=!1:(t.stateNode=n,A=t,j=null,e=!0)),e||Gi(t)),null;case 13:return Tc(e,t,n);case 4:return ye(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Wa(t,null,r,n):sc(e,t,r,n),t.child;case 11:return cc(e,t,t.type,t.pendingProps,n);case 7:return sc(e,t,t.pendingProps,n),t.child;case 8:return sc(e,t,t.pendingProps.children,n),t.child;case 12:return sc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,ta(t,t.type,r.value),sc(e,t,r.children,n),t.child;case 9:return i=t.type._context,r=t.pendingProps.children,sa(t),i=ca(i),r=r(i),t.flags|=1,sc(e,t,r,n),t.child;case 14:return lc(e,t,t.type,t.pendingProps,n);case 15:return uc(e,t,t.type,t.pendingProps,n);case 19:return jc(e,t,n);case 31:return gc(e,t,n);case 22:return dc(e,t,n,t.pendingProps);case 24:return sa(t),r=ca(N),e===null?(i=Ta(),i===null&&(i=G,o=ma(),i.pooledCache=o,o.refCount++,o!==null&&(i.pooledCacheLanes|=n),i=o),t.memoizedState={parent:r,cache:i},qa(t),ta(t,N,i)):((e.lanes&n)!==0&&(Ja(e,t),to(t,null,null,n),eo()),i=e.memoizedState,o=t.memoizedState,i.parent===r?(r=o.cache,ta(t,N,r),r!==i.cache&&ia(t,[N],n,!0)):(i={parent:r,cache:r},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),ta(t,N,r))),sc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(a(156,t.tag))}function Ic(e){e.flags|=4}function Lc(e,t,n,r,i){if((t=!!(e.mode&32))&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(wu())e.flags|=8192;else throw Fa=ja,ka}}else e.flags&=-16777217}function Rc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t)){if(wu())e.flags|=8192;else throw Fa=ja,ka}}function zc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:it(),e.lanes|=t,Xl|=t)}function Bc(e,t){if(!M)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function V(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Vc(e,t,n){var r=t.pendingProps;switch(Bi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return V(t),null;case 1:return V(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),na(N),be(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Ji(t)?Ic(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Xi())),V(t),null;case 26:var i=t.type,o=t.memoizedState;return e===null?(Ic(t),o===null?(V(t),Lc(t,i,null,r,n)):(V(t),Rc(t,o))):o?o===e.memoizedState?(V(t),t.flags&=-16777217):(Ic(t),V(t),Rc(t,o)):(e=e.memoizedProps,e!==r&&Ic(t),V(t),Lc(t,i,e,r,n)),null;case 27:if(Se(t),n=_e.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(!r){if(t.stateNode===null)throw Error(a(166));return V(t),null}e=he.current,Ji(t)?Ki(t,e):(e=ff(i,r,n),t.stateNode=e,Ic(t))}return V(t),null;case 5:if(Se(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(!r){if(t.stateNode===null)throw Error(a(166));return V(t),null}if(o=he.current,Ji(t))Ki(t,o);else{var s=Bd(_e.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,i);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;default:switch(i){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,i);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(i,{is:r.is}):s.createElement(i)}}o[gt]=t,o[_t]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Pd(o,i,r),i){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Ic(t)}}return V(t),Lc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(a(166));if(e=_e.current,Ji(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,i=A,i!==null)switch(i.tag){case 27:case 5:r=i.memoizedProps}e[gt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Gi(t,!0)}else e=Bd(e).createTextNode(r),e[gt]=t,t.stateNode=e}return V(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Ji(t),n!==null){if(e===null){if(!r)throw Error(a(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(a(557));e[gt]=t}else Yi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;V(t),e=!1}else n=Xi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(go(t),t):(go(t),null);if(t.flags&128)throw Error(a(558))}return V(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Ji(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(a(318));if(i=t.memoizedState,i=i===null?null:i.dehydrated,!i)throw Error(a(317));i[gt]=t}else Yi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;V(t),i=!1}else i=Xi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(go(t),t):(go(t),null)}return go(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,i=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(i=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==i&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),zc(t,t.updateQueue),V(t),null);case 4:return be(),e===null&&Sd(t.stateNode.containerInfo),V(t),null;case 10:return na(t.type),V(t),null;case 19:if(D(P),r=t.memoizedState,r===null)return V(t),null;if(i=!!(t.flags&128),o=r.rendering,o===null){if(i)Bc(r,!1);else{if(Y!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=_o(e),o!==null){for(t.flags|=128,Bc(r,!1),e=o.updateQueue,t.updateQueue=e,zc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)bi(n,e),n=n.sibling;return O(P,P.current&1|2),M&&Li(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Fe()>nu&&(t.flags|=128,i=!0,Bc(r,!1),t.lanes=4194304)}}else{if(!i){if(e=_o(o),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,zc(t,e),Bc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!M)return V(t),null}else 2*Fe()-r.renderingStartTime>nu&&n!==536870912&&(t.flags|=128,i=!0,Bc(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(V(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Fe(),e.sibling=null,n=P.current,O(P,i?n&1|2:n&1),M&&Li(t,r.treeForkCount),e);case 22:case 23:return go(t),co(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(V(t),t.subtreeFlags&6&&(t.flags|=8192)):V(t),n=t.updateQueue,n!==null&&zc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&D(wa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),na(N),V(t),null;case 25:return null;case 30:return null}throw Error(a(156,t.tag))}function Hc(e,t){switch(Bi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return na(N),be(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Se(t),null;case 31:if(t.memoizedState!==null){if(go(t),t.alternate===null)throw Error(a(340));Yi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(go(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(a(340));Yi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return D(P),null;case 4:return be(),null;case 10:return na(t.type),null;case 22:case 23:return go(t),co(),e!==null&&D(wa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return na(N),null;case 25:return null;default:return null}}function Uc(e,t){switch(Bi(t),t.tag){case 3:na(N),be();break;case 26:case 27:case 5:Se(t);break;case 4:be();break;case 31:t.memoizedState!==null&&go(t);break;case 13:go(t);break;case 19:D(P);break;case 10:na(t.type);break;case 22:case 23:go(t),co(),e!==null&&D(wa);break;case 24:na(N)}}function Wc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Gc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function Kc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{ro(t,n)}catch(t){Z(e,e.return,t)}}}function qc(e,t,n){n.props=Xs(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Jc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function Yc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Xc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Zc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[_t]=t}catch(t){Z(e,e.return,t)}}function Qc(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function $c(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Qc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function el(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ln));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(el(e,t,n),e=e.sibling;e!==null;)el(e,t,n),e=e.sibling}function tl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(tl(e,t,n),e=e.sibling;e!==null;)tl(e,t,n),e=e.sibling}function nl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[gt]=e,t[_t]=n}catch(t){Z(e,e.return,t)}}var rl=!1,H=!1,il=!1,al=typeof WeakSet==`function`?WeakSet:Set,ol=null;function sl(e,t){if(e=e.containerInfo,Rd=sp,e=Ir(e),Lr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||i!==0&&f.nodeType!==3||(c=s+i),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===i&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,ol=t;ol!==null;)if(t=ol,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,ol=e;else for(;ol!==null;){switch(t=ol,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)i=e[n],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,i=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Xs(n.type,i);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Z(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(a(163))}if(e=t.sibling,e!==null){e.return=t.return,ol=e;break}ol=t.return}}function cl(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Sl(e,n),r&4&&Wc(5,n);break;case 1:if(Sl(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Xs(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&Kc(n),r&512&&Jc(n,n.return);break;case 3:if(Sl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{ro(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&nl(n);case 26:case 5:Sl(e,n),t===null&&r&4&&Xc(n),r&512&&Jc(n,n.return);break;case 12:Sl(e,n);break;case 31:Sl(e,n),r&4&&pl(e,n);break;case 13:Sl(e,n),r&4&&ml(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Ju.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||rl,!r){t=t!==null&&t.memoizedState!==null||H,i=rl;var a=H;rl=r,(H=t)&&!a?wl(e,n,!!(n.subtreeFlags&8772)):Sl(e,n),rl=i,H=a}break;case 30:break;default:Sl(e,n)}}function ll(e){var t=e.alternate;t!==null&&(e.alternate=null,ll(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&wt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var U=null,ul=!1;function dl(e,t,n){for(n=n.child;n!==null;)fl(e,t,n),n=n.sibling}function fl(e,t,n){if(Ge&&typeof Ge.onCommitFiberUnmount==`function`)try{Ge.onCommitFiberUnmount(We,n)}catch{}switch(n.tag){case 26:H||Yc(n,t),dl(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:H||Yc(n,t);var r=U,i=ul;Zd(n.type)&&(U=n.stateNode,ul=!1),dl(e,t,n),pf(n.stateNode),U=r,ul=i;break;case 5:H||Yc(n,t);case 6:if(r=U,i=ul,U=null,dl(e,t,n),U=r,ul=i,U!==null){if(ul)try{(U.nodeType===9?U.body:U.nodeName===`HTML`?U.ownerDocument.body:U).removeChild(n.stateNode)}catch(e){Z(n,t,e)}else try{U.removeChild(n.stateNode)}catch(e){Z(n,t,e)}}break;case 18:U!==null&&(ul?(e=U,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(U,n.stateNode));break;case 4:r=U,i=ul,U=n.stateNode.containerInfo,ul=!0,dl(e,t,n),U=r,ul=i;break;case 0:case 11:case 14:case 15:Gc(2,n,t),H||Gc(4,n,t),dl(e,t,n);break;case 1:H||(Yc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&qc(n,t,r)),dl(e,t,n);break;case 21:dl(e,t,n);break;case 22:H=(r=H)||n.memoizedState!==null,dl(e,t,n),H=r;break;default:dl(e,t,n)}}function pl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Z(t,t.return,e)}}}function ml(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Z(t,t.return,e)}}function hl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new al),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new al),t;default:throw Error(a(435,e.tag))}}function gl(e,t){var n=hl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Yu.bind(null,e,t);t.then(r,r)}})}function _l(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){U=c.stateNode,ul=!1;break a}break;case 5:U=c.stateNode,ul=!1;break a;case 3:case 4:U=c.stateNode.containerInfo,ul=!0;break a}c=c.return}if(U===null)throw Error(a(160));fl(o,s,i),U=null,ul=!1,o=i.alternate,o!==null&&(o.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)yl(t,e),t=t.sibling}var vl=null;function yl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:_l(t,e),bl(e),r&4&&(Gc(3,e,e.return),Wc(3,e),Gc(5,e,e.return));break;case 1:_l(t,e),bl(e),r&512&&(H||n===null||Yc(n,n.return)),r&64&&rl&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var i=vl;if(_l(t,e),bl(e),r&512&&(H||n===null||Yc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null){if(r===null){if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,i=i.ownerDocument||i;b:switch(r){case`title`:o=i.getElementsByTagName(`title`)[0],(!o||o[Ct]||o[gt]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=i.createElement(r),i.head.insertBefore(o,i.querySelector(`head > title`))),Pd(o,r,n),o[gt]=e,k(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,i).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=i.createElement(r),Pd(o,r,n),i.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,i).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=i.createElement(r),Pd(o,r,n),i.head.appendChild(o);break;default:throw Error(a(468,r))}o[gt]=e,k(o),r=o}e.stateNode=r}else Hf(i,e.type,e.stateNode)}else e.stateNode=If(i,r,e.memoizedProps)}else o===r?r===null&&e.stateNode!==null&&Zc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(i,e.type,e.stateNode):If(i,r,e.memoizedProps))}break;case 27:_l(t,e),bl(e),r&512&&(H||n===null||Yc(n,n.return)),n!==null&&r&4&&Zc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(_l(t,e),bl(e),r&512&&(H||n===null||Yc(n,n.return)),e.flags&32){i=e.stateNode;try{en(i,``)}catch(t){Z(e,e.return,t)}}r&4&&e.stateNode!=null&&(i=e.memoizedProps,Zc(e,i,n===null?i:n.memoizedProps)),r&1024&&(il=!0);break;case 6:if(_l(t,e),bl(e),r&4){if(e.stateNode===null)throw Error(a(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Z(e,e.return,t)}}break;case 3:if(Bf=null,i=vl,vl=gf(t.containerInfo),_l(t,e),vl=i,bl(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Z(e,e.return,t)}il&&(il=!1,xl(e));break;case 4:r=vl,vl=gf(e.stateNode.containerInfo),_l(t,e),bl(e),vl=r;break;case 12:_l(t,e),bl(e);break;case 31:_l(t,e),bl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,gl(e,r)));break;case 13:_l(t,e),bl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(eu=Fe()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,gl(e,r)));break;case 22:i=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=rl,d=H;if(rl=u||i,H=d||l,_l(t,e),H=d,rl=u,bl(e),r&8192)a:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(n===null||l||rl||H||Cl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,i)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Z(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=i?``:l.memoizedProps}catch(e){Z(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;i?$d(m,!0):$d(l.stateNode,!1)}catch(e){Z(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,gl(e,n))));break;case 19:_l(t,e),bl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,gl(e,r)));break;case 30:break;case 21:break;default:_l(t,e),bl(e)}}function bl(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Qc(r)){n=r;break}r=r.return}if(n==null)throw Error(a(160));switch(n.tag){case 27:var i=n.stateNode;tl(e,$c(e),i);break;case 5:var o=n.stateNode;n.flags&32&&(en(o,``),n.flags&=-33),tl(e,$c(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;el(e,$c(e),s);break;default:throw Error(a(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function xl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;xl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Sl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)cl(e,t.alternate,t),t=t.sibling}function Cl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Gc(4,t,t.return),Cl(t);break;case 1:Yc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&qc(t,t.return,n),Cl(t);break;case 27:pf(t.stateNode);case 26:case 5:Yc(t,t.return),Cl(t);break;case 22:t.memoizedState===null&&Cl(t);break;case 30:Cl(t);break;default:Cl(t)}e=e.sibling}}function wl(e,t,n){for(n&&=!!(t.subtreeFlags&8772),t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:wl(i,a,n),Wc(4,a);break;case 1:if(wl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)no(c[i],s)}catch(e){Z(r,r.return,e)}}n&&o&64&&Kc(a),Jc(a,a.return);break;case 27:nl(a);case 26:case 5:wl(i,a,n),n&&r===null&&o&4&&Xc(a),Jc(a,a.return);break;case 12:wl(i,a,n);break;case 31:wl(i,a,n),n&&o&4&&pl(i,a);break;case 13:wl(i,a,n),n&&o&4&&ml(i,a);break;case 22:a.memoizedState===null&&wl(i,a,n),Jc(a,a.return);break;case 30:break;default:wl(i,a,n)}t=t.sibling}}function Tl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&ha(n))}function El(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ha(e))}function Dl(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Ol(e,t,n,r),t=t.sibling}function Ol(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:Dl(e,t,n,r),i&2048&&Wc(9,t);break;case 1:Dl(e,t,n,r);break;case 3:Dl(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ha(e)));break;case 12:if(i&2048){Dl(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Dl(e,t,n,r);break;case 31:Dl(e,t,n,r);break;case 13:Dl(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?Dl(e,t,n,r):(a._visibility|=2,kl(e,t,n,r,!!(t.subtreeFlags&10256)||!1)):a._visibility&2?Dl(e,t,n,r):Al(e,t),i&2048&&Tl(o,t);break;case 24:Dl(e,t,n,r),i&2048&&El(t.alternate,t);break;default:Dl(e,t,n,r)}}function kl(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:kl(a,o,s,c,i),Wc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,kl(a,o,s,c,i)):u._visibility&2?kl(a,o,s,c,i):Al(a,o),i&&l&2048&&Tl(o.alternate,o);break;case 24:kl(a,o,s,c,i),i&&l&2048&&El(o.alternate,o);break;default:kl(a,o,s,c,i)}t=t.sibling}}function Al(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Al(n,r),i&2048&&Tl(r.alternate,r);break;case 24:Al(n,r),i&2048&&El(r.alternate,r);break;default:Al(n,r)}t=t.sibling}}var jl=8192;function Ml(e,t,n){if(e.subtreeFlags&jl)for(e=e.child;e!==null;)Nl(e,t,n),e=e.sibling}function Nl(e,t,n){switch(e.tag){case 26:Ml(e,t,n),e.flags&jl&&e.memoizedState!==null&&Gf(n,vl,e.memoizedState,e.memoizedProps);break;case 5:Ml(e,t,n);break;case 3:case 4:var r=vl;vl=gf(e.stateNode.containerInfo),Ml(e,t,n),vl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=jl,jl=16777216,Ml(e,t,n),jl=r):Ml(e,t,n));break;default:Ml(e,t,n)}}function Pl(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Fl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];ol=r,Rl(r,e)}Pl(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Il(e),e=e.sibling}function Il(e){switch(e.tag){case 0:case 11:case 15:Fl(e),e.flags&2048&&Gc(9,e,e.return);break;case 3:Fl(e);break;case 12:Fl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Ll(e)):Fl(e);break;default:Fl(e)}}function Ll(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];ol=r,Rl(r,e)}Pl(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Gc(8,t,t.return),Ll(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Ll(t));break;default:Ll(t)}e=e.sibling}}function Rl(e,t){for(;ol!==null;){var n=ol;switch(n.tag){case 0:case 11:case 15:Gc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:ha(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,ol=r;else a:for(n=e;ol!==null;){r=ol;var i=r.sibling,a=r.return;if(ll(r),r===n){ol=null;break a}if(i!==null){i.return=a,ol=i;break a}ol=a}}}var zl={getCacheForType:function(e){var t=ca(N),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return ca(N).controller.signal}},Bl=typeof WeakMap==`function`?WeakMap:Map,W=0,G=null,K=null,q=0,J=0,Vl=null,Hl=!1,Ul=!1,Wl=!1,Gl=0,Y=0,Kl=0,ql=0,Jl=0,Yl=0,Xl=0,Zl=null,Ql=null,$l=!1,eu=0,tu=0,nu=1/0,ru=null,iu=null,X=0,au=null,ou=null,su=0,cu=0,lu=null,uu=null,du=0,fu=null;function pu(){return W&2&&q!==0?q&-q:T.T===null?pt():dd()}function mu(){if(Yl===0){if(!(q&536870912)||M){var e=Qe;Qe<<=1,!(Qe&3932160)&&(Qe=262144),Yl=e}else Yl=536870912}return e=lo.current,e!==null&&(e.flags|=32),Yl}function hu(e,t,n){(e===G&&(J===2||J===9)||e.cancelPendingCommit!==null)&&(Su(e,0),yu(e,q,Yl,!1)),ot(e,n),(!(W&2)||e!==G)&&(e===G&&(!(W&2)&&(ql|=n),Y===4&&yu(e,q,Yl,!1)),rd(e))}function gu(e,t,n){if(W&6)throw Error(a(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||nt(e,t),i=r?Au(e,t):Ou(e,t,!0),o=r;do{if(i===0){Ul&&!r&&yu(e,t,0,!1);break}if(n=e.current.alternate,o&&!vu(n)){i=Ou(e,t,!1),o=!1;continue}if(i===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;i=Zl;var l=c.current.memoizedState.isDehydrated;if(l&&(Su(c,s).flags|=256),s=Ou(c,s,!1),s!==2){if(Wl&&!l){c.errorRecoveryDisabledLanes|=o,ql|=o,i=4;break a}o=Ql,Ql=i,o!==null&&(Ql===null?Ql=o:Ql.push.apply(Ql,o))}i=s}if(o=!1,i!==2)continue}}if(i===1){Su(e,0),yu(e,t,0,!0);break}a:{switch(r=e,o=i,o){case 0:case 1:throw Error(a(345));case 4:if((t&4194048)!==t)break;case 6:yu(r,t,Yl,!Hl);break a;case 2:Ql=null;break;case 3:case 5:break;default:throw Error(a(329))}if((t&62914560)===t&&(i=eu+300-Fe(),10<i)){if(yu(r,t,Yl,!Hl),tt(r,0,!0)!==0)break a;su=t,r.timeoutHandle=Kd(_u.bind(null,r,n,Ql,ru,$l,t,Yl,ql,Xl,Hl,o,`Throttled`,-0,0),i);break a}_u(r,n,Ql,ru,$l,t,Yl,ql,Xl,Hl,o,null,-0,0)}break}while(1);rd(e)}function _u(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ln},Nl(t,a,d);var m=(a&62914560)===a?eu-Fe():(a&4194048)===a?tu-Fe():0;if(m=qf(d,m),m!==null){su=a,e.cancelPendingCommit=m(Lu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),yu(e,a,o,!l);return}}Lu(e,t,a,n,r,i,o,s,c)}function vu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!jr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function yu(e,t,n,r){t&=~Jl,t&=~ql,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-qe(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ct(e,n,t)}function bu(){return W&6?!0:(id(0,!1),!1)}function xu(){if(K!==null){if(J===0)var e=K.return;else e=K,ea=$i=null,No(e),Ra=null,za=0,e=K;for(;e!==null;)Uc(e.alternate,e),e=e.return;K=null}}function Su(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),su=0,xu(),G=e,K=n=yi(e.current,null),q=t,J=0,Vl=null,Hl=!1,Ul=nt(e,t),Wl=!1,Xl=Yl=Jl=ql=Kl=Y=0,Ql=Zl=null,$l=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-qe(r),a=1<<i;t|=e[i],r&=~a}return Gl=t,li(),n}function Cu(e,t){F=null,T.H=Hs,t===Oa||t===Aa?(t=Ia(),J=3):t===ka?(t=Ia(),J=4):J=t===oc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Vl=t,K===null&&(Y=1,ec(e,Di(t,e.current)))}function wu(){var e=lo.current;return e===null?!0:(q&4194048)===q?uo===null:(q&62914560)===q||q&536870912?e===uo:!1}function Tu(){var e=T.H;return T.H=Hs,e===null?Hs:e}function Eu(){var e=T.A;return T.A=zl,e}function Du(){Y=4,Hl||(q&4194048)!==q&&lo.current!==null||(Ul=!0),!(Kl&134217727)&&!(ql&134217727)||G===null||yu(G,q,Yl,!1)}function Ou(e,t,n){var r=W;W|=2;var i=Tu(),a=Eu();(G!==e||q!==t)&&(ru=null,Su(e,t)),t=!1;var o=Y;a:do try{if(J!==0&&K!==null){var s=K,c=Vl;switch(J){case 8:xu(),o=6;break a;case 3:case 2:case 9:case 6:lo.current===null&&(t=!0);var l=J;if(J=0,Vl=null,Pu(e,s,c,l),n&&Ul){o=0;break a}break;default:l=J,J=0,Vl=null,Pu(e,s,c,l)}}ku(),o=Y;break}catch(t){Cu(e,t)}while(1);return t&&e.shellSuspendCounter++,ea=$i=null,W=r,T.H=i,T.A=a,K===null&&(G=null,q=0,li()),o}function ku(){for(;K!==null;)Mu(K)}function Au(e,t){var n=W;W|=2;var r=Tu(),i=Eu();G!==e||q!==t?(ru=null,nu=Fe()+500,Su(e,t)):Ul=nt(e,t);a:do try{if(J!==0&&K!==null){t=K;var o=Vl;b:switch(J){case 1:J=0,Vl=null,Pu(e,t,o,1);break;case 2:case 9:if(Ma(o)){J=0,Vl=null,Nu(t);break}t=function(){J!==2&&J!==9||G!==e||(J=7),rd(e)},o.then(t,t);break a;case 3:J=7;break a;case 4:J=5;break a;case 7:Ma(o)?(J=0,Vl=null,Nu(t)):(J=0,Vl=null,Pu(e,t,o,7));break;case 5:var s=null;switch(K.tag){case 26:s=K.memoizedState;case 5:case 27:var c=K;if(s?Wf(s):c.stateNode.complete){J=0,Vl=null;var l=c.sibling;if(l!==null)K=l;else{var u=c.return;u===null?K=null:(K=u,Fu(u))}break b}}J=0,Vl=null,Pu(e,t,o,5);break;case 6:J=0,Vl=null,Pu(e,t,o,6);break;case 8:xu(),Y=6;break a;default:throw Error(a(462))}}ju();break}catch(t){Cu(e,t)}while(1);return ea=$i=null,T.H=r,T.A=i,W=n,K===null?(G=null,q=0,li(),Y):0}function ju(){for(;K!==null&&!Ne();)Mu(K)}function Mu(e){var t=Fc(e.alternate,e,Gl);e.memoizedProps=e.pendingProps,t===null?Fu(e):K=t}function Nu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=yc(n,t,t.pendingProps,t.type,void 0,q);break;case 11:t=yc(n,t,t.pendingProps,t.type.render,t.ref,q);break;case 5:No(t);default:Uc(n,t),t=K=bi(t,Gl),t=Fc(n,t,Gl)}e.memoizedProps=e.pendingProps,t===null?Fu(e):K=t}function Pu(e,t,n,r){ea=$i=null,No(t),Ra=null,za=0;var i=t.return;try{if(ac(e,i,t,n,q)){Y=1,ec(e,Di(n,e.current)),K=null;return}}catch(t){if(i!==null)throw K=i,t;Y=1,ec(e,Di(n,e.current)),K=null;return}t.flags&32768?(M||r===1?e=!0:Ul||q&536870912?e=!1:(Hl=e=!0,(r===2||r===9||r===3||r===6)&&(r=lo.current,r!==null&&r.tag===13&&(r.flags|=16384))),Iu(t,e)):Fu(t)}function Fu(e){var t=e;do{if(t.flags&32768){Iu(t,Hl);return}e=t.return;var n=Vc(t.alternate,t,Gl);if(n!==null){K=n;return}if(t=t.sibling,t!==null){K=t;return}K=t=e}while(t!==null);Y===0&&(Y=5)}function Iu(e,t){do{var n=Hc(e.alternate,e);if(n!==null){n.flags&=32767,K=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){K=e;return}K=e=n}while(e!==null);Y=6,K=null}function Lu(e,t,n,r,i,o,s,c,l){e.cancelPendingCommit=null;do Hu();while(X!==0);if(W&6)throw Error(a(327));if(t!==null){if(t===e.current)throw Error(a(177));if(o=t.lanes|t.childLanes,o|=ci,st(e,n,o,s,c,l),e===G&&(K=G=null,q=0),ou=t,au=e,su=n,cu=o,lu=i,uu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Xu(ze,function(){return Uu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=T.T,T.T=null,i=E.p,E.p=2,s=W,W|=4;try{sl(e,t,n)}finally{W=s,E.p=i,T.T=r}}X=1,Ru(),zu(),Bu()}}function Ru(){if(X===1){X=0;var e=au,t=ou,n=!!(t.flags&13878);if(t.subtreeFlags&13878||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=W;W|=4;try{yl(t,e);var a=zd,o=Ir(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Fr(s.ownerDocument.documentElement,s)){if(c!==null&&Lr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Pr(s,h),v=Pr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{W=i,E.p=r,T.T=n}}e.current=t,X=2}}function zu(){if(X===2){X=0;var e=au,t=ou,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=W;W|=4;try{cl(e,t.alternate,t)}finally{W=i,E.p=r,T.T=n}}X=3}}function Bu(){if(X===4||X===3){X=0,Pe();var e=au,t=ou,n=su,r=uu;t.subtreeFlags&10256||t.flags&10256?X=5:(X=0,ou=au=null,Vu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(iu=null),ft(n),t=t.stateNode,Ge&&typeof Ge.onCommitFiberRoot==`function`)try{Ge.onCommitFiberRoot(We,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=T.T,i=E.p,E.p=2,T.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{T.T=t,E.p=i}}su&3&&Hu(),rd(e),i=e.pendingLanes,n&261930&&i&42?e===fu?du++:(du=0,fu=e):du=0,id(0,!1)}}function Vu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ha(t)))}function Hu(){return Ru(),zu(),Bu(),Uu()}function Uu(){if(X!==5)return!1;var e=au,t=cu;cu=0;var n=ft(su),r=T.T,i=E.p;try{E.p=32>n?32:n,T.T=null,n=lu,lu=null;var o=au,s=su;if(X=0,ou=au=null,su=0,W&6)throw Error(a(331));var c=W;if(W|=4,Il(o.current),Ol(o,o.current,s,n),W=c,id(0,!1),Ge&&typeof Ge.onPostCommitFiberRoot==`function`)try{Ge.onPostCommitFiberRoot(We,o)}catch{}return!0}finally{E.p=i,T.T=r,Vu(e,t)}}function Wu(e,t,n){t=Di(n,t),t=nc(e.stateNode,t,2),e=Xa(e,t,2),e!==null&&(ot(e,2),rd(e))}function Z(e,t,n){if(e.tag===3)Wu(e,e,n);else for(;t!==null;){if(t.tag===3){Wu(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(iu===null||!iu.has(r))){e=Di(n,e),n=rc(2),r=Xa(t,n,2),r!==null&&(ic(n,r,t,e),ot(r,2),rd(r));break}}t=t.return}}function Gu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Bl;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Wl=!0,i.add(n),e=Ku.bind(null,e,t,n),t.then(e,e))}function Ku(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,G===e&&(q&n)===n&&(Y===4||Y===3&&(q&62914560)===q&&300>Fe()-eu?!(W&2)&&Su(e,0):Jl|=n,Xl===q&&(Xl=0)),rd(e)}function qu(e,t){t===0&&(t=it()),e=fi(e,t),e!==null&&(ot(e,t),rd(e))}function Ju(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),qu(e,n)}function Yu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(a(314))}r!==null&&r.delete(t),qu(e,n)}function Xu(e,t){return je(e,t)}var Zu=null,Qu=null,$u=!1,ed=!1,td=!1,nd=0;function rd(e){e!==Qu&&e.next===null&&(Qu===null?Zu=Qu=e:Qu=Qu.next=e),ed=!0,$u||($u=!0,ud())}function id(e,t){if(!td&&ed){td=!0;do for(var n=!1,r=Zu;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-qe(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,ld(r,a))}else a=q,a=tt(r,r===G?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||nt(r,a)||(n=!0,ld(r,a))}r=r.next}while(n);td=!1}}function ad(){od()}function od(){ed=$u=!1;var e=0;nd!==0&&Gd()&&(e=nd);for(var t=Fe(),n=null,r=Zu;r!==null;){var i=r.next,a=sd(r,t);a===0?(r.next=null,n===null?Zu=i:n.next=i,i===null&&(Qu=n)):(n=r,(e!==0||a&3)&&(ed=!0)),r=i}X!==0&&X!==5||id(e,!1),nd!==0&&(nd=0)}function sd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-qe(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=rt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=G,n=q,n=tt(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(J===2||J===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Me(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||nt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Me(r),ft(n)){case 2:case 8:n=Re;break;case 32:n=ze;break;case 268435456:n=Ve;break;default:n=ze}return r=cd.bind(null,e),n=je(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Me(r),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(X!==0&&X!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Hu()&&e.callbackNode!==n)return null;var r=q;return r=tt(e,e===G?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(gu(e,r,t),sd(e,Fe()),e.callbackNode!=null&&e.callbackNode===n?cd.bind(null,e):null)}function ld(e,t){if(Hu())return null;gu(e,t,!0)}function ud(){Yd(function(){W&6?je(Le,ad):od()})}function dd(){if(nd===0){var e=va;e===0&&(e=Ze,Ze<<=1,!(Ze&261888)&&(Ze=256)),nd=e}return nd}function fd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:cn(``+e)}function pd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function md(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=fd((i[_t]||null).action),o=r.submitter;o&&(t=(t=o[_t]||null)?fd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new An(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(nd!==0){var e=o?pd(i,o):new FormData(i);Os(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?pd(i,o):new FormData(i),Os(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var hd=0;hd<ri.length;hd++){var gd=ri[hd];ii(gd.toLowerCase(),`on`+(gd[0].toUpperCase()+gd.slice(1)))}ii(Yr,`onAnimationEnd`),ii(Xr,`onAnimationIteration`),ii(Zr,`onAnimationStart`),ii(`dblclick`,`onDoubleClick`),ii(`focusin`,`onFocus`),ii(`focusout`,`onBlur`),ii(Qr,`onTransitionRun`),ii($r,`onTransitionStart`),ii(ei,`onTransitionCancel`),ii(ti,`onTransitionEnd`),Mt(`onMouseEnter`,[`mouseout`,`mouseover`]),Mt(`onMouseLeave`,[`mouseout`,`mouseover`]),Mt(`onPointerEnter`,[`pointerout`,`pointerover`]),Mt(`onPointerLeave`,[`pointerout`,`pointerover`]),jt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),jt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),jt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),jt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var _d=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),vd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(_d));function yd(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ai(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ai(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[yt];n===void 0&&(n=t[yt]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,kt.forEach(function(t){t!==`selectionchange`&&(vd.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!yn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===i)break;if(o===4)for(o=r.return;o!==null;){var c=o.tag;if((c===3||c===4)&&o.stateNode.containerInfo===i)return;o=o.return}for(;s!==null;){if(o=Tt(s),o===null)return;if(c=o.tag,c===5||c===6||c===26||c===27){r=a=o;continue a}s=s.parentNode}}r=r.return}gn(function(){var r=a,i=dn(n),o=[];a:{var s=ni.get(e);if(s!==void 0){var c=An,u=e;switch(e){case`keypress`:if(Tn(n)===0)break a;case`keydown`:case`keyup`:c=Jn;break;case`focusin`:u=`focus`,c=zn;break;case`focusout`:u=`blur`,c=zn;break;case`beforeblur`:case`afterblur`:c=zn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:c=Ln;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:c=Rn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:c=Xn;break;case Yr:case Xr:case Zr:c=Bn;break;case ti:c=Zn;break;case`scroll`:case`scrollend`:c=Mn;break;case`wheel`:c=Qn;break;case`copy`:case`cut`:case`paste`:c=Vn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:c=Yn;break;case`toggle`:case`beforetoggle`:c=$n}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?s===null?null:s+`Capture`:s;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=_n(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(s=new c(s,u,null,n,i),o.push({event:s,listeners:d}))}}if(!(t&7)){a:{if(s=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,s&&n!==un&&(u=n.relatedTarget||n.fromElement)&&(Tt(u)||u[vt]))break a;if((c||s)&&(s=i.window===i?i:(s=i.ownerDocument)?s.defaultView||s.parentWindow:window,c?(u=n.relatedTarget||n.toElement,c=r,u=u?Tt(u):null,u!==null&&(f=l(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(c=null,u=r),c!==u)){if(d=Ln,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Yn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?s:Dt(c),h=u==null?s:Dt(u),s=new d(g,m+`leave`,c,n,i),s.target=f,s.relatedTarget=h,g=null,Tt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,c&&u)b:{for(d=Dd,p=c,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;c!==null&&Od(o,s,c,d,!1),u!==null&&f!==null&&Od(o,f,u,d,!0)}}a:{if(s=r?Dt(r):window,c=s.nodeName&&s.nodeName.toLowerCase(),c===`select`||c===`input`&&s.type===`file`)var v=yr;else if(pr(s)){if(br)v=kr;else{v=Dr;var y=Er}}else c=s.nodeName,!c||c.toLowerCase()!==`input`||s.type!==`checkbox`&&s.type!==`radio`?r&&an(r.elementType)&&(v=yr):v=Or;if(v&&=v(e,r)){mr(o,v,n,i);break a}y&&y(e,s,r),e===`focusout`&&r&&s.type===`number`&&r.memoizedProps.value!=null&&Xt(s,`number`,s.value)}switch(y=r?Dt(r):window,e){case`focusin`:(pr(y)||y.contentEditable===`true`)&&(zr=y,Br=r,Vr=null);break;case`focusout`:Vr=Br=zr=null;break;case`mousedown`:Hr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Hr=!1,Ur(o,n,i);break;case`selectionchange`:if(Rr)break;case`keydown`:case`keyup`:Ur(o,n,i)}var b;if(tr)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else lr?sr(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(ir&&n.locale!==`ko`&&(lr||x!==`onCompositionStart`?x===`onCompositionEnd`&&lr&&(b=wn()):(xn=i,Sn=`value`in xn?xn.value:xn.textContent,lr=!0)),y=Ed(r,x),0<y.length&&(x=new Hn(x,e,null,n,i),o.push({event:x,listeners:y}),b?x.data=b:(b=cr(n),b!==null&&(x.data=b)))),(b=rr?ur(e,n):dr(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new Hn(`onBeforeInput`,`beforeinput`,null,n,i),o.push({event:y,listeners:x}),y.data=b)),md(o,e,r,n,i)}yd(o,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=_n(e,n),i!=null&&r.unshift(Td(e,i,a)),i=_n(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=_n(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=_n(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function $(e,t,n,r,i,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||en(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&en(e,``+r);break;case`className`:Rt(e,`class`,r);break;case`tabIndex`:Rt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Rt(e,n,r);break;case`style`:rn(e,r,o);break;case`data`:if(t!==`object`){Rt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=cn(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,i.name,i,null),$(e,t,`formEncType`,i.formEncType,i,null),$(e,t,`formMethod`,i.formMethod,i,null),$(e,t,`formTarget`,i.formTarget,i,null)):($(e,t,`encType`,i.encType,i,null),$(e,t,`method`,i.method,i,null),$(e,t,`target`,i.target,i,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=cn(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=ln);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(a(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(a(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=cn(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),Lt(e,`popover`,r);break;case`xlinkActuate`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Lt(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=on.get(n)||n,Lt(e,n,r))}}function Nd(e,t,n,r,i,o){switch(n){case`style`:rn(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(a(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(a(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?en(e,r):(typeof r==`number`||typeof r==`bigint`)&&en(e,``+r);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=ln);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!At.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(i=n.endsWith(`Capture`),t=n.slice(2,i?n.length-7:void 0),o=e[_t]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,i),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,i);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):Lt(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,i=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:i=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(a(137,t));default:$(e,t,o,s,n,null)}}i&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=i=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:i=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(a(137,t));break;default:$(e,t,r,d,n,null)}}Yt(e,o,c,l,u,s,i,!1);return;case`select`:for(i in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(i)&&(c=n[i],c!=null))switch(i){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,i,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Zt(e,!!r,n,!0):Zt(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=i=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:i=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(a(91));break;default:$(e,t,s,c,n,null)}$t(e,r,i,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<_d.length;r++)Q(_d[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(a(137,t));default:$(e,t,u,r,n,null)}return;default:if(an(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var i=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:i=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(a(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}Jt(e,s,c,l,u,d,o,i);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(i in r)if(o=r[i],l=n[i],r.hasOwnProperty(i)&&(o!=null||l!=null))switch(i){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&$(e,t,i,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Zt(e,!!n,n?[]:``,!1):Zt(e,!!n,t,!0)):Zt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(i=n[c],n.hasOwnProperty(c)&&i!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,i)}for(s in r)if(i=r[s],o=n[s],r.hasOwnProperty(s)&&(i!=null||o!=null))switch(s){case`value`:p=i;break;case`defaultValue`:m=i;break;case`children`:break;case`dangerouslySetInnerHTML`:if(i!=null)throw Error(a(91));break;default:i!==o&&$(e,t,s,i,r,o)}Qt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(a(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(an(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e!==Wd&&(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Ct]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body)}n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),wt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[Ct])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(a(452));return e;case`head`:if(e=t.head,!e)throw Error(a(453));return e;case`body`:if(e=t.body,!e)throw Error(a(454));return e;default:throw Error(a(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);wt(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=E.d;E.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=bu();return e||t}function yf(e){var t=Et(e);t!==null&&t.tag===5&&t.type===`form`?As(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=qt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),k(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+qt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+qt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+qt(n.imageSizes)+`"]`)):i+=`[href="`+qt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=h({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),k(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+qt(r)+`"][href="`+qt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=h({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),k(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=Ot(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=h({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);k(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=Ot(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=h({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),k(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=Ot(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=h({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),k(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var i=(i=_e.current)?gf(i):null;if(!i)throw Error(a(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=Ot(i).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=Ot(i).hoistableStyles,s=o.get(e);if(s||(i=i.ownerDocument||i,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=i.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(i,e,n,s.state))),t&&r===null)throw Error(a(528,``));return s}if(t&&r!==null)throw Error(a(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=Ot(i).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(a(444,e))}}function Af(e){return`href="`+qt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return h({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),k(t),e.head.appendChild(t))}function Pf(e){return`[src="`+qt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+qt(n.href)+`"]`);if(r)return t.instance=r,k(r),r;var i=h({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),k(r),Pd(r,`style`,i),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:i=Af(n.href);var o=e.querySelector(jf(i));if(o)return t.state.loading|=4,t.instance=o,k(o),o;r=Mf(n),(i=mf.get(i))&&Rf(r,i),o=(e.ownerDocument||e).createElement(`link`),k(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Pd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(i=e.querySelector(Ff(o)))?(t.instance=i,k(i),i):(r=n,(i=mf.get(o))&&(r=h({},n),zf(r,i)),e=e.ownerDocument||e,i=e.createElement(`script`),k(i),Pd(i,`link`,r),e.head.appendChild(i),t.instance=i);case`void`:return null;default:throw Error(a(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Ct]||a[gt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,k(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),k(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:S,Provider:null,Consumer:null,_currentValue:de,_currentValue2:de,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=at(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=at(0),this.hiddenUpdates=at(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=_i(3,null,null,t),e.current=a,a.stateNode=e,t=ma(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},qa(a),e}function tp(e){return e?(e=hi,e):hi}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Ya(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Xa(e,r,t),n!==null&&(hu(n,e,t),Za(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=fi(e,67108864);t!==null&&hu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=pu();t=dt(t);var n=fi(e,t);n!==null&&hu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=2,up(e,t,n,r)}finally{E.p=a,T.T=i}}function lp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=8,up(e,t,n,r)}finally{E.p=a,T.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=Et(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=et(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-qe(o);s.entanglements[1]|=c,o&=~c}rd(a),!(W&6)&&(nu=Fe()+500,id(0,!1))}}break;case 31:case 13:s=fi(a,2),s!==null&&hu(s,a,2),bu(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=dn(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=Tt(e),e!==null){var t=l(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=u(t),e!==null)return e;e=null}else if(n===31){if(e=d(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ie()){case Le:return 2;case Re:return 8;case ze:case Be:return 32;case Ve:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Et(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=Tt(e.target);if(t!==null){var n=l(t);if(n!==null){if(t=n.tag,t===13){if(t=u(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===31){if(t=d(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);un=r,n.target.dispatchEvent(r),un=null}else return t=Et(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=Et(n);a!==null&&(e.splice(t,3),t-=3,Os(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[_t]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[_t]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(a(409));var n=t.current;np(n,pu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),bu(),t[vt]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=pt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.8`)throw Error(a(527,Lp,`19.2.8`));E.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(a(188)):(e=Object.keys(e).join(`,`),Error(a(268,e)));return e=p(t),e=e===null?null:m(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.8`,rendererPackageName:`react-dom`,currentDispatcherRef:T,reconcilerVersion:`19.2.8`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{We=zp.inject(Rp),Ge=zp}catch{}}e.createRoot=function(e,t){if(!s(e))throw Error(a(299));var n=!1,r=``,i=Zs,o=Qs,c=$s;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(o=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,i,o,c,Pp),e[vt]=t.current,Sd(e),new Fp(t)}})),u=t(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=l()})),d=i(),f=u(),p=t((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),m=t(((e,t)=>{t.exports=p()})),h=m(),g=0;function _(e,t){return`${e} × ${t}`}function v(e,t){return g+=1,`#${g} ${e} × ${t}`}function y({name:e,count:t}){let n=t>1?`${t} 件商品`:`1 件商品`;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`strong`,{children:e}),(0,h.jsxs)(`span`,{style:{color:`var(--text-muted)`},children:[` · `,n]})]})}function b({name:e,count:t}){return(0,h.jsxs)(`div`,{style:{padding:`16px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:`var(--bg-surface-secondary)`},children:[(0,h.jsx)(`div`,{style:{marginBottom:`10px`,fontSize:`12px`,color:`var(--text-subtle)`},children:`App → ComponentJsxPureRenderDemo → ComponentTreeCard → ProductSummary`}),(0,h.jsx)(y,{name:e,count:t})]})}function x(){let[e,t]=(0,d.useState)(`React 实战手册`),[n,r]=(0,d.useState)(2),[i,a]=(0,d.useState)([]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧱`}),` Component、JSX 与纯渲染模型`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`React UI 基础`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 组件本质上是描述 UI 的 JavaScript 函数。组件读取 Props、State、Context 等输入， 返回 JSX 描述；React 假设渲染阶段保持纯净：`,(0,h.jsx)(`strong`,{children:`相同输入应得到相同的 JSX 结果`}),`， 并且不能在 render 中修改组件外部已经存在的数据。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Component = UI Building Block`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`JSX = UI Description`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Same Input → Same Output`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🌳`}),` 实验 1：组件树、JSX 表达式与 Fragment`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`修改输入，观察 Props 如何沿组件树传递。`,(0,h.jsx)(`code`,{children:`ProductSummary`}),` 使用 Fragment 返回多个并列节点， JSX 中的 JavaScript 表达式负责派生显示文本。`]})]}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`14px`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`10px`},children:[(0,h.jsx)(`input`,{className:`form-input`,style:{flex:`1 1 280px`},value:e,onChange:e=>t(e.target.value),"aria-label":`商品名称`}),(0,h.jsxs)(`select`,{className:`form-input`,style:{width:`140px`},value:n,onChange:e=>r(Number(e.target.value)),"aria-label":`商品数量`,children:[(0,h.jsx)(`option`,{value:1,children:`1 件`}),(0,h.jsx)(`option`,{value:2,children:`2 件`}),(0,h.jsx)(`option`,{value:3,children:`3 件`})]})]}),(0,h.jsx)(b,{name:e||`未命名商品`,count:n})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`组件树与模块树不是一回事`}),(0,h.jsx)(`div`,{children:`组件树描述“这次 UI 中谁渲染了谁”；模块树描述 JavaScript 文件之间的 import 依赖。 一个组件可以被多个组件复用，因此运行时组件树和源码模块结构通常不会一一对应。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 实验 2：为什么 Render 必须保持纯净`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击按钮模拟 React 可能发生的重复 render。这里不会真的在组件 render 中制造副作用，而是安全地调用两类计算函数，观察相同输入连续执行两次的差异。`})]}),(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>{let t=_(e,n),r=_(e,n),i=v(e,n),o=v(e,n);a([{label:`纯计算 #1`,value:t,stable:!0},{label:`纯计算 #2`,value:r,stable:!0},{label:`非纯计算 #1`,value:i,stable:!1},{label:`非纯计算 #2`,value:o,stable:!1}])},children:`模拟相同输入重复 Render 两次`}),i.length>0&&(0,h.jsx)(`div`,{className:`demo-grid-2`,style:{marginTop:`16px`},children:i.map(e=>(0,h.jsxs)(`div`,{style:{padding:`14px 16px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:`var(--bg-surface-secondary)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:`12px`},children:[(0,h.jsx)(`strong`,{children:e.label}),(0,h.jsx)(`span`,{className:`badge ${e.stable?`badge-green`:`badge-red`}`,children:e.stable?`结果稳定`:`结果漂移`})]}),(0,h.jsx)(`code`,{style:{display:`block`,marginTop:`10px`},children:e.value})]},e.label))}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`为什么 React 强调 Purity？`}),(0,h.jsx)(`div`,{children:`React 在开发环境的 StrictMode 中会额外调用组件函数来帮助发现非纯逻辑；并发渲染也可能暂停、丢弃或重新开始一次 render。 因此 render 只能计算 JSX。网络请求、写日志服务、修改 DOM、写外部变量等副作用应放在事件处理器，确实由“组件正在显示”驱动的外部同步再考虑 Effect。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🏗️`}),` 真实项目中的组件边界`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,style:{margin:0},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`✅ 适合拆成组件`}),(0,h.jsx)(`div`,{children:`可复用的 UI 单元、职责明确的业务区块、需要独立维护或测试的交互边界。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,style:{margin:0},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ 避免机械拆分`}),(0,h.jsx)(`div`,{children:`不要因为“每个 div 都应该是组件”而制造大量只有一行 JSX、没有独立语义的包装组件。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 本章心智模型`]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{children:`Component = 输入 → JSX 描述。`}),` JSX 不是 HTML 字符串，而是 JavaScript 中的 UI 描述语法； 渲染阶段只做计算，副作用离开 render。只要先守住这条边界，后面的 State、Effect、并发渲染和性能优化都会更容易理解。`]})]})]})}function ee({name:e,role:t=`普通成员`,isOnline:n}){let r=e?e.trim().charAt(0).toUpperCase():`?`;return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,padding:`16px`,backgroundColor:`var(--bg-surface)`,boxShadow:`var(--shadow-xs)`,transition:`all var(--transition-fast)`,display:`flex`,alignItems:`center`,gap:`14px`},children:[(0,h.jsxs)(`div`,{style:{position:`relative`},children:[(0,h.jsx)(`div`,{style:{width:`44px`,height:`44px`,borderRadius:`50%`,backgroundColor:`var(--color-primary-light)`,color:`var(--color-primary)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:`700`,fontSize:`18px`,border:`1px solid var(--color-primary-border)`},children:r}),(0,h.jsx)(`span`,{style:{position:`absolute`,bottom:`0`,right:`0`,width:`12px`,height:`12px`,borderRadius:`50%`,backgroundColor:n?`var(--color-success)`:`var(--text-subtle)`,border:`2px solid #fff`},title:n?`在线`:`离线`})]}),(0,h.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,marginBottom:`4px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`15px`,color:`var(--text-main)`,fontWeight:`600`},children:e}),(0,h.jsx)(`span`,{style:{fontSize:`11px`,padding:`1px 6px`,borderRadius:`var(--radius-xs)`,backgroundColor:`var(--bg-surface-secondary)`,color:`var(--text-muted)`,border:`1px solid var(--border-color)`},children:t})]}),(0,h.jsx)(`div`,{style:{fontSize:`12.5px`,color:n?`var(--color-success-text)`:`var(--text-subtle)`},children:n?`🟢 当前在线`:`⚪ 离线`})]})]})}function S({title:e=`暂无标题`,price:t=0,discount:n=1,tags:r=[]}){let i=t*n,a=n<1;return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,padding:`16px`,backgroundColor:`var(--bg-surface)`,boxShadow:`var(--shadow-xs)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`,gap:`12px`,transition:`all var(--transition-fast)`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,gap:`8px`},children:[(0,h.jsx)(`strong`,{style:{fontSize:`15px`,color:`var(--text-main)`,fontWeight:`600`},children:e}),a&&(0,h.jsxs)(`span`,{className:`badge badge-amber`,style:{fontSize:`11px`},children:[(n*10).toFixed(1).replace(/\.0$/,``),` 折`]})]}),(0,h.jsxs)(`div`,{style:{marginTop:`8px`,display:`flex`,alignItems:`baseline`,gap:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`18px`,fontWeight:`700`,color:`var(--color-danger)`},children:[`¥`,i.toFixed(2)]}),a&&(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,textDecoration:`line-through`},children:[`¥`,t.toFixed(2)]})]})]}),r.length>0&&(0,h.jsx)(`div`,{style:{display:`flex`,gap:`6px`,flexWrap:`wrap`,paddingTop:`8px`,borderTop:`1px solid var(--border-subtle)`},children:r.map(e=>(0,h.jsxs)(`span`,{className:`badge badge-gray`,style:{fontSize:`11px`},children:[`#`,e]},e))})]})}function C(){let[e,t]=(0,d.useState)(`张三`),[n,r]=(0,d.useState)(`前端架构师`),[i,a]=(0,d.useState)(!0),[o,s]=(0,d.useState)(99),[c,l]=(0,d.useState)(.8),u={name:`管理员 Alex`,role:`超级管理员`,isOnline:!0},f={title:`高品质有机蓝莓`,price:36,discount:.9,tags:[`时令优选`,`冷链配送`]};return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` Props 基础传递、解构与派生计算`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`单向数据流`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Props（属性）是父组件向子组件单向传递的只读输入参数。本 Demo 演示参数解构、默认值回退机制、展开语法（Spread Props）以及如何利用纯函数衍生计算替代多余的 State。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`只读性（Read-only）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`默认值解构（Default Props）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`JSX 展开语法（...props）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`衍生状态（Derived Value）`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 实时交互试验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`调整输入项，观察子组件如何根据传入的 Props 发生响应式重新渲染：`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:`16px`,backgroundColor:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{margin:`0 0 12px 0`,fontSize:`14px`},children:`控制面板（父组件状态）`}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`用户姓名：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,value:e,onChange:e=>t(e.target.value)})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`用户角色：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,value:n,onChange:e=>r(e.target.value)})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,marginTop:`4px`},children:[(0,h.jsx)(`input`,{type:`checkbox`,id:`online-toggle`,checked:i,onChange:e=>a(e.target.checked),style:{width:`16px`,height:`16px`,cursor:`pointer`}}),(0,h.jsx)(`label`,{htmlFor:`online-toggle`,style:{fontSize:`13px`,cursor:`pointer`},children:`标记为在线状态 (isOnline)`})]})]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h4`,{style:{margin:`0 0 12px 0`,fontSize:`14px`,color:`var(--text-muted)`},children:`子组件接收 Props 渲染结果`}),(0,h.jsx)(ee,{name:e||`（空名称）`,role:n,isOnline:i})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`👤`}),` 用户卡片（UserCard）解构与默认值场景`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`演示常规显式传参、未传参数自动触发形参默认值（role = "普通成员"），以及展开语法批量入参。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-3`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 A：显式完整传参`}),(0,h.jsx)(ee,{name:`李雷`,role:`高级产品经理`,isOnline:!0})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 B：未传 role（默认值生效）`}),(0,h.jsx)(ee,{name:`韩梅梅`,isOnline:!1})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:"场景 C：展开语法 `{...adminData}`"}),(0,h.jsx)(ee,{...u})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🛍️`}),` 商品卡片（ProductCard）衍生计算与列表渲染`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`演示实际折后价 `,(0,h.jsx)(`code`,{children:`price * discount`}),` 衍生计算，严禁在子组件直接修改 `,(0,h.jsx)(`code`,{children:`props.price`}),`！`]})]}),(0,h.jsx)(`div`,{style:{marginBottom:`16px`,padding:`12px`,backgroundColor:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`24px`,alignItems:`center`,flexWrap:`wrap`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[`原价：¥`,o]}),(0,h.jsx)(`input`,{type:`range`,min:`10`,max:`300`,step:`5`,value:o,onChange:e=>s(Number(e.target.value))})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[`折扣：`,c*10,` 折`]}),(0,h.jsx)(`input`,{type:`range`,min:`0.1`,max:`1.0`,step:`0.1`,value:c,onChange:e=>l(Number(e.target.value))})]})]})}),(0,h.jsxs)(`div`,{className:`demo-grid-3`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-success)`},children:`实时滑块联动商品`}),(0,h.jsx)(S,{title:`进口阿拉斯加帝王蟹`,price:o,discount:c,tags:[`海鲜直达`,`热销`]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-success)`},children:`不传 discount（默认为 1）`}),(0,h.jsx)(S,{title:`高山特级碧螺春`,price:68,tags:[`明前茶`,`产地直发`]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-success)`},children:"对象展开 `{...item}`"}),(0,h.jsx)(S,{...f})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` Props 核心心智模型`]}),(0,h.jsxs)(`div`,{children:[`1. `,(0,h.jsx)(`strong`,{children:`单向只读性`}),`：Props 永远由父级决定，子组件严禁直接修改入参对象（如 `,(0,h.jsx)(`code`,{children:`props.price = 99`}),` 会违背 React 纯函数规范并可能引发不可预测的副作用）。`]}),(0,h.jsxs)(`div`,{children:[`2. `,(0,h.jsx)(`strong`,{children:`衍生计算优先`}),`：如果一个值可以通过已有 props/state 简单计算得到，直接在组件函数体内声明局部变量，切忌将其拷贝存入新的 state 中。`]})]})]})}function te({title:e,subtitle:t,extra:n,children:r}){return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,backgroundColor:`var(--bg-surface)`,boxShadow:`var(--shadow-xs)`,overflow:`hidden`,transition:`box-shadow var(--transition-fast)`},children:[(e||n)&&(0,h.jsxs)(`div`,{style:{padding:`14px 18px`,borderBottom:`1px solid var(--border-subtle)`,backgroundColor:`var(--bg-surface-secondary)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,h.jsxs)(`div`,{children:[e&&(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`15px`,color:`var(--text-main)`,fontWeight:`600`},children:e}),t&&(0,h.jsx)(`p`,{style:{margin:`2px 0 0 0`,fontSize:`12px`,color:`var(--text-subtle)`},children:t})]}),n&&(0,h.jsx)(`div`,{children:n})]}),(0,h.jsx)(`div`,{style:{padding:`18px`},children:r})]})}function ne({isOpen:e=!1,onClose:t,title:n,children:r}){return(0,d.useEffect)(()=>{if(!e)return;let n=e=>{e.key===`Escape`&&t&&t()};return window.addEventListener(`keydown`,n),()=>{window.removeEventListener(`keydown`,n)}},[e,t]),e?(0,h.jsx)(`div`,{style:{position:`fixed`,inset:0,backgroundColor:`rgba(15, 23, 42, 0.5)`,backdropFilter:`blur(4px)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3,padding:`16px`,animation:`fadeIn 0.15s ease`},onClick:t,children:(0,h.jsxs)(`div`,{style:{width:`500px`,maxWidth:`100%`,backgroundColor:`var(--bg-surface)`,borderRadius:`var(--radius-lg)`,boxShadow:`var(--shadow-xl)`,border:`1px solid var(--border-color)`,overflow:`hidden`,position:`relative`,animation:`scaleUp 0.15s ease`},onClick:e=>e.stopPropagation(),children:[(n||t)&&(0,h.jsxs)(`div`,{style:{padding:`16px 20px`,borderBottom:`1px solid var(--border-color)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`,color:`var(--text-main)`},children:n||`提示`}),t&&(0,h.jsx)(`button`,{onClick:t,"aria-label":`关闭弹窗`,style:{background:`transparent`,border:`none`,fontSize:`18px`,lineHeight:1,color:`var(--text-subtle)`,cursor:`pointer`,padding:`4px`,borderRadius:`var(--radius-xs)`,display:`flex`,alignItems:`center`,justifyContent:`center`,transition:`color var(--transition-fast)`},children:`✕`})]}),(0,h.jsx)(`div`,{style:{padding:`20px`},children:r})]})}):null}function re(){let[e,t]=(0,d.useState)(!1),[n,r]=(0,d.useState)(`info`),[i,a]=(0,d.useState)(!1),o=e=>{r(e),t(!0),a(!1)};return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📦`}),` Children 默认插槽与组件组合模式`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`组合优于继承`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 通过内置的 `,(0,h.jsx)(`code`,{children:`props.children`}),` 实现了强大的组合模式（Composition）。容器组件专注布局、边框阴影、可访问性及弹窗行为控制，内部的 JSX 内容则完全交由调用者灵活注入。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`默认插槽 (props.children)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`通用布局外壳 (Layout Shell)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`条件渲染 (Conditional Rendering)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🗂️`}),` 1. 通用卡片容器（CardContainer）的多态复用`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`同一个卡片外壳组件，通过嵌套不同的子 JSX，既可以承载纯文本与操作按钮，也可以内嵌完整表单：`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(te,{title:`通知公告卡片`,subtitle:`纯展示型内容组合`,extra:(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`系统`}),children:[(0,h.jsx)(`p`,{style:{margin:`0 0 14px 0`,color:`var(--text-muted)`,fontSize:`13.5px`,lineHeight:`1.6`},children:`React 19 全新架构现已上线，默认支持编译器指令以及优化了并发渲染能力。子节点可包含任意 HTML 结构与操作回调。`}),(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>alert(`触发了卡片内的自定义按钮逻辑！`),children:`了解更多详情`})]}),(0,h.jsx)(te,{title:`快速反馈卡片`,subtitle:`内嵌表单控件组合`,extra:(0,h.jsx)(`span`,{className:`badge badge-green`,children:`可交互`}),children:(0,h.jsxs)(`form`,{onSubmit:e=>{e.preventDefault(),alert(`已成功提交反馈内容！`)},style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`建议或问题：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,placeholder:`请输入您的宝贵建议...`,required:!0})]}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-success btn-sm`,children:`立即提交建议`})]})})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🪟`}),` 2. 模态弹窗外壳（ModalLayout）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`弹窗外壳负责管理背景遮罩、居中定位、ESC 键快捷关闭，弹窗内部的具体内容使用 `,(0,h.jsx)(`code`,{children:`children`}),` 随心所欲定制：`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`12px`,flexWrap:`wrap`,marginBottom:`16px`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>o(`info`),children:`打开提示型弹窗（文本注入）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:()=>o(`form`),children:`打开登录型弹窗（表单注入）`})]}),(0,h.jsx)(ne,{isOpen:e,onClose:()=>t(!1),title:n===`info`?`系统通知`:`快捷用户登录`,children:n===`info`?(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`p`,{style:{margin:`0 0 16px 0`,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:[`这是一个借助 `,(0,h.jsx)(`code`,{children:`children`}),` 传递给 `,(0,h.jsx)(`code`,{children:`ModalLayout`}),` 的简单文本视图。外壳负责居中与 ESC 快捷关闭，内部逻辑完全隔离。`]}),(0,h.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`},children:(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>t(!1),children:`好的，已阅读`})})]}):(0,h.jsx)(`div`,{children:i?(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`16px 0`},children:[(0,h.jsx)(`div`,{style:{fontSize:`36px`,marginBottom:`8px`},children:`🎉`}),(0,h.jsx)(`h4`,{style:{margin:`0 0 6px 0`},children:`登录成功！`}),(0,h.jsx)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,margin:`0 0 16px 0`},children:`弹窗已被成功复用为表单容器。`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>t(!1),children:`完成并关闭`})]}):(0,h.jsxs)(`form`,{onSubmit:e=>{e.preventDefault(),a(!0)},style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`登录邮箱：`}),(0,h.jsx)(`input`,{type:`email`,className:`form-input`,placeholder:`name@example.com`,required:!0})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`4px`},children:`登录密码：`}),(0,h.jsx)(`input`,{type:`password`,className:`form-input`,placeholder:`••••••••`,required:!0})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`8px`,marginTop:`8px`},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>t(!1),children:`取消`}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-success btn-sm`,children:`确认登录`})]})]})})})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 组合模式设计原则`]}),(0,h.jsxs)(`div`,{children:[`当一个组件需要支持多种内部结构时，`,(0,h.jsx)(`strong`,{children:`优先使用组合（Passing Children）`}),`，而不是在组件内部通过定义 10 个布尔值 props（如 `,(0,h.jsx)(`code`,{children:`showImage`}),`, `,(0,h.jsx)(`code`,{children:`showForm`}),`, `,(0,h.jsx)(`code`,{children:`hasButton`}),`）来控制结构分支。组合模式可以让代码解耦，大幅降低维护成本。`]})]})]})}function w({titleText:e=`系统提示`,onClose:t}){return(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,padding:`16px 20px`,borderBottom:`1px solid var(--border-color)`},children:[(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`,color:`var(--text-main)`},children:e}),t&&(0,h.jsx)(`button`,{onClick:t,"aria-label":`关闭`,style:{border:`none`,background:`transparent`,cursor:`pointer`,fontSize:`18px`,color:`var(--text-subtle)`,padding:`2px`,lineHeight:1},children:`✕`})]})}function ie({onConfirm:e,onClose:t,confirmText:n=`确认`,cancelText:r=`取消`}){return(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`10px`,padding:`14px 20px`,borderTop:`1px solid var(--border-color)`,backgroundColor:`var(--bg-surface-secondary)`},children:[(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:t,children:r}),(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:e,children:n})]})}function ae({isOpen:e,onClose:t,onConfirm:n,title:r,footer:i,children:a}){return e?(0,h.jsx)(`div`,{style:{position:`fixed`,inset:0,backgroundColor:`rgba(15, 23, 42, 0.5)`,backdropFilter:`blur(4px)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3,padding:`16px`},onClick:t,children:(0,h.jsxs)(`div`,{style:{width:`460px`,maxWidth:`100%`,backgroundColor:`var(--bg-surface)`,borderRadius:`var(--radius-lg)`,boxShadow:`var(--shadow-xl)`,border:`1px solid var(--border-color)`,overflow:`hidden`},onClick:e=>e.stopPropagation(),children:[r===!1?null:r===void 0?(0,h.jsx)(w,{titleText:`系统通知`,onClose:t}):typeof r==`string`?(0,h.jsx)(w,{titleText:r,onClose:t}):(0,h.jsx)(`div`,{style:{padding:`16px 20px`,borderBottom:`1px solid var(--border-color)`},children:r}),(0,h.jsx)(`div`,{style:{padding:`20px`},children:a}),i===!1?null:i===void 0?(0,h.jsx)(ie,{onConfirm:n,onClose:t}):(0,h.jsx)(`div`,{style:{padding:`14px 20px`,borderTop:`1px solid var(--border-color)`},children:i})]})}):null}var oe=()=>(0,h.jsxs)(`div`,{style:{fontWeight:`700`,color:`var(--text-main)`,fontSize:`14.5px`,display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,h.jsx)(`span`,{children:`📋`}),(0,h.jsx)(`span`,{children:`卡片面板`})]}),se=()=>(0,h.jsx)(`div`,{style:{fontSize:`13px`},children:(0,h.jsx)(`a`,{href:`#more`,onClick:e=>{e.preventDefault(),alert(`触发默认 Extra: 查看详情`)},style:{color:`var(--color-primary)`,fontWeight:`500`},children:`查看更多 →`})});function ce({header:e,extra:t,children:n}){function r(){return e===!1?null:e===void 0?(0,h.jsx)(oe,{}):e}function i(){return t===!1?null:t===void 0?(0,h.jsx)(se,{}):t}return(0,h.jsxs)(`div`,{style:{border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`,backgroundColor:`var(--bg-surface)`,margin:`12px 0`,overflow:`hidden`,boxShadow:`var(--shadow-xs)`,transition:`box-shadow var(--transition-fast)`},children:[(e!==!1||t!==!1)&&(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,padding:`12px 18px`,borderBottom:`1px solid var(--border-subtle)`,backgroundColor:`var(--bg-surface-secondary)`},children:[(0,h.jsx)(`div`,{className:`pannel-header`,children:r()}),(0,h.jsx)(`div`,{className:`pannel-extra`,children:i()})]}),(0,h.jsx)(`div`,{style:{padding:`18px`,color:`var(--text-main)`},className:`pannel-body`,children:n||(0,h.jsx)(`span`,{style:{color:`var(--text-subtle)`,fontStyle:`italic`},children:`暂无面板内容`})})]})}function le(){let[e,t]=(0,d.useState)(null),n=()=>t(null),[r,i]=(0,d.useState)(0);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧩`}),` 具名多插槽客制化设计规范`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`组件库架构协议`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`成熟组件库（如 Ant Design、shadcn/ui、MUI）广泛采用“三态插槽协议”（默认模板 + 局部覆盖 + 显式隐藏）。通过 Props 接收自定义 JSX 节点或布尔值，实现比单一 `,(0,h.jsx)(`code`,{children:`children`}),` 更高维度的扩展能力。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`具名插槽（Named Slots via Props）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`三态渲染协议（Tri-state Protocol）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`零额外 DOM 成本`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📋`}),` 工业级三态插槽协议判定规范`]}),(0,h.jsxs)(`ul`,{style:{margin:`4px 0 0 0`,paddingLeft:`20px`,display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,h.jsxs)(`li`,{children:[(0,h.jsx)(`strong`,{children:`1. 显式隐藏：`}),(0,h.jsx)(`code`,{children:`slotProp === false`}),` → 返回 `,(0,h.jsx)(`code`,{children:`null`}),`，完全不产生 DOM 占位`]}),(0,h.jsxs)(`li`,{children:[(0,h.jsx)(`strong`,{children:`2. 局部覆盖：`}),(0,h.jsx)(`code`,{children:`slotProp !== undefined`}),` → 渲染调用方传入的内容（支持 string、JSX 或组件）`]}),(0,h.jsxs)(`li`,{children:[(0,h.jsx)(`strong`,{children:`3. 回退默认：`}),(0,h.jsx)(`code`,{children:`slotProp === undefined`}),` → 自动渲染内置预设的默认模板组件`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🪟`}),` 1. 多插槽模态框（ProductionModal）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`支持 `,(0,h.jsx)(`code`,{children:`title`}),`（头部插槽）、`,(0,h.jsx)(`code`,{children:`footer`}),`（底部插槽）与 `,(0,h.jsx)(`code`,{children:`children`}),`（主体插槽）：`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`,marginBottom:`16px`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>t(`default`),children:`1. 全默认模板（默认头部+底部）`}),(0,h.jsx)(`button`,{className:`btn btn-danger`,onClick:()=>t(`custom-title`),children:`2. 局部覆盖标题（危险红色警告）`}),(0,h.jsx)(`button`,{className:`btn btn-success`,onClick:()=>t(`custom-footer`),children:`3. 局部覆盖底部（自定义单个按钮）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:()=>t(`no-footer`),children:`4. 显式隐藏底部 (footer=false)`})]}),(0,h.jsx)(ae,{isOpen:e==="default",onClose:n,onConfirm:()=>{alert(`触发了默认弹窗确认！`),n()},children:(0,h.jsx)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:`这是零额外配置的通知弹窗，头部标题和底部操作按钮均采用组件库内置默认模板。`})}),(0,h.jsx)(ae,{isOpen:e===`custom-title`,title:(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,color:`var(--color-danger)`},children:[(0,h.jsx)(`span`,{children:`⚠️`}),(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`},children:`严重警告：危险操作`})]}),onClose:n,onConfirm:n,children:(0,h.jsx)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:`该操作将永久删除该项数据，且无法撤销！注意：虽然头部被完全重写，但底部依然保留了内置的确认与取消操作栏。`})}),(0,h.jsx)(ae,{isOpen:e===`custom-footer`,onClose:n,footer:(0,h.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`},children:(0,h.jsx)(`button`,{className:`btn btn-success`,onClick:n,children:`🎉 我知道了，立即体验`})}),children:(0,h.jsx)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:`恭喜！您的专属权益已成功生效。底部插槽被替换为居中的单项体验按钮。`})}),(0,h.jsx)(ae,{isOpen:e===`no-footer`,title:`纯展示性服务协议条款`,footer:!1,onClose:n,children:(0,h.jsxs)(`p`,{style:{margin:0,color:`var(--text-muted)`,fontSize:`14px`,lineHeight:`1.6`},children:[`通过传入 `,(0,h.jsx)(`code`,{children:`footer={false}`}),`，组件直接跳过底部操作条的 DOM 生成，适合展示纯文本说明。`]})})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`📋`}),` 2. 多插槽卡片面板（Pannel）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`具有 `,(0,h.jsx)(`code`,{children:`header`}),`（左上角标题插槽）、`,(0,h.jsx)(`code`,{children:`extra`}),`（右上角扩展操作插槽）与 `,(0,h.jsx)(`code`,{children:`children`}),`（主体内容）：`]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 A：全默认模板（未传 header 与 extra）`}),(0,h.jsx)(ce,{children:(0,h.jsx)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-muted)`},children:`默认标题为“📋 卡片面板”，右上角展示默认的“查看更多 →”。`})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 B：自定义 Header 标题（保留默认 extra）`}),(0,h.jsx)(ce,{header:(0,h.jsx)(`strong`,{style:{color:`var(--color-primary)`},children:`📈 业务实时大盘`}),children:(0,h.jsx)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-muted)`},children:`自定义了左侧标题，右侧 Extra 仍然优雅回退到内置的链接模板。`})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 C：同时自定义 Header 与 Extra 交互`}),(0,h.jsx)(ce,{header:(0,h.jsx)(`strong`,{style:{color:`var(--color-success)`},children:`⚡ 实时心跳健康检测`}),extra:(0,h.jsxs)(`button`,{className:`btn btn-success btn-sm`,onClick:()=>i(e=>e+1),children:[`🔄 刷新 (`,r,`)`]}),children:(0,h.jsxs)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-muted)`},children:[`插槽内可无缝嵌入受控交互，已点击刷新 `,r,` 次。`]})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`6px`,fontSize:`12px`,fontWeight:`600`,color:`var(--color-primary)`},children:`场景 D：显式隐藏顶部导航条 (header=false, extra=false)`}),(0,h.jsx)(ce,{header:!1,extra:!1,children:(0,h.jsx)(`p`,{style:{margin:0,fontSize:`13.5px`,color:`var(--text-subtle)`},children:`顶部栏整体被消除，呈现为一张干净的纯内容卡片。`})})]})]})]})]})}var ue=[`loading`,`empty`,`error`,`success`];function T({status:e}){return e===`loading`?(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⏳ Loading`}),(0,h.jsx)(`div`,{children:`正在加载订单列表。这里使用 early return，让每个业务分支保持独立。`})]}):e===`error`?(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ Error`}),(0,h.jsx)(`div`,{children:`请求失败，请稍后重试。错误态不需要和成功态挤在同一层嵌套三元表达式里。`})]}):e===`empty`?(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`📭 Empty`}),(0,h.jsx)(`div`,{children:`当前没有订单。空态是一个独立业务状态，不应该伪装成“成功但数组长度为 0”的隐式分支。`})]}):(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`✅ Success`}),(0,h.jsx)(`div`,{children:`已加载 3 条订单，页面进入正常内容态。`})]})}function E({status:e}){let t=e===`success`;return(0,h.jsx)(`span`,{className:t?`badge badge-green`:`badge badge-gray`,children:t?`数据可用`:`等待稳定结果`})}function de(){let[e,t]=(0,d.useState)(`loading`),[n,r]=(0,d.useState)(!0),i=e===`error`||e===`success`||e===`empty`;return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🚦`}),` 条件渲染：让业务状态直接映射 UI`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`UI 分支`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 不提供专门的模板条件语法，而是直接使用 JavaScript 的 `,(0,h.jsx)(`code`,{children:`if`}),`、三元表达式和`,(0,h.jsx)(`code`,{children:`&&`}),` 来决定返回哪些 JSX。关键不是记语法，而是让业务状态与 UI 分支保持清晰的一一对应。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`if / early return`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`ternary`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`&& / null`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🧪 实验：四态请求 UI`}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`切换同一份业务状态，观察组件如何选择完全不同的 JSX 分支。`})]}),(0,h.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`8px`,marginBottom:`16px`},children:ue.map(n=>(0,h.jsx)(`button`,{className:e===n?`btn btn-primary btn-sm`:`btn btn-secondary btn-sm`,onClick:()=>t(n),children:n},n))}),(0,h.jsx)(T,{status:e}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,flexWrap:`wrap`,marginTop:`14px`},children:[(0,h.jsx)(`strong`,{style:{fontSize:`13px`},children:`ternary：`}),(0,h.jsx)(E,{status:e}),(0,h.jsx)(`span`,{style:{fontSize:`13px`,color:`var(--text-muted)`},children:i?`当前状态已经有明确结果`:`当前仍处于进行中状态`})]}),(0,h.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,marginTop:`14px`,fontSize:`13px`},children:[(0,h.jsx)(`input`,{type:`checkbox`,checked:n,onChange:e=>r(e.target.checked)}),`展示调试信息`]}),n&&(0,h.jsx)(`div`,{className:`demo-alert demo-alert-info`,style:{marginBottom:0},children:(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`code`,{children:`&&`}),` 适合表达“条件满足时额外渲染一小段内容”；关闭开关后，这一段 JSX 不会进入返回树。`]})})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🧭 选择哪种写法`})}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`10px`},children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`✅ 推荐`}),(0,h.jsxs)(`div`,{children:[`大块互斥业务状态优先使用 `,(0,h.jsx)(`strong`,{children:`early return / 清晰的 if 分支`}),`；小型二选一内容使用三元表达式；只在“有或没有”时使用 `,(0,h.jsx)(`code`,{children:`&&`}),`。`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ 常见反模式`}),(0,h.jsx)(`div`,{children:`把 loading、error、empty、success 塞进多层嵌套三元表达式，会让 JSX 很快失去可读性。复杂分支应提前计算、early return，或拆成职责明确的子组件。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`📌 项目边界`}),(0,h.jsxs)(`div`,{children:[`条件渲染只负责“当前状态应该显示什么”。不要为了切换 UI 再复制一份状态；例如 `,(0,h.jsx)(`code`,{children:`isEmpty`}),` 能从 `,(0,h.jsx)(`code`,{children:`items.length`}),` 推导时，应直接计算而不是额外保存 State。`]})]})]})}var fe=[{id:`task-a`,title:`修复登录页`,owner:`Alice`},{id:`task-b`,title:`补充单元测试`,owner:`Bob`},{id:`task-c`,title:`发布生产版本`,owner:`Carol`}];function pe({task:e}){let[t,n]=(0,d.useState)(``);return(0,h.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`minmax(150px, 1fr) minmax(180px, 1fr)`,gap:`10px`,alignItems:`center`,padding:`10px 0`,borderBottom:`1px solid var(--border-subtle)`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontWeight:700,color:`var(--text-main)`,fontSize:`13.5px`},children:e.title}),(0,h.jsxs)(`div`,{style:{color:`var(--text-subtle)`,fontSize:`12px`},children:[e.owner,` · id: `,e.id]})]}),(0,h.jsx)(`input`,{className:`form-input`,value:t,onChange:e=>n(e.target.value),placeholder:`给这一行输入临时备注`})]})}function me({tasks:e,useIndexKey:t}){return(0,h.jsx)(`div`,{children:e.map((e,n)=>(0,h.jsx)(pe,{task:e},t?n:e.id))})}function D(){let[e,t]=(0,d.useState)(fe),[n,r]=(0,d.useState)(!0);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧾`}),` Rendering Lists 与 key：身份比位置更重要`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`Identity`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`map()`}),` 只是把数据映射成 JSX。真正决定 React 如何在后续 render 中匹配列表项的是 `,(0,h.jsx)(`code`,{children:`key`}),`。 当项目支持排序、插入或删除时，稳定业务 ID 才能让组件 State 跟着“数据身份”移动，而不是跟着数组位置移动。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🧪 实验：先输入备注，再反转列表`}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`每行的备注是 `,(0,h.jsx)(`code`,{children:`EditableRow`}),` 自己的 State。先给第一行输入一段文字，再点击“反转顺序”，观察备注最终跟着谁。`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`,marginBottom:`14px`},children:[(0,h.jsx)(`button`,{className:n?`btn btn-danger btn-sm`:`btn btn-secondary btn-sm`,onClick:()=>r(!0),children:`使用 index key`}),(0,h.jsx)(`button`,{className:n?`btn btn-secondary btn-sm`:`btn btn-success btn-sm`,onClick:()=>r(!1),children:`使用 stable id`}),(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>t(e=>[...e].reverse()),children:`反转顺序`}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>t(e=>e.slice(1)),disabled:e.length===0,children:`删除第一项`}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>t(fe),children:`恢复数据`})]}),(0,h.jsxs)(`div`,{className:n?`demo-alert demo-alert-danger`:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:n?`⚠️ 当前 key = index`:`✅ 当前 key = task.id`}),(0,h.jsx)(`div`,{children:n?`数组位置变化后，React 仍按 0/1/2 匹配组件，行内 State 可能留在原位置，于是备注看起来“跟错任务”。`:`稳定 ID 不随排序改变，React 可以把已有组件与同一个业务实体重新匹配，行内 State 会跟着任务身份移动。`})]}),e.length>0?(0,h.jsx)(me,{tasks:e,useIndexKey:n}):(0,h.jsx)(`div`,{className:`demo-alert demo-alert-tip`,children:`列表为空。点击“恢复数据”重新开始实验。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🧠 key 规则`})}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`10px`},children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`✅ Stable key`}),(0,h.jsxs)(`div`,{children:[`key 只需要在`,(0,h.jsx)(`strong`,{children:`当前兄弟列表`}),`中唯一，并且在同一业务实体的生命周期内保持稳定。后端 ID、数据库主键、本地创建时生成的稳定 UUID 都更合适。`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ 不要在 render 时生成 key`}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`code`,{children:`Math.random()`}),` 或每次 render 重新生成 UUID 会让 key 每次都变化，React 会把节点当成全新组件，导致 DOM/State 被重建。index 只适合永不重排、插入、删除的静态列表。`]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`📌 项目判断`}),(0,h.jsx)(`div`,{children:`如果列表项包含输入框、展开状态、动画状态、局部请求状态，或者列表会发生 reorder / insert / delete，key 的身份模型会直接影响正确性，而不仅仅是消除 console warning。`})]})]})}var O=(0,d.createContext)(null);function he({user:e}){return(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsx)(`div`,{style:{width:`32px`,height:`32px`,borderRadius:`50%`,backgroundColor:`#ef4444`,color:`#fff`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`14px`,fontWeight:`bold`},children:e.name.charAt(0)}),(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[e.name,` (`,e.role,`)`]})]})}function ge({user:e}){return(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`#f1f5f9`,borderRadius:`6px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`span`,{style:{fontSize:`12px`,color:`#64748b`},children:`Header（只负责继续传递 user）`}),(0,h.jsx)(he,{user:e})]})}function _e({user:e}){return(0,h.jsxs)(`div`,{style:{padding:`10px`,border:`1px dashed #cbd5e1`,borderRadius:`8px`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`#64748b`,marginBottom:`6px`},children:`Navbar（只负责继续传递 user）`}),(0,h.jsx)(ge,{user:e})]})}function ve({rightSlot:e}){return(0,h.jsxs)(`div`,{style:{padding:`10px`,border:`1px dashed #86efac`,borderRadius:`8px`,background:`#f0fdf4`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`#166534`,marginBottom:`6px`},children:`Navbar（只定义布局插槽，不需要知道 user）`}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:`600`},children:`应用 Logo`}),e]})]})}function ye(){let e=(0,d.useContext)(O);return(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsx)(`div`,{style:{width:`32px`,height:`32px`,borderRadius:`50%`,backgroundColor:`#3b82f6`,color:`#fff`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`14px`,fontWeight:`bold`},children:e.name.charAt(0)}),(0,h.jsxs)(`span`,{style:{fontSize:`13px`},children:[e.name,` (`,e.role,`)`]})]})}function be(){return(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`#eff6ff`,borderRadius:`6px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`span`,{style:{fontSize:`12px`,color:`#1e40af`},children:`Header（不消费 user）`}),(0,h.jsx)(ye,{})]})}function xe(){return(0,h.jsxs)(`div`,{style:{padding:`10px`,border:`1px dashed #93c5fd`,borderRadius:`8px`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`#1e40af`,marginBottom:`6px`},children:`Navbar（不消费 user）`}),(0,h.jsx)(be,{})]})}function Se(){let[e,t]=(0,d.useState)({name:`Alex Chen`,role:`技术总监`});return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🪜`}),` Prop Drilling：不是看到多层 Props 就要消灭`]})}),(0,h.jsx)(`span`,{className:`badge badge-amber`,children:`数据边界`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Props 是 React 最直接、最显式的数据流。只有当数据需要穿过许多“不消费它”的中间组件，导致接口噪声和重构成本明显上升时，才值得把它识别为需要处理的 prop drilling。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-amber`,children:`默认：显式 Props`}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`布局解耦：Composition`}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`远距离共享：Context`})]})]}),(0,h.jsx)(`div`,{className:`demo-section`,style:{padding:`16px 20px`},children:(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,flexWrap:`wrap`,gap:`12px`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,flexWrap:`wrap`},children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:`600`},children:`修改数据所有者中的 user：`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{width:`160px`},value:e.name,onChange:e=>t(t=>({...t,name:e.target.value})),placeholder:`用户姓名`}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{width:`160px`},value:e.role,onChange:e=>t(t=>({...t,role:e.target.value})),placeholder:`用户角色`})]}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>t({name:`Sarah Lee`,role:`UI 设计总监`}),children:`切换为 Sarah`})]})}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚖️`}),` 同一份数据的三种传递路径`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`三种路径都能工作。真正要比较的是数据所有权、组件职责、消费范围和接口成本，而不是寻找一个永远正确的 API。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`1️⃣`}),` 显式 Props：链路很深时才出现 drilling 成本`]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`13px`,color:`var(--text-muted)`},children:[(0,h.jsx)(`code`,{children:`Page → Navbar → Header → Avatar`}),`。这种写法的数据来源最清楚；当 Navbar、Header 长期只是机械透传，而且链路继续增长时，接口噪声才开始成为真实问题。`]}),(0,h.jsx)(_e,{user:e})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`2️⃣`}),` Composition：中间层本质是布局容器时很合适`]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`13px`,color:`var(--text-muted)`},children:[`顶层直接创建 `,(0,h.jsx)(`code`,{children:`<DrillingAvatar user={user} />`}),`，Navbar 只接收已经组装好的 JSX。这样缩短了数据 props 的传递链，但代价是父组件承担更多布局组合职责。`]}),(0,h.jsx)(ve,{rightSlot:(0,h.jsx)(he,{user:e})})]}),(0,h.jsxs)(`div`,{style:{border:`1px solid #bfdbfe`,borderRadius:`var(--radius-md)`,padding:`16px`,backgroundColor:`#f8fafc`},children:[(0,h.jsxs)(`div`,{style:{fontSize:`13.5px`,fontWeight:`700`,color:`#1d4ed8`,display:`flex`,alignItems:`center`,gap:`6px`,marginBottom:`10px`},children:[(0,h.jsx)(`span`,{children:`3️⃣`}),` Context：多个远距离消费者需要同一信息`]}),(0,h.jsx)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`13px`,color:`var(--text-muted)`},children:`Provider 让后代消费者直接读取当前值，中间组件不用声明对应 prop。它降低了重复透传，但也让依赖从组件调用处变得不那么显式，因此不应仅因为“传了两三层”就引入 Context。`}),(0,h.jsx)(O.Provider,{value:e,children:(0,h.jsx)(xe,{})})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 判断顺序：先问数据归谁，再问怎么传`]})}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`10px`},children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`Props：`}),`消费关系局部、链路可读时继续使用。显式依赖通常更容易追踪和复用。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`Composition：`}),`如果中间组件只是 Layout / Shell，把 JSX 作为 `,(0,h.jsx)(`code`,{children:`children`}),` 或 slot 传入，通常可以减少无意义的数据 props。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`Context：`}),`当同一信息由树中多个、相距较远的组件消费，例如主题、当前账号、路由上下文或模块级共享状态，再考虑 Context。`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`⚠️`}),` 真实项目边界`]}),(0,h.jsx)(`div`,{children:`不要按“层数”机械选方案。两三层 props 可能完全合理；十层透传也可能通过重新划分组件边界解决。先检查 State ownership、组件是否承担了过多职责、真正消费者有多少，再决定是否引入 Composition 或 Context。`})]})]})}function Ce(){let[e,t]=(0,d.useState)([]),[n,r]=(0,d.useState)(!1);function i(e){t(t=>[e,...t].slice(0,8))}function a(e){e.preventDefault(),i(`submit: preventDefault() 阻止浏览器刷新，但不会阻止事件传播`)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🖱️`}),` Event Handler：事件属于交互，不属于 Effect`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`02-01`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`把函数传给 JSX，React 在交互发生时调用它。事件默认向上冒泡；capture 在目标处理前从外向内执行。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`pass function`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`capture / bubble`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`stopPropagation`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`preventDefault`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🎮 传播顺序实验`}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击内部按钮，观察 capture → target → bubble；再开启 stopPropagation 比较差异。`})]}),(0,h.jsxs)(`label`,{style:{display:`flex`,gap:8,alignItems:`center`,marginBottom:12},children:[(0,h.jsx)(`input`,{type:`checkbox`,checked:n,onChange:e=>r(e.target.checked)}),`按钮调用 stopPropagation()`]}),(0,h.jsx)(`div`,{onClickCapture:()=>i(`1. parent capture`),onClick:()=>i(`3. parent bubble`),style:{padding:20,border:`1px solid var(--border-color)`,borderRadius:10},children:(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`button`,onClick:e=>{i(`2. button target`),n&&e.stopPropagation()},children:`点击内部按钮`})}),(0,h.jsx)(`div`,{style:{marginTop:12,display:`grid`,gap:6},children:e.length?e.map((e,t)=>(0,h.jsx)(`code`,{children:e},`${e}-${t}`)):(0,h.jsx)(`span`,{className:`demo-section-desc`,children:`暂无事件`})})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🧪 preventDefault ≠ stopPropagation`})}),(0,h.jsx)(`form`,{onSubmit:a,children:(0,h.jsx)(`button`,{className:`btn`,type:`submit`,children:`提交表单`})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:[(0,h.jsx)(`strong`,{children:`正确做法：`}),`购买、提交、播放等“用户做了某件事”直接写在 Event Handler；不要先 set 一个 flag，再用 Effect 间接响应点击。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`常见错误：`}),(0,h.jsx)(`code`,{children:`onClick={handleClick()}`}),` 会在 render 时调用函数；应传 `,(0,h.jsx)(`code`,{children:`onClick={handleClick}`}),`。`]})]})]})}function we(){let[e,t]=(0,d.useState)(0),[n,r]=(0,d.useState)([]);function i(e){r(t=>[e,...t].slice(0,10))}function a(){i(`handler snapshot = ${e}`),t(e+1),t(e+1),t(e+1),i(`调用 3 次 setCount(count + 1) 后，当前 handler 仍读到 ${e}`)}function o(){i(`handler snapshot = ${e}`),t(e=>e+1),t(e=>e+1),t(e=>e+1),i(`三个 updater 依次进入队列：n→n+1→n+1→n+1`)}function s(){let n=e;t(e=>e+1),setTimeout(()=>i(`timer 来自旧 render：捕获 snapshot=${n}；timer 执行时不会自动改成最新值`),700)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📸`}),` State Snapshot + Update Queue`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`02-02 ~ 02-04`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`State 不是普通局部变量。每次 render 得到一个固定快照；setter 请求下一次 render，同一事件中的更新会排队并批处理。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`useState`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`snapshot`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`batching`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`functional updater`})]})]}),(0,h.jsx)(`div`,{className:`demo-section`,children:(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:10},children:[(0,h.jsx)(`div`,{children:`当前这次 render 的 count snapshot`}),(0,h.jsx)(`strong`,{style:{fontSize:34},children:e}),(0,h.jsx)(`div`,{style:{marginTop:8,fontSize:12,color:`var(--text-muted)`},children:`事件处理器会闭包捕获创建它的那次 render 的值。`})]}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:8,alignContent:`start`},children:[(0,h.jsx)(`button`,{className:`btn`,type:`button`,onClick:()=>t(e+1),children:`+1：替换为 snapshot + 1`}),(0,h.jsx)(`button`,{className:`btn`,type:`button`,onClick:a,children:`连续 3 次 count + 1`}),(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`button`,onClick:o,children:`连续 3 次 updater`}),(0,h.jsx)(`button`,{className:`btn`,type:`button`,onClick:s,children:`+1 并在 timer 中读取旧快照`})]})]})}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🔬 可观察结果`})}),(0,h.jsx)(`div`,{style:{display:`grid`,gap:6},children:n.map((e,t)=>(0,h.jsx)(`code`,{children:e},`${e}-${t}`))}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:[(0,h.jsx)(`strong`,{children:`队列模型：`}),(0,h.jsx)(`code`,{children:`setCount(count + 1)`}),` 在同一 render 中都基于同一个 snapshot；`,(0,h.jsx)(`code`,{children:`setCount(c => c + 1)`}),` 把 updater 加入队列，React 在处理队列时把前一个 updater 的结果交给后一个。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`边界：`}),`functional updater 解决“基于前值更新”的队列问题，不是读取任意最新 state 的逃生舱；异步流程仍应明确其数据时序。`]})]})]})}var Te={name:`Ada`,address:{city:`London`,country:`UK`}},Ee=[{id:1,title:`理解 Snapshot`,done:!0},{id:2,title:`掌握不可变更新`,done:!1}];function De(){let[e,t]=(0,d.useState)(Te),[n,r]=(0,d.useState)(Ee),[i,a]=(0,d.useState)(Te);function o(){a(e),t(e=>({...e,address:{...e.address,city:e.address.city===`London`?`Tokyo`:`London`}}))}function s(e){r(t=>t.map(t=>t.id===e?{...t,done:!t.done}:t))}function c(){r(e=>[...e,{id:Date.now(),title:`新任务 ${e.length+1}`,done:!1}])}function l(){r(e=>e.filter(e=>!e.done))}function u(){r(e=>[...e].reverse())}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧊`}),` Object / Array State：把快照当只读值`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`02-05`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`对象和数组在 JavaScript 中可变，但放进 React State 后应按只读快照处理：修改时创建新引用，并复制所有被修改路径。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`spread`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`map / filter`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`nested copy`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`reference identity`})]})]}),(0,h.jsx)(`div`,{className:`demo-section`,children:(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`嵌套对象`}),(0,h.jsxs)(`p`,{children:[e.name,` · `,e.address.city,`, `,e.address.country]}),(0,h.jsx)(`button`,{className:`btn`,type:`button`,onClick:o,children:`切换城市`}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:[`上一个对象 === 当前对象：`,(0,h.jsx)(`strong`,{children:String(i===e)}),(0,h.jsx)(`br`,{}),`未修改字段复用，修改路径创建新对象。`]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`数组操作`}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`,marginBottom:10},children:[(0,h.jsx)(`button`,{className:`btn`,onClick:c,children:`append`}),(0,h.jsx)(`button`,{className:`btn`,onClick:l,children:`remove done`}),(0,h.jsx)(`button`,{className:`btn`,onClick:u,children:`copy + reverse`})]}),n.map(e=>(0,h.jsxs)(`label`,{style:{display:`flex`,gap:8,padding:`6px 0`},children:[(0,h.jsx)(`input`,{type:`checkbox`,checked:e.done,onChange:()=>s(e.id)}),e.title]},e.id))]})]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`反模式：`}),(0,h.jsx)(`code`,{children:`profile.address.city = "Tokyo"`}),` 或 `,(0,h.jsx)(`code`,{children:`tasks.reverse(); setTasks(tasks)`}),` 会修改旧快照并保留同一引用，破坏调试、memoization 与未来并发特性的假设。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`真实项目：`}),`嵌套过深时先考虑扁平化 State；只有更新表达式确实繁琐时再评估 Immer，而不是用库掩盖糟糕的数据结构。`]})]})}function Oe(){let[e,t]=(0,d.useState)(0),[n,r]=(0,d.useState)(0),[i,a]=(0,d.useState)(`尚未触发更新`),o=(0,d.useRef)(null),s=`Count: ${e}`;function c(e){requestAnimationFrame(()=>{let t=o.current?.textContent??`(DOM unavailable)`;a(`${e} → 浏览器在 React commit 后读到：${t}`)})}function l(){t(e=>e+1),c(`count state 更新`)}function u(){r(e=>e+1),c(`无关 state 更新`)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🏗️`}),` Trigger → Render → Commit`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`02-06`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`更新先触发 React 调用组件计算下一份 UI（Render），再把必要变化提交到宿主环境（浏览器里通常是 DOM Commit）。组件发生 render，不代表某个 DOM 节点一定会改变。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Trigger`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Render`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Commit`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Paint`})]})]}),(0,h.jsx)(`div`,{className:`demo-section`,children:(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{display:`grid`,gap:10,alignContent:`start`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`button`,onClick:l,children:`更新 count（Count DOM 文本会变）`}),(0,h.jsx)(`button`,{className:`btn`,type:`button`,onClick:u,children:`只更新无关 state（Count DOM 文本不变）`})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:10},children:[(0,h.jsx)(`strong`,{ref:o,style:{fontSize:28},children:s}),(0,h.jsxs)(`div`,{style:{marginTop:12},children:[`themeTick：`,n]}),(0,h.jsx)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:i})]})]})}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🧠 四阶段心智模型`})}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`strong`,{children:`1 Trigger：`}),`初次挂载，或 state 更新等原因让 React 安排一次 render。`]}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`strong`,{children:`2 Render：`}),`React 调用组件，纯计算下一份 JSX/UI 描述；这个阶段可能被重复、暂停或放弃，因此不应执行副作用。`]}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`strong`,{children:`3 Commit：`}),`React 把计算结果中真正需要的变化应用到宿主环境。即使组件重新 render，某个 DOM 节点也可能完全不变。`]}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`strong`,{children:`4 Browser Paint：`}),`浏览器在 DOM 更新后进行布局与绘制；它不是 React 的 render phase，而且浏览器何时实际绘制由浏览器调度决定。`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`反模式：`}),`为了“统计 render 次数”而在组件函数执行期间修改 ref 或外部计数器，本身就会破坏纯 render 约束。调试 render 行为优先使用 React DevTools Profiler；业务副作用放事件处理器，外部系统同步放 Effect。`]})]})}var ke=[{id:1,name:`红富士苹果`,price:8.5,count:2},{id:2,name:`进口香蕉`,price:12,count:1},{id:3,name:`高钙牛奶`,price:45,count:1}],Ae={0:{id:0,title:`项目`,childIds:[1,2]},1:{id:1,title:`前端`,childIds:[3,4]},2:{id:2,title:`后端`,childIds:[]},3:{id:3,title:`React 学习站`,childIds:[]},4:{id:4,title:`文件预览器`,childIds:[]}};function je({id:e,places:t}){let n=t[e];return n?(0,h.jsxs)(`li`,{children:[n.title,n.childIds.length>0&&(0,h.jsx)(`ul`,{children:n.childIds.map(e=>(0,h.jsx)(je,{id:e,places:t},e))})]}):null}function Me(){let[e,t]=(0,d.useState)(`张`),[n,r]=(0,d.useState)(`三丰`),i=`${e} ${n}`.trim(),[a,o]=(0,d.useState)(ke),[s,c]=(0,d.useState)(1),l=a.reduce((e,t)=>e+t.count,0),u=a.reduce((e,t)=>e+t.price*t.count,0),f=a.find(e=>e.id===s)??null,[p,m]=(0,d.useState)(`typing`),[g,_]=(0,d.useState)(Ae);function v(e,t){o(n=>n.map(n=>n.id===e?{...n,count:Math.max(0,n.count+t)}:n).filter(e=>e.count>0))}function y(e,t){_(n=>{let r=n[e];return r?{...n,[e]:{...r,childIds:r.childIds.filter(e=>e!==t)}}:n})}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` State 结构设计：让不可能状态无法出现`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`State Modeling`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`State 的关键不是“能不能存”，而是`,(0,h.jsx)(`strong`,{children:`应该存什么`}),`。良好的结构应减少同步负担：相关数据一起变化时可合并、互斥状态避免用多个 boolean、可计算值不重复存、同一实体不复制两份，并尽量避免难以更新的深层嵌套。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Single Source of Truth`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Avoid Contradictions`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Avoid Duplication`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Normalize Deep State`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`1. 冗余 State：能计算，就不要再存一份`}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[(0,h.jsx)(`code`,{children:`fullName`}),` 完全由两个输入决定，因此直接在 render 中计算；不需要第三个 state，也不需要 Effect 去同步。`]})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsx)(`div`,{className:`comparison-header bad`,children:`❌ 冗余状态 + Effect 同步`}),(0,h.jsx)(`pre`,{style:{margin:0,padding:8,fontSize:12,overflowX:`auto`},children:`const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(first + ' ' + last);
}, [first, last]);`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsx)(`div`,{className:`comparison-header good`,children:`✅ 渲染期派生`}),(0,h.jsx)(`pre`,{style:{margin:0,padding:8,fontSize:12,overflowX:`auto`},children:"const [first, setFirst] = useState('');\nconst [last, setLast] = useState('');\nconst fullName = `${first} ${last}`.trim();"})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`end`,flexWrap:`wrap`,marginTop:16},children:[(0,h.jsxs)(`label`,{style:{fontSize:12,color:`var(--text-muted)`},children:[`姓氏`,(0,h.jsx)(`input`,{className:`form-input`,value:e,onChange:e=>t(e.target.value)})]}),(0,h.jsxs)(`label`,{style:{fontSize:12,color:`var(--text-muted)`},children:[`名字`,(0,h.jsx)(`input`,{className:`form-input`,value:n,onChange:e=>r(e.target.value)})]}),(0,h.jsx)(`strong`,{style:{paddingBottom:8,color:`var(--color-primary)`},children:i||`（空）`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`2. 矛盾 State：用一个 status 表示互斥状态`}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[(0,h.jsx)(`code`,{children:`isSending`}),` + `,(0,h.jsx)(`code`,{children:`isSent`}),` 可能同时为 true，形成业务上不可能的组合。一个有限状态值更容易推理，也更容易扩展 error / retry。`]})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsx)(`div`,{className:`comparison-header bad`,children:`❌ 两个 boolean 可产生 4 种组合`}),(0,h.jsx)(`pre`,{style:{margin:0,padding:8,fontSize:12},children:`isSending = true
isSent = true // “正在发送”又“已发送”`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsx)(`div`,{className:`comparison-header good`,children:`✅ 一个 status 只允许合法状态`}),(0,h.jsx)(`pre`,{style:{margin:0,padding:8,fontSize:12},children:`status = 'typing'
status = 'sending'
status = 'sent'`})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,marginTop:14},children:[[`typing`,`sending`,`sent`].map(e=>(0,h.jsx)(`button`,{className:`btn ${p===e?`btn-primary`:`btn-secondary`} btn-sm`,onClick:()=>m(e),children:e},e)),(0,h.jsxs)(`span`,{className:`badge badge-blue`,children:[`当前唯一事实：status = `,p]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`3. 重复 State：保存 ID，而不是复制整条实体`}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`商品实体只存在 `,(0,h.jsx)(`code`,{children:`cartItems`}),` 中；选中状态只保存 `,(0,h.jsx)(`code`,{children:`selectedId`}),`。这样商品数量更新后，选中详情自然读取到最新对象，不需要额外同步 selectedItem 副本。`]})]}),(0,h.jsx)(`div`,{style:{display:`grid`,gap:10},children:a.map(e=>(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:12,alignItems:`center`,padding:`10px 12px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:s===e.id?`var(--color-primary-light)`:`var(--bg-surface)`},children:[(0,h.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,h.jsx)(`input`,{type:`radio`,name:`selected-product`,checked:s===e.id,onChange:()=>c(e.id)}),(0,h.jsx)(`span`,{children:e.name})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>v(e.id,-1),children:`-1`}),(0,h.jsx)(`strong`,{children:e.count}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>v(e.id,1),children:`+1`})]})]},e.id))}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`当前派生结果`}),(0,h.jsxs)(`div`,{children:[`总件数：`,l,`；总金额：¥`,u.toFixed(2)]}),(0,h.jsxs)(`div`,{children:[`选中项：`,f?`${f.name} × ${f.count}`:`无（原商品可能已删除）`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`4. 深层嵌套：复杂树状数据优先考虑扁平化`}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`当更新一个叶子节点需要一路复制祖先对象时，更新代码容易变长。这里把实体放进 ID → entity 的映射，父节点只保存 childIds；删除关系只需要更新直接父节点。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:14,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsx)(`strong`,{children:`当前树`}),(0,h.jsx)(`ul`,{style:{marginBottom:0},children:(0,h.jsx)(je,{id:0,places:g})})]}),(0,h.jsxs)(`div`,{style:{padding:14,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsx)(`strong`,{children:`关系操作`}),(0,h.jsx)(`p`,{style:{fontSize:13,color:`var(--text-muted)`},children:`删除“前端 → React 学习站”的关系，只更新 parent.childIds，不需要深拷贝整棵树。`}),(0,h.jsx)(`button`,{className:`btn btn-danger btn-sm`,onClick:()=>y(1,3),children:`移除 React 学习站`}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,style:{marginLeft:8},onClick:()=>_(Ae),children:`重置`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`State 结构检查清单`}),(0,h.jsx)(`div`,{children:`① 总是一起更新的数据，考虑组合；② 不要允许互相矛盾的 boolean；③ 可派生的数据不要存；④ 同一实体避免复制；⑤ 深层结构难更新时考虑 normalization。`}),(0,h.jsx)(`div`,{children:`项目边界：这里不是要求“所有 state 都扁平化”。如果嵌套结构很浅且天然一起更新，保持对象结构反而更直观；重构目标是降低出错概率，而不是追求某种固定形状。`})]})]})}var Ne=[{id:`overview`,label:`概览`},{id:`activity`,label:`动态`},{id:`settings`,label:`设置`}];function Pe({value:e,defaultValue:t=`overview`,onChange:n}){let[r,i]=(0,d.useState)(t),a=e!==void 0,o=a?e:r;function s(e){a||i(e),n?.(e)}return(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:Ne.map(e=>(0,h.jsx)(`button`,{className:`btn ${o===e.id?`btn-primary`:`btn-secondary`} btn-sm`,onClick:()=>s(e.id),children:e.label},e.id))}),(0,h.jsxs)(`div`,{style:{marginTop:12,padding:12,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:`var(--bg-surface-secondary)`},children:[`当前 Tab：`,(0,h.jsx)(`strong`,{children:o})]})]})}function Fe(){let[e,t]=(0,d.useState)(`overview`),[n,r]=(0,d.useState)([]);function i(e){t(e),r(t=>[`父组件收到 onChange(${e})，决定更新 value`,...t].slice(0,5))}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🎛️`}),` Controlled / Uncontrolled：谁拥有这份 State？`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`State Ownership`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`“受控/非受控”不只属于表单输入，它描述的是`,(0,h.jsx)(`strong`,{children:`组件状态由谁拥有`}),`。受控组件把当前值交给父组件管理；非受控组件自己持有 State，并允许父组件通过 defaultValue 提供初始值。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`value + onChange`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`defaultValue`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Single Source of Truth`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`1. 受控模式：父组件持有唯一事实来源`}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`Tabs 不直接决定最终 active tab，而是发出 onChange。父组件收到事件后更新 value，再通过 props 把新值传回 Tabs。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:14,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsx)(Pe,{value:e,onChange:i}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`父组件 State`}),(0,h.jsxs)(`div`,{children:[`controlledValue = `,e]})]})]}),(0,h.jsxs)(`div`,{style:{padding:14,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsx)(`strong`,{children:`数据流`}),(0,h.jsx)(`pre`,{style:{fontSize:12,lineHeight:1.6,overflowX:`auto`},children:`Parent state
   ↓ value
<Tabs />
   ↓ onChange(next)
Parent setter
   ↓
next render
   ↓ value
<Tabs />`}),(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`},children:n.length===0?`点击任意 Tab 观察父组件事件日志。`:n.map((e,t)=>(0,h.jsxs)(`div`,{children:[`• `,e]},`${e}-${t}`))})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`2. 非受控模式：组件内部持有 State`}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`父组件只给一次初始值 `,(0,h.jsx)(`code`,{children:`defaultValue="activity"`}),`。之后切换由 Tabs 自己的 internalValue 管理。父组件仍可监听 onChange，但不控制当前值。`]})]}),(0,h.jsx)(`div`,{style:{padding:14,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:(0,h.jsx)(Pe,{defaultValue:`activity`})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`defaultValue 的含义`}),(0,h.jsxs)(`div`,{children:[`它表达“初始值”，不是持续同步的控制信号。真实组件库通常用 `,(0,h.jsx)(`code`,{children:`defaultValue`}),` / `,(0,h.jsx)(`code`,{children:`defaultOpen`}),` 这类命名明确这一点。`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`3. 项目中如何选择`})}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsx)(`div`,{className:`comparison-header good`,children:`✅ 适合受控`}),(0,h.jsx)(`div`,{style:{fontSize:13,lineHeight:1.7},children:`URL 需要同步当前 Tab；多个组件共享同一选择；父组件需要校验、阻止或重置状态；业务流程需要完整审计状态变化。`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsx)(`div`,{className:`comparison-header good`,children:`✅ 适合非受控`}),(0,h.jsx)(`div`,{style:{fontSize:13,lineHeight:1.7},children:`局部 UI 状态只在组件内部有意义；父组件只关心初始值；例如 Accordion 默认展开项、临时 Popover 状态等。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ API 边界`}),(0,h.jsx)(`div`,{children:`一个组件可以设计成同时支持 controlled / uncontrolled 两种模式，但一次挂载期间应保持模式稳定。不要一会传 value、一会又删除 value；这会让状态所有权变得不清晰，也很容易制造同步 Bug。`})]})]})}function Ie({value:e,onChange:t,onClear:n}){return(0,h.jsxs)(`div`,{style:{position:`relative`,width:`100%`},children:[(0,h.jsx)(`input`,{type:`text`,className:`form-input`,value:e,onChange:e=>t(e.target.value),placeholder:`搜索技术栈（如 React, Vue, Vite...）`,style:{paddingRight:e?`32px`:`12px`}}),e&&(0,h.jsx)(`button`,{onClick:n,"aria-label":`清空搜索`,style:{position:`absolute`,right:`8px`,top:`50%`,transform:`translateY(-50%)`,background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-subtle)`,fontSize:`14px`,padding:`2px`},children:`✕`})]})}function Le({matchCount:e,totalCount:t,query:n}){return(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`10px 14px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`,fontSize:`13px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{children:`共匹配到 `}),(0,h.jsx)(`strong`,{style:{color:e>0?`var(--color-primary)`:`var(--color-danger)`},children:e}),(0,h.jsxs)(`span`,{children:[` / `,t,` 项`]})]}),n&&(0,h.jsxs)(`span`,{className:`badge badge-blue`,children:[`当前过滤条件: "`,n,`"`]})]})}function Re({items:e,query:t,onSelectItem:n}){return e.length===0?(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`32px 0`,color:`var(--text-subtle)`,fontSize:`14px`},children:[`🔍 未找到与 "`,t,`" 匹配的前端技术栈`]}):(0,h.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(180px, 1fr))`,gap:`10px`},children:e.map(e=>{let r=t&&e.name.toLowerCase().includes(t.toLowerCase());return(0,h.jsxs)(`div`,{onClick:()=>n(e),style:{padding:`12px 14px`,border:r?`1px solid var(--color-primary-border)`:`1px solid var(--border-color)`,backgroundColor:r?`var(--color-primary-light)`:`var(--bg-surface)`,borderRadius:`var(--radius-sm)`,cursor:`pointer`,transition:`all var(--transition-fast)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsx)(`strong`,{style:{fontSize:`14px`,color:r?`var(--color-primary-dark)`:`var(--text-main)`},children:e.name}),(0,h.jsx)(`span`,{className:`badge badge-gray`,style:{fontSize:`10px`},children:e.type})]}),(0,h.jsx)(`div`,{style:{fontSize:`11px`,color:`var(--text-subtle)`,marginTop:`4px`},children:e.desc})]},e.id)})})}var ze=[{id:1,name:`React`,type:`UI 库`,desc:`构建 Web 与原生交互界面`},{id:2,name:`Vue`,type:`渐进式框架`,desc:`易学易用、性能出色的 MVVM 框架`},{id:3,name:`Angular`,type:`综合平台`,desc:`Google 出品的企业级全功能框架`},{id:4,name:`Svelte`,type:`编译器`,desc:`将声明式代码编译为极小原生的 JS`},{id:5,name:`Next.js`,type:`全栈框架`,desc:`React 生态服务端渲染利器`},{id:6,name:`Vite`,type:`构建工具`,desc:`基于原生 ESM 的极速前端开发工具`}];function Be(){let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(ze),[i,a]=(0,d.useState)(``),[o,s]=(0,d.useState)(null),c=n.filter(t=>t.name.toLowerCase().includes(e.toLowerCase())||t.desc.toLowerCase().includes(e.toLowerCase()));return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🪜`}),` 状态提升（Lifting State Up）与兄弟协同`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`单向数据流核心`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`在 React 中，兄弟组件之间`,(0,h.jsx)(`strong`,{children:`无法直接横向传递状态`}),`。当两个或多个子组件需要反映相同的数据变化时，必须将该状态提升至它们的`,(0,h.jsx)(`strong`,{children:`最近公共父组件`}),`中统一管理，并通过 Props 向下分发。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`受控输入 (Controlled Input)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`最近共同祖先 (Closest Common Ancestor)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`事件向上回传 (Event Callbacks)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📐`}),` 状态提升架构数据流向`]}),(0,h.jsx)(`pre`,{style:{margin:`6px 0 0 0`,fontSize:`12px`,background:`#f8fafc`,padding:`10px`,borderRadius:`6px`,overflowX:`auto`},children:`       ┌────────────────────────────────────────────────────────┐
       │   公共父组件 LiftingStateUpDemo (持有 [query, setQuery])   │
       └──────────────────────────┬─────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ 传 value + onChange    │ 传 filteredList.length │ 传 filteredList
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 子组件 SearchBox │    │ 子组件 Summary   │    │ 子组件 List      │
└──────────────────┘    └──────────────────┘    └──────────────────┘`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 协同联动实验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`在输入框键入关键词，观察输入框、统计卡片和结果列表三者如何实时协同：`})]}),(0,h.jsx)(`div`,{style:{marginBottom:`14px`},children:(0,h.jsx)(Ie,{value:e,onChange:t,onClear:()=>t(``)})}),(0,h.jsx)(`div`,{style:{marginBottom:`14px`},children:(0,h.jsx)(Le,{matchCount:c.length,totalCount:n.length,query:e})}),(0,h.jsx)(`div`,{style:{marginBottom:`20px`},children:(0,h.jsx)(Re,{items:c,query:e,onSelectItem:s})}),o&&(0,h.jsxs)(`div`,{style:{padding:`12px 16px`,background:`var(--color-primary-light)`,border:`1px solid var(--color-primary-border)`,borderRadius:`var(--radius-sm)`,marginBottom:`16px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{children:`当前选中的卡片：`}),(0,h.jsx)(`strong`,{children:o.name}),` - `,o.desc]}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>s(null),children:`取消选中`})]}),(0,h.jsxs)(`form`,{onSubmit:e=>{if(e.preventDefault(),!i.trim())return;let t={id:Date.now(),name:i.trim(),type:`自定义`,desc:`用户动态添加的探索技术项`};r(e=>[t,...e]),a(``)},style:{display:`flex`,gap:`10px`,alignItems:`center`,paddingTop:`14px`,borderTop:`1px solid var(--border-subtle)`},children:[(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{maxWidth:`240px`},placeholder:`添加新技术栈...`,value:i,onChange:e=>a(e.target.value)}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-secondary btn-sm`,children:`➕ 添加到列表`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 状态提升的最佳实践法则`]}),(0,h.jsx)(`div`,{children:`1. 寻找消费该状态的所有组件树节点。`}),(0,h.jsxs)(`div`,{children:[`2. 找到它们在组件树中位置最低的`,(0,h.jsx)(`strong`,{children:`共同父组件`}),`。`]}),(0,h.jsx)(`div`,{children:`3. 将状态与变更方法定义在共同父组件，向下通过 Props 传给子组件消费。`})]})]})}var Ve=[{id:`taylor`,name:`Taylor`},{id:`alice`,name:`Alice`},{id:`bob`,name:`Bob`}];function He({contact:e}){let[t,n]=(0,d.useState)(``);return(0,h.jsxs)(`div`,{style:{padding:14,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{marginBottom:8},children:[`当前收件人：`,(0,h.jsx)(`strong`,{children:e.name})]}),(0,h.jsx)(`textarea`,{value:t,onChange:e=>n(e.target.value),placeholder:`写给 ${e.name} 的消息...`,rows:4,style:{width:`100%`,resize:`vertical`}}),(0,h.jsxs)(`div`,{style:{marginTop:8,fontSize:12,color:`var(--text-muted)`},children:[`Chat 内部 State：draft = `,t||`(empty)`]})]})}function Ue({selectedId:e,onSelect:t}){return(0,h.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:Ve.map(n=>(0,h.jsx)(`button`,{className:`btn ${e===n.id?`btn-primary`:`btn-secondary`} btn-sm`,onClick:()=>t(n),children:n.name},n.id))})}function We(){let[e,t]=(0,d.useState)(Ve[0]),[n,r]=(0,d.useState)(Ve[0]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` Preserving / Resetting State：State 属于树中的位置`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Identity`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`React 不把 State 简单“存在组件函数里”，而是把 State 与组件在 render tree 中的位置和身份关联。相同位置继续渲染相同类型组件时，State 默认会保留；改变 key 可以明确告诉 React：这是另一个组件身份，应重新创建并重置子树 State。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`tree position`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`component type`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`key`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`1. 相同位置 + 相同组件类型：State 被保留`}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`先给 Taylor 输入草稿，再切换 Alice。虽然 contact prop 变了，但这里始终是在同一个父级位置渲染同一个 Chat 类型，因此 React 复用这个组件身份，draft 继续保留。`})]}),(0,h.jsx)(Ue,{selectedId:e.id,onSelect:t}),(0,h.jsx)(`div`,{style:{marginTop:12},children:(0,h.jsx)(He,{contact:e})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ 真实风险`}),(0,h.jsx)(`div`,{children:`聊天、编辑器、表单等场景里，保留旧 State 可能让用户把上一位对象的草稿误操作到新对象上。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`2. 改变 key：显式切换组件身份并 reset`}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`下面给 Chat 设置 `,(0,h.jsxs)(`code`,{children:[`key=`,`{contact.id}`]}),`。切换联系人时 key 改变，React 会把旧 Chat 从树中移除，再创建一个新的 Chat，因此内部 draft 从初始值重新开始。`]})]}),(0,h.jsx)(Ue,{selectedId:n.id,onSelect:r}),(0,h.jsx)(`div`,{style:{marginTop:12},children:(0,h.jsx)(He,{contact:n},n.id)})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`3. 心智模型`})}),(0,h.jsx)(`pre`,{style:{fontSize:12,lineHeight:1.7,overflowX:`auto`},children:`same parent position
+ same component type
+ same key (or no key)
        ↓
React keeps component identity
        ↓
State preserved

key changes
        ↓
component identity changes
        ↓
old subtree unmounts
        ↓
new subtree mounts
        ↓
State reset`})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsx)(`div`,{className:`comparison-header good`,children:`✅ 主动 reset 的典型场景`}),(0,h.jsx)(`div`,{style:{fontSize:13,lineHeight:1.7},children:`切换聊天对象、编辑不同实体、切换租户/账户、重新开始向导步骤时，如果旧局部 State 不应该跨实体继承，可以让实体 ID 参与 key。`})]}),(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsx)(`div`,{className:`comparison-header bad`,children:`❌ 常见误解`}),(0,h.jsx)(`div`,{style:{fontSize:13,lineHeight:1.7},children:`key 不只是列表 warning 的修复工具，也不要为了“强制刷新”随意使用随机 key。随机 key 会让组件每次 render 都丢失身份，造成不必要的卸载、挂载和 State 丢失。`})]})]})]})}var Ge={count:0,step:1,history:[]};function Ke(e,t){switch(t.type){case`INCREMENT`:{let t=e.count+e.step;return{...e,count:t,history:[{type:`+${e.step}`,from:e.count,to:t,time:new Date().toLocaleTimeString()},...e.history.slice(0,7)]}}case`DECREMENT`:{let t=e.count-e.step;return{...e,count:t,history:[{type:`-${e.step}`,from:e.count,to:t,time:new Date().toLocaleTimeString()},...e.history.slice(0,7)]}}case`SET_STEP`:return{...e,step:t.payload};case`RESET`:return{...e,count:0,history:[{type:`RESET`,from:e.count,to:0,time:new Date().toLocaleTimeString()},...e.history.slice(0,7)]};case`UNDO`:{if(e.history.length===0)return e;let t=e.history[0];return{...e,count:t.from,history:e.history.slice(1)}}default:throw Error(`未处理的 Action 类型: ${t.type}`)}}function qe(){let[e,t]=(0,d.useReducer)(Ke,Ge);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⚙️`}),` 使用 Reducer 替换 State（useReducer 状态机模式）`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`架构级状态管理`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`当一个组件的状态逻辑变得复杂（包含多个相互关联的子字段，或者下一个状态依赖于上一个状态的深层计算）时，将状态更新提取为`,(0,h.jsx)(`strong`,{children:`外部纯函数 Reducer`}),` 能让逻辑清晰可测，并通过统一的 `,(0,h.jsx)(`code`,{children:`dispatch(action)`}),` 驱动变更。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`纯函数 Reducer`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`统一 Action 调度 (Dispatch)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`时间旅行轨迹 (State History)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 状态机工作台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击操作按钮调度 Action，观察当前计数与历史记录流转：`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:`20px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`,display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`16px 0`},children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,textTransform:`uppercase`,letterSpacing:`1px`},children:`Current Value`}),(0,h.jsx)(`div`,{style:{fontSize:`48px`,fontWeight:`800`,color:e.count>=0?`var(--color-primary)`:`var(--color-danger)`},children:e.count}),(0,h.jsxs)(`div`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginTop:`4px`},children:[`步长 (Step): `,(0,h.jsx)(`strong`,{children:e.step})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`8px`},children:[(0,h.jsx)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`修改步长：`}),[1,5,10,50].map(n=>(0,h.jsxs)(`button`,{className:`btn btn-sm ${e.step===n?`btn-primary`:`btn-secondary`}`,onClick:()=>t({type:`SET_STEP`,payload:n}),children:[`±`,n]},n))]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`center`},children:[(0,h.jsxs)(`button`,{className:`btn btn-secondary`,style:{flex:1},onClick:()=>t({type:`DECREMENT`}),children:[`-`,e.step]}),(0,h.jsxs)(`button`,{className:`btn btn-primary`,style:{flex:1},onClick:()=>t({type:`INCREMENT`}),children:[`+`,e.step]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`center`},children:[(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>t({type:`UNDO`}),disabled:e.history.length===0,children:`↩️ 撤销一步 (Undo)`}),(0,h.jsx)(`button`,{className:`btn btn-danger btn-sm`,onClick:()=>t({type:`RESET`}),children:`🔄 重置归零`})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,h.jsxs)(`h4`,{style:{margin:0,fontSize:`14px`,color:`var(--text-main)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,h.jsx)(`span`,{children:`Action 流转审计日志`}),(0,h.jsxs)(`span`,{className:`badge badge-gray`,children:[e.history.length,` 条记录`]})]}),e.history.length===0?(0,h.jsx)(`div`,{style:{padding:`32px 16px`,textAlign:`center`,color:`var(--text-subtle)`,background:`var(--bg-surface)`,border:`1px dashed var(--border-color)`,borderRadius:`var(--radius-sm)`,fontSize:`13px`},children:`暂无变更记录，点击左侧按钮开始操作`}):(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`,maxHeight:`240px`,overflowY:`auto`},children:e.history.map((e,t)=>(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,fontSize:`12px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,h.jsx)(`span`,{className:`badge ${e.type.startsWith(`+`)?`badge-green`:e.type.startsWith(`-`)?`badge-amber`:`badge-purple`}`,children:e.type}),(0,h.jsxs)(`span`,{children:[e.from,` ➔ `,e.to]})]}),(0,h.jsx)(`span`,{style:{color:`var(--text-subtle)`,fontSize:`11px`},children:e.time})]},t))})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚖️`}),` useState 与 useReducer 选型指南`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`comparison-card`,style:{borderColor:`var(--border-color)`},children:[(0,h.jsxs)(`div`,{className:`comparison-header`,style:{color:`var(--color-primary)`},children:[(0,h.jsx)(`span`,{children:`🔹`}),` 何时首选 useState？`]}),(0,h.jsxs)(`ul`,{style:{margin:0,paddingLeft:`18px`,fontSize:`13px`,color:`var(--text-muted)`,display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,h.jsx)(`li`,{children:`单一基础数据类型（布尔值、字符串、数字）。`}),(0,h.jsx)(`li`,{children:`组件逻辑简短，状态更新互不干涉。`}),(0,h.jsx)(`li`,{children:`开发快速原型，没有深度的多步骤业务分支。`})]})]}),(0,h.jsxs)(`div`,{className:`comparison-card`,style:{borderColor:`var(--border-color)`},children:[(0,h.jsxs)(`div`,{className:`comparison-header`,style:{color:`var(--color-purple)`},children:[(0,h.jsx)(`span`,{children:`🔸`}),` 何时首选 useReducer？`]}),(0,h.jsxs)(`ul`,{style:{margin:0,paddingLeft:`18px`,fontSize:`13px`,color:`var(--text-muted)`,display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,h.jsx)(`li`,{children:`状态是一个包含多个关联字段的对象。`}),(0,h.jsx)(`li`,{children:`下一个状态强依赖于上一个状态的历史快照。`}),(0,h.jsx)(`li`,{children:`需要单测状态机逻辑（Reducer 可脱离 React 单独跑 Jest/Vitest 测试）。`}),(0,h.jsx)(`li`,{children:`需要结合 Context 实现跨层级分发（参考下一个案例）。`})]})]})]})]})]})}var Je=(0,d.createContext)(`light`);function Ye({label:e,count:t}){return(0,h.jsxs)(`span`,{className:`badge badge-gray`,children:[e,` render #`,t]})}function Xe({parentRenderCount:e}){let t=(0,d.useContext)(Je),n=e.consumer;return(0,h.jsxs)(`div`,{style:{padding:12,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsx)(Ye,{label:`Consumer`,count:n}),(0,h.jsxs)(`div`,{style:{marginTop:8},children:[`useContext(ThemeContext) = `,(0,h.jsx)(`strong`,{children:t})]})]})}var Ze=(0,d.memo)(function({parentRenderCount:e}){let t=(0,d.useContext)(Je),n=e.memoConsumer;return(0,h.jsxs)(`div`,{style:{padding:12,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsx)(Ye,{label:`memo Consumer`,count:n}),(0,h.jsxs)(`div`,{style:{marginTop:8},children:[`context = `,(0,h.jsx)(`strong`,{children:t})]})]})}),Qe=(0,d.memo)(function({parentRenderCount:e}){let t=e.nonConsumer;return(0,h.jsxs)(`div`,{style:{padding:12,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsx)(Ye,{label:`memo Non-consumer`,count:t}),(0,h.jsx)(`div`,{style:{marginTop:8},children:`这个组件没有读取 ThemeContext。`})]})});function $e(){let[e,t]=(0,d.useState)(`light`),[n,r]=(0,d.useState)(0),[i,a]=(0,d.useState)({consumer:1,memoConsumer:1,nonConsumer:1});function o(){t(e=>e===`light`?`dark`:`light`),a(e=>({consumer:e.consumer+1,memoConsumer:e.memoConsumer+1,nonConsumer:e.nonConsumer}))}function s(){r(e=>e+1),a(e=>({consumer:e.consumer+1,memoConsumer:e.memoConsumer,nonConsumer:e.nonConsumer}))}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📡`}),` Context 更新传播：谁会收到新值？`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Subscription`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`useContext 不只是“跨层取值”，它同时建立订阅关系。Provider 的 value 变化后，读取该 Context 的组件会收到最新值并重新渲染；memo 不能阻止 Context 消费者接收新的 Context value。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`1. 两种更新来源`}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击“切换 Theme”改变 Provider value；点击“更新局部 State”只改变父组件自己的 localCount。观察消费者和非消费者的差异。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:o,children:`切换 Theme`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:s,children:`更新局部 State`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Provider / Local State`}),(0,h.jsxs)(`div`,{children:[`theme = `,e,` · localCount = `,n]})]})]}),(0,h.jsx)(Je,{value:e,children:(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsx)(Xe,{parentRenderCount:i}),(0,h.jsx)(Ze,{parentRenderCount:i}),(0,h.jsx)(Qe,{parentRenderCount:i})]})}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`2. 传播模型`})}),(0,h.jsx)(`pre`,{style:{fontSize:12,lineHeight:1.7,overflowX:`auto`},children:`Provider value changes
        ↓
React compares old/new value with Object.is
        ↓
all descendants that read this Context
receive the fresh value
        ↓
those consumers re-render

memo(Component)
        ↓
can skip parent-prop-driven work
but does NOT block fresh Context values`})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsx)(`div`,{className:`comparison-header good`,children:`✅ 设计边界`}),(0,h.jsx)(`div`,{style:{fontSize:13,lineHeight:1.7},children:`Context 适合主题、认证信息、locale、页面级共享状态等跨层数据。Provider value 变化频繁时，应关注 value 粒度、拆分 Context 或稳定对象/函数引用。`})]}),(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsx)(`div`,{className:`comparison-header bad`,children:`❌ 常见误解`}),(0,h.jsx)(`div`,{style:{fontSize:13,lineHeight:1.7},children:`Context 不是“不会 re-render 的全局变量”。读取 Context 就意味着订阅它；也不能指望给消费者套 memo 就阻止 Context 更新传播。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`关于本页 render 计数`}),(0,h.jsx)(`div`,{children:`计数用于教学可视化，显式按实验动作记录预期传播路径，不作为 React Profiler 的替代品。真实性能诊断应使用 React DevTools Profiler。`})]})]})}var et=(0,d.createContext)(null),tt=(0,d.createContext)(null),nt=[{id:1,title:`学习 React 19 核心 API`,done:!0},{id:2,title:`拆分 Context 双通道，规避无效重渲染`,done:!1},{id:3,title:`消除全部 Oxlint 语法规范告警`,done:!1}];function rt(e,t){switch(t.type){case`ADD`:return[{id:Date.now(),title:t.title,done:!1},...e];case`TOGGLE`:return e.map(e=>e.id===t.id?{...e,done:!e.done}:e);case`DELETE`:return e.filter(e=>e.id!==t.id);case`CLEAR_DONE`:return e.filter(e=>!e.done);default:return e}}function it(){let e=(0,d.useContext)(et);if(!e)throw Error(`useTaskState 必须在 TaskProvider 内使用`);return e}function at(){let e=(0,d.useContext)(tt);if(!e)throw Error(`useTaskDispatch 必须在 TaskProvider 内使用`);return e}function ot({children:e}){let[t,n]=(0,d.useReducer)(rt,nt);return(0,h.jsx)(et.Provider,{value:t,children:(0,h.jsx)(tt.Provider,{value:n,children:e})})}function st(){let e=at(),t=(0,d.useRef)(null);(0,d.useEffect)(()=>{if(t.current){let e=(Number(t.current.dataset.renders)||0)+1;t.current.dataset.renders=String(e),t.current.textContent=`⚡ 挂载/渲染次数：${e} 次（保持恒定）`}});let n=t=>{e({type:`ADD`,title:t})};return(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`10px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`14px`,color:`var(--text-main)`},children:`组件 A：任务添加栏（只订阅 Dispatch 通道）`}),(0,h.jsx)(`span`,{ref:t,className:`badge badge-green`,children:`⚡ 挂载/渲染次数：1 次（保持恒定）`})]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 10px 0`,fontSize:`12.5px`,color:`var(--text-muted)`},children:[`由于仅使用了 `,(0,h.jsx)(`code`,{children:`useTaskDispatch()`}),`，即便右侧任务列表不断增删，本组件依然 0 次多余重渲染！`]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`},children:[(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>n(`阅读 React Profiler 性能文档`),children:`➕ 添加：阅读 React Profiler 文档`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>n(`编写自定义 Hook 并做好安全断言`),children:`➕ 添加：编写安全 Hook`}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>e({type:`CLEAR_DONE`}),children:`🧹 清理已完成`})]})]})}function ct(){let e=it(),t=at(),n=(0,d.useRef)(null);return(0,d.useEffect)(()=>{if(n.current){let e=(Number(n.current.dataset.renders)||0)+1;n.current.dataset.renders=String(e),n.current.textContent=`🔄 渲染次数：${e} 次（随 State 刷新）`}}),(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`12px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`14px`,color:`var(--text-main)`},children:`组件 B：任务列表视图（订阅 State 通道）`}),(0,h.jsx)(`span`,{ref:n,className:`badge badge-amber`,children:`🔄 渲染次数：1 次（随 State 刷新）`})]}),(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:e.map(e=>(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`8px 12px`,background:e.done?`var(--bg-surface-secondary)`:`var(--bg-surface)`,border:`1px solid var(--border-subtle)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`input`,{type:`checkbox`,checked:e.done,onChange:()=>t({type:`TOGGLE`,id:e.id}),style:{cursor:`pointer`}}),(0,h.jsx)(`span`,{style:{fontSize:`13.5px`,textDecoration:e.done?`line-through`:`none`,color:e.done?`var(--text-subtle)`:`var(--text-main)`},children:e.title})]}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:()=>t({type:`DELETE`,id:e.id}),style:{padding:`2px 8px`,fontSize:`11px`},children:`删除`})]},e.id))})]})}function lt(){return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⚡`}),` Reducer + Context 双通道拆分与性能极致优化`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`高级性能模式`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`在传统 Context 架构中，一旦将 `,(0,h.jsx)(`code`,{children:`{ state, dispatch }`}),` 混在一个 Provider 中向下传递，每次 state 变更都会导致整个子树所有订阅 Context 的组件无脑重新渲染。`,(0,h.jsx)(`strong`,{children:`双通道拆分模式`}),` 将 State 与稳定的 Dispatch 彻底隔离，让写组件保持 0 无效重渲染。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`双通道架构 (Dual-Channel Context)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Dispatch 引用不变性 (Stable Identity)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`按需精确定向重渲染 (Targeted Re-render)`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚖️`}),` 单通道 vs 双通道架构对比`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 单通道（常见性能杀手）`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#fef2f2`,borderRadius:`4px`,fontSize:`12px`,overflowX:`auto`},children:`// 🔴 只要 state 变了，对象引用更新
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
</StateContext.Provider>`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔬`}),` 实时渲染计数测试工作台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击下方组件 A 中的按钮添加或切换任务，注意观察顶部绿色的【组件 A 渲染次数】与橙色的【组件 B 渲染次数】：`})]}),(0,h.jsx)(ot,{children:(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,h.jsx)(st,{}),(0,h.jsx)(ct,{})]})})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 性能优化心智法则`]}),(0,h.jsxs)(`div`,{children:[`React 官方明确指出：`,(0,h.jsx)(`code`,{children:`dispatch`}),` 函数的引用在组件的整个生命周期中是`,(0,h.jsx)(`strong`,{children:`完全稳定且永久不变的`}),`。因此，通过单独开辟 `,(0,h.jsx)(`code`,{children:`DispatchContext`}),`，所有只负责触发行为的组件（按钮、表单提交器、定时调度器）都不需要重渲染，无需编写任何复杂的 `,(0,h.jsx)(`code`,{children:`React.memo`}),`！`]})]})]})}function ut(){let e=(0,d.useRef)(null),t=(0,d.useRef)(null),[n,r]=(0,d.useState)([`欢迎来到 React 19 核心研讨室`,`useRef 能够保存对底层 DOM 节点的直接引用`]),[i,a]=(0,d.useState)(``),o=(0,d.useRef)(!0);(0,d.useLayoutEffect)(()=>{if(o.current){o.current=!1;return}t.current&&t.current.scrollTo({top:t.current.scrollHeight,behavior:`smooth`})},[n]);let s=t=>{t.preventDefault(),i.trim()&&(r(e=>[...e,i.trim()]),a(``),e.current?.focus())},c=()=>{e.current?.focus()},[l,u]=(0,d.useState)(0),[f,p]=(0,d.useState)(!1),m=(0,d.useRef)(null),g=()=>{m.current===null&&(p(!0),m.current=setInterval(()=>{u(e=>e+1)},1e3))},_=()=>{m.current!==null&&(clearInterval(m.current),m.current=null),p(!1)};return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🎯`}),` useRef 核心用法、DOM 控制与避坑守则`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`底层引用通道`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`useRef`}),` 返回一个可变的 ref 对象，其 `,(0,h.jsx)(`code`,{children:`.current`}),` 属性在组件的整个生命周期内持久存在。它最核心的两大职责：`,(0,h.jsx)(`strong`,{children:`直接操作底层 DOM 节点`}),`，以及`,(0,h.jsx)(`strong`,{children:`跨渲染持久化任意可变值且不触发重渲染`}),`。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`DOM 访问（Focus / Scroll / Measure）`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`不引发重渲染 (Silent Mutability)`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`纯函数渲染安全守则`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🖥️`}),` 1. DOM 访问：主动聚焦与聊天室自动平滑触底`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`通过 `,(0,h.jsx)(`code`,{children:`ref={inputRef}`}),` 绑定真实 DOM，可在点击或发送后立即调用 `,(0,h.jsx)(`code`,{children:`.focus()`}),`，并在新消息到来时自动调用 `,(0,h.jsx)(`code`,{children:`scrollTo`}),`：`]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`8px`},children:[(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:[`聊天消息窗口（总计 `,n.length,` 条）`]}),(0,h.jsx)(`button`,{className:`btn btn-outline btn-sm`,onClick:c,children:`🎯 主动聚焦输入框`})]}),(0,h.jsx)(`div`,{ref:t,style:{height:`160px`,overflowY:`auto`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,padding:`10px`,background:`var(--bg-surface-secondary)`,display:`flex`,flexDirection:`column`,gap:`8px`},children:n.map((e,t)=>(0,h.jsx)(`div`,{style:{padding:`6px 12px`,background:`var(--bg-surface)`,borderRadius:`var(--radius-sm)`,border:`1px solid var(--border-subtle)`,fontSize:`13px`,alignSelf:t%2==0?`flex-start`:`flex-end`,maxWidth:`85%`},children:e},t))}),(0,h.jsxs)(`form`,{onSubmit:s,style:{display:`flex`,gap:`8px`,marginTop:`10px`},children:[(0,h.jsx)(`input`,{ref:e,type:`text`,className:`form-input`,placeholder:`键入消息，回车发送...`,value:i,onChange:e=>a(e.target.value)}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,children:`发送`})]})]}),(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`8px`},children:[(0,h.jsx)(`h4`,{style:{margin:0,fontSize:`14px`},children:`2. 可变值存储：高精度秒表`}),(0,h.jsx)(`span`,{className:`badge ${f?`badge-green`:`badge-gray`}`,children:f?`⏱️ 计时中 (Ref 持有句柄)`:`⏸️ 处于就绪状态`})]}),(0,h.jsxs)(`p`,{style:{margin:`0 0 16px 0`,fontSize:`12.5px`,color:`var(--text-muted)`,lineHeight:`1.5`},children:[`定时器的 `,(0,h.jsx)(`code`,{children:`timerId`}),` 是纯逻辑变量。如果保存在 `,(0,h.jsx)(`code`,{children:`useState`}),` 中，每次赋值都会造成无意义重渲染；保存在 `,(0,h.jsx)(`code`,{children:`useRef`}),` 中既能安全跨周期存活，又绝不造成多余渲染。`]}),(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`12px 0`,fontSize:`36px`,fontWeight:`800`,color:f?`var(--color-primary)`:`var(--text-muted)`},children:[l,`s`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,justifyContent:`center`},children:[f?(0,h.jsx)(`button`,{className:`btn btn-warning btn-sm`,onClick:_,children:`⏸️ 暂停秒表`}):(0,h.jsx)(`button`,{className:`btn btn-success btn-sm`,onClick:g,children:`▶️ 启动秒表`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>{_(),u(0)},children:`🔄 复位`})]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-danger`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`⚠️`}),` React 官方黄金禁忌守则：切勿在渲染阶段读写 ref.current！`]}),(0,h.jsxs)(`div`,{style:{fontSize:`13px`,lineHeight:`1.6`},children:[`不要在组件函数的顶层（即 JSX 返回期间）写入或读取 `,(0,h.jsx)(`code`,{children:`ref.current`}),`，例如 `,(0,h.jsx)(`code`,{children:`ref.current = 123`}),` 或 `,(0,h.jsx)(`code`,{children:`<p>{ref.current}</p>`}),`！ 因为 React 的渲染阶段必须是一个`,(0,h.jsx)(`strong`,{children:`无副作用的纯计算过程`}),`。在并发渲染（Concurrent Mode）下，React 可能会多次尝试渲染某个组件，在渲染期修改 Ref 会导致渲染逻辑不纯、不可重入，引发严重难以排查的竞态 Bug。`,(0,h.jsx)(`strong`,{children:`仅在事件处理函数（onClick）或 useEffect / useLayoutEffect 回调中操作 Ref！`})]})]})]})}function dt({onLog:e}){let[t,n]=(0,d.useState)(window.innerWidth);return(0,d.useEffect)(()=>{let t=()=>{n(window.innerWidth),e(`info`,`📐 窗口宽度变更为: ${window.innerWidth}px`)};return window.addEventListener(`resize`,t),()=>{window.removeEventListener(`resize`,t)}},[e]),(0,h.jsxs)(`div`,{style:{padding:`16px`,background:`var(--color-primary-light)`,border:`1px solid var(--color-primary-border)`,borderRadius:`var(--radius-sm)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,color:`var(--text-muted)`},children:`实时视口宽度监听器：`}),(0,h.jsxs)(`strong`,{style:{marginLeft:`8px`,fontSize:`16px`,color:`var(--color-primary)`},children:[t,` px`]})]}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`监听活跃中`})]})}function ft(){let[e,t]=(0,d.useState)(!0),[n,r]=(0,d.useState)([{type:`info`,text:`系统已就绪，准备演示 Effect 同步与 Cleanup`,time:new Date().toLocaleTimeString()}]),i=(0,d.useCallback)((e,t)=>{r(n=>[{type:e,text:t,time:new Date().toLocaleTimeString()},...n.slice(0,19)])},[]),a=()=>{t(e=>{let t=!e;return i(`info`,t?`🟢 [Setup 建立] 重新挂载监听组件；Effect 会注册 resize listener`:`🧹 [Cleanup 清理] 卸载监听组件；Effect cleanup 会移除 resize listener`),t})},[o,s]=(0,d.useState)(0);return(0,d.useEffect)(()=>{let e=document.title;return document.title=o>0?`(${o}条未读) React 学习实验室`:`React 学习实验室`,()=>{document.title=e}},[o]),(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🔄`}),` useEffect 正确用法、同步模型与 Cleanup`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`外部系统同步`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`useEffect`}),` 用来让组件与 React 之外的外部系统保持同步，例如浏览器事件、WebSocket、第三方控件或某些 timer。Cleanup 不是每个 Effect 都必须返回的仪式：`,(0,h.jsx)(`strong`,{children:`只有当 setup 建立了需要停止、撤销或释放的外部同步时，才应返回与之对称的 cleanup`}),`。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`External Sync`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Setup ↔ Cleanup`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`StrictMode Stress Test`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔬`}),` 实验 1：浏览器事件监听与对称清理`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`挂载组件后 Effect 注册 resize listener；卸载时 cleanup 移除同一个 listener。缩放窗口可观察当前订阅仍在工作。`})]}),(0,h.jsxs)(`div`,{style:{marginBottom:`14px`,display:`flex`,gap:`10px`},children:[(0,h.jsx)(`button`,{className:`btn ${e?`btn-danger`:`btn-success`}`,onClick:a,children:e?`❌ 卸载监听组件（触发 Cleanup）`:`➕ 挂载监听组件（触发 Setup）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:()=>r([]),children:`清空日志`})]}),e?(0,h.jsx)(`div`,{style:{marginBottom:`16px`},children:(0,h.jsx)(dt,{onLog:i})}):(0,h.jsx)(`div`,{style:{padding:`20px`,textAlign:`center`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`,color:`var(--text-subtle)`,fontSize:`13.5px`,marginBottom:`16px`},children:`组件已卸载；cleanup 会撤销这个组件建立的 resize 订阅。`}),(0,h.jsxs)(`div`,{className:`demo-console`,children:[(0,h.jsxs)(`div`,{className:`demo-console-header`,children:[(0,h.jsx)(`span`,{children:`TERMINAL OUTPUT / EFFECT LOGS`}),(0,h.jsxs)(`span`,{children:[n.length,` 条记录`]})]}),n.map((e,t)=>(0,h.jsxs)(`div`,{className:`demo-console-log ${e.type}`,children:[`[`,e.time,`] `,e.text]},t))]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🏷️`}),` 实验 2：把 React state 同步到 document.title`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`按钮只更新 React state；Effect 根据当前 state 把浏览器标签标题同步到相同状态。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>{s(e=>e+1),i(`info`,`🏷️ 请求更新未读数；Effect 会把最新状态同步到 document.title`)},children:`模拟收到未读通知 (+1)`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>{s(0),i(`info`,`🏷️ 清空未读数；Effect 会同步 document.title`)},children:`标记全部已读 (清空)`}),(0,h.jsxs)(`span`,{style:{fontSize:`13px`,color:`var(--text-muted)`},children:[`当前未读数：`,(0,h.jsx)(`strong`,{children:o}),` 条`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` StrictMode 到底在验证什么？`]}),(0,h.jsxs)(`div`,{children:[`开发环境启用 `,(0,h.jsx)(`code`,{children:`StrictMode`}),` 时，React 会对 Effect 做一次额外的 `,(0,h.jsx)(`strong`,{children:`setup → cleanup → setup`}),` 压力测试（并且 StrictMode 还有其他开发期检查）。目标不是模拟一次真实业务卸载，而是验证 cleanup 是否能完整撤销 setup；用户不应能分辨“只 setup 一次”和这组额外检查带来的差异。`]})]})]})}function pt({userId:e}){let[t,n]=(0,d.useState)(``);return(0,h.jsxs)(`div`,{style:{padding:`14px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{fontSize:`13px`,marginBottom:`8px`},children:[`给用户 `,(0,h.jsx)(`strong`,{children:e}),` 的留言板：`]}),(0,h.jsx)(`input`,{type:`text`,className:`form-input`,placeholder:`写下留言...`,value:t,onChange:e=>n(e.target.value)}),(0,h.jsxs)(`div`,{style:{fontSize:`11px`,color:`var(--text-subtle)`,marginTop:`6px`},children:[`当前输入草稿: `,t||`（空）`]})]})}function mt(){let e=[{id:1,name:`MacBook Pro 16`,category:`电脑`,price:19999},{id:2,name:`iPhone 16 Pro Max`,category:`手机`,price:9999},{id:3,name:`iPad Pro M4`,category:`平板`,price:8999},{id:4,name:`AirPods Pro 2`,category:`配件`,price:1899},{id:5,name:`Apple Watch Ultra 2`,category:`手表`,price:6499}],[t,n]=(0,d.useState)(``),[r,i]=(0,d.useState)(`全部`),a=e.filter(e=>{let n=r===`全部`||e.category===r,i=e.name.toLowerCase().includes(t.toLowerCase());return n&&i}),[o,s]=(0,d.useState)(0),[c,l]=(0,d.useState)([]),u=e=>{s(e=>e+1);let t=`用户主动点击购买了【${e}】，完成结算操作`;l(e=>[t,...e.slice(0,4)])},[f,p]=(0,d.useState)(`User_A`);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🚫`}),` 你可能不需要 Effect（官方避坑指南）`]})}),(0,h.jsx)(`span`,{className:`badge badge-amber`,children:`架构避坑`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`很多开发者将 `,(0,h.jsx)(`code`,{children:`useEffect`}),` 当成了“数据联动触发器”。滥用 Effect 会引发严重的级联重渲染、难以追踪的时序竞态与闪烁。React 官方总结了三大最典型的“伪 Effect 场景”。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`误区 1：渲染期数据派生`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`误区 2：用户事件放入 Effect`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`误区 3：利用 key 替代重置 Effect`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔍`}),` 误区 1：用 Effect 过滤衍生数据（产生二次无谓渲染）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`错误做法是声明 `,(0,h.jsx)(`code`,{children:`filteredList`}),` 状态并在 Effect 中 `,(0,h.jsx)(`code`,{children:`setFilteredList`}),`。正确做法：直接在组件内计算！`]})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 反模式代码`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#fef2f2`,borderRadius:`4px`,fontSize:`11.5px`,overflowX:`auto`},children:`// 🔴 错误：数据流变卡顿且触发两次 Render
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(products.filter(p => ...));
}, [query, category]);`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 官方推荐写法`]}),(0,h.jsx)(`pre`,{style:{margin:0,padding:`8px`,background:`#f0fdf4`,borderRadius:`4px`,fontSize:`11.5px`,overflowX:`auto`},children:`// 🟢 正确：纯计算，0 延迟，0 额外 state
const filtered = products.filter(p => {
  return matchCategory && matchQuery;
});`})]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,alignItems:`center`,marginBottom:`12px`,flexWrap:`wrap`},children:[(0,h.jsx)(`input`,{type:`text`,className:`form-input`,style:{maxWidth:`200px`},placeholder:`搜索商品...`,value:t,onChange:e=>n(e.target.value)}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:`6px`},children:[`全部`,`电脑`,`手机`,`平板`,`配件`,`手表`].map(e=>(0,h.jsx)(`button`,{className:`btn btn-sm ${r===e?`btn-primary`:`btn-secondary`}`,onClick:()=>i(e),children:e},e))})]}),(0,h.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(200px, 1fr))`,gap:`10px`},children:a.map(e=>(0,h.jsxs)(`div`,{style:{padding:`10px 14px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:`var(--bg-surface)`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`,gap:`8px`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{style:{fontSize:`13.5px`},children:e.name}),(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,marginTop:`2px`},children:e.category})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,h.jsxs)(`span`,{style:{fontWeight:`700`,color:`var(--color-danger)`,fontSize:`14px`},children:[`¥`,e.price]}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>u(e.name),children:`购买`})]})]},e.id))})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🛒`}),` 误区 2：在 Effect 中处理用户特定的事件（如购买通知、提交日志）`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`Effect 是为了`,(0,h.jsx)(`strong`,{children:`组件因为被展示而需要运行的代码`}),`。如果某段代码是因为`,(0,h.jsx)(`strong`,{children:`用户点击了按钮`}),`而运行，它必须直接写在 Event Handler 内部！`]})]}),(0,h.jsxs)(`div`,{style:{padding:`12px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{fontSize:`13px`,marginBottom:`8px`},children:[`已购买件数：`,(0,h.jsx)(`strong`,{children:o})]}),(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`最近操作触发记录（直接由 onClick 调度）：`}),c.length>0?(0,h.jsx)(`ul`,{style:{margin:`6px 0 0 0`,paddingLeft:`20px`,fontSize:`12.5px`},children:c.map((e,t)=>(0,h.jsx)(`li`,{children:e},t))}):(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-subtle)`,marginTop:`4px`},children:`点击上方商品的“购买”按钮即可触发`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔑`}),` 误区 3：使用 Effect 监听 Props 改变来重置组件状态`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`当用户 ID 切换时，需要重置输入草稿？切勿在 Effect 中调用 `,(0,h.jsx)(`code`,{children:`setComment("")`}),`，直接使用 `,(0,h.jsx)(`code`,{children:`key={userId}`}),` 即可让 React 自动完全重新初始化：`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,marginBottom:`14px`},children:[(0,h.jsx)(`button`,{className:`btn btn-sm ${f===`User_A`?`btn-primary`:`btn-secondary`}`,onClick:()=>p(`User_A`),children:`切换为用户 A (Alice)`}),(0,h.jsx)(`button`,{className:`btn btn-sm ${f===`User_B`?`btn-primary`:`btn-secondary`}`,onClick:()=>p(`User_B`),children:`切换为用户 B (Bob)`})]}),(0,h.jsx)(pt,{userId:f},f)]})]})}function ht(e,t){let n=setInterval(()=>{t({id:`${e}-${Date.now()}`,text:`[来自房间 #${e} 的实时消息] 当前在线人数: ${Math.floor(Math.random()*20+5)}`,time:new Date().toLocaleTimeString()})},2500);return{close(){clearInterval(n)}}}function gt(){let[e,t]=(0,d.useState)(`101`),[n,r]=(0,d.useState)([]),[i,a]=(0,d.useState)(!1),[o,s]=(0,d.useState)([{type:`success`,text:`🟢 初始房间将由 Effect 建立同步`,time:new Date().toLocaleTimeString()}]);function c(e,t){s(n=>[{type:e,text:t,time:new Date().toLocaleTimeString()},...n.slice(0,19)])}let l=(0,d.useEffectEvent)(e=>{r(t=>[e,...t.slice(0,7)]),c(i?`warn`:`info`,i?`🔕 收到消息；当前静音，不播放提示音`:`📩 收到新消息并播放提示音: ${e.text}`)});(0,d.useEffect)(()=>{let t=ht(e,l);return()=>{t.close()}},[e]);function u(n){n!==e&&(c(`error`,`🔴 [Cleanup] 关闭房间 #${e} 的 Socket 同步`),c(`success`,`🟢 [Setup] 建立房间 #${n} 的 Socket 同步`),t(n),r([]))}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🌐`}),` 响应式 Effect 的生命周期与依赖`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`深度核心`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`每个 Effect 描述一段独立的同步过程。依赖中的响应式值变化时，React 先用旧值执行 cleanup，再用新值执行 setup；卸载时执行最后一次 cleanup。这里真正决定“连接到哪个房间”的值是 `,(0,h.jsx)(`code`,{children:`roomId`}),`。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Reactive Values`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Cleanup → Setup`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Effect Event`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 实时聊天室连接模拟器`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`切换房间会改变同步目标，因此需要断开旧连接再建立新连接；静音只影响“收到消息后做什么”，不应该重新建立 Socket。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`12px`,marginBottom:`16px`,padding:`12px 16px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:`600`},children:`切换当前房间：`}),[`101`,`102`,`103`].map(t=>(0,h.jsxs)(`button`,{className:`btn btn-sm ${e===t?`btn-primary`:`btn-secondary`}`,onClick:()=>u(t),children:[`房间 #`,t]},t))]}),(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsx)(`button`,{className:`btn btn-sm ${i?`btn-warning`:`btn-outline`}`,onClick:()=>a(e=>!e),children:i?`🔕 当前已静音（点击解除）`:`🔔 开启静音（点击静音）`}),(0,h.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>s([]),children:`清空日志`})]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{fontSize:`13px`,fontWeight:`600`,marginBottom:`8px`,color:`var(--text-main)`},children:[`房间 #`,e,` 实时消息通道`]}),(0,h.jsx)(`div`,{style:{height:`220px`,overflowY:`auto`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,padding:`10px`,background:`var(--bg-surface)`,display:`flex`,flexDirection:`column`,gap:`8px`},children:n.length===0?(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`40px 0`,color:`var(--text-subtle)`,fontSize:`13px`},children:[`正在等待房间 #`,e,` 的广播消息...`]}):n.map(e=>(0,h.jsxs)(`div`,{style:{padding:`8px 12px`,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-sm)`,fontSize:`12.5px`},children:[(0,h.jsx)(`div`,{style:{color:`var(--text-subtle)`,fontSize:`11px`,marginBottom:`3px`},children:e.time}),(0,h.jsx)(`div`,{children:e.text})]},e.id))})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:`13px`,fontWeight:`600`,marginBottom:`8px`,color:`var(--text-main)`},children:`Effect 生命周期追踪`}),(0,h.jsxs)(`div`,{className:`demo-console`,style:{height:`220px`,maxHeight:`220px`},children:[(0,h.jsxs)(`div`,{className:`demo-console-header`,children:[(0,h.jsx)(`span`,{children:`SOCKET LIFECYCLE MONITOR`}),(0,h.jsxs)(`span`,{children:[o.length,` 条追踪`]})]}),o.map((e,t)=>(0,h.jsxs)(`div`,{className:`demo-console-log ${e.type}`,children:[`[`,e.time,`] `,e.text]},`${e.time}-${t}`))]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`依赖不是“运行次数开关”`}),(0,h.jsxs)(`p`,{children:[`依赖数组描述 setup 读取了哪些响应式值。这里 `,(0,h.jsx)(`code`,{children:`roomId`}),` 决定连接目标，所以它必须是依赖；不能为了减少重连而把真实依赖删掉。`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`非响应式逻辑用 Effect Event`}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`code`,{children:`isMuted`}),` 只在外部连接触发“收到消息”时读取最新 committed 值。React 19.2 的 `,(0,h.jsx)(`code`,{children:`useEffectEvent`}),` 可以表达这类逻辑，而无需把静音切换变成重新连接的理由。`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:12},children:[(0,h.jsx)(`strong`,{children:`边界：`}),(0,h.jsx)(`code`,{children:`useEffectEvent`}),` 不是逃避依赖的工具，也不能作为普通点击 handler 随处调用。它用于 Effect 内部触发的非响应式事件逻辑；真正决定外部同步关系的值仍必须留在依赖中。`]})]})}function _t(e){return new Promise(t=>setTimeout(()=>t(`${e} 下单成功`),650))}function vt(){let[e,t]=(0,d.useState)(`React 课程`),[n,r]=(0,d.useState)(!0),[i,a]=(0,d.useState)(`尚未购买`),o=`Effect: 与外部在线状态同步 → ${n?`online`:`offline`}`;(0,d.useEffect)(()=>(console.log(`Effect: 与外部在线状态同步 → ${n?`online`:`offline`}`),()=>console.log(`Effect cleanup: 结束 ${n?`online`:`offline`} 同步`)),[n]);async function s(){a(`购买请求处理中…`),a(await _t(e))}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🎯`}),` Event vs Effect：动作与同步不是一回事`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`04-05`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`用户明确做了某件事，用 Event Handler；组件因为“当前已处于某状态”而需要与外部系统保持一致，才使用 Effect。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🎮 两条因果链`})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h4`,{children:`用户动作 → Event Handler`}),(0,h.jsxs)(`select`,{className:`form-input`,value:e,onChange:e=>t(e.target.value),children:[(0,h.jsx)(`option`,{children:`React 课程`}),(0,h.jsx)(`option`,{children:`TypeScript 课程`})]}),(0,h.jsx)(`button`,{className:`btn btn-primary`,style:{marginTop:10},onClick:s,children:`购买当前商品`}),(0,h.jsx)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:10},children:i})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h4`,{children:`当前状态 → Effect 同步`}),(0,h.jsxs)(`button`,{className:`btn`,onClick:()=>r(e=>!e),children:[`切换为 `,n?`offline`:`online`]}),(0,h.jsx)(`div`,{style:{marginTop:10,display:`grid`,gap:6},children:(0,h.jsx)(`code`,{children:o})})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`反模式：`}),`点击购买 → setIsBuying(true) → Effect 监听 isBuying 再发请求。这样把“事件因果”绕成了“状态同步”，容易造成重复触发和恢复状态后的意外副作用。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`真实项目边界：`}),`支付、删除、提交、下载等明确用户动作放事件处理器；WebSocket、订阅、浏览器 API、第三方实例等“只要当前状态成立就必须保持同步”的关系放 Effect。`]})]})}function yt(e,t){let n;return{connect(){n=setTimeout(t,500)},disconnect(){clearTimeout(n)}}}function bt(){let[e,t]=(0,d.useState)(`general`),[n,r]=(0,d.useState)(`light`),[i,a]=(0,d.useState)(1),[o,s]=(0,d.useState)(`等待连接`),c=(0,d.useEffectEvent)(()=>{s(`已连接 ${e}，当前主题 ${n}`)});(0,d.useEffect)(()=>{let t=yt(e,c);return t.connect(),()=>t.disconnect()},[e]);function l(e){t(e.target.value),a(e=>e+1)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📡`}),` useEffectEvent：响应式连接 + 非响应式读取`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`React 19.2`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`连接是否需要重建由 roomId 决定；连接成功时显示什么主题，只需要读取最新 committed theme，不应该因此重连。`})]}),(0,h.jsx)(`div`,{className:`demo-section`,children:(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{htmlFor:`effect-event-room`,children:`房间`}),(0,h.jsxs)(`select`,{id:`effect-event-room`,className:`form-input`,value:e,onChange:l,children:[(0,h.jsx)(`option`,{children:`general`}),(0,h.jsx)(`option`,{children:`react`}),(0,h.jsx)(`option`,{children:`typescript`})]}),(0,h.jsx)(`label`,{style:{display:`block`,marginTop:12},children:`主题`}),(0,h.jsxs)(`button`,{className:`btn`,onClick:()=>r(e=>e===`light`?`dark`:`light`),children:[`切换 theme：`,n]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`strong`,{children:[`连接次数：`,i]}),(0,h.jsx)(`p`,{children:o})]}),(0,h.jsx)(`p`,{children:`观察：只切换 theme 不会增加连接次数；切换 roomId 才触发 cleanup → setup。`})]})]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`边界：`}),`Effect Event 不是“绕过 exhaustive-deps”的工具。真正决定外部同步关系的值仍必须放入 Effect dependencies；只有非响应式逻辑适合移入 Effect Event。`]})]})}function xt(e=!0){let[t,n]=(0,d.useState)(e);return(0,d.useEffect)(()=>{let e=()=>n(navigator.onLine);return window.addEventListener(`online`,e),window.addEventListener(`offline`,e),()=>{window.removeEventListener(`online`,e),window.removeEventListener(`offline`,e)}},[]),t}function St(e=0){let[t,n]=(0,d.useState)(e);return{count:t,increment:()=>n(e=>e+1),reset:()=>n(e)}}function Ct({label:e}){let{count:t,increment:n,reset:r}=St();return(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`strong`,{children:[e,`: `,t]}),(0,h.jsxs)(`div`,{style:{marginTop:8},children:[(0,h.jsx)(`button`,{className:`btn`,onClick:n,children:`+1`}),(0,h.jsx)(`button`,{className:`btn`,style:{marginLeft:8},onClick:r,children:`reset`})]})]})}function wt(){let e=xt();return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🪝`}),` Custom Hooks：复用状态逻辑，不共享 State`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`04-07`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`自定义 Hook 抽取的是“如何使用 State/Effect”的逻辑。每次调用都拥有独立 State；若需要真正共享数据，应提升 State、使用 Context 或 external store。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🎮 两个 useCounter 调用`})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsx)(Ct,{label:`A`}),(0,h.jsx)(Ct,{label:`B`})]}),(0,h.jsx)(`p`,{children:`给 A 加 1 不会改变 B：同一个 Hook 实现被复用，但 State 没有共享。`})]}),(0,h.jsx)(`div`,{className:`demo-section`,children:(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`封装 Effect：`}),`useOnlineSignal 把浏览器 online/offline 订阅及 cleanup 隐藏在声明式 API 后面。当前浏览器状态：`,e?`online`:`offline`]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`Rules of Hooks：`}),`自定义 Hook 仍必须在组件或其他 Hook 顶层调用；不要在条件、循环或普通工具函数里调用 Hook。`]})]})}function Tt({ref:e,label:t}){let n=(0,d.useRef)(null);return(0,d.useImperativeHandle)(e,()=>({focus(){n.current?.focus()},select(){n.current?.select()}}),[]),(0,h.jsxs)(`label`,{children:[t,(0,h.jsx)(`input`,{ref:n,className:`form-input`,defaultValue:`React 19 ref as prop`})]})}function Et(){let e=(0,d.useRef)(null),t=(0,d.useRef)(null),[n,r]=(0,d.useState)(0),[i,a]=(0,d.useState)(!1);return(0,d.useLayoutEffect)(()=>{r(Math.round(t.current?.getBoundingClientRect().width??0))},[i]),(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📐`}),` 高级 Ref：layout measurement 与 imperative handle`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`04-08`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`useLayoutEffect 适合必须在浏览器绘制前读取布局并同步调整 UI 的场景；useImperativeHandle 用于只暴露父组件真正需要的命令式能力。`})]}),(0,h.jsx)(`div`,{className:`demo-section`,children:(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{ref:t,style:{width:i?`100%`:`65%`,padding:16,border:`1px solid var(--border-color)`,borderRadius:8},children:[(0,h.jsx)(`strong`,{children:`Measured box`}),(0,h.jsxs)(`p`,{children:[`本次 layout effect 读取宽度：`,n,`px`]}),(0,h.jsx)(`button`,{className:`btn`,onClick:()=>a(e=>!e),children:`切换宽度`})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(Tt,{ref:e,label:`受限 imperative API`}),(0,h.jsxs)(`div`,{style:{marginTop:10},children:[(0,h.jsx)(`button`,{className:`btn`,onClick:()=>e.current?.focus(),children:`focus`}),(0,h.jsx)(`button`,{className:`btn`,style:{marginLeft:8},onClick:()=>e.current?.select(),children:`select`})]})]})]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`React 19：`}),`函数组件可以直接把 ref 作为 prop 接收；React 18 及更早版本通常需要 forwardRef。forwardRef 仍存在用于兼容旧代码，但 React 官方已说明在 React 19 中不再必要。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`不要滥用：`}),`能用 props 表达的状态（例如 isOpen）优先使用声明式 props；ref 只用于 focus、scroll、measurement、animation 等难以用数据流表达的命令式行为。useLayoutEffect 会阻塞 paint，应优先 useEffect，只有布局读取/同步调整确实需要时才使用。`]})]})}var Dt={name:``,bio:``,role:`frontend`,newsletter:!0,contact:`email`};function Ot(){let[e,t]=(0,d.useState)(Dt),[n,r]=(0,d.useState)(null),i=(0,d.useMemo)(()=>({name:e.name.trim().length<2?`姓名至少需要 2 个字符`:``,bio:e.bio.length>80?`简介不能超过 80 个字符`:``}),[e.name,e.bio]),a=!i.name&&!i.bio;function o(e){let{name:n,type:r,checked:i,value:a}=e.target;t(e=>({...e,[n]:r===`checkbox`?i:a}))}function s(t){t.preventDefault(),a&&r({...e,submittedAt:new Date().toLocaleTimeString()})}function c(){t(Dt),r(null)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📝`}),` Controlled Form：React State 是表单真源`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Forms`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`受控表单把输入值放进 React State：输入事件请求更新 State，下一次 render 再把 value / checked 写回控件。适合需要实时校验、联动和条件 UI 的表单。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`input / textarea`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`select`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`checkbox / radio`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`validation`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 实时表单实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`修改任意字段，观察 State、派生校验结果和最终提交快照如何同步变化。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`form`,{onSubmit:s,style:{display:`grid`,gap:12},children:[(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`姓名`}),(0,h.jsx)(`input`,{className:`form-input`,name:`name`,value:e.name,onChange:o,placeholder:`至少 2 个字符`}),i.name&&(0,h.jsx)(`small`,{style:{color:`var(--color-danger)`},children:i.name})]}),(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`个人简介`}),(0,h.jsx)(`textarea`,{className:`form-input`,name:`bio`,value:e.bio,onChange:o,rows:3}),(0,h.jsxs)(`small`,{children:[e.bio.length,`/80 `,i.bio&&`· ${i.bio}`]})]}),(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`岗位`}),(0,h.jsxs)(`select`,{className:`form-input`,name:`role`,value:e.role,onChange:o,children:[(0,h.jsx)(`option`,{value:`frontend`,children:`前端`}),(0,h.jsx)(`option`,{value:`backend`,children:`后端`}),(0,h.jsx)(`option`,{value:`product`,children:`产品`})]})]}),(0,h.jsxs)(`label`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,h.jsx)(`input`,{type:`checkbox`,name:`newsletter`,checked:e.newsletter,onChange:o}),`接收学习周报`]}),(0,h.jsxs)(`fieldset`,{style:{border:0,padding:0,margin:0},children:[(0,h.jsx)(`legend`,{style:{marginBottom:6},children:`首选联系方式`}),[`email`,`phone`].map(t=>(0,h.jsxs)(`label`,{style:{marginRight:16},children:[(0,h.jsx)(`input`,{type:`radio`,name:`contact`,value:t,checked:e.contact===t,onChange:o}),` `,t]},t))]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`submit`,disabled:!a,children:`提交`}),(0,h.jsx)(`button`,{className:`btn`,type:`button`,onClick:c,children:`重置`})]})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{marginTop:0},children:`可观察数据流`}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:JSON.stringify(e,null,2)}),(0,h.jsx)(`div`,{className:`demo-alert ${a?`demo-alert-tip`:`demo-alert-warning`}`,children:(0,h.jsx)(`strong`,{children:a?`✓ 当前表单可提交`:`等待修正校验错误`})}),n&&(0,h.jsxs)(`div`,{style:{marginTop:12},children:[(0,h.jsx)(`strong`,{children:`最近一次提交快照`}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:JSON.stringify(n,null,2)})]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 状态建模边界`]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`正确：`}),`保存用户真正输入的字段；像 `,(0,h.jsx)(`code`,{children:`isValid`}),`、字符数、错误提示这类可以由当前字段计算出的值直接派生。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`反模式：`}),`同时保存 `,(0,h.jsx)(`code`,{children:`name`}),`、`,(0,h.jsx)(`code`,{children:`nameLength`}),`、`,(0,h.jsx)(`code`,{children:`isNameValid`}),` 三份可互相推导的数据，会制造同步成本和矛盾状态。`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,style:{marginTop:12},children:`项目边界：小型、强联动表单直接使用受控 State 很清晰；大型表单若每次按键都会导致庞大子树更新，应先拆组件或采用成熟表单方案，而不是机械地把所有字段提升到页面顶层。`})]})]})}function k(e){return{title:String(e.get(`title`)??``),priority:String(e.get(`priority`)??`normal`),assignees:e.getAll(`assignees`).map(String),notify:e.has(`notify`)}}function kt(){let[e,t]=(0,d.useState)(null);function n(e){e.preventDefault();let n=k(new FormData(e.currentTarget));t(n)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📦`}),` FormData：提交时再读取表单快照`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Forms`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`并非所有表单都需要把每个按键同步进 React State。对于“填写 → 提交”型场景，可以让浏览器持有输入状态，在提交时一次性构造 FormData。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`uncontrolled`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`FormData`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`get / getAll`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`submit snapshot`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 提交快照实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`输入过程中 React 不保存字段值；点击提交后才把浏览器表单转换成业务 payload。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`form`,{onSubmit:n,style:{display:`grid`,gap:12},children:[(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`任务标题`}),(0,h.jsx)(`input`,{className:`form-input`,name:`title`,defaultValue:`学习 React FormData`,required:!0})]}),(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`优先级`}),(0,h.jsxs)(`select`,{className:`form-input`,name:`priority`,defaultValue:`normal`,children:[(0,h.jsx)(`option`,{value:`low`,children:`低`}),(0,h.jsx)(`option`,{value:`normal`,children:`普通`}),(0,h.jsx)(`option`,{value:`high`,children:`高`})]})]}),(0,h.jsxs)(`fieldset`,{style:{border:0,padding:0,margin:0},children:[(0,h.jsx)(`legend`,{style:{marginBottom:6},children:`协作者（同名字段会产生多个值）`}),[`Alice`,`Bob`,`Carol`].map(e=>(0,h.jsxs)(`label`,{style:{marginRight:16},children:[(0,h.jsx)(`input`,{type:`checkbox`,name:`assignees`,value:e}),` `,e]},e))]}),(0,h.jsxs)(`label`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,h.jsx)(`input`,{type:`checkbox`,name:`notify`,defaultChecked:!0}),`提交后通知协作者`]}),(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`submit`,children:`读取 FormData`})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{marginTop:0},children:`可观察数据流`}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:`浏览器维护输入值
        ↓
submit event
        ↓
new FormData(form)
        ↓
get / getAll / has
        ↓
业务 payload`}),e?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`strong`,{children:`最近一次提交快照`}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:JSON.stringify(e,null,2)})]}):(0,h.jsx)(`div`,{className:`demo-alert demo-alert-tip`,children:`修改表单不会触发这里更新；只有提交时 React 才保存 payload。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 状态建模：谁需要实时知道字段值？`]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`适合 FormData：`}),`搜索框、登录、简单创建表单等主要关心“提交结果”的场景，可以避免为每个字段建立 React State。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`不要机械使用非受控：`}),`实时校验、字段联动、即时预览或条件展示需要当前输入值时，受控 State 往往更直接。`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,style:{marginTop:12},children:[`注意多值字段：`,(0,h.jsx)(`code`,{children:`formData.get()`}),` 只读取一个值；checkbox group、multi-select 等需要使用 `,(0,h.jsx)(`code`,{children:`getAll()`}),`。同时不要直接把 FormData 当最终领域模型，应在提交边界完成字符串、布尔值、数组等类型转换。`]})]})]})}function At(e){return new Promise(t=>setTimeout(t,e))}function jt(){let[e,t]=(0,d.useState)([]);function n(e){t(t=>[e,...t].slice(0,6))}async function r(e){let t=String(e.get(`title`)??``).trim(),r=String(e.get(`content`)??``).trim();n(`publish 开始：${t||`未命名`}`),await At(800),n(`publish 完成：${r.length} 个字符`)}async function i(e){n(`draft 开始：${String(e.get(`title`)??``).trim()||`未命名`}`),await At(500),n(`draft 保存完成`)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⚙️`}),` React 19 Form Action：提交就是 Action`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`React 19`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 19 允许把函数直接传给 `,(0,h.jsx)(`code`,{children:`<form action>`}),`。提交时 React 把 FormData 传给该函数，并以 Action / Transition 语义处理异步提交。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`action`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`formAction`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`FormData`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Transition`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 发布 / 保存草稿双 Action`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`默认提交走 publish；“保存草稿”按钮通过 formAction 覆盖父 form 的 action。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`form`,{action:r,style:{display:`grid`,gap:12},children:[(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`标题`}),(0,h.jsx)(`input`,{className:`form-input`,name:`title`,defaultValue:`React 19 Actions`,required:!0})]}),(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`正文`}),(0,h.jsx)(`textarea`,{className:`form-input`,name:`content`,defaultValue:`用一个表单承载多个提交意图。`,rows:4,required:!0})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`submit`,children:`发布`}),(0,h.jsx)(`button`,{className:`btn`,type:`submit`,formAction:i,children:`保存草稿`})]})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{marginTop:0},children:`Action 流程`}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:`submit
  ↓
React 收集 FormData
  ↓
action / formAction
  ↓
异步 Action 在 Transition 中运行
  ↓
成功后非受控字段 reset`}),(0,h.jsx)(`strong`,{children:`最近事件`}),e.length===0?(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`尚未提交。`}):(0,h.jsx)(`ol`,{style:{paddingLeft:20,marginBottom:0},children:e.map((e,t)=>(0,h.jsx)(`li`,{children:e},`${e}-${t}`))})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 与 onSubmit 的边界`]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`Action：`}),`适合 mutation 工作流。React 可以跟踪 pending，错误可进入 Error Boundary，并可与 `,(0,h.jsx)(`code`,{children:`useActionState`}),`、`,(0,h.jsx)(`code`,{children:`useFormStatus`}),`、`,(0,h.jsx)(`code`,{children:`useOptimistic`}),` 组合。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`不要混淆：`}),(0,h.jsx)(`code`,{children:`onSubmit`}),` 仍然适用于需要直接操作 submit event、调用 `,(0,h.jsx)(`code`,{children:`preventDefault()`}),` 或自行读取表单的场景；函数 action 不是它的语法糖。`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,style:{marginTop:12},children:[`真实项目中，一个表单可能存在“发布 / 保存草稿 / 送审”等多个 mutation。按钮级 `,(0,h.jsx)(`code`,{children:`formAction`}),` 可以表达不同提交意图，而不必先把“点击了哪个按钮”额外塞进 React State。`]})]})]})}var Mt=c();function Nt(e){return new Promise(t=>setTimeout(t,e))}var Pt={status:`idle`,message:`尚未提交`,email:``};async function Ft(e,t){let n=String(t.get(`email`)??``).trim();return await Nt(900),n.includes(`@`)?{status:`success`,message:`已为 ${n} 开启 React 学习周报`,email:n,attempts:(e.attempts??0)+1}:{status:`error`,message:`“${n||`空值`}” 不是有效邮箱`,email:n,attempts:(e.attempts??0)+1}}function It(){let{pending:e,data:t}=(0,Mt.useFormStatus)(),n=t?String(t.get(`email`)??``):``;return(0,h.jsxs)(`div`,{style:{display:`grid`,gap:8},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`submit`,disabled:e,children:e?`提交中…`:`订阅`}),(0,h.jsxs)(`small`,{children:[`useFormStatus.pending: `,(0,h.jsx)(`strong`,{children:String(e)}),e&&n?` · 正在提交 ${n}`:``]})]})}function Lt(){let[e,t,n]=(0,d.useActionState)(Ft,Pt);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⏳`}),` useActionState + useFormStatus：把 Action 结果与 pending 可视化`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`React 19`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`useActionState`}),` 保存 Action 的返回结果并暴露 pending；`,(0,h.jsx)(`code`,{children:`useFormStatus`}),` 则让表单内部的设计系统组件读取最近一次提交状态，无需层层传 props。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`previousState`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`FormData`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`isPending`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`form status`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 异步订阅实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`先输入无效邮箱观察已知业务错误，再输入有效邮箱观察 pending → result 的完整状态迁移。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`form`,{action:t,style:{display:`grid`,gap:12},children:[(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{style:{display:`block`,marginBottom:4},children:`邮箱`}),(0,h.jsx)(`input`,{className:`form-input`,name:`email`,defaultValue:`demo`,placeholder:`you@example.com`})]}),(0,h.jsx)(It,{})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{marginTop:0},children:`Action State`}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:JSON.stringify(e,null,2)}),(0,h.jsx)(`div`,{className:`demo-alert ${n?`demo-alert-warning`:`demo-alert-tip`}`,children:(0,h.jsxs)(`strong`,{children:[`useActionState.isPending: `,String(n)]})})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 两个 pending 为什么都存在？`]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`useActionState：`}),`关注“这个 Action 状态机”的结果与执行状态，适合页面业务逻辑读取。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`useFormStatus：`}),`关注“我所在父 form 的提交状态”，适合 SubmitButton、Spinner 等可复用表单子组件。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`常见错误：`}),(0,h.jsx)(`code`,{children:`useFormStatus`}),` 放在渲染该 `,(0,h.jsx)(`code`,{children:`<form>`}),` 的同一个组件里，并不能读取这个 form；调用 Hook 的组件必须是目标 form 的后代。`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,style:{marginTop:12},children:`业务校验失败这类“预期错误”通常作为 Action state 返回并渲染；真正未知的程序异常可以抛出，由最近的 Error Boundary 接管。`})]})]})}function Rt(e){return new Promise(t=>setTimeout(t,e))}var zt=[{id:1,text:`先显示结果，再等待服务器确认。`,pending:!1}];function Bt(e,t){return t.type===`add`?[...e,{...t.comment,pending:!0}]:e}function Vt(){let[e,t]=(0,d.useState)(zt),[n,r]=(0,d.useOptimistic)(e,Bt),[i,a]=(0,d.useState)(`尚未提交`);async function o(e){let n=String(e.get(`comment`)??``).trim(),i=e.has(`shouldFail`);if(!n){a(`请输入评论内容`);return}let o={id:`temp-${Date.now()}`,text:n};if(a(`服务器处理中：先展示 optimistic comment`),r({type:`add`,comment:o}),await Rt(1200),i){a(`服务器拒绝：真实 state 未变化，optimistic comment 自动回退`);return}t(e=>[...e,{id:Date.now(),text:n,pending:!1}]),a(`服务器成功：真实 state 接管，optimistic 与 canonical 收敛`)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⚡`}),` useOptimistic：即时反馈、成功收敛、失败回退`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`React 19`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Optimistic UI 不是提前修改真实数据，而是在 Action 仍 pending 时临时渲染“预计会成功”的状态。Action 结束后，UI 重新以真实 state 为准。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`temporary state`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Action`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`commit`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`rollback`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 评论提交实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`正常提交观察 optimistic → confirmed；勾选“模拟失败”观察 optimistic 项目消失并回到 canonical state。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`ul`,{style:{paddingLeft:20},children:n.map(e=>(0,h.jsxs)(`li`,{style:{marginBottom:8,opacity:e.pending?.6:1},children:[e.text,` `,e.pending&&(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`发送中`})]},e.id))}),(0,h.jsxs)(`form`,{action:o,style:{display:`grid`,gap:10},children:[(0,h.jsx)(`input`,{className:`form-input`,name:`comment`,defaultValue:`这条评论会先乐观显示`}),(0,h.jsxs)(`label`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,h.jsx)(`input`,{type:`checkbox`,name:`shouldFail`}),`模拟服务器失败`]}),(0,h.jsx)(`button`,{className:`btn btn-primary`,type:`submit`,children:`发送评论`})]})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{marginTop:0},children:`状态对照`}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`strong`,{children:`Canonical:`}),` `,e.length,` 条`]}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`strong`,{children:`当前 UI:`}),` `,n.length,` 条`]}),(0,h.jsx)(`div`,{className:`demo-alert demo-alert-tip`,children:i}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:`Action 开始
  ↓
setOptimistic(...)
  ↓
立即渲染临时 UI
  ↓
await server
  ├─ success → 更新 canonical state → 收敛
  └─ failure → canonical 不变 → 自动回退`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` Optimistic UI 的边界`]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`适合：`}),`点赞、评论、Todo、购物车数量等成功率高、用户希望即时反馈、失败后可以明确恢复的 mutation。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`谨慎：`}),`支付、库存锁定、权限授予等不能轻易制造“已经成功”错觉的操作，通常需要更保守的 pending UI。`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,style:{marginTop:12},children:[(0,h.jsx)(`code`,{children:`useOptimistic`}),` 的 setter 必须在 Action / Transition 中调用。不要额外维护一份长期 optimistic store；canonical state 才是 Action 结束后的最终真源。`]})]})]})}var Ht=`modulepreload`,Ut=function(e){return`/react-learning-playground/`+e},Wt={},Gt=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Ut(t,n),t=s(t),t in Wt)return;Wt[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Ht,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Kt=(0,d.lazy)(async()=>(await new Promise(e=>setTimeout(e,900)),Gt(()=>import(`./LazyLessonPanel-DL5J5nFV.js`),[])));function qt(){let[e,t]=(0,d.useState)(!1);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📦`}),` lazy + Suspense：代码什么时候真的加载？`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Code Splitting`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`lazy(load)`}),` 把组件代码的加载推迟到第一次渲染它；加载 Promise pending 时，最近的 Suspense boundary 显示 fallback。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 首次加载实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击后观察 fallback → lazy module ready。再次隐藏再显示时，loader 结果已缓存，不会重复等待同一模块。`})]}),(0,h.jsx)(`button`,{type:`button`,className:`btn btn-primary`,onClick:()=>t(e=>!e),children:e?`隐藏 lazy 组件`:`显示 lazy 组件`}),(0,h.jsx)(`div`,{style:{marginTop:16},children:(0,h.jsx)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`demo-alert`,children:`⏳ 正在加载独立 chunk…`}),children:e&&(0,h.jsx)(Kt,{})})})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`正确边界`}),(0,h.jsx)(`p`,{children:`适合路由级页面、重型编辑器、图表面板等“不是首屏立刻需要”的代码。Suspense 管的是这棵子树的等待 UI。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`反模式`}),(0,h.jsxs)(`p`,{children:[`不要在组件内部每次 render 都重新声明 `,(0,h.jsx)(`code`,{children:`lazy()`}),`；这会创建新的组件类型并可能导致 State 被重置。`]})]})]})]})}var Jt=new Map;function Yt(e,t,n){return Jt.has(e)||Jt.set(e,new Promise(e=>{setTimeout(()=>e(n),t)})),Jt.get(e)}function Xt({version:e}){let t=(0,d.use)(Yt(`profile-${e}`,700,{name:`Ada`,role:`Frontend Engineer`}));return(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:t.name}),` · `,t.role]})}function Zt({version:e}){let t=(0,d.use)(Yt(`activity-${e}`,1500,[`提交 PR`,`修复 hydration bug`,`补充测试`]));return(0,h.jsx)(`ul`,{children:t.map(e=>(0,h.jsx)(`li`,{children:e},e))})}function Qt(){let[e,t]=(0,d.useState)(1),[n,r]=(0,d.useState)(!0);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧱`}),` Suspense Boundary：等待边界决定 loading UX`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Boundary`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Suspense 不是“给任意 fetch 一个 loading”。它只响应会 suspend 的数据源或代码加载；离 suspend 点最近的 boundary 决定显示哪块 fallback。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 单层 vs Nested Suspense`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`重新加载后，Profile 约 0.7s 完成，Activity 约 1.5s 完成。切换 nested 模式观察 reveal 顺序。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`,marginBottom:16},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn btn-primary`,onClick:()=>t(e=>e+1),children:`重新加载`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>r(e=>!e),children:n?`改为单一 Boundary`:`改为 Nested Boundary`})]}),(0,h.jsxs)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`demo-alert`,children:`⏳ 外层 fallback：等待关键内容…`}),children:[(0,h.jsx)(Xt,{version:e}),(0,h.jsx)(`div`,{style:{marginTop:12},children:n?(0,h.jsx)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`demo-alert`,children:`⏳ 内层 fallback：Activity 仍在加载…`}),children:(0,h.jsx)(Zt,{version:e})}):(0,h.jsx)(Zt,{version:e})})]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Nested boundary`}),(0,h.jsx)(`p`,{children:`允许已经准备好的上层内容先显示，再独立等待慢子树。Boundary 应贴合设计中的 loading sequence。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`边界不是越多越好`}),(0,h.jsx)(`p`,{children:`每个小节点都包 Suspense 会制造闪烁与碎片化 UX。优先让产品设计决定哪些区域应该一起 reveal。`})]})]})]})}function $t(e,t){return new Promise((n,r)=>{setTimeout(()=>{e===`error`?r(Error(`模拟服务失败（attempt ${t}）`)):n(`Promise 已成功解析（attempt ${t}）`)},900)})}var en=class extends d.Component{constructor(e){super(e),this.state={error:null}}static getDerivedStateFromError(e){return{error:e}}render(){return this.state.error?(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Error Boundary fallback`}),(0,h.jsx)(`p`,{children:this.state.error.message}),(0,h.jsx)(`p`,{children:`Render / lazy / use(Promise) 抛出的错误可以由最近的 Error Boundary 隔离。`})]}):this.props.children}};function tn({resource:e}){let t=(0,d.use)(e);return(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[`✅ `,t]})}function nn(){let[e,t]=(0,d.useState)(1),[n,r]=(0,d.useState)(`success`),[i,a]=(0,d.useState)(()=>$t(`success`,1));function o(n){let i=e+1;t(i),r(n),a($t(n,i))}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧯`}),` Error Boundary + React 19 use：pending 与 rejected Promise 去哪里？`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`React 19`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`use(promise)`}),` 在 render 中读取资源：pending 时交给 Suspense，rejected 时错误继续传播给最近的 Error Boundary。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` Promise 状态路由实验`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`每次点击都在事件阶段创建新的稳定 Promise，并把 Promise 本身存进 State；render 只负责用 `,(0,h.jsx)(`code`,{children:`use`}),` 读取它。`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`,marginBottom:16},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn btn-primary`,onClick:()=>o(`success`),children:`加载成功资源`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>o(`error`),children:`加载失败资源`})]}),(0,h.jsx)(en,{children:(0,h.jsx)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`demo-alert`,children:`⏳ Promise pending → Suspense fallback`}),children:(0,h.jsx)(tn,{resource:i})})},`${n}-${e}`)]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Error Boundary 能捕获`}),(0,h.jsx)(`p`,{children:`子树 render、constructor、lifecycle，以及 lazy / use 传播出来的 render-time error。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`不能当万能 try/catch`}),(0,h.jsx)(`p`,{children:`普通事件 handler 或任意异步 callback 中的异常不会因为附近有 Error Boundary 就自动被捕获；这些流程需要自己的错误处理。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`关键边界：不要在 render 中创建不稳定 Promise`}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`code`,{children:`use(fetch(...))`}),` 如果每次 render 都创建新 Promise，会持续重新 suspend。真实项目应使用 Suspense-enabled framework/data cache，或由更上层创建并复用 Promise。`]})]})]})}var rn=Array.from({length:900},(e,t)=>`React learning item ${t+1}`);function an({query:e}){let t=e.trim().toLowerCase(),n=rn.filter(e=>e.toLowerCase().includes(t)),r=0;for(let e=0;e<18e4;e+=1)r=(r+e)%997;return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`p`,{style:{fontSize:12},children:[`渲染查询：`,(0,h.jsx)(`code`,{children:e||`(empty)`}),` · 结果 `,n.length,` · CPU 模拟 checksum `,r]}),(0,h.jsx)(`ul`,{children:n.slice(0,8).map(e=>(0,h.jsx)(`li`,{children:e},e))})]})}function on(){let[e,t]=(0,d.useState)(`overview`),[n,r]=(0,d.useState)(`overview`),[i,a]=(0,d.useTransition)(),[o,s]=(0,d.useState)(``),c=(0,d.useDeferredValue)(o),l=o!==c,u=(0,d.useMemo)(()=>{let e=0;for(let t=0;t<65e4;t+=1)e+=t%11;return`${n} · expensive render checksum ${e}`},[n]);function f(e){t(e),a(()=>{r(e)})}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🚦`}),` Transition 与 Deferred UI：urgent update 先走`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Concurrent UI`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`Transition 标记“可以在后台完成”的 state update；`,(0,h.jsx)(`code`,{children:`useDeferredValue`}),` 则让某个值的消费 UI 暂时落后。两者都不是定时器。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` useTransition：立即选中 vs 后台内容更新`]})}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[`overview`,`metrics`,`history`].map(t=>(0,h.jsx)(`button`,{type:`button`,className:`btn`,"aria-pressed":e===t,onClick:()=>f(t),children:t},t))}),(0,h.jsxs)(`div`,{className:i?`demo-alert demo-alert-warning`:`demo-alert demo-alert-tip`,style:{marginTop:12},children:[(0,h.jsxs)(`strong`,{children:[`isPending: `,String(i)]}),` · urgent tab = `,e,` · committed content = `,n]}),(0,h.jsx)(`p`,{children:u})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔎`}),` useDeferredValue：输入保持即时，结果允许落后`]})}),(0,h.jsxs)(`label`,{children:[`搜索`,(0,h.jsx)(`input`,{className:`form-input`,value:o,onChange:e=>s(e.target.value),placeholder:`输入 1、20、react…`})]}),(0,h.jsxs)(`div`,{style:{opacity:l?.55:1,marginTop:12},children:[(0,h.jsxs)(`div`,{className:`demo-alert`,children:[`input value = `,(0,h.jsx)(`code`,{children:o||`(empty)`}),` · deferred value = `,(0,h.jsx)(`code`,{children:c||`(empty)`}),` · stale = `,String(l)]}),(0,h.jsx)(an,{query:c})]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Deferred ≠ debounce`}),(0,h.jsx)(`p`,{children:`Deferred 没有固定毫秒延迟，会尽快开始后台 render，且可被更紧急更新打断；它本身也不会减少网络请求。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`不要把受控 input 自身放进 Transition`}),(0,h.jsx)(`p`,{children:`输入框 value 的更新应保持 urgent。把昂贵结果区、页面切换等非紧急更新放到 Transition/Deferred 层。`})]})]})]})}function sn({label:e,renderRequest:t}){let n=(0,d.useRef)(null),[r,i]=(0,d.useState)(0);return(0,d.useEffect)(()=>{let e=n.current;if(!e||typeof MutationObserver>`u`)return;let t=new MutationObserver(e=>{let t=e.filter(e=>e.type===`characterData`||e.type===`childList`).length;t>0&&i(e=>e+t)});return t.observe(e,{childList:!0,characterData:!0,subtree:!0}),()=>t.disconnect()},[]),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`12px`,padding:`16px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:`var(--bg-surface-secondary)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`},children:[(0,h.jsxs)(`span`,{className:`badge badge-blue`,children:[`Render 请求 #`,t]}),(0,h.jsxs)(`span`,{className:`badge badge-green`,children:[`目标 DOM mutation：`,r]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginBottom:`6px`},children:`MutationObserver 只观察下面这个真实 DOM 节点：`}),(0,h.jsx)(`strong`,{ref:n,style:{display:`inline-block`,padding:`8px 12px`,borderRadius:`var(--radius-xs)`,background:`var(--bg-surface)`,border:`1px solid var(--border-color)`},children:e})]})]})}function cn(){let[e,t]=(0,d.useState)(1),[n,r]=(0,d.useState)(`稳定的 DOM 内容`),[i,a]=(0,d.useState)(0);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⚙️`}),` Re-render ≠ DOM Update`]})}),(0,h.jsx)(`span`,{className:`badge badge-green`,children:`性能心智模型`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`React 的 render 是“调用组件并计算下一份 UI 描述”；commit 才负责把必要差异写入 DOM。 因此组件重新执行，并不意味着对应 DOM 节点一定发生修改。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Trigger → Render → Commit`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Minimal DOM Mutation`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`不要看到 re-render 就 memo`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 实验：触发 Render，但保持目标 DOM 内容不变`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`“无关 State 更新”会让当前组件树再次执行 render，但传给目标节点的 `,(0,h.jsx)(`code`,{children:`label`}),`没变。观察目标 DOM mutation 是否增加；再点击“修改 DOM 内容”进行对照。`]})]}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`14px`},children:[(0,h.jsx)(sn,{label:n,renderRequest:e}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`},children:[(0,h.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>{a(e=>e+1),t(e=>e+1)},children:[`更新无关 State（当前 `,i,`）`]}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:()=>{r(e=>e===`稳定的 DOM 内容`?`DOM 内容真的改变了`:`稳定的 DOM 内容`),t(e=>e+1)},children:`修改目标 DOM 内容`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-info`,style:{margin:0},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`观察结论`}),(0,h.jsxs)(`div`,{children:[`点击无关更新时，Render 请求编号继续增长，但目标节点文本没有变化，因此 React 没必要改写这个节点。只有 `,(0,h.jsx)(`code`,{children:`label`}),` 真正改变时，MutationObserver 才会观察到对应 DOM mutation。`]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧭`}),` 为什么这对性能优化很重要`]})}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 错误判断`]}),(0,h.jsxs)(`div`,{style:{fontSize:`13px`,lineHeight:1.7},children:[`DevTools 看到组件 re-render → 立刻给所有组件加 `,(0,h.jsx)(`code`,{children:`memo`}),`、`,(0,h.jsx)(`code`,{children:`useMemo`}),`、`,(0,h.jsx)(`code`,{children:`useCallback`}),`。`]})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 正确流程`]}),(0,h.jsx)(`div`,{style:{fontSize:`13px`,lineHeight:1.7},children:`先判断交互是否真的慢 → 用 Profiler 找到昂贵 render → 再判断 memoization 是否能减少实际工作量。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 项目边界`]}),(0,h.jsxs)(`div`,{children:[`普通父子组件重新 render 通常不是问题。大型表格、复杂图表、富文本编辑器包装层等出现可测量的 render 开销时，才值得继续进入 `,(0,h.jsx)(`code`,{children:`memo`}),`、引用稳定性和 Profiler。React Compiler 启用后还会自动承担大量 memoization 工作。`]})]})]})}var ln={status:`active`},un=()=>`stable`;function dn(){let[e,t]=(0,d.useState)(1),n={status:`active`},r=[`react`,`performance`],i=()=>`fresh`,a=(0,d.useRef)({freshObject:n,freshArray:r,freshHandler:i,stableObject:ln,stableHandler:un}),[o,s]=(0,d.useState)(null),c=()=>{let e=a.current;s({freshObject:Object.is(e.freshObject,n),freshArray:Object.is(e.freshArray,r),freshHandler:Object.is(e.freshHandler,i),stableObject:Object.is(e.stableObject,ln),stableHandler:Object.is(e.stableHandler,un)}),a.current={freshObject:n,freshArray:r,freshHandler:i,stableObject:ln,stableHandler:un},t(e=>e+1)},l=o?[[`组件内对象字面量 {}`,o.freshObject,`每次 render 创建新对象`],[`组件内数组字面量 []`,o.freshArray,`每次 render 创建新数组`],[`组件内箭头函数 () => {}`,o.freshHandler,`每次 render 创建新函数`],[`组件外常量对象`,o.stableObject,`模块加载时创建一次`],[`组件外函数`,o.stableHandler,`模块加载时创建一次`]]:[];return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🔗`}),` Reference Equality：值相同 ≠ 引用相同`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`性能基础`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 的依赖比较与默认 memo props 比较建立在引用身份之上。对象、数组和函数即使“内容看起来一样”， 只要重新创建，就不是同一个引用。理解这一点，是学习 `,(0,h.jsx)(`code`,{children:`memo`}),`、`,(0,h.jsx)(`code`,{children:`useMemo`}),`、`,(0,h.jsx)(`code`,{children:`useCallback`}),` 和 Effect dependency 的基础。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Object.is`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Object Identity`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Props Stability`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 实验：跨两次 Render 比较引用身份`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`当前为 Render Round #`,e,`。点击按钮会先用 `,(0,h.jsx)(`code`,{children:`Object.is`}),` 比较“上一轮保存的引用”和“当前轮引用”， 再触发下一轮 render。`]})]}),(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:c,children:`比较引用并触发下一次 Render`}),o&&(0,h.jsx)(`div`,{style:{display:`grid`,gap:`8px`,marginTop:`16px`},children:l.map(([e,t,n])=>(0,h.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`minmax(180px, 1fr) auto minmax(180px, 1fr)`,gap:`12px`,alignItems:`center`,padding:`10px 12px`,border:`1px solid var(--border-color)`,borderRadius:`var(--radius-sm)`,background:`var(--bg-surface-secondary)`},children:[(0,h.jsx)(`strong`,{style:{fontSize:`13px`},children:e}),(0,h.jsxs)(`span`,{className:`badge ${t?`badge-green`:`badge-red`}`,children:[`Object.is → `,String(t)]}),(0,h.jsx)(`span`,{style:{color:`var(--text-muted)`,fontSize:`12px`},children:n})]},e))})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 为什么“新引用”会让优化失效`]})}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 看起来一样`]}),(0,h.jsx)(`pre`,{style:{margin:0,fontSize:`12px`,overflowX:`auto`},children:`function Parent() {
  return <Child options={{ status: 'active' }} />;
}`}),(0,h.jsxs)(`div`,{style:{marginTop:`8px`,fontSize:`13px`},children:[`每次 Parent render 都会创建新的 `,(0,h.jsx)(`code`,{children:`options`}),` 对象。`]})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 先判断是否真的需要稳定引用`]}),(0,h.jsxs)(`div`,{style:{fontSize:`13px`,lineHeight:1.7},children:[`不要为了“引用稳定”自动加入 memoization。只有当下游的 `,(0,h.jsx)(`code`,{children:`memo`}),`、昂贵计算或 Effect dependency 确实依赖稳定 identity，并且 Profiler 证明存在收益时，再选择合适的优化手段。`]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 项目判断标准`]}),(0,h.jsx)(`div`,{children:`Primitive 通常按值比较；对象、数组、函数按 identity 比较。新引用本身不是 Bug，也不等于性能问题。 它只有在“引用身份参与某个协议”时才重要，例如 memoized child props、Hook dependency、缓存 key 或外部订阅配置。`})]})]})}var fn=(0,d.memo)(function({theme:e}){return console.count(`StablePrimitiveChild render`),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`✅ Primitive prop：memo 可命中`}),(0,h.jsxs)(`div`,{children:[`当前 theme：`,(0,h.jsx)(`strong`,{children:e}),`。父组件因为无关 State 更新而重新 render 时， 只要 theme 没变，这个子组件通常会跳过 render。`]})]})}),pn=(0,d.memo)(function({options:e}){return console.count(`FreshObjectChild render`),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ Fresh object prop：memo miss`}),(0,h.jsxs)(`div`,{children:[`options.status = `,(0,h.jsx)(`strong`,{children:e.status}),`。虽然内容相同，但父组件每次 render 都创建新对象， 默认比较时 `,(0,h.jsx)(`code`,{children:`Object.is(prevOptions, nextOptions)`}),` 为 false。`]})]})}),mn=(0,d.memo)(function({options:e}){return console.count(`StableObjectChild render`),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`✅ Stable object prop：memo 可再次命中`}),(0,h.jsxs)(`div`,{children:[`options.status = `,(0,h.jsx)(`strong`,{children:e.status}),`。父组件使用 `,(0,h.jsx)(`code`,{children:`useMemo`}),` 保持引用稳定， 因此无关 State 更新时可以跳过 render。`]})]})});function hn(){let[e,t]=(0,d.useState)(0),[n,r]=(0,d.useState)(`light`),i={status:`active`},a=(0,d.useMemo)(()=>({status:`active`}),[]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` React.memo：命中、失效与 Props Identity`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`性能优化`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`memo`}),` 的目标不是“禁止组件 render”，而是在父组件重新 render 时， 当 props 与上一轮相同时跳过一次不必要的子组件 render。默认情况下，React 会逐个 prop 使用`,(0,h.jsx)(`code`,{children:`Object.is`}),` 比较；因此 primitive 值稳定时容易命中，而新建对象、数组、函数会改变 identity。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`memo`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Object.is`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Prop Identity`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Profiler First`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 实验：同一次父 Render，观察三种 memo 结果`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`打开浏览器 Console，观察三个子组件的 `,(0,h.jsx)(`code`,{children:`console.count`}),`。先连续点击“更新无关 State”， 再切换 theme，对比 primitive prop、新对象 prop、稳定对象 prop 的 render 次数。`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`,marginBottom:`16px`},children:[(0,h.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>t(e=>e+1),children:[`更新无关 State：`,e]}),(0,h.jsxs)(`button`,{className:`btn btn-secondary`,onClick:()=>r(e=>e===`light`?`dark`:`light`),children:[`切换 theme：`,n]})]}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`12px`},children:[(0,h.jsx)(fn,{theme:n}),(0,h.jsx)(pn,{options:i}),(0,h.jsx)(mn,{options:a})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔍`}),` 可观察结果`]})}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` memo 包了就一定省 Render`]}),(0,h.jsx)(`pre`,{style:{margin:0,fontSize:`12px`,overflowX:`auto`},children:`const Child = memo(...);

function Parent() {
  return <Child options={{ status: 'active' }} />;
}`}),(0,h.jsx)(`div`,{style:{marginTop:`8px`,fontSize:`13px`,lineHeight:1.7},children:`每次 Parent render 都创建新的 options；默认比较发现 prop identity 改变，因此 Child 仍会 render。`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 先减少真正有成本的更新`]}),(0,h.jsx)(`div`,{style:{fontSize:`13px`,lineHeight:1.7},children:`如果子组件 render 昂贵、父组件频繁更新、且多数时候 props 不变，memo 才更可能有收益。 优先传递最小必要 props；只有确实需要稳定对象/函数 identity 时，再配合 useMemo/useCallback。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`📏`}),` 真实项目边界`]})}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`10px`,fontSize:`13px`,lineHeight:1.75},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{children:`适合：`}),`昂贵可视化组件、大列表中的稳定行组件、频繁父更新但 props 很少变化的叶子节点。`]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{children:`不适合：`}),`组件本身很轻、props 几乎每次都变化、为了“看起来更专业”而全项目默认 memo。`]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{children:`注意：`}),`memo 不能阻止组件自己的 State 更新，也不能阻止其消费的 Context 更新。`]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{children:`判断：`}),`先用 React DevTools Profiler 找到真实热点，再决定是否加入手动 memoization。`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 与 React Compiler 的关系`]}),(0,h.jsx)(`div`,{children:`当前 React Compiler 可以在构建期自动完成大量等价 memoization，因此新代码不应把手写 memo 当默认模板。 本仓库当前没有启用 Compiler；本实验用于理解手动 memo 的运行模型，而不是声称项目必须这样优化。`})]})]})}var gn=Array.from({length:6e3},(e,t)=>({id:t+1,name:`React Item ${t+1}`,score:t*37%101}));function _n(e,t,n){let r=performance.now(),i=t.trim().toLowerCase();return{result:e.filter(e=>{let t=0;for(let n=0;n<120;n+=1)t+=e.id*n%17;return t>=0&&e.score>=n&&(!i||e.name.toLowerCase().includes(i))}),duration:performance.now()-r}}var vn=(0,d.memo)(function({stats:e}){return console.count(`ResultSummary render`),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`📊 结果对象 identity 保持稳定时，memo child 可跳过无关 render`}),(0,h.jsxs)(`div`,{children:[`匹配 `,(0,h.jsx)(`strong`,{children:e.count}),` 条；最近一次计算耗时约 `,(0,h.jsxs)(`strong`,{children:[e.duration.toFixed(2),` ms`]}),`。`]})]})});function yn(){let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(60),[i,a]=(0,d.useState)(0),[o,s]=(0,d.useState)(!0),c=o?null:_n(gn,e,n),l=(0,d.useMemo)(()=>_n(gn,e,n),[e,n]),u=o?l:c,f=(0,d.useMemo)(()=>({count:u.result.length,duration:u.duration}),[u]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧮`}),` useMemo：缓存昂贵计算，而不是缓存一切`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`性能优化`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[(0,h.jsx)(`code`,{children:`useMemo`}),` 在依赖未变化时复用上一轮计算结果。它适合已被测量证明昂贵的纯计算， 也可在确有需要时保持对象 identity；它不是 correctness 工具，也不应包住所有普通表达式。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Expensive Calculation`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Dependencies`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Object.is`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Stable Identity`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 实验：无关 Render 是否重复执行昂贵过滤`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`数据集包含 6000 条记录。调整搜索词或阈值会改变真实依赖；点击“无关 Render”只更新与过滤无关的 State。 切换 memo 开关后对比最近一次计算耗时，并观察 Console 中子组件 render 次数。`})]}),(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`12px`,marginBottom:`16px`},children:[(0,h.jsxs)(`label`,{style:{display:`grid`,gap:`6px`},children:[(0,h.jsx)(`span`,{children:`搜索`}),(0,h.jsx)(`input`,{value:e,onChange:e=>t(e.target.value),placeholder:`例如：React Item 42`})]}),(0,h.jsxs)(`label`,{style:{display:`grid`,gap:`6px`},children:[(0,h.jsxs)(`span`,{children:[`最低 score：`,n]}),(0,h.jsx)(`input`,{type:`range`,min:`0`,max:`100`,value:n,onChange:e=>r(Number(e.target.value))})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`},children:[(0,h.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>a(e=>e+1),children:[`无关 Render：`,i]}),(0,h.jsxs)(`button`,{className:`btn btn-secondary`,onClick:()=>s(e=>!e),children:[`useMemo：`,o?`开启`:`关闭`]})]})]}),(0,h.jsx)(vn,{stats:f}),(0,h.jsxs)(`div`,{style:{marginTop:`12px`,color:`var(--text-muted)`,fontSize:`13px`,lineHeight:1.7},children:[`当前模式：`,(0,h.jsx)(`strong`,{children:o?`缓存计算`:`每次 render 直接计算`}),`。 在开发 StrictMode 下，React 可能额外调用纯计算来帮助发现副作用，因此不要把单次 console 次数当成生产性能结论。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚖️`}),` 正确做法 vs 反模式`]})}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 所有计算都 useMemo`]}),(0,h.jsx)(`pre`,{style:{margin:0,fontSize:`12px`,overflowX:`auto`},children:`const fullName = useMemo(
  () => firstName + ' ' + lastName,
  [firstName, lastName]
);`}),(0,h.jsx)(`div`,{style:{marginTop:`8px`,fontSize:`13px`},children:`普通字符串拼接通常远比 memoization 本身更便宜。`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 已测量的昂贵纯计算`]}),(0,h.jsx)(`pre`,{style:{margin:0,fontSize:`12px`,overflowX:`auto`},children:`const visibleRows = useMemo(
  () => filterAndRank(rows, query),
  [rows, query]
);`}),(0,h.jsx)(`div`,{style:{marginTop:`8px`,fontSize:`13px`},children:`依赖不变时跳过真正有成本的重复工作。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 项目边界`]}),(0,h.jsx)(`div`,{children:`优先保证计算纯净和依赖完整，再用 Profiler/Performance 工具确认瓶颈。若只是为了避免 Effect 因对象依赖反复触发， 通常先尝试把对象移进 Effect 或简化依赖；只有 identity 本身确实是接口契约时，才用 useMemo 保持稳定。 React Compiler 启用后还会自动处理大量这类 memoization。`})]})]})}var bn=(0,d.memo)(function({onAdd:e}){return console.count(`MemoChild render`),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-success`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`🧒 memo 子组件`}),(0,h.jsxs)(`div`,{children:[`当 `,(0,h.jsx)(`code`,{children:`onAdd`}),` 的引用与上一轮相同、且组件自身 State / Context 没有触发更新时， 父组件的无关 Render 才有机会被 `,(0,h.jsx)(`code`,{children:`memo`}),` 跳过。`]}),(0,h.jsx)(`button`,{className:`btn btn-secondary`,onClick:e,style:{marginTop:`10px`},children:`子组件调用 onAdd`})]})});function xn(){let[e,t]=(0,d.useState)(0),[n,r]=(0,d.useState)(0),[i,a]=(0,d.useState)(!0),o=(0,d.useCallback)(()=>{t(e=>e+1)},[]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📞`}),` useCallback：缓存函数 identity，不是让函数执行更快`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`性能优化`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`每次 Render 中声明的函数通常都是新引用。`,(0,h.jsx)(`code`,{children:`useCallback`}),` 会在依赖未变化时返回缓存的函数定义， 常见用途是配合 `,(0,h.jsx)(`code`,{children:`memo`}),` 子组件，或稳定其他 Hook / 自定义 Hook API 所依赖的函数 identity。 它只应作为性能优化使用，不是 correctness 工具。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Function Identity`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`memo`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Dependencies`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Functional Updater`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 实验：函数 prop 是否让 memo 失效`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`切换“稳定 callback / 每次新建函数”，再点击“无关 Render”。查看 Console 中`,(0,h.jsx)(`code`,{children:`MemoChild render`}),` 次数：稳定 callback 模式下，只有父级无关 State 改变时，子组件应能跳过 render； 普通函数模式则会因为函数 prop identity 每轮变化而重新 render。`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`,marginBottom:`14px`},children:[(0,h.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>r(e=>e+1),children:[`无关 Render：`,n]}),(0,h.jsxs)(`button`,{className:`btn btn-secondary`,onClick:()=>a(e=>!e),children:[`当前：`,i?`useCallback 缓存函数`:`普通函数每轮新建`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginBottom:`12px`},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`🔎 观察方式`}),(0,h.jsxs)(`div`,{children:[`当前模式：`,(0,h.jsx)(`strong`,{children:i?`依赖不变时复用 callback identity`:`每次 Render 创建新 callback identity`})]}),(0,h.jsxs)(`div`,{children:[`count：`,e]}),(0,h.jsx)(`div`,{style:{marginTop:6},children:`不在 render 中通过 ref 记录“上一轮 callback”来证明 identity；那会为了教学观察而引入 render 阶段可变读写，反而破坏纯渲染示例。`})]}),(0,h.jsx)(bn,{onAdd:i?o:()=>{t(e=>e+1)}})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 为什么这里可以写空依赖`]})}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 读取 count，依赖不断变化`]}),(0,h.jsx)(`pre`,{style:{margin:0,fontSize:`12px`,overflowX:`auto`},children:`const add = useCallback(() => {
  setCount(count + 1);
}, [count]);`}),(0,h.jsx)(`div`,{style:{marginTop:`8px`,fontSize:`13px`},children:`count 改变后 callback identity 也会改变，可能让 memo child 再次 render。`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 使用 updater function`]}),(0,h.jsx)(`pre`,{style:{margin:0,fontSize:`12px`,overflowX:`auto`},children:`const add = useCallback(() => {
  setCount(value => value + 1);
}, []);`}),(0,h.jsx)(`div`,{style:{marginTop:`8px`,fontSize:`13px`},children:`callback 不再读取当前 count，因此这个 reactive dependency 可以被移除。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 真实项目边界`]}),(0,h.jsxs)(`div`,{children:[`不要给所有事件函数机械套 `,(0,h.jsx)(`code`,{children:`useCallback`}),`。普通按钮 handler 通常不需要稳定 identity。 当函数作为 memoized child 的 prop、其他 Hook 的 dependency，或自定义 Hook 对外 API 时，稳定引用才可能有价值。 如果没有具体优化目标，直接声明普通函数更清晰；启用 React Compiler 的项目还会进一步减少手写 `,(0,h.jsx)(`code`,{children:`useCallback`}),` 的需要。`]})]})]})}var Sn=Array.from({length:1800},(e,t)=>({id:t+1,label:`Item ${t+1}`}));function Cn({query:e}){let t=e.trim().toLowerCase(),n=Sn.filter(e=>{let n=0;for(let t=0;t<90;t+=1)n+=e.id*t%7;return n>=0&&e.label.toLowerCase().includes(t)});return(0,h.jsx)(`div`,{style:{maxHeight:`180px`,overflow:`auto`},children:n.slice(0,80).map(e=>(0,h.jsx)(`div`,{children:e.label},e.id))})}var wn=(0,d.memo)(Cn);function Tn(e){return`${e.toFixed(2)} ms`}function En(){let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(0),[i,a]=(0,d.useState)(!1),[o,s]=(0,d.useState)([]),c=(0,d.useCallback)((e,t,n,r,i,a)=>{s(o=>[{id:`${a}-${o.length}`,treeId:e,phase:t,actualDuration:n,baseDuration:r,startTime:i,commitTime:a},...o].slice(0,8))},[]),l=i?wn:Cn,u=o[0]??null,f=(0,d.useMemo)(()=>!u||u.baseDuration===0?null:u.actualDuration/u.baseDuration,[u]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📈`}),` Profiler：先测量，再决定是否优化`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`性能分析`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 的 `,(0,h.jsx)(`code`,{children:`<Profiler>`}),` 会在被测子树 commit 时回调测量结果。重点不是追求某个固定毫秒数， 而是比较“这次实际渲染成本”和“整棵子树无优化时的估算成本”，再定位值得优化的更新路径。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`actualDuration`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`baseDuration`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`commit`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`measure first`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 实验：相关更新 vs 无关父级 Render`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`输入搜索会改变列表 props；“无关 Render”只改变父组件 State。切换 memo 后，观察无关更新时`,(0,h.jsx)(`code`,{children:`actualDuration`}),` 是否明显下降，并与 `,(0,h.jsx)(`code`,{children:`baseDuration`}),` 对照。`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`,marginBottom:`14px`},children:[(0,h.jsx)(`input`,{value:e,onChange:e=>t(e.target.value),placeholder:`搜索 Item 12`,style:{minWidth:`220px`}}),(0,h.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>r(e=>e+1),children:[`无关 Render：`,n]}),(0,h.jsxs)(`button`,{className:`btn btn-secondary`,onClick:()=>a(e=>!e),children:[`当前：`,i?`memo 包裹列表`:`普通列表`]})]}),(0,h.jsx)(d.Profiler,{id:`ExpensiveList`,onRender:c,children:(0,h.jsx)(l,{query:e})})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔎`}),` 可观察结果`]})}),u?(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginBottom:`12px`},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`最近一次 commit`}),(0,h.jsxs)(`div`,{children:[`phase：`,(0,h.jsx)(`strong`,{children:u.phase})]}),(0,h.jsxs)(`div`,{children:[`actualDuration：`,(0,h.jsx)(`strong`,{children:Tn(u.actualDuration)})]}),(0,h.jsxs)(`div`,{children:[`baseDuration：`,(0,h.jsx)(`strong`,{children:Tn(u.baseDuration)})]}),(0,h.jsxs)(`div`,{children:[`actual / base：`,(0,h.jsx)(`strong`,{children:f===null?`-`:`${(f*100).toFixed(1)}%`})]})]}):null,(0,h.jsx)(`div`,{style:{overflowX:`auto`},children:(0,h.jsxs)(`table`,{style:{width:`100%`,fontSize:`13px`,borderCollapse:`collapse`},children:[(0,h.jsx)(`thead`,{children:(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`th`,{align:`left`,children:`phase`}),(0,h.jsx)(`th`,{align:`right`,children:`actual`}),(0,h.jsx)(`th`,{align:`right`,children:`base`}),(0,h.jsx)(`th`,{align:`right`,children:`commitTime`})]})}),(0,h.jsx)(`tbody`,{children:o.map(e=>(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:e.phase}),(0,h.jsx)(`td`,{align:`right`,children:Tn(e.actualDuration)}),(0,h.jsx)(`td`,{align:`right`,children:Tn(e.baseDuration)}),(0,h.jsx)(`td`,{align:`right`,children:e.commitTime.toFixed(1)})]},e.id))})]})})]}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 先猜，再全局 memo`]}),(0,h.jsx)(`div`,{children:`看到 Render 次数多就机械加入 memo/useMemo/useCallback，既可能没有收益，也会增加认知成本。`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 先定位真实瓶颈`]}),(0,h.jsx)(`div`,{children:`先用 React DevTools Profiler / Performance tracks 找到慢更新和触发原因，再针对数据量、计算或 identity 做优化。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:`14px`},children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 真实项目边界`]}),(0,h.jsxs)(`div`,{children:[`本页为了教学故意制造 CPU 工作，数字会受开发模式、设备、浏览器和 StrictMode 影响，不能当性能基准。`,(0,h.jsx)(`code`,{children:`<Profiler>`}),` 适合程序化采样；实际排查优先使用 React DevTools Profiler，并在接近生产的构建和数据规模下复测。`]})]})]})}var Dn=Array.from({length:1200},(e,t)=>({id:t+1,name:`Product ${t+1}`,price:t%37+10})),On=(0,d.memo)(function({products:e}){return console.count(`ProductList render`),(0,h.jsx)(`div`,{style:{maxHeight:`150px`,overflow:`auto`},children:e.slice(0,30).map(e=>(0,h.jsxs)(`div`,{children:[e.name,` · ¥`,e.price]},e.id))})});function kn(e){let t=e.trim().toLowerCase();return Dn.filter(e=>e.name.toLowerCase().includes(t))}function An(){let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(0),[i,a]=(0,d.useState)(!1),o=(0,d.useMemo)(()=>kn(e),[e]),s=kn(e);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` React Compiler：把大量常规 memoization 交给构建期`]})}),(0,h.jsx)(`span`,{className:`badge badge-purple`,children:`React Compiler`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React Compiler 是构建期优化工具，会分析遵守 Rules of React 的组件和 Hook，并自动进行大量值、函数与组件级 memoization。 React 官方文档将它描述为能减少手写 `,(0,h.jsx)(`code`,{children:`memo`}),`、`,(0,h.jsx)(`code`,{children:`useMemo`}),`、`,(0,h.jsx)(`code`,{children:`useCallback`}),` 的需要； 它不会改变 React 的 State、Props、Context 或纯 Render 数据流规则。`]}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`build-time`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`automatic memoization`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Rules of React`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`incremental adoption`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginBottom:`14px`},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`⚠️ 本仓库当前没有启用 React Compiler`}),(0,h.jsxs)(`div`,{children:[`当前 `,(0,h.jsx)(`code`,{children:`package.json`}),` 没有 React Compiler/Babel 插件配置。因此下面实验只展示“没有 Compiler 时手工稳定 identity 的效果”， 以及启用 Compiler 后应建立的心智模型；不会把本页的手工 memo 结果冒充成 Compiler 实际优化结果。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` 对照实验：手工 memoization 的维护成本`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[(0,h.jsx)(`code`,{children:`ProductList`}),` 已用 `,(0,h.jsx)(`code`,{children:`memo`}),` 包裹。关闭手工 `,(0,h.jsx)(`code`,{children:`useMemo`}),` 时，每次父级 Render 都创建新数组， 子组件 memo 因 props identity 改变而失效；开启后，无关父级更新可以复用数组 identity。`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`,marginBottom:`14px`},children:[(0,h.jsx)(`input`,{value:e,onChange:e=>t(e.target.value),placeholder:`搜索 Product 12`,style:{minWidth:`220px`}}),(0,h.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>r(e=>e+1),children:[`无关 Render：`,n]}),(0,h.jsxs)(`button`,{className:`btn btn-secondary`,onClick:()=>a(e=>!e),children:[`当前：`,i?`手工 useMemo`:`直接计算新数组`]})]}),(0,h.jsx)(On,{products:i?o:s})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔬`}),` Compiler 改变的是优化责任，不是数据流规则`]})}),(0,h.jsxs)(`div`,{className:`comparison-container`,children:[(0,h.jsxs)(`div`,{className:`comparison-card bad`,children:[(0,h.jsxs)(`div`,{className:`comparison-header bad`,children:[(0,h.jsx)(`span`,{children:`❌`}),` 错误理解`]}),(0,h.jsx)(`div`,{children:`“有 Compiler 后就不需要理解引用相等、纯 Render、Hook 规则，或者所有手工 memo 都应该立刻删除。”`})]}),(0,h.jsxs)(`div`,{className:`comparison-card good`,children:[(0,h.jsxs)(`div`,{className:`comparison-header good`,children:[(0,h.jsx)(`span`,{children:`✅`}),` 正确理解`]}),(0,h.jsx)(`div`,{children:`Compiler 依赖 Rules of React 做静态分析，并自动承担大量常规 memoization。已有手工 memoization 可以渐进评估； 对需要明确 identity 契约或经测量确认的热点，仍可以保留有理由的手工优化。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🚦`}),` "use memo" / "use no memo" 的边界`]})}),(0,h.jsx)(`pre`,{style:{margin:0,fontSize:`12px`,overflowX:`auto`},children:`function SearchResults() {
  "use memo";      // annotation 模式下用于显式 opt-in；infer 模式下也可强制编译
  // ...
}

function LegacyWidget() {
  "use no memo";   // opt-out；官方定位为调试/兼容迁移的临时逃生口
  // ...
}`}),(0,h.jsx)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:`12px`},children:(0,h.jsxs)(`div`,{children:[`默认应优先通过项目级 Compiler 配置决定 compilation mode。`,(0,h.jsx)(`code`,{children:`"use memo"`}),` 在 annotation 模式最有意义；`,(0,h.jsx)(`code`,{children:`"use no memo"`}),` 会覆盖编译模式并跳过该函数优化，官方建议谨慎且临时使用，并记录移除原因。`]})})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 真实项目边界`]}),(0,h.jsx)(`div`,{children:`采用 Compiler 时，应先保证 Rules of React 与 lint 基线可靠，再用 Profiler 验证真实收益。对第三方库、旧代码和特殊性能热点采用渐进迁移； 不应因为“用了 Compiler”就机械删除所有已有 memoization，也不应把手写 memoization 继续当成新代码的默认仪式。`})]})]})}var jn=0,Mn={value:jn,version:0,listenerCount:0},Nn=new Set;function Pn(){setTimeout(()=>Nn.forEach(e=>e()),0)}function Fn(e){jn=e,Mn={value:jn,version:Mn.version+1,listenerCount:Nn.size},Pn()}var In={subscribe(e){return Nn.add(e),Mn={...Mn,version:Mn.version+1,listenerCount:Nn.size},Pn(),()=>{Nn.delete(e),Mn={...Mn,version:Mn.version+1,listenerCount:Nn.size},Pn()}},getSnapshot(){return Mn},increment(){Fn(jn+1)},reset(){Fn(0)}};function Ln({label:e}){let t=(0,d.useSyncExternalStore)(In.subscribe,In.getSnapshot);return(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:e}),(0,h.jsxs)(`p`,{children:[`snapshot.value = `,t.value,` · version = `,t.version]}),(0,h.jsxs)(`p`,{children:[`当前订阅者：`,t.listenerCount]})]})}function Rn(){return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📡`}),` useSyncExternalStore：把 React 接到外部真源`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Chapter 08`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`外部 Store 的值不归 React State 所有。React 通过 subscribe 得知“可能变了”，再调用 getSnapshot 读取快照；只有快照按 Object.is 真的变化时才需要更新 UI。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`subscribe`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`getSnapshot`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Object.is`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`unsubscribe`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 两个组件订阅同一个 React 外部 Store`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`点击按钮直接修改 React 之外的 store。两个 Reader 不共享 React State，却都从同一 external source 读取一致快照。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,marginBottom:14},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:In.increment,children:`externalStore.increment()`}),(0,h.jsx)(`button`,{className:`btn`,onClick:In.reset,children:`reset`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsx)(Ln,{label:`Reader A`}),(0,h.jsx)(Ln,{label:`Reader B`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` getSnapshot 为什么不能每次都 return `,`{ value }`,`？`]})}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`反模式：`}),`如果 store 没变化时 getSnapshot 仍创建全新对象，React 会看到一个新的 identity。官方要求未变化期间重复调用 getSnapshot 必须返回相同值；可变 store 应缓存 immutable snapshot。`]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`正确模型：`}),`store 变化 → notify subscribers → React 再读 snapshot → Object.is 比较 → 必要时 render。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🏗️`}),` 真实项目选型边界`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert`,children:[(0,h.jsx)(`strong`,{children:`React 自带能力优先`}),(0,h.jsx)(`p`,{children:`局部 UI State 用 useState；复杂页面状态用 useReducer；跨子树传递用 Context。没有外部真源时不要为了“全局”两个字先加 Store。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert`,children:[(0,h.jsx)(`strong`,{children:`外部 Store 何时有价值`}),(0,h.jsx)(`p`,{children:`跨 React root、已有非 React store、浏览器 API、复杂全局领域状态、需要 devtools/middleware/selector 生态时再评估 Zustand / Redux Toolkit / Jotai。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`定位：`}),`Zustand 偏轻量 store + selectors；Redux Toolkit 偏约束化可预测状态流和成熟生态；Jotai 偏原子化依赖图。它们不是 React Core，也不是 Server State cache 的替代品。`]})]})]})}var zn=[[12,24,18],[8,32,21]];function Bn({series:e,seriesKey:t}){let n=(0,d.useRef)(null),r=`series-${t}`;(0,d.useEffect)(()=>{let t=n.current;return t.textContent=`第三方 Chart 实例 ${r} · ${e.join(` / `)}`,()=>{t.textContent=``}},[r,e]);let i=[...t>0?[`cleanup series-${t-1}`]:[],`setup ${r}`];return(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{ref:n,style:{padding:14,border:`1px dashed var(--border-color)`,borderRadius:8}}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`,fontSize:12},children:i.slice(-6).join(`
`)||`等待 setup`})]})}function Vn(){let[e,t]=(0,d.useState)(!1),[n,r]=(0,d.useState)(0),i=zn[n%zn.length];return(0,h.jsxs)(`div`,{onClick:()=>console.log(`React parent 收到 portal child 的冒泡事件`),children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🌀`}),` Portal + 第三方 DOM：React Tree ≠ DOM Tree`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Escape Hatch`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Portal 只改变 DOM 的物理落点，React 关系仍留在原组件树中；第三方 DOM 实例则应由 ref 定位容器，并在 Effect 中 setup / cleanup。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` Portal 实验`]})}),(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:e=>{e.stopPropagation(),t(!0)},children:`打开 Portal`}),e&&(0,Mt.createPortal)((0,h.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,"aria-label":`Portal demo`,style:{position:`fixed`,inset:20,zIndex:1e3,display:`grid`,placeItems:`center`,background:`rgba(0,0,0,.45)`},children:(0,h.jsxs)(`div`,{style:{padding:20,borderRadius:12,background:`var(--bg-surface)`,maxWidth:520},children:[(0,h.jsx)(`h3`,{children:`DOM 在 document.body，React 仍是当前组件的 child`}),(0,h.jsx)(`p`,{children:`Portal 内事件默认仍按 React tree 冒泡，而不是按 DOM tree 推断组件父子关系。`}),(0,h.jsx)(`button`,{className:`btn`,onClick:()=>t(!1),children:`关闭`})]})}),document.body)]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`📈`}),` 第三方 DOM 生命周期`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`模拟图表/地图/编辑器：依赖变化时 cleanup old → setup new；卸载时 cleanup，避免重复 listener、observer、worker 或实例泄漏。`})]}),(0,h.jsx)(`button`,{className:`btn`,onClick:()=>r(e=>e+1),children:`切换 series，触发重建`}),(0,h.jsx)(`div`,{style:{marginTop:12},children:(0,h.jsx)(Bn,{series:i,seriesKey:n})})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`Portal 正确边界`}),(0,h.jsx)(`p`,{children:`Modal / tooltip / popover 需要逃离 overflow、stacking context 时使用。Portal 不自动提供 focus trap、Escape、ARIA 或滚动锁。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`第三方 DOM 反模式`}),(0,h.jsx)(`p`,{children:`在 render 中直接 new Chart(...)、重复 addEventListener，或只 setup 不 destroy。Render 应保持纯净，外部系统同步进入 Effect。`})]})]})]})}var Hn={ada:{id:`ada`,name:`Ada`,role:`Frontend`},lin:{id:`lin`,name:`Lin`,role:`Product`}};function Un(e){return new Promise(t=>setTimeout(t,e))}async function Wn(e){return await Un(700),{...Hn[e],fetchedAt:Date.now()}}function Gn(){let e=(0,d.useRef)(new Map),t=(0,d.useRef)(new Map),[n,r]=(0,d.useState)(`ada`),[i,a]=(0,d.useState)({status:`idle`,data:null,source:`—`}),[o,s]=(0,d.useState)(3e3),[c,l]=(0,d.useState)(0),[u,f]=(0,d.useState)([]);function p(){let t=Date.now();f(Array.from(e.current.entries()).map(([e,n])=>({key:e,age:t-n.cachedAt,name:n.data.name})))}async function m(n,{force:i=!1}={}){r(n);let s=`user:${n}`,c=e.current.get(s),u=c&&Date.now()-c.cachedAt<o;if(!i&&u){a({status:`success`,data:c.data,source:`fresh cache`}),p();return}if(!i&&t.current.has(s)){a(e=>({...e,status:`loading`,source:`deduped: reuse in-flight promise`}));let e=await t.current.get(s);a({status:`success`,data:e,source:`shared in-flight result`}),p();return}a(c?{status:`loading`,data:c.data,source:`stale cache shown while refetching`}:{status:`loading`,data:null,source:`network`});let d=Wn(n);t.current.set(s,d),l(e=>e+1);try{let t=await d;e.current.set(s,{data:t,cachedAt:Date.now()}),a({status:`success`,data:t,source:`network → cache`}),p()}finally{t.current.delete(s)}}function g(){let t=`user:${n}`,r=e.current.get(t);r&&e.current.set(t,{...r,cachedAt:0}),a(e=>({...e,source:`invalidated: next read is stale`})),p()}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🗄️`}),` Server State：cache、stale、refetch、dedupe`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Chapter 09`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Server State 不是“后端返回后塞进 useState”这么简单。它通常由远端系统拥有，客户端维护的是带有 freshness、缓存、后台刷新、失败与并发语义的副本。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`query key`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`stale`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`refetch`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`dedupe`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 最小 Query Cache 模拟器`]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,children:[`这是教学实现，不是 TanStack Query，也没有安装 `,(0,h.jsx)(`code`,{children:`@tanstack/react-query`}),`。用它观察成熟查询层为什么需要 query key、fresh/stale、in-flight dedupe 和 invalidation。`]})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8},children:[(0,h.jsx)(`button`,{className:`btn`,onClick:()=>m(`ada`),children:`读取 Ada`}),(0,h.jsx)(`button`,{className:`btn`,onClick:()=>{m(`ada`),m(`ada`)},children:`连续读取 Ada ×2`}),(0,h.jsx)(`button`,{className:`btn`,onClick:()=>m(`lin`),children:`读取 Lin`}),(0,h.jsx)(`button`,{className:`btn`,onClick:g,children:`invalidate 当前 key`}),(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>m(n,{force:!0}),children:`强制 refetch`})]}),(0,h.jsxs)(`label`,{style:{display:`block`,marginTop:14},children:[`模拟 staleTime：`,o,`ms `,(0,h.jsx)(`input`,{type:`range`,min:`0`,max:`8000`,step:`1000`,value:o,onChange:e=>s(Number(e.target.value))})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,style:{marginTop:14},children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`当前 query`}),(0,h.jsxs)(`p`,{children:[`key: user:`,n]}),(0,h.jsxs)(`p`,{children:[`status: `,i.status]}),(0,h.jsxs)(`p`,{children:[`source: `,i.source]}),(0,h.jsxs)(`p`,{children:[`实际 network request: `,c]}),i.data&&(0,h.jsx)(`pre`,{children:JSON.stringify(i.data,null,2)})]}),(0,h.jsxs)(`div`,{className:`demo-alert`,children:[(0,h.jsx)(`strong`,{children:`Cache snapshot`}),u.length===0?(0,h.jsx)(`p`,{children:`empty`}):u.map(e=>(0,h.jsxs)(`p`,{children:[e.key,` → `,e.name,` · snapshot age `,e.age,`ms`]},e.key))]})]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`Client State`}),(0,h.jsx)(`p`,{children:`modal 是否打开、当前 tab、输入框草稿。通常由当前客户端直接拥有和修改。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`Server State`}),(0,h.jsx)(`p`,{children:`用户、订单、列表等远端资源。客户端只是缓存副本，需要考虑 freshness、同步、失败和并发。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`映射到 TanStack Query v5：`}),`queryKey 决定缓存身份；缓存数据默认立即视为 stale，`,(0,h.jsx)(`code`,{children:`staleTime`}),` 可以延长 fresh 窗口；`,(0,h.jsx)(`code`,{children:`invalidateQueries`}),` 会把匹配 query 标为 invalid/stale，并默认在 active query 上触发后台 refetch。真实库还处理 inactive cache 的 GC、retry、focus/reconnect refetch、结构共享等，本 Demo 不冒充这些行为。`]})]})}function Kn(e,t){return new Promise((n,r)=>{let i=setTimeout(n,e);t?.addEventListener(`abort`,()=>{clearTimeout(i),r(new DOMException(`Aborted`,`AbortError`))})})}function qn(){let e=(0,d.useRef)(0),t=(0,d.useRef)(null),[n,r]=(0,d.useState)(`尚未请求`),[i,a]=(0,d.useState)([]),[o,s]=(0,d.useState)([{id:1,text:`已同步任务`}]),[c,l]=(0,d.useState)(!1),[u,f]=(0,d.useState)(1);function p(e){a(t=>[...t.slice(-8),e])}async function m(n,i){t.current?.abort();let a=new AbortController;t.current=a;let o=++e.current;p(`start #${o} ${n} (${i}ms)`);try{if(await Kn(i,a.signal),o!==e.current){p(`ignore stale #${o}`);return}r(`${n} · request #${o}`),p(`commit #${o}`)}catch(e){e.name===`AbortError`?p(`abort #${o}`):p(`error #${o}: ${e.message}`)}}async function g(){let e={id:`temp-${Date.now()}`,text:`optimistic item`,optimistic:!0};if(s(t=>[...t,e]),p(`optimistic append`),await Kn(700),c){s(t=>t.filter(t=>t.id!==e.id)),l(!1),p(`server failed → rollback`);return}s(t=>t.map(t=>t.id===e.id?{...t,id:Date.now(),optimistic:!1}:t)),p(`server success → confirm canonical item`)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🏎️`}),` 请求架构：race、cancellation、pagination、optimistic mutation`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Server State`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`网络请求可能乱序、取消、失败和重试。成熟 Server State 层的价值，是把缓存与请求生命周期集中管理，而不是让每个组件重复拼装 Effect、loading、race guard 和 mutation 回滚逻辑。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`⚔️`}),` Race + AbortController`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`先发一个慢请求，再立刻发快请求。这个教学实现主动 abort 旧请求；request id 仍作为 stale-result guard，演示“取消底层工作”和“忽略过期结果”是两个相关但不同的防线。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,h.jsx)(`button`,{className:`btn`,onClick:()=>m(`slow-react`,1600),children:`slow 1600ms`}),(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>m(`fast-query`,400),children:`fast 400ms`}),(0,h.jsx)(`button`,{className:`btn`,onClick:()=>t.current?.abort(),children:`cancel current`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,style:{marginTop:14},children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`Committed result`}),(0,h.jsx)(`p`,{children:n})]}),(0,h.jsx)(`pre`,{style:{whiteSpace:`pre-wrap`},children:i.join(`
`)})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:[(0,h.jsx)(`strong`,{children:`映射到 TanStack Query：`}),`queryFn 会收到 `,(0,h.jsx)(`code`,{children:`AbortSignal`}),`。只有 queryFn/底层请求实际消费这个 signal 时，网络 Promise 才会随取消协作终止；未消费 signal 的未使用 query 默认仍可完成并把结果留在 cache。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`📄`}),` Pagination 是 query identity 的一部分`]})}),(0,h.jsx)(`button`,{className:`btn`,disabled:u===1,onClick:()=>f(e=>e-1),children:`上一页`}),(0,h.jsxs)(`span`,{style:{margin:`0 12px`},children:[`queryKey = ["projects", `,`{`,` page: `,u,` `,`}`,`]`]}),(0,h.jsx)(`button`,{className:`btn`,onClick:()=>f(e=>e+1),children:`下一页`}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:[`真实查询层应把 page/cursor 纳入 query key。TanStack Query v5 可用 `,(0,h.jsx)(`code`,{children:`placeholderData: keepPreviousData`}),`（或等价 identity function）在新 key 请求期间继续显示上一页成功数据，并通过 `,(0,h.jsx)(`code`,{children:`isPlaceholderData`}),` 区分占位数据。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`✨`}),` Optimistic mutation：临时 UI → confirm / rollback`]})}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,h.jsx)(`button`,{className:`btn btn-primary`,onClick:g,children:`新增 optimistic item`}),(0,h.jsxs)(`button`,{className:`btn`,"aria-pressed":c,onClick:()=>l(e=>!e),children:[`下次请求失败：`,String(c)]})]}),(0,h.jsx)(`div`,{style:{marginTop:12,display:`grid`,gap:8},children:o.map(e=>(0,h.jsxs)(`div`,{style:{padding:10,border:`1px solid var(--border-color)`,borderRadius:8},children:[(0,h.jsx)(`strong`,{children:e.text}),e.optimistic&&(0,h.jsx)(`span`,{className:`badge badge-gray`,style:{marginLeft:8},children:`pending`})]},e.id))})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`反模式`}),(0,h.jsx)(`p`,{children:`每个页面都写 useEffect + fetch + loading + error + ignore flag + retry + cache。代码会快速演化成彼此不一致的数据层。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`TanStack Query 心智`}),(0,h.jsx)(`p`,{children:`query 负责读取与缓存生命周期；mutation 负责写入。成功后常见做法是 invalidate 相关 query 或直接 setQueryData。Optimistic UI 有两条主路：只在单个 UI 中展示时可利用 mutation variables；需要修改共享 cache 时通常在 onMutate 中 cancel 相关 refetch、snapshot 旧值、setQueryData，并在失败时 rollback。`})]})]})]})}var Jn=[{id:1,name:`React 性能手册`,category:`book`},{id:2,name:`TypeScript 工程指南`,category:`book`},{id:3,name:`React 实验课程`,category:`course`},{id:4,name:`Web Accessibility 课程`,category:`course`}];function Yn(e){let t=new URLSearchParams(e);return{query:t.get(`q`)??``,category:t.get(`category`)??`all`}}function Xn({query:e,category:t}){let n=new URLSearchParams;e&&n.set(`q`,e),t!==`all`&&n.set(`category`,t);let r=n.toString();return r?`?${r}`:``}function Zn(){let[e,t]=(0,d.useState)(`?q=react&category=book`),{query:n,category:r}=Yn(e),i=(0,d.useMemo)(()=>{let e=n.trim().toLowerCase();return Jn.filter(t=>{let n=!e||t.name.toLowerCase().includes(e),i=r===`all`||t.category===r;return n&&i})},[n,r]);function a(e){t(Xn({query:n,category:r,...e}))}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🔗`}),` URL 也是页面状态：Params / Search Params`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Router 心智模型`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Router 不只是“点击链接换组件”。URL 本身就是可复制、可刷新、可前进后退的页面状态容器。 路径参数通常表达资源身份，Search Params 更适合搜索、筛选、排序、分页等页面视图状态。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`URL = 可持久化页面状态`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Route Params`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Search Params`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Single Source of Truth`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` URL 状态实验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`这里用 URLSearchParams 模拟 Router 的 search params。输入和筛选直接修改“URL”，列表再从 URL 派生；不会同时维护一份重复的 filter State。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`label`,{style:{display:`block`,fontSize:12,marginBottom:6},children:`搜索关键字 q`}),(0,h.jsx)(`input`,{className:`form-input`,value:n,onChange:e=>a({query:e.target.value}),placeholder:`例如 react`}),(0,h.jsx)(`label`,{style:{display:`block`,fontSize:12,margin:`14px 0 6px`},children:`分类 category`}),(0,h.jsxs)(`select`,{className:`form-input`,value:r,onChange:e=>a({category:e.target.value}),children:[(0,h.jsx)(`option`,{value:`all`,children:`全部`}),(0,h.jsx)(`option`,{value:`book`,children:`图书`}),(0,h.jsx)(`option`,{value:`course`,children:`课程`})]}),(0,h.jsx)(`button`,{className:`btn`,style:{marginTop:14},onClick:()=>t(``),children:`重置 URL 状态`})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginBottom:8},children:`当前可分享 URL`}),(0,h.jsxs)(`code`,{style:{display:`block`,padding:12,overflowWrap:`anywhere`},children:[`/products`,e||`（无 search params）`]}),(0,h.jsx)(`div`,{style:{marginTop:14,display:`grid`,gap:8},children:i.length===0?(0,h.jsx)(`div`,{className:`demo-alert`,children:`没有匹配结果。URL 仍完整记录了当前筛选条件。`}):i.map(e=>(0,h.jsxs)(`div`,{style:{padding:10,border:`1px solid var(--border-color)`,borderRadius:8},children:[(0,h.jsx)(`strong`,{children:e.name}),(0,h.jsx)(`span`,{className:`badge badge-gray`,style:{marginLeft:8},children:e.category})]},e.id))})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧭`}),` Params 与 Search Params 怎么分工`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Route Params：资源身份`}),(0,h.jsx)(`code`,{children:`/users/:userId`}),(0,h.jsx)(`br`,{}),(0,h.jsx)(`code`,{children:`/orders/:orderId`}),(0,h.jsx)(`p`,{children:`通常决定“你正在看哪个资源”，是路由匹配的一部分。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Search Params：页面视图状态`}),(0,h.jsx)(`code`,{children:`?q=react&page=2&sort=price`}),(0,h.jsx)(`p`,{children:`适合搜索、过滤、排序、分页；刷新和分享链接后仍能恢复同一视图。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 项目边界`]}),(0,h.jsx)(`p`,{children:`不要把所有 UI State 都塞进 URL。Modal 临时动画状态、输入法组合状态等通常留在组件内； 但只要状态需要“刷新保持、链接分享、浏览器前进/后退恢复”，URL 往往比普通 useState 更合适。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`⚠️`}),` 常见反模式：双份真相`]}),(0,h.jsxs)(`p`,{children:[`同时维护 `,(0,h.jsx)(`code`,{children:`searchParams`}),` 和一套完全相同的 `,(0,h.jsx)(`code`,{children:`filterState`}),`，再用 Effect 双向同步，容易形成循环更新和状态漂移。 优先选择一个 Source of Truth，再从它派生 UI。`]})]})]})}var Qn={"/dashboard":{label:`Dashboard index`,matched:[`Root`,`DashboardLayout`,`DashboardHome`],child:`DashboardHome（index route）`,note:`访问父路径本身时，index route 填入父级 Outlet。`},"/dashboard/settings":{label:`Settings`,matched:[`Root`,`DashboardLayout`,`Settings`],child:`Settings`,note:`settings 是 dashboard 的子路径，父布局继续保留，只替换 Outlet 内容。`},"/dashboard/projects/42":{label:`Project 42`,matched:[`Root`,`DashboardLayout`,`ProjectLayout`,`ProjectDetail`],child:`ProjectDetail（:projectId = 42）`,note:`URL 层级可以映射为多层组件层级，每一层通过 Outlet 承接下一层。`},"/login":{label:`Login`,matched:[`Root`,`AuthLayout`,`Login`],child:`Login`,note:`AuthLayout 可以是无 path 的 layout route：共享 UI 布局，但不会给 URL 增加额外 segment。`}};function $n({matched:e}){return(0,h.jsx)(`div`,{style:{display:`grid`,gap:8},children:e.map((t,n)=>(0,h.jsxs)(`div`,{style:{marginLeft:n*18,padding:`10px 12px`,border:`1px solid var(--border-color)`,borderRadius:8,background:n===e.length-1?`var(--bg-surface-secondary)`:void 0},children:[(0,h.jsx)(`strong`,{children:t}),n<e.length-1&&(0,h.jsx)(`div`,{style:{marginTop:6,fontSize:12,color:`var(--text-muted)`},children:`↓ Outlet`})]},t))})}function er(){let[e,t]=(0,d.useState)(`/dashboard`),n=Qn[e];return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🪆`}),` Nested Routes：URL 层级如何进入 Outlet`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Router 架构`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`嵌套路由把 URL 层级、组件层级和数据边界组织在同一棵 Route Tree 中。父路由负责共享布局， 匹配到的子路由渲染进父级 Outlet；切换子页面时，不需要把整个页面壳重新建模。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Nested Route`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Outlet`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Index Route`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Layout Route`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 路由树实验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`仓库当前没有安装 React Router，因此这里不伪造 Router 运行时；用等价的 route match 结果直接观察“哪些布局保留、哪个子路由进入 Outlet”。`})]}),(0,h.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,marginBottom:16},children:Object.entries(Qn).map(([n,r])=>(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>t(n),"aria-pressed":e===n,children:r.label},n))}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginBottom:8},children:`当前 URL`}),(0,h.jsx)(`code`,{style:{display:`block`,padding:12,marginBottom:14},children:e}),(0,h.jsx)($n,{matched:n.matched})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginBottom:8},children:`最深层 Outlet 当前内容`}),(0,h.jsx)(`strong`,{children:n.child}),(0,h.jsx)(`p`,{style:{marginTop:12},children:n.note}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:16},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`观察重点`}),(0,h.jsxs)(`p`,{children:[`在 `,(0,h.jsx)(`code`,{children:`/dashboard`}),` 与 `,(0,h.jsx)(`code`,{children:`/dashboard/settings`}),` 之间切换时，`,(0,h.jsx)(`code`,{children:`DashboardLayout`}),` 仍属于两条 URL 的共同匹配链，变化的是它 Outlet 中的子页面。`]})]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 四个必须分清的概念`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Nested Route`}),(0,h.jsxs)(`p`,{children:[`父路径会自动包含到子路径中，例如 dashboard + settings → `,(0,h.jsx)(`code`,{children:`/dashboard/settings`}),`。`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Outlet`}),(0,h.jsx)(`p`,{children:`父路由渲染共享 UI，Outlet 是匹配子路由的插槽；没有匹配子路由时可以为空。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Index Route`}),(0,h.jsx)(`p`,{children:`当 URL 正好等于父路由路径时，index route 作为默认子页面渲染进 Outlet。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Layout Route`}),(0,h.jsx)(`p`,{children:`无 path 的父 Route 可以只提供共享布局，不向 URL 添加新的 segment，例如登录/注册共用 AuthLayout。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`⚠️`}),` 常见反模式：把所有布局塞进根组件条件判断`]}),(0,h.jsx)(`p`,{children:`当页面层级已经由 URL 决定，却在根组件里用大量路径判断手写侧栏、Header、权限区块条件，会把路由结构重新复制成第二套 UI 状态机。 真实项目中应让 Route Tree 表达层级，让父布局和 Outlet 承担组合职责。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 项目边界`]}),(0,h.jsx)(`p`,{children:`URL 嵌套与 Layout 嵌套相关，但不是绝对一一对应：有时需要嵌套 URL 而不继承某个布局，也可能需要共享布局却不新增 URL segment。 因此设计路由时要同时考虑 URL 信息架构和 UI 布局边界，而不是只按目录层级机械嵌套。`})]})]})}var tr={"/":`Home`,"/courses":`Courses`,"/courses/react":`React Course`,"/account":`Account`};function nr(){let[e,t]=(0,d.useState)([`/`]),[n,r]=(0,d.useState)(0),[i,a]=(0,d.useState)(`—`),o=e[n],s=tr[o]??null;function c(i,{replace:o=!1,reason:s=`用户点击链接`}={}){if(o){let r=[...e];r[n]=i,t(r),a(`${s}：replace 当前 history entry`);return}let c=[...e.slice(0,n+1),i];t(c),r(c.length-1),a(s)}function l(t){let i=n+t;i<0||i>=e.length||(r(i),a(t<0?`浏览器 Back`:`浏览器 Forward`))}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧭`}),` Navigation 与 Route Boundary`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`页面导航`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`路由导航不只是“把 pathname 改掉”。真实应用还要区分声明式链接、程序式导航、history 前进后退，以及未匹配 URL 的 Not Found 边界。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Link / NavLink`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`useNavigate`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`redirect`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`History`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`Not Found`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` Navigation history 实验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`这里用本地数组模拟浏览器 history，观察 push、replace、Back / Forward 的差异；真实 React Router 中普通用户导航优先使用 Link / NavLink。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,marginBottom:16},children:[Object.keys(tr).map(e=>(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>c(e),children:e},e)),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>c(`/missing-page`),children:`打开不存在页面`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`},children:`当前 location`}),(0,h.jsx)(`code`,{style:{display:`block`,padding:`10px 0`},children:o}),s?(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Matched route`}),(0,h.jsx)(`p`,{children:s})]}):(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`404 / Not Found boundary`}),(0,h.jsx)(`p`,{children:`当前 URL 没有业务路由匹配。应由路由层渲染明确的 Not Found 页面，而不是让应用静默空白。`})]})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,marginBottom:12},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn`,disabled:n===0,onClick:()=>l(-1),children:`← Back`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,disabled:n===e.length-1,onClick:()=>l(1),children:`Forward →`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>c(`/account`,{replace:!0,reason:`登录完成后的重定向`}),children:`replace → /account`})]}),(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginBottom:8},children:`History stack`}),(0,h.jsx)(`div`,{style:{display:`grid`,gap:6},children:e.map((e,t)=>(0,h.jsxs)(`div`,{style:{padding:8,border:`1px solid var(--border-color)`,borderRadius:8},children:[t===n?`→ `:`  `,e]},`${e}-${t}`))}),(0,h.jsxs)(`p`,{style:{marginTop:12,fontSize:12},children:[`最近导航原因：`,i]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` Link、redirect、useNavigate 分工`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Link / NavLink`}),(0,h.jsx)(`p`,{children:`用户主动点击去另一个页面时优先使用。它们保留标准链接语义；NavLink 额外暴露 active 状态，在 Data / Framework 模式还可暴露 pending 状态。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`redirect / useNavigate`}),(0,h.jsxs)(`p`,{children:[`在 Data / Framework 模式中，如果跳转是 loader/action 数据流程的一部分，官方更推荐直接返回 `,(0,h.jsx)(`code`,{children:`redirect`}),`。`,(0,h.jsx)(`code`,{children:`useNavigate`}),` 更适合不由普通链接表达的客户端流程，例如超时退出、计时器结束，或 Declarative 模式下表单成功后的命令式跳转。`]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`⚠️`}),` 常见反模式：按钮伪装链接`]}),(0,h.jsx)(`p`,{children:`如果行为本质是“导航到另一个 URL”，却统一使用按钮和 JavaScript 跳转，会丢失浏览器原生链接能力，例如右键菜单、在新标签页打开以及更自然的键盘/辅助技术语义。 路由 API 应服从 Web 平台语义，而不是反过来。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`📌`}),` 本页是概念模拟`]}),(0,h.jsxs)(`p`,{children:[`当前仓库没有安装 React Router；按钮和本地数组只用于可视化 history 语义，不等同于真实 `,(0,h.jsx)(`code`,{children:`Link`}),`、`,(0,h.jsx)(`code`,{children:`redirect`}),`、`,(0,h.jsx)(`code`,{children:`useNavigate`}),` 运行时。`]})]})]})}var rr={1:{id:`1`,name:`Ada`,role:`Frontend Engineer`},2:{id:`2`,name:`Lin`,role:`Product Engineer`}};function ir(e){return new Promise(t=>setTimeout(t,e))}async function ar(e){await ir(650);let t=rr[e];if(!t)throw Error(`404 User Not Found`);return t}function or(){let[e,t]=(0,d.useState)(`1`),[n,r]=(0,d.useState)(`idle`),[i,a]=(0,d.useState)(null),[o,s]=(0,d.useState)(null),[c,l]=(0,d.useState)([`等待导航`]);async function u(e){t(e),r(`loading`),a(null),s(null),l([`1. match /users/${e}`,`2. loader({ params: { userId: ${e} } })`,`3. 等待 loader 结果`]);try{let t=await ar(e);a(t),r(`success`),l(e=>[...e,`4. loader 返回数据`,`5. route component 使用 loader data 渲染`])}catch(e){s(e.message),r(`error`),l(e=>[...e,`4. loader 抛出错误`,`5. 最近的 route error boundary 接管 UI`])}}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`📦`}),` Route Data Boundary：先匹配，再加载，再渲染`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Data Router`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`Data Router 把“这个 URL 需要什么数据”放到 route boundary 上。导航发生后先匹配路由并执行 loader，loader 完成后页面再消费数据；失败则交给最近的路由错误边界。`}),(0,h.jsxs)(`div`,{className:`demo-meta-tags`,children:[(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`loader`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`params`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`pending navigation`}),(0,h.jsx)(`span`,{className:`badge badge-gray`,children:`error boundary`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` Loader 生命周期实验台`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`当前仓库没有 React Router，因此这里用同样的阶段顺序模拟 Data Router。重点观察数据职责属于 route，而不是每个页面都自行写一套 mount Effect。`})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,marginBottom:16},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>u(`1`),children:`/users/1`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>u(`2`),children:`/users/2`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>u(`404`),children:`/users/404`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginBottom:8},children:`当前 route params`}),(0,h.jsx)(`code`,{style:{display:`block`,padding:12,marginBottom:14},children:`{ userId: "${e}" }`}),(0,h.jsx)(`div`,{style:{display:`grid`,gap:8},children:c.map(e=>(0,h.jsx)(`div`,{style:{padding:9,border:`1px solid var(--border-color)`,borderRadius:8},children:e},e))})]}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginBottom:10},children:`Route outlet 当前状态`}),n===`idle`&&(0,h.jsx)(`div`,{className:`demo-alert`,children:`选择一个用户路由开始实验。`}),n===`loading`&&(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Navigation pending`}),(0,h.jsx)(`p`,{children:`下一页面 loader 正在执行。真实 Data Router 可通过 navigation state 显示全局或局部 pending UI。`})]}),n===`success`&&i&&(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Loader data ready`}),(0,h.jsx)(`p`,{children:(0,h.jsx)(`strong`,{children:i.name})}),(0,h.jsx)(`p`,{children:i.role})]}),n===`error`&&(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Route Error Boundary`}),(0,h.jsx)(`p`,{children:o})]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` Route loader 与组件 fetch 的架构差异`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Route boundary`}),(0,h.jsx)(`p`,{children:`路由匹配已经知道页面身份，因此 loader 可以直接拿 params 加载页面必需数据，并与 navigation pending、错误边界、重定向等路由语义组合。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`每页 mount Effect 重复取数`}),(0,h.jsx)(`p`,{children:`如果所有页面都在挂载后才各自 Effect → fetch，就需要重复实现 loading、错误、竞态、取消、导航协作等机制。复杂应用通常应由 Router 或 Server State 层承担这些职责。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsxs)(`div`,{className:`demo-alert-title`,children:[(0,h.jsx)(`span`,{children:`💡`}),` 与 TanStack Query 的边界`]}),(0,h.jsx)(`p`,{children:`Loader 解决“路由进入前需要什么数据”的页面边界问题；TanStack Query 更擅长 cache、stale、refetch、dedupe、mutation 等 Server State 生命周期。 两者可以组合，不需要把它们理解成只能二选一。Chapter 09 会专门拆解这一层。`})]})]})}function sr(){let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(`idle`),[i,a]=(0,d.useState)(`尚未提交`);function o(t){t.preventDefault(),r(`loading`),a(`正在保存…`),setTimeout(()=>{if(!e.includes(`@`)){r(`error`),a(`请输入有效邮箱地址`);return}r(`success`),a(`已保存 ${e}`)},700)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`♿`}),` 可访问性基础：语义、名称、键盘与状态反馈`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Accessibility`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`优先使用原生 HTML 语义，让浏览器先提供键盘、焦点和辅助技术能力；ARIA 用于补足语义，而不是替代原生元素。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 可访问表单状态实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`只用键盘 Tab / Shift+Tab / Enter 完成操作，并观察 loading / error / success 都通过 live region 暴露。`})]}),(0,h.jsxs)(`form`,{noValidate:!0,onSubmit:o,style:{display:`grid`,gap:12,maxWidth:520},children:[(0,h.jsx)(`label`,{htmlFor:`a11y-email`,children:`邮箱地址`}),(0,h.jsx)(`input`,{id:`a11y-email`,className:`form-input`,type:`email`,value:e,onChange:e=>t(e.target.value),"aria-describedby":`a11y-email-help`}),(0,h.jsx)(`small`,{id:`a11y-email-help`,children:`用于接收 React 学习进度通知。`}),(0,h.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:n===`loading`,children:n===`loading`?`保存中…`:`保存`})]}),(0,h.jsx)(`div`,{role:n===`error`?`alert`:`status`,"aria-live":n===`error`?`assertive`:`polite`,className:n===`error`?`demo-alert demo-alert-warning`:`demo-alert demo-alert-tip`,style:{marginTop:16},children:(0,h.jsx)(`strong`,{children:i})})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`优先原生语义`}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`code`,{children:`<button>`}),`、`,(0,h.jsx)(`code`,{children:`<label>`}),`、`,(0,h.jsx)(`code`,{children:`<nav>`}),` 等自带语义和交互行为，通常优于 div + role + 自己重写键盘逻辑。`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`ARIA 不改变行为`}),(0,h.jsxs)(`p`,{children:[`给 `,(0,h.jsx)(`code`,{children:`div role="button"`}),` 并不会自动获得 Enter/Space 行为、焦点规则或 disabled 语义；ARIA 主要描述语义状态。`]})]})]})]})}function cr({onClose:e}){let t=(0,d.useRef)(null);return(0,d.useEffect)(()=>{let n=t.current;if(!n)return;let r=Array.from(n.querySelectorAll(`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`)),i=r[0],a=r[r.length-1];i?.focus();function o(t){if(t.key===`Escape`){t.preventDefault(),e();return}t.key===`Tab`&&r.length!==0&&(t.shiftKey&&document.activeElement===i?(t.preventDefault(),a?.focus()):!t.shiftKey&&document.activeElement===a&&(t.preventDefault(),i?.focus()))}return n.addEventListener(`keydown`,o),()=>n.removeEventListener(`keydown`,o)},[e]),(0,h.jsx)(`div`,{style:{position:`fixed`,inset:0,background:`rgba(0,0,0,.45)`,display:`grid`,placeItems:`center`,zIndex:1e3,padding:20},children:(0,h.jsxs)(`section`,{ref:t,role:`dialog`,"aria-modal":`true`,"aria-labelledby":`accessible-modal-title`,"aria-describedby":`accessible-modal-desc`,style:{background:`var(--bg-surface)`,padding:20,borderRadius:12,maxWidth:520,width:`100%`},children:[(0,h.jsx)(`h3`,{id:`accessible-modal-title`,children:`键盘可用的 Modal`}),(0,h.jsx)(`p`,{id:`accessible-modal-desc`,children:`Tab/Shift+Tab 会留在对话框内，Escape 关闭；关闭后焦点回到打开按钮。`}),(0,h.jsx)(`label`,{htmlFor:`modal-note`,children:`备注`}),(0,h.jsx)(`input`,{id:`modal-note`,className:`form-input`,placeholder:`尝试按 Tab`}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:16},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn btn-primary`,onClick:e,children:`保存并关闭`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:e,children:`取消`})]})]})})}function lr(){let[e,t]=(0,d.useState)(!1),n=(0,d.useRef)(null);function r(){t(!1),requestAnimationFrame(()=>n.current?.focus())}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsx)(`div`,{children:(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`⌨️`}),` Modal Focus：焦点必须进入、限制、再归还`]})}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Focus Management`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`模态对话框不能只“视觉盖住页面”。WAI-ARIA Modal Dialog 模式要求焦点进入对话框、Tab/Shift+Tab 不逃出、Escape 可关闭，并在通常情况下关闭后把焦点归还到触发位置；模态期间背景内容还应真正不可交互。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 只用键盘完成实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`打开后连续按 Tab / Shift+Tab，再按 Escape。这个教学实现重点演示初始焦点、焦点循环和焦点恢复。`})]}),(0,h.jsx)(`button`,{ref:n,type:`button`,className:`btn btn-primary`,onClick:()=>t(!0),children:`打开 Modal`}),e&&(0,h.jsx)(cr,{onClose:r})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Modal 的完整职责`}),(0,h.jsx)(`p`,{children:`accessible name、合适的初始焦点、Tab 循环、Escape、关闭后的合理焦点位置，以及让背景内容在键盘、指针和辅助技术语义上不可交互。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`教学实现边界`}),(0,h.jsxs)(`p`,{children:[`本 Demo 没有实现完整的 `,(0,h.jsx)(`code`,{children:`inert`}),`/background isolation、动态 focusable 列表、嵌套 dialog 与滚动锁定。`,(0,h.jsx)(`code`,{children:`aria-modal="true"`}),` 是语义声明，不应被当作自动禁用背景交互的实现。生产项目优先采用经过可访问性验证的 Dialog primitive。`]})]})]})]})}var ur=[{id:`unit`,title:`Vitest · Fast feedback`,focus:`纯函数、Reducer、Hook 和可在测试环境中确定复现的逻辑`,rule:`Vitest 是测试运行器，不等于只做 unit test；这里把它放在快速逻辑反馈层。`},{id:`integration`,title:`React Testing Library · User-observable UI`,focus:`用户如何看到、点击、输入，以及异步 UI 如何变化`,rule:`Testing Library 不是固定的“integration test 层级”；核心原则是按用户可观察行为查询和断言 UI。`},{id:`e2e`,title:`Playwright · Real browser E2E`,focus:`真实浏览器中的关键业务路径、路由、网络、焦点与浏览器行为`,rule:`把跨系统关键路径放进 E2E，不把所有组件细节都塞进浏览器测试。`}];function dr(){let[e,t]=(0,d.useState)(`integration`),[n,r]=(0,d.useState)(`idle`),i=ur.find(t=>t.id===e);async function a(){r(`loading`),await new Promise(e=>setTimeout(e,550)),r(`success`)}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧪`}),` Testing：测试行为，而不是实现细节`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Chapter 11`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`按反馈速度和系统边界组织测试组合：Vitest 提供测试运行环境，Testing Library 强调用户可观察 UI，Playwright 在真实浏览器覆盖关键端到端路径。工具与“unit / integration / E2E”并不是严格一一对应。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:ur.map(n=>(0,h.jsx)(`button`,{className:`btn`,"aria-pressed":e===n.id,onClick:()=>t(n.id),children:n.title},n.id))}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:[(0,h.jsx)(`strong`,{children:i.title}),(0,h.jsx)(`p`,{children:i.focus}),(0,h.jsx)(`p`,{children:i.rule})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsx)(`h3`,{className:`demo-section-title`,children:`🎮 异步 UI 的用户视角`})}),(0,h.jsx)(`button`,{className:`btn btn-primary`,disabled:n===`loading`,onClick:a,children:n===`loading`?`保存中…`:`保存资料`}),n===`success`&&(0,h.jsx)(`p`,{role:`status`,children:`保存成功`}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`RTL 应模拟点击并等待“保存成功”出现在可访问 UI 中，而不是断言内部 setState 调用了几次。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`strong`,{children:`User-centric query`}),(0,h.jsx)(`p`,{children:`优先 getByRole（通常结合 accessible name），表单控件可使用 getByLabelText；只有确实缺少合适语义查询时再退回 text/testid 等选择方式。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`strong`,{children:`Mock 边界`}),(0,h.jsx)(`p`,{children:`Mock 不稳定或昂贵的系统边界，例如网络、时间、第三方 SDK；不要 mock 掉被测组件真正需要协作的每一层，否则测试只证明 mock 自己。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`strong`,{children:`反模式：`}),`通过 CSS class、组件实例、私有 State 或实现函数调用次数断言业务行为。重构实现而用户行为不变时，这类测试会产生无意义失败。`]})]})}var fr={props:{title:`Props / children = component contract`,detail:`为组件输入定义最小且稳定的 contract。children 通常用 ReactNode；只有确实要求单个 React element 时才收紧为 ReactElement。`,boundary:`不要为了方便把业务 Props 写成 any，也不要试图用 TypeScript 强制 children 必须是某一种 JSX 标签。`},event:{title:`Event = 从 JSX 位置反推具体事件类型`,detail:`输入框常见 ChangeEvent<HTMLInputElement>，表单常见 FormEvent<HTMLFormElement>；优先从 JSX handler 的 hover/inference 得到准确类型。`,boundary:`不要统一写 Event 或 any，否则会丢失 currentTarget/value 等元素级信息。`},state:{title:`State = 让非法状态难以表达`,detail:`简单 state 依赖推断；复杂异步状态优先 discriminated union，例如 idle/loading/success/error，而不是多个互相矛盾的 boolean。`,boundary:`类型不是把每个 useState 都写满泛型；重点是状态模型和 transition contract。`},ref:{title:`Ref = 明确 imperative target`,detail:`DOM ref 指向具体元素类型，例如 HTMLInputElement；初始值通常是 null，因此读取时必须处理尚未挂载的阶段。`,boundary:`ref 是 escape hatch，不应因为有类型就把普通数据流迁移到 ref。`},generic:{title:`Generic = 保留调用方数据类型关系`,detail:`泛型组件与 Hook 适合表达 items → renderItem、initialValue → currentValue 这类输入输出关联，而不是为了“高级”而泛型化。`,boundary:`泛型参数必须表达真实关系；如果所有字段最终都退化为 unknown/any，抽象没有价值。`}};function pr(){let[e,t]=(0,d.useState)(`props`),[n,r]=(0,d.useState)(`Lambert`),i=(0,d.useRef)(null),a=fr[e];function o(){i.current?.focus()}return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🔷`}),` TypeScript for React：类型写在边界，不是写满每一行`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`TypeScript`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`运行层保持 JSX；CodeViewer 提供真实 TSX 类型示例。重点观察 Props、children、event、state、ref 和 generic 如何描述组件之间的 contract。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 选择一个类型边界`]})}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`,marginBottom:14},children:Object.keys(fr).map(n=>(0,h.jsx)(`button`,{type:`button`,className:`btn`,"aria-pressed":e===n,onClick:()=>t(n),children:n},n))}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:a.title}),(0,h.jsx)(`p`,{children:a.detail})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`边界 / 反模式`}),(0,h.jsx)(`p`,{children:a.boundary})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 可观察实验：event + state + ref`]})}),(0,h.jsxs)(`label`,{style:{display:`grid`,gap:6,maxWidth:360},children:[(0,h.jsx)(`span`,{children:`开发者名称`}),(0,h.jsx)(`input`,{ref:i,value:n,onChange:e=>r(e.currentTarget.value)})]}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:10,flexWrap:`wrap`},children:[(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:o,children:`通过 ref 聚焦输入框`}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,onClick:()=>r(`React Learner`),children:`更新 State`})]}),(0,h.jsxs)(`p`,{style:{marginTop:12},children:[`当前可观察 State：`,(0,h.jsx)(`strong`,{children:n||`（空）`})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🏗️`}),` 真实项目边界`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`应该重点建模`}),(0,h.jsx)(`p`,{children:`公共组件 Props、领域状态 union、API/Domain 转换、复用 Hook 的输入输出关系。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`不要过度建模`}),(0,h.jsx)(`p`,{children:`局部变量能推断就让 TypeScript 推断；不要为了“类型覆盖率”制造重复注解或把所有组件改成泛型。`})]})]})]})]})}var mr={csr:{name:`CSR / SPA`,timeline:[`Server → minimal HTML shell`,`Browser → load JS`,`React → render UI on client`,`Client Router → subsequent navigation`],strengths:`客户端交互模型直接，静态托管简单。`,tradeoffs:`首屏内容依赖 JS；SEO、首屏性能和数据瀑布需要额外设计。`},ssg:{name:`SSG / Static Pre-rendering`,timeline:[`Build time → execute data loading`,`Generate HTML for known URLs`,`CDN → return ready HTML`,`Browser → hydrate if interactive`],strengths:`可缓存、部署简单，适合内容相对稳定页面。`,tradeoffs:`动态性受构建/再验证策略约束；不是每个 URL 都适合预生成。`},ssr:{name:`SSR`,timeline:[`Request → server render React tree`,`Server → stream/send HTML`,`Browser → display HTML`,`Client → hydrate interactive boundaries`],strengths:`请求时可读取动态数据并先发送 HTML。`,tradeoffs:`需要服务器运行时、缓存策略和 hydration 正确性。`}};function hr(){let[e,t]=(0,d.useState)(`ssr`),n=mr[e],r=(0,d.useMemo)(()=>Object.entries(mr),[]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🌐`}),` CSR / SPA / SSG / SSR：谁在什么时候生成 HTML？`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Rendering Strategy`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`React 提供客户端渲染、服务端渲染和 hydration 等底层能力；SSG、路由、数据加载和部署策略通常由框架组合。不要把“React”与“某个 React 框架的默认策略”混为一谈。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` 切换渲染策略观察时间线`]})}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`,marginBottom:16},children:r.map(([n,r])=>(0,h.jsx)(`button`,{type:`button`,className:`btn`,"aria-pressed":e===n,onClick:()=>t(n),children:r.name},n))}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsx)(`div`,{style:{display:`grid`,gap:8},children:n.timeline.map((e,t)=>(0,h.jsxs)(`div`,{style:{padding:10,border:`1px solid var(--border-color)`,borderRadius:8},children:[(0,h.jsxs)(`strong`,{children:[t+1,`.`]}),` `,e]},e))}),(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`适合点`}),(0,h.jsx)(`p`,{children:n.strengths})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:10},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`代价`}),(0,h.jsx)(`p`,{children:n.tradeoffs})]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧠`}),` 关键边界`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`React Core`}),(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`code`,{children:`createRoot`}),`、`,(0,h.jsx)(`code`,{children:`hydrateRoot`}),`、`,(0,h.jsx)(`code`,{children:`react-dom/server`}),` streaming APIs 等是底层能力。`]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Framework`}),(0,h.jsx)(`p`,{children:`路由、数据加载、build-time prerender、部署适配、缓存和 Server/Client module graph 通常由框架负责。`})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`反模式：用 SPA / SSR 二选一描述整个产品`}),(0,h.jsx)(`p`,{children:`真实应用可以按路由混合策略：静态页预渲染、动态页 SSR、局部交互 hydration、后续导航客户端执行。先定义页面数据与更新频率，再选渲染策略。`})]})]})}var gr=`<button id="buy">购买 · $99</button>`;function _r(){let[e,t]=(0,d.useState)(99),[n,r]=(0,d.useState)(!1),[i,a]=(0,d.useState)(1),o=`<button id="buy">购买 · $${e}</button>`,s=gr===o,c=(0,d.useMemo)(()=>[`① shell: <header> + product title`,`② Suspense fallback: reviews loading…`,`③ reviews boundary resolves → stream replacement content`],[]);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`💧`}),` Server HTML → Hydration → Interactive`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`hydrateRoot / Streaming`})]}),(0,h.jsx)(`p`,{className:`demo-desc`,children:`SSR 先生成 HTML；hydration 是让客户端 React 接管已有的服务端 HTML，使同一初始 UI 获得 React 交互能力。用于 hydration 的客户端首次 render 应与服务端输出一致，mismatch 应被当作需要修复的 bug。`})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` Hydration mismatch 实验`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`把客户端首屏价格改成与服务端不同，观察为什么这不是普通的“稍后更新”。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`label`,{htmlFor:`hydration-client-price`,style:{display:`block`,marginBottom:6},children:`客户端首屏 price`}),(0,h.jsx)(`input`,{id:`hydration-client-price`,className:`form-input`,type:`number`,value:e,onChange:e=>{t(Number(e.target.value)),r(!1)}}),(0,h.jsx)(`button`,{type:`button`,className:`btn btn-primary`,style:{marginTop:12},onClick:()=>r(!0),children:`模拟 hydrateRoot`})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`},children:`Server HTML`}),(0,h.jsx)(`code`,{style:{display:`block`,padding:8},children:gr}),(0,h.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginTop:10},children:`Client first render`}),(0,h.jsx)(`code`,{style:{display:`block`,padding:8},children:o}),(0,h.jsxs)(`div`,{className:`demo-alert ${s?`demo-alert-tip`:`demo-alert-warning`}`,style:{marginTop:12},children:[(0,h.jsx)(`strong`,{children:s?`MATCH`:`MISMATCH`}),(0,h.jsx)(`p`,{children:s?`客户端可基于同一初始 UI hydrate 服务端标记。`:`真实 hydrateRoot 会报告 hydration mismatch；React 不保证修补所有不一致（例如某些属性差异），因此不能把 mismatch 当成业务同步机制。`})]}),n&&(0,h.jsxs)(`p`,{children:[(0,h.jsx)(`strong`,{children:`交互状态：`}),s?`hydrated / interactive`:`hydration correctness violated`]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🌊`}),` Streaming SSR：先 shell，再逐步 reveal`]})}),(0,h.jsx)(`div`,{style:{display:`grid`,gap:8},children:c.slice(0,i).map(e=>(0,h.jsx)(`div`,{style:{padding:10,border:`1px solid var(--border-color)`,borderRadius:8},children:e},e))}),(0,h.jsx)(`button`,{type:`button`,className:`btn`,style:{marginTop:12},disabled:i===c.length,onClick:()=>a(e=>Math.min(c.length,e+1)),children:`流式发送下一段`}),(0,h.jsx)(`div`,{className:`demo-alert demo-alert-tip`,style:{marginTop:12},children:(0,h.jsxs)(`p`,{children:[`Node.js Stream 环境优先使用 `,(0,h.jsx)(`code`,{children:`renderToPipeableStream`}),`；Deno、现代 edge runtime 等 Web Streams 环境使用 `,(0,h.jsx)(`code`,{children:`renderToReadableStream`}),`。Node.js 也提供 ReadableStream 兼容能力，但 React 官方仍建议 Node 使用专用的 pipeable API。两类 API 解决的是“HTML 如何边生成边发送”，不是 RSC 的同义词。`]})})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`常见 mismatch 来源`}),(0,h.jsxs)(`p`,{children:[`render 中直接读取 `,(0,h.jsx)(`code`,{children:`Date.now()`}),`、随机数、仅浏览器存在且首屏两端取值不同的数据，或服务端与客户端使用不同初始数据。正确做法是让用于 hydration 的首次输出可重现；若确实需要不同的客户端内容，再使用明确的 hydration 后更新策略。`]})]})]})}var vr=[{name:`ProductPage.server`,side:`server`,canState:!1,canDb:!0,shipped:!1},{name:`Price.server`,side:`server`,canState:!1,canDb:!0,shipped:!1},{name:`AddToCart.client`,side:`client`,canState:!0,canDb:!1,shipped:!0},{name:`CartCount.client`,side:`client`,canState:!0,canDb:!1,shipped:!0}];function yr(){let[e,t]=(0,d.useState)(vr[0]),[n,r]=(0,d.useState)(0),i=[`Server Component executes in the RSC server environment`,`RSC payload describes rendered server result + client references`,`Framework/SSR layer may use that result to produce initial HTML`,`Browser loads referenced Client Component JS and hydrates interactive UI`];return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🧱`}),` React Server Components：Server / Client Boundary`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`RSC`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`Server Components 会在客户端应用与传统 SSR renderer 之外的 RSC 环境中提前执行，其组件实现不会作为该 Server Component 的客户端模块发送。需要 state、Effect、事件处理或浏览器 API 的模块进入 Client Component graph。`,(0,h.jsx)(`code`,{children:`"use client"`}),` 定义客户端模块边界，而 `,(0,h.jsx)(`code`,{children:`"use server"`}),` 标记 Server Function，不是 Server Component。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🎮`}),` Module graph 边界实验`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsx)(`div`,{style:{display:`grid`,gap:8},children:vr.map(n=>(0,h.jsxs)(`button`,{type:`button`,className:`btn`,"aria-pressed":e.name===n.name,onClick:()=>t(n),children:[n.side===`server`?`🖥️`:`🌐`,` `,n.name]},n.name))}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`strong`,{children:e.name}),(0,h.jsxs)(`p`,{children:[`模块边界：`,e.side]}),(0,h.jsxs)(`p`,{children:[`可使用 useState / browser event：`,(0,h.jsx)(`strong`,{children:String(e.canState)})]}),(0,h.jsxs)(`p`,{children:[`可直接访问 server data layer：`,(0,h.jsx)(`strong`,{children:String(e.canDb)})]}),(0,h.jsxs)(`p`,{children:[`组件模块进入浏览器 JS graph：`,(0,h.jsx)(`strong`,{children:String(e.shipped)})]})]})]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`📦`}),` RSC payload 心智时间线`]})}),(0,h.jsx)(`div`,{style:{display:`grid`,gap:8},children:i.slice(0,n+1).map((e,t)=>(0,h.jsxs)(`div`,{style:{padding:10,border:`1px solid var(--border-color)`,borderRadius:8},children:[(0,h.jsxs)(`strong`,{children:[t+1,`.`]}),` `,e]},e))}),(0,h.jsx)(`button`,{className:`btn`,type:`button`,style:{marginTop:12},disabled:n===i.length-1,onClick:()=>r(e=>Math.min(i.length-1,e+1)),children:`下一阶段`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Server Component`}),(0,h.jsx)(`p`,{children:`适合在 RSC 环境读取服务端数据、减少发送到客户端的组件代码，并把非交互工作留在服务端。React 官方说明它们可以在 build time 或 request time 执行。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Client Component`}),(0,h.jsxs)(`p`,{children:[`承担 state、Effects、event handlers 与浏览器 API。`,(0,h.jsx)(`code`,{children:`"use client"`}),` 标记的是模块依赖图边界；在支持 RSC + SSR 的框架里，Client Component 的初始 UI 仍可能参与服务端预渲染，之后再由客户端 JS hydration，因此“Client Component”不等于“首屏只在浏览器生成 HTML”。`]})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:12},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`反模式：把 RSC 等同 SSR`}),(0,h.jsx)(`p`,{children:`SSR 讨论“React UI 如何在服务器输出 HTML，并由客户端 hydration”；RSC 讨论“哪些组件在哪个 RSC 环境执行、哪些模块进入客户端 graph，以及如何通过 RSC payload 组合结果”。框架可以把两层组合在一次页面请求里，但它们不是同一层能力。`})]})]})}var br=[{id:`react`,title:`React Core / React DOM`,items:[`Components / Hooks`,`hydrateRoot`,`renderToPipeableStream / renderToReadableStream`,`RSC / Server Function primitives`]},{id:`router`,title:`React Router Framework Mode`,items:[`routes`,`loaders / actions`,`CSR / SSR config`,`static pre-rendering`,`deployment adapters`]},{id:`next`,title:`Next.js App Router`,items:[`file-system routing`,`Server / Client Component graph`,`cache / revalidation`,`Server Function / Action integration`,`build / runtime conventions`]}];function xr(){let[e,t]=(0,d.useState)(`react`),[n,r]=(0,d.useState)(!1),i=br.find(t=>t.id===e);return(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`div`,{className:`demo-header-card`,children:[(0,h.jsxs)(`div`,{className:`demo-header-top`,children:[(0,h.jsxs)(`h2`,{className:`demo-title`,children:[(0,h.jsx)(`span`,{children:`🏗️`}),` Server Functions 与 Framework 职责边界`]}),(0,h.jsx)(`span`,{className:`badge badge-blue`,children:`Architecture Boundary`})]}),(0,h.jsxs)(`p`,{className:`demo-desc`,children:[`React 19 的 Server Function 允许 Client Component 调用在服务器执行的 async 函数；框架负责把这个用户模型落地成 module transform、server reference、请求协议、路由、缓存、部署和安全集成。当前 React 文档只在 Server Function 被传给 `,(0,h.jsx)(`code`,{children:`action`}),` prop 或从 Action 内调用时称其为 Server Action；不是所有 Server Function 都是 Server Action。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🔐`}),` Server Function 不是“可信客户端调用”`]})}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(`label`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,h.jsx)(`input`,{type:`checkbox`,checked:n,onChange:e=>r(e.target.checked)}),`模拟服务端已验证当前用户权限`]}),(0,h.jsx)(`button`,{type:`button`,className:`btn btn-primary`,style:{marginTop:12},onClick:()=>{},children:`调用 updateOrder() Server Function`})]}),(0,h.jsxs)(`div`,{className:`demo-alert ${n?`demo-alert-tip`:`demo-alert-warning`}`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Server-side decision`}),(0,h.jsx)(`p`,{children:n?`允许 mutation：服务端重新验证身份、授权和输入后执行。`:`拒绝 mutation：客户端参数、函数引用或 UI 状态都不能代替服务端授权。`})]})]}),(0,h.jsxs)(`p`,{className:`demo-section-desc`,style:{marginTop:12},children:[`React 官方要求把 Server Function 参数视为不可信输入，并在服务端验证 mutation 权限。`,(0,h.jsx)(`code`,{children:`"use server"`}),` 只能用于 async Server Function；它不是“这个组件在服务器渲染”的指令。直接从事件代码调用 Server Function 时应位于 Transition 中；当它传给 `,(0,h.jsx)(`code`,{children:`<form action>`}),` / `,(0,h.jsx)(`code`,{children:`formAction`}),` 时，React 会按 Action 语义调用。`]})]}),(0,h.jsxs)(`div`,{className:`demo-section`,children:[(0,h.jsx)(`div`,{className:`demo-section-header`,children:(0,h.jsxs)(`h3`,{className:`demo-section-title`,children:[(0,h.jsx)(`span`,{children:`🧭`}),` React 与 Framework 谁负责什么？`]})}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`,marginBottom:14},children:br.map(n=>(0,h.jsx)(`button`,{type:`button`,className:`btn`,"aria-pressed":e===n.id,onClick:()=>t(n.id),children:n.title},n.id))}),(0,h.jsxs)(`div`,{style:{padding:16,background:`var(--bg-surface-secondary)`,borderRadius:`var(--radius-md)`},children:[(0,h.jsx)(`h4`,{style:{marginTop:0},children:i.title}),(0,h.jsx)(`ul`,{children:i.items.map(e=>(0,h.jsx)(`li`,{children:e},e))})]})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`React Router Framework Mode`}),(0,h.jsx)(`p`,{children:`官方当前文档提供 CSR、SSR 和 static pre-rendering 三类 rendering strategy；Framework Mode 在路由/data APIs 之上增加构建、server rendering/pre-rendering 和部署约定。不要把这些框架能力写成 React Core API。`})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`Next.js App Router`}),(0,h.jsx)(`p`,{children:`把 React Server/Client Component 模型与文件路由、数据/缓存策略、Server Function/Action 集成和部署运行时组合成具体框架。学习时应区分“React primitive/user model”与“Next.js policy/API”。`})]})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{marginTop:12},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`真实项目边界`}),(0,h.jsx)(`p`,{children:`除非你正在写框架或自定义 bundler，否则不要自己拼 RSC protocol。React 官方明确说明：RSC / Server Function 的用户模型在 React 19 稳定，但实现这些能力的 bundler/framework 底层 API 在 React 19.x minor 之间不遵循 semver。`})]})]})}var Sr=`import { useState } from "react";

let impureSequence = 0;

function buildPureDescription(name, count) {
  return \`\${name} × \${count}\`;
}

function buildImpureDescription(name, count) {
  impureSequence += 1;
  return \`#\${impureSequence} \${name} × \${count}\`;
}

function ProductSummary({ name, count }) {
  const totalLabel = count > 1 ? \`\${count} 件商品\` : "1 件商品";

  return (
    <>
      <strong>{name}</strong>
      <span style={{ color: "var(--text-muted)" }}> · {totalLabel}</span>
    </>
  );
}

function ComponentTreeCard({ name, count }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        background: "var(--bg-surface-secondary)",
      }}
    >
      <div style={{ marginBottom: "10px", fontSize: "12px", color: "var(--text-subtle)" }}>
        App → ComponentJsxPureRenderDemo → ComponentTreeCard → ProductSummary
      </div>
      <ProductSummary name={name} count={count} />
    </div>
  );
}

export function ComponentJsxPureRenderDemo() {
  const [productName, setProductName] = useState("React 实战手册");
  const [count, setCount] = useState(2);
  const [runs, setRuns] = useState([]);

  const simulateRepeatedRender = () => {
    const pureFirst = buildPureDescription(productName, count);
    const pureSecond = buildPureDescription(productName, count);
    const impureFirst = buildImpureDescription(productName, count);
    const impureSecond = buildImpureDescription(productName, count);

    setRuns([
      { label: "纯计算 #1", value: pureFirst, stable: true },
      { label: "纯计算 #2", value: pureSecond, stable: true },
      { label: "非纯计算 #1", value: impureFirst, stable: false },
      { label: "非纯计算 #2", value: impureSecond, stable: false },
    ]);
  };

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧱</span> Component、JSX 与纯渲染模型
            </h2>
          </div>
          <span className="badge badge-green">React UI 基础</span>
        </div>

        <p className="demo-desc">
          React 组件本质上是描述 UI 的 JavaScript 函数。组件读取 Props、State、Context 等输入，
          返回 JSX 描述；React 假设渲染阶段保持纯净：<strong>相同输入应得到相同的 JSX 结果</strong>，
          并且不能在 render 中修改组件外部已经存在的数据。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Component = UI Building Block</span>
          <span className="badge badge-gray">JSX = UI Description</span>
          <span className="badge badge-gray">Same Input → Same Output</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🌳</span> 实验 1：组件树、JSX 表达式与 Fragment
          </h3>
          <p className="demo-section-desc">
            修改输入，观察 Props 如何沿组件树传递。<code>ProductSummary</code> 使用 Fragment 返回多个并列节点，
            JSX 中的 JavaScript 表达式负责派生显示文本。
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <input
              className="form-input"
              style={{ flex: "1 1 280px" }}
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              aria-label="商品名称"
            />
            <select
              className="form-input"
              style={{ width: "140px" }}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              aria-label="商品数量"
            >
              <option value={1}>1 件</option>
              <option value={2}>2 件</option>
              <option value={3}>3 件</option>
            </select>
          </div>

          <ComponentTreeCard name={productName || "未命名商品"} count={count} />
        </div>

        <div className="demo-alert demo-alert-info">
          <div className="demo-alert-title">组件树与模块树不是一回事</div>
          <div>
            组件树描述“这次 UI 中谁渲染了谁”；模块树描述 JavaScript 文件之间的 import 依赖。
            一个组件可以被多个组件复用，因此运行时组件树和源码模块结构通常不会一一对应。
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验 2：为什么 Render 必须保持纯净
          </h3>
          <p className="demo-section-desc">
            点击按钮模拟 React 可能发生的重复 render。这里不会真的在组件 render 中制造副作用，而是安全地调用两类计算函数，观察相同输入连续执行两次的差异。
          </p>
        </div>

        <button className="btn btn-primary" onClick={simulateRepeatedRender}>
          模拟相同输入重复 Render 两次
        </button>

        {runs.length > 0 && (
          <div className="demo-grid-2" style={{ marginTop: "16px" }}>
            {runs.map((run) => (
              <div
                key={run.label}
                style={{
                  padding: "14px 16px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-secondary)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <strong>{run.label}</strong>
                  <span className={\`badge \${run.stable ? "badge-green" : "badge-red"}\`}>
                    {run.stable ? "结果稳定" : "结果漂移"}
                  </span>
                </div>
                <code style={{ display: "block", marginTop: "10px" }}>{run.value}</code>
              </div>
            ))}
          </div>
        )}

        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">为什么 React 强调 Purity？</div>
          <div>
            React 在开发环境的 StrictMode 中会额外调用组件函数来帮助发现非纯逻辑；并发渲染也可能暂停、丢弃或重新开始一次 render。
            因此 render 只能计算 JSX。网络请求、写日志服务、修改 DOM、写外部变量等副作用应放在事件处理器，确实由“组件正在显示”驱动的外部同步再考虑 Effect。
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🏗️</span> 真实项目中的组件边界
          </h3>
        </div>

        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-success" style={{ margin: 0 }}>
            <div className="demo-alert-title">✅ 适合拆成组件</div>
            <div>可复用的 UI 单元、职责明确的业务区块、需要独立维护或测试的交互边界。</div>
          </div>
          <div className="demo-alert demo-alert-danger" style={{ margin: 0 }}>
            <div className="demo-alert-title">⚠️ 避免机械拆分</div>
            <div>不要因为“每个 div 都应该是组件”而制造大量只有一行 JSX、没有独立语义的包装组件。</div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>📌</span> 本章心智模型
        </div>
        <div>
          <strong>Component = 输入 → JSX 描述。</strong> JSX 不是 HTML 字符串，而是 JavaScript 中的 UI 描述语法；
          渲染阶段只做计算，副作用离开 render。只要先守住这条边界，后面的 State、Effect、并发渲染和性能优化都会更容易理解。
        </div>
      </div>
    </div>
  );
}

export default ComponentJsxPureRenderDemo;
`,Cr=`import { useState } from "react";
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
`,wr=`/**
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
`,Tr=`/**
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
`,Er=`import { useState } from "react";
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
`,Dr=`/**
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
`,Or=`import { useEffect } from "react";

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
`,kr=`import { useState } from "react";
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
`,Ar=`/**
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
`,jr=`/**
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
`,Mr=`import { useState } from "react";

const STATES = ["loading", "empty", "error", "success"];

function ResultPanel({ status }) {
  if (status === "loading") {
    return (
      <div className="demo-alert demo-alert-info">
        <div className="demo-alert-title">⏳ Loading</div>
        <div>正在加载订单列表。这里使用 early return，让每个业务分支保持独立。</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="demo-alert demo-alert-danger">
        <div className="demo-alert-title">⚠️ Error</div>
        <div>请求失败，请稍后重试。错误态不需要和成功态挤在同一层嵌套三元表达式里。</div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">📭 Empty</div>
        <div>当前没有订单。空态是一个独立业务状态，不应该伪装成“成功但数组长度为 0”的隐式分支。</div>
      </div>
    );
  }

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">✅ Success</div>
      <div>已加载 3 条订单，页面进入正常内容态。</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isHealthy = status === "success";

  return (
    <span className={isHealthy ? "badge badge-green" : "badge badge-gray"}>
      {isHealthy ? "数据可用" : "等待稳定结果"}
    </span>
  );
}

export function ConditionalRenderingDemo() {
  const [status, setStatus] = useState("loading");
  const [showDebug, setShowDebug] = useState(true);

  const isTerminal = status === "error" || status === "success" || status === "empty";

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🚦</span> 条件渲染：让业务状态直接映射 UI
            </h2>
          </div>
          <span className="badge badge-blue">UI 分支</span>
        </div>
        <p className="demo-desc">
          React 不提供专门的模板条件语法，而是直接使用 JavaScript 的 <code>if</code>、三元表达式和
          <code>&amp;&amp;</code> 来决定返回哪些 JSX。关键不是记语法，而是让业务状态与 UI 分支保持清晰的一一对应。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">if / early return</span>
          <span className="badge badge-gray">ternary</span>
          <span className="badge badge-gray">&& / null</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧪 实验：四态请求 UI</h3>
          <p className="demo-section-desc">
            切换同一份业务状态，观察组件如何选择完全不同的 JSX 分支。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {STATES.map((item) => (
            <button
              key={item}
              className={status === item ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <ResultPanel status={status} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
          <strong style={{ fontSize: "13px" }}>ternary：</strong>
          <StatusBadge status={status} />
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {isTerminal ? "当前状态已经有明确结果" : "当前仍处于进行中状态"}
          </span>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", fontSize: "13px" }}>
          <input type="checkbox" checked={showDebug} onChange={(event) => setShowDebug(event.target.checked)} />
          展示调试信息
        </label>

        {showDebug && (
          <div className="demo-alert demo-alert-info" style={{ marginBottom: 0 }}>
            <div>
              <code>&amp;&amp;</code> 适合表达“条件满足时额外渲染一小段内容”；关闭开关后，这一段 JSX 不会进入返回树。
            </div>
          </div>
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧭 选择哪种写法</h3>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          <div className="demo-alert demo-alert-success">
            <div className="demo-alert-title">✅ 推荐</div>
            <div>
              大块互斥业务状态优先使用 <strong>early return / 清晰的 if 分支</strong>；小型二选一内容使用三元表达式；只在“有或没有”时使用 <code>&amp;&amp;</code>。
            </div>
          </div>
          <div className="demo-alert demo-alert-danger">
            <div className="demo-alert-title">⚠️ 常见反模式</div>
            <div>
              把 loading、error、empty、success 塞进多层嵌套三元表达式，会让 JSX 很快失去可读性。复杂分支应提前计算、early return，或拆成职责明确的子组件。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">📌 项目边界</div>
        <div>
          条件渲染只负责“当前状态应该显示什么”。不要为了切换 UI 再复制一份状态；例如 <code>isEmpty</code> 能从 <code>items.length</code> 推导时，应直接计算而不是额外保存 State。
        </div>
      </div>
    </div>
  );
}

export default ConditionalRenderingDemo;
`,Nr=`import { useState } from "react";

const INITIAL_TASKS = [
  { id: "task-a", title: "修复登录页", owner: "Alice" },
  { id: "task-b", title: "补充单元测试", owner: "Bob" },
  { id: "task-c", title: "发布生产版本", owner: "Carol" },
];

function EditableRow({ task }) {
  const [note, setNote] = useState("");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(150px, 1fr) minmax(180px, 1fr)",
        gap: "10px",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "13.5px" }}>{task.title}</div>
        <div style={{ color: "var(--text-subtle)", fontSize: "12px" }}>
          {task.owner} · id: {task.id}
        </div>
      </div>
      <input
        className="form-input"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="给这一行输入临时备注"
      />
    </div>
  );
}

function TaskList({ tasks, useIndexKey }) {
  return (
    <div>
      {tasks.map((task, index) => (
        <EditableRow key={useIndexKey ? index : task.id} task={task} />
      ))}
    </div>
  );
}

export function RenderingListsKeyDemo() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [useIndexKey, setUseIndexKey] = useState(true);

  const reverseTasks = () => setTasks((current) => [...current].reverse());
  const removeFirst = () => setTasks((current) => current.slice(1));
  const resetTasks = () => setTasks(INITIAL_TASKS);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧾</span> Rendering Lists 与 key：身份比位置更重要
            </h2>
          </div>
          <span className="badge badge-purple">Identity</span>
        </div>
        <p className="demo-desc">
          <code>map()</code> 只是把数据映射成 JSX。真正决定 React 如何在后续 render 中匹配列表项的是 <code>key</code>。
          当项目支持排序、插入或删除时，稳定业务 ID 才能让组件 State 跟着“数据身份”移动，而不是跟着数组位置移动。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧪 实验：先输入备注，再反转列表</h3>
          <p className="demo-section-desc">
            每行的备注是 <code>EditableRow</code> 自己的 State。先给第一行输入一段文字，再点击“反转顺序”，观察备注最终跟着谁。
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          <button
            className={useIndexKey ? "btn btn-danger btn-sm" : "btn btn-secondary btn-sm"}
            onClick={() => setUseIndexKey(true)}
          >
            使用 index key
          </button>
          <button
            className={!useIndexKey ? "btn btn-success btn-sm" : "btn btn-secondary btn-sm"}
            onClick={() => setUseIndexKey(false)}
          >
            使用 stable id
          </button>
          <button className="btn btn-primary btn-sm" onClick={reverseTasks}>
            反转顺序
          </button>
          <button className="btn btn-outline btn-sm" onClick={removeFirst} disabled={tasks.length === 0}>
            删除第一项
          </button>
          <button className="btn btn-outline btn-sm" onClick={resetTasks}>
            恢复数据
          </button>
        </div>

        <div className={useIndexKey ? "demo-alert demo-alert-danger" : "demo-alert demo-alert-success"}>
          <div className="demo-alert-title">
            {useIndexKey ? "⚠️ 当前 key = index" : "✅ 当前 key = task.id"}
          </div>
          <div>
            {useIndexKey
              ? "数组位置变化后，React 仍按 0/1/2 匹配组件，行内 State 可能留在原位置，于是备注看起来“跟错任务”。"
              : "稳定 ID 不随排序改变，React 可以把已有组件与同一个业务实体重新匹配，行内 State 会跟着任务身份移动。"}
          </div>
        </div>

        {tasks.length > 0 ? (
          <TaskList tasks={tasks} useIndexKey={useIndexKey} />
        ) : (
          <div className="demo-alert demo-alert-tip">列表为空。点击“恢复数据”重新开始实验。</div>
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧠 key 规则</h3>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          <div className="demo-alert demo-alert-success">
            <div className="demo-alert-title">✅ Stable key</div>
            <div>
              key 只需要在<strong>当前兄弟列表</strong>中唯一，并且在同一业务实体的生命周期内保持稳定。后端 ID、数据库主键、本地创建时生成的稳定 UUID 都更合适。
            </div>
          </div>
          <div className="demo-alert demo-alert-danger">
            <div className="demo-alert-title">⚠️ 不要在 render 时生成 key</div>
            <div>
              <code>Math.random()</code> 或每次 render 重新生成 UUID 会让 key 每次都变化，React 会把节点当成全新组件，导致 DOM/State 被重建。index 只适合永不重排、插入、删除的静态列表。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">📌 项目判断</div>
        <div>
          如果列表项包含输入框、展开状态、动画状态、局部请求状态，或者列表会发生 reorder / insert / delete，key 的身份模型会直接影响正确性，而不仅仅是消除 console warning。
        </div>
      </div>
    </div>
  );
}

export default RenderingListsKeyDemo;
`,Pr=`import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

// ==========================================
// 路径 1：显式 Props 数据流
// Props 本身不是反模式；问题出现在大量中间组件只负责机械透传时。
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
      <span style={{ fontSize: "13px" }}>
        {user.name} ({user.role})
      </span>
    </div>
  );
}

function DrillingHeader({ user }) {
  return (
    <div
      style={{
        padding: "8px 12px",
        background: "#f1f5f9",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "12px", color: "#64748b" }}>
        Header（只负责继续传递 user）
      </span>
      <DrillingAvatar user={user} />
    </div>
  );
}

function DrillingNavbar({ user }) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #cbd5e1",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
          marginBottom: "6px",
        }}
      >
        Navbar（只负责继续传递 user）
      </div>
      <DrillingHeader user={user} />
    </div>
  );
}

// ==========================================
// 路径 2：组件组合
// 当中间层本质是布局容器时，把已经组装好的 JSX 作为 slot/children 传入。
// ==========================================
function CompositionNavbar({ rightSlot }) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #86efac",
        borderRadius: "8px",
        background: "#f0fdf4",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#166534",
          marginBottom: "6px",
        }}
      >
        Navbar（只定义布局插槽，不需要知道 user）
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "600" }}>应用 Logo</span>
        {rightSlot}
      </div>
    </div>
  );
}

// ==========================================
// 路径 3：Context
// 适合树中相距较远、多个位置都需要消费同一份信息的场景。
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
      <span style={{ fontSize: "13px" }}>
        {user.name} ({user.role})
      </span>
    </div>
  );
}

function ContextHeader() {
  return (
    <div
      style={{
        padding: "8px 12px",
        background: "#eff6ff",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "12px", color: "#1e40af" }}>
        Header（不消费 user）
      </span>
      <ContextAvatar />
    </div>
  );
}

function ContextNavbar() {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #93c5fd",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#1e40af",
          marginBottom: "6px",
        }}
      >
        Navbar（不消费 user）
      </div>
      <ContextHeader />
    </div>
  );
}

export function PropDrillingDemo() {
  const [user, setUser] = useState({ name: "Alex Chen", role: "技术总监" });

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🪜</span> Prop Drilling：不是看到多层 Props 就要消灭
            </h2>
          </div>
          <span className="badge badge-amber">数据边界</span>
        </div>
        <p className="demo-desc">
          Props 是 React 最直接、最显式的数据流。只有当数据需要穿过许多“不消费它”的中间组件，导致接口噪声和重构成本明显上升时，才值得把它识别为需要处理的 prop drilling。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-amber">默认：显式 Props</span>
          <span className="badge badge-green">布局解耦：Composition</span>
          <span className="badge badge-blue">远距离共享：Context</span>
        </div>
      </div>

      <div className="demo-section" style={{ padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>
              修改数据所有者中的 user：
            </span>
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.name}
              onChange={(event) =>
                setUser((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="用户姓名"
            />
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.role}
              onChange={(event) =>
                setUser((current) => ({ ...current, role: event.target.value }))
              }
              placeholder="用户角色"
            />
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setUser({ name: "Sarah Lee", role: "UI 设计总监" })}
          >
            切换为 Sarah
          </button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> 同一份数据的三种传递路径
          </h3>
          <p className="demo-section-desc">
            三种路径都能工作。真正要比较的是数据所有权、组件职责、消费范围和接口成本，而不是寻找一个永远正确的 API。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>1️⃣</span> 显式 Props：链路很深时才出现 drilling 成本
            </div>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              <code>Page → Navbar → Header → Avatar</code>。这种写法的数据来源最清楚；当 Navbar、Header 长期只是机械透传，而且链路继续增长时，接口噪声才开始成为真实问题。
            </p>
            <DrillingNavbar user={user} />
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>2️⃣</span> Composition：中间层本质是布局容器时很合适
            </div>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              顶层直接创建 <code>&lt;DrillingAvatar user=&#123;user&#125; /&gt;</code>，Navbar 只接收已经组装好的 JSX。这样缩短了数据 props 的传递链，但代价是父组件承担更多布局组合职责。
            </p>
            <CompositionNavbar rightSlot={<DrillingAvatar user={user} />} />
          </div>

          <div
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              backgroundColor: "#f8fafc",
            }}
          >
            <div
              style={{
                fontSize: "13.5px",
                fontWeight: "700",
                color: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "10px",
              }}
            >
              <span>3️⃣</span> Context：多个远距离消费者需要同一信息
            </div>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              Provider 让后代消费者直接读取当前值，中间组件不用声明对应 prop。它降低了重复透传，但也让依赖从组件调用处变得不那么显式，因此不应仅因为“传了两三层”就引入 Context。
            </p>
            <UserContext.Provider value={user}>
              <ContextNavbar />
            </UserContext.Provider>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧠</span> 判断顺序：先问数据归谁，再问怎么传
          </h3>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          <div className="demo-alert demo-alert-tip">
            <strong>Props：</strong>消费关系局部、链路可读时继续使用。显式依赖通常更容易追踪和复用。
          </div>
          <div className="demo-alert demo-alert-tip">
            <strong>Composition：</strong>如果中间组件只是 Layout / Shell，把 JSX 作为 <code>children</code> 或 slot 传入，通常可以减少无意义的数据 props。
          </div>
          <div className="demo-alert demo-alert-tip">
            <strong>Context：</strong>当同一信息由树中多个、相距较远的组件消费，例如主题、当前账号、路由上下文或模块级共享状态，再考虑 Context。
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title">
          <span>⚠️</span> 真实项目边界
        </div>
        <div>
          不要按“层数”机械选方案。两三层 props 可能完全合理；十层透传也可能通过重新划分组件边界解决。先检查 State ownership、组件是否承担了过多职责、真正消费者有多少，再决定是否引入 Composition 或 Context。
        </div>
      </div>
    </div>
  );
}

export default PropDrillingDemo;
`,Fr=`import { useState } from "react";

export function EventPropagationDemo() {
  const [log, setLog] = useState([]);
  const [stopBubble, setStopBubble] = useState(false);

  function push(message) {
    setLog((items) => [message, ...items].slice(0, 8));
  }

  function handleSubmit(event) {
    event.preventDefault();
    push("submit: preventDefault() 阻止浏览器刷新，但不会阻止事件传播");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🖱️</span> Event Handler：事件属于交互，不属于 Effect</h2>
          <span className="badge badge-blue">02-01</span>
        </div>
        <p className="demo-desc">把函数传给 JSX，React 在交互发生时调用它。事件默认向上冒泡；capture 在目标处理前从外向内执行。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">pass function</span><span className="badge badge-gray">capture / bubble</span><span className="badge badge-gray">stopPropagation</span><span className="badge badge-gray">preventDefault</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 传播顺序实验</h3><p className="demo-section-desc">点击内部按钮，观察 capture → target → bubble；再开启 stopPropagation 比较差异。</p></div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><input type="checkbox" checked={stopBubble} onChange={(e) => setStopBubble(e.target.checked)} />按钮调用 stopPropagation()</label>
        <div onClickCapture={() => push("1. parent capture")} onClick={() => push("3. parent bubble")} style={{ padding: 20, border: "1px solid var(--border-color)", borderRadius: 10 }}>
          <button className="btn btn-primary" type="button" onClick={(event) => { push("2. button target"); if (stopBubble) event.stopPropagation(); }}>点击内部按钮</button>
        </div>
        <div style={{ marginTop: 12, display: "grid", gap: 6 }}>{log.length ? log.map((item, index) => <code key={\`\${item}-\${index}\`}>{item}</code>) : <span className="demo-section-desc">暂无事件</span>}</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🧪 preventDefault ≠ stopPropagation</h3></div>
        <form onSubmit={handleSubmit}><button className="btn" type="submit">提交表单</button></form>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>正确做法：</strong>购买、提交、播放等“用户做了某件事”直接写在 Event Handler；不要先 set 一个 flag，再用 Effect 间接响应点击。</div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>常见错误：</strong><code>{"onClick={handleClick()}"}</code> 会在 render 时调用函数；应传 <code>{"onClick={handleClick}"}</code>。</div>
      </div>
    </div>
  );
}

export default EventPropagationDemo;
`,Ir=`import { useState } from "react";

export function StateSnapshotQueueDemo() {
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState([]);

  function log(message) {
    setNotes((items) => [message, ...items].slice(0, 10));
  }

  function replaceThreeTimes() {
    log(\`handler snapshot = \${count}\`);
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    log(\`调用 3 次 setCount(count + 1) 后，当前 handler 仍读到 \${count}\`);
  }

  function updateThreeTimes() {
    log(\`handler snapshot = \${count}\`);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    log("三个 updater 依次进入队列：n→n+1→n+1→n+1");
  }

  function delayedRead() {
    const snapshot = count;
    setCount((c) => c + 1);
    setTimeout(() => log(\`timer 来自旧 render：捕获 snapshot=\${snapshot}；timer 执行时不会自动改成最新值\`), 700);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📸</span> State Snapshot + Update Queue</h2><span className="badge badge-blue">02-02 ~ 02-04</span></div>
        <p className="demo-desc">State 不是普通局部变量。每次 render 得到一个固定快照；setter 请求下一次 render，同一事件中的更新会排队并批处理。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">useState</span><span className="badge badge-gray">snapshot</span><span className="badge badge-gray">batching</span><span className="badge badge-gray">functional updater</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: 10 }}>
            <div>当前这次 render 的 count snapshot</div>
            <strong style={{ fontSize: 34 }}>{count}</strong>
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>事件处理器会闭包捕获创建它的那次 render 的值。</div>
          </div>
          <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <button className="btn" type="button" onClick={() => setCount(count + 1)}>+1：替换为 snapshot + 1</button>
            <button className="btn" type="button" onClick={replaceThreeTimes}>连续 3 次 count + 1</button>
            <button className="btn btn-primary" type="button" onClick={updateThreeTimes}>连续 3 次 updater</button>
            <button className="btn" type="button" onClick={delayedRead}>+1 并在 timer 中读取旧快照</button>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🔬 可观察结果</h3></div>
        <div style={{ display: "grid", gap: 6 }}>{notes.map((item, index) => <code key={\`\${item}-\${index}\`}>{item}</code>)}</div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>队列模型：</strong><code>setCount(count + 1)</code> 在同一 render 中都基于同一个 snapshot；<code>setCount(c =&gt; c + 1)</code> 把 updater 加入队列，React 在处理队列时把前一个 updater 的结果交给后一个。</div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>边界：</strong>functional updater 解决“基于前值更新”的队列问题，不是读取任意最新 state 的逃生舱；异步流程仍应明确其数据时序。</div>
      </div>
    </div>
  );
}

export default StateSnapshotQueueDemo;
`,Lr=`import { useState } from "react";

const initialProfile = {
  name: "Ada",
  address: { city: "London", country: "UK" },
};

const initialTasks = [
  { id: 1, title: "理解 Snapshot", done: true },
  { id: 2, title: "掌握不可变更新", done: false },
];

export function ImmutableStateDemo() {
  const [profile, setProfile] = useState(initialProfile);
  const [tasks, setTasks] = useState(initialTasks);
  const [previousProfile, setPreviousProfile] = useState(initialProfile);

  function changeCity() {
    setPreviousProfile(profile);
    setProfile((current) => ({
      ...current,
      address: { ...current.address, city: current.address.city === "London" ? "Tokyo" : "London" },
    }));
  }

  function toggleTask(id) {
    setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function addTask() {
    setTasks((items) => [...items, { id: Date.now(), title: \`新任务 \${items.length + 1}\`, done: false }]);
  }

  function removeDone() {
    setTasks((items) => items.filter((task) => !task.done));
  }

  function reverse() {
    setTasks((items) => [...items].reverse());
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🧊</span> Object / Array State：把快照当只读值</h2><span className="badge badge-blue">02-05</span></div>
        <p className="demo-desc">对象和数组在 JavaScript 中可变，但放进 React State 后应按只读快照处理：修改时创建新引用，并复制所有被修改路径。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">spread</span><span className="badge badge-gray">map / filter</span><span className="badge badge-gray">nested copy</span><span className="badge badge-gray">reference identity</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div>
            <h3 className="demo-section-title">嵌套对象</h3>
            <p>{profile.name} · {profile.address.city}, {profile.address.country}</p>
            <button className="btn" type="button" onClick={changeCity}>切换城市</button>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>上一个对象 === 当前对象：<strong>{String(previousProfile === profile)}</strong><br />未修改字段复用，修改路径创建新对象。</div>
          </div>
          <div>
            <h3 className="demo-section-title">数组操作</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}><button className="btn" onClick={addTask}>append</button><button className="btn" onClick={removeDone}>remove done</button><button className="btn" onClick={reverse}>copy + reverse</button></div>
            {tasks.map((task) => <label key={task.id} style={{ display: "flex", gap: 8, padding: "6px 0" }}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />{task.title}</label>)}
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning"><strong>反模式：</strong><code>profile.address.city = "Tokyo"</code> 或 <code>tasks.reverse(); setTasks(tasks)</code> 会修改旧快照并保留同一引用，破坏调试、memoization 与未来并发特性的假设。</div>
      <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}><strong>真实项目：</strong>嵌套过深时先考虑扁平化 State；只有更新表达式确实繁琐时再评估 Immer，而不是用库掩盖糟糕的数据结构。</div>
    </div>
  );
}

export default ImmutableStateDemo;
`,Rr=`import { useRef, useState } from "react";

export function RenderCommitDemo() {
  const [count, setCount] = useState(0);
  const [themeTick, setThemeTick] = useState(0);
  const [observation, setObservation] = useState("尚未触发更新");
  const countNodeRef = useRef(null);

  const text = \`Count: \${count}\`;

  function observeAfterCommit(label) {
    requestAnimationFrame(() => {
      const domText = countNodeRef.current?.textContent ?? "(DOM unavailable)";
      setObservation(\`\${label} → 浏览器在 React commit 后读到：\${domText}\`);
    });
  }

  function updateCount() {
    setCount((c) => c + 1);
    observeAfterCommit("count state 更新");
  }

  function updateUnrelatedState() {
    setThemeTick((t) => t + 1);
    observeAfterCommit("无关 state 更新");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🏗️</span> Trigger → Render → Commit</h2><span className="badge badge-blue">02-06</span></div>
        <p className="demo-desc">更新先触发 React 调用组件计算下一份 UI（Render），再把必要变化提交到宿主环境（浏览器里通常是 DOM Commit）。组件发生 render，不代表某个 DOM 节点一定会改变。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">Trigger</span><span className="badge badge-gray">Render</span><span className="badge badge-gray">Commit</span><span className="badge badge-gray">Paint</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <button className="btn btn-primary" type="button" onClick={updateCount}>更新 count（Count DOM 文本会变）</button>
            <button className="btn" type="button" onClick={updateUnrelatedState}>只更新无关 state（Count DOM 文本不变）</button>
          </div>
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: 10 }}>
            <strong ref={countNodeRef} style={{ fontSize: 28 }}>{text}</strong>
            <div style={{ marginTop: 12 }}>themeTick：{themeTick}</div>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>{observation}</div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🧠 四阶段心智模型</h3></div>
        <p><strong>1 Trigger：</strong>初次挂载，或 state 更新等原因让 React 安排一次 render。</p>
        <p><strong>2 Render：</strong>React 调用组件，纯计算下一份 JSX/UI 描述；这个阶段可能被重复、暂停或放弃，因此不应执行副作用。</p>
        <p><strong>3 Commit：</strong>React 把计算结果中真正需要的变化应用到宿主环境。即使组件重新 render，某个 DOM 节点也可能完全不变。</p>
        <p><strong>4 Browser Paint：</strong>浏览器在 DOM 更新后进行布局与绘制；它不是 React 的 render phase，而且浏览器何时实际绘制由浏览器调度决定。</p>
      </div>

      <div className="demo-alert demo-alert-warning"><strong>反模式：</strong>为了“统计 render 次数”而在组件函数执行期间修改 ref 或外部计数器，本身就会破坏纯 render 约束。调试 render 行为优先使用 React DevTools Profiler；业务副作用放事件处理器，外部系统同步放 Effect。</div>
    </div>
  );
}

export default RenderCommitDemo;
`,zr=`import { useState } from "react";

const INITIAL_CART_ITEMS = [
  { id: 1, name: "红富士苹果", price: 8.5, count: 2 },
  { id: 2, name: "进口香蕉", price: 12, count: 1 },
  { id: 3, name: "高钙牛奶", price: 45, count: 1 },
];

const INITIAL_PLACES = {
  0: { id: 0, title: "项目", childIds: [1, 2] },
  1: { id: 1, title: "前端", childIds: [3, 4] },
  2: { id: 2, title: "后端", childIds: [] },
  3: { id: 3, title: "React 学习站", childIds: [] },
  4: { id: 4, title: "文件预览器", childIds: [] },
};

function PlaceTree({ id, places }) {
  const place = places[id];
  if (!place) return null;

  return (
    <li>
      {place.title}
      {place.childIds.length > 0 && (
        <ul>
          {place.childIds.map((childId) => (
            <PlaceTree key={childId} id={childId} places={places} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function StateDryDemo() {
  const [firstName, setFirstName] = useState("张");
  const [lastName, setLastName] = useState("三丰");
  const fullName = \`\${firstName} \${lastName}\`.trim();

  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [selectedId, setSelectedId] = useState(1);

  const totalCount = cartItems.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
  const selectedItem = cartItems.find((item) => item.id === selectedId) ?? null;

  const [status, setStatus] = useState("typing");
  const [places, setPlaces] = useState(INITIAL_PLACES);

  function updateCount(id, delta) {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, count: Math.max(0, item.count + delta) }
            : item,
        )
        .filter((item) => item.count > 0),
    );
  }

  function removePlace(parentId, childId) {
    setPlaces((current) => {
      const parent = current[parentId];
      if (!parent) return current;

      return {
        ...current,
        [parentId]: {
          ...parent,
          childIds: parent.childIds.filter((id) => id !== childId),
        },
      };
    });
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧪</span> State 结构设计：让不可能状态无法出现
            </h2>
          </div>
          <span className="badge badge-green">State Modeling</span>
        </div>
        <p className="demo-desc">
          State 的关键不是“能不能存”，而是<strong>应该存什么</strong>。良好的结构应减少同步负担：相关数据一起变化时可合并、互斥状态避免用多个 boolean、可计算值不重复存、同一实体不复制两份，并尽量避免难以更新的深层嵌套。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Single Source of Truth</span>
          <span className="badge badge-gray">Avoid Contradictions</span>
          <span className="badge badge-gray">Avoid Duplication</span>
          <span className="badge badge-gray">Normalize Deep State</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 冗余 State：能计算，就不要再存一份</h3>
          <p className="demo-section-desc">
            <code>fullName</code> 完全由两个输入决定，因此直接在 render 中计算；不需要第三个 state，也不需要 Effect 去同步。
          </p>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">❌ 冗余状态 + Effect 同步</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12, overflowX: "auto" }}>{\`const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(first + ' ' + last);
}, [first, last]);\`}</pre>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 渲染期派生</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12, overflowX: "auto" }}>{\`const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const fullName = \\\`\${"\${first} \${last}"}\\\`.trim();\`}</pre>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap", marginTop: 16 }}>
          <label style={{ fontSize: 12, color: "var(--text-muted)" }}>
            姓氏
            <input className="form-input" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </label>
          <label style={{ fontSize: 12, color: "var(--text-muted)" }}>
            名字
            <input className="form-input" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </label>
          <strong style={{ paddingBottom: 8, color: "var(--color-primary)" }}>{fullName || "（空）"}</strong>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 矛盾 State：用一个 status 表示互斥状态</h3>
          <p className="demo-section-desc">
            <code>isSending</code> + <code>isSent</code> 可能同时为 true，形成业务上不可能的组合。一个有限状态值更容易推理，也更容易扩展 error / retry。
          </p>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">❌ 两个 boolean 可产生 4 种组合</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12 }}>{\`isSending = true
isSent = true // “正在发送”又“已发送”\`}</pre>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 一个 status 只允许合法状态</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12 }}>{\`status = 'typing'
status = 'sending'
status = 'sent'\`}</pre>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {["typing", "sending", "sent"].map((nextStatus) => (
            <button
              key={nextStatus}
              className={\`btn \${status === nextStatus ? "btn-primary" : "btn-secondary"} btn-sm\`}
              onClick={() => setStatus(nextStatus)}
            >
              {nextStatus}
            </button>
          ))}
          <span className="badge badge-blue">当前唯一事实：status = {status}</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 重复 State：保存 ID，而不是复制整条实体</h3>
          <p className="demo-section-desc">
            商品实体只存在 <code>cartItems</code> 中；选中状态只保存 <code>selectedId</code>。这样商品数量更新后，选中详情自然读取到最新对象，不需要额外同步 selectedItem 副本。
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                padding: "10px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: selectedId === item.id ? "var(--color-primary-light)" : "var(--bg-surface)",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="radio"
                  name="selected-product"
                  checked={selectedId === item.id}
                  onChange={() => setSelectedId(item.id)}
                />
                <span>{item.name}</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, -1)}>-1</button>
                <strong>{item.count}</strong>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, 1)}>+1</button>
              </div>
            </div>
          ))}
        </div>

        <div className="demo-alert demo-alert-info">
          <div className="demo-alert-title">当前派生结果</div>
          <div>总件数：{totalCount}；总金额：¥{totalPrice.toFixed(2)}</div>
          <div>
            选中项：{selectedItem ? \`\${selectedItem.name} × \${selectedItem.count}\` : "无（原商品可能已删除）"}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">4. 深层嵌套：复杂树状数据优先考虑扁平化</h3>
          <p className="demo-section-desc">
            当更新一个叶子节点需要一路复制祖先对象时，更新代码容易变长。这里把实体放进 ID → entity 的映射，父节点只保存 childIds；删除关系只需要更新直接父节点。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>当前树</strong>
            <ul style={{ marginBottom: 0 }}>
              <PlaceTree id={0} places={places} />
            </ul>
          </div>
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>关系操作</strong>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              删除“前端 → React 学习站”的关系，只更新 parent.childIds，不需要深拷贝整棵树。
            </p>
            <button className="btn btn-danger btn-sm" onClick={() => removePlace(1, 3)}>
              移除 React 学习站
            </button>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={() => setPlaces(INITIAL_PLACES)}>
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">State 结构检查清单</div>
        <div>① 总是一起更新的数据，考虑组合；② 不要允许互相矛盾的 boolean；③ 可派生的数据不要存；④ 同一实体避免复制；⑤ 深层结构难更新时考虑 normalization。</div>
        <div>
          项目边界：这里不是要求“所有 state 都扁平化”。如果嵌套结构很浅且天然一起更新，保持对象结构反而更直观；重构目标是降低出错概率，而不是追求某种固定形状。
        </div>
      </div>
    </div>
  );
}

export default StateDryDemo;
`,Br=`import { useState } from "react";

const TABS = [
  { id: "overview", label: "概览" },
  { id: "activity", label: "动态" },
  { id: "settings", label: "设置" },
];

function Tabs({ value, defaultValue = "overview", onChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  function selectTab(nextValue) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={\`btn \${activeValue === tab.id ? "btn-primary" : "btn-secondary"} btn-sm\`}
            onClick={() => selectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          padding: 12,
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-surface-secondary)",
        }}
      >
        当前 Tab：<strong>{activeValue}</strong>
      </div>
    </div>
  );
}

export function ControlledUncontrolledDemo() {
  const [controlledValue, setControlledValue] = useState("overview");
  const [parentLog, setParentLog] = useState([]);

  function handleControlledChange(nextValue) {
    setControlledValue(nextValue);
    setParentLog((logs) => [
      \`父组件收到 onChange(\${nextValue})，决定更新 value\`,
      ...logs,
    ].slice(0, 5));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🎛️</span> Controlled / Uncontrolled：谁拥有这份 State？
            </h2>
          </div>
          <span className="badge badge-blue">State Ownership</span>
        </div>
        <p className="demo-desc">
          “受控/非受控”不只属于表单输入，它描述的是<strong>组件状态由谁拥有</strong>。受控组件把当前值交给父组件管理；非受控组件自己持有 State，并允许父组件通过 defaultValue 提供初始值。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">value + onChange</span>
          <span className="badge badge-gray">defaultValue</span>
          <span className="badge badge-gray">Single Source of Truth</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 受控模式：父组件持有唯一事实来源</h3>
          <p className="demo-section-desc">
            Tabs 不直接决定最终 active tab，而是发出 onChange。父组件收到事件后更新 value，再通过 props 把新值传回 Tabs。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <Tabs value={controlledValue} onChange={handleControlledChange} />
            <div className="demo-alert demo-alert-info">
              <div className="demo-alert-title">父组件 State</div>
              <div>controlledValue = {controlledValue}</div>
            </div>
          </div>
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>数据流</strong>
            <pre style={{ fontSize: 12, lineHeight: 1.6, overflowX: "auto" }}>{\`Parent state
   ↓ value
<Tabs />
   ↓ onChange(next)
Parent setter
   ↓
next render
   ↓ value
<Tabs />\`}</pre>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {parentLog.length === 0 ? "点击任意 Tab 观察父组件事件日志。" : parentLog.map((log, index) => <div key={\`\${log}-\${index}\`}>• {log}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 非受控模式：组件内部持有 State</h3>
          <p className="demo-section-desc">
            父组件只给一次初始值 <code>defaultValue="activity"</code>。之后切换由 Tabs 自己的 internalValue 管理。父组件仍可监听 onChange，但不控制当前值。
          </p>
        </div>

        <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
          <Tabs defaultValue="activity" />
        </div>

        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">defaultValue 的含义</div>
          <div>
            它表达“初始值”，不是持续同步的控制信号。真实组件库通常用 <code>defaultValue</code> / <code>defaultOpen</code> 这类命名明确这一点。
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 项目中如何选择</h3>
        </div>
        <div className="comparison-container">
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 适合受控</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              URL 需要同步当前 Tab；多个组件共享同一选择；父组件需要校验、阻止或重置状态；业务流程需要完整审计状态变化。
            </div>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 适合非受控</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              局部 UI 状态只在组件内部有意义；父组件只关心初始值；例如 Accordion 默认展开项、临时 Popover 状态等。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-danger">
        <div className="demo-alert-title">⚠️ API 边界</div>
        <div>
          一个组件可以设计成同时支持 controlled / uncontrolled 两种模式，但一次挂载期间应保持模式稳定。不要一会传 value、一会又删除 value；这会让状态所有权变得不清晰，也很容易制造同步 Bug。
        </div>
      </div>
    </div>
  );
}

export default ControlledUncontrolledDemo;
`,Vr=`import { useState } from "react";

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
`,Hr=`import { useState } from "react";

const CONTACTS = [
  { id: "taylor", name: "Taylor" },
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
];

function Chat({ contact }) {
  const [draft, setDraft] = useState("");

  return (
    <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <div style={{ marginBottom: 8 }}>
        当前收件人：<strong>{contact.name}</strong>
      </div>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={\`写给 \${contact.name} 的消息...\`}
        rows={4}
        style={{ width: "100%", resize: "vertical" }}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
        Chat 内部 State：draft = {draft || "(empty)"}
      </div>
    </div>
  );
}

function ContactButtons({ selectedId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {CONTACTS.map((contact) => (
        <button
          key={contact.id}
          className={\`btn \${selectedId === contact.id ? "btn-primary" : "btn-secondary"} btn-sm\`}
          onClick={() => onSelect(contact)}
        >
          {contact.name}
        </button>
      ))}
    </div>
  );
}

export function PreservingResettingStateDemo() {
  const [preservedContact, setPreservedContact] = useState(CONTACTS[0]);
  const [resetContact, setResetContact] = useState(CONTACTS[0]);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧠</span> Preserving / Resetting State：State 属于树中的位置
            </h2>
          </div>
          <span className="badge badge-blue">Identity</span>
        </div>
        <p className="demo-desc">
          React 不把 State 简单“存在组件函数里”，而是把 State 与组件在 render tree 中的位置和身份关联。相同位置继续渲染相同类型组件时，State 默认会保留；改变 key 可以明确告诉 React：这是另一个组件身份，应重新创建并重置子树 State。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">tree position</span>
          <span className="badge badge-gray">component type</span>
          <span className="badge badge-gray">key</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 相同位置 + 相同组件类型：State 被保留</h3>
          <p className="demo-section-desc">
            先给 Taylor 输入草稿，再切换 Alice。虽然 contact prop 变了，但这里始终是在同一个父级位置渲染同一个 Chat 类型，因此 React 复用这个组件身份，draft 继续保留。
          </p>
        </div>
        <ContactButtons selectedId={preservedContact.id} onSelect={setPreservedContact} />
        <div style={{ marginTop: 12 }}>
          <Chat contact={preservedContact} />
        </div>
        <div className="demo-alert demo-alert-danger">
          <div className="demo-alert-title">⚠️ 真实风险</div>
          <div>聊天、编辑器、表单等场景里，保留旧 State 可能让用户把上一位对象的草稿误操作到新对象上。</div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 改变 key：显式切换组件身份并 reset</h3>
          <p className="demo-section-desc">
            下面给 Chat 设置 <code>key={"{contact.id}"}</code>。切换联系人时 key 改变，React 会把旧 Chat 从树中移除，再创建一个新的 Chat，因此内部 draft 从初始值重新开始。
          </p>
        </div>
        <ContactButtons selectedId={resetContact.id} onSelect={setResetContact} />
        <div style={{ marginTop: 12 }}>
          <Chat key={resetContact.id} contact={resetContact} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 心智模型</h3>
        </div>
        <pre style={{ fontSize: 12, lineHeight: 1.7, overflowX: "auto" }}>{\`same parent position
+ same component type
+ same key (or no key)
        ↓
React keeps component identity
        ↓
State preserved

key changes
        ↓
component identity changes
        ↓
old subtree unmounts
        ↓
new subtree mounts
        ↓
State reset\`}</pre>
      </div>

      <div className="comparison-container">
        <div className="comparison-card good">
          <div className="comparison-header good">✅ 主动 reset 的典型场景</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            切换聊天对象、编辑不同实体、切换租户/账户、重新开始向导步骤时，如果旧局部 State 不应该跨实体继承，可以让实体 ID 参与 key。
          </div>
        </div>
        <div className="comparison-card bad">
          <div className="comparison-header bad">❌ 常见误解</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            key 不只是列表 warning 的修复工具，也不要为了“强制刷新”随意使用随机 key。随机 key 会让组件每次 render 都丢失身份，造成不必要的卸载、挂载和 State 丢失。
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreservingResettingStateDemo;
`,Ur=`import { useReducer } from "react";

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
`,Wr=`import { createContext, memo, useContext, useState } from "react";

const ThemeContext = createContext("light");

function RenderBadge({ label, count }) {
  return (
    <span className="badge badge-gray">
      {label} render #{count}
    </span>
  );
}

function ContextConsumer({ parentRenderCount }) {
  const theme = useContext(ThemeContext);
  const renderCount = parentRenderCount.consumer;

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <RenderBadge label="Consumer" count={renderCount} />
      <div style={{ marginTop: 8 }}>
        useContext(ThemeContext) = <strong>{theme}</strong>
      </div>
    </div>
  );
}

const MemoConsumer = memo(function MemoConsumer({ parentRenderCount }) {
  const theme = useContext(ThemeContext);
  const renderCount = parentRenderCount.memoConsumer;

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <RenderBadge label="memo Consumer" count={renderCount} />
      <div style={{ marginTop: 8 }}>
        context = <strong>{theme}</strong>
      </div>
    </div>
  );
});

const MemoNonConsumer = memo(function MemoNonConsumer({ parentRenderCount }) {
  const renderCount = parentRenderCount.nonConsumer;

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <RenderBadge label="memo Non-consumer" count={renderCount} />
      <div style={{ marginTop: 8 }}>这个组件没有读取 ThemeContext。</div>
    </div>
  );
});

export function ContextPropagationDemo() {
  const [theme, setTheme] = useState("light");
  const [localCount, setLocalCount] = useState(0);
  const [renderCounts, setRenderCounts] = useState({ consumer: 1, memoConsumer: 1, nonConsumer: 1 });

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
    setRenderCounts((counts) => ({
      consumer: counts.consumer + 1,
      memoConsumer: counts.memoConsumer + 1,
      nonConsumer: counts.nonConsumer,
    }));
  }

  function updateLocalState() {
    setLocalCount((count) => count + 1);
    setRenderCounts((counts) => ({
      consumer: counts.consumer + 1,
      memoConsumer: counts.memoConsumer,
      nonConsumer: counts.nonConsumer,
    }));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>📡</span> Context 更新传播：谁会收到新值？
            </h2>
          </div>
          <span className="badge badge-blue">Subscription</span>
        </div>
        <p className="demo-desc">
          useContext 不只是“跨层取值”，它同时建立订阅关系。Provider 的 value 变化后，读取该 Context 的组件会收到最新值并重新渲染；memo 不能阻止 Context 消费者接收新的 Context value。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 两种更新来源</h3>
          <p className="demo-section-desc">
            点击“切换 Theme”改变 Provider value；点击“更新局部 State”只改变父组件自己的 localCount。观察消费者和非消费者的差异。
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-primary btn-sm" onClick={toggleTheme}>切换 Theme</button>
          <button className="btn btn-secondary btn-sm" onClick={updateLocalState}>更新局部 State</button>
        </div>
        <div className="demo-alert demo-alert-info">
          <div className="demo-alert-title">Provider / Local State</div>
          <div>theme = {theme} · localCount = {localCount}</div>
        </div>
      </div>

      <ThemeContext value={theme}>
        <div className="demo-grid-2">
          <ContextConsumer parentRenderCount={renderCounts} />
          <MemoConsumer parentRenderCount={renderCounts} />
          <MemoNonConsumer parentRenderCount={renderCounts} />
        </div>
      </ThemeContext>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 传播模型</h3>
        </div>
        <pre style={{ fontSize: 12, lineHeight: 1.7, overflowX: "auto" }}>{\`Provider value changes
        ↓
React compares old/new value with Object.is
        ↓
all descendants that read this Context
receive the fresh value
        ↓
those consumers re-render

memo(Component)
        ↓
can skip parent-prop-driven work
but does NOT block fresh Context values\`}</pre>
      </div>

      <div className="comparison-container">
        <div className="comparison-card good">
          <div className="comparison-header good">✅ 设计边界</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            Context 适合主题、认证信息、locale、页面级共享状态等跨层数据。Provider value 变化频繁时，应关注 value 粒度、拆分 Context 或稳定对象/函数引用。
          </div>
        </div>
        <div className="comparison-card bad">
          <div className="comparison-header bad">❌ 常见误解</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            Context 不是“不会 re-render 的全局变量”。读取 Context 就意味着订阅它；也不能指望给消费者套 memo 就阻止 Context 更新传播。
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">关于本页 render 计数</div>
        <div>
          计数用于教学可视化，显式按实验动作记录预期传播路径，不作为 React Profiler 的替代品。真实性能诊断应使用 React DevTools Profiler。
        </div>
      </div>
    </div>
  );
}

export default ContextPropagationDemo;
`,Gr=`import { createContext, useContext, useReducer, useRef, useEffect } from "react";

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
`,Kr=`import { useState, useRef, useLayoutEffect } from "react";

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

export default UseRefDemo;`,qr=`import { useCallback, useEffect, useState } from "react";

function LiveWindowWatcher({ onLog }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      onLog("info", \`📐 窗口宽度变更为: \${window.innerWidth}px\`);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onLog]);

  return (
    <div style={{ padding: "16px", background: "var(--color-primary-light)", border: "1px solid var(--color-primary-border)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>实时视口宽度监听器：</span>
        <strong style={{ marginLeft: "8px", fontSize: "16px", color: "var(--color-primary)" }}>{windowWidth} px</strong>
      </div>
      <span className="badge badge-green">监听活跃中</span>
    </div>
  );
}

export function UseEffectCorrectUsageDemo() {
  const [showWatcher, setShowWatcher] = useState(true);
  const [logs, setLogs] = useState([
    { type: "info", text: "系统已就绪，准备演示 Effect 同步与 Cleanup", time: new Date().toLocaleTimeString() },
  ]);

  const addLog = useCallback((type, text) => {
    setLogs((prev) => [
      { type, text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const handleToggleWatcher = () => {
    setShowWatcher((prev) => {
      const next = !prev;
      addLog(
        "info",
        next
          ? "🟢 [Setup 建立] 重新挂载监听组件；Effect 会注册 resize listener"
          : "🧹 [Cleanup 清理] 卸载监听组件；Effect cleanup 会移除 resize listener",
      );
      return next;
    });
  };

  const [pageTitleBadge, setPageTitleBadge] = useState(0);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = pageTitleBadge > 0 ? \`(\${pageTitleBadge}条未读) React 学习实验室\` : "React 学习实验室";

    return () => {
      document.title = originalTitle;
    };
  }, [pageTitleBadge]);

  const handleAddBadge = () => {
    setPageTitleBadge((c) => c + 1);
    addLog("info", "🏷️ 请求更新未读数；Effect 会把最新状态同步到 document.title");
  };

  const handleClearBadge = () => {
    setPageTitleBadge(0);
    addLog("info", "🏷️ 清空未读数；Effect 会同步 document.title");
  };

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div><h2 className="demo-title"><span>🔄</span> useEffect 正确用法、同步模型与 Cleanup</h2></div>
          <span className="badge badge-green">外部系统同步</span>
        </div>
        <p className="demo-desc">
          <code>useEffect</code> 用来让组件与 React 之外的外部系统保持同步，例如浏览器事件、WebSocket、第三方控件或某些 timer。Cleanup 不是每个 Effect 都必须返回的仪式：<strong>只有当 setup 建立了需要停止、撤销或释放的外部同步时，才应返回与之对称的 cleanup</strong>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">External Sync</span>
          <span className="badge badge-gray">Setup ↔ Cleanup</span>
          <span className="badge badge-gray">StrictMode Stress Test</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔬</span> 实验 1：浏览器事件监听与对称清理</h3>
          <p className="demo-section-desc">挂载组件后 Effect 注册 resize listener；卸载时 cleanup 移除同一个 listener。缩放窗口可观察当前订阅仍在工作。</p>
        </div>

        <div style={{ marginBottom: "14px", display: "flex", gap: "10px" }}>
          <button className={\`btn \${showWatcher ? "btn-danger" : "btn-success"}\`} onClick={handleToggleWatcher}>
            {showWatcher ? "❌ 卸载监听组件（触发 Cleanup）" : "➕ 挂载监听组件（触发 Setup）"}
          </button>
          <button className="btn btn-secondary" onClick={() => setLogs([])}>清空日志</button>
        </div>

        {showWatcher ? (
          <div style={{ marginBottom: "16px" }}><LiveWindowWatcher onLog={addLog} /></div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)", color: "var(--text-subtle)", fontSize: "13.5px", marginBottom: "16px" }}>
            组件已卸载；cleanup 会撤销这个组件建立的 resize 订阅。
          </div>
        )}

        <div className="demo-console">
          <div className="demo-console-header"><span>TERMINAL OUTPUT / EFFECT LOGS</span><span>{logs.length} 条记录</span></div>
          {logs.map((log, index) => <div key={index} className={\`demo-console-log \${log.type}\`}>[{log.time}] {log.text}</div>)}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🏷️</span> 实验 2：把 React state 同步到 document.title</h3>
          <p className="demo-section-desc">按钮只更新 React state；Effect 根据当前 state 把浏览器标签标题同步到相同状态。</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-primary btn-sm" onClick={handleAddBadge}>模拟收到未读通知 (+1)</button>
          <button className="btn btn-secondary btn-sm" onClick={handleClearBadge}>标记全部已读 (清空)</button>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>当前未读数：<strong>{pageTitleBadge}</strong> 条</span>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> StrictMode 到底在验证什么？</div>
        <div>
          开发环境启用 <code>StrictMode</code> 时，React 会对 Effect 做一次额外的 <strong>setup → cleanup → setup</strong> 压力测试（并且 StrictMode 还有其他开发期检查）。目标不是模拟一次真实业务卸载，而是验证 cleanup 是否能完整撤销 setup；用户不应能分辨“只 setup 一次”和这组额外检查带来的差异。
        </div>
      </div>
    </div>
  );
}

export default UseEffectCorrectUsageDemo;
`,Jr=`import { useState } from "react";

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
`,Yr=`import { useEffect, useEffectEvent, useState } from "react";

function connectChatSocket(roomId, onMessage) {
  const timerId = setInterval(() => {
    onMessage({
      id: \`\${roomId}-\${Date.now()}\`,
      text: \`[来自房间 #\${roomId} 的实时消息] 当前在线人数: \${Math.floor(Math.random() * 20 + 5)}\`,
      time: new Date().toLocaleTimeString(),
    });
  }, 2500);

  return {
    close() {
      clearInterval(timerId);
    },
  };
}

export function LifecycleOfReactiveEffectsDemo() {
  const [roomId, setRoomId] = useState("101");
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [lifecycleLogs, setLifecycleLogs] = useState([
    { type: "success", text: "🟢 初始房间将由 Effect 建立同步", time: new Date().toLocaleTimeString() },
  ]);

  function addLog(type, text) {
    setLifecycleLogs((prev) => [
      { type, text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  }

  const onMessage = useEffectEvent((newMessage) => {
    setMessages((prev) => [newMessage, ...prev.slice(0, 7)]);
    addLog(
      isMuted ? "warn" : "info",
      isMuted ? "🔕 收到消息；当前静音，不播放提示音" : \`📩 收到新消息并播放提示音: \${newMessage.text}\`,
    );
  });

  useEffect(() => {
    const socket = connectChatSocket(roomId, onMessage);

    return () => {
      socket.close();
    };
  }, [roomId]);

  function handleSwitchRoom(nextRoom) {
    if (nextRoom === roomId) return;
    addLog("error", \`🔴 [Cleanup] 关闭房间 #\${roomId} 的 Socket 同步\`);
    addLog("success", \`🟢 [Setup] 建立房间 #\${nextRoom} 的 Socket 同步\`);
    setRoomId(nextRoom);
    setMessages([]);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div><h2 className="demo-title"><span>🌐</span> 响应式 Effect 的生命周期与依赖</h2></div>
          <span className="badge badge-purple">深度核心</span>
        </div>
        <p className="demo-desc">
          每个 Effect 描述一段独立的同步过程。依赖中的响应式值变化时，React 先用旧值执行 cleanup，再用新值执行 setup；卸载时执行最后一次 cleanup。这里真正决定“连接到哪个房间”的值是 <code>roomId</code>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Reactive Values</span>
          <span className="badge badge-gray">Cleanup → Setup</span>
          <span className="badge badge-gray">Effect Event</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 实时聊天室连接模拟器</h3>
          <p className="demo-section-desc">切换房间会改变同步目标，因此需要断开旧连接再建立新连接；静音只影响“收到消息后做什么”，不应该重新建立 Socket。</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px", padding: "12px 16px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>切换当前房间：</span>
            {["101", "102", "103"].map((id) => (
              <button key={id} className={\`btn btn-sm \${roomId === id ? "btn-primary" : "btn-secondary"}\`} onClick={() => handleSwitchRoom(id)}>
                房间 #{id}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className={\`btn btn-sm \${isMuted ? "btn-warning" : "btn-outline"}\`} onClick={() => setIsMuted((value) => !value)}>
              {isMuted ? "🔕 当前已静音（点击解除）" : "🔔 开启静音（点击静音）"}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setLifecycleLogs([])}>清空日志</button>
          </div>
        </div>

        <div className="demo-grid-2">
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>房间 #{roomId} 实时消息通道</div>
            <div style={{ height: "220px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "10px", background: "var(--bg-surface)", display: "flex", flexDirection: "column", gap: "8px" }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-subtle)", fontSize: "13px" }}>正在等待房间 #{roomId} 的广播消息...</div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} style={{ padding: "8px 12px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <div style={{ color: "var(--text-subtle)", fontSize: "11px", marginBottom: "3px" }}>{message.time}</div>
                    <div>{message.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>Effect 生命周期追踪</div>
            <div className="demo-console" style={{ height: "220px", maxHeight: "220px" }}>
              <div className="demo-console-header"><span>SOCKET LIFECYCLE MONITOR</span><span>{lifecycleLogs.length} 条追踪</span></div>
              {lifecycleLogs.map((log, index) => <div key={\`\${log.time}-\${index}\`} className={\`demo-console-log \${log.type}\`}>[{log.time}] {log.text}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">依赖不是“运行次数开关”</div>
          <p>依赖数组描述 setup 读取了哪些响应式值。这里 <code>roomId</code> 决定连接目标，所以它必须是依赖；不能为了减少重连而把真实依赖删掉。</p>
        </div>
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">非响应式逻辑用 Effect Event</div>
          <p><code>isMuted</code> 只在外部连接触发“收到消息”时读取最新 committed 值。React 19.2 的 <code>useEffectEvent</code> 可以表达这类逻辑，而无需把静音切换变成重新连接的理由。</p>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}>
        <strong>边界：</strong><code>useEffectEvent</code> 不是逃避依赖的工具，也不能作为普通点击 handler 随处调用。它用于 Effect 内部触发的非响应式事件逻辑；真正决定外部同步关系的值仍必须留在依赖中。
      </div>
    </div>
  );
}

export default LifecycleOfReactiveEffectsDemo;
`,Xr=`import { useEffect, useState } from "react";

function fakePurchase(product) {
  return new Promise((resolve) => setTimeout(() => resolve(\`\${product} 下单成功\`), 650));
}

export function EventVsEffectDemo() {
  const [product, setProduct] = useState("React 课程");
  const [online, setOnline] = useState(true);
  const [message, setMessage] = useState("尚未购买");
  const syncLine = \`Effect: 与外部在线状态同步 → \${online ? "online" : "offline"}\`;

  useEffect(() => {
    const line = \`Effect: 与外部在线状态同步 → \${online ? "online" : "offline"}\`;
    console.log(line);
    return () => console.log(\`Effect cleanup: 结束 \${online ? "online" : "offline"} 同步\`);
  }, [online]);

  async function handleBuy() {
    setMessage("购买请求处理中…");
    setMessage(await fakePurchase(product));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🎯</span> Event vs Effect：动作与同步不是一回事</h2><span className="badge badge-blue">04-05</span></div>
        <p className="demo-desc">用户明确做了某件事，用 Event Handler；组件因为“当前已处于某状态”而需要与外部系统保持一致，才使用 Effect。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 两条因果链</h3></div>
        <div className="demo-grid-2">
          <div>
            <h4>用户动作 → Event Handler</h4>
            <select className="form-input" value={product} onChange={(e) => setProduct(e.target.value)}>
              <option>React 课程</option><option>TypeScript 课程</option>
            </select>
            <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleBuy}>购买当前商品</button>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>{message}</div>
          </div>
          <div>
            <h4>当前状态 → Effect 同步</h4>
            <button className="btn" onClick={() => setOnline((v) => !v)}>切换为 {online ? "offline" : "online"}</button>
            <div style={{ marginTop: 10, display: "grid", gap: 6 }}><code>{syncLine}</code></div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <strong>反模式：</strong>点击购买 → setIsBuying(true) → Effect 监听 isBuying 再发请求。这样把“事件因果”绕成了“状态同步”，容易造成重复触发和恢复状态后的意外副作用。
      </div>
      <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>
        <strong>真实项目边界：</strong>支付、删除、提交、下载等明确用户动作放事件处理器；WebSocket、订阅、浏览器 API、第三方实例等“只要当前状态成立就必须保持同步”的关系放 Effect。
      </div>
    </div>
  );
}

export default EventVsEffectDemo;
`,Zr=`import { useEffect, useEffectEvent, useState } from "react";

function createConnection(roomId, onConnected) {
  let timer;
  return {
    connect() {
      timer = setTimeout(onConnected, 500);
    },
    disconnect() {
      clearTimeout(timer);
    },
  };
}

export function EffectEventDemo() {
  const [roomId, setRoomId] = useState("general");
  const [theme, setTheme] = useState("light");
  const [connectCount, setConnectCount] = useState(1);
  const [notice, setNotice] = useState("等待连接");

  const onConnected = useEffectEvent(() => {
    setNotice(\`已连接 \${roomId}，当前主题 \${theme}\`);
  });

  useEffect(() => {
    const connection = createConnection(roomId, onConnected);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleRoomChange(event) {
    setRoomId(event.target.value);
    setConnectCount((count) => count + 1);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📡</span> useEffectEvent：响应式连接 + 非响应式读取</h2><span className="badge badge-blue">React 19.2</span></div>
        <p className="demo-desc">连接是否需要重建由 roomId 决定；连接成功时显示什么主题，只需要读取最新 committed theme，不应该因此重连。</p>
      </div>
      <div className="demo-section">
        <div className="demo-grid-2">
          <div>
            <label htmlFor="effect-event-room">房间</label>
            <select id="effect-event-room" className="form-input" value={roomId} onChange={handleRoomChange}><option>general</option><option>react</option><option>typescript</option></select>
            <label style={{ display: "block", marginTop: 12 }}>主题</label>
            <button className="btn" onClick={() => setTheme((v) => v === "light" ? "dark" : "light")}>切换 theme：{theme}</button>
          </div>
          <div>
            <div className="demo-alert demo-alert-tip"><strong>连接次数：{connectCount}</strong><p>{notice}</p></div>
            <p>观察：只切换 theme 不会增加连接次数；切换 roomId 才触发 cleanup → setup。</p>
          </div>
        </div>
      </div>
      <div className="demo-alert demo-alert-warning"><strong>边界：</strong>Effect Event 不是“绕过 exhaustive-deps”的工具。真正决定外部同步关系的值仍必须放入 Effect dependencies；只有非响应式逻辑适合移入 Effect Event。</div>
    </div>
  );
}

export default EffectEventDemo;
`,Qr=`import { useEffect, useState } from "react";

function useOnlineSignal(initial = true) {
  const [online, setOnline] = useState(initial);
  useEffect(() => {
    const handler = () => setOnline(navigator.onLine);
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
    };
  }, []);
  return online;
}

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return { count, increment: () => setCount((n) => n + 1), reset: () => setCount(initial) };
}

function CounterCard({ label }) {
  const { count, increment, reset } = useCounter();
  return <div className="demo-alert demo-alert-tip"><strong>{label}: {count}</strong><div style={{ marginTop: 8 }}><button className="btn" onClick={increment}>+1</button><button className="btn" style={{ marginLeft: 8 }} onClick={reset}>reset</button></div></div>;
}

export function CustomHooksDemo() {
  const online = useOnlineSignal();
  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🪝</span> Custom Hooks：复用状态逻辑，不共享 State</h2><span className="badge badge-blue">04-07</span></div>
        <p className="demo-desc">自定义 Hook 抽取的是“如何使用 State/Effect”的逻辑。每次调用都拥有独立 State；若需要真正共享数据，应提升 State、使用 Context 或 external store。</p>
      </div>
      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 两个 useCounter 调用</h3></div>
        <div className="demo-grid-2"><CounterCard label="A" /><CounterCard label="B" /></div>
        <p>给 A 加 1 不会改变 B：同一个 Hook 实现被复用，但 State 没有共享。</p>
      </div>
      <div className="demo-section">
        <div className="demo-alert demo-alert-tip"><strong>封装 Effect：</strong>useOnlineSignal 把浏览器 online/offline 订阅及 cleanup 隐藏在声明式 API 后面。当前浏览器状态：{online ? "online" : "offline"}</div>
      </div>
      <div className="demo-alert demo-alert-warning"><strong>Rules of Hooks：</strong>自定义 Hook 仍必须在组件或其他 Hook 顶层调用；不要在条件、循环或普通工具函数里调用 Hook。</div>
    </div>
  );
}

export default CustomHooksDemo;
`,$r=`import { useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

function SmartInput({ ref, label }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    select() {
      inputRef.current?.select();
    },
  }), []);

  return <label>{label}<input ref={inputRef} className="form-input" defaultValue="React 19 ref as prop" /></label>;
}

export function AdvancedRefDemo() {
  const inputHandle = useRef(null);
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    setWidth(Math.round(boxRef.current?.getBoundingClientRect().width ?? 0));
  }, [expanded]);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📐</span> 高级 Ref：layout measurement 与 imperative handle</h2><span className="badge badge-blue">04-08</span></div>
        <p className="demo-desc">useLayoutEffect 适合必须在浏览器绘制前读取布局并同步调整 UI 的场景；useImperativeHandle 用于只暴露父组件真正需要的命令式能力。</p>
      </div>
      <div className="demo-section">
        <div className="demo-grid-2">
          <div ref={boxRef} style={{ width: expanded ? "100%" : "65%", padding: 16, border: "1px solid var(--border-color)", borderRadius: 8 }}>
            <strong>Measured box</strong><p>本次 layout effect 读取宽度：{width}px</p>
            <button className="btn" onClick={() => setExpanded((v) => !v)}>切换宽度</button>
          </div>
          <div>
            <SmartInput ref={inputHandle} label="受限 imperative API" />
            <div style={{ marginTop: 10 }}><button className="btn" onClick={() => inputHandle.current?.focus()}>focus</button><button className="btn" style={{ marginLeft: 8 }} onClick={() => inputHandle.current?.select()}>select</button></div>
          </div>
        </div>
      </div>
      <div className="demo-alert demo-alert-tip"><strong>React 19：</strong>函数组件可以直接把 ref 作为 prop 接收；React 18 及更早版本通常需要 forwardRef。forwardRef 仍存在用于兼容旧代码，但 React 官方已说明在 React 19 中不再必要。</div>
      <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>不要滥用：</strong>能用 props 表达的状态（例如 isOpen）优先使用声明式 props；ref 只用于 focus、scroll、measurement、animation 等难以用数据流表达的命令式行为。useLayoutEffect 会阻塞 paint，应优先 useEffect，只有布局读取/同步调整确实需要时才使用。</div>
    </div>
  );
}

export default AdvancedRefDemo;
`,ei=`import { useMemo, useState } from "react";

const initialForm = {
  name: "",
  bio: "",
  role: "frontend",
  newsletter: true,
  contact: "email",
};

export function ControlledFormDemo() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);

  const errors = useMemo(() => ({
    name: form.name.trim().length < 2 ? "姓名至少需要 2 个字符" : "",
    bio: form.bio.length > 80 ? "简介不能超过 80 个字符" : "",
  }), [form.name, form.bio]);

  const isValid = !errors.name && !errors.bio;

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;
    setSubmitted({ ...form, submittedAt: new Date().toLocaleTimeString() });
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(null);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📝</span> Controlled Form：React State 是表单真源</h2>
          </div>
          <span className="badge badge-blue">Forms</span>
        </div>
        <p className="demo-desc">
          受控表单把输入值放进 React State：输入事件请求更新 State，下一次 render 再把 value / checked 写回控件。适合需要实时校验、联动和条件 UI 的表单。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">input / textarea</span>
          <span className="badge badge-gray">select</span>
          <span className="badge badge-gray">checkbox / radio</span>
          <span className="badge badge-gray">validation</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 实时表单实验</h3>
          <p className="demo-section-desc">修改任意字段，观察 State、派生校验结果和最终提交快照如何同步变化。</p>
        </div>

        <div className="demo-grid-2">
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>姓名</span>
              <input className="form-input" name="name" value={form.name} onChange={updateField} placeholder="至少 2 个字符" />
              {errors.name && <small style={{ color: "var(--color-danger)" }}>{errors.name}</small>}
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>个人简介</span>
              <textarea className="form-input" name="bio" value={form.bio} onChange={updateField} rows={3} />
              <small>{form.bio.length}/80 {errors.bio && \`· \${errors.bio}\`}</small>
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>岗位</span>
              <select className="form-input" name="role" value={form.role} onChange={updateField}>
                <option value="frontend">前端</option>
                <option value="backend">后端</option>
                <option value="product">产品</option>
              </select>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={updateField} />
              接收学习周报
            </label>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ marginBottom: 6 }}>首选联系方式</legend>
              {["email", "phone"].map((value) => (
                <label key={value} style={{ marginRight: 16 }}>
                  <input type="radio" name="contact" value={value} checked={form.contact === value} onChange={updateField} /> {value}
                </label>
              ))}
            </fieldset>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={!isValid}>提交</button>
              <button className="btn" type="button" onClick={resetForm}>重置</button>
            </div>
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>可观察数据流</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(form, null, 2)}</pre>
            <div className={\`demo-alert \${isValid ? "demo-alert-tip" : "demo-alert-warning"}\`}>
              <strong>{isValid ? "✓ 当前表单可提交" : "等待修正校验错误"}</strong>
            </div>
            {submitted && (
              <div style={{ marginTop: 12 }}>
                <strong>最近一次提交快照</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(submitted, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 状态建模边界</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>正确：</strong>保存用户真正输入的字段；像 <code>isValid</code>、字符数、错误提示这类可以由当前字段计算出的值直接派生。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>反模式：</strong>同时保存 <code>name</code>、<code>nameLength</code>、<code>isNameValid</code> 三份可互相推导的数据，会制造同步成本和矛盾状态。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          项目边界：小型、强联动表单直接使用受控 State 很清晰；大型表单若每次按键都会导致庞大子树更新，应先拆组件或采用成熟表单方案，而不是机械地把所有字段提升到页面顶层。
        </p>
      </div>
    </div>
  );
}

export default ControlledFormDemo;
`,ti=`import { useState } from "react";

function formDataToObject(formData) {
  return {
    title: String(formData.get("title") ?? ""),
    priority: String(formData.get("priority") ?? "normal"),
    assignees: formData.getAll("assignees").map(String),
    notify: formData.has("notify"),
  };
}

export function FormDataModelingDemo() {
  const [submitted, setSubmitted] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = formDataToObject(formData);
    setSubmitted(payload);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📦</span> FormData：提交时再读取表单快照</h2>
          </div>
          <span className="badge badge-blue">Forms</span>
        </div>
        <p className="demo-desc">
          并非所有表单都需要把每个按键同步进 React State。对于“填写 → 提交”型场景，可以让浏览器持有输入状态，在提交时一次性构造 FormData。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">uncontrolled</span>
          <span className="badge badge-gray">FormData</span>
          <span className="badge badge-gray">get / getAll</span>
          <span className="badge badge-gray">submit snapshot</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 提交快照实验</h3>
          <p className="demo-section-desc">输入过程中 React 不保存字段值；点击提交后才把浏览器表单转换成业务 payload。</p>
        </div>

        <div className="demo-grid-2">
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>任务标题</span>
              <input className="form-input" name="title" defaultValue="学习 React FormData" required />
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>优先级</span>
              <select className="form-input" name="priority" defaultValue="normal">
                <option value="low">低</option>
                <option value="normal">普通</option>
                <option value="high">高</option>
              </select>
            </label>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ marginBottom: 6 }}>协作者（同名字段会产生多个值）</legend>
              {["Alice", "Bob", "Carol"].map((name) => (
                <label key={name} style={{ marginRight: 16 }}>
                  <input type="checkbox" name="assignees" value={name} /> {name}
                </label>
              ))}
            </fieldset>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="notify" defaultChecked />
              提交后通知协作者
            </label>

            <button className="btn btn-primary" type="submit">读取 FormData</button>
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>可观察数据流</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{\`浏览器维护输入值\\n        ↓\\nsubmit event\\n        ↓\\nnew FormData(form)\\n        ↓\\nget / getAll / has\\n        ↓\\n业务 payload\`}</pre>
            {submitted ? (
              <>
                <strong>最近一次提交快照</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(submitted, null, 2)}</pre>
              </>
            ) : (
              <div className="demo-alert demo-alert-tip">修改表单不会触发这里更新；只有提交时 React 才保存 payload。</div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 状态建模：谁需要实时知道字段值？</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>适合 FormData：</strong>搜索框、登录、简单创建表单等主要关心“提交结果”的场景，可以避免为每个字段建立 React State。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>不要机械使用非受控：</strong>实时校验、字段联动、即时预览或条件展示需要当前输入值时，受控 State 往往更直接。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          注意多值字段：<code>formData.get()</code> 只读取一个值；checkbox group、multi-select 等需要使用 <code>getAll()</code>。同时不要直接把 FormData 当最终领域模型，应在提交边界完成字符串、布尔值、数组等类型转换。
        </p>
      </div>
    </div>
  );
}

export default FormDataModelingDemo;`,ni=`import { useState } from "react";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function FormActionDemo() {
  const [events, setEvents] = useState([]);

  function appendEvent(message) {
    setEvents((current) => [message, ...current].slice(0, 6));
  }

  async function publish(formData) {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    appendEvent(\`publish 开始：\${title || "未命名"}\`);
    await wait(800);
    appendEvent(\`publish 完成：\${content.length} 个字符\`);
  }

  async function saveDraft(formData) {
    const title = String(formData.get("title") ?? "").trim();

    appendEvent(\`draft 开始：\${title || "未命名"}\`);
    await wait(500);
    appendEvent("draft 保存完成");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⚙️</span> React 19 Form Action：提交就是 Action</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          React 19 允许把函数直接传给 <code>&lt;form action&gt;</code>。提交时 React 把 FormData 传给该函数，并以 Action / Transition 语义处理异步提交。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">action</span>
          <span className="badge badge-gray">formAction</span>
          <span className="badge badge-gray">FormData</span>
          <span className="badge badge-gray">Transition</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 发布 / 保存草稿双 Action</h3>
          <p className="demo-section-desc">默认提交走 publish；“保存草稿”按钮通过 formAction 覆盖父 form 的 action。</p>
        </div>

        <div className="demo-grid-2">
          <form action={publish} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>标题</span>
              <input className="form-input" name="title" defaultValue="React 19 Actions" required />
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>正文</span>
              <textarea className="form-input" name="content" defaultValue="用一个表单承载多个提交意图。" rows={4} required />
            </label>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit">发布</button>
              <button className="btn" type="submit" formAction={saveDraft}>保存草稿</button>
            </div>
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>Action 流程</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{\`submit\\n  ↓\\nReact 收集 FormData\\n  ↓\\naction / formAction\\n  ↓\\n异步 Action 在 Transition 中运行\\n  ↓\\n成功后非受控字段 reset\`}</pre>
            <strong>最近事件</strong>
            {events.length === 0 ? (
              <p className="demo-section-desc">尚未提交。</p>
            ) : (
              <ol style={{ paddingLeft: 20, marginBottom: 0 }}>
                {events.map((event, index) => <li key={\`\${event}-\${index}\`}>{event}</li>)}
              </ol>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 与 onSubmit 的边界</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>Action：</strong>适合 mutation 工作流。React 可以跟踪 pending，错误可进入 Error Boundary，并可与 <code>useActionState</code>、<code>useFormStatus</code>、<code>useOptimistic</code> 组合。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>不要混淆：</strong><code>onSubmit</code> 仍然适用于需要直接操作 submit event、调用 <code>preventDefault()</code> 或自行读取表单的场景；函数 action 不是它的语法糖。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          真实项目中，一个表单可能存在“发布 / 保存草稿 / 送审”等多个 mutation。按钮级 <code>formAction</code> 可以表达不同提交意图，而不必先把“点击了哪个按钮”额外塞进 React State。
        </p>
      </div>
    </div>
  );
}

export default FormActionDemo;`,ri=`import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const initialResult = {
  status: "idle",
  message: "尚未提交",
  email: "",
};

async function subscribe(previousState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  await wait(900);

  if (!email.includes("@")) {
    return {
      status: "error",
      message: \`“\${email || "空值"}” 不是有效邮箱\`,
      email,
      attempts: (previousState.attempts ?? 0) + 1,
    };
  }

  return {
    status: "success",
    message: \`已为 \${email} 开启 React 学习周报\`,
    email,
    attempts: (previousState.attempts ?? 0) + 1,
  };
}

function SubmitArea() {
  const { pending, data } = useFormStatus();
  const submittingEmail = data ? String(data.get("email") ?? "") : "";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "提交中…" : "订阅"}
      </button>
      <small>
        useFormStatus.pending: <strong>{String(pending)}</strong>
        {pending && submittingEmail ? \` · 正在提交 \${submittingEmail}\` : ""}
      </small>
    </div>
  );
}

export function ActionStateFormStatusDemo() {
  const [result, submitAction, isPending] = useActionState(subscribe, initialResult);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⏳</span> useActionState + useFormStatus：把 Action 结果与 pending 可视化</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          <code>useActionState</code> 保存 Action 的返回结果并暴露 pending；<code>useFormStatus</code> 则让表单内部的设计系统组件读取最近一次提交状态，无需层层传 props。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">previousState</span>
          <span className="badge badge-gray">FormData</span>
          <span className="badge badge-gray">isPending</span>
          <span className="badge badge-gray">form status</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 异步订阅实验</h3>
          <p className="demo-section-desc">先输入无效邮箱观察已知业务错误，再输入有效邮箱观察 pending → result 的完整状态迁移。</p>
        </div>

        <div className="demo-grid-2">
          <form action={submitAction} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>邮箱</span>
              <input className="form-input" name="email" defaultValue="demo" placeholder="you@example.com" />
            </label>
            <SubmitArea />
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>Action State</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(result, null, 2)}</pre>
            <div className={\`demo-alert \${isPending ? "demo-alert-warning" : "demo-alert-tip"}\`}>
              <strong>useActionState.isPending: {String(isPending)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 两个 pending 为什么都存在？</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>useActionState：</strong>关注“这个 Action 状态机”的结果与执行状态，适合页面业务逻辑读取。
        </div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>
          <strong>useFormStatus：</strong>关注“我所在父 form 的提交状态”，适合 SubmitButton、Spinner 等可复用表单子组件。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>常见错误：</strong><code>useFormStatus</code> 放在渲染该 <code>&lt;form&gt;</code> 的同一个组件里，并不能读取这个 form；调用 Hook 的组件必须是目标 form 的后代。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          业务校验失败这类“预期错误”通常作为 Action state 返回并渲染；真正未知的程序异常可以抛出，由最近的 Error Boundary 接管。
        </p>
      </div>
    </div>
  );
}

export default ActionStateFormStatusDemo;`,ii=`import { useOptimistic, useState } from "react";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const initialComments = [
  { id: 1, text: "先显示结果，再等待服务器确认。", pending: false },
];

function optimisticReducer(currentComments, action) {
  if (action.type === "add") {
    return [...currentComments, { ...action.comment, pending: true }];
  }
  return currentComments;
}

export function OptimisticUpdateDemo() {
  const [comments, setComments] = useState(initialComments);
  const [optimisticComments, addOptimisticComment] = useOptimistic(comments, optimisticReducer);
  const [message, setMessage] = useState("尚未提交");

  async function addCommentAction(formData) {
    const text = String(formData.get("comment") ?? "").trim();
    const shouldFail = formData.has("shouldFail");

    if (!text) {
      setMessage("请输入评论内容");
      return;
    }

    const temporaryComment = {
      id: \`temp-\${Date.now()}\`,
      text,
    };

    setMessage("服务器处理中：先展示 optimistic comment");
    addOptimisticComment({ type: "add", comment: temporaryComment });
    await wait(1200);

    if (shouldFail) {
      setMessage("服务器拒绝：真实 state 未变化，optimistic comment 自动回退");
      return;
    }

    setComments((current) => [
      ...current,
      { id: Date.now(), text, pending: false },
    ]);
    setMessage("服务器成功：真实 state 接管，optimistic 与 canonical 收敛");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⚡</span> useOptimistic：即时反馈、成功收敛、失败回退</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          Optimistic UI 不是提前修改真实数据，而是在 Action 仍 pending 时临时渲染“预计会成功”的状态。Action 结束后，UI 重新以真实 state 为准。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">temporary state</span>
          <span className="badge badge-gray">Action</span>
          <span className="badge badge-gray">commit</span>
          <span className="badge badge-gray">rollback</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 评论提交实验</h3>
          <p className="demo-section-desc">正常提交观察 optimistic → confirmed；勾选“模拟失败”观察 optimistic 项目消失并回到 canonical state。</p>
        </div>

        <div className="demo-grid-2">
          <div>
            <ul style={{ paddingLeft: 20 }}>
              {optimisticComments.map((comment) => (
                <li key={comment.id} style={{ marginBottom: 8, opacity: comment.pending ? 0.6 : 1 }}>
                  {comment.text} {comment.pending && <span className="badge badge-gray">发送中</span>}
                </li>
              ))}
            </ul>

            <form action={addCommentAction} style={{ display: "grid", gap: 10 }}>
              <input className="form-input" name="comment" defaultValue="这条评论会先乐观显示" />
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" name="shouldFail" />
                模拟服务器失败
              </label>
              <button className="btn btn-primary" type="submit">发送评论</button>
            </form>
          </div>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>状态对照</h4>
            <p><strong>Canonical:</strong> {comments.length} 条</p>
            <p><strong>当前 UI:</strong> {optimisticComments.length} 条</p>
            <div className="demo-alert demo-alert-tip">{message}</div>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{\`Action 开始\\n  ↓\\nsetOptimistic(...)\\n  ↓\\n立即渲染临时 UI\\n  ↓\\nawait server\\n  ├─ success → 更新 canonical state → 收敛\\n  └─ failure → canonical 不变 → 自动回退\`}</pre>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> Optimistic UI 的边界</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>适合：</strong>点赞、评论、Todo、购物车数量等成功率高、用户希望即时反馈、失败后可以明确恢复的 mutation。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>谨慎：</strong>支付、库存锁定、权限授予等不能轻易制造“已经成功”错觉的操作，通常需要更保守的 pending UI。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          <code>useOptimistic</code> 的 setter 必须在 Action / Transition 中调用。不要额外维护一份长期 optimistic store；canonical state 才是 Action 结束后的最终真源。
        </p>
      </div>
    </div>
  );
}

export default OptimisticUpdateDemo;`,ai=`import { lazy, Suspense, useState } from "react";

const LazyLessonPanel = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return import("../components/LazyLessonPanel.jsx");
});

export function LazySuspenseDemo() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📦</span> lazy + Suspense：代码什么时候真的加载？</h2>
          </div>
          <span className="badge badge-blue">Code Splitting</span>
        </div>
        <p className="demo-desc">
          <code>lazy(load)</code> 把组件代码的加载推迟到第一次渲染它；加载 Promise pending 时，最近的 Suspense boundary 显示 fallback。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 首次加载实验</h3>
          <p className="demo-section-desc">点击后观察 fallback → lazy module ready。再次隐藏再显示时，loader 结果已缓存，不会重复等待同一模块。</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShow((value) => !value)}>
          {show ? "隐藏 lazy 组件" : "显示 lazy 组件"}
        </button>
        <div style={{ marginTop: 16 }}>
          <Suspense fallback={<div className="demo-alert">⏳ 正在加载独立 chunk…</div>}>
            {show && <LazyLessonPanel />}
          </Suspense>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">正确边界</div>
          <p>适合路由级页面、重型编辑器、图表面板等“不是首屏立刻需要”的代码。Suspense 管的是这棵子树的等待 UI。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">反模式</div>
          <p>不要在组件内部每次 render 都重新声明 <code>lazy()</code>；这会创建新的组件类型并可能导致 State 被重置。</p>
        </div>
      </div>
    </div>
  );
}

export default LazySuspenseDemo;
`,oi=`export default function LazyLessonPanel() {
  return (
    <div className="demo-alert demo-alert-tip">
      <div className="demo-alert-title">Lazy chunk 已解析并渲染</div>
      <p>
        这个组件来自独立模块。第一次真正尝试渲染它时，React 才调用
        <code> lazy(load) </code> 的加载函数；加载结果会被缓存。
      </p>
    </div>
  );
}
`,si=`import { Suspense, use, useState } from "react";

const promiseCache = new Map();

function readDemoPromise(key, delay, value) {
  if (!promiseCache.has(key)) {
    promiseCache.set(
      key,
      new Promise((resolve) => {
        setTimeout(() => resolve(value), delay);
      }),
    );
  }
  return promiseCache.get(key);
}

function Profile({ version }) {
  const profile = use(readDemoPromise(\`profile-\${version}\`, 700, { name: "Ada", role: "Frontend Engineer" }));
  return (
    <div className="demo-alert demo-alert-tip">
      <strong>{profile.name}</strong> · {profile.role}
    </div>
  );
}

function Activity({ version }) {
  const items = use(readDemoPromise(\`activity-\${version}\`, 1500, ["提交 PR", "修复 hydration bug", "补充测试"]));
  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export function SuspenseBoundaryDemo() {
  const [version, setVersion] = useState(1);
  const [nested, setNested] = useState(true);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧱</span> Suspense Boundary：等待边界决定 loading UX</h2>
          </div>
          <span className="badge badge-blue">Boundary</span>
        </div>
        <p className="demo-desc">
          Suspense 不是“给任意 fetch 一个 loading”。它只响应会 suspend 的数据源或代码加载；离 suspend 点最近的 boundary 决定显示哪块 fallback。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 单层 vs Nested Suspense</h3>
          <p className="demo-section-desc">重新加载后，Profile 约 0.7s 完成，Activity 约 1.5s 完成。切换 nested 模式观察 reveal 顺序。</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <button type="button" className="btn btn-primary" onClick={() => setVersion((value) => value + 1)}>重新加载</button>
          <button type="button" className="btn" onClick={() => setNested((value) => !value)}>
            {nested ? "改为单一 Boundary" : "改为 Nested Boundary"}
          </button>
        </div>

        <Suspense fallback={<div className="demo-alert">⏳ 外层 fallback：等待关键内容…</div>}>
          <Profile version={version} />
          <div style={{ marginTop: 12 }}>
            {nested ? (
              <Suspense fallback={<div className="demo-alert">⏳ 内层 fallback：Activity 仍在加载…</div>}>
                <Activity version={version} />
              </Suspense>
            ) : (
              <Activity version={version} />
            )}
          </div>
        </Suspense>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Nested boundary</div>
          <p>允许已经准备好的上层内容先显示，再独立等待慢子树。Boundary 应贴合设计中的 loading sequence。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">边界不是越多越好</div>
          <p>每个小节点都包 Suspense 会制造闪烁与碎片化 UX。优先让产品设计决定哪些区域应该一起 reveal。</p>
        </div>
      </div>
    </div>
  );
}

export default SuspenseBoundaryDemo;
`,ci=`import { Component, Suspense, use, useState } from "react";

function createMessagePromise(mode, attempt) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === "error") {
        reject(new Error(\`模拟服务失败（attempt \${attempt}）\`));
      } else {
        resolve(\`Promise 已成功解析（attempt \${attempt}）\`);
      }
    }, 900);
  });
}

class DemoErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">Error Boundary fallback</div>
          <p>{this.state.error.message}</p>
          <p>Render / lazy / use(Promise) 抛出的错误可以由最近的 Error Boundary 隔离。</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function PromiseReader({ resource }) {
  const message = use(resource);
  return <div className="demo-alert demo-alert-tip">✅ {message}</div>;
}

export function ErrorBoundaryUseDemo() {
  const [attempt, setAttempt] = useState(1);
  const [mode, setMode] = useState("success");
  const [resource, setResource] = useState(() => createMessagePromise("success", 1));

  function retry(nextMode) {
    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);
    setMode(nextMode);
    setResource(createMessagePromise(nextMode, nextAttempt));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧯</span> Error Boundary + React 19 use：pending 与 rejected Promise 去哪里？</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          <code>use(promise)</code> 在 render 中读取资源：pending 时交给 Suspense，rejected 时错误继续传播给最近的 Error Boundary。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> Promise 状态路由实验</h3>
          <p className="demo-section-desc">每次点击都在事件阶段创建新的稳定 Promise，并把 Promise 本身存进 State；render 只负责用 <code>use</code> 读取它。</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <button type="button" className="btn btn-primary" onClick={() => retry("success")}>加载成功资源</button>
          <button type="button" className="btn" onClick={() => retry("error")}>加载失败资源</button>
        </div>

        <DemoErrorBoundary key={\`\${mode}-\${attempt}\`}>
          <Suspense fallback={<div className="demo-alert">⏳ Promise pending → Suspense fallback</div>}>
            <PromiseReader resource={resource} />
          </Suspense>
        </DemoErrorBoundary>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Error Boundary 能捕获</div>
          <p>子树 render、constructor、lifecycle，以及 lazy / use 传播出来的 render-time error。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">不能当万能 try/catch</div>
          <p>普通事件 handler 或任意异步 callback 中的异常不会因为附近有 Error Boundary 就自动被捕获；这些流程需要自己的错误处理。</p>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title">关键边界：不要在 render 中创建不稳定 Promise</div>
        <p>
          <code>use(fetch(...))</code> 如果每次 render 都创建新 Promise，会持续重新 suspend。真实项目应使用 Suspense-enabled framework/data cache，或由更上层创建并复用 Promise。
        </p>
      </div>
    </div>
  );
}

export default ErrorBoundaryUseDemo;
`,li=`import { useDeferredValue, useMemo, useState, useTransition } from "react";

const ITEMS = Array.from({ length: 900 }, (_, index) => \`React learning item \${index + 1}\`);

function ExpensiveResults({ query }) {
  const normalized = query.trim().toLowerCase();
  const results = ITEMS.filter((item) => item.toLowerCase().includes(normalized));

  let checksum = 0;
  for (let i = 0; i < 180000; i += 1) checksum = (checksum + i) % 997;

  return (
    <div>
      <p style={{ fontSize: 12 }}>
        渲染查询：<code>{query || "(empty)"}</code> · 结果 {results.length} · CPU 模拟 checksum {checksum}
      </p>
      <ul>{results.slice(0, 8).map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

export function TransitionDeferredDemo() {
  const [tab, setTab] = useState("overview");
  const [visibleTab, setVisibleTab] = useState("overview");
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const tabContent = useMemo(() => {
    let total = 0;
    for (let i = 0; i < 650000; i += 1) total += i % 11;
    return \`\${visibleTab} · expensive render checksum \${total}\`;
  }, [visibleTab]);

  function selectTab(nextTab) {
    setTab(nextTab);
    startTransition(() => {
      setVisibleTab(nextTab);
    });
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🚦</span> Transition 与 Deferred UI：urgent update 先走</h2>
          </div>
          <span className="badge badge-blue">Concurrent UI</span>
        </div>
        <p className="demo-desc">
          Transition 标记“可以在后台完成”的 state update；<code>useDeferredValue</code> 则让某个值的消费 UI 暂时落后。两者都不是定时器。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> useTransition：立即选中 vs 后台内容更新</h3>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["overview", "metrics", "history"].map((name) => (
            <button key={name} type="button" className="btn" aria-pressed={tab === name} onClick={() => selectTab(name)}>{name}</button>
          ))}
        </div>
        <div className={isPending ? "demo-alert demo-alert-warning" : "demo-alert demo-alert-tip"} style={{ marginTop: 12 }}>
          <strong>isPending: {String(isPending)}</strong> · urgent tab = {tab} · committed content = {visibleTab}
        </div>
        <p>{tabContent}</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔎</span> useDeferredValue：输入保持即时，结果允许落后</h3>
        </div>
        <label>
          搜索
          <input className="form-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入 1、20、react…" />
        </label>
        <div style={{ opacity: isStale ? 0.55 : 1, marginTop: 12 }}>
          <div className="demo-alert">
            input value = <code>{query || "(empty)"}</code> · deferred value = <code>{deferredQuery || "(empty)"}</code> · stale = {String(isStale)}
          </div>
          <ExpensiveResults query={deferredQuery} />
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Deferred ≠ debounce</div>
          <p>Deferred 没有固定毫秒延迟，会尽快开始后台 render，且可被更紧急更新打断；它本身也不会减少网络请求。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">不要把受控 input 自身放进 Transition</div>
          <p>输入框 value 的更新应保持 urgent。把昂贵结果区、页面切换等非紧急更新放到 Transition/Deferred 层。</p>
        </div>
      </div>
    </div>
  );
}

export default TransitionDeferredDemo;
`,ui=`import { useEffect, useRef, useState } from "react";

function RenderedPreview({ label, renderRequest }) {
  const observedNodeRef = useRef(null);
  const [domMutationCount, setDomMutationCount] = useState(0);

  useEffect(() => {
    const node = observedNodeRef.current;
    if (!node || typeof MutationObserver === "undefined") return undefined;

    const observer = new MutationObserver((records) => {
      const textMutations = records.filter(
        (record) => record.type === "characterData" || record.type === "childList",
      ).length;

      if (textMutations > 0) {
        setDomMutationCount((count) => count + textMutations);
      }
    });

    observer.observe(node, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        padding: "16px",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        background: "var(--bg-surface-secondary)",
      }}
    >
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span className="badge badge-blue">Render 请求 #{renderRequest}</span>
        <span className="badge badge-green">目标 DOM mutation：{domMutationCount}</span>
      </div>

      <div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
          MutationObserver 只观察下面这个真实 DOM 节点：
        </div>
        <strong
          ref={observedNodeRef}
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: "var(--radius-xs)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
          }}
        >
          {label}
        </strong>
      </div>
    </div>
  );
}

export function RenderVsDomUpdateDemo() {
  const [renderRequest, setRenderRequest] = useState(1);
  const [label, setLabel] = useState("稳定的 DOM 内容");
  const [unrelated, setUnrelated] = useState(0);

  const triggerUnrelatedUpdate = () => {
    setUnrelated((value) => value + 1);
    setRenderRequest((value) => value + 1);
  };

  const changeDomContent = () => {
    setLabel((current) =>
      current === "稳定的 DOM 内容" ? "DOM 内容真的改变了" : "稳定的 DOM 内容",
    );
    setRenderRequest((value) => value + 1);
  };

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>⚙️</span> Re-render ≠ DOM Update
            </h2>
          </div>
          <span className="badge badge-green">性能心智模型</span>
        </div>

        <p className="demo-desc">
          React 的 render 是“调用组件并计算下一份 UI 描述”；commit 才负责把必要差异写入 DOM。
          因此组件重新执行，并不意味着对应 DOM 节点一定发生修改。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Trigger → Render → Commit</span>
          <span className="badge badge-gray">Minimal DOM Mutation</span>
          <span className="badge badge-gray">不要看到 re-render 就 memo</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验：触发 Render，但保持目标 DOM 内容不变
          </h3>
          <p className="demo-section-desc">
            “无关 State 更新”会让当前组件树再次执行 render，但传给目标节点的 <code>label</code>
            没变。观察目标 DOM mutation 是否增加；再点击“修改 DOM 内容”进行对照。
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <RenderedPreview label={label} renderRequest={renderRequest} />

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={triggerUnrelatedUpdate}>
              更新无关 State（当前 {unrelated}）
            </button>
            <button className="btn btn-secondary" onClick={changeDomContent}>
              修改目标 DOM 内容
            </button>
          </div>

          <div className="demo-alert demo-alert-info" style={{ margin: 0 }}>
            <div className="demo-alert-title">观察结论</div>
            <div>
              点击无关更新时，Render 请求编号继续增长，但目标节点文本没有变化，因此 React
              没必要改写这个节点。只有 <code>label</code> 真正改变时，MutationObserver 才会观察到对应 DOM mutation。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧭</span> 为什么这对性能优化很重要
          </h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 错误判断
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              DevTools 看到组件 re-render → 立刻给所有组件加 <code>memo</code>、<code>useMemo</code>、
              <code>useCallback</code>。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 正确流程
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              先判断交互是否真的慢 → 用 Profiler 找到昂贵 render → 再判断 memoization 是否能减少实际工作量。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>📌</span> 项目边界
        </div>
        <div>
          普通父子组件重新 render 通常不是问题。大型表格、复杂图表、富文本编辑器包装层等出现可测量的 render
          开销时，才值得继续进入 <code>memo</code>、引用稳定性和 Profiler。React Compiler 启用后还会自动承担大量 memoization 工作。
        </div>
      </div>
    </div>
  );
}

export default RenderVsDomUpdateDemo;
`,di=`import { useRef, useState } from "react";

const STABLE_FILTER = { status: "active" };
const stableHandler = () => "stable";

export function ReferenceEqualityDemo() {
  const [renderRound, setRenderRound] = useState(1);
  const freshObject = { status: "active" };
  const freshArray = ["react", "performance"];
  const freshHandler = () => "fresh";

  const previousRef = useRef({
    freshObject,
    freshArray,
    freshHandler,
    stableObject: STABLE_FILTER,
    stableHandler,
  });
  const [comparison, setComparison] = useState(null);

  const compareAndRenderAgain = () => {
    const previous = previousRef.current;

    setComparison({
      freshObject: Object.is(previous.freshObject, freshObject),
      freshArray: Object.is(previous.freshArray, freshArray),
      freshHandler: Object.is(previous.freshHandler, freshHandler),
      stableObject: Object.is(previous.stableObject, STABLE_FILTER),
      stableHandler: Object.is(previous.stableHandler, stableHandler),
    });

    previousRef.current = {
      freshObject,
      freshArray,
      freshHandler,
      stableObject: STABLE_FILTER,
      stableHandler,
    };
    setRenderRound((round) => round + 1);
  };

  const rows = comparison
    ? [
        ["组件内对象字面量 {}", comparison.freshObject, "每次 render 创建新对象"],
        ["组件内数组字面量 []", comparison.freshArray, "每次 render 创建新数组"],
        ["组件内箭头函数 () => {}", comparison.freshHandler, "每次 render 创建新函数"],
        ["组件外常量对象", comparison.stableObject, "模块加载时创建一次"],
        ["组件外函数", comparison.stableHandler, "模块加载时创建一次"],
      ]
    : [];

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🔗</span> Reference Equality：值相同 ≠ 引用相同
            </h2>
          </div>
          <span className="badge badge-purple">性能基础</span>
        </div>

        <p className="demo-desc">
          React 的依赖比较与默认 memo props 比较建立在引用身份之上。对象、数组和函数即使“内容看起来一样”，
          只要重新创建，就不是同一个引用。理解这一点，是学习 <code>memo</code>、<code>useMemo</code>、
          <code>useCallback</code> 和 Effect dependency 的基础。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Object.is</span>
          <span className="badge badge-gray">Object Identity</span>
          <span className="badge badge-gray">Props Stability</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验：跨两次 Render 比较引用身份
          </h3>
          <p className="demo-section-desc">
            当前为 Render Round #{renderRound}。点击按钮会先用 <code>Object.is</code> 比较“上一轮保存的引用”和“当前轮引用”，
            再触发下一轮 render。
          </p>
        </div>

        <button className="btn btn-primary" onClick={compareAndRenderAgain}>
          比较引用并触发下一次 Render
        </button>

        {comparison && (
          <div style={{ display: "grid", gap: "8px", marginTop: "16px" }}>
            {rows.map(([name, same, reason]) => (
              <div
                key={name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 1fr) auto minmax(180px, 1fr)",
                  gap: "12px",
                  alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-secondary)",
                }}
              >
                <strong style={{ fontSize: "13px" }}>{name}</strong>
                <span className={\`badge \${same ? "badge-green" : "badge-red"}\`}>
                  Object.is → {String(same)}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧠</span> 为什么“新引用”会让优化失效
          </h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 看起来一样</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{\`function Parent() {
  return <Child options={{ status: 'active' }} />;
}\`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>
              每次 Parent render 都会创建新的 <code>options</code> 对象。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 先判断是否真的需要稳定引用</div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              不要为了“引用稳定”自动加入 memoization。只有当下游的 <code>memo</code>、昂贵计算或 Effect dependency
              确实依赖稳定 identity，并且 Profiler 证明存在收益时，再选择合适的优化手段。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 项目判断标准</div>
        <div>
          Primitive 通常按值比较；对象、数组、函数按 identity 比较。新引用本身不是 Bug，也不等于性能问题。
          它只有在“引用身份参与某个协议”时才重要，例如 memoized child props、Hook dependency、缓存 key 或外部订阅配置。
        </div>
      </div>
    </div>
  );
}

export default ReferenceEqualityDemo;
`,fi=`import { memo, useMemo, useState } from "react";

const StablePrimitiveChild = memo(function StablePrimitiveChild({ theme }) {
  console.count("StablePrimitiveChild render");

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">✅ Primitive prop：memo 可命中</div>
      <div>
        当前 theme：<strong>{theme}</strong>。父组件因为无关 State 更新而重新 render 时，
        只要 theme 没变，这个子组件通常会跳过 render。
      </div>
    </div>
  );
});

const FreshObjectChild = memo(function FreshObjectChild({ options }) {
  console.count("FreshObjectChild render");

  return (
    <div className="demo-alert demo-alert-warning">
      <div className="demo-alert-title">⚠️ Fresh object prop：memo miss</div>
      <div>
        options.status = <strong>{options.status}</strong>。虽然内容相同，但父组件每次 render 都创建新对象，
        默认比较时 <code>Object.is(prevOptions, nextOptions)</code> 为 false。
      </div>
    </div>
  );
});

const StableObjectChild = memo(function StableObjectChild({ options }) {
  console.count("StableObjectChild render");

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">✅ Stable object prop：memo 可再次命中</div>
      <div>
        options.status = <strong>{options.status}</strong>。父组件使用 <code>useMemo</code> 保持引用稳定，
        因此无关 State 更新时可以跳过 render。
      </div>
    </div>
  );
});

export function ReactMemoDemo() {
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const [theme, setTheme] = useState("light");

  const freshOptions = { status: "active" };
  const stableOptions = useMemo(() => ({ status: "active" }), []);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧠</span> React.memo：命中、失效与 Props Identity
            </h2>
          </div>
          <span className="badge badge-purple">性能优化</span>
        </div>

        <p className="demo-desc">
          <code>memo</code> 的目标不是“禁止组件 render”，而是在父组件重新 render 时，
          当 props 与上一轮相同时跳过一次不必要的子组件 render。默认情况下，React 会逐个 prop 使用
          <code>Object.is</code> 比较；因此 primitive 值稳定时容易命中，而新建对象、数组、函数会改变 identity。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">memo</span>
          <span className="badge badge-gray">Object.is</span>
          <span className="badge badge-gray">Prop Identity</span>
          <span className="badge badge-gray">Profiler First</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验：同一次父 Render，观察三种 memo 结果
          </h3>
          <p className="demo-section-desc">
            打开浏览器 Console，观察三个子组件的 <code>console.count</code>。先连续点击“更新无关 State”，
            再切换 theme，对比 primitive prop、新对象 prop、稳定对象 prop 的 render 次数。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button className="btn btn-primary" onClick={() => setUnrelatedCount((count) => count + 1)}>
            更新无关 State：{unrelatedCount}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
          >
            切换 theme：{theme}
          </button>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          <StablePrimitiveChild theme={theme} />
          <FreshObjectChild options={freshOptions} />
          <StableObjectChild options={stableOptions} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔍</span> 可观察结果
          </h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> memo 包了就一定省 Render</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{\`const Child = memo(...);

function Parent() {
  return <Child options={{ status: 'active' }} />;
}\`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px", lineHeight: 1.7 }}>
              每次 Parent render 都创建新的 options；默认比较发现 prop identity 改变，因此 Child 仍会 render。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 先减少真正有成本的更新</div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              如果子组件 render 昂贵、父组件频繁更新、且多数时候 props 不变，memo 才更可能有收益。
              优先传递最小必要 props；只有确实需要稳定对象/函数 identity 时，再配合 useMemo/useCallback。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>📏</span> 真实项目边界</h3>
        </div>

        <div style={{ display: "grid", gap: "10px", fontSize: "13px", lineHeight: 1.75 }}>
          <div><strong>适合：</strong>昂贵可视化组件、大列表中的稳定行组件、频繁父更新但 props 很少变化的叶子节点。</div>
          <div><strong>不适合：</strong>组件本身很轻、props 几乎每次都变化、为了“看起来更专业”而全项目默认 memo。</div>
          <div><strong>注意：</strong>memo 不能阻止组件自己的 State 更新，也不能阻止其消费的 Context 更新。</div>
          <div><strong>判断：</strong>先用 React DevTools Profiler 找到真实热点，再决定是否加入手动 memoization。</div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 与 React Compiler 的关系</div>
        <div>
          当前 React Compiler 可以在构建期自动完成大量等价 memoization，因此新代码不应把手写 memo 当默认模板。
          本仓库当前没有启用 Compiler；本实验用于理解手动 memo 的运行模型，而不是声称项目必须这样优化。
        </div>
      </div>
    </div>
  );
}

export default ReactMemoDemo;
`,pi=`import { memo, useMemo, useState } from "react";

const DATASET = Array.from({ length: 6000 }, (_, index) => ({
  id: index + 1,
  name: \`React Item \${index + 1}\`,
  score: (index * 37) % 101,
}));

function expensiveFilter(items, query, threshold) {
  const startedAt = performance.now();
  const normalized = query.trim().toLowerCase();

  const result = items.filter((item) => {
    let syntheticWork = 0;
    for (let step = 0; step < 120; step += 1) {
      syntheticWork += (item.id * step) % 17;
    }

    return (
      syntheticWork >= 0 &&
      item.score >= threshold &&
      (!normalized || item.name.toLowerCase().includes(normalized))
    );
  });

  return {
    result,
    duration: performance.now() - startedAt,
  };
}

const ResultSummary = memo(function ResultSummary({ stats }) {
  console.count("ResultSummary render");
  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">📊 结果对象 identity 保持稳定时，memo child 可跳过无关 render</div>
      <div>
        匹配 <strong>{stats.count}</strong> 条；最近一次计算耗时约 <strong>{stats.duration.toFixed(2)} ms</strong>。
      </div>
    </div>
  );
});

export function UseMemoDemo() {
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(60);
  const [themeTick, setThemeTick] = useState(0);
  const [memoEnabled, setMemoEnabled] = useState(true);

  const directResult = memoEnabled ? null : expensiveFilter(DATASET, query, threshold);
  const memoResult = useMemo(
    () => expensiveFilter(DATASET, query, threshold),
    [query, threshold],
  );
  const activeResult = memoEnabled ? memoResult : directResult;

  const stats = useMemo(
    () => ({ count: activeResult.result.length, duration: activeResult.duration }),
    [activeResult],
  );

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧮</span> useMemo：缓存昂贵计算，而不是缓存一切</h2>
          </div>
          <span className="badge badge-purple">性能优化</span>
        </div>

        <p className="demo-desc">
          <code>useMemo</code> 在依赖未变化时复用上一轮计算结果。它适合已被测量证明昂贵的纯计算，
          也可在确有需要时保持对象 identity；它不是 correctness 工具，也不应包住所有普通表达式。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Expensive Calculation</span>
          <span className="badge badge-gray">Dependencies</span>
          <span className="badge badge-gray">Object.is</span>
          <span className="badge badge-gray">Stable Identity</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 实验：无关 Render 是否重复执行昂贵过滤</h3>
          <p className="demo-section-desc">
            数据集包含 6000 条记录。调整搜索词或阈值会改变真实依赖；点击“无关 Render”只更新与过滤无关的 State。
            切换 memo 开关后对比最近一次计算耗时，并观察 Console 中子组件 render 次数。
          </p>
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
          <label style={{ display: "grid", gap: "6px" }}>
            <span>搜索</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：React Item 42" />
          </label>

          <label style={{ display: "grid", gap: "6px" }}>
            <span>最低 score：{threshold}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
            />
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setThemeTick((value) => value + 1)}>
              无关 Render：{themeTick}
            </button>
            <button className="btn btn-secondary" onClick={() => setMemoEnabled((value) => !value)}>
              useMemo：{memoEnabled ? "开启" : "关闭"}
            </button>
          </div>
        </div>

        <ResultSummary stats={stats} />

        <div style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
          当前模式：<strong>{memoEnabled ? "缓存计算" : "每次 render 直接计算"}</strong>。
          在开发 StrictMode 下，React 可能额外调用纯计算来帮助发现副作用，因此不要把单次 console 次数当成生产性能结论。
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>⚖️</span> 正确做法 vs 反模式</h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 所有计算都 useMemo</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{\`const fullName = useMemo(
  () => firstName + ' ' + lastName,
  [firstName, lastName]
);\`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>普通字符串拼接通常远比 memoization 本身更便宜。</div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 已测量的昂贵纯计算</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{\`const visibleRows = useMemo(
  () => filterAndRank(rows, query),
  [rows, query]
);\`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>依赖不变时跳过真正有成本的重复工作。</div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 项目边界</div>
        <div>
          优先保证计算纯净和依赖完整，再用 Profiler/Performance 工具确认瓶颈。若只是为了避免 Effect 因对象依赖反复触发，
          通常先尝试把对象移进 Effect 或简化依赖；只有 identity 本身确实是接口契约时，才用 useMemo 保持稳定。
          React Compiler 启用后还会自动处理大量这类 memoization。
        </div>
      </div>
    </div>
  );
}

export default UseMemoDemo;
`,mi=`import { memo, useCallback, useState } from "react";

const MemoChild = memo(function MemoChild({ onAdd }) {
  console.count("MemoChild render");

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">🧒 memo 子组件</div>
      <div>
        当 <code>onAdd</code> 的引用与上一轮相同、且组件自身 State / Context 没有触发更新时，
        父组件的无关 Render 才有机会被 <code>memo</code> 跳过。
      </div>
      <button className="btn btn-secondary" onClick={onAdd} style={{ marginTop: "10px" }}>
        子组件调用 onAdd
      </button>
    </div>
  );
});

export function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [themeTick, setThemeTick] = useState(0);
  const [stable, setStable] = useState(true);

  const stableCallback = useCallback(() => {
    setCount((value) => value + 1);
  }, []);

  const unstableCallback = () => {
    setCount((value) => value + 1);
  };

  const activeCallback = stable ? stableCallback : unstableCallback;

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📞</span> useCallback：缓存函数 identity，不是让函数执行更快</h2>
          </div>
          <span className="badge badge-purple">性能优化</span>
        </div>

        <p className="demo-desc">
          每次 Render 中声明的函数通常都是新引用。<code>useCallback</code> 会在依赖未变化时返回缓存的函数定义，
          常见用途是配合 <code>memo</code> 子组件，或稳定其他 Hook / 自定义 Hook API 所依赖的函数 identity。
          它只应作为性能优化使用，不是 correctness 工具。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Function Identity</span>
          <span className="badge badge-gray">memo</span>
          <span className="badge badge-gray">Dependencies</span>
          <span className="badge badge-gray">Functional Updater</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 实验：函数 prop 是否让 memo 失效</h3>
          <p className="demo-section-desc">
            切换“稳定 callback / 每次新建函数”，再点击“无关 Render”。查看 Console 中
            <code>MemoChild render</code> 次数：稳定 callback 模式下，只有父级无关 State 改变时，子组件应能跳过 render；
            普通函数模式则会因为函数 prop identity 每轮变化而重新 render。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <button className="btn btn-primary" onClick={() => setThemeTick((value) => value + 1)}>
            无关 Render：{themeTick}
          </button>
          <button className="btn btn-secondary" onClick={() => setStable((value) => !value)}>
            当前：{stable ? "useCallback 缓存函数" : "普通函数每轮新建"}
          </button>
        </div>

        <div className="demo-alert demo-alert-tip" style={{ marginBottom: "12px" }}>
          <div className="demo-alert-title">🔎 观察方式</div>
          <div>
            当前模式：<strong>{stable ? "依赖不变时复用 callback identity" : "每次 Render 创建新 callback identity"}</strong>
          </div>
          <div>count：{count}</div>
          <div style={{ marginTop: 6 }}>
            不在 render 中通过 ref 记录“上一轮 callback”来证明 identity；那会为了教学观察而引入 render 阶段可变读写，反而破坏纯渲染示例。
          </div>
        </div>

        <MemoChild onAdd={activeCallback} />
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 为什么这里可以写空依赖</h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 读取 count，依赖不断变化</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{\`const add = useCallback(() => {
  setCount(count + 1);
}, [count]);\`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>
              count 改变后 callback identity 也会改变，可能让 memo child 再次 render。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 使用 updater function</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{\`const add = useCallback(() => {
  setCount(value => value + 1);
}, []);\`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>
              callback 不再读取当前 count，因此这个 reactive dependency 可以被移除。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 真实项目边界</div>
        <div>
          不要给所有事件函数机械套 <code>useCallback</code>。普通按钮 handler 通常不需要稳定 identity。
          当函数作为 memoized child 的 prop、其他 Hook 的 dependency，或自定义 Hook 对外 API 时，稳定引用才可能有价值。
          如果没有具体优化目标，直接声明普通函数更清晰；启用 React Compiler 的项目还会进一步减少手写 <code>useCallback</code> 的需要。
        </div>
      </div>
    </div>
  );
}

export default UseCallbackDemo;
`,hi=`import { Profiler, memo, useCallback, useMemo, useState } from "react";

const ROWS = Array.from({ length: 1800 }, (_, index) => ({
  id: index + 1,
  label: \`Item \${index + 1}\`,
}));

function ExpensiveList({ query }) {
  const normalized = query.trim().toLowerCase();
  const visibleRows = ROWS.filter((row) => {
    // 教学用 synthetic workload：让差异更容易被观察，不代表真实业务成本。
    let score = 0;
    for (let i = 0; i < 90; i += 1) score += (row.id * i) % 7;
    return score >= 0 && row.label.toLowerCase().includes(normalized);
  });

  return (
    <div style={{ maxHeight: "180px", overflow: "auto" }}>
      {visibleRows.slice(0, 80).map((row) => (
        <div key={row.id}>{row.label}</div>
      ))}
    </div>
  );
}

const MemoExpensiveList = memo(ExpensiveList);

function formatMs(value) {
  return \`\${value.toFixed(2)} ms\`;
}

export function ProfilerDemo() {
  const [query, setQuery] = useState("");
  const [themeTick, setThemeTick] = useState(0);
  const [memoized, setMemoized] = useState(false);
  const [samples, setSamples] = useState([]);

  const onRender = useCallback((id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    setSamples((current) => [
      {
        id: \`\${commitTime}-\${current.length}\`,
        treeId: id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      },
      ...current,
    ].slice(0, 8));
  }, []);

  const ListComponent = memoized ? MemoExpensiveList : ExpensiveList;
  const latest = samples[0] ?? null;
  const ratio = useMemo(() => {
    if (!latest || latest.baseDuration === 0) return null;
    return latest.actualDuration / latest.baseDuration;
  }, [latest]);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📈</span> Profiler：先测量，再决定是否优化</h2>
          </div>
          <span className="badge badge-purple">性能分析</span>
        </div>
        <p className="demo-desc">
          React 的 <code>&lt;Profiler&gt;</code> 会在被测子树 commit 时回调测量结果。重点不是追求某个固定毫秒数，
          而是比较“这次实际渲染成本”和“整棵子树无优化时的估算成本”，再定位值得优化的更新路径。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">actualDuration</span>
          <span className="badge badge-gray">baseDuration</span>
          <span className="badge badge-gray">commit</span>
          <span className="badge badge-gray">measure first</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 实验：相关更新 vs 无关父级 Render</h3>
          <p className="demo-section-desc">
            输入搜索会改变列表 props；“无关 Render”只改变父组件 State。切换 memo 后，观察无关更新时
            <code>actualDuration</code> 是否明显下降，并与 <code>baseDuration</code> 对照。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 Item 12"
            style={{ minWidth: "220px" }}
          />
          <button className="btn btn-primary" onClick={() => setThemeTick((value) => value + 1)}>
            无关 Render：{themeTick}
          </button>
          <button className="btn btn-secondary" onClick={() => setMemoized((value) => !value)}>
            当前：{memoized ? "memo 包裹列表" : "普通列表"}
          </button>
        </div>

        <Profiler id="ExpensiveList" onRender={onRender}>
          <ListComponent query={query} />
        </Profiler>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔎</span> 可观察结果</h3>
        </div>

        {latest ? (
          <div className="demo-alert demo-alert-tip" style={{ marginBottom: "12px" }}>
            <div className="demo-alert-title">最近一次 commit</div>
            <div>phase：<strong>{latest.phase}</strong></div>
            <div>actualDuration：<strong>{formatMs(latest.actualDuration)}</strong></div>
            <div>baseDuration：<strong>{formatMs(latest.baseDuration)}</strong></div>
            <div>
              actual / base：<strong>{ratio === null ? "-" : \`\${(ratio * 100).toFixed(1)}%\`}</strong>
            </div>
          </div>
        ) : null}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">phase</th>
                <th align="right">actual</th>
                <th align="right">base</th>
                <th align="right">commitTime</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample) => (
                <tr key={sample.id}>
                  <td>{sample.phase}</td>
                  <td align="right">{formatMs(sample.actualDuration)}</td>
                  <td align="right">{formatMs(sample.baseDuration)}</td>
                  <td align="right">{sample.commitTime.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="comparison-container">
        <div className="comparison-card bad">
          <div className="comparison-header bad"><span>❌</span> 先猜，再全局 memo</div>
          <div>看到 Render 次数多就机械加入 memo/useMemo/useCallback，既可能没有收益，也会增加认知成本。</div>
        </div>
        <div className="comparison-card good">
          <div className="comparison-header good"><span>✅</span> 先定位真实瓶颈</div>
          <div>先用 React DevTools Profiler / Performance tracks 找到慢更新和触发原因，再针对数据量、计算或 identity 做优化。</div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip" style={{ marginTop: "14px" }}>
        <div className="demo-alert-title"><span>📌</span> 真实项目边界</div>
        <div>
          本页为了教学故意制造 CPU 工作，数字会受开发模式、设备、浏览器和 StrictMode 影响，不能当性能基准。
          <code>&lt;Profiler&gt;</code> 适合程序化采样；实际排查优先使用 React DevTools Profiler，并在接近生产的构建和数据规模下复测。
        </div>
      </div>
    </div>
  );
}

export default ProfilerDemo;
`,gi=`import { memo, useMemo, useState } from "react";

const PRODUCTS = Array.from({ length: 1200 }, (_, index) => ({
  id: index + 1,
  name: \`Product \${index + 1}\`,
  price: (index % 37) + 10,
}));

const ProductList = memo(function ProductList({ products }) {
  console.count("ProductList render");
  return (
    <div style={{ maxHeight: "150px", overflow: "auto" }}>
      {products.slice(0, 30).map((product) => (
        <div key={product.id}>{product.name} · ¥{product.price}</div>
      ))}
    </div>
  );
});

function filterProducts(query) {
  const normalized = query.trim().toLowerCase();
  return PRODUCTS.filter((product) => product.name.toLowerCase().includes(normalized));
}

export function ReactCompilerDemo() {
  const [query, setQuery] = useState("");
  const [unrelated, setUnrelated] = useState(0);
  const [manualMemo, setManualMemo] = useState(false);

  const memoizedProducts = useMemo(() => filterProducts(query), [query]);
  const directProducts = filterProducts(query);
  const products = manualMemo ? memoizedProducts : directProducts;

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧠</span> React Compiler：把大量常规 memoization 交给构建期</h2>
          </div>
          <span className="badge badge-purple">React Compiler</span>
        </div>
        <p className="demo-desc">
          React Compiler 是构建期优化工具，会分析遵守 Rules of React 的组件和 Hook，并自动进行大量值、函数与组件级 memoization。
          React 官方文档将它描述为能减少手写 <code>memo</code>、<code>useMemo</code>、<code>useCallback</code> 的需要；
          它不会改变 React 的 State、Props、Context 或纯 Render 数据流规则。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">build-time</span>
          <span className="badge badge-gray">automatic memoization</span>
          <span className="badge badge-gray">Rules of React</span>
          <span className="badge badge-gray">incremental adoption</span>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip" style={{ marginBottom: "14px" }}>
        <div className="demo-alert-title">⚠️ 本仓库当前没有启用 React Compiler</div>
        <div>
          当前 <code>package.json</code> 没有 React Compiler/Babel 插件配置。因此下面实验只展示“没有 Compiler 时手工稳定 identity 的效果”，
          以及启用 Compiler 后应建立的心智模型；不会把本页的手工 memo 结果冒充成 Compiler 实际优化结果。
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 对照实验：手工 memoization 的维护成本</h3>
          <p className="demo-section-desc">
            <code>ProductList</code> 已用 <code>memo</code> 包裹。关闭手工 <code>useMemo</code> 时，每次父级 Render 都创建新数组，
            子组件 memo 因 props identity 改变而失效；开启后，无关父级更新可以复用数组 identity。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 Product 12"
            style={{ minWidth: "220px" }}
          />
          <button className="btn btn-primary" onClick={() => setUnrelated((value) => value + 1)}>
            无关 Render：{unrelated}
          </button>
          <button className="btn btn-secondary" onClick={() => setManualMemo((value) => !value)}>
            当前：{manualMemo ? "手工 useMemo" : "直接计算新数组"}
          </button>
        </div>

        <ProductList products={products} />
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔬</span> Compiler 改变的是优化责任，不是数据流规则</h3>
        </div>
        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 错误理解</div>
            <div>
              “有 Compiler 后就不需要理解引用相等、纯 Render、Hook 规则，或者所有手工 memo 都应该立刻删除。”
            </div>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 正确理解</div>
            <div>
              Compiler 依赖 Rules of React 做静态分析，并自动承担大量常规 memoization。已有手工 memoization 可以渐进评估；
              对需要明确 identity 契约或经测量确认的热点，仍可以保留有理由的手工优化。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🚦</span> "use memo" / "use no memo" 的边界</h3>
        </div>
        <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{\`function SearchResults() {
  "use memo";      // annotation 模式下用于显式 opt-in；infer 模式下也可强制编译
  // ...
}

function LegacyWidget() {
  "use no memo";   // opt-out；官方定位为调试/兼容迁移的临时逃生口
  // ...
}\`}</pre>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: "12px" }}>
          <div>
            默认应优先通过项目级 Compiler 配置决定 compilation mode。<code>"use memo"</code> 在 annotation 模式最有意义；
            <code>"use no memo"</code> 会覆盖编译模式并跳过该函数优化，官方建议谨慎且临时使用，并记录移除原因。
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 真实项目边界</div>
        <div>
          采用 Compiler 时，应先保证 Rules of React 与 lint 基线可靠，再用 Profiler 验证真实收益。对第三方库、旧代码和特殊性能热点采用渐进迁移；
          不应因为“用了 Compiler”就机械删除所有已有 memoization，也不应把手写 memoization 继续当成新代码的默认仪式。
        </div>
      </div>
    </div>
  );
}

export default ReactCompilerDemo;
`,_i=`import { useSyncExternalStore } from "react";

let value = 0;
let snapshot = { value, version: 0, listenerCount: 0 };
const listeners = new Set();

function notifySnapshotChange() {
  setTimeout(() => listeners.forEach((listener) => listener()), 0);
}

function emit(nextValue) {
  value = nextValue;
  snapshot = { value, version: snapshot.version + 1, listenerCount: listeners.size };
  notifySnapshotChange();
}

const counterStore = {
  subscribe(listener) {
    listeners.add(listener);
    snapshot = { ...snapshot, version: snapshot.version + 1, listenerCount: listeners.size };
    notifySnapshotChange();
    return () => {
      listeners.delete(listener);
      snapshot = { ...snapshot, version: snapshot.version + 1, listenerCount: listeners.size };
      notifySnapshotChange();
    };
  },
  getSnapshot() {
    return snapshot;
  },
  increment() {
    emit(value + 1);
  },
  reset() {
    emit(0);
  },
};

function StoreReader({ label }) {
  const current = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot);
  return (
    <div className="demo-alert demo-alert-tip">
      <strong>{label}</strong>
      <p>snapshot.value = {current.value} · version = {current.version}</p>
      <p>当前订阅者：{current.listenerCount}</p>
    </div>
  );
}

export function ExternalStoreDemo() {
  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📡</span> useSyncExternalStore：把 React 接到外部真源</h2><span className="badge badge-blue">Chapter 08</span></div>
        <p className="demo-desc">外部 Store 的值不归 React State 所有。React 通过 subscribe 得知“可能变了”，再调用 getSnapshot 读取快照；只有快照按 Object.is 真的变化时才需要更新 UI。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">subscribe</span><span className="badge badge-gray">getSnapshot</span><span className="badge badge-gray">Object.is</span><span className="badge badge-gray">unsubscribe</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> 两个组件订阅同一个 React 外部 Store</h3><p className="demo-section-desc">点击按钮直接修改 React 之外的 store。两个 Reader 不共享 React State，却都从同一 external source 读取一致快照。</p></div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}><button className="btn btn-primary" onClick={counterStore.increment}>externalStore.increment()</button><button className="btn" onClick={counterStore.reset}>reset</button></div>
        <div className="demo-grid-2"><StoreReader label="Reader A" /><StoreReader label="Reader B" /></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧠</span> getSnapshot 为什么不能每次都 return {'{ value }'}？</h3></div>
        <div className="demo-alert demo-alert-warning"><strong>反模式：</strong>如果 store 没变化时 getSnapshot 仍创建全新对象，React 会看到一个新的 identity。官方要求未变化期间重复调用 getSnapshot 必须返回相同值；可变 store 应缓存 immutable snapshot。</div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}><strong>正确模型：</strong>store 变化 → notify subscribers → React 再读 snapshot → Object.is 比较 → 必要时 render。</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🏗️</span> 真实项目选型边界</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert"><strong>React 自带能力优先</strong><p>局部 UI State 用 useState；复杂页面状态用 useReducer；跨子树传递用 Context。没有外部真源时不要为了“全局”两个字先加 Store。</p></div>
          <div className="demo-alert"><strong>外部 Store 何时有价值</strong><p>跨 React root、已有非 React store、浏览器 API、复杂全局领域状态、需要 devtools/middleware/selector 生态时再评估 Zustand / Redux Toolkit / Jotai。</p></div>
        </div>
        <div className="demo-alert demo-alert-tip"><strong>定位：</strong>Zustand 偏轻量 store + selectors；Redux Toolkit 偏约束化可预测状态流和成熟生态；Jotai 偏原子化依赖图。它们不是 React Core，也不是 Server State cache 的替代品。</div>
      </div>
    </div>
  );
}

export default ExternalStoreDemo;
`,vi=`import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SERIES = [[12, 24, 18], [8, 32, 21]];

function FakeChart({ series, seriesKey }) {
  const hostRef = useRef(null);
  const instanceId = \`series-\${seriesKey}\`;

  useEffect(() => {
    const host = hostRef.current;
    host.textContent = \`第三方 Chart 实例 \${instanceId} · \${series.join(" / ")}\`;

    return () => {
      host.textContent = "";
    };
  }, [instanceId, series]);

  const events = [
    ...(seriesKey > 0 ? [\`cleanup series-\${seriesKey - 1}\`] : []),
    \`setup \${instanceId}\`,
  ];

  return (
    <div>
      <div ref={hostRef} style={{ padding: 14, border: "1px dashed var(--border-color)", borderRadius: 8 }} />
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{events.slice(-6).join("\\n") || "等待 setup"}</pre>
    </div>
  );
}

export function PortalThirdPartyDemo() {
  const [open, setOpen] = useState(false);
  const [seriesKey, setSeriesKey] = useState(0);
  const series = SERIES[seriesKey % SERIES.length];

  return (
    <div onClick={() => console.log("React parent 收到 portal child 的冒泡事件") }>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🌀</span> Portal + 第三方 DOM：React Tree ≠ DOM Tree</h2><span className="badge badge-blue">Escape Hatch</span></div>
        <p className="demo-desc">Portal 只改变 DOM 的物理落点，React 关系仍留在原组件树中；第三方 DOM 实例则应由 ref 定位容器，并在 Effect 中 setup / cleanup。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> Portal 实验</h3></div>
        <button className="btn btn-primary" onClick={(event) => { event.stopPropagation(); setOpen(true); }}>打开 Portal</button>
        {open && createPortal(
          <div role="dialog" aria-modal="true" aria-label="Portal demo" style={{ position: "fixed", inset: 20, zIndex: 1000, display: "grid", placeItems: "center", background: "rgba(0,0,0,.45)" }}>
            <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-surface)", maxWidth: 520 }}>
              <h3>DOM 在 document.body，React 仍是当前组件的 child</h3>
              <p>Portal 内事件默认仍按 React tree 冒泡，而不是按 DOM tree 推断组件父子关系。</p>
              <button className="btn" onClick={() => setOpen(false)}>关闭</button>
            </div>
          </div>,
          document.body,
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>📈</span> 第三方 DOM 生命周期</h3><p className="demo-section-desc">模拟图表/地图/编辑器：依赖变化时 cleanup old → setup new；卸载时 cleanup，避免重复 listener、observer、worker 或实例泄漏。</p></div>
        <button className="btn" onClick={() => setSeriesKey((key) => key + 1)}>切换 series，触发重建</button>
        <div style={{ marginTop: 12 }}><FakeChart series={series} seriesKey={seriesKey} /></div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><strong>Portal 正确边界</strong><p>Modal / tooltip / popover 需要逃离 overflow、stacking context 时使用。Portal 不自动提供 focus trap、Escape、ARIA 或滚动锁。</p></div>
        <div className="demo-alert demo-alert-warning"><strong>第三方 DOM 反模式</strong><p>在 render 中直接 new Chart(...)、重复 addEventListener，或只 setup 不 destroy。Render 应保持纯净，外部系统同步进入 Effect。</p></div>
      </div>
    </div>
  );
}

export default PortalThirdPartyDemo;
`,yi=`import { useRef, useState } from "react";

const USERS = {
  ada: { id: "ada", name: "Ada", role: "Frontend" },
  lin: { id: "lin", name: "Lin", role: "Product" },
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUser(id) {
  await wait(700);
  return { ...USERS[id], fetchedAt: Date.now() };
}

export function ServerStateCacheDemo() {
  const cacheRef = useRef(new Map());
  const inFlightRef = useRef(new Map());
  const [userId, setUserId] = useState("ada");
  const [view, setView] = useState({ status: "idle", data: null, source: "—" });
  const [staleMs, setStaleMs] = useState(3000);
  const [requestCount, setRequestCount] = useState(0);
  const [cacheRows, setCacheRows] = useState([]);

  function publishCacheSnapshot() {
    const now = Date.now();
    setCacheRows(
      Array.from(cacheRef.current.entries()).map(([key, entry]) => ({
        key,
        age: now - entry.cachedAt,
        name: entry.data.name,
      })),
    );
  }

  async function load(id, { force = false } = {}) {
    setUserId(id);
    const key = \`user:\${id}\`;
    const cached = cacheRef.current.get(key);
    const fresh = cached && Date.now() - cached.cachedAt < staleMs;

    if (!force && fresh) {
      setView({ status: "success", data: cached.data, source: "fresh cache" });
      publishCacheSnapshot();
      return;
    }

    if (!force && inFlightRef.current.has(key)) {
      setView((current) => ({ ...current, status: "loading", source: "deduped: reuse in-flight promise" }));
      const data = await inFlightRef.current.get(key);
      setView({ status: "success", data, source: "shared in-flight result" });
      publishCacheSnapshot();
      return;
    }

    if (cached) setView({ status: "loading", data: cached.data, source: "stale cache shown while refetching" });
    else setView({ status: "loading", data: null, source: "network" });

    const promise = fetchUser(id);
    inFlightRef.current.set(key, promise);
    setRequestCount((count) => count + 1);
    try {
      const data = await promise;
      cacheRef.current.set(key, { data, cachedAt: Date.now() });
      setView({ status: "success", data, source: "network → cache" });
      publishCacheSnapshot();
    } finally {
      inFlightRef.current.delete(key);
    }
  }

  function invalidate() {
    const key = \`user:\${userId}\`;
    const entry = cacheRef.current.get(key);
    if (entry) cacheRef.current.set(key, { ...entry, cachedAt: 0 });
    setView((current) => ({ ...current, source: "invalidated: next read is stale" }));
    publishCacheSnapshot();
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🗄️</span> Server State：cache、stale、refetch、dedupe</h2><span className="badge badge-blue">Chapter 09</span></div>
        <p className="demo-desc">Server State 不是“后端返回后塞进 useState”这么简单。它通常由远端系统拥有，客户端维护的是带有 freshness、缓存、后台刷新、失败与并发语义的副本。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">query key</span><span className="badge badge-gray">stale</span><span className="badge badge-gray">refetch</span><span className="badge badge-gray">dedupe</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> 最小 Query Cache 模拟器</h3><p className="demo-section-desc">这是教学实现，不是 TanStack Query，也没有安装 <code>@tanstack/react-query</code>。用它观察成熟查询层为什么需要 query key、fresh/stale、in-flight dedupe 和 invalidation。</p></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button className="btn" onClick={() => load("ada")}>读取 Ada</button>
          <button className="btn" onClick={() => { load("ada"); load("ada"); }}>连续读取 Ada ×2</button>
          <button className="btn" onClick={() => load("lin")}>读取 Lin</button>
          <button className="btn" onClick={invalidate}>invalidate 当前 key</button>
          <button className="btn btn-primary" onClick={() => load(userId, { force: true })}>强制 refetch</button>
        </div>
        <label style={{ display: "block", marginTop: 14 }}>模拟 staleTime：{staleMs}ms <input type="range" min="0" max="8000" step="1000" value={staleMs} onChange={(e) => setStaleMs(Number(e.target.value))} /></label>
        <div className="demo-grid-2" style={{ marginTop: 14 }}>
          <div className="demo-alert demo-alert-tip"><strong>当前 query</strong><p>key: user:{userId}</p><p>status: {view.status}</p><p>source: {view.source}</p><p>实际 network request: {requestCount}</p>{view.data && <pre>{JSON.stringify(view.data, null, 2)}</pre>}</div>
          <div className="demo-alert"><strong>Cache snapshot</strong>{cacheRows.length === 0 ? <p>empty</p> : cacheRows.map((row) => <p key={row.key}>{row.key} → {row.name} · snapshot age {row.age}ms</p>)}</div>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><strong>Client State</strong><p>modal 是否打开、当前 tab、输入框草稿。通常由当前客户端直接拥有和修改。</p></div>
        <div className="demo-alert demo-alert-warning"><strong>Server State</strong><p>用户、订单、列表等远端资源。客户端只是缓存副本，需要考虑 freshness、同步、失败和并发。</p></div>
      </div>

      <div className="demo-alert demo-alert-tip"><strong>映射到 TanStack Query v5：</strong>queryKey 决定缓存身份；缓存数据默认立即视为 stale，<code>staleTime</code> 可以延长 fresh 窗口；<code>invalidateQueries</code> 会把匹配 query 标为 invalid/stale，并默认在 active query 上触发后台 refetch。真实库还处理 inactive cache 的 GC、retry、focus/reconnect refetch、结构共享等，本 Demo 不冒充这些行为。</div>
    </div>
  );
}

export default ServerStateCacheDemo;
`,bi=`import { useRef, useState } from "react";

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export function ServerStateMutationDemo() {
  const requestIdRef = useRef(0);
  const abortRef = useRef(null);
  const [result, setResult] = useState("尚未请求");
  const [logs, setLogs] = useState([]);
  const [items, setItems] = useState([{ id: 1, text: "已同步任务" }]);
  const [failNext, setFailNext] = useState(false);
  const [page, setPage] = useState(1);

  function log(message) {
    setLogs((rows) => [...rows.slice(-8), message]);
  }

  async function search(label, delay) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;
    log(\`start #\${requestId} \${label} (\${delay}ms)\`);
    try {
      await wait(delay, controller.signal);
      if (requestId !== requestIdRef.current) {
        log(\`ignore stale #\${requestId}\`);
        return;
      }
      setResult(\`\${label} · request #\${requestId}\`);
      log(\`commit #\${requestId}\`);
    } catch (error) {
      if (error.name === "AbortError") log(\`abort #\${requestId}\`);
      else log(\`error #\${requestId}: \${error.message}\`);
    }
  }

  async function optimisticAdd() {
    const temp = { id: \`temp-\${Date.now()}\`, text: "optimistic item", optimistic: true };
    setItems((rows) => [...rows, temp]);
    log("optimistic append");
    await wait(700);
    if (failNext) {
      setItems((rows) => rows.filter((item) => item.id !== temp.id));
      setFailNext(false);
      log("server failed → rollback");
      return;
    }
    setItems((rows) => rows.map((item) => item.id === temp.id ? { ...item, id: Date.now(), optimistic: false } : item));
    log("server success → confirm canonical item");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🏎️</span> 请求架构：race、cancellation、pagination、optimistic mutation</h2><span className="badge badge-blue">Server State</span></div>
        <p className="demo-desc">网络请求可能乱序、取消、失败和重试。成熟 Server State 层的价值，是把缓存与请求生命周期集中管理，而不是让每个组件重复拼装 Effect、loading、race guard 和 mutation 回滚逻辑。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>⚔️</span> Race + AbortController</h3><p className="demo-section-desc">先发一个慢请求，再立刻发快请求。这个教学实现主动 abort 旧请求；request id 仍作为 stale-result guard，演示“取消底层工作”和“忽略过期结果”是两个相关但不同的防线。</p></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button className="btn" onClick={() => search("slow-react", 1600)}>slow 1600ms</button><button className="btn btn-primary" onClick={() => search("fast-query", 400)}>fast 400ms</button><button className="btn" onClick={() => abortRef.current?.abort()}>cancel current</button></div>
        <div className="demo-grid-2" style={{ marginTop: 14 }}><div className="demo-alert demo-alert-tip"><strong>Committed result</strong><p>{result}</p></div><pre style={{ whiteSpace: "pre-wrap" }}>{logs.join("\\n")}</pre></div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>映射到 TanStack Query：</strong>queryFn 会收到 <code>AbortSignal</code>。只有 queryFn/底层请求实际消费这个 signal 时，网络 Promise 才会随取消协作终止；未消费 signal 的未使用 query 默认仍可完成并把结果留在 cache。</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>📄</span> Pagination 是 query identity 的一部分</h3></div>
        <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>上一页</button><span style={{ margin: "0 12px" }}>queryKey = ["projects", {'{'} page: {page} {'}'}]</span><button className="btn" onClick={() => setPage((p) => p + 1)}>下一页</button>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>真实查询层应把 page/cursor 纳入 query key。TanStack Query v5 可用 <code>placeholderData: keepPreviousData</code>（或等价 identity function）在新 key 请求期间继续显示上一页成功数据，并通过 <code>isPlaceholderData</code> 区分占位数据。</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>✨</span> Optimistic mutation：临时 UI → confirm / rollback</h3></div>
        <div style={{ display: "flex", gap: 8 }}><button className="btn btn-primary" onClick={optimisticAdd}>新增 optimistic item</button><button className="btn" aria-pressed={failNext} onClick={() => setFailNext((v) => !v)}>下次请求失败：{String(failNext)}</button></div>
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>{items.map((item) => <div key={item.id} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}><strong>{item.text}</strong>{item.optimistic && <span className="badge badge-gray" style={{ marginLeft: 8 }}>pending</span>}</div>)}</div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-warning"><strong>反模式</strong><p>每个页面都写 useEffect + fetch + loading + error + ignore flag + retry + cache。代码会快速演化成彼此不一致的数据层。</p></div>
        <div className="demo-alert demo-alert-tip"><strong>TanStack Query 心智</strong><p>query 负责读取与缓存生命周期；mutation 负责写入。成功后常见做法是 invalidate 相关 query 或直接 setQueryData。Optimistic UI 有两条主路：只在单个 UI 中展示时可利用 mutation variables；需要修改共享 cache 时通常在 onMutate 中 cancel 相关 refetch、snapshot 旧值、setQueryData，并在失败时 rollback。</p></div>
      </div>
    </div>
  );
}

export default ServerStateMutationDemo;
`,xi=`import { useMemo, useState } from "react";

const PRODUCTS = [
  { id: 1, name: "React 性能手册", category: "book" },
  { id: 2, name: "TypeScript 工程指南", category: "book" },
  { id: 3, name: "React 实验课程", category: "course" },
  { id: 4, name: "Web Accessibility 课程", category: "course" },
];

function readUrlState(search) {
  const params = new URLSearchParams(search);
  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "all",
  };
}

function writeUrlState({ query, category }) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category !== "all") params.set("category", category);
  const search = params.toString();
  return search ? \`?\${search}\` : "";
}

export function UrlStateDemo() {
  const [search, setSearch] = useState("?q=react&category=book");
  const { query, category } = readUrlState(search);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesQuery = !normalized || product.name.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  function updateUrlState(patch) {
    setSearch(writeUrlState({ query, category, ...patch }));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🔗</span> URL 也是页面状态：Params / Search Params</h2>
          </div>
          <span className="badge badge-blue">Router 心智模型</span>
        </div>
        <p className="demo-desc">
          Router 不只是“点击链接换组件”。URL 本身就是可复制、可刷新、可前进后退的页面状态容器。
          路径参数通常表达资源身份，Search Params 更适合搜索、筛选、排序、分页等页面视图状态。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">URL = 可持久化页面状态</span>
          <span className="badge badge-gray">Route Params</span>
          <span className="badge badge-gray">Search Params</span>
          <span className="badge badge-gray">Single Source of Truth</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> URL 状态实验台</h3>
          <p className="demo-section-desc">
            这里用 URLSearchParams 模拟 Router 的 search params。输入和筛选直接修改“URL”，列表再从 URL 派生；不会同时维护一份重复的 filter State。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>搜索关键字 q</label>
            <input
              className="form-input"
              value={query}
              onChange={(event) => updateUrlState({ query: event.target.value })}
              placeholder="例如 react"
            />

            <label style={{ display: "block", fontSize: 12, margin: "14px 0 6px" }}>分类 category</label>
            <select
              className="form-input"
              value={category}
              onChange={(event) => updateUrlState({ category: event.target.value })}
            >
              <option value="all">全部</option>
              <option value="book">图书</option>
              <option value="course">课程</option>
            </select>

            <button className="btn" style={{ marginTop: 14 }} onClick={() => setSearch("")}>重置 URL 状态</button>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>当前可分享 URL</div>
            <code style={{ display: "block", padding: 12, overflowWrap: "anywhere" }}>
              /products{search || "（无 search params）"}
            </code>
            <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
              {visibleProducts.length === 0 ? (
                <div className="demo-alert">没有匹配结果。URL 仍完整记录了当前筛选条件。</div>
              ) : visibleProducts.map((product) => (
                <div key={product.id} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}>
                  <strong>{product.name}</strong>
                  <span className="badge badge-gray" style={{ marginLeft: 8 }}>{product.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧭</span> Params 与 Search Params 怎么分工</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Route Params：资源身份</div>
            <code>/users/:userId</code><br />
            <code>/orders/:orderId</code>
            <p>通常决定“你正在看哪个资源”，是路由匹配的一部分。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Search Params：页面视图状态</div>
            <code>?q=react&page=2&sort=price</code>
            <p>适合搜索、过滤、排序、分页；刷新和分享链接后仍能恢复同一视图。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> 项目边界</div>
        <p>
          不要把所有 UI State 都塞进 URL。Modal 临时动画状态、输入法组合状态等通常留在组件内；
          但只要状态需要“刷新保持、链接分享、浏览器前进/后退恢复”，URL 往往比普通 useState 更合适。
        </p>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title"><span>⚠️</span> 常见反模式：双份真相</div>
        <p>
          同时维护 <code>searchParams</code> 和一套完全相同的 <code>filterState</code>，再用 Effect 双向同步，容易形成循环更新和状态漂移。
          优先选择一个 Source of Truth，再从它派生 UI。
        </p>
      </div>
    </div>
  );
}
`,Si=`import { useState } from "react";

const ROUTES = {
  "/dashboard": {
    label: "Dashboard index",
    matched: ["Root", "DashboardLayout", "DashboardHome"],
    child: "DashboardHome（index route）",
    note: "访问父路径本身时，index route 填入父级 Outlet。",
  },
  "/dashboard/settings": {
    label: "Settings",
    matched: ["Root", "DashboardLayout", "Settings"],
    child: "Settings",
    note: "settings 是 dashboard 的子路径，父布局继续保留，只替换 Outlet 内容。",
  },
  "/dashboard/projects/42": {
    label: "Project 42",
    matched: ["Root", "DashboardLayout", "ProjectLayout", "ProjectDetail"],
    child: "ProjectDetail（:projectId = 42）",
    note: "URL 层级可以映射为多层组件层级，每一层通过 Outlet 承接下一层。",
  },
  "/login": {
    label: "Login",
    matched: ["Root", "AuthLayout", "Login"],
    child: "Login",
    note: "AuthLayout 可以是无 path 的 layout route：共享 UI 布局，但不会给 URL 增加额外 segment。",
  },
};

function RouteTree({ matched }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {matched.map((name, index) => (
        <div
          key={name}
          style={{
            marginLeft: index * 18,
            padding: "10px 12px",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            background: index === matched.length - 1 ? "var(--bg-surface-secondary)" : undefined,
          }}
        >
          <strong>{name}</strong>
          {index < matched.length - 1 && (
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--text-muted)" }}>↓ Outlet</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function NestedRoutesDemo() {
  const [pathname, setPathname] = useState("/dashboard");
  const route = ROUTES[pathname];

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🪆</span> Nested Routes：URL 层级如何进入 Outlet</h2>
          </div>
          <span className="badge badge-blue">Router 架构</span>
        </div>
        <p className="demo-desc">
          嵌套路由把 URL 层级、组件层级和数据边界组织在同一棵 Route Tree 中。父路由负责共享布局，
          匹配到的子路由渲染进父级 Outlet；切换子页面时，不需要把整个页面壳重新建模。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Nested Route</span>
          <span className="badge badge-gray">Outlet</span>
          <span className="badge badge-gray">Index Route</span>
          <span className="badge badge-gray">Layout Route</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 路由树实验台</h3>
          <p className="demo-section-desc">
            仓库当前没有安装 React Router，因此这里不伪造 Router 运行时；用等价的 route match 结果直接观察“哪些布局保留、哪个子路由进入 Outlet”。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {Object.entries(ROUTES).map(([path, item]) => (
            <button
              key={path}
              type="button"
              className="btn"
              onClick={() => setPathname(path)}
              aria-pressed={pathname === path}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="demo-grid-2">
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>当前 URL</div>
            <code style={{ display: "block", padding: 12, marginBottom: 14 }}>{pathname}</code>
            <RouteTree matched={route.matched} />
          </div>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>最深层 Outlet 当前内容</div>
            <strong>{route.child}</strong>
            <p style={{ marginTop: 12 }}>{route.note}</p>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 16 }}>
              <div className="demo-alert-title">观察重点</div>
              <p>
                在 <code>/dashboard</code> 与 <code>/dashboard/settings</code> 之间切换时，
                <code>DashboardLayout</code> 仍属于两条 URL 的共同匹配链，变化的是它 Outlet 中的子页面。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 四个必须分清的概念</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Nested Route</div>
            <p>父路径会自动包含到子路径中，例如 dashboard + settings → <code>/dashboard/settings</code>。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Outlet</div>
            <p>父路由渲染共享 UI，Outlet 是匹配子路由的插槽；没有匹配子路由时可以为空。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Index Route</div>
            <p>当 URL 正好等于父路由路径时，index route 作为默认子页面渲染进 Outlet。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Layout Route</div>
            <p>无 path 的父 Route 可以只提供共享布局，不向 URL 添加新的 segment，例如登录/注册共用 AuthLayout。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title"><span>⚠️</span> 常见反模式：把所有布局塞进根组件条件判断</div>
        <p>
          当页面层级已经由 URL 决定，却在根组件里用大量路径判断手写侧栏、Header、权限区块条件，会把路由结构重新复制成第二套 UI 状态机。
          真实项目中应让 Route Tree 表达层级，让父布局和 Outlet 承担组合职责。
        </p>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> 项目边界</div>
        <p>
          URL 嵌套与 Layout 嵌套相关，但不是绝对一一对应：有时需要嵌套 URL 而不继承某个布局，也可能需要共享布局却不新增 URL segment。
          因此设计路由时要同时考虑 URL 信息架构和 UI 布局边界，而不是只按目录层级机械嵌套。
        </p>
      </div>
    </div>
  );
}
`,Ci=`import { useState } from "react";

const KNOWN_ROUTES = {
  "/": "Home",
  "/courses": "Courses",
  "/courses/react": "React Course",
  "/account": "Account",
};

export function NavigationBoundaryDemo() {
  const [history, setHistory] = useState(["/"]);
  const [index, setIndex] = useState(0);
  const [programmaticReason, setProgrammaticReason] = useState("—");

  const pathname = history[index];
  const matchedPage = KNOWN_ROUTES[pathname] ?? null;

  function navigate(to, { replace = false, reason = "用户点击链接" } = {}) {
    if (replace) {
      const next = [...history];
      next[index] = to;
      setHistory(next);
      setProgrammaticReason(\`\${reason}：replace 当前 history entry\`);
      return;
    }

    const next = [...history.slice(0, index + 1), to];
    setHistory(next);
    setIndex(next.length - 1);
    setProgrammaticReason(reason);
  }

  function go(delta) {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= history.length) return;
    setIndex(nextIndex);
    setProgrammaticReason(delta < 0 ? "浏览器 Back" : "浏览器 Forward");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧭</span> Navigation 与 Route Boundary</h2>
          </div>
          <span className="badge badge-blue">页面导航</span>
        </div>
        <p className="demo-desc">
          路由导航不只是“把 pathname 改掉”。真实应用还要区分声明式链接、程序式导航、history 前进后退，以及未匹配 URL 的 Not Found 边界。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Link / NavLink</span>
          <span className="badge badge-gray">useNavigate</span>
          <span className="badge badge-gray">redirect</span>
          <span className="badge badge-gray">History</span>
          <span className="badge badge-gray">Not Found</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> Navigation history 实验台</h3>
          <p className="demo-section-desc">
            这里用本地数组模拟浏览器 history，观察 push、replace、Back / Forward 的差异；真实 React Router 中普通用户导航优先使用 Link / NavLink。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {Object.keys(KNOWN_ROUTES).map((to) => (
            <button key={to} type="button" className="btn" onClick={() => navigate(to)}>
              {to}
            </button>
          ))}
          <button type="button" className="btn" onClick={() => navigate("/missing-page")}>
            打开不存在页面
          </button>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>当前 location</div>
            <code style={{ display: "block", padding: "10px 0" }}>{pathname}</code>
            {matchedPage ? (
              <div className="demo-alert demo-alert-tip">
                <div className="demo-alert-title">Matched route</div>
                <p>{matchedPage}</p>
              </div>
            ) : (
              <div className="demo-alert demo-alert-warning">
                <div className="demo-alert-title">404 / Not Found boundary</div>
                <p>当前 URL 没有业务路由匹配。应由路由层渲染明确的 Not Found 页面，而不是让应用静默空白。</p>
              </div>
            )}
          </div>

          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button type="button" className="btn" disabled={index === 0} onClick={() => go(-1)}>← Back</button>
              <button type="button" className="btn" disabled={index === history.length - 1} onClick={() => go(1)}>Forward →</button>
              <button
                type="button"
                className="btn"
                onClick={() => navigate("/account", { replace: true, reason: "登录完成后的重定向" })}
              >
                replace → /account
              </button>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>History stack</div>
            <div style={{ display: "grid", gap: 6 }}>
              {history.map((item, itemIndex) => (
                <div key={\`\${item}-\${itemIndex}\`} style={{ padding: 8, border: "1px solid var(--border-color)", borderRadius: 8 }}>
                  {itemIndex === index ? "→ " : "  "}{item}
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12, fontSize: 12 }}>最近导航原因：{programmaticReason}</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> Link、redirect、useNavigate 分工</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Link / NavLink</div>
            <p>用户主动点击去另一个页面时优先使用。它们保留标准链接语义；NavLink 额外暴露 active 状态，在 Data / Framework 模式还可暴露 pending 状态。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">redirect / useNavigate</div>
            <p>在 Data / Framework 模式中，如果跳转是 loader/action 数据流程的一部分，官方更推荐直接返回 <code>redirect</code>。<code>useNavigate</code> 更适合不由普通链接表达的客户端流程，例如超时退出、计时器结束，或 Declarative 模式下表单成功后的命令式跳转。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title"><span>⚠️</span> 常见反模式：按钮伪装链接</div>
        <p>
          如果行为本质是“导航到另一个 URL”，却统一使用按钮和 JavaScript 跳转，会丢失浏览器原生链接能力，例如右键菜单、在新标签页打开以及更自然的键盘/辅助技术语义。
          路由 API 应服从 Web 平台语义，而不是反过来。
        </p>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 本页是概念模拟</div>
        <p>当前仓库没有安装 React Router；按钮和本地数组只用于可视化 history 语义，不等同于真实 <code>Link</code>、<code>redirect</code>、<code>useNavigate</code> 运行时。</p>
      </div>
    </div>
  );
}
`,wi=`import { useState } from "react";

const USERS = {
  "1": { id: "1", name: "Ada", role: "Frontend Engineer" },
  "2": { id: "2", name: "Lin", role: "Product Engineer" },
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadUser(userId) {
  await wait(650);
  const user = USERS[userId];
  if (!user) {
    throw new Error("404 User Not Found");
  }
  return user;
}

export function RouteDataBoundaryDemo() {
  const [userId, setUserId] = useState("1");
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [trace, setTrace] = useState(["等待导航"]);

  async function navigateToUser(nextUserId) {
    setUserId(nextUserId);
    setStatus("loading");
    setData(null);
    setError(null);
    setTrace([
      \`1. match /users/\${nextUserId}\`,
      \`2. loader({ params: { userId: \${nextUserId} } })\`,
      "3. 等待 loader 结果",
    ]);

    try {
      const user = await loadUser(nextUserId);
      setData(user);
      setStatus("success");
      setTrace((items) => [...items, "4. loader 返回数据", "5. route component 使用 loader data 渲染"]);
    } catch (nextError) {
      setError(nextError.message);
      setStatus("error");
      setTrace((items) => [...items, "4. loader 抛出错误", "5. 最近的 route error boundary 接管 UI"]);
    }
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📦</span> Route Data Boundary：先匹配，再加载，再渲染</h2>
          </div>
          <span className="badge badge-blue">Data Router</span>
        </div>
        <p className="demo-desc">
          Data Router 把“这个 URL 需要什么数据”放到 route boundary 上。导航发生后先匹配路由并执行 loader，loader 完成后页面再消费数据；失败则交给最近的路由错误边界。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">loader</span>
          <span className="badge badge-gray">params</span>
          <span className="badge badge-gray">pending navigation</span>
          <span className="badge badge-gray">error boundary</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> Loader 生命周期实验台</h3>
          <p className="demo-section-desc">
            当前仓库没有 React Router，因此这里用同样的阶段顺序模拟 Data Router。重点观察数据职责属于 route，而不是每个页面都自行写一套 mount Effect。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <button type="button" className="btn" onClick={() => navigateToUser("1")}>/users/1</button>
          <button type="button" className="btn" onClick={() => navigateToUser("2")}>/users/2</button>
          <button type="button" className="btn" onClick={() => navigateToUser("404")}>/users/404</button>
        </div>

        <div className="demo-grid-2">
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>当前 route params</div>
            <code style={{ display: "block", padding: 12, marginBottom: 14 }}>{\`{ userId: "\${userId}" }\`}</code>
            <div style={{ display: "grid", gap: 8 }}>
              {trace.map((item) => (
                <div key={item} style={{ padding: 9, border: "1px solid var(--border-color)", borderRadius: 8 }}>{item}</div>
              ))}
            </div>
          </div>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>Route outlet 当前状态</div>
            {status === "idle" && <div className="demo-alert">选择一个用户路由开始实验。</div>}
            {status === "loading" && (
              <div className="demo-alert demo-alert-tip">
                <div className="demo-alert-title">Navigation pending</div>
                <p>下一页面 loader 正在执行。真实 Data Router 可通过 navigation state 显示全局或局部 pending UI。</p>
              </div>
            )}
            {status === "success" && data && (
              <div className="demo-alert demo-alert-tip">
                <div className="demo-alert-title">Loader data ready</div>
                <p><strong>{data.name}</strong></p>
                <p>{data.role}</p>
              </div>
            )}
            {status === "error" && (
              <div className="demo-alert demo-alert-warning">
                <div className="demo-alert-title">Route Error Boundary</div>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> Route loader 与组件 fetch 的架构差异</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Route boundary</div>
            <p>路由匹配已经知道页面身份，因此 loader 可以直接拿 params 加载页面必需数据，并与 navigation pending、错误边界、重定向等路由语义组合。</p>
          </div>
          <div className="demo-alert demo-alert-warning">
            <div className="demo-alert-title">每页 mount Effect 重复取数</div>
            <p>如果所有页面都在挂载后才各自 Effect → fetch，就需要重复实现 loading、错误、竞态、取消、导航协作等机制。复杂应用通常应由 Router 或 Server State 层承担这些职责。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> 与 TanStack Query 的边界</div>
        <p>
          Loader 解决“路由进入前需要什么数据”的页面边界问题；TanStack Query 更擅长 cache、stale、refetch、dedupe、mutation 等 Server State 生命周期。
          两者可以组合，不需要把它们理解成只能二选一。Chapter 09 会专门拆解这一层。
        </p>
      </div>
    </div>
  );
}
`,Ti=`import { useState } from "react";

export function AccessibilityBasicsDemo() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("尚未提交");

  function submit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("正在保存…");

    setTimeout(() => {
      if (!email.includes("@")) {
        setStatus("error");
        setMessage("请输入有效邮箱地址");
        return;
      }
      setStatus("success");
      setMessage(\`已保存 \${email}\`);
    }, 700);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>♿</span> 可访问性基础：语义、名称、键盘与状态反馈</h2>
          </div>
          <span className="badge badge-blue">Accessibility</span>
        </div>
        <p className="demo-desc">
          优先使用原生 HTML 语义，让浏览器先提供键盘、焦点和辅助技术能力；ARIA 用于补足语义，而不是替代原生元素。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 可访问表单状态实验</h3>
          <p className="demo-section-desc">只用键盘 Tab / Shift+Tab / Enter 完成操作，并观察 loading / error / success 都通过 live region 暴露。</p>
        </div>

        <form noValidate onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
          <label htmlFor="a11y-email">邮箱地址</label>
          <input
            id="a11y-email"
            className="form-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby="a11y-email-help"
          />
          <small id="a11y-email-help">用于接收 React 学习进度通知。</small>
          <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
            {status === "loading" ? "保存中…" : "保存"}
          </button>
        </form>

        <div
          role={status === "error" ? "alert" : "status"}
          aria-live={status === "error" ? "assertive" : "polite"}
          className={status === "error" ? "demo-alert demo-alert-warning" : "demo-alert demo-alert-tip"}
          style={{ marginTop: 16 }}
        >
          <strong>{message}</strong>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">优先原生语义</div>
          <p><code>&lt;button&gt;</code>、<code>&lt;label&gt;</code>、<code>&lt;nav&gt;</code> 等自带语义和交互行为，通常优于 div + role + 自己重写键盘逻辑。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">ARIA 不改变行为</div>
          <p>给 <code>div role="button"</code> 并不会自动获得 Enter/Space 行为、焦点规则或 disabled 语义；ARIA 主要描述语义状态。</p>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityBasicsDemo;
`,Ei=`import { useEffect, useRef, useState } from "react";

function Modal({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const focusable = Array.from(
      dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessible-modal-title"
        aria-describedby="accessible-modal-desc"
        style={{ background: "var(--bg-surface)", padding: 20, borderRadius: 12, maxWidth: 520, width: "100%" }}
      >
        <h3 id="accessible-modal-title">键盘可用的 Modal</h3>
        <p id="accessible-modal-desc">Tab/Shift+Tab 会留在对话框内，Escape 关闭；关闭后焦点回到打开按钮。</p>
        <label htmlFor="modal-note">备注</label>
        <input id="modal-note" className="form-input" placeholder="尝试按 Tab" />
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>保存并关闭</button>
          <button type="button" className="btn" onClick={onClose}>取消</button>
        </div>
      </section>
    </div>
  );
}

export function AccessibleModalDemo() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef(null);

  function closeModal() {
    setOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⌨️</span> Modal Focus：焦点必须进入、限制、再归还</h2>
          </div>
          <span className="badge badge-blue">Focus Management</span>
        </div>
        <p className="demo-desc">
          模态对话框不能只“视觉盖住页面”。WAI-ARIA Modal Dialog 模式要求焦点进入对话框、Tab/Shift+Tab 不逃出、Escape 可关闭，并在通常情况下关闭后把焦点归还到触发位置；模态期间背景内容还应真正不可交互。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 只用键盘完成实验</h3>
          <p className="demo-section-desc">打开后连续按 Tab / Shift+Tab，再按 Escape。这个教学实现重点演示初始焦点、焦点循环和焦点恢复。</p>
        </div>
        <button ref={openerRef} type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
          打开 Modal
        </button>
        {open && <Modal onClose={closeModal} />}
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Modal 的完整职责</div>
          <p>accessible name、合适的初始焦点、Tab 循环、Escape、关闭后的合理焦点位置，以及让背景内容在键盘、指针和辅助技术语义上不可交互。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">教学实现边界</div>
          <p>本 Demo 没有实现完整的 <code>inert</code>/background isolation、动态 focusable 列表、嵌套 dialog 与滚动锁定。<code>aria-modal="true"</code> 是语义声明，不应被当作自动禁用背景交互的实现。生产项目优先采用经过可访问性验证的 Dialog primitive。</p>
        </div>
      </div>
    </div>
  );
}

export default AccessibleModalDemo;
`,Di=`import { useState } from "react";

const LEVELS = [
  {
    id: "unit",
    title: "Vitest · Fast feedback",
    focus: "纯函数、Reducer、Hook 和可在测试环境中确定复现的逻辑",
    rule: "Vitest 是测试运行器，不等于只做 unit test；这里把它放在快速逻辑反馈层。",
  },
  {
    id: "integration",
    title: "React Testing Library · User-observable UI",
    focus: "用户如何看到、点击、输入，以及异步 UI 如何变化",
    rule: "Testing Library 不是固定的“integration test 层级”；核心原则是按用户可观察行为查询和断言 UI。",
  },
  {
    id: "e2e",
    title: "Playwright · Real browser E2E",
    focus: "真实浏览器中的关键业务路径、路由、网络、焦点与浏览器行为",
    rule: "把跨系统关键路径放进 E2E，不把所有组件细节都塞进浏览器测试。",
  },
];

export function TestingStrategyDemo() {
  const [active, setActive] = useState("integration");
  const [status, setStatus] = useState("idle");
  const selected = LEVELS.find((item) => item.id === active);

  async function simulateUserFlow() {
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 550));
    setStatus("success");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🧪</span> Testing：测试行为，而不是实现细节</h2><span className="badge badge-blue">Chapter 11</span></div>
        <p className="demo-desc">按反馈速度和系统边界组织测试组合：Vitest 提供测试运行环境，Testing Library 强调用户可观察 UI，Playwright 在真实浏览器覆盖关键端到端路径。工具与“unit / integration / E2E”并不是严格一一对应。</p>
      </div>
      <div className="demo-section">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{LEVELS.map((item) => <button key={item.id} className="btn" aria-pressed={active === item.id} onClick={() => setActive(item.id)}>{item.title}</button>)}</div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>{selected.title}</strong><p>{selected.focus}</p><p>{selected.rule}</p></div>
      </div>
      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 异步 UI 的用户视角</h3></div>
        <button className="btn btn-primary" disabled={status === "loading"} onClick={simulateUserFlow}>{status === "loading" ? "保存中…" : "保存资料"}</button>
        {status === "success" && <p role="status">保存成功</p>}
        <p className="demo-section-desc">RTL 应模拟点击并等待“保存成功”出现在可访问 UI 中，而不是断言内部 setState 调用了几次。</p>
      </div>
      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><strong>User-centric query</strong><p>优先 getByRole（通常结合 accessible name），表单控件可使用 getByLabelText；只有确实缺少合适语义查询时再退回 text/testid 等选择方式。</p></div>
        <div className="demo-alert demo-alert-warning"><strong>Mock 边界</strong><p>Mock 不稳定或昂贵的系统边界，例如网络、时间、第三方 SDK；不要 mock 掉被测组件真正需要协作的每一层，否则测试只证明 mock 自己。</p></div>
      </div>
      <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>反模式：</strong>通过 CSS class、组件实例、私有 State 或实现函数调用次数断言业务行为。重构实现而用户行为不变时，这类测试会产生无意义失败。</div>
    </div>
  );
}

export default TestingStrategyDemo;
`,Oi=`// Reference sample for CodeViewer. The repository does not install these test dependencies yet.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { TestingStrategyDemo } from "../TestingStrategyDemo";

test("user sees success after saving", async () => {
  const user = userEvent.setup();
  render(<TestingStrategyDemo />);

  await user.click(screen.getByRole("button", { name: "保存资料" }));

  expect(await screen.findByRole("status")).toHaveTextContent("保存成功");
});
`,ki=`// Reference sample for CodeViewer. The repository does not install Playwright yet.
import { expect, test } from "@playwright/test";

test("critical save flow works in a real browser", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Testing/ }).click();
  await page.getByRole("button", { name: "保存资料" }).click();
  await expect(page.getByRole("status")).toHaveText("保存成功");
});
`,Ai=`import { useRef, useState } from "react";

const TOPICS = {
  props: {
    title: "Props / children = component contract",
    detail: "为组件输入定义最小且稳定的 contract。children 通常用 ReactNode；只有确实要求单个 React element 时才收紧为 ReactElement。",
    boundary: "不要为了方便把业务 Props 写成 any，也不要试图用 TypeScript 强制 children 必须是某一种 JSX 标签。",
  },
  event: {
    title: "Event = 从 JSX 位置反推具体事件类型",
    detail: "输入框常见 ChangeEvent<HTMLInputElement>，表单常见 FormEvent<HTMLFormElement>；优先从 JSX handler 的 hover/inference 得到准确类型。",
    boundary: "不要统一写 Event 或 any，否则会丢失 currentTarget/value 等元素级信息。",
  },
  state: {
    title: "State = 让非法状态难以表达",
    detail: "简单 state 依赖推断；复杂异步状态优先 discriminated union，例如 idle/loading/success/error，而不是多个互相矛盾的 boolean。",
    boundary: "类型不是把每个 useState 都写满泛型；重点是状态模型和 transition contract。",
  },
  ref: {
    title: "Ref = 明确 imperative target",
    detail: "DOM ref 指向具体元素类型，例如 HTMLInputElement；初始值通常是 null，因此读取时必须处理尚未挂载的阶段。",
    boundary: "ref 是 escape hatch，不应因为有类型就把普通数据流迁移到 ref。",
  },
  generic: {
    title: "Generic = 保留调用方数据类型关系",
    detail: "泛型组件与 Hook 适合表达 items → renderItem、initialValue → currentValue 这类输入输出关联，而不是为了“高级”而泛型化。",
    boundary: "泛型参数必须表达真实关系；如果所有字段最终都退化为 unknown/any，抽象没有价值。",
  },
};

export function TypeScriptReactDemo() {
  const [topic, setTopic] = useState("props");
  const [name, setName] = useState("Lambert");
  const inputRef = useRef(null);
  const current = TOPICS[topic];

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🔷</span> TypeScript for React：类型写在边界，不是写满每一行</h2>
          <span className="badge badge-blue">TypeScript</span>
        </div>
        <p className="demo-desc">运行层保持 JSX；CodeViewer 提供真实 TSX 类型示例。重点观察 Props、children、event、state、ref 和 generic 如何描述组件之间的 contract。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧠</span> 选择一个类型边界</h3></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {Object.keys(TOPICS).map((key) => (
            <button key={key} type="button" className="btn" aria-pressed={topic === key} onClick={() => setTopic(key)}>{key}</button>
          ))}
        </div>
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">{current.title}</div>
          <p>{current.detail}</p>
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <div className="demo-alert-title">边界 / 反模式</div>
          <p>{current.boundary}</p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> 可观察实验：event + state + ref</h3></div>
        <label style={{ display: "grid", gap: 6, maxWidth: 360 }}>
          <span>开发者名称</span>
          <input ref={inputRef} value={name} onChange={(event) => setName(event.currentTarget.value)} />
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn" onClick={focusInput}>通过 ref 聚焦输入框</button>
          <button type="button" className="btn" onClick={() => setName("React Learner")}>更新 State</button>
        </div>
        <p style={{ marginTop: 12 }}>当前可观察 State：<strong>{name || "（空）"}</strong></p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🏗️</span> 真实项目边界</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">应该重点建模</div><p>公共组件 Props、领域状态 union、API/Domain 转换、复用 Hook 的输入输出关系。</p></div>
          <div className="demo-alert demo-alert-warning"><div className="demo-alert-title">不要过度建模</div><p>局部变量能推断就让 TypeScript 推断；不要为了“类型覆盖率”制造重复注解或把所有组件改成泛型。</p></div>
        </div>
      </div>
    </div>
  );
}

export default TypeScriptReactDemo;
`,ji=`import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

type ProfileCardProps = {
  name: string;
  children?: ReactNode;
  onRename?: (nextName: string) => void;
};

export function ProfileCard({ name, children, onRename }: ProfileCardProps) {
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRename?.(draft);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input ref={inputRef} value={draft} onChange={handleChange} />
      </label>
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus
      </button>
      <button type="submit">Save</button>
      {renderLoadState({ status: "success", data: children }, (content) => content)}
    </form>
  );
}

type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function renderLoadState<T>(state: LoadState<T>, renderData: (data: T) => ReactNode) {
  switch (state.status) {
    case "idle":
      return "尚未请求";
    case "loading":
      return "加载中…";
    case "success":
      return renderData(state.data);
    case "error":
      return \`失败：\${state.message}\`;
  }
}
`,Mi=`import { useState, type ReactNode } from "react";

type SelectListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onSelect: (item: T) => void;
};

export function SelectList<T>({ items, getKey, renderItem, onSelect }: SelectListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>
          <button type="button" onClick={() => onSelect(item)}>
            {renderItem(item)}
          </button>
        </li>
      ))}
    </ul>
  );
}

function useHistory<T>(initialValue: T) {
  const [current, setCurrent] = useState<T>(initialValue);
  const [history, setHistory] = useState<T[]>([initialValue]);

  function update(nextValue: T) {
    setCurrent(nextValue);
    setHistory((items) => [...items, nextValue]);
  }

  return { current, history, update } as const;
}

type User = { id: string; name: string };

const users: User[] = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Lin" },
];

export function Example() {
  const selected = useHistory<User | null>(null);

  return (
    <>
      <SelectList
        items={users}
        getKey={(user) => user.id}
        renderItem={(user) => user.name}
        onSelect={selected.update}
      />
      <p>Selected: {selected.current?.name ?? "none"}</p>
    </>
  );
}
`,Ni=`import { useMemo, useState } from "react";

const STRATEGIES = {
  csr: {
    name: "CSR / SPA",
    timeline: ["Server → minimal HTML shell", "Browser → load JS", "React → render UI on client", "Client Router → subsequent navigation"],
    strengths: "客户端交互模型直接，静态托管简单。",
    tradeoffs: "首屏内容依赖 JS；SEO、首屏性能和数据瀑布需要额外设计。",
  },
  ssg: {
    name: "SSG / Static Pre-rendering",
    timeline: ["Build time → execute data loading", "Generate HTML for known URLs", "CDN → return ready HTML", "Browser → hydrate if interactive"],
    strengths: "可缓存、部署简单，适合内容相对稳定页面。",
    tradeoffs: "动态性受构建/再验证策略约束；不是每个 URL 都适合预生成。",
  },
  ssr: {
    name: "SSR",
    timeline: ["Request → server render React tree", "Server → stream/send HTML", "Browser → display HTML", "Client → hydrate interactive boundaries"],
    strengths: "请求时可读取动态数据并先发送 HTML。",
    tradeoffs: "需要服务器运行时、缓存策略和 hydration 正确性。",
  },
};

export function RenderingStrategiesDemo() {
  const [strategy, setStrategy] = useState("ssr");
  const item = STRATEGIES[strategy];
  const rows = useMemo(() => Object.entries(STRATEGIES), []);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🌐</span> CSR / SPA / SSG / SSR：谁在什么时候生成 HTML？</h2>
          <span className="badge badge-blue">Rendering Strategy</span>
        </div>
        <p className="demo-desc">React 提供客户端渲染、服务端渲染和 hydration 等底层能力；SSG、路由、数据加载和部署策略通常由框架组合。不要把“React”与“某个 React 框架的默认策略”混为一谈。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 切换渲染策略观察时间线</h3>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {rows.map(([key, value]) => (
            <button key={key} type="button" className="btn" aria-pressed={strategy === key} onClick={() => setStrategy(key)}>{value.name}</button>
          ))}
        </div>
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 8 }}>
            {item.timeline.map((step, index) => <div key={step} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}><strong>{index + 1}.</strong> {step}</div>)}
          </div>
          <div>
            <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">适合点</div><p>{item.strengths}</p></div>
            <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><div className="demo-alert-title">代价</div><p>{item.tradeoffs}</p></div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧠</span> 关键边界</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">React Core</div><p><code>createRoot</code>、<code>hydrateRoot</code>、<code>react-dom/server</code> streaming APIs 等是底层能力。</p></div>
          <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Framework</div><p>路由、数据加载、build-time prerender、部署适配、缓存和 Server/Client module graph 通常由框架负责。</p></div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning"><div className="demo-alert-title">反模式：用 SPA / SSR 二选一描述整个产品</div><p>真实应用可以按路由混合策略：静态页预渲染、动态页 SSR、局部交互 hydration、后续导航客户端执行。先定义页面数据与更新频率，再选渲染策略。</p></div>
    </div>
  );
}

export default RenderingStrategiesDemo;
`,Pi=`import { useMemo, useState } from "react";

const SERVER_HTML = '<button id="buy">购买 · $99</button>';

export function HydrationStreamingDemo() {
  const [clientPrice, setClientPrice] = useState(99);
  const [hydrated, setHydrated] = useState(false);
  const [revealed, setRevealed] = useState(1);
  const clientHtml = \`<button id="buy">购买 · $\${clientPrice}</button>\`;
  const matches = SERVER_HTML === clientHtml;

  const chunks = useMemo(() => [
    "① shell: <header> + product title",
    "② Suspense fallback: reviews loading…",
    "③ reviews boundary resolves → stream replacement content",
  ], []);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>💧</span> Server HTML → Hydration → Interactive</h2>
          <span className="badge badge-blue">hydrateRoot / Streaming</span>
        </div>
        <p className="demo-desc">SSR 先生成 HTML；hydration 是让客户端 React 接管已有的服务端 HTML，使同一初始 UI 获得 React 交互能力。用于 hydration 的客户端首次 render 应与服务端输出一致，mismatch 应被当作需要修复的 bug。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> Hydration mismatch 实验</h3><p className="demo-section-desc">把客户端首屏价格改成与服务端不同，观察为什么这不是普通的“稍后更新”。</p></div>
        <div className="demo-grid-2">
          <div>
            <label htmlFor="hydration-client-price" style={{ display: "block", marginBottom: 6 }}>客户端首屏 price</label>
            <input id="hydration-client-price" className="form-input" type="number" value={clientPrice} onChange={(event) => { setClientPrice(Number(event.target.value)); setHydrated(false); }} />
            <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setHydrated(true)}>模拟 hydrateRoot</button>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Server HTML</div><code style={{ display: "block", padding: 8 }}>{SERVER_HTML}</code>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>Client first render</div><code style={{ display: "block", padding: 8 }}>{clientHtml}</code>
            <div className={\`demo-alert \${matches ? "demo-alert-tip" : "demo-alert-warning"}\`} style={{ marginTop: 12 }}><strong>{matches ? "MATCH" : "MISMATCH"}</strong><p>{matches ? "客户端可基于同一初始 UI hydrate 服务端标记。" : "真实 hydrateRoot 会报告 hydration mismatch；React 不保证修补所有不一致（例如某些属性差异），因此不能把 mismatch 当成业务同步机制。"}</p></div>
            {hydrated && <p><strong>交互状态：</strong>{matches ? "hydrated / interactive" : "hydration correctness violated"}</p>}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🌊</span> Streaming SSR：先 shell，再逐步 reveal</h3></div>
        <div style={{ display: "grid", gap: 8 }}>
          {chunks.slice(0, revealed).map((chunk) => <div key={chunk} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}>{chunk}</div>)}
        </div>
        <button type="button" className="btn" style={{ marginTop: 12 }} disabled={revealed === chunks.length} onClick={() => setRevealed((value) => Math.min(chunks.length, value + 1))}>流式发送下一段</button>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><p>Node.js Stream 环境优先使用 <code>renderToPipeableStream</code>；Deno、现代 edge runtime 等 Web Streams 环境使用 <code>renderToReadableStream</code>。Node.js 也提供 ReadableStream 兼容能力，但 React 官方仍建议 Node 使用专用的 pipeable API。两类 API 解决的是“HTML 如何边生成边发送”，不是 RSC 的同义词。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning"><div className="demo-alert-title">常见 mismatch 来源</div><p>render 中直接读取 <code>Date.now()</code>、随机数、仅浏览器存在且首屏两端取值不同的数据，或服务端与客户端使用不同初始数据。正确做法是让用于 hydration 的首次输出可重现；若确实需要不同的客户端内容，再使用明确的 hydration 后更新策略。</p></div>
    </div>
  );
}

export default HydrationStreamingDemo;
`,Fi=`import { useState } from "react";

const MODULES = [
  { name: "ProductPage.server", side: "server", canState: false, canDb: true, shipped: false },
  { name: "Price.server", side: "server", canState: false, canDb: true, shipped: false },
  { name: "AddToCart.client", side: "client", canState: true, canDb: false, shipped: true },
  { name: "CartCount.client", side: "client", canState: true, canDb: false, shipped: true },
];

export function RscBoundaryDemo() {
  const [selected, setSelected] = useState(MODULES[0]);
  const [payloadStep, setPayloadStep] = useState(0);
  const payload = [
    "Server Component executes in the RSC server environment",
    "RSC payload describes rendered server result + client references",
    "Framework/SSR layer may use that result to produce initial HTML",
    "Browser loads referenced Client Component JS and hydrates interactive UI",
  ];

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🧱</span> React Server Components：Server / Client Boundary</h2>
          <span className="badge badge-blue">RSC</span>
        </div>
        <p className="demo-desc">Server Components 会在客户端应用与传统 SSR renderer 之外的 RSC 环境中提前执行，其组件实现不会作为该 Server Component 的客户端模块发送。需要 state、Effect、事件处理或浏览器 API 的模块进入 Client Component graph。<code>"use client"</code> 定义客户端模块边界，而 <code>"use server"</code> 标记 Server Function，不是 Server Component。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> Module graph 边界实验</h3></div>
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 8 }}>
            {MODULES.map((module) => <button key={module.name} type="button" className="btn" aria-pressed={selected.name === module.name} onClick={() => setSelected(module)}>{module.side === "server" ? "🖥️" : "🌐"} {module.name}</button>)}
          </div>
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <strong>{selected.name}</strong>
            <p>模块边界：{selected.side}</p>
            <p>可使用 useState / browser event：<strong>{String(selected.canState)}</strong></p>
            <p>可直接访问 server data layer：<strong>{String(selected.canDb)}</strong></p>
            <p>组件模块进入浏览器 JS graph：<strong>{String(selected.shipped)}</strong></p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>📦</span> RSC payload 心智时间线</h3></div>
        <div style={{ display: "grid", gap: 8 }}>
          {payload.slice(0, payloadStep + 1).map((line, index) => <div key={line} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}><strong>{index + 1}.</strong> {line}</div>)}
        </div>
        <button className="btn" type="button" style={{ marginTop: 12 }} disabled={payloadStep === payload.length - 1} onClick={() => setPayloadStep((value) => Math.min(payload.length - 1, value + 1))}>下一阶段</button>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Server Component</div><p>适合在 RSC 环境读取服务端数据、减少发送到客户端的组件代码，并把非交互工作留在服务端。React 官方说明它们可以在 build time 或 request time 执行。</p></div>
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Client Component</div><p>承担 state、Effects、event handlers 与浏览器 API。<code>"use client"</code> 标记的是模块依赖图边界；在支持 RSC + SSR 的框架里，Client Component 的初始 UI 仍可能参与服务端预渲染，之后再由客户端 JS hydration，因此“Client Component”不等于“首屏只在浏览器生成 HTML”。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}><div className="demo-alert-title">反模式：把 RSC 等同 SSR</div><p>SSR 讨论“React UI 如何在服务器输出 HTML，并由客户端 hydration”；RSC 讨论“哪些组件在哪个 RSC 环境执行、哪些模块进入客户端 graph，以及如何通过 RSC payload 组合结果”。框架可以把两层组合在一次页面请求里，但它们不是同一层能力。</p></div>
    </div>
  );
}

export default RscBoundaryDemo;
`,Ii=`import { useState } from "react";

const LAYERS = [
  {
    id: "react",
    title: "React Core / React DOM",
    items: ["Components / Hooks", "hydrateRoot", "renderToPipeableStream / renderToReadableStream", "RSC / Server Function primitives"],
  },
  {
    id: "router",
    title: "React Router Framework Mode",
    items: ["routes", "loaders / actions", "CSR / SSR config", "static pre-rendering", "deployment adapters"],
  },
  {
    id: "next",
    title: "Next.js App Router",
    items: ["file-system routing", "Server / Client Component graph", "cache / revalidation", "Server Function / Action integration", "build / runtime conventions"],
  },
];

export function ServerFunctionsFrameworkDemo() {
  const [layer, setLayer] = useState("react");
  const [authorized, setAuthorized] = useState(false);
  const selected = LAYERS.find((item) => item.id === layer);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🏗️</span> Server Functions 与 Framework 职责边界</h2>
          <span className="badge badge-blue">Architecture Boundary</span>
        </div>
        <p className="demo-desc">React 19 的 Server Function 允许 Client Component 调用在服务器执行的 async 函数；框架负责把这个用户模型落地成 module transform、server reference、请求协议、路由、缓存、部署和安全集成。当前 React 文档只在 Server Function 被传给 <code>action</code> prop 或从 Action 内调用时称其为 Server Action；不是所有 Server Function 都是 Server Action。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🔐</span> Server Function 不是“可信客户端调用”</h3></div>
        <div className="demo-grid-2">
          <div>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
              模拟服务端已验证当前用户权限
            </label>
            <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => {}}>调用 updateOrder() Server Function</button>
          </div>
          <div className={\`demo-alert \${authorized ? "demo-alert-tip" : "demo-alert-warning"}\`}>
            <div className="demo-alert-title">Server-side decision</div>
            <p>{authorized ? "允许 mutation：服务端重新验证身份、授权和输入后执行。" : "拒绝 mutation：客户端参数、函数引用或 UI 状态都不能代替服务端授权。"}</p>
          </div>
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>React 官方要求把 Server Function 参数视为不可信输入，并在服务端验证 mutation 权限。<code>"use server"</code> 只能用于 async Server Function；它不是“这个组件在服务器渲染”的指令。直接从事件代码调用 Server Function 时应位于 Transition 中；当它传给 <code>&lt;form action&gt;</code> / <code>formAction</code> 时，React 会按 Action 语义调用。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧭</span> React 与 Framework 谁负责什么？</h3></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {LAYERS.map((item) => <button key={item.id} type="button" className="btn" aria-pressed={layer === item.id} onClick={() => setLayer(item.id)}>{item.title}</button>)}
        </div>
        <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
          <h4 style={{ marginTop: 0 }}>{selected.title}</h4>
          <ul>{selected.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">React Router Framework Mode</div><p>官方当前文档提供 CSR、SSR 和 static pre-rendering 三类 rendering strategy；Framework Mode 在路由/data APIs 之上增加构建、server rendering/pre-rendering 和部署约定。不要把这些框架能力写成 React Core API。</p></div>
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Next.js App Router</div><p>把 React Server/Client Component 模型与文件路由、数据/缓存策略、Server Function/Action 集成和部署运行时组合成具体框架。学习时应区分“React primitive/user model”与“Next.js policy/API”。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}><div className="demo-alert-title">真实项目边界</div><p>除非你正在写框架或自定义 bundler，否则不要自己拼 RSC protocol。React 官方明确说明：RSC / Server Function 的用户模型在 React 19 稳定，但实现这些能力的 bundler/framework 底层 API 在 React 19.x minor 之间不遵循 semver。</p></div>
    </div>
  );
}

export default ServerFunctionsFrameworkDemo;
`,Li=[{id:`components`,name:`组件通信与插槽`,icon:`🧩`},{id:`render-model`,name:`事件、State 与渲染模型`,icon:`🔁`},{id:`state`,name:`状态管理与演进`,icon:`⚡`},{id:`effects`,name:`Hooks 与副作用深度`,icon:`🎣`},{id:`forms`,name:`Forms 与 React 19 Actions`,icon:`📝`},{id:`async-ui`,name:`Suspense 与并发 UI`,icon:`⏳`},{id:`performance`,name:`性能模型与优化`,icon:`🚀`},{id:`external`,name:`外部 Store 与第三方系统`,icon:`📡`},{id:`server-state`,name:`Server State 与请求架构`,icon:`🗄️`},{id:`routing`,name:`Router 与页面状态`,icon:`🧭`},{id:`accessibility`,name:`Accessibility`,icon:`♿`},{id:`testing`,name:`Testing 与质量边界`,icon:`🧪`},{id:`typescript`,name:`TypeScript for React`,icon:`🔷`},{id:`server-react`,name:`SSR、RSC 与 Framework`,icon:`🖥️`}],Ri=[{id:`component-jsx-pure-render`,label:`Component、JSX 与纯渲染`,category:`components`,badge:`基础`,description:`组件作为 UI 构建块、JSX 表达式、Fragment、组件树与纯渲染约束`,Component:x,files:[{name:`ComponentJsxPureRenderDemo.jsx`,code:Sr}]},{id:`props`,label:`Props 基础与解构`,category:`components`,badge:`基础`,description:`单向只读数据流、对象解构默认值回退、展开语法与派生计算`,Component:C,files:[{name:`PropsBasicsDemo.jsx`,code:Cr},{name:`UserCard.jsx`,code:wr},{name:`ProductCard.jsx`,code:Tr}]},{id:`children`,label:`Children 默认插槽`,category:`components`,badge:`组合`,description:`React 组合模式（Composition），容器布局与可插拔子节点解耦`,Component:re,files:[{name:`ChildrenSlotDemo.jsx`,code:Er},{name:`CardContainer.jsx`,code:Dr},{name:`ModalLayout.jsx`,code:Or}]},{id:`multi-slots`,label:`具名多插槽客制化`,category:`components`,badge:`规范`,description:`生产级多插槽三态协议（默认模板 + 局部覆盖 + 显式隐藏）`,Component:le,files:[{name:`MultiSlotsDemo.jsx`,code:kr},{name:`ProductionModal.jsx`,code:Ar},{name:`Pannel.jsx`,code:jr}]},{id:`conditional-rendering`,label:`条件渲染与业务四态`,category:`components`,badge:`分支`,description:`用 if、early return、三元表达式与 && 将 loading/empty/error/success 清晰映射为 UI`,Component:de,files:[{name:`ConditionalRenderingDemo.jsx`,code:Mr}]},{id:`rendering-lists-key`,label:`列表渲染与 key 身份`,category:`components`,badge:`核心`,description:`通过可编辑列表排序实验理解 stable key、index key 与组件 State 身份匹配`,Component:D,files:[{name:`RenderingListsKeyDemo.jsx`,code:Nr}]},{id:`prop-drilling`,label:`属性逐层透传解法`,category:`components`,badge:`解耦`,description:`对比逐层透传 (Drilling)、组件组合 (Children) 与 Context API`,Component:Se,files:[{name:`PropDrillingDemo.jsx`,code:Pr}]},{id:`event-propagation`,label:`Event Handler 与事件传播`,category:`render-model`,badge:`事件`,description:`观察 handler 传递、capture/bubble、stopPropagation、preventDefault 与 Event/Effect 的职责边界`,Component:Ce,files:[{name:`EventPropagationDemo.jsx`,code:Fr}]},{id:`state-snapshot-queue`,label:`State Snapshot、Batching 与 Update Queue`,category:`render-model`,badge:`核心`,description:`把 useState、snapshot、batching 与 functional updater 的不可见时序变成可观察日志`,Component:we,files:[{name:`StateSnapshotQueueDemo.jsx`,code:Ir}]},{id:`immutable-state`,label:`对象 / 数组 State 不可变更新`,category:`render-model`,badge:`不可变`,description:`观察 nested copy、append/remove/replace/sort 与 reference identity，理解为什么 mutation 会破坏更新模型`,Component:De,files:[{name:`ImmutableStateDemo.jsx`,code:Lr}]},{id:`render-commit`,label:`Trigger → Render → Commit`,category:`render-model`,badge:`渲染模型`,description:`区分触发、Render、Commit 与 Browser Paint，并观察 render 不等于 DOM 一定变化`,Component:Oe,files:[{name:`RenderCommitDemo.jsx`,code:Rr}]},{id:`state-dry`,label:`State 结构设计与单一数据源`,category:`state`,badge:`核心`,description:`避免矛盾、冗余、重复与过深 State，通过派生计算和扁平化降低同步风险`,Component:Me,files:[{name:`StateDryDemo.jsx`,code:zr}]},{id:`controlled-uncontrolled`,label:`受控与非受控组件`,category:`state`,badge:`所有权`,description:`从组件 API 理解 State ownership：value + onChange 与 defaultValue 的边界`,Component:Fe,files:[{name:`ControlledUncontrolledDemo.jsx`,code:Br}]},{id:`lifting-state-up`,label:`状态提升与协同联动`,category:`state`,badge:`协同`,description:`兄弟组件状态共享、受控输入与向最近共同祖先提升`,Component:Be,files:[{name:`LiftingStateUpDemo.jsx`,code:Vr}]},{id:`preserving-resetting-state`,label:`State 保留、重置与 key 身份`,category:`state`,badge:`身份`,description:`可视化 State 与 render tree 位置的绑定，以及 key 如何显式切换组件身份并重置子树`,Component:We,files:[{name:`PreservingResettingStateDemo.jsx`,code:Hr}]},{id:`state-reducer`,label:`useReducer 状态机模式`,category:`state`,badge:`架构`,description:`将更新逻辑集中为纯函数 Reducer，规范复杂状态与行为审计`,Component:qe,files:[{name:`StateReducerDemo.jsx`,code:Ur}]},{id:`context-propagation`,label:`Context 更新传播模型`,category:`state`,badge:`订阅`,description:`可视化 useContext 订阅、Provider value 更新传播，以及 memo 与 Context 的真实边界`,Component:$e,files:[{name:`ContextPropagationDemo.jsx`,code:Wr}]},{id:`use-reduce-with-context`,label:`Reducer + Context 双通道优化`,category:`state`,badge:`进阶`,description:`拆分 State 与 Dispatch 上下文，缩小只消费 dispatch 节点的更新范围`,Component:lt,files:[{name:`UseReduceWithContextDemo.jsx`,code:Gr}]},{id:`use-ref`,label:`useRef 引用与 DOM 控制`,category:`effects`,badge:`引用`,description:`DOM 访问、可变值持久化与纯函数渲染期的引用安全守则`,Component:ut,files:[{name:`UseRefDemo.jsx`,code:Kr}]},{id:`use-effect-correct-usage`,label:`useEffect 正确用法与心智`,category:`effects`,badge:`同步`,description:`与外部系统同步、定时器与事件监听的清理函数 (Cleanup) 闭环`,Component:ft,files:[{name:`UseEffectCorrectUsageDemo.jsx`,code:qr}]},{id:`not-need-effect`,label:`无需 Effect 的常见反模式`,category:`effects`,badge:`避坑`,description:`官方避坑指南：衍生数据计算、用户事件触发与依赖同步陷阱`,Component:mt,files:[{name:`NotNeedEffectDemo.jsx`,code:Jr}]},{id:`lifecycle-of-reactive-effects`,label:`响应式 Effect 生命周期与依赖`,category:`effects`,badge:`深度`,description:`响应式值追踪、依赖闭环、使用 Ref 与函数式更新解耦依赖`,Component:gt,files:[{name:`LifecycleOfReactiveEffectsDemo.jsx`,code:Yr}]},{id:`event-vs-effect`,label:`Event vs Effect 因果边界`,category:`effects`,badge:`核心`,description:`区分用户动作与外部系统同步，避免用 State + Effect 间接编排业务事件`,Component:vt,files:[{name:`EventVsEffectDemo.jsx`,code:Xr}]},{id:`effect-event`,label:`useEffectEvent 非响应式逻辑`,category:`effects`,badge:`React 19.2`,description:`读取最新 committed props/state，同时避免无关值变化导致 Effect 重新同步`,Component:bt,files:[{name:`EffectEventDemo.jsx`,code:Zr}]},{id:`custom-hooks`,label:`Custom Hooks 复用状态逻辑`,category:`effects`,badge:`抽象`,description:`复用 stateful logic 与 Effect 封装，同时保持每次 Hook 调用的 State 独立`,Component:wt,files:[{name:`CustomHooksDemo.jsx`,code:Qr}]},{id:`advanced-ref`,label:`Layout Effect 与高级 Ref`,category:`effects`,badge:`P2`,description:`布局测量、imperative handle、React 19 ref-as-prop 与 forwardRef 历史边界`,Component:Et,files:[{name:`AdvancedRefDemo.jsx`,code:$r}]},{id:`controlled-form`,label:`Controlled Form 与实时校验`,category:`forms`,badge:`基础`,description:`input / textarea / select / checkbox / radio 的受控数据流、派生校验与提交快照`,Component:Ot,files:[{name:`ControlledFormDemo.jsx`,code:ei}]},{id:`form-data-modeling`,label:`FormData 与提交状态建模`,category:`forms`,badge:`建模`,description:`非受控字段、提交时读取 FormData、get/getAll 与领域 payload 转换`,Component:kt,files:[{name:`FormDataModelingDemo.jsx`,code:ti}]},{id:`form-action`,label:`React 19 form action / formAction`,category:`forms`,badge:`React 19`,description:`函数 action、按钮级 formAction、FormData 与异步 Action / Transition 提交模型`,Component:jt,files:[{name:`FormActionDemo.jsx`,code:ni}]},{id:`action-state-form-status`,label:`useActionState + useFormStatus`,category:`forms`,badge:`状态`,description:`Action 结果状态、previousState、isPending 与表单后代组件读取 pending/data`,Component:Lt,files:[{name:`ActionStateFormStatusDemo.jsx`,code:ri}]},{id:`optimistic-update`,label:`useOptimistic 成功收敛与失败回退`,category:`forms`,badge:`Optimistic`,description:`Action 期间的临时 optimistic state、服务器成功确认与失败自动回退`,Component:Vt,files:[{name:`OptimisticUpdateDemo.jsx`,code:ii}]},{id:`lazy-suspense`,label:`lazy + Suspense 与 Code Splitting`,category:`async-ui`,badge:`加载`,description:`观察首次 lazy module 加载、Suspense fallback 与模块缓存边界`,Component:qt,files:[{name:`LazySuspenseDemo.jsx`,code:ai},{name:`LazyLessonPanel.jsx`,code:oi}]},{id:`suspense-boundary`,label:`Suspense Boundary 与 Nested Reveal`,category:`async-ui`,badge:`Boundary`,description:`对比单一与嵌套 Suspense boundary，观察不同资源准备速度如何影响 reveal sequence`,Component:Qt,files:[{name:`SuspenseBoundaryDemo.jsx`,code:si}]},{id:`error-boundary-use`,label:`Error Boundary + React 19 use`,category:`async-ui`,badge:`React 19`,description:`观察 Promise pending → Suspense、rejected → Error Boundary，并理解稳定 Promise/缓存要求`,Component:nn,files:[{name:`ErrorBoundaryUseDemo.jsx`,code:ci}]},{id:`transition-deferred`,label:`Transition Pending 与 Deferred UI`,category:`async-ui`,badge:`并发`,description:`观察 urgent update、isPending、后台 render、deferred stale UI，并区分 useDeferredValue 与 debounce`,Component:on,files:[{name:`TransitionDeferredDemo.jsx`,code:li}]},{id:`render-vs-dom-update`,label:`Re-render ≠ DOM Update`,category:`performance`,badge:`核心`,description:`用 MutationObserver 对照 Render 与 Commit，建立先测量再优化的性能心智模型`,Component:cn,files:[{name:`RenderVsDomUpdateDemo.jsx`,code:ui}]},{id:`reference-equality`,label:`Reference Equality 引用身份`,category:`performance`,badge:`基础`,description:`用 Object.is 对比对象、数组、函数跨 Render 的 identity，理解 memo 与 Hook dependencies 的基础`,Component:dn,files:[{name:`ReferenceEqualityDemo.jsx`,code:di}]},{id:`react-memo`,label:`React.memo 命中与失效`,category:`performance`,badge:`优化`,description:`对比 primitive、新对象与稳定对象 props，观察 memo 的命中条件和 identity 陷阱`,Component:hn,files:[{name:`ReactMemoDemo.jsx`,code:fi}]},{id:`use-memo`,label:`useMemo 昂贵计算缓存`,category:`performance`,badge:`优化`,description:`对比缓存与直接计算，观察依赖变化、昂贵计算与稳定 identity 的真实使用边界`,Component:yn,files:[{name:`UseMemoDemo.jsx`,code:pi}]},{id:`use-callback`,label:`useCallback 函数引用稳定`,category:`performance`,badge:`优化`,description:`联动 memo child 观察函数 prop identity，理解 useCallback 的命中条件、updater function 与真实边界`,Component:xn,files:[{name:`UseCallbackDemo.jsx`,code:mi}]},{id:`profiler`,label:`Profiler 先测量再优化`,category:`performance`,badge:`分析`,description:`用 Profiler actualDuration/baseDuration 观察 commit 成本，建立先定位瓶颈再优化的流程`,Component:En,files:[{name:`ProfilerDemo.jsx`,code:hi}]},{id:`react-compiler`,label:`React Compiler 自动优化模型`,category:`performance`,badge:`Compiler`,description:`理解构建期自动 memoization、Rules of React、渐进采用与手工 memoization 的新边界`,Component:An,files:[{name:`ReactCompilerDemo.jsx`,code:gi}]},{id:`external-store`,label:`useSyncExternalStore 外部订阅`,category:`external`,badge:`Store`,description:`可视化 subscribe/getSnapshot、snapshot identity、unsubscribe 与外部状态选型边界`,Component:Rn,files:[{name:`ExternalStoreDemo.jsx`,code:_i}]},{id:`portal-third-party`,label:`Portal 与第三方 DOM 生命周期`,category:`external`,badge:`集成`,description:`观察 React Tree 与 DOM Tree 差异，并用 ref + Effect setup/cleanup 管理第三方 DOM 实例`,Component:Vn,files:[{name:`PortalThirdPartyDemo.jsx`,code:vi}]},{id:`server-state-cache`,label:`Server State Cache 生命周期`,category:`server-state`,badge:`Cache`,description:`区分 Client/Server State，可视化 query key、fresh/stale、refetch、in-flight dedupe 与 invalidation`,Component:Gn,files:[{name:`ServerStateCacheDemo.jsx`,code:yi}]},{id:`server-state-mutation`,label:`请求竞态、取消与 Optimistic Mutation`,category:`server-state`,badge:`Mutation`,description:`观察 Abort cancellation、race guard、pagination query identity、optimistic confirm/rollback`,Component:qn,files:[{name:`ServerStateMutationDemo.jsx`,code:bi}]},{id:`url-state`,label:`URL 状态与 Search Params`,category:`routing`,badge:`核心`,description:`把 URL 作为可分享、可刷新、可前进后退的页面状态来源，区分 Route Params 与 Search Params`,Component:Zn,files:[{name:`UrlStateDemo.jsx`,code:xi}]},{id:`nested-routes`,label:`Nested Routes 与 Outlet`,category:`routing`,badge:`架构`,description:`可视化父子 Route 匹配链、Outlet 插槽、Index Route 与无 path Layout Route 的职责边界`,Component:er,files:[{name:`NestedRoutesDemo.jsx`,code:Si}]},{id:`navigation-boundary`,label:`Navigation 与 Route Boundary`,category:`routing`,badge:`导航`,description:`区分声明式链接与程序式导航，可视化 history push/replace/back/forward 与 Not Found 边界`,Component:nr,files:[{name:`NavigationBoundaryDemo.jsx`,code:Ci}]},{id:`route-data-boundary`,label:`Route Loader 数据边界`,category:`routing`,badge:`数据`,description:`可视化 route match → loader(params) → pending → loader data / nearest error boundary 的页面数据流程`,Component:or,files:[{name:`RouteDataBoundaryDemo.jsx`,code:wi}]},{id:`accessibility-basics`,label:`语义、Label 与可访问状态反馈`,category:`accessibility`,badge:`基础`,description:`使用原生语义、accessible name、键盘操作与 live region 构建可感知的 loading/error/success UI`,Component:sr,files:[{name:`AccessibilityBasicsDemo.jsx`,code:Ti}]},{id:`accessible-modal`,label:`Modal Focus 与键盘边界`,category:`accessibility`,badge:`Focus`,description:`可视化 dialog accessible name、初始焦点、Tab trap、Escape 与关闭后的焦点恢复`,Component:lr,files:[{name:`AccessibleModalDemo.jsx`,code:Ei}]},{id:`testing-strategy`,label:`Vitest / RTL / Playwright 测试分层`,category:`testing`,badge:`工程`,description:`以用户行为为中心理解 unit、integration、E2E 分工、异步查询与 mock 边界`,Component:dr,files:[{name:`TestingStrategyDemo.jsx`,code:Di},{name:`behavior.test.jsx`,code:Oi},{name:`app.spec.js`,code:ki}]},{id:`typescript-react`,label:`TypeScript for React 类型边界`,category:`typescript`,badge:`工程`,description:`用 Props/children/event/state/ref/generic 建立组件 contract，运行 JSX 实验并查看真实 TSX 类型源码`,Component:pr,files:[{name:`TypeScriptReactDemo.jsx`,code:Ai},{name:`react-boundaries.tsx`,code:ji},{name:`generic-patterns.tsx`,code:Mi}]},{id:`rendering-strategies`,label:`CSR / SSG / SSR 渲染策略`,category:`server-react`,badge:`架构`,description:`区分客户端渲染、静态预渲染与请求时 SSR，理解 React Core 与 framework rendering policy 的边界`,Component:hr,files:[{name:`RenderingStrategiesDemo.jsx`,code:Ni}]},{id:`hydration-streaming`,label:`Hydration 与 Streaming SSR`,category:`server-react`,badge:`SSR`,description:`可视化 server HTML → hydrate → interactive、hydration mismatch 与 shell/Suspense streaming 时间线`,Component:_r,files:[{name:`HydrationStreamingDemo.jsx`,code:Pi}]},{id:`rsc-boundary`,label:`RSC Server / Client Boundary`,category:`server-react`,badge:`RSC`,description:`观察 Server Component、Client Component、RSC payload 与客户端 bundle 边界，区分 RSC 和 SSR`,Component:yr,files:[{name:`RscBoundaryDemo.jsx`,code:Fi}]},{id:`server-functions-framework`,label:`Server Functions 与 Framework 边界`,category:`server-react`,badge:`React 19`,description:`区分 Server Function、Server Action、React primitive 与 React Router / Next.js framework responsibility`,Component:xr,files:[{name:`ServerFunctionsFrameworkDemo.jsx`,code:Ii}]}],zi={1:{title:`Chapter 01 · UI 与组件模型`,questions:[`为什么 React 要求组件 Render 保持纯净？StrictMode 为什么更容易暴露非纯逻辑？`,`Props 的只读约束与单向数据流分别解决什么问题？什么时候 callback prop 比把 State 下放更合适？`,`children / named slot 与“大而全配置对象”相比，什么时候组合 API 更容易维护？`,`为什么稳定 key 影响的是组件身份，而不只是列表渲染性能？排序后使用 index key 可能出现什么错位？`,`当组件出现多层 Props 传递时，如何判断应该继续透传、改用 Composition，还是引入 Context？`],exercises:[`把一个同时负责数据判断、布局和操作按钮的卡片拆成 2–3 个可组合组件；要求不新增全局 State，并说明每个组件的最小 Props contract。`,`实现一个可编辑列表，先用 index 作为 key，再切换为稳定 id；在插入、删除、排序后记录输入框局部 State 的差异。`,`选择现有一个条件分支较多的 Demo，把 loading / empty / error / success 重构成更易读的 early-return 或局部组件结构。`]},2:{title:`Chapter 02 · 事件、State 与渲染模型`,questions:[`为什么一次 Event Handler 里调用 setState 后，当前变量不会立刻变成新值？`,`连续三次 setCount(count + 1) 与连续三次 functional updater 的结果为什么不同？`,`什么情况下 functional updater 是必要的，什么情况下它并不能解决 stale closure？`,`对象或数组 State 直接 mutation 为什么会破坏 React 的更新推理和调试能力？`,`Trigger、Render、Commit、Browser Paint 分别发生什么？为什么 Render 并不等于 DOM 一定改变？`],exercises:[`先不运行代码，预测 StateSnapshotQueueDemo 中普通更新、functional updater、timer 三组操作的日志顺序，再实际验证。`,`写一个包含 nested object 和 array 的 State 更新案例，故意加入一次 mutation，再改成不可变更新并比较可观察结果。`,`为一个按钮点击流程画出 Trigger → Render → Commit 时间线，标出事件闭包读取的 snapshot 与 DOM 真正更新的位置。`]},3:{title:`Chapter 03 · State 建模与状态架构`,questions:[`如何判断一个值应该成为 State，还是应该从现有 Props/State 派生计算？`,`为什么 contradictory / duplicate State 会让状态机出现非法组合？`,`受控组件与非受控组件的核心差异为什么是 State ownership，而不只是 input 写法不同？`,`State 为什么与组件在树中的位置绑定？什么时候应该通过 key 主动 reset？`,`useReducer、Context、Reducer + Context 分别解决什么问题？拆分 State/Dispatch Context 又不能保证什么？`],exercises:[`找一个包含多个 boolean 状态的 Demo，把它重构成更明确的状态模型，并列出重构前可能出现的非法组合。`,`实现一个可受控也可非受控的 Tabs 小组件，分别设计 value/onChange 与 defaultValue API。`,`实现一个联系人草稿切换实验：先保留错误草稿，再使用 key 或状态提升让 reset 行为符合产品需求。`]},4:{title:`Chapter 04 · Ref、Effect 与 Escape Hatches`,questions:[`Effect 为什么应该理解为外部系统同步，而不是通用的‘状态变化后做点什么’？`,`如何判断一段逻辑属于 Event Handler，而不是 Effect？`,`Effect dependency 表达的是什么关系？为什么不能把 dependency array 当运行次数开关？`,`useEffectEvent 解决的是哪类 non-reactive logic？为什么它不能用来逃避真实依赖？`,`Ref、useLayoutEffect、useImperativeHandle 分别在哪些 escape-hatch 场景合理，什么时候说明数据流设计出了问题？`],exercises:[`找一个可以用派生计算或 Event Handler 替代的 Effect，并重构掉它；记录删除 Effect 后少了哪些同步风险。`,`实现一个 window 事件订阅或 timer Hook，反复挂载/卸载并验证 setup/cleanup 数量不会累积。`,`设计一个只暴露 focus() 或 scrollToTop() 的 imperative API；限制暴露能力，不直接把整个 DOM node 交给父组件。`]},5:{title:`Chapter 05 · Forms 与 React 19 Actions`,questions:[`受控字段 State、FormData、提交结果 State 分别适合承载什么信息？哪些数据不应该重复存储？`,`React 19 的 form action 与普通 onSubmit 的心智模型有什么不同？`,`useActionState 的 previousState、返回值和 pending 状态如何组成 mutation 流程？`,`useFormStatus 为什么必须从 form 后代读取？它适合控制哪些提交 UI？`,`什么操作适合 optimistic UI，为什么支付、权限、库存锁定通常应该更保守？`],exercises:[`实现一个包含成功、业务失败和重复提交保护的表单；不要维护重复的 derived error State。`,`给一个列表 mutation 增加 optimistic 状态和失败回退，要求 canonical state 始终保持最终真源。`,`比较同一表单用 controlled fields 与提交时 FormData 两种实现，写出各自更适合的场景。`]},6:{title:`Chapter 06 · Suspense 与并发 UI`,questions:[`lazy 与 Suspense 分别负责什么？Suspense 为什么不等于任意 fetch 的 loading 管理器？`,`单一 Suspense Boundary 与 nested boundaries 会怎样改变 reveal sequence 和用户体验？`,`Error Boundary 能捕获哪些错误，为什么事件处理器里的异步错误不属于同一条路径？`,`Transition 中哪些更新应该保持 urgent？为什么受控 input 的 value 不应该直接放进 Transition？`,`useDeferredValue 与 debounce 的目标和时序模型有什么根本区别？`,`React 19 use(Promise) 为什么要求稳定/缓存的 Promise，而不应在 Render 中随意新建 Promise？`],exercises:[`给一个包含两个慢区域的页面设计两种 Suspense Boundary 划分方案，并实际比较 fallback/reveal 行为。`,`实现一个输入即时、结果区域可延后的搜索实验；分别尝试 useDeferredValue 与手写 debounce，并记录差异。`,`构造一个 render error 与一个 event-handler error，对比 Error Boundary 是否接管，并解释观察结果。`]},7:{title:`Chapter 07 · 性能模型与优化`,questions:[`为什么父组件 Render 通常会让子组件重新执行，但这不代表 DOM 一定更新？`,`对象、数组、函数 identity 为什么会影响 memo、dependency 和缓存命中？`,`memo、useMemo、useCallback 分别缓存什么？什么时候使用它们反而增加维护成本？`,`Profiler 的 actualDuration / baseDuration 可以帮助回答什么问题？为什么优化前应该先测量？`,`React Compiler 改变的是哪部分优化责任？为什么它不改变 State、Props、纯 Render 等核心规则？`],exercises:[`选一个 Demo，用 Profiler 找出一次可重复的慢更新；先记录基线，再尝试一种优化并比较结果。`,`构造 memo child + object/function props 场景，逐项消除不稳定 identity，记录哪些修改真正减少了 child Render。`,`删除一处没有测量依据的 useMemo/useCallback，验证 correctness 不变，并判断性能是否真的受到影响。`]},8:{title:`Chapter 08 · 外部 Store 与第三方系统`,questions:[`useSyncExternalStore 的 subscribe 与 getSnapshot 各自承担什么职责？snapshot identity 为什么必须稳定？`,`React State 与 external store 的所有权、订阅和一致性模型有什么不同？`,`Portal 改变的是 DOM 位置还是 React Tree？事件传播与 Context 为什么仍按 React Tree 工作？`,`集成图表、地图、编辑器等 imperative library 时，ref + Effect + cleanup 的边界是什么？`,`什么时候 React 自带 State/Reducer/Context 已足够，什么时候才值得引入 Zustand、Redux Toolkit 或 Jotai？`],exercises:[`实现一个最小 external store，故意让 getSnapshot 每次返回新对象，再修复 snapshot identity 并比较行为。`,`用 Portal 做一个浮层，验证 DOM 父节点与 React 事件传播路径不同，并记录你的观察。`,`模拟一个第三方 widget 实例，给它加入 setup/update/destroy 日志，反复切换依赖确认没有实例泄漏。`]},9:{title:`Chapter 09 · Server State 与请求架构`,questions:[`为什么 Server State 不是‘fetch 完塞进 useState’这么简单？它额外有哪些生命周期问题？`,`query key、fresh/stale、invalidation、refetch 分别解决什么问题？`,`request dedupe、race guard、Abort cancellation 处理的是同一个问题吗？它们之间如何区分？`,`分页查询的 page/cursor 为什么通常属于缓存身份的一部分？`,`optimistic mutation 成功确认与失败 rollback 时，canonical server state 应该如何保持权威？`,`Router loader 与 Server State cache 可以如何组合，而不是互相替代？`],exercises:[`实现两个几乎同时发出的请求，让后发请求先返回；先观察 stale response 覆盖，再加入 race guard 或 AbortController。`,`为一个分页列表设计 query key，切换两页后返回第一页，观察缓存身份是否符合预期。`,`实现一个会随机失败的 optimistic mutation，要求失败后恢复旧数据并呈现明确错误状态。`]},10:{title:`Chapter 10 · Router 与页面架构`,questions:[`哪些状态应该进入 URL，为什么 URL state 天然具有分享、刷新和 history 语义？`,`Route Params 与 Search Params 在页面身份和可选状态上的职责有什么区别？`,`Nested Routes / Outlet 为什么能表达页面布局层级，而不只是 URL 字符串拆分？`,`声明式 Link 与程序式 navigate 分别适合哪些场景？push 与 replace 的 history 语义有何差异？`,`Data Router 的 loader、pending、error boundary 为什么属于 route boundary，而不应每页都 mount Effect 再 fetch？`,`Router 的页面生命周期职责与 TanStack Query 的 Server State 生命周期职责如何划分？`],exercises:[`设计一个搜索页 URL：同时包含资源 id、分页、排序、筛选；说明哪些用 path params，哪些用 search params。`,`画出一个三层 nested route tree，并标出 layout、index route、Outlet 和 404/error boundary 的位置。`,`把一个‘组件挂载后 Effect fetch’页面改写成 route-loader 心智模型，列出 loading/error/navigation 职责如何迁移。`]},11:{title:`Chapter 11 · TypeScript、Testing 与 Accessibility`,questions:[`TypeScript 在 React 中最值得建模的边界是什么？为什么‘每行写满类型’不是目标？`,`discriminated union 为什么比多个 loading/error/success boolean 更能限制非法状态？`,`Vitest、React Testing Library、Playwright 分别应该验证什么，哪些细节不应该塞进 E2E？`,`为什么测试应优先 role/label/text 等用户可观察语义，而不是 class、私有 State 或内部函数调用次数？`,`原生语义、ARIA、键盘行为、focus management 各自解决什么？为什么 ARIA 不会自动补上行为？`,`自动 axe 扫描、DOM/键盘测试与真实 screen reader 测试之间有哪些能力边界？`],exercises:[`把一个由多个 boolean 表达的异步状态改成 TypeScript discriminated union，并让 switch 覆盖所有状态。`,`为现有一个异步 Demo 写一条 RTL 风格测试设计和一条 Playwright E2E 设计；要求两者验证层级不同。`,`只用键盘审查一个交互组件：记录 Tab 顺序、可见焦点、Enter/Space、Escape 与关闭后的焦点恢复问题。`]},12:{title:`Chapter 12 · SSR、RSC 与 Framework`,questions:[`CSR、SSG、请求时 SSR 的主要差异是什么？这些 rendering policy 为什么通常由 framework 决定？`,`hydration 为什么要求客户端初始输出与服务端 HTML 一致？哪些 render-time 值容易制造 mismatch？`,`Streaming SSR 解决什么问题？为什么它与 RSC 不是同义词？`,`Server Component 与 Client Component 的模块边界意味着什么？Client Component 是否一定只在浏览器生成 HTML？`,`为什么 "use client" 定义 client module boundary，而 "use server" 标记 Server Function？`,`React Core、React Router Framework Mode、Next.js App Router 在路由、数据、渲染、部署上的责任边界如何不同？`],exercises:[`列出 4 个可能造成 hydration mismatch 的首屏值，并分别设计让首次 Render 可重现的方案。`,`给一个商品详情页画出 Server Component / Client Component module graph，标出哪些代码需要进入客户端 bundle。`,`比较同一页面采用 CSR、SSG、SSR 三种策略时的数据时效性、首屏成本、服务器成本和部署约束。`]}};function Bi({chapter:e}){let t=zi[e];return t?(0,h.jsxs)(`section`,{className:`demo-section`,"data-chapter-checkpoint":e,"aria-labelledby":`chapter-${e}-checkpoint-title`,children:[(0,h.jsxs)(`div`,{className:`demo-section-header`,children:[(0,h.jsxs)(`h2`,{id:`chapter-${e}-checkpoint-title`,className:`demo-section-title`,children:[`🧭 `,t.title,` · 学习检查`]}),(0,h.jsx)(`p`,{className:`demo-section-desc`,children:`先独立回答，再回到对应 Demo 验证。这里刻意不提供答案。`})]}),(0,h.jsxs)(`div`,{className:`demo-grid-2`,children:[(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-tip`,style:{margin:0},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`你现在应该能回答什么？`}),(0,h.jsx)(`ol`,{style:{margin:0,paddingLeft:20},children:t.questions.map(e=>(0,h.jsx)(`li`,{style:{marginBottom:8},children:e},e))})]}),(0,h.jsxs)(`div`,{className:`demo-alert demo-alert-warning`,style:{margin:0},children:[(0,h.jsx)(`div`,{className:`demo-alert-title`,children:`练习`}),(0,h.jsx)(`ol`,{style:{margin:0,paddingLeft:20},children:t.exercises.map(e=>(0,h.jsx)(`li`,{style:{marginBottom:8},children:e},e))})]})]})]}):null}var Vi={"prop-drilling":1,"render-commit":2,"use-reduce-with-context":3,"advanced-ref":4,"optimistic-update":5,"transition-deferred":6,"react-compiler":7,"portal-third-party":8,"server-state-mutation":9,"route-data-boundary":10,"typescript-react":11,"server-functions-framework":12};function A(e){return Vi[e]??null}var j=(0,d.lazy)(()=>Gt(()=>import(`./CodeViewer-DRDVfH5s.js`),[]));function M(){let[e,t]=(0,d.useState)(Ri[0]?.id||`props`),[n,r]=(0,d.useState)(`focused`),[i,a]=(0,d.useState)(``),[o,s]=(0,d.useState)(!1),c=(0,d.useMemo)(()=>{if(!i.trim())return Ri;let e=i.toLowerCase();return Ri.filter(t=>{let n=Li.find(e=>e.id===t.category);return t.label.toLowerCase().includes(e)||t.id.toLowerCase().includes(e)||t.description?.toLowerCase().includes(e)||t.badge?.toLowerCase().includes(e)||n?.name.toLowerCase().includes(e)})},[i]),l=(0,d.useMemo)(()=>Li.map(e=>{let t=c.filter(t=>t.category===e.id);return{...e,items:t}}).filter(e=>e.items.length>0),[c]),u=(0,d.useMemo)(()=>Ri.find(t=>t.id===e)||Ri[0],[e]),f=(0,d.useMemo)(()=>Li.find(e=>e.id===u?.category),[u]),p=u?A(u.id):null,m=e=>{t(e),r(`focused`),s(!1),window.scrollTo({top:0,behavior:`smooth`})};return(0,h.jsxs)(`div`,{className:`app-shell`,children:[o&&(0,h.jsx)(`div`,{style:{position:`fixed`,inset:0,background:`rgba(15, 23, 42, 0.4)`,zIndex:45,backdropFilter:`blur(2px)`},onClick:()=>s(!1)}),(0,h.jsxs)(`aside`,{className:`app-sidebar ${o?`open`:``}`,children:[(0,h.jsxs)(`div`,{className:`sidebar-header`,children:[(0,h.jsxs)(`div`,{className:`brand-wrapper`,children:[(0,h.jsx)(`div`,{className:`brand-icon`,children:`⚛️`}),(0,h.jsx)(`div`,{children:(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,h.jsx)(`h1`,{className:`brand-title`,children:`React 核心实验室`}),(0,h.jsx)(`span`,{className:`brand-badge`,children:`React 19`})]})})]}),(0,h.jsx)(`p`,{className:`brand-desc`,children:`系统级进阶实践：组件组合、状态模式、Context 优化与副作用闭环`}),(0,h.jsxs)(`div`,{className:`sidebar-search-box`,children:[(0,h.jsx)(`span`,{className:`sidebar-search-icon`,children:`🔍`}),(0,h.jsx)(`input`,{type:`text`,className:`sidebar-search-input`,placeholder:`搜索知识点或关键词...`,"aria-label":`搜索知识点或关键词`,value:i,onChange:e=>a(e.target.value)})]})]}),(0,h.jsxs)(`nav`,{className:`sidebar-content`,children:[(0,h.jsxs)(`button`,{className:`all-overview-btn ${n===`all`?`active`:``}`,onClick:()=>{r(`all`),s(!1),window.scrollTo({top:0,behavior:`smooth`})},children:[(0,h.jsx)(`span`,{children:`🌟`}),(0,h.jsx)(`span`,{children:`全部功能完整总览`}),(0,h.jsxs)(`span`,{className:`nav-item-badge`,children:[Ri.length,` 篇`]})]}),l.map(t=>(0,h.jsxs)(`div`,{className:`category-group`,children:[(0,h.jsxs)(`div`,{className:`category-group-header`,children:[(0,h.jsxs)(`span`,{className:`category-group-title`,children:[(0,h.jsx)(`span`,{children:t.icon}),(0,h.jsx)(`span`,{children:t.name})]}),(0,h.jsx)(`span`,{className:`category-count`,children:t.items.length})]}),t.items.map(t=>{let r=n===`focused`&&e===t.id;return(0,h.jsxs)(`button`,{className:`nav-item ${r?`active`:``}`,onClick:()=>m(t.id),title:t.description,children:[(0,h.jsx)(`span`,{style:{overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:t.label}),t.badge&&(0,h.jsx)(`span`,{className:`nav-item-badge`,children:t.badge})]},t.id)})]},t.id)),l.length===0&&(0,h.jsxs)(`div`,{style:{textAlign:`center`,padding:`32px 16px`,color:`var(--text-subtle)`,fontSize:`13px`},children:[`未找到匹配 “`,i,`” 的内容`]})]}),(0,h.jsxs)(`div`,{className:`sidebar-footer`,children:[(0,h.jsxs)(`span`,{children:[`共收录 `,Ri.length,` 个核心模式`]}),(0,h.jsx)(`span`,{children:`⚡ Vite + Oxlint`})]})]}),(0,h.jsxs)(`div`,{className:`app-main`,children:[(0,h.jsxs)(`header`,{className:`top-bar`,children:[(0,h.jsxs)(`div`,{className:`top-bar-left`,children:[(0,h.jsx)(`button`,{className:`mobile-menu-toggle`,onClick:()=>s(e=>!e),"aria-label":`打开侧边导航`,children:`☰`}),(0,h.jsxs)(`div`,{className:`breadcrumb-nav`,children:[(0,h.jsx)(`span`,{className:`breadcrumb-category`,children:n===`all`?`总览模式`:f?.name||`核心实验`}),(0,h.jsx)(`span`,{className:`breadcrumb-sep`,children:`/`}),(0,h.jsx)(`span`,{className:`breadcrumb-current`,children:n===`all`?`全部知识点看板`:u?.label})]})]}),(0,h.jsx)(`div`,{className:`top-bar-right`,children:(0,h.jsxs)(`div`,{className:`view-mode-pill`,children:[(0,h.jsx)(`button`,{className:`view-mode-btn ${n===`focused`?`active`:``}`,onClick:()=>r(`focused`),children:`单篇聚焦`}),(0,h.jsx)(`button`,{className:`view-mode-btn ${n===`all`?`active`:``}`,onClick:()=>r(`all`),children:`连续阅读`})]})})]}),(0,h.jsx)(`main`,{className:`app-content`,children:n===`focused`?u?(0,h.jsxs)(`div`,{className:`demo-page`,children:[(0,h.jsx)(u.Component,{}),(0,h.jsx)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`code-accordion-wrapper`,style:{padding:`12px 18px`,color:`var(--text-subtle)`,fontSize:`12.5px`},children:`⚡ 载入代码视图...`}),children:(0,h.jsx)(j,{files:u.files,fileName:`${u.id}.jsx`})}),p&&(0,h.jsx)(Bi,{chapter:p})]},u.id):null:(0,h.jsx)(`div`,{className:`demo-all-container`,children:Ri.map((e,t)=>{let n=A(e.id);return(0,h.jsxs)(`div`,{id:`demo-${e.id}`,children:[t>0&&(0,h.jsx)(`hr`,{className:`demo-divider`}),(0,h.jsxs)(`div`,{style:{marginBottom:`16px`,display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,h.jsxs)(`span`,{className:`badge badge-blue`,children:[`案例 `,t+1]}),(0,h.jsx)(`h3`,{style:{margin:0,fontSize:`16px`,fontWeight:`700`,color:`var(--text-main)`},children:e.label}),(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-subtle)`},children:[`#`,e.id]})]}),(0,h.jsx)(e.Component,{}),(0,h.jsx)(d.Suspense,{fallback:(0,h.jsx)(`div`,{className:`code-accordion-wrapper`,style:{padding:`12px 18px`,color:`var(--text-subtle)`,fontSize:`12.5px`},children:`⚡ 载入代码视图...`}),children:(0,h.jsx)(j,{files:e.files,fileName:`${e.id}.jsx`})}),n&&(0,h.jsx)(Bi,{chapter:n})]},e.id)})})})]})]})}var Hi=16.67,Ui=new Map;function Wi(e){return Number(e.toFixed(2))}function Gi(e,t,n,r,i,a){let o=Wi(n),s=Ui.get(e)??{renderCount:0,mountCount:0,updateCount:0,slowRenderCount:0,totalActualDuration:0,maxActualDuration:0},c={phase:t,actualDuration:o,baseDuration:Wi(r),startTime:Wi(i),commitTime:Wi(a),commitDelay:Wi(Math.max(0,a-i))},l={renderCount:s.renderCount+1,mountCount:s.mountCount+ +(t===`mount`),updateCount:s.updateCount+(t===`mount`?0:1),slowRenderCount:s.slowRenderCount+ +(n>Hi),totalActualDuration:Wi(s.totalActualDuration+n),maxActualDuration:Math.max(s.maxActualDuration,o),lastRender:c};Ui.set(e,l)}(0,f.createRoot)(document.getElementById(`root`)).render((0,h.jsx)(d.StrictMode,{children:(0,h.jsx)(d.Profiler,{id:`AppProfiler`,onRender:Gi,children:(0,h.jsx)(M,{})})}));export{i as n,n as r,m as t};