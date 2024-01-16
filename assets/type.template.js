


async function updateIndexPage(htmlText){
    // fetch buffer.html
    try {
        // // Fetch the HTML file
        // const response = await fetch('buffer.html');
        //
        // // Check if the response is OK
        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }
        //
        // // Get the text content
        // const htmlText = await response.text();
        //console.log("htmlText",htmlText)

        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Get the section element
        // const sectionElement = doc.querySelector('section');
        const currentSection=        document.getElementById('1');
        const newSection=        doc.getElementById('1');
        // console.log("currentSection",currentSection)
        // console.log("newSection",newSection)
        // //
        // console.log("morphdom",morphdom)
        morphdom(currentSection, newSection);
        hideAndRevealLastElement();
        // Return the section element
        // return sectionElement;
    } catch (error) {
        console.error('Error fetching and parsing buffer.html:', error);
    }

}
function saveTotalNodesInSection(totalNodesInSection){
    // const section = document.getElementById('1');
    // const totalNodesInSection = section.childNodes.length
    localStorage.setItem('totalNodesInSection', "" + totalNodesInSection);

}
function getTotalNodesInSection(){
    // const section = document.getElementById('1');
    // const totalNodesInSection = section.childNodes.length
    const totalNodes  = localStorage.getItem('totalNodesInSection');
    if (totalNodes){
        return parseInt(totalNodes);
    }else
        return -1;


}

function handleSingleElement(lastElement, totalNodesInSection) {
    let originalLastElement = lastElement;
    // console.log("lastElement hidden ", lastElement)
    originalLastElement.style.visibility = 'hidden';


    let storedElementDetails = localStorage.getItem('lastElementDetails');
    // storedElementDetails = null;

    // console.log(lastElement)
    if (lastElement.tagName === 'UL' || lastElement.tagName === 'OL') {
        // lastElement.style.visibility = 'visible';
        // console.log("changing last element to li")

        const elements = lastElement.querySelectorAll('li');
        lastElement = elements[elements.length - 1]; // Update lastElement to the child element

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


    if (currentElementDetails.includes(storedElementDetails)) {
        //  // then split the innerHtml and create two variables last and current
        const last = storedElementDetails;
        contentsToBeTyped = currentElementDetails.replace(storedElementDetails, "");
        lastElement.innerHTML = last;
        elementToAnimate = document.createElement("span");
        elementToAnimate.innerHTML = "";
        lastElement.appendChild(elementToAnimate);

    } else {

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
            saveTotalNodesInSection(totalNodesInSection)
            // typewriter.stop();

            //remove the classess added by typewriter , which will be under lastElement


            elementToAnimate.querySelector(".Typewriter__cursor").remove()

        })
        .start();
}

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

    let totalNodesInSection = section.childNodes.length
    if(footer){
        totalNodesInSection = totalNodesInSection - 1
    }
    let formattedTotalNodesInSection = "" + totalNodesInSection

    const previousTotalNodesInSection = getTotalNodesInSection();

    const addedNodes = totalNodesInSection - previousTotalNodesInSection;

    //if totalNodesInSection is 1
        // or if addedNodes is 1 or zero

    // if previousTotalNodesInSection is equal to current totalNodesInSection  or if previousTotalNodesInSection is equal to -1 then we are in the first slide
    handleSingleElement( lastElement, totalNodesInSection);


    // window.typewriterInstance = typewriter;



}

document.addEventListener('DOMContentLoaded', hideAndRevealLastElement);