import { supabase } from "./supabase.js";

const products = [
  { name: "Fashion", icon: "👕", description: "Clothing and accessories" },
  { name: "Electronics", icon: "📱", description: "Phones and gadgets" },
  { name: "Home & Kitchen", icon: "🏠", description: "Everyday essentials" },
  { name: "Beauty", icon: "✨", description: "Beauty and personal care" }
];

export function renderApp(root) {
  root.innerHTML = `
    <header class="header">
      <a class="brand" href="#"><span class="brand-icon">🛒</span><span>ALL-IN-ONE-CART</span></a>
      <nav>
        <a href="#how-it-works" data-en="How It Works" data-ne="कसरी काम गर्छ">How It Works</a>
        <a href="#categories" data-en="Categories" data-ne="वर्गहरू">Categories</a>
        <a href="#submit-order" class="nav-button" data-en="Order Now" data-ne="अर्डर गर्नुहोस्">Order Now</a>
        <button id="language-toggle" class="language-button" type="button">नेपाली</button>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">YOUR NEEDS, ONE CART!</span>
          <h1>Shop Anything.<br><span>We Help You Get It.</span></h1>
          <p>Found something you love on Amazon, Flipkart, or another shopping platform? Share the product link with us.</p>
          <a href="#submit-order" class="primary-button">Submit Product Link →</a>
          <div class="hero-note">Easy ordering · Customer support · COD requests</div>
        </div>
        <div class="hero-card"><div class="cart-art">🛍️</div><div class="floating-card"><span>🔗</span><div><strong>One Product Link</strong><small>We help with your order</small></div></div></div>
      </section>

      <section class="section" id="how-it-works">
        <div class="section-heading"><span class="eyebrow">SIMPLE PROCESS</span><h2>How It Works</h2><p>Shopping made easy in three simple steps.</p></div>
        <div class="steps">
          <article class="step"><span class="step-number">01</span><div class="step-icon">🔍</div><h3>Find Your Product</h3><p>Choose a product from your favorite shopping platform.</p></article>
          <article class="step"><span class="step-number">02</span><div class="step-icon">🔗</div><h3>Share the Link</h3><p>Submit the product link and your order details.</p></article>
          <article class="step"><span class="step-number">03</span><div class="step-icon">📦</div><h3>We Contact You</h3><p>Our team will contact you to confirm the request.</p></article>
        </div>
      </section>

      <section class="section categories-section" id="categories">
        <div class="section-heading"><span class="eyebrow">EXPLORE</span><h2>Shop Across Categories</h2><p>Share links for products you want to order.</p></div>
        <div class="categories">
          ${products.map(product => `<article class="category-card"><span class="category-icon">${product.icon}</span><h3>${product.name}</h3><p>${product.description}</p></article>`).join("")}
        </div>
      </section>

      <section class="section order-section" id="submit-order">
        <div class="order-info">
          <span class="eyebrow">START YOUR ORDER</span><h2>Found Something You Love?</h2><p>Share the product link and tell us what you need.</p>
          <ul><li>✓ Product links from supported platforms</li><li>✓ Order confirmation before purchase</li><li>✓ Cash on Delivery requests</li><li>✓ Customer support for order updates</li></ul>
        </div>
        <form id="order-form" class="order-form">
          <h3>Submit Product Link</h3>
          <label for="customer-name">Your Name</label><input id="customer-name" name="name" type="text" placeholder="Enter your name" required maxlength="100" />
          <label for="customer-phone">Phone Number</label><input id="customer-phone" name="phone" type="tel" placeholder="Enter your phone number" required maxlength="20" />
          <label for="product-link">Product Link</label><input id="product-link" name="link" type="url" placeholder="https://..." required />
          <label for="product-details">Product Details</label><textarea id="product-details" name="details" placeholder="Product name, size, color, quantity..." rows="3" required maxlength="2000"></textarea>
          <label for="customer-address">Delivery Address</label><textarea id="customer-address" name="address" placeholder="Enter your delivery address" rows="3" required maxlength="1000"></textarea>
          <button type="submit" class="primary-button full-width">Submit Order Request →</button>
          <p class="form-note">This is an order request. Your order is not confirmed until our team contacts you.</p>
          <div id="form-message" role="status" aria-live="polite"></div>
        </form>
      </section>

      <section class="support-banner"><div><span class="eyebrow">NEED HELP?</span><h2>We're Here to Help</h2><p>Contact our customer support team for assistance.</p></div><a id="whatsapp-link" class="primary-button" href="#" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></section>
    </main>
    <footer class="footer"><a class="brand" href="#"><span class="brand-icon">🛒</span> ALL-IN-ONE-CART</a><p>Your Needs, One Cart!</p><small>© ${new Date().getFullYear()} ALL-IN-ONE-CART. All rights reserved.</small></footer>
  `;

  setupOrderForm(root);
  setupLanguageToggle(root);
}

function setupOrderForm(root) {
  const form = root.querySelector("#order-form");
  const message = root.querySelector("#form-message");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";

    if (!supabase) {
      message.textContent = "Website database is not configured yet. Please try again later.";
      return;
    }

    const data = new FormData(form);
    const rawLink = String(data.get("link") || "").trim();
    let productUrl;

    try {
      productUrl = new URL(rawLink);
    } catch {
      message.textContent = "Please enter a valid product URL.";
      return;
    }

    if (!["http:", "https:"].includes(productUrl.protocol)) {
      message.textContent = "Please use a valid http or https product link.";
      return;
    }

    const order = {
      customer_name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      product_url: productUrl.href,
      product_details: String(data.get("details") || "").trim(),
      delivery_address: String(data.get("address") || "").trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const { error } = await supabase.from("orders").insert([order]);
      if (error) throw error;
      message.textContent = "Your order request was submitted successfully. Our team will contact you.";
      form.reset();
    } catch (error) {
      console.error("Order submission failed:", error);
      message.textContent = "Sorry, we couldn't submit your request. Please try again later.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Order Request →";
    }
  });

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "";
  const whatsappLink = root.querySelector("#whatsapp-link");
  if (whatsappNumber) {
    whatsappLink.href = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  } else {
    whatsappLink.href = "https://www.whatsapp.com/";
    whatsappLink.addEventListener("click", (event) => {
      event.preventDefault();
      message.textContent = "WhatsApp support will be activated after adding your business number.";
    });
  }
}

function setupLanguageToggle(root) {
  const button = root.querySelector("#language-toggle");
  let language = "en";
  const translations = {
    "How It Works": "कसरी काम गर्छ",
    "Categories": "वर्गहरू",
    "Order Now": "अर्डर गर्नुहोस्"
  };
  button.addEventListener("click", () => {
    language = language === "en" ? "ne" : "en";
    button.textContent = language === "en" ? "नेपाली" : "English";
    root.querySelectorAll("[data-en][data-ne]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    root.querySelectorAll("nav a").forEach((element) => {
      const english = element.dataset.en || element.textContent;
      if (translations[english]) element.textContent = language === "ne" ? translations[english] : english;
    });
  });
}
