var removeClass = (elem,className)=>{
    elem.forEach(function(i){
        i.classList.remove(className);
     });
}
var showLogin = (elem)=>{
    document.getElementsByClassName('email-login')[0].style.display="block";
    document.getElementsByClassName('email-signup')[0].style.display="none";
    var allElem = document.querySelectorAll('.lb-header a');
    removeClass(allElem,'active');
    elem.classList.add("active");

}
var showSignUp = (elem)=>{
    document.getElementsByClassName('email-login')[0].style.display="none";
    document.getElementsByClassName('email-signup')[0].style.display="block";
    var allElem = document.querySelectorAll('.lb-header a');
    removeClass(allElem,'active');
    elem.classList.add("active");
}


var userUniqueId = "";
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementsByClassName('welcomeNote')[0].style.display="block";
      document.getElementsByClassName('login-box')[0].style.display="none";
      if(user !=null){
          userUniqueId = user.uid;
          var userImg = "";
        //   firebase.database().ref('users/'+userUniqueId+'/profile-dtls/').on('value', function(snapshot){
        //     var userImg = snapshot.val();
        //     console.log(userImg.images);
        //     if(typeof (userImg.images) !==undefined){
        //         document.getElementById('currentUserProfileImg').setAttribute('src', userImg);
        //     }
        //   });
          window.localStorage.setItem("userEmail", user.email);
          if( user.displayName !== null){
            document.getElementById('welcomNote').innerHTML=user.displayName;
            alert( user.displayName);
          }else{
            document.getElementById('welcomNote').innerHTML=user.email;
          }
          
          
          
      }
    } else {
      // No user is signed in.
      document.getElementsByClassName('welcomeNote')[0].style.display="none";
      document.getElementsByClassName('login-box')[0].style.display="block";
    }
});

/*
function for Normal login 
*/
var logIn = ()=>{
   var email =  document.getElementById('logInEmail').value;
   var pass  =  document.getElementById('logInPass').value;
//    console.log(email, pass);
   firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
  });   
}


var signUp = ()=>{
    var email =  document.getElementById('regEmail').value;
    var pass  =  document.getElementById('regPass').value;
    var userName = document.getElementById('regiFullname').value;

    var userImg = document.getElementById('ppRegitme').getAttribute("src");

    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user) {
        // [END createwithemail]
        // callSomeFunction(); Optional

        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: userName,
            displayImg: userImg
        }).then(function() {
            // Update successful.
        }, function(error) {
            // An error happened.
        });  
        firebase.database().ref("users/"+user.uid+'/profile-dtls').set({
            myUid : user.uid,
            displayName: userName,
            images: userImg,
        });
        
    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            console.error(error);
        }
        alert(errorMessage);        
    });



 }


var logOut = ()=>{
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
        alert("Sign Out successfully")
    }).catch(function(error) {
    // An error happened.
        alert(error);
    });
}



//function for google login 
var googleLogin = ()=>{
    alert("abcd");
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().useDeviceLanguage();
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        // console.log(user);
    }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    });
}







//fucntion for 
var getDataFormDatabse= ()=>{    
    var leadsRef = firebase.database().ref('messages');
    leadsRef.on('value', function(snapshot) {
        var arr = [];
        var lenth = snapshot.length;
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            arr.push(childData);
        });  
        // console.log(arr);
    });
}

var commentsRef = firebase.database().ref('usersMsg/');
commentsRef.on('child_added', function(data) {
    // alert("aa");
    var myUserId = firebase.auth().currentUser.uid;
    var myUserEmail = firebase.auth().currentUser.email;
    var to = document.getElementById("senderName").getAttribute('data-email');
    var xx= data.val().msg;
    if(data.val().from == myUserEmail && data.val().to == to ){        
        var x = `<div class="message parker">${xx}</div>`;
    }else if(data.val().to == myUserEmail && data.val().from == to){
        var x = `<div class="message stark">${xx}</div>`;
        // document.getElementById("lastMsg").innerHTML = xx;
    }else{
        var x = "";
    }
    document.getElementById("chat").innerHTML+=x;
    autoScroll();
});
commentsRef.on('child_changed', function(data) {
    alert("change");
    // setCommentValues(postElement, data.key, data.val().text, data.val().author);
});
commentsRef.on('child_removed', function(data) {
    deleteComment(postElement, data.key);
});
// commentsRef.on('child_changed', function(data) {
//     setCommentValues(postElement, data.key, data.val().text, data.val().author);
// });






/*
===============================
1. only for chat making 
===============================
*/
var chatingPerson = window.location.hash.split("#")[1];
document.getElementById("senderName").setAttribute("data-email", chatingPerson);

var chatKeyUp = (e, tables)=>{
    var x = e.which || e.keyCode;
    var val = tables.value;
    if(x==13){
        sendMessage(val, tables);
    }
}
var sendMessage = (val, tables)=>{
    tables.value = "";
    // Get a reference to the database service
    var senderEmailTo = document.getElementById("senderName").getAttribute('data-email');
    var myUserId = firebase.auth().currentUser.email;
    function writeUserData(userId, email, val) {
        firebase.database().ref('usersMsg/').push().set({
          to: userId,          
          msg: val,
          from: email,         
        });
      }writeUserData(senderEmailTo,  myUserId, val);
}


function autoScroll(){
    // Add smooth scrolling to all links
    $('#chat').animate({
        scrollTop:  $('#chat').outerHeight()
    }, 800, function(){

    });
}


// 
/*
===============================
2. only for Clicking on Contacts
===============================
*/
changeChatPerson = (elem) => {
   var senderEmail = elem.getAttribute("contact-email");
   window.location.hash = senderEmail;
}

makeContact =()=>{
    $("#addContact").on("click", function(){
        var emailName = $("#addContactId").val();
        var myUserId = firebase.auth().currentUser.email;
        // window.localStorage.push("myUserEmail", myUserId)

        var newPostKey = firebase.database().ref('msg-timeline/').child('msges').push().key;   
        firebase.database().ref('msg-timeline/').child('msges').push().set({
            created: true,
            person2: emailName,
            person1: myUserId,
        });
        var clearEmailName = emailName.replace(/[.]/g, "-*dot*-");
        var clearMyUserId = myUserId.replace(/[.]/g, "-*dot*-");
        // console.log(newPostKey);


        
       
        firebase.database().ref('user-info/'+clearMyUserId+'/contact/'+clearEmailName+'/').set({
            timelineid: newPostKey,
            timestamp: new Date().getTime(),         
          });
        firebase.database().ref('user-info/'+clearEmailName+'/contact/'+clearMyUserId+'/').set({
            timelineid: newPostKey,
            timestamp: new Date().getTime(),         
        });

    });

}
makeContact ();


let arc=()=>{
    var selftEmail = window.localStorage.userEmail.replace(/[.]/g, "-*dot*-");
    // console.log(selftEmail);
    // console.log(selftEmail);
    var commentsRef = firebase.database().ref('user-info/'+selftEmail+'/contact/');
    // commentsRef.on("")

    commentsRef.on('child_added', function(data) {
        var htmlar ="";
        var dataOrg = data.ref.key;
        // alert(sdfsdf)
        console.log(dataOrg.replace(/-\*dot\*-/g, "."));
        
        htmlar += `<div onclick="changeChatPerson(this);" class="contact contactList" contact-email="${dataOrg.replace(/-\*dot\*-/g, ".")}">
                    <div class="pic">
                        <img src="images/noimage.png">
                    </div>
                    <div class="name">
                    ${dataOrg.replace(/-\*dot\*-/g, ".")}
                    </div>
                    <div class="message" id="lastMsg">
                        ...
                    </div>
                </div>`;
        $(".contactInr").append(htmlar);
    });
    
    
}
arc();










$(".addPerson").on("click", function(){
    $(this).toggleClass("active")
    $(this).siblings(".addPersonForm").fadeToggle();
});


function readURL(input, imgChange) {
    imgChange.attr('src', "images/noImg.jpg").hide().fadeIn(0);
    imgChange.closest('.dragAndDrop').find('.fileHide').removeClass('active');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            imgChange.attr('src', e.target.result).hide().fadeIn(0);
        }
        reader.readAsDataURL(input.files[0]);
        imgChange.closest('.dragAndDrop').find('.fileHide').addClass('active');
    }
}
$('#profilePicture').change(function () {
    var imgChange = $(this).siblings('img');
    readURL(this, imgChange);
});