
Ext.onReady( function()
{
    var xmlrpc = new Atomic.util.XMLRPC( { 
        url: "xmlrpc.php",
        method: "blogger.getUsersBlogs"
    } );
    // Add parameters to the RPC call
    xmlrpc.addParameter( "0123456789ABCDEF" );
    xmlrpc.addParameter( "MyUsername" );
    xmlrpc.addParameter( "mypassword" );
    // Subscribe to events
    xmlrpc.addListener( "success", function( xhr, xml ) {
        // Handle the response from the XML-RPC service, which is in the 'xml' object
        console.log( xml );
    } );
    xmlrpc.addListener( "fault", function( xhr, fault ) {
        // Handle any faults issued by the XML-RPC server
        Ext.MessageBox.alert( "XML-RPC fault #" + fault.code, fault.message );
    } );
    // make the call
    xmlrpc.call( { 
        method: "blogger.getUsersBlogs",
        params: [
             "0123456789ABCDEF",
             "MyUsername",
             "mypassword"
        ]
    } );
}
 



