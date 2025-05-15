from huggingface_hub import InferenceClient
import os

client = InferenceClient(
    provider="replicate",
    api_key=os.getenv("REPLICATE_API_KEY"),
)


def text_to_image(prompt: str):
  # output is a PIL.Image object
  image = client.text_to_image(
      prompt,
      model="black-forest-labs/FLUX.1-dev",
  )
  return image
