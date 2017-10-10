// ==UserScript==
// @copyright    Copyright IBM Corp. 2017
//
// @name         agilite.homepage
// @version      0.1
// @description  *** PROTOTYPE CODE *** Contains Homepage objects and logic
//
// @namespace  http://ibm.com
//
// @author       John Jardin
//
// @include      *://apps.collabservintegration.com/homepage/*
//
// @exclude
//
// @run-at       document-end
//
// ==/UserScript==

var agiliteHomePage = {
  statusText:"",
  defaultToneMsg:"Waiting to analyze tone...",
  qryInterval:2000,
  qryValue:".cke_contents.cke_reset.lconnShareboxCke.lotusTextExpanded",
  qryValue2:".lotusInlinelist.lotusLeft",
  qryExceptionText:"What do you want to share?",
  queryField:null,
  looper:null,
  looper2:null
};

if(typeof(dojo) != "undefined") {
  console.log("CUSTOMIZER: Initiating Extension - agilite.homepage");

  //Setup Function to query status field values
	agiliteHomePage.queryField = function() {
    //Get content of iFrame values
    var tmpArray = dojo.query(".cke_wysiwyg_frame")[0].contentDocument.childNodes[1].childNodes[1].childNodes;
    var data = "";
    var index = 0;
    var canProcess = false;
    var resultText = "";

    tmpArray.forEach(function(entry){
      if(entry.childNodes.length > 0){
        var tmpValue = entry.childNodes[0].nodeValue;
        if(tmpValue){
          if(tmpValue !== agiliteHomePage.qryExceptionText){
            if(index > 0){
              data += " ";
            }

            data += tmpValue;
            index++;
          }
        }
      }
    });

    //Process if text has changed and is not blank
    if(data !== ""){
      if(agiliteHomePage.statusText !== data){
        canProcess = true;
        agiliteHomePage.statusText = data;
      }
    }else{
      if(dojo.byId("agilite_tone_result").innerHTML !== agiliteHomePage.defaultToneMsg){
        dojo.byId("agilite_tone_result").innerHTML = agiliteHomePage.defaultToneMsg;
      }

      agiliteHomePage.statusText = "";
    }

    if(canProcess){
      dojo.byId("agilite_tone_result").innerHTML = "Analyzing dominant tone...";
        agiliteCore.processRequest("2", {data:data}, function(result){
          result = JSON.parse(result);

          for(var x in result.tones){
            if(parseInt(x) > 0){
              resultText += ", ";
            }

            resultText += "<span>" + result.tones[x].tone_name + "</span>";
          }

          if(resultText !== ""){
            resultText = "Dominant Tone(s): " + resultText;
          }else{
            resultText = "Not enough context to analyze dominant tone of message."
          }

          dojo.byId("agilite_tone_result").innerHTML = resultText;
          setTimeout(function(){
            agiliteHomePage.looper2(agiliteHomePage.queryField, agiliteHomePage.qryValue);
          }, agiliteHomePage.qryInterval);
        });
    }else{
      setTimeout(function(){
        agiliteHomePage.looper2(agiliteHomePage.queryField, agiliteHomePage.qryValue);
      }, agiliteHomePage.qryInterval);
    }
	};

  //Setup Looper logic to add Tone Analyzer Div underneath status field
	agiliteHomePage.looper = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
		if(!elXpathRoot) var elXpathRoot = dojo.body();
		if(!waitTime) var waitTime = 500;
		if(!elXpath) return;

		var intId = setInterval( function(){
			if(!dojo.query(elXpath,elXpathRoot).length) return;

			clearInterval(intId);
      callback();
		}, waitTime);
	};

  //Setup Looper logic to check if status update field is expanded
	agiliteHomePage.looper2 = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
		if(!elXpathRoot) var elXpathRoot = dojo.body();
		if(!waitTime) var waitTime = agiliteHomePage.qryInterval;
		if(!elXpath) return;

		var intId = setInterval( function(){
			if(!dojo.query(elXpath,elXpathRoot).length) return;

			clearInterval(intId);
      callback();
		}, waitTime);
	};

	require(["dojo/domReady!"], function(){
    try {
        //Setup div underneath Status Field for Tone Results
        agiliteHomePage.looper(function(){
          var refNode = dojo.query(agiliteHomePage.qryValue2)[0];
          //<span style='color:#134a9f;letter-spacing: 2px;'>
          var node = '<li><div id="agilite_tone_result" style="float:right;color:#134a9f;letter-spacing: 2px;">' + agiliteHomePage.defaultToneMsg + '</div></li>';
          dojo.place(node, refNode, "last");
        }, agiliteHomePage.qryValue2);

				//Run Looper to check if status update box is expanded
				agiliteHomePage.looper2(agiliteHomePage.queryField, agiliteHomePage.qryValue);
    } catch(e) {
      alert("CUSTOMIZER: Exception occurred in agilite.homepage: " + e);
    }
   });
}
