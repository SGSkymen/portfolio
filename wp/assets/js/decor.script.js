const navToggle = document.querySelector('.header__bars');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('feedback-form');
const formStatus = document.getElementById('form-status');


function toggleMenu(){navbar.classList.toggle('menu-open');navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active')?'hidden':'';
}
function closeMenu(){navbar.classList.remove('menu-open');navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}
function smoothScroll(e,targetId){e.preventDefault();
    if(targetId === '#') return; const targetElement = document.querySelector(targetId);
    if(targetElement){ window.scrollTo({top:targetElement.offsetTop -80,behavior:'smooth'});}
}
function createPixelBackground(){const aboutSection = document.querySelector('.about');
    if(!aboutSection) return; const oldBg = document.getElementById('pixel-bg');
    if(oldBg) oldBg.remove(); const pixelContainer = document.createElement('div');

    pixelContainer.className= 'pixel-container';pixelContainer.id= 'pixel-bg'; aboutSection.insertBefore(pixelContainer,aboutSection.firstChild);
    
    const containerWidth = aboutSection.offsetWidth; 
    const containerHeight = aboutSection.offsetHeight; 
    const pixelSize = 20;
    const cols = Math.floor(containerWidth/pixelSize);
    const rows = Math.floor(containerHeight/pixelSize);
    const totalPixels = Math.floor(cols*rows*0.3);
    
for (let i=0; i<totalPixels; i++){const pixel= document.createElement('div'); pixel.className= 'pixel';
    const randomCol = Math.floor(Math.random()*cols); const randomRow = Math.floor(Math.random()*rows);
    const brightness = Math.random()*40 +10; const delay = Math.random()*5;
        
    pixel.style.cssText = `left: ${randomCol*pixelSize}px; top: ${randomRow*pixelSize}px;background-color: rgba(255, 255, 255, ${brightness/100});animation: pixelGlow 3s ease-in-out ${delay}s infinite;`;
    pixel.addEventListener('mouseenter',()=>{pixel.style.backgroundColor= 'rgba(255,255,255,0.6)';
    pixel.style.transform= 'scale(1.5)';});
    pixel.addEventListener('mouseleave',()=>{const newBrightness= Math.random()*40 +10;
    pixel.style.backgroundColor= `rgba(255, 255, 255, ${newBrightness/100})`;
    pixel.style.transform= 'scale(1)';});
    pixelContainer.appendChild(pixel);}
}


function updateActiveLinkOnScroll(){
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY+100;
    
    let currentSectionId= '';sections.forEach(section=>{
        const sectionTop= section.offsetTop;const sectionHeight= section.clientHeight;
        
        if(scrollPosition>= sectionTop && scrollPosition<sectionTop+sectionHeight){currentSectionId= section.getAttribute('id');}
    });
        navLinks.forEach(link=> {link.classList.remove('active'); 
            if(link.getAttribute('href')===`#${currentSectionId}`){link.classList.add('active');}
    });
}


async function handleFormSubmit(e){e.preventDefault();
    const submitButton= this.querySelector('button[type="submit"]');const originalButtonText= submitButton.textContent;
    submitButton.textContent='Отправка...';submitButton.disabled=true;
    
    try{const formData= new FormData(this);const response= await fetch(this.action,{
    method: 'POST',
    body: formData,
    headers: {'Accept':'application/json'}
});   
        if(response.ok){formStatus.textContent='Спасибо! Ваше сообщение отправлено.';formStatus.className='form-status success';
            this.reset(); setTimeout(()=>{ 
                formStatus.textContent='';formStatus.className='form-status';},5000);
        }else{const errorData= await response.json();
            formStatus.textContent= errorData.errors?.map(e => e.message).join(', ') || 'Что-то пошло не так. Попробуйте еще раз.';
            formStatus.className= 'form-status error';}


    }catch(error){
        formStatus.textContent= 'Ошибка сети. Проверьте подключение к интернету.';
        formStatus.className= 'form-status error'; console.error('Form submission error:',error);
    }finally{
        submitButton.textContent = originalButtonText; submitButton.disabled = false;
    }
}


function handleScroll(){updateActiveLinkOnScroll();
    
    if(window.scrollY>50){navbar.classList.add('scrolled');} 
    else{navbar.classList.remove('scrolled');}
}
function initializePage(){const currentHash= window.location.hash;
    if(currentHash){const activeLink= document.querySelector(`.nav-link[href="${currentHash}"]`);
        if(activeLink){activeLink.classList.add('active');}}
    
    createPixelBackground(); 
    setTimeout(()=>{document.body.classList.add('loaded');},100);
}
if(navToggle){navToggle.addEventListener('click',toggleMenu);}
if(menuOverlay){menuOverlay.addEventListener('click',closeMenu);}

navLinks.forEach(link=>{link.addEventListener('click',(e)=>{
        if(navMenu.classList.contains('active')){ closeMenu();}
        smoothScroll(e,link.getAttribute('href'));});
});


document.addEventListener('keydown',(e)=>{if(e.key === 'Escape' && navMenu.classList.contains('active')){ closeMenu();}});


let scrollTimeout; window.addEventListener('scroll',()=>{
    clearTimeout(scrollTimeout);scrollTimeout= setTimeout(handleScroll,50);
});
let resizeTimeout;window.addEventListener('resize',()=>{
    clearTimeout(resizeTimeout);resizeTimeout= setTimeout(()=>{ createPixelBackground();},250);
});
if (contactForm){ contactForm.addEventListener('submit',handleFormSubmit);   const emailInput= document.getElementById('email');
    if(emailInput){ emailInput.addEventListener('blur',function(){   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailPattern.test(this.value)){this.style.borderColor='#ff0000';
                if (formStatus){ formStatus.textContent='Введите корректный email адрес';formStatus.className='form-status error';}
            }else{this.style.borderColor='';
                if (formStatus){ formStatus.textContent='';formStatus.className='form-status';}}
        });
    }contactForm.querySelectorAll('input,textarea').forEach(input=>{ input.addEventListener('input',()=>{

            if (formStatus){ formStatus.textContent='';formStatus.className='form-status';}});});
}


document.addEventListener('DOMContentLoaded',initializePage);


function debounce(func,wait){ 
    let timeout;return function executedFunction(...args){const later=()=>{
            clearTimeout(timeout); func(...args);

        };clearTimeout(timeout); timeout = setTimeout(later,wait);};
}
function throttle(func,limit){
    let inThrottle;return function(){const args= arguments; const context= this;
        if (!inThrottle){func.apply(context,args);inThrottle= true; setTimeout(()=>inThrottle= false,limit);}};
}
