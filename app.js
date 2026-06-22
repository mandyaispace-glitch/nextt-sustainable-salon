// Google Apps Script Web App URL (Paste your URL once deployed. If empty, uses LocalStorage only)
const GOOGLE_SCRIPT_URL = "";

// Default Database constants to fall back on
const defaultBrands = {
    "yufu": {
        name: "一夫水產",
        badge: "生態水產養殖",
        tag: "#循環水養殖",
        desc: "以頂級水產為引，分享永續養殖觀點。採用循環水物理過濾與專利益生菌養殖，保證無抗生素與防腐劑，帶給餐桌最純粹的鮮甜體驗。",
        metric1: "100%",
        metric1Lbl: "循環水過濾率",
        metric2: "0%",
        metric2Lbl: "化學藥劑殘留",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
        land: 0,
        water: 500,
        waste: 0,
        jobs: 0.1
    },
    "yunchang": {
        name: "緣長好事",
        badge: "古法傳承・小農契作",
        tag: "#青年返鄉",
        desc: "嚴選在地契作花生，秉持古法手作花生糖。無添加防腐劑，透過與在地花生農民的合作，保障土地與農人收益，傳承百年香濃滋味。",
        metric1: "12 戶",
        metric1Lbl: "契作小農",
        metric2: "100%",
        metric2Lbl: "在地花生使用",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        land: 5,
        water: 0,
        waste: 0,
        jobs: 0.15
    },
    "chuanyong": {
        name: "川涌果園",
        badge: "循環經濟・果皮再製",
        tag: "#賸食綠色加值",
        desc: "堅持以全有機肥栽培柑橘，並創意將賣相不佳的格外品與果皮再製，製成柑橘米香與果醋。為格外品找到新出路，減少碳足跡與浪費。",
        metric1: "120 kg",
        metric1Lbl: "格外果皮利用",
        metric2: "100%",
        metric2Lbl: "有機肥栽培",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        land: 8,
        water: 0,
        waste: 3,
        jobs: 0.08
    },
    "xingfu": {
        name: "幸福良食",
        badge: "青銀共創・耕地活化",
        tag: "#活化休耕地",
        desc: "由返鄉青年帶領在地高齡農夫，以友善耕作方式種植黑豆。成功活化台南休耕農地，建立「青銀共創」的健康食農生態鏈。",
        metric1: "15 公頃",
        metric1Lbl: "活化休耕農地",
        metric2: "100%",
        metric2Lbl: "無化學農藥",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        land: 10,
        water: 0,
        waste: 0,
        jobs: 0.25
    },
    "xingfu-tea": {
        name: "幸福良食 (黑豆茶專區)",
        badge: "青銀共創・耕地活化",
        tag: "#無防腐劑",
        desc: "採用友善農法栽種之精選黑豆，經過低溫烘焙熟成。沖泡香氣濃郁，無任何化學添加，每一口都代表對高齡農夫與健康的永續支持。",
        metric1: "100%",
        metric1Lbl: "台灣在地生產",
        metric2: "0 殘留",
        metric2Lbl: "381項農藥檢驗",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        land: 8,
        water: 0,
        waste: 0,
        jobs: 0.2
    },
    "chuanyong-vinegar": {
        name: "川涌果園 (果醋氣泡飲)",
        badge: "循環經濟・格外果品",
        tag: "#零浪費研發",
        desc: "以慢速發酵法製成天然柑橘醋，搭配氣泡水呈現微酸爽口風味。將無法進入主流通路的美麗格外品，化為夏日最環保的消暑極品。",
        metric1: "2.5kg/瓶",
        metric1Lbl: "廢棄柑橘果皮減量",
        metric2: "100%",
        metric2Lbl: "天然發酵熟成",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        land: 6,
        water: 0,
        waste: 2.5,
        jobs: 0.05
    }
};

const defaultProducts = [
    {
        id: "p1",
        brandId: "yufu",
        title: "一夫水產 鮮凍川燙蝦仁",
        desc: "生態水循環養殖，捕撈後急速冷凍，川燙即食。保證無發泡劑，極致彈牙。",
        price: 250,
        esgLbl: "支持 500L 循環水養殖",
        land: 0,
        water: 500,
        waste: 0,
        jobs: 0.1
    },
    {
        id: "p2",
        brandId: "yunchang",
        title: "緣長好事 古法手工花生糖",
        desc: "契作在地土豆，麥芽慢火熬煮。酥脆不黏牙，傳承三代的永續手藝。",
        price: 180,
        esgLbl: "支持 5 坪契作農地與地方青年就業",
        land: 5,
        water: 0,
        waste: 0,
        jobs: 0.15
    },
    {
        id: "p3",
        brandId: "chuanyong",
        title: "川涌果園 柑橘米香爆米丸",
        desc: "使用格外品柑橘果泥，結合小農無毒白米。淡淡香橘味，美味且零浪費。",
        price: 150,
        esgLbl: "減少 3kg 柑橘格外品浪費",
        land: 8,
        water: 0,
        waste: 3,
        jobs: 0.08
    },
    {
        id: "p4",
        brandId: "xingfu",
        title: "幸福良食 芝麻黑豆酥",
        desc: "台南在地友善黑豆與黑芝麻的健康結合。酥香可口，高鈣健康營養。",
        price: 160,
        esgLbl: "活化 10 坪台南休耕地與青銀共創",
        land: 10,
        water: 0,
        waste: 0,
        jobs: 0.25
    },
    {
        id: "p5",
        brandId: "xingfu-tea",
        title: "幸福良食 焙炒黑豆茶包 (12入)",
        desc: "友善無毒黑豆，經高溫焙炒。無咖啡因，冷泡熱沖皆宜，高齡農友親手包裝。",
        price: 120,
        esgLbl: "支持 8 坪無毒黑豆契作",
        land: 8,
        water: 0,
        waste: 0,
        jobs: 0.2
    },
    {
        id: "p6",
        brandId: "chuanyong-vinegar",
        title: "川涌果園 冰柑橘醋氣泡飲",
        desc: "天然古法柑橘釀造醋調配，沁涼解渴。氣泡細緻，柑橘清香。",
        price: 80,
        esgLbl: "消耗 2.5kg 格外果皮材料",
        land: 6,
        water: 0,
        waste: 2.5,
        jobs: 0.05
    }
];

// Active databases in memory
let brandsData = {};
let productsData = [];
let cart = [];

// Load data on start
loadData();

function loadData() {
    const storedBrands = localStorage.getItem('nextt_brands_data');
    const storedProducts = localStorage.getItem('nextt_products_data');
    
    if (storedBrands) {
        brandsData = JSON.parse(storedBrands);
    } else {
        brandsData = JSON.parse(JSON.stringify(defaultBrands));
        localStorage.setItem('nextt_brands_data', JSON.stringify(brandsData));
    }
    
    if (storedProducts) {
        productsData = JSON.parse(storedProducts);
    } else {
        productsData = JSON.parse(JSON.stringify(defaultProducts));
        localStorage.setItem('nextt_products_data', JSON.stringify(productsData));
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
    if (document.getElementById('kol-unlock-btn')) {
        initKOLMatchmaker();
    }
    
    // Back-end admin initializers
    if (document.getElementById('admin-brands-table-body')) {
        renderAdminTable();
        initAdminReset();
    }
    if (document.getElementById('admin-kol-table-body')) {
        renderAdminKOLTable();
    }
    if (document.getElementById('ai-run-btn')) {
        initAIProcessor();
    }
});

// 1. Navigation Logic
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetContent = document.getElementById(tab.getAttribute('data-tab'));
            if (targetContent) {
                targetContent.classList.add('active');
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
        addBtn.onclick = () => {
            const product = productsData.find(p => p.brandId === brandId);
            if (product) {
                addToCart(product.id);
            } else {
                alert(`已成功記錄您對 ${brand.name} 的支持！`);
            }
        };
    }
}

// 3. Render Product Catalog
function renderCatalog() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    productsData.forEach(p => {
        const brand = brandsData[p.brandId];
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <div class="video-badge-overlay" onclick="event.stopPropagation(); openVideoModal('${brand.videoUrl}')">
                    <i class="fa-solid fa-play"></i> 影音介紹
                </div>
                <div style="font-size: 3rem;">${getEmojiForProduct(p.id)}</div>
            </div>
            <div class="product-info">
                <div class="product-brand">${brand.name}</div>
                <h4 class="product-title">${p.title}</h4>
                <p class="product-desc">${p.desc}</p>
                <span class="product-esg-lbl"><i class="fa-solid fa-leaf"></i> ${p.esgLbl}</span>
                <div class="product-footer">
                    <span class="product-price">NT$ ${p.price}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">加入選物籃</button>
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

// 4. Cart Logic
function initCart() {
    const checkoutBtn = document.getElementById('checkout-submit-btn');
    if (!checkoutBtn) return;
    
    checkoutBtn.addEventListener('click', () => {
        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        
        if (cart.length === 0) {
            alert('選物籃還是空的喔！');
            return;
        }
        if (!name || !phone) {
            alert('請填寫姓名與聯絡電話以送出預購單！');
            return;
        }
        
        let summaryText = `【NextT 永續沙龍預購單】\n預購姓名：${name}\n聯絡電話：${phone}\n\n預購品項：\n`;
        let itemsSummary = "";
        cart.forEach(item => {
            summaryText += `- ${item.product.title} (NT$ ${item.product.price}) × ${item.quantity}\n`;
            itemsSummary += `- ${item.product.title} × ${item.quantity}\n`;
        });
        
        const impact = calculateImpact();
        summaryText += `\n此預購單累計創造之 ESG 永續影響力：\n`;
        summaryText += `- 耕地活化面積: ${impact.land} 坪\n`;
        summaryText += `- 水資源回收再利用: ${impact.water} 公升\n`;
        summaryText += `- 剩食/格外品轉化: ${impact.waste} 公斤\n`;
        summaryText += `- 支持契作與青銀共創就業份額: ${impact.jobs.toFixed(2)} 人\n`;
        summaryText += `\n(已為您生成預購資料！現場團購優惠已套用)`;
        
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
        document.getElementById('checkout-name').value = '';
        document.getElementById('checkout-phone').value = '';
    });
}

window.addToCart = function(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.product.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }
    updateCartUI();
};

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const countBadge = document.getElementById('cart-count');
    
    if (countBadge) countBadge.innerText = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    
    if (itemsContainer) {
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1.5rem 0;">選物籃還是空的，點選商品加入吧！</p>';
        } else {
            itemsContainer.innerHTML = '';
            cart.forEach(item => {
                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
                    <div class="cart-item-name">${item.product.title} (NT$ ${item.product.price}) × ${item.quantity}</div>
                    <div class="cart-item-action">
                        <button class="cart-remove-btn" onclick="removeFromCart('${item.product.id}')">移除</button>
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
        land += item.product.land * item.quantity;
        water += item.product.water * item.quantity;
        waste += item.product.waste * item.quantity;
        jobs += item.product.jobs * item.quantity;
    });
    
    return { land, water, waste, jobs };
}

window.removeFromCart = removeFromCart; // Expose globally

// 5. AI Onboarding Assistant Logic
function initAIProcessor() {
    const runBtn = document.getElementById('ai-run-btn');
    const emptyState = document.getElementById('ai-empty-state');
    const loadingState = document.getElementById('ai-loading-state');
    const resultsState = document.getElementById('ai-results-state');
    
    if (!runBtn) return;
    
    runBtn.addEventListener('click', () => {
        const url = document.getElementById('ai-web-url').value;
        const igText = document.getElementById('ai-ig-post').value;
        const targetBrandId = document.getElementById('ai-brand-target').value;
        
        if (!igText && !url) {
            alert('請至少填寫官網連結或 IG 貼文內容！');
            return;
        }
        
        // Show Loading
        emptyState.style.display = 'none';
        resultsState.style.display = 'none';
        loadingState.style.display = 'block';
        
        // Simulate AI Processing (2 seconds)
        setTimeout(() => {
            loadingState.style.display = 'none';
            resultsState.style.display = 'flex';
            
            const brandName = brandsData[targetBrandId] ? brandsData[targetBrandId].name : "小農品牌";
            
            // Populate Mock AI Results based on selected brand
            document.getElementById('ai-original-summary').innerText = `分析來源: ${url || '手動素材貼上'} \n套用業者: ${brandName}\n摘要長度: ${igText ? igText.substring(0, 80) + '...' : '官網自動解析完成'}`;
            
            // Specific content template based on target brand
            let refinedText = "";
            let tagPillsHTML = "";
            let esgGoalsHTML = "";
            
            if (targetBrandId === 'yufu') {
                refinedText = `「生態養殖的極致，以綠色循環守護蔚藍」<br><br><b>一夫水產</b> 始終堅持『零用藥』與『永續共生』理念。本次沙龍展示的『川燙蝦仁』採用 100% 循環水物理過濾系統進行陸上高科技室內養殖，相較於傳統戶外抽水養殖，能有效省下數萬公升水資源。生產全流程無任何化學添加，從源頭保證消費者的健康與海洋生態環境的永續。`;
                tagPillsHTML = `<span class="diff-tag-pill">#室內循環水</span><span class="diff-tag-pill">#零用藥安全水產</span><span class="diff-tag-pill">#永續海洋資源</span>`;
                esgGoalsHTML = `• 符合 SDG 14 (保育海洋與海洋資源) 與 SDG 12 (責任消費與生產)。<br>• 為大型超市通路及跨國飯店提供無毒低碳的海鮮採購來源。`;
            } else if (targetBrandId === 'chuanyong' || targetBrandId === 'chuanyong-vinegar') {
                refinedText = `「柑橘大收成，格外品的新生故事」<br><br><b>川涌果園</b>深耕台灣在地柑橘栽植，長期致力於<b>友善土地的減碳農法</b>，全面採用<b>100% 有機肥料</b>栽培，嚴格拒絕化學除草劑。<br><br>為了打破傳統格外品被拋棄的命運，我們將其精心提煉，研發出<b>『柑橘醋氣泡飲』</b>與<b>『柑橘米香爆米丸』</b>，以綠色加值思維創造格外品的第二生命。每一口酥脆與酸甜，都在減少 2.5kg 的剩食浪費，並實質活化了 6 坪以上的友善果園面積。`;
                tagPillsHTML = `<span class="diff-tag-pill">#減碳農法</span><span class="diff-tag-pill">#格外品加值</span><span class="diff-tag-pill">#賸食綠色經濟</span><span class="diff-tag-pill">#100%有機栽培</span>`;
                esgGoalsHTML = `• 符合 SDG 12 (責任消費與生產) 與 SDG 15 (陸地生態)。<br>• 協助大型零售業（如三商集團）綠色採購之格外加分項目。`;
            } else if (targetBrandId === 'xingfu' || targetBrandId === 'xingfu-tea') {
                refinedText = `「高齡農夫與回鄉青年的共同心願」<br><br><b>幸福良食</b> 成功在台南推廣無毒黑豆種植。我們以契作方式，由青年團隊提供技術與行銷，邀請在地平均 75 歲的高齡農夫一起耕作，成功活化了超過 15 公頃的休耕農地。沙龍限定的黑豆酥與低溫烘焙黑豆茶，無防腐劑、無農藥殘留，是一份傳遞土地關懷與銀髮族尊嚴的溫慢點心。`;
                tagPillsHTML = `<span class="diff-tag-pill">#青銀共創</span><span class="diff-tag-pill">#活化休耕地</span><span class="diff-tag-pill">#無化學防腐劑</span><span class="diff-tag-pill">#友善無毒契作</span>`;
                esgGoalsHTML = `• 符合 SDG 8 (尊嚴工作與經濟成長) 與 SDG 11 (永續城鄉與社區)。<br>• 為企業 ESG 節慶禮盒及綠色辦公室茶點提供故事性極強的社會責任方案。`;
            } else {
                refinedText = `「契作花生的在地溫暖，用老手藝傳遞好事」<br><br><b>緣長好事</b> 秉持古法，堅持手作花生糖。我們支持了超過 12 戶在地花生農戶，確保他們獲得公正的契作收入，鼓勵青年留鄉發展。精選當季飽滿土豆，無防腐劑，每一顆花生糖都是對台灣傳統農業文化與小農生計的堅實支持。`;
                tagPillsHTML = `<span class="diff-tag-pill">#小農契作花生</span><span class="diff-tag-pill">#青年返鄉創業</span><span class="diff-tag-pill">#百年手藝傳承</span>`;
                esgGoalsHTML = `• 符合 SDG 1 (消除貧窮) 與 SDG 12 (責任消費與生產)。<br>• 完美的通路伴手禮與年節採購首選，富含厚實的在地溫情與文化故事。`;
            }
            
            document.getElementById('ai-refined-story').innerHTML = refinedText;
            
            const tagsContainer = document.getElementById('ai-generated-tags');
            tagsContainer.innerHTML = tagPillsHTML;
            
            const esgContainer = document.getElementById('ai-esg-goals');
            esgContainer.innerHTML = esgGoalsHTML;
            
        }, 2000);
    });
    
    // Save/Publish Button to update LocalStorage
    const saveBtn = document.getElementById('ai-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const targetBrandId = document.getElementById('ai-brand-target').value;
            const refinedStory = document.getElementById('ai-refined-story').innerHTML;
            
            // Extract the first tag pill
            const tagPills = document.querySelectorAll('#ai-generated-tags .diff-tag-pill');
            let firstTag = "#永續耕作";
            if (tagPills.length > 0) {
                firstTag = tagPills[0].innerText;
            }
            
            if (brandsData[targetBrandId]) {
                // Update story and tag
                // Convert <br> back to simple newlines for description field
                brandsData[targetBrandId].desc = refinedStory.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tag details
                brandsData[targetBrandId].tag = firstTag;
                
                // Write back to LocalStorage
                localStorage.setItem('nextt_brands_data', JSON.stringify(brandsData));
                
                alert(`✨ 【${brandsData[targetBrandId].name}】的資料已成功發佈！與前台資料即時連動同步。`);
                
                // Reload admin table
                renderAdminTable();
                
                // Reset AI panel
                emptyState.style.display = 'block';
                resultsState.style.display = 'none';
            }
        });
    }
}

// 6. Admin Panel list renderer
function renderAdminTable() {
    const tableBody = document.getElementById('admin-brands-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    Object.keys(brandsData).forEach(key => {
        const brand = brandsData[key];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${brand.name}</strong></td>
            <td><span class="brand-badge">${brand.badge}</span></td>
            <td><span style="color: var(--accent-orange); font-weight: 500;">${brand.tag}</span></td>
            <td><div style="max-width: 380px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${brand.desc}">${brand.desc}</div></td>
            <td><span style="font-size: 0.85rem; color: #15803d; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> 本地儲存已同步</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function initAdminReset() {
    const resetBtn = document.getElementById('reset-db-btn');
    if (!resetBtn) return;
    
    resetBtn.addEventListener('click', () => {
        if (confirm('確定要將所有業者資料與KOL登記紀錄重設嗎？這會清除您所有的 AI 修改與登記申請。')) {
            localStorage.removeItem('nextt_brands_data');
            localStorage.removeItem('nextt_products_data');
            localStorage.removeItem('nextt_kol_applications');
            loadData();
            renderAdminTable();
            renderAdminKOLTable();
            alert('已成功重設為原始狀態！');
        }
    });
}

// 7. YouTube Embed Modals
function initModals() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    const closeBtn = document.getElementById('modal-close-btn');
    
    if (!modal) return;
    
    window.openVideoModal = function(url) {
        if (iframe) iframe.src = url;
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

// 8. KOL Matchmaker (Front-end Private Tab)
const kolsList = [
    { name: "郝旭烈", show: "郝聲音" },
    { name: "五吉郎", show: "五吉郎" },
    { name: "精算媽咪", show: "精算媽咪的家計簿" },
    { name: "不敗教主", show: "不敗教主陳重銘" },
    { name: "布姐陪你", show: "布姐的沙發" },
    { name: "瓦基", show: "下一本讀什麼" },
    { name: "蕭邦", show: "蕭邦相談室" },
    { name: "Dr. Selena", show: "小資變有錢" },
    { name: "林長揚", show: "能量暴客" },
    { name: "胡咪老師", show: "分手的勇氣" },
    { name: "Vito大叔", show: "粉紅地獄" },
    { name: "梁哲維", show: "OHMY BOSS" },
    { name: "末家小館", show: "末家小館" },
    { name: "尼可這樣", show: "尼可這樣說" },
    { name: "美股夢想", show: "美股夢想家" },
    { name: "我的動畫", show: "我的動畫" },
    { name: "哇賽心理", show: "哇賽心理學" },
    { name: "GK爸爸", show: "GK爸爸" },
    { name: "30節約男", show: "30節約男" },
    { name: "美股航海", show: "美股航海王" },
    { name: "艾葉峰", show: "艾葉峰" },
    { name: "無所不談", show: "無所不談" },
    { name: "加班當爸", show: "加班當爸爸" },
    { name: "聲音表述", show: "說活人聲" },
    { name: "丁菱娟", show: "丁菱娟" },
    { name: "莫莉", show: "莫莉的台" },
    { name: "楊月娥", show: "楊肉盧" },
    { name: "蘇絢慧", show: "蘇心時光" },
    { name: "山姆書書", show: "山姆書書" },
    { name: "主播愛科", show: "科技領航" },
    { name: "別人的工", show: "別人的工作" },
    { name: "玩命之徒", show: "玩命之徒" },
    { name: "閱讀即藥", show: "閱讀即藥" },
    { name: "爛泥媽媽", show: "爛泥JIll" },
    { name: "人生啊！", show: "人生啊！" },
    { name: "張忘形", show: "人類行為" },
    { name: "Fire人生", show: "FIRE 人生" },
    { name: "小眾大師", show: "小眾大師" },
    { name: "娘娘不想", show: "娘娘不想" },
    { name: "品牌女子", show: "你想紅嗎" }
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
        // Default password "nextt" or "nextt2026"
        if (password === 'nextt' || password === 'nextt2026') {
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
            
            let applications = [];
            const stored = localStorage.getItem('nextt_kol_applications');
            if (stored) {
                applications = JSON.parse(stored);
            }
            
            applications.push(app);
            localStorage.setItem('nextt_kol_applications', JSON.stringify(applications));
            
            // Send to Google Sheets if configured
            if (GOOGLE_SCRIPT_URL) {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "kol",
                        ...app
                    })
                }).catch(err => console.error("Error sending to GAS:", err));
            }
            
            alert(`🎉 盛德好 KOL 媒合申請送出成功！\n品牌：${app.brandName}\n媒合KOL：${app.kols}\n分潤：20%\n\nNextT 團隊將會儘快為您辦理媒合對接！`);
            
            // Clear inputs
            document.getElementById('kol-product-propose').value = '';
            document.getElementById('kol-check-commission').checked = false;
            document.getElementById('kol-check-price').checked = false;
            document.getElementById('kol-check-propose').checked = false;
            checkboxes.forEach(cb => cb.checked = false);
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
function renderAdminKOLTable() {
    const tableBody = document.getElementById('admin-kol-table-body');
    const countBadge = document.getElementById('kol-reg-count');
    if (!tableBody) return;
    
    let applications = [];
    const stored = localStorage.getItem('nextt_kol_applications');
    if (stored) {
        applications = JSON.parse(stored);
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
