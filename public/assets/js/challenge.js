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
        $.ajax("/login", {
            type: "POST",
            data: login
        }).then(function() {
            console.log("login request submitted");
        });

    });

    //New Profile Creation

    $("#createProfile").on("click", function(event) {
        //should submit new user info
        console.log("profile creation requested");

        let validateResult = validateInput();
        if (isNaN(validateResult)) {
            return modalOpen(validateResult);
        }

        var userName = $(this).data("userName");
        var password = $(this).data("password");
        var confPassword = $(this).data("confPassword");
        var email = $(this).data("email");
        var newUser = {
            name: userName,
            password: password,
            email: email
        };

        //calls ajax call
        sendRequest(newUser);
    });

    //ajax call

    function sendRequest(data) {

        $.ajax("/newaccount", {
            method: "POST",
            data: data,
            traditional: true
        }).done((response) => {
            console.log("new account submitted");
            modalWrite(response);
        });
    }

    function validateInput() {
        var userName = $(this).data("userName");
        var password = $(this).data("password");
        var confPassword = $(this).data("confPassword");
        var email = $(this).data("email");


        if (!userName || !password || !confPassword || !email) {
            return "form-empty";
        }
        if (name.match(/[^a-z]/gi)) {
            return "userName-invalid";
        }
        if (!password === confPassword) {
            return "password-mismatch";
        }
        if (!email.match(/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/)) {
            return "email-invalid";
        }
    }

    function modalWrite(result) {
        $("modalErrorHeader").text("Oops, something went wrong...");

        switch (result) {
            case "name-invalid":
                $("#userName").attr("placeholder", "Please enter a username");
                break;
            case "email-invalid":
                $("#email").attr("placeholder", "Please enter a valid email address");
                break;
            case "password-mismatch":
                $("#confPassword").attr("placeholder", "Password does not match");
                break;
        }
    }

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
        var newChallenge = {
            title: title,
            challenged: challenged,
            rules: rules,
            proof: proof
        };
        console.log($(this).serializeArray());
        console.log("===============");
        console.log($(this));
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
$("newUser").on("click", function() {
    $("#signUp").modal()
});
