from dotenv import load_dotenv
from rembg import remove
import os
from flask import Flask, request, jsonify, send_file
import io


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

        image.show()

        # Convert image to PNG format
        image = image.convert("RGBA")
        image_io = io.BytesIO()
        image.save(image_io, format='PNG')
        image_io.seek(0)

        # Return the BytesIO object directly to avoid data corruption
        return send_file(image_io, mimetype='image/png')

    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=2468)
