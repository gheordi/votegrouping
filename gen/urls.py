from django.conf.urls import  include, url
from django.views.i18n import javascript_catalog

from django.contrib import admin
from django.conf.urls.i18n import i18n_patterns
from django.utils.translation import ugettext_lazy as _
admin.autodiscover()

js_info_dict = {
    'packages': ('vote',),
}

urlpatterns = [
    # Examples:
    # url(r'^$', 'gen.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^jsi18n/(?P<packages>\S+?)/$', javascript_catalog, name='javascript-catalog'),
#    url(r'^jsi18n/$', javascript_catalog, js_info_dict),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^savesettings','vote.views.savesettings'),
    url(r'^upload_photo','vote.views.upload_photo'),
    url(r'^savediner','vote.views.savediner'),
    url(r'^update','vote.views.update'),
    url(r'^test','vote.views.test'),


    ########## FOR vote application ###############
    url(r'^vote/getCategory','vote.voteviews.getCategory'),
    url(r'^vote/getProposition','vote.voteviews.getProposition'),
    url(r'^vote/addCategory','vote.voteviews.addCategory'),
    url(r'^vote/addProposition','vote.voteviews.addProposition'),
    url(r'^vote/voteProposition','vote.voteviews.voteProposition'),
    url(r'^vote/addAlternative','vote.voteviews.addAlternative'),
    url(r'^vote/addArgument','vote.voteviews.addArgument'),
    url(r'^vote/voteArgument','vote.voteviews.voteArgument'),
    url(r'^vote/politics', 'vote.voteviews.politics', name='politics'),
    url(r'^vote/resetpassword', 'vote.voteviews.resetpassword', name='resetpassword'),
    url(r'^vote/login', 'vote.voteviews.login'),
    url(r'^vote/register', 'vote.voteviews.register'),
    url(r'^vote/recoverpassword', 'vote.voteviews.recoverpassword'),
    url(r'^vote/changepassword', 'vote.voteviews.changepassword'),
    url(r'^vote/expandTree', 'vote.voteviews.expandTree'),
    url(r'^vote/sendEmail', 'vote.voteviews.sendEmail'),
    url(r'^vote/getCluster', 'vote.voteviews.getCluster'),
    url(r'^vote/imagesearch','vote.voteviews.imagesearch'),
    url(r'^vote/logUserAction','vote.voteviews.logUserAction'),
    url(r'^vote/createApplication','vote.voteviews.createApplication'),
    url(r'^vote/saveSetup','vote.voteviews.saveSetup'),
    url(r'^vote/getSetups','vote.voteviews.getSetups'),
    url(r'^vote/getSetup','vote.voteviews.getSetup'),
    url(r'^vote/getResults','vote.voteviews.getResults'),

    url(r'^vote/imagesearch','vote.voteviews.imagesearch'),
    url(r'^vote/logUserAction','vote.voteviews.logUserAction'),

    url(r'^fr/vote/imagesearch','vote.voteviews.imagesearch'),
    url(r'^sp/vote/imagesearch','vote.voteviews.imagesearch'),
    url(r'^ro/vote/imagesearch','vote.voteviews.imagesearch'),
    url(r'^de/vote/imagesearch','vote.voteviews.imagesearch'),

    url(r'^vote/javascriptinsert','vote.voteviews.javascriptinsert'),
    url(r'^fr/vote/javascriptinsert','vote.voteviews.javascriptinsert'),
    url(r'^sp/vote/javascriptinsert','vote.voteviews.javascriptinsert'),
    url(r'^ro/vote/javascriptinsert','vote.voteviews.javascriptinsert'),
    url(r'^de/vote/javascriptinsert','vote.voteviews.javascriptinsert'),


    url(r'^vote/test', 'vote.voteviews.test'),
    url(r'^fr/vote/index', 'vote.voteviews.index', name='index'),
    url(r'^sp/vote/index', 'vote.voteviews.index', name='index'),
    url(r'^ro/vote/index', 'vote.voteviews.index', name='index'),
    url(r'^en/vote/index', 'vote.voteviews.index', name='index'),
    url(r'^de/vote/index', 'vote.voteviews.index', name='index'),
    url(r'^vote/index', 'vote.voteviews.index', name='index'),

    url(r'^fr/vote/politics', 'vote.voteviews.politics', name='politics'),
    url(r'^sp/vote/politics', 'vote.voteviews.politics', name='politics'),
    url(r'^ro/vote/politics', 'vote.voteviews.politics', name='politics'),
    url(r'^en/vote/politics', 'vote.voteviews.politics', name='politics'),
    url(r'^de/vote/politics', 'vote.voteviews.politics', name='politics'),
    url(r'^vote/politics', 'vote.voteviews.politics', name='politics'),

]

urlpatterns += i18n_patterns(    url(_(r'^vote/index'), 'vote.voteviews.index', name='index'),
)


#urlpatterns +=  i18n_patterns('', (r'^jsi18n/$', 'django.views.i18n.javascript_catalog', js_info_dict), )