from django.db import models
import os

####################################Vote Platform#############################

class VoteApplication(models.Model):
    name=models.CharField(max_length=50)
    showUser=models.IntegerField(default=0)
    url=models.CharField(max_length=50)
    creation=models.DateTimeField(null=True, blank=True)



class VoteCategory(models.Model):
    application = models.ForeignKey(VoteApplication)
    creator = models.ForeignKey('VoteUser')
    name=models.CharField(max_length=100,default='*')
    parent = models.ForeignKey('self',null=True,blank=True)
    creation=models.DateTimeField(null=True, blank=True)
    color=models.CharField(max_length=100,default='open')
    #0 - normal, 1-economy, 2-people, -1 root
    catType=models.IntegerField(default=0)
    languageCode = models.CharField(max_length=4,default='en')
    #more, better
    importance = models.IntegerField(default=0)

class VoteProfil(models.Model):
    name=models.CharField(max_length=40,default='profilename')
    code=models.CharField(max_length=40,default='codeprofile')


class VoteCategoryProfil(models.Model):
    profil = models.ForeignKey(Profil)
    category = models.ForeignKey(VoteCategory)
    catPriority = models.IntegerField(default=0)


class VoteUser(models.Model):
##code is random generated key. when the user logs in, he gets his  key which will be used for any query to the database
    application = models.ForeignKey(VoteApplication)
    userkey=models.CharField(max_length=50,default='*')
    name = models.CharField(max_length=100)
    facebookID=models.CharField(max_length=30,default='*',null=True, blank=True)
    photo=models.CharField(max_length=300,null=True, blank=True)#ImageField(upload_to='profiles',default='media/community/nophoto.png')
    lastLogin=models.DateTimeField(null=True, blank=True)
    registerDate=models.DateTimeField(null=True, blank=True)
    email=models.CharField(max_length=30,default='*')
    password=models.CharField(max_length=30,default='*')
#C-add category,P-add proposition,A-add alternative,G-add argument
    rights=models.CharField(max_length=30,default='*')
    profil = models.ForeignKey(Profil,null=True)



class VoteProposition(models.Model):
    parent = models.ForeignKey('self',null=True,blank=True)
    voteCategory = models.ForeignKey(VoteCategory,db_column='category_id')
    creator = models.ForeignKey(VoteUser)
    title=models.CharField(max_length=100,default='*')
    description=models.CharField(max_length=3000,default='*')
    photo=models.CharField(max_length=300)#ImageField(upload_to='profiles',default='media/vote/nophoto.png')
    importance=models.IntegerField(default=0)
    strongAgreeNb=models.IntegerField(default=0)
    strongDisagreeNb=models.IntegerField(default=0)
    agreeNb=models.IntegerField(default=0)
    disagreeNb=models.IntegerField(default=0)
    languageCode = models.CharField(max_length=4,default='en')
    status=models.IntegerField(default=0) #0-draft,1-publish

class VoteArgument(models.Model):
    proposition = models.ForeignKey(VoteProposition)
    creator = models.ForeignKey(VoteUser)
#1-pro, 2-against
    argumentType=models.IntegerField(default=0)
    description=models.CharField(max_length=3000,default='*')
    languageCode = models.CharField(max_length=4,default='en')


class Vote(models.Model):
    proposition = models.ForeignKey(VoteProposition)
    user = models.ForeignKey(VoteUser)
#1-strongdisagree, 2-disagree,3-agree,4-strong agree
    voteType=models.IntegerField(default=0)

class VoteArgumentVote(models.Model):
    argument = models.ForeignKey(VoteArgument)
    user = models.ForeignKey(VoteUser)
#1-strongdisagree, 2-disagree,3-agree,4-strong agree
    voteType=models.IntegerField(default=0)

class VoteActionLog(models.Model):
    action=models.CharField(max_length=40,default='en')
    user=models.CharField(max_length=100,default='en')
    ip=models.CharField(max_length=200,default='en')
    date=models.DateTimeField(null=True, blank=True)
    userAgent=models.CharField(max_length=30,default='')
    abPath=models.CharField(max_length=30,blank=True)
    widthScreen=models.IntegerField(default=0)
    heightScreen=models.IntegerField(default=0)

class VoteApplicationABSetup(models.Model):
    application = models.ForeignKey(VoteApplication)
    abPath = models.CharField(max_length=200,default='')

    pageEnTitle = models.CharField(max_length=200,default='title')
    pageRoTitle = models.CharField(max_length=200,default='title')
    pageFrTitle = models.CharField(max_length=200,default='title')
    pageSpTitle = models.CharField(max_length=200,default='title')
    pageDeTitle = models.CharField(max_length=200,default='title')

    preziUrl = models.CharField(max_length=400,default='')
    presentationImageUrl = models.CharField(max_length=400,default='')
    logoUrl = models.CharField(max_length=400,default='')


    descriptionEnTitle = models.CharField(max_length=1000,default='title')
    descriptionRoTitle = models.CharField(max_length=1000,default='title')
    descriptionFrTitle = models.CharField(max_length=1000,default='title')
    descriptionSpTitle = models.CharField(max_length=1000,default='title')
    descriptionDeTitle = models.CharField(max_length=1000,default='title')




