var TwitterService = (function(option){

	var option = {
		
		consumerKey: "V57jfVanLFbFMKc2rIdA", 
        consumerSecret: "Ra9qOGZ2BKnBCKEbiv2xVjf2lFbeVESOGojBNm4SA",
        accessTokenKey: "",
        accessTokenSecret: "",
        callbackUrl: "http://grouv.net",
        requestTokenUrl: "https://api.twitter.com/oauth/request_token",
    	authorizationUrl: "https://api.twitter.com/oauth/authorize",
    	accessTokenUrl: "https://api.twitter.com/oauth/access_token",
    	signatureMethod: "HMAC-SHA1"
	}

	var loader = new OAuth(option);
	var childbrowser;

	var method = {

		getRequestToken: function(success, fail) {

			loader.fetchRequestToken(function (result) {
			
				var resultParams = String(result).split("?")[1].split("&");
	            for (var i = 0, len = resultParams.length; i < len; i++) {

	                if (resultParams[i].split("=")[0] === "oauth_verifier") {

	                    loader.setVerifier(resultParams[i].split("=")[1]);
	                    break;
	                }
	            }
	            	
	            childbrowser.showWebPage(result);
	            childbrowser.onLocationChange = function(loc){ 
	            	
	            	if(loc.search(option.callbackUrl) != -1) {

	            		method.getAccessToken(success, fail);
	            		childbrowser.close();
	            	}
	            	
	            }

	        }, fail);
		},

		getAccessToken: function(success, fail) {

			loader.fetchAccessToken(success, fail);			
		}
	}

	return {

		init: function() {

			childbrowser = ChildBrowser.install();
		},

		login: function(success, fail) {

			method.getRequestToken(success, fail);
		},

		logout: function() {


		},

		updateStatus: function(status, success, fail) {

			var params = {
                url: "https://api.twitter.com/1/statuses/update.json"
                , method: "POST"
                , data: {"status": status}
                , success: success
                , failure: fail
            }

            loader.request(params);
		},

		updateStatusWithMedia: function(status, media, success, fail) {


			var params = {
                url: "https://upload.twitter.com/1/statuses/update_with_media.json"
                , method: "POST"
                , data: {"status":status ,"media_data[]": media}
                , success: success
                , failure: fail
            }

            loader.request(params);
		}
	}

})();