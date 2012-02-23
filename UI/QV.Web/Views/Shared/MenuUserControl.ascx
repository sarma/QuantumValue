<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<dynamic>" %>
<ul id="menu-main-menu" class="menu">
                                <li id="menu-item-5867" class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-3103 current_page_item current-menu-ancestor current-menu-parent current_page_parent current_page_ancestor">
                                     <%: Html.ActionLink("Home", "Portal", "Portlet", new RouteValueDictionary{{"menuId", "1"}},new Dictionary<string, object>()) %>
                                </li>
                                <li id="menu-item-5864" class="menu-item menu-item-type-custom menu-item-object-custom">
                                    <%: Html.ActionLink("Services", "Portal", "Portlet", new RouteValueDictionary { { "menuId", "3" } }, new Dictionary<string, object>())%>
                                </li>
                                <li id="menu-item-5866" class="menu-item menu-item-type-custom menu-item-object-custom">
                                    <%: Html.ActionLink("Poeple", "Index", "People")%>
                                </li>
                                <li id="menu-item-5863" class="menu-item menu-item-type-custom menu-item-object-custom">
                                    <%: Html.ActionLink("Blogs","Index","Blogs") %>
                                </li>
                               </ul>
