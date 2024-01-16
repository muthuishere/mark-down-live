const totalAnimationDurationInSeconds = 10;
function hideAndRevealLastElement() {
    const section = document.getElementById('1');

    // Find the last element directly above the footer
    const footer = section.querySelector('footer');
    let textElem = footer.previousElementSibling;

    let storedElementDetails = localStorage.getItem('lastElementDetails');
    storedElementDetails = null;
    const currentElementDetails = textElem.innerHTML;

    // Compare and exit the function if they match
    if (storedElementDetails === currentElementDetails) {
        return;
    }

    // Hide the content of the last element initially
    textElem.style.visibility = 'hidden';





    const transitionSpeed = 'left '+totalAnimationDurationInSeconds+'s';
    // Create the mask div and set its initial styles

//53.4vh
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const lastElementRect = textElem.getBoundingClientRect();
    const mask = document.createElement('div');

    // mask.style.position = 'absolute';
    // mask.style.top = `calc(${(textElem.offsetTop / viewportHeight) * 100}vh + 13.95vh)`;
    // mask.style.left = `calc(${(textElem.offsetLeft / viewportWidth) * 100}vw)`;
    // mask.style.width = `calc(${(lastElementRect.width / viewportWidth) * 100}vw)`;
    // mask.style.height = `calc(${(lastElementRect.height / viewportHeight) * 100}vh + 8.5vh)`;
    // mask.style.backgroundColor = 'white';
    // mask.style.overflow = 'hidden';
    // mask.style.zIndex = '1500';
    // mask.style.transition = transitionSpeed;

    const icon = document.createElement('img');
    icon.src = 'handholding.gif';
    icon.style.position = 'absolute';
    icon.style.top = 'calc(-2vh)'; // May need to be adjusted if icon is larger
    icon.style.left = '0';
    icon.style.height = '128px'; // Fixed pixel height
    icon.style.zIndex = '1600';

    // mask.appendChild(icon);
    document.body.appendChild(icon);

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(textElem.innerHTML, 'text/html');
    const allNodes = Array.from(parsedHtml.body.childNodes);
    textElem.innerHTML = '';

    let words = [];
    allNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            words = words.concat(node.textContent.split(/\s+/).filter(Boolean).map(word => document.createTextNode(word + ' ')));
        } else {
            const clonedNode = node.cloneNode(true);
            clonedNode.textContent.split(/\s+/).filter(Boolean).forEach(word => {
                const newNode = clonedNode.cloneNode();
                newNode.textContent = word + ' ';
                words.push(newNode);
            });
        }
    });

    let currentIndex = 0;
    const revealText = () => {
        if (currentIndex < words.length) {
            const wordSpan = document.createElement('span');
            wordSpan.appendChild(words[currentIndex]);
            textElem.appendChild(wordSpan);

            // Calculate and update the icon's position
            const rect = wordSpan.getBoundingClientRect();
            const containerRect = textElem.getBoundingClientRect();
            icon.style.position = 'absolute';
            icon.style.left = (rect.left - containerRect.left) + 'px';
            icon.style.top = (rect.top - containerRect.top) + 'px';

            currentIndex++;
            setTimeout(revealText, 500); // Adjust timeout to control speed
        }
    };

    setTimeout(revealText, 500);
 console.log("updated");
}

document.addEventListener('DOMContentLoaded', hideAndRevealLastElement);