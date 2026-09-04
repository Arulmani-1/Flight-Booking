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

input_file = r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\beach_cta_1788500494631.jpg"
output_file = r"c:\Users\Admin\OneDrive\Desktop\flight-booking\assets\images\beach-cta.webp"

print(f"Processing {input_file}...")
compress_image_to_webp(input_file, output_file)
print(f"Saved to {output_file}")
