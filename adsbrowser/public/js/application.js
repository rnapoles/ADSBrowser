Ext.ns("AdsBrowser");



if(typeof(console) == 'undefined'){
	console.log = function(){};
	console.dir = function(){};
}

AdsBrowser = {
	GridObjectBrowser:null
	,GridStore:null
	,MainContainer:null
	,Form1:null
	,GridMask:null
	,TreeBrowserLoader:null	
	,TreePanelBrowser:null	

	

    ,init: function () {
        
		Ext.QuickTips.init();
		//init ContextMenu
		
		AppContexMenu.init();
		
   
            
        //alert(Config.BaseDn)
		this.TreeBrowserLoader = new Ext.tree.TreeLoader({
			dataUrl   :"Browser/getTreeNodes"
			,listeners: {
				loadexception: function(tl, node, response) {
					Ext.Msg.alert('Error','Error al cargar la informaci&oacute;n'); 
				}
			}
		});
		
        this.TreePanelBrowser = new Ext.tree.TreePanel({
            id: 'Browser/TreePanelBrowser'
            ,region: 'west'
            ,title: 'Active Directory Users and Computers'
            ,width: 200
            ,collapsible: true
            ,border: false
            ,autoScroll: true
            //,dataUrl: 'Browser/getTreeNodes'
			,loader:this.TreeBrowserLoader
            ,enableDD: true
            ,ddGroup: 'grid2tree'
            //,listeners:{	}
            
            ,root: new Ext.tree.AsyncTreeNode({
                id: Config.RootDSE,
                text: Config.DnsDomain,
                iconCls: 'domain-icon'
            })
        });
		

        this.TreePanelBrowser.getRootNode().expand();

        this.GridStore = new Ext.data.JsonStore({
            url: 'Browser/getGridElements',
            root: 'Nodos',
            fields: [  
					   'id', 'name','samaccountname','type'
					 , 'groupType','is_group','typeText', 'description'
					 , 'icon', 'is_container' , 'is_ou'
					 , 'ObjectName' , 'oldParentDn'
					 , 'draggable' , 'disable'
					 , 'systemPossSuperiors','objectClass'
					]
        });

		this.GridSelectionModel = new Ext.grid.RowSelectionModel({  
		    singleSelect:true,  
		    listeners: {  
		        beforerowselect: function(SelectionModel ,rowIndex,keepExisting,record){  
		            AdsBrowser.GridObjectBrowser.ddText = record.data.id;  
		        }  
		    }  
		});
        
        this.GridStore.on('load',this.GridStoreOnLoad);
		this.GridStore.on('exception',this.GridStoreOnException);
        this.GridStore.load();
		
        this.GridObjectBrowser = new Ext.grid.GridPanel({
            store: this.GridStore
            ,loadMask:true
            ,id: 'GridObjectBrowser'
            ,enableDragDrop: true
            ,ddGroup: 'grid2tree'
            ,enableDD: true
            // ,loadMask : Mascara,
            // ,plugins : [RowEditor, Buscar]
            //   ,plugins : new Ext.ux.CellFieldDropZone()

            
            ,columns: [
            // new Ext.grid.RowNumberer(), new Ext.grid.CheckboxSelectionModel(),
            // SelectionModel,
            {
                header: 'Nombre:',
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    // alert(record.data.icon);
                    if (record.data.icon != '') {
                        metaData.css = record.data.icon;
                       
                    }
                    else {
                        metaData.css = 'folder-icon';
                    }
                    // metaData.value = 'ceo-icon';
                    return '&nbsp;&nbsp;&nbsp;&nbsp;' + value + String.format('<img class="padding-img" src="{0}"/>', Ext.BLANK_IMAGE_URL);
                    
                    
                }, dataIndex: 'name',
                sortable: true,
                width: 200
                // , editor : Usuarioeditor
            }, {
                header: 'Tipo',
                dataIndex: 'typeText',
                sortable: true,
                width: 180
                // , editor : Nombreeditor
            }, {
                header: 'Descripcion',
                dataIndex: 'description',
                sortable: true,
                width: 600
                // , editor : Maileditor
            }]
            ,sm:this.GridSelectionModel
            ,bbar: new Ext.PagingToolbar({

                displayInfo: true,
                displayMsg: 'Mostrando {0} - {1} de {2}',
                emptyMsg: "No hay elementos",
                store: this.GridStore,
                pageSize: 18,

            }),
            border: false,
            stripeRows: true,
            myRecord: ''
        });
        

        this.GridObjectBrowser.addListener('contextmenu',this.GridObjectBrowserOnContextMenu);
        this.GridObjectBrowser.addListener('cellcontextmenu',this.GridObjectBrowserOnCellContextMenu);
		this.GridObjectBrowser.on("celldblclick",this.GridObjectBrowserOnCellDblClick);
		
		this.GridObjectBrowser.on("cellmousedown",function(Grid,rowIndex,columnIndex,EventObject){
			//console.log("cellmousedown");
		});



        var MainContainer = new Ext.Panel({
            id: 'MainContainer',
            // width : 425,
            // height : 250,
            collapsible: true,
            layout: 'fit',
            region: 'center',
            // title : 'Simple ListView <i>(0 items selected)</i>',
            items: this.GridObjectBrowser
        });



        var Form1 = new Ext.Window({
            title: 'Acive Directory Browser',
            layout: 'border',
            // Step 1
            width: 800,
            // Step 2
            height: 400,
            maximizable: true,
            minimizable: true,
            items: [this.TreePanelBrowser, MainContainer]
        });
        
        Form1.on('close',function(){
					Ext.Ajax.request({
										url: 'Login/logout',
										method : 'POST', 
										success: function(response, opts) {
											location.href='/';
										}

					}); 
			
        });
        Form1.show();
        this.GridMask = new Ext.LoadMask('GridObjectBrowser', {msg:"Please wait..."});
        
		
	//Drop to grid
		var gridTargetEl =  this.GridObjectBrowser.getView().scroller.dom;
        //var GridDropTarget = new Ext.dd.DropZone(gridTargetEl, {
        var GridDropTarget = new Ext.dd.DropTarget(gridTargetEl, {
				ddGroup    : 'grid2tree'
                ,notifyDrop : function(ddSource, e, data){
					
						var rowIndex = AdsBrowser.GridObjectBrowser.getView().findRowIndex(e.target);
						var Parentrecord = AdsBrowser.GridObjectBrowser.getStore().getAt(rowIndex);
						
						
												
						if(ddSource.grid){
							var dropRowIndex = ddSource.getDragData(e).rowIndex;
							var NewParent = AdsBrowser.GridStore.getAt(dropRowIndex);

							if(!data.selections[0].data.draggable){
								return false;
							}
							
								
							var is_container = data.selections[0].data.is_container;
							var Dn = data.selections[0].data.id;
							var newParentDn = NewParent.id;
							var ObjectName = data.selections[0].data.ObjectName;
							var newdn = ObjectName +','+ newParentDn;
							var oldParentDn = data.selections[0].data.oldParentDn;
							
							
													
							/*
							console.log(is_container);
							console.log(Dn);
							console.log(newParentDn);
							console.log(ObjectName);
							console.log(newdn);
							console.log(oldParentDn);
							console.dir(data.selections[0].data);
							*/
							
						} else {
							
							//console.dir(ddSource);
							
							if(!ddSource.tree) return ;
							e.cancel = false;
							var node = ddSource.dragData.node;
							var existe = AdsBrowser.GridStore.find('id',node.attributes.id,0,false,true); 

								
							var CurrentBaseDn = AdsBrowser.GridStore.reader.jsonData.BaseDn;
							var newParentDn = CurrentBaseDn;
							var is_container = node.attributes.is_container;
							var Dn = node.attributes.id;
							var ObjectName = node.attributes.ObjectName;
							var newdn = ObjectName +','+ newParentDn;
							var oldParentDn = node.attributes.oldParentDn;							
							
							//objectClass
							//systemPossSuperiors
							
							if(Parentrecord){
								newParentDn = Parentrecord.id;
								newdn = ObjectName +','+ newParentDn;
							} else {
								if(existe != -1) return ;
								var r = [AdsBrowser.NodeToRecord(node)];
							}
							
							console.log(AdsBrowser.GridStore.getById(CurrentBaseDn));

						}
						if(Dn == newParentDn) return;

						Ext.Ajax.request({
											url: 'Browser/move',
											method : 'POST', 
											success: function(response, opts) {
													//Ext.Msg.alert('Success',response.responseText);	
													var JsonObj = Ext.decode(response.responseText);
													AdsBrowser.GridMask.hide();
													if(!JsonObj.success){
														Ext.Msg.alert('<b>Error</b>',JsonObj.msg);
														return false;
													}
													
													if(ddSource.tree){
														if(r){
															AdsBrowser.GridObjectBrowser.store.add(r);
														}	
														node.remove();
													}else{
														var records =  ddSource.dragData.selections;
														Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);													
													}

													//if(!is_container)
													AdsBrowser.ReloadGrid();
		
														
													AdsBrowser.TreePanelBrowser.getRootNode().cascade(function () {
														if (this.id == newParentDn) {
															AdsBrowser.ReloadTree(this);
														}
														if (this.id == oldParentDn) {
															AdsBrowser.ReloadTree(this);
														}

													});													    

											},

											failure: function(response, opts) {
													ErrorMsg = 'status code ' + response.status;
													Ext.Msg.alert('<b>Error failure</b>',ErrorMsg);
																		
											},
											params: { 
													dn:Dn,
													newParentDn:newParentDn,
													ObjectName:ObjectName,
													newdn:newdn
											}
						});
											

						return true;
                }
        });
        


		
		
        AdsBrowser.TreePanelBrowser.on('contextmenu',this.TreePanelBrowserOnContextMenu);
        AdsBrowser.TreePanelBrowser.on('beforemovenode',this.TreePanelBrowserOnBeforeMoveNode);
        AdsBrowser.TreePanelBrowser.on('beforenodedrop',this.TreePanelBrowserOnBeforeNodeDrop);
        AdsBrowser.TreePanelBrowser.on('movenode',this.TreePanelBrowserOnMoveNode);
        AdsBrowser.TreePanelBrowser.on('click',this.TreePanelBrowserOnClick);
    }
    
    ,NodeToRecord:function(node) {
			//if (node.childNodes.length > 0) return -1;
				
			/*
				'id', 'name'
				, 'type', 'description'
				, 'icon', 'is_container'
				, 'ObjectName' , 'oldParentDn'
				, 'draggable'
			*/					
				/*'text':name
				,'id':str(msg.dn)
				,'iconCls':icon
				,'ObjectName':ObjectName
				,'oldParentDn':str(msg.dn.parent())
				,'draggable':draggable
				
					   'id', 'name','samaccountname','type'
					 , 'groupType','typeText', 'description'
					 , 'icon', 'is_container' , 'is_ou'
					 , 'ObjectName' , 'oldParentDn'
					 , 'draggable' , 'disable'				
				
				
				*/
												
			var record = new Ext.data.Record();
			record.data.id = node.attributes.id;
			record.data.icon = node.attributes.iconCls;
			record.data.name = node.text;
			record.data.ObjectName = node.attributes.ObjectName;
			record.data.oldParentDn = node.attributes.oldParentDn;
			record.data.draggable = node.attributes.draggable;
			//console.log(record);
			return record;
	}
	,ReloadGrid:function(dn){
		dn = typeof(dn) != 'undefined' ? dn : AdsBrowser.GridStore.reader.jsonData.BaseDn;
		
		AdsBrowser.GridStore.load({
								params: {
										"node": dn
								}
		}); 	
	
	}	

	,ReloadTree:function(node){
		if(typeof(node) == 'undefined') return ;
		if (node.reload) node.reload();
	}
	
	,ReloadTreeNode:function(dn){
		if(typeof(dn) == 'undefined') return ;
        var args = [dn];
        AdsBrowser.TreePanelBrowser.getRootNode().cascade(function () {
			c = args[0];
            var Parent = '';
            if (this.parentNode) Parent = this.parentNode.getPath();

            if (this.id == c) {
                if (this.reload) this.reload();
                AdsBrowser.TreePanelBrowser.fireEvent("click", this);
                this.expand();
            }

        }, null, args);			
	}
	    
    ,GridStoreOnException:function(store, records, options){
		Ext.Msg.alert('Error','Error al cargar la informaci&oacute;n'); 
    }
    
	,GridStoreOnLoad:function(records,options){
		if(records.getCount() == 0)  AdsBrowser.GridStore.removeAll();
		
	}
	,GridObjectBrowserOnContextMenu:function (e) {
			e.stopEvent();
			console.log('OnContextMenu');
			//if(AppContexMenu.show) return;
            var coords = e.getXY();
			//console.log(e);
			//AppContexMenu.UserContexMenu.showAt([coords[0], coords[1]]);
			
	}
	,GridObjectBrowserOnCellContextMenu:function (obj,rowIndex,cellIndex,e) {

			e.stopEvent();

            var coords = e.getXY();
            var row = obj.getStore().getAt(rowIndex);
             
            var sm = obj.getSelectionModel();
            if (!sm.isSelected(rowIndex)) {
                sm.selectRow(rowIndex);
                obj.fireEvent('rowclick', obj, rowIndex, e);
            }
            
            AppContexMenu.data = row;
            
            var type = obj.getStore().getAt(rowIndex).get('type');
            var groupType = obj.getStore().getAt(rowIndex).get('groupType');
            var is_group = obj.getStore().getAt(rowIndex).get('is_group');
            var is_container = obj.getStore().getAt(rowIndex).get('is_container');
            var is_ou = obj.getStore().getAt(rowIndex).get('is_ou');
            var draggable = obj.getStore().getAt(rowIndex).get('draggable');
            var disable = obj.getStore().getAt(rowIndex).get('disable');
            
            
            
            if(type == SambaFlags.ATYPE_NORMAL_ACCOUNT) {
				
				if(!draggable){
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuMove').disable();	 	 
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuCut').disable();	 	 
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuDelete').disable();	 	 
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuChangeName').disable();	
				} else {
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuMove').enable();	 	 
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuCut').enable();	 	 
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuDelete').enable();	 	 
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuChangeName').enable();	
									
				}
				
				if(disable){
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuDisableAccount').setText('Habilitar cuenta');
				} else {
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuDisableAccount').setText('Deshabilitar cuenta');
				}
				
  			    AppContexMenu.UserContexMenu.showAt([coords[0], coords[1]]);	
			} else if(type == 'builtinDomain') {	
					AppContexMenu.BuiltinContexMenu.showAt([coords[0], coords[1]]);
			} else if(is_container && !is_ou){

				if(!draggable){
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuMove').disable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuCut').disable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuDelete').disable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuChangeName').disable();	 	 
				} else {
					AppContexMenu.ContainerContexMenu.items.get('IdUserContexMenuMove').enable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuCut').enable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuDelete').enable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuChangeName').enable();	 	 
				}				
				
				AppContexMenu.ContainerContexMenu.showAt([coords[0], coords[1]]);
				
				
			} else if(is_ou) {
				
				if(!draggable){
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuCut').disable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuDelete').disable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuChangeName').disable();	 	 
				} else {
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuCut').enable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuDelete').enable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuChangeName').enable();	 	 
				}					
				
				AppContexMenu.OUContexMenu.showAt([coords[0], coords[1]]);
			} else if (groupType == SambaFlags.GTYPE_SECURITY_BUILTIN_LOCAL_GROUP){
				AppContexMenu.BuiltinGroupContexMenu.showAt([coords[0], coords[1]]);
			} else if (is_group){
				AppContexMenu.GroupContexMenu.showAt([coords[0], coords[1]]);
			}	
			
					
				

	}
	,GridObjectBrowserOnCellDblClick: function (grid, row, column, e){

            // alert("Cell value: " + e.target.childNodes[0].textContent);
            var is_container = grid.getStore().getAt(row).get('is_container');
            var Dn = grid.getStore().getAt(row).get('id');
            if (is_container) {


                AdsBrowser.ReloadGrid(Dn);

                if (!AdsBrowser.TreePanelBrowser.collapsed) AdsBrowser.TreePanelBrowser.getRootNode().expand();


                var args = [Dn];
                AdsBrowser.TreePanelBrowser.getRootNode().cascade(function () {
                    c = args[0];
                    // this.ui.toggleCheck(c);
                    // this.attributes.checked = c;
                    var Parent = '';
                    if (this.parentNode) Parent = this.parentNode.getPath();

                    if (this.id == c) {

                        //if (this.reload) this.reload();
                        AdsBrowser.ReloadTree(this);
                        AdsBrowser.TreePanelBrowser.fireEvent("click", this);
                        this.expand();
                    }

                }, null, args);

            }
        }


		,TreePanelBrowserOnContextMenu: function(Node,Event){
			 Event.stopEvent();
            var coords = Event.getXY();
            AppContexMenu.data = AdsBrowser.NodeToRecord(Node);
            

            var type = Node.attributes.type;
            var is_container = Node.attributes.is_container;
            var is_ou = Node.attributes.is_ou;
            var draggable = Node.attributes.draggable;
  
            if(Node.attributes.id == Config.RootDSE){
				AppContexMenu.RootDSEContexMenu.showAt([coords[0], coords[1]]);
            }else if(type == 'builtinDomain') {	
					AppContexMenu.BuiltinContexMenu.showAt([coords[0], coords[1]]);
			} else if(is_container && !is_ou){

				if(!draggable){
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuMove').disable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuCut').disable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuDelete').disable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuChangeName').disable();	 	 
				} else {
					AppContexMenu.ContainerContexMenu.items.get('IdUserContexMenuMove').enable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuCut').enable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuDelete').enable();	 	 
					AppContexMenu.ContainerContexMenu.items.get('IdContainerContexMenuChangeName').enable();	 	 
				}				
				
				AppContexMenu.ContainerContexMenu.showAt([coords[0], coords[1]]);
				
				
			} else if(is_ou) {
				
				if(!draggable){
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuCut').disable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuDelete').disable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuChangeName').disable();	 	 
				} else {
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuCut').enable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuDelete').enable();	 	 
					AppContexMenu.OUContexMenu.items.get('IdOUContexMenuChangeName').enable();	 	 
				}					
				
				AppContexMenu.OUContexMenu.showAt([coords[0], coords[1]]);
			}					
            
		}

		,TreePanelBrowserOnBeforeMoveNode : function(tree,node,oldParent,newParent,index) {
			
		
		
		}
		
        // create nodes based on data from grid
        ,TreePanelBrowserOnBeforeNodeDrop:function (e) {
			
            
            if (Ext.isArray(e.data.selections)) {

				
                // reset cancel flag
                e.cancel = false;




                // setup dropNode (it can be array of nodes)
                e.dropNode = [];
                var r;
                for (var i = 0; i < e.data.selections.length; i++) {

                    // get record from selectons of gridStore
                    r = e.data.selections[i];


					oldParentDn = r.get('oldParentDn');
					
					if(!r.get('draggable')){
						return false;
					}
					
					
					
					Dn = r.get('id');
					newParentDn = e.target.id;
					ObjectName = r.get('ObjectName');
    				newdn = ObjectName +','+ newParentDn;
    				
    				var is_container = r.get('is_container');

                    //si es el mismo obj regreso false
                    if (Dn == e.target.id) return false;
                    if (newParentDn == oldParentDn) return false;
    				

								Ext.Ajax.request({
													url: 'Browser/move',
													method : 'POST', 
													success: function(response, opts) {
															//Ext.Msg.alert('Success',response.responseText);	
															var JsonObj = Ext.decode(response.responseText);
															AdsBrowser.GridMask.hide();
															if(!JsonObj.success){
																Ext.Msg.alert('<b>Error</b>',JsonObj.msg);
																return false;
															}
															/*
															if(!is_container)
															AdsBrowser.ReloadGrid(oldParentDn);
															*/
															
															AdsBrowser.ReloadGrid(oldParentDn);
															//AdsBrowser.ReloadTreeNode(oldParentDn);
						
															
															//e.target.reload();												

													},

													failure: function(response, opts) {
															ErrorMsg = 'status code ' + response.status;
															Ext.Msg.alert('<b>Error</b>',ErrorMsg);
													},
													params: { 
															dn:Dn,
															newParentDn:newParentDn,
															ObjectName:ObjectName,
															newdn:newdn
													}
								});
					
  
                    if(is_container) {
                    // create node from record data
                    //    alert(!is_container);
                        e.dropNode.push(this.loader.createNode({
                            text: r.get('name')
                            ,id: Dn
                            //,hidden:!is_container
                            //,leaf: !is_container
                            //,change:r.get('change')
                            //,qtip:r.get('industry')
                            ,iconCls: (r.get('icon') != '') ? r.get('icon') : 'folder-icon'
                        }));
                    }                      
                        
                }
				
				
                var Parent = '',
                    Child = '';
                e.tree.disable();    
                e.tree.getRootNode().cascade(function () {
                    if (this.id == Dn) {
						console.log(this.id);
						this.getUI().hide()
                        Parent = this.parentNode;
                        Child = this;
                    }

                });

                if (Parent) {
                    Parent.removeChild(Child);
                }  				
                e.tree.enable();   

                //return is_container;
                return false;
            }

            // if we get here the drop is automatically cancelled by Ext
        }
        
        ,TreePanelBrowserOnMoveNode:function (tree, node, oldParent, newParent, position) {


            var ObjectName = node.attributes.ObjectName;
            var oldParentDn = oldParent.id ;
            
		    var Dn = node.id;
			var newParentDn = newParent.id;
    		var newdn = ObjectName +','+ newParentDn;
    		
    		if(newdn == Dn)	 return;	
    		if(newParentDn == oldParentDn)	 return;	

            tree.disable();

            Ext.Ajax.request({
				url: 'Browser/move',
				method : 'POST', 
				params: { 
						dn:Dn,
						newParentDn:newParentDn,
						ObjectName:ObjectName,
						newdn:newdn
				},
                success: function (response, request) {

                    // if the first char of our response is zero, then we fail the operation,
                    // otherwise we re-enable the tree
                    
            
						
						var JsonObj = Ext.decode(response.responseText);
						
						if(!JsonObj.success){
								request.failure();
								Ext.Msg.alert('<b>Error</b>',JsonObj.msg);
								return false;
						}

                        tree.enable();
                        if(newParent.reload) newParent.reload();
                        if(oldParent.reload) newParent.reload();		
						
						var CurrentBaseDn = AdsBrowser.GridStore.reader.jsonData.BaseDn;
						if(CurrentBaseDn != Dn){
							AdsBrowser.GridStore.load({
								params: {
									"node": CurrentBaseDn

								}
							});   
						}else{
							AdsBrowser.GridStore.load({
								params: {
									"node": newdn
								}
							}); 						
						}
						
                        
                        //tree.fireEvent("click", node);
                        
                    
                }, failure: function () {

                    // we move the node back to where it was beforehand and
                    // we suspendEvents() so that we don't get stuck in a possible infinite loop
                    //tree.suspendEvents();
                    oldParent.appendChild(node);
                    
                    /*if (oldNextSibling) {
                        oldParent.insertBefore(node, oldNextSibling);
                    }*/

                    tree.resumeEvents();
                    tree.enable();

                    
                }

            });

        }
        
        ,TreePanelBrowserOnClick:function (node) {
			/*
			var TreeNodeNewParentDn = AdsBrowser.TreePanelBrowser.getNodeById(newParent.id);
			if(TreeNodeNewParentDn){
				AdsBrowser.TreePanelBrowser.oldIconCls = TreeNodeNewParentDn.iconCls;
				AdsBrowser.TreePanelBrowser.oldCssClassName=TreeNodeNewParentDn.getUI().getIconEl().className;
			} */        
        
			AdsBrowser.ReloadGrid(node.id)
            AdsBrowser.ReloadTree(node);
            
            
        }
}
/*
                  var selectedNode = TreePanelBrowser.selModel.selNode;
                  //adding a new node to the same level as the selectedNode:
                  var newNode = new Ext.tree.TreeNode({id: "foo", text: "foo", leaf: true});
                  //TreePanelBrowser.selModel.selNode.parentNode.appendChild(newNode);
                  //removing the selectedNode:
                  var delNode = TreePanelBrowser.selModel.selNode;
                  myTree.selModel.selNode.parentNode.removeChild(delNode);
*/

Ext.onReady(AdsBrowser.init, AdsBrowser);