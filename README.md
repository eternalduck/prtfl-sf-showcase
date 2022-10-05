# Salesforce Code Snippets
Some code snippets from SF projects. The files are placed without directories as these are demo abstracts from real projects, not a ready to use code.


**Crypto Rates**  
A goal was to add crypto currency rates to product and checkout pages. They are calculated on the fly based on the current product price or order amount.


**Storefront Service Cookies**  
A task was to set a cookie based on a given URL parameter, keep this cookie until successful checkout, and pass it to the completed order attributes. This helped to keep track of orders made with referral links.


**Page Designer Component**  
A simple component for a banner with imageas a background, optional big and small titles, and a block of buttons. Flexible settings include banner's height, responsive images, title color, buttons style, and content positioning.


**Page Designer Layout**  
A layout grid utilizing Slick Slider allowing to place any number of slides &mdash; specific types of page designer components. Rich settings help to set it up for mobile, tablet and desktop views, set number of slides to show and scroll, and select a type of controls.


**Size Guide**  
A task was to create a secondary size guide popup on a product page. The guide is based on a json config stored in SF site preferences. The config contains mapping of product ID to size table ID. The backend part is responsible for passing a corresponding size table ID to the frontend part.

**JS Scripts in Content Assets**  
_Shipping Filters:_ Calls API to get shipping info about a product and prevents from buying it if it's not allowed.  

_Checkout Filter:_ A quick way to change the existing Comments field into Ethereum wallet address field and validate it. It was required just for a short promotion, and thus we avoided backend changes.  

_PayPal Pay Later:_ Integration of Pay Later banners on product page, in cart and on checkout page.  

_ParcelLab OrderTracking:_ A page for tracking packages sent with ParcelLab, a client may insert a tracking number in a field or land this page by link with URL params and see results right away.  