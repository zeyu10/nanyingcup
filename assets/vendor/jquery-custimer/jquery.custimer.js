/*
* cusTimerDown 0.1
* Copyright (c) 2014 Zhangdi http://cindyfn.com/
* Date: 2014-09-16
* 输入秒数，转换成分钟＋秒，然后进行倒计时
* 主要方法:时间转换，倒计时，暂停计时，启动计时，声音点设置。
*/
;
define(function(require,exports,moudles){
     return function(jquery){
            /*
             *插件类别：1.类级别的插件开发。2.对象级别插件开发。
             *
             * 1.类级别：$.post()
             * 2.对象级别：$("#Me").插件名称();
             *
             * 以下是开发对象级别插件的步骤：
             *1.定义一个带有个名为“$”参数的匿名函数。将jQuery这个全局变量传入匿名函数，并执行匿名函数。
             *
             *2.$.fn或者jQuery.fn本质上可以等于jQuery.prototype。实际上给jQuery扩展了一个名为"插件名"的方法,调用方法：$("#Me").插件名称();
             *
             *3.$.extend(defaultSettings,settings);的含义是，使用settings来覆盖defaultSettings（同名键值）,
             *或者 settings = $.extend({},defaultSettings,settings);即不去覆盖defaultSettings（默认参数），而是合并到一个空的Object。
             *or settings = $.extend(true,{},defaultSettings, settings);当$.extend的第一个参数为true时，会开启深层拷贝
             *
             *4.this在插件内部指向当前通过选择器选择的jquery对象，而非传统意义上的对象的引用。this.each遍历所有的元素。return JQuery对象保证插件的链式操作。
             *
             *5.插件中定义的所有方法/函数的末尾都必须带有一个 “;”（分号），否则将不利于代码的最小化。
             *
             * 参考:http://www.iteye.com/topic/545971
             * 参考:http://developer.51cto.com/art/201108/286391.htm
             * 参考:http://www.cnblogs.com/fromearth/archive/2009/07/08/1519054.html
             * 参考:http://www.36ria.com/2768
             * 参考:http://www.cnblogs.com/RascallySnake/archive/2010/05/07/1729563.html
             * 参考:http://www.36ria.com/2765
             * 参考:http://vanessa.b3log.org/jQuery-plugin-architecture
             * 参考:http://docs.jquery.com/Plugins/Authoring
             */

            /* 创建一个闭包 */
            ;(function ($) {
                /* 插件的定义 */

                $.fn.custimer = function (options) {
                    debug(this);

                    var altolTime;//总时间和剩余事件
                    var stimeClock;//timeOut循环记录
                    var contentDiv;//时间容器
                    var beginBtn;//开始按钮
                    var stopBtn;//停止按钮
                    var resetBtn;//停止按钮
                    var timeDingDang = [];
                    var voiceBtn;
                    var voiceType;

                    // build main options before element iteration
                    var opts = $.extend({}, $.fn.custimer.defaults, options);
                    // iterate and reformat each matched element

                    return this.each(function () {
                        $this = $(this);
                        // build element specific options
                        var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
                        // update element styles
                        altolTime = o.time_length;
                        timeDingDang = o.time_ding_dang;

                        // contentDiv = $("#"+o.show_ele_id);
                        contentDiv = $(this);
                        if (this.id.includes('6') && !this.id.includes('8')) {
                          $(this).addClass('timedownclass-sm');
                        } else {
                          $(this).addClass('timedownclass');
                        }


                        beginBtn = $("#"+o.begin_btn_id);
                        stopBtn = $("#"+o.stop_btn_id);
                        resetBtn = $("#"+o.reset_btn_id);

                        voiceBtn = $("#"+o.voice_btn_id);
                        voiceType = o.voice_type;
                        contentDiv.html(sencondToTimer(o.time_length));//显示在容器中的内容
                        
                        if (o.input_id !== "input") {
                          $("#" + o.input_id).val(o.time_length);
                        }

                        if (this.id.includes("6_8")) {
                          $("#confirmBtn6").on('click', function() {
                            $("#beginBtn6_8").css("display", "inline-block");
                            // $("#stopBtn6_8").css("display", "inline-block");
                            $("#endBtn6_8").css("display", "inline-block");
                            $("#resetBtn6_8").css("display", "inline-block");
                            $("#backBtn6").css("display", "inline-block");
                            $("#confirmBtn6").css("display", "none");
                            $("#discardBtn6").css("display", "none");
                            $("#input6_8").css("display", "none");
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = $("#input6_8").val();

                            console.log(altolTime);
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            if (o.input_id !== "input") {
                              $("#"+o.input_id).val(altolTime);
                              console.log($("#"+o.input_id).val());
                            }
                            clearTimeout(stimeClock);
                          });
                        }

                        if (this.id.includes("8_8SL")) {
                          $("#confirmBtn8SL").on('click', function() {
                            $("#beginBtn8_8SL").css("display", "inline-block");
                            // $("#stopBtn6_8").css("display", "inline-block");
                            $("#endBtn8_8SL").css("display", "inline-block");
                            $("#resetBtn8_8SL").css("display", "inline-block");
                            $("#backBtn8SL").css("display", "inline-block");
                            $("#confirmBtn8SL").css("display", "none");
                            $("#discardBtn8SL").css("display", "none");
                            $("#input8_8SL").css("display", "none");
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = $("#input8_8SL").val();

                            console.log(altolTime);
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            if (o.input_id !== "input") {
                              $("#"+o.input_id).val(altolTime);
                              console.log($("#"+o.input_id).val());
                            }
                            clearTimeout(stimeClock);
                          });
                        }

                        if (this.id.includes("Free")) {
                          $("#confirmBtnFree").on('click', function() {
                            //$("#beginBtn8_8SL").css("display", "inline-block");
                            // $("#stopBtn6_8").css("display", "inline-block");
                            //$("#endBtn8_8SL").css("display", "inline-block");
                            $("#resetBtnFree").css("display", "inline-block");
                            //$("#backBtn8SL").css("display", "inline-block");
                            $("#confirmBtnFree").css("display", "none");
                            $("#discardBtnFree").css("display", "none");
                            $("#inputFree").css("display", "none");
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = $("#inputFree").val();

                            console.log(altolTime);
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            if (o.input_id !== "input") {
                              $("#"+o.input_id).val(altolTime);
                              console.log($("#"+o.input_id).val());
                            }
                            clearTimeout(stimeClock);
                          });
                        }

                        if (this.id.includes("1vn")) {
                          $("#confirmBtn1vn").on('click', function() {
                            $("#beginBtn1vn").css("display", "inline-block");
                            $("#stopBtn1vn").css("display", "inline-block");
                            $("#endBtn1vn").css("display", "inline-block");
                            $("#resetBtn1vn").css("display", "inline-block");
                            //$("#backBtn8SL").css("display", "inline-block");
                            $("#confirmBtn1vn").css("display", "none");
                            $("#discardBtn1vn").css("display", "none");
                            $("#input1vn").css("display", "none");
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = $("#input1vn").val();

                            console.log(altolTime);
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            if (o.input_id !== "input") {
                              $("#"+o.input_id).val(altolTime);
                              console.log($("#"+o.input_id).val());
                            }
                            clearTimeout(stimeClock);
                          });
                        }

                        if (this.id.includes("Show1")) {
                          $("#confirmBtnShow1").on('click', function() {
                            //$("#beginBtn1vn").css("display", "inline-block");
                            //$("#stopBtn1vn").css("display", "inline-block");
                            //$("#endBtn1vn").css("display", "inline-block");
                            $("#resetBtnShow1").css("display", "inline-block");
                            //$("#backBtn8SL").css("display", "inline-block");
                            $("#confirmBtnShow1").css("display", "none");
                            $("#discardBtnShow1").css("display", "none");
                            $("#inputShow1").css("display", "none");
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = $("#inputShow1").val();

                            console.log(altolTime);
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            if (o.input_id !== "input") {
                              $("#"+o.input_id).val(altolTime);
                              console.log($("#"+o.input_id).val());
                            }
                            clearTimeout(stimeClock);
                          });
                        }

                          if (this.id.includes("Show2")) {
                          $("#confirmBtnShow2").on('click', function() {
                            //$("#beginBtn1vn").css("display", "inline-block");
                            //$("#stopBtn1vn").css("display", "inline-block");
                            //$("#endBtn1vn").css("display", "inline-block");
                            $("#resetBtnShow2").css("display", "inline-block");
                            //$("#backBtn8SL").css("display", "inline-block");
                            $("#confirmBtnShow2").css("display", "none");
                            $("#discardBtnShow2").css("display", "none");
                            $("#inputShow2").css("display", "none");
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = $("#inputShow2").val();

                            console.log(altolTime);
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            if (o.input_id !== "input") {
                              $("#"+o.input_id).val(altolTime);
                              console.log($("#"+o.input_id).val());
                            }
                            clearTimeout(stimeClock);
                          });
                        }

                        //开始的按钮绑定事件
                        beginBtn.on('click',function(){
                          if (this.id.includes('6_0')) {
                            altolTime = $("#input6_0").val();
                            console.log("hahahahha" + altolTime);
                          }
                          if (this.id.includes('6_8')) {
                            if (altolTime == 0) {
                              console.log("Time is zero! Don't start!");
                              return;
                            }
                            var beginId = "#"+$("#timePopUp").attr("begin");
                            $("#beginBtn6_0").click();
                            $(beginId).click();
                            if (beginId.endsWith("_2")
                            || beginId.endsWith("_3")
                            || beginId.endsWith("_6")
                            || beginId.endsWith("_7")) {
                              $("#beginBtn6_10").click();
                            } else {
                              $("#beginBtn6_9").click();
                            }
                          }

                          if (this.id.includes('8_0SL')) {
                            altolTime = $("#input8_0SL").val();
                            console.log("hahahahha" + altolTime);
                          }
                          if (this.id.includes('8_8SL')) {
                            if (altolTime == 0) {
                              console.log("Time is zero! Don't start!");
                              return;
                            }
                            var beginId = "#"+$("#timePopUpSL").attr("begin");
                            $("#beginBtn8_0SL").click();
                            $(beginId).click();
                            if (beginId.endsWith("_2SL")
                            || beginId.endsWith("_3SL")
                            || beginId.endsWith("_6SL")
                            || beginId.endsWith("_7SL")) {
                              $("#beginBtn8_10SL").click();
                            } else {
                              $("#beginBtn8_9SL").click();
                            }
                          }

                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            clearTimeout(stimeClock);
                            stimeClock = setTimeout(timeDownFn,1000);

                            
                            
                        });


                        //停止的按钮绑定事件
                        stopBtn.on('click',function(){
                          if (this.id.includes('6_8')) {
                            var stopId = "#"+$("#timePopUp").attr("stop");
                            $("#stopBtn6_0").click();
                            $(stopId).click();
                            if (stopId.endsWith("_2")
                            || stopId.endsWith("_3")
                            || stopId.endsWith("_6")
                            || stopId.endsWith("_7")) {
                              $("#stopBtn6_10").click();
                            } else {
                              $("#stopBtn6_9").click();
                            }
                          }
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            clearTimeout(stimeClock);

                            if (this.id.includes('8_8SL')) {
                            var stopId = "#"+$("#timePopUpSL").attr("stop");
                            $("#stopBtn8_0SL").click();
                            $(stopId).click();
                            if (stopId.endsWith("_2SL")
                            || stopId.endsWith("_3SL")
                            || stopId.endsWith("_6SL")
                            || stopId.endsWith("_7SL")) {
                              $("#stopBtn8_10SL").click();
                            } else {
                              $("#stopBtn8_9SL").click();
                            }
                          }
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            clearTimeout(stimeClock);
                        });

                        

                        //重置参数
                        resetBtn.on('click',function(){
                          if (this.id.includes('6_8')) {
                            // $("#"+$("#timePopUp").attr("reset")).click();
                            $("#beginBtn6_8").css("display", "none");
                            // $("#stopBtn6_8").css("display", "none");
                            $("#endBtn6_8").css("display", "none");
                            $("#resetBtn6_8").css("display", "none");
                            $("#backBtn6").css("display", "none");
                            $("#confirmBtn6").css("display", "inline-block");
                            $("#discardBtn6").css("display", "inline-block");
                            $("#input6_8").css("display", "inline-block");
                            $("#input6_8").val(60);
                            return;
                          }
                          if (this.id.includes('6')
                          && !this.id.includes('_0')) {
                            altolTime = $("#"+o.input_id).val();
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            clearTimeout(stimeClock);
                            return;
                          }
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = o.time_length;
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            clearTimeout(stimeClock);

                            if (this.id.includes('8_8SL')) {
                            // $("#"+$("#timePopUp").attr("reset")).click();
                            $("#beginBtn8_8SL").css("display", "none");
                            // $("#stopBtn6_8").css("display", "none");
                            $("#endBtn8_8SL").css("display", "none");
                            $("#resetBtn8_8SL").css("display", "none");
                            $("#backBtn8SL").css("display", "none");
                            $("#confirmBtn8SL").css("display", "inline-block");
                            $("#discardBtn8SL").css("display", "inline-block");
                            $("#input8_8SL").css("display", "inline-block");
                            $("#input8_8SL").val(60);
                            return;
                          }
                          if (this.id.includes('8')
                          && !this.id.includes('_0SL')) {
                            altolTime = $("#"+o.input_id).val();
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            clearTimeout(stimeClock);
                            return;
                          }

                          if (this.id.includes('Free')) {
                            // $("#"+$("#timePopUp").attr("reset")).click();
                            //$("#beginBtnFree").css("display", "none");
                            // $("#stopBtn6_8").css("display", "none");
                            //$("#endBtn8_8SL").css("display", "none");
                            $("#resetBtnFree").css("display", "none");
                            //$("#backBtn8SL").css("display", "none");
                            $("#confirmBtnFree").css("display", "inline-block");
                            $("#discardBtnFree").css("display", "inline-block");
                            $("#inputFree").css("display", "inline-block");
                            $("#inputFree").val(60);
                            return;
                          }

                          if (this.id.includes('1vn')) {
                            // $("#"+$("#timePopUp").attr("reset")).click();
                            $("#beginBtn1vn").css("display", "none");
                            $("#stopBtn1vn").css("display", "none");
                            $("#endBtn1vn").css("display", "none");
                            $("#resetBtn1vn").css("display", "none");
                            //$("#backBtn8SL").css("display", "none");
                            $("#confirmBtn1vn").css("display", "inline-block");
                            $("#discardBtn1vn").css("display", "inline-block");
                            $("#input1vn").css("display", "inline-block");
                            $("#input1vn").val(60);
                            return;
                          }

                          if (this.id.includes('Show1')) {
                            // $("#"+$("#timePopUp").attr("reset")).click();
                            //$("#beginBtn1vn").css("display", "none");
                            //$("#stopBtn1vn").css("display", "none");
                            //$("#endBtn1vn").css("display", "none");
                            $("#resetBtnShow1").css("display", "none");
                            //$("#backBtn8SL").css("display", "none");
                            $("#confirmBtnShow1").css("display", "inline-block");
                            $("#discardBtnShow1").css("display", "inline-block");
                            $("#inputShow1").css("display", "inline-block");
                            $("#inputShow1").val(60);
                            return;
                          }
                          
                          if (this.id.includes('Show2')) {
                            // $("#"+$("#timePopUp").attr("reset")).click();
                            //$("#beginBtn1vn").css("display", "none");
                            //$("#stopBtn1vn").css("display", "none");
                            //$("#endBtn1vn").css("display", "none");
                            $("#resetBtnShow2").css("display", "none");
                            //$("#backBtn8SL").css("display", "none");
                            $("#confirmBtnShow2").css("display", "inline-block");
                            $("#discardBtnShow2").css("display", "inline-block");
                            $("#inputShow2").css("display", "inline-block");
                            $("#inputShow2").val(60);
                            return;
                          }

                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            altolTime = o.time_length;
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容
                            clearTimeout(stimeClock);
                        });

                        


                        function sencondToTimer(sec){
                            var s = parseInt(sec);
                            var minuite = parseInt(s/60);
                            if(minuite < 10){
                                minuite = "0"+minuite;
                            }
                            second = parseInt(s%60);
                            if(second < 10){
                                second = "0"+second;

                            }
                            return minuite+" : "+ second;
                        }
                        //循环倒计时
                        function timeDownFn(){

                            // o.onFlagTime();
                            if(altolTime == 31){
                                    $("#play1").click();//响铃

                            }else if(altolTime == 1){
                              o.onFlagTime();
                                if(voiceType ==0){
                                    $("#play2").click();//响铃
                                }else if(voiceType ==1){
                                    $("#play3").click();//提问结束响铃
                                }else if(voiceType ==2){
                                     $("#play4").click();//回答结束响铃
                                }
                            }
                            // if(timeDingDang.indexOf(altolTime)>=0){
                            //     $(voiceBtn).click();//响铃
                            //     $("#jp_audio_0").play();
                            // }
                            if(altolTime<=0){
                                clearTimeout(stimeClock);
                                return false;
                            }

                            altolTime = altolTime -1;
                            if(altolTime < 10){
                                contentDiv.css({"color":"red"});
                            }else{
                                contentDiv.css({"color":"white"});
                            }
                            contentDiv.html(sencondToTimer(altolTime));//显示在容器中的内容

                            if (o.input_id !== "input") {
                              $("#"+o.input_id).val(altolTime);
                              console.log($("#"+o.input_id).val());
                            }

                            stimeClock = setTimeout(timeDownFn,1000);
                        }
                    });
                };
                // 私有函数：debugging
                function debug($obj) {
                    if (window.console && window.console.log)
                        window.console.log('obj size: ' + $obj.size());
                }

                /* 定义暴露format函数 */
                $.fn.custimer.format = function (txt) {
                };
                // 插件的defaults
                $.fn.custimer.defaults = {
                    show_ele_id: "timedown",//显示的容器
                    time_length: 170, //输入的秒数
                    begin_btn_id: 'beginBtn',
                    stop_btn_id: 'stopBtn',
                    reset_btn_id: 'resetBtn',
                    time_ding_dang: [31,1,0],
                    voice_type: 0,
                    voice_btn_id: "voiceplay",
                    onFlagTime:function(){},//当到设定时间时候触发事件
                    input_id: 'input'
                };
                /* 设置版本号 */
                $.fn.custimer.version = 1.0;
                //  时间转换函数

            })(jQuery);


     }

});
