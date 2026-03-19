// ===== 闲置换 - 二手交易市场 JavaScript =====

// 初始示例数据
const initialProducts = [
    {
        id: 1,
        title: "iPhone 14 128GB 黑色 国行",
        price: 4299,
        originalPrice: 5999,
        category: "electronics",
        condition: "九成新",
        description: "个人使用一年，电池健康度 88%，没有划痕，功能完好，原装充电器盒子都在，北京同城可以面交。",
        location: "北京市 朝阳区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
        id: 2,
        title: "宜家三人位布艺沙发 浅灰色",
        price: 499,
        originalPrice: 1299,
        category: "furniture",
        condition: "八成新",
        description: "用了两年，非常舒服，搬家放不下了便宜出。需要自提，地址在上海浦东新区。",
        location: "上海市 浦东新区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 12,
    },
    {
        id: 3,
        title: "全新 Lululemon 运动卫衣 男款 M码",
        price: 399,
        originalPrice: 750,
        category: "clothing",
        condition: "全新",
        description: "朋友送的尺码不对，全新没拆吊牌，保真。价格可小刀。",
        location: "广州市 天河区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
        id: 4,
        title: "《五年高考三年模拟》数学 全新",
        price: 29,
        originalPrice: 58,
        category: "books",
        condition: "全新",
        description: "买错版本了，全新没有写过，便宜出。",
        location: "武汉市 洪山区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 36,
    },
    {
        id: 5,
        title: "任天堂 Switch OLED 续航版",
        price: 1699,
        originalPrice: 2099,
        category: "electronics",
        condition: "九成新",
        description: "买了一年没怎么玩，带一张 128G 卡，盒子配件齐全。",
        location: "成都市 锦江区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 48,
    },
    {
        id: 6,
        title: "雅诗兰黛小棕瓶 100ml",
        price: 459,
        originalPrice: 690,
        category: "beauty",
        condition: "全新",
        description: "免税店买多了，全新未拆封，保质期到 2027 年。",
        location: "深圳市 南山区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 72,
    },
    {
        id: 7,
        title: "NordicTrack 折叠跑步机",
        price: 1899,
        originalPrice: 4599,
        category: "sports",
        condition: "八成新",
        description: "买了坚持不下来... 便宜出，功能完好，同城自提。",
        location: "杭州市 西湖区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 96,
    },
    {
        id: 8,
        title: "iPad Air 5 64G Wi-Fi 蓝色",
        price: 2999,
        originalPrice: 4799,
        category: "electronics",
        condition: "九成新",
        description: "买来考研用的，考完了出，包装配件都在，屏幕没有划痕。",
        location: "南京市 鼓楼区",
        image: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 120,
    },
];

// 分类名称映射
const categoryNames = {
    electronics: "数码电子",
    clothing: "服饰鞋包",
    furniture: "家居家具",
    books: "书籍文具",
    sports: "运动健身",
    beauty: "美妆护肤",
    other: "其他",
};

// 分类颜色映射
const categoryColors = {
    electronics: "#6C5CE7",
    clothing: "#E84393",
    furniture: "#16A085",
    books: "#F39C12",
    sports: "#2980B9",
    beauty: "#8E44AD",
    other: "#34495E",
};

// 应用状态
let appState = {
    products: [],
    currentCategory: "all",
    searchQuery: "",
    nextId: 9,
};

// DOM 元素
const elements = {
    productsGrid: document.getElementById("productsGrid"),
    searchInput: document.getElementById("searchInput"),
    publishBtn: document.getElementById("publishBtn"),
    publishModal: document.getElementById("publishModal"),
    detailModal: document.getElementById("detailModal"),
    publishForm: document.getElementById("publishForm"),
    emptyState: document.getElementById("emptyState"),
    loadMoreContainer: document.getElementById("loadMoreContainer"),
};

// ===== 本地存储 =====

function loadData() {
    const saved = localStorage.getItem("secondhand-products");
    if (saved) {
        const data = JSON.parse(saved);
        appState.products = data.products;
        appState.nextId = data.nextId;
    } else {
        appState.products = [...initialProducts];
        appState.nextId = 9;
        saveData();
    }
}

function saveData() {
    localStorage.setItem("secondhand-products", JSON.stringify({
        products: appState.products,
        nextId: appState.nextId,
    }));
}

// ===== 渲染 =====

function getFilteredProducts() {
    let filtered = appState.products;

    // 按分类筛选
    if (appState.currentCategory !== "all") {
        filtered = filtered.filter(p => p.category === appState.currentCategory);
    }

    // 按搜索筛选
    if (appState.searchQuery && appState.searchQuery.trim()) {
        const q = appState.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.description.toLowerCase().includes(q)
        );
    }

    // 按时间排序（最新在前）
    filtered.sort((a, b) => b.createdAt - a.createdAt);

    return filtered;
}

function createProductCard(product) {
    const categoryName = categoryNames[product.category];
    const hasImage = !!product.image;

    const card = document.createElement("div");
    card.className = "product-card";
    card.addEventListener("click", () => openDetailModal(product));

    card.innerHTML = `
        <div class="product-image${!hasImage ? " no-image" : ""}">
            ${hasImage ? `<img src="${product.image}" alt="${product.title}">` : `
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="8" stroke="#ddd" stroke-width="2"/>
                    <path d="M12 24L36 24" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
                    <path d="M24 12L24 36" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `}
            <span class="product-category" style="background-color: ${categoryColors[product.category]}">${categoryName}</span>
            <span class="product-condition">${product.condition}</span>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price-row">
                <span class="product-price">¥${product.price}</span>
                ${product.originalPrice ? `<span class="product-original-price">¥${product.originalPrice}</span>` : ""}
            </div>
            <div class="product-meta">
                <span class="product-location">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1C4.79 1 3 2.79 3 5C3 8.25 7 13 7 13C7 13 11 8.25 11 5C11 2.79 9.21 1 7 1Z" fill="#B2BEC3" stroke="currentColor" stroke-width="1"/>
                        <circle cx="7" cy="5" r="2" fill="white"/>
                    </svg>
                    ${product.location}
                </span>
            </div>
        </div>
    `;

    return card;
}

function renderProducts() {
    const filtered = getFilteredProducts();
    elements.productsGrid.innerHTML = "";

    if (filtered.length === 0) {
        elements.emptyState.style.display = "block";
        elements.loadMoreContainer.style.display = "none";
        return;
    }

    elements.emptyState.style.display = "none";
    
    // 显示前 8 个，支持加载更多
    const displayCount = Math.min(8, filtered.length);
    const hasMore = filtered.length > 8;
    
    for (let i = 0; i < displayCount; i++) {
        const card = createProductCard(filtered[i]);
        elements.productsGrid.appendChild(card);
    }

    elements.loadMoreContainer.style.display = hasMore ? "block" : "none";
}

// ===== 事件绑定 =====

function bindEvents() {
    // 搜索
    let searchTimer = null;
    elements.searchInput.addEventListener("input", (e) => {
        appState.searchQuery = e.target.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            renderProducts();
        }, 300);
    });

    // 分类点击（来自导航和分类栏）
    document.querySelectorAll(".category-tag").forEach(tag => {
        tag.addEventListener("click", (e) => {
            const category = e.target.dataset.category;
            document.querySelector(".category-tag.active").classList.remove("active");
            e.target.classList.add("active");
            appState.currentCategory = category;
            renderProducts();
        });
    });

    // 底部分类链接
    document.querySelectorAll(".footer-section a[data-category]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            document.querySelector(".category-tag.active").classList.remove("active");
            document.querySelector(`.category-tag[data-category="${category}"]`).classList.add("active");
            appState.currentCategory = category;
            renderProducts();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    // 发布按钮
    elements.publishBtn.addEventListener("click", () => {
        openPublishModal();
    });

    document.getElementById("emptyPublishBtn").addEventListener("click", () => {
        openPublishModal();
    });

    document.getElementById("categoryBtn").addEventListener("click", () => {
        document.querySelector(".categories-section").scrollIntoView({ behavior: "smooth" });
    });

    // 模态框关闭
    document.getElementById("closeModal").addEventListener("click", closePublishModal);
    document.getElementById("cancelPublish").addEventListener("click", closePublishModal);
    elements.publishModal.querySelector(".modal-backdrop").addEventListener("click", closePublishModal);

    document.getElementById("closeDetailModal").addEventListener("click", closeDetailModal);
    elements.detailModal.querySelector(".modal-backdrop").addEventListener("click", closeDetailModal);

    // 图片上传
    document.getElementById("imageUpload").addEventListener("click", () => {
        document.getElementById("imageInput").click();
    });

    document.getElementById("imageInput").addEventListener("change", handleImageUpload);

    // 表单提交
    elements.publishForm.addEventListener("submit", handlePublishSubmit);

    // 加载更多
    document.getElementById("loadMoreBtn").addEventListener("click", () => {
        // TODO: 实现分页加载，现在简单显示所有
        const filtered = getFilteredProducts();
        elements.productsGrid.innerHTML = "";
        filtered.forEach(product => {
            const card = createProductCard(product);
            elements.productsGrid.appendChild(card);
        });
        elements.loadMoreContainer.style.display = "none";
    });

    // Logo 点击回到首页
    document.querySelector(".logo").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ===== 发布商品模态框 =====

function openPublishModal() {
    elements.publishModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePublishModal() {
    elements.publishModal.classList.remove("active");
    document.body.style.overflow = "";
}

function openDetailModal(product) {
    const categoryName = categoryNames[product.category];
    const hasImage = !!product.image;

    let html = `
        ${hasImage ? `
            <div class="detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
        ` : `
            <div class="detail-image" style="background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; min-height: 300px;">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="80" height="80" rx="12" stroke="#ddd" stroke-width="2"/>
                    <path d="M28 40L52 40" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
                    <path d="M40 28L40 52" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
        `}
        <div class="detail-info">
            <h1 class="detail-title">${product.title}</h1>
            <div class="detail-price-row">
                <span class="detail-price">¥${product.price}</span>
                ${product.originalPrice ? `<span class="detail-original-price">¥${product.originalPrice}</span>` : ""}
            </div>
            <div class="detail-meta">
                <div class="detail-meta-item">
                    <div class="detail-meta-label">分类</div>
                    <div class="detail-meta-value">${categoryName}</div>
                </div>
                <div class="detail-meta-item">
                    <div class="detail-meta-label">成色</div>
                    <div class="detail-meta-value">${product.condition}</div>
                </div>
                <div class="detail-meta-item">
                    <div class="detail-meta-label">原价</div>
                    <div class="detail-meta-value">${product.originalPrice ? `¥${product.originalPrice}` : "-"}</div>
                </div>
                <div class="detail-meta-item">
                    <div class="detail-meta-label">所在地</div>
                    <div class="detail-meta-value">${product.location || "-"}</div>
                </div>
            </div>
            ${product.description ? `
                <div class="detail-description">
                    <h4>商品描述</h4>
                    <p>${product.description}</p>
                </div>
            ` : ""}
        </div>
    `;

    document.getElementById("detailContent").innerHTML = html;
    elements.detailModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // 设置联系卖家链接（这里复制商品信息到剪贴板）
    document.getElementById("contactSeller").onclick = (e) => {
        e.preventDefault();
        const text = `我想购买你的闲置：${product.title}，价格¥${product.price}。请问还在吗？`;
        navigator.clipboard.writeText(text).then(() => {
            alert("商品信息已复制到剪贴板，你可以粘贴给卖家联系！");
        });
    };
}

function closeDetailModal() {
    elements.detailModal.classList.remove("active");
    document.body.style.overflow = "";
}

// ===== 图片上传 =====

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 限制大小
    if (file.size > 5 * 1024 * 1024) {
        alert("图片不能超过 5MB");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // 保存到 data URL，存在 localStorage
        const imageData = e.target.result;
        window.uploadedImage = imageData;

        // 更新预览
        const uploadArea = document.getElementById("imageUpload");
        uploadArea.style.backgroundImage = `url(${imageData})`;
        uploadArea.style.backgroundSize = "cover";
        uploadArea.style.backgroundPosition = "center";
        uploadArea.querySelector("svg").style.opacity = "0";
        uploadArea.querySelector("p").style.opacity = "0";
    };
    reader.readAsDataURL(file);
}

// ===== 发布提交 =====

function handlePublishSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("productTitle").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value);
    const originalPrice = document.getElementById("originalPrice").value ? parseFloat(document.getElementById("originalPrice").value) : null;
    const category = document.getElementById("productCategory").value;
    const condition = document.querySelector('input[name="condition"]:checked').value;
    const description = document.getElementById("productDescription").value.trim();
    const location = document.getElementById("sellerLocation").value.trim();

    // 验证
    if (!title) {
        alert("请输入商品名称");
        return;
    }
    if (!price || price <= 0) {
        alert("请输入正确的价格");
        return;
    }
    if (!category) {
        alert("请选择商品分类");
        return;
    }

    const newProduct = {
        id: appState.nextId++,
        title,
        price,
        originalPrice,
        category,
        condition,
        description,
        location,
        image: window.uploadedImage || null,
        createdAt: Date.now(),
    };

    appState.products.unshift(newProduct);
    saveData();
    renderProducts();
    closePublishModal();

    // 重置表单
    elements.publishForm.reset();
    window.uploadedImage = null;
    const uploadArea = document.getElementById("imageUpload");
    uploadArea.style.backgroundImage = "none";
    uploadArea.querySelector("svg").style.opacity = "1";
    uploadArea.querySelector("p").style.opacity = "1";

    alert("发布成功！");
}

// ===== 初始化 =====

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    bindEvents();
    renderProducts();

    // 更新统计数字
    const total = appState.products.length;
    const today = appState.products.filter(p => 
        (Date.now() - p.createdAt) < (1000 * 60 * 60 * 24)
    ).length;
    document.getElementById("totalItems").textContent = total.toLocaleString();
    document.getElementById("todayDeals").textContent = today;
});

// ===== PWA 支持（可选）=====
if ("serviceWorker" in navigator) {
    // 可以注册 service worker 实现离线访问，这里静态网站省略
}
