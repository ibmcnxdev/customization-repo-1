// ==UserScript==
// @copyright    Copyright IBM Corp. 2017
//
// @name         agilite.communities
// @version      0.1
// @description  *** PROTOTYPE CODE *** Contains Core objects, logic and resources for Agilit-e
//
// @namespace  http://ibm.com
//
// @author       John Jardin
//
// @include      *://apps.collabservintegration.com/communities/*
//
// @exclude
//
// @run-at       document-end
//
// ==/UserScript==

var agiliteCommunities = {};

if(typeof(dojo) != "undefined") {
  console.log("CUSTOMIZER: Initiating Extension - agilite.communities");

	require(["dojo/domReady!"], function(){
    try {
      var args = {
        url: "https://apps.na.collabserv.com/profiles/atom/profileService.do",
//         user: "john.jardin@gmail.com",
//         password: "Crydon1979",
        content: {email: "john.jardin@gmail.com"}
      };

      var deferred = dojo.xhrGet(args);

      deferred.then(
        function (data) {
          console.log("1");
          console.log(data);
        },
        function (error) {
          console.log("2");
          console.log(data);
        });

//       require(["dojo/request"], function(request){
//           request.get("https://apps.na.collabserv.com/profiles/atom/profileService.do?email=john.jardin@gmail.com").then(function(result){
//             console.log("API Result");
//             console.log(result);
//           });
//       });
    } catch(e) {
      alert("CUSTOMIZER: Exception occurred in agilite.communities: " + e);
    }
   });
}
