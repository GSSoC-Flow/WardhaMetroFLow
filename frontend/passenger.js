const toggle = document.querySelector('.mode-toggle-button'); 
const body = document.body;
// for toggling navbar
const header = document.querySelector('.header');
const main = document.querySelector('.planner-form');



toggle.addEventListener('click', () => {
    const currentBg = getComputedStyle(body).backgroundImage;

    const gradient = 'linear-gradient(135deg, rgb(254, 215, 170) 0%, rgb(253, 186, 116) 25%, rgb(134, 239, 172) 75%, rgb(74, 222, 128) 100%)';

    if (currentBg.includes('linear-gradient')) {
        toggle.textContent = '🌤️ Daylight Mode'; 

        body.style.backgroundImage = 'none';
        body.style.backgroundColor = 'black';
        body.style.color = 'white';

        header.style.backgroundColor='black';
        header.style.color='rgb(0,0,0)';

        main.style.backgroundColor='rgb(0,0,0)';
                               

        console.log("Light To Dark");
    } else {
        toggle.textContent = '🌙 Eclipsed Mode';

        body.style.backgroundImage = gradient; 
        body.style.color = 'black';

        header.style.backgroundColor='white';
        header.style.color='black';   

        main.style.backgroundImage=gradient;
       
        console.log("Dark To Light");
    }
});



// rgb(0,0,0) : black
// rgb(255,255,255) : white