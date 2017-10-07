// ==UserScript==
// @copyright    Copyright IBM Corp. 2017
//
// @name         agilite.core
// @version      0.1
// @description  *** PROTOTYPE CODE *** Contains Core objects, logic and resources for Agilit-e
//
// @namespace  http://ibm.com
//
// @author       John Jardin
//
// @include      *://apps.collabservintegration.com/*
//
// @exclude
//
// @run-at       document-end
//
// ==/UserScript==

var agiliteGlobals = {};

if(typeof(dojo) != "undefined") {
	require(["dojo/domReady!"], function(){
    console.log("CUSTOMIZER: Initiating Script - agilite.core");

    try {
          require(["dojo/request"], function(request){
            agiliteGlobals.processRequest = function(flowType, bodyData, callback){
              request.post("https://agilite-node-red.eu-gb.mybluemix.net/customizer", {
                data:bodyData,
                headers: {
                  "flow-type":flowType
                }
              }).then(function(result){
                callback(result);
              });
            }
          });
      } catch(e) {
          alert("CUSTOMIZER: Exception occurred in agilite.core: " + e);
      }
		});
}
