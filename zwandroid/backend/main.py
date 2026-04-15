from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ir, signals, subghz

app = FastAPI(title="ZwanDroid API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


app.include_router(ir.router, prefix="/ir", tags=["IR"])
app.include_router(signals.router, prefix="/signals", tags=["Signals"])
app.include_router(subghz.router, prefix="/subghz", tags=["SubGHz"])

