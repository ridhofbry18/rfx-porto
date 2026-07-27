from PIL import Image
import os

def remove_green(image_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    newData = []
    
    # We look for bright green: high G, low R and B.
    for item in datas:
        # R, G, B, A
        r, g, b, a = item
        if g > 120 and r < 100 and b < 100:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(image_path, "PNG")

for filename in ["retro_tv.png", "dslr_camera.png", "laptop.png"]:
    path = os.path.join("public", filename)
    if os.path.exists(path):
        remove_green(path)
        print(f"Processed {filename}")
