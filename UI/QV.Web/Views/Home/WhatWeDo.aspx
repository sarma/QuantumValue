<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	What We Do
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

<script src="../../js/jquery.nestedAccordion.js" type="text/javascript"></script>

	<script type="text/javascript">
		jQuery(function ($) {
			// Accordion
			$('#itConsulting > li > a.expanded + ul').slideToggle('medium');
			$('#itConsulting > li > a').click(function () {
				$('#itConsulting > li > a.expanded').not(this).toggleClass('expanded').toggleClass('collapsed').parent().find('> ul').slideToggle('medium');
				$(this).toggleClass('expanded').toggleClass('collapsed').parent().find('> ul').slideToggle('medium');
			});
		   
		});
	</script>
	<h2>
		What We Do</h2>
	<ul id="itConsulting" class="example_menu">
		<li><a class="expanded"><strong>Project Scoping and Planning</strong></a>
			<ul>
				<li style='Padding-left:10px'>
					<p>
						The usual problem is that a business owner doesn't know the detail of what the project
						is going to deliver until it starts the process. In many cases, the incremental
						effort in some projects can lead to significant financial loss. The worst problem
						is that the baseline for evaluating the managers appointed to manage the project
						becomes blurred - making it more difficult to hold him or her accountable.</p>
				</li>
			</ul>
		</li>
		<li><a class="collapsed"><strong>Business Process and System Design</strong> </a>
			<ul>
				<li style='Padding-left:10px'>
					<p>
						The scope of a project is linked intimately to the proposed business processes and
						systems that the project is going to deliver. Regardless of whether the project
						is to launch a new product range or discontinue unprofitable parts of the business,
						the change will have some impact on business processes and systems. The documentation
						of your business processes and system requirements are as fundamental to project
						scoping as an architects plans would be to the costing and scoping of the construction
						of a building.</p>
				</li>
			</ul>
		</li>
		<li><a class="collapsed"><strong>Project Management Support</strong> </a>
			<ul>
				<li>
				<div style='Padding-left:10px'>
					<p>
						The most successful business projects are always those that are driven by an employee
						who has the authority, vision and influence to drive the required changes in a business.
						It is highly unlikely that a business owner (decision maker or similar) will realize
						the changes unless one has one of these people in the employment. However, the project
						leadership role typically requires significant experience and skills which are not
						usually found within a company focused on day-to-day operations. Due to this requirement
						within more significant business change projects / programs, outside expertise is
						often sought from firms which can bring this specific skill set to the company.
					</p>
				  </div>
				</li>
			</ul>
		</li>
		<li class="footer"><span></span></li>
	</ul>
</asp:Content>
