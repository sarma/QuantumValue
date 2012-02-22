<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<table width="100%">
    <tr>
        <td>
            <%-- RSS publisher's header--%>
            <%if (  ViewData["imagePath"].ToString().Trim().Length != 0)
            {%>
                <img width="100%"  alt=<%= ViewData["imagePath"].ToString() %> src=<%= ViewData["imagePath"].ToString() %> />
            <%}%>
            <%-- RSS feed content holder --%>
            <p><%=  ViewData["detail"].ToString()%></p>
         </td>
       </tr>
</table>       
         