// Google Apps Script Web App URL (Paste your URL once deployed. If empty, uses LocalStorage/Firebase only)
const GOOGLE_SCRIPT_URL = "";

// Vercel API backend. Keep this as the Vercel project URL while the public page stays on GitHub Pages.
// If the project URL changes after deployment, update only this value and admin.html.
const NEXTT_BACKEND_API_BASE = "https://nextt-sustainable-salon.vercel.app";
const NEXTT_RSVP_API_URL = NEXTT_BACKEND_API_BASE
    ? `${NEXTT_BACKEND_API_BASE.replace(/\/$/, '')}/api/rsvp`
    : "";
const NEXTT_KOL_API_URL = NEXTT_BACKEND_API_BASE
    ? `${NEXTT_BACKEND_API_BASE.replace(/\/$/, '')}/api/kol`
    : "";

// =================【Firebase 雲端設定區】=================
// 請至 Firebase Console 建立專案並獲取網頁應用程式配置參數貼在此處。
// 若為預設 placeholder 值，系統將自動啟用地端 LocalStorage 測試與相容模式。
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let db = null;
let auth = null;
let isFirebaseEnabled = false;

if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    isFirebaseEnabled = true;
}

// Default Database constants to fall back on
const defaultBrands = {
    "yufu": {
        name: "一夫水產",
        badge: "科技與環境永續",
        tag: "#24H溫室循環水養殖",
        desc: "以頂級水產為引，分享永續養殖觀點。採用 24H 溫室循環水養殖，透過物理過濾與專利益生菌系統，保證無抗生素與防腐劑，帶給餐桌最純粹的鮮甜體驗。",
        metric1: "100%",
        metric1Lbl: "無抗生素與藥殘",
        metric2: "24H",
        metric2Lbl: "溫室純淨循環水",
        videoUrl: "https://www.youtube.com/embed/kJASthYFG54", 
        land: 0,
        water: 500,
        waste: 0,
        jobs: 0.1,
        contactUrl: "https://oashop.line.me/shops/eqh9088q",
        contactType: "line",
        contactLabel: "前往 LINE 商城"
    },
    "yunchang": {
        name: "緣長好事",
        badge: "精緻文創與高毛利禮盒",
        tag: "#地方創生",
        desc: "誕生於台灣花生的故鄉——雲林元長。承載家族三代農業傳承，看見農村老化與地方價值不易被看見的現況，決定串連在地小農，以「地方創生 × 祝福文化 × 文創設計」為核心，顛覆傳統花生糖太甜、不健康的刻板印象，打造出兼具人情味與洗練質感的「減糖花生禮盒」。",
        metric1: "35%",
        metric1Lbl: "研發精準減糖",
        metric2: "3 代",
        metric2Lbl: "家族職人手藝",
        videoUrl: "https://www.instagram.com/p/DSB0g-lkmx6/",
        land: 5,
        water: 0,
        waste: 0,
        jobs: 0.15,
        contactUrl: "https://line.me/R/ti/p/@899rxilc",
        contactType: "line",
        contactLabel: "與品牌 LINE 聯繫"
    },
    "chuanyong": {
        name: "川涌果園",
        badge: "循環經濟與減廢",
        tag: "#100%柑橘格外品升級再造",
        desc: "深耕在地並實行友善減碳耕作，創意將賣相不佳的格外品與果皮 100% 升級再造，製成柑橘米香與果醋。為格外品找到綠色加值新出路，減少碳足跡與剩食浪費。",
        metric1: "0%",
        metric1Lbl: "化學除草劑殘留",
        metric2: "100%",
        metric2Lbl: "格外品柑橘利用",
        videoUrl: "https://www.youtube.com/embed/s-Rldo9qRpw",
        land: 8,
        water: 0,
        waste: 3,
        jobs: 0.08,
        contactUrl: "https://page.line.me/860pfyue?oat_content=url&openQrModal=true",
        contactType: "line",
        contactLabel: "與小農 LINE 預購"
    },
    "xingfu": {
        name: "幸福良食",
        badge: "規模化與社會影響力",
        tag: "#青銀共創",
        desc: "由返鄉青年帶領在地老農天團，以友善耕作活化台南超過 140 公頃的休耕農地。堅持 100% 無化學農藥，成功打造兼顧環境與在地高齡化問題的「青銀共創」健康食農生態鏈。",
        metric1: "100%",
        metric1Lbl: "契作零化學農藥",
        metric2: "140公頃",
        metric2Lbl: "活化休耕無污染",
        videoUrl: "https://www.youtube.com/embed/Qwz-Rhyh-y4",
        land: 10,
        water: 0,
        waste: 0,
        jobs: 0.25,
        contactUrl: "https://openchat.line.me/tw/cover/jsThnluwcHgl6yxczBW3kCVguCqZ4YptkcF7EygtV0plYiuN_UqSKJ1lA5w?utm_source=line-openchat-seo&utm_medium=search_keyword&utm_campaign=default",
        contactType: "line",
        contactLabel: "加入 LINE 社群"
    },
    "caoben": {
        name: "草本誠食",
        badge: "精緻文創與高毛利禮盒",
        tag: "#無毒漢方食療",
        desc: "深耕台灣本土「中草藥（丹參）」的精緻轉型。創辦人秉持「醫食同源」與「土地永續」理念，與在地農民契作，堅持不用農藥與除草劑，培育出高營養價值的無毒本土丹參，並透過現代烘焙與食品科技，將傳統中藥材搖身一變成為現代人日常的舒壓茶飲與機能點心。",
        metric1: "100%",
        metric1Lbl: "無重金屬與藥殘",
        metric2: "契作",
        metric2Lbl: "保護生物多樣性",
        videoUrl: "https://www.facebook.com/watch/?v=887325650442172",
        land: 4,
        water: 0,
        waste: 0.5,
        jobs: 0.05,
        contactUrl: "https://www.facebook.com/honestfarmtaoyuan",
        contactType: "facebook",
        contactLabel: "前往 FB 專頁"
    }
};

const defaultProducts = [
    {
        id: "c1",
        brandId: "chuanyong",
        title: "【格外品翻轉・永續椪柑選物組】",
        subtitle: "明星零嘴：柑橘米香（180g） ＋ 生活選物：純釀鮮榨椪柑果醋、柑橘家事清潔劑噴瓶",
        desc: "「辦公室嚼感系零食首選！將台南東山在地柑橘的天然果酸，優雅揉入黃金比例的酥脆米香中。微酸微甜的療癒層次，順口解膩，敲鍵盤隨手抓，低卡低負擔。搭配100%果皮回收研發的天然洗劑，過一個零廢棄的柑橘感官生活。」",
        hidePrice: true,
        esgLbl: "🌱 減少 3.0kg 剩食，活化 6 坪減碳農地",
        land: 6,
        water: 0,
        waste: 3.0,
        jobs: 0.05,
        link: "https://www.carryongarden.com/products/firstpack",
        emoji: "🍊",
        brandName: "川涌果園",
        visualDesc: "溫慢的夕陽橘與莫蘭迪藍交織。畫面上呈現清涼的氣泡感，與飽滿的稻穗米香點綴。",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #4f6f8f 100%)",
        imageUrl: "images/chuanyong_package.png"
    },
    {
        id: "c2",
        brandId: "yunchang",
        title: "【雲林國產花生香・微甜不黏牙】",
        subtitle: "雲林在地花生，從土地到餐桌\n香脆濃郁、微甜不膩口，\n每一口都吃得到最純粹的花生香\n讓日常分享，也成為支持在地農業的力量。",
        desc: "緣長好事好事花生糖，嚴選100%雲林國產花生，呈現最純粹的花生香氣與香脆口感，微甜不黏牙、越吃越涮嘴。我們相信，每一次選擇國產花生，不只是享受美味，更是在支持在地農業，讓餐桌上的每一口，都成為土地永續的一份力量。",
        hidePrice: true,
        shippingNote: "享活動限定優惠外，再享<br>【7-11物流免運】團購活動限定優惠 滿 NT$ 280 免運",
        esgLbl: "🌱 選擇雲林國產花生，支持在地農業永續。",
        land: 13,
        water: 0,
        waste: 0,
        jobs: 0.35,
        link: "https://www.yuanchang-good.com/giftnextt",
        emoji: "🥜",
        brandName: "緣長好事",
        visualDesc: "沉穩的黑豆深色調與焙炒溫暖感。畫面呈現熱茶氤氳的煙霧，與質樸飽滿的花生堅果顆粒。",
        gradient: "linear-gradient(135deg, #1e293b 0%, #b45309 100%)"
    },
    {
        id: "c3",
        brandId: "xingfu",
        title: "【青銀共創・高膳食纖維黑豆點心組】",
        subtitle: "明星零嘴：老農天團契作・烘焙黑豆酥 ＋ 機能飲品：低溫焙炒・產銷履歷黑豆茶",
        desc: "「下午三點嘴饞想吃鹹點心？別再拿化學洋芋片傷害身體了！嚴選台南老農天團契作的 100% 無農藥黑豆，化身為鹹甜酥脆、嚼勁十足的黑豆酥。富含豐富的植物性蛋白質與高膳食纖維，越嚼越香，為長坐辦公室的你補充滿滿健康能量！」",
        hidePrice: true,
        esgLbl: "🌱 100% 無化學農藥，活化破百公頃休耕地",
        land: 10,
        water: 0,
        waste: 0,
        jobs: 0.25,
        link: "https://www.happyfood1000.com.tw/order_detail/27",
        emoji: "🫖",
        brandName: "幸福良食",
        visualDesc: "深邃的漢方草本綠與金黃酥脆的對比。畫面傳遞出安心、溫補與職人手作的踏實感。",
        gradient: "linear-gradient(135deg, #065f46 0%, #fbbf24 100%)"
    },
    {
        id: "c4",
        brandId: "yufu",
        title: "品牌精選：【鮮美陸上・永續共生】",
        subtitle: "一夫水產「鮮凍川燙蝦仁」",
        desc: "「深夜加班、週末小酌宵夜救星！溫室循環水高規格養殖藍寶石蝦，抗生素零檢出，退冰川燙 60 秒開動，極致鮮甜、低脂高蛋白無負擔！」",
        hidePrice: true,
        esgLbl: "支持 500L 循環水過濾，減抽 100% 地下水",
        land: 0,
        water: 500,
        waste: 0,
        jobs: 0.1,
        link: "https://mall.iopenmall.tw/026192/index.php?action=product_search&usort=",
        couponInfo: {
            image: "素材/一夫水產折價券.PNG",
            copy: "【選物沙龍】\n輸入折價券代碼:NextT－718"
        },
        emoji: "🍤",
        brandName: "一夫水產",
        visualDesc: "湛藍澄澈的循環水波紋。畫面呈現急速冷凍川燙蝦仁的粉嫩色澤與鮮甜彈牙感。",
        gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)"
    },
    {
        id: "c5",
        brandId: "caoben",
        title: "品牌精選：【在地純粹．草本滋補】",
        subtitle: "草本誠食「台灣嚴選丹參茶」",
        desc: "「外面爆熱、冷氣房爆冷，上班族吹到頭昏腦脹、越坐越累？嚴選台灣在地丹參，冷泡熱沖都順口。不燥不熱的天然回甘，幫你在冷氣房溫和補水、調養氣血，輕鬆擺脫夏日厭世感！」",
        hidePrice: true,
        esgLbl: "🌱 支持台灣在地無毒契作，嚴選100%純粹無添加",
        land: 4,
        water: 0,
        waste: 0.5,
        jobs: 0.05,
        link: "https://tw.shp.ee/7dfmgYNK",
        emoji: "🍵",
        brandName: "草本誠食",
        visualTitle: "【補水秘訣 擺脱夏日厭世感】",
        visualDesc: "溫潤順口的在地草本色澤。畫面呈現溫和回甘的丹參茶與純淨滴雞精的頂級溫養感。",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #c4b5fd 100%)",
        decorationImage: "素材/草本誠食2.png"
    }
];

// Active databases in memory
let brandsData = {};
let productsData = [];
let cart = [];

// Load data on start
loadData();

function loadData() {
    const storedBrands = localStorage.getItem('nextt_brands_data_v18');
    const storedProducts = localStorage.getItem('nextt_products_data_v18');
    const storedCart = localStorage.getItem('nextt_cart_data_v18');
    
    if (storedBrands) {
        brandsData = JSON.parse(storedBrands);
    } else {
        brandsData = JSON.parse(JSON.stringify(defaultBrands));
        localStorage.setItem('nextt_brands_data_v18', JSON.stringify(brandsData));
    }
    
    if (storedProducts) {
        productsData = JSON.parse(storedProducts);
    } else {
        productsData = JSON.parse(JSON.stringify(defaultProducts));
        localStorage.setItem('nextt_products_data_v18', JSON.stringify(productsData));
    }

    if (storedCart) {
        cart = JSON.parse(storedCart);
    } else {
        cart = [];
    }

    loadBrandDataFromFirestore();
}

function loadBrandDataFromFirestore() {
    if (isFirebaseEnabled) {
        db.collection('brands').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    if (brandsData[id]) {
                        brandsData[id] = { ...brandsData[id], ...data };
                    }
                });
                // Update interactive table details if loaded
                const activeBrand = document.querySelector('.hotspot.active');
                if (activeBrand) {
                    const brandId = activeBrand.dataset.brand;
                    updateBrandDetailCard(brandId);
                }
            })
            .catch(err => console.error("Error loading brand data from Cloud Firestore:", err));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Front-end initializers
    if (document.querySelector('.hero-carousel')) {
        initManualHeroCarousel();
    }
    if (document.querySelector('.nav-tab')) {
        initNavigation();
    }
    if (document.querySelector('.hotspot')) {
        initInteractiveTable();
        // Set default active brand on load (yufu)
        updateBrandDetailCard("yufu");
    }
    if (document.getElementById('product-grid')) {
        renderCatalog();
    }
    if (document.getElementById('cart-items')) {
        initCart();
    }
    if (document.getElementById('video-modal')) {
        initModals();
    }
    if (document.getElementById('rsvp-form')) {
        initRSVPForm();
    }
    if (document.getElementById('kol-unlock-btn')) {
        initKOLMatchmaker();
    }
});

function initManualHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(carousel.querySelectorAll('.hero-carousel-dot'));
    const previousButton = carousel.querySelector('.hero-carousel-prev');
    const nextButton = carousel.querySelector('.hero-carousel-next');
    let currentSlide = 0;

    const showSlide = (nextIndex) => {
        currentSlide = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            const isActive = index === currentSlide;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
            dots[index].classList.toggle('active', isActive);
            dots[index].setAttribute('aria-selected', String(isActive));
        });
    };

    previousButton.addEventListener('click', () => showSlide(currentSlide - 1));
    nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
    showSlide(0);
}

// 1. Navigation Logic
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const dataTab = tab.getAttribute('data-tab');
            
            if (dataTab === 'rundown-tab') {
                // Switch to catalog-tab content, but keep this tab active
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const catalogTab = document.getElementById('catalog-tab');
                if (catalogTab) catalogTab.classList.add('active');
                
                const target = document.getElementById('rundown-section');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else if (dataTab === 'dashboard-tab') {
                // Switch to catalog-tab content, but keep this tab active
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const catalogTab = document.getElementById('catalog-tab');
                if (catalogTab) catalogTab.classList.add('active');
                
                const target = document.getElementById('dashboard-section');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else if (dataTab === 'catalog-tab') {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const catalogTab = document.getElementById('catalog-tab');
                if (catalogTab) catalogTab.classList.add('active');
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Normal tab behavior (e.g. kol-tab)
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const targetContent = document.getElementById(dataTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
        });
    });
}

// 2. Interactive Dining Table Hotspots
function initInteractiveTable() {
    const hotspots = Array.from(document.querySelectorAll('.hotspot'));
    const tableSection = document.getElementById('interactive-table-section');
    const desktopQuery = window.matchMedia('(min-width: 521px)');
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = hotspots.findIndex(hotspot => hotspot.classList.contains('active'));
    let rotationTimer = null;

    if (activeIndex < 0) activeIndex = 0;

    const showBrand = (nextIndex) => {
        activeIndex = (nextIndex + hotspots.length) % hotspots.length;
        hotspots.forEach((hotspot, index) => hotspot.classList.toggle('active', index === activeIndex));
        updateBrandDetailCard(hotspots[activeIndex].getAttribute('data-brand'));
    };

    const stopRotation = () => {
        if (rotationTimer) {
            window.clearInterval(rotationTimer);
            rotationTimer = null;
        }
    };

    const startRotation = () => {
        stopRotation();
        if (desktopQuery.matches && !reduceMotionQuery.matches) {
            rotationTimer = window.setInterval(() => showBrand(activeIndex + 1), 4000);
        }
    };

    hotspots.forEach((hotspot, index) => {
        hotspot.addEventListener('click', () => {
            showBrand(index);
            startRotation();
        });
    });

    tableSection.addEventListener('mouseenter', stopRotation);
    tableSection.addEventListener('mouseleave', startRotation);
    tableSection.addEventListener('focusin', stopRotation);
    tableSection.addEventListener('focusout', startRotation);
    document.addEventListener('visibilitychange', () => document.hidden ? stopRotation() : startRotation());
    desktopQuery.addEventListener('change', startRotation);

    showBrand(activeIndex);
    startRotation();
}

function updateBrandDetailCard(brandId) {
    const brand = brandsData[brandId];
    if (!brand) return;
    
    const badgeEl = document.getElementById('detail-badge');
    const tagEl = document.getElementById('detail-tag');
    const nameEl = document.getElementById('detail-name');
    const descEl = document.getElementById('detail-desc');
    const metric1El = document.getElementById('detail-metric1');
    const metric1LblEl = document.getElementById('detail-metric1-lbl');
    const metric2El = document.getElementById('detail-metric2');
    const metric2LblEl = document.getElementById('detail-metric2-lbl');
    
    if (badgeEl) badgeEl.innerText = brand.badge;
    if (tagEl) tagEl.innerText = brand.tag;
    if (nameEl) nameEl.innerText = brand.name;
    if (descEl) descEl.innerText = brand.desc;
    if (metric1El) metric1El.innerText = brand.metric1;
    if (metric1LblEl) metric1LblEl.innerText = brand.metric1Lbl;
    if (metric2El) metric2El.innerText = brand.metric2;
    if (metric2LblEl) metric2LblEl.innerText = brand.metric2Lbl;
    
    // Bind buttons
    const videoBtn = document.getElementById('detail-video-btn');
    if (videoBtn) videoBtn.onclick = () => openVideoModal(brand.videoUrl);
    
    const addBtn = document.getElementById('detail-add-btn');
    if (addBtn) {
        // Reset classes
        addBtn.className = "btn btn-primary";
        
        if (brand.contactType === 'line') {
            addBtn.classList.add('btn-line');
            addBtn.innerHTML = `<i class="fa-brands fa-line"></i> ${brand.contactLabel || '加 LINE 訂購'}`;
        } else if (brand.contactType === 'facebook') {
            addBtn.classList.add('btn-facebook');
            addBtn.innerHTML = `<i class="fa-brands fa-facebook"></i> ${brand.contactLabel || '前往 FB 專頁'}`;
        } else {
            addBtn.innerHTML = `<i class="fa-solid fa-up-right-from-square"></i> 聯絡官方`;
        }
        
        addBtn.onclick = () => {
            if (brand.contactUrl) {
                window.open(brand.contactUrl, '_blank');
            }
        };
    }
}

// 3. Render Product Catalog (Restructured to show pairing combinations)
function renderCatalog() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    productsData.forEach(p => {
        const card = document.createElement('div');
        card.className = 'pairing-card';
        
        // Determine button style
        const isShopee = p.link && (p.link.includes('shopee.tw') || p.link.includes('shp.ee'));
        const isLine = p.link && p.link.includes('line.me');
        const btnText = '前往賣場';
        const btnIcon = isShopee ? '<i class="fa-solid fa-store"></i>' : isLine ? '<i class="fa-brands fa-line"></i>' : '<i class="fa-solid fa-cart-shopping"></i>';
        const btnClass = isShopee ? 'pairing-btn-redirect btn-shopee' : 'pairing-btn-redirect btn-line';
        
        const visualContent = p.imageUrl 
            ? `<div class="pairing-visual" style="background: #f4f6f8; padding: 0; min-height: 140px; height: 140px; display: flex; align-items: center; justify-content: center; box-shadow: none; border: 1px solid var(--morandi-border); position: relative;">
                   <img src="${p.imageUrl}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: contain; border-radius: var(--radius-sm);">
               </div>`
            : `<div class="pairing-visual" style="background: ${p.gradient || 'linear-gradient(135deg, #5c768d 0%, #34495e 100%)'}; min-height: 140px; height: 140px; padding: 1.25rem;">
                   <div style="font-size: 2rem; margin-bottom: 0.25rem;">${p.emoji || '🌿'}</div>
                   <div class="pairing-visual-title" style="font-size: 1rem;">${p.visualTitle || (p.title.includes('：') ? p.title.split('：')[1] : p.title)}</div>
                   <div class="pairing-visual-concept" style="font-size: 0.7rem; max-width: 160px;">${p.visualDesc || ''}</div>
               </div>`;
            
        const subtitleHtml = (p.subtitle || '').replace(/\n/g, '<br>');
        const shippingNoteHtml = p.shippingNote
            ? `<div style="background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-left: 3px solid #16a34a; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.78rem; color: #15803d; font-weight: 500; margin-bottom: 0.5rem; line-height: 1.5;">${p.shippingNote}</div>`
            : '';
        const priceHtml = p.hidePrice
            ? ''
            : `<span class="product-price" style="font-weight: 700; color: var(--primary); font-size: 1.1rem;">NT$ ${p.price}</span>`;
        card.innerHTML = `
            ${visualContent}
            <div class="pairing-content">
                <div class="pairing-header">
                    <span class="pairing-brand">${p.brandName || ''}</span>
                    <h4 class="pairing-title" style="font-size: 1.15rem; margin: 0.25rem 0;">${p.title}</h4>
                    <div class="pairing-subtitle" style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;">${subtitleHtml}</div>
                    ${shippingNoteHtml}
                    <p class="pairing-desc">${p.desc}</p>
                    <span class="product-esg-lbl"><i class="fa-solid fa-leaf"></i> ${p.esgLbl}</span>
                    ${p.couponInfo ? `
                    <div style="margin-top:0.6rem; border:1px dashed #94a3b8; border-radius:8px; overflow:hidden; cursor:pointer;" onclick="openImageModal('${p.couponInfo.image}', '${p.couponInfo.copy.replace(/\n/g,' ')}')">
                        <div style="background:#f0fdf4; padding:0.4rem 0.6rem; font-size:0.82rem; font-weight:600; color:#166534; text-align:center; line-height:1.5;">${p.couponInfo.copy.replace(/\n/g,'<br>')}</div>
                        <img src="${p.couponInfo.image}" alt="折價券" style="width:100%; display:block; object-fit:contain; max-height:120px;">
                    </div>` : ''}
                    ${p.decorationImage ? `
                    <div style="margin-top:0.65rem; border-radius:10px; overflow:hidden; box-shadow:0 2px 12px rgba(124,58,237,0.13);" >
                        <img src="${p.decorationImage}" alt="${p.brandName} 產品圖" style="width:100%; display:block; object-fit:contain; width:100%; height:200px; background:#fff;">
                    </div>` : ''}
                </div>
                <div class="pairing-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px dashed rgba(79, 111, 143, 0.1);">
                    ${priceHtml}
                    <div class="pairing-action-row" style="flex-grow: 1; display: flex; justify-content: ${p.hidePrice ? 'center' : 'flex-end'};">
                        <a href="${p.link}" target="_blank" class="${btnClass}" style="width: 100%; justify-content: center; text-align: center; box-sizing: border-box; padding: 0.5rem 0.75rem; font-size: 0.8rem;">
                            ${btnIcon} ${btnText}
                        </a>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function getEmojiForProduct(productId) {
    switch (productId) {
        case "p1": return "🍤";
        case "p2": return "🥜";
        case "p3": return "🌾";
        case "p4": return "🍪";
        case "p5": return "🍵";
        case "p6": return "🥤";
        default: return "📦";
    }
}

// 4. Cart Logic (Pledge list)
function initCart() {
    const checkoutBtn = document.getElementById('checkout-submit-btn');
    if (!checkoutBtn) return;
    
    checkoutBtn.addEventListener('click', () => {
        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        
        if (cart.length === 0) {
            alert('您尚未選擇要支持並試算的永續搭餐組合喔！');
            return;
        }
        if (!name || !phone) {
            alert('請填寫姓名與聯絡電話以登記支持意願！');
            return;
        }
        
        let summaryText = `【NextT 永續沙龍支持與意願登記】\n登記姓名：${name}\n聯絡電話：${phone}\n\n預計支持品項/組合：\n`;
        let itemsSummary = "";
        cart.forEach(item => {
            summaryText += `- ${item.product.title} (NT$ ${item.product.price})\n`;
            itemsSummary += `- ${item.product.title}\n`;
        });
        
        const impact = calculateImpact();
        summaryText += `\n此清單預估帶來的 ESG 永續影響力：\n`;
        summaryText += `- 耕地活化面積: ${impact.land} 坪\n`;
        summaryText += `- 水資源回收再利用: ${impact.water} 公升\n`;
        summaryText += `- 剩食/格外品轉化: ${impact.waste} 公斤\n`;
        summaryText += `- 支持契作與青銀共創就業份額: ${impact.jobs.toFixed(2)} 人\n`;
        summaryText += `\n💡 溫馨提醒：本網站僅作永續影響力試算。其中有約 80% 的業者需前往專屬連結進行最終訂購與支付，請點選風味指南中的「前往品牌活動頁」進行下單。`;
        
        // Send to Google Sheets if configured
        if (GOOGLE_SCRIPT_URL) {
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "cart",
                    time: new Date().toLocaleString(),
                    name: name,
                    phone: phone,
                    itemsSummary: itemsSummary,
                    impact: impact
                })
            }).catch(err => console.error("Error sending to GAS:", err));
        }
        
        alert(summaryText);
        
        cart = [];
        updateCartUI();
        // Uncheck all checkboxes in front-end
        const checkboxes = document.querySelectorAll('.pledge-checkbox-container input');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.parentElement.classList.remove('active');
        });
        // Also update interactive detail card button if visible
        const addBtn = document.getElementById('detail-add-btn');
        if (addBtn) {
            addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> 加入支持試算';
        }
        
        document.getElementById('checkout-name').value = '';
        document.getElementById('checkout-phone').value = '';
        localStorage.setItem('nextt_cart_data_v18', JSON.stringify(cart));
    });
}

// Dynamic support toggle function
window.togglePledge = function(productId, element) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const index = cart.findIndex(item => item.product.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        if (element) {
            element.classList.remove('active');
            const checkbox = element.querySelector('input');
            if (checkbox) checkbox.checked = false;
        }
    } else {
        cart.push({ product, quantity: 1 });
        if (element) {
            element.classList.add('active');
            const checkbox = element.querySelector('input');
            if (checkbox) checkbox.checked = true;
        }
    }
    updateCartUI();
    
    localStorage.setItem('nextt_cart_data_v18', JSON.stringify(cart));
};

window.addToCart = function(productId) {
    const checkbox = document.getElementById(`pledge-check-${productId}`);
    togglePledge(productId, checkbox ? checkbox.parentElement : null);
};

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartUI();
    
    const checkbox = document.getElementById(`pledge-check-${productId}`);
    if (checkbox) {
        checkbox.checked = false;
        if (checkbox.parentElement) checkbox.parentElement.classList.remove('active');
    }
    
    // Sync interactive table detail card button if visible
    const detailName = document.getElementById('detail-name');
    if (detailName) {
        const brand = Object.values(brandsData).find(b => b.name === detailName.innerText);
        if (brand) {
            const brandId = Object.keys(brandsData).find(key => brandsData[key].name === brand.name);
            const addBtn = document.getElementById('detail-add-btn');
            const product = productsData.find(p => p.id === productId);
            if (addBtn && product && product.brandId === brandId) {
                addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> 加入支持試算';
            }
        }
    }
    
    localStorage.setItem('nextt_cart_data_v18', JSON.stringify(cart));
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const countBadge = document.getElementById('cart-count');
    
    if (countBadge) countBadge.innerText = cart.length;
    
    if (itemsContainer) {
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1.5rem 0;">目前尚未支持任何永續品牌。請在風味指南中勾選「支持試算」！</p>';
        } else {
            itemsContainer.innerHTML = '';
            cart.forEach(item => {
                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
                    <div class="cart-item-name" style="font-weight:600; color:var(--morandi-blue-dark); font-size:0.8rem;">
                        ${item.product.title.split('：')[0]} × 支持
                    </div>
                    <div class="cart-item-action">
                        <button class="cart-remove-btn" onclick="removeFromCart('${item.product.id}')">取消支持</button>
                    </div>
                `;
                itemsContainer.appendChild(row);
            });
        }
    }
    
    // Update ESG Impact
    const impact = calculateImpact();
    const impLand = document.getElementById('impact-land');
    const impWater = document.getElementById('impact-water');
    const impWaste = document.getElementById('impact-waste');
    const impJobs = document.getElementById('impact-jobs');
    
    if (impLand) impLand.innerText = `${impact.land} 坪`;
    if (impWater) impWater.innerText = `${impact.water} 公升`;
    if (impWaste) impWaste.innerText = `${impact.waste} 公斤`;
    if (impJobs) impJobs.innerText = `${impact.jobs.toFixed(2)} 人`;
}

function calculateImpact() {
    let land = 0;
    let water = 0;
    let waste = 0;
    let jobs = 0;
    
    cart.forEach(item => {
        land += item.product.land;
        water += item.product.water;
        waste += item.product.waste;
        jobs += item.product.jobs;
    });
    
    return { land, water, waste, jobs };
}

window.removeFromCart = removeFromCart; // Expose globally



// 7. YouTube Embed Modals & Image Lightbox Modals
function initModals() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    const closeBtn = document.getElementById('modal-close-btn');
    
    if (modal) {
        window.openVideoModal = function(url) {
            if (!url) return;
            
            let embedUrl = url;
            try {
                if (url.includes('youtube.com/watch')) {
                    const urlObj = new URL(url);
                    const videoId = urlObj.searchParams.get('v');
                    if (videoId) {
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    }
                } else if (url.includes('youtu.be/')) {
                    const parts = url.split('youtu.be/');
                    if (parts.length > 1) {
                        const videoId = parts[1].split('?')[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    }
                }
            } catch (e) {
                console.error("Error parsing video URL:", e);
            }
            
            if (embedUrl.includes('instagram.com') || embedUrl.includes('facebook.com') || !embedUrl.includes('youtube.com/embed')) {
                window.open(url, '_blank');
                return;
            }
            
            if (iframe) iframe.src = embedUrl;
            modal.classList.add('active');
        };
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                if (iframe) iframe.src = ''; 
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                if (iframe) iframe.src = '';
            }
        });
    }

    // Image Lightbox Modal bindings
    const imgModal = document.getElementById('image-modal');
    const imgModalContent = document.getElementById('image-modal-img');
    const imgModalClose = document.getElementById('image-modal-close-btn');
    const imgModalPrev = document.getElementById('image-modal-prev-btn');
    const imgModalNext = document.getElementById('image-modal-next-btn');
    
    let currentGalleryImages = [];
    let currentGalleryIndex = 0;
    
    if (imgModal) {
        window.openImageModal = function(srcOrArray, alt) {
            if (imgModalContent) {
                if (Array.isArray(srcOrArray)) {
                    currentGalleryImages = srcOrArray;
                    currentGalleryIndex = 0;
                    imgModalContent.src = currentGalleryImages[currentGalleryIndex];
                    if (imgModalPrev) imgModalPrev.style.display = 'flex';
                    if (imgModalNext) imgModalNext.style.display = 'flex';
                } else {
                    currentGalleryImages = [srcOrArray];
                    currentGalleryIndex = 0;
                    imgModalContent.src = srcOrArray;
                    if (imgModalPrev) imgModalPrev.style.display = 'none';
                    if (imgModalNext) imgModalNext.style.display = 'none';
                }
                imgModalContent.alt = alt || "放大圖卡";
                imgModal.classList.add('active');
            }
        };
        
        function updateGalleryImage() {
            if (imgModalContent && currentGalleryImages.length > 0) {
                imgModalContent.src = currentGalleryImages[currentGalleryIndex];
            }
        }
        
        if (imgModalPrev) {
            imgModalPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentGalleryImages.length > 1) {
                    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                    updateGalleryImage();
                }
            });
        }
        
        if (imgModalNext) {
            imgModalNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentGalleryImages.length > 1) {
                    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
                    updateGalleryImage();
                }
            });
        }
        
        if (imgModalClose) {
            imgModalClose.addEventListener('click', () => {
                imgModal.classList.remove('active');
            });
        }
        
        imgModal.addEventListener('click', (e) => {
            if (e.target === imgModal) {
                imgModal.classList.remove('active');
            }
        });
    }
}

// 8. KOL Matchmaker (Front-end Private Tab)
const kolsList = [
    {
        "name": "郝旭烈/郝聲音",
        "show": "郝聲音",
        "apple": "https://podcasts.apple.com/tw/podcast/%E9%83%9D%E8%81%B2%E9%9F%B3/id1533782597"
    },
    {
        "name": "五吉郎",
        "show": "五吉郎",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BA%94%E5%90%89%E9%83%8E/id1640942537?uo=4"
    },
    {
        "name": "精算媽咪的家計簿｜珊迪兔",
        "show": "精算媽咪的家計簿",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%B2%BE%E7%AE%97%E5%AA%BD%E5%92%AA%E7%9A%84%E5%AE%B6%E8%A8%88%E7%B0%BF/id1501644109"
    },
    {
        "name": "不敗教主-陳重銘",
        "show": "不敗教主陳重銘",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%B8%8D%E6%95%97%E6%95%99%E4%B8%BB%E9%99%B3%E9%87%8D%E9%8A%98/id1541450581?uo=4"
    },
    {
        "name": "布姐陪你聰明工作創意生活",
        "show": "布姐的沙發",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%B8%83%E5%A7%90%E7%9A%84%E6%B2%99%E7%99%BC/id1571405666?uo=4"
    },
    {
        "name": "瓦基閱讀前哨站",
        "show": "下一本讀什麼？",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%B8%8B%E4%B8%80%E6%9C%AC%E8%AE%80%E4%BB%80%E9%BA%BC/id1532820533?uo=4"
    },
    {
        "name": "蕭邦",
        "show": "蕭邦相談室",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%95%AD%E9%82%A6%E7%9B%B8%E8%AB%87%E5%AE%A4/id1858503728"
    },
    {
        "name": "Dr Selena",
        "show": "小資變有錢｜Dr.Selena生活理財王",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%B0%8F%E8%B3%87%E8%AE%8A%E6%9C%89%E9%8C%A2-dr-selena%E7%94%9F%E6%B4%BB%E7%90%86%E8%B2%A1%E7%8E%8B/id1626035937"
    },
    {
        "name": "胡咪老師",
        "show": "分手的99個理由",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%88%86%E6%89%8B%E7%9A%8499%E5%80%8B%E7%90%86%E7%94%B1/id1680844787?uo=4"
    },
    {
        "name": "林程揚｜Hank大叔 / 維琪的幸福叮嚀",
        "show": "能量黑客",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%83%BD%E9%87%8F%E9%BB%91%E5%AE%A2/id1852155372"
    },
    {
        "name": "Vito大叔",
        "show": "粉紅地獄辛辣麵",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%B2%89%E7%B4%85%E5%9C%B0%E7%8D%84%E8%BE%9B%E8%BE%A3%E9%BA%B5/id1588077436?uo=4"
    },
    {
        "name": "宋家小館｜Becky",
        "show": "宋家小館",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%AE%8B%E5%AE%B6%E5%B0%8F%E9%A4%A8/id1721336862"
    },
    {
        "name": "梁哲維",
        "show": "OHMYBOOK｜哲維說書",
        "apple": "https://podcasts.apple.com/tw/podcast/ohmybook-%E5%93%B2%E7%B6%AD%E8%AA%AA%E6%9B%B8/id1637612999?uo=4"
    },
    {
        "name": "尼可這樣說",
        "show": "尼可這樣說",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%B0%BC%E5%8F%AF%E9%80%99%E6%A8%A3%E8%AA%AA/id1518927685?uo=4"
    },
    {
        "name": "我的動齡限量版",
        "show": "我的動齡限量版",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%88%91%E7%9A%84%E5%8B%95%E9%BD%A1%E9%99%90%E9%87%8F%E7%89%88/id1809082365?uo=4"
    },
    {
        "name": "哇賽心理學_蔡宇哲",
        "show": "哇賽心理學",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%93%87%E8%B3%BD%E5%BF%83%E7%90%86%E5%AD%B8/id1500162537"
    },
    {
        "name": "美股夢想家",
        "show": "夢想家說股事",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%A4%A2%E6%83%B3%E5%AE%B6%E8%AA%AA%E8%82%A1%E4%BA%8B/id1585270910"
    },
    {
        "name": "GK爸爸",
        "show": "GK爸爸原創故事繪本",
        "apple": "https://podcasts.apple.com/tw/podcast/gk%E7%88%B8%E7%88%B8%E5%8E%9F%E5%89%B5%E6%95%85%E4%BA%8B%E7%B9%AA%E6%9C%AC/id1525978220?uo=4"
    },
    {
        "name": "30節約男子",
        "show": "財富餐車不打烊",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%B2%A1%E5%AF%8C%E9%A4%90%E8%BB%8A%E4%B8%8D%E6%89%93%E7%83%8A/id1814388684?uo=4"
    },
    {
        "name": "無所不試無樂不作",
        "show": "無所不試 無樂不作",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%84%A1%E6%89%80%E4%B8%8D%E8%A9%A6-%E7%84%A1%E6%A8%82%E4%B8%8D%E4%BD%9C/id1754690202?uo=4"
    },
    {
        "name": "美股航海王",
        "show": "航海王的富人學",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%88%AA%E6%B5%B7%E7%8E%8B%E7%9A%84%E5%AF%8C%E4%BA%BA%E5%AD%B8/id1726458489"
    },
    {
        "name": "美業幹什麼｜蔡佩陵",
        "show": "美業幹什麼",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%BE%8E%E6%A5%AD%E5%B9%B9%E4%BB%80%E9%BA%BC/id1822200991"
    },
    {
        "name": "加班當爸媽．櫻桃可可CherryCoco",
        "show": "加班當爸媽｜櫻桃可可CherryCoco",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%8A%A0%E7%8F%AD%E7%95%B6%E7%88%B8%E5%AA%BD-%E6%AB%BB%E6%A1%83%E5%8F%AF%E5%8F%AFcherrycoco/id1520423194"
    },
    {
        "name": "莫菲穿搭",
        "show": "【莫轉台】-試穿新人生",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%8E%AB%E8%BD%89%E5%8F%B0-%E8%A9%A6%E7%A9%BF%E6%96%B0%E4%BA%BA%E7%94%9F/id1865854397"
    },
    {
        "name": "楊月娥（楊肉爐）",
        "show": "楊肉盧",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%A5%8A%E8%82%89%E7%9B%A7/id1714589755?uo=4"
    },
    {
        "name": "聲音表達講師林依柔",
        "show": "說話人聲",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%AA%AA%E8%A9%B1%E4%BA%BA%E8%81%B2/id1562262569"
    },
    {
        "name": "丁菱娟",
        "show": "丁菱娟的邊走邊想",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%B8%81%E8%8F%B1%E5%A8%9F%E7%9A%84%E9%82%8A%E8%B5%B0%E9%82%8A%E6%83%B3/id1864552953?uo=4"
    },
    {
        "name": "山姆書書",
        "show": "山姆書書",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%B1%B1%E5%A7%86%E6%9B%B8%E6%9B%B8/id1630531870"
    },
    {
        "name": "玩命之徒｜林尚諾大師兄",
        "show": "玩命之徒",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%8E%A9%E5%91%BD%E4%B9%8B%E5%BE%92/id1526430681?uo=4"
    },
    {
        "name": "蘇絢慧分享空間",
        "show": "蘇心時光",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%98%87%E5%BF%83%E6%99%82%E5%85%89/id1850663669"
    },
    {
        "name": "爛泥媽媽的重生日記（Jill)",
        "show": "爛泥Jill式優雅",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%88%9B%E6%B3%A5jill%E5%BC%8F%E5%84%AA%E9%9B%85/id1822120421?uo=4"
    },
    {
        "name": "別人的工作最有趣｜Fiona",
        "show": "別人的工作最有趣",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%88%A5%E4%BA%BA%E7%9A%84%E5%B7%A5%E4%BD%9C%E6%9C%80%E6%9C%89%E8%B6%A3/id1626274583"
    },
    {
        "name": "閱讀聊樂key",
        "show": "閱讀聊樂KEY",
        "apple": "https://podcasts.apple.com/tw/podcast/%E9%96%B1%E8%AE%80%E8%81%8A%E6%A8%82key/id1650123413?uo=4"
    },
    {
        "name": "人生啊！小歐",
        "show": "人生啊｜陪你一起看懂人生",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BA%BA%E7%94%9F%E5%95%8A-%E9%99%AA%E4%BD%A0%E4%B8%80%E8%B5%B7%E7%9C%8B%E6%87%82%E4%BA%BA%E7%94%9F/id1669156618?uo=4"
    },
    {
        "name": "張忘形",
        "show": "人類行為研究社",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BA%BA%E9%A1%9E%E8%A1%8C%E7%82%BA%E7%A0%94%E7%A9%B6%E7%A4%BE/id1792379960"
    },
    {
        "name": "Fire人生大學｜道哥",
        "show": "FIRE 人生大學",
        "apple": "https://podcasts.apple.com/tw/podcast/fire-%E4%BA%BA%E7%94%9F%E5%A4%A7%E5%AD%B8/id1765837689?uo=4"
    },
    {
        "name": "小思大維｜雪柔",
        "show": "小思大維",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%B0%8F%E6%80%9D%E5%A4%A7%E7%B6%AD/id1780788374?uo=4"
    },
    {
        "name": "姐姐不想懂事了｜莉安君怡 / 姊姊不想懂事了",
        "show": "《姐姐不想懂事了》 | Soft Rebellion",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%A7%90%E5%A7%90%E4%B8%8D%E6%83%B3%E6%87%82%E4%BA%8B%E4%BA%86-soft-rebellion/id1837928642"
    },
    {
        "name": "下半場人生事務有限公司",
        "show": "下半場人生陪談師",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%B8%8B%E5%8D%8A%E5%A0%B4%E4%BA%BA%E7%94%9F%E9%99%AA%E8%AB%87%E5%B8%AB/id1847818338?uo=4"
    },
    {
        "name": "治療師瑪奇",
        "show": "教出你的路",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%95%99%E5%87%BA%E4%BD%A0%E7%9A%84%E8%B7%AF/id1807085418?uo=4"
    },
    {
        "name": "品牌女子A娜",
        "show": "你也想紅嗎",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BD%A0%E4%B9%9F%E6%83%B3%E7%B4%85%E5%97%8E/id1787670641?uo=4"
    },
    {
        "name": "孫治華",
        "show": "人生挖挖WoW-企業人生策略學",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BA%BA%E7%94%9F%E6%8C%96%E6%8C%96wow-%E4%BC%81%E6%A5%AD%E4%BA%BA%E7%94%9F%E7%AD%96%E7%95%A5%E5%AD%B8/id1800646759?uo=4"
    },
    {
        "name": "文森說書",
        "show": "文森說書",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%96%87%E6%A3%AE%E8%AA%AA%E6%9B%B8/id1513786617?uo=4"
    },
    {
        "name": "聰明主婦的生活投資學",
        "show": "聰明生活投資學",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%81%B0%E6%98%8E%E7%94%9F%E6%B4%BB%E6%8A%95%E8%B3%87%E5%AD%B8/id1740507134?uo=4"
    },
    {
        "name": "孫子玲",
        "show": "子玲的親子聊心屋-媽咪的自我成長&親子教養",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%AD%90%E7%8E%B2%E7%9A%84%E8%A6%AA%E5%AD%90%E8%81%8A%E5%BF%83%E5%B1%8B-%E5%AA%BD%E5%92%AA%E7%9A%84%E8%87%AA%E6%88%91%E6%88%90%E9%95%B7-%E8%A6%AA%E5%AD%90%E6%95%99%E9%A4%8A/id1650760949"
    },
    {
        "name": "王琄",
        "show": "琄蜜莉的異想世界",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%90%84%E8%9C%9C%E8%8E%89%E7%9A%84%E7%95%B0%E6%83%B3%E4%B8%96%E7%95%8C/id1812288750?uo=4"
    },
    {
        "name": "佐依Zoey",
        "show": "佐編茶水間",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BD%90%E7%B7%A8%E8%8C%B6%E6%B0%B4%E9%96%93/id1399974297"
    },
    {
        "name": "斜槓空姐cindy",
        "show": "錢進頭等艙",
        "apple": "https://podcasts.apple.com/tw/podcast/%E9%8C%A2%E9%80%B2%E9%A0%AD%E7%AD%89%E8%89%99/id1522267699?uo=4"
    },
    {
        "name": "即薑抵達｜薑咪",
        "show": "即薑抵達",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%8D%B3%E8%96%91%E6%8A%B5%E9%81%94/id1767555436?uo=4"
    },
    {
        "name": "曼蒂歐逆-轉型之路",
        "show": "任性歐逆機智生活",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BB%BB%E6%80%A7%E6%AD%90%E9%80%86%E6%A9%9F%E6%99%BA%E7%94%9F%E6%B4%BB/id1719757743?uo=4"
    },
    {
        "name": "潘思璇ＣＰ",
        "show": "CP有主見",
        "apple": "https://podcasts.apple.com/tw/podcast/cp%E6%9C%89%E4%B8%BB%E8%A6%8B/id1719147550"
    },
    {
        "name": "鄧惠文",
        "show": "鄧惠文 不想說",
        "apple": "https://podcasts.apple.com/tw/podcast/%E9%84%A7%E6%83%A0%E6%96%87-%E4%B8%8D%E6%83%B3%E8%AA%AA/id1544980529?uo=4"
    },
    {
        "name": "小河馬媽媽",
        "show": "來晚無添加河粉吧！",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%BE%86%E6%99%9A%E7%84%A1%E6%B7%BB%E5%8A%A0%E6%B2%B3%E7%B2%89%E5%90%A7/id1692523518?uo=4"
    },
    {
        "name": "慢活夫妻Dewi&George",
        "show": "慢活夫妻－專業美股投資與理財",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%85%A2%E6%B4%BB%E5%A4%AB%E5%A6%BB-%E5%B0%88%E6%A5%AD%E7%BE%8E%E8%82%A1%E6%8A%95%E8%B3%87%E8%88%87%E7%90%86%E8%B2%A1/id1520711973"
    },
    {
        "name": "崔咪",
        "show": "一不小心太漂亮",
        "apple": "https://podcasts.apple.com/tw/podcast/%E4%B8%8D%E5%B0%8F%E5%BF%83%E5%A4%AA%E6%BC%82%E4%BA%AE/id1743546553"
    },
    {
        "name": "微光中的貓| Claire Hsiao",
        "show": "《 微光中的北極星 》人生策略、自我成長、內在力量",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%BE%AE%E5%85%89%E4%B8%AD%E7%9A%84%E5%8C%97%E6%A5%B5%E6%98%9F-%E4%BA%BA%E7%94%9F%E7%AD%96%E7%95%A5-%E8%87%AA%E6%88%91%E6%88%90%E9%95%B7-%E5%85%A7%E5%9C%A8%E5%8A%9B%E9%87%8F/id1500126618?uo=4"
    },
    {
        "name": "育兒專機｜犬媽 / 犬兒媽咪の育兒手帳",
        "show": "育兒專機",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%82%B2%E5%85%92%E5%B0%88%E6%A9%9F/id1621435372?uo=4"
    },
    {
        "name": "廣播主持人_楊凱涵",
        "show": "請多包涵 / BaoHan Talk",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%AB%8B%E5%A4%9A%E5%8C%85%E6%B6%B5-baohan-talk/id1838861694?uo=4"
    },
    {
        "name": "林慧",
        "show": "做自己很難嗎？",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%81%9A%E8%87%AA%E5%B7%B1%E5%BE%88%E9%9B%A3%E5%97%8E/id1625614829?uo=4"
    },
    {
        "name": "喬王的投資理財筆記",
        "show": "斜槓 槓槓槓",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%96%9C%E6%A7%93-%E6%A7%93%E6%A7%93%E6%A7%93/id1522239777?uo=4"
    },
    {
        "name": "樂筆",
        "show": "歡迎光臨",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%AD%A1%E8%BF%8E%E5%85%89%E8%87%A8/id1553101154"
    },
    {
        "name": "莊舒涵（卡姊）",
        "show": "其實我們都有病",
        "apple": "https://podcasts.apple.com/tw/podcast/%E6%88%91%E4%B8%8D%E6%98%AF%E7%97%85%E4%BA%BA-%E6%88%91%E6%98%AF%E5%8D%A1%E5%A7%8A/id1816381557?uo=4"
    },
    {
        "name": "主播/主持人朱楚文",
        "show": "科技領航家",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%A7%91%E6%8A%80%E9%A0%98%E8%88%AA%E5%AE%B6/id1485503209"
    },
    {
        "name": "布萊恩老師",
        "show": "",
        "apple": ""
    },
    {
        "name": "幼兒情緒教育學院-萬叔的心café",
        "show": "",
        "apple": ""
    },
    {
        "name": "全遠距工作的行銷人|Coco",
        "show": "",
        "apple": ""
    },
    {
        "name": "李柏鋒的擴大機",
        "show": "鋒富理財學",
        "apple": "https://podcasts.apple.com/tw/podcast/%E9%8B%92%E5%AF%8C%E7%90%86%E8%B2%A1%E5%AD%B8/id1570396032?uo=4"
    },
    {
        "name": "阿駿日常",
        "show": "",
        "apple": ""
    },
    {
        "name": "迷途艾比",
        "show": "迷途星球",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%BF%B7%E9%80%94%E6%98%9F%E7%90%83/id1597967789"
    },
    {
        "name": "高言值表達力教練｜竺宥璋｜小竺",
        "show": "這下言重了",
        "apple": "https://podcasts.apple.com/tw/podcast/%E9%80%99%E4%B8%8B%E8%A8%80%E9%87%8D%E4%BA%86/id1760705946?uo=4"
    },
    {
        "name": "張書書",
        "show": "",
        "apple": ""
    },
    {
        "name": "雷浩斯價值投資網",
        "show": "",
        "apple": ""
    },
    {
        "name": "瑪那熊諮商心理師",
        "show": "瑪那熊聊愛情",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%91%AA%E9%82%A3%E7%86%8A%E8%81%8A%E6%84%9B%E6%83%85/id1572389025?uo=4"
    },
    {
        "name": "趙函穎的營養健康週報",
        "show": "趙函穎的營養健康報報",
        "apple": "https://podcasts.apple.com/tw/podcast/%E8%B6%99%E5%87%BD%E7%A9%8E%E7%9A%84%E7%87%9F%E9%A4%8A%E5%81%A5%E5%BA%B7%E5%A0%B1%E5%A0%B1/id1704815000?uo=4"
    },
    {
        "name": "劉亦酉",
        "show": "",
        "apple": ""
    },
    {
        "name": "謎卡Mika Lin",
        "show": "米米說",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%B1%B3%E7%B1%B3%E8%AA%AA/id1752285824"
    },
    {
        "name": "蘋果老師",
        "show": "網紅，紅什麼",
        "apple": "https://podcasts.apple.com/tw/podcast/%E7%B6%B2%E7%B4%85-%E7%B4%85%E4%BB%80%E9%BA%BC/id1590745751?uo=4"
    },
    {
        "name": "Coco｜全遠距工作的行銷人",
        "show": "",
        "apple": ""
    },
    {
        "name": "Cynthia Huang黃馨儀",
        "show": "媽媽好神經病",
        "apple": "https://podcasts.apple.com/tw/podcast/%E5%AA%BD%E5%AA%BD%E5%A5%BD%E7%A5%9E%E7%B6%93%E7%97%85/id1552428220"
    }
];

function initKOLMatchmaker() {
    const unlockBtn = document.getElementById('kol-unlock-btn');
    const passwordInput = document.getElementById('kol-password-input');
    const lockScreen = document.getElementById('kol-lock-screen');
    const contentScreen = document.getElementById('kol-content-screen');
    const errorMsg = document.getElementById('kol-error-msg');
    
    // Check if already unlocked in this session
    if (sessionStorage.getItem('nextt_kol_unlocked') === 'true') {
        lockScreen.style.display = 'none';
        contentScreen.style.display = 'block';
        renderKOLList();
        initKOLSearch();
    }
    
    unlockBtn.addEventListener('click', () => {
        const password = passwordInput.value.trim().toLowerCase();
        // Authorized password nextt2026
        if (password === 'nextt2026') {
            sessionStorage.setItem('nextt_kol_unlocked', 'true');
            lockScreen.style.display = 'none';
            contentScreen.style.display = 'block';
            errorMsg.style.display = 'none';
            renderKOLList();
            initKOLSearch();
        } else {
            errorMsg.innerText = '❌ 密碼錯誤，請輸入 NextT 提供的專屬業者密碼。';
            errorMsg.style.display = 'block';
        }
    });
    
    // Form submission inside KOL panel
    const submitBtn = document.getElementById('kol-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const brandNameInput = document.getElementById('kol-brand-select').value.trim();
            const propose = document.getElementById('kol-product-propose').value.trim();
            
            // Get Checkboxes
            const checkCommission = document.getElementById('kol-check-commission').checked;
            const checkPrice = document.getElementById('kol-check-price').checked;
            const checkPropose = document.getElementById('kol-check-propose').checked;
            
            // Collect checked KOLs
            const checkedKols = [];
            const checkboxes = document.querySelectorAll('.kol-select-checkbox:checked');
            checkboxes.forEach(cb => {
                checkedKols.push(cb.value);
            });
            
            // Validations
            if (!brandNameInput) {
                alert('❌ 請填寫您的品牌名稱！');
                return;
            }
            if (!checkCommission) {
                alert('❌ 請確認並勾選「同意提供售價 20% 分潤」！');
                return;
            }
            if (!checkPrice) {
                alert('❌ 請確認並勾選「保證提供之價格低於市面公開折扣價」！');
                return;
            }
            if (!propose) {
                alert('❌ 請填寫預計提供的團購商品品項或組合！');
                return;
            }
            if (!checkPropose) {
                alert('❌ 請確認並勾選「確認已填寫完整商品組合與品項」！');
                return;
            }
            // Save application
            const app = {
                time: new Date().toLocaleString(),
                submittedAt: new Date().toISOString(),
                source: "github-pages",
                brandName: brandNameInput,
                propose: propose,
                rate: '20% (盛德好專案)',
                kols: checkedKols.length ? checkedKols.join(', ') : '未指定（由經紀公司評估建議）',
                status: '待審核'
            };

            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在送出媒合申請...';
            
            if (NEXTT_KOL_API_URL) {
                fetch(NEXTT_KOL_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(app)
                })
                    .then(async response => {
                        const result = await response.json().catch(() => ({}));
                        if (!response.ok || result.ok === false) {
                            throw new Error(result.error || "KOL 後台暫時無法接收資料");
                        }
                        showKOLSuccess();
                    })
                    .catch(err => {
                        console.error("Vercel KOL API error:", err);
                        alert(`❌ 媒合申請尚未送出。\n\n原因：${err.message || "後台連線失敗"}\n\n請稍後再試，或截圖聯繫 NextT 團隊。`);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalHTML;
                    });
            } else if (isFirebaseEnabled) {
                db.collection('kols').add(app)
                    .then(() => {
                        if (GOOGLE_SCRIPT_URL) {
                            fetch(GOOGLE_SCRIPT_URL, {
                                method: "POST",
                                mode: "no-cors",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ type: "kol", ...app })
                            }).catch(err => console.error("Error sending to GAS:", err));
                        }
                        showKOLSuccess();
                    })
                    .catch(err => {
                        alert('❌ 提交資料至雲端資料庫失敗，請確認網路連線。');
                        console.error(err);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalHTML;
                    });
            } else {
                let applications = [];
                const stored = localStorage.getItem('nextt_kol_applications');
                if (stored) {
                    applications = JSON.parse(stored);
                }
                applications.push(app);
                localStorage.setItem('nextt_kol_applications', JSON.stringify(applications));
                
                if (GOOGLE_SCRIPT_URL) {
                    fetch(GOOGLE_SCRIPT_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "kol", ...app })
                    }).catch(err => console.error("Error sending to GAS:", err));
                }
                showKOLSuccess();
            }
            
            function showKOLSuccess() {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                alert(`🎉 盛德好 KOL 媒合申請送出成功！\n品牌：${app.brandName}\n媒合KOL偏好：${app.kols}\n分潤：20%\n\nNextT 團隊將會儘快為您辦理媒合對接！`);
                document.getElementById('kol-brand-select').value = '';
                document.getElementById('kol-product-propose').value = '';
                document.getElementById('kol-check-commission').checked = false;
                document.getElementById('kol-check-price').checked = false;
                document.getElementById('kol-check-propose').checked = false;
                checkboxes.forEach(cb => cb.checked = false);
            }
        });
    }
}

function renderKOLList(filterText = "") {
    const container = document.getElementById('kol-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    const filtered = kolsList.filter(kol => 
        kol.name.toLowerCase().includes(filterText.toLowerCase()) || 
        kol.show.toLowerCase().includes(filterText.toLowerCase())
    );
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 1.5rem 0;">找不到符合的 KOL 節目...</p>`;
        return;
    }
    
    filtered.forEach(kol => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        div.style.padding = '0.6rem 0.8rem';
        div.style.background = '#f8fafc';
        div.style.borderRadius = 'var(--radius-sm)';
        div.style.border = '1px solid #f1f5f9';
        
        const kolValue = kol.show ? `${kol.name}｜${kol.show}` : kol.name;
        const appleLink = kol.apple
            ? `<a href="${kol.apple}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" style="display:inline-flex; align-items:center; gap:0.25rem; margin-top:0.35rem; font-size:0.72rem; color:#2563eb; text-decoration:none; font-weight:600;"><i class="fa-brands fa-apple"></i> Apple Podcast</a>`
            : `<span style="display:inline-block; margin-top:0.35rem; font-size:0.72rem; color:var(--text-muted);">Apple Podcast：尚無連結</span>`;

        div.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:0.75rem; min-width:0;">
                <div style="font-size:1.2rem; background:#eff6ff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex:0 0 auto;">🎙️</div>
                <div style="min-width:0;">
                    <strong style="color:var(--primary); font-size:0.9rem; display:block;">${kol.name}</strong>
                    ${kol.show ? `<span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:0.15rem;">節目：${kol.show}</span>` : `<span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:0.15rem;">節目：待確認</span>`}
                    ${appleLink}
                </div>
            </div>
            <div style="flex:0 0 auto;">
                <input type="checkbox" class="kol-select-checkbox" value="${kolValue}" style="width:18px; height:18px; cursor:pointer;">
            </div>
        `;
        container.appendChild(div);
    });
}

function initKOLSearch() {
    const searchInput = document.getElementById('kol-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderKOLList(e.target.value);
        });
    }
}

// 9. Admin render of KOL requests
function renderAdminKOLTable(data) {
    const tableBody = document.getElementById('admin-kol-table-body');
    const countBadge = document.getElementById('kol-reg-count');
    if (!tableBody) return;
    
    let applications = [];
    if (data) {
        applications = data;
    } else if (isFirebaseEnabled) {
        fetchCloudSubmissions();
        return;
    } else {
        const stored = localStorage.getItem('nextt_kol_applications');
        if (stored) {
            applications = JSON.parse(stored);
        }
    }
    
    if (countBadge) {
        countBadge.innerText = `共 ${applications.length} 筆申請`;
    }
    
    if (applications.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">尚無業者提交 KOL 媒合申請。請至前台「KOL 合作專區」輸入密碼登記。</td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = '';
        // Show newest first
        [...applications].reverse().forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="font-size: 0.8rem; color: #64748b;">${app.time}</span></td>
                <td><strong>${app.brandName}</strong></td>
                <td><div style="max-width: 250px; font-size: 0.85rem;" title="${app.propose}">${app.propose}</div></td>
                <td><span class="brand-badge" style="background: var(--accent-orange-light); color: var(--accent-orange);">${app.rate}</span></td>
                <td><span style="color: var(--primary); font-weight: 500;">${app.kols}</span></td>
                <td><span style="font-size: 0.8rem; background: #fef3c7; color: #d97706; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600;"><i class="fa-solid fa-spinner fa-spin"></i> ${app.status}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('rsvp-name').value.trim();
        const company = document.getElementById('rsvp-company').value.trim();
        const phone = document.getElementById('rsvp-phone').value.trim();
        const email = document.getElementById('rsvp-email').value.trim();
        const notes = document.getElementById('rsvp-notes').value.trim();
        
        const checkedSessions = [];
        const checkboxes = document.querySelectorAll('input[name="rsvp-sessions"]:checked');
        checkboxes.forEach(cb => checkedSessions.push(cb.value));
        
        if (checkedSessions.length === 0) {
            alert('請至少勾選一個欲出席的場次！');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在傳送報名資料...';
        
        const rsvpData = {
            time: new Date().toLocaleString(),
            submittedAt: new Date().toISOString(),
            source: "github-pages",
            name: name,
            company: company,
            phone: phone,
            email: email,
            sessions: checkedSessions.join(', '),
            notes: notes
        };

        if (NEXTT_RSVP_API_URL) {
            fetch(NEXTT_RSVP_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rsvpData)
            })
                .then(async response => {
                    const result = await response.json().catch(() => ({}));
                    if (!response.ok || result.ok === false) {
                        throw new Error(result.error || "報名 API 暫時無法接收資料");
                    }
                    showSuccess({ cloud: true });
                })
                .catch(err => {
                    console.error("Vercel RSVP API error:", err);
                    alert(`❌ 報名資料尚未送出。\n\n原因：${err.message || "後台連線失敗"}\n\n請稍後再試，或截圖聯繫主辦單位。`);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                });
        } else if (isFirebaseEnabled) {
            db.collection('rsvps').add(rsvpData)
                .then(() => {
                    if (GOOGLE_SCRIPT_URL) {
                        fetch(GOOGLE_SCRIPT_URL, {
                            method: "POST",
                            mode: "no-cors",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ type: "rsvp", ...rsvpData })
                        }).catch(err => console.error("Error sending to GAS:", err));
                    }
                    showSuccess();
                })
                .catch(err => {
                    console.error("Firebase error:", err);
                    alert("❌ 提交資料至雲端資料庫失敗，請確認網路連線。");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                });
        } else {
            if (GOOGLE_SCRIPT_URL) {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "rsvp", ...rsvpData })
                })
                .then(() => showSuccess())
                .catch(() => showSuccess());
            } else {
                setTimeout(() => {
                    showSuccess();
                }, 1000);
            }
        }
        
        function showSuccess(options = {}) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            
            if (!options.cloud && !isFirebaseEnabled && !GOOGLE_SCRIPT_URL) {
                const storedRsvps = JSON.parse(localStorage.getItem('nextt_rsvp_list') || '[]');
                storedRsvps.push(rsvpData);
                localStorage.setItem('nextt_rsvp_list', JSON.stringify(storedRsvps));
                alert(`✨ [測試模式] 報名成功！資料已暫存於本機：\n${name} 已登記：\n${checkedSessions.join('\n')}`);
            } else {
                alert(`✨ 報名成功！\n\n感謝您的預約，${name}。我們已為您登記出席場次：\n${checkedSessions.join('\n')}\n\n期待與您在沙龍現場相見！`);
            }
            form.reset();
        }
    });
}


