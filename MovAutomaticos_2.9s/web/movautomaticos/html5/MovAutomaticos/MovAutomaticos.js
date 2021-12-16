/*
 *  Criado por Leonardo Patrick on 22/08/2019.
 */
angular
    .module('MovAutomaticosApp', ['snk'])
    .controller('MovAutomaticosController',['MessageUtils','ObjectUtils','StringUtils','AngularUtil','ArrayUtils','$scope','ServiceProxy','SanPopup',
        function (MessageUtils, ObjectUtils,StringUtils, AngularUtil, ArrayUtils, $scope, ServiceProxy, SanPopup ) {
        var self = this;
        var  _dsMovAutomaticos;
            
        self.dynaformID = StringUtils.nextUid();
        
        //Implementors
        ObjectUtils.implements(self, IFormInterceptor);
        ObjectUtils.implements(self, IDataSetObserver);
        ObjectUtils.implements(self, IDynaformInterceptor);
        ObjectUtils.implements(self, IDatagridInterceptor);

        // Implementação do IFormInterceptor
        self.buildFieldContainer = buildFieldContainer;
        
        //Funções disponíveis no controlador
        self.onDynaformLoaded = onDynaformLoaded;
        self.openFieldSelector = openFieldSelector;
        self.settleWithInstancia = settleWithInstancia;
        self.valInstancia = valInstancia;
        self.openFilterCustom = openFilterCustom;
        self.zeraFiltro = zeraFiltro;
        self.getButtonColor = getButtonColor;
        self.buildComponentFromField = buildComponentFromField;
        self.filterType =  filterType;
        self.buildFieldAbstract = buildFieldAbstract;
        self.buildAtributesDefinied = buildAtributesDefinied;
        
        self.fieldsAll = ['CODEMP_CUS',  'CODEMP_ITE',       'SEQUENCIA','OBSERVACAO',  'SERIENOTA',
                            'CODEMPNEGOC','CODLOCALDEST',         'CODPARC',    'CODEMP','CODTIPVENDA',
                                'CODNAT',   'CODCENCUS',      'CODTIPOPER',  'CODLOCAL',    'CODPROD',
                                'QTDNEG',    'CONTROLE',          'QTDNEG',   'VLRUNIT',   'VLRDESC'];
        
        self.fieldsTGFITE = ['CODEMP_CUS',   'CODEMP_ITE',   'SEQUENCIA','CODLOCAL','CODLOCALDEST',
                                'CODPROD',       'QTDNEG',    'CONTROLE', 'VLRUNIT',     'VLRDESC'];
        
        self.fieldsFilterInt = [    'CODPARC','CODEMP_CUS', 'CODEMP_ITE','SEQUENCIA','CODLOCALDEST',
                                'CODEMPNEGOC',    'CODEMP','CODTIPVENDA',   'CODNAT',   'CODCENCUS',
                                    'CODTIPOPER',  'CODLOCAL',    'CODPROD',   'QTDNEG',      'QTDNEG',
                                    'VLRUNIT',   'VLRDESC'];
    
        self.fieldsFilterNumber  = ['QTDNEG','VLRUNIT', 'VLRDESC'];

        self.fieldsFilterString = ['CONTROLE','SERIENOTA','OBSERVACAO'];

        self.interceptDynaform = interceptDynaform;
        
        self.typeFilter = 'I';

        self.fieldFilter = undefined;

        function  interceptDynaform(dynaform){
            //    console.log('Interceptar Dynaform');
        }

        function onDynaformLoaded(dynaform, dataset) {

               if (dataset.getEntityName() == 'MovAutomaticos') {
                    _dsMovAutomaticos = dataset;
                } 
                
                if (dataset.getEntityName() == 'ItensMovAut') {
                    
                    self.dsItens = dataset;
                    self.dsItens.addObserver(self);
                    
                    dataset.initializeDataSet();

                    dataset.addLineChangeListener(function () {
                         reprocessBuildField(dataset);
                    });

                    dataset.addRefreshedListener(function (reason) {
                        reprocessBuildField(dataset);
                    });

                    dataset.addInsertionModeListener(function (reason) {
                        reprocessBuildField(dataset);
                    });  
                }
        }
		
        function zeraFiltro(){
                    $scope.transientFilter = {
                        newItem: true,
                        filterModel: {}
                    };
        }

        function filterType(value){
               
                var types =[];
                
                if(ArrayUtils.isIn(self.fieldsFilterInt, self.fieldFilter))
                types.push('I');

               if(ArrayUtils.isIn(self.fieldsFilterNumber, self.fieldFilter))
               types.push('F');

               if(ArrayUtils.isIn(self.fieldsFilterString, self.fieldFilter))
               types.push('S');

                  return (ArrayUtils.isIn(types,value.type));
        }

        function openFieldSelector(fieldName, element) {
             
                if(ArrayUtils.isIn(self.fieldsTGFITE, fieldName))
                   valInstancia('CODINSTFILHA', fieldName,element, self.dsItens) 
         
                else
                    valInstancia('CODINST', fieldName,element, _dsMovAutomaticos)    
        }

        function valInstancia(fielEntity, fieldName, element,ds){

                if(ds.getFieldValueAsString(fielEntity))
                    settleWithInstancia(ds.getFieldValueAsString(fielEntity), element, fieldName);
                else
                    MessageUtils.showAlert('Necessário preencher a instância');    
        }
            
        function settleWithInstancia(codInstancia, elemento, fieldName){
               // var deferred = $q.defer();
                
                ServiceProxy.callService('movautomaticos@MovAutomaticosSP.resolveEntity', {
                    codigoIstancia: codInstancia
                }).then(function (result) {
                   
                var myElement = angular.element( document.querySelector('#'+elemento) );
             
                self.fieldFilter = fieldName.toUpperCase();
    
                var resourceIdnovo = 'br.com.sankhya.faznada';
                var entityName = result.responseBody.descricao;

                var popupInstance = SanPopup.open({
                    templateUrl: 'components/personalizedfilter/templates/field-selection-popup.tpl.html',
                    controller: 'FieldSelectionPopUpController',
                    controllerAs: 'ctrl',
                    title: 'Filtro personalizado',
                    size: 'lg',
                    windowClass: 'personalized-filter-modal',
                    showBtnOk: false,
                    resolve: {
                        resourceId: function () {
                            return resourceIdnovo;
                        },
                        entityName: function () {
                            return entityName;
                        },
                        FieldFilterFunction:  function() {
                            return filterType;
                        },
                        LinkFilterFunction: function () {
                            return undefined;
                        }
                    }
                });
        
                    popupInstance.result.then(function (result) {
                        var description = '';
                        var expression = '';
                        var entityName = '';
        
                        result.entityPath.forEach(function (path, i) {
                            entityName = path.name;
        
                            if (result.entityPath.length > 1) {
                                if (i > 0) {
                                    expression += entityName + '.';
                                }
                            } else {
                               // expression += entityName + '.';
                            }
        
                            description += path.description;
                            description += " >> ";
                        });
        
                        expression += result.selectedItem.name;
                        description += result.selectedItem.description;
        
                        myElement[0].attributes['sk-placeholder'].value = expression;
                        myElement[0].firstChild.attributes['placeholder'].value = expression;
    
                            self.dsItens.setFieldValue(fieldName, expression);
                        
                    });
                  

                }, // deferred.rejec
                
                );
        }

        function openFilterCustom(tipo){
            
                zeraFiltro();

                var canOpenFilter = true;
                var __ds = _dsMovAutomaticos;
                var _CODINST='CODINST';

                if(tipo=='filha'){
                    __ds  = self.dsItens;
                    _CODINST = 'CODINSTFILHA';
                }

                if(!__ds.getFieldValueAsString(_CODINST)){
                    MessageUtils.showAlert('Necessário preencher a instância');
                    canOpenFilter=false;
                }
                else{
                //  var deferred = $q.defer();
                ServiceProxy.callService('movautomaticos@MovAutomaticosSP.resolveEntity', {
                    codigoIstancia: __ds.getFieldValueAsString(_CODINST)
                }).then(function (result) {
                var entityName = result.responseBody.descricao;
                
                //Recuperando filter transiente do BD 
                if(__ds.getFieldValueAsString('TRANSIENTFILTER'))
                $scope.transientFilter =  JSON.parse(__ds.getFieldValueAsString('TRANSIENTFILTER'));
        
                // Se estiver mudando de instancia, o filtro aparecerá zerado         
                if(__ds.getFieldValueAsString('INSTANCIA'))
                if(entityName != __ds.getFieldValueAsString('INSTANCIA')){
                    zeraFiltro();
                }

                var preferenciasTW = {
                    transientFilter :  $scope.transientFilter,
                    ehEntrada: true,
                    pesagens: 'VAZIO',
                    agruparColetas: 'S',
                    idMov:  __ds.getFieldValueAsString('IDMOV'),
                    entityName: entityName,
                    ds:__ds

                };

                var popupInstance = SanPopup.open({
                    title: 'Condição de ativação',
                    templateUrl: 'html5/MovAutomaticos/popup/selecaocampo/selecaocampo.tpl.html',
                    controller: 'selecaoCampoController',
                    controllerAs: 'ctrlDois',
                    size: 'lg', 
                    okBtnLabel: 'Confirmar',
                    showBtnNo: false,
                    resolve: {
                        data: preferenciasTW
                    }
                  });	

                popupInstance.result
                    .then(function(paramsPopUp) {
                        if(angular.isDefined(__ds)){
                            __ds.refreshCurrentRow();
                            zeraFiltro();
                    }
                    
                 });
            
                    return popupInstance;

                }, //deferred.rejec
                
                );
               }
        }
            
        function reprocessBuildField(dataset){
            
              self.fieldsAll.forEach(
                function(field) {
                    buildFieldAbstract(dataset,'#pers-filter-field-name-'+field.toLowerCase(),field)
                  }
               )
        }

        function buildFieldAbstract(dataset, id, field){

            var myElement = angular.element(document.querySelector(id))
            var descricao = dataset.getFieldValueAsString(field);
                
                  if(dataset.getFieldValueAsString(field)=="")
                      descricao = 'Selecione um campo'

                     buildAtributesDefinied(myElement, 'sk-placeholder', descricao)
                     buildAtributesDefinied(myElement, 'tooltip', descricao)
                     buildAtributesDefinied(myElement, 'placeholder', descricao)
            
        }

         function buildAtributesDefinied(myElement, attr, descricao){

         if(angular.isDefined(myElement[0]))
            if(angular.isDefined(myElement[0].attributes[attr])){

                myElement[0].attributes[attr].value =  descricao;
            }

            if(angular.isDefined(myElement[0]))
            if(angular.isDefined(myElement[0].firstChild.attributes[attr])){

                myElement[0].firstChild.attributes[attr].value = descricao;
            }

        }

        function buildComponentFromField(fieldName, scope) {
           var descricaoEle = 'vlr';
            var idElemento = 'pers-filter-field-name-'+fieldName.toLowerCase();
            
            scope.openFieldSelector=openFieldSelector;
            scope.ServiceProxy = ServiceProxy;

                var hBoxElemNovo = AngularUtil.createDirective('sk-text-input', {
                    'id': idElemento,
                    'sk-value': descricaoEle,
                    'tooltip':  'Campo Dinâmico',
                    'tooltip-append-to-body':'true',
                    'sk-required' : 'required',
                    'sk-enabled' : 'enabled',
                    'ng-click' : 'openFieldSelector(\''+fieldName +'\',\''+idElemento+'\')',
                    'ng-keydown' : 'openFieldSelector(\''+fieldName +'\',\''+idElemento+'\')',
                    'sk-placeholder': "Selecione o campo"
                }, scope);

                return hBoxElemNovo;
                
        }

        function getButtonColor(tipo){
               
                var instancia = 'CODINST';
                var ds = _dsMovAutomaticos;

                if(tipo=='filha'){   
                    instancia = 'CODINSTFILHA';
                    ds = self.dsItens; 
                }

                if( ds.getFieldValueAsString('EXPRESSAO') =='' 
                 || ds.getFieldValueAsNumber(instancia)==0)
                    return 'btn btn-filter btn-primary btn-sk-sm'
                else 
                    return 'btn btn-filter btn-sk-sm btn-danger'
                    
        }

		function buildFieldContainer(fieldName, dataset, fieldElem, scope) {

             if (dataset.getEntityName() == 'MovAutomaticos') {

                    if(fieldName == 'CODINST'){
                        
                        scope.openFilterCustom=openFilterCustom;
                        scope.getButtonColor=getButtonColor;
                        scope.ServiceProxy = ServiceProxy;

                        var hBoxElem = AngularUtil.createDirective('sk-hbox', {
                            'layout-align': 'start center',
                            'flex': '',
                        }, scope);

                        var botaoFilter = AngularUtil.createDirective('button', {
                            'type': 'button',
                            'ng-click': 'openFilterCustom()',
                            'ng-click': 'openFilterCustom()',
                            'class' : 'btn btn-filter btn-sk-sm',
                            'tooltip' : 'Filtros',
                            'tooltip-placement' : 'bottom',
                            'tooltip-append-to-body' : 'true',
                            'style' : "padding: 0px; margin-left: 3px;",
                            'ng-class' : 'getButtonColor()',
                        }, scope);

                        var iconeBotaoFilter = AngularUtil.createDirective('sk-icon', {
                            'font-icon': 'filter',
                            'class' : 'ng-isolate-scope no-text',
                        }, scope);

                        var spanIcon = AngularUtil.createDirective('span', {
                            'class': 'glyphicons glyphicons-filter',
                        }, scope);

                        botaoFilter.append(iconeBotaoFilter);

                        hBoxElem.append(fieldElem);

                        hBoxElem.append(botaoFilter);

                        return hBoxElem;
                    }
                    else 
                    if (fieldName == 'IDMOV') {
				   
                        var hBoxElem = AngularUtil.createDirective('sk-hbox', {
                            'layout-align': 'start center',
                            'flex': '',
                        }, scope);

                        var helpTexto = 'Processo automático';

                        if (helpTexto[0] == '(') {
                            helpTexto = helpTexto.replace('(', '').replace(')', '');
                        }
                        var helpTipElem = AngularUtil.createDirective('sk-help-tip', {
                            'sk-help-tip': helpTexto,
                            'style': 'margin-left: 5px'
                        }, scope);

                        hBoxElem.append(fieldElem);
                        hBoxElem.append(helpTipElem);

                        return hBoxElem;
                    }

                }else if (dataset.getEntityName() == 'ItensMovAut'){

                    if(ArrayUtils.isIn(self.fieldsAll, fieldName)){
                        return buildComponentFromField(fieldName, scope); 
                    }

                   if(fieldName == 'CODINSTFILHA'){
                        
                        var hBoxElem = AngularUtil.createDirective('sk-hbox', {
                            'layout-align': 'start center',
                            'flex': '',
                        }, scope);

                        scope.openFilterCustom=openFilterCustom;
                        scope.getButtonColor=getButtonColor;

                        var buttonFilter = AngularUtil.createDirective('button', {
                            'type': 'button',
                            'ng-click': 'openFilterCustom(\'filha\')',
                            'ng-click': 'openFilterCustom(\'filha\')',
                            'class' : 'btn btn-filter btn-sk-sm',
                            'tooltip' : 'Filtros',
                            'tooltip-placement' : 'bottom',
                            'tooltip-append-to-body' : 'true',
                            'style' : "padding: 0px; margin-left: 3px;",
                            'ng-class' : 'getButtonColor(\'filha\')',
                        }, scope);

                        var iconButtonFilter = AngularUtil.createDirective('sk-icon', {
                            'font-icon': 'filter',
                            'class' : 'ng-isolate-scope no-text',
                        }, scope);

                        buttonFilter.append(iconButtonFilter);

                        hBoxElem.append(fieldElem);

                        hBoxElem.append(buttonFilter);

                        return hBoxElem;
                    }

                }
            }
        }
    ]);

