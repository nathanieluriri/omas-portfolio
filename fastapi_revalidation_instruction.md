# FastAPI revalidation hookup (call Next.js on-demand revalidate)

These steps show how your FastAPI backend should call the Next.js webhook at `POST /api/revalidate` whenever portfolio content changes.

## 1) Add environment variables (FastAPI)
Set these on the backend server (same place you set API keys):

- `NEXT_PUBLIC_SITE_URL` or `NEXT_SITE_URL` (base URL of your Next app, e.g. `https://portfolio.example.com`)
- `REVALIDATE_SECRET` (must exactly match the Next.js `REVALIDATE_SECRET`)

Example (`.env` or deployment config):
```
NEXT_SITE_URL=https://portfolio.example.com
REVALIDATE_SECRET=super-long-random-string
```

## 2) Add a small revalidation client (FastAPI)
Create a helper to call the Next.js route with the header `x-revalidate-token`.

Example `app/utils/revalidate.py`:
```python
import os
import httpx

NEXT_SITE_URL = os.environ.get("NEXT_SITE_URL")
REVALIDATE_SECRET = os.environ.get("REVALIDATE_SECRET")

async def trigger_portfolio_revalidate() -> bool:
    if not NEXT_SITE_URL or not REVALIDATE_SECRET:
        return False

    url = f"{NEXT_SITE_URL.rstrip('/')}/api/revalidate"
    headers = {"x-revalidate-token": REVALIDATE_SECRET}

    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.post(url, headers=headers)
        return response.status_code == 200
```

Dependencies:
```
httpx
```

## 3) Call revalidation after updates
After any write that changes public portfolio data, call the helper.

Example in a FastAPI route after saving updates:
```python
from fastapi import APIRouter, HTTPException
from app.utils.revalidate import trigger_portfolio_revalidate

router = APIRouter()

@router.patch("/v1/portfolios/")
async def update_portfolio(...):
    # 1) perform DB update
    # 2) commit transaction

    ok = await trigger_portfolio_revalidate()
    if not ok:
        # You can log instead of raising; depends on desired behavior
        # Raising will make the API call fail if revalidation fails
        raise HTTPException(status_code=502, detail="Failed to revalidate")

    return {"status": "ok"}
```

## 4) Security checklist
- Use a long random `REVALIDATE_SECRET` (32+ chars).
- Only send the secret in the `x-revalidate-token` header.
- Do not expose the secret to the client or logs.

## 5) Quick manual test
From your backend host:
```
curl -X POST "https://portfolio.example.com/api/revalidate" \
  -H "x-revalidate-token: super-long-random-string"
```
Expected response:
```
{"revalidated":true,"now":<timestamp>}
```

## 6) Optional: make it non-blocking
If you don’t want portfolio writes to fail when Next.js is temporarily down, just log the error instead of raising:

```python
ok = await trigger_portfolio_revalidate()
if not ok:
    logger.warning("Next.js revalidation failed")
```
