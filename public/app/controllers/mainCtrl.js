angular.module('mainmod', ['authServices'])
  .controller('mainCtrl', function(auth, $location, $timeout, $rootScope, checkAuth) {
    var app = this;
    app.loadMe = false;

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      // if route is not authenticated user has to redirect to home page or login page...
      if(next.$$route.authenticated) {
        var userToken = checkAuth.checkToken();
          if(!userToken) {
          $location.path('/login');
      }
    } else if(!next.$$route.authenticated) {
        var userToken = checkAuth.checkToken();
          if(userToken) {
          $location.path('/');
        }
      }

      if(auth.isLoggedIn()) {
        console.log('success: user in..');
        app.isLoggedIn = true;
        auth.getUser().then(function(data) {
          console.log(data.data.username);
          app.username = data.data.username;
          app.email = data.data.email;
          app.loadMe = true;
        });
      } else {
        console.log('failure: no user inside..');
        app.isLoggedIn = false;
        app.username = '';
        app.loadMe = true;
      }
    });

  this.doLogin = function(loginData) {
  app.em = false;
 console.log('form submitted.....');
 auth.login(app.loginData).then(function(data){
   console.log(data.data.message);
   if(data.data.success) {
     app.succ = data.data.message;
     $location.path('/about');
     app.loginData.username = '';
     app.loginData.password = '';
     app.succ = false;
   } else {
     app.em =  data.data.message;
   }
 });
};

  this.logout = function() {
    auth.logout();
    $location.path('/logout');
    $timeout(function() {
      $location.path('/');
    }, 2000);
  };
});
