import os
from PIL import Image

def optimize_image(path, max_dim=None, quality=85):
    if not os.path.exists(path):
        return
    orig_size = os.path.getsize(path)
    img = Image.open(path)
    
    # Check if resize is needed
    if max_dim:
        w, h = img.size
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            new_w = int(w * scale)
            new_h = int(h * scale)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    base, ext = os.path.splitext(path)
    
    # Save WebP version
    webp_path = f"{base}.webp"
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img.save(webp_path, 'WEBP', quality=quality, method=6)
    else:
        rgb_img = img.convert('RGB')
        rgb_img.save(webp_path, 'WEBP', quality=quality, method=6)
    webp_size = os.path.getsize(webp_path)
    
    # Optimize original format
    if ext.lower() in ('.jpg', '.jpeg'):
        rgb_img = img.convert('RGB')
        rgb_img.save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
    elif ext.lower() == '.png':
        img.save(path, 'PNG', optimize=True)
    new_orig_size = os.path.getsize(path)
    
    print(f"[OPTIMIZED] {os.path.basename(path)}")
    print(f"  Orig: {orig_size / 1024:.1f} KB -> New {ext}: {new_orig_size / 1024:.1f} KB | WebP: {webp_size / 1024:.1f} KB (Saved {((orig_size - webp_size) / orig_size) * 100:.1f}%)")

def main():
    root = os.path.abspath(os.path.dirname(__file__) + '/..')
    public_dir = os.path.join(root, 'public')
    projects_dir = os.path.join(public_dir, 'projects')
    
    print("--- 1. Optimizing Brand Assets ---")
    # Logo: 512x512 is ample for retina displays while reducing 1MB payload to ~30KB
    logo_path = os.path.join(public_dir, 'crevinox-logo.png')
    if os.path.exists(logo_path):
        optimize_image(logo_path, max_dim=512, quality=90)
        
    # Favicon: 64x64 is ideal for browser tabs (currently 1MB!)
    fav_path = os.path.join(public_dir, 'favicon.png')
    if os.path.exists(fav_path):
        orig_size = os.path.getsize(fav_path)
        img = Image.open(fav_path)
        img_fav = img.resize((64, 64), Image.Resampling.LANCZOS)
        img_fav.save(fav_path, 'PNG', optimize=True)
        print(f"[FAVICON] {orig_size / 1024:.1f} KB -> {os.path.getsize(fav_path) / 1024:.1f} KB")
        
    # OG Banner: 1200x630
    og_path = os.path.join(public_dir, 'crevinox-og-banner.jpg')
    if os.path.exists(og_path):
        optimize_image(og_path, max_dim=1200, quality=82)
        
    print("\n--- 2. Optimizing Project Showcase Images ---")
    # Project images: max 1280px wide, quality=84
    for fname in os.listdir(projects_dir):
        if fname.endswith(('.jpg', '.jpeg', '.png')) and not fname.endswith('.webp'):
            fpath = os.path.join(projects_dir, fname)
            optimize_image(fpath, max_dim=1280, quality=84)

if __name__ == '__main__':
    main()
