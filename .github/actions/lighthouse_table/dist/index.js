(()=>{"use strict";var e={351:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){if(r===undefined)r=n;Object.defineProperty(e,r,{enumerable:true,get:function(){return t[n]}})}:function(e,t,n,r){if(r===undefined)r=n;e[r]=t[n]});var i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.hasOwnProperty.call(e,n))r(t,e,n);i(t,e);return t};Object.defineProperty(t,"__esModule",{value:true});t.issue=t.issueCommand=void 0;const s=o(n(87));const u=n(278);function issueCommand(e,t,n){const r=new Command(e,t,n);process.stdout.write(r.toString()+s.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const a="::";class Command{constructor(e,t,n){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=n}toString(){let e=a+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const n in this.properties){if(this.properties.hasOwnProperty(n)){const r=this.properties[n];if(r){if(t){t=false}else{e+=","}e+=`${n}=${escapeProperty(r)}`}}}}e+=`${a}${escapeData(this.message)}`;return e}}function escapeData(e){return u.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return u.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},186:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){if(r===undefined)r=n;Object.defineProperty(e,r,{enumerable:true,get:function(){return t[n]}})}:function(e,t,n,r){if(r===undefined)r=n;e[r]=t[n]});var i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.hasOwnProperty.call(e,n))r(t,e,n);i(t,e);return t};var s=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.getState=t.saveState=t.group=t.endGroup=t.startGroup=t.info=t.warning=t.error=t.debug=t.isDebug=t.setFailed=t.setCommandEcho=t.setOutput=t.getBooleanInput=t.getMultilineInput=t.getInput=t.addPath=t.setSecret=t.exportVariable=t.ExitCode=void 0;const u=n(351);const a=n(717);const l=n(278);const c=o(n(87));const f=o(n(622));var d;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(d=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){const n=l.toCommandValue(t);process.env[e]=n;const r=process.env["GITHUB_ENV"]||"";if(r){const t="_GitHubActionsFileCommandDelimeter_";const r=`${e}<<${t}${c.EOL}${n}${c.EOL}${t}`;a.issueCommand("ENV",r)}else{u.issueCommand("set-env",{name:e},n)}}t.exportVariable=exportVariable;function setSecret(e){u.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){const t=process.env["GITHUB_PATH"]||"";if(t){a.issueCommand("PATH",e)}else{u.issueCommand("add-path",{},e)}process.env["PATH"]=`${e}${f.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const n=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!n){throw new Error(`Input required and not supplied: ${e}`)}if(t&&t.trimWhitespace===false){return n}return n.trim()}t.getInput=getInput;function getMultilineInput(e,t){const n=getInput(e,t).split("\n").filter((e=>e!==""));return n}t.getMultilineInput=getMultilineInput;function getBooleanInput(e,t){const n=["true","True","TRUE"];const r=["false","False","FALSE"];const i=getInput(e,t);if(n.includes(i))return true;if(r.includes(i))return false;throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${e}\n`+`Support boolean input list: \`true | True | TRUE | false | False | FALSE\``)}t.getBooleanInput=getBooleanInput;function setOutput(e,t){process.stdout.write(c.EOL);u.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setCommandEcho(e){u.issue("echo",e?"on":"off")}t.setCommandEcho=setCommandEcho;function setFailed(e){process.exitCode=d.Failure;error(e)}t.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}t.isDebug=isDebug;function debug(e){u.issueCommand("debug",{},e)}t.debug=debug;function error(e){u.issue("error",e instanceof Error?e.toString():e)}t.error=error;function warning(e){u.issue("warning",e instanceof Error?e.toString():e)}t.warning=warning;function info(e){process.stdout.write(e+c.EOL)}t.info=info;function startGroup(e){u.issue("group",e)}t.startGroup=startGroup;function endGroup(){u.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return s(this,void 0,void 0,(function*(){startGroup(e);let n;try{n=yield t()}finally{endGroup()}return n}))}t.group=group;function saveState(e,t){u.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState},717:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){if(r===undefined)r=n;Object.defineProperty(e,r,{enumerable:true,get:function(){return t[n]}})}:function(e,t,n,r){if(r===undefined)r=n;e[r]=t[n]});var i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.hasOwnProperty.call(e,n))r(t,e,n);i(t,e);return t};Object.defineProperty(t,"__esModule",{value:true});t.issueCommand=void 0;const s=o(n(747));const u=o(n(87));const a=n(278);function issueCommand(e,t){const n=process.env[`GITHUB_${e}`];if(!n){throw new Error(`Unable to find environment variable for file command ${e}`)}if(!s.existsSync(n)){throw new Error(`Missing file at path: ${n}`)}s.appendFileSync(n,`${a.toCommandValue(t)}${u.EOL}`,{encoding:"utf8"})}t.issueCommand=issueCommand},278:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.toCommandValue=void 0;function toCommandValue(e){if(e===null||e===undefined){return""}else if(typeof e==="string"||e instanceof String){return e}return JSON.stringify(e)}t.toCommandValue=toCommandValue},747:e=>{e.exports=require("fs")},87:e=>{e.exports=require("os")},622:e=>{e.exports=require("path")}};var t={};function __nccwpck_require__(n){var r=t[n];if(r!==undefined){return r.exports}var i=t[n]={exports:{}};var o=true;try{e[n].call(i.exports,i,i.exports,__nccwpck_require__);o=false}finally{if(o)delete t[n]}return i.exports}(()=>{__nccwpck_require__.r=e=>{if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(e,"__esModule",{value:true})}})();if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var n={};(()=>{__nccwpck_require__.r(n);function markdownTable(e,t){const n=t||{};const r=(n.align||[]).concat();const i=n.stringLength||defaultStringLength;const o=[];let s=-1;const u=[];const a=[];const l=[];let c=0;let f;let d;let p;let m;let g;let h;let _;let b;let v;while(++s<e.length){f=-1;d=[];p=[];if(e[s].length>c){c=e[s].length}while(++f<e[s].length){g=serialize(e[s][f]);if(n.alignDelimiters!==false){m=i(g);p[f]=m;if(l[f]===undefined||m>l[f]){l[f]=m}}d.push(g)}u[s]=d;a[s]=p}f=-1;if(typeof r==="object"&&"length"in r){while(++f<c){o[f]=toAlignment(r[f])}}else{v=toAlignment(r);while(++f<c){o[f]=v}}f=-1;d=[];p=[];while(++f<c){v=o[f];_="";b="";if(v===99){_=":";b=":"}else if(v===108){_=":"}else if(v===114){b=":"}m=n.alignDelimiters===false?1:Math.max(1,l[f]-_.length-b.length);g=_+"-".repeat(m)+b;if(n.alignDelimiters!==false){m=_.length+m+b.length;if(m>l[f]){l[f]=m}p[f]=m}d[f]=g}u.splice(1,0,d);a.splice(1,0,p);s=-1;const y=[];while(++s<u.length){d=u[s];p=a[s];f=-1;h=[];while(++f<c){g=d[f]||"";_="";b="";if(n.alignDelimiters!==false){m=l[f]-(p[f]||0);v=o[f];if(v===114){_=" ".repeat(m)}else if(v===99){if(m%2){_=" ".repeat(m/2+.5);b=" ".repeat(m/2-.5)}else{_=" ".repeat(m/2);b=_}}else{b=" ".repeat(m)}}if(n.delimiterStart!==false&&!f){h.push("|")}if(n.padding!==false&&!(n.alignDelimiters===false&&g==="")&&(n.delimiterStart!==false||f)){h.push(" ")}if(n.alignDelimiters!==false){h.push(_)}h.push(g);if(n.alignDelimiters!==false){h.push(b)}if(n.padding!==false){h.push(" ")}if(n.delimiterEnd!==false||f!==c-1){h.push("|")}}y.push(n.delimiterEnd===false?h.join("").replace(/ +$/,""):h.join(""))}return y.join("\n")}function serialize(e){return e===null||e===undefined?"":String(e)}function defaultStringLength(e){return e.length}function toAlignment(e){const t=typeof e==="string"?e.charCodeAt(0):0;return t===67||t===99?99:t===76||t===108?108:t===82||t===114?114:0}var e=__nccwpck_require__(186);try{const t=e.getInput("lhci_manifest");const n=JSON.parse(t);const r=markdownTable([["Page","Performance","Accessibility","Best Practices","SEO"],...n.map((({url:e,summary:t})=>[e,t.performance,t.accessibility,t["best-practices"],t.seo]))]);e.setOutput("table",r)}catch(t){e.setFailed(t.message)}})();module.exports=n})();