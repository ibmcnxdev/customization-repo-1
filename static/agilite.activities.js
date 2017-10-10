// ==UserScript==
// @copyright    Copyright IBM Corp. 2017
//
// @name         agilite.activities
// @version      0.1
// @description  *** PROTOTYPE CODE *** Contains logic to check for RefNo
//
// @namespace  http://ibm.com
//
// @author       John Jardin
//
// @include      *://apps.collabservintegration.com/activities/*
//
// @exclude
//
// @run-at       document-end
//
// ==/UserScript==

var agiliteActivities = {
  waitForToDo:null,
	waitForToDoRunning:false
};

if(typeof(dojo) != "undefined") {
	console.log("CUSTOMIZER: Initiating Extension - agilite.activities");

	//Setup the Wait For loop
	agiliteActivities.waitForToDo = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
		if(!elXpathRoot) var elXpathRoot = dojo.body();
		if(!maxInter) var maxInter = 10000;  // number of intervals before expiring
		if(!waitTime) var waitTime = 1000;  // 1000=1 second
		if(!elXpath) return;

		var waitInter = 0;  // current interval

		var intId = setInterval( function(){
			if( ++waitInter<maxInter && !dojo.query(elXpath,elXpathRoot).length) return;

			//clearInterval(intId);
			if( waitInter < maxInter) {
				callback();
			}
		}, waitTime);
	};

	//Initiate logic once DOM is Ready
	require(["dojo/domReady!"], function(){
    try {
				//Run Wait For Loop to create RefNos in Activity Nodes
				agiliteActivities.waitForToDo( function(){
					 // Wait for custom fields in Nodes to be active
					 dojo.query("span[id*='lconn_act_TextField']").forEach(function(row){
						 //Find custom field with the label of RefNo
						 if(row.innerHTML === "Ref No"){
							 var parentNode = row.parentNode.parentNode;
							 var valueNode = dojo.query(".fieldData", parentNode);

							 if(valueNode){
								 valueNode = valueNode[0].children[0].children[0];
							 }

							 //Check if Ref No = blank. If yes, generate new No and populate
							 if(valueNode.value === ""){
								 if(!agiliteActivities.waitForToDoRunning){
									 agiliteActivities.waitForToDoRunning = true;

									 agiliteCore.processRequest("1", {}, function(result){
										 valueNode.value = result;
										 agiliteActivities.waitForToDoRunning = false;
									 });
								 }
							 }
						 }
					 });
				 }, "form[id*='dijit_form_Form']");
    } catch(e) {
      alert("CUSTOMIZER: Exception occurred in agilite.activities: " + e);
    }
   });
}
