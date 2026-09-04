import os
from PIL import Image

def compress_image_to_webp(input_path, output_path, target_size_kb=90):
    img = Image.open(input_path)
    img.thumbnail((800, 800), Image.Resampling.LANCZOS)
    
    quality = 90
    while True:
        img.save(output_path, "WEBP", quality=quality)
        size_kb = os.path.getsize(output_path) / 1024.0
        print(f"Quality {quality}: {size_kb:.2f} KB")
        if size_kb <= target_size_kb or quality <= 10:
            break
        quality -= 5

input_files = {
    "blog-dubai.webp": r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\blog_dubai_1788499395327.jpg",
    "blog-istanbul.webp": r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\blog_istanbul_1788499513794.jpg",
    "blog-maldives.webp": r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\blog_maldives_1788499529493.jpg",
    "blog-cairo.webp": r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\blog_cairo_1788499545037.jpg",
    "blog-paris.webp": r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\blog_paris_1788499583048.jpg",
    "blog-japan.webp": r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\blog_japan_1788499605654.jpg"
}

output_dir = r"c:\Users\Admin\OneDrive\Desktop\flight-booking\assets\images"
os.makedirs(output_dir, exist_ok=True)

for out_name, input_file in input_files.items():
    output_file = os.path.join(output_dir, out_name)
    if os.path.exists(input_file):
        print(f"Processing {input_file}...")
        compress_image_to_webp(input_file, output_file)
        print(f"Saved to {output_file}")
    else:
        print(f"File not found: {input_file}")
