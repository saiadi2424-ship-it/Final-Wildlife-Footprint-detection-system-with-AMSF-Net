import io
import time
import torch
import torchvision.transforms as transforms
from PIL import Image
from pathlib import Path
import sys

# Ensure model directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR.parent / "model"
sys.path.append(str(MODEL_DIR))

from amsfnet import AMSFNet, get_model
from config import WEIGHTS_PATH, CLASSES, INPUT_SIZE

class ModelService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance

    def initialize(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[ModelService] Initializing AMSF-Net on {self.device}")
        
        self.model = get_model(
            weights_path=str(WEIGHTS_PATH) if WEIGHTS_PATH.exists() else None,
            num_classes=len(CLASSES),
            device=self.device
        )
        self.model.eval()

        # Standard 224x224 RGB image transformation pipeline
        self.transform = transforms.Compose([
            transforms.Resize(INPUT_SIZE),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def predict(self, image_bytes: bytes) -> dict:
        """
        Runs AMSF-Net inference on raw image bytes.
        Returns:
            dict containing prediction, confidence, probabilities, and inference_time_ms.
        """
        # Open and ensure 224x224 RGB
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)

        # High-resolution benchmark timing
        start_time = time.perf_counter()
        with torch.no_grad():
            outputs = self.model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
        end_time = time.perf_counter()

        inference_time_ms = round((end_time - start_time) * 1000, 2)
        
        # Softmax probabilities per class
        prob_dict = {
            CLASSES[i]: round(float(probabilities[i]) * 100, 2)
            for i in range(len(CLASSES))
        }

        # Highest confidence prediction
        top_idx = int(torch.argmax(probabilities).item())
        predicted_species = CLASSES[top_idx]
        confidence = prob_dict[predicted_species]

        return {
            "prediction": predicted_species,
            "confidence": confidence,
            "probabilities": prob_dict,
            "inference_time_ms": inference_time_ms,
            "device": str(self.device)
        }

model_service = ModelService()
