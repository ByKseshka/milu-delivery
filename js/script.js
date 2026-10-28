const products = [
 {id:1,name:"Бокс «Всё и сразу»",category:"Боксы",price:2490,weight:"950 г · на 3–4 человек",tag:"Хит",description:"Сыр, фрукты, оливки и закуски для долгих разговоров.",image:"assets/images/hero-food.svg"},
 {id:2,name:"Бокс «Девичник»",category:"Боксы",price:3290,weight:"1,2 кг · на 4–6 человек",tag:"Для компании",description:"Яркое ассорти, которое сразу задаёт настроение вечеру.",image:"assets/images/gastro-box.svg"},
 {id:3,name:"Канапе party",category:"Закуски",price:1290,weight:"20 шт.",tag:"Популярное",description:"Мини-закуски на один укус — удобно делиться и пробовать.",image:"assets/images/canapes.svg"},
 {id:4,name:"Брускетты микс",category:"Закуски",price:990,weight:"12 шт.",tag:"Новинка",description:"Хрустящий хлеб, нежные начинки и свежие акценты.",image:"assets/images/bruschetta.svg"},
 {id:5,name:"Ягодное настроение",category:"Десерты",price:1190,weight:"600 г",tag:"Сладкое",description:"Нежный десерт с ягодами — красивая точка встречи.",image:"assets/images/dessert.svg"},
 {id:6,name:"Сырный вечер",category:"Боксы",price:2190,weight:"850 г · на 2–3 человек",tag:"Для двоих",description:"Сыры, виноград, орехи и всё для уютного вечера.",image:"assets/images/cheese-board.svg"}
];
const state = {filter:"Все",search:"",cart:[],favorites:new Set(),showFavorites:false};
const $ = (selector,root=document)=>root.querySelector(selector);
const $$ = (selector,root=document)=>[...root.querySelectorAll(selector)];
const money = value => new Intl.NumberFormat("ru-RU").format(value)+" ₽";
const productGrid=$("#product-grid"), cartDrawer=$("#cart-drawer"), overlay=$("#overlay"), toast=$("#toast");
let toastTimer;
function renderProducts(){
 const filtered=products.filter(p=>(state.filter==="Все"||p.category===state.filter)&&p.name.toLowerCase().includes(state.search.toLowerCase())&&(!state.showFavorites||state.favorites.has(p.id)));
 if(!filtered.length){productGrid.innerHTML='<div class="empty-state">Ничего не нашлось. Попробуй другой запрос ✳</div>';return}
 productGrid.innerHTML=filtered.map(p=>'<article class="product-card"><div class="product-photo"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy"><span class="product-tag">'+p.tag+'</span><button class="heart-btn '+(state.favorites.has(p.id)?"is-favorite":"")+'" data-favorite="'+p.id+'" aria-label="'+(state.favorites.has(p.id)?"Убрать из избранного":"Добавить в избранное")+'" aria-pressed="'+state.favorites.has(p.id)+'">'+(state.favorites.has(p.id)?"♥":"♡")+'</button></div><div class="product-info"><div class="product-title-row"><h3>'+p.name+'</h3><span class="product-price">'+money(p.price)+'</span></div><p class="product-description">'+p.description+'</p><div class="product-bottom"><span class="product-weight">'+p.weight+'</span><button class="add-btn" data-add="'+p.id+'">+ В корзину</button></div></div></article>').join("");
}
function renderCart(){
 const count=state.cart.reduce((sum,item)=>sum+item.qty,0), total=state.cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
 $("#cart-count").textContent=count;$("#drawer-count").textContent="("+count+")";$("#cart-total").textContent=money(total);
 $("#fav-count").textContent=state.favorites.size;
 $("#cart-items").innerHTML=state.cart.length?state.cart.map(item=>{const p=products.find(x=>x.id===item.id);return '<article class="cart-item"><img src="'+p.image+'" alt=""><div><h3>'+p.name+'</h3><p>'+money(p.price*item.qty)+'</p><div class="quantity"><button data-qty="'+p.id+'" data-delta="-1" aria-label="Уменьшить количество">−</button><span>'+item.qty+'</span><button data-qty="'+p.id+'" data-delta="1" aria-label="Увеличить количество">+</button></div></div><button class="remove-item" data-remove="'+p.id+'" aria-label="Удалить '+p.name+'">×</button></article>'}).join(""):'<div class="cart-empty">Корзина пока пустая.<br>Самое время добавить что-нибудь вкусное ✳</div>';
}
function notify(message){toast.textContent=message;toast.classList.add("is-visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("is-visible"),2400)}
function openCart(){cartDrawer.classList.add("is-open");cartDrawer.setAttribute("aria-hidden","false");overlay.hidden=false;document.body.classList.add("locked");$("#cart-close").focus()}
function closeCart(){cartDrawer.classList.remove("is-open");cartDrawer.setAttribute("aria-hidden","true");overlay.hidden=true;document.body.classList.remove("locked");$("#cart-open").focus()}
function addToCart(id){const item=state.cart.find(x=>x.id===id);if(item)item.qty++;else state.cart.push({id,qty:1});renderCart();notify("Добавили в корзину ✳")}
productGrid.addEventListener("click",e=>{const add=e.target.closest("[data-add]"),fav=e.target.closest("[data-favorite]");if(add)addToCart(Number(add.dataset.add));if(fav){const id=Number(fav.dataset.favorite);state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);renderProducts();renderCart();if(state.showFavorites)renderProducts()}});
$("#cart-items").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");if(qty){const id=Number(qty.dataset.qty),item=state.cart.find(x=>x.id===id);item.qty+=Number(qty.dataset.delta);if(item.qty<1)state.cart=state.cart.filter(x=>x.id!==id);renderCart()}if(remove){state.cart=state.cart.filter(x=>x.id!==Number(remove.dataset.remove));renderCart()}});
$$(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{state.filter=btn.dataset.filter;$$(".filter-btn").forEach(b=>{const active=b===btn;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active))});state.showFavorites=false;$(".favorite-toggle").classList.remove("is-active");renderProducts()}));
$("#product-search").addEventListener("input",e=>{state.search=e.target.value.trim();renderProducts()});
$(".favorite-toggle").addEventListener("click",()=>{state.showFavorites=!state.showFavorites;$(".favorite-toggle").classList.toggle("is-active",state.showFavorites);state.filter="Все";$$(".filter-btn").forEach(b=>{b.classList.toggle("is-active",b.dataset.filter==="Все");b.setAttribute("aria-pressed",String(b.dataset.filter==="Все"))});renderProducts();$("#menu").scrollIntoView({behavior:"smooth"})});
$$("[data-category-link]").forEach(link=>link.addEventListener("click",()=>{state.filter=link.dataset.categoryLink;state.showFavorites=false;$$(".filter-btn").forEach(b=>{const active=b.dataset.filter===state.filter;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active))});renderProducts()}));
$("#cart-open").addEventListener("click",openCart);$("#cart-close").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);document.addEventListener("keydown",e=>{if(e.key==="Escape"&&cartDrawer.classList.contains("is-open"))closeCart()});
$("#checkout-button").addEventListener("click",()=>{if(!state.cart.length){notify("Сначала добавь что-нибудь вкусное");return}closeCart();$("#contacts").scrollIntoView({behavior:"smooth"});notify("Оставь контакты — согласуем заказ")});
$("#menu-toggle").addEventListener("click",()=>{const open=$("#main-nav").classList.toggle("is-open");$("#menu-toggle").setAttribute("aria-expanded",String(open));$("#menu-toggle").setAttribute("aria-label",open?"Закрыть меню":"Открыть меню")});
$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>{$("#main-nav").classList.remove("is-open");$("#menu-toggle").setAttribute("aria-expanded","false")}));
$("#order-form").addEventListener("submit",e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const name=String(data.get("name")).trim();const phone=String(data.get("phone")).trim();$("#form-status").textContent="Спасибо, "+name+"! Заявка подготовлена. Для реального приёма заказов подключите форму к серверу или CRM.";notify("Спасибо! Заявка заполнена");form.reset()});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();