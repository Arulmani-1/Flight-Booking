import os
from PIL import Image

def compress_image_to_webp(input_path, output_path, target_size_kb=90):
    # Open the image
    img = Image.open(input_path)
    
    # Resize the image to make it easier to compress under 90kb while maintaining decent quality
    # A max width/height of 800px should be good enough for hotel cards
    img.thumbnail((800, 800), Image.Resampling.LANCZOS)
    
    quality = 90
    while True:
        img.save(output_path, "WEBP", quality=quality)
        size_kb = os.path.getsize(output_path) / 1024.0
        print(f"Quality {quality}: {size_kb:.2f} KB")
        if size_kb <= target_size_kb or quality <= 10:
            break
        quality -= 5

input_files = [
    r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\hotel_1_1788498366450.jpg",
    r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\hotel_2_1788498528095.jpg",
    r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\hotel_3_1788498543924.jpg",
    r"C:\Users\Admin\.gemini\antigravity-ide\brain\f3e116cc-1515-4b25-bc3b-2527be0c4edd\hotel_4_1788498736745.jpg"
]

output_dir = r"c:\Users\Admin\OneDrive\Desktop\flight-booking\assets\images"
os.makedirs(output_dir, exist_ok=True)

for i, input_file in enumerate(input_files, start=1):
    output_file = os.path.join(output_dir, f"hotel-{i}.webp")
    if os.path.exists(input_file):
        print(f"Processing {input_file}...")
        compress_image_to_webp(input_file, output_file)
        print(f"Saved to {output_file}")
    else:
        print(f"File not found: {input_file}")
