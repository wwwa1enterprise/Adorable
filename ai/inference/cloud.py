from huggingface_hub import InferenceClient
import os

client = InferenceClient(
    provider="replicate",
    api_key=os.getenv("REPLICATE_API_TOKEN"),
)


def text_to_image(prompt: str):
  # Retry up to 3 times
  max_retries = 3
  for attempt in range(max_retries):
    try:
      # output is a PIL.Image object
      image = client.text_to_image(
          prompt,
          model="prithivMLmods/Retro-Pixel-Flux-LoRA",
      )
      return image
    except Exception as e:
      if attempt < max_retries - 1:  # Don't print on last attempt
        print(f"Attempt {attempt + 1} failed: {str(e)}. Retrying...")
      else:
        # On last attempt, re-raise the exception
        raise
