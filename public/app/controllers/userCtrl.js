angular.module('userController',['useServe'])
          .controller('regCtrl', function($http, $location, User) {
            var app = this;
         this.regUser = function(regData) {
         app.em = false;
         console.log('form submitted.....');
         User.create(app.regData).then(function(data){
           console.log(data.data.message);
           if(data.data.success) {
             app.succ = data.data.message;
             $location.path('/');
           } else {
             app.em =  data.data.message;
           }
         });
       }
    });
