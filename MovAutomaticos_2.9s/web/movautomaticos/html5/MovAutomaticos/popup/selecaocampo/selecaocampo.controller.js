/*
 *  Createad by Leonardo Patrick on 18/06/2019.
 */

angular
.module('MovAutomaticosApp')
.controller('selecaoCampoController', selecaoCampoController);
        
function selecaoCampoController(SkFilter, data,$scope, SkApplicationInstance, $popupInstance ) {

        var self = this;
        $scope.$success = salveFilter;
        self.resourceID = SkApplicationInstance.getResourceID();
	    self.entityName = data.entityName;
        self.transientFilter =  data.transientFilter;
        self.ds = data.ds;

    function salveFilter() {
      
        var filterRequest = {
        resourceId: 'br.com.sankhya.itout.movautomaticos.id.'+self.idMov,
        entityName: self.entityName,
        useSupOnlyConfig:  'S',
        active: "active",
        name: "Filtro Automações"
         };

         SkFilter.buildExpression(self.transientFilter);
         angular.extend(filterRequest, self.transientFilter.filterModel);

         self.ds.setFieldValue("EXPRESSAO", self.transientFilter.filterModel.expression.$);
         self.ds.setFieldValue("TRANSIENTFILTER", JSON.stringify(self.transientFilter));
         self.ds.setFieldValue("INSTANCIA", self.entityName);
        
         console.log('salvando');
         self.ds.save();

         self.ds.refreshCurrentRow();

         $popupInstance.success();

    }
   
    };