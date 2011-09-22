DialogResetPass = {};

DialogResetPass = {
		show:function(dn,account){
			
			if(dn==null)return;
			if(account==null)return;
			
		   var FormResetPass = new Ext.FormPanel({
				labelWidth: 75
				,labelAlign: 'left'
				,frame:true
				//,title: 'Restablecer contrase&ntilde;a'
				//,bodyStyle:'padding:5px 5px 0'
                ,bodyStyle: 'x-window-body'
                ,border: false
				,monitorValid:true
				,items: [{
							layout: 'form'
							,items: [{
										xtype: "textfield"
										,labelAlign: 'left'
										,inputType: 'password'
										,id: "idpass1"
										,name: "pass1"
										,allowBlank: false
										,fieldLabel: "<b>Contrase&ntilde;a</b>"
										,width: '95%'
									},{
										xtype: "PasswordMeter"
										,labelAlign: 'left'
										,id: "idpass2"
										,name: "pass2"
										,inputType: 'password'
										,fieldLabel: "<b>Contrase&ntilde;a</b>"
										,allowBlank: false
										,width: '95%'
									},{
										xtype: 'fieldset'
										,title: ''
										,labelAlign: 'top'
										//collapsible: true
										,items: [{
													xtype:'checkbox'
													,fieldLabel: ''
													,boxLabel: 'El usuario debe de cambiar la contrase&ntilde;a en el siguiente inicio de sessi&oacute;n'
													,name: 'ForcePasswordChange'									
													//,height: 30
												},{
													xtype: 'box'
													,id:'AccountStatusLabel'
													
													,autoEl: {
														//tag: 'blockquote'
														html: '<span style="font-size: small">&nbsp;&nbsp;&nbsp;El usuario ha de cerrar la sessi&oacute;n y volver a abrirla para que los cambios<br>&nbsp;&nbsp; tengan efecto.<br><br></span>'
													}												
												},{
													xtype: 'box'
													,autoEl: {
														tag: 'blockquote'
														,html: '<span style="font-size: small">Estado del bloqueo de cuenta en este controlador de dominio:</span>'
													}												
												},{
													xtype:'checkbox'
													,fieldLabel: ''
													,boxLabel: 'Desbloquear la cuenta de usuario'
													,name: 'UnlockUserAccount'									
												}]									
									}]
					}]
                    ,buttons: [{
                        text: 'Guardar',
                        formBind: true,
                        handler:function(){

							var pass1 =  Ext.getCmp('idpass1').getValue();
							var pass2 =  Ext.getCmp('idpass2').getValue();
							var strength = Ext.getCmp('idpass2').getStrength();

							if (pass1 != pass2){
								Ext.Msg.alert('Error','Las Contrase&ntilde;as no son iguales');
								return;
							}

							if (strength <= 60){
								Ext.Msg.alert('Error','La Contrase&ntilde;a es demasiado d&eacute;bil');
								return;								
							}
							
							params={
								dn:dn
								,account:account
								,password:pass1
							}	
							SendForm(FormResetPass,WindowResetPass,'User/SetPassword',params,true,false)
						
                        }
                    }, {

                        text: 'Cancelar',

                        handler: function () {

                            WindowResetPass.close();

                        }

                    }]
			});

			

			var WindowResetPass = new Ext.Window({
                    title: 'Restablecer contrase&ntilde;a'
                    ,modal:true
                    ,labelWidth: 75
                    ,frame: true
                    ,bodyStyle: 'padding:5px 5px 5px 5px'
                    ,layout: 'form'
                    ,items: [FormResetPass]
			});


			//top.render(WindowResetPass);
			
			WindowResetPass.show();			
			WindowResetPass.center();
		
		}
}