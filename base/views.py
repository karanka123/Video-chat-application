from agora_token_builder import RtcTokenBuilder

import random

import time

from django.shortcuts import render

from django.http import JsonResponse

# Create your views here.
import hashlib

def getToken(request):
    appId = '3dc1e3a398e44027902658e361382995'
    appCertificate = '6d40a091cab44acfb5c76ffbd09ebe2c'
    channelName = request.GET.get('channelName')
    userId = request.user.id  # Assuming you have a unique user ID associated with each user
    uid = random.randint(1, 230)
    role = 1
    expiretime = 3600 * 24
    currenttime = time.time()
    privilegeExpiredTs = expiretime + currenttime
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)


def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')