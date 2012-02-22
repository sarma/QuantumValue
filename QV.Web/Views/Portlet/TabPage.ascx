<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<%@ Import Namespace="QV.Data.Objects" %>
<% 
		var rows = ((List<Category>)Application["data"]);
		int total_Category_Protlets = 0;
		
		bool is_Active = bool.Parse(ViewData["is_Active_Portlets"].ToString());
		int total_Portlets = ((List<Portlet_User>)Session["data"]).FindAll(pu=>pu.Is_Active ==is_Active).Count;
		string funct_Name = "";
		string status = "";
		int firstRow = 0;
	   
		if (is_Active)
			status = " Active ";
		else
			status = " Disable ";
	%>
	
	<%-- application pagetabs are generation  --%>
	<div id="tabs"  style="min-height:500px;height:100%;vertical-align:middle">
   <%--<b style="color:Black">Total : </b><i id="currentActivePortlets" style="color:Black"><%= total_Portlets.ToString()%></i>&nbsp;&nbsp;<b style="color:Black"><%= status %> RSS Feeds</b>--%>
	<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
	<% foreach (Category row in rows.Where(r => r.MenudID == int.Parse(ViewData["menuId"].ToString())))
	 {
		total_Category_Protlets = ((List<Portlet_User>)Session["data"]).FindAll(pu=>pu.Is_Active==is_Active && pu.CategoryID== row.CategoryID).Count;  
		 
			%>
		   <li >
			<a id='<%= "tab" + row.CategoryID.ToString()%>'     href='<%= "#tabs-" + row.CategoryID.ToString() %>'><%= row.Name%></a>
			</li> 
			
		<%}
	  
	%>
	</ul> 
   
	
	<%-- application pagetabs contents generation that is portlets/webpart   --%>
	<% foreach (Category catRow in rows.Where(r => r.MenudID == int.Parse(ViewData["menuId"].ToString())))
	{ 
		funct_Name = "catRadButton" + catRow.CategoryID.ToString(); %>
		<script type="text/javascript">
			function <%= funct_Name %>() {
				
				if(j('<%= "#radio1-" + catRow.CategoryID.ToString() %>').is(':checked') )
				{
					j('<%= "#" + "tabs-" + catRow.CategoryID.ToString() %>' ).find(".portlet").find(".portlet-content").toggle(true);
					j('<%= "#" + "tabs-" + catRow.CategoryID.ToString() %>' ).find(".portlet-header .ui-icon-plusthick").toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
								
				}
				else
				if( j('<%= "#radio2-" + catRow.CategoryID.ToString() %>').is(':checked') )
				{
					j('<%= "#" + "tabs-" + catRow.CategoryID.ToString() %>' ).find(".portlet").find(".portlet-content").toggle(false);
					j('<%= "#" + "tabs-" + catRow.CategoryID.ToString() %>' ).find(".portlet-header .ui-icon-minusthick").toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
				}
				else
				if( j('<%= "#radio3-" + catRow.CategoryID.ToString() %>').is(':checked') )
				{
					
				}
			}
		</script>
		<div id='<%= "tabs-" + catRow.CategoryID.ToString() %>' style="width:100px" > 
		<table width="300px" >  
			<tr>
				<td colspan="3" >
					<input type="radio" onclick=<%= funct_Name %>()  id="<%= "radio1-" + catRow.CategoryID.ToString() %>" name='<%= "cat-" + catRow.CategoryID.ToString() %>' /> <label for='<%= "#radio1-" + catRow.CategoryID.ToString() %>' style="color:#2a3446" >Expand</label>
					<input type="radio" onclick=<%= funct_Name %>() id="<%= "radio2-" + catRow.CategoryID.ToString() %>" name='<%= "cat-" + catRow.CategoryID.ToString() %>'  /><label for='<%= "#radio2-" + catRow.CategoryID.ToString() %>' style="color:#2a3446" >Collapse</label>
					<input type="radio" onclick=<%= funct_Name %>() id="<%= "radio3-" + catRow.CategoryID.ToString() %>" name='<%= "cat-" + catRow.CategoryID.ToString() %>'  checked=checked  /><label for='<%= "#radio3-" + catRow.CategoryID.ToString() %>' style="color:#2a3446" >None</label>
				</td>
			</tr>
			
			<tr>
				<%-- intializing tabpage first column --%>
				<td valign=top style="width:100px; vertical-align:100%">
					<%-- intializing value for portlet/webpart that would passed to partial view as parameter for further assesment  --%>
					<% 
						ViewDataDictionary vdd = new ViewDataDictionary();
						vdd["category_ID"] = catRow.CategoryID.ToString(); 
					%>
					<%-- first coulumns pagetabs portlets/webpart generation  --%>
					<div  id='<%= "portletColumn1" + catRow.CategoryID.ToString() %>'  class="column " style="margin: 0 0px 0px 0px; padding: 0px; font-size: 1.2em; width: 310px;">
						<% 
						var piRows = ((List<Portlet_User>)Session["data"]).FindAll(pu=>pu.Is_Active ==is_Active && pu.CategoryID ==  catRow.CategoryID  && pu.Column_No == 1 ).OrderBy(pu=>pu.Row_Sequence);
						foreach (Portlet_User piRow in piRows)
						{
						
							vdd["Portlet_ID"] = piRow.Portlet_ID;
							vdd["Title"] = piRow.Title;
							Html.RenderPartial("Portlet", vdd);
						} 
						%>
					</div>
				  </td>
		   
				<%-- intializing tabpage second column --%>
				<td valign="top" style="width:150px" >
					<%-- second coulumns pagetabs portlets/webpart generation  --%>
					<div id='<%= "portletColumn2" + catRow.CategoryID.ToString() %>'  class="column" style="margin: 0 0px 0px 0px; padding: 5px; font-size: 1.2em; width: 310px;">
						<% 
							piRows = ((List<Portlet_User>)Session["data"]).FindAll(pu => pu.Is_Active == is_Active && pu.CategoryID == catRow.CategoryID && pu.Column_No == 2).OrderBy(pu => pu.Row_Sequence);
							foreach (Portlet_User piRow in piRows)
							{
								
								vdd["Portlet_ID"] = piRow.Portlet_ID;
								vdd["Title"] = piRow.Title;
								Html.RenderPartial("Portlet", vdd);
							} 
						%>
					</div>
				</td>
				
				<%-- intializing tabpage third column --%>
				<td valign="top" style="width:150px" >
					<%-- second coulumns pagetabs portlets/webpart generation  --%>
					<div id='<%= "portletColumn3" + catRow.CategoryID.ToString() %>'   class="column" style="margin: 0 0px 0px 0px; padding: 5px; font-size: 1.2em; width: 310px;">
						<% 
							piRows = ((List<Portlet_User>)Session["data"]).FindAll(pu => pu.Is_Active == is_Active && pu.CategoryID == catRow.CategoryID && pu.Column_No == 3).OrderBy(pu => pu.Row_Sequence);
							foreach (Portlet_User piRow in piRows)
							{

								vdd["Portlet_ID"] = piRow.Portlet_ID;
								vdd["Title"] = piRow.Title;
								Html.RenderPartial("Portlet", vdd);
							} 
						%>
					</div>
				</td>
			</tr>
		 </table>
		</div> 
	<%} %>
</div>
 
