# Image Inference Server for Adorable

This is a local inference server for the Adorable App Builder. It currently only has one endpoint

- Generate Image: This is a two step process. It generates an image and then removes the background.

In NVidia devices this would be swapped with NIM.

Currently it's using black-forest-labs/FLUX.1-dev, but in the future it could use any model.

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

```bash
python3 index.py
```
