from django.db.models import Q
import collections
from django.utils.translation import ugettext as _
from django.http import HttpResponse
from django.utils import timezone
from django.db import connection
from django.core.files import File
from django.conf import settings
import json
import logging
import random
import string
import requests
import operator
import time
from operator import attrgetter
import urllib.parse
import urllib.request
from vote.models import VoteUser
from vote.models import VoteCategory
from vote.models import VoteProposition
from vote.models import Vote
from vote.models import VoteArgument
from vote.models import VoteArgumentVote
from vote.models import VoteApplication
from vote.models import VoteActionLog
from vote.models import VoteApplicationABSetup
from html.parser import HTMLParser

from datetime import datetime
from django.shortcuts import render
import numpy
from sklearn.cluster import MiniBatchKMeans

logger= logging.getLogger('vote.voteviews')
imagesJson={}
imagesJson['srcs']=[]
MAX_PROPOSITIONS_RESULTS = 6

class MyParse(HTMLParser):

    def handle_starttag(self, tag, attrs):
        if tag=="img":
            imagesJson['srcs'].append({'src':dict(attrs)["src"]})

def test(request):
    return render(request, 'test.htm', {'right_now':datetime.utcnow()})


def index(request):
    resp={}
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]
    cat = VoteCategory.objects.filter(catType=-1,application=app,languageCode=request.LANGUAGE_CODE)
    if(cat.count()==0):
        resp['code']='cannot find the root category for the specified application and language'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    rootid= cat[0].id
    if request.LANGUAGE_CODE != 'en':
        uppath='../'
    else:
        uppath=''
    ab = request.GET.get('ab')
    if(ab is None or len(ab) ==0):
        ab = ''
    ind=ab.find('yyy')
    tmp=ab
    if(ind!=-1):
        tmp=ab[:ind]
    setup=VoteApplicationABSetup.objects.filter(application=app,abPath=tmp)[0]
    res={'right_now':datetime.utcnow(),'lang':request.LANGUAGE_CODE}
    res['ROOTID']=rootid
    res['uppath']=uppath
    res['ABPATH']=ab
    res['APPID']=app.id
    res['SERVER_DOMAIN']=settings.ALLOWED_HOSTS[0]

    if(request.LANGUAGE_CODE == 'en'):
        res['TITLE']=setup.pageEnTitle
        res['DESCRIPTION']=setup.descriptionEnTitle
    elif(request.LANGUAGE_CODE == 'fr'):
        res['TITLE']=setup.pageFrTitle
        res['DESCRIPTION']=setup.descriptionFrTitle
    elif(request.LANGUAGE_CODE == 'de'):
        res['TITLE']=setup.pageDeTitle
        res['DESCRIPTION']=setup.descriptionDeTitle
    elif(request.LANGUAGE_CODE == 'ro'):
        res['TITLE']=setup.pageRoTitle
        res['DESCRIPTION']=setup.descriptionRoTitle
    elif(request.LANGUAGE_CODE == 'sp'):
        res['TITLE']=setup.pageSpTitle
        res['DESCRIPTION']=setup.descriptionSpTitle
    res['PREZIURL']=setup.preziUrl
    res['presentationImageUrl']=setup.presentationImageUrl
    res['logoUrl']=setup.logoUrl

    return render(request, 'index.html', res)

def politics(request):
    rootid = {'en':1,'fr':2,'cn':3,'pt':4,'sp':5,'ro':78,'de':7,'it':8}
    rr=rootid[request.LANGUAGE_CODE]
    if request.LANGUAGE_CODE != 'en':
        uppath='../'
    else:
        uppath=''
    return render(request, 'politics.html', {'right_now':datetime.utcnow(),'lang':request.LANGUAGE_CODE,'ROOTID':rr,'uppath':uppath})

def imagesearch(request):
    return render(request, 'imagesearch.html')

def javascriptinsert(request):
    link = request.GET.get('pagurl')
    with urllib.request.urlopen(link) as f:
        #f=urllib.request.urlopen(link)
        webpage = f.read()
    with open('tmp_webpage.html', 'w') as f2:
        myfile = File(f2)
        myfile.write(str(webpage))
    myfile.closed
    h=MyParse()
    h.server=link
    h.feed(str(webpage))
    f2.closed
    #11myfile=requests.get(link)
    #a= str(myfile){'pag':a}
    imagesJson['server']=link
    res=json.dumps(imagesJson)

    del imagesJson['srcs']
    imagesJson['srcs']=[]


#    return render(request, 'javascriptinsert.html',{'images':res,'server':link} )
    return HttpResponse(res, content_type='application/json')


def resetpassword(request):
    return render(request, 'resetpassword.html', {'right_now':datetime.utcnow(),'SERVER_DOMAIN':settings.ALLOWED_HOSTS[0]})

def getCategory(request):
    resp={}
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]
    user=getUser(request)
    category= VoteCategory.objects.filter(id=request.GET.get('categoryid'),application=app)

    if(category.count()==0):
        resp['code']='category not found'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    category=category[0]
    rows=[]

    offset = int(request.GET.get('offset'))
    for prop in category.voteproposition_set.all()[offset:offset+MAX_PROPOSITIONS_RESULTS]:
        if(prop.parent is not None):
            continue
        ##test if status of proposition is draft and the user is unlogged or different than the creator, don't display the proposition
        if(prop.status==0):
            if(user is None):
                continue
            else:
                if(user!=prop.creator):
                    continue
        if(user is not None):
            vot = Vote.objects.filter(user=user,proposition=prop)
            if(vot.count()==0):
                vot = 0
            else:
                vot = vot[0].voteType
        else:
            vot = 0

        rows.append({'id':prop.id,'status':prop.status,'title':prop.title,'description':prop.description,'photo':'none','importance':prop.importance,'strongAgreeNb':prop.strongAgreeNb,'strongDisagreeNb':prop.strongDisagreeNb,'disagreeNb':prop.disagreeNb,'agreeNb':prop.agreeNb,'vote':vot,'creatorName':prop.creator.name,'creatorPhoto':prop.creator.photo,'photo':prop.photo})
    resp['propositions']=rows


    rows=[]
    for cat in sorted(category.votecategory_set.all(),key = operator.attrgetter('importance'), reverse=True):
        rows.append({'name':cat.name,'color':cat.color,'id':cat.id,'catType':cat.catType})
    resp['categories']=rows


    logAction("getCategory "+category.name,request,user)
    return HttpResponse(json.dumps(resp), content_type='application/json')

def getNextProposition(proposition,user):
    #if the user is not logged in, display only published propositions
    if(user is None):
        propositions = VoteProposition.objects.filter(status=1)
    else:
        propositions = VoteProposition.objects.exclude(~Q(creator=user),status=1)
    selProp=None
    found=False
    for prop in propositions:
        if(found==True):
            selProp=prop
            break
        if(prop.id==proposition.id):
            found=True
            continue
    if(selProp is None):
        getPropositionOfNextCategory(prop.voteCategory)
    return selProp

def getPropositionOfNextCategory(cat):
    return None

def getProposition(request):
    resp={}
    user=getUser(request)
    propositionId=request.GET.get('propositionid')
    operation=request.GET.get('operation')

    #if propositionId negative, then give the first proposition ( which should be the most important)
    if(-1==int(propositionId)):
        if(user is None):
            propositions = VoteProposition.objects.filter(status=1)[0:1]
        else:
            propositions = VoteProposition.objects.exclude(~Q(creator=user),status=1)[0:1]

        proposition = propositions[0]
    elif('nextprop'==operation):
        resp['operation']=operation
        proposition = getNextProposition(VoteProposition.objects.filter(id=propositionId)[0],user)
    elif('nextsubcat'==operation):
        proposition = VoteProposition.objects.filter(id=propositionId)
        getPropositionOfNextCategory(proposition.voteCategory,user)
    elif('nextcat'==operation):
        proposition = VoteProposition.objects.filter(id=propositionId)
        getPropositionOfNextCategory(proposition.voteCategory)
    else:
        proposition = VoteProposition.objects.filter(id=propositionId)

        if(proposition.count()==0):
            resp['code']='proposition not found'
            return HttpResponse(json.dumps(resp), content_type='application/json')
        proposition=proposition[0]
    prorows=[]
    againstrows=[]
    for arg in proposition.voteargument_set.all():
        if(user is not None):
            vote = VoteArgumentVote.objects.filter(user=user,argument=arg)
            if(vote.count()==0):
                vote = 0
            else:
                vote = vote[0].voteType
        else:
            vote = 0
        if(arg.argumentType==1):
            prorows.append({'id':arg.id,'description':arg.description,'vote':vote})
        else:
            againstrows.append({'id':arg.id,'description':arg.description,'vote':vote})
    resp['proarguments']=prorows
    resp['againstarguments']=againstrows
    resp['creatorName']=proposition.creator.name
    resp['creatorPhoto']=proposition.creator.photo
    resp['photo']=proposition.photo
    resp['title']=proposition.title
    resp['description']=proposition.description
    resp['id']=proposition.id
    resp['status']=proposition.status
    resp['categoryId']=proposition.voteCategory.id
    if(user is not None):
        vot = Vote.objects.filter(user=user,proposition=proposition)
        if(vot.count()==0):
            vot = 0
        else:
            vot = vot[0].voteType
    else:
        vot = 0
    resp['vote']=vot
    rows=[]
    for prop in proposition.voteproposition_set.all():
        if(user is not None):
            vot = Vote.objects.filter(user=user,proposition=prop)
            if(vot.count()==0):
                vot = 0
            else:
                vot = vot[0].voteType
        else:
            vot = 0
        resp['vote']=vot

        rows.append({'id':prop.id,'title':prop.title,'description':prop.description,'photo':'none','importance':prop.importance,'strongAgreeNb':prop.strongAgreeNb,'strongDisagreeNb':prop.strongDisagreeNb,'disagreeNb':prop.disagreeNb,'agreeNb':prop.agreeNb,'vote':vot,'creatorName':prop.creator.name,'creatorPhoto':prop.creator.photo,'photo':prop.photo})
    resp['alternatives']=rows


    return HttpResponse(json.dumps(resp), content_type='application/json')

def addCategory(request):
    resp={}
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]
    user= VoteUser.objects.filter(userkey=request.GET.get('userkey'))[0]
    if(user is None):
        resp['code']='authentication error'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    cat = VoteCategory()
    cat.color=request.GET.get('color')
    cat.name=request.GET.get('name')
    cat.parent = VoteCategory.objects.filter(id=request.GET.get('parentid'))[0]
    cat.catType=request.GET.get('catType')# cat.parent.catType
    cat.languageCode=request.GET.get('lang')
    cat.creation=datetime.now()
    cat.creator=user
    cat.application=app

    cat.save()
    resp['id']=cat.id
    return HttpResponse(json.dumps(resp), content_type='application/json')


def addProposition(request):
    resp={}
    user=VoteUser.objects.filter(userkey=request.GET.get('userkey'))[0]
    if(user is None):
        resp['code']='authentication error'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    propId=request.GET.get('propId')
    if(propId is None or propId == 'undefined' or propId==''):
        prop = VoteProposition()
        prop.parent = None
        prop.creator = user
        prop.voteCategory = VoteCategory.objects.filter(id=request.GET.get('categoryid'))[0]
    else:
        propId=int(propId)
        prop = VoteProposition.objects.filter(id=propId)
        if(prop.count()==0):
            resp['code']='no proposition with id '+propId
            return HttpResponse(json.dumps(resp), content_type='application/json')
        else:
            prop = prop[0]
    prop.title=request.GET.get('title')
    prop.description=request.GET.get('description')
    prop.photo=request.GET.get('photoUrl')
    prop.status=request.GET.get('status')
    prop.importance=0
    prop.strongAgreeNb=1
    prop.strongDisagreeNb=0
    prop.agreeNb=0
    prop.disagreeNb=0

    prop.save()
    resp['id']=prop.id
    return HttpResponse(json.dumps(resp), content_type='application/json')

def addAlternative(request):
    resp={}
    user=VoteUser.objects.filter(userkey=request.GET.get('userkey'))[0]
    if(user is None):
        resp['code']=_('authentication error')
        return HttpResponse(json.dumps(resp), content_type='application/json')
    prop = VoteProposition()
    prop.parent = VoteProposition.objects.filter(id=request.GET.get('propositionid'))[0]
    prop.voteCategory = prop.parent.voteCategory
    prop.creator = user
    prop.title=request.GET.get('title')
    prop.description=request.GET.get('description')
    prop.photo=request.GET.get('photoUrl')
    prop.importance=0
    prop.strongAgreeNb=1
    prop.strongDisagreeNb=0
    prop.agreeNb=0
    prop.disagreeNb=0
    prop.save()
    resp['id']=prop.id
    return HttpResponse(json.dumps(resp), content_type='application/json')

def addArgument(request):
    resp={}
    user=VoteUser.objects.filter(userkey=request.GET.get('userkey'))[0]
    if(user is None):
        resp['code']='authentication error'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    arg = VoteArgument()
    arg.proposition = VoteProposition.objects.filter(id=request.GET.get('propositionid'))[0]
    arg.creator = user
#0-pro, 1-against
    arg.argumentType=int(request.GET.get('type'))
    arg.description=request.GET.get('description')
    arg.save()
    resp['id']=arg.id
    return HttpResponse(json.dumps(resp), content_type='application/json')


def voteProposition(request):
    resp={}
    user=VoteUser.objects.filter(userkey=request.GET.get('userkey'))[0]
    if(user is None):
        resp['code']='authentication error'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    proposition = VoteProposition.objects.filter(id=request.GET.get('propositionid'))[0]
    votes = Vote.objects.filter(user=user,proposition=proposition)
    if(votes.count()==0):
        v = Vote()
    else:
        v=votes[0]
        if(v.voteType==1):
            proposition.strongDisagreeNb-=1
        if(v.voteType==2):
            proposition.disagreeNb-=1
        if(v.voteType==3):
            proposition.agreeNb-=1
        if(v.voteType==4):
            proposition.strongAgreeNb-=1

    v.proposition = proposition
    v.user = user
#1-pro, 2-against
    v.voteType=int(request.GET.get('type'))
    if(v.voteType==1):
        proposition.strongDisagreeNb+=1
    if(v.voteType==2):
        proposition.disagreeNb+=1
    if(v.voteType==3):
        proposition.agreeNb+=1
    if(v.voteType==4):
        proposition.strongAgreeNb+=1
    proposition.save()
    v.save()
    resp['id']=v.id
    resp['strongDisagreeNb']=proposition.strongDisagreeNb
    resp['disagreeNb']=proposition.disagreeNb
    resp['agreeNb']=proposition.agreeNb
    resp['strongAgreeNb']=proposition.strongAgreeNb
    return HttpResponse(json.dumps(resp), content_type='application/json')


def voteArgument(request):
    resp={}
    user=VoteUser.objects.filter(userkey=request.GET.get('userkey'))[0]
    if(user is None):
        resp['code']='authentication error'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    arg=VoteArgument.objects.filter(id=request.GET.get('argumentid'))[0]
    votes = VoteArgumentVote.objects.filter(user=user,argument=arg)
    if(votes.count()==0):
        v = VoteArgumentVote()
    else:
        v = votes[0]
    v.argument = arg
    v.user = user
#1-strongdisagree, 2-disagree,3-agree,4-strong agree

    v.voteType=int(request.GET.get('type'))
    v.save()
    resp['id']=v.id
    return HttpResponse(json.dumps(resp), content_type='application/json')

def login(request):
    resp={}
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]
    users=VoteUser.objects.filter(application=app,email=request.GET.get('username'),password=request.GET.get('password'))

    if(users.count()==0):
        resp['code']='authentication error'
    else:
        resp['userkey']=users[0].userkey
        resp['rights']=users[0].rights
    changeDummyUser(request,users[0])
    return HttpResponse(json.dumps(resp), content_type='application/json')

def register(request):
    resp={}
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    app=app[0]
    users=VoteUser.objects.filter(email=request.GET.get('username'),application=app)
    if(users.count()>0):
        resp['code']='email address '+request.GET.get('username')+' is already in use'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    user = VoteUser()
    user.name=request.GET.get('name')
    user.password=request.GET.get('password')
    user.email=request.GET.get('username')
    user.photo=request.GET.get('photoUrl')
    user.application=app
    user.userkey=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
    user.save()

####create in users space propositions .... not a good idea
#    prop = VoteProposition()
#    prop.parent = None
#    prop.voteCategory = VoteCategory.objects.filter(catType=2)[0] #get category of Users
#    prop.creator = user
#    prop.title=request.GET.get('name')
#    prop.description=""
#    prop.photo=request.GET.get('photoUrl')
#    prop.importance=0
#    prop.strongAgreeNb=1
#    prop.strongDisagreeNb=0
#    prop.agreeNb=0
#    prop.disagreeNb=0
#    prop.save()


    resp['userkey']=user.userkey

    changeDummyUser(request,user)
    return HttpResponse(json.dumps(resp), content_type='application/json')

def changeDummyUser(request,user):
    users=VoteUser.objects.filter(userkey=request.GET.get('dummyUser'))
    if(users.count()==0):
        return
    dummyUser=users[0]

    for obj in VoteCategory.objects.filter(creator=dummyUser):
        obj.creator=user
        obj.save()

    for obj in VoteProposition.objects.filter(creator=dummyUser):
        obj.creator=user
        obj.save()
    for obj in VoteArgument.objects.filter(creator=dummyUser):
        obj.creator=user
        obj.save()
    for obj in Vote.objects.filter(user=dummyUser):
        obj.user=user
        obj.save()
    for obj in VoteArgumentVote.objects.filter(user=dummyUser):
        obj.user=user
        obj.save()
    for obj in ActionLog.objects.filter(user=dummyUser):
        obj.creator=user
        obj.save()


def sendEmail(request):
    requests.post(
        "https://api.mailgun.net/v3/communitydesigner.net/messages",
        auth=("api", "key-577c64c8c50363cd9365760b83592455"),

        data={"from": request.GET.get('from'),
              "to": "dan.gheorghiu@gmail.com",#####admin@communitydesigner.net
              "subject": "Community Designer:"+request.GET.get('subject'),
              "text": request.GET.get('message')})
    return HttpResponse("OK", content_type='application/json')

def recoverpassword(request):
    resp={}
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    app=app[0]
    users=VoteUser.objects.filter(email=request.GET.get('email'),application=app)

    if(users.count()>0):
        requests.post(
       # "https://api.mailgun.net/v3/sandbox76d14e2a2abd47f283ada8c91dc9ab83.mailgun.org/messages",
       # "https://api.mailgun.net/v3/trioicare.com/messages",
        "https://api.mailgun.net/v3/communitydesigner.net/messages",
        #auth=("api", "key-577c64c8c50363cd9365760b83592455"),
        auth=("api", "key-577c64c8c50363cd9365760b83592455"),

        data={"from": "admin@communitydesigner.net",#trioicare.com",
              "to": users[0].email,
              "subject": "Change password for "+app.name,
              "text": "Hello "+users[0].name+", Click on the following link to change your password:"+app.url+"/resetpassword?appid="+str(app.id)+'&'+urllib.parse.urlencode({'appname':app.name})+"&userkey="+users[0].userkey})
    else:
        resp['code']='Cannot find any user having the email:'+request.GET.get('email')
    return HttpResponse(json.dumps(resp), content_type='application/json')

def changepassword(request):
    resp={}
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]
    user=getUser(request)
    if(user is not None):
        user.password=request.GET.get('password')
        user.save()
        resp['code']='success'
    else:
        resp['code']='user cannot be found'
    return HttpResponse(json.dumps(resp), content_type='application/json')

def expandTree(request):
    resp={}
    rootId=request.GET.get('rootId')
    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]
    try:
        prop = VoteProposition.objects.get(pk=request.GET.get('propositionid'))
    except VoteProposition.DoesNotExist:
        resp['code']='proposition cannot be found'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    if( prop is None):
        resp['code']='proposition cannot be found'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    rows=[]
    cat=prop.voteCategory
    while cat.id != int(rootId):
        rows.append(cat.id)
        cat=cat.parent
    resp['tree']=rows
    return HttpResponse(json.dumps(resp), content_type='application/json')

def getCluster(request):
    user=getUser(request)
    resp={}

    if(user is None):
        resp['code']='authentication error'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    counter=0
    user_ids={}
    proposition_ids={}
    ROW_OF_CURRENT_USER=0
    #connection = MySQLdb.connect(database='test')
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT distinct user_id FROM vote_vote')
        results = cursor.fetchall()
        for i in results:
            user_ids[i[0]]=counter
            if(user.id==i[0]):
                ROW_OF_CURRENT_USER=counter
            counter=counter+1
        cursor.close()

        counter=0
        cursor = connection.cursor()
        cursor.execute('SELECT distinct proposition_id FROM vote_vote')
        results = cursor.fetchall()
        for i in results:
            proposition_ids[i[0]]=counter
            counter=counter+1
        cursor.close()

        VOTES = numpy.zeros((len(user_ids),len(proposition_ids)))

        cursor = connection.cursor()
        cursor.execute('SELECT * FROM vote_vote')
        results = cursor.fetchall()
        for i in results:
            pid=i[1]
            uid=i[2]
            v=i[3]
            counter=counter+1
            #
            VOTES[int(user_ids[uid])][int(proposition_ids[pid])]=v

            mbk = MiniBatchKMeans(init='k-means++', n_clusters=2,
                      n_init=10, max_no_improvement=10, verbose=0)
            CLUSTERS=mbk.fit_predict(VOTES)
            clusterSize=collections.Counter(CLUSTERS)[CLUSTERS[ROW_OF_CURRENT_USER]]


            resp['clustersize']=str(clusterSize)
        cursor.close()


    except TypeError as e:
        resp['exception']=e
#    finally:
#        connection.close()
    return HttpResponse(json.dumps(resp), content_type='application/json')


def logAction(label,request,user):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    #ip = request.environ['REMOTE_ADDR']
    isTest=request.GET.get('test')
    if(ip=='82.235.22.143' and isTest is None):
        return
    log = ActionLog()
    log.action=label
    if(user!=None):
        log.user=user
    log.ip=ip
    log.date=datetime.now()
    log.userAgent=request.META.get('HTTP_USER_AGENT')[:30]
    tmp=request.GET.get('abPath')
    if(tmp is not None):
        log.abPath=tmp
    tmp=request.GET.get('widthScreen')
    if(tmp is not None):
        log.widthScreen=int(tmp)
    tmp=request.GET.get('heightScreen')
    if(tmp is not None):
        log.heightScreen=int(tmp)
    log.save()

def logUserAction(request):
    logAction(request.GET.get('label'),request,None)
    return HttpResponse('OK', content_type='application/json')


def getUser(request):

    users= VoteUser.objects.filter(userkey=request.GET.get('userkey'))
    if(users.count()>0):
        return users[0]
    else:
        return None

def getSetups(request):
    resp={}

    user = getUser(request)
    if(user is None):
        resp['code']='your user is not recognized'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    if(user.rights.find('A')==-1):
        resp['code']='you have no admin right'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]

    rows=[]
    for abSetup in VoteApplicationABSetup.objects.filter(application=app):
        rows.append({'abpath':abSetup.abPath    ,'pageEnTitle':abSetup.pageEnTitle    ,'pageRoTitle':abSetup.pageRoTitle,'pageFrTitle':abSetup.pageFrTitle    ,'pageSpTitle':abSetup.pageSpTitle    ,'pageDeTitle':abSetup.pageDeTitle    ,'preziUrl':abSetup.preziUrl    ,'presentationImageUrl':abSetup.presentationImageUrl    ,'logoUrl':abSetup.logoUrl    ,'descriptionEnTitle':abSetup.descriptionEnTitle    ,'descriptionRoTitle':abSetup.descriptionRoTitle    ,'descriptionFrTitle':abSetup.descriptionFrTitle    ,'descriptionSpTitle':abSetup.descriptionSpTitle    ,'descriptionDeTitle':abSetup.descriptionDeTitle})

    resp['setups']=rows

    return HttpResponse(json.dumps(resp), content_type='application/json')


def getSetup(request):
    resp={}

    user = getUser(request)
    if(user is None):
        resp['code']='your user is not recognized'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]

    path=request.GET.get('abPath')
    if(path is None):
        resp['code']='cannot find setup for a/b path:'+path
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        abSetup = VoteApplicationABSetup.objects.filter(abPath=path,application=app)
        if(abSetup.count()>0):
            abSetup = abSetup[0]
        else:
            resp['code']='cannot find setup for a/b path:'+path
            return HttpResponse(json.dumps(resp), content_type='application/json')

    resp['abpath']=abSetup.abpath
    resp['pageEnTitle']=abSetup.pageEnTitle
    resp['pageRoTitle']=abSetup.pageRoTitle
    resp['pageFrTitle']=abSetup.pageFrTitle
    resp['pageSpTitle']=abSetup.pageSpTitle
    resp['pageDeTitle']=abSetup.pageDeTitle

    resp['preziUrl']=abSetup.preziUrl
    resp['presentationImageUrl']=abSetup.presentationImageUrl
    resp['logoUrl']=abSetup.logoUrl
    resp['descriptionEnTitle']=abSetup.descriptionEnTitle
    resp['descriptionRoTitle']=abSetup.descriptionRoTitle
    resp['descriptionFrTitle']=abSetup.descriptionFrTitle
    resp['descriptionSpTitle']=abSetup.descriptionSpTitle
    resp['descriptionDeTitle']=abSetup.descriptionDeTitle

    return HttpResponse(json.dumps(resp), content_type='application/json')

def saveSetup(request):
    resp={}

    user = getUser(request)
    if(user is None):
        resp['code']='your user is not recognized'
        return HttpResponse(json.dumps(resp), content_type='application/json')

    path=request.GET.get('abPath')
    if(path is None or len(path) ==0):
        path = ''

    app = VoteApplication.objects.filter(id=request.GET.get('appid'))
    if(app.count()==0):
        resp['code']='application does not exist. check code'
        return HttpResponse(json.dumps(resp), content_type='application/json')
    else:
        app=app[0]

    abSetup = VoteApplicationABSetup.objects.filter(application=app,abPath=path)

    if(abSetup.count()>0):
        abSetup = abSetup[0]
    else:
        abSetup = VoteApplicationABSetup()
        abSetup.abPath = path

    fillSetup(abSetup,request)
    abSetup.application = app
    abSetup.save()

    return HttpResponse(json.dumps(resp), content_type='application/json')


def createApplication(request):
    resp={}

    app = VoteApplication()
    app.name = request.GET.get('pageEnTitle')
    app.save()
    user = VoteUser()
    user.name=request.GET.get('adminName')
    user.password=request.GET.get('passwordAdmin')
    user.email=request.GET.get('emailloginAdmin')
    user.rights='CPA'
    user.application=app
    user.userkey=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
    user.save()

    parent=VoteCategory.objects.all()[0:1][0]
    createRootCategory('en',app,parent,user)
    createRootCategory('fr',app,parent,user)
    createRootCategory('ro',app,parent,user)
    createRootCategory('sp',app,parent,user)
    createRootCategory('de',app,parent,user)


    abSetup = VoteApplicationABSetup()
    fillSetup(abSetup,request)
    abSetup.application = app
    abSetup.save()

    resp['userkey']=user.userkey
    resp['appid']=app.id
    return HttpResponse(json.dumps(resp), content_type='application/json')

def createRootCategory(lang, app, parent,user):
    cat = VoteCategory()
    cat.name=app.name
    cat.parent = parent
    cat.catType=-1# cat.parent.catType -
    cat.languageCode=lang
    cat.creation=datetime.now()
    cat.creator=user
    cat.application=app

    cat.save()
    cat.parent = cat
    cat.save()


def fillSetup(abSetup,request):
    abSetup.pageEnTitle=request.GET.get('pageEnTitle')
    abSetup.pageRoTitle=request.GET.get('pageRoTitle')
    abSetup.pageFrTitle=request.GET.get('pageFrTitle')
    abSetup.pageSpTitle=request.GET.get('pageSpTitle')
    abSetup.pageDeTitle=request.GET.get('pageDeTitle')
    abSetup.preziUrl=request.GET.get('preziUrl')
    abSetup.presentationImageUrl=request.GET.get('presentationImageUrl')
    abSetup.logoUrl=request.GET.get('logoUrl')
    abSetup.descriptionEnTitle=request.GET.get('descriptionEnTitle')
    abSetup.descriptionRoTitle=request.GET.get('descriptionRoTitle')
    abSetup.descriptionFrTitle=request.GET.get('descriptionFrTitle')
    abSetup.descriptionSpTitle=request.GET.get('descriptionSpTitle')
    abSetup.descriptionDeTitle=request.GET.get('descriptionDeTitle')

def getResults(request):
    resp={}

    user = getUser(request)
    if(user is None):
        resp['code']='your user is not recognized'
        return HttpResponse(json.dumps(resp), content_type='application/json')


    rows=[]

    for vot in Vote.objects.filter(user=user):
        r = [random.random() for i in range(1,7)]
        s = sum(r)
        r = [ i/s*100 for i in r ]
        row = {'title':vot.proposition.title    ,'vot':vot.voteType}
        for j in range(0,6):
            row[str(j)]=int(r[j])
        rows.append(row)

    resp['votes']=rows
    resp['groupsize']=int(random.random()*1000)
    resp['coverpercentage']=int(random.random()*100)

    return HttpResponse(json.dumps(resp), content_type='application/json')

