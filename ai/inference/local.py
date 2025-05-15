from diffusers import DiffusionPipeline



pipe = DiffusionPipeline.from_pretrained("black-forest-labs/FLUX.1-dev")

def text_to_image(prompt: str):
  # output is a PIL.Image object
  image = pipe(prompt).images[0]
  return image

