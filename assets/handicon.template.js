const totalAnimationDurationInSeconds = 10;
function hideAndRevealLastElement() {
    const section = document.getElementById('1');

    // Find the last element directly above the footer
    const footer = section.querySelector('footer');
    let lastElement = footer.previousElementSibling;

    let storedElementDetails = localStorage.getItem('lastElementDetails');
    storedElementDetails = null;
    const currentElementDetails = lastElement.innerHTML;

    // Compare and exit the function if they match
    if (storedElementDetails === currentElementDetails) {
        return;
    }

    // Hide the content of the last element initially
    lastElement.style.visibility = 'hidden';





    const transitionSpeed = 'left '+totalAnimationDurationInSeconds+'s';
    // Create the mask div and set its initial styles

//53.4vh
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const lastElementRect = lastElement.getBoundingClientRect();
    const mask = document.createElement('div');
console.log("lastElement.offsetTop" + lastElement.offsetTop)
    console.log("lastElement.offsetLeft" + lastElement.offsetLeft)
    console.log("lastElementRect." + lastElementRect)
    console.log("lastElementRect.height" + lastElementRect.height)




    mask.style.position = 'absolute';
    // mask.style.top = `${lastElement.offsetTop+100}px`;
    const additionalTopOffset = 100; // The fixed additional offset you've given
    const relativeTopOffset = (additionalTopOffset / 913) * 100; // Convert it to a percentage of the 1920x1080 screen height

// Use this percentage to set the mask's top style, adding it to the lastElement's top offset percentage
    mask.style.top = `calc(${(lastElement.offsetTop / viewportHeight) * 100}vh + ${relativeTopOffset}vh)`;
    mask.style.left = `calc(${(lastElement.offsetLeft / viewportWidth) * 100}vw)`;
    mask.style.width = `calc(${(lastElementRect.width / viewportWidth) * 100}vw)`;



    const iconHeight = 128;
    //
    //
    // if (maskHeight < iconHeight) {
    //     maskHeight = iconHeight;
    // }
    //
    // mask.style.height = `${maskHeight}px`;
// Calculate the mask height based on the height of the last element or the icon height, whichever is greater
    let maskHeight = Math.max(lastElementRect.height, iconHeight);

// Convert the mask height to a percentage of the innerHeight
    const maskHeightPercentage = (maskHeight / 913) * 100;

// Set the mask's height style using the calculated percentage
    mask.style.height = `calc(${maskHeightPercentage}vh)`;


    mask.style.backgroundColor = 'white';
    mask.style.overflow = 'hidden';
    mask.style.zIndex = '1500';
    mask.style.transition = transitionSpeed;

    const fingerIcon = document.createElement('img');
    fingerIcon.src = 'handholding.gif';
    fingerIcon.style.position = 'absolute';
    fingerIcon.style.top = 'calc(-2vh)'; // May need to be adjusted if icon is larger
    fingerIcon.style.left = '0';
    fingerIcon.style.height = `${iconHeight}px`; // Fixed pixel height
    fingerIcon.style.zIndex = '1600';

    mask.appendChild(fingerIcon);
    document.body.appendChild(mask);
    function displayTextWidth(text, element) {
        // Create a canvas element for measuring text width
        let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
        let context = canvas.getContext("2d");

        // Use the computed style of the element to get accurate font properties
        let style = window.getComputedStyle(element);
        let font = style['font-style'] + " " + style['font-variant'] + " " + style['font-weight'] + " " + style['font-size'] + " / " + style['line-height'] + " " + style['font-family'];

        // Set the context font to the computed font style
        context.font = font;

        // Measure the text width
        let metrics = context.measureText(text);
        return metrics.width;
    }

    // Delay to ensure the initial state is rendered
    setTimeout(() => {
        // Reveal the content and start sliding the mask
        fingerIcon.style.visibility = 'visible';
        lastElement.style.visibility = 'visible';

        let textWidth = displayTextWidth(lastElement.textContent, lastElement);
        const boundingRectWidth = lastElement.getBoundingClientRect().width;

        if(textWidth > boundingRectWidth) {
            textWidth = boundingRectWidth;
        }else {
            textWidth = textWidth + 41;
        }



        console.log(lastElement);
        // mask.style.left = '20vw'; // Slide the mask to the right
        //  mask.style.left = `calc(${(lastElementRect.right / viewportWidth) * 100}vw)`; // Slide the mask to the right within the last element
        // mask.style.left = `calc(187vh)`
        mask.style.width =  textWidth  + 'px'
        const leftPositionFor1920by1080 = 1700;
        const leftPercentage = (leftPositionFor1920by1080 / 1920) * 100;

// Use this percentage to set the mask's left style
        mask.style.left = `calc(${leftPercentage}vw)`;

// Set the mask's left style dynamically
//         mask.style.left = `calc(${dynamicLeftPercentage}vw)`;

        // mask.style.left = (lastElementRect.left +  textWidth)  + 'px'
        // mask.style.width =  textWidth  + 'px'
        //
        // let textWidth = displayTextWidth(lastElement.textContent.trim(), lastElement);
        // const boundingRectWidth = lastElement.getBoundingClientRect().width;
        //
        // Adjust textWidth to not exceed the boundingRectWidth
        // textWidth = Math.min(textWidth, boundingRectWidth);

        // Adjust the mask's left position to the left of the last element
        // and set the mask's width to the textWidth or the boundingRectWidth
        // mask.style.left = `${lastElementRect.left}px`;
        mask.style.width = `${textWidth}px`;

    }, 100);

    // Optional: remove the mask after the animation is complete
    const totalTime = totalAnimationDurationInSeconds * 1000 + 100;;
    console.log('totalTime' + totalTime);
    setTimeout(() => {
        console.log('removing mask');
       // mask.remove();
        localStorage.setItem('lastElementDetails', currentElementDetails);
    }, totalTime); // 2 seconds for animation + 100ms buffer
}

document.addEventListener('DOMContentLoaded', hideAndRevealLastElement);