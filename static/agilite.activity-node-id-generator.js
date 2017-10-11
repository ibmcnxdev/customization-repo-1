/*
 * © Copyright IBM Corp. 2017
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */
// @name         activityNodeIDGenerator
// @version      0.1
// @author       John Jardin (Agilit-e)

//Check if global Agilit-e Object is created
if(!agilite) var agilite = {};

//Extension Service properties
agilite.actIdGen = {
	fieldLabel:"Ref No",//TODO: Define label of custom field to contain the generated ID. Case Sensitive!
	loopInterval:1000,// 1000=1 second
	looperRunning:false
};

if(typeof(dojo) != "undefined") {
	console.log("Initiating Extension - activityNodeIDGenerator");

	//Setup Looper to check for active Custom fields
	agilite.actIdGen.loop = function(callback, elXpath) {
		if(!elXpath) return;

		var intId = setInterval( function(){
			if(!dojo.query(elXpath, dojo.body()).length) return;

			callback();
		}, agilite.actIdGen.loopInterval);
	};

	require(["dojo/domReady!"], function(){
		try {
			//Run Looper to generate Ids if applicable
			agilite.actIdGen.loop( function(){
				// Wait for custom fields in Nodes to be active
				dojo.query("span[id*='lconn_act_TextField']").forEach(function(row){
					//Find custom field by label to populate ID
					if(row.innerHTML === agilite.actIdGen.fieldLabel){
						var parentNode = row.parentNode.parentNode;
						var valueNode = dojo.query(".fieldData", parentNode);

						if(valueNode){
							valueNode = valueNode[0].children[0].children[0];
						}

						//Check if Custom Field = blank. If yes, generate Unique ID and populate field
						if(valueNode.value === ""){
							if(!agilite.actIdGen.looperRunning){
								agilite.actIdGen.looperRunning = true;
  
								agilite.nodeRED.execute(function(err, result){
									if(!err){
										valueNode.value = result;
									}
									
									agilite.actIdGen.looperRunning = false;
								}, "1", {});
							}
						}
					}
				});
			}, "form[id*='dijit_form_Form']");
		} catch(e) {
			alert("Exception occurred in activityNodeIDGenerator: " + e);
		}
   });
}