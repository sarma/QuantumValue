<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    WhyUs
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <script type="text/javascript">
        jQuery(function ($) {
            // Grow/Shrink
            $('#sliderQuestions > li > a.expanded + ul').show('normal');
            $('#sliderQuestions > li > a').click(function () {
                $(this).toggleClass('expanded').toggleClass('collapsed').parent().find('> ul').toggle('normal');
            });
            $('#divQuestions .expand_all').click(function () {
                $('#sliderQuestions > li > a.collapsed').addClass('expanded').removeClass('collapsed').parent().find('> ul').show('normal');
            });
            $('#divQuestions .collapse_all').click(function () {
                $('#sliderQuestions > li > a.expanded').addClass('collapsed').removeClass('expanded').parent().find('> ul').hide('normal');
            });

          
        });
    </script>
    <h2>
        Why Us</h2>
    <p style="text-indent: 10px">
        Every organization asks few questions to evaluate a consulting firm to be thier
        prefered IT Partner. The core team at Quantum Value is formed to individually and
        collectively answer these questions. So let us answer them.</p>
    <div id="divQuestions" style="text-indent: 20px">
        <h4>
            <a class="expand_all">
                <img src="../../images/Section_Plus.png" alt="" />Show All</a> <a class="collapse_all">
                    <img src="../../images/Section_Minus.png" alt="" />
                    Hide All</a></h4>
        <ul id="sliderQuestions" class="accordion">
            <li><a class="expanded">How we manage projects?</a>
                <ul>
                    <p>
                        Even though Agile Development methodology is our favourite, we are capable of managing
                        every other model of Software development life cycles. We have incorporated finer
                        techniques of agile development like Requirement Catalogues, Requirement Prioritisation,Lean
                        Teams, TDD and BDD into Waterfall and Iterartive models. This hybrid model has given
                        us flexibility with micromanagement of Enterpise platforms.</p>
                    <li>
                        <div style='padding-left: 10px'>
                            <ul id='ManageList'>
                                <li><a class="expanded">Waterfall</a>
                                    <ul>
                                        <li>
                                            <img src="../../images/waterfall.png" alt="Not Available" />
                                            <p>
                                                The waterfall model is a sequential design process, often used in software development
                                                processes, in which progress is seen as flowing steadily downwards (like a waterfall)
                                                through the phases of Conception, Initiation, Analysis, Design, Construction, Testing,
                                                Production/Implementation and Maintenance.
                                            </p>
                                        </li>
                                    </ul>
                                </li>
                                <li><a class="collapsed">Incrimental Application Development </a>
                                    <ul>
                                        <li>
                                            <img src="../../images/Iterative_development_model_V2.jpg" alt="Not Available" />
                                            <p>
                                                In the past, several development methods devised and tested in practice. Methods
                                                should ensure that the development of a system is successful. IAD describes a method
                                                in which a project in relatively small increments will be divided. These parts are
                                                developed separately, the time taken for development depends on the size of the
                                                part, after development, it is possible that the portion immediately usable. Each
                                                part is called a pilot. By applying this method, it is possible to include a major
                                                project by a large group of people to perform. Teams can develop in parallel a pilot.
                                                During the phase “introduction” to the pilots combined into a useful product. The
                                                development cycle (one iteration) consists of three phases in a repetitive way out:
                                                Study definition, development and pilot implementation. Each cycle produces a pilot
                                                project. That a pilot is a small part, but it means a number of the total (and possibly
                                                still unknown) system covers. Only in the last pilot to all system requirements
                                                are met. After each cycle a useful profit. There is frequent communication with
                                                users and the client, whether it be content, if new requirements are for problems
                                                seen. This provides a major advantage: at any time adjustments may be made to the
                                                needs of the client. Thus seeks to achieve optimal results for the client to connect.
                                                There are four different types of development. Which version is suitable for use
                                                depends on the organization and the final product. This depends on the complexity
                                                of the system, the stability of the system and the presence or absence of the need
                                                for quick delivery. The different variants: evolutionary development, incremental
                                                yield, incremental development and Big-Bang enter.
                                            </p>
                                        </li>
                                    </ul>
                                </li>
                                <li><a class="collapsed">Agile Scrum & XP</a>
                                    <ul>
                                        <li>

                                        </li>
                                    </ul>
                                </li>
                                <li class="footer"><span></span></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </li>
            <li><a class="collapsed">What is our technical expertise?</a>
                <ul>
                    <li>
                        <p>
                            Yes</p>
                    </li>
                </ul>
            </li>
            <li><a class="collapsed">What about QUALITY?</a>
                <ul>
                    <li>
                        <p>
                            Yes</p>
                    </li>
                </ul>
            </li>
            <li><a class="collapsed">How easy is it to scale up/out project teams swiftly?</a>
                <ul>
                    <li>
                        <p>
                            Yes</p>
                    </li>
                </ul>
            </li>
            <li><a class="collapsed">Financials?</a>
                <ul>
                    <li>
                        <p>
                            Yes</p>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</asp:Content>
