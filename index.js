

const images = [
  'media/img1.jpg',
  'media/img2.jpg',
  'media/img3.jpg',
  'media/img6.jpg',
  'media/img7.jpg'
];

const background = document.getElementById('background');
let index = 0


const change_background = () => {
    background.style.backgroundImage = `url(${images[index]})`;
    index = (index + 1) % images.length;
}

change_background();
setInterval(change_background, 3000);


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

const btn = document.getElementById('send_button');

document.getElementById('form_container')
  .addEventListener('submit', function(event) {
   event.preventDefault();

   const serviceID = 'default_service';
   const templateID = 'template_b0a7qnh';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});