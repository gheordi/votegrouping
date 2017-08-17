var arrowPressed=0;
var oldCat=null;
var current;
var currrentCat;
var isArgument;
var genid=1;
var color;
var isAlternative=false;
var DOMAIN;
var SERVER;

var USERKEY=null;
var USER_RIGHTS = "*";
var expandedSet = new Set();
var propositionId;
var EMAIL_COOKIE="EMAIL_COOKIE";
var PASSWORD_COOKIE="PASSWORD_COOKIE";
var SKIPINTRO_COOKIE="SKIPINTRO_COOKIE";
var APPID="";
var ROOT_CATEGORY_ID="";
var AB_PATH="";
var networkTry=0;
var cats;
var j;
var propId;
var mcounter;
var LANGUAGE="";
var menu=['profile','mvotes'];
var dictionary={};
var dialogWidth=parseInt($(window).width()*0.9)+30;
var uppath=$("#uppath").val();
var currentProposition;
var uniqCounter=0;
var SAVE_LABEL="SAVE";
var allPropositionsLoaded={};
var currrentCategoryId=0;
var currentPropositionId=0;
var setups; //it keeps a json containing the setups for each abpath, like title, logo, description, the landing image, prezi link
var dummyUser=null;
var useDummyUser=false;

//a user can discover all application without any registration, using a dummy user. After he does a number of actions (MAX_DUMMY_ACTIONS)
//he receives the suggestion to login/register in order not to lose all his work
var pdiscoverIdEl;
var pforgetIdEl;

var counterDummyActions=0;
var MAX_DUMMY_ACTIONS=3;

var proargumentdialogEl;
var categorydialogEl;
var propositionimgEl;
var photoUrlEl;
var solutiondialogEl;
var propositiondialogEl;
var propositiondialogEl;
var addFirstCategoryEl;
var solutionTitleEl;
var solutionDescriptionEl;
var solutionImgEl;
var userdialogEl;
var productofferdialogEl;
var leftheaderEl;
var rightheaderEl;
var rightcontrargumentEl;
var leftcontrargumentEl;
var leftargumentEl;
var proargtextEl;
var leftargumentEl;
var rootidEl;
var categorynameEl;
var selectEl;
var loadingEl;

var ErrorMessageEl;
var rootEl;
var loginEl;
var logoutEl;
var storecookiesEl;
var skipintroEl;
var setupIconEl;
var logindialogEl;
var groupsizeEl;
var usernameEl;
var registeremailloginEl;
var registerpasswordEl;
var nameEl;
var photoRegUrlEl;
var dummyUserEl;
var registerErrorMessageEl;
var registerSuccesMessageEl;
var registerdialogEl;
var recoverPasswordErrorMessageEl;
var recoverPasswordSuccessEl;
var descriptiontextEl;
var propTitleEl;
var photoUrlEl;
var propIdEl;
var bannerEl;
var headerEl;
var navPanEl;
var menuEl;
var fbframeEl;
var navEl;
var spanishEl;
var mylikefbEl;
var iframe_containerEl;
var banner2El;
var bannertextEl;
var messageboxEl;
createAppIconEl;




function init(){
    initElements();
    DOMAIN = 'http://'+$('#serverdomain').val()+'/';
    SERVER=DOMAIN+'vote/';
    addFirstCategoryEl.hide();
    APPID = $('#appid').val();


    LANGUAGE = $("#languagecode").val();
    ROOT_CATEGORY_ID=$('#rootid').val();
    AB_PATH = $('#abpath').val();
    initDictionary();
    SAVE_LABEL=dictionary[LANGUAGE]['Save'];
    if(USERKEY!=null){
        logoutEl.show();
        //if user is admin show setup icon
        if(USER_RIGHTS.indexOf('A')!=-1){
            setupIconEl.show();
        }
    }else{
        loginEl.show();
        setupIconEl.hide();
        createAppIconEl.show();
    }

    pdiscoverIdEl=$('#pdiscoverId');
    pforgetIdEl=$('#pforgetId');
    resultsnoUserEl=$('#resultsnoUser');

    if(AB_PATH.indexOf("hamburger")==-1){
        $('#homeimg').hide();
    }
    $("#homeimg").click(function (){
        expand(rootEl);

    });

        if(AB_PATH.indexOf("tdr")!=-1){
            $('#nextProp').click(function(){
                expandProposition("solutiondialog","nextprop");
            });
            $(document).swipe( {
						//Generic swipe handler for all directions
						swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
							if(direction=='left'){
							   expandProposition("solutiondialog","nextprop");
							}else if(direction=='down'){
							    expandProposition("solutiondialog","nextprop");
							}
						},
						//Default is 75px, set to 0 for demo so any distance triggers swipe
					   threshold:0
					});
        }

    //it is used to detect bots (honey bot)
    usernameEl.hide();

    $("#login").click(function (){
        $('#logindialog').dialog('open');
    });

    $("#loginfromResults").click(function (){
        $('#logindialog').dialog('open');
    });

    $("#registerfromResults").click(function (){
        $('#registerdialog').dialog('open');
    });


    $("#logout").click(function (){
        USERKEY=null;
        $("#login").toggle();
        $("#logout").toggle();
        $("#groupsize").toggle();

        setupIconEl.hide();

        createAppIconEl.show();

    });

    $("#searchimage").click(function (){

        window.open("imagesearch", '_blank', 'toolbar=0,location=0,menubar=0');

    });

//to prevent multiple binding
    $(document).unbind("keyup").keyup(function(e){
        var code = e.which; // recommended to use e.which, it's normalized across browsers
        if(code==13)
        {
            if ($('#logindialog').dialog('isOpen') === true) {
                login($('#logindialog'));
            }

        }
    });

 /*   if($.cookie(SKIPINTRO_COOKIE)=='true'){
        banner2El.height(25);
        $('#slogan').hide();
        $('#yourgroups').before('<li style="white-space: nowrap;"><a href="#seePresentation" class="seePresentation" id="seePresentation" class="scrolly">See Presentation</a></li>');
       $('a[href="#seePresentation"').click(function (){
       showPresentation();

    });
    }
    else{
        showPresentation();
    }

*/


$('#logo').click(function (){
           //$('html, body').animate({scrollTop: rootEl.offset().top});
        $(document).scrollTop(0);
    });

    $('#loginregister').click(function(){
       logindialogEl.dialog("open");
    });

    $("#dummyuseddialog").dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",width:"500px",
                                buttons:{
                                    'Login':function(){
                                        $(this).dialog('close');
                                        logindialogEl.dialog("open");
                                        return false;
                                    },
                                    'Register':function(){
                                        $(this).dialog('close');
                                        registerdialogEl.dialog("open");
                                        return false;
                                    },
                                    'Dummy User':function(){
                                        $(this).dialog('close');
                                        if(dummyUser==null){
                                            dummyUser='TMP'+Math.random().toString(15).slice(2);
                                            registeremailloginEl.val(dummyUser);
                                            useDummyUser=true;

                                            register();
                                        }
                                        return false;
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        return false;
                                    }




                                }

    });


    //not working on ipad resize();
    $("#resultsDialog").dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",width:"500px",
                                buttons:{
                                    'Ok':function(){
                                        $(this).dialog('close');
                                    }}});

    $("#ajaxProgress").dialog({autoOpen:false,modal:true,show:"blind",hide:"blind" });

    $("#messageDialog").dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",
                                buttons:{
                                    'Ok':function(){
                                        $(this).toggle();
                                        loadNewApp();
                                        $(this).toggle();
                                    }}});

    $(document).bind("ajaxStart.mine", function() {
        $('#ajaxProgress').dialog("open");
    });

    $(document).bind("ajaxStop.mine", function() {
        $('#ajaxProgress').dialog("close");
    });


    proargumentdialogEl.dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Save':function(){
                                        $(this).toggle();
                                        saveArgument($(this));
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        }


                                   }
    });

    $("#setupdialog").dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Save':function(){
                                        $(this).toggle();
                                        setupApplication();
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        }


                                   }
    });


    if(AB_PATH.indexOf('tdr')==-1){
    $("#savePropositionButton").hide();
    $("#publishPropositionButton").hide();
    $("#addPropositionButton").hide();
    $("#votePropositionButton").hide();

    solutiondialogEl.dialog({width:dialogWidth,autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Vote':function(){
                                        $(this).toggle();
                                        vote();
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        }


                                   }
    });

    propositiondialogEl.dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Save':function(){
                                        $(this).toggle();
                                        if(isAlternative)
                                            addAlternative($(this));
                                        else
                                            saveProposition($(this),0);//0-status of draft proposition
                                        $(this).toggle();
                                        propositionimgEl.attr("src","");
                                        descriptiontextEl.val("");
                                        propTitleEl.val("");
                                        propIdEl.val("");

                                        },
                                    'Publish':function(){
                                        $(this).toggle();
                                        if(isAlternative)
                                            addAlternative($(this));
                                        else
                                            saveProposition($(this),1);//1-status of published proposition
                                        $(this).toggle();
                                        propositionimgEl.attr("src","");
                                        descriptiontextEl.val("");
                                        propTitleEl.val("");
                                        propIdEl.val("");

                                        photoUrlEl.val("");

                                        },
                                    'Cancel':function(){
                                        propositionimgEl.attr("src","");
                                        descriptiontextEl.val("");
                                        propTitleEl.val("");
                                        photoUrlEl.val("");
                                        $(this).dialog('close');

                                    }


                                   }
    });


    }else{
        $("#savePropositionButton").click(function (){
                saveProposition(null,0);//1-status of published proposition
        });
    $("#publishPropositionButton").click(function (){
            saveProposition($(this),1);//1-status of published proposition
        });
    $("#addPropositionButton").click(function (){
                                        propositionimgEl.attr("src","");
                                        descriptiontextEl.val("");
                                        propTitleEl.val("");
                                        propIdEl.val("");

                                        photoUrlEl.val("");
            solutiondialogEl.hide();
            propositiondialogEl.show();
        });
    $("#votePropositionButton").click(function(){
        vote();
    });

    }

    productofferdialogEl.dialog({dialogWidth,autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Vote':function(){
                                        $(this).toggle();
                                        vote();
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        }


                                   }
    });

    userdialogEl.dialog({dialogWidth,autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Vote':function(){
                                        $(this).toggle();
                                        vote();
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        }


                                   }
    });


    categorydialogEl.dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Add':function(){
                                        $(this).toggle();
                                        saveCategory($(this));
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        }


                                   }
    });

    logindialogEl.dialog({ autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Login':function(){
                                        $(this).toggle();
                                        login($(this));
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                            logUserAction('cancelLogin');
                                            $(this).dialog('close');
                                        }

                                   }
    });


    $("#contactDialog").dialog({width:dialogWidth,autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Send':function(){

                                        call=SERVER;
                                        call+='sendEmail?from=';
                                        call+=$("#fromemail").val();
                                        call+='&message=';
                                        call+=$("#emailmessage").val();
                                        call+='&subject=';
                                        call+=$("#subjectemail").val();
                                        $.getJSON(call,function (data) {
                                            alert(data);
                                        });

                                        $("#subjectemail").val("");
                                        $("#emailmessage").val("");
                                        $(this).dialog('close');
                                    },
                                    'Cancel':function(){
                                        $("#subjectemail").val("");
                                        $("#emailmessage").val("");

                                        $(this).dialog('close');
                                        }


                                   }
    });



    loginErrorMessageEl.hide();
    tmp=$.cookie(EMAIL_COOKIE);
    $(".emaillogin").val(tmp);
    $(".password").val($.cookie(PASSWORD_COOKIE));
    if(tmp!=null){
        $("#storecookies").prop('checked',true);
        $("#skipintro").prop('checked',$.cookie(SKIPINTRO_COOKIE));

    }
    registerdialogEl.dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Register':function(){
                                        $(this).toggle();
                                        register();
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        logUserAction('cancelRegister');
                                        $(this).dialog('close');
                                        }


                                   }
    });
    $('#registerErrorMessage').hide();
    $('#registerSuccesMessage').hide();

    $("#recoverpassworddialog").dialog({autoOpen:false,modal:true,show:"blind",hide:"blind",
                                   buttons:{
                                    'Recover Password':function(){
                                        $(this).toggle();
                                        recoverpassword($(this));
                                        $(this).toggle();
                                    },
                                    'Cancel':function(){
                                        $(this).dialog('close');
                                        }


                                   }
    });

    recoverPasswordSuccessEl.hide();
    recoverPasswordErrorMessageEl.hide();

    $('.register').click(function (){
       $(this).closest('.ui-dialog-content').dialog('close');
       registerdialogEl.dialog("open");
    });
    $('.recoverpassword').click(function (){
       $(this).closest('.ui-dialog-content').dialog('close');
       $("#recoverpassworddialog").dialog("open");
    });


    $('.login').click(function (){
       $(this).closest('.ui-dialog-content').dialog('close');
       noUser();
    });


    $('#email').click(function (){
       $(this).closest('.ui-dialog-content').dialog('close');
       $("#contactDialog").dialog("open");

    });


    createAppIconEl.click(function(){
        $('#adminName').show();
        $('#usernameAdmin').show();
        $('#emailloginAdmin').show();
        $('#passwordAdmin').show();
        $('#adminNameLabel').show();
        $('#usernameAdminLabel').show();
        $('#emailloginAdminLabel').show();
        $('#passwordAdminLabel').show();
        $('#abSelectLabel').hide();
        $('#abselect').hide();
        $('#abpath').hide();
        $('#addABButton').hide();
        $("#setupdialog").dialog("open");
    });

    setupIconEl.click(function(){
        $('#adminName').hide();
        $('#usernameAdmin').hide();
        $('#emailloginAdmin').hide();
        $('#passwordAdmin').hide();
        $('#adminNameLabel').hide();
        $('#usernameAdminLabel').hide();
        $('#emailloginAdminLabel').hide();
        $('#passwordAdminLabel').hide();
        $('#abSelectLabel').show();
        $('#abselect').show();
        $('#abpath').show();

        $('#addABButton').show();

        loadSetup();
        $("#setupdialog").dialog("open");

    });

//initialize color selection
   selectEl.change(function() {
      var option = selectEl.val();
      selectEl.css('background-color','#'+option);
      });

    if(AB_PATH.indexOf('tdr')!=-1){

        solutiondialogEl.css({"padding-left":"40px","padding-right":"40px"});
        solutiondialogEl.show();
        $('#root').hide();
        propId=-1;
        expandProposition("solutiondialog",null);
    }else{
        $("#precProp").hide();
        $("#nextProp").hide();
        $("#nextcat").hide();

        expand(rootEl);
        propId=getParameterByName("propositionId");
    }
        if(AB_PATH.indexOf('tdr')==-1){

    if(propId!=null &&  typeof propId!=='undefined'){
        propId=propId.substring(1);

            expandTree(propId);
        }
    }

    addFirstCategoryEl.click(function(){
        current = null;
        categorydialogEl.dialog("open");
    })

    $('#abselect').change(showSetup);

    $('#showResults').click(showResults);
    $('#addABButton').click(addAbPath);
    if(APPID==1){
        $('#STRONG_AGAINST').text(dictionary[LANGUAGE]['Forbid']);
        $('#AGAINST').text(dictionary[LANGUAGE]['Tolerate']);
        $('#NEUTRAL').text(dictionary[LANGUAGE]['Agree']);
        $('#AGREE').text(dictionary[LANGUAGE]['Mandatory for Me']);
        $('#MANDATORY').text(dictionary[LANGUAGE]['Mandatory for Everyone']);


    }else{
        $('#STRONG_AGAINST').text(dictionary[LANGUAGE]['STRONG_AGAINST']);
        $('#AGAINST').text(dictionary[LANGUAGE]['AGAINST']);
        $('#NEUTRAL').text(dictionary[LANGUAGE]['NEUTRAL']);
        $('#AGREE').text(dictionary[LANGUAGE]['AGREE']);
        $('#MANDATORY').text(dictionary[LANGUAGE]['MANDATORY']);
    }
    //in order the dialog popup to be over the menu
    headerEl.attr("z-index","100");

}


function reinit(){

    $(".strongdisagree").click(function (){
        if(USERKEY==null){
            noUser();
            return;
        }
        calculateVote($(this));
    });
    $(".agree").click(function (){
        if(USERKEY==null){
            noUser();
            $(this).prop('checked', false);
            return;
        }
        calculateVote($(this));
    });
    $(".disagree").click(function (){
        if(USERKEY==null){
            noUser();
            $(this).prop('checked', false);
            return;
        }
        calculateVote($(this));
    });
    $(".strongagree").click(function (){
        if(USERKEY==null){
            noUser();
            return;
        }
        calculateVote($(this));
    });

    $(".vote").click(function (){
        if(USERKEY==null){
            noUser();
            return;
        }
        vote();
    });


    $(".addproargument").click(function(){
        if(USERKEY==null){
            noUser();
            return;
        }
        isArgument=true;
//        current = $(this).parent().parent().parent().find('.leftargument');
        proargumentdialogEl.dialog("open");
//        propositionId=$(this).parent().parent().parent().parent().attr('id').substr(1);//remove p from id
    });

        $(".addagainstargument").click(function(){
        if(USERKEY==null){
            noUser();
            return;
        }
        isArgument=false;
//        current = $(this).parent().parent().parent().find('.rightcontrargument');
        proargumentdialogEl.dialog("open");
//        propositionId=$(this).parent().parent().parent().parent().attr('id').substr(1);//remove p from id
    });

        $(".readmore").click(function(){
            $(this).parent().find(".afterread").toggle();
            $(this).toggle();
        });

        $(".addsubcategory").click(function(){
        if(USERKEY==null){
            noUser();
            return;
        }
           current = $(this).parent().parent().parent().parent().find(".categories:first");
           categorydialogEl.dialog("open");
        });

        $(".addcategory").click(function(){
        if(USERKEY==null){
            noUser();
            return;
        }
           current = $(this).parent().parent().parent().parent().parent();
           categorydialogEl.dialog("open");
        });

        $(".addproposition").click(function(){
        if(USERKEY==null){
            noUser();
            return;
        }
           current = $(this).parent().parent().parent().parent().find(">.propositions:first");
           currrentCat = $(this).parent().parent().parent().parent();
           color=$(this).parent().parent().parent().parent().find("div:first").css('background-color');
           isAlternative=false;
           propIdEl.val($(this)[0].id.substring(1));//id is in form pNumber. remove 'p'

                propTitleEl.val("");

                descriptiontextEl.val("");
                propositionimgEl.attr('src',"");
                photoUrlEl.attr('src',"");

           propositiondialogEl.dialog("open");

        });

        $(".addAlternative").click(function(){
        if(USERKEY==null){
            noUser();
            return;
        }
            current=$(this).parent();
            isAlternative=true;
            color=current.css('background-color');
            propositiondialogEl.dialog("open");
        });

        $(".expand").click(function(){
            expand($(this).parent().parent().parent());
        });

        $(".leftarrow").click(function(event){
            arrowPressed=1;
            event.stopPropagation();
            expand($(this).parent().parent().parent().prev());
        });


        $(".rightarrow").click(function(event){
            arrowPressed=1;
            event.stopPropagation();
            expand($(this).parent().parent().parent().next());
        });



        $(".category").click(function(){
            expand($(this).parent());
        });

        $(".category").on("swipe",function(){
            expand($(this).parent().next());
        });


        $(".proposition").click(function(){
            //if proposition has status==DRAFT, load propositiondialog
            if($(this)!=null){
                title=$(this).find('.propositionTitle')[0].innerHTML;
                ind=title.indexOf('</span>')
                //if it is published, it cannot be edited
                if(ind==-1){
                    currentProposition=$(this);
                    propId=currentProposition.attr('id').substr(1);
                    expandProposition(getDialogType(),null);
                return;
                }
                title=title.substring(ind+'</span>'.length);
                propTitleEl.val(title);

                descriptiontextEl.val($(this).find('.descriptionText p')[0].innerHTML);
                photoURL=$(this).find('.smallphotoProposition').attr('src');
                propositionimgEl.attr('src',photoURL);
                photoUrlEl.val(photoURL);
                propIdEl.val($(this)[0].id.substring(1));
                currentProposition=$(this);

               propositiondialogEl.dialog("open");


            }else{
                currentProposition=$(this);
                propId=currentProposition.attr('id').substr(1);
                expandProposition(getDialogType(),null);

            }
        });



        $(".collapse").click(function(){
           $(this).hide();
           $(this).parent().find(".expand").show();
           $(this).parent().parent().parent().find(".categories:first").hide();
           $(this).parent().parent().parent().find(".propositions:first").hide();

           $(this).parent().parent().find(".actions:first").hide();
           $(this).parent().parent().find(".leftarrow:first").hide();
        rael=$(this).find(".rightarrow:first");//change the icon from right arrow to expanded
        rael.attr('src',"/static/vote/images/rightarrow.png");

        });

        $(".expandProposition").click(function(){
            currentProposition=$(this).parent().parent().parent();
            propId=currentProposition.attr('id').substr(1);
            expandProposition(getDialogType(),null);
        });

        $(".collapseProposition").click(function(){
            el=$(this).parent().parent().parent();
           el.find(".expandProposition").show();
           el.find(".collapseProposition").hide();
           el.find(".details").hide();
           el.find(".readmore:first").show();
           el.find(".afterread:first").hide();

           el.find(".actions:first").hide();

        });


}

function collapse(el){

    el.find(".propositions:first").hide();
    el.find(".actions:first").hide();
    el.find(".leftarrow:first").hide();
    rael=el.find(".rightarrow:first");//change the icon from right arrow to expanded
    rael.attr('src',"/static/vote/images/rightarrow.png");

}



function expand(el){

if(oldCat!=null && oldCat[0].id!=el.id){
    collapse(oldCat);
}

    oldCat = el;
//if the type of display is hamburger, then
//hide all the categories except the current one and its children
if(AB_PATH.indexOf("hamburger")!=-1){
    $('.article').hide();
//    el.find(".categories:first").show();
    el.find(".categories:first").children(".article").show();
    parentCat=el;
    while(parentCat[0].id!='root'){
        parentCat.show();
        parentCat = parentCat.parent().parent();
    }
    parentCat.show();

}

    id=el.attr('id');
if(id=='root')
    id=ROOT_CATEGORY_ID;
else
    id=id.substr(1);//remove c from id

currrentCategoryId = id;

    catType=el.attr('cattype');
//if it is not ROOT node
if(catType!=-1){
    var par;
    if(el.prev().hasClass("article"))
        par = el.prev();
    else
        par = el.parent().parent();

/*$('html, body').animate({
            scrollTop: par.offset().top
    }, 500);*/
//    $(document).scrollTop(par.offset().top);
    $(document).scrollTop(par.offset().top);
}
if(expandedSet.has(id)){
           el.find(".expand:first").hide();
           el.find(".collapse:first").show();
           el.find(".categories:first").show();
           el.find(".propositions:first").show();
           el.find(".actions:first").show();
        //    el.find(".leftarrow:first").show(); no more left arrow to go to previous
        rael=el.find(".rightarrow:first");//change the icon from right arrow to expanded
        rael.attr('src',"/static/vote/images/expanded.png");

    return;
}
           el.find(".actions:first").show();
    //    el.find(".leftarrow:first").show();
        rael=el.find(".rightarrow:first");//change the icon from right arrow to expanded
        rael.attr('src',"/static/vote/images/expanded.png");
expandedSet.add(id);
 //$.getJSON
$.ajax({ url:SERVER+'getCategory?appid='+APPID+'&userkey='+USERKEY+'&categoryid='+id+'&offset=0'+getServerExtraParameters()}).done( function (data) {
    networkTry=0;
        if(data['code']=='authentication error'){
            authenticate();
            return;
        }

        if(data['code']!=null){
            alert(data['code']);
            return;
        }
        categories=data['categories'];
        wh=el.find(".categories:first");
        //if there are no categories, only the root one, just show the add category button
        if(categories.length==1){
            addFirstCategoryEl.show();
        }

        for(i=0;i<categories.length;i++){
            /*
            skip root when there are children, not needed anymo
            */
            if(categories[i]['catType']=='-1'){
                wh.append('<br><br>');
                continue;
            }

            loadCategory(wh,parseInt(categories[i]['id']),categories[i]['name'],categories[i]['color'],categories[i]['catType']);

        }

        propositions=data['propositions'];
            if(propositions.length<6){
                    allPropositionsLoaded['c'+id]='true';
                }

        color=el.find("div:first").css('background-color');
        wh=el.find(".propositions:first").find('.row-height:last');
        for(i=0;i<propositions.length;i++){

            loadProposition(true,wh,parseInt(propositions[i]['id']),propositions[i]['title'],propositions[i]['description'],propositions[i]['importance'],propositions[i]['photo'],propositions[i]['strongAgreeNb'],propositions[i]['strongDisagreeNb'],propositions[i]['agreeNb'],propositions[i]['disagreeNb'],propositions[i]['vote'],propositions[i]['photo'],propositions[i]['creatorName'],propositions[i]['creatorPhoto'],catType,propositions[i]['status']);
        }
        $('.proposition').matchHeight();


    reinit();
    //modify for all dialogs the distance to the top from 18px to 50px

           el.find(".expand:first").hide();
           el.find(".collapse:first").show();
           el.parent().find(".categories:first").show();
           el.parent().find(".propositions:first").show();
 }).fail(function (data){
        alert(data);

    /** for retry I need to pass as parameter networkTry,because just a variable will be always initiated to 0
     if(id==ROOT_CATEGORY_ID && networkTry<3){
         window.location.reload();
         networkTry++;
     }else{
         window.location.reload();
         networkTry=0;
        alert('no internet connection');
     }
     */
    });
}

function expandDraft(data){
               propId=data["id"];
                propTitleEl.val(data["title"]);

                descriptiontextEl.val(data["description"]);
                propositionimgEl.attr('src',"creatorPhoto");
                photoUrlEl.attr('src',"creatorPhoto");

        solutiondialogEl.hide();
        propositiondialogEl.show();
}

function expandProposition(dialogType,operation){
//if(!expandedSet.has(id)){
if(true){

    call=SERVER+'getProposition?appid='+APPID+'&userkey='+USERKEY+'&propositionid='+propId+getServerExtraParameters()+"&operation="+operation;
    $.getJSON(call, function (data) {
        if(data['status']==0){
            expandDraft(data);
            return;
        }
        pros=data['proarguments'];
        current=leftargumentEl;
        current.empty();
        for(i=0;i<pros.length;i++){
            loadArgument(pros[i]['id'],true,pros[i]['description'],pros[i]['vote']);
        }
        cons=data['againstarguments'];
        current=rightcontrargumentEl;
        current.empty();
        for(i=0;i<cons.length;i++){
            loadArgument(cons[i]['id'],false,cons[i]['description'],cons[i]['vote']);
        }
        solutionTitleEl.text(data['title']);
        solutionDescriptionEl.text(data['description']);
        solutionImgEl.attr('src',data['photo']);
        //currentPropositionId=data['id'];
        propId=data['id'];
if("userdialog"==dialogType)
    userdialogEl.dialog("open");
else if("productofferdialog"==dialogType)
    productofferdialogEl.dialog("open");
else{
    leftheader=leftheaderEl;
    rightheader=rightheaderEl;
    //move against argument title after pro arguments
    if(screen.width<769){
        if(leftheader.next()[0]==rightheader[0]){
            rightheader.detach().insertBefore('#rightcontrargument')[0];
        }
        //move against argument title after pro title
    }else{
        if(rightcontrargumentEl.prev()[0]==rightheader[0]){
            rightheader.detach().insertAfter(leftheader[0]);
        }
    }

    if(AB_PATH.indexOf('tdr')==-1)
        solutiondialogEl.dialog("open");
    else{
        currrentCategoryId=data["categoryId"];
        solutiondialogEl.show();
        propositiondialogEl.hide();
    }

    $('input[name=vote1]').prop('checked', false);
    $('input[name=vote1][value="'+data['vote']+'"]').prop('checked', true);


}

 /*
 no more use of alternatives
        alternatives=data['alternatives']
        wh=el.find(".alternatives:first")
        for(i=0;i<alternatives.length;i++){
            loadProposition(false,wh,parseInt(alternatives[i]['id']),alternatives[i]['title'],alternatives[i]['description'],alternatives[i]['importance'],alternatives[i]['photo'],alternatives[i]['strongAgreeNb'],alternatives[i]['strongDisagreeNb'],alternatives[i]['agreeNb'],alternatives[i]['disagreeNb'],alternatives[i]['vote'],alternatives[i]['photo'],alternatives[i]['creatorName'],alternatives[i]['creatorPhoto']);
        }*/
reinit();
    });
    if (typeof id !== 'undefined') {
    // the variable is defined
    expandedSet.add(id);
    }

//    el.find(".actions:first").show();

}
/*           el.find(".expandProposition:first").hide();
           el.find(".collapseProposition:first").show();
           el.find(".details:first").show();
           el.find(".readmore:first").hide();
           el.find(".afterread:first").show();
            el.find(".actions:first").show();*/
}


function calculateVote(el){
    if(USERKEY==null){
        noUser();
        return;
    }
    p=el.parent().parent().parent();
    sd=p.find('.leftargument').find('.strongdisagree:checked').length+p.find('.rightcontrargument').find('.strongagree:checked').length;
    d=p.find('.leftargument').find('.disagree:checked').length+p.find('.rightcontrargument').find('.agree:checked').length;
    a=p.find('.leftargument').find('.agree:checked').length+p.find('.rightcontrargument').find('.disagree:checked').length;
    sa=p.find('.leftargument').find('.strongdagree:checked').length+p.find('.rightcontrargument').find('.strongdisagree:checked').length;
    suggested='';
    if(sd>sa)
        suggested='Strong Against';
    else if(sd<sa)
        suggested='Strong Pro';
    else if(d>a)
        suggested='Against';
    else if(d<a)
        suggested='Agree';
    else
        suggested='Neutral';
    p.parent().parent().find('.suggestedVote').text(suggested);

    argId=el.parent().prev().attr('id').substr(1);

    call=SERVER+'voteArgument?appid='+APPID+'&userkey='+USERKEY+'&argumentid='+argId+'&type='+el.val();
    $.getJSON(call, function (data) {});


}

function vote(){
    if(USERKEY==null){
        noUser();
        return false;
    }
    if(useDummyUser==true){
        if(counterDummyActions>MAX_DUMMY_ACTIONS){
            counterDummyActions=0;
            noUser();
            return false;
        }else{
            counterDummyActions++;
        }
    }
    voteType=$('input[name=vote1]:checked').val();
    //propEl=el.parent().parent().parent().parent().parent();
//    propositionid=propEl.attr("id").substr(1);
    call=SERVER+'voteProposition?appid='+APPID+'&userkey='+USERKEY+'&propositionid='+propId+'&type='+voteType;
    $.getJSON(call, function (data) {
        //don't try to show the vote in category view
        if(AB_PATH.indexOf('tdr')!=-1)
            return;
        //<div class="voteLabel" catType
        divLabel=currentProposition.find("div .voteLabel");
        divLabel[0].innerHTML = dictionary[LANGUAGE]['Your vote:']+getVoteLabel(Number(divLabel.attr("catType")),voteType);
        divLabel.textContent = dictionary[LANGUAGE]['Your vote:']+getVoteLabel(Number(divLabel.attr("catType")),voteType);
        showMessageBox(dictionary[LANGUAGE]['your vote was recorded']+getVoteLabel(Number(divLabel.attr("catType")),voteType));
//        propEl.find(".disagreeNb").text(data['disagreeNb']);
//        propEl.find(".agreeNb").text(data['agreeNb']);

    });
    if(AB_PATH.indexOf('tdr')==-1){
        solutiondialogEl.dialog("close");
        productofferdialogEl.dialog("close");
        userdialogEl.dialog("close");
    }
}

function saveArgument(diag){
    if(USERKEY==null){
        noUser();
        return;
    }
    type = 0;
    if(isArgument)
        type=1;
    description=proargtextEl.val();
    call=SERVER+'addArgument?appid='+APPID+'&userkey='+USERKEY+'&description='+description+'&type='+type+'&propositionid='+propId;
    $.getJSON(call, function (data) {
        if(data['code']=='authentication error'){
            authenticate();
            return;
        }
                                        loadArgument(data['id'],isArgument,description);
                                        proargtextEl.val("");
                                        reinit();
                                        diag.dialog('close');
       });

}

function loadArgument(id,isPro,description,vote){
                                        uniq = 'id' + (new Date()).getTime()+(uniqCounter++);
                                        if(isPro){
                                            leftargumentEl.append('<div class="argument col-xs-12 col-sm-6  col-md-6 col-lg-6" id="a'+id+'">'+description+'</div>');
                                            r=leftargumentEl.append('<div class="vot col-xs-12 col-sm-6  col-md-6 col-lg-6">'+'<input type="radio" name="'+uniq+'" value="2" class="disagree"> disagree '+'<input type="radio" name="'+uniq+'" value="3" class="agree"> agree </div>');

                                        }else{
                                            rightcontrargumentEl.append('<div class="contrargument col-xs-12 col-sm-6  col-md-6 col-lg-6" id="a'+id+'">'+description+'</div>');
                                            r=rightcontrargumentEl.append('<div class="vot col-xs-12 col-sm-6  col-md-6 col-lg-6"><input type="radio" name="'+uniq+'" value="2" class="disagree"> disagree <input type="radio" name="'+uniq+'" value="3" class="agree"> agree</div>');
                                        }
                                        $("input[name="+uniq+"][value=" + vote + "]").prop('checked', true);

}

function saveCategory(diag){
    if(USERKEY==null){
        noUser();
        return;
    }
    noCategory=false;
    //the first category is about to be saved
    if(current==null){
        noCategory=true;
        parentid = 'c'+rootidEl.val();
        catType=0;
        current=$('.categories');
    }else{
        expand(current.parent());
        parentid=current.parent().attr('id');
        catType=current.parent().attr('cattype');


    }

    name=categorynameEl.val();
    color=selectEl.val();
    if(typeof catType === 'undefined' || catType==-1)
        catType=0;
    if(parentid=='root'){
        parentid=ROOT_CATEGORY_ID;
        if(!(catType>-1)){
            catType=0;
        }
    }
    else
        parentid=parentid.substr(1);//remove c
    id=parentid;
    call=SERVER+'addCategory?appid='+APPID+'&userkey='+USERKEY+'&color='+color+'&name='+name+'&parentid='+parentid+'&catType='+catType+'&lang='+LANGUAGE;
    $.getJSON(call, function (data) {
        if(data['code']=='authentication error'){
            authenticate();
            return;
        }
        if(noCategory==true){
           addFirstCategoryEl.hide();
        }
        loadCategory(current,parseInt(data['id']),name,color,catType);
        reinit();

        categorynameEl.val("");
        diag.dialog('close');
       });
}

function loadCategory(el,id,name,color,catType){
    //style="background-color:#'+color+'"
    txt='<div id="c';
    txt+=id;
    txt+='" catType="';
    txt+=catType;
    txt+='" class="article"><div class="category double">	<div style="float:left;width:50%;" class="double">';
//no expand button
//txt+='<img class="expand" src="/static/vote/images/expand.png"><img class="collapse" src="/static/vote/images/collapse.png">';
    txt+='<div class="double"><img class="leftarrow" src="/static/vote/images/leftarrow.png">';


    txt+='<p >';
    txt+=name;
    txt+='</p></div></div>	<div><img class="rightarrow" src="/static/vote/images/rightarrow.png"><div class="actions">';
    //if the category is of type User no need for actions
    //if the setting for path is not to display Add category
    //or the user has no right to do it
    if(catType!=2 && ((USER_RIGHTS!=null && USER_RIGHTS.indexOf('C')!=-1 ) || AB_PATH.indexOf('C1C')!=-1)){
        txt+='<input type="button" value="';
        txt+=dictionary[LANGUAGE]['Add Topic'];
        txt+='" class="addcategory"/>';
        txt+='&nbsp;<input type="button" value="'+dictionary[LANGUAGE]['Add SubTopic']+'" class="addsubcategory"/&nbsp;>';
    }
    //if the category is of type User no need for actions
    if(catType!=2)
        txt+='<input type="button" value="'+dictionary[LANGUAGE]['Add Solution']+'" class="addproposition"/>';
    txt+='</div>';

    txt+='</div></div>	<div class="container-fluid"><div class="propositions row"><div class="row-height"></div></div></div><div class="categories"></div>';
    el.append(txt);
    catdiv=$('#c'+id);

$('.propositions').scroll(function() {
      if(loadingEl.css('display') == 'none') {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
           //var limitStart = $("#results li").length;
           //loadResults(limitStart);

           if(id!=currrentCategoryId || allPropositionsLoaded['c'+id]!=null)
                return;
            loadingEl.show();
            //the number of propositions already loaded:there is another div which contains all propositions
            offset=($(this).children()[0]).children.length;
            $.ajax({ url:SERVER+'getCategory?appid='+APPID+'&userkey='+USERKEY+'&categoryid='+id+'&offset='+offset+getServerExtraParameters()}).done( function (data) {
                if(data['code']=='authentication error'){
                    authenticate();
                    return;
                }

                if(data['code']!=null){
                    alert(data['code']);
                    return;
                }

                propositions=data['propositions'];
                if(propositions.length<6){
                    allPropositionsLoaded['c'+id]='true';
                }
                wh=el.find(".propositions:first").find('.row-height:last');
                for(i=0;i<propositions.length;i++){

                    loadProposition(true,wh,parseInt(propositions[i]['id']),propositions[i]['title'],propositions[i]['description'],propositions[i]['importance'],propositions[i]['photo'],propositions[i]['strongAgreeNb'],propositions[i]['strongDisagreeNb'],propositions[i]['agreeNb'],propositions[i]['disagreeNb'],propositions[i]['vote'],propositions[i]['photo'],propositions[i]['creatorName'],propositions[i]['creatorPhoto'],catType,propositions[i]['status']);
                }
                $('.proposition').matchHeight();

                loadingEl.hide();
                reinit();


            });

        }
      }
	});

}

function login(el){
    if(dummyUser==null){
        call=SERVER+'login?username='+el.find('.emaillogin:first').val()+'&password='+el.find('.password:first').val()+'&appid='+APPID;
    }else{
        call=SERVER+'login?username='+el.find('.emaillogin:first').val()+'&password='+el.find('.password:first').val()+'&appid='+APPID+'&dummyUser='+dummyUser;
        dummyUser=null;
        useDummyUser=false;
    }
    $.getJSON(call, function (data) {
        if(data['code']!=null){
            el.find('.emaillogin:first').val("");
            el.find('.password:first').val("");
            loginErrorMessageEl.show();
        }else{
            $('.categories').empty();
            expandedSet.clear();
            expand(rootEl);

            loginErrorMessageEl.hide();
            USERKEY = data['userkey'];
            USER_RIGHTS = data['rights'];
            loginEl.toggle();
            logoutEl.toggle();
            if(storecookiesEl.prop("checked")==true){
                $.cookie(EMAIL_COOKIE,el.find('.emaillogin:first').val());
                $.cookie(PASSWORD_COOKIE,el.find('.password:first').val());

                $.cookie(SKIPINTRO_COOKIE,skipintroEl.prop("checked"));
            }

            if(USER_RIGHTS.indexOf('A')!=-1){
               setupIconEl.show();
            }
            createAppIconEl.hide();

            $(document).scrollTop(0);
            logindialogEl.dialog('close');


        $.getJSON(SERVER+'getCluster?userkey='+USERKEY, function (data) {
            groupsizeEl.text('your group size '+data['clustersize']);

        });

        }
    });


}

function register(){
    //if it is a bot, because username is

    if(usernameEl.val()!="")
        return;
    if(dummyUser!=null && !dummyUser.startsWith('TMP')){
        call=SERVER+'register?appid='+APPID+'&username='+registeremailloginEl.val()+'&password='+registerpasswordEl.val()+"&name="+nameEl.val()+"&photoUrl="+photoRegUrlEl.val()+'&dummyUser='+dummyUser;
    }else{
        call=SERVER+'register?appid='+APPID+'&username='+registeremailloginEl.val()+'&password='+registerpasswordEl.val()+"&name="+nameEl.val()+"&photoUrl="+photoRegUrlEl.val();
    }
    $.getJSON(call, function (data) {
        if(data['code']!=null){
            registerErrorMessageEl.text(data['code']);
            registerErrorMessageEl.show();
        }else{
            USERKEY=data['userkey'];
            if(useDummyUser==false){
                dummyUser=null;
            }else{
                dummyUser=USERKEY;
                useDummyUser=false;
            }
            registerErrorMessageEl.text("");
            registerErrorMessageEl.hide();
            registerSuccesMessageEl.show();
            setTimeout(function() {
                registerSuccesMessageEl.hide();
                registerdialogEl.dialog('close');
            }, 3000);
        }
    });
}

function recoverpassword(el){
    call=SERVER+'recoverpassword?appid='+APPID+'&email='+el.find('.emaillogin:first').val();
    $.getJSON(call, function (data) {
        if(data['code']!=null){
            recoverPasswordErrorMessageEl.text(data['code']);
            recoverPasswordErrorMessageEl.show();
        }else{
            recoverPasswordSuccessEl.show();
            recoverPasswordErrorMessageEl.hide();
        }
    });
}

function saveProposition(diag,status){
    if(USERKEY==null){
        noUser();
        return;
    }
    catId=-1;
    if(AB_PATH.indexOf("tdr")==-1){
        catEl=currrentCat;
        if(typeof catEl !=='undefined'){
            catId=catEl.attr('id').substr(1);
            expand(currrentCat);
        }
    }else{
        catId=currrentCategoryId;
    }
    descr=descriptiontextEl.val();
    title=propTitleEl.val();
    photoUrl=photoUrlEl.val();
    propId=propIdEl.val();

    call=SERVER+'addProposition?appid='+APPID+'&userkey='+USERKEY+'&propId='+propId+'&status='+status+'&categoryid='+catId+'&title='+title+'&description='+descr+'&photoUrl='+photoUrl;

    $.getJSON(call, function (data) {
        if(data['code']=='authentication error'){
            authenticate();
            return;
        }
        if(AB_PATH.indexOf("tdr")!=-1){
            showMessageBox(dictionary[LANGUAGE]['Your solution was saved']);
            return;

        }
        tmp=null;
        cattype=null;
        if(catEl!=null){
            tmp=catEl.find('.propositions:first').find('.row-height:last');
            cattype=catEl.attr('cattype');
        }
        if(currentProposition!=null){
                //if published
                if(status==1)
                    $(currentProposition).find('.propositionTitle')[0].innerHTML=title;
                else
                    $(currentProposition).find('.propositionTitle')[0].innerHTML='<span style="color:red">DRAFT:</span>'+title;
                $(currentProposition).find('.descriptionText p')[0].innerHTML=descr;
                $(currentProposition).find('.smallphotoProposition').attr('src',photoUrl);
                currentProposition=null;
        }else{
            newProp=loadProposition(true,tmp,parseInt(data['id']),title,descr,0,'none',0,0,0,0,0,photoUrl,'','',cattype,status);
            reinit();
        }
        propTitleEl.val("");
        descriptiontextEl.val("");
        photoUrlEl.val("");
        diag.dialog('close');
        showMessageBox(dictionary[LANGUAGE]['Your solution was saved']);
//        expandProposition(newProp.find(".article:last"));

       });
}

function loadProposition(isProposition,el,id,title,descr,importance,photo,strongAgreeNb,strongDisagreeNb,agreeNb,disagreeNb,vote,photoUrl,creatorName,creatorPhoto,catType,status){
    ind=getPosition(descr," ",3);
/*    if(ind==-1){
        descr='<span>'+descr+'</descr>';
    }else{
        beforeRead=descr.substring(0,ind);
        afterRead=descr.substring(ind);
        descr='<span>'+beforeRead+'</span><span class="readmore"> read more</span><span class="afterread">'+afterRead+"</span>";
    }
    */


    txt='<div  id="p'+id+'" catType="'+catType+'" class="col-xs-12 col-sm-6  col-md-4 col-lg-3 article proposition  col-height" ><div class="inside" style="height:80%;overflow:hidden;">';
    txt+='<div class="double"><div style="float:left;width:100%;" class="double"><!--<img class="expandProposition" src="/static/vote/images/expand.png"><img class="collapseProposition" src="/static/vote/images/collapse.png">--><p class="propositionTitle">';
    //if the status of proposition is DRAFT, mark it
    if(status==0){
        txt+='<span style="color:red">DRAFT:</span>';
    }
    txt+=title+'</p></div>';
    txt+='<div class="actions">';
    if(isProposition)
        txt+='<input type="button" class="addAlternative" value="'+dictionary[LANGUAGE]['Add Alternative']+'"/>';
    txt+='</div></div>';

    if(USERKEY!=null){
    txt+='<div class="voteLabel" catType="'+catType+'">'+dictionary[LANGUAGE]['Your vote:'];
    txt+=getVoteLabel(catType,vote);
    //if it is economic
//    txt+='<div class="vot">'+'<input type="radio" name="'+uniq+'" value="1" > strong disagree '+'<input type="radio" name="'+uniq+'" value="2" > disagree '+'<input type="radio" name="'+uniq+'" value="3" > agree'+'<input type="radio" name="'+uniq+'" value="4"> strong agree'+'  <input type="button" value="Vote" class="vote" /></div>';

    txt+='</div>';
    }

    if(photoUrl!=null)
        txt+='<img src="'+photoUrl+'" class="smallphotoProposition">';
    txt+='<div class="descriptionText"><p>'+descr+'</p></div>';
/*	txt+='<div class="votes"><p>Number of Votes for Strong Disagree:<span class="strongDisagreeNb">'+strongDisagreeNb+'</span>';
    txt+=' Against:<span class="disagreeNb">'+disagreeNb+'</span>';
    txt+=' Agree:<span class="agreeNb">'+agreeNb+'</span>';
    txt+=' Strong Agree:<span class="strongAgreeNb">'+strongAgreeNb+'</span>';
*/
    /*
    if(catType==0){
    txt+='<div class="votes"><p>'+'Total number of votes:';
    txt+=parseInt(disagreeNb)+parseInt(agreeNb);
//    txt+='<span>Created by:'+creatorName+'</span>';
    txt+='</p></div>';
    }
    */
    /*txt+='<div class="details"><div class="double">';
    txt+='<div class="leftheader double"><h5 style="float: left">Pro</h5><input type="button" value="Add Pro Argument" class="addproargument"></div>';
	txt+='<div class="rightheader double"><h5 style="float: left">Against</h5><input type="button" value="Add Against Argument" class="addagainstargument">';
	txt+='</div></div><div class="double arguments"><div class="leftargument" > </div><div class="rightcontrargument"></div></div>';
    txt+='<div>Suggested Vote:<span class="suggestedVote"></span>';
*/
    //uniq = 'id' + (new Date()).getTime();
    txt+='</div>';/*<h5>Alternatives</h5>';
    txt+='<div class="alternatives"></div>';
    */
 //   txt+='</div></div>';

    if(el!=null)
        newProp=el.append(txt);
   // $("input[name="+uniq+"][value=" + vote + "]").prop('checked', true);

    return newProp;
}

function getVoteLabel(catType,vote){
    txt="";
    //if the vote is not for community then the votes are:
    if(APPID!=1){
        if(vote==1)
            txt=dictionary[LANGUAGE]['STRONG_AGAINST'];
        else if(vote==2)
            txt=dictionary[LANGUAGE]['AGAINST'];
        else if(vote==3)
            txt=dictionary[LANGUAGE]['NEUTRAL'];
        else if(vote==4)
            txt=dictionary[LANGUAGE]['AGREE'];
        else if(vote==5)
            txt=dictionary[LANGUAGE]['MANDATORY'];
    return txt;
    }
        if(catType==1){
        if(vote==0)
            txt+=dictionary[LANGUAGE]['undecided'];
        else if(vote==1)
            txt+=dictionary[LANGUAGE]['maybe'];
        else if(vote==2)
            txt+=dictionary[LANGUAGE]['rarely'];
        else if(vote==3)
            txt+=dictionary[LANGUAGE]['often'];
        else if(vote==4)
            txt+=dictionary[LANGUAGE]['daily'];
        else if(vote==6)
            txt+=dictionary[LANGUAGE]["I'd try"];
        else if(vote==6)
            txt+=dictionary[LANGUAGE]["I'd produce"];

    }
    //if it is People
    if(catType==2){
        if(vote==1)
            txt+=dictionary[LANGUAGE]['veto'];
        else if(vote==2)
            txt+=dictionary[LANGUAGE]['rather not'];
        else if(vote==3)
            txt+=dictionary[LANGUAGE]['like'];
        else if(vote==4)
            txt+=dictionary[LANGUAGE]['mandatory'];
    }

    if(catType==0){
    if(vote==0)
        txt+=dictionary[LANGUAGE]['Not yet'];
    else if(vote==1)
        txt+=dictionary[LANGUAGE]['Forbid'];
    else if(vote==2)
        txt+=dictionary[LANGUAGE]['Tolerate'];
    else if(vote==3)
        txt+=dictionary[LANGUAGE]['Agree'];
    else if(vote==4)
        txt+=dictionary[LANGUAGE]['Mandatory for Me'];
    else if(vote==5)
        txt+=dictionary[LANGUAGE]['Mandatory for Everyone'];
    }
    return txt;
}

//not used anymore
function addAlternative(diag){
    if(USERKEY==null){
        noUser();
        return;
    }
    //catEl=current.parent();//.parent().parent();
    //expand(catEl);
    descr=descriptiontextEl.val();
    title=propTitleEl.val();
    photoUrl=photoUrlEl.val();
    propositionId=current.parent().parent().attr('id').substr(1);
    call=SERVER+'addAlternative?appid='+APPID+'&userkey='+USERKEY+'&propositionid='+propositionId+'&title='+title+'&description='+descr+'&photoUrl='+photoUrl;

    $.getJSON(call, function (data) {
        if(data['code']=='authentication error'){
            authenticate();
            return;
        }
        newProp=loadProposition(false,current.parent().parent().find('.alternatives:first'),parseInt(data['id']),title,descr,0,'none',0,0,0,0,0,photoUrl,'','',0);
        reinit();
        propTitleEl.val("");
        descriptiontextEl.val("");
        diag.dialog('close');
//        expandProposition(current.parent().parent());

       });


}

//it returns the position of the i-th appearance of the m string in str
function getPosition(str, m, i) {
   ind= str.split(m, i).join(m).length;
   if(ind==str.length)
        return -1;
   else
        return ind;
}

function expandTree(propId){
    call=SERVER+'expandTree?appid='+APPID+'&userkey='+USERKEY+'&propositionid='+propId+'&rootId='+ROOT_CATEGORY_ID;
    $.getJSON(call, function (data) {
        if(data['code']=='authentication error'){
            authenticate();
            return;
        }
        cats=data['tree'];
        j=cats.length-1;
        mcounter=0;
        expandRec();
    });
}

function expandRec(){
    if(mcounter>10)
        return;
    if(j==-1){
        if($('#p'+propId).length==0){
            mcounter++;
            setTimeout(expandRec,3000);
        }
        else{
            currentProposition=$('#p'+propId);
            expandProposition(getDialogType(),null);
            //$('html, body').animate({scrollTop: $("#p"+propId).prev().offset().top}, 500);
            j--;
            return;
        }
    }
    if(j<-1)
        return;

    if($('#c'+cats[j]).length==0){
        mcounter++;
        mcounter++;
        setTimeout(expandRec,3000);
    }
    else{
        expand($('#c'+cats[j]));
        j--;
        mcounter++;
        expandRec();
    }

}

function resize(){
	var	$window = $(window),
			$body = $('body'),
			$banner = bannerEl,
			$header = headerEl;


//bootstrap grid:http://getbootstrap.com/css/
//.col-xs-	.col-sm-	.col-md-	.col-lg-
//Extra small devices Phones (<768px)	Small devices Tablets (≥768px)	Medium devices Desktops (≥992px)	Large devices Desktops (≥1200px)
//.col-md-4 for 3 columns, .col-md-6- for 2 columns, no class for one column

    $('.scrolly').removeClass("show");
    $('.txtDesc').remove();
    var totalWidth=navPanelEl.outerWidth();
    var cut=-1;

    elements=menuEl.find("li");
    lgth=elements.length;

    for(i=0;i<lgth;i++){
        if(cut==-1){
            totalWidth+=$(this).outerWidth();
            if(totalWidth>$(window).width()-100){
                cut=i;
           //     alert('win='+$(window).width()+',cut='+cut+',this='+$(this).outerWidth());
            }
        }
        if(cut>=0){
            $(this).hide();
            $(this).find('a').addClass("show");
        }else{
            $(this).show();
            $(this).find('a').removeClass("show");
        }
    }

    totalWidth+=fbframeEl.outerWidth();
    if(totalWidth>$(window).width()-100){
                cut=1;
    }


     p=navPanelEl.find('nav').parent();
	navPanelEl.find('nav').remove();
	var lk=navEl.navList();
	p.append('<nav>' + lk +
						'</nav>' +
						'<a href="#navPanel" class="close"></a>'
		);

		if($('a[href="'+uppath+'../fr/vote/index.html"').hasClass("show"))
            $('a[href="'+uppath+'../fr/vote/index.html"').append('<span class="txtDesc">Francais</span>');

        if(spanishEl.hasClass("show"))
            spanishEl.append('<span class="txtDesc">Espagnol</span>');


        if($('a[href="'+uppath+'../vote/index.html"').hasClass("show"))
            $('a[href="'+uppath+'../vote/index.html"').append('<span class="txtDesc">English</span>');

//        if($('a[href="#email"').hasClass("show"))
//            $('a[href="#email"').append('<span class="txtDesc">Contact</span>');

/*        $('.show').each(function( aShow ) {
        ch=$(this).find(">:first-child");
        if(ch.is("img"))
            $(this).append('<span class="txtDesc">'+ch.attr('alt')+'</span>');
        });
*/
    if($('a[href="#email"').hasClass("show")){
        mylikefbEl.addClass("show");
        $('a[href="#email"').after('<a class="link depth-0 txtDesc show" href="#" id="mylikefb"><span class="indent-0">Like us on Facebook</span></a>');
        mylikefbEl.click(function(){
            $(".fb-like").find("a.connect_widget_like_button").click();
            // You can look elements in facebook like button with firebug or developer tools.
            });
    }else  if($('a[href="#"').hasClass("show")){
        mylikefbEl.addClass("show");
        $('a[href="#"').before('<a class="link depth-0 txtDesc show" href="#" id="mylikefb"><span class="indent-0">Like us on Facebook</span></a>');
        mylikefbEl.click(function(){
            $(".fb-like").find("a.connect_widget_like_button").click();
            // You can look elements in facebook like button with firebug or developer tools.
            });
    }


   $('.navPanelToggle').show();


   $('a[href="#navPanel"').click(function (){
       iframe_containerEl.toggle();
    });

 $('a[href="#seePresentation"').click(function (){
       showPresentation();

    });
/*    var wd='100%';
    if($(window).width()>800)
        wd=parseInt($(window).width()*0.7);
    else
        wd=parseInt($(window).width()*0.9);

    $('.vote').css("width", wd);
    propositiondialogEl.width(wd);
*/
}

function showPresentation(){
    if($("#iframe_container").length>0)
        return;
    $('a[href="#seePresentation"').hide();
    banner2El.height(25);
    banner2El.before('<div id="banner"></div>');
    bannerEl.append('<br><br><iframe id="iframe_container" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" src="https://prezi.com/embed/1oeo6abh8rtk/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N2RxMU5OUmlOOUdOOURvaTBrcXpKTXZnPT0&amp;landing_sign=tbdnzguzJCat8CQAAY6MxOEfeP-K7ySSAxjFjOEQ77s" width="'+$(window).width()+'" height="'+($(window).height()-100)+'" frameborder="0"></iframe>');
    el=bannertextEl.detach();
    bannerEl.append(el);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function initDictionary(){
    if(typeof dictionary[LANGUAGE]  === "undefined"){
        dictionary[LANGUAGE]={};
        if(LANGUAGE=='en'){
            dictionary[LANGUAGE]['Save']='Save';
            dictionary[LANGUAGE]['your vote was recorded']='your vote was recorded';
            dictionary[LANGUAGE]['Add Topic']='Add Topic';

            dictionary[LANGUAGE]['Add SubTopic']='Add Sub-Category';
            dictionary[LANGUAGE]['Add Solution']='Add Solution';
            dictionary[LANGUAGE]['Your vote:']='Your vote:';
            dictionary[LANGUAGE]['Add Alternative']='Add Alternative';
            dictionary[LANGUAGE]['undecided']='Undecided';
            dictionary[LANGUAGE]['maybe']='Maybe';
            dictionary[LANGUAGE]['rarely']='Rarely';
            dictionary[LANGUAGE]['often']='Often';
            dictionary[LANGUAGE]['daily']='Daily';
            dictionary[LANGUAGE]["I'd try"]="I'd try";
            dictionary[LANGUAGE]["I'd produce"]="I'd produce";
            dictionary[LANGUAGE]['veto']='Veto';
            dictionary[LANGUAGE]['rather not']='Rather not';
            dictionary[LANGUAGE]['like']='Like';
            dictionary[LANGUAGE]['mandatory']='Mandatory';
            dictionary[LANGUAGE]['Not yet']='Not yet';
            dictionary[LANGUAGE]['Forbid']='Forbid';
            dictionary[LANGUAGE]['Tolerate']='Tolerate';
            dictionary[LANGUAGE]['Agree']='Agree';
            dictionary[LANGUAGE]['Mandatory for Me']='Mandatory for me';
            dictionary[LANGUAGE]['Mandatory for Everyone']='Mandatory for Everyone';
            dictionary[LANGUAGE]['ABSENT']='Missing';
            dictionary[LANGUAGE]['STRONG_AGAINST']='Strong against';
            dictionary[LANGUAGE]['AGAINST']='Against';
            dictionary[LANGUAGE]['NEUTRAL']='Neutral';
            dictionary[LANGUAGE]['AGREE']='Agree';
            dictionary[LANGUAGE]['MANDATORY']='Mandatory';

            dictionary[LANGUAGE]['Your solution was saved']='Your solution was saved';
            dictionary[LANGUAGE]['newappCongrats']='Congratulations ! You have just created a new project. Now, you can share it:'
            dictionary[LANGUAGE]['setupsaved']='The settings were saved. Press Ok to reload the page'
            dictionary[LANGUAGE]['duplicateABPATH']="There is already an A/B path with this value";
        }
        if(LANGUAGE=='fr'){
            dictionary[LANGUAGE]['Save']='Sauve';
            dictionary[LANGUAGE]['your vote was recorded']='ton vote a ete enregistre';
            dictionary[LANGUAGE]['Add Topic']='Ajouter une categorie';
            dictionary[LANGUAGE]['Add SubTopic']='Ajouter une subcategorie';
            dictionary[LANGUAGE]['Add Solution']='Ajouter Solution';
            dictionary[LANGUAGE]['Your vote:']='Votre vote: ';
            dictionary[LANGUAGE]['Add Alternative']='Ajoutez Alternative';
            dictionary[LANGUAGE]['undecided']='pad decide';
            dictionary[LANGUAGE]['maybe']='peutetre';
            dictionary[LANGUAGE]['rarely']='rarement';
            dictionary[LANGUAGE]['often']='frequent';
            dictionary[LANGUAGE]['daily']='journalier';
            dictionary[LANGUAGE]["I'd try"]="J'essaye";
            dictionary[LANGUAGE]["I'd produce"]='Je produce';
            dictionary[LANGUAGE]['veto']='Veto';
            dictionary[LANGUAGE]['rather not']='mieux pas';
            dictionary[LANGUAGE]['like']="J'aime";
            dictionary[LANGUAGE]['mandatory']='Obligatoire';
            dictionary[LANGUAGE]['Not yet']='Pas encore';
            dictionary[LANGUAGE]['Forbid']='Interdit';
            dictionary[LANGUAGE]['Tolerate']='Tolere';
            dictionary[LANGUAGE]['Agree']="D'accord";
            dictionary[LANGUAGE]['Mandatory for Me']='Obligatoire pour moi';
            dictionary[LANGUAGE]['Mandatory for Everyone']='Obligatoire pour tout le monde';
            dictionary[LANGUAGE]['Your solution was saved']='Votre solution a ete sauve';
            dictionary[LANGUAGE]['newappCongrats']='Felicitations ! Vous avez cree un nouveau projet. Vouz pouvez partajez:';
            dictionary[LANGUAGE]['setupsaved']='Les paramètres ont été enregistrés. Appuyez sur Ok pour recharger la page';
            dictionary[LANGUAGE]['duplicateABPATH']='Il y a deja une A/B entre avec cette valeur '
            dictionary[LANGUAGE]['ABSENT']='Absent';
            dictionary[LANGUAGE]['STRONG_AGAINST']='Totalement Contre';
            dictionary[LANGUAGE]['AGAINST']='Contre';
            dictionary[LANGUAGE]['NEUTRAL']='Neutre';
            dictionary[LANGUAGE]['AGREE']="D'accord";
            dictionary[LANGUAGE]['MANDATORY']='Obligatoire';

        }
        if(LANGUAGE=='ro'){
            dictionary[LANGUAGE]['Save']='Salveaza';
            dictionary[LANGUAGE]['your vote was recorded']='Votul dvs a fost inregistrat';

            dictionary[LANGUAGE]['Add Topic']='Adauga o categorie';
            dictionary[LANGUAGE]['Add SubTopic']='Adauga o subcategorie';
            dictionary[LANGUAGE]['Add Solution']='Adauga Solutie';
            dictionary[LANGUAGE]['Your vote:']='Votul dvs: ';
            dictionary[LANGUAGE]['Add Alternative']='Adauga Alternativa';
            dictionary[LANGUAGE]['undecided']='Nedecis';
            dictionary[LANGUAGE]['maybe']='Poate';
            dictionary[LANGUAGE]['rarely']='Rar';
            dictionary[LANGUAGE]['often']='Des';
            dictionary[LANGUAGE]['daily']='Zilnic';
            dictionary[LANGUAGE]["I'd try"]='Voi incerca';
            dictionary[LANGUAGE]["I'd produce"]='Voi produce';
            dictionary[LANGUAGE]['veto']='Veto';
            dictionary[LANGUAGE]['rather not']='Mai bine nu';
            dictionary[LANGUAGE]['like']='Imi place';
            dictionary[LANGUAGE]['mandatory']='Obligatoriu';
            dictionary[LANGUAGE]['Not yet']='Nu inca';
            dictionary[LANGUAGE]['Forbid']='Interzis';
            dictionary[LANGUAGE]['Tolerate']='Tolerez';
            dictionary[LANGUAGE]['Agree']='De acord';
            dictionary[LANGUAGE]['Mandatory for Me']='Obligatoriu pt mine';
            dictionary[LANGUAGE]['Mandatory for Everyone']='Obligatoriu pt toti';
            dictionary[LANGUAGE]['Your solution was saved']='Solutia dvs a fost salvata';
            dictionary[LANGUAGE]['newappCongrats']='Felicitari. Ati creat un nou proiect si il puteti partaja:';
            dictionary[LANGUAGE]['setupsaved']='Setările au fost salvate. Apăsaţi Ok pentru a reincarca pagina';
            dictionary[LANGUAGE]['duplicateABPATH']="exista deja o cale de test A/B cu aceasta valoare";
            dictionary[LANGUAGE]['ABSENT']='Absenti';
            dictionary[LANGUAGE]['STRONG_AGAINST']='Total dezacord';
            dictionary[LANGUAGE]['AGAINST']='Impotriva';
            dictionary[LANGUAGE]['NEUTRAL']='Neutru';
            dictionary[LANGUAGE]['AGREE']='Agreez';
            dictionary[LANGUAGE]['MANDATORY']='Obligatoriu';

        }
    }


}

function logUserAction(label){
    $.getJSON(SERVER+'logUserAction?label='+label);
}

function getServerExtraParameters(){
    return '&abPath='+AB_PATH+'&widthScreen='+document.body.clientWidth+'&heightScreen='+document.body.clientHeight;
}

function getDialogType(){

    if(currentProposition.attr('cattype')==2)
        return "userdialog";
    else if(currentProposition.attr('cattype')==1)
        return "productofferdialog";
    else
        return "solutiondialog";
}

function showMessageBox(message){
    messageboxEl.text(message);
    setTimeout(function(){
        messageboxEl.fadeOut().empty();


    }

    , 5000);

}

function setupApplication(){

    if(USERKEY==null){
        //it is the creation of a new Project
        tmp=SERVER;
        tmp+='createApplication?adminName=';
        tmp+=$('#adminName').val();
        tmp+='&usernameAdmin=';
        tmp+=$('#usernameAdmin').val();
        tmp+='&emailloginAdmin=';
        tmp+=$('#emailloginAdmin').val();
        tmp+='&passwordAdmin=';
        tmp+=$('#passwordAdmin').val();
    }else{
        //it is saving of a new a/b version of the setting
        tmp=SERVER;
        tmp+='saveSetup?userkey=';
        tmp+=USERKEY;
        tmp+='&appid=';
        tmp+=APPID;
        tmp+='&abPath=';
        tmp+=$('#abpathSetup').val();
    }
    tmp+='&pageEnTitle=';
    tmp+=$('#pageEnTitle').val();
    tmp+='&pageRoTitle=';
    tmp+=$('#pageRoTitle').val();
    tmp+='&pageFrTitle=';
    tmp+=$('#pageFrTitle').val();
    tmp+='&pageSpTitle=';
    tmp+=$('#pageSpTitle').val();
    tmp+='&pageDeTitle=';
    tmp+=$('#pageDeTitle').val();
    tmp+='&preziUrl=';
    tmp+=$('#preziUrl').val();
    tmp+='&presentationImageUrl=';
    tmp+=$('#presentationImageUrl').val();
    tmp+='&logoUrl=';
    tmp+=$('#logoUrl').val();
    tmp+='&descriptionEnTitle=';
    tmp+=$('#descriptionEnTitle').val();
    tmp+='&descriptionRoTitle=';
    tmp+=$('#descriptionRoTitle').val();
    tmp+='&descriptionFrTitle=';
    tmp+=$('#descriptionFrTitle').val();
    tmp+='&descriptionSpTitle=';
    tmp+=$('#descriptionSpTitle').val();
    tmp+='&descriptionDeTitle=';
    tmp+=$('#descriptionDeTitle').val();

    $.getJSON(tmp, function (data) {
        if(data['code']=='authentication error'){
            authenticate();
            return;
        }
        //it was the creation of a new application
        if(USERKEY==null){
            $('#appid').val(data['appid']);
            msg = dictionary[LANGUAGE]['newappCongrats']+' '+getLangPath() + 'index.html?appid='+data['appid'];
            $('#messageText').text(msg);

            $("#setupdialog").dialog('close');
            $('#messageDialog').dialog("open");
        }else{
            msg = dictionary[LANGUAGE]['setupsaved'];
            $('#messageText').text(msg);

            //it was saving setup
            $("#setupdialog").dialog('close');
            $('#messageDialog').dialog("open");

        }

    });

}

function loadNewApp(){
    window.location.href = getLangPath() + 'index.html?appid='+$('#appid').val()+"&ab="+$('#abpath').val();
}

function getLangPath(){
    lang = $('#languagecode').val();
    if(lang =='en')
        return SERVER;
    else
        return DOMAIN + lang + '/vote/';
}

function loadSetup(){
    $.getJSON(SERVER+'getSetups?userkey='+USERKEY+'&appid='+APPID, function (data) {
        ablist=$('#abselect');
        ablist.find('option').remove();
        setups=data['setups'];
        for(i=0;i<setups.length;i++){
            tmp='<option value="';
            tmp+=setups[i].abpath;
            tmp+='">';
            tmp+=setups[i].abpath;
            tmp+="</option>"
            ablist.append(tmp);
        }
        ablist.val("");
        showSetup();

    });
}

function showSetup(){
    var option = $('#abselect').val();
    for(i=0;i<setups.length;i++){
        if(setups[i].abpath==option){
            $('#pageEnTitle').val(setups[i]['pageEnTitle']);
            $('#pageRoTitle').val(setups[i]['pageRoTitle']);
            $('#pageFrTitle').val(setups[i]['pageFrTitle']);
            $('#pageSpTitle').val(setups[i]['pageSpTitle']);
            $('#pageDeTitle').val(setups[i]['pageDeTitle']);
            $('#preziUrl').val(setups[i]['preziUrl']);
            $('#presentationImageUrl').val(setups[i]['presentationImageUrl']);
            $('#logoUrl').val(setups[i]['logoUrl']);
            $('#descriptionEnTitle').val(setups[i]['descriptionEnTitle']);
            $('#descriptionRoTitle').val(setups[i]['descriptionRoTitle']);
            $('#descriptionFrTitle').val(setups[i]['descriptionFrTitle']);
            $('#descriptionSpTitle').val(setups[i]['descriptionSpTitle']);
            $('#descriptionDeTitle').val(setups[i]['descriptionDeTitle']);
        }
    }
}

function addAbPath(){
    duplicate=false;
    path=$('#abpathSetup').val();
    for(i=0;i<setups.length;i++){
        if(path==setups[i].abpath){
            duplicate=true;
            break;
        }

    }
    if(duplicate==true){
        alert(dictionary[LANGUAGE]['duplicateABPATH']);
        return;
    }
    $('#abpath').val(path);
    setupApplication();
}

function showResults(){
    if(USERKEY==null){
        noUser();
        return;
    }

    tbody=$('#resultsTbody');
    tbody.empty();
    call=SERVER +'getResults?appid='+APPID+'&userkey='+USERKEY;
    $.getJSON(call, function (data) {
        $('#groupsizeResult').text(data['groupsize']);
        $('#coverpercentage').text(data['coverpercentage']);
        votes=data['votes'];
        for(i=0;i<votes.length;i++){
            tmp="<tr><td>";
            tmp+=data['votes'][i]['title'];
            tmp+="</td>";
            tmp+="<td>";
            tmp+=getVoteLabel(0,data['votes'][i]['vot']);
            tmp+="</td>";
            for(j=0;j<6;j++)
                tmp+="<td>";
                tmp+=data['votes'][i][j];
                tmp+="</td>";
            tmp+='</tr>';
            tbody.append(tmp);
        }

        if(useDummyUser==true){
            resultsnoUserEl.show();
        }else{
            resultsnoUserEl.hide();
        }
 //       $('#resultsTable').DataTable();
        $('#resultsDialog').dialog('open');
    });
}

function noUser(){
    if(dummyUser==null){
        pdiscoverIdEl.show();
        pforgetIdEl.hide();
    }else{
        pdiscoverIdEl.hide();
        pforgetIdEl.show();
    }
    $("#dummyuseddialog").dialog("open");
}

function initElements(){
    proargumentdialogEl=$("#proargumentdialog");
categorydialogEl=$("#categorydialog");

propositionimgEl=$('#propositionimg');
loginErrorMessageEl=$('#loginErrorMessage');
photoUrlEl=$('#photoUrl');
solutiondialogEl=$('#solutiondialog');
propositiondialogEl=$('#propositiondialog');
addFirstCategoryEl=$('#addFirstCategory');
solutionTitleEl=$('#solutionTitle');
solutionDescriptionEl=$('#solutionDescription');
solutionImgEl=$('#solutionImg');
userdialogEl=$('#userdialog');
productofferdialogEl=$('#productofferdialog');
leftheaderEl=$('#leftheader');
rightheaderEl=$('#rightheader');
rightcontrargumentEl=$('#rightcontrargument');
leftcontrargumentEl=$('#leftcontrargument');
leftargumentEl=$('#leftargument');
proargtextEl=$('#proargtext');
leftargumentEl=$('#leftargument');
rootidEl=$('#rootid');
categorynameEl=$('#categoryname');
selectEl=$('#select');
loadingEl=$('#loading');
ErrorMessageEl=$('#ErrorMessage');
rootEl=$("#root");
loginEl=$('#login');
logoutEl=$('#logout');
storecookiesEl=$('#storecookies');
skipintroEl=$('#skipintro');
setupIconEl=$('#setupIcon');
logindialogEl=$('#logindialog');
groupsizeEl=$('#groupsize');
usernameEl=$('#username');
registeremailloginEl=$('#registeremaillogin');
registerpasswordEl=$('#registerpassword');
nameEl=$('#name');
photoRegUrlEl=$('#photoRegUrl');
dummyUserEl=$('#dummyUser');
registerErrorMessageEl=$('#registerErrorMessage');
registerSuccesMessageEl=$('#registerSuccesMessage');
registerdialogEl=$('#registerdialog');
recoverPasswordErrorMessageEl=$('#recoverPasswordErrorMessage');
recoverPasswordSuccessEl=$('#recoverPasswordSuccess');
descriptiontextEl=$('#descriptiontext');
propTitleEl=$('#propTitle');
photoUrlEl=$('#photoUrl');
propIdEl=$('#propId');
bannerEl=$('#banner');
headerEl=$('#header');
navPanelEl=$('#navPanel');
menuEl=$('#menu');
fbframeEl=$('#fbframe');
navEl=$('#nav');
spanishEl=$('#spanish');
mylikefbEl=$('#mylikefb');
iframe_containerEl=$('#iframe_container');
banner2El=$('#banner2');
bannertextEl=$('#bannertext');
messageboxEl=$('#messagebox');
createAppIconEl=$('#createAppIcon');
proargumentdialogEl=$("#proargumentdialog");
categorydialogEl=$("#categorydialog");


}
