"""
Sincroniza as imagens da tela de carregamento a partir do Portfólio 360
(https://spotometro.seazone.com.br/portfolio/).

Para cada empreendimento pega uma foto externa da galeria (ou a capa, se não
houver galeria), redimensiona, converte para WebP e grava em
frontend/public/loading/, junto com um manifest.json consumido pelo LoadingScreen.

Uso:  PORTFOLIO360_ANON_KEY=<chave anon> python scripts/sync_loading_images.py
Requer: Pillow (pip install pillow)
"""
import io
import json
import os
import re
import unicodedata
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

SUPABASE_URL = "https://ogkporckvobptynpnhvi.supabase.co"
# Chave anon do Supabase do Portfólio 360 (a mesma que o front-end deles expõe).
# Defina antes de rodar:  PORTFOLIO360_ANON_KEY=... python scripts/sync_loading_images.py
ANON_KEY = os.environ.get("PORTFOLIO360_ANON_KEY", "")
# Ordem de preferência das categorias da galeria.
PREFERRED_CATEGORIES = ("exterior", "interior_comum")
# Fragmentos de URL que indicam planta baixa / implantação.
SKIP_URL_PARTS = ("planta", "implanta", "situa", "layout", "locacao", "mapa")
MAX_CANDIDATES = 8
MAX_WIDTH = 1600
QUALITY = 72

OUT_DIR = Path(__file__).resolve().parent.parent / "frontend" / "public" / "loading"


def call_function(name: str, body: dict):
    req = urllib.request.Request(
        f"{SUPABASE_URL}/functions/v1/{name}",
        data=json.dumps(body).encode(),
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.load(res)


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def candidate_urls(project: dict) -> list[str]:
    try:
        gallery = call_function("szi-gallery", {"action": "list", "project_id": project["id"]}) or []
    except Exception as exc:  # galeria indisponível -> cai para a capa
        print(f"  ! galeria de {project['name']}: {exc}")
        gallery = []
    urls = [
        item["image_url"]
        for category in PREFERRED_CATEGORIES
        for item in gallery
        if item.get("category") == category
        and item.get("image_url")
        and not any(part in item["image_url"].lower() for part in SKIP_URL_PARTS)
    ]
    if project.get("cover_image"):
        urls.append(project["cover_image"])
    return urls


def looks_like_photo(img: Image.Image) -> bool:
    """Descarta plantas baixas e retratos: exige paisagem e pouco branco/preto chapado."""
    if img.width / img.height < 1.25:
        return False
    small = img.resize((160, round(160 * img.height / img.width)))
    raw = small.tobytes()
    pixels = list(zip(raw[0::3], raw[1::3], raw[2::3]))
    white = sum(1 for r, g, b in pixels if r > 235 and g > 235 and b > 235) / len(pixels)
    black = sum(1 for r, g, b in pixels if r < 20 and g < 20 and b < 20) / len(pixels)
    return white < 0.2 and black < 0.25


def download(url: str) -> Image.Image | None:
    try:
        with urllib.request.urlopen(url, timeout=120) as res:
            return Image.open(io.BytesIO(res.read())).convert("RGB")
    except Exception as exc:
        print(f"  ! {url}: {exc}")
        return None


def process(project: dict) -> dict | None:
    urls = candidate_urls(project)
    # A capa (último item) pode ter dezenas de MB; só é baixada se nada da galeria servir.
    img = next(
        (im for im in map(download, urls[:MAX_CANDIDATES]) if im and looks_like_photo(im)),
        None,
    )
    if img is None and urls and urls[-1] not in urls[:MAX_CANDIDATES]:
        cover = download(urls[-1])
        img = cover if cover and looks_like_photo(cover) else None
    if img is None:
        print(f"  - {project['name']}: nenhuma foto adequada")
        return None
    slug = slugify(project["name"])
    if img.width > MAX_WIDTH:
        img = img.resize((MAX_WIDTH, round(img.height * MAX_WIDTH / img.width)), Image.LANCZOS)
    img.save(OUT_DIR / f"{slug}.webp", "WEBP", quality=QUALITY, method=6)
    print(f"  ok {project['name']}")
    return {
        "nome": project["name"],
        "cidade": project.get("city") or "",
        "bairro": project.get("neighborhood") or "",
        "imagem": f"/loading/{slug}.webp",
    }


def main():
    if not ANON_KEY:
        raise SystemExit("Defina a variável de ambiente PORTFOLIO360_ANON_KEY.")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*.webp"):
        old.unlink()
    projects = call_function("szi-projects", {})
    print(f"{len(projects)} empreendimentos encontrados")
    with ThreadPoolExecutor(max_workers=6) as pool:
        results = [r for r in pool.map(process, projects) if r]
    (OUT_DIR / "manifest.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(results)} imagens gravadas em {OUT_DIR}")


if __name__ == "__main__":
    main()
