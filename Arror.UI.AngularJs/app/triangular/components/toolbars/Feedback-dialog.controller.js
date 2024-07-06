(function () {
    'use strict';

    angular
        .module('Arror.UI.components')
        .controller('feedbackController', feedbackController);

    /* @ngInject */
    function feedbackController($state, $mdDialog, loginInfoService, arrHttpMenuService) {
        var vm = this;

        vm.feedBackDetail = {
            menu: $state.current.name,
            description: '',
            user_ID: loginInfoService.user_ID,
            webClientID : loginInfoService.webClient_ID,
            updatedOn : new Date().toLocaleString('en-US')
        };

        vm.cancelClick = cancelClick;
        vm.okClick = saveFeedback;   

        ////////////////
 
        function cancelClick() {
            $mdDialog.cancel();
        } 

        function saveFeedback() {
            //save here
            arrHttpMenuService.postData('api/Feedback', vm.feedBackDetail);
            $mdDialog.hide();
        }
    }
})();