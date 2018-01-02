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
         $("#password").val("");

         if (err.status == 401) {
            $("#username").next("label")
               .addClass("red-text")
               .text("Username or password incorrect");
            return console.log("username or password incorrect");
         }
         $(".err").text("oops it seems like there is something wrong with the server, please refresh the page and try again");
      });
   });

   // $("#exitModal").on("click", function() {
   //    clearNewUserInput();
   // });

   //New Profile Creation
   $("#createProfile").on("click", function(event) {
      $("#modalErrorHeader").text("");
      //should submit new user info
      console.log("profile creation requested");

      var userName = $("#userName").val();
      var password = $("#newPassword").val();
      var confPassword = $("#confPassword").val();
      var email = $("#email").val();
      var newUser = {
         username: userName,
         password: password,
         confPassword: confPassword,
         email: email
      };

      let validateResult = validateForm(newUser);

      if (isNaN(validateResult)) {
         console.log(validateResult);
         return modalWrite(validateResult, $(".clearNewUser"));
      }

      sendRequest(newUser);
   });

   // ajax
   function sendRequest(data) {
      console.log("sending request....");
      // clearNewUserInput();

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

   function modalWrite(result, form = null) {
      console.log("initiating modalWrite");
      form && form.prop("placeholder", "");
      
      console.log(result);
      switch (result) {
         case "form-empty":
            $("#modalErrorHeader").text("Please complete all fields");
            break;
         case "userName-invalid":
            $("#userName").val("");
            $("#userName").prop("placeholder", "Please enter a valid username");
            break;
         case "email-invalid":
            $("#email").val('')
            $("#email").prop("placeholder", "Please enter a valid email address");
            break;
         case "password-mismatch":
            $("#confPassword").prop("placeholder", "Password does not match");
            $("#confPassword").addClass("placeholder", "red-text");
            break;
            // account creation error
         case "username-taken":
            $("#modalErrorHeader").text("An account with same username has already been registered");
            break;
         case "email-taken":
            $("#modalErrorHeader").text("An account with same email has already been registered");
            break;
         case "not-yoututbe":
            $("#proofLink").val("").prop("placeholder", "please paste in a youtube link before submit");
            break;
      }
      $("#newPassword").val('');
      $("#confPassword").val('');
   }

   function validateForm(object) {
      const __ = object,
         email = __.email || __.challenged;

      const nullForm = (object) => {
         let formEmpty = false;
         $.map(object, function(elem, index) {
            if (!elem) {
               formEmpty = true;
            }
         });
         return formEmpty;
      }
      console.log(__);

      if (nullForm(__)) {
         return "form-empty";
      };

      console.log(email);
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
         return "email-invalid";
      }

      if (__.password !== __.confPassword) {
         return "password-mismatch";
      }

      // 2 stage check
      if (!!__.postLink && __.postLink.match(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/)) {
         return 1;
      }

      if (!!__.postLink && !__.postLink.match(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
         return "not-yoututbe";
      }

      return 0;
   }


   //Issue Challenge Handlers
   //===========================
   $("#challengeIssue").submit(function(event) {
      event.preventDefault();
      var newChallenge = {};

      $.map($(this).serializeArray(), function(n, i) {
         newChallenge[n['name']] = n['value'];
      });

      const validateResult = validateForm(newChallenge);

      if (isNaN(validateResult)) {
         console.log(validateResult);
         return modalWrite(validateResult);
      }

      // const link = newChallenge.postLink;

      // if (!link || !link.match(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
      //    $("#proofLink").val("").prop("placeholder", "please paste in a youtube link before submit");
      //    return;
      // }
      let src, linkRestruct;

      if (!validateResult) {
         linkRestruct = newChallenge.postLink.replace(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/+?(embed\/|watch\?v=){0,1}/, "https://www.youtube.com/embed/");
      } else {
         src = newChallenge.postLink.replace(/\/?\w+?\.(?:png|jpg|jpeg|gif|png|svg)/, "");
         linkRestruct = src.replace(/(https?\:\/\/)?(\w+)(?:\.\w+){1,2}?\/?(media|embed)\//, "https://giphy.com/embed/");
      }

      newChallenge.postLink = linkRestruct;
      newChallenge.templateId = __templateId;
      newChallenge.userId = __userId;

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
      }).catch((err) => {
         console.log("this is err %s", err);
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

      const srcId = link.replace(/(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/+?(embed\/|watch\?v=){0,1}/, ""),
         linkRestruct = "https://www.youtube.com/embed/" + srcId;

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

   // //Dashboard Handlers
   // //===========================
   // $("#challengeCreate").on("click", function(event) {
   //    console.log("challengeCreate clicked");
   //    //should navigate to createChallenge.html
   // });
});