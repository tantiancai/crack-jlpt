var _Zdic_is_ie = true;
var _Zdic_layer;
var _ErrorNum;
var _intervalProcess;
var _isStated = false;
var _kd = new Array();
var _kdName = new Array();

function _ZdicInit()
{
    var agt = navigator.userAgent.toLowerCase();
    _Zdic_is_ie = (agt.indexOf("msie")!=-1 && document.all);
    var h = '';
    h += '<div id="_Address" style="background:#CCCCCC;">';
    h += '当前页面是：';
    if(GetDomain() == "net.cn")
    {
        h += '公网';
    }
    else
    {
        h += '教育网';
    }
    h += '</div>';
    h += '<div id="_CrackJLPT2010_12">';
    h += '<div>';
    h += ' <form id="_login" onsubmit="return false;">';
    h += '    证件号：<br />';
    h += '    <input id="_ksIDNO" type="text" size="20" /><br />';
    h += '    密码：<br />';
    h += '    <input id="_ksPwd" type="password" size="12" />';
    h += '    <input id="_btnLogin" onclick="_Login();" type="submit" value="登录" />';
    h += ' </form>';
    h += '</div>';
    h += '<div>';
    h += ' <form id="_book" onsubmit="return false;">';
    h += '    <img id="_chkImg1" border="1" alt="验证码" title="点击更换" style="cursor: pointer" onclick="_GetImage();"/><a target="_blank" id="_addrImg1">右击下载(net)</a><br />';
    h += '    <img id="_chkImg2" border="1" alt="验证码" title="点击更换" style="cursor: pointer" onclick="_GetImage();"/><a target="_blank" id="_addrImg2">右击下载(edu)</a><br />';
    h += '    验证码：<input id="_chkImgCode" type="text" size="4" maxlength="4"/><br />';
    h += '    级别：<select id="_level">';
    h += '        <option value="1">N1</option>';
    h += '        <option value="2">N2</option>';
    h += '        <option value="3">N3</option>';
    h += '        <option value="4">N4</option>';
    h += '        <option value="5">N5</option>';
    h += '    </select><br />';
    h += '    类别：<select id="_type">';
    h += '        <option value="1">报名</option>';
    h += '        <option value="2">换座</option>';
    h += '    </select><br />';
    h += '    考点1：';
    h += '    <input id="_bkkd1" type="text" size="2" />';
    h += '    <input id="_btnSend1" onclick="_BookCheck($(\'_bkkd1\'));" type="button" value="报名" /><br />';
    h += '    考点2：';
    h += '    <input id="_bkkd2" type="text" size="2" />';
    h += '    <input id="_btnSend2" onclick="_BookCheck($(\'_bkkd2\'));" type="button" value="报名" /><br />';
    h += '    考点3：';
    h += '    <input id="_bkkd3" type="text" size="2" />';
    h += '    <input id="_btnSend3" onclick="_BookCheck($(\'_bkkd3\'));" type="button" value="报名" /><br />';
    h += '    <input id="_btnAutoBook" onclick="_AutoBook();" type="submit" value="自动报名">';
    h += '    <input id="_btnStop" onclick="_StopAutoBook();" type="button" value="停止">';
    h += ' </form>';
    h += '</div>';
    h += '<div id="_autoBook" style="word-wrap:break-word; width:150px;">';
    h += '</div>';
    h += '<div id="_errorMsg" style="word-wrap:break-word; width:150px;">';
    h += ' 有错误发生时会自动刷新验证码。';
    h += '</div>';
    h += '<div><label class=link onclick="layer.setTickMsg(0,function(){gotoStep(\'login\')});">返回首页</label></div>';
    h += '</div>';
    try
    {
        var el = document.createElement('div');
        el.id='_Zdic_layer';
        el.style.position='absolute';
        el.style.left = document.documentElement.scrollLeft + 3 + 'px';
        el.style.top = document.documentElement.scrollTop + 3 + 'px';
        el.style.zIndex=9000;
        el.style.border = '1px solid #808080';
        el.style.backgroundColor='#F8F0E5';

        document.body.appendChild(el);
        _ZdicSet(el, h);
        window.onscroll = function()
        {
            $("_Zdic_layer").style.left = document.documentElement.scrollLeft + 3 + 'px';
            $("_Zdic_layer").style.top = document.documentElement.scrollTop + 3 + 'px';
        };
    }
    catch(x)
    {
        alert("Zdic can not support this page.\n" + x);
        _Zdic_layer = true;
        return;
      }

  _Zdic_layer = document.getElementById('_Zdic_layer');
}

function _ShowError(str)
{
    $("_errorMsg").innerHTML = str;
}

function _GetImage()
{
    $("_chkImgCode").focus();
    $("_chkImgCode").value = "";
    new Ajax.Request
    (
        getURL("chkImg.do"),
        {
            method:"post",
            parameters:"chkImgFlag=" + user.get("chkImgFlag"),
            requestHeaders:{RequestType:"ajax"},
            onSuccess:_ShowImage,
            onFailure:function(G){_ShowError("验证码获取失败，请点击图片重新获取")}
        }
    );
}

function _ShowImage(G)
{
    var H = G.responseJSON;
    if(H == null)
    {
        G.request.options.onFailure();
        return;
    }
    if(!H.retVal)
    {
        _ShowError(errorCode[H.errorNum]);
        return;
    }

    if(GetDomain() == "net.cn")
    {
        $("_chkImg1").src = H.chkImgFilename;
        $("_addrImg1").href = H.chkImgFilename;
        $("_chkImg2").src = H.chkImgFilename.replace("net.cn", "edu.cn");
        $("_addrImg2").href = H.chkImgFilename.replace("net.cn", "edu.cn");
    }
    else
    {
        $("_chkImg1").src = H.chkImgFilename.replace("edu.cn", "net.cn");
        $("_addrImg1").href = H.chkImgFilename.replace("edu.cn", "net.cn");
        $("_chkImg2").src = H.chkImgFilename;
        $("_addrImg2").href = H.chkImgFilename;
    }
    //user.set("chkImgSrc", H.chkImgFilename);
    //setChkimg('chooseaddrDiv');
}

function _Login()
{
    clearInterval(_intervalProcess);

    var b = $("_ksIDNO");
    b.value = b.value.toUpperCase();
    b.value = b.value.replace("(","（");
    b.value = b.value.replace(")","）");
    user.set("ksIdNo",$F(b));
    user.set("sFlag",escape(escape($F(b))));
    var params = "ksIDNO=" + b.value + "&ksPwd=" + $("_ksPwd").value;
    new Ajax.Request
    (
        getURL("login.do"),
        {
            method:"post",
            parameters:params,
            requestHeaders:{RequestType:"ajax"},
            onCreate:function(){_ShowError("正在登录...")},
            onSuccess:_LoginReturn,
            onFailure:function(){_ShowError(errorCode[100]);}
        }
    );
}

function _LoginReturn(D)
{
    var E = D.responseJSON;
    if(E == null)
    {
        D.request.options.onFailure();
        return;
    }
    if(E.retVal == 0)
    {
        _ShowError(errorCode[E.errorNum]);
        return;
    }

    updateUser(E);
    user.set("chkImgFlag",escape(escape(user.get("ksIdNo"))));
    _GetImage();
    _ShowError("登录成功");
    if(E.bkkd != 0)
    {
        _ShowError("<font color='darkred'>报名成功！</font><br />报名学校是：" + E.bkkdmc);
    }
    if(E.retVal == 3 || E.retVal == 2)
    {
        _ShowError("<a target='_blank' href='" + E.url + "'>链接</a>");
    }
}

function _GetSchoolId(level, doBook)
{
    var url = getURL("chooseAddr.do?bkjb=" + level + "&timeStamp=" + new Date().getTime());

    new Ajax.Request
    (
        url,
        {
            method:"get",
            requestHeaders:{RequestType:"ajax"},
            onCreate:function(){_ShowError("正在查询学校ID...")},
            onSuccess:function(E)
            {
                try
                {
                    var H = eval( "(" + E.responseText + ")" );
                    if(H == null)
                    {
                        E.request.options.onFailure();
                        return;
                    }
                    for(var i = 0; i < H.size(); i++)
                    {
                        for(var j = 0; j < _kdName.length; j++)
                        {
                            var name = _kdName[j].value.replace(/(^[\s　]*)|([\s　]*$)/g, "");
                            if(name == H[i].mc)
                            {
                                _kdName[j].value = H[i].id;
                                if(doBook)
                                {
                                    _Book(_kdName[j].value);
                                    return;
                                }
                            }
                        }
                    }
                    if( doBook )
                    {
                        if( i = H.size() )
                        {
                            _ShowError("<font color='darkred'>无法找到学校对应的ID，请确认是否有错误</font>");
                        }
                    }
                    else
                    {
                        _AutoBookAct();
                    }
                }
                catch(e)
                {
                    _ShowError(e.message);
                }
            },
            onFailure:function(){_ShowError(errorCode[100]);}
        }
    );
}

function _IsNum(str)
{
    return /^\d+$/.test(str);
}

function _BookCheck(obj)
{
    _kdName = new Array;
    if(obj)
    {
        if( !_IsNum(obj.value) )
        {
            _kdName.push(obj);
            _GetSchoolId($("_level").value, true);
        }
        else
        {
            _Book(obj.value);
        }
    }
    else
    {
        for(var i = 1; i <= 3; i++)
        {
            if( !_IsNum($("_bkkd" + i).value) )
            {
                _kdName.push($("_bkkd" + i));
            }
        }
        if(_kdName.length > 0)
        {
            _GetSchoolId($("_level").value, false);
        }
        else
        {
            _AutoBookAct();
        }
    }
}

function _Book(bkkd)
{
    clearInterval(_intervalProcess);

    if( !(/^\d*$/.test(bkkd)) )
    {
        _ShowError("<font color='red'>考点ID不正确</font>");
        return;
    }

    var params = "bkjb=" + $("_level").value;
    params += "&bkkd=" + bkkd;
    params += "&ksid=" + user.get("ksid");
    params += "&ksIdNo=" + user.get("ksIdNo");
    params += "&chkImgFlag=" + user.get("chkImgFlag");
    params += "&ksLoginFlag=" + user.get("ksLoginFlag");
    params += "&chkImgCode=" + $("_chkImgCode").value.toUpperCase();

    user.set("bkkd",bkkd);
    user.set("bkjb",$("_level").value);

    var url;

    if($("_type").value != "2")
    {
        url = getURL("book.do");
    }
    else
    {
        url = getURL("changebook.do");
    }

    _ErrorNum = 0;
    new Ajax.Request
    (
        url,
        {
            method:"post",
            requestHeaders:{RequestType:"ajax"},
            parameters:params,
            onCreate:function(){_ShowError("正在报名...")},
            onSuccess:function(E)
            {
                var H = E.responseJSON;
                if(H == null)
                {
                    E.request.options.onFailure();
                    return;
                }
                if(H.retVal == 0)
                {
                    _ShowError(errorCode[H.errorNum]);
                    _GetImage();
                    return;
                }
                _Result();
                _GetImage();
            },
            onFailure:function(){_ShowError(errorCode[100]);_GetImage();}
        }
    );
}

function _StopAutoBook()
{
    clearInterval(_intervalProcess);
    _ShowError("已停止自动报名");
}

function _AutoBook()
{
    clearInterval(_intervalProcess);

    _BookCheck();
}

function _AutoBookAct()
{
    clearInterval(_intervalProcess);

    _kd = new Array;
    for(var i = 1; i <= 3; i++)
    {
        if(_IsNum($("_bkkd" + i).value))
        {
            _kd.push($("_bkkd" + i).value);
        }
    }
    if(_kd.length > 0)
    {
        if(_isStated != true)
        {
            _intervalProcess = setInterval(_CheckJB, 1000);
        }
        else
        {
            _intervalProcess = setInterval(_CheckKD, 1000);
        }
    }
}

function _CheckJB()    //检查级别是否允许报名
{
    new Ajax.Request
    (
        getURL("selectLevel.do?timeStamp=" + new Date().getTime()),
        {
            method:"get",
            requestHeaders:{RequestType:"ajax"},
            onCreate:function(){_ShowError("正在判断是否开始报名...");},
            onSuccess:function(originalRequest)
            {
                var jsonObj = eval(originalRequest.responseText);

                if(jsonObj == null)
                {
                    originalRequest.request.options.onFailure();
                    return;
                }
                var jbInfo = $A(jsonObj);

                for(var i = 0; i < jbInfo.size(); i++)
                {
                    if(jbInfo[i].value == $("_level").value
                        && jbInfo[i].isStart)
                    {
                        clearInterval(_intervalProcess);
                        _intervalProcess = setInterval(_CheckKD, 1000);
                        _isStated = true;
                    }
                }
                var strInfo = "查询时间：" + (new Date()).toLocaleTimeString();
                $("_autoBook").innerHTML = strInfo;
            },
            onFailure:function(){_ShowError("获取报名开始信息失败");}
        }
    );
}

function _CheckKD()    //检查考点是否有空位
{
    new Ajax.Request
    (
        getURL("chooseAddr.do?bkjb=" + $("_level").value + "&timeStamp=" + new Date().getTime()),
        {
            method:"get",
            requestHeaders:{RequestType:"ajax"},
            onCreate:function(){_ShowError("正在自动报名...");},
            onSuccess:function(originalRequest)
            {
                var jsonObj = eval(originalRequest.responseText);

                if(jsonObj == null)
                {
                    originalRequest.request.options.onFailure();
                    return;
                }
                if(jsonObj.retVal == 0)
                {
                    _ShowError(errorCode[jsonObj.errorNum]);
                    return;
                }
                _CheckKDAct(jsonObj);
            },
            onFailure:function(){_ShowError("获取考点信息失败");}
        }
    );

}

function _CheckKDAct(kdInfo)
{
    var strInfo = "";
    var canBook = false;

    for(var j = 0;j < _kd.length;j++)
    {
        for(var i = 0; i < kdInfo.size(); i++)
        {
            if(_kd[j] == kdInfo[i].id)
            {
                strInfo += kdInfo[i].mc + "：";
                if(kdInfo[i].vacancy)
                {
                    if(canBook == false)
                    {
                        clearInterval(_intervalProcess);
                        _Book(kdInfo[i].id);
                        canBook = true;
                    }
                    strInfo += "<font color='darkred'>有名额</font>";
                }
                else
                {
                    strInfo += "名额已满";
                }
                strInfo += "<br>";
                break;
            }
        }
    }
    strInfo += "查询时间：" + (new Date()).toLocaleTimeString();
    $("_autoBook").innerHTML = strInfo;
}

function _Result()
{
    var params = "ksid=" + user.get("ksid") + "&ksIdNo=" + user.get("ksIdNo") + "&ksLoginFlag=" + user.get("ksLoginFlag");
    new Ajax.Request
    (
        getURL("queryBook.do"),
        {
            method:"post",
            requestHeaders:{RequestType:"ajax"},
            parameters:params,
            onCreate:function(){_ShowError("定座请求结果查询中...");},
            onSuccess:_ResultReturn,
            onFailure:function(){_ShowError("查询失败");}
        }
    );
}

function _ResultReturn(L)
{
    var M = L.responseJSON;
    if(M == null)
    {
        L.request.options.onFailure();
        return;
    }
    if(M.retVal==0)
    {
        if(M.errorNum == 310)
        {
            if(_ErrorNum > 2)
            {
                _ShowError("无法获取报名结果，建议重新报名。");
                _ErrorNum = 0;
                return;
            }
            _Result();
            _ErrorNum++;
        }
        _ShowError(errorCode[M.errorNum]);
        return;
    }
    else
    {
        updateUser(M);
        _ShowError("<font color='darkred'>预定座位成功！</font>");
        layer.setTickMsg(0, dispatch);
    }
}


function _ZdicSet(el, htmlCode)
{
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0)
    {
        el.innerHTML = '<div style="display:none">for IE</div>' + htmlCode;
        el.removeChild(el.firstChild);
    }
    else
    {
        var el_next = el.nextSibling;
        var el_parent = el.parentNode;
        el_parent.removeChild(el);
        el.innerHTML = htmlCode;
        if (el_next)
        {
            el_parent.insertBefore(el, el_next)
        }
        else
        {
            el_parent.appendChild(el);
        }
    }
}

if(!document.getElementById('_Zdic_layer'))
{
    _ZdicInit();
}
else
{
    document.body.removeChild(document.getElementById('_Zdic_layer'));
    _ZdicInit();
}

//javascript:void((function(){var%20element=document.createElement('script');element.setAttribute('src','file:///D:/CrackJLPT2010-12.js');document.body.appendChild(element);})())

//javascript:void((function(){alert(user.get("sFlag"));})())

//http://jlpt.etest.net.cn/chooseAddr.do?bkjb=1
