const container = document.querySelector('#container');
const injection = document.querySelector('#injection');
const pointsDiv = document.querySelector('#pointsDiv');

// add mousemove event listener to container to control injection position
container.addEventListener('mousemove', e => {
    injection.style.left = (e.clientX - 12.5) + 'px';
})



// create array to save corona objects 
const coronaArr = [];

// interval to generate coronDivs
setInterval(() => {

// get container width
let containerWidth = container.offsetWidth;

// create corona div element
const coronaDiv = document.createElement('div');

// set class for corona div
coronaDiv.classList.add('corona');

// set the left position for the div randomly
let coronaLeft = Math.floor(Math.random() * containerWidth) + 1;

coronaDiv.style.left = coronaLeft + 'px';

// add coronaDiv to container
container.append(coronaDiv);

// create corona object
let coronaObj = {
    coronaElement: coronaDiv,
    top: 0,
    left: coronaLeft
}

// add the coronaObj to coronaArr
coronaArr.push(coronaObj)

}, 1000)


let lost = 0;


// create interval to move the coronaDivs down by increasing the top property on them style
setInterval(() => {

    // get height of the container
    let containerHeight = container.offsetHeight;



    // loop through coronaArr to change the top of coronaElements
    coronaArr.forEach((element, idx) => {
        // check the top of coronaDiv is greater than the container height so we need to delete the coronadiv
        if ( element.top > containerHeight) {
            // delete corona element from HTML (DOM)
            container.removeChild(element.coronaElement);
            // delete the element from the array
            coronaArr.splice(idx, 1);
            lost++;
            pointsDiv.innerHTML = 'Score: ' + score + ' ||| Lost:' + lost;

        } else {
            element.top += 10; // element.top = element.top + 10;
            element.coronaElement.style.top = element.top + 'px';
        }
        
    })
}, 50);

// create bullet sound
let bulletSound = document.createElement('audio')
bulletSound.src = './sounds/sounds_bullet.wav';
bulletSound.setAttribute('controls', 'none');
bulletSound.setAttribute('preload', 'auto');
bulletSound.style.display = 'none';
bulletSound.volume = 0.4;
container.append(bulletSound);

// create game sound
let gameSound = document.createElement('audio')
gameSound.src = './sounds/sounds_game.mp3';
gameSound.setAttribute('controls', 'none');
gameSound.setAttribute('preload', 'auto');
gameSound.style.display = 'none';
gameSound.volume = 0.4;
gameSound.loop = true;
container.append(gameSound);


// create click event listener for container to create the bullet
container.addEventListener('click', e => {
    //play gameSound
    gameSound.play();
    // play bulletSound
    bulletSound.play();

    //create bullet html element
    const bulletDiv = document.createElement('div');

    // set class to bullet div
    bulletDiv.classList.add('bullet');

    // set left position for bulletDiv
    bulletDiv.style.left = e.clientX + 'px';

    // add bulletDiv to container
    container.append(bulletDiv);


    // set the start bottom for the bulletDiv
    let bottom = 100;

    // get container height
    let containerHeight = container.offsetHeight;

    // create set interval to make the bullets move to top
    const interval = setInterval(() => {
        
        // check the bullet is outside the container so we need to delete the bullet div and kill the interval
        if (bottom > containerHeight) {
            clearInterval(interval);
            container.removeChild(bulletDiv);
            
        } else {
            bottom += 25;
            bulletDiv.style.bottom = bottom + 'px';
            // call explode function to detect if bulletDiv touch  a coronaDiv
            explode(bulletDiv, interval);
        }

    }, 50);
    
})


// create explosion sound
let explosionSound = document.createElement('audio')
explosionSound.src = './sounds/sounds_explosion.wav';
explosionSound.setAttribute('controls', 'none');
explosionSound.setAttribute('preload', 'auto');
explosionSound.style.display = 'none';
explosionSound.volume = 0.1;
container.append(explosionSound);

let score = 0;
// explode function to detect if bulletDiv touch  a coronaDiv
function explode (bulletElement, interval) {

    // loop through coronaArr 
    coronaArr.forEach((corona, idx) => {
        // check if coronaElement is in the same areawith the bulletElement
        if (is_colliding(bulletElement, corona.coronaElement)) {
            clearInterval(interval);
            container.removeChild(bulletElement);
            coronaArr.splice(idx, 1);
            container.removeChild(corona.coronaElement);
            score++; // score = score + 1;  score +=1;
            pointsDiv.innerHTML = 'Score: ' + score + ' ||| Lost:' + lost;
            explosionSound.play();


        }
    })
}




var is_colliding = function( $div1, $div2 ) {
	// Div 1 data
	//var d1_offset             = $div1.offset();
	var d1_height             = $div1.offsetHeight;
	var d1_width              = $div1.offsetWidth;
	var d1_distance_from_top  = $div1.offsettop + d1_height;
	var d1_distance_from_left = $div1.offsetLeft + d1_width;

	// Div 2 data
	//var d2_offset             = $div2.offset();
	var d2_height             = $div2.offsetHeight;
	var d2_width              = $div2.offsetWidth;
	var d2_distance_from_top  = $div2.offsetTop + d2_height;
	var d2_distance_from_left = $div2.offsetLeft + d2_width;

	var not_colliding = ( d1_distance_from_top < $div2.offsetTop || $div1.offsetTop > d2_distance_from_top || d1_distance_from_left < $div2.offsetLeft || $div1.offsetLeft > d2_distance_from_left );

	// Return whether it IS colliding
	return ! not_colliding;
};