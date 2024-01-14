


function hideAndRevealLastElement() {
    const section = document.getElementById('1');
    const  slideNavigator = document.querySelector('.bespoke-marp-osc')
    if(slideNavigator)
        slideNavigator.style.visibility = 'hidden';

    // Find the last element directly above the footer
    const footer = section.querySelector('footer');
    let lastElement
    let originalLastElement
    if(footer){
         lastElement = footer.previousElementSibling;
    }else {
        lastElement = section.lastElementChild;

    }

     originalLastElement = lastElement;
    console.log("lastElement hidden " , lastElement)
    originalLastElement.style.visibility = 'hidden';



    let storedElementDetails = localStorage.getItem('lastElementDetails');
    // storedElementDetails = null;

    // console.log(lastElement)
    if (lastElement.tagName === 'UL' || lastElement.tagName === 'OL') {
        // lastElement.style.visibility = 'visible';
        // console.log("changing last element to li")

        const elements = lastElement.querySelectorAll('li');
        lastElement = elements[elements.length -1]; // Update lastElement to the child element

    }

    const currentElementDetails = lastElement.innerHTML;

    // console.log("lastElement " , lastElement)

    // Compare and exit the function if they match
    if (storedElementDetails === currentElementDetails) {
        originalLastElement.style.visibility = 'visible';
        // lastElement.style.visibility = 'visible';
        return;
    }

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


    elementToAnimate.innerHTML = "";

    originalLastElement.style.visibility = 'visible';
    // elementToAnimate.style.visibility = 'visible';




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
            //
            // Store the details of the last element in local storage
            // localStorage.setItem('lastElementDetails', currentElementDetails);
            localStorage.setItem('lastElementDetails', currentElementDetails);
           // typewriter.stop();

            //remove the classess added by typewriter , which will be under lastElement



            elementToAnimate.querySelector(".Typewriter__cursor").remove()

        })
        .start();

    // window.typewriterInstance = typewriter;



}

document.addEventListener('DOMContentLoaded', hideAndRevealLastElement);