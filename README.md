# 🛒 Smart Compare

**Smart Compare** is a multi-platform grocery price comparison web application that helps users identify the **best available deal in real time** across popular instant-delivery platforms such as **Blinkit, Zepto, BigBasket, and JioMart**.

The project emphasizes **price transparency**, **delivery cost comparison**, and **ETA-based decision-making**, implemented using a clean, scalable modern web architecture with **local data sources and rule-based logic**.

---

## 🚀 Project Overview

Online grocery platforms often differ in:

* Product pricing
* Delivery fees
* Estimated delivery times (ETA)

Smart Compare addresses this challenge by aggregating data from multiple platforms and presenting users with the **most cost-effective option instantly**.

This repository follows a **multi-app architecture**, consisting of individual sub-applications (one per platform) and a **central comparison site** that unifies navigation and results.

---

## ✨ Key Features

* 🔍 **Real-Time Price Comparison** across multiple grocery platforms
* ⚡ **Asynchronous Backend Logic** for parallel data fetching
* 📊 **Best Deal Detection** based on total cost (price + delivery fee)
* 🗺️ **Location-Based Search** using latitude and longitude
* 📦 **Structured JSON API Responses**
* 🌐 **Deployed Sub-Applications** with centralized navigation
* 🧩 **Modular and Extensible Architecture**

---

## 🧱 Tech Stack

### Frontend

* **Next.js** (Latest)
* **React** (Latest)
* **React DOM**
* Modern routing and component-based UI design

### Backend / Logic

* **Node.js**
* **FastAPI** (Prototype API logic)
* **Async / Await**
* **Parallel request handling** using asyncio / Promise-based logic

### Deployment

* **Vercel** (Frontend sub-applications)
* Deployment-ready, scalable setup

---

## 📁 Repository Structure

```
smart-compare/
├── main-site/real-one/     # Central navigation and comparison UI
├── blinkit-site/           # Blinkit frontend application
├── zepto-site/             # Zepto frontend application
├── bigbasket-site/         # BigBasket frontend application
├── jiomart-site/           # JioMart frontend application
├── TODO.md                 # Planned features and enhancements
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn

### Clone the Repository

```bash
git clone <your-repository-url>
cd smart-compare
```

### Install Dependencies

```bash
npm install
```

Each sub-application can also be installed and executed independently.

---

## ▶️ Running the Project

### Development Mode (Root)

```bash
npm run dev
```

### Running Individual Sub-Applications

**Main Comparison Site**

```bash
cd main-site/real-one
npm run dev
```

**Blinkit Sub-App**

```bash
cd blinkit-site
npm run dev
```

**Zepto Sub-App**

```bash
cd zepto-site
npm run dev
```

**BigBasket Sub-App**

```bash
cd bigbasket-site
npm run dev
```

**JioMart Sub-App**

```bash
cd jiomart-site
npm run dev
```

---

## 🧪 Prototype API Logic

The backend prototype:

* Fetches pricing data from multiple platforms **in parallel**
* Computes the total cost (**item price + delivery fee**)
* Sorts results and returns the **best available deal**

The logic is fully rule-based and can be extended with:

* Real scraping implementations
* Official platform APIs
* Advanced rule-based ranking mechanisms

---

## 🛣️ Roadmap / Future Enhancements

* 📊 Rule-based recommendation and ranking
* 📱 Mobile-first UI optimizations
* 📈 Price history and trend analysis
* 🔔 Deal alerts and notifications
* 🔐 User accounts and saved preferences
* 📉 Platform reliability and availability scoring (non-ML)

---

## 🎓 Learning Outcomes

* Practical experience with asynchronous programming
* Scalable system and project architecture design
* Multi-application deployment strategy
* Clean API and frontend integration practices
* Hands-on exposure to modern web frameworks

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **ISC License**.

---

## 🙌 Acknowledgments

* Built as part of an **engineering learning initiative**
* Inspired by real-world challenges in online grocery platforms
* Developed during an internship-focused learning program

---

## 📌 About

Smart Compare is an evolving project focused on making online grocery shopping **more transparent, cost-effective, and user-friendly**.

⭐ If you find this project useful, consider giving it a star!
