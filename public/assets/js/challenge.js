$(function() {

   console.log("challenge.js loaded");

   //Logout handler
   $("#logout").on("click", function(event) {
      event.preventDefault();
      console.log("loggin out");
      $.ajax({
         url: "/user/logout",
         method: "GET"
      }).then((response) => {
         location.replace(response);
      }).catch((err) => {
         console.log(err);
      });
   });

   //Login Handlers
   //===========================
   $("#login").on("click", function(event) {
      //should submit username and password for authentication
      console.log("login clicked");
      var username = $("#username").val();
      var password = $("#password").val();
      const url = !!location.href.match(/\/?login(?!\w)/) ? location.href : "/login",
         login = {
            username: username,
            password: password
         };

      $.ajax(url, {
         type: "POST",
         data: login
      }).then(function(response) {
         console.log(response);
         console.log("login request submitted");
         setTimeout(function() {
            location.assign(response);
         }, 1000);
      }).catch((err) => {
         err.status == 401 && console.log("username or password incorrect");
      });
   });
   $("#exitModal").on("click", function() {
      clearNewUserInput();
   });
   //New Profile Creation
   $("#createProfile").on("click", function(event) {
      $("#modalErrorHeader").text("");
      //should submit new user info
      console.log("profile creation requested");

      let validateResult = validateNewUserInput();

      if (isNaN(validateResult)) {
         console.log(validateResult);
         return modalWrite(validateResult);
      }

      var userName = $("#userName").val();
      var password = $("#newPassword").val();
      var confPassword = $("#confPassword").val();
      var email = $("#email").val();
      var newUser = {
         username: userName,
         password: password,
         email: email
      };

      sendRequest(newUser);
   });

   // ajax
   function sendRequest(data) {
      console.log("sending request....");
      clearNewUserInput();
      $.ajax("/login/new_user", {
         method: "POST",
         data: data,
         traditional: true
      }).done(function(data) {
         console.log(data);
         const url = !!location.href.match(/\/?login(?!\w)/) ? location.href : "/login",
            user = {
               username: data.name,
               password: data.password,
            };

         $.ajax({
            url: url,
            method: "POST",
            data: user
         }).then((response) => {
            console.log("success");
            setTimeout(function() {
               location.assign(response);
            }, 1000);
         });
      }).catch(function(err) {
         console.log(err);
         return modalWrite(err.responseText);
      });
   }

   function validateNewUserInput() {
      console.log("validating...");
      var caseArray = [];
      var userName = $("#userName").val();
      var password = $("#newPassword").val();
      var confPassword = $("#confPassword").val();
      var email = $("#email").val();

      if (!userName || !password || !confPassword || !email) {
         console.log("Am I stopped here everytime?");
         //return "form-empty";
         caseArray.push("form-empty");
      }
      if (name.match(/[^a-z]/gi)) {
         //return "userName-invalid";
         caseArray.push("userName-invalid");
         console.log("invalid user-name, should write username restrictions here");
      }
      if (password !== confPassword) {
         //return "password-mismatch";
         caseArray.push("password-mismatch");
      }
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
         //return "email-invalid";
         caseArray.push("email-invalid");
      }
      return caseArray;
      console.log(caseArray);
      return 1;
   }

   function modalWrite(result) {
      console.log("initiating modalWrite");

      //turning this into loop...
      console.log(result);
      for (var i = 0; i < result.length; i++) {
         console.log("result[i]: ", result[i]);
         switch (result[i]) {
            case "form-empty":
               $("#newPassword").val('');
               $("#confPassword").val('');
               $("#modalErrorHeader").text("Please complete all fields");
               break;
            case "username-taken":
               $("#newPassword").val('');
               $("#confPassword").val('');
               $("#userName").val("");
               $("#userName").prop("placeholder", "Username already taken");
               break;
            case "userName-invalid":
               $("#newPassword").val('');
               $("#confPassword").val('');
               $("#userName").val("");
               $("#userName").prop("placeholder", "Please enter a valid username");
               break;
            case "email-invalid":
               $("#newPassword").val('');
               $("#confPassword").val('');
               $("#email").val('')
               $("#email").prop("placeholder", "Please enter a valid email address");
               break;
            case "password-mismatch":
               $("#newPassword").val('');
               $("#confPassword").val('');
               $("#confPassword").prop("placeholder", "Password does not match");
               $("#confPassword").addClass("placeholder", "red-text");
               break;
         }
      }
   }

   function clearNewUserInput() {
      console.log("clearing input");
      $(".clearNewUser").val('');
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
      var newChallenge = {};

      $.map($(this).serializeArray(), function(n, i) {
         newChallenge[n['name']] = n['value'];
      });

      const link = newChallenge.postLink;

      if (!link || !link.match(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
         $("#proofLink").val("").prop("placeholder", "please paste in a youtube link before submit");
         return;
      }

      const videoId = link.replace(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/+?(embed\/|watch\?v=){0,1}/, ""),
         linkRestruct = "https://www.youtube.com/embed/" + videoId;

      newChallenge.postLink = linkRestruct;

      console.log(linkRestruct);
      console.log(newChallenge);
      //ajax call
      $.ajax("/challenge/new", {
         type: "POST",
         data: newChallenge
      }).then(function(response) {
         console.log(response);
         console.log("new challenge submitted");
         location.replace(response); // set timeout on this 
      });
      //should receive success/err message?
      return true;
   });

   //Review Response Handlers
   //===========================
   $("#pass").on("click", function(event) {
      const url = location.href.replace(location.pathname, "/challenge/instance/proofaccept");


      $.ajax(url, {
         type: "PUT"
      }).then(function(response) {
         console.log("proof accepted");
         setTimeout(function() {
            location.replace(response);
         }, 1000);
      });
   });

   $("#fail").on("click", function(event) {
      const url = location.href.replace(location.pathname, "/challenge/instance/proofreject");

      $.ajax(url, {
         type: "PUT"
      }).then(function(response) {
         console.log("proof rejected");
         setTimeout(function() {
            location.replace(response);
         }, 1000);
      });
   });

   //View New Challenge Handlers
   //===========================
   $("#accept").on("click", function(event) {
      const url = location.href.replace(location.pathname, "/challenge/instance/accept");

      $.ajax(url, {
         type: "PUT"
      }).then(function(response) {
         console.log("challenge accepted");
         console.log(response);
         setTimeout(function() {
            location.replace(response);
         }, 1000);
      });
      //should change state of instance record to "accepted"
   });

   $("#reject").on("click", function(event) {
      const url = location.href.replace(location.pathname, "/challenge/instance/reject");

      //should change state of instance record to "rejected"
      $.ajax(url, {
         type: "PUT" // delete might be more appropriate since once rejected we are not opening it again
      }).then(function(response) {
         console.log("challenge rejected");
         setTimeout(function() {
            location.replace(response);
         }, 1000);
      });
   });

   //Proof Handler
   //===========================
   $("#proofLinkButton").on("click", function(event) {
      //since we are married to youtube link for prototype testing
      const url = location.href.replace(location.pathname, "/challenge/instance/prove");
      const link = $("#proofLink").val();

      if (!link || !link.match(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
         $("#proofLink").val("").prop("placeholder", "please paste in a youtube link before submit");
         return;
      }

      const videoId = link.replace(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/+?(embed\/|watch\?v=){0,1}/, ""),
         linkRestruct = "https://www.youtube.com/embed/" + videoId;

      console.log(linkRestruct);

      $.ajax(url, {
         type: "PUT",
         data: { link: linkRestruct }
      }).then(function(response) {
         console.log(response);
         setTimeout(function() {
            location.replace(response);
         }, 1000);
      });
   });
});