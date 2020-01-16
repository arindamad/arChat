firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementById('profileEdit').style.display="block";
      document.getElementById('profileElse').style.display="none";
      if(user !=null){
          userUniqueId = user.uid;
         console.log(user.name);
         document.getElementById('popName').value = user.displayName;
         document.getElementById('popemailId').value = user.email;
        //  document.getElementById('popemailId').value = user.email;

        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
         
      }


    } else {
      // No user is signed in.
      document.getElementById('welcomeNote').style.display="none";
      document.getElementById('profileElse').style.display="block";
    }
});


saveProfileData = ()=>{
    //https://firebase.google.com/docs/auth/admin/manage-users#update_a_user
    alert("ss")
    firebase.auth().currentUser.displayName = document.getElementById('popName').value;

}


















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
$('#input-1').change(function () {
    var imgChange = $('#imgUploadSect .imgContainer img');
    readURL(this, imgChange);
    $(this).siblings('.fileUploadLabel').html('<i class="fa fa-refresh"></i> Change');
});