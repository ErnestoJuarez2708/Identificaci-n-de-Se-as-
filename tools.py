import json

# Cargar gold dataset
with open("gold_dataset/info.json", "r", encoding="utf-8") as f:
    GOLD_DATA = json.load(f)

def get_gold_info(letter):
    """Devuelve la ruta de la imagen y la descripción de la letra del dataset."""
    info = GOLD_DATA.get(letter)
    if not info:
        return None, None
    return f"gold_dataset/{info['image']}", info['description']
