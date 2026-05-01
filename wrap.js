const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
let idCounter = 1;

// Using a robust replace function to wrap each product-card
// We look for '<div class="product-card">' and the matching closing tags.
// Since each product card has an internal structure of 2 nested divs (img-wrapper, product-info), we can just replace the opening tag and dynamically close it. 
// A safer approach: parse the exact lines from index.html

html = html.replace(/<div class="product-card">/g, () => {
    return `<a href="product.html?id=${idCounter++}" style="display:block; color:inherit; text-decoration:none;" class="product-card-link">\n                <div class="product-card">`;
});

// Since we added an opening <a>, we need to add a closing </a> exactly after the corresponding </div></div>
// It's much simpler to just change out `<div class="product-card">` with `<a class="product-card" ...>` natively.
html = fs.readFileSync('index.html', 'utf8');
idCounter = 1;
html = html.replace(/<div class="product-card">/g, () => {
    return `<a href="product.html?id=${idCounter++}" class="product-card" style="display:block; color:inherit; text-decoration:none;">`;
});
// Replace the corresponding closing div. Since each product has exactly 1 root class="product-card" div, followed by img-wrapper and product-info, and ends with `</div>\n                </div>`.
// We can just replace the two closing divs with 1 closing div and 1 closing a.
html = html.replace(/<\/div>\n                <\/div>/g, "</div>\n                </a>");

fs.writeFileSync('index.html', html);
console.log('Successfully wrapped product cards.');
