<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<QV.Data.Objects.WPage>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	<%=Model.Title%>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

	<h2><%=Model.Header%></h2>
	<p><%=Model.Introduction%></p>
	<div style='padding-left:30px' >
	<% foreach (var c in Model.Sections)
	   {
		   Html.RenderPartial("Section",c);
  
	   } %>
	   </div>
	
</asp:Content>
