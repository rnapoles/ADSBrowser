
function SendForm(Form,MainWindow,url,params,reloadgrid,reloadtree){
	
	if(typeof(Form) == 'undefined') return false;  
	if(typeof(MainWindow) == 'undefined') return false;
	if(typeof(url) == 'undefined') return false;
	if(typeof(params) == 'undefined') return false;
	if(typeof(params.dn) == 'undefined') return false;
	if(typeof(params.account) == 'undefined') return false;
	
	reloadgrid = typeof(reloadgrid) != 'undefined' ? reloadgrid : false;
	reloadtree = typeof(reloadtree) != 'undefined' ? reloadtree : false;
	
    Form.getForm().submit({
        url: url,
        params: params
        , success: function (form, action) {
            if(!action.result.success){
				Ext.Msg.alert('Informaci&oacute;n',action.result.msg,MainWindow.close());
				return false;
            }
            if(reloadgrid){
					AdsBrowser.ReloadGrid()
            }
            if(reloadtree){
					AdsBrowser.ReloadTreeNode(params.dn)
            }
            MainWindow.close();
            
        }, failure: function (form, action) {

            switch (action.failureType) {
				case Ext.form.Action.CLIENT_INVALID:
					Ext.Msg.alert('Error', 'El formulario contiene valores invalidos',MainWindow.close());
				break;
				case Ext.form.Action.CONNECT_FAILURE:
					Ext.Msg.alert('Error', 'La comunicacion ha fallado',MainWindow.close());
                break;
				case Ext.form.Action.SERVER_INVALID:
					Ext.Msg.alert('Error', action.result.msg,MainWindow.close());
                break;
				default:
					Ext.Msg.alert('Error', action.result.msg,MainWindow.close());                                        
				
                }

        }
    });	
}                            