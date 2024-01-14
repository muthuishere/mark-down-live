

function hideAndRevealLastElement() {
    const section = document.getElementById('1');
    const  slideNavigator = document.querySelector('.bespoke-marp-osc')
    if(slideNavigator)
        slideNavigator.style.visibility = 'hidden';

    // Find the last element directly above the footer
    const footer = section.querySelector('footer');
    let lastElement
    if(footer){
         lastElement = footer.previousElementSibling;
    }else {
        lastElement = section.lastElementChild;

    }



    let storedElementDetails = localStorage.getItem('lastElementDetails');
    // storedElementDetails = null;
    const currentElementDetails = lastElement.innerHTML;


    // Compare and exit the function if they match
    if (storedElementDetails === currentElementDetails) {
        return;
    }

    lastElement.style.visibility = 'hidden';
    let contentsToBeTyped = null;
    let elementToAnimate = null;

    if(currentElementDetails.includes(storedElementDetails)){
       //  // then split the innerHtml and create two variables last and current
       const last = storedElementDetails;
        contentsToBeTyped = currentElementDetails.replace(storedElementDetails,"");
        lastElement.innerHTML = last;
        elementToAnimate = document.createElement("span");
        elementToAnimate.innerHTML = "";
        lastElement.appendChild(elementToAnimate);
        //split the currentElementDetails
    }else{

        contentsToBeTyped = lastElement.innerHTML
        lastElement.innerHTML = '';
        elementToAnimate = lastElement
    }


    //
    // if( 1 === 1)
    //     return
    // Hide the content of the last element initially



    lastElement.style.visibility = 'visible';




    var typewriter = new Typewriter(elementToAnimate, {
        loop: false,
        delay: 75,
        // devMode:true,
    });

    typewriter
        .pauseFor(500)
        .typeString(contentsToBeTyped)

        .pauseFor(1000)
        .callFunction(() => {
            console.log("completed")
            // Store the details of the last element in local storage
            // localStorage.setItem('lastElementDetails', currentElementDetails);
            localStorage.setItem('lastElementDetails', currentElementDetails);
            typewriter.stop();

            //remove the classess added by typewriter , which will be under lastElement



            lastElement.querySelector(".Typewriter__cursor").remove()

        })
        .start();

    window.typewriterInstance = typewriter;



}

document.addEventListener('DOMContentLoaded', hideAndRevealLastElement);