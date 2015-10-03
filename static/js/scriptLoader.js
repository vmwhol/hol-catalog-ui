
(function(loader, undefined){
  
  if(Object.keys(loader).length) return;
  
  var scriptsRequested = {},
      scriptsLoaded = {},
      scriptCallbacks = {},
      callbackCallers = {},
      jquerySRC = "/static/js/jquery.js",
      preLoaders = [];
  
  loader.baseURL = "/tproxy.jsp?http://30ae5210.ngrok.com";
  
  loader.loadCSS = function(src) {
     if(!scriptsRequested[src]){
        scriptsRequested[src] = true;
        
        $.get(this.baseURL+src, function(data){
           var s = document.createElement('style'),
               c = document.createTextNode(data);
            s.appendChild(c);
            $("body").prepend($(s));
        }); 
     }
     return;
  };
  
  loader.loadScript = function(src, cb) {
     
     if(src === "jquery") src = jquerySRC;
     
     if(scriptsRequested[src]){
        if(scriptsLoaded[src]){
           cb();
           return;
        }
        // add callback
        scriptCallbacks[src].push(cb);
        return;
     }
     
     scriptsRequested[src] = true;
     scriptCallbacks[src] = [cb];
     callbackCallers[src] = function(){
        for(var i=0; i < scriptCallbacks[src].length; i++){
           scriptCallbacks[src][i]();
        };
     };
     
      var s = document.createElement('script');
      s.type = 'text/' + (src.type || 'javascript');
      s.src = this.baseURL + (src.src || src);
      s.async = false;

      s.onreadystatechange = s.onload = function () {

        var state = s.readyState;

        if (!state || /loaded|complete/.test(state)) {
            scriptsLoaded[src] = true;
            callbackCallers[src]();
            
        }
      };
      
      // use body if available. more safe in IE
      (document.body || document.getElementsByTagName("head")[0]).appendChild(s);
     
   };
   
}(window.scriptLoader = (window.scriptLoader || {}), undefined));

