/**
 * angular-clipImage
 * Created by jerry_zhou on 2017/4/30.
 */

if(typeof module !=='undefined'&&
    typeof exports !== 'undefined'&&
        module.exports === exports){
    module.exports = 'ngClipImage'
}

angular.module('ngClipImage',[])
    .directive('clipImage',function(){
        return {
            restrict: 'E',
            replace:true,
            template:'<div style="display:inline-block;width:100%">' +
                '<div id="CLIPIMAGE-WRAPPER" style="float:left;background-color:blue;" ng-style="operationArea">' +
                    '<canvas id="CLIPIMAGE-PANEL" ></canvas>'+
                    '<canvas id="CLIPIMAGE-CUTPANEL" ></canvas>' +
                '</div>'+
                '<div style="float:left;background-color:blue;" ng-style="showArea">' +
                    '<canvas id="CLIPIMAGE-SHOWPANEL" style="max-width:100%"></canvas>'+
                '</div>'+
            '</div>',
            scope:{
                options:'=',
                url:'=',
                save:'&'
            },
            link:function(scope, element, attrs){

                clipImage.init({
                    url:'http://vod.butel.com/937ed715c54140ffa85e05e29de449ed.png',
                    distPic:{
                        width:320,
                        height:320
                    },
                    elements:{
                        wrapper:{
                            name:'CLIPIMAGE-WRAPPER',
                            width:400,
                            height:400,
                        },
                        panel:'CLIPIMAGE-PANEL',
                        cutPanel:'CLIPIMAGE-CUTPANEL',
                        showPanel:'CLIPIMAGE-SHOWPANEL'
                    }
                })

                scope.operationArea = {
                    width:'60%'
                }

                scope.showArea = {
                    width:'40%',
                    backgroundColor:'yellow'
                }
            }
        }
    });
