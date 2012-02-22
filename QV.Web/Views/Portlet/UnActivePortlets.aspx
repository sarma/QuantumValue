<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Disabled Portlet
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <script type="text/javascript">
        var j = jQuery.noConflict();
        
        var current_Column_ID = "";
        var portlet_Header_Icon;
        var portlet_Item_Name = "";
        j(function() {
            var $tabs = j("#tabs").tabs();
            var $tab_items = j("ul:first li",$tabs).droppable({
                accept: '.column div' ,
                tolerance: 'pointer',
                opacity: 1,
                containment: '.container',
                cursor: 'move',
                cursorAt: { cursor: 'move', top: -155, left: -55, bottom: 0 }, 
                hoverClass: 'drophover', 
                revert: 'valid',
                greedy: true,
                over: function(event, ui) 
                { 
    			    
                },

                drop: function(ev, ui) { 
    			    
                    ui.draggable.attr("style","opacity: 1;");
                    ui.draggable.addClass("portlet ui-state-default");
    			    
    			    
                    var $item = j(this);
			        
                    var $list = j($item.find('a').attr('href')).find('.column')[0];
                    
                    PortletsPlacementManager(j($item.find('a').attr('href')).find('.column').attr("id"),current_Column_ID,portlet_Item_Name,0,1);
                    
                    ui.draggable.hide('slow', function() {
                        $tabs.tabs('select', $tab_items.index($item));
                        j(this).appendTo($list).show('slow');
                        j('#' +portlet_Item_Name).find(".portlet-content").toggle(true);
                    });
                }
            });
        });
        
        function PortletsPlacementManager(column_ID,sender_Column_ID,portlet_ID,row_No,is_Drop) {
         
            jQuery.ajax({
                type:"POST",
                url:"<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/PortletsPlacementManager/" + column_ID + "/" + portlet_ID +"/" + row_No + "/" + is_Drop  , 
                success: function(result) {
                       
                    if(result.isOk != false)
                    {
                        if( is_Drop = 1 )
                        {
                            TotalCatetogoryPortlets(column_ID);
                            TotalCatetogoryPortlets(sender_Column_ID);
                        }
                    }   
                },
                async: true
            }); 
        }
        
        function PortletsStatusManager(column_ID,portlet_ID,is_Active) {
            jQuery.ajax({
                type:"POST",
                url:"<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/PortletsStatusManager/" + portlet_ID +"/" + is_Active , 
                success: function(result) {
                    if(result.isOk != false)
                    {
                        TotalCatetogoryPortlets(column_ID);
                        TotalPortlets();
                    }   
                },
                async: true
            }); 
        }
        
        
        function TotalPortlets() {
            jQuery.ajax({
                type:"POST",
                url:"<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/TotalPortlets/false", 
                success: function(result) {
                    if(result.isOk != false)
                    {
                        j("#currentActivePortlets").html( result );
                    }   
                },
                async: true
            }); 
        }
        
        
        
        function TotalCatetogoryPortlets(column_ID) {
        
            jQuery.ajax({
                type:"POST",
                url: "<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/TotalCatetogoryPortlets/" + column_ID + "/false", 
                success: function(result) {
                    if(result.isOk != false)
                    {
                        var name = "#tab" + column_ID.substring(14);
                        j(name).html( result );
                    }   
                },
                async:   true
            }); 
        }
         
    
        function OpenDialog(portlet_ID,item_No,title) {
           
            j("#dialog").attr("title",title);
            j("#dialog").dialog('option', 'position', 'center');
            j("#dialog").dialog({
                height: 500,
                width: 450,
                modal: true
            });
    		
            var url = "<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/GetItemDetail/" + portlet_ID +"/" + item_No
            j("#dialog").html('<image src= "../../ajax-loader.gif" alt="Loading, please wait"/>');
        
            jQuery.ajax({
                type:"GET",
                url:"<%=QV.Web.Helpers.Utility.Get_Path() %>/Portlet/GetItemDetail/" + portlet_ID +"/" + item_No, 
                success: function(result) {
                    if(result.isOk == false)
                    {
                        j("#dialog").html(result.message);
                    }    
                    else
                    {
                        j("#dialog").html(result);
                    }   
                },
                async:   true
            }); 
        }
   	
        j(function() {
            j(".column").sortable({
                connectWith: '.column'
			    
            });
		    
		   
    		
            j(".portlet").addClass("")
                .find(".portlet-header")
                .addClass("ui-widget-header")
                .prepend('<span class="ui-icon ui-icon-minusthick"></span>')
                .end()
                .find(".portlet-content");
			    
            j(".portlet").addClass("")
                .find(".portlet-header")
                .addClass("ui-widget-header")
                .prepend('<span class="ui-icon ui-icon-extlink"></span>')
                .end()
                .find(".portlet-content")
			    
			    
            j(".portlet-header .ui-icon-extlink").click(function() {
			    
                var column_ID = j(this).parents(".portlet:first").parents(".column:first").attr("id");
                var portlet_ID = j(this).parents(".portlet:first").attr("id"); 
			    
                PortletsStatusManager(column_ID,portlet_ID,true)
			    
                j(this).parents(".portlet:first").fadeOut('slow', function() {
                    j(this).remove();
                
                });
            });
     
            j(".portlet-header .ui-icon-minusthick").click(function() {
                j(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
                if(  j(this).parents(".portlet:first").find(".portlet-content").is(":visible")  )
                {
			    
                }
                //
                var options = {};
			    
                j(this).parents(".portlet:first").find(".portlet-content").toggle();
            });
		    
            j(".portlet-header .ui-icon-plusthick").click(function() {
                j(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
                if(  j(this).parents(".portlet:first").find(".portlet-content").is(":visible")  )
                {
			    
                }
                //
                var options = {};
			    
                j(this).parents(".portlet:first").find(".portlet-content").toggle();
            });
    		
    		
     
            j(".column").disableSelection();
    		
            j('.column').sortable({
                cursor:'move',
                forcePlaceholderSize: true,
                placeholder: 'ui-state-highlight',
                opacity: 0.6,
                start: function(event, ui) {
                    current_Column_ID = j(event.target).attr("id");
                    portlet_Item_Name = j(event.target).find(".portlet").attr("id");
                    //$(event.target).find(".portlet").attr("style","cursor:move");
                }, 
    		     
                receive: function(event, ui) { 
                    PortletsPlacementManager(event.target.id,j(ui.sender).attr("id"),j(event.target).find(".portlet").attr("id") ,ui.item.index(),0);
                }      
                  
            });
        });
    </script> 
    <% ViewDataDictionary vdd = new ViewDataDictionary();
       vdd["is_Active_Portlets"] = false;
       Html.RenderPartial("TabPage", vdd);
    %>
    <div class="demo-description"> 
</div>
<div style="color:White" id="dialog" title="-----">
</div>

</asp:Content>
