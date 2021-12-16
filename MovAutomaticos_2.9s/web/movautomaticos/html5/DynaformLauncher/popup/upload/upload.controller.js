/*
 *  Createad by Leonardo Patrick on 21/11/2019.
 */

angular
.module('DynaformLauncherApp')
.controller('uploadController', uploadController);
        
function uploadController(SkFileInputConstant,data,$scope, data,$scope, ServiceProxy, $popupInstance, $scope, ServiceProxy, SkApplicationInstance ) {
        var self = this;
        
        $scope.$success = finalizarUpload;
        self.resourceID = SkApplicationInstance.getResourceID();
        self.gridConfigConsultaRetornoLI = self.resourceID + '.gridInfDynaformLancher.upload';

        /**UPLOAD */
        self.uploadFineshed = uploadFineshed;
        self.beforeState = beforeState;

        self.entityName = data.entityName;
        self.resourceID = data.resourceID;
        self.dynaformDefault = data.dynaformDefault;
        self.chaveArquivo = 'DYNAMIC_FORM_UPLOAD';

    function beforeState() {
            self.arquivo = undefined;
        }

    function finalizarUpload() {

        $popupInstance.success();
                   
    }

    function uploadFineshed(state, value) {
        if (angular.isUndefined(value) || state == SkFileInputConstant.UPLOAD_FAILED) {
            self.arquivo = undefined;
            return;
        }

        var request = undefined;

        if(self.dynaformDefault){
            
         request = {
            "resourceID":  self.resourceID,
            "entityName": self.entityName,
            "fieldKey" : self.dynaformDefault.getPrimaryKeys(),
            "valueKey": self.dynaformDefault.getPrimaryKeyValues(),
            "chaveArquivo": self.chaveArquivo  
        };
        
        }else{
            request = {
                "resourceID":  self.resourceID,
                "entityName": self.entityName,
                "chaveArquivo": self.chaveArquivo
               };
        }
           ServiceProxy
           .callService('movautomaticos@MovAutomaticosSP.importarArquivo', request)
               .then(function (response) {
            
                        $popupInstance.success();

                       }
                   );
    }

    
    };