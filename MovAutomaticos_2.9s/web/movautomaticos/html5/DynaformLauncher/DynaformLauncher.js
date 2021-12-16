angular
    .module('DynaformLauncherApp',['snk'])
    .controller('DynaformLauncherCtrl', ['$scope','SanPopup', 'UrlUtils','StringUtils','SkComponentRegistry', function($scope,SanPopup ,  UrlUtils, StringUtils, SkComponentRegistry){
        var params = UrlUtils.getQueryParams(location.search);
        var self = this;
       
        self.otherOptionsLoader=otherOptionsLoader;
    
        self.onDynaformLoaded = onDynaformLoaded;
        self.dynaformID = StringUtils.nextUid();
        self.getEntityName = getEntityName;
        self.getResourceId = getResourceId;
        
        //sobreescrevemos do DefaultSankhyaApp
        $scope.loadByPK = loadByPK;
        
        function loadByPK(pkObject) {
        	SkComponentRegistry.get(self.dynaformID).then(function(dynaform){
                dynaform.loadByPK(pkObject);
        	});
        }
        

        function getEntityName() {
            if (!params.hasOwnProperty('entityName')) {
                throw new Error("");
            }

            return params.entityName;
        }

        function getResourceId() {
            if (!params.hasOwnProperty('resourceID')) {
                throw new Error("");
            }

            return params.resourceID;
        }

        
        function onDynaformLoaded(dynaform, dataset) {

            if (dynaform.getEntityName() == getEntityName()) {
                self.dynaformDefault = dataset;
            }
        }


        function otherOptionsLoader() {
            var options = [
                { label: 'Importar Arquivo', action: uploadFile }
            ];
            return options;
        }
        
        function uploadFile(){
         
            var preferenciasTW = {
                resourceID: getResourceId(),
                entityName: getEntityName(),
                dynaformDefault: self.dynaformDefault
            };

                var popupInstance = SanPopup.open({
                    title: 'Importador de Arquivo',
                    templateUrl: 'html5/DynaformLauncher/popup/upload/upload.tpl.html',
                    controller: 'uploadController',
                    controllerAs: 'ctrlDois',
                    size: 'sm',
                    okBtnLabel: 'Fechar',
                    showBtnNo: false,
                    resolve: {
                        data: preferenciasTW
                    }
                });	

                popupInstance.result
                    .then(function(paramsPopUp) {

                        if(self.dynaformDefault){
                            self.dynaformDefault.refreshCurrentRow();
                }
                
                });
        
                return popupInstance;

        }


    }]);
 