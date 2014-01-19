/// <reference path="world.js" />
/// <reference path="jquery.js" />

$(function () {
    var $spaceArea = $('.spaceArea');

    var world = new World();

    $("#loginBut").click(function () {
        world.login($("#loginName").val(), function () {
            $("#loginDiv").hide();
            $("#gameDiv").show();
        });
    });

    $("#offlineBut").click(function () {
        console.log("hello");
        world.offline();
        $("#loginDiv").hide();
        $("#gameDiv").show();
    });
});