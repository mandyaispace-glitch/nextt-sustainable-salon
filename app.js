// Google Apps Script Web App URL (Paste your URL once deployed. If empty, uses LocalStorage/Firebase only)
const GOOGLE_SCRIPT_URL = "";

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
        price: 230,
        esgLbl: "🌱 減少 3.0kg 剩食，活化 6 坪減碳農地",
        land: 6,
        water: 0,
        waste: 3.0,
        jobs: 0.05,
        link: "https://page.line.me/860pfyue?oat_content=url&openQrModal=true",
        emoji: "🍊",
        brandName: "川涌果園",
        visualDesc: "溫慢的夕陽橘與莫蘭迪藍交織。畫面上呈現清涼的氣泡感，與飽滿的稻穗米香點綴。",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #4f6f8f 100%)",
        imageUrl: "images/chuanyong_package.png"
    },
    {
        id: "c2",
        brandId: "yunchang",
        title: "【厚實堅果香・職人減糖花生禮】",
        subtitle: "明星零嘴：三代傳承・微甜減糖花生糖（雲林元長核心產區契作）",
        desc: "「誰說台式花生糖一定甜膩又黏牙？緣長好事顛覆傳統，大膽進行『減糖革命』！成分極簡純粹，咬下去只有滿口爆發的雲林在地花生香，香脆清爽不黏手。下午茶開會來一塊，補充滿滿優質植物油脂與好體力，既解饞又完全沒有罪惡感！」",
        price: 300,
        esgLbl: "🌱 守護 3 代農業傳承，支持 100% 在地契作小農",
        land: 13,
        water: 0,
        waste: 0,
        jobs: 0.35,
        link: "https://line.me/R/ti/p/@899rxilc",
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
        price: 280,
        esgLbl: "🌱 100% 無化學農藥，活化破百公頃休耕地",
        land: 10,
        water: 0,
        waste: 0,
        jobs: 0.25,
        link: "https://openchat.line.me/tw/cover/jsThnluwcHgl6yxczBW3kCVguCqZ4YptkcF7EygtV0plYiuN_UqSKJ1lA5w?utm_source=line-openchat-seo&utm_medium=search_keyword&utm_campaign=default",
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
        price: 250,
        esgLbl: "支持 500L 循環水過濾，減抽 100% 地下水",
        land: 0,
        water: 500,
        waste: 0,
        jobs: 0.1,
        link: "https://oashop.line.me/shops/eqh9088q",
        emoji: "🍤",
        brandName: "一夫水產",
        visualDesc: "湛藍澄澈的循環水波紋。畫面呈現急速冷凍川燙蝦仁的粉嫩色澤與鮮甜彈牙感。",
        gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)"
    },
    {
        id: "c5",
        brandId: "caoben",
        title: "品牌精選：【酸甜夢幻・安心零嘴】",
        subtitle: "草本誠食「草莓爆米花」",
        desc: "「嚴選友善耕作草莓，結合非基改爆米花，無人工色素與香精。每一口都是酸甜自然莓果香，追劇大口吃超安心！」",
        price: 150,
        esgLbl: "支持無毒草莓契作與青年回鄉就業",
        land: 4,
        water: 0,
        waste: 0.5,
        jobs: 0.05,
        link: "https://shopee.tw/puresisoap",
        emoji: "🍿",
        brandName: "草本誠食",
        visualDesc: "清新的草莓粉嫩紅與莫蘭迪灰藍. 畫面呈現蓬鬆的爆米花與乾燥草莓碎片的點綴。",
        gradient: "linear-gradient(135deg, #f43f5e 0%, #cbd5e1 100%)"
    }
];

// Active databases in memory
let brandsData = {};
let productsData = [];
let cart = [];

// Load data on start
loadData();

function loadData() {
    const storedBrands = localStorage.getItem('nextt_brands_data_v12');
    const storedProducts = localStorage.getItem('nextt_products_data_v12');
    const storedCart = localStorage.getItem('nextt_cart_data_v12');
    
    if (storedBrands) {
        brandsData = JSON.parse(storedBrands);
    } else {
        brandsData = JSON.parse(JSON.stringify(defaultBrands));
        localStorage.setItem('nextt_brands_data_v12', JSON.stringify(brandsData));
    }
    
    if (storedProducts) {
        productsData = JSON.parse(storedProducts);
    } else {
        productsData = JSON.parse(JSON.stringify(defaultProducts));
        localStorage.setItem('nextt_products_data_v12', JSON.stringify(productsData));
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
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            hotspots.forEach(h => h.classList.remove('active'));
            hotspot.classList.add('active');
            
            const brandId = hotspot.getAttribute('data-brand');
            updateBrandDetailCard(brandId);
        });
    });
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
        
        // Determine button style for LINE vs Shopee
        const isShopee = p.link && p.link.includes('shopee.tw');
        const btnText = '前往賣場';
        const btnIcon = isShopee ? '<i class="fa-solid fa-store"></i>' : '<i class="fa-brands fa-line"></i>';
        const btnClass = isShopee ? 'pairing-btn-redirect btn-shopee' : 'pairing-btn-redirect btn-line';
        
        const visualContent = p.imageUrl 
            ? `<div class="pairing-visual" onclick="openImageModal('${p.imageUrl}', '${p.title}')" style="background: #f4f6f8; padding: 0; min-height: 140px; height: 140px; display: flex; align-items: center; justify-content: center; box-shadow: none; border: 1px solid var(--morandi-border); cursor: pointer; position: relative;">
                   <img src="${p.imageUrl}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: contain; border-radius: var(--radius-sm);">
                   <div class="gallery-zoom-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.25); opacity: 0; transition: 0.3s; color: white; border-radius: var(--radius-sm);"><i class="fa-solid fa-magnifying-glass-plus" style="font-size: 1.5rem;"></i></div>
               </div>`
            : `<div class="pairing-visual" style="background: ${p.gradient || 'linear-gradient(135deg, #5c768d 0%, #34495e 100%)'}; min-height: 140px; height: 140px; padding: 1.25rem;">
                   <div style="font-size: 2rem; margin-bottom: 0.25rem;">${p.emoji || '🌿'}</div>
                   <div class="pairing-visual-title" style="font-size: 1rem;">${p.title.includes('：') ? p.title.split('：')[1] : p.title}</div>
                   <div class="pairing-visual-concept" style="font-size: 0.7rem; max-width: 160px;">${p.visualDesc || ''}</div>
               </div>`;
            
        card.innerHTML = `
            ${visualContent}
            <div class="pairing-content">
                <div class="pairing-header">
                    <span class="pairing-brand">${p.brandName || ''}</span>
                    <h4 class="pairing-title" style="font-size: 1.15rem; margin: 0.25rem 0;">${p.title}</h4>
                    <div class="pairing-subtitle" style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;">${p.subtitle || ''}</div>
                    <p class="pairing-desc">${p.desc}</p>
                    <span class="product-esg-lbl"><i class="fa-solid fa-leaf"></i> ${p.esgLbl}</span>
                </div>
                <div class="pairing-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px dashed rgba(79, 111, 143, 0.1);">
                    <span class="product-price" style="font-weight: 700; color: var(--primary); font-size: 1.1rem;">NT$ ${p.price}</span>
                    <div class="pairing-action-row" style="flex-grow: 1; display: flex; justify-content: flex-end;">
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
        localStorage.setItem('nextt_cart_data_v12', JSON.stringify(cart));
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
    
    localStorage.setItem('nextt_cart_data_v12', JSON.stringify(cart));
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
    
    localStorage.setItem('nextt_cart_data_v12', JSON.stringify(cart));
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
    { name: "郝旭烈/郝聲音", show: "郝聲音" },
    { name: "五吉郎", show: "五吉郎" },
    { name: "精算媽咪的家計簿｜珊迪兔", show: "精算媽咪的家計簿" },
    { name: "不敗教主-陳重銘", show: "不敗教主陳重銘" },
    { name: "布姐陪你聰明工作創意生活", show: "布姐的沙發" },
    { name: "瓦基閱讀前哨站", show: "下一本讀什麼？" },
    { name: "蕭邦", show: "蕭邦相談室" },
    { name: "Dr Selena", show: "小資變有錢｜Dr.Selena生活理財王" },
    { name: "林程揚｜Hank大叔 / 維琪的幸福叮嚀", show: "能量黑客" },
    { name: "胡咪老師", show: "分手的99個理由" },
    { name: "Vito大叔", show: "粉紅地獄辛辣麵" },
    { name: "梁哲維", show: "OHMYBOOK｜哲維說書" },
    { name: "宋家小館｜Becky", show: "宋家小館" },
    { name: "尼可這樣說", show: "尼可這樣說" },
    { name: "美股夢想家", show: "夢想家說股事" },
    { name: "我的動齡限量版", show: "我的動齡限量版" },
    { name: "哇賽心理學_蔡宇哲", show: "哇賽心理學" },
    { name: "GK爸爸", show: "GK爸爸原創故事繪本" },
    { name: "30節約男子", show: "財富餐車不打烊" },
    { name: "美股航海王", show: "航海王的富人學" },
    { name: "美業幹什麼｜蔡佩陵", show: "美業幹什麼" },
    { name: "無所不試無樂不作", show: "無所不試 無樂不作" },
    { name: "加班當爸媽．櫻桃可可CherryCoco", show: "加班當爸媽｜櫻桃可可CherryCoco" },
    { name: "聲音表達講師林依柔", show: "說話人聲" },
    { name: "丁菱娟", show: "丁菱娟的邊走邊想" },
    { name: "莫菲穿搭", show: "【莫轉台】-試穿新人生" },
    { name: "楊月娥（楊肉爐）", show: "楊肉盧" },
    { name: "蘇絢慧分享空間", show: "蘇心時光" },
    { name: "山姆書書", show: "山姆書書" },
    { name: "主播/主持人朱楚文", show: "科技領航家" },
    { name: "別人的工作最有趣｜Fiona", show: "別人的工作最有趣" },
    { name: "玩命之徒｜林尚諾大師兄", show: "玩命之徒" },
    { name: "閱讀聊樂key", show: "閱讀聊樂KEY" },
    { name: "爛泥媽媽的重生日記（Jill)", show: "爛泥Jill式優雅" },
    { name: "人生啊！小歐", show: "人生啊｜陪你一起看懂人生" },
    { name: "張忘形", show: "人類行為研究社" },
    { name: "Fire人生大學｜道哥", show: "FIRE 人生大學" },
    { name: "小思大維｜雪柔", show: "小思大維" },
    { name: "姐姐不想懂事了｜莉安君怡 / 姊姊不想懂事了", show: "《姐姐不想懂事了》 | Soft Rebellion" },
    { name: "品牌女子A娜", show: "你也想紅嗎" },
    { name: "治療師瑪奇", show: "教出你的路" },
    { name: "孫治華", show: "人生挖WoW-企業人生策略學" },
    { name: "聰明主婦的生活投資學", show: "聰明生活投資學" },
    { name: "文森說書", show: "文森說書" },
    { name: "孫子玲", show: "子玲的親子聊心屋-媽咪的自我成長&親子教養" },
    { name: "王琄", show: "琄蜜莉的異想世界" },
    { name: "佐依Zoey", show: "佐編茶水間" },
    { name: "斜槓空姐cindy", show: "錢進頭等艙" },
    { name: "潘思璇ＣＰ", show: "CP有主見" },
    { name: "即薑抵達｜薑咪", show: "即薑抵達" },
    { name: "小河馬媽媽", show: "來晚無添加河粉吧！" },
    { name: "慢活夫妻Dewi&George", show: "慢活夫妻－專業美股投資與理財" },
    { name: "崔咪", show: "一不小心太漂亮" },
    { name: "微光中的貓| Claire Hsiao", show: "《 微光中的北極星 》人生策略、自我成長、內在力量" },
    { name: "育兒專機｜犬媽 / 犬兒媽咪の育兒手帳", show: "育兒專機" },
    { name: "廣播主持人_楊凱涵", show: "請多包涵 / BaoHan Talk" },
    { name: "林慧", show: "做自己很難嗎？" },
    { name: "喬王的投資理財筆記", show: "斜槓 槓槓槓" },
    { name: "樂筆", show: "歡迎光臨" },
    { name: "下半場陪談師＿張嘉茹老師", show: "下半場人生陪談師" },
    { name: "李柏鋒的擴大機", show: "鋒富理財學" },
    { name: "迷途艾比", show: "迷途星球" },
    { name: "高言值表達力教練｜竺宥璋｜小竺", show: "這下言重了" },
    { name: "莊舒涵（卡姊）", show: "我不是病人，我是卡姊！" },
    { name: "瑪那熊諮商心理師", show: "瑪那熊聊愛情" },
    { name: "趙函穎的營養健康週報", show: "趙函穎的營養健康報報" },
    { name: "謎卡Mika Lin", show: "米米說" },
    { name: "蘋果老師", show: "網紅，紅什麼" },
    { name: "Cynthia Huang黃馨儀", show: "媽媽好神經病" }
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
            const brandId = document.getElementById('kol-brand-select').value;
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
            if (checkedKols.length === 0) {
                alert('❌ 請至少勾選一位您有合作意願的 KOL！');
                return;
            }
            
            // Save application
            const app = {
                time: new Date().toLocaleString(),
                brandName: brandsData[brandId] ? brandsData[brandId].name : brandId,
                propose: propose,
                rate: '20% (盛德好專案)',
                kols: checkedKols.join(', '),
                status: '待審核'
            };
            
            if (isFirebaseEnabled) {
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
                alert(`🎉 盛德好 KOL 媒合申請送出成功！\n品牌：${app.brandName}\n媒合KOL：${app.kols}\n分潤：20%\n\nNextT 團隊將會儘快為您辦理媒合對接！`);
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
        
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="font-size:1.2rem; background:#eff6ff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;">🎙️</div>
                <div>
                    <strong style="color:var(--primary); font-size:0.9rem;">${kol.name}</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-left:0.5rem;">節目：${kol.show}</span>
                </div>
            </div>
            <div>
                <input type="checkbox" class="kol-select-checkbox" value="${kol.name}" style="width:18px; height:18px; cursor:pointer;">
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
            name: name,
            company: company,
            phone: phone,
            email: email,
            sessions: checkedSessions.join(', '),
            notes: notes
        };

        if (isFirebaseEnabled) {
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
        
        function showSuccess() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            
            if (!isFirebaseEnabled) {
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


