AppContexMenu={};
AppContexMenu={
	UserContexMenu : null
	,BuiltinContexMenu : null
	,OUContexMenu : null
	,ContainerContexMenu : null
	,show : false	
	,data : null
	
	,init:function(){
	
            this.UserContexMenu = new Ext.menu.Menu({

                id: 'UserContexMenu'

                ,items: [
							{
								text: 'Copiar ...'


								,handler: this.OnContexMenuCopyClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Agregar a un grupo'


								,handler: this.OnContexMenuAddUserClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Deshabilitar cuenta'
								,id:'IdUserContexMenuDisableAccount'

								,handler: this.OnUserContexMenuDisableAccountClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Restablecer contrase&ntilde;a'


								,handler: this.OnUserContexMenuResetPassClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Mover ..'
								,id:'IdUserContexMenuMove'

								,handler: this.OnContexMenuMoveClick

								//,iconCls: 'edit_user'

							},/* '-', {

								text: 'Estado de Acceso'


								//,handler: clickEditar

								//,iconCls: 'edit_user'

							},*/ {

								text: 'Cortar'
								,id: 'IdUserContexMenuCut'

								,handler: this.OnContexMenuCutClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Eliminar'
								,id:'IdUserContexMenuDelete'

								,handler: this.OnContexMenuDeleteClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Cambiar nombre'
								,id:'IdUserContexMenuChangeName'

								,handler: this.OnContexMenuRenameClick

								//,iconCls: 'edit_user'

							}, '-', {

								text: 'Propiedades'


								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });   
            
            
            this.BuiltinContexMenu = new Ext.menu.Menu({

                id: 'BuiltinContexMenu',

                items: [
							{
								text: 'Buscar'
								//,id:'IdBuiltinContexMenuSearch'

								,handler: this.OnContexMenuSearchClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Nuevo'
								//,id:'IdBuiltinContexMenuNew'
								,menu: {        // <-- submenu by nested config object
									items: [
										// stick any markup in a menu
										'<b class="menu-title">Nuevo</b>',
										{
											text: 'Equipo'
											//,id:'IdBuiltinContexMenuPc'
											,handler: this.OnContexMenuAddPcClick
										}, {
											text: 'Grupo'
											//,id:'IdBuiltinContexMenuGroup'
											,handler: this.OnContexMenuAddGroupClick
										}, {
											text: 'InetOrgPerson'
											//,id:'IdBuiltinContexMenuInetOrgPerson'
											,handler: this.OnContexMenuAddInetOrgPersonClick
										}, {
											text: 'Usuario'
											//,id:'IdBuiltinContexMenuUser'
											,handler: this.OnContexMenuAddUserClick
										}
									]
								}
            

								//,handler: clickEditar

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Actualizar'
								//,id:'IdContexMenuUpdate'

								,handler: this.OnContexMenuUpdateClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Propiedades'
								//,id:'IdBuiltinContexMenuProperties'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });   
            
           
            
            this.ContainerContexMenu = new Ext.menu.Menu({

                id: 'ContainerContexMenu',

                items: [
                
							{
								text: 'Delegar control'
								,handler: this.OnContexMenuDelegateControlClick
							},{
								text: 'Mover...'
								,id:'IdContainerContexMenuMove'

								,handler: this.OnContexMenuMoveClick

								//,iconCls: 'edit_user'

							},{
								text: 'Buscar'

								,handler: this.OnContexMenuSearchClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Nuevo',
								menu: {        // <-- submenu by nested config object
									items: [
										// stick any markup in a menu
										'<b class="menu-title">Nuevo</b>',
										{
											text: 'Equipo'
											,handler: this.OnContexMenuAddPcClick
										}, {
											text: 'Contacto'
											,handler: this.OnContexMenuAddContactClick
										}, {
											text: 'Grupo'
											,handler: this.OnContexMenuAddGroupClick
										},{
											text: 'InetOrgPerson'
											,handler: this.OnContexMenuAddInetOrgPersonClick
										},{
											text: 'Impresora'
											,handler: this.OnContexMenuAddPrinterClick
										},{
											text: 'Usuario'
											,handler: this.OnContexMenuAddUserClick
										}, {
											text: 'Carpeta compartida'
											,handler: this.OnContexMenuAddShareFolderClick
										}
									]
								}
            

								//,handler: clickEditar

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Cortar'
								,id:'IdContainerContexMenuCut'

								,handler: this.OnContexMenuCutClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Eliminar'
								,id:'IdContainerContexMenuDelete'

								,handler: this.OnContexMenuDeleteClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Cambiar nombre'
								,id:'IdContainerContexMenuChangeName'

								,handler: this.OnContexMenuRenameClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Actualizar'

								,handler: this.OnContexMenuUpdateClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Propiedades'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });  
            
            
            this.OUContexMenu = new Ext.menu.Menu({

                id: 'OUContexMenu',

                items: [
                
							{
								text: 'Delegar control'
								,handler: this.OnContexMenuDelegateControlClick
							},{
								text: 'Mover...'
								,id:'IdOUContexMenuMove'

								,handler: this.OnContexMenuMoveClick

								//,iconCls: 'edit_user'

							},{
								text: 'Buscar'

								,handler: this.OnContexMenuSearchClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Nuevo',
								menu: {        // <-- submenu by nested config object
									items: [
										// stick any markup in a menu
										'<b class="menu-title">Nuevo</b>',
										{
											text: 'Equipo'
											,handler: this.OnContexMenuAddPcClick
										}, {
											text: 'Contacto'
											,handler: this.OnContexMenuAddContactClick
										}, {
											text: 'Grupo'
											,handler: this.OnContexMenuAddGroupClick
										},{
											text: 'InetOrgPerson'
											,handler: this.OnContexMenuAddInetOrgPersonClick
										},{
											text: 'Unidad organizativa'
											,handler: this.OnContexMenuAddOuClick
										},{
											text: 'Impresora'
											,handler: this.OnContexMenuAddPrinterClick
										},{
											text: 'Usuario'
											,handler: this.OnContexMenuAddUserClick
										}, {
											text: 'Carpeta compartida'
											,handler: this.OnContexMenuAddShareFolderClick
										}
									]
								}
            
							},'-', {

								text: 'Cortar'
								,id:'IdOUContexMenuCut'

								,handler: this.OnContexMenuCutClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Eliminar'
								,id:'IdOUContexMenuDelete'

								,handler: this.OnContexMenuDeleteClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Cambiar nombre'
								,id:'IdOUContexMenuChangeName'

								,handler: this.OnContexMenuRenameClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Actualizar'

								,handler: this.OnContexMenuUpdateClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Propiedades'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });   
            

            this.RootDSEContexMenu = new Ext.menu.Menu({

                id: 'RootDSEContexMenu',

                items: [
						{
								text: 'Delegar control'
								//,id:'IdBuiltinContexMenuSearch'

								,handler: this.OnContexMenuDelegateControlClick

								//,iconCls: 'edit_user'

							},{
								text: 'Buscar...'
								//,id:'IdBuiltinContexMenuSearch'

								,handler: this.OnContexMenuSearchClick

								//,iconCls: 'edit_user'

							},{
								text: 'Cambiar dominio'
								//,id:'IdBuiltinContexMenuSearch'

								,handler: this.OnContexMenuChangeDomainClick

								//,iconCls: 'edit_user'

							},{
								text: 'Cambiar el controlador de dominio'
								//,id:'IdBuiltinContexMenuSearch'

								,handler: this.OnContexMenuChangeDomainControllerClick

								//,iconCls: 'edit_user'

							},{
								text: 'Elevar el nivel funcional del dominio'
								//,id:'IdBuiltinContexMenuSearch'

								,handler: this.OnContexMenuRaiseDomainFunctionalLevelClick

								//,iconCls: 'edit_user'

							},{
								text: 'Maestro de operaciones'
								//,id:'IdBuiltinContexMenuSearch'

								,handler: this.OnContexMenuMasterOperationClick

								//,iconCls: 'edit_user'

							},'-',{

								text: 'Nuevo'
								//,id:'IdBuiltinContexMenuNew'
								,menu: {        // <-- submenu by nested config object
									items: [
										// stick any markup in a menu
										'<b class="menu-title">Nuevo</b>',
										{
											text: 'Equipo'
											,handler: this.OnContexMenuAddPcClick
										}, {
											text: 'Contacto'
											,handler: this.OnContexMenuAddContactClick
										}, {
											text: 'Grupo'
											,handler: this.OnContexMenuAddGroupClick
										},{
											text: 'InetOrgPerson'
											,handler: this.OnContexMenuAddInetOrgPersonClick
										},{
											text: 'Unidad organizativa'
											,handler: this.OnContexMenuAddOuClick
										},{
											text: 'Impresora'
											,handler: this.OnContexMenuAddPrinterClick
										},{
											text: 'Usuario'
											,handler: this.OnContexMenuAddUserClick
										}, {
											text: 'Carpeta compartida'
											,handler: this.OnContexMenuAddShareFolderClick
										}
									]
								}
            

								//,handler: clickEditar

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Actualizar'
								//,id:'IdContexMenuUpdate'

								,handler: this.OnContexMenuUpdateClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Propiedades'
								//,id:'IdBuiltinContexMenuProperties'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });       
            
            
            this.BuiltinGroupContexMenu = new Ext.menu.Menu({

                id: 'BuiltinGroupContexMenu',

                items: [
							{
								text: 'Agregar a un grupo'
								//,id:'IdContexMenuUpdate'
								,handler: this.OnContexMenuAddToGroupClick
							},'-', {

								text: 'Propiedades'
								//,id:'IdBuiltinContexMenuProperties'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });                   

            this.GroupContexMenu = new Ext.menu.Menu({

                id: 'GroupContexMenu',

                items: [
							{
								text: 'Agregar a un grupo'
								//,id:'IdContexMenuUpdate'
								,handler: this.OnContexMenuAddToGroupClick
							},{
								text: 'Mover'
								,id:'IdGroupContexMenuMove'
								,handler: this.OnContexMenuMoveClick
							},'-', {

								text: 'Cortar'
								,id:'IdGroupContexMenuCut'

								,handler: this.OnContexMenuCutClick

								//,iconCls: 'edit_user'

							},{

								text: 'Eliminar'
								,id:'IdGroupContexMenuDelete'

								,handler: this.OnContexMenuDeleteClick

								//,iconCls: 'edit_user'

							},{

								text: 'Cambiar nombre'
								,id:'IdGroupContexMenuRename'

								,handler: this.OnContexMenuRenameClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Propiedades'
								//,id:'IdBuiltinContexMenuProperties'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            }); 
	
	}

	,OnContexMenuCopyClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}

	,OnContexMenuCutClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuMoveClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuDeleteClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuRenameClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuSearchClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuUpdateClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnUserContexMenuDisableAccountClick : function(item,event){
		//console.dir(item);
		//console.dir(event);
		var dn = AppContexMenu.data.json.id;
		var account = AppContexMenu.data.json.id;
		if(item.text == 'Deshabilitar cuenta'){
			//console.log(AppContexMenu.data);
			//AppContexMenu.data
			UserController.EnableAccount(dn,account,false);
		} else {
			UserController.EnableAccount(dn,account,true);
		}
		
	}


	,OnUserContexMenuResetPassClick : function(item,event){
		
		var dn = AppContexMenu.data.json.id;
		var account = AppContexMenu.data.json.id;
		UserController.SetPassword(dn,account);
		
	}


	,OnContexMenuDelegateControlClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuPropertyClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddPcClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddGroupClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddInetOrgPersonClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddContactClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddPrinterClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddUserClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddShareFolderClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}	
	
	,OnContexMenuChangeDomainClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuChangeDomainControllerClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuRaiseDomainFunctionalLevelClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuMasterOperationClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuAddToGroupClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}	
};