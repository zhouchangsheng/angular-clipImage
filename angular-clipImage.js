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
				restrict: 'EA',
				replace:true,
				transclude:true,
				scope:{
					show:'=',
					showSize:'@?',
					mode:'@',
					distPic:'=',
					onOk:'=?',
					onCancel:'=?',
					onFileChange:'=?'
				},
				template:'<div ><div ng-transclude></div><div></div></div>',
				controller:function($scope,$element,$attrs,$compile,$timeout){
					var url;
					var img = new Image();
					var showWrapper;
					var showSize = $scope.showSize?'<span style="display:inline-block;margin-top:10px;font-size:14px;color:#5d5d5d;">'+$scope.showSize+'</span>':"";
					var fileAccept = $attrs.hasOwnProperty('accept')?'accept="image/*"':'';
					var fileChangeHandler = function(evt){
						if(url){
							window.URL.revokeObjectURL(url);
						}
						var file = evt.target.files[0];
						var fileType = file.type?file.type:false;

						if($scope.onFileChange){
							if(fileType&&/^(image\/png|image\/jpe?g)/gi.test(fileType)){
								url = window.URL.createObjectURL(file);
								img.src = url;
								img.onload = function(){
									if($scope.onFileChange(file,img.width,img.height)){
										clipImage.changeImgUrl(url);
										$timeout(function(){
											$scope.showUpload=false;
											$scope.okDisabled =false;
										},0);
									}else{
										window.URL.revokeObjectURL(url);
									}
								}
							}else{
								$scope.onFileChange(file);
							}
						}else if(fileType&&/^(image\/png|image\/jpe?g)/gi.test(fileType)){
							url = window.URL.createObjectURL(file);
							clipImage.changeImgUrl(url);
							$timeout(function(){
								$scope.showUpload=false;
								$scope.okDisabled =false;
							},0);
						}
					};


					if($scope.mode==='rect'){
						if($scope.distPic.width>$scope.distPic.height){
							var showRectHeight = Math.ceil($scope.distPic.height*300/$scope.distPic.width);
							showWrapper = '<div style="width:300px;height:'+showRectHeight+'px;margin-top:'+(200-showRectHeight/2)+'px;position:relative" ng-style="showWrapperStyleObj">'+'<canvas  style="width:100%;height:auto;"></canvas><span ng-if="showUpload" style="color:#5d5d5d;font-size:14px;left:140px;top:48%;position:absolute;">预览</span>'+'</div>'+
								'<div style="height:'+(200-showRectHeight/2)+'px;position:relative;text-align:center;">' + showSize+
								'<button type="button" class="clipImage-btn clipImage-btn-submit" style="position:absolute;left:0;bottom:0;" ng-disabled="okDisabled" ng-click="handClipImage()">确定</button>' +
								'<button type="button" class="clipImage-btn clipImage-btn-cancel" style="position:absolute;right:0;bottom:0;" ng-click="hideClipImageModal()">取消</button>' +
								'</div>';
						}else if($scope.distPic.width<$scope.distPic.height){
							var showRectWidth = Math.ceil($scope.distPic.width*204/$scope.distPic.height);
							showWrapper = '<div style="height:204px;width:'+showRectWidth+'px;margin-left:'+(150-showRectWidth/2)+'px;margin-top:88px;position:relative" ng-style="showWrapperStyleObj">'+'<canvas  style="width:auto;height:100%;"></canvas><span ng-if="showUpload" style="color:#5d5d5d;font-size:14px;left:'+(showRectWidth/2-14)+'px;top:48%;position:absolute;">预览</span>'+'</div>'+
								'<div style="height:108px;position:relative;text-align:center;">' + showSize+
								'<button type="button" class="clipImage-btn clipImage-btn-submit" style="position:absolute;left:0;bottom:0;" ng-disabled="okDisabled" ng-click="handClipImage()">确定</button>' +
								'<button type="button" class="clipImage-btn clipImage-btn-cancel" style="position:absolute;right:0;bottom:0;" ng-click="hideClipImageModal()">取消</button>' +
								'</div>';
						}else{
							showWrapper = '<div style="width:204px;height:204px;margin-top:88px;margin-left:48px;position:relative;overflow: hidden;" ng-style="showWrapperStyleObj">'+'<canvas  style="width:100%;height:100%;"></canvas><span ng-if="showUpload" style="color:#5d5d5d;font-size:14px;left:90px;top:48%;position:absolute;">预览</span>'+'</div>'+
								'<div style="height:108px;position:relative;text-align: center;">' +showSize+
								'<button type="button" class="clipImage-btn clipImage-btn-submit" style="position:absolute;left:0;bottom:0;" ng-disabled="okDisabled" ng-click="handClipImage()">确定</button>' +
								'<button type="button" class="clipImage-btn clipImage-btn-cancel" style="position:absolute;right:0;bottom:0;" ng-click="hideClipImageModal()">取消</button>' +
								'</div>';
						}

					}else if($scope.mode==='circleToRect'){
						showWrapper = '<div style="width:204px;height:204px;margin-top:88px;margin-left:48px;border-radius:50%;position:relative;overflow: hidden;" ng-style="showWrapperStyleObj">'+'<canvas  style="width:100%;height:100%;border-radius: 50%;"></canvas><span ng-if="showUpload" style="color:#5d5d5d;font-size:14px;left:90px;top:48%;position:absolute;">预览</span>'+'</div>'+
							'<div style="height:108px;position:relative;text-align: center;">' +showSize+
							'<button type="button" class="clipImage-btn clipImage-btn-submit" style="position:absolute;left:0;bottom:0;" ng-disabled="okDisabled" ng-click="handClipImage()">确定</button>' +
							'<button type="button" class="clipImage-btn clipImage-btn-cancel" style="position:absolute;right:0;bottom:0;" ng-click="hideClipImageModal()">取消</button>' +
							'</div>';
					}


					var template ='<div ng-show="show">'+
						'<style>' +
						'.clipImage-btn{cursor:pointer;font-size:16px;background-color:#3aaccb;width:100px;height:40px;color:white;outline:none;-webkit-border-radius:4px ;-moz-border-radius:4px ;border-radius:4px ;border:1px solid #31a0c0;}'+
						'.clipImage-btn[disabled]{cursor:not-allowed}'+
						'.clipImage-btn-submit{background-color:#3aaccb;color:white;border:1px solid #31a0c0;}'+
						'.clipImage-btn-upload{background-color:#ffffff;color:#2d2d2d;border:1px solid #ffffff;}'+
						'.clipImage-btn-cancel{background-color:#d6dbe0;;color:#2d2d2d;border:1px solid #d9dbdd;}'+
						'.clipImage-btn[class=*clipImage-btn-]:active{transition:all 1s,}'+
						'.clipImage-btn-submit:active{background-color:#1c8dad;}'+
						'.clipImage-btn-cancel:active{background-color:#aab3bd;}'+
						'.clipImage-btn-upload:active{background-color:#d9dbdd;}'+
						'.clipImage-btn-small{width:64px;height:22px;line-height:22px;font-size:12px;}'+
						'</style>'+
						'<div  style="background-color:#3a3f51;display:block;opacity: 0.8;  position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1040;" ></div>'+
						'<div  style="display:block;position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1050;overflow: hidden;">'+
						'<div style="margin:20px auto;width:802px;background-color:white;height:510px;border:1px solid #d9d9d9;border-radius:6px;">' +
						'<div style="padding:16px 30px 16px 30px;border-bottom:1px solid #d9d9d9;">' +
						'<div style="position:relative;"><span style="font-size:18px;color:#2d2d2d;">编辑图片</span><span style="position: absolute;color:#2d2d2;font-size: 25px;right: 0;top: -8px;cursor:pointer;" ng-click="hideClipImageModal()">&times;</span></div>'+
						'</div>'+
						'<div style="display:block;height:auto;overflow:hidden;padding:16px 30px 16px 30px;">' +
						'<div style="display:inline-block;float:left;width:400px;">' +
						'<div style="width:400px;height:400px;background-color:#d9d9d9;" >' +
						'<canvas  ></canvas>'+
						'<div  ng-show="showUpload" style="position: absolute;z-index: 5;height:100%;width:100%;text-align: center;top:0;left:0">' +
						'<span class="clipImage-btn clipImage-btn-upload clipImage-btn-small" style="display:inline-block;margin-top:184px;border-radius:2px;position:relative;overflow: hidden">选择图片<input type="file" title="" style="position:absolute;top:0;cursor:pointer;right:0;width:300%;height:150%;opacity: 0;"  '+fileAccept+'/></span>'+
						'<br/><span style="display:inline-block;font-size:14px;color:#5d5d5d;padding-top:10px;">只支持JPG、PNG，大小不超过5M</span>'+
						'</div>'+
						'</div>'+
						'<div style="text-align:center;padding-top: 6px;"><span ng-hide="showUpload" class="clipImage-btn clipImage-btn-cancel clipImage-btn-small" style="display:inline-block;border-radius:2px;position:relative;overflow: hidden">重新上传<input type="file" title="" style="position:absolute;top:0;cursor:pointer;right:0;width:300%;height:150%;opacity: 0;"  '+fileAccept+'/></span></div>'+
						'</div>'+
						'<div style="display:inline-block;float:left;height:400px; width:300px;margin-left:40px" >' +
						showWrapper+
						'</div>'+
						'</div>'+

						'</div>'+
						'</div>' +
						'</div>';

					var templateNode = $compile(template)($scope);
					var wrapperParentNode = templateNode[0].childNodes[2].childNodes[0].childNodes[1];
					var wrapNode = wrapperParentNode.childNodes[0].childNodes[0];
					var uploadFileNode = wrapNode.childNodes[1].childNodes[0].childNodes[1];
					var bottomFileNode = wrapperParentNode.childNodes[0].childNodes[1].childNodes[0].childNodes[1];
					var panelNode = wrapNode.childNodes[0];
					//var cutPanelNode = wrapNode.childNodes[1];
					var showPanelNode = wrapperParentNode.childNodes[1].childNodes[0].childNodes[0];

					angular.element($element[0].childNodes[1]).append(templateNode);


					var clipImage = new ClipImage({
						//url:'http://vod.butel.com/937ed715c54140ffa85e05e29de449ed.png',
						scalePoint:{
							size:10,
							color:"orange"
						},
						mode:$scope.mode,
						distPic:$scope.distPic,
						elements:{
							wrapper:{
								//value:'CLIPIMAGE-WRAPPER',
								value:wrapNode,
								width:400,
								height:400
							},
							//panel:'CLIPIMAGE-PANEL',
							panel:panelNode,
							//showPanel:'CLIPIMAGE-SHOWPANEL',
							showPanel:showPanelNode
						}
					});

					angular.element(uploadFileNode).bind('change',fileChangeHandler);

					angular.element(bottomFileNode).bind('change',fileChangeHandler);



					$scope.okDisabled = true;
					$scope.showUpload = true;
					$scope.$watch('showUpload',function(newValue,oldValue){
						$scope.showWrapperStyleObj ={
							"background-color":newValue?"#d9d9d9":"transparent"
						};
					});




					/**
					 * @description 点击确定处理函数
					 * */
					$scope.handClipImage = function(){
						angular.isDefined($scope.okDisabled)?$scope.okDisabled=true:true;
						clipImage.saveImage('blob',function(err,data){
							if(!err){
								$scope.onOk?$scope.onOk(data,function(){
										$scope.okDisabled = false;
									}):console.log("there is not onOk handler");

							}else{
								console.error('Error[when saveImage]'+err.errMsg);
							}
						});
						$attrs.hasOwnProperty('okHidden')?$scope.show=false:true;
					};

					/**
					 * @description 点击取消事件处理
					 * */
					$scope.hideClipImageModal = function(){
						$scope.show =false;
						$scope.onCancel?$scope.onCancel():true;
					};

				}
			}
		});
