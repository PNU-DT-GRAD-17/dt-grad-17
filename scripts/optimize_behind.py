"""Generate display/thumbnail WebP files without modifying source photos.

Requires: python3 -m pip install -r scripts/requirements-images.txt
Run: python3 scripts/optimize_behind.py
"""

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
PHOTO_ROOT = PUBLIC / "images" / "behind"
MANIFEST = ROOT / "src" / "data" / "behind.json"


def save_webp(image, destination, max_edge, quality):
    resized = image.copy()
    resized.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".tmp")
    resized.save(
        temporary,
        format="WEBP",
        quality=quality,
        method=6,
        icc_profile=image.info.get("icc_profile", b""),
    )
    temporary.replace(destination)
    return resized.size


def main():
    cuts = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sources = []
    output_sources = {}

    # Validate every source before writing outputs or changing the manifest.
    for cut in cuts:
        source_url = cut.get("originalSrc", cut["src"])
        if not source_url.startswith("/images/behind/"):
            raise ValueError(f"비하인드 폴더 안의 이미지 경로가 필요합니다: {source_url}")
        source = (PUBLIC / source_url.lstrip("/")).resolve()
        if not source.is_relative_to(PHOTO_ROOT.resolve()) or not source.is_file():
            raise ValueError(f"원본 이미지를 찾을 수 없습니다: {source_url}")
        if source.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            raise ValueError(f"지원하지 않는 이미지 형식입니다: {source_url}")
        filename = source.stem + ".webp"
        display = PHOTO_ROOT / "optimized" / filename
        thumbnail = PHOTO_ROOT / "thumbnails" / filename
        if source in {display.resolve(), thumbnail.resolve()}:
            raise ValueError(f"originalSrc에는 변환본이 아닌 원본 경로를 적어 주세요: {source_url}")
        if filename in output_sources and output_sources[filename] != source:
            raise ValueError(f"서로 다른 원본의 파일명이 겹칩니다: {source.stem}")
        output_sources[filename] = source
        sources.append((cut, source_url, source, display, thumbnail))

    original_bytes = display_bytes = thumbnail_bytes = 0
    for cut, source_url, source, display, thumbnail in sources:
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original)
            image = image.convert("RGBA" if "A" in image.getbands() or "transparency" in image.info else "RGB")
            width, height = save_webp(image, display, max_edge=1600, quality=86)
            save_webp(image, thumbnail, max_edge=320, quality=78)
        cut.update(
            originalSrc=source_url,
            src="/" + display.relative_to(PUBLIC).as_posix(),
            thumbnail="/" + thumbnail.relative_to(PUBLIC).as_posix(),
            width=width,
            height=height,
        )
        original_bytes += source.stat().st_size
        display_bytes += display.stat().st_size
        thumbnail_bytes += thumbnail.stat().st_size

    temporary_manifest = MANIFEST.with_suffix(".tmp")
    temporary_manifest.write_text(json.dumps(cuts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary_manifest.replace(MANIFEST)
    print(json.dumps({
        "photos": len(cuts),
        "original_bytes": original_bytes,
        "display_bytes": display_bytes,
        "thumbnail_bytes": thumbnail_bytes,
    }, indent=2))


if __name__ == "__main__":
    main()
