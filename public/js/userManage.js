
function showCopiedSnackbar() {
     let snackbar = document.getElementById("copied-snackbar");
     snackbar.className = "show";
     setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 2000)
}

function copyToClipboard() {
     let userId = document.getElementById("user-id").innerText;
     navigator.clipboard.writeText(userId)
     showCopiedSnackbar()
}

