var FacebookService = (function(){

	var option = {

		client_id : "397518126942685",
		redirect_uri : "http://www.facebook.com/connect/login_success.html",
		display : "touch",
		accessToken : ""
	}

	var method = {

		setAccessToken : function(loc) {

			var result = unescape(loc).split("#")[1];
			result = unescape(result);
			
			option.accessToken = result.split("&")[0].split("=")[1];		
			
		}
	}

	var loader = new XMLHttpRequest();

	return {

		init : function() {

			if(window.plugins == null || window.plugins.childBrowser == null)
			{
				ChildBrowser.install();
			}
		},

		login : function(success, fail) {

			var authorize_url  = "https://graph.facebook.com/oauth/authorize?";
				authorize_url += "client_id=" + option.client_id;
				authorize_url += "&redirect_uri=" + option.redirect_uri;
				authorize_url += "&display="+ option.display;
				authorize_url += "&type=user_agent";

			window.plugins.childBrowser.showWebPage(authorize_url);
			window.plugins.childBrowser.onLocationChange = function(loc){
                
	            if(loc.search(option.redirect_uri) != -1)
				{
					method.setAccessToken(loc);
					window.plugins.childBrowser.close();			

					if(success) {
						success();
					}	
				}
			};
		},

		upload : function(success, fail) {

			
		}		

	}

})();