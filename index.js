
const images = [
  'media/img1.jpg',
  'media/img2.jpg',
  'media/img3.jpg',
  'media/img6.jpg',
  'media/img7.jpg'
];

const background = document.getElementById('background');
let index = 0;
let timer = null;

// cache simple de cargas
const loaded = new Map();
function preload(src){
  return new Promise((resolve, reject) => {
    if (loaded.get(src)) return resolve();
    const img = new Image();
    img.onload = () => { loaded.set(src, true); resolve(); };
    img.onerror = reject;
    img.src = src;
  });
}

async function setBackground(src){
  // asegura que la imagen esté en caché antes de mostrarla
  await preload(src);
  // mini fade
  background.style.opacity = 0;
  requestAnimationFrame(() => {
    background.style.backgroundImage = `url("${src}")`;
    // fuerza reflow para que la transición aplique
    void background.offsetHeight;
    background.style.opacity = 1;
  });
}

async function startSlideshow(){
  // 1) Carga y muestra la primera; recién ahí aparece el contenedor
  await setBackground(images[0]);
  background.classList.add('ready');

  // 2) Pre-carga el resto en paralelo
  images.slice(1).forEach(preload);

  // 3) Rotación normal
  timer = setInterval(async () => {
    index = (index + 1) % images.length;
    await setBackground(images[index]);
  }, 3000);
}

// Inicia cuando el DOM está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startSlideshow);
} else {
  startSlideshow();
}




let traslates = {};

fetch('text.json')
  .then(response => response.json())
  .then(data => {
    traslates = data;
    const lang = localStorage.getItem("lang") || "es";
    console.log(lang)
    setLanguage(lang);
  })
  .catch(error => console.error("Error al cargar el archivo JSON", error));


function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.getElementById("main_title").textContent = traslates[lang].title;
  document.getElementById("main_text").textContent = traslates[lang].main_text;
  document.getElementById("act_Button").textContent = traslates[lang].act_Button;
  const container = document.getElementById("info_text1");
  const paragraphs = traslates[lang].info_text1;
  container.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join("");

  document.getElementById("title_list").textContent = traslates[lang].title_list;
  document.getElementById("li1").textContent = traslates[lang].li1;
  document.getElementById("li2").textContent = traslates[lang].li2;
  document.getElementById("li3").textContent = traslates[lang].li3;
  document.getElementById("li4").textContent = traslates[lang].li4;
  document.getElementById("contact_title").textContent = traslates[lang].contact_title;
  document.getElementById("name").placeholder = traslates[lang].nombre;
  document.getElementById("apellido").placeholder = traslates[lang].apellido;
  document.getElementById("email").placeholder = traslates[lang].email;
  document.getElementById("message").placeholder = traslates[lang].mensaje;
  document.getElementById("send_button").value = traslates[lang].send_button;


}

const form = document.getElementById("form_container")
const btn = document.getElementById('send_button');

form.addEventListener('submit', function(event) {
   event.preventDefault();

    const serviceID = 'default_service';
    const templateID = 'template_b0a7qnh';
    const lang = localStorage.getItem("lang") || "es";
   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      
      form.reset();
      Swal.fire({
        icon: 'success',
        title: traslates[lang].title_alert,
        text: traslates[lang].text_alert,
        confirmButtonText: traslates[lang].confirm_ButtonText,
        showClass: { popup: 'swal2-show' },
        hideClass: { popup: 'swal2-hide' }
      });
    }, (err) => {
      btn.value = 'Send Email';
      Swal.fire({
        icon: 'error',
        title: traslates[lang].alert_error_title,
        text: traslates[lang].alert_error_text,
        footer: `<pre style="text-align:left;white-space:pre-wrap">${JSON.stringify(err, null, 2)}</pre>`
      });
    });
});