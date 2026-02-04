
# TODO: Implement Move Selected Items to Cart from Saved Page

## Steps to Complete:
- [x] Add state `selectedItems` (array of product ids) to track selected items
- [x] Add a checkbox for each saved item to select/deselect
- [x] Add a "Select All" checkbox in the card header to toggle all items
- [x] Change the summary button from "Go to Cart" to "Move Selected to Cart"
- [x] Disable the button if no items are selected
- [x] Implement button click logic: for each selected item, call `addToCart(product, quantity)` and `moveToCart(product)`, then navigate to "/cart"
- [x] Test the selection and move functionality

# TODO: Add Basket Comparison Visual below Product-wise Comparison

## Steps to Complete:
- [x] Install Chart.js and React-Chartjs-2 libraries
- [x] Install chartjs-plugin-datalabels for data labels
- [x] Import Chart.js components (Bar, ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend) in real one/app/compare/page.tsx
- [x] Import ChartDataLabels plugin
- [x] Register Chart.js components and plugins
- [x] Add a new Card section below the Product-wise Comparison for "Basket Comparison Visual"
- [x] Create a Bar chart with 3D cylinder-style appearance using rounded corners and gradients
- [x] Highlight the cheapest platform in green (#10b981) with glow effect
- [x] Highlight platforms with out-of-stock items in red
- [x] Highlight cheapest items in the product-wise comparison table with green background and border
- [x] Highlight out-of-stock items in the product-wise comparison table with red background and border
- [x] Show 4 divisions for Zepto, Blinkit, BigBasket, and Jiomart platforms
- [x] Add data labels showing ₹ currency values and out-of-stock count on top of bars
- [x] Show out-of-stock information in tooltips
- [x] Use light beige background with minimal grid lines
- [x] Ensure chart is responsive and styled with glassmorphism
- [x] Test the basket comparison visual displays correctly after clicking Compare Basket
