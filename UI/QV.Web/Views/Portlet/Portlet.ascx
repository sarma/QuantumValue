<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
	<% 
	string portlet_ID = Convert.ToInt32(ViewData["portlet_ID"]).ToString().Trim();
	string portletName = "portlet" + portlet_ID;
	string portletFunc = "func" + portletName;
	string portletContent = "portlet" + portlet_ID + "Content";
	
	%>

	<script type="text/javascript">
	 
	 function <%= portletFunc + "_" %>() {
			   
	  <%= portletFunc %>("1");
		}
	 
	 function <%= portletFunc %>(page) {
	   
			if( page == 0 )
			{
				j('#<%= portletContent %>').html('');
			}
			else
			{
				j('#<%= "PortletContentLoading" + portletName %>').html('<image src= "../../ajax-loader.gif" alt="Loading, please wait"/>');
			}
	  
			jQuery.ajax({
				type:"POST",
				url: "<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/Content/<%= portlet_ID %>/" + page +"/<%= portletName %>", 
				success: function(result) {
					  
					if(result.isOk == false)
					{
						j("#<%= portletContent %>").html(result.message);
						j("#<%= "Header" + portletName %>").html("");
					}    
					else
					{
					  
						j("#<%= portletContent %>").html(result);
						j("#<%= "Header" + portletName %>").html("<%= ViewData["Title"] %>");
					    j('#<%= "PortletContentLoading" + portletName %>').html("");
						j(function() {
							j("button, input:button, a", ".demo").button();
						});
					}   
				},
				async:   true
			}); 
		}
		
	  
	</script> 

	<%-- portlets/webpart generation   --%>
	<div class="portlet ui-state-default" id='<%= portletName %>'>
			<div  class="portlet-header ui-widget-header-white" >
				<div  id='<%= "Header" + portletName %>'" >Loading..... </div>
			</div> 
			<table width="100%">
				<tr>
					<%-- portlets/webpart content holder--%>
					<td style="padding: 0em 0em;">
						<div id='<%= portletContent %>' style="height: auto" class="portlet-content" >
							<img src= "../../ajax-loader.gif" alt="Loading, please wait" onload=<%= portletFunc + "_"  %>() />
						</div>
					</td>
				 </tr>
			</table>
	</div>
	


   
  