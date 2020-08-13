for (var i = 0; i < 10; i++) {
  $('#support-agent').append('<img src="./images/man.png" alt="man" class="element">');
}
$('.element').each(function( index ) {
  $(this).css({
    left : Math.random() * ($('#support-agent').width() - $(this).width()),
    top : Math.random() * ($('#support-agent').height() - $(this).height())
  });
});

var elements = document.getElementsByClassName('element');
var target = document.getElementsByClassName('target')[0];
var button = document.getElementById('button');

// store the x,y coordinates of the target
var xT = target.offsetLeft;
var yT = target.offsetTop;

// add a click event listener to the button
button.addEventListener('click', function() {
  for(var i = 0; i < elements.length; i++) {
    // store the elements coordinate
    var xE = elements[i].offsetLeft;
    var yE = elements[i].offsetTop;
    // set the elements position to their position for a smooth animation
    elements[i].style.left = xE + 'px';
    elements[i].style.top = yE + 'px';
    // set their position to the target position
    // the animation is a simple css transition
    elements[i].style.left = xT + 'px';
    elements[i].style.top = yT + 'px';
  }
});
