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

var agiliteGlobals = {
	userId:"",
	communityId:"",
	activityId:"",
	processRequest:null,
  waitForToDo:null,
	waitForToDoRunning:false
};

if(typeof(dojo) != "undefined") {
	console.log("CUSTOMIZER: Initiating Extension - agilite.core");

	//Add global function to process Node-RED transactions
	require(["dojo/request"], function(request){
		agiliteGlobals.processRequest = function(flowType, bodyData, callback){
			request.post("https://agilite-node-red.eu-gb.mybluemix.net/customizer", {
				data:bodyData,
				headers: {"flow-type":flowType}
			}).then(function(result){
				callback(result);
			});
		}
	});

	//Initiate logic once DOM is Ready
	require(["dojo/domReady!"], function(){
    try {
				//Get current user's ID and add to globals

    } catch(e) {
      alert("CUSTOMIZER: Exception occurred in agilite.core: " + e);
    }
	});
}
