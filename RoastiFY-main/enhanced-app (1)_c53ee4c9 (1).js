// Roast'Em Ai — Enhanced with AI functionality and SuperCool.com integration
// --- Config (edit or override in HTML before this script) ---
window.APP_ORIGIN = window.APP_ORIGIN || location.origin;
// AI Configuration - Add your API keys here
window.OPENAI_API_KEY = window.OPENAI_API_KEY || ""; // Add your OpenAI key
window.STRIPE_PUBLISHABLE_KEY = window.STRIPE_PUBLISHABLE_KEY || ""; // Add your Stripe key

// Enhanced roast styles for viral content
const ROAST_STYLES = {
  savage: "Create a hilariously brutal but friendly roast",
  witty: "Create a clever and witty roast with wordplay", 
  celebrity: "Roast like a famous comedian would",
  gentle: "Create a playful, light-hearted roast",
  viral: "Create a roast that's perfect for social media sharing"
};

// Viral sharing metrics
let roastCount = parseInt(localStorage.getItem('roastCount') || '0');
let shareCount = parseInt(localStorage.getItem('shareCount') || '0');

// Year and branding
document.getElementById('year').textContent = new Date().getFullYear();

// Add SuperCool.com branding
function addSupercoolBranding() {
  // Add powered by footer
  const footer = document.querySelector('.footer');
  if (footer && !footer.querySelector('.supercool-branding')) {
    const branding = document.createElement('div');
    branding.className = 'supercool-branding';
    branding.innerHTML = `
      <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
        🚀 Powered by <a href="https://supercool.com" target="_blank" style="color: #ff6b35; text-decoration: none; font-weight: bold;">SuperCool.com</a>
      </p>
    `;
    footer.appendChild(branding);
  }

  // Add to roast results
  const heroSection = document.querySelector('.hero');
  if (heroSection && !heroSection.querySelector('.supercool-credit')) {
    const credit = document.createElement('div');
    credit.className = 'supercool-credit';
    credit.style.cssText = 'text-align: center; margin-top: 20px; padding: 10px; background: rgba(255,107,53,0.1); border-radius: 8px; display: none;';
    credit.innerHTML = `
      <p style="margin: 0; font-size: 14px;">
        ✨ AI Magic by <a href="https://supercool.com" target="_blank" style="color: #ff6b35; text-decoration: none; font-weight: bold;">SuperCool.com</a> ✨
      </p>
    `;
    heroSection.appendChild(credit);
  }
}

// Enhanced AI roast generation
async function generateRoast(imageData, style = 'savage') {
  if (!window.OPENAI_API_KEY) {
    return "Oops! Looks like someone forgot to add their OpenAI API key. That's more embarrassing than your photo! 😅 (Add OPENAI_API_KEY to get real AI roasts)";
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${window.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${ROAST_STYLES[style]}. Keep it funny but not mean-spirited. Make it shareable and viral-worthy. Maximum 280 characters for social media.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Roast Error:', error);
    return getBackupRoast();
  }
}

// Backup roasts for when AI is not available
function getBackupRoast() {
  const backupRoasts = [
    "Your photo is so good, it makes my AI circuits confused! 🤖",
    "I've analyzed millions of photos, and yours is definitely... one of them! 😄",
    "Your selfie game is so strong, it broke my roast algorithms! 💪",
    "I tried to roast you, but your photo was too fire already! 🔥",
    "Error 404: Roast not found. You're actually pretty awesome! ✨",
    "My AI brain can't compute how to roast perfection! 🧠",
    "Congratulations! You've confused an AI. That's actually impressive! 🎉"
  ];
  return backupRoasts[Math.floor(Math.random() * backupRoasts.length)];
}

// Upload keyboard accessibility
document.querySelector('.upload')?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.key === ' ') document.getElementById('fileInput').click();
});

// Enhanced native share with tracking
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyLinkBtn');

shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: "Roast'Em Ai - I got roasted by AI! 😅",
    text: "I just got hilariously roasted by AI! Try it yourself and see what happens 🤖🔥",
    url: location.href
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      trackShare('native');
    } else {
      await navigator.clipboard.writeText(shareData.url);
      shareBtn.textContent = "Link Copied!";
      setTimeout(() => shareBtn.textContent = "Share", 1400);
      trackShare('copy');
    }
  } catch (error) {
    console.log('Share failed:', error);
  }
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy Link", 1200);
    trackShare('copy');
  } catch (error) {
    console.log('Copy failed:', error);
  }
});

// Enhanced social share buttons with tracking
document.getElementById('fbShare').addEventListener('click', () => {
  const url = encodeURIComponent(location.href);
  const text = encodeURIComponent("I just got roasted by AI! 😅 Try Roast'Em Ai yourself!");
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank", "noopener,noreferrer");
  trackShare('facebook');
});

document.getElementById('igShare').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(`${location.href} - I got roasted by AI! 😅 #RoastEmAi #AIRoast #Funny`);
    alert("📱 Link copied! Open Instagram and paste it into your story, bio, or post. Don't forget to tag us! #RoastEmAi");
    trackShare('instagram');
  } catch (error) {
    alert("📱 Copy this link to Instagram: " + location.href);
  }
});

document.getElementById('ttShare').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(`${location.href} - Got roasted by AI! 😅 #RoastEmAI #AIRoast #Viral #Funny`);
    alert("🎵 Link copied! Open TikTok and paste into your caption. Use trending sounds for maximum reach! #RoastEmAI");
    trackShare('tiktok');
  } catch (error) {
    alert("🎵 Copy this link to TikTok: " + location.href);
  }
});

document.getElementById('ytShare').addEventListener('click', () => {
  window.open("https://www.youtube.com/shorts/upload", "_blank", "noopener,noreferrer");
  trackShare('youtube');
});

// Enhanced Stripe "Go Pro" with conversion optimization
document.getElementById('proBtn').addEventListener('click', async () => {
  if (!window.STRIPE_PUBLISHABLE_KEY) {
    alert("💳 Payment system not configured yet. Add your Stripe key to start earning! Visit stripe.com to get started.");
    return;
  }
  
  const stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
  
  // Show conversion-optimized modal
  showProModal();
  
  if (window.CHECKOUT_SESSION_ID) {
    stripe.redirectToCheckout({ sessionId: window.CHECKOUT_SESSION_ID });
    return;
  }

  try {
    const res = await fetch("/create-checkout-session", { 
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        priceId: 'price_savage_mode',
        successUrl: window.location.href + '?success=true',
        cancelUrl: window.location.href + '?canceled=true'
      })
    });
    const data = await res.json();
    if (data.sessionId) {
      stripe.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      location.href = "/pricing";
    }
  } catch {
    location.href = "/pricing";
  }
});

// Enhanced start roast with AI integration
document.getElementById('startRoastBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files?.[0];
  
  if (!file) { 
    alert("📸 Choose a photo first! The AI is ready to roast... are you? 😈"); 
    return; 
  }

  // Show loading state
  const btn = document.getElementById('startRoastBtn');
  const originalText = btn.textContent;
  btn.textContent = "🤖 AI is analyzing...";
  btn.disabled = true;

  try {
    // Convert image to base64
    const imageData = await fileToBase64(file);
    
    // Get roast style preference (you can add UI for this)
    const style = getRandomStyle();
    
    // Generate AI roast
    const roast = await generateRoast(imageData, style);
    
    // Display result
    displayRoast(roast, imageData);
    
    // Update counters
    roastCount++;
    localStorage.setItem('roastCount', roastCount.toString());
    
    // Show SuperCool.com branding
    document.querySelector('.supercool-credit').style.display = 'block';
    
    // Check for upgrade prompts
    checkUpgradePrompts();
    
  } catch (error) {
    console.error('Roast generation failed:', error);
    alert("🤖 Oops! The AI got tongue-tied. Try again in a moment!");
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// Helper functions
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function getRandomStyle() {
  const styles = Object.keys(ROAST_STYLES);
  return styles[Math.floor(Math.random() * styles.length)];
}

function displayRoast(roast, imageData) {
  // Create roast display area
  let roastDisplay = document.getElementById('roastDisplay');
  if (!roastDisplay) {
    roastDisplay = document.createElement('div');
    roastDisplay.id = 'roastDisplay';
    roastDisplay.className = 'roast-result';
    document.querySelector('.hero').appendChild(roastDisplay);
  }

  roastDisplay.innerHTML = `
    <div class="roast-container" style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 15px; color: white; text-align: center;">
      <h3 style="margin: 0 0 15px 0; font-size: 24px;">🔥 AI ROAST RESULTS 🔥</h3>
      <div class="roast-content" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <p style="font-size: 18px; line-height: 1.4; margin: 0; font-weight: 500;">"${roast}"</p>
      </div>
      <div class="roast-stats" style="display: flex; justify-content: space-around; margin-bottom: 20px; font-size: 14px;">
        <span>🎯 Roast #${roastCount}</span>
        <span>📤 ${shareCount} Shares</span>
        <span>🤖 AI Powered</span>
      </div>
      <div class="roast-actions" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button onclick="shareRoast('${roast.replace(/'/g, "\\'")}', '${imageData}')" class="btn btn--solid" style="background: white; color: #ff6b35;">📤 Share This Roast</button>
        <button onclick="generateNewRoast()" class="btn btn--ghost" style="border: 2px solid white; color: white;">🎲 Roast Again</button>
        <button onclick="upgradePrompt()" class="btn btn--solid" style="background: #f7931e; color: white;">⚡ Get Savage Mode</button>
      </div>
    </div>
  `;

  // Scroll to results
  roastDisplay.scrollIntoView({ behavior: 'smooth' });
}

function shareRoast(roast, imageData) {
  const shareText = `I got roasted by AI: "${roast}" 😅 Try it yourself at ${location.href} #RoastEmAI #AIRoast`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My AI Roast Result',
      text: shareText,
      url: location.href
    });
  } else {
    navigator.clipboard.writeText(shareText);
    alert('🔥 Roast copied to clipboard! Paste it anywhere to share the burn! 🔥');
  }
  
  trackShare('roast_result');
}

function generateNewRoast() {
  document.getElementById('startRoastBtn').click();
}

function upgradePrompt() {
  document.getElementById('proBtn').click();
}

function showProModal() {
  // Add conversion-optimized upgrade modal
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
      <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; text-align: center;" onclick="event.stopPropagation()">
        <h2 style="color: #ff6b35; margin-bottom: 20px;">🔥 Upgrade to Savage Mode! 🔥</h2>
        <p>Get unlimited roasts, premium styles, and remove watermarks!</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; color: #ff6b35;">Only $2.99</p>
          <p style="font-size: 14px; opacity: 0.7;">One-time payment • Instant access</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #ff6b35; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; cursor: pointer;">🚀 Upgrade Now</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function checkUpgradePrompts() {
  // Show upgrade prompts based on usage
  if (roastCount === 3) {
    setTimeout(() => alert('🔥 You\'re on fire! Upgrade to Savage Mode for unlimited roasts and premium styles!'), 2000);
  } else if (roastCount === 5) {
    setTimeout(() => showProModal(), 3000);
  }
}

function trackShare(platform) {
  shareCount++;
  localStorage.setItem('shareCount', shareCount.toString());
  
  // Send analytics (add your tracking code here)
  if (window.gtag) {
    gtag('event', 'share', {
      'event_category': 'Social',
      'event_label': platform,
      'value': 1
    });
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  addSupercoolBranding();
  
  // Check for success/cancel params
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    alert('🎉 Welcome to Savage Mode! Unlimited roasts unlocked! 🎉');
  } else if (urlParams.get('canceled') === 'true') {
    alert('😢 No worries! Your free roasts are still available. Upgrade anytime for unlimited access!');
  }
});

// PWA service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Export for global access
window.RoastEmAI = {
  generateRoast,
  shareRoast,
  trackShare,
  addSupercoolBranding
};