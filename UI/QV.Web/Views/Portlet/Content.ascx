<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<% 
        string funcItem = "func" + ViewData["portletName"].ToString();
       
%>

<table width="100%" style="padding: 0em 0em;">
    <tr>
        <td>
           <%=  ViewData["content"].ToString()%>
         </td>   
     </tr>
     <tr style="padding: 0em 0em;">  
         <td style="text-align:right; vertical-align:top;padding: 0em 0em;">                   
           <span style="text-align:left;padding: 0em 0em;" id='<%= "PortletContentLoading" + ViewData["portletName"].ToString() %>'  style="vertical-align:100%">
                        <img src= "../../ajax-loader.gif" alt="Loading, please wait" /> 
                    </span>
                  
            </td>
       </tr>
       <tr>
           <td>
               
               <%= String.Format("<a href=\"{0}\">Read More--></a>",ViewData["link"].ToString()) %>
           </td>
       </tr>
</table>       


