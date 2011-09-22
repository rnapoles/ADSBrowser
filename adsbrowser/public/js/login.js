Ext.ns('login');
Config = {}
login.index = {
	init: function(){
	
		Ext.QuickTips.init();
		var UserTextField = new Ext.form.TextField({
			fieldLabel:'Usuario',
			type:'textfield',
			name:'cmb-Tpl',
			allowBlank: false,
			emptyText:'Usuario...',
			triggerAction: 'all',
			displayField:'name'
		});
		
		var passw = new Ext.form.TextField({
			fieldLabel: 'Contrase&ntilde;a',
			name: 'passw',
			id:'passw',
			//width:164,
			inputType: 'password',
			allowBlank: false,
			blankText:'Este campo es obligatorio.',
			enableKeyEvents  : true,
/*			keypress: function(e, el) {
				var charCode = e.getCharCode();
				Ext.Msg.alert(charCode);
			}
*/			
                     listeners:   
                     {  
                         keypress: function(t,e)  
                         {  
                             if(e.getKey() == 13)  
                             {  
                                // Ext.get('server').focus(); 
                                //Ext.Msg.alert(e.getKey()); 
                                Enviar();
                             }  
                         }  
                     } 


		});
		
 
		
		
		var win=new Ext.Window({
			title: '&Aacute;rea de Acceso',
			bodyStyle:'padding: 10px',		//alejamos los componentes de los bordes
			//width:320,
			//height:160,
			layout:'form',
			items: [UserTextField,passw],			
	    	 buttons: [{
				text: 'Entrar',
				handler:Enviar
			}] 
		});
		//Ext.MessageBox.wait('Cargando  Aplicación ...');
		
		win.show();

		function Enviar(){
				Ext.Ajax.request({
									url:"Login",
									params:{user:UserTextField.getValue(),password:passw.getValue()},
									/*callback:function(a,b,c){	
											if (c.responseText != 'OK'){
											Ext.Msg.alert('Login Failed',c.responseText);							
		//									alert(c.responseText);
											}else{
											var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando   ..."});
											myMask.show();
											document.location.href="index.php";
											}
									
								}*/
								   success: function(response, opts) {
									  var obj = Ext.decode(response.responseText);
									  if(obj.success == true){

											//Config;
											Config.DnsDomain =   obj.DnsDomain;
											Config.RootDSE =   obj.RootDSE;
											win.close();
											
											//Plugins
											loadjscssfile("./jslibs/RowEditor.js");
											loadjscssfile("./jslibs/CheckColumn.js");
											loadjscssfile("./jslibs/PasswordMeter.js");
											loadjscssfile("./jslibs/Ext.ux.grid.Search.js");

											//Wizard
											loadjscssfile("./jslibs/wizard/CardLayout.js");
											loadjscssfile("./jslibs/wizard/Wizard.js");
											loadjscssfile("./jslibs/wizard/Header.js");
											loadjscssfile("./jslibs/wizard/Card.js");		
											
											//Samba Flags
											loadjscssfile('js/flags.js');
											
											//Dialogs
											loadjscssfile("./js/Dialogs/SendDialog.js"); 											
											loadjscssfile("./js/Dialogs/DialogResetPass.js"); 											
											
											//Menus
											//loadjscssfile('js/ContexMenu.js');
											loadjscssfile('js/ContexMenu.js');
											
											//Controllers
											loadjscssfile('js/UserController.js');
											
											
											//Base App
											loadjscssfile('js/application.js');
											
									  } else {
											Ext.Msg.alert('Login Failed!', obj.msg); 
											 
									  }
									  
								   },
								   failure: function(response, opts) {
									  //console.log('server-side failure with status code ' + response.status);
								   }								
								
								
				});
		
		};
		
	}	
}

Ext.onReady(login.index.init);
