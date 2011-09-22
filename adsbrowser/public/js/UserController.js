Ext.ns("UserController");

UserController = {
    /*
    def newuser(self, username, password,
            force_password_change_at_next_login_req=False,
            useusernameascn=False, userou=None, surname=None, givenname=None,
            initials=None, profilepath=None, scriptpath=None, homedrive=None,
            homedirectory=None, jobtitle=None, department=None, company=None,
            description=None, mailaddress=None, internetaddress=None,
            telephonenumber=None, physicaldeliveryoffice=None, sd=None,
            setpassword=True):    
        """Adds a new user with additional parameters

        :param username: Name of the new user
        :param password: Password for the new user
        :param force_password_change_at_next_login_req: Force password change
        :param useusernameascn: Use username as cn rather that firstname +
            initials + lastname
        :param userou: Object container (without domainDN postfix) for new user
        :param surname: Surname of the new user
        :param givenname: First name of the new user
        :param initials: Initials of the new user
        :param profilepath: Profile path of the new user
        :param scriptpath: Logon script path of the new user
        :param homedrive: Home drive of the new user
        :param homedirectory: Home directory of the new user
        :param jobtitle: Job title of the new user
        :param department: Department of the new user
        :param company: Company of the new user
        :param description: of the new user
        :param mailaddress: Email address of the new user
        :param internetaddress: Home page of the new user
        :param telephonenumber: Phone number of the new user
        :param physicaldeliveryoffice: Office location of the new user
        :param sd: security descriptor of the object
        :param setpassword: optionally disable password reset
        """    
    */
   
    
            EnableAccount: function(dn,username,enable) {
				enable= enable || false;
				if(enable) enable = 'yes';
				ParamsObj = {
						dn:dn
						,username:username
						,enable:enable
				}
				UserController.SendData('User/EnableAccount',ParamsObj);
            }

            ,ForcePasswordChangeAtNextLogin:function(dn,account){
				ParamsObj = {
						dn:dn
						,username:username
				}
				UserController.SendData('User/ForcePasswordChangeAtNextLogin',ParamsObj);            
            }
            
            ,SetPassword:function(dn,account) {
                //force_change_at_next_login= force_change_at_next_login || false;
				DialogResetPass.show(dn,account);
            }
            
            ,SetExpiry:function(dn,account,expiry,days) {
              expiry = expiry || false;
            }
            
            
            ,SendData:function(url,params){
            
					Ext.Ajax.request({
										url: url,
										method : 'POST', 
										success: function(response, opts) {

												var Return = Ext.decode(response.responseText);
												
												AdsBrowser.GridMask.hide();
												
												if(!Return.success){
													Ext.Msg.alert('<b>Error</b>',Return.msg);
													return false;
												} 
												
												var CurrentBaseDn = AdsBrowser.GridStore.reader.jsonData.BaseDn;
												AdsBrowser.GridStore.load({
													params: {
														"node": CurrentBaseDn

													}
												});
												
																						

										},

										failure: function(response, opts) {
												ErrorMsg = 'status code ' + response.status;
												Ext.Msg.alert('<b>Error</b>',ErrorMsg);
										},
										params: params
					});            
            
            }
            
            
            ,Implement:function(){
            
            }            
            

}

/*


    

    def newgroup(self, groupname, groupou=None, grouptype=None,
                 description=None, mailaddress=None, notes=None, sd=None):
        """Adds a new group with additional parameters

        :param groupname: Name of the new group
        :param grouptype: Type of the new group
        :param description: Description of the new group
        :param mailaddress: Email address of the new group
        :param notes: Notes of the new group
        :param sd: security descriptor of the object
        
        def deletegroup(self, groupname):
        
    def add_remove_group_members(self, groupname, listofmembers,
                                  add_members_operation=True):
        """Adds or removes group members

        :param groupname: Name of the target group
        :param listofmembers: Comma-separated list of group members
        :param add_members_operation: Defines if its an add or remove
            operation
        """        
*/