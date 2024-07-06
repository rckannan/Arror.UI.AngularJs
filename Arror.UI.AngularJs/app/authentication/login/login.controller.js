(function() {
    'use strict';

    angular
        .module('Arror.UI.authentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($scope, $state, arrSettings, $stateParams, arrAuthService, $dashboardState, triMenu, arrHttpMenuService) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.socialLogins = [{
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        },{
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        },{
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        },{
            icon: 'fa fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
        vm.triSettings = arrSettings;
        // create blank user variable for login form
        vm.user = {
            userName: '' 
        };
        vm.showLogin = true;
        vm.message = $stateParams.msg;
        vm.message1 = '';
        vm.errmessage = '';
        ////////////////
 
        function loginClick() {
            
            arrAuthService.login(vm.user).then(function (response) {
                //$state.go('User.Auth.Profile');
                vm.showLogin = false;
                vm.message1 = "Login Success";
                
                    //arrException('err','err msg');
                //$dashboardState.addState('triangular.admin-default.profile', false, 'app/authentication/profile/profile.tmpl.html', '/profile', 'ProfileController', 'vm');
                //$dashboardState.addState('triangular.admin-default.forms-binding', false, 'app/forms/binding.tmpl.html', '/forms/binding', '', '');

                try {
                    arrHttpMenuService.getMenus('/api/Menu').then(function (response) {

                        angular.forEach(response.data, function (resp) {
                            States(resp);
                        });
                        $state.go('triangular.admin-default.profile');
                    },
                 function (err, status) {
                     $exceptionHandler('Error Message getMenus: ' + response.status + ' (' + response.statusText + ')' + err.error_description);
                     vm.message = "Error Message getMenus : " + err.error + err.error_description + " -- " + status;
                 });
                } catch (applyError) {
                    $exceptionHandler(applyError);
                }

                
                try {
                    arrHttpMenuService.getMenus('/api/Menudata').then(function (response) {
                        //vm.value = response.data;
                        triMenu.removeAllMenu();
                        angular.forEach(JSON.parse(response.data).Menudatas, function (resp) {
                            triMenu.addMenu(resp);
                        });

                    },
                 function (err, status) {
                     vm.message = "Error Message : " + status + err.error_description + " -- " + status;
                     $exceptionHandler('An error has occurred. HTTP error: ' + response.status + ' (' + response.statusText + ')');
                 });
                } catch (applyError) {
                    $exceptionHandler(applyError);
                }

                
                vm.message = "Login Success";
 
            },
             function (err) { 
                  vm.message = err.error_description;
                  vm.errmessage = err;
                  $exceptionHandler('An error has while login. HTTP error: ' + response.status + ' (' + response.statusText + ')');
             }); 
        }


        //Load the state in the menus
        function States(resp1) {
            if (resp1.fldMenuType === 'dropdown') {
                angular.forEach(resp1.fldChildren, function (child) {
                    States(child);
                });
            } else {
                var isExist = $dashboardState.getState(resp1.fldstateName);

                if (isExist == null) {
                    $dashboardState.addState(resp1.fldstateName, resp1.fldisabstract,
                   resp1.fldtemplateUrl, resp1.fldurl, resp1.fldcontrollerName, resp1.fldcontrollerNameAs);
                }
               
 
            }
        }; 
    }

   

    
})();