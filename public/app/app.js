angular.module('mym',['appRoutes', 'userController','useServe','mainmod','authServices'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
  });
