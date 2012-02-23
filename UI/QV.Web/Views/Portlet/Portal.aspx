<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master"  Inherits="System.Web.Mvc.ViewPage"%>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Quantum Value
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
	<link type="text/css" href="../../themes/base/jquery.ui.all.css" rel="stylesheet" /> 
	
	<style type="text/css"> 
	.column { width: 270px; float:right; padding-bottom: 0px; }
	.portlet { margin: 0 0em 0.3em 0; }
	.portlet-header { margin: 0.3em; padding-bottom: 1px; Font-size : 14px; border-bottom:#969;}
	.portlet-header .ui-icon { float: right; }
	.ui-sortable-placeholder { border: 0px dotted black; visibility: visible !important; height: 200px !important; }
	.ui-sortable-placeholder * { visibility: hidden;}
	.Tabpage{}
	</style> 
	<script type="text/javascript" src="../../ui/jquery-ui.js"></script>
	<script type="text/javascript" src="../../ui/jquery.ui.draggable.js"></script>
	<script type="text/javascript" src="../../ui/jquery.ui.draggable.js"></script>
	<script type="text/javascript">
		var j = jQuery.noConflict();
		var current_Column_ID = "";
		var portlet_Header_Icon;
		var portlet_Item_Name = "";
		j(function () {
			var $tabs = j("#tabs").tabs();
			var $tab_items = j("ul:first li", $tabs).droppable({
				accept: '.column div',
				tolerance: 'pointer',
				opacity: 1,
				containment: '.container',
				cursor: 'move',
				cursorAt: { cursor: 'move', top: -155, left: -55, bottom: 0 },
				hoverClass: 'drophover',
				revert: 'valid',
				greedy: true,
				over: function (event, ui) {

				},

				drop: function (ev, ui) {

					ui.draggable.attr("style", "opacity: 1;");
					ui.draggable.addClass("portlet ui-state-default");


					var $item = j(this);

					var $list = j($item.find('a').attr('href')).find('.column')[0];

					PortletsPlacementManager(j($item.find('a').attr('href')).find('.column').attr("id"), current_Column_ID, portlet_Item_Name, 0, 1);

					ui.draggable.hide('slow', function () {
						$tabs.tabs('select', $tab_items.index($item));
						j(this).appendTo($list).show('slow');
						j('#' + portlet_Item_Name).find(".portlet-content").toggle(true);
					});
				}
			});
		});

		function PortletsPlacementManager(column_ID, sender_Column_ID, portlet_ID, row_No, is_Drop) {

			jQuery.ajax({
				type: "POST",
				url: "Portlet/PortletsPlacementManager/" + column_ID + "/" + portlet_ID + "/" + row_No + "/" + is_Drop,
				success: function (result) {

					if (result.isOk != false) {
						if (is_Drop == 1) {
							TotalCatetogoryPortlets(column_ID);
							TotalCatetogoryPortlets(sender_Column_ID);
						}
					}
				},
				async: true
			});
		}

		function PortletsStatusManager(column_ID, portlet_ID, is_Active) {

			jQuery.ajax({
				type: "POST",
				url: "<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/PortletsStatusManager/" + portlet_ID + "/" + is_Active,
				success: function (result) {
					if (result.isOk != false) {

						TotalCatetogoryPortlets(column_ID);
						TotalPortlets();
					}
				},
				async: true
			});
		}


		function TotalPortlets() {
			jQuery.ajax({
				type: "POST",
				url: "<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/TotalPortlets/true",
				success: function (result) {

					if (result.isOk != false) {
						j("#currentActivePortlets").html(result);
					}
				},
				async: true
			});
		}



		function TotalCatetogoryPortlets(column_ID) {

			jQuery.ajax({
				type: "POST",
				url: "<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/TotalCatetogoryPortlets/" + column_ID + "/true",
				success: function (result) {
					if (result.isOk != false) {
						var name = "#tab" + column_ID.substring(14);
						j(name).html(result);
					}
				},
				async: true
			});
		}


		function OpenDialog(portlet_ID, item_No, title) {

			j("#dialog").attr("title", title);
			j("#dialog").dialog('option', 'position', 'center');
			j("#dialog").dialog({
				height: 500,
				width: 450,
				modal: true
			});

			var url = "Portlet/GetItemDetail/" + portlet_ID + "/" + item_No;
			j("#dialog").html('<image src= "../../ajax-loader.gif" alt="Loading, please wait"/>');

			jQuery.ajax({
				type: "GET",
				url: "Portlet/GetItemDetail/" + portlet_ID + "/" + item_No,
				success: function (result) {
					if (result.isOk == false) {
						j("#dialog").html(result.message);
					}
					else {
						j("#dialog").html(result);
					}
				},
				async: true
			});
		}

		j(function () {
			j(".column").sortable({
				connectWith: '.column'

			});



			j(".portlet").addClass("")
				.find(".portlet-header")
				.addClass("ui-widget-header-white")
				.prepend('<span class="ui-icon ui-icon-circle-minus"></span>')
				.end()
				.find(".portlet-content");

			j(".portlet").addClass("")
				.find(".portlet-header")
				.addClass("ui-widget-header-white")
				.prepend('<span class="ui-icon ui-icon-circle-close"></span>')
				.end()
				.find(".portlet-content")


			j(".portlet-header .ui-icon-circle-close").click(function () {

				//alert( j(this).parents(".portlet:first").parents(".column").length );
				var column_ID = j(this).parents(".portlet:first").parents(".column:first").attr("id");
				var portlet_ID = j(this).parents(".portlet:first").attr("id");

				PortletsStatusManager(column_ID, portlet_ID, false)

				j(this).parents(".portlet:first").fadeOut('slow', function () {
					j(this).remove();

				});
			});

j(".portlet-header .ui-icon-circle-minus").click(function () {
				j(this).toggleClass("ui-icon-circle-minus").toggleClass("ui-icon-circle-plus");
				var category_ID = j(this).parents(".portlet:first").parents(".column").attr("id").substring(14);
				j("#radio3-" + category_ID).attr("checked", "checked");
				j(this).parents(".portlet:first").find(".portlet-content").toggle();
			});

j(".portlet-header .ui-icon-circle-plus").click(function () {
	j(this).toggleClass("ui-icon-circle-minus").toggleClass("ui-icon-circle-plus");
				var category_ID = j(this).parents(".portlet:first").parents(".column").attr("id").substring(14);
				j("#radio3-" + category_ID).attr("checked", "checked");
				j(this).parents(".portlet:first").find(".portlet-content").toggle();
			});



			j(".column").disableSelection();

			j('.column').sortable({
				cursor: 'move',
				forcePlaceholderSize: true,
				opacity: 0.6,
				start: function (event, ui) {
					current_Column_ID = j(event.target).attr("id");
					portlet_Item_Name = j(event.target).find(".portlet").attr("id");
					//j(event.target).find(".portlet").attr("style","cursor:move");
				},

				receive: function (event, ui) {
					PortletsPlacementManager(event.target.id, j(ui.sender).attr("id"), j(event.target).find(".portlet").attr("id"), ui.item.index(), 0);
				}

			});
		});
		
	</script> 
	<% ViewDataDictionary vdd = new ViewDataDictionary();
	   vdd["is_Active_Portlets"] = true;
	   vdd["menuId"] = ViewData["menuId"];
	   Html.RenderPartial("TabPage", vdd);
	%>
<div class="demo-description"> 
</div>
<div style="color:White" id="dialog" title="-----">
</div>
</asp:Content>
