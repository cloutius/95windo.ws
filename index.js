// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background.png')"; 
}





// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger2 (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background2.png')";
}



// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger3 (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background3.gif')";
}



// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger4 (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background4.png')";
}




// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger5 (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background5.gif')";
}



// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger6 (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background6.png')";
}




// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger7 (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background7.png')";
}




// Add Class Function
function addClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
// Remove Class Function
function removeClass(id, className) {
  var el = document.getElementById(id);
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
// Toggle Class Function
// https://www.w3schools.com/howto/howto_js_toggle_class.asp
function toggleClass(id , className) {
  var el = document.getElementById(id);

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// Background changer
function bgChanger8 (imgUrl) {
  document.body.style.backgroundImage = "url('system/images/background8.png')";
}