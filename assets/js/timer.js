define(function(require,exports,module){
     var $ = require('jquery');//引入jquery
     require('onepage')($);
     // require('boot')($);//共享给jquery
     require('timer')($);//共享给jquery
     require('jplay')($);//共享给jquery
     require('jstorage')($);//共享给jquery

     $("#jquery_jplayer_1").jPlayer({ready: function () {
         $(this).jPlayer("setMedia", {
            volume: 100,
          wav:"assets/audio/warning-30s.mp3"
         });
        },
        swfPath: "assets/audio/",
        supplied: "wav,mp3"
     });

     $("#jquery_jplayer_2").jPlayer({ready: function () {
         $(this).jPlayer("setMedia", {
          volume :100,
          wav:"assets/audio/warning-0s.mp3"
         });
        },
        swfPath: "assets/audio/",
        supplied: "wav,mp3"
     });

     
    $("#play1").click(function(){
        $("#jquery_jplayer_1").jPlayer( "play" );
     });
     $("#play2").click(function(){
        $("#jquery_jplayer_2").jPlayer( "play" );
     });

     $("#play3").click(function(){
        $("#jquery_jplayer_3").jPlayer( "play" );
     });
     $("#play4").click(function(){
        $("#jquery_jplayer_3").jPlayer( "play" );
     });
     $("#btn1").click(function(){
        $("#play1").click();
     });
     $("#btn2").click(function(){
        $("#play2").click();
     });
     

     $('.main').onepage_scroll({
        sectionContainer: ".container-fluid",
        easing: "ease-in",
        loop: false
        // direction: "horizontal"
     });

    

    $("#timedown2").custimer({
        time_length:90,
        begin_btn_id:"beginBtn2",
        stop_btn_id:"stopBtn2",
        reset_btn_id: 'resetBtn2',
        voice_type: 0,
        time_ding_dang: [30,0]
    });

    $("#timedown233").custimer({
      time_length:360,
      begin_btn_id:"beginBtn233",
      stop_btn_id:"stopBtn233",
      reset_btn_id: 'resetBtn233',
      voice_type: 0,
      time_ding_dang: [30,0]
  });

    $("#timedown3").custimer({
        time_length:90,
        begin_btn_id:"beginBtn3",
        stop_btn_id:"stopBtn3",
        reset_btn_id: 'resetBtn3',
        voice_type: 0,
        time_ding_dang: [30,0]
    });

    $("#timedown4").custimer({
        time_length:120,
        begin_btn_id:"beginBtn4",
        stop_btn_id:"stopBtn4",
        reset_btn_id: 'resetBtn4',
        voice_type: 0,
        time_ding_dang: [30,0]
    });

    $("#timedown6_0").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_0",
        stop_btn_id:"stopBtn6_0",
        reset_btn_id: 'resetBtn6_0',
        voice_type: 0,
        time_ding_dang: [30,0]
    });

    $("#timedown6_0r2").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_0r2",
        stop_btn_id:"stopBtn6_0r2",
        reset_btn_id: 'resetBtn6_0r2',
        voice_type: 0,
        time_ding_dang: [30,0]
    });

    $("#timedown6_8").custimer({
        time_length:120,
        begin_btn_id:"beginBtn6_8",
        stop_btn_id:"stopBtn6_8",
        reset_btn_id: 'resetBtn6_8',
        voice_type: 0,
        time_ding_dang: [30,0],
        onFlagTime: function() {
          var stopId = "#"+$("#timePopUp").attr("stop");
          $(stopId).click();
          $("#stopBtn6_8").click();
          if (stopId.endsWith("_2")
          || stopId.endsWith("_3")
          || stopId.endsWith("_6")
          || stopId.endsWith("_7")) {
            $("#stopBtn6_10").click();
          } else {
            $("#stopBtn6_9").click();
          }
        },
        input_id: 'input6_8'
    });

    $("#timedown6_8r2").custimer({
        time_length:120,
        begin_btn_id:"beginBtn6_8r2",
        stop_btn_id:"stopBtn6_8r2",
        reset_btn_id: 'resetBtn6_8r2',
        voice_type: 0,
        time_ding_dang: [30,0],
        onFlagTime: function() {
          var stopId = "#"+$("#timePopUpr2").attr("stop");
          $(stopId).click();
          $("#stopBtn6_8r2").click();
          if (stopId.endsWith("_2")
          || stopId.endsWith("_3")
          || stopId.endsWith("_6")
          || stopId.endsWith("_7")) {
            $("#stopBtn6_10r2").click();
          } else {
            $("#stopBtn6_9r2").click();
          }
        },
        input_id: 'input6_8'
    });

    $("#timedown8_8SL").custimer({
        time_length:120,
        begin_btn_id:"beginBtn8_8SL",
        stop_btn_id:"stopBtn8_8SL",
        reset_btn_id: 'resetBtn8_8SL',
        voice_type: 0,
        time_ding_dang: [30,0],
        onFlagTime: function() {
          var stopId = "#"+$("#timePopUpSL").attr("stop");
          $(stopId).click();
          $("#stopBtn8_8SL").click();
          if (stopId.endsWith("_2SL")
          || stopId.endsWith("_3SL")
          || stopId.endsWith("_6SL")
          || stopId.endsWith("_7SL")) {
            $("#stopBtn8_10SL").click();
          } else {
            $("#stopBtn8_9SL").click();
          }
        },
        input_id: 'input8_8SL'
    });

    $("#timedown8_0SL").custimer({
        time_length:120,
        begin_btn_id:"beginBtn8_0SL",
        stop_btn_id:"stopBtn8_0SL",
        reset_btn_id: 'resetBtn8_0SL',
        voice_type: 0,
        time_ding_dang: [30,0],
        onFlagTime: function() {
          var stopId = "#"+$("#timePopUpSL").attr("stop");
          $(stopId).click();
          $("#stopBtn8_0SL").click();
          if (stopId.endsWith("_2SL")
          || stopId.endsWith("_3SL")
          || stopId.endsWith("_6SL")
          || stopId.endsWith("_7SL")) {
            $("#stopBtn8_10SL").click();
          } else {
            $("#stopBtn8_9SL").click();
          }
        },
        input_id: 'input8_0SL'
    });

    $("#timedown9Free").custimer({
        time_length:60,
        begin_btn_id:"beginBtn9",
        stop_btn_id:"stopBtn9",
        reset_btn_id: 'resetBtnFree',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'inputFree'
    });

    $("#timedown9Free_1").custimer({
        time_length:60,
        begin_btn_id:"beginBtn9_1",
        stop_btn_id:"stopBtn9_1",
        reset_btn_id: 'resetBtnFree',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'inputFree'
    });

    $("#timedown1vn").custimer({
        time_length:60,
        begin_btn_id:"beginBtn1vn",
        stop_btn_id:"stopBtn1vn",
        reset_btn_id: 'resetBtn1vn',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input1vn'
    });

    $("#timedownShow1").custimer({
        time_length:420,
        begin_btn_id:"beginBtnShow1",
        stop_btn_id:"stopBtnShow1",
        reset_btn_id: 'resetBtnShow1',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'inputShow1'
    });

    $("#timedownShow2").custimer({
        time_length:420,
        begin_btn_id:"beginBtnShow2",
        stop_btn_id:"stopBtnShow2",
        reset_btn_id: 'resetBtnShow2',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'inputShow2'
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
//------------------------------------For first round----------------------------------------------------------
    $(".popUpBtn6").on("click", function() {
      var temp = $(this).prev("h1");
      $("#timePopUpText2").html(temp.prev("h3").text() + "本轮时间");
      var tempId = temp.attr("id");
      if (tempId.endsWith("_10")) {
        $("#timePopUpText2").html("反方"+$("#timePopUpText2").html());
      } else if (tempId.endsWith("_9")){
        $("#timePopUpText2").html("正方"+$("#timePopUpText2").html());
      }

      var children = $(this).next("div").children();
      $("#timePopUp").attr("begin", children.eq(0).attr("id"));
      $("#timePopUp").attr("stop", children.eq(1).attr("id"));
      $("#timePopUp").attr("reset", children.eq(2).attr("id"));
      $("#timePopUp").attr("input", children.eq(3).attr("id"));
      $("#timePopUp").attr("timedown", tempId);
      var currentTime = children.eq(3).val();
      console.log(currentTime);
      $("#timedown6_0").html(sencondToTimer(currentTime));
      $("#input6_0").val(currentTime);
      $("#timePopUp").css("display", "block");
    });

    $("#discardBtn6").on('click', function() {
      $("#beginBtn6_8").css("display", "inline-block");
      // $("#stopBtn6_8").css("display", "inline-block");
      $("#endBtn6_8").css("display", "inline-block");
      $("#resetBtn6_8").css("display", "inline-block");
      $("#backBtn6").css("display", "inline-block");
      $("#confirmBtn6").css("display", "none");
      $("#discardBtn6").css("display", "none");
      $("#input6_8").css("display", "none");
    });

    $("#backBtn6").on('click', function() {
      $("#timePopUp").css("display", "none");
    });

    $("#endBtn6_8").on('click', function() {
      $("#stopBtn6_8").click();
      var ori = $("#"+$("#timePopUp").attr("input")).val();;
      console.log("ori: " + ori);
      var left = $("#input6_8").val();
      console.log("ori: " + left);
      var res = ori - left;
      $("#timedown6_8").html(sencondToTimer(0));
      $("#timedown6_0").html(sencondToTimer(res));
      $("#input6_0").val(res);
      $("#"+$("#timePopUp").attr("input")).val(res);
      var resetId = $("#timePopUp").attr("reset");
      $("#"+resetId).click();
      if (resetId.endsWith("_2")
      || resetId.endsWith("_3")
      || resetId.endsWith("_6")
      || resetId.endsWith("_7")) {
        $("#timedown6_10").html(sencondToTimer($("#input6_10").val() - left));
        $("#input6_10").val($("#input6_10").val() - left);
        $("#resetBtn6_10").click();
      } else {
        $("#timedown6_9").html(sencondToTimer($("#input6_9").val() - left));
        $("#input6_9").val($("#input6_9").val() - left);
        $("#resetBtn6_9").click();
      }
    });

//-----------------------------for second round---------------------------------------------------------------------

      $(".popUpBtn8_SL").on("click", function() {
      var temp = $(this).prev("h1");
      $("#timePopUpText2SL").html(temp.prev("h3").text() + "本轮时间");
      var tempId = temp.attr("id");
      if (tempId.endsWith("_10SL")) {
        $("#timePopUpText2SL").html("反方"+$("#timePopUpText2SL").html());
      } else if (tempId.endsWith("_9SL")){
        $("#timePopUpText2SL").html("正方"+$("#timePopUpText2SL").html());
      }

      var children = $(this).next("div").children();
      $("#timePopUpSL").attr("begin", children.eq(0).attr("id"));
      $("#timePopUpSL").attr("stop", children.eq(1).attr("id"));
      $("#timePopUpSL").attr("reset", children.eq(2).attr("id"));
      $("#timePopUpSL").attr("input", children.eq(3).attr("id"));
      $("#timePopUpSL").attr("timedown", tempId);
      var currentTime = children.eq(3).val();
      console.log(currentTime);
      $("#timedown8_0SL").html(sencondToTimer(currentTime));
      $("#input8_0SL").val(currentTime);
      $("#timePopUpSL").css("display", "block");
    });

    

    $("#discardBtn8SL").on('click', function() {
      $("#beginBtn8_8SL").css("display", "inline-block");
    //   $("#stopBtn6_8").css("display", "inline-block");
      $("#endBtn8_8SL").css("display", "inline-block");
      $("#resetBtn8_8SL").css("display", "inline-block");
      $("#backBtn8SL").css("display", "inline-block");
      $("#confirmBtn8SL").css("display", "none");
      $("#discardBtn8SL").css("display", "none");
      $("#input8_8SL").css("display", "none");
    });

    $("#backBtn8SL").on('click', function() {
      $("#timePopUpSL").css("display", "none");
    });

    $("#endBtn8_8SL").on('click', function() {
      $("#stopBtn8_8SL").click();
      var ori = $("#"+$("#timePopUpSL").attr("input")).val();;
      console.log("ori: " + ori);
      var left = $("#input8_8SL").val();
      console.log("ori: " + left);
      var res = ori - left;
      $("#timedown8_8SL").html(sencondToTimer(0));
      $("#timedown8_0SL").html(sencondToTimer(res));
      $("#input8_0SL").val(res);
      $("#"+$("#timePopUpSL").attr("input")).val(res);
      var resetId = $("#timePopUpSL").attr("reset");
      $("#"+resetId).click();
      if (resetId.endsWith("_0SL")
      || resetId.endsWith("_2SL")
      || resetId.endsWith("_3SL")
      || resetId.endsWith("_7SL")) {
        $("#timedown8_10SL").html(sencondToTimer($("#input8_10SL").val() - left));
        $("#input8_10SL").val($("#input8_10SL").val() - left);
        $("#resetBtn8_10SL").click();
      } else {
        $("#timedown8_9SL").html(sencondToTimer($("#input8_9SL").val() - left));
        $("#input8_9SL").val($("#input8_9SL").val() - left);
        $("#resetBtn8_9SL").click();
      }
    });

    //-----------------------------for NvN round---------------------------------------------------------------------

    $("#discardBtnFree").on('click', function() {
      //$("#beginBtn8_8SL").css("display", "inline-block");
      // $("#stopBtn6_8").css("display", "inline-block");
      //$("#endBtn8_8SL").css("display", "inline-block");
      $("#resetBtnFree").css("display", "inline-block");
      //$("#backBtn8SL").css("display", "inline-block");
      $("#confirmBtnFree").css("display", "none");
      $("#discardBtnFree").css("display", "none");
      $("#inputFree").css("display", "none");
    });


    $("#discardBtn1vn").on('click', function() {
      $("#beginBtn1vn").css("display", "inline-block");
      $("#stopBtn1vn").css("display", "inline-block");
      $("#endBtn1vn").css("display", "inline-block");
      $("#resetBtn1vn").css("display", "inline-block");
      $("#backBtn1vn").css("display", "inline-block");
      $("#confirmBtn1vn").css("display", "none");
      $("#discardBtn1vn").css("display", "none");
      $("#input1vn").css("display", "none");
    });

    $("#discardBtnShow1").on('click', function() {
      //$("#beginBtn1vn").css("display", "inline-block");
      //$("#stopBtn1vn").css("display", "inline-block");
      //$("#endBtn1vn").css("display", "inline-block");
      $("#resetBtnShow1").css("display", "inline-block");
      //$("#backBtn1vn").css("display", "inline-block");
      $("#confirmBtnShow1").css("display", "none");
      $("#discardBtnShow1").css("display", "none");
      $("#inputShow1").css("display", "none");
    });

    $("#discardBtnShow2").on('click', function() {
      //$("#beginBtn1vn").css("display", "inline-block");
      //$("#stopBtn1vn").css("display", "inline-block");
      //$("#endBtn1vn").css("display", "inline-block");
      $("#resetBtnShow2").css("display", "inline-block");
      //$("#backBtn1vn").css("display", "inline-block");
      $("#confirmBtnShow2").css("display", "none");
      $("#discardBtnShow2").css("display", "none");
      $("#inputShow2").css("display", "none");
    });


    $("#timedown6").custimer({
        time_length:360,
        begin_btn_id:"beginBtn6",
        stop_btn_id:"stopBtn6",
        reset_btn_id: 'resetBtn6',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6'
    });

    $("#timedown6r2").custimer({
        time_length:360,
        begin_btn_id:"beginBtn6r2",
        stop_btn_id:"stopBtn6r2",
        reset_btn_id: 'resetBtn6r2',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6r2'
    });

    $("#timedown8SL").custimer({
        time_length:360,
        begin_btn_id:"beginBtn8SL",
        stop_btn_id:"stopBtn8SL",
        reset_btn_id: 'resetBtn8SL',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input8SL'
    });

    $("#timedown6_1").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_1",
        stop_btn_id:"stopBtn6_1",
        reset_btn_id: 'resetBtn6_1',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_1'
    });

    $("#timedown6_2").custimer({
        time_length:360,
        begin_btn_id:"beginBtn6_2",
        stop_btn_id:"stopBtn6_2",
        reset_btn_id: 'resetBtn6_2',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_2'
    });

    $("#timedown6_2r2").custimer({
        time_length:360,
        begin_btn_id:"beginBtn6_2r2",
        stop_btn_id:"stopBtn6_2r2",
        reset_btn_id: 'resetBtn6_2r2',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_2r2'
    });


    $("#timedown8_2SL").custimer({
        time_length:360,
        begin_btn_id:"beginBtn8_2SL",
        stop_btn_id:"stopBtn8_2SL",
        reset_btn_id: 'resetBtn8_2SL',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input8_2SL'
    });

    $("#timedown6_3").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_3",
        stop_btn_id:"stopBtn6_3",
        reset_btn_id: 'resetBtn6_3',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_3'
    });

    $("#timedown6_4").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_4",
        stop_btn_id:"stopBtn6_4",
        reset_btn_id: 'resetBtn6_4',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_4'
    });

    $("#timedown6_5").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_5",
        stop_btn_id:"stopBtn6_5",
        reset_btn_id: 'resetBtn6_5',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_5'
    });

    $("#timedown6_6").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_6",
        stop_btn_id:"stopBtn6_6",
        reset_btn_id: 'resetBtn6_6',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_6'
    });

    $("#timedown6_7").custimer({
        time_length:180,
        begin_btn_id:"beginBtn6_7",
        stop_btn_id:"stopBtn6_7",
        reset_btn_id: 'resetBtn6_7',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_7'
    });

    $("#timedown6_9").custimer({
      time_length:360,
      begin_btn_id:"beginBtn6_9",
      stop_btn_id:"stopBtn6_9",
      reset_btn_id: 'resetBtn6_9',
      voice_type: 0,
      time_ding_dang: [30,0],
      input_id: 'input6_9'
    });

    $("#timedown6_9r2").custimer({
        time_length:360,
        begin_btn_id:"beginBtn6_9r2",
        stop_btn_id:"stopBtn6_9r2",
        reset_btn_id: 'resetBtn6_9r2',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_9r2'
      });

    $("#timedown6_10").custimer({
      time_length:360,
      begin_btn_id:"beginBtn6_10",
      stop_btn_id:"stopBtn6_10",
      reset_btn_id: 'resetBtn6_10',
      voice_type: 0,
      time_ding_dang: [30,0],
      input_id: 'input6_10'
    });

    $("#timedown6_10r2").custimer({
        time_length:360,
        begin_btn_id:"beginBtn6_10r2",
        stop_btn_id:"stopBtn6_10r2",
        reset_btn_id: 'resetBtn6_10r2',
        voice_type: 0,
        time_ding_dang: [30,0],
        input_id: 'input6_10r2'
      });

    $("#timedown8_9SL").custimer({
      time_length:360,
      begin_btn_id:"beginBtn8_9SL",
      stop_btn_id:"stopBtn8_9SL",
      reset_btn_id: 'resetBtn8_9SL',
      voice_type: 0,
      time_ding_dang: [30,0],
      input_id: 'input8_9SL'
    });

    $("#timedown8_10SL").custimer({
      time_length:360,
      begin_btn_id:"beginBtn8_10SL",
      stop_btn_id:"stopBtn8_10SL",
      reset_btn_id: 'resetBtn8_10SL',
      voice_type: 0,
      time_ding_dang: [30,0],
      input_id: 'input8_10SL'
    });    $("#timedown8_8SL").custimer({
        time_length:60,
        begin_btn_id:"beginBtn8_8SL",
        stop_btn_id:"stopBtn8_8SL",
        reset_btn_id: 'resetBtn8_8SL',
        voice_type: 0,
        time_ding_dang: [30,0],
        onFlagTime: function() {
          var stopId = "#"+$("#timePopUpSL").attr("stop");
          $(stopId).click();
          $("#stopBtn6_8SL").click();
          if (stopId.endsWith("_2SL")
          || stopId.endsWith("_3SL")
          || stopId.endsWith("_6SL")
          || stopId.endsWith("_7SL")) {
            $("#stopBtn8_10SL").click();
          } else {
            $("#stopBtn8_9SL").click();
          }
        },
        input_id: 'input8_8SL'
    });

    // console.log($("timedown6_8"));
    // console.log($("timedown6_8").custimer);
    // console.log($("timedown6_8").custimer.voice_type);

    $("#timedown7").custimer({
        time_length:240,
        begin_btn_id:"beginBtn7",
        stop_btn_id:"stopBtn7",
        reset_btn_id: 'resetBtn7',
        voice_type: 0,
        time_ding_dang: [30,0]
    });

    $("#timedown7_1").custimer({
        time_length:240,
        begin_btn_id:"beginBtn7_1",
        stop_btn_id:"stopBtn7_1",
        reset_btn_id: 'resetBtn7_1',
        voice_type: 0,
        time_ding_dang: [30,0]
    });

    $("#tw1").custimer({
        time_length:90,
        begin_btn_id:"twbeginBtn1",
        stop_btn_id:"twstopBtn1",
        reset_btn_id: 'twresetBtn1',
        voice_type: 0,
        time_ding_dang: [0]
    });

    $("#hd1").custimer({
        time_length:10,
        begin_btn_id:"hdbeginBtn1",
        stop_btn_id:"hdstopBtn1",
        reset_btn_id: 'hdresetBtn1',
        voice_type: 2,
        time_ding_dang: [0]
    });

    var flag1=2;
    $("#twbeginBtn1").on('click',function()
    {
            flag1 =1;
    });
    $("#hdbeginBtn1").on('click',function()
    {
            flag1 =0;
    });

    $("#flag1Btn").on('click',function(){
        $("#twstopBtn1").click();
        $("#hdresetBtn1").click();
        if(flag1 == 1){
            $("#twstopBtn1").click();
            $("#hdbeginBtn1").click();
        }else if(flag1 == 0){
            $("#hdstopBtn1").click();
            $("#twbeginBtn1").click();
        }else{
            $("#beginBtn1_1").click();
            $("#twbeginBtn1").click();
        }
    });

    $("#flag1StopBtn").on('click',function(){
        $("#stopBtn1_1").click();
        $("#hdstopBtn1").click();
        $("#twstopBtn1").click();
        flag1=2;
    });

    $("#flag1ResetBtn").on('click',function(){
        $("#twresetBtn1").click();
    });

    $("#tw2").custimer({
        time_length:90,
        begin_btn_id:"twbeginBtn2",
        stop_btn_id:"twstopBtn2",
        reset_btn_id: 'twresetBtn2',
        voice_type: 0,
        time_ding_dang: [0]
    });
    $("#hd2").custimer({
        time_length:10,
        begin_btn_id:"hdbeginBtn2",
        stop_btn_id:"hdstopBtn2",
        reset_btn_id: 'hdresetBtn2',
        voice_type: 2,
        time_ding_dang: [0]
    });

    var flag2=2;
    $("#twbeginBtn2").on('click',function()
    {
            flag2 =1;
    });
    $("#hdbeginBtn2").on('click',function()
    {
            flag2 =0;
    });
    $("#flag2Btn").on('click',function(){
        $("#twstopBtn2").click();
        $("#hdresetBtn2").click();
        if(flag2 == 1){
            $("#twstopBtn2").click();
            $("#hdbeginBtn2").click();
        }else if(flag2 == 0){
            $("#hdstopBtn2").click();
            $("#twbeginBtn2").click();
        }else{
            $("#beginBtn2_1").click();
            $("#twbeginBtn2").click();
        }
    });

    $("#flag2StopBtn").on('click',function(){
        $("#stopBtn2_1").click();
        $("#hdstopBtn2").click();
        $("#twstopBtn2").click();
        flag2=2;
    });

    $("#flag2ResetBtn").on('click',function(){
        $("#twresetBtn2").click();
    });

    $("#tw3").custimer({
        time_length:90,
        begin_btn_id:"twbeginBtn3",
        stop_btn_id:"twstopBtn3",
        reset_btn_id: 'twresetBtn3',
        voice_type: 0,
        time_ding_dang: [0]
    });
    $("#hd3").custimer({
        time_length:10,
        begin_btn_id:"hdbeginBtn3",
        stop_btn_id:"hdstopBtn3",
        reset_btn_id: 'hdresetBtn3',
        voice_type: 2,
        time_ding_dang: [0]
    });

    var flag3=2;
    $("#twbeginBtn3").on('click',function()
    {
            flag3 =1;
    });
    $("#hdbeginBtn3").on('click',function()
    {
            flag3 =0;
    });
    $("#flag3Btn").on('click',function(){
        $("#twstopBtn3").click();
        $("#hdresetBtn3").click();
        if(flag3 == 1){
            $("#twstopBtn3").click();
            $("#hdbeginBtn3").click();
        }else if(flag3 == 0){
            $("#hdstopBtn3").click();
            $("#twbeginBtn3").click();
        }else{
            $("#beginBtn3_1").click();
            $("#twbeginBtn3").click();
        }
    });

    $("#flag3StopBtn").on('click',function(){
        $("#stopBtn3_1").click();
        $("#hdstopBtn3").click();
        $("#twstopBtn3").click();
        flag3=2;
    });

    $("#flag3ResetBtn").on('click',function(){
        $("#twresetBtn3").click();
    });


    $("#tw4").custimer({
        time_length:90,
        begin_btn_id:"twbeginBtn4",
        stop_btn_id:"twstopBtn4",
        reset_btn_id: 'twresetBtn4',
        voice_type: 0,
        time_ding_dang: [0]
    });
    $("#hd4").custimer({
        time_length:10,
        begin_btn_id:"hdbeginBtn4",
        stop_btn_id:"hdstopBtn4",
        reset_btn_id: 'hdresetBtn4',
        voice_type: 2,
        time_ding_dang: [0]
    });

    var flag4=2;
    $("#twbeginBtn4").on('click',function()
    {
            flag4 =1;
    });
    $("#hdbeginBtn4").on('click',function()
    {
            flag4 =0;
    });
    $("#flag4Btn").on('click',function(){
        $("#twstopBtn4").click();
        $("#hdresetBtn4").click();
        if(flag4 == 1){
            $("#twstopBtn4").click();
            $("#hdbeginBtn4").click();
        }else if(flag4 == 0){
            $("#hdstopBtn4").click();
            $("#twbeginBtn4").click();
        }else{
            $("#beginBtn4_1").click();
            $("#twbeginBtn4").click();
        }
    });

    $("#flag4StopBtn").on('click',function(){
        $("#stopBtn4_1").click();
        $("#hdstopBtn4").click();
        $("#twstopBtn4").click();
        flag4=2;
    });

    $("#flag4ResetBtn").on('click',function(){
        $("#twresetBtn4").click();
    });

    var flag=2;
    $("#beginBtn9").on('click',function()
    {
            flag =1;
    });
    $("#beginBtn9_1").on('click',function()
    {
            flag =0;
    });
    $("#doubleBtn").on('click',function(){
        if(flag == 1){
            $("#stopBtn9").click();
            $("#beginBtn9_1").click();
        }else if(flag == 0){
            $("#stopBtn9_1").click();
            $("#beginBtn9").click();
        }else{
            $("#beginBtn9").click();
        }
    });

    $("#doubleStopBtn").on('click',function(){
        $("#stopBtn9").click();
        $("#stopBtn9_1").click();
        flag=2;
    });











});
