$(function() {
    console.log("challenge.js loaded");

    //Login Handlers
    //===========================
    $("#login").on("click", function(event) {
        //should submit username and password for authentication
        console.log("login clicked");
        var username = $(this).data("username");
        var password = $(this).data("password");
        var login = {
            username: username,
            password: password
        };
        console.log(login);
        $.ajax("/login", {
            type: "POST",
            data: login
        }).then(function() {
            console.log("login request submitted");
        });

    });
    $("#createProfile").on("click", function(event) {
        //should submit new user info
        console.log("profile creation requested");
        var name = $(this).data("name");
        var password = $(this).data("password");
        var email = $(this).data("password");
        var alias = $(this).data("alias");
        var newUser = {
            name: name,
            password: password,
            email: email,
            alias: alias
        };
        $.ajax("/newaccount", {
            type: "POST",
            data: newUser
        }).then(function() {
            console.log("new account submitted");
        });
    });

    //Dashboard Handlers
    //===========================
    $("#challengeCreate").on("click", function(event) {
        console.log("challengeCreate clicked");
        //should navigate to createChallenge.html
    });

    //Handler for dynamically created current challenges
    //should link to dynamically created (Handlebars?) proof review page
    //--will be in handlebars later
    //Handler for dynamically created received challenges
    //should link to dynamically created (Handlebars?) challenge review page
    //--will be in handlebars later

    //Issue Challenge Handlers
    //===========================
    $("#challengeIssue").submit(function(event) {
        event.preventDefault();
        var title = $(this).data("title");
        var challenged = $(this).data("challenged");
        var rules = $(this).data("rules");
        var proof = $(this).data("proof");
        var newChallenge = {};

        $.map($(this).serializeArray(), function(n, i) {
            newChallenge[n['name']] = n['value'];
        });

        console.log(newChallenge);
        //ajax call
        // $.ajax("user/challenge/new", {
        //     type: "POST",
        //     data: newChallenge
        // }).then(function() {
        //     console.log("new challenge submitted");
        // });
        //should receive success/err message?
        return true;
    });

    //Review Response Handlers
    //===========================
    $("#pass").on("click", function(event) {
        //should change state of instance record to "passed"
        $.ajax("challenge/instance/proofaccept", {
            type: "PUT"
        }).then(function() {
            console.log("proof accepted");
        });


    });
    $("#fail").on("click", function(event) {
        //should change state of instance record to "failed"
        $.ajax("challenge/instance/proofreject", {
            type: "PUT"
        }).then(function() {
            console.log("proof rejected");
        });

    });

    //View New Challenge Handlers
    //===========================
    $("#accept").on("click", function(event) {
        $.ajax("challenge/instance/accept", {
            type: "PUT"
        }).then(function() {
            console.log("challenge accepted");
        });
        //should change state of instance record to "accepted"

    });
    $("#reject").on("click", function(event) {
        //should change state of instance record to "rejected"
        $.ajax("challenge/instance/reject", {
            type: "PUT"
        }).then(function() {
            console.log("challenge rejected");
        });

    });

    //Proof Handler
    //===========================
    $("#proofSub").on("click", function(event) {
        //should submit proof from challenged user
        var proof = $(this).data("proof");
        $.ajax("challenge/instance/prove", {
            type: "PUT",
            data: proof
        }).then(function() {
            console.log("proof submitted: " + proof);
        });
    });
});
