angular.module('authServices',[])
  .factory('auth', function($http, AuthToken) {
    authFactory = {};

    // auth.login(loginData) ----- this function will be called..
    authFactory.login = function(loginData) {
       return $http.post('/api/authen', loginData).then(function(data) {
         AuthToken.setToken(data.data.token);
         return data;
       });
    };

    // auth.isLoggedIn() ----- this function will be called..
    authFactory.isLoggedIn = function() {
      // trying to grab the token from local storage..
      if(AuthToken.getToken()) {
        return true;
      } else {
        return false;
      }
    };

    //Auth.getUser()
    authFactory.getUser = function() {
      if(AuthToken.getToken()) {
        return $http.post('/api/me');
      } else {
        $q.reject({ message: 'user has no token..'});
      }
    };

    //auth.logout() ---
    authFactory.logout = function() {
      AuthToken.setToken();
    };

    return authFactory;
  })

  .factory('AuthToken', function($window) {
    var authTokenFactory = {};
    //AuthToken.setToken(token); --- this statement will invoke this function..
    authTokenFactory.setToken = function(token) {
      if(token) {
        $window.localStorage.setItem('token', token);
      } else {
        $window.localStorage.removeItem('token');
      }
    };

    //AuthToken.getToken(); --- this statement will invoke this function..
    authTokenFactory.getToken = function() {
      return $window.localStorage.getItem('token');
    }

    return authTokenFactory;
  })

  // this is used to attach token for evry request..
  .factory('AuthInterceptors', function(AuthToken) {
    AuthInterceptorsFactory = {};
    AuthInterceptorsFactory.request = function(config) {
      var token = AuthToken.getToken();
      if(token) config.headers['x-access-token'] = token;

      return config;
    };
    return AuthInterceptorsFactory;
  })

  .factory('checkAuth', function(AuthToken) {
    var checkAuthObj = {};
    checkAuthObj.checkToken = function() {
      return AuthToken.getToken();
    }
    return checkAuthObj;
  });
