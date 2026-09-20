const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const pagesDir = path.join(__dirname, 'src', 'pages');

const filesToMove = [
  'StockManagement.jsx',
  'FoodCostManagement.jsx',
  'CustomerFeedback.jsx',
  'BillingManagement.jsx',
  'OrderReceipt.jsx'
];

filesToMove.forEach(file => {
  const oldPath = path.join(componentsDir, file);
  const newPath = path.join(pagesDir, file);
  
  if (fs.existsSync(oldPath)) {
    let content = fs.readFileSync(oldPath, 'utf8');
    
    // Update relative imports:
    // 1. imports starting with './' (e.g. './StockManagement/...') -> '../components/...'
    // except if it's importing a CSS file or something similar.
    // Let's use a regex that matches import ... from './something'
    content = content.replace(/from\s+['"]\.\/(.*?)['"]/g, "from '../components/$1'");
    
    // 2. imports starting with '../' are already one level up from components, so they would be the same from pages (pages/ and components/ are siblings).
    // so '../hooks/...' remains '../hooks/...'
    
    fs.writeFileSync(newPath, content);
    console.log(`Moved and updated ${file}`);
    fs.unlinkSync(oldPath);
  } else {
    console.log(`${file} not found in components/`);
  }
});
