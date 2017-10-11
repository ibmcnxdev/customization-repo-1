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
// @name         agiliteCore
// @version      0.1
// @author       John Jardin (Agilit-e)

//Check if global Agilit-e Object is created
if(!agilite) var agilite = {};

/*
 * NOTES:
 * - Check the agilite.nodeRED object below to provide the necessary params, if any
 * - Tone Analyer - Execute Request: Property Rules
 *    - flowType: [STRING] - Allowed Values: "1", "2"
 *       - "1" = Generate Unique No
 *       - "2" = Analyze Message Tone
 */

//Node-RED Service properties
agilite.nodeRED = {
	url:"https://agilite-node-red.eu-gb.mybluemix.net/customizer",//TODO: Change this to your own Node-RED Service
	flowType:"1"
};

if(typeof(dojo) != "undefined") {
	console.log("Initiating Agilit-e Core");

	require(["dojo/request/xhr"], function(xhr){
		//Create Execute Request for Node-RED Service
		agilite.nodeRED.execute = function(callback, flowType, bodyData){
			if(!bodyData) var bodyData = {};
			if(!flowType) var flowType = agilite.nodeRED.flowType;

			var url = agilite.nodeRED.url;
			var args = {};
			var headers = {};

			//Add Header Params
			headers = {"flow-type":flowType};
			
			args = {
				method:"POST",
				data:bodyData,
				headers:headers
			};
		
			xhr(url, args)
			.then(function(data){callback(false, data)}
			, function(err){callback(true, err)});
		}
	});
}