# ☕ Brew Pod & Co. — Coffee Shop Website

A complete, production-ready coffee shop frontend website. Built to be published on GitHub Pages with no backend required.

## 📁 Project Structure
```
brewpod/
├── index.html          ← Homepage (hero, products, promo)
├── menu.html           ← Full menu with filter sidebar
├── reserve.html        ← Reservation form page
├── about.html          ← About, team, FAQ page
│
├── css/
│   ├── vars.css        ← 🎨 EDIT COLORS/FONTS HERE
│   ├── nav.css         ← Navbar, footer, cart sidebar, chat
│   ├── home.css        ← Homepage-specific styles
│   └── pages.css       ← Menu, reserve, about styles
│
├── js/
│   └── main.js         ← 🛠️ EDIT PRODUCTS/LOGIC HERE
│
└── images/             ← Place your images here
```

## 🚀 How to Publish on GitHub Pages

1. Create a new repo on GitHub (e.g. `brewpod`)
2. Upload all files (maintain folder structure)
3. Go to **Settings → Pages**
4. Set source to **main branch / root**
5. Your site will be live at `https://yourusername.github.io/brewpod`

## 🎨 Customize Colors

Open `css/vars.css` and edit the `:root` block:
```css
:root {
  --cream:  #F6EDD9;   /* Background */
  --brown:  #3A1F0E;   /* Primary dark */
  --gold:   #C8903A;   /* Accent */
}
```

## 🛍️ Edit Your Products

Open `js/main.js` and edit the `PRODUCTS` array:
```javascript
const PRODUCTS = [
  { id:1, name:"Your Product", brand:"Roast Type", price:19.99, ... },
  ...
];
```

## 📸 Add Your Images

In any page, click the "📁 Upload Image" placeholder in the browser. Or:
1. Place image files in the `images/` folder
2. Replace the emoji placeholder in HTML with `<img src="images/your-photo.jpg" alt="..."/>`

## ✨ Features
- ✅ Multi-page (Home, Menu, Reserve, About)
- ✅ Shared navbar & footer across all pages
- ✅ Cart sidebar with localStorage persistence
- ✅ Live chat widget (owner-side ready)
- ✅ Reservation form with success state
- ✅ Product filtering by category
- ✅ Flash sale countdown timer
- ✅ Click-to-upload images on all placeholders
- ✅ Scroll-reveal animations
- ✅ Mobile responsive + hamburger menu
- ✅ Marquee features strip
- ✅ FAQ accordion
- ✅ Toast notifications

## 🔧 Backend-Ready Placeholders
When you build the backend, connect these:
- Cart → `Checkout →` button (currently shows toast)
- Reserve form → `POST /api/reservations`
- Chat → WebSocket or Pusher
- Map → Google Maps embed
- Order tracking → `Track Order` link
