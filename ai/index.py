from dotenv import load_dotenv
from rembg import remove
import os
from flask import Flask, request, jsonify, send_file
import io
import base64
from PIL import Image

load_dotenv()

app = Flask(__name__)

inference_type = os.getenv("INFERENCE", "").lower()

if inference_type == "cloud":
    from inference.cloud import text_to_image
else:
    from inference.local import text_to_image

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json

    print(f"Received data: {data}")

    if not data or 'prompt' not in data:
        return jsonify({'error': 'Text prompt is required'}), 400

    prompt = data['prompt']
    remove_bg = data.get('removeBackground', False)

    try:
        print(f"Prompt: {prompt}")
        # Generate image from text
        image = text_to_image(prompt)

        print("Image generated successfully")

        # Remove background if requested
        if remove_bg:
            print("Removing background")
            image = remove(image)
            print("Background removed successfully")


        # Convert PIL image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        print("Image conversion to bytes successful")


        return send_file(img_byte_arr, mimetype='image/png')

    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=2468)
