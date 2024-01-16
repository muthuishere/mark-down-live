


function hideLastElements() {
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
    // console.log("lastElement hidden " , lastElement)
    originalLastElement.style.visibility = 'hidden';

    // window.typewriterInstance = typewriter;



}
hideLastElements();

// document.addEventListener('DOMContentLoaded', hideLastElements);