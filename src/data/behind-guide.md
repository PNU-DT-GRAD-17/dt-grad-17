# 비하인드 사진 등록

1. 원본 이미지 파일을 `public/images/behind/`에 넣습니다. 예: `011.png`.
2. `src/data/behind.json`에 새 항목을 추가합니다. 처음에는 `src`에 원본 경로를 적으면 됩니다.
3. 아래 변환 명령을 실행하면 화면용 WebP, 썸네일, JSON의 이미지 경로와 크기가 자동으로 생성됩니다.
4. 배열에 적힌 순서대로 사진이 표시됩니다. 제목이나 날짜가 없으면 빈 문자열(`""`)로 둡니다.

```json
[
  {
    "src": "/images/behind/011.png",
    "title": "졸업전시 준비",
    "date": "2026-10-28"
  },
  {
    "src": "/images/behind/012.png",
    "title": "",
    "date": ""
  }
]
```

## 이미지 최적화
a
Python 3.10 이상과 Pillow가 필요합니다. 최초 1회 설치한 뒤 변환 명령을 실행하세요.

```sh
python3 -m pip install -r scripts/requirements-images.txt
python3 scripts/optimize_behind.py
```

- 원본은 그대로 보존합니다. 기존 원본을 수정한 뒤 같은 명령으로 다시 변환할 수 있습니다.
- `optimized/`: 큰 사진용 WebP. 긴 변은 최대 1600px이며 작은 사진은 확대하지 않습니다.
- `thumbnails/`: 리스트용 WebP. 긴 변은 최대 320px입니다.
- 원본 비율과 투명도를 유지하고, 촬영 방향 정보를 반영합니다. WebP에는 용량을 줄이는 손실 압축을 적용합니다.
- JSON의 `originalSrc`는 원본 경로, `src`는 화면용 경로, `thumbnail`은 썸네일 경로입니다.
- `width`와 `height`도 자동으로 기록됩니다. 제목·날짜·배열 순서는 유지됩니다.
- 원본 파일명을 변경하면 `originalSrc`도 수정한 뒤 다시 실행하세요.
- 아직 변환하지 않은 항목은 `src`만 있어도 표시됩니다.
- 화면에서는 현재 묶음과 앞뒤 묶음만 미리 불러옵니다. 전체 210장을 한꺼번에 요청하지 않습니다.

## 입력 참고

- `src`에는 `public`을 빼고 `/images/behind/파일명.확장자`를 적습니다.
- 파일명과 확장자는 실제 이미지 파일과 정확히 일치해야 합니다.
- JSON에는 주석을 넣지 않으며, 마지막 항목 뒤에는 쉼표를 붙이지 않습니다.
- 이미지 파일만 추가하면 목록에 자동 등록되지는 않습니다. JSON에도 항목을 추가하세요.
- 비하인드 페이지의 사진은 JSON에 등록한 내용으로 표시됩니다. 영상 영역만 Coming Soon으로 가려집니다.
- 영상 공개 시 `src/pages/behind.tsx`의 `MAKING_FILM_URL`에 유튜브 주소를 입력하고 `SHOW_MAKING_FILM_COMING_SOON`을 `false`로 변경하세요. 주소가 비어 있으면 Coming Soon 표시를 유지합니다.
