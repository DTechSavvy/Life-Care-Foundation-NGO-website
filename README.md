# 🌟 Life Care Foundation - NGO Website

Welcome to the official GitHub repository of **Life Care Foundation**, a modern, dynamic, and responsive website created to spread awareness, encourage volunteering, and simplify donation and communication processes for our NGO. This project uses **HTML, CSS, JavaScript, AJAX, JSON, and PHP with MySQL** as the tech stack.

---

## 📌 Website Overview

The NGO website contains the following main modules:

- ✅ Home Page with animated logo and navigation
- 📅 **Upcoming Events** (with live countdown timers and dynamic Google Sheets integration using JSON + AJAX)
- ✨ **Gallery** with lightbox view and designer layout
- 🙋‍♂️ **Volunteering Page** with event cards and registration
- 💝 **Donation Page** with featured campaigns and dynamic donation form
- 📞 **Contact Page** with confirmation redirection
- 📨 Newsletter subscription form
- 🔐 **Session Management** example
- ⚙️ Admin login demo (planned)
- 📄 Additional pages: Terms of Use, Privacy Policy, FAQs

---

## 🧠 Technologies Used

| Frontend   | Backend        | Database  | Hosting       |
|------------|----------------|-----------|----------------|
| HTML5      | PHP (XAMPP)    | MySQL     | Render (frontend) |
| CSS3       | AJAX + JSON    | Google Sheets (for events) | InfinityFree (backend) |
| JavaScript | GSAP (logo animation) | -         | - |

---

## 🔗 Live Website

You can visit the live site here: **[Live Demo](https://your-render-url.render.com)**  
*(Replace this link with your actual Render URL)*

---


---

## ⚙️ Features Explained

### 🗓️ Upcoming Events (JSON + AJAX + Google Sheets)
- Event data is dynamically loaded from Google Sheets using the OpenSheet API.
- Countdown timers update every second.
- Past events are auto-hidden using JavaScript date comparison.

### 🖼️ Gallery
- Masonry-style layout for image display.
- Lightbox view for full-size previews.
- Responsive for all screen sizes.

### 💌 Contact Form
- Redirects to a **confirmation.html** page on submit using JavaScript.
- No PHP is required unless you want to send emails.

### 💝 Donation Page
- Campaign blocks with alternating colored backgrounds.
- Dynamic donation form with preset amounts.
- UPI placeholder with recurring donation checkbox.

### ✉️ Newsletter
- Simple form with email input.
- Can be connected to Mailchimp or backend.

### 🔐 Session Management (Example)
- A sample login with session timeout alert is created using JavaScript (mock implementation shown).
- Admin panel session and expiry feature can be added later using PHP sessions.

---

## 💾 Database Configuration

If you're using **InfinityFree**:

1. Go to your InfinityFree dashboard → MySQL Databases.
2. Create a new database and user.
3. Replace credentials in `php/connect.php`.

If you want to use **XAMPP locally** for testing:

```php
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "your_database_name";
$conn = mysqli_connect($servername, $username, $password, $dbname);
?>
```


### 🌍 Hosting Details
  rontend: Deployed using Render

Just upload the frontend folder or connect your GitHub repo.

Backend + DB: Deployed using InfinityFree

Upload PHP files and configure database under MySQL section.

## 💬 Contact
  Feel free to reach us at: info@lifecare_fdn.org

## 📜 License
  MIT License - Free to use for educational purposes.
